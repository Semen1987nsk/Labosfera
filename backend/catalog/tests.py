from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Category, Product

class CategoryTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category',
            description='Test Description'
        )

    def test_category_list(self):
        """
        Проверяем, что API правильно возвращает список категорий
        """
        url = reverse('category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

class ProductTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price='99.99',
            category=self.category
        )

    def test_product_list(self):
        """
        Проверяем, что API правильно возвращает список продуктов
        """
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
