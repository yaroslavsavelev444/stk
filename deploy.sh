#!/usr/bin/env bash
set -Eeuo pipefail

### ── CONFIG ──────────────────────────────────────────────────────────────
# Предполагаемый путь на VPS (совпадает с .github/workflows/deploy.yml).
PROJECT_DIR="/opt/stk-aktiv"
BRANCH="master"
COMPOSE_FILE="docker-compose.prod.yml"
COMPOSE_PROJECT="stk-aktiv"
ENV_FILE=".env.production"
HEALTH_URL="http://127.0.0.1:3000/api/health"
MAX_WAIT=120
SLEEP=3
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/deploy.log"
LOCK_FILE="/tmp/stk-aktiv-deploy.lock"
STATE_FILE="$PROJECT_DIR/.last_successful_commit"
MEDIA_SEED_MARKER="$PROJECT_DIR/.media_volume_seeded"

mkdir -p "$LOG_DIR"
exec > >(tee -a "$LOG_FILE") 2>&1

log()  { echo "[$(date '+%F %T')] $*"; }
fail() { log "❌ ERROR: $*"; exit 1; }

exec 200>"$LOCK_FILE"
flock -n 200 || fail "Другой деплой уже выполняется (lock: $LOCK_FILE)"

cd "$PROJECT_DIR" || fail "Директория проекта не найдена: $PROJECT_DIR"

# --env-file передаётся явно в каждый вызов compose, иначе Compose не
# подставит ${...} внутрь самого YAML (build args, environment) — только
# внутрь контейнера через env_file:, а это разные механизмы.
compose() {
  docker compose --env-file "$ENV_FILE" -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" "$@"
}

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

# Именованный volume media-uploads создаётся Docker пустым при первом
# поднятии стека и НЕ наследует файлы, которые уже лежат в git-репозитории
# в ./media (том монтируется поверх, а не сливается с содержимым образа).
# Поэтому один раз — при самом первом деплое — копируем существующие файлы
# из репозитория в volume через один-строчный служебный контейнер.
# Идемпотентно: помечается файлом-маркером, повторно не выполняется.
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

rollback() {
    log "🔙 Запуск автоматического отката..."
    if [[ ! -f "$STATE_FILE" ]]; then
        log "⚠️  Нет сохранённого предыдущего успешного коммита — откат невозможен."
        exit 1
    fi
    local prev
    prev=$(cat "$STATE_FILE")
    log "Откатываемся на коммит: $prev"
    git reset --hard "$prev"

    compose build app || { log "❌ Откат: сборка не удалась"; exit 1; }
    compose up -d app --remove-orphans || { log "❌ Откат: запуск не удался"; exit 1; }

    if wait_for_ready; then
        log "✅ Откат выполнен успешно, приложение на коммите $prev"
    else
        log "❌ После отката приложение всё ещё не отвечает — нужен ручной вход на сервер"
    fi
    exit 1
}

trap 'log "❌ Деплой прерван на непредвиденной ошибке (строка $LINENO)"; rollback' ERR

log "=== 🚀 Деплой начат ==="

### PRE-CHECKS
command -v docker >/dev/null || fail "docker не установлен"
command -v git    >/dev/null || fail "git не установлен"
command -v curl   >/dev/null || fail "curl не установлен"
[[ -f "$ENV_FILE" ]] || fail "$ENV_FILE отсутствует"

CURRENT_COMMIT=$(git rev-parse HEAD)
log "Текущий коммит: $CURRENT_COMMIT"

log "Получение обновлений из origin/$BRANCH..."
git fetch origin "$BRANCH"
NEW_COMMIT=$(git rev-parse "origin/$BRANCH")

if [[ "$CURRENT_COMMIT" == "$NEW_COMMIT" && "${FORCE:-0}" != "1" ]]; then
    log "Изменений нет. Деплой пропущен (FORCE=1 ./deploy.sh для принудительного передеплоя)."
    exit 0
fi

log "Новый коммит: $NEW_COMMIT"
echo "$CURRENT_COMMIT" > "$STATE_FILE.rollback_candidate"
git reset --hard "$NEW_COMMIT"

log "Поднятие MongoDB..."
compose up -d mongo
wait_for_mongo || fail "MongoDB недоступна — деплой остановлен ДО любых индексов/сборки"

seed_media_volume_if_needed

# В проекте нет SQL-миграций (Mongoose/MongoDB — схема не версионируется).
# Единственный аналог — идемпотентное создание индексов коллекции products.
log "Создание/обновление индексов MongoDB (scripts/create-search-indexes.ts)..."
compose --profile tools build indexer || fail "Не удалось собрать образ для индексатора"
compose --profile tools run --rm indexer \
  || fail "Создание индексов не удалось — деплой остановлен ДО сборки приложения"

log "Сборка образа приложения..."
compose build app || fail "Сборка Docker-образа приложения не удалась"

log "Запуск обновлённого контейнера приложения..."
compose up -d app --remove-orphans || fail "docker compose up не удался"

if wait_for_ready; then
    log "✅ Деплой успешен"
    mv "$STATE_FILE.rollback_candidate" "$STATE_FILE" 2>/dev/null || true
    echo "$NEW_COMMIT" > "$STATE_FILE"
else
    fail "Приложение не ответило за ${MAX_WAIT}s после деплоя"
fi

log "Очистка неиспользуемых образов и слоёв сборки (старше 48ч)..."
docker image prune -f --filter "until=48h" >/dev/null || true

log "=== ✅ Деплой завершён успешно: $(date) ==="
exit 0
