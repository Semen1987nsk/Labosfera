# URL patterns для заявок
from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    path('orders/', views.create_order, name='create_order'),
    path('contacts/', views.create_contact_request, name='create_contact_request'),
]