import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# --- БЕЗОПАСНОСТЬ: Ключ и режим отладки читаются из переменных окружения ---
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-temporary-default-key-for-dev')
DEBUG = os.environ.get('DJANGO_DEBUG', 'False').lower() == 'true'

# --- БЕЗОПАСНОСТЬ: Указываем конкретные хосты ---
# Используйте ваш актуальный URL от Codespace
ALLOWED_HOSTS = ['humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev', 'localhost', '127.0.0.1']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'catalog.apps.CatalogConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'labosfera_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'HOST': os.environ.get('DB_HOST'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'PORT': os.environ.get('DB_PORT'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ==============================================================================
# НАСТРОЙКИ CORS и CSRF
# ==============================================================================

CORS_ALLOWED_ORIGINS = [
    'https://humble-winner-97w5q7j66rqxhx9qq-3000.app.github.dev',  # Frontend URL
    'https://humble-winner-97w5q7j66rqxhx9qq-3001.app.github.dev',  # Alternative Frontend URL
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]

# Разрешаем все методы CORS
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Разрешаем все заголовки
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# ИСПРАВЛЕНО: Добавляем и публичный URL Codespace, и localhost, который он использует
CSRF_TRUSTED_ORIGINS = [
    'https://humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev',
    'https://localhost:8000', # <-- ДОБАВЛЕНА ЭТА СТРОКА
]

# --- НАСТРОЙКИ DJANGO REST FRAMEWORK ---
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    # --- ДОБАВЛЕНА ПАГИНАЦИЯ ---
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# ==============================================================================
# НАСТРОЙКИ ЗАГРУЗКИ ФАЙЛОВ
# ==============================================================================
# Устанавливаем максимальный размер загружаемого файла в 20 МБ (20 * 1024 * 1024 байт)
# Это должно быть равно или меньше значения client_max_body_size в nginx.conf
FILE_UPLOAD_MAX_MEMORY_SIZE = 20971520
DATA_UPLOAD_MAX_MEMORY_SIZE = 20971520