# 👑 ЛАБОСФЕРА - Руководство администратора

## 🎯 Быстрый доступ к админке

### 🌐 URL админ панели
```
https://labosfera.ru/admin/
```

### 🔑 Данные для входа (по умолчанию)
- **Логин**: `admin`
- **Пароль**: `admin123`
- **Email**: указанный в `.env.prod`

> ⚠️ **ВАЖНО**: Обязательно смените пароль после первого входа!

## 🏗️ Структура админки

### 📦 Управление товарами (Catalog)

#### Товары (Products)
- **Добавление товара**: Admin → Catalog → Products → Add Product
- **Обязательные поля**:
  - Название (name)
  - Категория (category) 
  - Цена (price)
  - Описание (description)
- **Дополнительные поля**:
  - Артикул (sku)
  - Slug (автоматический из названия)
  - Рекомендуемый товар (is_featured)
  - Показывать на сайте (is_active)

#### Категории (Categories)
- **Создание категории**: Admin → Catalog → Categories → Add Category
- **Иерархия**: Поддерживается вложенность категорий
- **Поля**:
  - Название (name)
  - Slug (автоматический)
  - Родительская категория (parent)
  - Описание (description)

#### Изображения товаров (Product Images)
- **Привязка к товару**: Выберите товар из списка
- **Форматы**: JPG, PNG, WebP (рекомендуется)
- **Размеры**: Автоматическое масштабирование
- **Alt текст**: Для SEO и доступности

### 📋 Управление заказами (Orders)

#### Заказы (Orders)
- **Просмотр заказов**: Admin → Orders → Orders
- **Статусы заказов**:
  - `pending` - Ожидает обработки
  - `confirmed` - Подтвержден
  - `shipped` - Отправлен
  - `delivered` - Доставлен
  - `cancelled` - Отменен

#### Позиции заказа (Order Items)
- Автоматически создаются при оформлении заказа
- Содержат товар, количество, цену на момент заказа

### 👥 Управление пользователями

#### Пользователи (Users)
- **Создание**: Admin → Authentication → Users → Add User
- **Права доступа**:
  - `is_staff` - Доступ к админке
  - `is_superuser` - Полные права
  - Группы и разрешения

## 🛠️ Основные операции

### ➕ Добавление нового товара

1. **Перейдите в админку**: https://labosfera.ru/admin/
2. **Catalog → Products → Add Product**
3. **Заполните обязательные поля**:
   ```
   Название: Микроскоп БиоМед M-101
   Категория: Микроскопы
   Цена: 45000.00
   Описание: Профессиональный микроскоп для лабораторных исследований
   ```
4. **Настройте дополнительные параметры**:
   - ✅ Показывать на сайте
   - ✅ Рекомендуемый товар (для главной страницы)
5. **Сохраните товар**
6. **Добавьте изображения**:
   - Catalog → Product Images → Add Product Image
   - Выберите товар и загрузите фото

### 🖼️ Загрузка изображений

1. **Catalog → Product Images → Add Product Image**
2. **Выберите товар** из выпадающего списка
3. **Загрузите изображение**:
   - Форматы: JPG, PNG (до 10MB)
   - Рекомендуемый размер: 800x600px
4. **Укажите alt-текст** для SEO
5. **Установите порядок** (для сортировки)

### 📋 Обработка заказов

1. **Orders → Orders** - просмотр всех заказов
2. **Выберите заказ** для детального просмотра
3. **Измените статус**:
   - `pending` → `confirmed` (подтверждение)
   - `confirmed` → `shipped` (отправка)
   - `shipped` → `delivered` (доставка)
4. **Сохраните изменения**

### 🏷️ Управление категориями

1. **Catalog → Categories → Add Category**
2. **Заполните данные**:
   ```
   Название: Лабораторная посуда
   Slug: laboratory-glassware (автоматически)
   Родительская категория: (оставить пустым для корневой)
   ```
3. **Создайте подкатегории**:
   ```
   Название: Мерная посуда
   Родительская категория: Лабораторная посуда
   ```

## 🔧 Административные команды

### 📊 Сбор статистики
```bash
# Подключение к серверу
ssh root@YOUR_SERVER_IP
cd /opt/labosfera

# Статистика заказов
docker-compose -f docker-compose.prod.yml exec backend python manage.py shell --settings=labosfera_project.settings_prod
>>> from orders.models import Order
>>> Order.objects.count()  # Общее количество заказов
>>> Order.objects.filter(status='delivered').count()  # Доставленные заказы
```

