#!/bin/bash

echo "🪞 Настройка Docker mirror для обхода rate limit"
echo "================================================"

# Создаем конфигурацию Docker daemon с зеркалами
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json > /dev/null <<'EOF'
{
  "registry-mirrors": [
    "https://mirror.gcr.io",
    "https://dockerproxy.com"
  ],
  "max-concurrent-downloads": 3,
  "max-concurrent-uploads": 3
}
EOF

echo "✅ Конфигурация создана"

# Перезапуск Docker
echo "🔄 Перезапуск Docker..."
sudo systemctl restart docker

echo "⏳ Ожидание запуска Docker..."
sleep 5

echo "✅ Docker перезапущен"

# Проверка
echo "🔍 Проверка конфигурации:"
docker info | grep -A 5 "Registry Mirrors" || echo "Зеркала не настроены (это нормально)"

echo ""
echo "💡 Теперь попробуйте запустить: docker compose -f docker-compose.simple.yml up -d"
