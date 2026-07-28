#!/usr/bin/env bash
#
# deploy.sh — production deploy for stk-aktiv (Next.js + Payload CMS + MongoDB, Docker Compose)
#
# Использование:
#   ./deploy.sh              то же, что "deploy"
#   ./deploy.sh deploy       запустить деплой (демонизируется — переживает обрыв SSH)
#   ./deploy.sh status       посмотреть, идёт ли сейчас деплой и кем запущен
#   ./deploy.sh logs         подключиться (tail -F) к логу текущего/последнего деплоя
#   ./deploy.sh help         справка
#
# ВАЖНО ПРО БЕЗОПАСНОСТЬ БД: этот скрипт никогда не вызывает
# `docker volume rm/prune`, `docker compose down -v` или `docker system prune`.
# Тома mongo-data и media-uploads не удаляются ни при каких условиях.
# Дополнительно: перед КАЖДЫМ деплоем, до git reset и до пересборки,
# снимается mongodump-бэкап в $BACKUP_DIR (отдельно от mongo-data) —
# откат кода/образа не откатывает данные, а бэкап — откатывает.
#
set -Eeuo pipefail

### ── CONFIG ──────────────────────────────────────────────────────────────
PROJECT_DIR="/opt/stk-aktiv"
BRANCH="master"
COMPOSE_FILE="docker-compose.prod.yml"
COMPOSE_PROJECT="stk-aktiv"
# Имя, которое Docker Compose v2 присваивает собранному образу сервиса
# "app" при отсутствии явного `image:` в docker-compose.prod.yml:
# "<project>-<service>". Используется для версионных тегов и отката.
APP_IMAGE="${COMPOSE_PROJECT}-app"
ENV_FILE=".env.production"
HEALTH_URL="http://127.0.0.1:3000/api/health"

MAX_WAIT="${MAX_WAIT:-180}"                 # секунд ожидания healthcheck/health-эндпоинта
SLEEP=3
BUILD_TIMEOUT="${BUILD_TIMEOUT:-30m}"       # формат timeout(1): 30m, 1800, 2h ...
DISK_WARN_PCT="${DISK_WARN_PCT:-85}"
DISK_FAIL_PCT="${DISK_FAIL_PCT:-90}"
KEEP_IMAGE_VERSIONS="${KEEP_IMAGE_VERSIONS:-5}"   # сколько версионных тегов app хранить
KEEP_LOG_DAYS="${KEEP_LOG_DAYS:-14}"              # сколько дней хранить лог-файлы деплоя
KEEP_BACKUPS="${KEEP_BACKUPS:-14}"                # сколько дней хранить дампы MongoDB

LOG_DIR="$PROJECT_DIR/logs"
STATE_DIR="$PROJECT_DIR/.deploy-state"
STATE_FILE="$STATE_DIR/last_successful_commit"
MEDIA_SEED_MARKER="$STATE_DIR/media_volume_seeded"
EXIT_CODE_FILE="$STATE_DIR/last_exit_code"
# Отдельно от mongo-data: бэкап должен пережить проблему с самим volume,
# а не жить с ним на одном "диске данных". По-хорошему BACKUP_DIR стоит
# ещё и синхронизировать за пределы VPS (rclone/rsync) отдельным cron —
# это не входит в объём deploy.sh, см. ASSUMPTIONS в конце файла.
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"

# /run/lock (=/var/lock) обычно 1777, живёт только до перезагрузки — ровно
# то, что нужно lock/pid-файлам деплоя. Если недоступен — откатываемся на /tmp.
if mkdir -p /run/lock 2>/dev/null && [[ -w /run/lock ]]; then
    LOCK_DIR="/run/lock"
else
    LOCK_DIR="/tmp"
fi
LOCK_FILE="$LOCK_DIR/stk-aktiv-deploy.lock"
PID_FILE="$LOCK_DIR/stk-aktiv-deploy.pid"

