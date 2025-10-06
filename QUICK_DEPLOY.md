# 🚀 Быстрое развертывание на Timeweb Cloud

## 1️⃣ На локальной машине (подготовка)

### Сгенерировать секретный ключ

```bash
python3 generate-secret-key.py
```

Скопируйте полученный ключ.

### Создать .env.production

```bash
cp .env.production.template .env.production
nano .env.production
```

Заполните:
- `DJANGO_SECRET_KEY` - вставьте сгенерированный ключ
- `DB_PASSWORD` - придумайте сложный пароль (20+ символов)
- `DJANGO_ALLOWED_HOSTS` - добавьте IP вашего сервера
- `DATABASE_URL` - используйте тот же пароль что и в DB_PASSWORD

**НЕ коммитьте .env.production в Git!**

## 2️⃣ На сервере Timeweb (подключение)

### Подключиться по SSH

```bash
ssh root@ВАШ_IP_АДРЕС
```

### Установить необходимое ПО

```bash
# Обновить систему
apt update && apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установить Docker Compose
apt install docker-compose git -y

# Проверить
docker --version
docker-compose --version
```

## 3️⃣ Клонировать проект

```bash
cd /opt
git clone https://github.com/Semen1987nsk/Labosfera.git
cd Labosfera

# Переключиться на рабочий коммит
git checkout 55d1acd
```

## 4️⃣ Перенести .env файл на сервер

### Способ 1: Через scp (с локальной машины)

```bash
scp .env.production root@ВАШ_IP:/opt/Labosfera/.env
```

### Способ 2: Создать вручную на сервере

```bash
nano /opt/Labosfera/.env
# Вставьте содержимое из .env.production
# Ctrl+O, Enter, Ctrl+X для сохранения
```

### Скопировать в backend

```bash
cp /opt/Labosfera/.env /opt/Labosfera/backend/.env
```

## 5️⃣ Запустить проект

### Вариант A: С встроенным SSL (РЕКОМЕНДУЕТСЯ)

У вас уже есть SSL сертификаты в `nginx/ssl/`. Используйте:

```bash
cd /opt/Labosfera

# Запустить контейнеры с SSL
docker-compose -f docker-compose.prod.yml up -d --build

# Подождать ~3-5 минут для сборки

# Проверить статус
docker-compose -f docker-compose.prod.yml ps

# Проверить логи
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Вариант B: Без SSL в Docker (упрощенный)

Если хотите использовать внешний SSL через панель Timeweb:

```bash
cd /opt/Labosfera

# Запустить контейнеры без SSL
docker-compose -f docker-compose.simple.yml up -d

# Подождать ~2 минуты для сборки

# Проверить статус
docker-compose -f docker-compose.simple.yml ps
```

## 6️⃣ Настроить базу данных

### Для Варианта A (docker-compose.prod.yml):

```bash
# Применить миграции
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Собрать статические файлы
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --no-input

# Создать суперпользователя
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

### Для Варианта B (docker-compose.simple.yml):

```bash
# Применить миграции
docker-compose -f docker-compose.simple.yml exec backend python manage.py migrate

# Собрать статические файлы
docker-compose -f docker-compose.simple.yml exec backend python manage.py collectstatic --no-input

# Создать суперпользователя
docker-compose -f docker-compose.simple.yml exec backend python manage.py createsuperuser
```

## 7️⃣ SSL Сертификаты

### Вариант A: У вас уже есть SSL сертификаты! ✅

SSL сертификаты находятся в `/opt/Labosfera/nginx/ssl/`:
- `fullchain.crt` - полная цепочка
- `labosfera.ru.key` - приватный ключ

При использовании `docker-compose.prod.yml` они **автоматически** копируются в контейнер nginx!

**Проверьте что файлы на сервере:**
```bash
ls -lah /opt/Labosfera/nginx/ssl/
```

**Сайт будет доступен на HTTPS автоматически!**
- https://labosfera.ru
- https://www.labosfera.ru

### Вариант B: Если используете docker-compose.simple.yml

SSL нужно настроить через панель Timeweb или установить Let's Encrypt вручную.

## 8️⃣ Настроить DNS

В панели управления доменом добавьте A-записи:

```
labosfera.ru        A    ВАШ_IP_АДРЕС
www.labosfera.ru    A    ВАШ_IP_АДРЕС
```

## 9️⃣ Проверка

### Локально на сервере

```bash
curl http://localhost/api/v1/products/
```

### В браузере

- https://labosfera.ru
- https://labosfera.ru/admin/
- https://labosfera.ru/api/v1/products/

## 🔟 Полезные команды

```bash
# Логи
docker-compose -f docker-compose.simple.yml logs -f

# Перезапуск
docker-compose -f docker-compose.simple.yml restart

# Остановка
docker-compose -f docker-compose.simple.yml down

# Обновление кода
cd /opt/Labosfera
git pull
docker-compose -f docker-compose.simple.yml up -d --build
docker-compose -f docker-compose.simple.yml exec backend python manage.py migrate
docker-compose -f docker-compose.simple.yml exec backend python manage.py collectstatic --no-input
```

## ⚠️ Если что-то не работает

### Проверить логи

```bash
docker-compose -f docker-compose.simple.yml logs backend
docker-compose -f docker-compose.simple.yml logs frontend
docker-compose -f docker-compose.simple.yml logs nginx
```

### Проверить порты

```bash
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

### Проверить firewall

```bash
ufw status
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
```

## 📞 Контакты для поддержки

Если возникли проблемы, проверьте:
1. Логи контейнеров
2. DNS настройки домена
3. Firewall на сервере
4. Правильность .env файла
