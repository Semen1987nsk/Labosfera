#!/bin/bash
# Скрипт развертывания ЛАБОСФЕРА для виртуального хостинга (без sudo)

set -e

echo "🚀 Развертывание ЛАБОСФЕРА на виртуальном хостинге..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода ошибок
error() {
    echo -e "${RED}❌ Ошибка: $1${NC}"
    exit 1
}

# Функция для вывода успеха
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Функция для вывода предупреждений
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Проверка наличия необходимых команд
echo "🔍 Проверяем доступные команды..."

if ! command -v git &> /dev/null; then
    error "Git не найден. Обратитесь в поддержку хостинга для установки Git."
fi

if ! command -v node &> /dev/null; then
    warning "Node.js не найден. Попробуем установить через NVM..."
    # Установка NVM если возможно
    if [ ! -d "$HOME/.nvm" ]; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm install --lts
        nvm use --lts
    fi
fi

if ! command -v python3 &> /dev/null; then
    error "Python3 не найден. Обратитесь в поддержку хостинга."
fi

success "Основные команды проверены"

# Создание директории проекта
PROJECT_DIR="$HOME/labosfera"
echo "📁 Создаем директорию проекта: $PROJECT_DIR"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Клонирование репозитория
echo "📥 Клонируем репозиторий..."
if [ ! -d ".git" ]; then
    git clone https://github.com/Semen1987nsk/Labosfera.git .
    success "Репозиторий склонирован"
else
    git pull origin main
    success "Репозиторий обновлен"
fi

# Создание виртуального окружения Python
echo "🐍 Настраиваем Python окружение..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
    success "Виртуальное окружение создано"
fi

source venv/bin/activate
pip install --upgrade pip

# Сначала пробуем основной requirements.txt
echo "Пробуем установить зависимости..."
if pip install -r requirements.txt; then
    success "Основные зависимости установлены"
else
    warning "Основные зависимости не установились, пробуем совместимые версии..."
    if [ -f "requirements_hosting.txt" ]; then
        pip install -r requirements_hosting.txt
        success "Совместимые зависимости для хостинга установлены"
    else
        # Создаем минимальный набор зависимостей
        warning "Устанавливаем минимальный набор зависимостей..."
        pip install "django>=3.2,<3.3" "djangorestframework>=3.12,<3.15" "django-cors-headers>=3.10,<4.0" "Pillow>=8.0,<11.0" "requests>=2.25,<3.0" "python-dotenv>=0.19,<2.0"
        success "Минимальные зависимости установлены"
    fi
fi
success "Python зависимости установлены"

# Настройка переменных окружения для хостинга
echo "⚙️  Настраиваем окружение для хостинга..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Настройки для виртуального хостинга (совместимые)
DEBUG=False
SECRET_KEY=django-hosting-key-$(date +%s)-$(whoami)
ALLOWED_HOSTS=*.reg.ru,labosfera.ru,www.labosfera.ru

# База данных SQLite (универсальная)
DATABASE_URL=sqlite:///$(pwd)/db.sqlite3

# Статические файлы
STATIC_URL=/static/
STATIC_ROOT=$(pwd)/staticfiles/
MEDIA_URL=/media/
MEDIA_ROOT=$(pwd)/media/

# Email настройки для REG.RU
EMAIL_HOST=smtp.reg.ru
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=noreply@labosfera.ru
EMAIL_HOST_PASSWORD=your_email_password
DEFAULT_FROM_EMAIL=noreply@labosfera.ru

# Настройки Django
DJANGO_SETTINGS_MODULE=labosfera_project.settings_hosting_compat
EOF
    success "Файл .env создан с совместимыми настройками"
    warning "ВАЖНО: Отредактируйте .env файл с вашими настройками"
fi

# Применение миграций с совместимыми настройками
echo "🗄️  Применяем миграции..."
export DJANGO_SETTINGS_MODULE=labosfera_project.settings_hosting_compat
python manage.py migrate
success "Миграции применены"

