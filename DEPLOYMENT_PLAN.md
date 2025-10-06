# 🚀 План развертывания Labosfera на Timeweb Cloud

## Текущее состояние

✅ Все изменения совместимы с продакшеном:
- Добавлен DATABASE_URL (нужен для работы)
- SSL настройки работают корректно (включаются только когда DEBUG=False)
- localhost добавлен в next.config.mjs (не помешает продакшену)

## 📝 ШАГ 1: Подготовка .env файлов для продакшена

### 1.1 Создать .env для продакшена (корень проекта)

Нужно создать файл `/workspaces/Labosfera/.env.production` на основе `.env.prod.example`:

```bash
cp .env.prod.example .env.production
```

Затем отредактировать:

```env
# Django Settings
DJANGO_SECRET_KEY=<СГЕНЕРИРОВАТЬ_НОВЫЙ_ДЛИННЫЙ_КЛЮЧ>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=labosfera.ru,www.labosfera.ru,<IP_СЕРВЕРА>

# Database Configuration (PostgreSQL в Docker)
DB_NAME=labosfera_production
DB_USER=labosfera_prod_user
DB_PASSWORD=<СЛОЖНЫЙ_ПАРОЛЬ>
DB_HOST=db
DB_PORT=5432
DATABASE_URL=postgresql://labosfera_prod_user:<СЛОЖНЫЙ_ПАРОЛЬ>@db:5432/labosfera_production

# PostgreSQL Environment Variables
POSTGRES_DB=labosfera_production
POSTGRES_USER=labosfera_prod_user
POSTGRES_PASSWORD=<СЛОЖНЫЙ_ПАРОЛЬ>

# CORS и домен
CORS_ALLOWED_ORIGINS=https://labosfera.ru,https://www.labosfera.ru
CSRF_TRUSTED_ORIGINS=https://labosfera.ru,https://www.labosfera.ru

# Frontend URL
NEXT_PUBLIC_API_URL=https://labosfera.ru
NEXT_PUBLIC_SITE_URL=https://labosfera.ru

# Telegram Notifications (опционально)
TELEGRAM_BOT_TOKEN=<ВАШ_ТОКЕН>
TELEGRAM_CHAT_ID=<ВАШ_CHAT_ID>
```

### 1.2 НЕ добавлять .env.production в git!

```bash
echo ".env.production" >> .gitignore
```

## 📝 ШАГ 2: Подготовка сервера Timeweb

### 2.1 Подключиться к серверу по SSH

Из скриншота вижу, что у вас сервер с IP. Подключитесь:

```bash
ssh root@<IP_АДРЕС_СЕРВЕРА>
```

### 2.2 Установить Docker и Docker Compose (если еще не установлены)

```bash
# Обновить систему
apt update && apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установить Docker Compose
apt install docker-compose -y

# Проверить установку
docker --version
docker-compose --version
```

### 2.3 Установить Git

```bash
apt install git -y
```

## 📝 ШАГ 3: Клонирование проекта на сервер

```bash
# Перейти в директорию для проектов
cd /opt

# Клонировать репозиторий
git clone https://github.com/Semen1987nsk/Labosfera.git
cd Labosfera

# Переключиться на нужный коммит (b766c28)
git checkout a184399
```

## 📝 ШАГ 4: Настройка окружения на сервере

### 4.1 Создать .env файл на сервере

```bash
nano .env.production
# Вставить содержимое из ШАГа 1.1
# Сохранить: Ctrl+O, Enter, Ctrl+X
```

### 4.2 Скопировать .env в нужные места

```bash
# Для backend
cp .env.production backend/.env

# Для docker-compose (корень)
cp .env.production .env
```

## 📝 ШАГ 5: Сборка и запуск с помощью docker-compose.simple.yml

### 5.1 Запустить контейнеры

```bash
# Запустить в фоновом режиме
docker-compose -f docker-compose.simple.yml up -d

# Проверить статус
docker-compose -f docker-compose.simple.yml ps

# Посмотреть логи
docker-compose -f docker-compose.simple.yml logs -f
```