mkdir -p "$LOG_DIR" "$STATE_DIR" "$BACKUP_DIR"

### ── LOGGING ─────────────────────────────────────────────────────────────
# LOG_FILE выставляется дальше по коду (timestamped-файл). До этого log()
# просто печатает в stdout текущего процесса.
log()  { echo "[$(date '+%F %T')] $*"; }

# Устанавливается в 1 сразу после `git reset --hard "$NEW_COMMIT"` — то есть
# в момент, когда локальное состояние (код) уже разошлось с последним
# известно-рабочим коммитом. До этого момента откатывать нечего.
DEPLOY_MUTATED=0

fail() {
    log "❌ ERROR: $*"
    if [[ "$DEPLOY_MUTATED" -eq 1 ]]; then
        rollback || log "⚠️  Откат тоже не удался — требуется ручное вмешательство"
    fi
    echo 1 > "$EXIT_CODE_FILE" 2>/dev/null || true
    exit 1
}

new_log_file() { echo "$LOG_DIR/deploy-$(date '+%Y%m%d-%H%M%S').log"; }

# Bash defers trap execution until the currently running FOREGROUND command
# returns — a SIGTERM arriving mid `docker compose build` would otherwise sit
# unhandled for the length of the whole build. Running the step in the
# background and blocking on `wait` instead makes the wait itself
# interruptible: the trap fires immediately, and on_signal() below kills
# CURRENT_BG_PID so the underlying docker process doesn't linger as an orphan.
CURRENT_BG_PID=""
run_step() {
    "$@" &
    CURRENT_BG_PID=$!
    wait "$CURRENT_BG_PID"
    local rc=$?
    CURRENT_BG_PID=""
    return "$rc"
}

rotate_logs() {
    find "$LOG_DIR" -maxdepth 1 -type f -name 'deploy-*.log' -mtime "+${KEEP_LOG_DAYS}" -delete 2>/dev/null || true
}

usage() {
    cat <<EOF
Использование: $0 [deploy|status|logs|help]

  deploy   Запустить деплой (по умолчанию). Скрипт демонизируется:
           обрыв SSH-сессии НЕ остановит деплой.
  status   Показать, идёт ли сейчас деплой, кем и с какого момента.
  logs     Подключиться (tail -F) к логу текущего/последнего деплоя.
  help     Это сообщение.

Переменные окружения (все опциональны):
  FORCE=1                 Передеплой, даже если коммит не изменился.
  BUILD_TIMEOUT=30m       Таймаут 'docker compose build' (формат timeout(1)).
  MAX_WAIT=180            Секунд ожидания healthcheck / /api/health.
  DISK_WARN_PCT=85        Порог предупреждения по диску.
  DISK_FAIL_PCT=90        Порог остановки деплоя по диску.
  KEEP_IMAGE_VERSIONS=5   Сколько версионных тегов образа app хранить.
  KEEP_LOG_DAYS=14        Сколько дней хранить лог-файлы деплоя.
  KEEP_BACKUPS=14         Сколько дней хранить дампы MongoDB (см. backups/).
  BACKUP_DIR=<project>/backups   Куда класть дампы (отдельно от mongo-data).
EOF
}

### ── COMPOSE HELPERS ─────────────────────────────────────────────────────
compose() {
    docker compose --env-file "$ENV_FILE" -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" "$@"
}

compose_supports_wait() {
    # --wait появился в Docker Compose v2.17 (март 2023). Проверяем через
    # --help, чтобы не парсить semver вручную.
    docker compose up --help 2>/dev/null | grep -q -- '--wait'
}

ensure_git_safe_directory() {
    if ! git config --global --get-all safe.directory 2>/dev/null | grep -qx "$PROJECT_DIR"; then
        git config --global --add safe.directory "$PROJECT_DIR"
    fi
}

