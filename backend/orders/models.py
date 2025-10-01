# Модели для заявок
from django.db import models
from django.utils import timezone
from catalog.models import Product

class OrderStatus(models.TextChoices):
    NEW = 'new', 'Новая'
    PROCESSING = 'processing', 'В обработке'
    CONTACTED = 'contacted', 'Связались с клиентом'
    SENT_PROPOSAL = 'sent_proposal', 'КП отправлено'
    COMPLETED = 'completed', 'Заказ оформлен'
    CANCELLED = 'cancelled', 'Отменена'

class ContactStatus(models.TextChoices):
    NEW = 'new', 'Новое'
    PROCESSING = 'processing', 'В обработке'
    CONTACTED = 'contacted', 'Связались'
    COMPLETED = 'completed', 'Завершено'

class Order(models.Model):
    """Заявка на заказ из корзины"""
    # Контактная информация
    name = models.CharField('Имя', max_length=100)
    phone = models.CharField('Телефон', max_length=20)
    email = models.EmailField('Email')
    organization = models.CharField('Организация', max_length=200, blank=True)
    message = models.TextField('Комментарий к заказу', blank=True)
    
    # Системная информация
    status = models.CharField(
        'Статус', 
        max_length=20, 
        choices=OrderStatus.choices, 
        default=OrderStatus.NEW
    )
    created_at = models.DateTimeField('Дата создания', default=timezone.now)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)
    
    # Информация о заказе
    total_items = models.PositiveIntegerField('Общее количество товаров', default=0)
    estimated_total = models.DecimalField('Примерная стоимость', max_digits=10, decimal_places=2, null=True, blank=True)
    
    # IP и user agent для аналитики
    ip_address = models.GenericIPAddressField('IP адрес', null=True, blank=True)
    user_agent = models.TextField('User Agent', blank=True)

    class Meta:
        verbose_name = 'Заявка на заказ'
        verbose_name_plural = 'Заявки на заказы'
        ordering = ['-created_at']

    def __str__(self):
        return f"Заявка #{self.id} от {self.name} ({self.get_status_display()})"

class OrderItem(models.Model):
    """Товар в заявке"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField('Количество')
    price_at_order = models.DecimalField('Цена на момент заказа', max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        verbose_name = 'Товар в заявке'
        verbose_name_plural = 'Товары в заявках'

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"

class ContactRequest(models.Model):
    """Обращение через форму обратной связи"""
    # Контактная информация
    name = models.CharField('Имя', max_length=100)
    phone = models.CharField('Телефон', max_length=20)
    email = models.EmailField('Email', blank=True)
    organization = models.CharField('Организация', max_length=200, blank=True)
    message = models.TextField('Сообщение', blank=True)
    
    # Тип обращения
    REQUEST_TYPES = [
        ('callback', 'Обратный звонок'),
        ('consultation', 'Консультация'),
        ('custom_order', 'Заказ по ТЗ'),
        ('general', 'Общий вопрос'),
    ]
    request_type = models.CharField('Тип обращения', max_length=20, choices=REQUEST_TYPES, default='general')
    
    # Системная информация
    status = models.CharField(
        'Статус',
        max_length=20,
        choices=ContactStatus.choices,
        default=ContactStatus.NEW
    )
    created_at = models.DateTimeField('Дата создания', default=timezone.now)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)
    
    # IP и user agent
    ip_address = models.GenericIPAddressField('IP адрес', null=True, blank=True)
    user_agent = models.TextField('User Agent', blank=True)

    class Meta:
        verbose_name = 'Обращение'
        verbose_name_plural = 'Обращения'
        ordering = ['-created_at']

    def __str__(self):
        return f"Обращение от {self.name} ({self.get_request_type_display()})"