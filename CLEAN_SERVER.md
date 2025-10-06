# 🧹 ПОЛНАЯ ОЧИСТКА СЕРВЕРА ПЕРЕД РАЗВЁРТЫВАНИЕМ

⚠️ **ВНИМАНИЕ**: Эти команды удалят ВСЁ связанное с предыдущими развёртываниями!

## 📍 Текущее местоположение
Вы находитесь: `root@5762931-gq57285:/opt/Labosfera#`

---

## 🛑 ШАГ 1: Остановить и удалить все Docker контейнеры

```bash
# Остановить все контейнеры
docker stop $(docker ps -aq) 2>/dev/null || echo "Нет запущенных контейнеров"

# Удалить все контейнеры
docker rm $(docker ps -aq) 2>/dev/null || echo "Нет контейнеров для удаления"

# Проверка - должно быть пусто
docker ps -a
```

---

## 🗑️ ШАГ 2: Удалить все Docker образы

```bash
# Удалить все образы
docker rmi $(docker images -q) -f 2>/dev/null || echo "Нет образов для удаления"

# Проверка - должно быть пусто
docker images
```

---

## 💾 ШАГ 3: Удалить все Docker volumes (ДАННЫЕ!)

⚠️ **Это удалит все базы данных!**

```bash
# Удалить все volumes
docker volume rm $(docker volume ls -q) 2>/dev/null || echo "Нет volumes для удаления"

# Проверка - должно быть пусто
docker volume ls
```

---

## 🌐 ШАГ 4: Удалить все Docker networks

```bash
# Удалить все networks (кроме стандартных)
docker network prune -f

# Проверка
docker network ls
```

---

## 🧹 ШАГ 5: Очистить Docker систему

```bash
# Полная очистка всего неиспользуемого
docker system prune -a --volumes -f

# Проверка использования места
docker system df
```

---

## 📁 ШАГ 6: Удалить папку проекта

```bash
# Выйти из папки проекта
cd /opt

# Удалить всю папку Labosfera
rm -rf /opt/Labosfera

# Проверка - папки не должно быть
ls -la /opt/
```

---

## 🔐 ШАГ 7: Удалить старые .env файлы

```bash
# Удалить все .env файлы из /root
rm -f /root/.env* 2>/dev/null || echo "Нет .env файлов"

# Проверка
ls -la /root/ | grep env
```

---

## 🗂️ ШАГ 8: Очистить systemd сервисы (если были)

```bash
# Остановить и удалить сервисы Labosfera (если были созданы)
systemctl stop labosfera* 2>/dev/null || true
systemctl disable labosfera* 2>/dev/null || true
rm -f /etc/systemd/system/labosfera* 2>/dev/null || true
systemctl daemon-reload
```

---

## 📦 ШАГ 9: Очистить Nginx конфиги (если были)

```bash
# Удалить конфиги Nginx (если были вне Docker)
rm -f /etc/nginx/sites-enabled/labosfera* 2>/dev/null || true
rm -f /etc/nginx/sites-available/labosfera* 2>/dev/null || true

# Перезапустить Nginx только если он установлен
systemctl restart nginx 2>/dev/null || echo "Nginx не установлен или не запущен"
```

---

## 🔥 БЫСТРАЯ ОЧИСТКА - ОДНА КОМАНДА

Скопируйте и выполните всё одной командой:

```bash
cd /opt && \
docker stop $(docker ps -aq) 2>/dev/null; \
docker rm $(docker ps -aq) 2>/dev/null; \
docker rmi $(docker images -q) -f 2>/dev/null; \
docker volume rm $(docker volume ls -q) 2>/dev/null; \
docker network prune -f; \
docker system prune -a --volumes -f; \
rm -rf /opt/Labosfera; \
rm -f /root/.env* 2>/dev/null; \
systemctl stop labosfera* 2>/dev/null; \
systemctl disable labosfera* 2>/dev/null; \
rm -f /etc/systemd/system/labosfera* 2>/dev/null; \
systemctl daemon-reload; \
rm -f /etc/nginx/sites-enabled/labosfera* 2>/dev/null; \
rm -f /etc/nginx/sites-available/labosfera* 2>/dev/null; \
echo ""; \
echo "✅ ОЧИСТКА ЗАВЕРШЕНА!"; \
echo ""; \
echo "Проверка:"; \
echo "- Docker контейнеры:"; docker ps -a; \
echo "- Docker образы:"; docker images; \
echo "- Docker volumes:"; docker volume ls; \
echo "- Папка проекта:"; ls -la /opt/ | grep Labosfera || echo "  ✅ Удалена"; \
echo ""; \
echo "Готово! Можно начинать новое развёртывание."
```

---

## ✅ ПРОВЕРКА ПОСЛЕ ОЧИСТКИ

Убедитесь, что всё чисто:

```bash
# 1. Нет контейнеров
docker ps -a
# Должно быть: CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

# 2. Нет образов
docker images
# Должно быть: REPOSITORY   TAG       IMAGE ID   CREATED   SIZE

# 3. Нет volumes
docker volume ls
# Должно быть: DRIVER    VOLUME NAME

# 4. Нет папки проекта
ls -la /opt/ | grep Labosfera
# Ничего не должно найтись

# 5. Нет .env файлов
ls -la /root/ | grep env
# Ничего не должно найтись
```

---

## 🚀 ПОСЛЕ ОЧИСТКИ

После полной очистки следуйте инструкциям из **DEPLOY_NOW.md**:

1. Скопируйте `.env.production` на сервер
2. Клонируйте проект заново
3. Запустите развёртывание

---

## ⚠️ ЧТО НЕ БУДЕТ УДАЛЕНО

Эти команды НЕ удаляют:

- ✅ Операционную систему
- ✅ Docker и docker-compose (сами программы)
- ✅ Git
- ✅ Системные пакеты
- ✅ SSH ключи
- ✅ Другие проекты в других папках

**Удаляется только всё, что связано с Labosfera и Docker!**

---

## 🆘 ЭКСТРЕННАЯ ОСТАНОВКА

Если что-то пошло не так и нужно срочно остановить:

```bash
# Остановить все контейнеры немедленно
docker kill $(docker ps -q) 2>/dev/null

# Или перезагрузить сервер
reboot
```

---

**Готово! После выполнения этих команд сервер будет полностью чист и готов к новому развёртыванию.**