### ── HEALTH / READINESS ──────────────────────────────────────────────────
wait_for_ready() {
    local start elapsed
    start=$(date +%s)
    log "Ожидание готовности приложения: $HEALTH_URL"
    while true; do
        if curl -sf "$HEALTH_URL" >/dev/null 2>&1; then
            log "✅ Приложение отвечает"
            return 0
        fi
        elapsed=$(( $(date +%s) - start ))
        [[ "$elapsed" -ge "$MAX_WAIT" ]] && { log "⏱ Таймаут ожидания (${elapsed}s)"; return 1; }
        sleep "$SLEEP"
    done
}

wait_for_mongo() {
    local start elapsed
    start=$(date +%s)
    log "Ожидание готовности MongoDB..."
    while true; do
        if compose exec -T mongo mongosh --quiet --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
            log "✅ MongoDB готова"
            return 0
        fi
        elapsed=$(( $(date +%s) - start ))
        [[ "$elapsed" -ge 60 ]] && { log "⏱ MongoDB не поднялась за 60s"; return 1; }
        sleep 2
    done
}

### ── DIAGNOSTICS / DISK GUARD ────────────────────────────────────────────
print_diagnostics() {
    log "── Диагностика перед сборкой ──────────────────────────"
    log "Git commit: $(git rev-parse HEAD 2>/dev/null || echo unknown)"
    log "Память:"
    free -h 2>/dev/null | while IFS= read -r l; do log "  $l"; done
    log "Диск ($PROJECT_DIR):"
    df -h "$PROJECT_DIR" 2>/dev/null | while IFS= read -r l; do log "  $l"; done
    log "Docker system df:"
    docker system df 2>/dev/null | while IFS= read -r l; do log "  $l"; done
    log "Docker buildx:"
    docker buildx ls 2>/dev/null | while IFS= read -r l; do log "  $l"; done || log "  (buildx недоступен)"
    log "────────────────────────────────────────────────────────"
}

check_disk_space() {
    local pct
    pct=$(df -P "$PROJECT_DIR" 2>/dev/null | awk 'NR==2 {gsub("%","",$5); print $5}')
    if [[ -z "$pct" ]]; then
        log "⚠️  Не удалось определить использование диска, пропускаю проверку"
        return 0
    fi
    log "Использование диска: ${pct}%"
    if (( pct >= DISK_FAIL_PCT )); then
        fail "Диск заполнен на ${pct}% (порог ${DISK_FAIL_PCT}%) — деплой остановлен ДО сборки"
    elif (( pct >= DISK_WARN_PCT )); then
        log "⚠️  Диск заполнен на ${pct}% (порог предупреждения ${DISK_WARN_PCT}%)"
    fi
}

### ── MEDIA VOLUME SEED (первичное сидирование, идемпотентно) ───────────────
seed_media_volume_if_needed() {
    if [[ -f "$MEDIA_SEED_MARKER" ]]; then
        return 0
    fi
    if [[ ! -d "$PROJECT_DIR/media" ]] || [[ -z "$(ls -A "$PROJECT_DIR/media" 2>/dev/null)" ]]; then
        log "В репозитории нет файлов в ./media — сидировать нечего"
        touch "$MEDIA_SEED_MARKER"
        return 0
    fi
    log "Первичное сидирование volume media-uploads из ./media репозитория..."
    docker run --rm \
        -v "${COMPOSE_PROJECT}_media-uploads:/dest" \
        -v "$PROJECT_DIR/media:/src:ro" \
        alpine sh -c 'cp -an /src/. /dest/ 2>/dev/null; chown -R 1001:1001 /dest' \
        || fail "Не удалось засеять volume media-uploads"
    touch "$MEDIA_SEED_MARKER"
    log "✅ Volume media-uploads засеян"
}

