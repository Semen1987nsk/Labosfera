# ⚡ Timeweb Cloud - Шпаргалка команд

## 🚀 Быстрое развертывание (5 минут)

```bash
# 1. Подключение к серверу
ssh root@YOUR_IP

# 2. Смена пароля (ВАЖНО!)
passwd

# 3. Развертывание ЛАБОСФЕРА (одна команда)
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh -o deploy.sh && chmod +x deploy.sh && ./deploy.sh
```

---

## 🔧 Управление проектом

### Статус и мониторинг

```bash
# Быстрый статус (если установлена оптимизация)
labosfera-status

# Или вручную:
cd /opt/labosfera
docker-compose -f docker-compose.prod.yml ps
docker stats --no-stream
```

### Логи

```bash
# Все логи в реальном времени
labosfera-logs

# Или вручную:
docker-compose -f docker-compose.prod.yml logs -f

# Только backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Только nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Последние 50 строк
docker-compose -f docker-compose.prod.yml logs --tail=50
```

### Перезапуск

```bash
cd /opt/labosfera

# Все сервисы
docker-compose -f docker-compose.prod.yml restart

# Конкретный сервис
docker-compose -f docker-compose.prod.yml restart nginx
docker-compose -f docker-compose.prod.yml restart backend
docker-compose -f docker-compose.prod.yml restart frontend
```

### Остановка/Запуск

```bash
cd /opt/labosfera

# Остановить все
docker-compose -f docker-compose.prod.yml stop

# Запустить все
docker-compose -f docker-compose.prod.yml start

# Полная пересборка
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🔐 Безопасность

### Смена пароля администратора Django

```bash
cd /opt/labosfera
docker-compose -f docker-compose.prod.yml exec backend python manage.py changepassword admin
```

### Настройка firewall

```bash
# Разрешить нужные порты
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS

# Включить firewall
ufw enable

# Статус
ufw status
```

### Создание нового администратора

```bash
cd /opt/labosfera
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

---

## 💾 Резервное копирование

### Ручной бэкап

```bash
# Быстрая команда
labosfera-backup

# Или вручную
/opt/timeweb-backup.sh

# Просмотр бэкапов
ls -lh /opt/backups
```

### Восстановление из бэкапа

```bash
cd /opt/labosfera

# 1. Остановить backend
docker-compose -f docker-compose.prod.yml stop backend

# 2. Восстановить БД (замените дату)
cat /opt/backups/db_20241005_020000.sql | \
  docker-compose -f docker-compose.prod.yml exec -T db \
  psql -U labosfera labosfera

# 3. Восстановить медиа
tar -xzf /opt/backups/media_20241005_020000.tar.gz -C backend/media

# 4. Запустить backend
docker-compose -f docker-compose.prod.yml start backend
```

---

## 🔒 SSL сертификаты

### Обновление SSL

```bash
cd /opt/labosfera

# Обновить сертификат
docker-compose -f docker-compose.prod.yml run --rm certbot renew

# Перезапустить nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Проверка SSL

```bash
# Проверка сертификата
openssl s_client -connect labosfera.ru:443 -servername labosfera.ru

# Дата истечения
echo | openssl s_client -connect labosfera.ru:443 2>/dev/null | \
  openssl x509 -noout -dates
```

---

## 📊 Мониторинг и диагностика

### Использование ресурсов

```bash
# CPU, RAM, диск
htop
# Выход: q

# Использование диска
df -h

# Docker контейнеры
docker stats

# Топ процессов по памяти
ps aux --sort=-%mem | head -10

# Топ процессов по CPU
ps aux --sort=-%cpu | head -10
```

### Сетевая статистика

```bash
# Активные соединения
netstat -an | grep ESTABLISHED | wc -l

# HTTP соединения
netstat -an | grep :80 | grep ESTABLISHED | wc -l

# HTTPS соединения
netstat -an | grep :443 | grep ESTABLISHED | wc -l

# Использование сети
nethogs
# Выход: q
```

### База данных

```bash
cd /opt/labosfera

# Подключение к PostgreSQL
docker-compose -f docker-compose.prod.yml exec db psql -U labosfera -d labosfera

# Внутри PostgreSQL:
# Размер базы
SELECT pg_size_pretty(pg_database_size('labosfera'));

