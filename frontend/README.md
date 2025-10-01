# Интернет-магазин "ЛАБОСФЕРА"

Проект по созданию современного интернет-магазина учебного оборудования.

## Технологический стек

*   **Backend:** Django, Django Rest Framework, PostgreSQL
*   **Frontend:** Next.js, TypeScript, Tailwind CSS
*   **Инфраструктура:** Docker, Nginx

## Структура проекта

*   `/backend`: Содержит Django-проект и конфигурацию Docker.
*   `/frontend`: Содержит Next.js приложение.

## Быстрый старт (Frontend)

1.  Перейдите в директорию фронтенда:
    ```bash
    cd frontend
    ```
2.  Создайте файл с переменными окружения из шаблона:
    ```bash
    cp .env.example .env.local
    ```
3.  Откройте `.env.local` и укажите актуальный URL вашего бэкенда для переменной `NEXT_PUBLIC_API_URL`.
4.  Установите зависимости:
    ```bash
    npm install
    ```
5.  Запустите сервер для разработки:
    ```bash
    npm run dev
    ```



cd /workspaces/Labosfera/backend


Bash
docker-compose up -d


cd /workspaces/Labosfera/frontend

Bash
npm run dev

rm -rf .next 