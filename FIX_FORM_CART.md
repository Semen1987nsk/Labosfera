# 🔧 ИСПРАВЛЕНИЕ ФОРМЫ И КОРЗИНЫ

## 🐛 Проблема

На сервере **не работают**:
1. ❌ Форма обратной связи (ошибка отправки)
2. ❌ Корзина (возможно)

**Причина:** В `settings.py` жёстко прописаны Codespaces URL вместо labosfera.ru

---

## 🔍 Диагностика на сервере

Выполните команды для проверки:

```bash
# 1. Проверить логи backend
docker-compose -f docker-compose.prod.yml logs backend | tail -50

# 2. Проверить переменные окружения
docker-compose -f docker-compose.prod.yml exec backend env | grep -E "ALLOWED_HOSTS|FRONTEND_URL"

# 3. Проверить что frontend видно из backend
docker-compose -f docker-compose.prod.yml exec backend curl -I https://labosfera.ru

# 4. Проверить CORS
docker-compose -f docker-compose.prod.yml exec backend python manage.py shell -c "from django.conf import settings; print('CORS:', settings.CORS_ALLOWED_ORIGINS); print('CSRF:', settings.CSRF_TRUSTED_ORIGINS)"
```

---

## ✅ БЫСТРОЕ ИСПРАВЛЕНИЕ

### Вариант 1: Обновить .env файл на сервере

```bash
# На сервере отредактировать .env
nano /opt/Labosfera/.env

# Добавить/проверить эти строки:
FRONTEND_URL=https://labosfera.ru
DJANGO_ALLOWED_HOSTS=labosfera.ru,www.labosfera.ru,109.73.192.44,localhost,127.0.0.1

# Также в backend/.env:
nano /opt/Labosfera/backend/.env
# Добавить те же строки

# Перезапустить backend
docker-compose -f docker-compose.prod.yml restart backend

# Проверить логи
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## 🔧 ПРАВИЛЬНОЕ ИСПРАВЛЕНИЕ (рекомендуется)

Нужно исправить `settings.py` чтобы он читал URL из переменных окружения.

### На локальной машине (в Codespaces):

Я создам правильный файл settings.py, затем:

```bash
# 1. Закоммитить изменения
git add backend/labosfera_project/settings.py
git commit -m "Fix CORS and CSRF for production domain"
git push origin main

# 2. На сервере обновить код
ssh root@109.73.192.44
cd /opt/Labosfera
git pull origin main

# 3. Пересобрать backend
docker-compose -f docker-compose.prod.yml up -d --build backend

# 4. Проверить
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## 🧪 Проверка после исправления

### Проверка формы:

1. Откройте https://labosfera.ru
2. Прокрутите до формы "Получите персональную консультацию"
3. Заполните форму и отправьте
4. Должно появиться сообщение об успехе (не ошибка!)

### Проверка корзины:

1. Откройте https://labosfera.ru
2. Добавьте товар в корзину
3. Откройте корзину (иконка вверху)
4. Попробуйте изменить количество
5. Нажмите "Оформить заказ"

### Проверка Telegram уведомлений:

```bash
# На сервере проверить логи после отправки формы
docker-compose -f docker-compose.prod.yml logs backend | grep -i telegram

# Если есть ошибки - проверить токен бота:
docker-compose -f docker-compose.prod.yml exec backend env | grep TELEGRAM
```

---

## 📊 Что должно быть в .env.production

```env
# Frontend URL для CORS
FRONTEND_URL=https://labosfera.ru

# Allowed hosts
DJANGO_ALLOWED_HOSTS=labosfera.ru,www.labosfera.ru,109.73.192.44,localhost,127.0.0.1

# Telegram (уже есть)
TELEGRAM_BOT_TOKEN=8355662949:AAGUHPivIaYcsJlyve3iEaoRdvuVvJhQQ8w
TELEGRAM_CHAT_ID=300596362

# Database (уже есть)
DB_NAME=labosfera_production
DB_USER=labosfera_prod_user
DB_PASSWORD=L@b0$fer@Pr0d2025!SecureDB#Pass
DB_HOST=db
DB_PORT=5432
```

---

## 🔍 Дополнительная диагностика

### Если форма всё равно не работает:

```bash
# 1. Проверить API endpoint
curl -X POST https://labosfera.ru/api/v1/contacts/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"1234567890","email":"test@test.com","organization":"Test Org","comment":"Test"}'

# 2. Проверить CORS headers
curl -I -X OPTIONS https://labosfera.ru/api/v1/contacts/ \
  -H "Origin: https://labosfera.ru" \
  -H "Access-Control-Request-Method: POST"

# Должно быть:
# Access-Control-Allow-Origin: https://labosfera.ru
# Access-Control-Allow-Methods: POST, OPTIONS
```

### Если корзина не работает:

```bash
# Проверить что корзина работает локально (в браузере)
# Открыть DevTools (F12) -> Console
# Попробовать добавить товар
# Смотреть на ошибки в консоли

# Также проверить Network tab:
# - Есть ли CORS ошибки?
# - Приходит ли ответ 200 OK?
# - Какие заголовки в ответе?
```

---

## 🚨 Если ничего не помогает

### Включить DEBUG временно:

```bash
# ОСТОРОЖНО! Только для диагностики!
nano /opt/Labosfera/backend/.env

# Изменить:
DEBUG=True

# Перезапустить:
docker-compose -f docker-compose.prod.yml restart backend

# Попробовать отправить форму
# Посмотреть подробную ошибку в браузере

# ОБЯЗАТЕЛЬНО вернуть обратно:
DEBUG=False
docker-compose -f docker-compose.prod.yml restart backend
```

---

## 📝 Ожидаемый результат

После исправления:

✅ Форма отправляется без ошибок  
✅ Приходит Telegram уведомление  
✅ Корзина работает (добавить/удалить/изменить количество)  
✅ Оформление заказа работает  
✅ Приходит Telegram уведомление о заказе  

---

**Следующий шаг:** Сначала попробуйте Вариант 1 (быстрое исправление через .env), если не поможет - сделаем Вариант 2 (правильное исправление в коде).
