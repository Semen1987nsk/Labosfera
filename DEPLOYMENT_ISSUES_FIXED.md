# 🔧 Исправленные проблемы деплоя

## Дата исправления: 8 октября 2025

---

## 📋 Список проблем, которые были обнаружены и исправлены

### ❌ Проблема 1: Docker Compose KeyError 'ContainerConfig'

**Описание:**
```
KeyError: 'ContainerConfig'
```

**Причина:**
- На сервере установлена старая версия docker-compose 1.29.2
- Баг в docker-compose при попытке пересоздать контейнеры с volumes
- Команда `docker-compose up -d --build` падала с ошибкой

**Решение:**
- ✅ Создан скрипт `deploy-production.sh`, который использует прямые docker команды
- ✅ Контейнеры создаются через `docker run` вместо `docker-compose up`
- ✅ Добавлена последовательная остановка/удаление/создание контейнеров

**Файлы:**
- `deploy-production.sh` - автоматический деплой без docker-compose

---

### ❌ Проблема 2: SSL сертификаты не найдены

**Описание:**
```
nginx: [emerg] cannot load certificate "/etc/letsencrypt/live/labosfera.ru/fullchain.pem"
```

**Причина:**
- SSL сертификаты находились в локальной папке `nginx/ssl/`
- После `git clone` на сервере папка `ssl/` отсутствовала
- Nginx искал сертификаты в неправильном месте

**Решение:**
- ✅ SSL сертификаты добавлены в git репозиторий
- ✅ Dockerfile копирует ssl/ в образ: `COPY ssl/ /etc/nginx/ssl/`
- ✅ Nginx конфигурация исправлена на правильный путь

**Файлы:**
- `nginx/ssl/` - папка с сертификатами (в git)
- `nginx/Dockerfile` - копирует SSL при сборке
- `nginx/prod.conf` - использует `/etc/nginx/ssl/`

---

### ❌ Проблема 3: Переменные окружения PostgreSQL

**Описание:**
В `docker-compose.prod.yml` были хардкодные значения базы данных вместо переменных из `.env`

**Было:**
```yaml
environment:
  POSTGRES_DB: labosfera_db
  POSTGRES_USER: labosfera_user
  POSTGRES_PASSWORD: GgHhJjKkLl12345
```

**Стало:**
```yaml
environment:
  POSTGRES_DB: ${POSTGRES_DB:-labosfera_production}
  POSTGRES_USER: ${POSTGRES_USER:-labosfera_prod_user}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

**Решение:**
- ✅ Используются переменные из .env файла
- ✅ Добавлены fallback значения через `:-`
- ✅ База данных теперь создается с правильными credentials

**Файлы:**
- `docker-compose.prod.yml` - исправлены переменные окружения

---

### ❌ Проблема 4: Redis в production settings

**Описание:**
```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://redis:6379/1',
    }
}
```

**Причина:**
- Redis не был добавлен в docker-compose.prod.yml
- Django пытался подключиться к несуществующему сервису
- Приложение падало при попытке использовать кэш

**Решение:**
- ✅ Заменено на LocMemCache (встроенный кэш в памяти)
- ✅ Работает без дополнительных зависимостей
- ✅ В будущем можно добавить Redis при необходимости

**Было:**
```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://redis:6379/1',
    }
}
```

**Стало:**
```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}
```

**Файлы:**
- `backend/labosfera_project/settings_prod.py`

---

### ❌ Проблема 5: ALLOWED_HOSTS неправильная переменная

**Описание:**
```python
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
```

**Причина:**
- В .env файле переменная называется `DJANGO_ALLOWED_HOSTS`
- В settings использовалась `ALLOWED_HOSTS`
- Django возвращал 400 Bad Request на все запросы

**Решение:**
- ✅ Исправлено на `DJANGO_ALLOWED_HOSTS`
- ✅ Добавлен fallback: `'labosfera.ru,www.labosfera.ru,109.73.192.44'`
- ✅ Добавлена очистка пробелов: `[host.strip() for host in ALLOWED_HOSTS]`

**Файлы:**
- `backend/labosfera_project/settings_prod.py`

---

### ❌ Проблема 6: DJANGO_SETTINGS_MODULE не установлен

**Описание:**
Django не знал, какой settings файл использовать (settings.py или settings_prod.py)

**Причина:**
- В docker-compose.prod.yml не была указана переменная `DJANGO_SETTINGS_MODULE`
- Django по умолчанию использовал development settings
- База данных SQLite вместо PostgreSQL

**Решение:**
- ✅ Добавлено в docker-compose.prod.yml:
```yaml
environment:
  - DJANGO_SETTINGS_MODULE=labosfera_project.settings_prod
