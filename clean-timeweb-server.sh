#!/bin/bash

# ==========================================
# ЛАБОСФЕРА - Полная очистка сервера Timeweb
# Удаление всех следов предыдущих развертываний
# ==========================================

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧹 ПОЛНАЯ ОЧИСТКА СЕРВЕРА TIMEWEB${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""

# Остановка и удаление всех Docker контейнеров
echo -e "${YELLOW}🛑 Остановка всех Docker контейнеров...${NC}"
docker stop $(docker ps -aq) 2>/dev/null || echo "Нет запущенных контейнеров"

echo -e "${YELLOW}🗑️  Удаление всех Docker контейнеров...${NC}"
docker rm $(docker ps -aq) 2>/dev/null || echo "Нет контейнеров для удаления"

# Удаление всех Docker образов
echo -e "${YELLOW}🗑️  Удаление всех Docker образов...${NC}"
docker rmi $(docker images -q) 2>/dev/null || echo "Нет образов для удаления"

# Удаление всех Docker volumes
echo -e "${YELLOW}🗑️  Удаление всех Docker volumes...${NC}"
docker volume rm $(docker volume ls -q) 2>/dev/null || echo "Нет volumes для удаления"

# Удаление всех Docker networks (кроме системных)
echo -e "${YELLOW}🗑️  Удаление Docker networks...${NC}"
docker network prune -f

# Полная очистка Docker системы
echo -e "${YELLOW}🧹 Полная очистка Docker системы...${NC}"
docker system prune -a -f --volumes

# Удаление директорий проекта
echo -e "${YELLOW}🗑️  Удаление директорий проекта...${NC}"
sudo rm -rf /opt/labosfera* 2>/dev/null || true
sudo rm -rf /var/lib/docker/volumes/labosfera* 2>/dev/null || true
sudo rm -rf ~/labosfera* 2>/dev/null || true
sudo rm -rf /tmp/labosfera* 2>/dev/null || true

# Удаление конфигурационных файлов
echo -e "${YELLOW}🗑️  Удаление конфигураций...${NC}"
sudo rm -rf /etc/nginx/sites-*/labosfera* 2>/dev/null || true
sudo rm -rf /etc/nginx/conf.d/labosfera* 2>/dev/null || true
sudo rm -rf /etc/letsencrypt/live/labosfera* 2>/dev/null || true
sudo rm -rf /etc/letsencrypt/archive/labosfera* 2>/dev/null || true

# Удаление логов
echo -e "${YELLOW}🗑️  Удаление логов...${NC}"
sudo rm -rf /var/log/labosfera* 2>/dev/null || true
sudo rm -rf /var/log/nginx/labosfera* 2>/dev/null || true

# Очистка apt cache
echo -e "${YELLOW}🧹 Очистка apt кэша...${NC}"
sudo apt autoremove -y
sudo apt autoclean
sudo apt clean

# Очистка временных файлов
echo -e "${YELLOW}🧹 Очистка временных файлов...${NC}"
sudo rm -rf /tmp/* 2>/dev/null || true
sudo rm -rf /var/tmp/* 2>/dev/null || true

# Удаление старых ядер и пакетов
echo -e "${YELLOW}🧹 Удаление старых пакетов...${NC}"
sudo apt autoremove --purge -y

# Проверка свободного места
echo -e "${GREEN}📊 Проверка свободного места:${NC}"
df -h

echo ""
echo -e "${GREEN}✅ СЕРВЕР ПОЛНОСТЬЮ ОЧИЩЕН!${NC}"
echo -e "${GREEN}✅ Готов к новому развертыванию ЛАБОСФЕРА${NC}"
echo ""
echo -e "${BLUE}🚀 Следующий шаг: запустить deploy-timeweb.sh${NC}"