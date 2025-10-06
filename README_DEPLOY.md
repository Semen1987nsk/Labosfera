# 🎯 Labosfera - Готовность к развертыванию

## ✅ Что сделано

### 1. Локальная разработка настроена
- ✅ Backend запущен в Docker (http://localhost:8000)
- ✅ Frontend запущен (http://localhost:3000 или Codespaces URL)
- ✅ База данных PostgreSQL работает
- ✅ Создан суперпользователь для админки

### 2. Код подготовлен для продакшена
- ✅ SSL настройки работают корректно (включаются только при DEBUG=False)
- ✅ DATABASE_URL добавлен
- ✅ localhost добавлен в next.config.mjs
- ✅ Все изменения совместимы с продакшеном

### 3. Документация создана
- ✅ `DEPLOYMENT_PLAN.md` - Подробный план развертывания
- ✅ `QUICK_DEPLOY.md` - Быстрая инструкция
- ✅ `LOCAL_DEV.md` - Инструкция для локальной разработки
- ✅ `generate-secret-key.py` - Генератор секретных ключей
- ✅ `.env.production.template` - Шаблон для продакшена

## 📋 Следующие шаги для развертывания

### Вариант 1: По шагам (рекомендуется для первого раза)
Следуйте инструкции в `DEPLOYMENT_PLAN.md`

### Вариант 2: Быстрое развертывание
Следуйте инструкции в `QUICK_DEPLOY.md`

## 📊 Ключевые файлы для развертывания

| Файл | Назначение | Где использовать |
|------|-----------|------------------|
| `docker-compose.prod.yml` | **Продакшн с SSL** (РЕКОМЕНДУЕТСЯ) | На сервере Timeweb |
| `docker-compose.simple.yml` | Упрощенная конфигурация без SSL | На сервере Timeweb |
| `.env.production.template` | Шаблон настроек продакшена | Создать .env.production |
| `nginx/ssl/` | **SSL сертификаты (уже есть!)** | Копируются автоматически |
| `nginx/prod.conf` | Nginx с HTTPS | Для docker-compose.prod.yml |
| `nginx-simple.conf` | Nginx только HTTP | Для docker-compose.simple.yml |
| `backend/Dockerfile.prod` | Сборка backend | Используется в docker-compose.prod.yml |
| `frontend/Dockerfile.prod` | Сборка frontend | Используется в docker-compose.prod.yml |

## 🔑 Важные моменты перед развертыванием

### 1. Создать .env.production
```bash
python3 generate-secret-key.py  # Сгенерировать SECRET_KEY
cp .env.production.template .env.production
nano .env.production  # Заполнить все необходимые поля
```

### 2. Изменить обязательно
- ✏️ `DJANGO_SECRET_KEY` - уникальный ключ (50+ символов)
- ✏️ `DB_PASSWORD` - сложный пароль (20+ символов)
- ✏️ `DJANGO_ALLOWED_HOSTS` - добавить IP сервера
- ✏️ `DATABASE_URL` - с правильным паролем

### 3. Проверить DNS
- ✅ labosfera.ru → IP сервера
- ✅ www.labosfera.ru → IP сервера

### 4. На сервере установить
- ✅ Docker
- ✅ Docker Compose
- ✅ Git

## 🚀 Команды для развертывания (кратко)

### Вариант 1: С SSL (РЕКОМЕНДУЕТСЯ) 🔐

```bash
# На сервере
cd /opt
git clone https://github.com/Semen1987nsk/Labosfera.git
cd Labosfera
git checkout 55d1acd

# Создать .env файл (скопировать с локальной машины)
nano .env

# Запустить с SSL
docker-compose -f docker-compose.prod.yml up -d --build

# Настроить БД
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --no-input
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# Готово! Сайт доступен на https://labosfera.ru
# SSL сертификаты копируются автоматически!
```

### Вариант 2: Без SSL в Docker (упрощенный)

```bash
# Запустить без SSL
docker-compose -f docker-compose.simple.yml up -d

# Настроить БД  
docker-compose -f docker-compose.simple.yml exec backend python manage.py migrate
docker-compose -f docker-compose.simple.yml exec backend python manage.py collectstatic --no-input
docker-compose -f docker-compose.simple.yml exec backend python manage.py createsuperuser

# SSL настраивается через панель Timeweb
```

## 📞 Поддержка

Если возникли вопросы или проблемы:
1. Проверьте логи: `docker-compose -f docker-compose.simple.yml logs -f`
2. Убедитесь что .env файл заполнен правильно
3. Проверьте DNS настройки
4. Проверьте firewall на сервере

## 🎓 Полезные ссылки

- [Docker Documentation](https://docs.docker.com/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Проект готов к развертыванию! 🎉**

Все необходимые файлы и инструкции подготовлены.
Следуйте шагам в `QUICK_DEPLOY.md` для быстрого старта.
