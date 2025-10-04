# 🏠 ЛАБОСФЕРА - Развертывание на виртуальном хостинге REG.RU

## 🎯 Для виртуального хостинга (без sudo/root)

### ❗ ВАЖНО: Это руководство для ВИРТУАЛЬНОГО ХОСТИНГА, не VPS!

Если у вас есть сообщение: *"права суперпользователя отсутствуют"* - значит у вас виртуальный хостинг.

## 🚀 Быстрое развертывание

### 1️⃣ Подключитесь к хостингу по SSH
```bash
ssh u3283831@server293.hosting.reg.ru
# Замените на ваши данные из панели управления
```

### 2️⃣ Запустите специальный скрипт для хостинга
```bash
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy-hosting.sh -o deploy-hosting.sh && chmod +x deploy-hosting.sh && ./deploy-hosting.sh
```

## 📋 Что произойдет автоматически:

### ✅ Проверка окружения
- Проверка наличия Git, Python3, Node.js
- Установка NVM и Node.js (если нужно)
- Создание структуры проекта

### ✅ Настройка backend (Django)
- Создание виртуального окружения Python
- Установка зависимостей
- Настройка SQLite базы данных (для хостинга)
- Применение миграций
- Создание администратора (admin/admin123)
- Сбор статических файлов

### ✅ Настройка frontend (Next.js)
- Установка зависимостей npm
- Сборка production версии
- Настройка статических файлов

### ✅ Конфигурация веб-сервера
- Создание .htaccess для Apache
- Настройка роутинга для SPA
- Конфигурация для Django admin

## ⚙️ Ручная настройка после развертывания

### 1. Настройка переменных окружения
```bash
# Отредактируйте файл backend/.env
nano ~/labosfera/backend/.env
```

Основные настройки:
```bash
SECRET_KEY=ваш-секретный-ключ-50-символов
ALLOWED_HOSTS=labosfera.ru,www.labosfera.ru,*.reg.ru
EMAIL_HOST_USER=noreply@labosfera.ru
EMAIL_HOST_PASSWORD=ваш_пароль_почты
```

### 2. Настройка домена в панели REG.RU
1. Войдите в панель управления хостингом
2. Перейдите в "Сайты" → "Добавить сайт"
3. Укажите домен: `labosfera.ru`
4. Корневая папка: `/home/u3283831/labosfera/`

### 3. Настройка веб-сервера
В панели управления:
1. **Apache**: Файл `.htaccess` уже создан автоматически
2. **Nginx**: Обратитесь в поддержку для настройки

## 🔧 Полезные команды

### Обновление проекта
```bash
cd ~/labosfera
git pull origin main
cd backend
source venv/bin/activate
python manage.py collectstatic --noinput
```

### Работа с Django
```bash
cd ~/labosfera/backend
source venv/bin/activate

# Миграции
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Django shell
python manage.py shell

# Сбор статики
python manage.py collectstatic
```

### Логи и отладка
```bash
# Просмотр логов Django
tail -f ~/labosfera/backend/logs/django.log

# Проверка процессов
ps aux | grep python

# Проверка места на диске
df -h
```

## 📁 Структура проекта на хостинге

```
/home/u3283831/labosfera/
├── .htaccess              # Конфигурация Apache
├── backend/
│   ├── venv/              # Виртуальное окружение Python
│   ├── .env               # Настройки Django
│   ├── db.sqlite3         # База данных SQLite
│   ├── staticfiles/       # Статические файлы Django
│   ├── media/             # Загруженные файлы
│   └── logs/              # Логи Django
├── frontend/
│   ├── out/               # Собранный Next.js
│   └── node_modules/      # Зависимости Node.js
└── start.sh               # Скрипт запуска
```

## 🌐 URL структура

После настройки сайт будет доступен:
- **Главная**: `https://labosfera.ru/`
- **Каталог**: `https://labosfera.ru/catalog/`
- **API**: `https://labosfera.ru/api/`
- **Админка**: `https://labosfera.ru/admin/`

## 🔐 Первый вход в админку

1. Откройте: `https://labosfera.ru/admin/`
2. Логин: `admin`
3. Пароль: `admin123`
4. **ОБЯЗАТЕЛЬНО** смените пароль после входа!

## 🚨 Возможные проблемы

### Node.js не найден
```bash
# Установка через NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

### Python зависимости не устанавливаются
```bash
# Обновление pip
cd ~/labosfera/backend
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Сайт не открывается
1. Проверьте настройки домена в панели управления
2. Убедитесь, что корневая папка указана правильно
3. Проверьте файл .htaccess

### Админка не работает
```bash
# Пересоберите статику
cd ~/labosfera/backend
source venv/bin/activate
python manage.py collectstatic --noinput
```

## 📞 Поддержка

- **REG.RU**: https://www.reg.ru/support/
- **Документация**: Telegram @regru_support
- **Панель управления**: https://www.reg.ru/user/account/

## ⚡ Быстрые команды

```bash
# Полное обновление
cd ~/labosfera && git pull && cd backend && source venv/bin/activate && python manage.py collectstatic --noinput

# Создание резервной копии БД
cp ~/labosfera/backend/db.sqlite3 ~/backup_$(date +%Y%m%d).sqlite3

# Просмотр размера проекта
du -sh ~/labosfera/

# Очистка логов
> ~/labosfera/backend/logs/django.log
```

---

**🧪 ЛАБОСФЕРА готова к работе на виртуальном хостинге REG.RU!**