# API views для заявок
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from .models import Order, ContactRequest
from .serializers import OrderCreateSerializer, ContactRequestCreateSerializer
from .telegram_notifications import send_order_notification, send_contact_notification

def get_client_info(request):
    """Получение информации о клиенте"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    
    return ip, user_agent

@api_view(['POST'])
@permission_classes([AllowAny])
def create_order(request):
    """Создание заявки на заказ из корзины"""
    serializer = OrderCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        # Получаем информацию о клиенте
        ip_address, user_agent = get_client_info(request)
        
        # Создаем заявку
        order = serializer.save()
        order.ip_address = ip_address
        order.user_agent = user_agent
        order.save()
        
        # Отправляем уведомления
        try:
            send_order_notification(order)
        except Exception as e:
            print(f"Ошибка отправки уведомления о заказе: {e}")
        
        return Response({
            'success': True,
            'message': 'Заявка успешно отправлена! Наш менеджер свяжется с вами в ближайшее время.',
            'order_id': order.id
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_contact_request(request):
    """Создание обращения через форму обратной связи"""
    print(f"📨 Получен запрос на создание обращения:")
    print(f"    Данные: {request.data}")
    
    serializer = ContactRequestCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        print(f"✅ Валидация прошла успешно")
        # Получаем информацию о клиенте
        ip_address, user_agent = get_client_info(request)
        
        # Создаем обращение
        contact = serializer.save()
        contact.ip_address = ip_address
        contact.user_agent = user_agent
        contact.save()
        
        print(f"💾 Обращение #{contact.id} создано")
        
        # Отправляем уведомления
        print(f"🚀 Попытка отправить Telegram уведомление для обращения #{contact.id}")
        try:
            send_contact_notification(contact)
            print(f"✅ Telegram уведомление отправлено успешно для #{contact.id}")
        except Exception as e:
            print(f"❌ Ошибка отправки уведомления об обращении: {e}")
            import traceback
            traceback.print_exc()
        
        return Response({
            'success': True,
            'message': 'Ваше обращение принято! Мы свяжемся с вами в ближайшее время.',
            'request_id': contact.id
        }, status=status.HTTP_201_CREATED)
    else:
        print(f"❌ Ошибки валидации: {serializer.errors}")
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)