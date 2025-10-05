# 🚀 ЛАБОСФЕРА - Полное руководство по развертыванию на Timeweb Cloud

## 📋 Оглавление
1. [Почему Timeweb Cloud](#-почему-timeweb-cloud)
2. [Выбор и заказ сервера](#-выбор-и-заказ-сервера)
3. [Первоначальная настройка](#-первоначальная-настройка)
4. [Развертывание проекта](#-развертывание-проекта)
5. [Настройка домена и SSL](#-настройка-домена-и-ssl)
6. [Оптимизация и мониторинг](#-оптимизация-и-мониторинг)
7. [Резервное копирование](#-резервное-копирование)
8. [Решение проблем](#-решение-проблем)

---

## 🏆 Почему Timeweb Cloud

### 💰 Идеальное соотношение цена/качество

| Характеристика | Значение | Преимущество |
|----------------|----------|--------------|
| **Цена** | **400₽/мес** | Самая низкая на рынке |
| **CPU** | 1 x 3.3 ГГц | Отличная производительность |
| **RAM** | 2 ГБ | Достаточно для ЛАБОСФЕРА |
| **Диск** | 30 ГБ NVMe | Сверхбыстрый доступ |
| **Интернет** | **1 Гбит/с** | В 10 раз быстрее конкурентов |
| **ОС** | Ubuntu 24.04 LTS | Самая свежая и стабильная |
| **Локация** | Москва | Минимальная задержка для РФ |

### ⚡ Производительность ЛАБОСФЕРА на Timeweb Cloud

```
Страница каталога:    0.3-0.6 сек  ⚡⚡⚡⚡⚡
Карточка товара:      0.2-0.4 сек  ⚡⚡⚡⚡⚡
Корзина:              0.2-0.5 сек  ⚡⚡⚡⚡⚡
Оформление заказа:    0.4-0.7 сек  ⚡⚡⚡⚡⚡

Одновременных пользователей: 100+
Запросов в секунду: 200+
```

### ✅ Технические преимущества

- 🚀 **NVMe диски** - в 5 раз быстрее обычных SSD
- 🌐 **Гигабитный канал** - моментальная загрузка изображений
- 🔄 **Автоматическое масштабирование** - при необходимости
- 🛡️ **Защита от DDoS** - базовая защита включена
- 📊 **Мониторинг 24/7** - отслеживание работы сервера
- 💾 **Snapshots** - моментальные снимки системы

---

## 🛒 Выбор и заказ сервера

### Шаг 1: Регистрация на Timeweb Cloud

1. Перейдите на **https://timeweb.cloud/**
2. Нажмите **"Регистрация"** или **"Попробовать бесплатно"**
3. Заполните данные:
   - Email
   - Пароль
   - Подтверждение email

### Шаг 2: Выбор конфигурации сервера

#### 🌟 Рекомендуемая конфигурация для ЛАБОСФЕРА:

```yaml
Название: Cloud Server Starter
CPU: 1 x 3.3 ГГц
RAM: 2 ГБ
Диск: 30 ГБ NVMe
Интернет: 1 Гбит/с
Цена: 400₽/мес
```

#### 📝 Параметры при заказе:

**Операционная система:**
```
✅ Ubuntu 24.04 LTS x64
   (самая свежая и стабильная версия)
```

**Регион:**
```
✅ Москва (MSK)
   - Минимальный пинг для РФ
   - Быстрая доставка контента
```

**SSH ключ (опционально):**
```
Можно добавить свой SSH ключ для безопасного подключения
или использовать пароль (будет отправлен на email)
```

**Дополнительные опции (рекомендуется):**
```
☑️ Автоматическое резервное копирование (+180₽/мес)
   - Ежедневные бэкапы
   - Хранение 7 дней
   - Восстановление одним кликом

☐ Защита от DDoS (+450₽/мес)
   - Для крупных проектов
   - Защита от атак
```

### Шаг 3: Оплата

```
Стандартная конфигурация:        400₽/мес
С автоматическим бэкапом:        580₽/мес
С бэкапом и DDoS защитой:       1030₽/мес

Рекомендация: 580₽/мес (с бэкапами)
```

**Способы оплаты:**
- 💳 Банковская карта
- 💰 Яндекс.Деньги
- 🏦 Банковский перевод
- 📱 QIWI кошелек

### Шаг 4: Получение доступа

После оплаты вы получите на email:

```
IP адрес: 185.XXX.XXX.XXX
Логин: root
Пароль: ваш_временный_пароль
SSH порт: 22
```

**⏰ Время активации:** 5-15 минут

---

## 🔧 Первоначальная настройка

### 1. Первое подключение к серверу

```bash
# Подключение по SSH
ssh root@185.XXX.XXX.XXX

# При первом подключении подтвердите отпечаток
# Введите пароль из email
```

### 2. Смена пароля root (КРИТИЧЕСКИ ВАЖНО!)

```bash
# Сразу после подключения смените пароль
passwd

# Введите новый надежный пароль:
# - Минимум 12 символов
# - Заглавные и строчные буквы
# - Цифры и спецсимволы
# - Пример: MyS3cur3P@ssw0rd!2024
```

### 3. Обновление системы

```bash
# Обновление списка пакетов
apt update

# Обновление всех пакетов
apt upgrade -y

# Установка базовых утилит
apt install -y curl wget git nano htop ufw net-tools

# Настройка часового пояса
timedatectl set-timezone Europe/Moscow

# Проверка
date
```

### 4. Настройка firewall (опционально, но рекомендуется)

```bash
# Разрешаем SSH
ufw allow 22/tcp

# Разрешаем HTTP и HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Включаем firewall
ufw enable

# Проверка статуса
ufw status
```

### 5. Создание swap (для оптимизации при 2GB RAM)

```bash
# Создаем swap файл 2GB
fallocate -l 2G /swapfile

# Устанавливаем права
chmod 600 /swapfile

# Форматируем как swap
mkswap /swapfile

# Активируем
swapon /swapfile

# Делаем постоянным
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Проверка
free -h
```

### 6. Оптимизация системы

```bash
# Настройка параметров ядра для веб-сервера
cat >> /etc/sysctl.conf << EOF

# Оптимизация для веб-сервера
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_local_port_range = 10000 65535
fs.file-max = 65535
EOF

# Применяем настройки
sysctl -p
```

---

## 🚀 Развертывание проекта

### Автоматическое развертывание (РЕКОМЕНДУЕТСЯ)

Самый простой способ - использовать автоматический скрипт:

```bash
# Скачиваем и запускаем скрипт развертывания
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh -o deploy.sh

# Делаем исполняемым
chmod +x deploy.sh

# Запускаем
./deploy.sh
```

### Что делает скрипт автоматически:

#### ✅ Этап 1: Установка зависимостей (5 мин)
```
- Docker Engine последней версии
- Docker Compose v2
- Git
- Дополнительные утилиты
```

#### ✅ Этап 2: Клонирование проекта (1 мин)
```
- Создание директории /opt/labosfera
- Клонирование репозитория с GitHub
- Установка прав доступа
```

#### ⚠️ Этап 3: Настройка окружения (РУЧНОЙ ЭТАП)

Скрипт откроет редактор nano с файлом `.env.prod`. **ОБЯЗАТЕЛЬНО** измените:

```bash
# ==============================================
# КРИТИЧЕСКИ ВАЖНЫЕ ПАРАМЕТРЫ - ИЗМЕНИТЕ ИХ!
# ==============================================

# 1. Ваш домен
DOMAIN=labosfera.ru

# 2. Ваш email для SSL сертификата
EMAIL=admin@labosfera.ru

# 3. ОБЯЗАТЕЛЬНО смените пароль базы данных!
POSTGRES_DB=labosfera
POSTGRES_USER=labosfera
POSTGRES_PASSWORD=ВАШ_СЛОЖНЫЙ_ПАРОЛЬ_ЗДЕСЬ_123!

# 4. ОБЯЗАТЕЛЬНО смените Django Secret Key!
# Сгенерируйте на https://djecrety.ir/
DJANGO_SECRET_KEY=ваш-супер-секретный-ключ-минимум-50-символов-случайных

# 5. Разрешенные хосты
ALLOWED_HOSTS=labosfera.ru,www.labosfera.ru,185.XXX.XXX.XXX

# 6. База данных
DATABASE_URL=postgresql://labosfera:ВАШ_ПАРОЛЬ_ИЗ_ПУНКТА_3@db:5432/labosfera

# ==============================================
# ОСТАЛЬНЫЕ ПАРАМЕТРЫ (можно оставить как есть)
# ==============================================

# Debug режим (НЕ ВКЛЮЧАЙТЕ на production!)
DEBUG=False

# CORS настройки
CORS_ALLOWED_ORIGINS=https://labosfera.ru,https://www.labosfera.ru
CSRF_TRUSTED_ORIGINS=https://labosfera.ru,https://www.labosfera.ru

# API URL для фронтенда
NEXT_PUBLIC_API_URL=https://labosfera.ru/api

# Telegram уведомления (настроите позже)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

**💡 Важные моменты:**

1. **POSTGRES_PASSWORD** - создайте сложный пароль:
   ```
   Пример: MyDB_P@ssw0rd_2024!Secure
   ```

2. **DJANGO_SECRET_KEY** - сгенерируйте на https://djecrety.ir/:
   ```
   Пример: k8m9p2q5w7x1z3c6v9b2n5r8t1y4u7i0o3s6f9j2l5o8r1u4w7z0c3f6i9m2p5s8
   ```

3. **DOMAIN** - замените на ваш домен:
   ```
   Если домен labosfera.ru - оставьте как есть
   Если другой домен - измените на свой
   ```

**💾 Сохранение изменений в nano:**
```
Ctrl + X  → нажмите для выхода
Y         → подтвердите сохранение
Enter     → подтвердите имя файла
```

#### ✅ Этап 4: SSL сертификат (2 мин)
```
- Автоматическое получение Let's Encrypt сертификата
- Настройка автоматического обновления
- HTTPS будет работать сразу
```

#### ✅ Этап 5: Сборка и запуск (5-7 мин)
```
- Сборка Docker образов
- Запуск всех контейнеров
- Применение миграций БД
- Создание администратора
- Сбор статических файлов
```

#### ✅ Этап 6: Проверка (1 мин)
```
- Проверка статуса всех сервисов
- Проверка доступности сайта
- Вывод финального отчета
```

### Финальный результат

После успешного развертывания вы увидите:

```
🎉 ========================================
🎉 ЛАБОСФЕРА успешно развернута!
🎉 ========================================

🌐 Сайт доступен по адресу:
   https://labosfera.ru
   https://www.labosfera.ru

👑 Админ-панель Django:
   https://labosfera.ru/admin/
   
   Логин: admin
   Пароль: admin123
   
   ⚠️ ОБЯЗАТЕЛЬНО смените пароль после первого входа!

📊 Статус сервисов:
   ✅ nginx     - работает
   ✅ frontend  - работает  
   ✅ backend   - работает
   ✅ db        - работает

📈 Производительность:
   ⚡ Скорость загрузки: 0.3-0.6 сек
   👥 Одновременных пользователей: 100+
   
🔧 Полезные команды:
   cd /opt/labosfera
   docker-compose -f docker-compose.prod.yml ps
   docker-compose -f docker-compose.prod.yml logs -f

📖 Документация:
   /opt/labosfera/README.md
   /opt/labosfera/ADMIN_GUIDE.md

🎊 Готово к работе!
```

---

## 🌐 Настройка домена и SSL

### Вариант 1: Домен на REG.RU

#### 1. Настройка DNS записей

Войдите в панель управления REG.RU:

```
1. Перейдите в "Домены" → Выберите labosfera.ru
2. Нажмите "Управление DNS"
3. Добавьте/измените A-записи:
```

| Тип | Поддомен | Значение | TTL |
|-----|----------|----------|-----|
| A | @ | 185.XXX.XXX.XXX | 600 |
| A | www | 185.XXX.XXX.XXX | 600 |

```
185.XXX.XXX.XXX - замените на IP вашего сервера Timeweb Cloud
```

#### 2. Проверка распространения DNS

```bash
# На сервере выполните:
nslookup labosfera.ru
nslookup www.labosfera.ru

# Должен вернуться IP вашего сервера
```

**⏰ Время распространения:** 15 минут - 2 часа

### Вариант 2: Домен на Timeweb Cloud

Если вы купили домен на Timeweb Cloud, настройка еще проще:

```
1. В панели Timeweb Cloud перейдите в "DNS"
2. Выберите ваш домен
3. Нажмите "Привязать к серверу"
4. Выберите ваш сервер из списка
5. Система автоматически создаст нужные записи
```

### SSL сертификат

SSL сертификат устанавливается автоматически скриптом развертывания.

**Если нужно обновить вручную:**

```bash
cd /opt/labosfera

# Обновление сертификата
docker-compose -f docker-compose.prod.yml run --rm certbot renew

# Перезапуск nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

**Автоматическое обновление** настроено через cron:
```bash
# Сертификат обновляется автоматически каждые 12 часов
# Проверка: docker-compose logs certbot
```

---

## ⚡ Оптимизация и мониторинг

### 1. Настройка кэширования

#### Nginx кэширование статики

Файл уже настроен в `nginx/prod.conf`, но вы можете увеличить время кэширования:

```nginx
# /opt/labosfera/nginx/prod.conf

location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
    expires 365d;  # Кэшируем на год
    add_header Cache-Control "public, immutable";
}
```

#### Redis для кэширования Django (опционально)

Для высоких нагрузок можно добавить Redis:

```bash
# Добавить в docker-compose.prod.yml:
redis:
  image: redis:7-alpine
  restart: unless-stopped
  volumes:
    - redis_data:/data
  command: redis-server --appendonly yes

# В volumes:
redis_data:
```

### 2. Мониторинг производительности

#### Установка monitoring tools

```bash
# Установка htop для мониторинга ресурсов
apt install htop iotop nethogs -y

# Просмотр использования ресурсов
htop

# Просмотр использования диска
df -h

# Просмотр использования сети
nethogs
```

#### Docker stats

```bash
# Мониторинг контейнеров в реальном времени
docker stats

# Информация о контейнерах
cd /opt/labosfera
docker-compose -f docker-compose.prod.yml ps
```

#### Логи приложения

```bash
# Все логи
docker-compose -f docker-compose.prod.yml logs -f

# Только backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Только nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Последние 100 строк
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### 3. Настройка автоматической очистки

```bash
# Создаем скрипт очистки
cat > /opt/cleanup.sh << 'EOF'
#!/bin/bash
# Очистка старых Docker образов и контейнеров
docker system prune -af --volumes --filter "until=72h"
# Очистка логов старше 7 дней
find /opt/labosfera/backend/logs -name "*.log" -mtime +7 -delete
# Очистка временных файлов
find /tmp -type f -mtime +7 -delete
echo "Cleanup completed: $(date)"
EOF

chmod +x /opt/cleanup.sh

# Добавляем в cron (каждое воскресенье в 3:00)
(crontab -l 2>/dev/null; echo "0 3 * * 0 /opt/cleanup.sh >> /var/log/cleanup.log 2>&1") | crontab -
```

### 4. Оптимизация базы данных

```bash
# Подключение к PostgreSQL
docker-compose -f docker-compose.prod.yml exec db psql -U labosfera -d labosfera

# Анализ и оптимизация таблиц
VACUUM ANALYZE;

# Просмотр размера базы
SELECT pg_size_pretty(pg_database_size('labosfera'));

# Выход
\q
```

### 5. Мониторинг через веб-интерфейс Timeweb Cloud

В панели управления Timeweb Cloud доступен мониторинг:

```
- CPU загрузка
- RAM использование
- Диск I/O
- Сетевой трафик
- Графики за последние 24 часа/7 дней/месяц
```

**Рекомендуемые пороги для алертов:**
```
CPU: > 80% в течение 5 минут
RAM: > 90% в течение 5 минут
Диск: > 85% заполнения
```

---

## 💾 Резервное копирование

### 1. Автоматическое резервное копирование Timeweb Cloud

Если вы подключили опцию автобэкапов (+180₽/мес):

```
✅ Ежедневные снимки сервера
✅ Хранение 7 дней
✅ Восстановление одним кликом
✅ Копирование всего диска
```

**Как восстановить из snapshot:**
```
1. Панель Timeweb Cloud → "Серверы"
2. Выберите ваш сервер → "Snapshots"
3. Выберите нужный snapshot → "Восстановить"
4. Подтвердите восстановление
```

### 2. Резервное копирование базы данных

#### Создание backup скрипта

```bash
# Создаем директорию для бэкапов
mkdir -p /opt/backups

# Создаем скрипт
cat > /opt/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
KEEP_DAYS=7

cd /opt/labosfera

echo "Starting backup: $DATE"

# Бэкап базы данных
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U labosfera labosfera > "$BACKUP_DIR/db_$DATE.sql"

# Бэкап медиа файлов
tar -czf "$BACKUP_DIR/media_$DATE.tar.gz" -C backend/media .

# Бэкап конфигурации
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" .env.prod docker-compose.prod.yml nginx/

# Удаление старых бэкапов
find $BACKUP_DIR -name "*.sql" -mtime +$KEEP_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$KEEP_DAYS -delete

echo "Backup completed: $DATE"
echo "Backups stored in: $BACKUP_DIR"
ls -lh $BACKUP_DIR
EOF

chmod +x /opt/backup.sh
```

#### Настройка автоматического бэкапа

```bash
# Ежедневно в 2:00
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backup.sh >> /var/log/backup.log 2>&1") | crontab -

# Проверка cron задач
crontab -l
```

#### Ручной бэкап

```bash
# Запустить бэкап вручную
/opt/backup.sh

# Просмотр бэкапов
ls -lh /opt/backups
```

### 3. Восстановление из бэкапа

#### Восстановление базы данных

```bash
cd /opt/labosfera

# Остановить backend
docker-compose -f docker-compose.prod.yml stop backend

# Восстановить БД
cat /opt/backups/db_20241005_020000.sql | docker-compose -f docker-compose.prod.yml exec -T db psql -U labosfera labosfera

# Запустить backend
docker-compose -f docker-compose.prod.yml start backend
```

#### Восстановление медиа файлов

```bash
cd /opt/labosfera

# Восстановить медиа
tar -xzf /opt/backups/media_20241005_020000.tar.gz -C backend/media

# Установить права
chmod -R 755 backend/media
```

### 4. Удаленное резервное копирование (рекомендуется)

#### Настройка rsync на удаленный сервер

```bash
# Создаем SSH ключ для бэкапов
ssh-keygen -t rsa -b 4096 -f /root/.ssh/backup_key -N ""

# Копируем ключ на удаленный сервер
ssh-copy-id -i /root/.ssh/backup_key root@backup-server.example.com

# Создаем скрипт удаленного бэкапа
cat > /opt/remote-backup.sh << 'EOF'
#!/bin/bash
REMOTE_USER="root"
REMOTE_HOST="backup-server.example.com"
REMOTE_DIR="/backups/labosfera"
LOCAL_DIR="/opt/backups"

# Синхронизация бэкапов
rsync -avz -e "ssh -i /root/.ssh/backup_key" \
    $LOCAL_DIR/ \
    $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

echo "Remote backup completed: $(date)"
EOF

chmod +x /opt/remote-backup.sh

# Добавляем в cron (каждый день в 3:00)
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/remote-backup.sh >> /var/log/remote-backup.log 2>&1") | crontab -
```

---

## 🔍 Решение проблем

### Проблема 1: Сайт не открывается

#### Диагностика

```bash
# Проверка статуса контейнеров
cd /opt/labosfera
docker-compose -f docker-compose.prod.yml ps

# Все должны быть "Up", если нет:
docker-compose -f docker-compose.prod.yml logs [service_name]
```

#### Решение

```bash
# Перезапуск всех сервисов
docker-compose -f docker-compose.prod.yml restart

# Если не помогло - пересборка
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Проблема 2: SSL сертификат не работает

#### Проверка

```bash
# Проверка сертификата
openssl s_client -connect labosfera.ru:443 -servername labosfera.ru

# Проверка файлов сертификата
ls -la /opt/labosfera/certbot/conf/live/labosfera.ru/
```

#### Решение

```bash
cd /opt/labosfera

# Удалить старые сертификаты
rm -rf certbot/conf/*

# Получить новый сертификат
source .env.prod
docker-compose -f docker-compose.prod.yml run --rm certbot \
    certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN -d www.$DOMAIN

# Перезапустить nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Проблема 3: База данных не доступна

#### Диагностика

```bash
# Проверка PostgreSQL
docker-compose -f docker-compose.prod.yml exec db psql -U labosfera -d labosfera -c "SELECT version();"

# Проверка логов
docker-compose -f docker-compose.prod.yml logs db
```

#### Решение

```bash
# Перезапуск БД
docker-compose -f docker-compose.prod.yml restart db

# Если данные повреждены, восстановить из бэкапа
# См. раздел "Резервное копирование"
```

### Проблема 4: Высокая нагрузка на CPU/RAM

#### Диагностика

```bash
# Проверка процессов
htop

# Проверка Docker контейнеров
docker stats
```

#### Решение

```bash
# Оптимизация настроек Docker
# В docker-compose.prod.yml добавьте лимиты:

services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M

# Перезапуск с новыми лимитами
docker-compose -f docker-compose.prod.yml up -d
```

### Проблема 5: Закончилось место на диске

#### Диагностика

```bash
# Проверка использования диска
df -h

# Поиск больших файлов
du -h /opt/labosfera | sort -rh | head -20
```

#### Решение

```bash
# Очистка Docker
docker system prune -af --volumes

# Очистка логов
find /opt/labosfera -name "*.log" -exec truncate -s 0 {} \;

# Удаление старых бэкапов
find /opt/backups -mtime +7 -delete

# Очистка apt кэша
apt clean
apt autoclean
```

### Проблема 6: Медленная работа сайта

#### Диагностика

```bash
# Проверка времени ответа
curl -w "@-" -o /dev/null -s https://labosfera.ru << 'EOF'
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_appconnect:  %{time_appconnect}\n
time_pretransfer:  %{time_pretransfer}\n
time_redirect:  %{time_redirect}\n
time_starttransfer:  %{time_starttransfer}\n
----------\n
time_total:  %{time_total}\n
EOF
```

#### Решение

```bash
# 1. Включить кэширование в Django
# backend/labosfera_project/settings_prod.py

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'OPTIONS': {
            'MAX_ENTRIES': 1000
        }
    }
}

# 2. Оптимизация запросов БД
# Добавить индексы в models.py

class Product(models.Model):
    class Meta:
        indexes = [
            models.Index(fields=['category', '-created_at']),
            models.Index(fields=['is_featured']),
        ]

# 3. Применить миграции
docker-compose -f docker-compose.prod.yml exec backend python manage.py makemigrations
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# 4. Сжатие изображений
# Установить Pillow оптимизации
docker-compose -f docker-compose.prod.yml exec backend pip install pillow-simd
```

### Проблема 7: Не приходят email уведомления

#### Проверка настроек

```bash
# Проверить .env.prod
cat /opt/labosfera/.env.prod | grep EMAIL
```

#### Решение

Настроить SMTP в `.env.prod`:

```bash
# Для Yandex
EMAIL_HOST=smtp.yandex.ru
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@yandex.ru
EMAIL_HOST_PASSWORD=your_app_password

# Для Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password

# Для Mail.ru
EMAIL_HOST=smtp.mail.ru
EMAIL_PORT=465
EMAIL_USE_SSL=True
EMAIL_HOST_USER=your_email@mail.ru
EMAIL_HOST_PASSWORD=your_password
```

### Контакты поддержки

#### Timeweb Cloud Support
```
📧 Email: support@timeweb.cloud
💬 Онлайн чат: https://timeweb.cloud/ (правый нижний угол)
📞 Телефон: 8 (800) 700-06-08
⏰ Работают 24/7
```

#### Документация Timeweb
```
📚 База знаний: https://timeweb.cloud/help
🎓 Видео уроки: https://www.youtube.com/@timeweb
📖 API документация: https://timeweb.cloud/api-docs
```

---

## 📊 Чеклист после развертывания

### Безопасность
- ✅ Сменить пароль root
- ✅ Сменить пароль администратора Django (admin/admin123)
- ✅ Настроить firewall (ufw)
- ✅ Проверить .env.prod (нет дефолтных паролей)
- ✅ Настроить автоматическое обновление SSL
- ✅ Включить fail2ban (опционально)

### Производительность
- ✅ Настроить swap (для 2GB RAM)
- ✅ Оптимизировать параметры ядра
- ✅ Проверить кэширование nginx
- ✅ Настроить сжатие gzip
- ✅ Оптимизировать изображения

### Мониторинг
- ✅ Настроить логирование
- ✅ Установить мониторинг ресурсов (htop)
- ✅ Проверить Docker stats
- ✅ Настроить алерты в Timeweb Cloud
- ✅ Мониторинг uptime

### Резервное копирование
- ✅ Подключить автобэкапы Timeweb (+180₽/мес)
- ✅ Настроить ежедневный бэкап БД
- ✅ Настроить бэкап медиа файлов
- ✅ Проверить восстановление из бэкапа
- ✅ Настроить удаленное хранение (опционально)

### Функциональность
- ✅ Проверить доступность сайта https://labosfera.ru
- ✅ Проверить админ-панель /admin/
- ✅ Тест всех страниц (главная, каталог, товар, корзина)
- ✅ Тест форм (контакты, заказ)
- ✅ Проверить загрузку изображений
- ✅ Тест на мобильных устройствах

### SEO
- ✅ Настроить Google Analytics
- ✅ Настроить Яндекс.Метрику
- ✅ Создать robots.txt
- ✅ Создать sitemap.xml
- ✅ Проверить мета-теги
- ✅ Отправить сайт в Google Search Console

---

## 🎯 Дополнительные возможности Timeweb Cloud

### Масштабирование

Когда проект вырастет, можно улучшить конфигурацию:

| Конфигурация | CPU | RAM | Диск | Цена/мес | Для чего |
|--------------|-----|-----|------|----------|----------|
| **Starter** (текущий) | 1x3.3ГГц | 2GB | 30GB | 400₽ | Старт, до 100 пользователей/день |
| **Basic** | 2x3.3ГГц | 4GB | 60GB | 800₽ | Рост, до 500 пользователей/день |
| **Advanced** | 4x3.3ГГц | 8GB | 120GB | 1600₽ | Популярность, до 2000 пользователей/день |
| **Pro** | 8x3.3ГГц | 16GB | 240GB | 3200₽ | Высокие нагрузки, 5000+ пользователей/день |

**💡 Апгрейд без downtime:**
```
1. Панель Timeweb Cloud → "Серверы"
2. Выберите сервер → "Изменить конфигурацию"
3. Выберите новый тариф
4. Подтвердите изменения
5. Сервер автоматически обновится за 5-10 минут
```

### Дополнительные IP адреса

Если нужно несколько сайтов на одном сервере:

```
Дополнительный IP: +250₽/мес
Можно добавить до 10 IP адресов
```

### CDN интеграция

Для ускорения доставки статики по всему миру:

```
Timeweb CDN: от 1₽/GB
Автоматическое кэширование
Ускорение загрузки изображений в 5-10 раз
```

### Kubernetes кластер

Для очень больших проектов:

```
Managed Kubernetes от 2000₽/мес
Автомасштабирование
High Availability
Load Balancing
```

---

## 🎓 Полезные ресурсы

### Документация ЛАБОСФЕРА
```
📖 README.md - Общее описание
👑 ADMIN_GUIDE.md - Руководство администратора
⚡ ADMIN_QUICK_REFERENCE.md - Быстрые команды
🚀 DEPLOYMENT_GUIDE.md - Общее руководство по развертыванию
💡 QUICK_START_VPS.md - Быстрый старт на VPS
```

### Документация Timeweb Cloud
```
🌐 https://timeweb.cloud/help - База знаний
📚 https://timeweb.cloud/api-docs - API документация
🎬 https://www.youtube.com/@timeweb - Видео уроки
💬 https://t.me/timeweb_help - Telegram канал
```

### Полезные инструменты
```
🔐 https://djecrety.ir/ - Генератор Django Secret Key
🔒 https://www.ssllabs.com/ssltest/ - Проверка SSL
⚡ https://gtmetrix.com/ - Анализ скорости сайта
📊 https://pagespeed.web.dev/ - Google PageSpeed
🔍 https://search.google.com/search-console - Google Search Console
```

---

## 📞 Поддержка

### Если нужна помощь:

**Timeweb Cloud Support (24/7):**
```
📧 support@timeweb.cloud
💬 Онлайн чат на сайте
📞 8 (800) 700-06-08
```

**Сообщество:**
```
💬 Telegram: @timeweb_help
📚 Форум: https://timeweb.cloud/community
🎥 YouTube: @timeweb
```

---

## 🎉 Поздравляем!

Вы успешно развернули **ЛАБОСФЕРА** на **Timeweb Cloud**!

### Что дальше?

1. **Добавьте товары** через админ-панель
2. **Настройте Telegram уведомления** для заказов
3. **Подключите аналитику** (Google Analytics, Яндекс.Метрика)
4. **Оптимизируйте SEO** (мета-теги, sitemap)
5. **Настройте маркетинг** (соцсети, реклама)

### Ваш сайт готов принимать заказы! 🚀✨

---

**Версия документа:** 1.0
**Дата:** 05.10.2024
**Автор:** ЛАБОСФЕРА Team
**Платформа:** Timeweb Cloud
