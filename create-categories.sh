#!/bin/bash

# Скрипт для создания категорий в ЛАБОСФЕРА
echo "🎯 Создание категорий для ЛАБОСФЕРА..."

docker compose -f docker-compose.prod.yml exec backend python manage.py shell -c "
from catalog.models import Category;
Category.objects.get_or_create(name='Физика', slug='fizika');
Category.objects.get_or_create(name='Программное обеспечение', slug='software');
print('✅ Категории созданы успешно!')
"

echo "🔍 Проверка созданных категорий..."
docker compose -f docker-compose.prod.yml exec backend python manage.py shell -c "
from catalog.models import Category;
categories = Category.objects.all();
print('📋 Список категорий:');
for cat in categories:
    print(f'  - {cat.name} (slug: {cat.slug})');
print(f'📊 Всего категорий: {categories.count()}');
"

echo "✅ Скрипт завершен!"