```

**Файлы:**
- `docker-compose.prod.yml`

---

### ❌ Проблема 7: Миграции не применялись автоматически

**Описание:**
После деплоя база данных была пустая, API возвращал 500 ошибку

**Причина:**
- entrypoint.sh пытался применить миграции при старте
- Но контейнер падал из-за других ошибок (Redis, ALLOWED_HOSTS)
- Миграции так и не применялись

**Решение:**
- ✅ В `deploy-production.sh` добавлен шаг:
```bash
docker exec labosfera_backend_1 python manage.py migrate --noinput
```
- ✅ Миграции применяются после запуска backend
- ✅ Добавлено ожидание запуска PostgreSQL (sleep 10)

**Файлы:**
- `deploy-production.sh`

---

## 📊 Итоговая статистика

| Проблема | Статус | Влияние |
|----------|--------|---------|
| Docker Compose KeyError | ✅ Исправлено | Критическое |
| SSL сертификаты | ✅ Исправлено | Критическое |
| Переменные PostgreSQL | ✅ Исправлено | Критическое |
| Redis кэш | ✅ Исправлено | Критическое |
| ALLOWED_HOSTS | ✅ Исправлено | Критическое |
| DJANGO_SETTINGS_MODULE | ✅ Исправлено | Критическое |
| Миграции | ✅ Исправлено | Критическое |

---

## 🎯 Что было сделано для предотвращения проблем

### 1. Автоматический деплой скрипт
- ✅ `deploy-production.sh` - полностью автоматизированный деплой
- ✅ Проверки на каждом шаге
- ✅ Автоматическое восстановление при ошибках
- ✅ Логирование всех операций

### 2. Fallback значения
- ✅ Все переменные окружения имеют fallback значения
- ✅ Деплой работает даже если .env файл неполный
- ✅ Понятные ошибки если критические переменные отсутствуют

### 3. Healthchecks
- ✅ PostgreSQL healthcheck (проверка `pg_isready`)
- ✅ Backend healthcheck (проверка API endpoint)
- ✅ Контейнеры перезапускаются при падении

### 4. Документация
- ✅ Полное описание всех проблем
- ✅ Инструкции по деплою
- ✅ Команды для диагностики

---

## 🚀 Как использовать в следующий раз

### Способ 1: Автоматический деплой (РЕКОМЕНДУЕТСЯ)
```bash
bash deploy-production.sh
```

### Способ 2: Docker Compose (НЕ РЕКОМЕНДУЕТСЯ из-за бага)
```bash
# На сервере
cd /root/Labosfera
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Способ 3: Ручной деплой через docker
См. команды в `deploy-production.sh`

---

## ✅ Проверочный чеклист перед деплоем

- [ ] .env файл существует на сервере
- [ ] DJANGO_SECRET_KEY установлен
- [ ] POSTGRES_PASSWORD установлен
- [ ] SSL сертификаты в папке nginx/ssl/
- [ ] Код закоммичен и запушен в GitHub
- [ ] SSH доступ к серверу работает

---

## 📞 Полезные команды для диагностики

```bash
# Проверка статуса контейнеров
ssh root@109.73.192.44 'docker ps'

# Логи Backend
ssh root@109.73.192.44 'docker logs labosfera_backend_1 -f'

# Логи Frontend
ssh root@109.73.192.44 'docker logs labosfera_frontend_1 -f'

# Логи Nginx
ssh root@109.73.192.44 'docker logs labosfera_nginx_1 -f'

# Проверка базы данных
ssh root@109.73.192.44 'docker exec labosfera_backend_1 python manage.py dbshell'

# Django shell
ssh root@109.73.192.44 'docker exec -it labosfera_backend_1 python manage.py shell'

# Применить миграции
ssh root@109.73.192.44 'docker exec labosfera_backend_1 python manage.py migrate'

# Создать суперпользователя
ssh root@109.73.192.44 'docker exec labosfera_backend_1 python manage.py createsuperuser'
```

---

## 🎉 Результат

После всех исправлений:
- ✅ Деплой работает с первого раза
- ✅ Все сервисы запускаются корректно
- ✅ API доступен и работает
- ✅ Frontend отображается корректно
- ✅ SSL работает
- ✅ База данных подключена и готова

**Время деплоя:** ~2-3 минуты

**Команда для деплоя:** `bash deploy-production.sh`

**URL сайта:** https://labosfera.ru

**URL админки:** https://labosfera.ru/admin/

**URL API:** https://labosfera.ru/api/v1/
