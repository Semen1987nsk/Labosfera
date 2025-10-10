# 📚 УРОКИ ДЕПЛОЯ 10 ОКТЯБРЯ 2025

## 🔴 ПРОБЛЕМЫ, С КОТОРЫМИ СТОЛКНУЛИСЬ

### 1. Docker Compose конфликт контейнеров
**Проблема:** При попытке `docker-compose up -d frontend` пытался пересоздать DB контейнер и выдал ошибку `KeyError: 'ContainerConfig'`.

**Причина:** Старые остановленные контейнеры мешали новым.

**Решение:** Использовать флаг `--no-deps` чтобы не трогать зависимости:
```bash
docker-compose -f docker-compose.prod.yml up -d --no-deps frontend
```

---

### 2. Nginx не видел новый IP контейнера
**Проблема:** Frontend перезапустился с новым IP (172.19.0.2), но Nginx кэшировал старый (172.19.0.4). Результат: 502 Bad Gateway.

**Причина:** Nginx резолвит DNS имена контейнеров один раз при старте.

**Решение:** Нужно перезапустить Nginx после пересоздания контейнеров:
```bash
docker-compose -f docker-compose.prod.yml restart nginx
```

**Лучшее решение:** Использовать переменные для upstream с `resolver`:
```nginx
resolver 127.0.0.11 valid=10s;  # Docker DNS
set $backend_upstream backend:8000;
proxy_pass http://$backend_upstream;
```

---

### 3. Полный перезапуск вместо частичного
**Проблема:** Из-за проблем с DNS пришлось делать `docker-compose down` и `up -d` всех контейнеров.

**Последствия:** 
- Downtime ~1 минута вместо 10 секунд
- Перезапуск базы данных (риск потери данных если были активные транзакции)
- Перезапуск backend (потеря активных сессий)

**Решение:** Нужен более надежный метод обновления только frontend.

---

## ✅ ЧТО НУЖНО ИСПРАВИТЬ ДЛЯ БУДУЩИХ ДЕПЛОЕВ

### 1. Улучшить Nginx конфигурацию
**Файл:** `/workspaces/Labosfera/nginx/nginx.conf`

**Добавить:**
```nginx
http {
    # Docker DNS resolver
    resolver 127.0.0.11 valid=10s ipv6=off;
    resolver_timeout 5s;
    
    # Переменные для upstream
    upstream backend {
        server backend:8000 max_fails=3 fail_timeout=30s;
    }
    
    upstream frontend {
        server frontend:3000 max_fails=3 fail_timeout=30s;
    }
}
```

**Зачем:** Nginx будет переразрешивать DNS каждые 10 секунд и автоматически найдет новый IP.

---

### 2. Создать скрипт безопасного деплоя frontend
**Файл:** `/workspaces/Labosfera/deploy-frontend-only.sh`

```bash
#!/bin/bash
set -e

echo "=== БЕЗОПАСНЫЙ ДЕПЛОЙ FRONTEND ==="
echo ""

# 1. Проверка что мы на сервере
if [ ! -d "/root/Labosfera" ]; then
    echo "❌ Ошибка: запускайте на production сервере!"
    exit 1
fi

cd /root/Labosfera

# 2. Скачать свежий код
echo "📥 Скачивание обновлений..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Ошибка git pull"
    exit 1
fi

# 3. Пересобрать frontend образ
echo "🔨 Пересборка frontend..."
docker-compose -f docker-compose.prod.yml build frontend
if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки"
    exit 1
fi

# 4. Остановить старый frontend
echo "⏸️  Остановка старого frontend..."
docker-compose -f docker-compose.prod.yml stop frontend
docker-compose -f docker-compose.prod.yml rm -f frontend

# 5. Запустить новый frontend (БЕЗ пересоздания зависимостей!)
echo "🚀 Запуск нового frontend..."
docker-compose -f docker-compose.prod.yml up -d --no-deps frontend

# 6. Подождать пока frontend запустится
echo "⏳ Ожидание запуска (15 сек)..."
sleep 15

# 7. Проверить что frontend работает
echo "🔍 Проверка..."
if docker exec labosfera_frontend_1 curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend работает!"
else
    echo "⚠️ Frontend не отвечает, проверьте логи"
    docker logs labosfera_frontend_1 --tail 50
fi

# 8. Перезагрузить Nginx для обновления DNS
echo "🔄 Перезагрузка Nginx..."
docker-compose -f docker-compose.prod.yml restart nginx

# 9. Финальная проверка через Nginx
sleep 5
echo "🌐 Проверка через Nginx..."
if curl -s -o /dev/null -w "%{http_code}" https://labosfera.ru | grep -q "200"; then
    echo "✅ Сайт доступен!"
    echo ""
    echo "🎉 ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!"
else
    echo "❌ Сайт не доступен через Nginx!"
    echo "Логи Nginx:"
    docker logs labosfera_nginx_1 --tail 20
    exit 1
fi

echo ""
echo "📊 Статус контейнеров:"
docker ps --format 'table {{.Names}}\t{{.Status}}'
```

