# Telegram уведомления
import requests
from django.conf import settings
from typing import Optional

class TelegramNotifier:
    def __init__(self):
        self.bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
        self.chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
        self.api_url = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"
    
    def send_message(self, text: str, parse_mode: str = 'HTML') -> bool:
        """Отправка сообщения в Telegram"""
        if not self.bot_token or not self.chat_id:
            print("Telegram настройки не заданы")
            return False
        
        data = {
            'chat_id': self.chat_id,
            'text': text,
            'parse_mode': parse_mode,
            'disable_web_page_preview': True
        }
        
        try:
            response = requests.post(self.api_url, json=data, timeout=10)
            response.raise_for_status()
            return True
        except requests.exceptions.RequestException as e:
            print(f"Ошибка отправки в Telegram: {e}")
            return False

def format_order_message(order) -> str:
    """Форматирование сообщения о новой заявке"""
    message = f"""
🛒 <b>Новая заявка на заказ #{order.id}</b>

👤 <b>Клиент:</b>
• Имя: {order.name}
• Телефон: {order.phone}
• Email: {order.email}

🏢 <b>Организация:</b> {order.organization or 'Не указана'}

📦 <b>Товары:</b> {order.total_items} шт.
💰 <b>Примерная сумма:</b> {f'{order.estimated_total:,.0f} ₽' if order.estimated_total else 'Не рассчитана'}

💬 <b>Комментарий:</b>
{order.message or 'Нет комментария'}

📝 <b>Состав заказа:</b>
"""
    
    for item in order.items.all():
        price_info = f" ({item.price_at_order:,.0f} ₽)" if item.price_at_order else ""
        message += f"• {item.product.name} - {item.quantity} шт.{price_info}\n"
    
    message += f"\n⏰ <b>Время:</b> {order.created_at.strftime('%d.%m.%Y %H:%M')}"
    
    return message

def format_contact_message(contact) -> str:
    """Форматирование сообщения об обращении"""
    message = f"""
📞 <b>Новое обращение #{contact.id}</b>

👤 <b>Клиент:</b>
• Имя: {contact.name}
• Телефон: {contact.phone}
• Email: {contact.email or 'Не указан'}

🏢 <b>Организация:</b> {contact.organization or 'Не указана'}
📋 <b>Тип обращения:</b> {contact.get_request_type_display()}

💬 <b>Сообщение:</b>
{contact.message}

⏰ <b>Время:</b> {contact.created_at.strftime('%d.%m.%Y %H:%M')}
"""
    
    return message

def send_order_notification(order) -> bool:
    """Отправка уведомления о новой заявке"""
    notifier = TelegramNotifier()
    message = format_order_message(order)
    return notifier.send_message(message)

def send_contact_notification(contact) -> bool:
    """Отправка уведомления об обращении"""
    notifier = TelegramNotifier()
    message = format_contact_message(contact)
    return notifier.send_message(message)