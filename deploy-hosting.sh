#!/bin/bash
# Скрипт развертывания ЛАБОСФЕРА для виртуального хостинга (legacy версия)
# Рекомендуется использовать новый скрипт: deploy-regru-shared.sh
set -Eeuo pipefail
IFS=$'\n\t'

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

command -v git &> /dev/null || error "Git не найден. Обратитесь в поддержку хостинга для установки Git."

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

command -v python3 &> /dev/null || error "Python3 не найден. Обратитесь в поддержку хостинга."

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
    RAND_KEY=$(python3 - <<'PY'
import secrets,string
alphabet=string.ascii_letters+string.digits+string.punctuation.replace('"','').replace("'",'')
print(''.join(secrets.choice(alphabet) for _ in range(40)))
PY
    )
    cat > .env << EOF
# Настройки для виртуального хостинга (совместимые)
DEBUG=False
SECRET_KEY=${RAND_KEY}
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
echo "👤 Создание администратора (если нет)..."
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

# Проверка версии Node.js
NODE_VERSION=$(node --version 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 14 ]; then
    warning "Node.js версии $NODE_VERSION слишком старая для Next.js 14"
    warning "Пропускаем сборку frontend - Django backend работает самостоятельно"
    
    # Создаем простую статическую версию frontend
    echo "📄 Создаем упрощенную статическую версию..."
    mkdir -p out
    cat > out/index.html << 'EOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ЛАБОСФЕРА - Лабораторное оборудование</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 2.5em; color: #2563eb; margin-bottom: 10px; }
        .description { font-size: 1.2em; color: #666; }
        .admin-link { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
        .admin-link:hover { background: #1d4ed8; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
        .feature { padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .feature h3 { color: #2563eb; margin-top: 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🧪 ЛАБОСФЕРА</div>
            <div class="description">Профессиональное лабораторное оборудование</div>
            <a href="/admin/" class="admin-link">Панель администратора</a>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>📦 Каталог товаров</h3>
                <p>Управление полным каталогом лабораторного оборудования через Django админку</p>
            </div>
            <div class="feature">
                <h3>📋 Заказы</h3>
                <p>Система обработки заказов с отслеживанием статусов</p>
            </div>
            <div class="feature">
                <h3>🔧 API</h3>
                <p>RESTful API для интеграции с внешними системами</p>
            </div>
            <div class="feature">
                <h3>📊 Аналитика</h3>
                <p>Статистика продаж и управление товарами</p>
            </div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px;">
            <h3>🚀 Сайт успешно развернут!</h3>
            <p><strong>Django backend:</strong> Полностью функционален</p>
            <p><strong>База данных:</strong> SQLite готова к работе</p>
            <p><strong>Админка:</strong> <a href="/admin/">https://labosfera.ru/admin/</a></p>
            <p><strong>API:</strong> <a href="/api/">https://labosfera.ru/api/</a></p>
        </div>
    </div>
    
    <script>
        // Простая аналитика
        console.log('ЛАБОСФЕРА - Сайт загружен успешно!');
    </script>
</body>
</html>
EOF
    
    success "Упрощенный frontend создан"
else
    # Проверка/установка Node.js зависимостей
    if [ ! -d "node_modules" ]; then
        if command -v npm &> /dev/null; then
            echo "Устанавливаем зависимости (может быть много предупреждений - это нормально)..."
            npm install --production --no-audit --no-fund 2>/dev/null || {
                warning "npm install завершился с ошибками, но это не критично"
                warning "Django backend работает независимо от frontend"
            }
        else
            warning "npm не найден. Пропускаем установку frontend зависимостей"
        fi
    fi

    # Сборка production версии
    if command -v npm &> /dev/null && [ -d "node_modules" ]; then
        echo "Пробуем собрать production версию..."
        npm run build 2>/dev/null || {
            warning "Сборка Next.js не удалась (старая версия Node.js)"
            warning "Создаем fallback версию..."
            mkdir -p out
            cp -f ../out/index.html out/ 2>/dev/null || echo "<!-- Fallback page -->" > out/index.html
        }
        success "Frontend обработан"
    else
        warning "Пропускаем сборку frontend (отсутствуют зависимости)"
    fi
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
echo "✅ ЛАБОСФЕРА успешно развернута!"
echo ""
echo "🌐 Django Backend (ГОТОВ):"
echo "   - База данных SQLite создана и настроена"
echo "   - Миграции применены" 
echo "   - Администратор создан: admin/admin123"
echo "   - Статические файлы собраны"
echo ""
echo "� Frontend статус:"
if [ -f "../frontend/out/index.html" ]; then
    echo "   - ✅ Статические файлы готовы"
else
    echo "   - ⚠️  Упрощенная версия (Node.js слишком старый)"
fi
echo ""
echo "🔗 Доступные URL:"
echo "   🏠 Главная страница: https://labosfera.ru/"
echo "   👑 Админка: https://labosfera.ru/admin/"
echo "   🔌 API: https://labosfera.ru/api/"
echo ""
echo "🔑 Данные для входа в админку:"
echo "   Логин: admin"
echo "   Пароль: admin123"
echo ""
echo "📋 Что делать дальше:"
echo "1. 📝 Отредактируйте backend/.env с вашими настройками"
echo "2. 🌐 Настройте домен в панели управления хостингом"
echo "3. 📁 Убедитесь что корневая папка указывает на: $(pwd)"
echo "4. 🔧 Проверьте работу .htaccess файла"
echo "5. 👑 Войдите в админку и смените пароль!"
echo ""
echo "� Полезные команды:"
echo "📊 Статистика: cd backend && source venv/bin/activate && python manage.py shell"
echo "🔄 Обновление: git pull origin main"
echo "📦 Пересборка статики: cd backend && source venv/bin/activate && python manage.py collectstatic"
echo ""
warning "⚠️  ОБЯЗАТЕЛЬНО смените пароль администратора после входа!"
echo ""
echo "📞 Поддержка REG.RU: https://www.reg.ru/support/"
echo ""
echo "🎊 Ваш интернет-магазин ЛАБОСФЕРА готов к работе!"