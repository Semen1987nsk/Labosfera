#!/bin/bash
set -e

echo "╔═══════════════════════════════════════╗"
echo "║   БЕЗОПАСНЫЙ ДЕПЛОЙ FRONTEND         ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Проверка что запущен на production сервере
if [ ! -d "/root/Labosfera" ]; then
    echo "❌ Ошибка: запускайте на production сервере!"
    exit 1
fi

cd /root/Labosfera

# 1. Скачать свежий код
echo "📥 Скачивание обновлений с GitHub..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Ошибка git pull"
    exit 1
fi
echo "✅ Код обновлен"
echo ""

# 2. Пересобрать frontend образ
echo "🔨 Пересборка frontend Docker образа..."
docker-compose -f docker-compose.prod.yml build frontend
if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки"
    exit 1
fi
echo "✅ Образ собран"
echo ""

# 3. Остановить и удалить старый frontend
echo "⏸️  Остановка старого frontend контейнера..."
docker-compose -f docker-compose.prod.yml stop frontend
docker-compose -f docker-compose.prod.yml rm -f frontend
echo "✅ Старый контейнер удален"
echo ""

# 4. Запустить новый frontend (БЕЗ пересоздания зависимостей!)
echo "🚀 Запуск нового frontend контейнера..."
docker-compose -f docker-compose.prod.yml up -d --no-deps frontend
echo "✅ Новый контейнер запущен"
echo ""

# 5. Подождать пока frontend запустится
echo "⏳ Ожидание запуска frontend (15 секунд)..."
sleep 15

# 6. Проверить что frontend работает внутри контейнера
echo "🔍 Проверка работы frontend..."
if docker exec labosfera_frontend_1 wget --quiet --tries=1 --spider http://localhost:3000 2>/dev/null; then
    echo "✅ Frontend отвечает внутри контейнера"
else
    echo "⚠️ Frontend не отвечает, показываю логи:"
    docker logs labosfera_frontend_1 --tail 50
    echo ""
    echo "❌ Деплой может быть неуспешным, проверьте логи выше"
fi
echo ""

# 7. Перезагрузить Nginx для обновления DNS кэша
echo "🔄 Перезагрузка Nginx для обновления маршрутизации..."
docker-compose -f docker-compose.prod.yml restart nginx
sleep 5
echo "✅ Nginx перезагружен"
echo ""

# 8. Финальная проверка через Nginx
echo "🌐 Проверка доступности сайта через Nginx..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://labosfera.ru)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Сайт доступен! (HTTP $HTTP_CODE)"
else
    echo "❌ Сайт вернул HTTP $HTTP_CODE"
    echo "Логи Nginx:"
    docker logs labosfera_nginx_1 --tail 20
    exit 1
fi
echo ""

# 9. Показать статус всех контейнеров
echo "📊 Статус контейнеров:"
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}'
echo ""

echo "╔═══════════════════════════════════════╗"
echo "║    🎉 ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!       ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "🔗 Проверьте сайт: https://labosfera.ru"
echo "📋 Логи: docker logs labosfera_frontend_1 -f"
