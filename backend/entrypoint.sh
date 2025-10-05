#!/bin/bash
set -e

echo "🚀 ЛАБОСФЕРА - Запуск Django Backend на Timeweb Cloud"
echo "=================================================="

# Функция логирования
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Ожидание базы данных
log "⏳ Ожидание подключения к PostgreSQL..."
until python -c "import psycopg2; psycopg2.connect('$DATABASE_URL')" 2>/dev/null; do
    sleep 1
done
log "✅ PostgreSQL готов к работе"

# Применение миграций
log "📊 Применение миграций базы данных..."
python manage.py migrate --no-input
log "✅ Миграции применены"

# Сбор статических файлов
log "📁 Сбор статических файлов..."
python manage.py collectstatic --no-input --clear
log "✅ Статические файлы собраны"

# Создание суперпользователя (если нужно)
if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_EMAIL" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ]; then
    log "👤 Создание суперпользователя..."
    python manage.py shell << PYTHON_SCRIPT
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists():
    User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', '$DJANGO_SUPERUSER_PASSWORD')
    print("Суперпользователь создан")
else:
    print("Суперпользователь уже существует")
PYTHON_SCRIPT
    log "✅ Суперпользователь готов"
fi

# Проверка конфигурации Django
log "🔧 Проверка конфигурации Django..."
python manage.py check --deploy
log "✅ Конфигурация проверена"

# Запуск сервера
log "🌐 Запуск Gunicorn сервера..."
log "🎯 Оптимизировано для Timeweb Cloud (NVMe + 1 Gbps)"
log "=================================================="

exec "$@"
