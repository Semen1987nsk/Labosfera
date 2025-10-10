# 🚀 БЫСТРАЯ ИНСТРУКЦИЯ ДЛЯ ДЕПЛОЯ

## ✅ СЛЕДУЮЩИЙ РАЗ ИСПОЛЬЗУЙ ЭТО:

### 1️⃣ Подключись к серверу
```bash
ssh root@109.73.192.44
cd /root/Labosfera
```

### 2️⃣ Скачай свежий код
```bash
git pull origin main
```

### 3️⃣ Сделай backup (ОБЯЗАТЕЛЬНО!)
```bash
./backup-before-deploy.sh
```

### 4️⃣ Запусти безопасный деплой frontend
```bash
./deploy-frontend-safe.sh
```

**Всё! Скрипт сделает всё автоматически:**
- ✅ Соберет новый образ
- ✅ Остановит старый контейнер
- ✅ Запустит новый контейнер (без касания DB/backend)
- ✅ Перезагрузит Nginx
- ✅ Проверит что сайт работает

---

## ⏱️ ВРЕМЯ ДЕПЛОЯ:
- Backup: ~10 секунд
- Сборка: ~90 секунд
- Перезапуск: ~20 секунд
- **Итого: ~2 минуты**
- **Downtime: ~10-15 секунд**

---

## 🆘 ЕСЛИ ЧТО-ТО СЛОМАЛОСЬ:

### Посмотреть логи:
```bash
docker logs labosfera_frontend_1 -f     # Frontend
docker logs labosfera_backend_1 -f      # Backend
docker logs labosfera_nginx_1 -f        # Nginx
```

### Откатиться к предыдущей версии:
```bash
# Найти последний backup образ
docker images | grep backup

# Откатить frontend
docker tag labosfera_frontend:backup_YYYYMMDD_HHMMSS labosfera_frontend:latest
docker-compose -f docker-compose.prod.yml up -d --no-deps frontend
docker-compose -f docker-compose.prod.yml restart nginx
```

### Восстановить базу данных:
```bash
# Найти backup
ls -lht /root/backups/

# Восстановить
zcat /root/backups/db_before_deploy_YYYYMMDD_HHMMSS.sql.gz | \
  docker exec -i labosfera_db_1 psql -U postgres labosfera_db
```

---

## 📋 ЧЕКЛИСТ ПЕРЕД ДЕПЛОЕМ:

- [ ] Код протестирован локально
- [ ] Код залит в GitHub (`git push`)
- [ ] Подключен к серверу
- [ ] Сайт сейчас работает
- [ ] Сделан backup
- [ ] Запущен `deploy-frontend-safe.sh`
- [ ] Проверен сайт после деплоя
- [ ] Проверены логи

---

## 🎯 ЧТО УЛУЧШЕНО:

### Было (сегодня утром):
❌ Ручные команды  
❌ Нет backup  
❌ Случайно пересоздали DB  
❌ Nginx не видел новый IP  
❌ Downtime ~60 секунд  
❌ Паника при проблемах  

### Стало (сейчас):
✅ Автоматические скрипты  
✅ Backup перед деплоем  
✅ Только frontend обновляется  
✅ Nginx перезагружается автоматически  
✅ Downtime ~10-15 секунд  
✅ Можно быстро откатиться  

---

## 📞 КОНТАКТЫ ДЛЯ ЭКСТРЕННЫХ СЛУЧАЕВ:

**Сервер:** 109.73.192.44  
**Домен:** labosfera.ru  
**GitHub:** github.com/Semen1987nsk/Labosfera  
**Hosting:** Timeweb Cloud  

---

**Создано:** 10 октября 2025  
**На основе:** Реального деплоя с проблемами  
**Протестировано:** ✅ Да, работает!
