""""""

Модуль для отправки Telegram уведомленийTelegram уведомления для новых заказов и обращений

""""""

import loggingimport requests

import requestsfrom django.conf import settings

from django.conf import settingsimport logging



logger = logging.getLogger(__name__)logger = logging.getLogger(__name__)





def send_telegram_message(message):def send_telegram_message(message: str) -> bool:

    """    """

    Отправка сообщения в Telegram    Отправляет сообщение в Telegram

        

    Args:    Args:

        message: Текст сообщения        message: Текст сообщения

                

    Returns:    Returns:

        bool: True если отправка успешна, False если ошибка        True если успешно, False если ошибка

    """    """

    try:    try:

        bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)        bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)

        chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)        chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)

                

        if not bot_token or not chat_id:        if not bot_token or not chat_id:

            logger.warning("Telegram настройки не заданы. Уведомление не отправлено.")            logger.warning("Telegram настройки не заданы. Пропускаем отправку уведомления.")

            return False            return False

                

        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

                data = {

        payload = {            'chat_id': chat_id,

            'chat_id': chat_id,            'text': message,

            'text': message,            'parse_mode': 'HTML',

            'parse_mode': 'HTML'            'disable_web_page_preview': True

        }        }

                

        response = requests.post(url, data=payload, timeout=10)        response = requests.post(url, data=data, timeout=10)

                response.raise_for_status()

        if response.status_code == 200:        

            logger.info("Telegram уведомление отправлено успешно")        logger.info(f"Telegram уведомление отправлено успешно")

            return True        return True

        else:        

            logger.error(f"Ошибка отправки Telegram: {response.status_code} - {response.text}")    except Exception as e:

            return False        logger.error(f"Ошибка отправки Telegram уведомления: {e}")

                    return False

    except Exception as e:

        logger.error(f"Исключение при отправке Telegram уведомления: {e}", exc_info=True)

        return Falsedef notify_new_order(order):

    """

    Отправляет уведомление о новой заявке на заказ

def notify_new_order(order):    

    """    Args:

    Уведомление о новой заявке на заказ        order: Объект Order

        """

    Args:    items_text = "\n".join([

        order: Объект Order        f"  • {item.product.name} x{item.quantity}"

    """        for item in order.items.all()

    # Формируем список товаров    ])

    items_list = []    

    for item in order.items.all():    message = f"""

        price_str = f" ({item.price_at_order:,.0f} ₽)" if item.price_at_order else ""🛒 <b>НОВАЯ ЗАЯВКА #{order.id}</b>

        items_list.append(f"  • {item.product.name} x{item.quantity}{price_str}")

    👤 <b>Клиент:</b> {order.name}

    items_text = "\n".join(items_list) if items_list else "  Товары не указаны"📱 <b>Телефон:</b> {order.phone}

    ✉️ <b>Email:</b> {order.email}

    # Формируем сумму🏢 <b>Организация:</b> {order.organization or "Не указана"}

    total_text = f"{order.estimated_total:,.0f} ₽" if order.estimated_total else "не указана"

    📦 <b>Товары ({order.total_items} шт.):</b>

    # Формируем комментарий{items_text}

    comment_text = f"\n\n💬 Комментарий:\n{order.message}" if order.message else ""

    💬 <b>Комментарий:</b> {order.message or "Нет"}

    # Формируем сообщение

    message = f"""🔗 <a href="https://labosfera.ru/admin/orders/order/{order.id}/change/">Открыть в админке</a>

🛒 <b>НОВАЯ ЗАЯВКА НА ЗАКАЗ #{order.id}</b>"""

    

👤 Клиент: {order.name}    return send_telegram_message(message.strip())

📱 Телефон: {order.phone}

✉️ Email: {order.email or 'не указан'}

🏢 Организация: {order.organization or 'не указана'}def notify_contact_request(contact):

    """

📦 Товары ({order.total_items} шт.):    Отправляет уведомление о новом обращении

{items_text}    

    Args:

💰 Сумма: {total_text}{comment_text}        contact: Объект ContactRequest

    """

🔗 <a href="https://labosfera.ru/admin/orders/order/{order.id}/change/">Открыть в админке</a>    request_type_emoji = {

"""        'callback': '📞',

            'consultation': '💬',

    return send_telegram_message(message.strip())        'custom_order': '📋',

        'general': '❓'

    }

def notify_contact_request(contact):    

    """    emoji = request_type_emoji.get(contact.request_type, '📧')

    Уведомление о новом обращении    

        message = f"""

    Args:{emoji} <b>НОВОЕ ОБРАЩЕНИЕ</b>

        contact: Объект ContactRequest

    """<b>Тип:</b> {contact.get_request_type_display()}

    # Тип обращения

    request_types = {👤 <b>Клиент:</b> {contact.name}

        'callback': '📞 Обратный звонок',📱 <b>Телефон:</b> {contact.phone}

        'consultation': '💼 Консультация',✉️ <b>Email:</b> {contact.email or "Не указан"}

        'custom_order': '🎯 Индивидуальный заказ',🏢 <b>Организация:</b> {contact.organization or "Не указана"}

        'general': '💬 Общий вопрос'

    }💬 <b>Сообщение:</b>

    request_type_text = request_types.get(contact.request_type, contact.get_request_type_display()){contact.message or "Нет"}

    

    # Формируем сообщение🔗 <a href="https://labosfera.ru/admin/orders/contactrequest/{contact.id}/change/">Открыть в админке</a>

    message_text = f"\n\n💬 Сообщение:\n{contact.message}" if contact.message else """""

        

    message = f"""    return send_telegram_message(message.strip())

📞 <b>НОВОЕ ОБРАЩЕНИЕ</b>

Тип: {request_type_text}

👤 Клиент: {contact.name}
📱 Телефон: {contact.phone}
✉️ Email: {contact.email or 'не указан'}
🏢 Организация: {contact.organization or 'не указана'}{message_text}

🔗 <a href="https://labosfera.ru/admin/orders/contactrequest/{contact.id}/change/">Открыть в админке</a>
"""
    
    return send_telegram_message(message.strip())
