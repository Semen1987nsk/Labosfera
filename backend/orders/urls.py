# URL patterns для заявок
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

app_name = 'orders'

urlpatterns = [
    path('orders/', csrf_exempt(views.create_order), name='create_order'),
    path('contacts/', csrf_exempt(views.create_contact_request), name='create_contact_request'),
]