#!/bin/bash
set -e

# ============================================
# LABOSFERA - Production Deployment Script
# Автоматический деплой на labosfera.ru
# ============================================

echo "🚀 LABOSFERA - Production Deployment"
echo "======================================"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функции логирования
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Параметры сервера
SERVER_USER="root"
SERVER_HOST="109.73.192.44"
PROJECT_PATH="/root/Labosfera"

log_info "Подключение к серверу ${SERVER_HOST}..."

# Проверка подключения
if ! ssh ${SERVER_USER}@${SERVER_HOST} "echo 'Connected'" > /dev/null 2>&1; then
    log_error "Не удалось подключиться к серверу"
    exit 1
fi

log_info "✅ Подключение установлено"

# Обновление кода
log_info "Обновление кода из GitHub..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    cd /root/Labosfera
    
    # Сохраним .env файл
    cp .env .env.backup 2>/dev/null || true
    
    # Обновление кода
    git fetch origin
    git reset --hard origin/main
    
    # Восстановим .env
    if [ -f .env.backup ]; then
        cp .env.backup .env
    fi
    
    echo "✅ Код обновлен"
ENDSSH

log_info "✅ Код обновлен"

# Проверка .env файла
log_info "Проверка .env файла..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    if [ ! -f /root/Labosfera/.env ]; then
        echo "❌ Файл .env не найден!"
        if [ -f /root/.env.labosfera ]; then
            cp /root/.env.labosfera /root/Labosfera/.env
            echo "✅ Скопирован из ~/.env.labosfera"
        else
            echo "❌ Создайте файл .env на сервере!"
            exit 1
        fi
    else
        echo "✅ Файл .env найден"
    fi
ENDSSH

log_info "✅ .env файл готов"

# Сборка образов
log_info "Сборка Docker образов..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    cd /root/Labosfera
    
    # Собираем Backend
    echo "📦 Сборка Backend..."
    docker build -t labosfera_backend -f backend/Dockerfile.prod backend/
    
    # Собираем Frontend
    echo "📦 Сборка Frontend..."
    docker build -t labosfera_frontend --build-arg NEXT_PUBLIC_API_URL=https://labosfera.ru -f frontend/Dockerfile.prod frontend/
    
    # Собираем Nginx
    echo "📦 Сборка Nginx..."
    docker build -t labosfera_nginx nginx/
    
    echo "✅ Образы собраны"
ENDSSH

log_info "✅ Образы собраны"

# Остановка старых контейнеров
log_info "Остановка старых контейнеров..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    # Останавливаем контейнеры (игнорируем ошибки если их нет)
    docker stop labosfera_nginx_1 2>/dev/null || true
    docker stop labosfera_frontend_1 2>/dev/null || true
    docker stop labosfera_backend_1 2>/dev/null || true
    docker stop labosfera_db_1 2>/dev/null || true
    
    # Удаляем контейнеры
    docker rm labosfera_nginx_1 2>/dev/null || true
    docker rm labosfera_frontend_1 2>/dev/null || true
    docker rm labosfera_backend_1 2>/dev/null || true
    docker rm labosfera_db_1 2>/dev/null || true
    
    echo "✅ Старые контейнеры остановлены"
ENDSSH

log_info "✅ Старые контейнеры остановлены"

# Создание сети и volumes
log_info "Создание Docker сети и volumes..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    # Создаем сеть (игнорируем ошибку если уже существует)
    docker network create labosfera_app-network 2>/dev/null || true
    
    # Создаем volumes (игнорируем ошибки если уже существуют)
    docker volume create labosfera_postgres_data 2>/dev/null || true
    docker volume create labosfera_static_volume 2>/dev/null || true
    docker volume create labosfera_media_volume 2>/dev/null || true
    
    echo "✅ Сеть и volumes готовы"
ENDSSH

log_info "✅ Сеть и volumes готовы"

