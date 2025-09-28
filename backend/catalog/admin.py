from django.contrib import admin
from .models import Category, Product

# Настройка для модели "Категория"
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)} # Автоматически заполняет slug из названия

# Настройка для модели "Товар"
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Какие поля показывать в списке всех товаров
    list_display = ('name', 'category', 'price', 'image')
    
    # По каким полям можно будет фильтровать список
    list_filter = ('category',)
    
    # По каким полям будет работать поиск
    search_fields = ('name', 'description')