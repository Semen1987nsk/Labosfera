# 🚀 ЛАБОСФЕРА - Быстрые команды для администратора

## 👑 Админ панель

### 🌐 Вход в админку
```
URL: https://labosfera.ru/admin/
Логин: admin
Пароль: admin123 (смените!)
```

### 🔑 Смена пароля (ОБЯЗАТЕЛЬНО!)
```bash
# Через веб-интерфейс (рекомендуется)
https://labosfera.ru/admin/ → Правый верхний угол → Change password

# Через командную строку
ssh root@YOUR_SERVER_IP
cd /opt/labosfera
docker-compose -f docker-compose.prod.yml exec backend python manage.py changepassword admin --settings=labosfera_project.settings_prod
```

## 📦 Управление товарами

### ➕ Добавить товар
1. `Admin → Catalog → Products → Add Product`
2. Заполнить обязательные поля:
   - Название
   - Категория
   - Цена
   - Описание
3. Отметить "Показывать на сайте"
4. Сохранить

### 🖼️ Добавить изображения товара
1. `Admin → Catalog → Product Images → Add Product Image`
2. Выбрать товар
3. Загрузить изображение (JPG/PNG, до 10MB)
4. Указать Alt-текст
5. Сохранить

### 🏷️ Создать категорию
1. `Admin → Catalog → Categories → Add Category`
2. Указать название
3. Выбрать родительскую категорию (если нужно)
4. Сохранить

## 📋 Управление заказами

### 👀 Просмотр заказов
```
Admin → Orders → Orders
```

### 📊 Статусы заказов
- `pending` → `confirmed` → `shipped` → `delivered`
- Или `cancelled` для отмены

### 🔄 Изменить статус заказа
1. Открыть заказ
2. Изменить поле "Status"
3. Сохранить

## 🔧 Полезные команды

### 📊 Статистика через SSH
```bash
ssh root@YOUR_SERVER_IP
cd /opt/labosfera

# Общая статистика
docker-compose -f docker-compose.prod.yml exec backend python manage.py shell --settings=labosfera_project.settings_prod

# В Django shell:
from catalog.models import Product
from orders.models import Order

Product.objects.count()  # Количество товаров
Order.objects.count()    # Количество заказов
Order.objects.filter(status='delivered').count()  # Доставленные
```

### 💾 Резервное копирование
```bash
# База данных
docker-compose -f docker-compose.prod.yml exec db pg_dump -U labosfera_user labosfera_prod > backup_$(date +%Y%m%d).sql

# Медиафайлы
tar -czf media_backup_$(date +%Y%m%d).tar.gz /opt/labosfera/media/
```

### 🔄 Обновление сайта
```bash
cd /opt/labosfera
./update.sh
```

### 📦 Сбор статических файлов (после изменений CSS/JS)
```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput --settings=labosfera_project.settings_prod
```

## 🚨 Экстренные команды

### 🔄 Перезапуск всех сервисов
```bash
cd /opt/labosfera
docker-compose -f docker-compose.prod.yml restart
```

### 📋 Просмотр логов
```bash
# Все сервисы
docker-compose -f docker-compose.prod.yml logs -f

# Только backend (админка)
docker-compose -f docker-compose.prod.yml logs -f backend

# Только nginx (веб-сервер)
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### 🗄️ Восстановление доступа к БД
```bash
# Подключение к PostgreSQL
docker-compose -f docker-compose.prod.yml exec db psql -U labosfera_user labosfera_prod

# Список таблиц
\dt

# Выход
\q
```

### 🔧 Исправление прав на файлы
```bash
# Права на медиафайлы
docker-compose -f docker-compose.prod.yml exec backend chown -R www-data:www-data /app/media/

# Права на логи
docker-compose -f docker-compose.prod.yml exec backend chown -R www-data:www-data /app/logs/
```

## 📞 Быстрая помощь

### ❌ Админка не открывается
```bash
# Проверить статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Перезапустить backend
docker-compose -f docker-compose.prod.yml restart backend

# Проверить логи
docker-compose -f docker-compose.prod.yml logs backend
```

### 🔐 Забыл пароль админа
```bash
# Сбросить пароль
docker-compose -f docker-compose.prod.yml exec backend python manage.py changepassword admin --settings=labosfera_project.settings_prod

# Создать нового суперпользователя
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser --settings=labosfera_project.settings_prod
```

### 🖼️ Изображения не загружаются
```bash
# Проверить папку media
docker-compose -f docker-compose.prod.yml exec backend ls -la /app/media/

# Создать папки
docker-compose -f docker-compose.prod.yml exec backend mkdir -p /app/media/products

# Исправить права
docker-compose -f docker-compose.prod.yml exec backend chown -R www-data:www-data /app/media/
```

---

**📖 Полное руководство**: [ADMIN_GUIDE.md](ADMIN_GUIDE.md)

**🧪 ЛАБОСФЕРА - Простое и эффективное администрирование!**