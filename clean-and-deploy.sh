#!/bin/bash

echo "🧹 Полная очистка и развертывание на Timeweb Cloud"
echo "=================================================="

# Остановка всех контейнеров
echo "Остановка всех контейнеров..."
docker compose -f docker-compose.simple.yml down -v 2>/dev/null || true
docker stop $(docker ps -aq) 2>/dev/null || true

# Удаление всех контейнеров
echo "Удаление всех контейнеров..."
docker rm -f $(docker ps -aq) 2>/dev/null || true

# Убить все процессы docker-proxy на критичных портах
echo "Освобождение портов..."
lsof -ti :5432 | xargs -r kill -9 2>/dev/null || true
lsof -ti :80 | xargs -r kill -9 2>/dev/null || true
lsof -ti :443 | xargs -r kill -9 2>/dev/null || true

# Перезапуск Docker демона
echo "Перезапуск Docker..."
systemctl restart docker
sleep 5

# Удаление образов Labosfera (но не базовых типа postgres, nginx)
echo "Удаление образов Labosfera..."
docker images | grep labosfera | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || true

# Очистка только неиспользуемых ресурсов (БЕЗ удаления всех образов)
echo "Очистка неиспользуемых ресурсов Docker..."
docker system prune -f --volumes

# Проверка портов
echo "Проверка занятых портов..."
netstat -tulpn | grep -E ':(80|443|3000|5432|8000)' || echo "✅ Все порты свободны"

echo ""
echo "✅ Очистка завершена!"
echo ""
echo "Запуск контейнеров..."
docker compose -f docker-compose.simple.yml up -d

echo ""
echo "Проверка статуса..."
sleep 3
docker compose -f docker-compose.simple.yml ps
