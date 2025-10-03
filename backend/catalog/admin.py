from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductImage

# Создаем "встройку" для удобного добавления изображений к товару
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image_preview', 'image', 'is_main', 'alt_text')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        """Превью изображения в админке"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 100px; max-height: 100px; border-radius: 5px;"/>',
                obj.image.url
            )
        return "Нет изображения"
    image_preview.short_description = "Превью"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'image_preview')
    prepopulated_fields = {'slug': ('name',)}
    
    def image_preview(self, obj):
        """Превью изображения категории"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 50px; max-height: 50px; border-radius: 5px;"/>',
                obj.image.url
            )
        return "Нет изображения"
    image_preview.short_description = "Фото"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'sort_order', 'is_featured', 'main_image_preview', 'images_count')
    list_filter = ('category', 'is_featured')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]
    list_editable = ('sort_order', 'is_featured')  # Позволяет редактировать прямо в списке
    ordering = ('-is_featured', 'sort_order', 'name')  # Порядок в админке
    
    def main_image_preview(self, obj):
        """Превью главного изображения"""
        main_image = obj.images.filter(is_main=True).first()
        if main_image and main_image.image:
            return format_html(
                '<img src="{}" style="max-width: 50px; max-height: 50px; border-radius: 5px;"/>',
                main_image.image.url
            )
        return "Нет фото"
    main_image_preview.short_description = "Главное фото"
    
    def images_count(self, obj):
        """Количество изображений"""
        count = obj.images.count()
        if count > 0:
            return format_html('<span style="color: green;">📷 {}</span>', count)
        return format_html('<span style="color: red;">❌ 0</span>')
    images_count.short_description = "Фото"


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image_preview', 'is_main', 'alt_text')
    list_filter = ('is_main', 'product__category')
    search_fields = ('product__name', 'alt_text')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 80px; max-height: 80px; border-radius: 5px;"/>',
                obj.image.url
            )
        return "Нет изображения"
    image_preview.short_description = "Превью"