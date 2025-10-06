#!/bin/bash

# 🔧 Исправление лимитов загрузки файлов в nginx
echo "🔧 Исправляем лимиты загрузки файлов в nginx..."

# Пересоздаем nginx контейнер с обновленной конфигурацией
echo "🏗️  Пересборка nginx с новой конфигурацией..."
docker compose -f docker-compose.prod.yml build --no-cache nginx

echo "🔄 Перезапуск nginx..."
docker compose -f docker-compose.prod.yml up -d nginx

echo "⏳ Ожидание запуска nginx..."
sleep 5

echo "🔍 Проверка конфигурации nginx..."
docker compose -f docker-compose.prod.yml exec nginx nginx -t

echo "✅ Проверка новых лимитов..."
docker compose -f docker-compose.prod.yml exec nginx grep -A2 -B2 "client_max_body_size" /etc/nginx/nginx.conf

echo ""
echo "✅ Исправление завершено!"
echo "📋 Новые лимиты:"
echo "   - Максимальный размер файла: 50MB"
echo "   - Таймаут чтения: 300 секунд"
echo "   - Применено к /admin/ и /api/ маршрутам"
echo ""
echo "🧪 Теперь можно загружать изображения товаров до 50MB в админке!"
echo "🌐 Проверьте: https://labosfera.ru/admin/"