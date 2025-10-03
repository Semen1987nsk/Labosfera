from rest_framework import viewsets
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug' # Искать категории по текстовому slug, а не по id

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    ordering_fields = ['name', 'price', 'sort_order', 'is_featured', 'id']
    ordering = ['-is_featured', 'sort_order', 'name']
    
    def get_queryset(self):
        """Оптимизированный queryset с select_related и prefetch_related"""
        return Product.objects.select_related('category').prefetch_related('images')