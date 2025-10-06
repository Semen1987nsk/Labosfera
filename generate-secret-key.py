#!/usr/bin/env python3
"""
Генератор секретного ключа для Django
"""
from django.core.management.utils import get_random_secret_key

if __name__ == '__main__':
    secret_key = get_random_secret_key()
    print("=" * 70)
    print("НОВЫЙ DJANGO SECRET KEY:")
    print("=" * 70)
    print(secret_key)
    print("=" * 70)
    print("\nСкопируйте этот ключ в .env.production:")
    print(f"DJANGO_SECRET_KEY={secret_key}")
    print("=" * 70)
