# Django Admin настройки для заявок
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Order, OrderItem, ContactRequest

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price_at_order')
    
    def has_add_permission(self, request, obj=None):
        return False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id', 
        'name', 
        'phone', 
        'organization',
        'status_badge',
        'total_items', 
        'estimated_total_display',
        'created_at'
    ]
    
    list_filter = [
        'status',
        'created_at',
        'organization'
    ]
    
    search_fields = [
        'name',
        'phone', 
        'email',
        'organization'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at', 
        'ip_address',
        'user_agent',
        'items_summary'
    ]
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'phone', 'email', 'organization')
        }),
        ('Заказ', {
            'fields': ('status', 'total_items', 'estimated_total', 'message')
        }),
        ('Системная информация', {
            'fields': ('created_at', 'updated_at', 'ip_address', 'user_agent'),
            'classes': ('collapse',)
        }),
        ('Состав заказа', {
            'fields': ('items_summary',)
        })
    )
    
    inlines = [OrderItemInline]
    
    actions = ['mark_as_processing', 'mark_as_contacted', 'mark_as_completed']
    
    def status_badge(self, obj):
        colors = {
            'new': '#dc3545',        # красный
            'processing': '#fd7e14',  # оранжевый
            'contacted': '#20c997',   # бирюзовый
            'sent_proposal': '#6f42c1', # фиолетовый
            'completed': '#198754',   # зеленый
            'cancelled': '#6c757d'    # серый
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="color: {}; font-weight: bold;">● {}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Статус'
    
    def estimated_total_display(self, obj):
        if obj.estimated_total:
            return f'{obj.estimated_total:,.0f} ₽'
        return '—'
    estimated_total_display.short_description = 'Сумма'
    
    def items_summary(self, obj):
        items = obj.items.all()
        if not items:
            return 'Товары не добавлены'
        
        html = '<ul style="margin: 0; padding-left: 20px;">'
        for item in items:
            price_info = f' ({item.price_at_order:,.0f} ₽)' if item.price_at_order else ''
            html += f'<li><strong>{item.product.name}</strong> — {item.quantity} шт.{price_info}</li>'
        html += '</ul>'
        return format_html(html)
    items_summary.short_description = 'Состав заказа'
    
    def mark_as_processing(self, request, queryset):
        updated = queryset.update(status='processing')
        self.message_user(request, f'{updated} заявок отмечено как "В обработке"')
    mark_as_processing.short_description = 'Отметить как "В обработке"'
    
    def mark_as_contacted(self, request, queryset):
        updated = queryset.update(status='contacted')
        self.message_user(request, f'{updated} заявок отмечено как "Связались с клиентом"')
    mark_as_contacted.short_description = 'Отметить как "Связались с клиентом"'
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} заявок отмечено как "Заказ оформлен"')
    mark_as_completed.short_description = 'Отметить как "Заказ оформлен"'

@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name', 
        'phone',
        'request_type_badge',
        'status_badge',
        'organization',
        'created_at'
    ]
    
    list_filter = [
        'request_type',
        'status',
        'created_at'
    ]
    
    search_fields = [
        'name',
        'phone',
        'email', 
        'organization',
        'message'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'ip_address', 
        'user_agent'
    ]
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'phone', 'email', 'organization')
        }),
        ('Обращение', {
            'fields': ('request_type', 'status', 'message')
        }),
        ('Системная информация', {
            'fields': ('created_at', 'updated_at', 'ip_address', 'user_agent'),
            'classes': ('collapse',)
        })
    )
    
    actions = ['mark_as_processing', 'mark_as_contacted', 'mark_as_completed']
    
    def request_type_badge(self, obj):
        colors = {
            'callback': '#17a2b8',      # голубой
            'consultation': '#28a745',   # зеленый
            'custom_order': '#dc3545',   # красный  
            'general': '#6c757d'         # серый
        }
        color = colors.get(obj.request_type, '#6c757d')
        return format_html(
            '<span style="color: {}; font-weight: bold;">● {}</span>',
            color,
            obj.get_request_type_display()
        )
    request_type_badge.short_description = 'Тип'
    
    def status_badge(self, obj):
        colors = {
            'new': '#dc3545',        # красный
            'processing': '#fd7e14',  # оранжевый  
            'contacted': '#20c997',   # бирюзовый
            'completed': '#198754'    # зеленый
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="color: {}; font-weight: bold;">● {}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Статус'
    
    def mark_as_processing(self, request, queryset):
        updated = queryset.update(status='processing')
        self.message_user(request, f'{updated} обращений отмечено как "В обработке"')
    mark_as_processing.short_description = 'Отметить как "В обработке"'
    
    def mark_as_contacted(self, request, queryset):
        updated = queryset.update(status='contacted')
        self.message_user(request, f'{updated} обращений отмечено как "Связались"')
    mark_as_contacted.short_description = 'Отметить как "Связались"'
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} обращений отмечено как "Завершено"')
    mark_as_completed.short_description = 'Отметить как "Завершено"'