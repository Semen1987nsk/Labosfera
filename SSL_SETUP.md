# 🔐 SSL Сертификаты для Labosfera

## ✅ У вас уже есть SSL сертификаты!

Сертификаты находятся в директории: `/workspaces/Labosfera/nginx/ssl/`

### Файлы сертификатов:

```
nginx/ssl/
├── fullchain.crt              # Полная цепочка сертификатов (основной + промежуточные)
├── labosfera.ru.crt           # Основной сертификат домена
├── labosfera.ru.key           # Приватный ключ (СЕКРЕТНЫЙ!)
└── labosfera.ru.chain.crt     # Промежуточные сертификаты
```

## 🚀 Как это работает

### Вариант 1: docker-compose.prod.yml (РЕКОМЕНДУЕТСЯ)

**При сборке nginx контейнера:**
1. Dockerfile копирует все файлы из `nginx/ssl/` в `/etc/nginx/ssl/` внутри контейнера
2. Конфигурация `nginx/prod.conf` использует эти сертификаты:
   ```nginx
   ssl_certificate /etc/nginx/ssl/fullchain.crt;
   ssl_certificate_key /etc/nginx/ssl/labosfera.ru.key;
   ```
3. Nginx слушает порты 80 (HTTP) и 443 (HTTPS)
4. HTTP автоматически редиректит на HTTPS

**Команды:**
```bash
# Запуск с SSL
docker-compose -f docker-compose.prod.yml up -d --build

# Проверка SSL в логах
docker-compose -f docker-compose.prod.yml logs nginx

# Тест HTTPS
curl -I https://labosfera.ru
```

### Вариант 2: docker-compose.simple.yml (БЕЗ SSL)

**Упрощенный вариант:**
- Nginx слушает только порт 80 (HTTP)
- SSL настраивается внешним балансировщиком (например, через панель Timeweb)
- Сертификаты НЕ используются в Docker

## 📋 Проверка сертификатов

### На локальной машине:

```bash
# Проверить срок действия сертификата
openssl x509 -in nginx/ssl/labosfera.ru.crt -noout -dates

# Проверить для кого выдан
openssl x509 -in nginx/ssl/labosfera.ru.crt -noout -subject

# Проверить цепочку
openssl x509 -in nginx/ssl/fullchain.crt -noout -text
```

### На сервере после развертывания:

```bash
# Проверить что сертификаты скопировались в контейнер
docker exec labosfera_nginx ls -la /etc/nginx/ssl/

# Проверить конфигурацию nginx
docker exec labosfera_nginx nginx -t

# Тест SSL соединения
openssl s_client -connect labosfera.ru:443 -servername labosfera.ru
```

## 🔄 Обновление сертификатов

Если сертификаты истекают, нужно:

### 1. Обновить файлы на локальной машине

Заменить файлы в `nginx/ssl/`:
```bash
# Скопировать новые сертификаты
cp /путь/к/новым/fullchain.crt nginx/ssl/
cp /путь/к/новым/labosfera.ru.key nginx/ssl/
```

### 2. Закоммитить в Git (если ключ не секретный) или скопировать на сервер

```bash
# Вариант A: Через Git (НЕ рекомендуется для приватных ключей)
git add nginx/ssl/
git commit -m "Update SSL certificates"
git push

# Вариант B: Через SCP (РЕКОМЕНДУЕТСЯ)
scp nginx/ssl/* root@ВАШ_IP:/opt/Labosfera/nginx/ssl/
```

### 3. Пересобрать nginx контейнер на сервере

```bash
ssh root@ВАШ_IP
cd /opt/Labosfera

# Пересобрать и перезапустить nginx
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate nginx
```

## ⚠️ Безопасность

### Важно:

1. **Приватный ключ** (`labosfera.ru.key`) - **СЕКРЕТНЫЙ!**
   - НЕ коммитьте в публичный Git репозиторий
   - Храните в безопасном месте
   - Используйте `.gitignore` для исключения

2. **Права доступа:**
   ```bash
   # На сервере установите правильные права
   chmod 600 /opt/Labosfera/nginx/ssl/labosfera.ru.key
   chmod 644 /opt/Labosfera/nginx/ssl/*.crt
   ```

3. **Backup:**
   - Сделайте резервную копию всех файлов из `nginx/ssl/`
   - Храните в надежном месте (не на сервере)

## 📊 Проверка SSL на работающем сайте

### Онлайн инструменты:

1. **SSL Labs Test:**
   https://www.ssllabs.com/ssltest/analyze.html?d=labosfera.ru

2. **SSL Checker:**
   https://www.sslshopper.com/ssl-checker.html

### Команды:

```bash
# Проверить SSL с сервера
curl -vI https://labosfera.ru 2>&1 | grep -i ssl

# Проверить редирект с HTTP на HTTPS
curl -I http://labosfera.ru

# Проверить сертификат
echo | openssl s_client -connect labosfera.ru:443 2>/dev/null | openssl x509 -noout -dates
```

## 🆘 Решение проблем

### Ошибка: "SSL certificate problem"

```bash
# Проверить что fullchain.crt содержит всю цепочку
openssl crl2pkcs7 -nocrl -certfile nginx/ssl/fullchain.crt | openssl pkcs7 -print_certs -noout
```

### Ошибка: "nginx: [emerg] cannot load certificate"

```bash
# Проверить формат файлов
file nginx/ssl/fullchain.crt
file nginx/ssl/labosfera.ru.key

# Проверить что ключ и сертификат совпадают
openssl x509 -noout -modulus -in nginx/ssl/labosfera.ru.crt | openssl md5
openssl rsa -noout -modulus -in nginx/ssl/labosfera.ru.key | openssl md5
```

### Браузер показывает "Certificate is not trusted"

- Убедитесь что используете `fullchain.crt`, а не только `labosfera.ru.crt`
- Проверьте что файл содержит промежуточные сертификаты

## ✅ Итого

- ✅ SSL сертификаты уже в проекте
- ✅ Автоматически копируются при сборке
- ✅ Настроены в nginx/prod.conf
- ✅ Работают с docker-compose.prod.yml
- ✅ HTTPS будет работать сразу после развертывания

**Просто используйте `docker-compose.prod.yml` и SSL заработает автоматически!** 🎉