### 🗄️ Работа с базой данных
```bash
# Создание резервной копии
docker-compose -f docker-compose.prod.yml exec db pg_dump -U labosfera_user labosfera_prod > backup.sql

# Очистка старых сессий
docker-compose -f docker-compose.prod.yml exec backend python manage.py clearsessions --settings=labosfera_project.settings_prod

# Перестроение индексов поиска
docker-compose -f docker-compose.prod.yml exec backend python manage.py rebuild_index --settings=labosfera_project.settings_prod
```

### 📦 Обновление статических файлов
```bash
# После изменения CSS/JS админки
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput --settings=labosfera_project.settings_prod
```

## 🎨 Кастомизация админки

### Настройка отображения товаров
В файле `backend/catalog/admin.py`:

```python
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_featured', 'created_at')
    list_filter = ('category', 'is_featured', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'sku')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('price', 'is_featured')
    list_per_page = 25
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'slug', 'category', 'sku')
        }),
        ('Цена и наличие', {
            'fields': ('price', 'is_active', 'is_featured')
        }),
        ('Описание', {
            'fields': ('description',),
            'classes': ('wide',)
        }),
    )
```

### Настройка отображения заказов
В файле `backend/orders/admin.py`:

```python
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'customer_email', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('customer_name', 'customer_email', 'customer_phone')
    readonly_fields = ('created_at', 'updated_at', 'total_amount')
    list_per_page = 50
```

## 🔒 Безопасность

### Смена пароля администратора
```bash
# Через админку (рекомендуется)
1. Войти в https://labosfera.ru/admin/
2. Правый верхний угол → Change password
3. Ввести старый и новый пароль

# Через командную строку
docker-compose -f docker-compose.prod.yml exec backend python manage.py changepassword admin --settings=labosfera_project.settings_prod
```

### Создание дополнительных администраторов
```bash
# Интерактивное создание
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser --settings=labosfera_project.settings_prod

# Ввести:
# Username: manager
# Email: manager@labosfera.ru  
# Password: (надежный пароль)
```

### Настройка прав доступа
1. **Admin → Authentication → Users**
2. **Выберите пользователя**
3. **Настройте права**:
   - `is_staff` - доступ к админке
   - `is_superuser` - полные права
   - **Groups** - для группового управления правами

## 📊 Мониторинг и аналитика

### Основные метрики
```python
# В Django shell
from catalog.models import Product
from orders.models import Order

# Статистика товаров
Product.objects.count()  # Общее количество товаров
Product.objects.filter(is_active=True).count()  # Активные товары

# Статистика заказов  
Order.objects.count()  # Общее количество заказов
Order.objects.filter(status='delivered').count()  # Доставленные
Order.objects.filter(created_at__date=timezone.now().date()).count()  # Сегодняшние
```

### Экспорт данных
```bash
# Экспорт товаров в JSON
docker-compose -f docker-compose.prod.yml exec backend python manage.py dumpdata catalog.Product --settings=labosfera_project.settings_prod > products.json

# Экспорт заказов
docker-compose -f docker-compose.prod.yml exec backend python manage.py dumpdata orders.Order --settings=labosfera_project.settings_prod > orders.json
```

## 🚨 Поиск и устранение неисправностей

### Проблемы с загрузкой изображений
```bash
# Проверить права на папку media
docker-compose -f docker-compose.prod.yml exec backend ls -la /app/media/

# Пересоздать папки
docker-compose -f docker-compose.prod.yml exec backend mkdir -p /app/media/products
```

### Ошибки 500 в админке
```bash
# Проверить логи backend
docker-compose -f docker-compose.prod.yml logs backend

# Проверить статические файлы
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --settings=labosfera_project.settings_prod
```

### Проблемы с базой данных
```bash
# Проверить состояние БД
docker-compose -f docker-compose.prod.yml exec db psql -U labosfera_user -d labosfera_prod -c "\dt"

# Применить миграции
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate --settings=labosfera_project.settings_prod
```

## 📞 Поддержка

При возникновении проблем с админкой:

1. **Проверьте логи**: `docker-compose logs backend`
2. **Убедитесь в правильности URL**: `https://labosfera.ru/admin/`
3. **Проверьте права пользователя**: `is_staff=True`
4. **Очистите кэш браузера**

**Контакты технической поддержки:**
- Email: admin@labosfera.ru
- Документация: https://github.com/Semen1987nsk/Labosfera

---

**🧪 Успешного администрирования ЛАБОСФЕРА!**