### 5.2 Применить миграции БД

```bash
docker-compose -f docker-compose.simple.yml exec backend python manage.py migrate
```

### 5.3 Собрать статические файлы

```bash
docker-compose -f docker-compose.simple.yml exec backend python manage.py collectstatic --no-input
```

### 5.4 Создать суперпользователя

```bash
docker-compose -f docker-compose.simple.yml exec backend python manage.py createsuperuser
```

## 📝 ШАГ 6: Настройка Nginx на хосте (если нужно)

Timeweb обычно предоставляет панель управления. Там нужно:

1. Указать домен labosfera.ru
2. Настроить SSL сертификат (Let's Encrypt)
3. Проксировать запросы на порт 80 (где nginx из docker-compose.simple.yml)

Или настроить через конфигурацию Nginx на хосте:

```bash
nano /etc/nginx/sites-available/labosfera.ru
```

```nginx
server {
    listen 80;
    server_name labosfera.ru www.labosfera.ru;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/labosfera.ru /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Установить SSL
apt install certbot python3-certbot-nginx -y
certbot --nginx -d labosfera.ru -d www.labosfera.ru
```

## 📝 ШАГ 7: Проверка работы

### 7.1 Проверить доступность

```bash
curl http://localhost/api/v1/products/
```

### 7.2 Открыть в браузере

- Главная: https://labosfera.ru
- Админка: https://labosfera.ru/admin/
- API: https://labosfera.ru/api/v1/products/

## 📝 ШАГ 8: Автоматическое обновление (опционально)

Создать скрипт для быстрого обновления:

```bash
nano /opt/Labosfera/update.sh
```

```bash
#!/bin/bash
cd /opt/Labosfera

# Остановить контейнеры
docker-compose -f docker-compose.simple.yml down

# Обновить код
git pull origin main

# Пересобрать и запустить
docker-compose -f docker-compose.simple.yml up -d --build

# Применить миграции
docker-compose -f docker-compose.simple.yml exec backend python manage.py migrate

# Собрать статику
docker-compose -f docker-compose.simple.yml exec backend python manage.py collectstatic --no-input

echo "Обновление завершено!"
```

```bash
chmod +x /opt/Labosfera/update.sh
```

## 🔧 Полезные команды на сервере

```bash
# Просмотр логов
docker-compose -f docker-compose.simple.yml logs -f backend
docker-compose -f docker-compose.simple.yml logs -f frontend
docker-compose -f docker-compose.simple.yml logs -f nginx

# Перезапуск сервисов
docker-compose -f docker-compose.simple.yml restart backend
docker-compose -f docker-compose.simple.yml restart frontend

# Остановка всех контейнеров
docker-compose -f docker-compose.simple.yml down

# Полная пересборка
docker-compose -f docker-compose.simple.yml up -d --build --force-recreate

# Вход в контейнер
docker-compose -f docker-compose.simple.yml exec backend bash
docker-compose -f docker-compose.simple.yml exec frontend sh

# Очистка Docker (если мало места)
docker system prune -a
```

## ⚠️ Важные моменты

1. **Секреты:** DJANGO_SECRET_KEY должен быть длинным (50+ символов) и уникальным
2. **Пароли:** Используйте сложные пароли для БД
3. **Backup:** Настройте регулярный бэкап БД PostgreSQL
4. **Логи:** Регулярно проверяйте логи на ошибки
5. **Мониторинг:** Настройте мониторинг доступности сайта

## 📊 Чеклист перед запуском

- [ ] Создан .env.production с правильными настройками
- [ ] DJANGO_SECRET_KEY сгенерирован и уникален
- [ ] DEBUG=False в продакшене
- [ ] ALLOWED_HOSTS содержит правильные домены
- [ ] SSL сертификат установлен
- [ ] База данных создана и миграции применены
- [ ] Статические файлы собраны
- [ ] Суперпользователь создан
- [ ] Домен указывает на IP сервера (DNS A-запись)
- [ ] Firewall настроен (порты 80, 443, 22)
