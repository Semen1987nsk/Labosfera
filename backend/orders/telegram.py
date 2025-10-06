"""
Telegram notifications module
"""
import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def send_telegram_message(message):
    """Send message to Telegram"""
    try:
        bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
        chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
        
        if not bot_token or not chat_id:
            logger.warning("Telegram settings not configured")
            return False
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {'chat_id': chat_id, 'text': message, 'parse_mode': 'HTML'}
        
        response = requests.post(url, data=payload, timeout=10)
        
        if response.status_code == 200:
            logger.info("Telegram notification sent")
            return True
        else:
            logger.error(f"Telegram error: {response.status_code}")
            return False
    except Exception as e:
        logger.error(f"Telegram exception: {e}")
        return False


def notify_new_order(order):
    """Notify about new order"""
    items_list = [f"  • {item.product.name} x{item.quantity}" for item in order.items.all()]
    items_text = "\n".join(items_list) if items_list else "  No items"
    
    message = f"""🛒 <b>NEW ORDER #{order.id}</b>

Client: {order.name}
Phone: {order.phone}
Email: {order.email or 'N/A'}
Organization: {order.organization or 'N/A'}

Items: {order.total_items} pcs
{items_text}

Total: {order.estimated_total or 0} RUB

<a href="https://labosfera.ru/admin/orders/order/{order.id}/change/">Open in admin</a>"""
    
    return send_telegram_message(message.strip())


def notify_contact_request(contact):
    """Notify about new contact request"""
    types = {'callback': 'Callback', 'consultation': 'Consultation', 'custom_order': 'Custom', 'general': 'General'}
    req_type = types.get(contact.request_type, 'Unknown')
    
    message = f"""📞 <b>NEW CONTACT REQUEST</b>

Type: {req_type}
Client: {contact.name}
Phone: {contact.phone}
Email: {contact.email or 'N/A'}
Organization: {contact.organization or 'N/A'}

Message: {contact.message or 'N/A'}

<a href="https://labosfera.ru/admin/orders/contactrequest/{contact.id}/change/">Open in admin</a>"""
    
    return send_telegram_message(message.strip())
