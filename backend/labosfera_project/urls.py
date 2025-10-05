from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .health import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    # CKEditor URLs
    path('ckeditor/', include('ckeditor_uploader.urls')),
    # Health check endpoint
    path('api/health/', health_check, name='health_check'),
    # Подключаем все URL'ы из нашего приложения catalog по префиксу api/v1/
    path('api/v1/', include('catalog.urls')),
    # Подключаем URL'ы для заявок
    path('api/v1/', include('orders.urls')),
]

# Эта строка нужна, чтобы в режиме разработки (DEBUG=True)
# Django мог сам раздавать медиафайлы (изображения), которые вы загружаете.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)