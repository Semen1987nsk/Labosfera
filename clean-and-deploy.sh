#!/bin/bash

echo "🧹 Полная очистка и развертывание на Timeweb Cloud"
echo "=================================================="

# Остановка всех контейнеров
echo "Остановка всех контейнеров..."
docker stop $(docker ps -aq) 2>/dev/null || true

# Удаление всех контейнеров
echo "Удаление всех контейнеров..."
docker rm -f $(docker ps -aq) 2>/dev/null || true

# Удаление образов Labosfera
echo "Удаление образов Labosfera..."
docker images | grep labosfera | awk '{print $3}' | xargs -r docker rmi -f

# Очистка системы
echo "Очистка Docker системы..."
docker system prune -af --volumes

# Проверка портов
echo "Проверка занятых портов..."
netstat -tulpn | grep -E ':(80|443|3000|5432|8000)' || echo "Порты свободны"

echo ""
echo "✅ Очистка завершена!"
echo ""
echo "Теперь запустите: docker compose -f docker-compose.simple.yml up -d"