### ── MONGODB BACKUP (обязательный шаг ДО любых изменений) ──────────────────
# Откат кода/образа НЕ откатывает данные — плохой индекс, миграция схемы
# на уровне приложения или баг в новом коде может испортить данные без
# единого volume-разрушающего вызова. Поэтому перед git reset снимается
# логический дамп (mongodump) работающей на данный момент базы. Каталог
# бэкапов физически отделён от volume mongo-data: авария/porча самого
# volume не должна унести с собой и его резервную копию.
do_backup_dump() {
    compose exec -T mongo mongodump --archive --gzip
}

rotate_backups() {
    find "$BACKUP_DIR" -maxdepth 1 -type f -name 'pre-deploy-*.archive.gz' -mtime "+${KEEP_BACKUPS}" -delete 2>/dev/null || true
}

pre_deploy_backup() {
    local dest="$BACKUP_DIR/pre-deploy-$(date '+%Y%m%d-%H%M%S').archive.gz"
    log "💾 Резервная копия MongoDB перед деплоем: $dest"

    do_backup_dump > "$dest" &
    CURRENT_BG_PID=$!
    wait "$CURRENT_BG_PID"
    local rc=$?
    CURRENT_BG_PID=""

    if [[ "$rc" -ne 0 ]]; then
        rm -f "$dest" 2>/dev/null || true
        fail "Backup MongoDB не удался (код $rc) — деплой остановлен ДО каких-либо изменений"
    fi

    local size
    size=$(stat -c%s "$dest" 2>/dev/null || echo 0)
    # Пустой/битый архив gzip всё равно весит какие-то байты заголовков —
    # порог просто отсекает откровенно пустой/оборванный дамп.
    if [[ "$size" -lt 1024 ]]; then
        rm -f "$dest" 2>/dev/null || true
        fail "Backup подозрительно мал (${size} байт), похоже на повреждённый дамп — деплой остановлен"
    fi

    log "✅ Backup создан (${size} байт): $dest"
    rotate_backups
}

### ── IMAGE TAGGING (версии для быстрого/безопасного отката) ────────────────
tag_app_image() {
    local commit="$1"
    if docker image inspect "${APP_IMAGE}:latest" >/dev/null 2>&1; then
        if docker tag "${APP_IMAGE}:latest" "${APP_IMAGE}:${commit}"; then
            log "🏷  Образ помечен как ${APP_IMAGE}:${commit}"
        else
            log "⚠️  Не удалось пометить образ тегом ${commit} (не критично)"
        fi
    else
        log "⚠️  Образ ${APP_IMAGE}:latest не найден — версионный тег не проставлен"
    fi
}

# Удаляет ТОЛЬКО старые версионные ТЕГИ образа app (docker rmi), сверх
# KEEP_IMAGE_VERSIONS штук. Не трогает volumes. Если тег используется
# запущенным контейнером, docker rmi просто завершится ошибкой — она
# игнорируется, реального удаления не произойдёт.
prune_old_app_images() {
    local tags
    tags=$(docker images "${APP_IMAGE}" --format '{{.Tag}}|{{.CreatedAt}}' 2>/dev/null \
        | grep -v '^latest|' | grep -v '^<none>|' | sort -t'|' -k2 -r || true)
    [[ -z "$tags" ]] && return 0
    local i=0 tag rest
    while IFS='|' read -r tag rest; do
        i=$((i + 1))
        if (( i > KEEP_IMAGE_VERSIONS )); then
            if docker rmi "${APP_IMAGE}:${tag}" >/dev/null 2>&1; then
                log "🧹 Удалён устаревший тег образа ${APP_IMAGE}:${tag}"
            fi
        fi
    done <<< "$tags"
}

rollback_image_available() {
    docker image inspect "${APP_IMAGE}:${1}" >/dev/null 2>&1
}

