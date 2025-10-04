# ЛАБОСФЕРА - Руководство по развертыванию на production

## 🚀 Быстрое развертывание

### 1. Покупка VPS
Рекомендуется **REG.RU VPS-Business**:
- 4 CPU, 4GB RAM, 80GB SSD
- Стоимость: 1990₽/мес
- Операционная система: Ubuntu 22.04 LTS

### 2. Настройка домена
В панели управления домена `labosfera.ru` на REG.RU:
```
A    @             YOUR_SERVER_IP
A    www           YOUR_SERVER_IP
```

### 3. Автоматическое развертывание
```bash
# Подключение к серверу
ssh root@YOUR_SERVER_IP

# Скачивание и запуск скрипта
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh -o deploy.sh
chmod +x deploy.sh
./deploy.sh
```

## ⚙️ Ручная настройка

### Системные требования
- Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- Минимум 2GB RAM, 2 CPU cores
- 40GB свободного места
- Доступ к интернету

### Установка зависимостей
```bash
# Обновление системы
apt update && apt upgrade -y

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### Клонирование проекта
```bash
cd /opt
git clone https://github.com/Semen1987nsk/Labosfera.git labosfera
cd labosfera
```

### Настройка окружения
```bash
# Копирование конфигурации
cp .env.prod.example .env.prod

# Редактирование (ОБЯЗАТЕЛЬНО!)
nano .env.prod
```

Обязательно измените:
- `POSTGRES_PASSWORD` - надежный пароль для БД
- `DJANGO_SECRET_KEY` - 50+ случайных символов
- `ALLOWED_HOSTS` - ваш домен и IP
- `EMAIL` - ваш email для SSL сертификатов

### SSL сертификат
```bash
# Создание директорий
mkdir -p certbot/conf certbot/www

# Получение сертификата
source .env.prod
docker run --rm -p 80:80 \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot \
  certonly --standalone \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN -d www.$DOMAIN
```

### Запуск приложения
```bash
# Сборка и запуск
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Миграции
sleep 10
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate --settings=labosfera_project.settings_prod

# Создание админа
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser --settings=labosfera_project.settings_prod
```

## 🔧 Управление

### 👑 Админ панель Django

После развертывания админ панель доступна по адресу: `https://labosfera.ru/admin/`

#### Автоматическое создание администратора
Скрипт `deploy.sh` автоматически создает администратора:
- **Логин**: `admin`
- **Пароль**: `admin123`
- **Email**: из переменной `EMAIL` в `.env.prod`

#### Ручное создание администратора
```bash
# Интерактивное создание
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser --settings=labosfera_project.settings_prod

# Программное создание
docker-compose -f docker-compose.prod.yml exec backend python manage.py shell --settings=labosfera_project.settings_prod
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> admin = User.objects.create_superuser('your_username', 'your_email@example.com', 'your_password')
>>> exit()
```

#### Смена пароля администратора
```bash
# Через админку Django (рекомендуется)
# Войдите в https://labosfera.ru/admin/ и перейдите в "Пользователи"

# Через командную строку
docker-compose -f docker-compose.prod.yml exec backend python manage.py changepassword admin --settings=labosfera_project.settings_prod
```

#### Возможности админ панели
- 📦 **Управление товарами**: Добавление, редактирование, удаление товаров
- 🏷️ **Категории**: Управление категориями и подкategoriями  
- 🖼️ **Изображения**: Загрузка и управление изображениями товаров
- 📋 **Заказы**: Просмотр и обработка заказов
- 👥 **Пользователи**: Управление пользователями и правами
- 📊 **Статистика**: Базовая статистика продаж

#### Настройка админки
Файл настроек: `backend/catalog/admin.py` и `backend/orders/admin.py`

```python
# Пример кастомизации в admin.py
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_featured', 'created_at')
    list_filter = ('category', 'is_featured', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
```

#### Безопасность админки
- ✅ HTTPS принудительно
- ✅ CSRF защита включена  
- ✅ Сессии защищены
- ✅ Rate limiting на /admin/
- ✅ Логирование входов

#### Резервное копирование данных
```bash
# Экспорт всех данных
docker-compose -f docker-compose.prod.yml exec backend python manage.py dumpdata --settings=labosfera_project.settings_prod > backup_data.json

# Импорт данных
docker-compose -f docker-compose.prod.yml exec backend python manage.py loaddata backup_data.json --settings=labosfera_project.settings_prod
```

### Просмотр логов
```bash
# Все сервисы
docker-compose -f docker-compose.prod.yml logs -f

# Конкретный сервис
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Обновление сайта
```bash
cd /opt/labosfera
./update.sh
```

### Резервное копирование
```bash
# База данных
docker-compose -f docker-compose.prod.yml exec db pg_dump -U labosfera_user labosfera_prod > backup_$(date +%Y%m%d).sql

# Медиафайлы
tar -czf media_backup_$(date +%Y%m%d).tar.gz /opt/labosfera/media/
```

### Мониторинг
```bash
# Состояние контейнеров
docker-compose -f docker-compose.prod.yml ps

# Использование ресурсов
docker stats

# Свободное место
df -h
```

## 🛡️ Безопасность

### Firewall
```bash
# UFW
apt install ufw
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
```

### Автообновления безопасности
```bash
apt install unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

### Бэкапы (рекомендуется)
```bash
# Настройка ежедневных бэкапов
cat > /etc/cron.daily/labosfera-backup << 'EOF'
#!/bin/bash
cd /opt/labosfera
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U labosfera_user labosfera_prod > /backups/db_$(date +%Y%m%d).sql
tar -czf /backups/media_$(date +%Y%m%d).tar.gz media/
# Удаление старых бэкапов (старше 7 дней)
find /backups -name "*.sql" -mtime +7 -delete
find /backups -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /etc/cron.daily/labosfera-backup
mkdir -p /backups
```

## 🔍 Диагностика

### Проверка работоспособности
```bash
# Все ли контейнеры запущены
docker-compose -f docker-compose.prod.yml ps

# Проверка сайта
curl -I https://labosfera.ru

# Проверка API
curl https://labosfera.ru/api/products/

# Проверка SSL
openssl s_client -connect labosfera.ru:443 -servername labosfera.ru
```

### Распространенные проблемы

**Сайт недоступен:**
```bash
# Проверить nginx
docker-compose -f docker-compose.prod.yml logs nginx

# Перезапустить nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

**Ошибки 502/503:**
```bash
# Проверить backend
docker-compose -f docker-compose.prod.yml logs backend

# Перезапустить backend
docker-compose -f docker-compose.prod.yml restart backend
```

**Проблемы с SSL:**
```bash
# Проверить сертификаты
docker-compose -f docker-compose.prod.yml exec certbot certbot certificates

# Обновить сертификаты
docker-compose -f docker-compose.prod.yml exec certbot certbot renew
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи сервисов
2. Убедитесь в правильности настроек в `.env.prod`
3. Проверьте доступность портов 80 и 443
4. Убедитесь, что домен указывает на правильный IP

**Техническая поддержка:**
- Email: admin@labosfera.ru
- Документация: https://github.com/Semen1987nsk/Labosfera