#!/bin/bash

# ============================================
# СКРИПТ ОБНОВЛЕНИЯ КОДА НА СЕРВЕРЕ
# ============================================

echo "🚀 Обновление Labosfera на сервере..."
echo ""

SERVER="root@109.73.192.44"
PROJECT_DIR="/opt/Labosfera"

echo "📡 Подключаемся к серверу $SERVER..."
echo ""

ssh $SERVER << 'ENDSSH'

cd /opt/Labosfera

echo "📥 Скачиваем обновления с GitHub..."
git pull origin main

echo ""
echo "🔄 Перезапускаем backend с новыми настройками..."
docker-compose -f docker-compose.prod.yml up -d --build backend

echo ""
echo "⏳ Ждём 10 секунд пока backend запустится..."
sleep 10

echo ""
echo "📊 Проверяем статус контейнеров:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "📝 Последние 20 строк логов backend:"
docker-compose -f docker-compose.prod.yml logs --tail=20 backend

echo ""
echo "✅ Обновление завершено!"
echo ""
echo "🧪 Проверьте:"
echo "  1. Форму на сайте: https://labosfera.ru"
echo "  2. Корзину: добавьте товар и попробуйте оформить заказ"
echo "  3. Telegram: должны приходить уведомления"
echo ""

ENDSSH

echo "✅ Готово! Проверьте сайт."
