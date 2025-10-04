#!/bin/bash
# Скрипт обновления ЛАБОСФЕРА на production

set -e

echo "🔄 Обновляем ЛАБОСФЕРА..."

cd /opt/labosfera

# Остановка сервисов
echo "⏸️  Останавливаем сервисы..."
docker-compose -f docker-compose.prod.yml down

# Обновление кода
echo "📥 Обновляем код..."
git pull origin main

# Сборка новых образов
echo "🏗️  Пересобираем образы..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Запуск сервисов
echo "▶️  Запускаем сервисы..."
docker-compose -f docker-compose.prod.yml up -d

# Миграции
echo "🗄️  Применяем миграции..."
sleep 10
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate --settings=labosfera_project.settings_prod

# Сбор статики
echo "📦 Собираем статические файлы..."
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput --settings=labosfera_project.settings_prod

echo "✅ Обновление завершено!"