### ── ROLLBACK ────────────────────────────────────────────────────────────
rollback() {
    # A signal arriving mid-rollback (e.g. between the retag and `compose up`)
    # must not abort recovery halfway — that would leave the deployment in a
    # worse state than either the old or new version alone. Signals are
    # suppressed for the duration and the normal handlers restored at the
    # single exit point below, whichever branch got us there.
    trap '' TERM INT HUP
    local rc=0
    local prev=""

    log "🔙 Запуск автоматического отката..."
    if [[ ! -f "$STATE_FILE" ]]; then
        log "⚠️  Нет сохранённого предыдущего успешного коммита — откат невозможен."
        rc=1
    else
        prev=$(cat "$STATE_FILE")
        log "Откатываемся на коммит: $prev"
        if ! git reset --hard "$prev"; then
            log "❌ Откат: git reset не удался"
            rc=1
        fi
    fi

    if [[ "$rc" -eq 0 ]]; then
        if rollback_image_available "$prev"; then
            log "Найден образ ${APP_IMAGE}:${prev} — откатываю БЕЗ пересборки (код и образ гарантированно согласованы)"
            docker tag "${APP_IMAGE}:${prev}" "${APP_IMAGE}:latest" \
                || { log "❌ Откат: не удалось перетегировать образ"; rc=1; }
        else
            log "⚠️  Образ ${APP_IMAGE}:${prev} не найден локально (вычищен?) — пересобираю из исходников"
            run_step timeout --kill-after=30s "$BUILD_TIMEOUT" \
                docker compose --env-file "$ENV_FILE" -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" build app \
                || { log "❌ Откат: сборка не удалась"; rc=1; }
        fi
    fi

    if [[ "$rc" -eq 0 ]]; then
        if compose_supports_wait; then
            run_step compose up -d --wait --wait-timeout "$MAX_WAIT" app --remove-orphans \
                || { log "❌ Откат: запуск/healthcheck не удался"; rc=1; }
        else
            compose up -d app --remove-orphans || { log "❌ Откат: запуск не удался"; rc=1; }
            [[ "$rc" -eq 0 ]] && { wait_for_ready || { log "❌ Откат: приложение не ответило"; rc=1; }; }
        fi
    fi

    if [[ "$rc" -eq 0 ]]; then
        if curl -sf "$HEALTH_URL" >/dev/null 2>&1; then
            log "✅ Откат выполнен успешно, приложение на коммите $prev"
        else
            log "❌ После отката /api/health всё ещё не отвечает — нужен ручной вход на сервер"
            rc=1
        fi
    fi

    trap 'on_signal SIGTERM 143' TERM
    trap 'on_signal SIGINT 130' INT
    trap 'on_signal SIGHUP 129' HUP
    return "$rc"
}

### ── SIGNAL HANDLING / CLEANUP (только внутри воркера-демона) ─────────────
CLEANUP_DONE=0
cleanup() {
    local code=$?
    (( CLEANUP_DONE )) && return
    CLEANUP_DONE=1
    log "🧹 Очистка (код завершения: $code)..."
    rm -f "$STATE_FILE.rollback_candidate" 2>/dev/null || true
    rm -f "$PID_FILE" 2>/dev/null || true
    flock -u 200 2>/dev/null || true
    exec 200>&- 2>/dev/null || true
    echo "$code" > "$EXIT_CODE_FILE" 2>/dev/null || true
    log "=== Деплой-процесс завершён (код $code) ==="
}

on_err() {
    local line="$1"
    log "❌ Деплой прерван на непредвиденной ошибке (строка $line)"
    if [[ "$DEPLOY_MUTATED" -eq 1 ]]; then
        rollback || log "⚠️  Откат тоже не удался — требуется ручное вмешательство"
    fi
    echo 1 > "$EXIT_CODE_FILE" 2>/dev/null || true
    exit 1
}

