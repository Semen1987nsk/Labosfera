from django.db import models
from django.core.exceptions import ValidationError
from PIL import Image
from ckeditor.fields import RichTextField
import os

def validate_image_size(image):
    """Валидация размера изображения"""
    # Максимальный размер файла: 5 МБ
    max_size = 5 * 1024 * 1024
    if image.size > max_size:
        raise ValidationError('Размер изображения не должен превышать 5 МБ')

def validate_image_dimensions(image):
    """Валидация размеров изображения"""
    if image:
        # Открываем изображение для проверки размеров
        img = Image.open(image)
        width, height = img.size
        
        # Минимальные размеры
        min_width, min_height = 400, 300
        if width < min_width or height < min_height:
            raise ValidationError(f'Минимальный размер изображения: {min_width}×{min_height} пикселей')
        
        # Максимальные размеры
        max_width, max_height = 3000, 3000
        if width > max_width or height > max_height:
            raise ValidationError(f'Максимальный размер изображения: {max_width}×{max_height} пикселей')

class Category(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="URL (слаг)")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    image = models.ImageField(upload_to='categories/', blank=True, null=True, verbose_name="Изображение")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"


class Product(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название товара")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="URL (слаг)", blank=True, help_text="Используйте латиницу, дефисы вместо пробелов. Если оставить пустым, заполнится автоматически.")
    description = RichTextField(verbose_name="Описание", blank=True, config_name='product_description',
                               help_text="Используйте форматирование для создания таблиц, списков и выделения текста")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    # Поле image отсюда удалено
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, verbose_name="Категория")
    
    # Новое поле для управления порядком
    sort_order = models.IntegerField(default=0, verbose_name="Порядок сортировки", help_text="Чем меньше число, тем выше товар в списке")
    is_featured = models.BooleanField(default=False, verbose_name="Рекомендуемый товар", help_text="Будет показан в начале списка")
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        ordering = ['-is_featured', 'sort_order', 'name']
        indexes = [
            models.Index(fields=['-is_featured', 'sort_order', 'name']),
            models.Index(fields=['category', 'is_featured']),
            models.Index(fields=['slug']),
        ]

# --- НОВАЯ МОДЕЛЬ ДЛЯ ИЗОБРАЖЕНИЙ ---
class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE, verbose_name="Товар")
    image = models.ImageField(
        upload_to='products/', 
        verbose_name="Изображение",
        validators=[validate_image_size, validate_image_dimensions],
        help_text="Форматы: JPEG, PNG, WebP. Размер: 400×300 - 3000×3000 пикселей. Максимум: 5 МБ"
    )
    is_main = models.BooleanField(default=False, verbose_name="Главное изображение")
    alt_text = models.CharField(max_length=255, blank=True, verbose_name="Альтернативный текст", 
                               help_text="Описание изображения для SEO и доступности")

    def __str__(self):
        return f"Изображение для {self.product.name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # Автоматически делаем первое изображение главным
        if not ProductImage.objects.filter(product=self.product, is_main=True).exists():
            self.is_main = True
            super().save(*args, **kwargs)
        
        # Оптимизация изображения
        if self.image:
            self.optimize_image()

    def optimize_image(self):
        """Оптимизация изображения"""
        try:
            img = Image.open(self.image.path)
            
            # Конвертируем в RGB если нужно
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Изменяем размер если слишком большое
            max_size = (1500, 1500)
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Сохраняем с оптимизацией
            img.save(self.image.path, "JPEG", quality=85, optimize=True)
            
        except Exception as e:
            print(f"Ошибка оптимизации изображения: {e}")

    class Meta:
        verbose_name = "Изображение товара"
        verbose_name_plural = "Изображения товаров"
        ordering = ['-is_main', 'id']