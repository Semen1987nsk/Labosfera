from rest_framework import serializers
from .models import Category, Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_main']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            # Строим абсолютный URL
            url = request.build_absolute_uri(obj.image.url)
            # ГАРАНТИРОВАННО ЗАМЕНЯЕМ HTTP НА HTTPS
            if '127.0.0.1' not in url and 'localhost' not in url:
                url = url.replace('http://', 'https://')
            return url
        return None

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'description', 'category', 'category_name', 'images']

class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'products']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            url = request.build_absolute_uri(obj.image.url)
            if '127.0.0.1' not in url and 'localhost' not in url:
                url = url.replace('http://', 'https://')
            return url
        return None