on_signal() {
    local sig="$1" code="$2"
    log "⚠️  Получен сигнал $sig — останавливаю деплой и подчищаю за собой (БЕЗ авто-отката)"
    if [[ -n "$CURRENT_BG_PID" ]]; then
        log "   Останавливаю текущую операцию (PID $CURRENT_BG_PID)..."
        kill -TERM "$CURRENT_BG_PID" 2>/dev/null || true
        wait "$CURRENT_BG_PID" 2>/dev/null || true
    fi
    echo "$code" > "$EXIT_CODE_FILE" 2>/dev/null || true
    exit "$code"
}

### ── LOCK / PID FILE ─────────────────────────────────────────────────────
acquire_lock_fd() {
    exec 200>"$LOCK_FILE"
    flock -n 200
}

write_pid_file() {
    cat > "$PID_FILE" <<EOF
PID=$$
USER=$(id -un)
HOST=$(hostname)
STARTED=$(date '+%F %T')
LOG=$LOG_FILE
EOF
}

pid_file_owner_alive() {
    [[ -f "$PID_FILE" ]] || return 1
    local pid
    pid=$(awk -F= '/^PID=/{print $2}' "$PID_FILE" 2>/dev/null)
    [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

### ── WORKER (реальная работа деплоя; выполняется в демонизированном child) ─
run_worker() {
    cd "$PROJECT_DIR" || { echo "❌ Директория проекта не найдена: $PROJECT_DIR"; exit 1; }

    if ! acquire_lock_fd; then
        log "❌ Другой процесс уже держит lock ($LOCK_FILE) — выхожу"
        echo 1 > "$EXIT_CODE_FILE" 2>/dev/null || true
        exit 1
    fi
    write_pid_file

    trap 'on_err $LINENO' ERR
    trap cleanup EXIT
    trap 'on_signal SIGTERM 143' TERM
    trap 'on_signal SIGINT 130' INT
    trap 'on_signal SIGHUP 129' HUP

    rotate_logs
    ensure_git_safe_directory

    log "=== 🚀 Деплой начат ==="

    command -v docker  >/dev/null || fail "docker не установлен"
    command -v git     >/dev/null || fail "git не установлен"
    command -v curl    >/dev/null || fail "curl не установлен"
    command -v timeout >/dev/null || fail "coreutils 'timeout' не установлен"
    [[ -f "$ENV_FILE" ]] || fail "$ENV_FILE отсутствует"

    CURRENT_COMMIT=$(git rev-parse HEAD)
    log "Текущий коммит: $CURRENT_COMMIT"

    log "Получение обновлений из origin/$BRANCH..."
    git fetch origin "$BRANCH"
    NEW_COMMIT=$(git rev-parse "origin/$BRANCH")

    if [[ "$CURRENT_COMMIT" == "$NEW_COMMIT" && "${FORCE:-0}" != "1" ]]; then
        log "Изменений нет. Деплой пропущен (FORCE=1 ./deploy.sh для принудительного передеплоя)."
        echo 0 > "$EXIT_CODE_FILE"
        exit 0
    fi

    log "Новый коммит: $NEW_COMMIT"

    # MongoDB поднимается и бэкапится ДО git reset — бэкап не зависит от
    # нового кода, и делать его нужно на состоянии "до", а не "после".
    log "Поднятие MongoDB..."
    run_step compose up -d mongo
    wait_for_mongo || fail "MongoDB недоступна — деплой остановлен ДО любых изменений"

    pre_deploy_backup

    echo "$CURRENT_COMMIT" > "$STATE_FILE.rollback_candidate"
    git reset --hard "$NEW_COMMIT"
    DEPLOY_MUTATED=1   # с этого момента код и последний известно-рабочий коммит разошлись

    seed_media_volume_if_needed

    log "Создание/обновление индексов MongoDB (scripts/create-search-indexes.ts)..."
    run_step compose --profile tools build indexer || fail "Не удалось собрать образ для индексатора"
    run_step compose --profile tools run --rm indexer \
        || fail "Создание индексов не удалось — деплой остановлен ДО сборки приложения"

    print_diagnostics
    check_disk_space

    log "Сборка образа приложения (таймаут: $BUILD_TIMEOUT)..."
    local build_rc=0
    # --kill-after гарантирует, что процесс docker compose CLI действительно
    # умрёт, если он не отреагирует на первый TERM от timeout(1) в разумный
    # срок — иначе таймаут "срабатывает", но процесс может повиснуть дальше.
    run_step timeout --kill-after=30s "$BUILD_TIMEOUT" \
        docker compose --env-file "$ENV_FILE" -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" build app || build_rc=$?
    if [[ "$build_rc" -ne 0 ]]; then
        # 124 = timeout(1) сработал по TERM; 137 = дошло до --kill-after (SIGKILL).
        if [[ "$build_rc" -eq 124 || "$build_rc" -eq 137 ]]; then
            log "⏱ Сборка прервана по таймауту — подчищаю возможный оборванный build-кэш..."
            docker builder prune -f --filter "until=1h" >/dev/null 2>&1 || true
            fail "Сборка превысила таймаут $BUILD_TIMEOUT — остановлена принудительно"
        else
            fail "Сборка Docker-образа приложения не удалась (код $build_rc)"
        fi
    fi

    tag_app_image "$NEW_COMMIT"

    log "Запуск обновлённого контейнера приложения..."
    if compose_supports_wait; then
        run_step compose up -d --wait --wait-timeout "$MAX_WAIT" app --remove-orphans \
            || fail "Контейнер не поднялся / healthcheck не прошёл за ${MAX_WAIT}s"
    else
        compose up -d app --remove-orphans || fail "docker compose up не удался"
        wait_for_ready || fail "Приложение не ответило за ${MAX_WAIT}s после деплоя"
    fi

    # Старое приложение считается заменённым только когда: контейнер запущен,
    # healthcheck зелёный (гарантировано через --wait/wait_for_ready) И
    # /api/health отвечает напрямую — финальная перепроверка.
    curl -sf "$HEALTH_URL" >/dev/null 2>&1 || fail "Контейнер и healthcheck OK, но /api/health не отвечает"

    log "✅ Деплой успешен"
    mv "$STATE_FILE.rollback_candidate" "$STATE_FILE" 2>/dev/null || true
    echo "$NEW_COMMIT" > "$STATE_FILE"

    log "Очистка неиспользуемых образов и build-кэша (безопасные фильтры, старше 48ч)..."
    docker image prune -f --filter "until=48h" >/dev/null 2>&1 || true
    docker builder prune -f --filter "until=48h" >/dev/null 2>&1 || true
    prune_old_app_images

    log "=== ✅ Деплой завершён успешно: $(date) ==="
    echo 0 > "$EXIT_CODE_FILE"
}

### ── STATUS / LOGS COMMANDS ──────────────────────────────────────────────
cmd_status() {
    if pid_file_owner_alive; then
        log "🟢 Деплой выполняется:"
        sed 's/^/   /' "$PID_FILE"
        local log_path
        log_path=$(awk -F= '/^LOG=/{print $2}' "$PID_FILE")
        echo "--- последние строки лога ---"
        tail -n 20 "$log_path" 2>/dev/null || true
    else
        log "⚪ Сейчас деплой не выполняется"
        if [[ -f "$PID_FILE" ]]; then
            log "⚠️  Обнаружен устаревший PID-файл ($PID_FILE) — будет удалён при следующем запуске"
        fi
        if [[ -f "$LOG_DIR/latest.log" ]]; then
            echo "--- последние строки лога последнего деплоя ---"
            tail -n 20 "$LOG_DIR/latest.log" 2>/dev/null || true
        fi
    fi
}

cmd_logs() {
    local target="$LOG_DIR/latest.log"
    if [[ ! -e "$target" ]]; then
        log "Логов пока нет"
        exit 0
    fi
    if pid_file_owner_alive; then
        log "Подключаюсь к живому логу (Ctrl+C просто отключит просмотр — деплой продолжится в фоне)..."
    fi
    tail -n 50 -F "$target"
}

### ── DAEMONIZING LAUNCHER ────────────────────────────────────────────────
# Запускается интерактивно/из CI. Порождает демонизированный child
# (setsid + nohup, без контролирующего терминала) и просто следит за ним:
# показывает лог живьём и в конце выходит с тем же кодом возврата.
# Если SSH-сессия обрывается — умирает только launcher; child, будучи в
# отдельной сессии (setsid), сигнал HUP от обрыва pty не получает и
# продолжает деплой. Оператор может переподключиться и выполнить
# "./deploy.sh status" или "./deploy.sh logs".
cmd_deploy() {
    # This pre-check is informational only, NOT the concurrency gate — a PID
    # can be reused by an unrelated process after an unclean death, which
    # would make a hard refuse-here false-positive and lock out real deploys
    # until someone manually clears the file. The actual, race-free gate is
    # the flock acquired inside run_worker(); if it really is busy, the child
    # we spawn below will fail fast with a clear message instead.
    if pid_file_owner_alive; then
        log "⚠️  Судя по PID-файлу, деплой уже может выполняться:"
        cmd_status
        log "   Не трогаю PID-файл активного процесса. Всё равно пробую запустить —"
        log "   реальную защиту от параллельного запуска обеспечивает flock, а не этот файл."
    else
        rm -f "$PID_FILE" 2>/dev/null || true
    fi

    LOG_FILE=$(new_log_file)
    : > "$LOG_FILE"
    ln -sfn "$LOG_FILE" "$LOG_DIR/latest.log"
    rm -f "$EXIT_CODE_FILE" 2>/dev/null || true

    log "🚀 Демонизирую деплой: лог -> $LOG_FILE"
    log "   SSH можно спокойно отключать — процесс переживёт разрыв соединения."
    log "   Переподключившись: $0 status   или   $0 logs"

    STK_LOG_FILE="$LOG_FILE" setsid nohup "$0" __daemon_child >>"$LOG_FILE" 2>&1 < /dev/null &
    local child_pid=$!
    disown "$child_pid" 2>/dev/null || true
    log "   PID фонового процесса: $child_pid"

    # Если launcher теряет управляющий терминал (обрыв SSH), просто
    # выходим без паники — child уже в отдельной сессии и не пострадает.
    trap 'log "⚠️  Локальная сессия прервана — деплой (PID '"$child_pid"') продолжает работать в фоне."; exit 0' TERM INT HUP

    ( tail -n +1 -F "$LOG_FILE" & echo $! > /tmp/.stk-tail-pid.$$ ) &
    sleep 0.2
    local tail_pid
    tail_pid=$(cat "/tmp/.stk-tail-pid.$$" 2>/dev/null || true)
    rm -f "/tmp/.stk-tail-pid.$$" 2>/dev/null || true

    while kill -0 "$child_pid" 2>/dev/null; do
        sleep 1
    done

    [[ -n "$tail_pid" ]] && kill "$tail_pid" 2>/dev/null || true
    wait "$tail_pid" 2>/dev/null || true

    local code=1
    [[ -f "$EXIT_CODE_FILE" ]] && code=$(cat "$EXIT_CODE_FILE" 2>/dev/null || echo 1)
    exit "${code:-1}"
}

### ── MAIN DISPATCH ───────────────────────────────────────────────────────
ACTION="${1:-deploy}"

case "$ACTION" in
    __daemon_child)
        LOG_FILE="${STK_LOG_FILE:-$(new_log_file)}"
        run_worker
        ;;
    deploy)
        cmd_deploy
        ;;
    status)
        cmd_status
        ;;
    logs|attach)
        cmd_logs
        ;;
    help|-h|--help)
        usage
        ;;
    *)
        usage
        exit 1
        ;;
esac