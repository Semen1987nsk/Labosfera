# Сериализаторы для API заявок
from rest_framework import serializers
from .models import Order, OrderItem, ContactRequest
from catalog.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'quantity', 'price_at_order']

class OrderCreateSerializer(serializers.Serializer):
    """Сериализатор для создания заявки из корзины"""
    # Контактная информация
    name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    organization = serializers.CharField(max_length=200, required=False, allow_blank=True)
    message = serializers.CharField(required=False, allow_blank=True)
    
    # Товары в корзине
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )

    def validate_items(self, value):
        """Валидация товаров"""
        if not value:
            raise serializers.ValidationError("Корзина не может быть пустой")
        
        for item in value:
            if 'product_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError("Каждый товар должен содержать product_id и quantity")
            
            try:
                product_id = int(item['product_id'])
                quantity = int(item['quantity'])
                if quantity <= 0:
                    raise serializers.ValidationError("Количество должно быть больше 0")
                
                # Проверяем, что товар существует
                if not Product.objects.filter(id=product_id).exists():
                    raise serializers.ValidationError(f"Товар с ID {product_id} не найден")
                    
            except (ValueError, TypeError):
                raise serializers.ValidationError("Неверный формат product_id или quantity")
        
        return value

    def create(self, validated_data):
        """Создание заявки с товарами"""
        items_data = validated_data.pop('items')
        
        # Подсчитываем общую информацию
        total_items = sum(int(item['quantity']) for item in items_data)
        estimated_total = 0
        
        # Создаем заявку
        order = Order.objects.create(
            total_items=total_items,
            estimated_total=estimated_total,
            **validated_data
        )
        
        # Добавляем товары
        for item_data in items_data:
            product = Product.objects.get(id=int(item_data['product_id']))
            quantity = int(item_data['quantity'])
            
            # Сохраняем цену на момент заказа
            price_at_order = None
            if product.price:
                try:
                    price_at_order = float(product.price)
                    estimated_total += price_at_order * quantity
                except (ValueError, TypeError):
                    pass
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price_at_order=price_at_order
            )
        
        # Обновляем примерную стоимость
        if estimated_total > 0:
            order.estimated_total = estimated_total
            order.save()
        
        return order

class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор для чтения заявок"""
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'

class ContactRequestCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания обращений"""
    
    class Meta:
        model = ContactRequest
        fields = ['name', 'phone', 'email', 'organization', 'message', 'request_type']
        extra_kwargs = {
            'message': {'required': False, 'allow_blank': True},
            'organization': {'required': False, 'allow_blank': True},
            'email': {'required': False, 'allow_blank': True},
        }
        
    def validate_phone(self, value):
        """Базовая валидация телефона"""
        # Удаляем все кроме цифр и плюса
        import re
        cleaned = re.sub(r'[^\d+]', '', value)
        if len(cleaned) < 10:
            raise serializers.ValidationError("Слишком короткий номер телефона")
        return value

class ContactRequestSerializer(serializers.ModelSerializer):
    """Сериализатор для чтения обращений"""
    request_type_display = serializers.CharField(source='get_request_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ContactRequest
        fields = '__all__'