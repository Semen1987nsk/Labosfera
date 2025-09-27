from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet

# Создаем роутер
router = DefaultRouter()

# Регистрируем наши ViewSet'ы
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')

# urlpatterns просто включают URL'ы, сгенерированные роутером
urlpatterns = [
    path('', include(router.urls)),
]