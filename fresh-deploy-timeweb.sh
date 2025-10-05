#!/bin/bash

echo "======================================"
echo "ПОЛНАЯ ПЕРЕУСТАНОВКА LABOSFERA"
echo "======================================"
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Шаг 1: Остановка и удаление всех контейнеров${NC}"
docker-compose -f docker-compose.timeweb.yml down -v 2>/dev/null || true
docker-compose -f docker-compose.simple.yml down -v 2>/dev/null || true
docker-compose down -v 2>/dev/null || true

echo -e "${YELLOW}Шаг 2: Удаление всех образов Labosfera${NC}"
docker images | grep labosfera | awk '{print $3}' | xargs -r docker rmi -f

echo -e "${YELLOW}Шаг 3: Удаление всех неиспользуемых томов${NC}"
docker volume prune -f

echo -e "${YELLOW}Шаг 4: Удаление всех неиспользуемых сетей${NC}"
docker network prune -f

echo -e "${YELLOW}Шаг 5: Очистка системы Docker${NC}"
docker system prune -af

echo -e "${YELLOW}Шаг 6: Удаление старых файлов проекта${NC}"
cd /root
rm -rf Labosfera

echo -e "${YELLOW}Шаг 7: Клонирование свежей версии проекта${NC}"
git clone https://github.com/Semen1987nsk/Labosfera.git
cd Labosfera

echo -e "${YELLOW}Шаг 8: Создание .env файла${NC}"
cat > .env << 'EOF'
DEBUG=False
DJANGO_SECRET_KEY=very-long-secret-key-minimum-50-characters-12345678901234
DOMAIN=labosfera.ru
ALLOWED_HOSTS=labosfera.ru,www.labosfera.ru,127.0.0.1,localhost
EMAIL=sarvanidi87@gmail.com

POSTGRES_DB=labosfera
POSTGRES_USER=labosfera
POSTGRES_PASSWORD=SecurePass123!
DATABASE_URL=postgresql://labosfera:SecurePass123!@db:5432/labosfera

CORS_ALLOWED_ORIGINS=http://labosfera.ru,http://www.labosfera.ru
CSRF_TRUSTED_ORIGINS=http://labosfera.ru,http://www.labosfera.ru
NEXT_PUBLIC_API_URL=http://labosfera.ru/api
NEXT_PUBLIC_SITE_URL=http://labosfera.ru
EOF

echo -e "${GREEN}✓ Файл .env создан${NC}"

echo -e "${YELLOW}Шаг 9: Создание директорий для данных${NC}"
mkdir -p postgres_data media staticfiles logs

echo -e "${YELLOW}Шаг 10: Сборка Docker образов${NC}"
docker-compose -f docker-compose.simple.yml build --no-cache

echo -e "${YELLOW}Шаг 11: Запуск контейнеров${NC}"
docker-compose -f docker-compose.simple.yml up -d

echo ""
echo -e "${GREEN}======================================"
echo "РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО!"
echo "======================================${NC}"
echo ""
echo "Проверьте статус контейнеров:"
echo "  docker-compose -f docker-compose.simple.yml ps"
echo ""
echo "Просмотр логов:"
echo "  docker-compose -f docker-compose.simple.yml logs -f"
echo ""
echo "Проверка backend:"
echo "  docker-compose -f docker-compose.simple.yml logs backend"
echo ""
echo "Сайт должен быть доступен по адресу: http://labosfera.ru"
echo ""
