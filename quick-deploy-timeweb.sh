#!/bin/bash

# ==========================================
# ЛАБОСФЕРА - Быстрый деплой для Timeweb Cloud
# Упрощенная версия для быстрого запуска
# ==========================================

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Функции вывода
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Заголовок
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                   🚀 ЛАБОСФЕРА - Быстрый деплой Timeweb Cloud               ║${NC}"
echo -e "${PURPLE}║                      Оптимизированная версия для продакшена                  ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Проверка основных команд
log "Проверка системы..."
command -v docker >/dev/null 2>&1 || { error "Docker не установлен!"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { error "Docker Compose не установлен!"; exit 1; }
success "Docker и Docker Compose готовы"

# Проверка конфигурации
log "Проверка конфигурации..."
if [ ! -f ".env.timeweb.example" ]; then
    error "Файл .env.timeweb.example не найден!"
    exit 1
fi

if [ ! -f ".env" ]; then
    warning "Файл .env не найден, создаем из примера..."
    cp .env.timeweb.example .env
    echo ""
    echo -e "${YELLOW}🔧 ВАЖНО: Отредактируйте файл .env перед продолжением!${NC}"
    echo ""
    echo "Обязательно измените:"
    echo "  • DJANGO_SECRET_KEY"
    echo "  • POSTGRES_PASSWORD"
    echo "  • EMAIL (ваш email для SSL)"
    echo "  • DOMAIN (ваш домен)"
    echo ""
    read -p "Нажмите Enter когда отредактируете .env файл..."
fi

# Загрузка переменных окружения
source .env

# Проверка критических переменных
log "Проверка критических настроек..."
if [ "$DJANGO_SECRET_KEY" = "CHANGE_THIS_SECRET_KEY_TO_RANDOM_50_CHARS_STRING" ]; then
    error "DJANGO_SECRET_KEY не изменен в .env файле!"
    exit 1
fi

if [ "$POSTGRES_PASSWORD" = "CHANGE_THIS_DB_PASSWORD_NOW" ]; then
    error "POSTGRES_PASSWORD не изменен в .env файле!"
    exit 1
fi

success "Конфигурация проверена"

# Создание директорий
log "Создание директорий данных..."
sudo mkdir -p /opt/labosfera/{data/{postgres,static,media},logs/{nginx,app},ssl/letsencrypt,backups}
sudo chown -R $USER:$USER /opt/labosfera
success "Директории созданы"

# Остановка старых контейнеров
log "Остановка старых контейнеров..."
docker-compose -f docker-compose.timeweb.yml down --remove-orphans 2>/dev/null || true
success "Старые контейнеры остановлены"

# Сборка образов
log "Сборка Docker образов..."
docker-compose -f docker-compose.timeweb.yml build --no-cache
success "Образы собраны"

# Запуск сервисов
log "Запуск сервисов..."
docker-compose -f docker-compose.timeweb.yml up -d
success "Сервисы запущены"

# Ожидание готовности
log "Ожидание готовности сервисов..."
sleep 30

# Проверка состояния
log "Проверка состояния контейнеров..."
if docker-compose -f docker-compose.timeweb.yml ps | grep -q "Up"; then
    success "Контейнеры запущены"
else
    error "Ошибка запуска контейнеров!"
    docker-compose -f docker-compose.timeweb.yml logs
    exit 1
fi

# Применение миграций
log "Применение миграций базы данных..."
docker-compose -f docker-compose.timeweb.yml exec -T backend python manage.py migrate
success "Миграции применены"

# Сбор статических файлов
log "Сбор статических файлов..."
docker-compose -f docker-compose.timeweb.yml exec -T backend python manage.py collectstatic --no-input
success "Статические файлы собраны"

# Создание суперпользователя (опционально)
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    log "Создание суперпользователя..."
    docker-compose -f docker-compose.timeweb.yml exec -T backend python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists():
    User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', '$DJANGO_SUPERUSER_PASSWORD')
    print("Суперпользователь создан")
else:
    print("Суперпользователь уже существует")
EOF
    success "Суперпользователь готов"
fi

# Финальная проверка
log "Финальная проверка доступности..."
sleep 10

# Проверка сервисов
check_service() {
    local url=$1
    local name=$2
    
    if curl -f "$url" >/dev/null 2>&1; then
        success "$name доступен ($url)"
        return 0
    else
        error "$name недоступен ($url)"
        return 1
    fi
}

all_good=true

check_service "http://localhost:8000/api/health/" "Backend API" || all_good=false
check_service "http://localhost:3000/" "Frontend" || all_good=false
check_service "http://localhost/health/" "Nginx" || all_good=false

# Настройка SSL (если домен настроен)
if [ "$DOMAIN" != "labosfera.ru" ] && [ "$EMAIL" != "admin@labosfera.ru" ]; then
    log "Настройка SSL сертификата..."
    
    # Получение SSL сертификата
    docker run --rm \
        -v /opt/labosfera/ssl/letsencrypt:/etc/letsencrypt \
        -v /opt/labosfera/data/static:/var/www/certbot \
        -p 80:80 \
        certbot/certbot certonly \
        --standalone \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        success "SSL сертификат получен для $DOMAIN"
        
        # Перезапуск Nginx с SSL
        docker-compose -f docker-compose.timeweb.yml restart nginx
        sleep 5
        
        check_service "https://$DOMAIN/health/" "HTTPS" || true
    else
        warning "Не удалось получить SSL сертификат (проверьте DNS настройки)"
    fi
fi

echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                            🎉 ДЕПЛОЙ ЗАВЕРШЕН!                              ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$all_good" = true ]; then
    success "Все сервисы запущены успешно!"
    echo ""
    echo -e "${CYAN}🌐 Доступные URL:${NC}"
    echo "  • Frontend: http://localhost:3000"
    echo "  • Backend API: http://localhost:8000/api/"
    echo "  • Admin Panel: http://localhost:8000/admin/"
    echo "  • Nginx: http://localhost"
    
    if [ "$DOMAIN" != "labosfera.ru" ]; then
        echo "  • Ваш сайт: https://$DOMAIN"
    fi
    
    echo ""
    echo -e "${CYAN}📊 Управление:${NC}"
    echo "  • Мониторинг: ./timeweb-monitor.sh"
    echo "  • Логи: docker-compose -f docker-compose.timeweb.yml logs -f"
    echo "  • Перезапуск: docker-compose -f docker-compose.timeweb.yml restart"
    echo "  • Остановка: docker-compose -f docker-compose.timeweb.yml down"
    
    echo ""
    echo -e "${GREEN}✨ ЛАБОСФЕРА готова к работе на Timeweb Cloud!${NC}"
else
    warning "Некоторые сервисы могут быть недоступны"
    echo ""
    echo -e "${YELLOW}🔧 Для диагностики используйте:${NC}"
    echo "  • ./timeweb-monitor.sh"
    echo "  • docker-compose -f docker-compose.timeweb.yml logs"
fi

echo ""