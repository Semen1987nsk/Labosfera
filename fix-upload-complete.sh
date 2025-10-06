#!/bin/bash

# 🔧 Полное исправление лимитов загрузки файлов (Django + Nginx)
echo "🔧 Исправляем лимиты загрузки файлов в Django и nginx..."

echo "📋 Текущие изменения:"
echo "   ✅ Django: DATA_UPLOAD_MAX_MEMORY_SIZE = 50MB" 
echo "   ✅ Django: FILE_UPLOAD_MAX_MEMORY_SIZE = 50MB"
echo "   ✅ Nginx: client_max_body_size = 50MB"
echo "   ✅ Nginx: увеличенные таймауты для /admin/"

echo ""
echo "🏗️  Пересборка всех контейнеров с новыми настройками..."
docker compose -f docker-compose.prod.yml down

echo "🔄 Сборка backend с новыми лимитами Django..."
docker compose -f docker-compose.prod.yml build --no-cache backend

echo "🔄 Сборка nginx с новой конфигурацией..."
docker compose -f docker-compose.prod.yml build --no-cache nginx

echo "🚀 Запуск всех сервисов..."
docker compose -f docker-compose.prod.yml up -d

echo "⏳ Ожидание запуска сервисов..."
sleep 10

echo "🔍 Проверка статуса контейнеров..."
docker compose -f docker-compose.prod.yml ps

echo ""
echo "🔍 Проверка конфигурации nginx..."
docker compose -f docker-compose.prod.yml exec nginx nginx -t

echo ""
echo "✅ Проверка новых лимитов Django..."
docker compose -f docker-compose.prod.yml exec backend python manage.py shell -c "
from django.conf import settings
print('DATA_UPLOAD_MAX_MEMORY_SIZE:', settings.DATA_UPLOAD_MAX_MEMORY_SIZE // 1024 // 1024, 'MB')
print('FILE_UPLOAD_MAX_MEMORY_SIZE:', settings.FILE_UPLOAD_MAX_MEMORY_SIZE // 1024 // 1024, 'MB')
"

echo ""
echo "✅ Проверка конфигурации nginx..."
docker compose -f docker-compose.prod.yml exec nginx grep -A2 -B2 "client_max_body_size" /etc/nginx/nginx.conf

echo ""
echo "✅ Исправление завершено!"
echo "📋 Новые лимиты:"
echo "   - Django DATA_UPLOAD_MAX_MEMORY_SIZE: 50MB"
echo "   - Django FILE_UPLOAD_MAX_MEMORY_SIZE: 50MB" 
echo "   - Nginx client_max_body_size: 50MB"
echo "   - Nginx proxy_read_timeout: 300s"
echo ""
echo "🧪 Теперь можно загружать изображения товаров до 50MB в админке!"
echo "🌐 Сайт доступен по адресу: https://labosfera.ru"
echo "🔧 Админка доступна по адресу: https://labosfera.ru/admin/"