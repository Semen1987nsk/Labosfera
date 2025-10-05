#!/bin/bash

echo "🔍 Проверка доступных Docker образов"
echo "===================================="

echo ""
echo "📦 Все образы в системе:"
docker images

echo ""
echo "🐘 PostgreSQL образы:"
docker images | grep postgres || echo "Нет образов PostgreSQL"

echo ""
echo "🌐 Nginx образы:"
docker images | grep nginx || echo "Нет образов Nginx"

echo ""
echo "🐍 Python образы:"
docker images | grep python || echo "Нет образов Python"

echo ""
echo "📱 Node образы:"
docker images | grep node || echo "Нет образов Node"

echo ""
echo "🧪 Labosfera образы:"
docker images | grep labosfera || echo "Нет образов Labosfera"

echo ""
echo "📊 Использование диска:"
docker system df

echo ""
echo "💡 Рекомендации:"
echo "   Если базовые образы есть, используйте: docker compose -f docker-compose.simple.yml up -d --no-build"
echo "   Если нет образов, войдите в Docker Hub: docker login"
