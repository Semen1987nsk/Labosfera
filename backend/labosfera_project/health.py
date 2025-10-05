from django.http import JsonResponse
from django.db import connection
from django.conf import settings
import sys

def health_check(request):
    """Health check endpoint for Docker and monitoring"""
    try:
        # Проверка подключения к базе данных
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            
        # Проверка основных настроек
        health_data = {
            "status": "healthy",
            "database": "connected",
            "debug": settings.DEBUG,
            "django_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
            "timeweb_optimized": getattr(settings, 'TIMEWEB_OPTIMIZED', False)
        }
        
        return JsonResponse(health_data, status=200)
        
    except Exception as e:
        return JsonResponse({
            "status": "unhealthy",
            "error": str(e)
        }, status=503)