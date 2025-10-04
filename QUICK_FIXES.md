# ⚡ Быстрые исправления (Quick Fixes)

## � РЕШЕНИЕ: "Скрипт должен запускаться под root"

### Проблема:
```bash
❌ Ошибка: Скрипт должен запускаться под root
```

### ✅ Решения:

#### Вариант 1: Переключиться на root (РЕКОМЕНДУЕТСЯ)
```bash
# Переключаемся на пользователя root
sudo su -

# Запускаем скрипт заново
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh -o deploy.sh && chmod +x deploy.sh && ./deploy.sh
```

#### Вариант 2: Запуск через sudo (одной командой)
```bash
sudo bash -c 'curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh | bash'
```

#### Вариант 3: Пошагово с sudo
```bash
# Скачиваем скрипт
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh -o deploy.sh

# Делаем исполняемым
chmod +x deploy.sh

# Запускаем с правами root
sudo ./deploy.sh
```

### 💡 Почему нужны права root?
Скрипт выполняет системные операции:
- Обновление пакетов: `apt update && apt upgrade`
- Установка Docker: `curl -fsSL https://get.docker.com`
- Установка Docker Compose в `/usr/local/bin/`
- Создание папок в `/opt/labosfera`
- Настройка cron задач для SSL

---

## �🔴 КРИТИЧНО - Сделать СЕЙЧАС (15 минут)

### 1. Создать .gitignore для секретов

```bash
# Добавить в backend/.gitignore
echo "" >> backend/.gitignore
echo "# Secrets" >> backend/.gitignore
echo ".env" >> backend/.gitignore
echo "*.log" >> backend/.gitignore
echo "db.sqlite3" >> backend/.gitignore
```

### 2. Создать .env.example (backend)

```bash
cat > backend/.env.example << 'EOF'
# Django Settings
DJANGO_SECRET_KEY=your-secret-key-here-generate-new-one
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_NAME=labosfera_db
DB_USER=labosfera_user
DB_PASSWORD=your-secure-password-here
DB_HOST=db
DB_PORT=5432

# Telegram Notifications
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# Optional
SENTRY_DSN=
EOF
```

### 3. Удалить секреты из docker-compose.yml

**Заменить строки 17-28 в backend/docker-compose.yml:**

```yaml
# БЫЛО:
    environment:
      - PYTHONPATH=/app
      - DJANGO_SECRET_KEY=ychy5uakxhxg1-n5oj2-j4-3oj-c-a8eht-4-3y7l-kjpbqc
      - DJANGO_DEBUG=True
      - DB_NAME=labosfera_db
      - DB_USER=labosfera_user
      - DB_PASSWORD=Olimp_2025!
      - DB_HOST=db
      - DB_PORT=5432
      - TELEGRAM_BOT_TOKEN=8355662949:AAGUHPivIaYcsJlyve3iEaoRdvuVvJhQQ8w
      - TELEGRAM_CHAT_ID=300596362

# СТАЛО:
    environment:
      - PYTHONPATH=/app
    env_file:
      - .env
```

### 4. Удалить console.log из продакшн кода

```bash
# Найти все console.log
cd /workspaces/Labosfera/frontend
grep -r "console.log" src/

# Удалить или закомментировать:
# src/lib/api.ts строки 114, 116
# src/app/product/[slug]/page.tsx строки 28, 30
```

---

## 🟠 ВЫСОКИЙ ПРИОРИТЕТ (1 час)

### 5. Добавить database indexes

```python
# backend/catalog/models.py
# В class Product(models.Model) добавить:

class Meta:
    verbose_name = "Товар"
    verbose_name_plural = "Товары"
    ordering = ['-is_featured', 'sort_order', 'name']
    indexes = [
        models.Index(fields=['-is_featured', 'sort_order', 'name']),
        models.Index(fields=['category', 'is_featured']),
        models.Index(fields=['slug']),
    ]
```

```bash
# Создать и применить миграцию
cd backend
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### 6. Оптимизировать database queries

```python
# backend/catalog/views.py
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    ordering_fields = ['name', 'price', 'sort_order', 'is_featured', 'id']
    ordering = ['-is_featured', 'sort_order', 'name']
    
    def get_queryset(self):
        # ✅ Оптимизация: select_related и prefetch_related
        return Product.objects.select_related('category').prefetch_related('images')
