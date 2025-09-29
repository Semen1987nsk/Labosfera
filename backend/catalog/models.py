from django.db import models

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
    description = models.TextField(verbose_name="Описание", blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    # Поле image отсюда удалено
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, verbose_name="Категория")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

# --- НОВАЯ МОДЕЛЬ ДЛЯ ИЗОБРАЖЕНИЙ ---
class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE, verbose_name="Товар")
    image = models.ImageField(upload_to='products/', verbose_name="Изображение")
    is_main = models.BooleanField(default=False, verbose_name="Главное изображение")

    def __str__(self):
        return f"Изображение для {self.product.name}"

    class Meta:
        verbose_name = "Изображение товара"
        verbose_name_plural = "Изображения товаров"