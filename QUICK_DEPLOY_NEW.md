# 🚀 Быстрый Деплой Labosfera

## Для следующего раза - одна команда:

```bash
bash deploy-production.sh
```

Вот и всё! 🎉

---

## Что делает скрипт автоматически:

1. ✅ Подключается к серверу
2. ✅ Обновляет код из GitHub
3. ✅ Проверяет .env файл
4. ✅ Собирает все Docker образы (Backend, Frontend, Nginx)
5. ✅ Останавливает старые контейнеры
6. ✅ Создаёт сеть и volumes
7. ✅ Запускает PostgreSQL
8. ✅ Запускает Backend
9. ✅ Применяет миграции БД
10. ✅ Собирает статические файлы
11. ✅ Запускает Frontend
12. ✅ Запускает Nginx с SSL
13. ✅ Проверяет доступность сайта и API

**Время выполнения:** ~2-3 минуты

---

## Если что-то пошло не так:

### Посмотреть логи:
```bash
ssh root@109.73.192.44 'docker logs labosfera_backend_1 -f'
ssh root@109.73.192.44 'docker logs labosfera_frontend_1 -f'
ssh root@109.73.192.44 'docker logs labosfera_nginx_1 -f'
```

### Перезапустить всё заново:
```bash
bash deploy-production.sh
```

### Создать суперпользователя:
```bash
ssh root@109.73.192.44
docker exec labosfera_backend_1 python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
User.objects.create_superuser('admin', 'admin@labosfera.ru', 'YourPassword123!')
"
```

---

## Полезные ссылки:

- 🌐 Сайт: https://labosfera.ru
- 🔧 Админка: https://labosfera.ru/admin/
- 📡 API: https://labosfera.ru/api/v1/
- 📚 Документация проблем: [DEPLOYMENT_ISSUES_FIXED.md](DEPLOYMENT_ISSUES_FIXED.md)

---

## Что было исправлено:

Все 7 критических проблем деплоя исправлены:
- ✅ Docker Compose KeyError
- ✅ SSL сертификаты
- ✅ Переменные окружения PostgreSQL
- ✅ Redis кэш
- ✅ ALLOWED_HOSTS
- ✅ DJANGO_SETTINGS_MODULE
- ✅ Автоматические миграции

Подробности в файле [DEPLOYMENT_ISSUES_FIXED.md](DEPLOYMENT_ISSUES_FIXED.md)

---

**Готово к использованию!** 🎯
