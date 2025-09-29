from django.contrib import admin
from .models import Category, Product, ProductImage

# Создаем "встройку" для удобного добавления изображений к товару
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    # По умолчанию показывать 1 пустое поле для загрузки нового изображения
    extra = 1 
    # Указываем, какие поля показывать в этой встройке
    fields = ('image', 'is_main')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)} # Автоматически заполняет slug из названия


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price')
    list_filter = ('category',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    # Добавляем встройку на страницу редактирования товара
    inlines = [ProductImageInline]