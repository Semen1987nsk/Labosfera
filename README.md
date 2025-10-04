# 🧪 ЛАБОСФЕРА - Интернет-магазин лабораторного оборудования

> Современная платформа для продажи лабораторного оборудования с передовым UI/UX дизайном

[![Production Ready](https://img.shields.io/badge/Production-Ready-green.svg)](https://labosfera.ru)
[![Django](https://img.shields.io/badge/Django-4.2-blue.svg)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

## 🚀 Быстрый старт для production

### Автоматическое развертывание (рекомендуется)
```bash
# Подключение к VPS как root (или sudo su -)
ssh root@YOUR_SERVER_IP

# Автоматическое развертывание одной командой
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh | bash

# Если ошибка с правами root:
sudo bash -c 'curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh | bash'
```

### Проверка готовности
```bash
./check-deployment.sh
```

### Ручное развертывание
Смотрите [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🏗️ Архитектура

### Backend (Django)
- **API**: Django REST Framework
- **База данных**: PostgreSQL (production) / SQLite (development)
- **Аутентификация**: Django Auth + JWT
- **Файлы**: Django Media handling
- **Админка**: Django Admin с кастомизацией

### Frontend (Next.js)
- **Framework**: Next.js 14.2 с App Router
- **Стили**: Tailwind CSS
- **Анимации**: Framer Motion
- **Состояние**: React Context + Local Storage
- **TypeScript**: Полная типизация

### DevOps
- **Контейнеризация**: Docker + Docker Compose
- **Прокси**: Nginx с SSL терминацией
- **SSL**: Let's Encrypt (автообновление)
- **Мониторинг**: Docker healthchecks

## 🎨 Возможности UI/UX

### ✅ Реализовано (Неделя 1)
- 🔄 **Skeleton Loading** - Плавные заглушки загрузки
- 📌 **Sticky Navigation** - Прилипающая навигация с blur эффектом
- 🌊 **Ripple Buttons** - Эффект волны при клике
- 📊 **Scroll Progress** - Индикатор прогресса скролла
- 🔢 **Animated Counters** - Анимированные счетчики статистики  
- 🎠 **Infinite Marquee** - Бесконечная лента партнеров
- ⏳ **Loading Spinners** - Современные индикаторы загрузки
- 🏷️ **Floating Labels** - Плавающие подписи форм
- 🔔 **Toast Notifications** - Всплывающие уведомления
- 👆 **Scroll Indicator** - Индикатор прокрутки в Hero секции

### 🚧 В разработке (Неделя 2)
- 🔍 **Live Search** - Живой поиск с предложениями
- 🚚 **Shipping Progress** - Прогресс до бесплатной доставки
- 📋 **Step Progress** - Индикатор шагов оформления заказа
- 👁️ **Product Quick View** - Быстрый просмотр товара
- 🏷️ **Filter Chips** - Чипы активных фильтров
- ➕ **Quantity Adjuster** - Красивый селектор количества
- 💾 **Auto-save Indicator** - Индикатор автосохранения
- 📱 **Mobile Touch Gestures** - Жесты для мобильных
- 🎯 **Smart Recommendations** - Умные рекомендации

## 📦 Компоненты

### Завершенные компоненты
```
components/ui/
├── SkeletonCard.tsx          # Скелетоны загрузки товаров
├── RippleButton.tsx          # Кнопки с эффектом волны
├── ScrollProgress.tsx        # Индикатор прогресса скролла  
├── StatCounter.tsx           # Анимированные счетчики
├── Toast.tsx                 # Система уведомлений
├── ScrollIndicator.tsx       # Индикатор прокрутки
├── LoadingSpinner.tsx        # Спиннеры загрузки
├── FloatingLabel.tsx         # Плавающие лейблы
└── InfiniteMarquee.tsx       # Бесконечная карусель
```

### В разработке
```
components/ui/
├── SearchBar.tsx             # Живой поиск
├── ShippingProgress.tsx      # Прогресс доставки
└── StepProgress.tsx          # Прогресс шагов
```

## � Админ панель

### Доступ к администрированию
- **URL**: `https://labosfera.ru/admin/`
- **Логин**: `admin` (по умолчанию)
- **Пароль**: `admin123` (⚠️ смените после входа!)

### Возможности админки
- 📦 **Управление товарами**: Добавление, редактирование, удаление
- 🏷️ **Категории**: Создание иерархии категорий
- 🖼️ **Изображения**: Загрузка и управление фото товаров
- 📋 **Заказы**: Обработка и отслеживание заказов
- 👥 **Пользователи**: Управление пользователями и правами
- 📊 **Статистика**: Базовая аналитика продаж

### Быстрый старт админки
1. Войдите в `https://labosfera.ru/admin/`
2. Используйте логин `admin` / пароль `admin123`
3. **Обязательно смените пароль**: Правый верхний угол → Change password
4. Добавьте первые товары: Catalog → Products → Add Product
5. Создайте категории: Catalog → Categories → Add Category

📖 **Подробное руководство**: [ADMIN_GUIDE.md](ADMIN_GUIDE.md)

## �🛠️ Разработка

### Требования
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose

### Локальная разработка
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (новый терминал)
cd frontend  
npm install
npm run dev
```

### Docker разработка
```bash
docker-compose up --build
```

## 🌐 Production

### Системные требования
- **VPS**: 4GB RAM, 2 CPU, 40GB SSD
- **ОС**: Ubuntu 22.04 LTS (рекомендуется)
- **Домен**: labosfera.ru с настроенными DNS

### Рекомендуемый хостинг
**REG.RU VPS-Business** (1990₽/мес)
- 4 vCPU, 4GB RAM, 80GB SSD
- Ubuntu 22.04 LTS
- Включена защита от DDoS

### Особенности production
- **SSL**: Автоматические сертификаты Let's Encrypt
- **Безопасность**: Rate limiting, Security headers, HTTPS redirect
- **Производительность**: Gzip сжатие, статические файлы через Nginx
- **Мониторинг**: Health checks всех сервисов
- **Бэкапы**: Автоматические бэкапы БД и медиафайлов

## 📱 Адаптивность

- **Desktop**: Полнофункциональный интерфейс
- **Tablet**: Адаптированная сетка и навигация  
- **Mobile**: Оптимизированные touch взаимодействия
- **PWA Ready**: Подготовлена основа для PWA

## 🔧 API Endpoints

### Продукты
```
GET  /api/products/           # Список товаров
GET  /api/products/{id}/      # Детали товара  
GET  /api/categories/         # Категории
```

### Заказы
```
POST /api/orders/             # Создание заказа
GET  /api/orders/{id}/        # Детали заказа
```

### Поиск
```
GET  /api/search/?q=query     # Поиск товаров
```

## 📈 Производительность

### Frontend оптимизации
- ✅ Next.js Static Generation
- ✅ Image Optimization  
- ✅ Code Splitting
- ✅ Bundle Analysis
- ✅ Core Web Vitals соответствие

### Backend оптимизации
- ✅ Database индексы
- ✅ Query optimization
- ✅ Static files через Nginx
- ✅ Gzip компрессия
- ✅ Кэширование

## 🔒 Безопасность

- ✅ HTTPS принудительно
- ✅ Security Headers (HSTS, CSP, X-Frame-Options)
- ✅ Rate Limiting  
- ✅ SQL Injection защита
- ✅ XSS защита
- ✅ CSRF токены
- ✅ Secure cookies

## 📊 Мониторинг

### Логи
```bash
# Все сервисы
docker-compose -f docker-compose.prod.yml logs -f

# Конкретный сервис  
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Метрики
```bash
# Использование ресурсов
docker stats

# Состояние сервисов
docker-compose -f docker-compose.prod.yml ps
```

## 🚀 Roadmap

### Фаза 1: Core E-commerce (✅ Завершено)
- [x] Каталог товаров
- [x] Корзина покупок  
- [x] Оформление заказов
- [x] Административная панель

### Фаза 2: Advanced UI (🚧 В процессе)
- [x] Skeleton Loading и анимации
- [x] Современные компоненты UI
- [ ] Продвинутые фильтры
- [ ] Персонализация

### Фаза 3: Business Features (📋 Планируется)
- [ ] Система лояльности
- [ ] Интеграция с 1С
- [ ] Аналитика и отчеты
- [ ] CRM интеграция

### Фаза 4: Mobile & PWA (📋 Планируется)
- [ ] React Native приложение
- [ ] Push уведомления  
- [ ] Офлайн режим
- [ ] Нативные функции

## 👥 Команда

- **Full-stack Development**: Semen1987nsk
- **UI/UX Design**: На основе современных трендов
- **DevOps**: Docker + Nginx + PostgreSQL

## 📞 Поддержка

- **Email**: admin@labosfera.ru
- **GitHub**: [Issues](https://github.com/Semen1987nsk/Labosfera/issues)
- **Документация**: [Deployment Guide](DEPLOYMENT_GUIDE.md)

## 📄 Лицензия

Проект разработан для ЛАБОСФЕРА. Все права защищены.

---

**🧪 ЛАБОСФЕРА - Ваш надежный партнер в области лабораторного оборудования**