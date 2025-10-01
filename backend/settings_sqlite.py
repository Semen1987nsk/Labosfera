# Временные настройки для тестирования с SQLite
from labosfera_project.settings import *

# Переопределяем настройки базы данных для SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

print("🔧 Используется SQLite для тестирования")