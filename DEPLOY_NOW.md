# 🚀 РАЗВЕРТЫВАНИЕ СЕЙЧАС - Готовый .env файл

## ✅ Всё готово к развертыванию!

**IP сервера:** 109.73.192.44  
**Домен:** labosfera.ru  
**SSL:** Готов (до 6 мая 2026)  
**Файл:** `.env.production` - **ГОТОВ!**

---

## 📋 ПЛАН ДЕЙСТВИЙ (30 минут)

### ШАГ 1: Скопировать .env на сервер (1 мин)

```bash
# С вашей локальной машины или из Codespaces
scp .env.production root@109.73.192.44:/root/.env.labosfera
```

**Альтернатива - создать вручную:**
```bash
ssh root@109.73.192.44
nano /root/.env.labosfera
# Скопировать содержимое из .env.production
# Ctrl+O, Enter, Ctrl+X
```

---

### ШАГ 2: Подключиться к серверу (1 мин)

```bash
ssh root@109.73.192.44
```

---

### ШАГ 3: Установить Docker (5 мин)

```bash
# Обновить систему
apt update && apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установить Docker Compose и Git
apt install docker-compose git -y

# Проверить
docker --version
docker-compose --version
```

---

### ШАГ 4: Клонировать проект (2 мин)

```bash
cd /opt
git clone https://github.com/Semen1987nsk/Labosfera.git
cd Labosfera

# Переключиться на рабочий коммит
git checkout 55d1acd

# Проверить что SSL сертификаты на месте
ls -la nginx/ssl/
```

---

### ШАГ 5: Установить .env файл (1 мин)

```bash
# Скопировать из домашней директории
cp /root/.env.labosfera /opt/Labosfera/.env

# Также скопировать в backend
cp /opt/Labosfera/.env /opt/Labosfera/backend/.env

# Проверить
head -5 /opt/Labosfera/.env
```

---

### ШАГ 6: Запустить проект с SSL (10 мин)

```bash
cd /opt/Labosfera

# Запустить все контейнеры (займет 5-10 минут)
docker-compose -f docker-compose.prod.yml up -d --build

# Следить за процессом сборки
docker-compose -f docker-compose.prod.yml logs -f
# Нажмите Ctrl+C когда увидите "ready" или "started"
```

---

### ШАГ 7: Настроить базу данных (3 мин)

```bash
# Применить миграции
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Собрать статические файлы
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --no-input

# Создать суперпользователя
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
# Введите логин: admin
# Email: admin@labosfera.ru
# Пароль: (придумайте надежный)
```

---

### ШАГ 8: Проверить статус (1 мин)

```bash
# Статус всех контейнеров
docker-compose -f docker-compose.prod.yml ps

# Должно быть примерно так:
# NAME                    STATE       PORTS
# labosfera_backend       Up         
# labosfera_frontend      Up         
# labosfera_nginx         Up          0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
# labosfera_db            Up
```

---

### ШАГ 9: Настроить DNS (вне сервера, 5 мин)

В панели управления доменом (где купили labosfera.ru) добавьте A-записи:

```
Тип    Имя              Значение         TTL
A      labosfera.ru     109.73.192.44    3600
A      www.labosfera.ru 109.73.192.44    3600
```

**Подождите 5-30 минут** пока DNS обновится.

---

### ШАГ 10: Проверка! (2 мин)

#### Локально на сервере:

```bash
# Проверить что nginx работает
curl http://localhost/api/v1/products/

# Проверить SSL
curl -I https://labosfera.ru
```

#### В браузере:

1. **Главная страница:** https://labosfera.ru
2. **Админ-панель:** https://labosfera.ru/admin/
3. **API:** https://labosfera.ru/api/v1/products/

---

## ✅ ГОТОВО!

Если всё работает:
- ✅ Сайт доступен по HTTPS
- ✅ SSL сертификат валиден
- ✅ Админка работает
- ✅ API возвращает данные

---

## 🔧 Полезные команды

```bash
# Логи всех сервисов
docker-compose -f docker-compose.prod.yml logs -f

# Логи конкретного сервиса
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f nginx

# Перезапуск
docker-compose -f docker-compose.prod.yml restart

# Остановка
docker-compose -f docker-compose.prod.yml down

# Полная пересборка
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate

# Вход в контейнер
docker-compose -f docker-compose.prod.yml exec backend bash
docker-compose -f docker-compose.prod.yml exec frontend sh
```

---

## 🆘 Если что-то не работает

### Ошибка: "Cannot connect to Docker daemon"

```bash
systemctl start docker
systemctl enable docker
```

### Ошибка: "Port 80 already in use"

```bash
# Найти процесс
netstat -tulpn | grep :80
# Или
lsof -i :80

# Остановить nginx на хосте если он запущен
systemctl stop nginx
systemctl disable nginx
```

### Ошибка: "Permission denied"

```bash
# Добавить права на выполнение
chmod +x /opt/Labosfera/*.sh
```

### Ошибка при сборке

```bash
# Очистить Docker кэш
docker system prune -a
docker volume prune

# Пересобрать заново
cd /opt/Labosfera
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
```

### DNS не обновился

```bash
# Проверить DNS
nslookup labosfera.ru
dig labosfera.ru

# Если не резолвится - подождите еще 10-20 минут
```

---

## 📊 Мониторинг

### Проверка использования ресурсов:

```bash
# CPU и Memory
docker stats

# Диск
df -h
docker system df
```

### Автоматический рестарт при падении:

В `docker-compose.prod.yml` уже настроен `restart: always`

### Backup базы данных:

```bash
# Создать backup
docker-compose -f docker-compose.prod.yml exec db pg_dump -U labosfera_prod_user labosfera_production > backup_$(date +%Y%m%d).sql

# Восстановить из backup
docker-compose -f docker-compose.prod.yml exec -T db psql -U labosfera_prod_user labosfera_production < backup_20251006.sql
```

---

## 📞 Финальный чеклист

- [ ] Docker установлен
- [ ] Проект склонирован в /opt/Labosfera
- [ ] .env файл на месте
- [ ] SSL сертификаты в nginx/ssl/
- [ ] Контейнеры запущены
- [ ] Миграции применены
- [ ] Статика собрана
- [ ] Суперпользователь создан
- [ ] DNS настроен
- [ ] Сайт открывается в браузере
- [ ] HTTPS работает
- [ ] Админка доступна

---

## 🎉 Поздравляем!

Сайт labosfera.ru успешно развернут на сервере 109.73.192.44!

**Доступ:**
- Сайт: https://labosfera.ru
- Админка: https://labosfera.ru/admin/
- API: https://labosfera.ru/api/v1/

**Учетные данные .env.production:**
- Database: labosfera_production
- DB User: labosfera_prod_user
- Telegram Bot: Подключен
- SSL: Действует до 6 мая 2026

---

*Время развертывания: ~30 минут*  
*Создано: 6 октября 2025*
