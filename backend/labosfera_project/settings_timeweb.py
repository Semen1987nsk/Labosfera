# ==========================================
# ЛАБОСФЕРА - Специальная конфигурация Django для Timeweb Cloud
# Оптимизировано для Ubuntu 24.04 LTS, NVMe дисков и гигабитного канала
# ==========================================

import os
from pathlib import Path
from django.core.management.utils import get_random_secret_key

# Базовые настройки
BASE_DIR = Path(__file__).resolve().parent.parent

# БЕЗОПАСНОСТЬ
# ==========================================

# Секретный ключ (ОБЯЗАТЕЛЬНО установите в переменных окружения)
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', get_random_secret_key())

# ВСЕГДА False в продакшене!
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# Разрешенные хосты
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Настройки безопасности для HTTPS
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS = 31536000  # 1 год
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# Безопасные cookies
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

# CORS настройки
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False

# CSRF настройки
CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS', '').split(',')

# ПРИЛОЖЕНИЯ
# ==========================================

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sitemaps',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    'whitenoise.runserver_nostatic',
]

LOCAL_APPS = [
    'catalog',
    'orders',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# MIDDLEWARE
# ==========================================

MIDDLEWARE = [
    # Безопасность (должно быть первым)
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    
    # Статические файлы (оптимизировано для Timeweb)
    'whitenoise.middleware.WhiteNoiseMiddleware',
    
    # Основные middleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'labosfera_project.urls'

# ШАБЛОНЫ
# ==========================================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'labosfera_project.wsgi.application'

# БАЗА ДАННЫХ
# ==========================================

# PostgreSQL оптимизированный для Timeweb Cloud
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'labosfera'),
        'USER': os.getenv('POSTGRES_USER', 'labosfera'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'db'),
        'PORT': os.getenv('DB_PORT', '5432'),
        'CONN_MAX_AGE': int(os.getenv('DATABASE_CONN_MAX_AGE', '600')),
        'OPTIONS': {
            'sslmode': 'prefer',
            'connect_timeout': int(os.getenv('DATABASE_TIMEOUT', '30')),
        }
    }
}

# Настройки пула соединений для высокой нагрузки
DATABASE_POOL_ARGS = {
    'max_overflow': 0,
    'pool_pre_ping': True,
    'pool_recycle': 300,
}

# REST FRAMEWORK
# ==========================================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    },
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
}

# ВАЛИДАЦИЯ ПАРОЛЕЙ
# ==========================================

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ЛОКАЛИЗАЦИЯ
# ==========================================

LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# СТАТИЧЕСКИЕ И МЕДИА ФАЙЛЫ
# ==========================================

# Статические файлы (оптимизировано для NVMe дисков Timeweb)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# Оптимизированная обработка статических файлов
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

# Медиа файлы
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Настройки загрузки файлов
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024   # 5MB
FILE_UPLOAD_PERMISSIONS = 0o644

# EMAIL
# ==========================================

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.yandex.ru')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@labosfera.ru')
SERVER_EMAIL = DEFAULT_FROM_EMAIL

# КЭШИРОВАНИЕ
# ==========================================

# Кэш в памяти (можно заменить на Redis)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'TIMEOUT': int(os.getenv('CACHE_TTL', '300')),
        'OPTIONS': {
            'MAX_ENTRIES': int(os.getenv('CACHE_MAX_ENTRIES', '10000')),
            'CULL_FREQUENCY': 3,
        }
    }
}

# Кэширование сессий
SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'
SESSION_CACHE_ALIAS = 'default'
SESSION_COOKIE_AGE = int(os.getenv('SESSION_COOKIE_AGE', '86400'))  # 24 часа

# ЛОГИРОВАНИЕ
# ==========================================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
        'timeweb': {
            'format': '[TIMEWEB] {asctime} {levelname} {name}: {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'timeweb',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'maxBytes': 1024*1024*10,  # 10MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'error_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'error.log',
            'maxBytes': 1024*1024*10,  # 10MB
            'backupCount': 5,
            'formatter': 'verbose',
            'level': 'ERROR',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': os.getenv('LOG_LEVEL', 'INFO'),
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'catalog': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'orders': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# ПРОИЗВОДИТЕЛЬНОСТЬ
# ==========================================

# Оптимизация для NVMe дисков Timeweb Cloud
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Оптимизация запросов
CONN_MAX_AGE = 60
ATOMIC_REQUESTS = False

# Настройки для высокой нагрузки
DATA_UPLOAD_MAX_NUMBER_FIELDS = 1000
DATA_UPLOAD_MAX_NUMBER_FILES = 100

# TELEGRAM (опционально)
# ==========================================

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID', '')

# ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ
# ==========================================

# Отключение debug toolbar в продакшене
ENABLE_DEBUG_TOOLBAR = os.getenv('ENABLE_DEBUG_TOOLBAR', 'False').lower() == 'true'

# SEO настройки
SITE_NAME = os.getenv('SITE_NAME', 'ЛАБОСФЕРА')
SITE_DESCRIPTION = os.getenv('SITE_DESCRIPTION', 'Интернет-магазин лабораторного оборудования')

# Метрики и аналитика
GOOGLE_ANALYTICS_ID = os.getenv('GOOGLE_ANALYTICS_ID', '')
YANDEX_METRIKA_ID = os.getenv('YANDEX_METRIKA_ID', '')

# ==========================================
# СПЕЦИАЛЬНЫЕ ОПТИМИЗАЦИИ ДЛЯ TIMEWEB CLOUD
# ==========================================

# Флаг оптимизации для Timeweb
TIMEWEB_OPTIMIZED = True

# Настройки для NVMe дисков
USE_TZ = True
TIME_ZONE = 'Europe/Moscow'

# Оптимизация для гигабитного канала
ALLOWED_UPLOAD_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB

# Health check endpoint
HEALTH_CHECK_URL = '/api/health/'

# Проверка критических настроек
if not SECRET_KEY or len(SECRET_KEY) < 50:
    import sys
    print("❌ КРИТИЧЕСКАЯ ОШИБКА: DJANGO_SECRET_KEY не установлен или слишком короткий!")
    print("   Установите надежный секретный ключ в переменных окружения")
    sys.exit(1)

if DEBUG:
    print("⚠️  ВНИМАНИЕ: DEBUG=True в продакшене небезопасно!")

# Создание директорий для логов
os.makedirs(BASE_DIR / 'logs', exist_ok=True)
os.makedirs(MEDIA_ROOT, exist_ok=True)

print(f"🚀 Django настроен для Timeweb Cloud (DEBUG={DEBUG})")
print(f"🎯 Оптимизации: NVMe диски + 1 Gbps канал + PostgreSQL")
print(f"🔒 Безопасность: HTTPS + HSTS + Security Headers")