# Список таблиц
\dt

# Количество товаров
SELECT COUNT(*) FROM catalog_product;

# Количество заказов
SELECT COUNT(*) FROM orders_order;

# Выход
\q
```

---

## 🧹 Очистка и оптимизация

### Ручная очистка

```bash
# Быстрая команда
labosfera-cleanup

# Или вручную:
/opt/timeweb-cleanup.sh
```

### Очистка Docker

```bash
# Удалить неиспользуемые образы, контейнеры, тома
docker system prune -af --volumes

# Только образы
docker image prune -a

# Только контейнеры
docker container prune
```

### Очистка логов

```bash
# Очистить логи Docker
truncate -s 0 /var/lib/docker/containers/*/*-json.log

# Очистить логи проекта
find /opt/labosfera -name "*.log" -exec truncate -s 0 {} \;

# Очистить системные логи
journalctl --vacuum-time=7d
```

---

## 🔄 Обновление проекта

### Из GitHub

```bash
cd /opt/labosfera

# Обновить код
git pull origin main

# Пересобрать и перезапустить
docker-compose -f docker-compose.prod.yml up -d --build

# Применить миграции
docker-compose -f docker-compose.prod.yml exec backend \
  python manage.py migrate --settings=labosfera_project.settings_prod
```

### Скрипт обновления

```bash
cd /opt/labosfera
./update.sh
```

---

## ⚙️ Настройка окружения

### Редактирование .env.prod

```bash
cd /opt/labosfera
nano .env.prod

# Сохранение: Ctrl+X, Y, Enter
```

### Применение изменений

```bash
cd /opt/labosfera

# Перезапустить с новыми настройками
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🚀 Оптимизация для Timeweb Cloud

### Запуск оптимизации

```bash
# Скачать и запустить скрипт
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/timeweb-optimize.sh -o timeweb-optimize.sh
chmod +x timeweb-optimize.sh
./timeweb-optimize.sh
```

### Что будет оптимизировано:

```
✅ SWAP файл (для 2GB RAM)
✅ Параметры ядра Linux
✅ Системные лимиты
✅ Docker конфигурация
✅ Автоматическая очистка (cron)
✅ Автоматический бэкап (cron)
✅ Мониторинг
✅ Быстрые команды
```

---

## 📱 Быстрые проверки

### Работает ли сайт?

```bash
# Локально на сервере
curl -I http://localhost

# Извне
curl -I https://labosfera.ru

# Время ответа
curl -w "@-" -o /dev/null -s https://labosfera.ru << 'EOF'
time_total: %{time_total}s\n
EOF
```

### Работает ли база данных?

```bash
cd /opt/labosfera
docker-compose -f docker-compose.prod.yml exec db psql -U labosfera -d labosfera -c "SELECT 1;"
# Должно вернуть: 1
```

### Работает ли backend?

```bash
curl http://localhost:8000/api/
# Должно вернуть JSON
```

---

## 🆘 Решение проблем

### Сайт не открывается

```bash
# 1. Проверить статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# 2. Посмотреть логи nginx
docker-compose -f docker-compose.prod.yml logs nginx

# 3. Перезапустить
docker-compose -f docker-compose.prod.yml restart
```

### Ошибка 502 Bad Gateway

```bash
# 1. Проверить backend
docker-compose -f docker-compose.prod.yml logs backend

# 2. Проверить доступность
curl http://localhost:8000/api/

# 3. Перезапустить backend
docker-compose -f docker-compose.prod.yml restart backend
```

### База данных не работает

```bash
# 1. Проверить статус
docker-compose -f docker-compose.prod.yml ps db

# 2. Логи
docker-compose -f docker-compose.prod.yml logs db

# 3. Перезапустить
docker-compose -f docker-compose.prod.yml restart db
```

### Закончилось место на диске

```bash
# 1. Проверить использование
df -h

# 2. Найти большие файлы
du -h /opt/labosfera | sort -rh | head -20

# 3. Очистить Docker
docker system prune -af --volumes

# 4. Очистить логи
labosfera-cleanup
```

---

## 📊 Панель управления Timeweb Cloud

### Вход

```
URL: https://timeweb.cloud/
Логин: ваш_email
Пароль: ваш_пароль
```

### Полезные разделы

```
📊 Мониторинг
   └─> CPU, RAM, диск, сеть в реальном времени

💾 Snapshots
   └─> Создание и восстановление снимков

🌐 Сеть
   └─> Firewall, IP адреса

🔐 SSH ключи
   └─> Управление доступом

💳 Биллинг
   └─> Оплата, история, баланс
```

---

## 🎯 Быстрые ссылки

### Сайт

```
🌐 Главная:    https://labosfera.ru
👑 Админка:    https://labosfera.ru/admin/
📊 API:        https://labosfera.ru/api/
```

### Логины по умолчанию

```
Django Admin:
  Логин:  admin
  Пароль: admin123
  
⚠️ ОБЯЗАТЕЛЬНО смените после первого входа!
```

### Поддержка Timeweb

```
📧 Email:   support@timeweb.cloud
💬 Чат:     https://timeweb.cloud/ (справа внизу)
📞 Телефон: 8 (800) 700-06-08
🕐 Режим:   24/7
```

---

## 📚 Документация

### Основные файлы

```
📖 README.md                       - Общее описание
🚀 TIMEWEB_CLOUD_DEPLOYMENT.md     - Полное руководство (ЭТО!)
⚡ TIMEWEB_QUICK_START.md          - Быстрый старт
🏆 TIMEWEB_CLOUD_PERFECT.md        - Почему Timeweb
📊 TIMEWEB_VS_COMPETITORS.md       - Сравнение с конкурентами
👑 ADMIN_GUIDE.md                  - Руководство администратора
💡 ADMIN_QUICK_REFERENCE.md        - Быстрые команды админа
```

### Скрипты

```
🚀 deploy.sh              - Автоматическое развертывание
⚡ timeweb-optimize.sh    - Оптимизация для Timeweb
🔄 update.sh              - Обновление проекта
💾 /opt/timeweb-backup.sh - Резервное копирование
🧹 /opt/timeweb-cleanup.sh - Очистка системы
```

---

## 💡 Полезные советы

### 1. Алиасы команд

Добавьте в `~/.bashrc`:

```bash
# ЛАБОСФЕРА алиасы
alias lab='cd /opt/labosfera'
alias labps='cd /opt/labosfera && docker-compose -f docker-compose.prod.yml ps'
alias lablogs='cd /opt/labosfera && docker-compose -f docker-compose.prod.yml logs -f'
alias labrestart='cd /opt/labosfera && docker-compose -f docker-compose.prod.yml restart'
alias labstatus='docker stats --no-stream'
```

Применить: `source ~/.bashrc`

### 2. Мониторинг в реальном времени

```bash
# В одном окне - логи
watch -n 1 'docker stats --no-stream'

# В другом - статус
watch -n 5 'docker-compose -f /opt/labosfera/docker-compose.prod.yml ps'
```

### 3. Быстрая проверка здоровья

```bash
# Создать скрипт
cat > /usr/local/bin/labcheck << 'EOF'
#!/bin/bash
echo "🔍 Проверка ЛАБОСФЕРА..."
echo ""
echo "✅ Сайт доступен:"
curl -s -o /dev/null -w "  Status: %{http_code}\n  Time: %{time_total}s\n" https://labosfera.ru
echo ""
echo "✅ Контейнеры:"
docker-compose -f /opt/labosfera/docker-compose.prod.yml ps | grep Up | wc -l | xargs echo "  Работает:"
echo ""
echo "✅ Диск:"
df -h / | awk 'NR==2 {print "  Свободно: "$4}'
echo ""
echo "✅ RAM:"
free -h | awk 'NR==2 {print "  Свободно: "$7}'
EOF

chmod +x /usr/local/bin/labcheck

# Использование
labcheck
```

---

## 🎉 Готово!

Теперь у вас есть все необходимые команды для управления ЛАБОСФЕРА на Timeweb Cloud!

**Самые важные команды:**
```bash
labosfera-status   # Статус системы
labosfera-logs     # Логи в реальном времени
labosfera-backup   # Создать бэкап
labcheck           # Быстрая проверка
```

**Помощь:**
- 📖 Документация в `/opt/labosfera/`
- 💬 Поддержка Timeweb: 8 (800) 700-06-08

---

**Версия:** 1.0  
**Дата:** 05.10.2024  
**Платформа:** Timeweb Cloud
