# 🚀 Быстрые команды для развертывания на Timeweb

## На сервере выполните последовательно:

```bash
# 1. Перейдите в директорию проекта
cd /root/Labosfera

# 2. Обновите код с GitHub
git pull origin main

# 3. Запустите скрипт полной переустановки
./fresh-deploy-timeweb.sh
```

## Или полная переустановка с нуля:

```bash
# Удалить всё и начать заново
cd /root
rm -rf Labosfera
git clone https://github.com/Semen1987nsk/Labosfera.git
cd Labosfera
./fresh-deploy-timeweb.sh
```

## После установки проверьте:

```bash
# Статус контейнеров
docker-compose -f docker-compose.simple.yml ps

# Логи всех сервисов
docker-compose -f docker-compose.simple.yml logs -f

# Логи только backend
docker-compose -f docker-compose.simple.yml logs backend

# Логи только frontend
docker-compose -f docker-compose.simple.yml logs frontend

# Логи базы данных
docker-compose -f docker-compose.simple.yml logs db
```

## Полезные команды:

```bash
# Перезапустить все контейнеры
docker-compose -f docker-compose.simple.yml restart

# Пересобрать и перезапустить backend
docker-compose -f docker-compose.simple.yml up -d --build backend

# Зайти в контейнер backend
docker-compose -f docker-compose.simple.yml exec backend bash

# Выполнить миграции Django
docker-compose -f docker-compose.simple.yml exec backend python manage.py migrate

# Создать суперпользователя
docker-compose -f docker-compose.simple.yml exec backend python manage.py createsuperuser

# Очистить всё и удалить
docker-compose -f docker-compose.simple.yml down -v
docker system prune -af
```

## Проверка работы сайта:

- **Frontend:** http://labosfera.ru
- **Backend API:** http://labosfera.ru/api/
- **Admin:** http://labosfera.ru/api/admin/
- **Health Check:** http://labosfera.ru/api/health/

## Если что-то пошло не так:

```bash
# Смотрим что не работает
docker ps -a

# Читаем логи проблемного контейнера
docker logs <container_name>

# Полная переустановка
./fresh-deploy-timeweb.sh
```
