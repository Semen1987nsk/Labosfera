# ✅ ПРОВЕРКА САЙТА ПОСЛЕ ИСПРАВЛЕНИЯ

## 🎯 Что проверяем

После исправления CORS настроек нужно проверить:
1. ✅ Форма обратной связи
2. ✅ Корзина
3. ✅ Telegram уведомления

---

## 🔍 ШАГ 1: Проверка на сервере

### Проверить что контейнеры запущены:

```bash
docker-compose -f docker-compose.prod.yml ps
```

**Ожидаемый результат:**
```
NAME                    STATE       PORTS
labosfera_backend_1     Up         
labosfera_frontend_1    Up         
labosfera_nginx_1       Up          0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
labosfera_db_1          Up
```

### Проверить FRONTEND_URL:

```bash
docker-compose -f docker-compose.prod.yml exec backend env | grep FRONTEND_URL
```

**Ожидаемый результат:**
```
FRONTEND_URL=https://labosfera.ru
```

### Проверить CORS настройки:

```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py shell << 'EOF'
from django.conf import settings
print("✅ CORS_ALLOWED_ORIGINS:")
for origin in settings.CORS_ALLOWED_ORIGINS:
    print(f"  - {origin}")
print("\n✅ CSRF_TRUSTED_ORIGINS:")
for origin in settings.CSRF_TRUSTED_ORIGINS:
    print(f"  - {origin}")
EOF
```

**Ожидаемый результат:**
```
✅ CORS_ALLOWED_ORIGINS:
  - https://labosfera.ru
  - https://www.labosfera.ru
  - http://localhost:3000
  - http://127.0.0.1:3000

✅ CSRF_TRUSTED_ORIGINS:
  - https://labosfera.ru
  - https://www.labosfera.ru
```

### Проверить API endpoint:

```bash
curl -X POST http://localhost/api/v1/contacts/ \
  -H "Content-Type: application/json" \
  -H "Origin: https://labosfera.ru" \
  -d '{"name":"Test Server","phone":"1234567890","email":"test@test.com","organization":"Test Org","comment":"Test from server"}'
```

**Ожидаемый результат:**
- Статус: 200 или 201
- Должен прийти ответ с данными контакта
- **ВАЖНО:** Должно прийти Telegram уведомление!

---

## 🌐 ШАГ 2: Проверка в браузере

### 1. Проверка формы обратной связи

1. **Откройте:** https://labosfera.ru
2. **Прокрутите вниз** до раздела "Получите персональную консультацию"
3. **Заполните форму:**
   - Имя: Тест
   - Телефон: 79991234567
   - Email: test@example.com
   - Организация: Тестовая
   - Комментарий: Проверка после исправления
4. **Нажмите:** "Отправляем..."

**✅ Ожидаемый результат:**
- ❌ НЕТ ошибки "Произошла ошибка при отправке обращения"
- ✅ Появляется сообщение об успешной отправке
- ✅ Форма очищается
- ✅ Приходит Telegram уведомление (проверьте чат 300596362)

### 2. Проверка корзины

1. **Откройте:** https://labosfera.ru
2. **Выберите товар** (например, "Микроскоп")
3. **Нажмите:** "Добавить в корзину"
4. **Откройте корзину** (иконка корзины справа вверху)
5. **Проверьте:**
   - ✅ Товар отображается в корзине
   - ✅ Можно изменить количество (+/-)
   - ✅ Цена пересчитывается
6. **Нажмите:** "Оформить заказ"
7. **Заполните форму заказа:**
   - ФИО: Тест Тестович
   - Телефон: 79991234567
   - Email: test@example.com
   - Организация: Тестовая организация
   - Адрес доставки: Москва, Тестовая 1
8. **Нажмите:** "Отправить заказ"

**✅ Ожидаемый результат:**
- ✅ Заказ отправляется без ошибок
- ✅ Появляется подтверждение заказа
- ✅ Корзина очищается
- ✅ Приходит Telegram уведомление с деталями заказа

### 3. Проверка DevTools (F12)

1. **Откройте:** https://labosfera.ru
2. **Нажмите F12** (открыть DevTools)
3. **Перейдите на вкладку Console**
4. **Попробуйте отправить форму**