---

### 3. Добавить health checks в docker-compose
**Файл:** `/workspaces/Labosfera/docker-compose.prod.yml`

**Добавить в frontend:**
```yaml
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: always
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    depends_on:
      backend:
        condition: service_healthy
```

**Добавить в backend:**
```yaml
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile.prod
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    depends_on:
      db:
        condition: service_healthy
```

**Зачем:** Docker Compose будет ждать пока сервис станет healthy перед запуском следующего.

---

### 4. Создать скрипт отката (rollback)
**Файл:** `/workspaces/Labosfera/rollback-frontend.sh`

```bash
#!/bin/bash
set -e

echo "=== ОТКАТ FRONTEND К ПРЕДЫДУЩЕЙ ВЕРСИИ ==="
echo ""

cd /root/Labosfera

# 1. Откатить код на 1 коммит назад
echo "⏪ Откат кода..."
git log --oneline -5
echo ""
read -p "Откатить на предыдущий коммит? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git reset --hard HEAD~1
    
    # 2. Пересобрать и запустить
    ./deploy-frontend-only.sh
    
    echo "✅ Откат завершен!"
else
    echo "❌ Откат отменен"
fi
```

---

### 5. Улучшить .env файл
**Добавить переменные:**
```bash
# Деплой настройки
COMPOSE_PROJECT_NAME=labosfera
COMPOSE_FILE=docker-compose.prod.yml

# Для логирования
DOCKER_LOGGING_DRIVER=json-file
DOCKER_LOGGING_MAX_SIZE=10m
DOCKER_LOGGING_MAX_FILE=3
```

---

### 6. Настроить автоматические бэкапы ПЕРЕД деплоем
**Файл:** `/workspaces/Labosfera/backup-before-deploy.sh`

```bash
#!/bin/bash
set -e

echo "=== BACKUP ПЕРЕД ДЕПЛОЕМ ==="

BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 1. Backup базы данных
echo "💾 Backup базы данных..."
docker exec labosfera_db_1 pg_dump -U postgres labosfera_db | gzip > $BACKUP_DIR/db_before_deploy_$DATE.sql.gz

# 2. Backup Docker образов (на случай быстрого отката)
echo "📦 Backup Docker образа frontend..."
docker commit labosfera_frontend_1 labosfera_frontend:backup_$DATE

echo "✅ Backup завершен!"
echo "   DB: $BACKUP_DIR/db_before_deploy_$DATE.sql.gz"
echo "   Image: labosfera_frontend:backup_$DATE"
echo ""

# Удалить бэкапы старше 7 дней
find $BACKUP_DIR -name "db_before_deploy_*.sql.gz" -mtime +7 -delete
docker images | grep "labosfera_frontend:backup_" | awk '{print $2}' | tail -n +8 | xargs -r docker rmi labosfera_frontend:backup_
```

---

### 7. Создать мастер-скрипт полного деплоя
**Файл:** `/workspaces/Labosfera/deploy-safe.sh`

```bash
#!/bin/bash
set -e

echo "╔═══════════════════════════════════════╗"
echo "║   БЕЗОПАСНЫЙ ДЕПЛОЙ LABOSFERA.RU     ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# 1. Проверка подключения
echo "🔍 Проверка текущего состояния..."
if ! curl -s -o /dev/null -w "%{http_code}" https://labosfera.ru | grep -q "200"; then
    echo "❌ Сайт сейчас не доступен! Отмена деплоя."
    exit 1
fi
echo "✅ Сайт работает"
echo ""

# 2. Backup
./backup-before-deploy.sh

# 3. Спросить что деплоим
echo "Что обновляем?"
echo "1) Только frontend"
echo "2) Только backend"
echo "3) Всё (frontend + backend)"
read -p "Выбор (1-3): " choice

case $choice in
    1)
        ./deploy-frontend-only.sh
        ;;
    2)
        ./deploy-backend-only.sh
        ;;
    3)
        ./deploy-full.sh
        ;;
    *)
        echo "❌ Неверный выбор"
        exit 1
        ;;
esac

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║          ДЕПЛОЙ ЗАВЕРШЕН              ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "🔗 Проверьте: https://labosfera.ru"
```

