#!/usr/bin/env bash
###############################################################################
# ЛАБОСФЕРА: Развертывание на виртуальном (shared) хостинге REG.RU
# Использование: скачать и выполнить на аккаунте shared хостинга.
# Идемпотентно: повторный запуск обновит код и не тронет существующую БД/суперпольз.
###############################################################################
set -Eeuo pipefail
IFS=$'\n\t'

log() { echo -e "\033[1;34m[INFO]\033[0m $*"; }
ok()  { echo -e "\033[1;32m[DONE]\033[0m $*"; }
warn(){ echo -e "\033[1;33m[WARN]\033[0m $*"; }
err() { echo -e "\033[1;31m[ERR ]\033[0m $*" >&2; }
trap 'err "Ошибка на строке $LINENO"' ERR

START_TS=$(date +%s)
REPO_URL="https://github.com/Semen1987nsk/Labosfera.git"
ROOT_DIR="$HOME/labosfera"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"
RUN_LOG="$LOG_DIR/deploy-$(date +%Y%m%d_%H%M%S).log"

exec > >(tee -a "$RUN_LOG") 2>&1

log "🚀 Старт деплоя ЛАБОСФЕРА (shared)"

command -v git >/dev/null || { err "git не найден"; exit 1; }
command -v python3 >/dev/null || { err "python3 не найден"; exit 1; }
PY_VER=$(python3 -c 'import sys;print(f"{sys.version_info.major}.{sys.version_info.minor}")') || PY_VER="?"
log "Python: ${PY_VER}"

if command -v node >/dev/null; then
  log "Node.js: $(node -v)"
else
  warn "Node.js недоступен – фронтенд будет статическим fallback"
fi

mkdir -p "$ROOT_DIR" && cd "$ROOT_DIR"
if [ ! -d .git ]; then
  log "Клонируем репозиторий..."
  git clone "$REPO_URL" temp_clone
  shopt -s dotglob
  mv temp_clone/* .
  rm -rf temp_clone
  ok "Репозиторий получен"
else
  log "Обновляем репозиторий..."
  git fetch --all --prune
  git reset --hard origin/main
  ok "Код обновлён"
fi

log "Настройка backend..."
cd "$BACKEND_DIR"
if [ ! -d venv ]; then
  python3 -m venv venv
  ok "Создано виртуальное окружение"
fi
source venv/bin/activate
python -m pip install --upgrade pip wheel setuptools >/dev/null

if ! pip install -r requirements.txt --no-input; then
  warn "requirements.txt не встал — пробуем requirements_hosting.txt / минимальный набор"
  if [ -f requirements_hosting.txt ]; then
    pip install -r requirements_hosting.txt || true
  else
    pip install "django>=3.2,<3.3" djangorestframework django-cors-headers Pillow python-dotenv || true
  fi
fi
ok "Зависимости backend готовы"

if [ ! -f .env ]; then
  RAND_KEY=$(python - <<'PY'
import secrets,string
alphabet=string.ascii_letters+string.digits+string.punctuation.replace('"','').replace("'",'')
print(''.join(secrets.choice(alphabet) for _ in range(48)))
PY
)
  cat > .env <<EOF
DEBUG=False
SECRET_KEY=${RAND_KEY}
ALLOWED_HOSTS=labosfera.ru,www.labosfera.ru,*.reg.ru
EMAIL_HOST=smtp.reg.ru
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=noreply@labosfera.ru
EOF
  ok ".env создан (обновите EMAIL данные)"
else
  log ".env найден — оставляем"
fi

SETTINGS="labosfera_project.settings_hosting"
python - <<'PY' || SETTINGS="labosfera_project.settings_hosting_compat"
import sys
assert not (sys.version_info.major==3 and sys.version_info.minor<9)
PY
export DJANGO_SETTINGS_MODULE=$SETTINGS
log "Django settings: $DJANGO_SETTINGS_MODULE"

python manage.py migrate
python manage.py shell <<'PY'
from django.contrib.auth import get_user_model
User=get_user_model()
if not User.objects.filter(username='admin').exists():
    import secrets,string
    pwd=''.join(secrets.choice(string.ascii_letters+string.digits) for _ in range(14))
    User.objects.create_superuser('admin','admin@labosfera.ru',pwd)
    print('Создан суперпользователь admin /', pwd)
else:
    print('Суперпользователь admin уже существует')
PY

python manage.py collectstatic --noinput || warn "collectstatic с предупреждениями"

if [ ! -f passenger_wsgi.py ]; then
  cat > passenger_wsgi.py <<'PW'
import os, sys, pathlib
BASE_DIR = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", os.getenv("DJANGO_SETTINGS_MODULE","labosfera_project.settings_hosting"))
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
PW
  ok "Создан passenger_wsgi.py"
fi

log "Настройка frontend..."
cd "$FRONTEND_DIR" 2>/dev/null || { warn "Каталог frontend отсутствует"; FRONT_SKIP=1; }
if [ -z "${FRONT_SKIP:-}" ]; then
  if command -v node >/dev/null && command -v npm >/dev/null; then
    [ -d node_modules ] || npm install --no-audit --no-fund || warn "npm install ошибки"
    if npm run build 2>/dev/null; then
      if npx next export 2>/dev/null; then ok "Next.js экспортирован"; else warn "next export не удался"; fi
    else
      warn "Сборка Next.js не удалась — fallback"
      mkdir -p out
      echo '<!doctype html><title>ЛАБОСФЕРА</title><h1>Fallback frontend</h1>' > out/index.html
    fi
  else
    mkdir -p out
    echo '<!doctype html><title>ЛАБОСФЕРА</title><h1>Статический упрощённый интерфейс</h1>' > out/index.html
    ok "Создан статический fallback frontend"
  fi
fi

cd "$ROOT_DIR"
if [ ! -f .htaccess ]; then
  cat > .htaccess <<'HTA'
Options +FollowSymLinks
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

RewriteRule ^static/(.*)$ backend/staticfiles/$1 [L]
RewriteRule ^media/(.*)$ backend/media/$1 [L]

RewriteRule ^admin.* backend/passenger_wsgi.py [QSA,L]
RewriteRule ^api.* backend/passenger_wsgi.py [QSA,L]

RewriteRule ^_next/(.*)$ frontend/out/_next/$1 [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ frontend/out/index.html [L]
HTA
  ok ".htaccess создан"
else
  log ".htaccess уже есть"
fi

git rev-parse HEAD > VERSION 2>/dev/null || echo unknown > VERSION

END_TS=$(date +%s)
DUR=$((END_TS-START_TS))
ok "Деплой завершён за ${DUR}s"
echo "Логи: $RUN_LOG"
echo "Каталог: $ROOT_DIR"
echo "Если сайт не отображается: проверьте правильность корневой папки в панели, логи Apache/Passenger."
echo "Готово."
