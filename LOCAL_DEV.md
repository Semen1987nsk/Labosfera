# Локальная разработка Labosfera

## Быстрый старт

### 1. Запуск бэкенда (Django)

```bash
cd backend
docker-compose up -d
```

Бэкенд будет доступен на: http://localhost:8000  
Админ-панель: http://localhost:8000/admin/

### 2. Запуск фронтенда (Next.js)

```bash
cd frontend
npm run dev
```

Фронтенд будет доступен на: http://localhost:3000

### 3. Доступ к админ-панели

**Для Codespaces:**
- URL: https://humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev/admin/
- Логин: `Asd`
- Пароль: тот, что вы установили при создании

**Для локального запуска:**
- URL: http://localhost:8000/admin/

### 4. Создание суперпользователя

Если нужно создать нового администратора:

```bash
docker exec -it labosfera_backend python manage.py createsuperuser
```

### 5. Переменные окружения

**Для Codespaces (frontend/.env.local):**
```env
NEXT_PUBLIC_API_URL=https://humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev
NEXT_PUBLIC_SITE_URL=https://humble-winner-97w5q7j66rqxhx9qq-3000.app.github.dev
```

**Для локальной разработки (frontend/.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 6. Полезные команды

**Просмотр логов бэкенда:**
```bash
cd backend
docker-compose logs -f backend
```

**Перезапуск бэкенда:**
```bash
cd backend
docker-compose restart backend
```

**Остановка всех контейнеров:**
```bash
cd backend
docker-compose down
```

**Статус контейнеров:**
```bash
docker ps
```

## API Endpoints

- Продукты: `/api/v1/products/`
- Категории: `/api/v1/categories/`
- Контакты (обращения): `/api/v1/contacts/`
- Health check: `/api/health/`

## Структура проекта

```
/workspaces/Labosfera/
├── backend/              # Django REST API
│   ├── docker-compose.yml  # для локальной разработки
│   └── .env              # переменные окружения бэкенда
├── frontend/             # Next.js приложение
│   └── .env.local        # переменные окружения фронтенда
├── docker-compose.prod.yml  # для продакшена
└── docker-compose.simple.yml # упрощенная продакшн конфигурация
```
