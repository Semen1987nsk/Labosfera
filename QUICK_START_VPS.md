# 🚀 ЛАБОСФЕРА - Быстрый старт на VPS

## ✅ У вас уже есть VPS? Отлично!

### 📋 Что нужно сделать ДО автоматического развертывания:

## 1️⃣ Настройка DNS (ОБЯЗАТЕЛЬНО!)

В панели управления вашего хостинга (REG.RU или другого) настройте DNS записи:

```
Тип    Имя    Значение
A      @      ВАШ_IP_СЕРВЕРА
A      www    ВАШ_IP_СЕРВЕРА
```

**Пример для labosfera.ru:**
```
A      @      45.67.89.123  (ваш реальный IP)
A      www    45.67.89.123  (ваш реальный IP)
```

⏰ **Время распространения DNS**: 15 минут - 2 часа

## 2️⃣ Подключение к серверу

```bash
# Подключитесь к вашему VPS
ssh root@ВАШ_IP_СЕРВЕРА

# Пример:
ssh root@45.67.89.123
```

## 3️⃣ Автоматическое развертывание (ОДНА КОМАНДА!)

```bash
# Скачиваем и запускаем скрипт автоматического развертывания
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh -o deploy.sh && chmod +x deploy.sh && ./deploy.sh
```

## 4️⃣ Что произойдет автоматически:

### ✅ Система подготовится:
- Обновит Ubuntu
- Установит Docker и Docker Compose
- Установит Git

### ✅ Проект развернется:
- Склонирует код с GitHub
- Создаст `.env.prod` из шаблона
- **ОСТАНОВИТСЯ** и попросит вас отредактировать настройки

### ⚠️ ВАЖНЫЙ МОМЕНТ - Редактирование .env.prod

Скрипт создаст файл `.env.prod` и откроет его для редактирования. Вам нужно будет изменить:

```bash
# Скрипт покажет:
nano .env.prod

# В файле измените:
DOMAIN=labosfera.ru                                    # ✅ Ваш домен
EMAIL=admin@labosfera.ru                              # ✅ Ваш email для SSL
POSTGRES_PASSWORD=SuperSecurePassword123!             # ⚠️ ОБЯЗАТЕЛЬНО смените!
DJANGO_SECRET_KEY=ваш-супер-секретный-ключ-50-символов # ⚠️ ОБЯЗАТЕЛЬНО смените!
ALLOWED_HOSTS=labosfera.ru,www.labosfera.ru           # ✅ Ваш домен
```

### 🔑 Генерация Django Secret Key

**В nano редакторе** замените `your-secret-key-here` на новый ключ:

```python
# Можете использовать этот сгенерированный ключ:
DJANGO_SECRET_KEY=k8m9p2q5w7x1z3c6v9b2n5r8t1y4u7i0o3s6f9j2l5o8r1u4w7z0c3f6i9m2p5s8
```

**Или сгенерируйте свой:**
- Откройте https://djecrety.ir/
- Скопируйте сгенерированный ключ
- Вставьте в `.env.prod`

### 💾 Сохранение изменений в nano:
```bash
Ctrl + X  # Выход
Y         # Подтвердить сохранение  
Enter     # Подтвердить имя файла
```

### ✅ Продолжение автоматического развертывания:
После сохранения `.env.prod` скрипт продолжит и автоматически:
- Получит SSL сертификат от Let's Encrypt
- Соберет и запустит все контейнеры
- Применит миграции базы данных
- Создаст администратора (`admin`/`admin123`)
- Соберет статические файлы

## 5️⃣ Результат развертывания:

### 🌐 Ваш сайт будет доступен:
```
https://labosfera.ru      - Основной сайт
https://labosfera.ru/admin/ - Админ панель
```

### 🔑 Данные для входа в админку:
```
Логин: admin
Пароль: admin123
```

**⚠️ КРИТИЧЕСКИ ВАЖНО**: Сразу после развертывания смените пароль администратора!

## 6️⃣ Проверка работоспособности:

```bash
# На сервере проверьте статус всех сервисов:
cd /opt/labosfera
docker-compose -f docker-compose.prod.yml ps

# Все сервисы должны быть "Up":
#   nginx     Up  0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
#   frontend  Up  3000/tcp
#   backend   Up  8000/tcp  
#   db        Up  5432/tcp
#   certbot   Exit 0
```

## 🚨 Если что-то пошло не так:

### DNS не настроен:
```bash
# Проверьте DNS
nslookup labosfera.ru

# Должен вернуть ваш IP сервера
```

### SSL сертификат не получился:
```bash
# Проверьте логи
docker-compose -f docker-compose.prod.yml logs certbot
```

### Сайт не открывается:
```bash
# Проверьте nginx
docker-compose -f docker-compose.prod.yml logs nginx

# Перезапустите при необходимости
docker-compose -f docker-compose.prod.yml restart nginx
```

## 🎯 Полная команда для копирования:

**Подключитесь к серверу и выполните:**

```bash
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh -o deploy.sh && chmod +x deploy.sh && ./deploy.sh
```

**Время развертывания**: 10-15 минут (в зависимости от скорости интернета)

## 📞 Нужна помощь?

- 📖 **Полная документация**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)  
- 👑 **Руководство админа**: [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
- ⚡ **Быстрые команды**: [ADMIN_QUICK_REFERENCE.md](ADMIN_QUICK_REFERENCE.md)

---

**🧪 ЛАБОСФЕРА - За 15 минут от VPS до работающего интернет-магазина!**