```

### 7. Добавить мета-теги для SEO

```tsx
// frontend/src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'ЛАБОСФЕРА - Учебное оборудование для ОГЭ/ГИА',
    template: '%s | ЛАБОСФЕРА'
  },
  description: 'Производитель учебного оборудования для подготовки к ОГЭ/ГИА по физике и химии. Лабораторные комплексы для школ.',
  keywords: ['учебное оборудование', 'ОГЭ', 'ГИА', 'лаборатория физика', 'химия', 'школьное оборудование'],
  authors: [{ name: 'ЛАБОСФЕРА' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ЛАБОСФЕРА',
    title: 'ЛАБОСФЕРА - Учебное оборудование',
    description: 'Производитель учебного оборудования для ОГЭ/ГИА'
  },
  robots: {
    index: true,
    follow: true
  }
};
```

### 8. Создать sitemap.xml

```typescript
// frontend/src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  try {
    const [products, categories] = await Promise.all([
      api.getProducts(),
      api.getCategories()
    ]);
    
    const productUrls = (products || []).map(p => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }));
    
    const categoryUrls = (categories || []).map(c => ({
      url: `${baseUrl}/catalog/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9
    }));
    
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${baseUrl}/catalog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      ...categoryUrls,
      ...productUrls
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [{
      url: baseUrl,
      lastModified: new Date()
    }];
  }
}
```

### 9. Создать robots.txt

```typescript
// frontend/src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/']
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
```

---

## 🟡 СРЕДНИЙ ПРИОРИТЕТ (2-3 часа)

### 10. Заменить print() на logging

```python
# backend/orders/views.py
import logging
logger = logging.getLogger(__name__)

# Заменить все print() на:
logger.info(f"Contact request #{contact.id} created")
logger.error(f"Error sending notification: {e}")
```

### 11. Добавить логирование в settings.py

```python
# backend/labosfera_project/settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/app/logs/django.log',
            'maxBytes': 1024*1024*15,  # 15MB
            'backupCount': 10,
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'catalog': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'orders': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
```

### 12. Создать custom hook для форм

```typescript
// frontend/src/hooks/useForm.ts
import { useState, FormEvent } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => Record<string, string>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate
}: UseFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очистить ошибку для этого поля
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (validate) {
      const validationErrors = validate(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit(formData);
      setIsSubmitted(true);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Произошла ошибка' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormData(initialValues);
    setErrors({});
    setIsSubmitted(false);
  };

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
    reset
  };
}
```

### 13. Добавить .env.example для frontend

```bash
cat > frontend/.env.example << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_YANDEX_METRIKA_ID=
EOF
```

---

## 📋 Чеклист выполнения

```markdown
### Критично (15 мин)
- [ ] Создать backend/.gitignore
- [ ] Создать backend/.env.example
- [ ] Убрать секреты из docker-compose.yml
- [ ] Удалить console.log из кода

### Высокий приоритет (1 час)
- [ ] Добавить database indexes
- [ ] Оптимизировать queries (select_related)
- [ ] Добавить мета-теги SEO
- [ ] Создать sitemap.ts
- [ ] Создать robots.ts

### Средний приоритет (2-3 часа)
- [ ] Заменить print() на logging
- [ ] Настроить LOGGING в settings
- [ ] Создать useForm hook
- [ ] Создать frontend/.env.example
```

---

## 🚀 Команды для быстрого запуска

```bash
# 1. Остановить контейнеры
cd /workspaces/Labosfera/backend
docker-compose down

# 2. Создать .env файл из примера
cp .env.example .env
# Отредактировать .env и заполнить реальные значения

# 3. Убрать секреты из docker-compose.yml (вручную)

# 4. Запустить снова
docker-compose up -d

# 5. Применить миграции с индексами
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# 6. Проверить работу
curl http://localhost:8000/api/v1/products/
```

---

## ✅ После выполнения

Проверьте:
1. Секреты не в git: `git status` - не должно быть .env файлов
2. API работает: `curl http://localhost:8000/api/v1/products/`
3. Sitemap доступен: `curl http://localhost:3000/sitemap.xml`
4. robots.txt доступен: `curl http://localhost:3000/robots.txt`
5. Нет console.log в браузере (F12 Console)

---

**Время выполнения всех исправлений: ~4 часа**  
**Приоритет: Критично → Высокий → Средний**
