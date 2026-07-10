# Деплой СТК-Актив на Timeweb VPS

Пошаговый ввод в эксплуатацию. Все команды — от имени пользователя с
правами sudo на VPS (в примерах — `deploy`), если не указано иное.

## 0. Допущения (явно, т.к. не были заданы изначально)

- ОС VPS — Ubuntu 22.04/24.04 (пакеты `nginx`, `certbot` из APT). Если
  дистрибутив другой — команды установки пакетов нужно адаптировать,
  остальное (конфиги Nginx, docker-compose, deploy.sh) не меняется.
- Директория проекта на сервере: `/opt/stk-aktiv` (так же задано в
  `.github/workflows/deploy.yml` и `deploy.sh`).
- Пользователь, от имени которого крутится Docker и деплоится приложение:
  `deploy`, состоит в группе `docker`.
- Ветка репозитория, из которой деплоится прод: `master` (это фактическая
  ветка по умолчанию в репозитории — см. «Обнаруженные несоответствия»
  в итоговом отчёте).

## 1. Первоначальная настройка VPS

```bash
# --- как root ---
apt update && apt upgrade -y
apt install -y ca-certificates curl gnupg git ufw

# Docker Engine + Compose plugin (официальный репозиторий Docker)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

systemctl enable --now docker

# Отдельный пользователь для деплоя (не root)
adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy

# Nginx + Certbot
apt install -y nginx certbot python3-certbot-nginx

# Firewall: только SSH, HTTP, HTTPS
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

mkdir -p /opt/stk-aktiv /var/www/certbot
chown -R deploy:deploy /opt/stk-aktiv
```

## 2. DNS-записи в REG.RU

Для домена `stkaktiv.ru`, IP VPS `104.171.132.144`:

| Тип | Имя (хост)                  | Значение          | TTL   |
|-----|------------------------------|--------------------|-------|
| A   | `@` (stkaktiv.ru)             | `104.171.132.144`  | 3600  |
| A   | `www`                          | `104.171.132.144`  | 3600  |
| A   | `admin`                        | `104.171.132.144`  | 3600  |

Если у регистратора уже есть A-запись `@` на другой IP/парковку — заменить,
а не добавлять вторую. Проверка распространения перед выпуском сертификатов:

```bash
dig +short stkaktiv.ru
dig +short www.stkaktiv.ru
dig +short admin.stkaktiv.ru
# все три должны вернуть 104.171.132.144 (может занять от минут до ~часа)
```

**Certbot запускать только после того, как все три A-записи резолвятся в
этот IP** — иначе HTTP-01 challenge не пройдёт.

## 3. SSH deploy key для приватного репозитория

На самой VPS, от имени `deploy`:

```bash
sudo -iu deploy
ssh-keygen -t ed25519 -C "deploy@stkaktiv-vps" -f ~/.ssh/id_ed25519_deploy -N ""
cat ~/.ssh/id_ed25519_deploy.pub
```

Скопировать вывод и добавить в GitHub:
`Repository → Settings → Deploy keys → Add deploy key` — **без** права
записи (read-only), т.к. VPS только читает репозиторий.

Настроить использование этого ключа именно для GitHub:

```bash
cat >> ~/.ssh/config << 'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_deploy
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config

# Проверка доступа
ssh -T git@github.com
```

Клонирование:

```bash
cd /opt
git clone git@github.com:<owner>/stk.git stk-aktiv
cd stk-aktiv
cp .env.example .env.production
# заполнить .env.production реальными значениями (см. итоговый отчёт —
# список обязательных переменных)
chmod 600 .env.production
```

## 4. Nginx + Certbot: bootstrap-последовательность

Сертификаты ещё не существуют — итоговые конфиги в `deploy/nginx/`
ссылаются на `/etc/letsencrypt/live/.../fullchain.pem`, которых пока нет,
поэтому `nginx -t` на них упадёт. Сначала поднимаем **только** HTTP (порт
80) для прохождения ACME-проверки, потом донакатываем HTTPS.

```bash
# 4.1 — общие директивы
sudo cp deploy/nginx/conf.d/*.conf /etc/nginx/conf.d/

# 4.2 — временный bootstrap-конфиг: только порт 80 (ACME challenge +
# редирект), без ssl-блоков — nginx -t не будет ссылаться на ещё
# не выпущенные сертификаты.
sudo cp deploy/nginx/bootstrap/*.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/stkaktiv.ru.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/admin.stkaktiv.ru.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 4.3 — выпуск сертификатов через webroot (ACME challenge отдаёт сам Nginx)
sudo certbot certonly --webroot -w /var/www/certbot \
  -d stkaktiv.ru -d www.stkaktiv.ru \
  --deploy-hook "systemctl reload nginx"

sudo certbot certonly --webroot -w /var/www/certbot \
  -d admin.stkaktiv.ru \
  --deploy-hook "systemctl reload nginx"

# 4.4 — заменяем bootstrap-конфиги на ФИНАЛЬНЫЕ (уже с HTTPS-блоками,
# сертификаты для них теперь существуют)
sudo cp deploy/nginx/sites-available/*.conf /etc/nginx/sites-available/
sudo nginx -t && sudo systemctl reload nginx
```

Автопродление уже включено пакетом `certbot` (`systemctl status certbot.timer`)
и перечитывает Nginx после продления благодаря `--deploy-hook` выше —
дополнительно ничего настраивать не нужно. Проверка вручную:

```bash
sudo certbot renew --dry-run
```

## 5. Первый деплой приложения

```bash
cd /opt/stk-aktiv
chmod +x deploy.sh
./deploy.sh
```

Что произойдёт: поднимется MongoDB → дождётся healthy → (при первом
запуске) засеет volume `media-uploads` файлами из `./media` репозитория →
создаст/обновит индексы MongoDB → соберёт и запустит контейнер приложения →
дождётся `/api/health` → закоммитит текущий коммит как «последний успешный»
для последующих откатов.

## 6. Обычный деплой / откат

```bash
# Обычный передеплой (например, вручную, вне CI):
cd /opt/stk-aktiv && ./deploy.sh

# Принудительный передеплой того же коммита (пересборка без новых изменений):
FORCE=1 ./deploy.sh

# Откат: выполняется АВТОМАТИЧЕСКИ при любой ошибке деплоя (см. trap ERR
# в deploy.sh). Ручной откат к последнему известному успешному коммиту:
cd /opt/stk-aktiv
git reset --hard "$(cat .last_successful_commit)"
docker compose --env-file .env.production -p stk-aktiv -f docker-compose.prod.yml build app
docker compose --env-file .env.production -p stk-aktiv -f docker-compose.prod.yml up -d app --remove-orphans
```

CI/CD (`.github/workflows/deploy.yml`) вызывает ровно `./deploy.sh` по SSH
при пуше в `master` — секреты `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`
(отдельный, для GitHub Actions → сервер; не путать с deploy key из шага 3,
который в обратную сторону — сервер → GitHub) настраиваются в
`Repository → Settings → Environments → production`.