---

## 📋 ЧЕКЛИСТ ПЕРЕД ДЕПЛОЕМ

```markdown
### Перед деплоем:
- [ ] Протестировано локально
- [ ] Код залит в GitHub (git push)
- [ ] Проверен текущий статус сайта (доступен)
- [ ] Создан backup БД
- [ ] Уведомлены пользователи (если большой downtime)

### Во время деплоя:
- [ ] Git pull на сервере
- [ ] Build новых образов
- [ ] Остановка старых контейнеров
- [ ] Запуск новых контейнеров
- [ ] Перезагрузка Nginx
- [ ] Проверка логов

### После деплоя:
- [ ] Сайт доступен (HTTP 200)
- [ ] Все страницы работают
- [ ] Формы отправляются
- [ ] Cookie banner работает
- [ ] API возвращает данные
- [ ] Нет ошибок в логах
- [ ] Мониторинг: все контейнеры Up

### При проблемах:
- [ ] Проверить логи: `docker logs <container>`
- [ ] Проверить сеть: `docker network inspect`
- [ ] Откатиться: `./rollback-frontend.sh`
- [ ] Восстановить из backup если нужно
```

---

## 🎯 ПРИОРИТЕТЫ НА БУДУЩЕЕ

### 🔴 Критично (сделать сегодня):
1. ✅ Создать `deploy-frontend-only.sh`
2. ✅ Создать `backup-before-deploy.sh`
3. ⚠️ Добавить health checks в docker-compose.prod.yml

### 🟡 Важно (на этой неделе):
4. Улучшить Nginx конфигурацию (resolver)
5. Создать `rollback-frontend.sh`
6. Создать `deploy-safe.sh` (мастер-скрипт)
7. Настроить автоматические ежедневные бэкапы (cron)

### 🟢 Желательно (в следующем месяце):
8. Настроить CI/CD (GitHub Actions)
9. Добавить smoke tests после деплоя
10. Настроить мониторинг (Prometheus + Grafana)
11. Добавить Slack/Telegram уведомления о деплоях

---

## 💡 ДОПОЛНИТЕЛЬНЫЕ РЕКОМЕНДАЦИИ

### 1. Zero-downtime deployment
Для деплоя вообще без downtime нужно:
- Запустить новый frontend контейнер с другим именем
- Дождаться пока он станет healthy
- Переключить Nginx на новый контейнер
- Удалить старый контейнер

**Сложность:** Высокая, нужно переписывать docker-compose

---

### 2. Blue-Green Deployment
Держать 2 полных окружения:
- **Blue** (текущая версия) - работает
- **Green** (новая версия) - деплоим и тестируем
- Переключаем Nginx на Green
- При проблемах - переключаем обратно на Blue

**Сложность:** Высокая, нужно в 2 раза больше ресурсов

---

### 3. Canary Deployment
Постепенно переводить трафик на новую версию:
- 10% пользователей на новую версию
- Проверяем метрики
- 50% пользователей
- Проверяем метрики
- 100% пользователей

**Сложность:** Очень высокая, нужен load balancer

---

## 📊 ИТОГОВАЯ ОЦЕНКА ТЕКУЩЕГО ДЕПЛОЯ

| Критерий | Текущее состояние | После улучшений |
|----------|-------------------|-----------------|
| **Downtime** | ~60 секунд | ~10 секунд |
| **Безопасность** | 6/10 (нет backup) | 9/10 (с backup) |
| **Надежность** | 7/10 | 9/10 |
| **Скорость** | 8/10 | 9/10 |
| **Откат** | Вручную | Автоматический |
| **Мониторинг** | Нет | Есть (health checks) |

---

**Подготовил:** AI DevOps Engineer  
**Дата:** 10 октября 2025 г.  
**Основано на:** Реальном деплое с проблемами и их решениями
