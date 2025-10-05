# 🔐 Настройка SSL сертификата от Reg.ru для ЛАБОСФЕРА

## 📥 ШАГ 1: Скачать сертификаты из Reg.ru

1. Зайдите в личный кабинет Reg.ru
2. Перейдите в раздел **SSL / Сертификаты**
3. Найдите сертификат для **labosfera.ru**
4. Скачайте файлы:
   - `certificate.crt` (сертификат)
   - `private.key` (приватный ключ)
   - `ca_bundle.crt` (цепочка сертификатов)

## 📤 ШАГ 2: Загрузить сертификаты на сервер

```bash
# На вашем локальном компьютере
# Замените путь к файлам и IP сервера

scp certificate.crt root@109.73.192.44:/root/ssl/
scp private.key root@109.73.192.44:/root/ssl/
scp ca_bundle.crt root@109.73.192.44:/root/ssl/
```

Или через панель Timeweb:
1. Откройте файловый менеджер в панели Timeweb
2. Создайте папку `/root/ssl/`
3. Загрузите туда все 3 файла

## 🔧 ШАГ 3: Развернуть с SSL

```bash
# На сервере
cd /root/Labosfera

# Создаем директорию для SSL
mkdir -p /root/ssl

# Объединяем сертификат и цепочку
cat /root/ssl/certificate.crt /root/ssl/ca_bundle.crt > /root/ssl/fullchain.pem
cp /root/ssl/private.key /root/ssl/privkey.pem

# Запускаем с SSL конфигурацией
docker compose -f docker-compose.ssl.yml up -d
```

## 🌐 ШАГ 4: Проверка

После запуска проверьте:
- `https://labosfera.ru` - должен открываться с зеленым замком
- `http://labosfera.ru` - должен перенаправлять на HTTPS

## 🔄 Автоматическое обновление

SSL сертификаты от Reg.ru действуют 1 год. За месяц до окончания:
1. Обновите сертификат в панели Reg.ru
2. Скачайте новые файлы
3. Замените старые файлы на сервере
4. Перезапустите nginx: `docker restart labosfera_nginx`