# Создание суперпользователя
echo "👤 Создание администратора..."
export DJANGO_SETTINGS_MODULE=labosfera_project.settings_hosting_compat
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@labosfera.ru', 'admin123')
    print('✅ Суперпользователь создан: admin/admin123')
else:
    print('ℹ️  Суперпользователь уже существует')
EOF

# Сбор статических файлов
echo "📦 Собираем статические файлы..."
python manage.py collectstatic --noinput --settings=labosfera_project.settings_hosting_compat
success "Статические файлы собраны"

# Настройка frontend
echo "🎨 Настраиваем frontend..."
cd ../frontend

# Проверка/установка Node.js зависимостей
if [ ! -d "node_modules" ]; then
    if command -v npm &> /dev/null; then
        npm install
        success "Frontend зависимости установлены"
    else
        warning "npm не найден. Установите Node.js для сборки frontend"
    fi
fi

# Сборка production версии
if command -v npm &> /dev/null; then
    npm run build
    success "Frontend собран для production"
else
    warning "Пропускаем сборку frontend (npm недоступен)"
fi

# Создание файла .htaccess для Apache
cd "$PROJECT_DIR"
echo "🌐 Создаем конфигурацию для веб-сервера..."
cat > .htaccess << 'EOF'
RewriteEngine On

# Перенаправление на HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# API запросы на Django backend
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ backend/wsgi.py/$1 [L]

# Админка Django
RewriteCond %{REQUEST_URI} ^/admin/
RewriteRule ^(.*)$ backend/wsgi.py/$1 [L]

# Статические файлы Django
RewriteCond %{REQUEST_URI} ^/static/
RewriteRule ^static/(.*)$ backend/staticfiles/$1 [L]

# Медиафайлы Django
RewriteCond %{REQUEST_URI} ^/media/
RewriteRule ^media/(.*)$ backend/media/$1 [L]

# Frontend статические файлы
RewriteCond %{REQUEST_URI} ^/_next/
RewriteRule ^(.*)$ frontend/out/$1 [L]

# Основные страницы на frontend
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ frontend/out/index.html [L]
EOF

# Создание WSGI файла для Django
cat > backend/wsgi_hosting.py << 'EOF'
#!/usr/bin/env python
import os
import sys
from pathlib import Path

# Добавляем путь к проекту
project_path = Path(__file__).resolve().parent
sys.path.insert(0, str(project_path))

# Активируем виртуальное окружение
activate_this = project_path / 'venv' / 'bin' / 'activate_this.py'
if activate_this.exists():
    exec(open(activate_this).read())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'labosfera_project.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
EOF

# Создание скрипта запуска
cat > start.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate
export DJANGO_SETTINGS_MODULE=labosfera_project.settings_hosting_compat
python manage.py runserver 0.0.0.0:8000
EOF
chmod +x start.sh

success "🎉 Развертывание на хостинге завершено!"

echo ""
echo "📋 Что делать дальше:"
echo ""
echo "1. 📝 Отредактируйте backend/.env с вашими настройками"
echo "2. 🌐 Настройте домен в панели управления хостингом"
echo "3. 📁 Загрузите файлы в корневую директорию сайта"
echo "4. 🔧 Настройте веб-сервер (Apache/Nginx) согласно .htaccess"
echo ""
echo "🔗 Полезные команды:"
echo "📊 Статистика: cd backend && source venv/bin/activate && python manage.py shell"
echo "🔄 Обновление: git pull origin main"
echo "📦 Пересборка статики: cd backend && python manage.py collectstatic"
echo ""
echo "👑 Админка будет доступна: https://labosfera.ru/admin/"
echo "🔑 Логин: admin / Пароль: admin123"
echo ""
warning "⚠️  ОБЯЗАТЕЛЬНО смените пароль администратора после входа!"
echo ""
echo "📞 Поддержка REG.RU: https://www.reg.ru/support/"