# 🔧 ИСПРАВИТЬ ФОРМУ И КОРЗИНУ - СЕЙЧАС

## 🐛 Проблема
- ❌ Форма обратной связи не работает (ошибка отправки)
- ❌ Корзина возможно не работает

## ✅ Решение готово!

Исправление уже в коде:
- ✅ Коммит: **787fe1d**
- ✅ Файл: `backend/labosfera_project/settings.py`
- ✅ Изменения: CORS и CSRF теперь читаются из `.env`

---

## 🚀 БЫСТРОЕ ИСПРАВЛЕНИЕ (2 минуты)

### На СЕРВЕРЕ выполните:

```bash
# 1. Перейти в папку проекта
cd /opt/Labosfera

# 2. Обновить код с GitHub
git pull origin main

# 3. Обновить .env файл (добавить FRONTEND_URL)
nano /opt/Labosfera/.env

# Добавьте эту строку после DJANGO_ALLOWED_HOSTS:
# FRONTEND_URL=https://labosfera.ru

# Ctrl+O, Enter, Ctrl+X для сохранения

# 4. Скопировать .env в backend
cp /opt/Labosfera/.env /opt/Labosfera/backend/.env

# 5. Пересобрать и перезапустить backend
docker-compose -f docker-compose.prod.yml up -d --build backend

# 6. Подождать 10 секунд
sleep 10

# 7. Проверить статус
docker-compose -f docker-compose.prod.yml ps

# 8. Посмотреть логи
docker-compose -f docker-compose.prod.yml logs --tail=30 backend
```

---

## 🎯 ОДНА КОМАНДА

Скопируйте и выполните на сервере:

```bash
cd /opt/Labosfera && \
git pull origin main && \
echo "" >> .env && \
echo "# Frontend URL для CORS" >> .env && \
echo "FRONTEND_URL=https://labosfera.ru" >> .env && \
cp .env backend/.env && \
docker-compose -f docker-compose.prod.yml up -d --build backend && \
sleep 10 && \
echo "" && \
echo "✅ Обновление завершено!" && \
echo "" && \
docker-compose -f docker-compose.prod.yml ps
```

---

## 🧪 Проверка после исправления

### 1. Проверить форму:
1. Откройте https://labosfera.ru
2. Прокрутите до формы "Получите персональную консультацию"
3. Заполните все поля
4. Нажмите "Отправляем..."
5. ✅ Должно появиться сообщение об успехе (не ошибка!)

### 2. Проверить Telegram:
- После отправки формы должно прийти уведомление в Telegram
- Чат ID: 300596362

### 3. Проверить корзину:
1. Добавьте товар в корзину
2. Откройте корзину (иконка справа вверху)
3. Измените количество
4. Нажмите "Оформить заказ"
5. Заполните форму заказа
6. ✅ Должно появиться подтверждение и Telegram уведомление

---

## 📊 Что изменилось в коде

### В `settings.py`:

**Было** (жёстко прописано):
```python
CORS_ALLOWED_ORIGINS = [
    'https://humble-winner-97w5q7j66rqxhx9qq-3000.app.github.dev',  # Codespaces URL
    'http://localhost:3000',
]
```

**Стало** (динамически из .env):
```python
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
CORS_ALLOWED_ORIGINS = [
    'https://labosfera.ru',
    'https://www.labosfera.ru',
]
if FRONTEND_URL not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(FRONTEND_URL)
```

### В `.env`:
```env
# Добавлено:
FRONTEND_URL=https://labosfera.ru
```

---

## 🔍 Диагностика если не работает

```bash
# 1. Проверить что FRONTEND_URL установлен
docker-compose -f docker-compose.prod.yml exec backend env | grep FRONTEND_URL
# Должно быть: FRONTEND_URL=https://labosfera.ru

# 2. Проверить CORS настройки
docker-compose -f docker-compose.prod.yml exec backend python manage.py shell << 'EOF'
from django.conf import settings
print("CORS Origins:", settings.CORS_ALLOWED_ORIGINS)
print("CSRF Trusted:", settings.CSRF_TRUSTED_ORIGINS)
EOF

# 3. Проверить логи при отправке формы
docker-compose -f docker-compose.prod.yml logs -f backend
# Отправьте форму и смотрите на ошибки

# 4. Проверить API напрямую
curl -X POST https://labosfera.ru/api/v1/contacts/ \
  -H "Content-Type: application/json" \
  -H "Origin: https://labosfera.ru" \
  -d '{"name":"Test","phone":"1234567890","email":"test@test.com","organization":"Test","comment":"Test"}'
```

---

## 🆘 Если всё равно не работает

### Проверить DNS:
```bash
nslookup labosfera.ru
# Должно показать: 109.73.192.44
```

### Проверить SSL:
```bash
curl -I https://labosfera.ru
# Должно быть: HTTP/2 200
```

### Перезапустить всё:
```bash
cd /opt/Labosfera
docker-compose -f docker-compose.prod.yml restart
```

### Пересобрать всё с нуля:
```bash
cd /opt/Labosfera
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## ✅ Ожидаемый результат

После исправления:
- ✅ Форма работает без ошибок
- ✅ Telegram уведомления приходят
- ✅ Корзина работает (добавить/удалить/изменить)
- ✅ Оформление заказа работает
- ✅ Все CORS ошибки исправлены

---

**Время исправления: 2 минуты**  
**Создано: 6 октября 2025**  
**Коммит: 787fe1d**
