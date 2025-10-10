#!/bin/bash
set -e

echo "╔═══════════════════════════════════════╗"
echo "║   BACKUP ПЕРЕД ДЕПЛОЕМ               ║"
echo "╚═══════════════════════════════════════╝"
echo ""

BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 1. Backup базы данных PostgreSQL
echo "💾 Создание backup базы данных..."
docker exec labosfera_db_1 pg_dump -U postgres labosfera_db | gzip > $BACKUP_DIR/db_before_deploy_$DATE.sql.gz

if [ $? -eq 0 ]; then
    SIZE=$(du -h $BACKUP_DIR/db_before_deploy_$DATE.sql.gz | cut -f1)
    echo "✅ База данных: $BACKUP_DIR/db_before_deploy_$DATE.sql.gz ($SIZE)"
else
    echo "❌ Ошибка создания backup БД"
    exit 1
fi
echo ""

# 2. Backup текущего Docker образа frontend (для быстрого отката)
echo "📦 Создание snapshot текущего frontend..."
docker commit labosfera_frontend_1 labosfera_frontend:backup_$DATE

if [ $? -eq 0 ]; then
    echo "✅ Docker образ: labosfera_frontend:backup_$DATE"
else
    echo "⚠️ Не удалось создать snapshot frontend (возможно контейнер не запущен)"
fi
echo ""

# 3. Показать список бэкапов
echo "📋 Последние 5 бэкапов:"
ls -lht $BACKUP_DIR/db_before_deploy_*.sql.gz 2>/dev/null | head -5 || echo "Нет предыдущих бэкапов"
echo ""

# 4. Удалить старые бэкапы (старше 7 дней)
echo "🗑️  Очистка старых бэкапов (>7 дней)..."
DELETED=$(find $BACKUP_DIR -name "db_before_deploy_*.sql.gz" -mtime +7 -delete -print | wc -l)
echo "Удалено: $DELETED файлов"
echo ""

# 5. Удалить старые Docker образы бэкапов (оставить только последние 5)
echo "🗑️  Очистка старых Docker образов бэкапов..."
IMAGES_TO_DELETE=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "labosfera_frontend:backup_" | tail -n +6)
if [ ! -z "$IMAGES_TO_DELETE" ]; then
    echo "$IMAGES_TO_DELETE" | xargs docker rmi 2>/dev/null || true
    echo "✅ Старые образы удалены"
else
    echo "Нет старых образов для удаления"
fi
echo ""

echo "╔═══════════════════════════════════════╗"
echo "║      ✅ BACKUP ЗАВЕРШЕН               ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "📁 Файл БД: $BACKUP_DIR/db_before_deploy_$DATE.sql.gz"
echo "🐳 Образ:   labosfera_frontend:backup_$DATE"
echo ""
echo "Для восстановления БД:"
echo "  zcat $BACKUP_DIR/db_before_deploy_$DATE.sql.gz | docker exec -i labosfera_db_1 psql -U postgres labosfera_db"
echo ""
echo "Для отката frontend:"
echo "  docker tag labosfera_frontend:backup_$DATE labosfera_frontend:latest"
echo "  docker-compose -f docker-compose.prod.yml up -d frontend"
