#!/bin/bash

# 🚀 ЛАБОСФЕРА - Финальный скрипт развертывания
# Версия: 1.0 (Исправленная)
# Дата: $(date '+%Y-%m-%d')

set -e

echo "🧪 ЛАБОСФЕРА - Развертывание исправленной версии"
echo "=================================================="

# Проверка, что мы в правильной директории
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Ошибка: файл docker-compose.prod.yml не найден"
    echo "   Убедитесь, что вы находитесь в корневой директории проекта"
    exit 1
fi

# Остановка контейнеров
echo "🔄 Остановка существующих контейнеров..."
docker compose -f docker-compose.prod.yml down || true

# Проверка переменных окружения
echo "🔍 Проверка конфигурации..."
if ! grep -q "DJANGO_ALLOWED_HOSTS" .env; then
    echo "❌ Ошибка: переменная DJANGO_ALLOWED_HOSTS не найдена в .env"
    exit 1
fi

if grep -q "CHANGE_THIS" .env; then
    echo "⚠️  Предупреждение: Некоторые переменные содержат значения по умолчанию"
    echo "   Убедитесь, что вы изменили секретные ключи и пароли"
fi

# Сборка образов
echo "🏗️  Сборка образов..."
docker compose -f docker-compose.prod.yml build --no-cache

# Запуск сервисов
echo "🚀 Запуск сервисов..."
docker compose -f docker-compose.prod.yml up -d

# Ожидание запуска базы данных
echo "⏳ Ожидание запуска базы данных..."
sleep 10

# Применение миграций
echo "📊 Применение миграций Django..."
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Создание категорий
echo "📂 Создание базовых категорий..."
docker compose -f docker-compose.prod.yml exec backend python manage.py shell -c "
from catalog.models import Category;
Category.objects.get_or_create(name='Химия', slug='himiya');
Category.objects.get_or_create(name='Физика', slug='fizika');
Category.objects.get_or_create(name='Программное обеспечение', slug='software');
print('✅ Категории созданы');
"

# Создание суперпользователя
echo "👤 Создание суперпользователя..."
echo "   Следуйте инструкциям для создания администратора:"
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser || echo "ℹ️  Суперпользователь уже существует"

# Финальная проверка
echo "🔍 Финальная проверка..."
echo "   Проверка статуса контейнеров:"
docker compose -f docker-compose.prod.yml ps

echo "   Проверка API:"
sleep 5
curl -s -I https://labosfera.ru/api/v1/categories/ | head -1 || echo "⚠️  API пока недоступен"

echo ""
echo "✅ Развертывание завершено!"
echo "🌐 Сайт доступен по адресу: https://labosfera.ru"
echo "🔧 Админка доступна по адресу: https://labosfera.ru/admin/"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Проверьте работу сайта в браузере"
echo "   2. Войдите в админку и добавьте товары"
echo "   3. Настройте email уведомления (при необходимости)"
echo ""
echo "📞 Поддержка: GitHub Issues или admin@labosfera.ru"