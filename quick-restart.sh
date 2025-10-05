#!/bin/bash

echo "⚡ Быстрое развертывание Labosfera"
echo "=================================="

cd /root/Labosfera 2>/dev/null || cd $(dirname "$0")

# Остановка контейнеров
echo "⏸️  Остановка контейнеров..."
docker compose -f docker-compose.simple.yml down 2>/dev/null || true

# Убить процессы на портах
echo "🔓 Освобождение портов..."
lsof -ti :5432 | xargs -r kill -9 2>/dev/null || true
lsof -ti :80 | xargs -r kill -9 2>/dev/null || true
lsof -ti :443 | xargs -r kill -9 2>/dev/null || true

# Пересборка только наших образов (backend, frontend)
echo "🔨 Пересборка backend и frontend..."
docker compose -f docker-compose.simple.yml build backend frontend

# Запуск всех контейнеров
echo "🚀 Запуск контейнеров..."
docker compose -f docker-compose.simple.yml up -d

# Ожидание запуска
echo "⏳ Ожидание запуска сервисов..."
sleep 5

# Показать статус
echo ""
echo "📊 Статус контейнеров:"
docker compose -f docker-compose.simple.yml ps

echo ""
echo "📋 Для просмотра логов:"
echo "   docker compose -f docker-compose.simple.yml logs -f"
echo ""
echo "🌐 Сайт: http://labosfera.ru"