**✅ Ожидаемый результат:**
- ❌ НЕТ CORS ошибок (типа "has been blocked by CORS policy")
- ❌ НЕТ ошибок сети (Network errors)
- ✅ Запросы к API возвращают 200 OK

**Вкладка Network:**
1. **Перейдите на Network**
2. **Отправьте форму**
3. **Найдите запрос к /api/v1/contacts/**
4. **Проверьте заголовки ответа:**
   - ✅ `Access-Control-Allow-Origin: https://labosfera.ru`
   - ✅ `Access-Control-Allow-Methods: POST, OPTIONS, ...`

---

## 📱 ШАГ 3: Проверка Telegram

### Проверить настройки бота:

```bash
# На сервере
docker-compose -f docker-compose.prod.yml exec backend env | grep TELEGRAM
```

**Ожидаемый результат:**
```
TELEGRAM_BOT_TOKEN=8355662949:AAGUHPivIaYcsJlyve3iEaoRdvuVvJhQQ8w
TELEGRAM_CHAT_ID=300596362
```

### Проверить что бот работает:

```bash
# Отправить тестовое сообщение
docker-compose -f docker-compose.prod.yml exec backend python manage.py shell << 'EOF'
from orders.utils import send_telegram_notification
result = send_telegram_notification("🧪 Тест после исправления CORS")
print(f"✅ Результат: {result}")
EOF
```

**✅ Ожидаемый результат:**
- Выводится: `✅ Результат: True`
- Приходит сообщение в Telegram (чат ID: 300596362)

---

## 📊 ШАГ 4: Проверка логов

### Логи backend (ошибки):

```bash
docker-compose -f docker-compose.prod.yml logs backend | grep -i error | tail -20
```

**✅ Ожидаемый результат:** Нет CORS ошибок

### Логи nginx (доступ):

```bash
docker-compose -f docker-compose.prod.yml logs nginx | tail -20
```

**✅ Ожидаемый результат:** Запросы к API возвращают 200/201

### Живые логи при отправке формы:

```bash
# Открыть живые логи
docker-compose -f docker-compose.prod.yml logs -f backend

# В браузере отправьте форму
# Смотрите на логи - должны быть POST запросы без ошибок
# Ctrl+C для выхода
```

---

## 🎯 Финальный чеклист

После всех проверок должно быть:

### Backend:
- ✅ Контейнер запущен (State: Up)
- ✅ FRONTEND_URL=https://labosfera.ru
- ✅ CORS включает labosfera.ru
- ✅ CSRF включает labosfera.ru
- ✅ API доступен по /api/v1/

### Frontend:
- ✅ Форма отправляется без ошибок
- ✅ Корзина работает (добавить/удалить/изменить)
- ✅ Оформление заказа работает
- ✅ Нет CORS ошибок в DevTools Console

### Telegram:
- ✅ Бот настроен (токен и chat_id)
- ✅ Уведомления приходят при отправке формы
- ✅ Уведомления приходят при оформлении заказа

### SSL:
- ✅ Сайт открывается по HTTPS
- ✅ Сертификат валиден (до 6 мая 2026)
- ✅ Нет предупреждений о безопасности

---

## 🆘 Если что-то не работает

### Форма не отправляется:
1. Проверьте FRONTEND_URL (должен быть https://labosfera.ru)
2. Проверьте CORS настройки (должен включать labosfera.ru)
3. Смотрите логи: `docker-compose -f docker-compose.prod.yml logs backend`

### Telegram не приходит:
1. Проверьте токен бота: `docker-compose -f docker-compose.prod.yml exec backend env | grep TELEGRAM`
2. Проверьте что бот добавлен в чат
3. Отправьте тестовое сообщение через shell (см. выше)

### Корзина не работает:
1. Проверьте DevTools Console на ошибки
2. Проверьте Network tab на CORS ошибки
3. Убедитесь что API /api/v1/cart/ доступен

---

## ✅ Успешная проверка

Если все пункты отмечены ✅ - **ПОЗДРАВЛЯЕМ!** 🎉

Сайт полностью работает:
- Форма обратной связи ✅
- Корзина и заказы ✅
- Telegram уведомления ✅
- SSL безопасность ✅

---

**Создано: 6 октября 2025**  
**После исправления коммита: 787fe1d**
