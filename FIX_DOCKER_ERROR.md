# 🔧 ИСПРАВЛЕНИЕ ОШИБКИ DOCKER: 'ContainerConfig'

## 🐛 Ошибка
```
KeyError: 'ContainerConfig'
ERROR: for labosfera_backend_1  'ContainerConfig'
```

## ✅ Причина
Docker-compose пытается пересоздать контейнер, но старый контейнер имеет несовместимую структуру.

---

## 🚀 БЫСТРОЕ ИСПРАВЛЕНИЕ (1 минута)

### Вариант 1: Остановить и пересоздать backend

```bash
cd /opt/Labosfera

# Остановить и удалить только backend
docker-compose -f docker-compose.prod.yml stop backend
docker-compose -f docker-compose.prod.yml rm -f backend

# Создать заново
docker-compose -f docker-compose.prod.yml up -d --build backend

# Проверить статус
docker-compose -f docker-compose.prod.yml ps
```

---

## 🔥 Вариант 2: Полный перезапуск (если Вариант 1 не помог)

```bash
cd /opt/Labosfera

# Остановить ВСЁ
docker-compose -f docker-compose.prod.yml down

# Запустить заново
docker-compose -f docker-compose.prod.yml up -d --build

# Проверить
docker-compose -f docker-compose.prod.yml ps
```

**⚠️ ВНИМАНИЕ:** Этот вариант перезапустит все контейнеры, включая базу данных!

---

## 🎯 РЕКОМЕНДУЕМАЯ КОМАНДА (одна строка)

```bash
cd /opt/Labosfera && \
docker-compose -f docker-compose.prod.yml stop backend && \
docker-compose -f docker-compose.prod.yml rm -f backend && \
docker-compose -f docker-compose.prod.yml up -d --build backend && \
sleep 10 && \
echo "" && \
echo "✅ Backend пересоздан!" && \
echo "" && \
docker-compose -f docker-compose.prod.yml ps && \
echo "" && \
echo "📝 Последние 20 строк логов:" && \
docker-compose -f docker-compose.prod.yml logs --tail=20 backend
```

---

## 🔍 Проверка после исправления

```bash
# 1. Проверить что контейнеры запущены
docker-compose -f docker-compose.prod.yml ps

# Должно быть:
# NAME                    STATE       PORTS
# labosfera_backend_1     Up         
# labosfera_frontend_1    Up         
# labosfera_nginx_1       Up          0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
# labosfera_db_1          Up

# 2. Проверить логи backend
docker-compose -f docker-compose.prod.yml logs --tail=30 backend

# 3. Проверить что API работает
curl http://localhost/api/v1/products/

# 4. Проверить FRONTEND_URL
docker-compose -f docker-compose.prod.yml exec backend env | grep FRONTEND_URL
# Должно быть: FRONTEND_URL=https://labosfera.ru
```

---

## 🧪 Проверка формы и корзины

После успешного запуска:

1. **Откройте сайт:** https://labosfera.ru
2. **Проверьте форму:** Заполните и отправьте - не должно быть ошибки
3. **Проверьте корзину:** Добавьте товар и оформите заказ
4. **Проверьте Telegram:** Должны прийти уведомления

---

## 🆘 Если ошибка повторяется

### Полная очистка и пересоздание:

```bash
cd /opt/Labosfera

# Остановить всё
docker-compose -f docker-compose.prod.yml down

# Удалить все контейнеры Labosfera
docker ps -a | grep labosfera | awk '{print $1}' | xargs docker rm -f 2>/dev/null

# Удалить образ backend
docker images | grep labosfera_backend | awk '{print $3}' | xargs docker rmi -f 2>/dev/null

# Пересоздать всё
docker-compose -f docker-compose.prod.yml up -d --build

# Применить миграции (если база новая)
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Собрать статику
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --no-input
```

---

## 📊 Альтернатива: Использовать docker вместо docker-compose

Если docker-compose продолжает давать ошибки:

```bash
# Посмотреть ID старого контейнера
docker ps -a | grep labosfera_backend

# Остановить и удалить
docker stop labosfera_backend_1
docker rm labosfera_backend_1

# Пересобрать через docker-compose
docker-compose -f docker-compose.prod.yml up -d backend
```

---

## ✅ Ожидаемый результат

После исправления:
- ✅ Backend контейнер запущен без ошибок
- ✅ API доступен по http://localhost/api/v1/
- ✅ FRONTEND_URL установлен в https://labosfera.ru
- ✅ Форма и корзина работают
- ✅ Telegram уведомления приходят

---

**Время исправления: 1-2 минуты**  
**Причина ошибки:** Несовместимость старого контейнера с новым образом  
**Решение:** Удалить старый контейнер и создать новый