# Запуск контейнеров
log_info "Запуск контейнеров..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    cd /root/Labosfera
    
    # Загружаем переменные окружения
    source .env
    
    # 1. Запускаем PostgreSQL
    echo "🗄️  Запуск PostgreSQL..."
    docker run -d \
        --name labosfera_db_1 \
        --network labosfera_app-network \
        --restart always \
        -e POSTGRES_DB=${POSTGRES_DB} \
        -e POSTGRES_USER=${POSTGRES_USER} \
        -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
        -v labosfera_postgres_data:/var/lib/postgresql/data \
        postgres:15
    
    # Ждем запуска PostgreSQL
    echo "⏳ Ожидание PostgreSQL..."
    sleep 10
    
    # 2. Запускаем Backend
    echo "🐍 Запуск Backend..."
    docker run -d \
        --name labosfera_backend_1 \
        --network labosfera_app-network \
        --restart always \
        --env-file .env \
        -e DJANGO_SETTINGS_MODULE=labosfera_project.settings_prod \
        -v labosfera_static_volume:/app/staticfiles \
        -v labosfera_media_volume:/app/media \
        labosfera_backend
    
    # Ждем запуска Backend
    echo "⏳ Ожидание Backend..."
    sleep 5
    
    # 3. Применяем миграции
    echo "📊 Применение миграций..."
    docker exec labosfera_backend_1 python manage.py migrate --noinput
    
    # 4. Собираем статические файлы
    echo "📦 Сборка статических файлов..."
    docker exec labosfera_backend_1 python manage.py collectstatic --noinput --clear
    
    # 5. Запускаем Frontend
    echo "⚛️  Запуск Frontend..."
    docker run -d \
        --name labosfera_frontend_1 \
        --network labosfera_app-network \
        --restart always \
        -e NEXT_PUBLIC_API_URL=https://labosfera.ru \
        -e NODE_ENV=production \
        labosfera_frontend
    
    # 6. Запускаем Nginx
    echo "🌐 Запуск Nginx..."
    docker run -d \
        --name labosfera_nginx_1 \
        --network labosfera_app-network \
        --restart always \
        -p 80:80 \
        -p 443:443 \
        -v labosfera_static_volume:/app/staticfiles \
        -v labosfera_media_volume:/app/media \
        labosfera_nginx
    
    echo "✅ Все контейнеры запущены"
ENDSSH

log_info "✅ Все контейнеры запущены"

# Проверка статуса
log_info "Проверка статуса контейнеров..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    echo "📊 Статус контейнеров:"
    docker ps --filter "name=labosfera" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
ENDSSH

# Проверка доступности сайта
log_info "Проверка доступности сайта..."
sleep 5

if curl -s -o /dev/null -w "%{http_code}" https://labosfera.ru | grep -q "200"; then
    log_info "✅ Сайт доступен: https://labosfera.ru"
else
    log_warn "⚠️  Сайт может быть недоступен, проверьте логи"
fi

# Проверка API
if curl -s https://labosfera.ru/api/v1/products/ | grep -q "count"; then
    log_info "✅ API работает: https://labosfera.ru/api/v1/"
else
    log_warn "⚠️  API может работать некорректно"
fi

echo ""
echo "======================================"
log_info "🎉 Деплой завершен!"
echo "======================================"
echo ""
echo "📝 Полезные команды:"
echo "  • Логи Backend:   ssh root@109.73.192.44 'docker logs labosfera_backend_1 -f'"
echo "  • Логи Frontend:  ssh root@109.73.192.44 'docker logs labosfera_frontend_1 -f'"
echo "  • Логи Nginx:     ssh root@109.73.192.44 'docker logs labosfera_nginx_1 -f'"
echo "  • Статус:         ssh root@109.73.192.44 'docker ps'"
echo "  • Django Shell:   ssh root@109.73.192.44 'docker exec -it labosfera_backend_1 python manage.py shell'"
echo "  • Django Admin:   https://labosfera.ru/admin/"
echo ""
