# 🎯 СТАРТ! Быстрое развертывание Labosfera

## 🎉 ВСЁ ГОТОВО К РАЗВЕРТЫВАНИЮ!

✅ **IP сервера:** 109.73.192.44
✅ **Домен:** labosfera.ru, www.labosfera.ru
✅ **SSL сертификаты:** готовы (до 6 мая 2026)
✅ **Файл .env.production:** ГОТОВ! Все настройки заполнены
✅ **Telegram:** подключен

## 📖 Какую инструкцию читать?

### ⭐ **НОВОЕ! `DEPLOY_NOW.md`** - ГОТОВ К РАЗВЕРТЫВАНИЮ ПРЯМО СЕЙЧАС!
   - ✅ .env.production уже создан и заполнен
   - ✅ Все настройки готовы для 109.73.192.44
   - ✅ 10 шагов = 30 минут
   - ✅ Просто копируй-вставляй команды

### 💻 **`COPY_PASTE_COMMANDS.sh`** - Все команды одним файлом
   - Скрипт с готовыми командами
   - Разбит по блокам
   - Комментарии на каждом шаге

### 1. `QUICK_DEPLOY.md` - Быстрая инструкция
   - Пошаговая инструкция
   - 10 простых шагов
   - Варианты с SSL и без

### 2. `SSL_SETUP.md` - Детали про SSL
   - Как работают сертификаты
   - Как их обновить
   - Решение проблем

### 3. `DEPLOYMENT_PLAN.md` - Полный план
   - Подробное описание каждого шага
   - Объяснение настроек
   - Чеклисты

### 4. `LOCAL_DEV.md` - Локальная разработка
   - Запуск на локальной машине
   - Настройка окружения
   - Полезные команды

## 🚀 Быстрый старт (ВСЕГО 4 КОМАНДЫ!)

### ✅ У вас уже готов файл `.env.production`!

### Шаг 1: Скопировать .env на сервер

```bash
scp .env.production root@109.73.192.44:/root/.env.labosfera
```

### Шаг 2: Подключиться и установить Docker

```bash
ssh root@109.73.192.44
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
apt install docker-compose git -y
```

### Шаг 3: Развернуть проект

```bash
cd /opt
git clone https://github.com/Semen1987nsk/Labosfera.git
cd Labosfera && git checkout a184399
cp /root/.env.labosfera .env
cp .env backend/.env
docker-compose -f docker-compose.prod.yml up -d --build
```

### Шаг 4: Настроить БД

```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --no-input
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

### 🎉 Готово! Откройте https://labosfera.ru

## ✅ Чеклист перед запуском

- [x] ✅ DJANGO_SECRET_KEY сгенерирован
- [x] ✅ .env.production создан и заполнен
- [x] ✅ Пароль БД: L@b0$fer@Pr0d2025!SecureDB#Pass
- [x] ✅ Telegram настроен
- [x] ✅ SSL сертификаты в nginx/ssl/
- [x] ✅ IP сервера: 109.73.192.44
- [ ] Docker и Docker Compose установлены на сервере
- [ ] Проект склонирован на сервер
- [ ] .env файл скопирован на сервер
- [ ] DNS настроен (labosfera.ru → 109.73.192.44)
- [ ] Firewall открыты порты 80, 443, 22

## 🆘 Если что-то не работает

### Проверить логи:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Проверить статус:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Перезапустить:
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Полная пересборка:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
```

## 📞 Структура проекта

```
Labosfera/
├── START_HERE.md ⭐ ← ВЫ ЗДЕСЬ
├── DEPLOY_NOW.md 🚀 ГОТОВ К РАЗВЕРТЫВАНИЮ! (НОВОЕ!)
├── COPY_PASTE_COMMANDS.sh 💻 Все команды одним файлом
├── .env.production 🔑 ГОТОВЫЙ .env для продакшена!
│   └── IP: 109.73.192.44
│   └── Telegram: подключен
│   └── SSL: готов
├── QUICK_DEPLOY.md 📖 Быстрая инструкция
├── SSL_SETUP.md 🔐 Про SSL сертификаты
├── DEPLOYMENT_PLAN.md 📋 Полный план
├── LOCAL_DEV.md 💻 Локальная разработка
├── README_DEPLOY.md 📊 Общая информация
├── generate-secret-key.py 🔑 Генератор ключей
├── docker-compose.prod.yml ⭐ ИСПОЛЬЗОВАТЬ ДЛЯ ПРОДАКШЕНА С SSL
├── docker-compose.simple.yml Без SSL
├── backend/ Django API
├── frontend/ Next.js
└── nginx/
    ├── ssl/ 🔐 SSL СЕРТИФИКАТЫ (УЖЕ ЕСТЬ!)
    ├── prod.conf Nginx с HTTPS
    └── Dockerfile Копирует сертификаты
```

## 🎓 Что нужно знать

### Два варианта развертывания:

| Вариант | Файл | SSL | Порты | Когда использовать |
|---------|------|-----|-------|-------------------|
| **A (Рекомендуется)** | `docker-compose.prod.yml` | ✅ Встроенный | 80, 443 | Полный контроль, готовые сертификаты |
| B (Упрощенный) | `docker-compose.simple.yml` | ❌ Внешний | 80 | SSL через панель хостинга |

### SSL Сертификаты:

- ✅ Уже в проекте: `nginx/ssl/`
- ✅ Автоматически копируются при сборке
- ✅ Действуют до мая 2026
- ✅ Домены: labosfera.ru, www.labosfera.ru

### Настройки:

- **Локальная разработка:** DEBUG=True, HTTP, localhost
- **Продакшен:** DEBUG=False, HTTPS, домен

## 🎉 Готово!

Проект готов к развертыванию. Все файлы подготовлены.

**Начните с `QUICK_DEPLOY.md` → следуйте инструкциям → готово!**

---

*Создано: 6 октября 2025*  
*Коммит: a184399*  
*SSL до: 6 мая 2026*
