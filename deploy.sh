#!/bin/bash
# Скрипт развертывания ЛАБОСФЕРА на production сервере

set -e

echo "🚀 Начинаем развертывание ЛАБОСФЕРА..."

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

# Проверка запуска под root
if [ "$EUID" -ne 0 ]; then
    error "Скрипт должен запускаться под root"
fi

# Обновление системы
echo "📦 Обновляем систему..."
apt update && apt upgrade -y
success "Система обновлена"

# Установка Docker
echo "🐳 Устанавливаем Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    success "Docker установлен"
else
    success "Docker уже установлен"
fi

# Установка Docker Compose
echo "🔧 Устанавливаем Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    success "Docker Compose установлен"
else
    success "Docker Compose уже установлен"
fi

# Установка Git
echo "📥 Устанавливаем Git..."
if ! command -v git &> /dev/null; then
    apt install git -y
    success "Git установлен"
else
    success "Git уже установлен"
fi

# Клонирование репозитория
echo "📁 Клонируем репозиторий..."
if [ ! -d "/opt/labosfera" ]; then
    cd /opt
    git clone https://github.com/Semen1987nsk/Labosfera.git labosfera
    cd labosfera
    success "Репозиторий склонирован"
else
    cd /opt/labosfera
    git pull origin main
    success "Репозиторий обновлен"
fi

# Настройка окружения
echo "⚙️  Настраиваем переменные окружения..."
if [ ! -f ".env.prod" ]; then
    cp .env.prod.example .env.prod
    success "Создан файл .env.prod из шаблона"
    echo ""
    warning "🔥 КРИТИЧЕСКИ ВАЖНО! 🔥"
    echo "Сейчас откроется редактор для настройки .env.prod"
    echo "ОБЯЗАТЕЛЬНО измените следующие параметры:"
    echo ""
    echo "1. POSTGRES_PASSWORD=SuperSecurePassword123!"
    echo "2. DJANGO_SECRET_KEY=ваш-супер-секретный-ключ-50-символов"
    echo "3. DOMAIN=labosfera.ru (ваш домен)"
    echo "4. EMAIL=admin@labosfera.ru (ваш email)"
    echo ""
    echo "💡 Для генерации Django Secret Key используйте: https://djecrety.ir/"
    echo ""
    echo "📝 Управление nano:"
    echo "   - Ctrl+X = выход"
    echo "   - Y = сохранить"
    echo "   - Enter = подтвердить"
    echo ""
    read -p "Нажмите Enter для открытия редактора..."
    nano .env.prod
    
    # Проверка, что пользователь изменил настройки
    if grep -q "your_secure_password_here" .env.prod; then
        error "POSTGRES_PASSWORD не изменен! Развертывание остановлено."
    fi
    
    if grep -q "your-secret-key-here" .env.prod; then
        error "DJANGO_SECRET_KEY не изменен! Развертывание остановлено."
    fi
    
    success "Настройки .env.prod обновлены"
fi

# Создание директорий
echo "📂 Создаем необходимые директории..."
mkdir -p certbot/conf certbot/www backend/logs
success "Директории созданы"

# Запуск без SSL для получения сертификата
echo "🔒 Получаем SSL сертификат..."
source .env.prod

# Временная конфигурация nginx без SSL
cat > nginx/temp.conf << EOF
events {
    worker_connections 1024;
}
http {
    server {
        listen 80;
        server_name ${DOMAIN} www.${DOMAIN};
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 200 'Server is ready for SSL setup';
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Запуск временного nginx
docker run -d --name temp-nginx \
    -p 80:80 \
    -v "$(pwd)/nginx/temp.conf:/etc/nginx/nginx.conf:ro" \
    -v "$(pwd)/certbot/www:/var/www/certbot" \
    nginx:alpine

# Получение SSL сертификата
docker run --rm \
    -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
    -v "$(pwd)/certbot/www:/var/www/certbot" \
    certbot/certbot \
    certonly --webroot -w /var/www/certbot \
    --email ${EMAIL} \
    --agree-tos \
    --no-eff-email \
    -d ${DOMAIN} -d www.${DOMAIN}

# Остановка временного nginx
docker stop temp-nginx
docker rm temp-nginx

success "SSL сертификат получен"

# Сборка и запуск приложения
echo "🏗️  Собираем и запускаем приложение..."
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Миграции базы данных
echo "🗄️  Применяем миграции..."
sleep 10  # Ждем запуска базы данных
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate --settings=labosfera_project.settings_prod

# Сбор статических файлов для админки
echo "📦 Собираем статические файлы..."
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput --settings=labosfera_project.settings_prod

# Создание суперпользователя
echo "👤 Создание суперпользователя..."
docker-compose -f docker-compose.prod.yml exec backend python manage.py shell --settings=labosfera_project.settings_prod << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', '${EMAIL}', 'admin123')
    print('✅ Суперпользователь создан: admin/admin123')
else:
    print('ℹ️  Суперпользователь уже существует')
EOF

success "🎉 Развертывание завершено!"

echo ""
echo "🌐 Ваш сайт доступен по адресу: https://${DOMAIN}"
echo "🔧 Админка: https://${DOMAIN}/admin/"
echo "👤 Логин: admin"
echo "🔑 Пароль: admin123"
echo ""
warning "ВАЖНО: Смените пароль администратора!"
warning "ВАЖНО: Проверьте настройки в .env.prod"

# Настройка автообновления сертификатов
echo "🔄 Настраиваем автообновление SSL..."
(crontab -l 2>/dev/null; echo "0 12 * * * cd /opt/labosfera && docker-compose -f docker-compose.prod.yml exec certbot certbot renew --quiet && docker-compose -f docker-compose.prod.yml restart nginx") | crontab -
success "Автообновление SSL настроено"

echo "✅ Все готово! Сайт ЛАБОСФЕРА успешно развернут!"