#!/bin/bash
# ============================================
# КОМАНДЫ ДЛЯ КОПИРОВАНИЯ - Развертывание Labosfera
# IP: 109.73.192.44
# Домен: labosfera.ru
# ============================================

# ============================================
# БЛОК 1: На локальной машине
# ============================================

# Скопировать .env на сервер
scp .env.production root@109.73.192.44:/root/.env.labosfera

# ============================================
# БЛОК 2: На сервере - Подготовка
# ============================================

# Подключиться к серверу
ssh root@109.73.192.44

# Обновить систему
apt update && apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# Установить Docker Compose и Git
apt install docker-compose git -y

# Проверить версии
docker --version && docker-compose --version && git --version

# ============================================
# БЛОК 3: Клонирование проекта
# ============================================

# Клонировать
cd /opt
git clone https://github.com/Semen1987nsk/Labosfera.git
cd Labosfera
git checkout 55d1acd

# Проверить SSL сертификаты
ls -la nginx/ssl/

# ============================================
# БЛОК 4: Настройка .env
# ============================================

# Скопировать .env
cp /root/.env.labosfera /opt/Labosfera/.env
cp /opt/Labosfera/.env /opt/Labosfera/backend/.env

# Проверить содержимое
head -5 /opt/Labosfera/.env

# ============================================
# БЛОК 5: Запуск проекта
# ============================================

# Запустить все контейнеры (ЗАЙМЕТ 5-10 МИНУТ!)
cd /opt/Labosfera
docker-compose -f docker-compose.prod.yml up -d --build

# Смотреть логи (Ctrl+C для выхода)
docker-compose -f docker-compose.prod.yml logs -f

# ============================================
# БЛОК 6: Настройка базы данных
# ============================================

# Применить миграции
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Собрать статику
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --no-input

# Создать суперпользователя (ИНТЕРАКТИВНО)
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# ============================================
# БЛОК 7: Проверка
# ============================================

# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Проверить API
curl http://localhost/api/v1/products/

# Проверить HTTPS
curl -I https://labosfera.ru

# ============================================
# БЛОК 8: Полезные команды
# ============================================

# Логи
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f nginx

# Перезапуск
docker-compose -f docker-compose.prod.yml restart

# Остановка
docker-compose -f docker-compose.prod.yml down

# Полная пересборка
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate

# Использование ресурсов
docker stats

# Backup БД
docker-compose -f docker-compose.prod.yml exec db pg_dump -U labosfera_prod_user labosfera_production > backup_$(date +%Y%m%d).sql

# ============================================
# ГОТОВО!
# ============================================
# Сайт: https://labosfera.ru
# Админка: https://labosfera.ru/admin/
# API: https://labosfera.ru/api/v1/products/
