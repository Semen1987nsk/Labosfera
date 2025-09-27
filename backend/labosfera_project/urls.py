from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # Подключаем все URL'ы из нашего приложения catalog по префиксу api/v1/
    path('api/v1/', include('catalog.urls')),
]

# Эта строка нужна, чтобы в режиме разработки (DEBUG=True)
# Django мог сам раздавать медиафайлы (изображения), которые вы загружаете.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)