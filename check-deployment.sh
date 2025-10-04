#!/bin/bash
# Скрипт проверки готовности к развертыванию

echo "🔍 Проверка готовности ЛАБОСФЕРА к развертыванию..."

# Цвета
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1 отсутствует${NC}"
        ((ERRORS++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1/${NC}"
    else
        echo -e "${RED}❌ $1/ отсутствует${NC}"
        ((ERRORS++))
    fi
}

echo ""
echo "📂 Проверка структуры проекта:"
check_file "docker-compose.prod.yml"
check_file ".env.prod.example"
check_file "deploy.sh"
check_file "update.sh"
check_file "DEPLOYMENT_GUIDE.md"

echo ""
echo "🐳 Проверка Docker файлов:"
check_file "backend/Dockerfile.prod"
check_file "frontend/Dockerfile.prod"
check_file "nginx/prod.conf"

echo ""
echo "⚙️ Проверка конфигурации backend:"
check_file "backend/labosfera_project/settings_prod.py"
check_file "backend/requirements.txt"
check_file "backend/manage.py"

echo ""
echo "🎨 Проверка frontend:"
check_file "frontend/package.json"
check_file "frontend/next.config.mjs"
check_dir "frontend/src"

echo ""
echo "📦 Проверка зависимостей frontend:"
if [ -f "frontend/package.json" ]; then
    cd frontend
    if npm list next >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Next.js установлен${NC}"
    else
        echo -e "${YELLOW}⚠️ Next.js не найден, будет установлен при сборке${NC}"
        ((WARNINGS++))
    fi
    cd ..
fi

echo ""
echo "🔧 Проверка исполняемых файлов:"
if [ -x "deploy.sh" ]; then
    echo -e "${GREEN}✅ deploy.sh исполняемый${NC}"
else
    echo -e "${RED}❌ deploy.sh не исполняемый${NC}"
    ((ERRORS++))
fi

if [ -x "update.sh" ]; then
    echo -e "${GREEN}✅ update.sh исполняемый${NC}"
else
    echo -e "${RED}❌ update.sh не исполняемый${NC}"
    ((ERRORS++))
fi

echo ""
echo "📝 Проверка .env.prod:"
if [ -f ".env.prod" ]; then
    echo -e "${GREEN}✅ .env.prod существует${NC}"
    
    # Проверка обязательных переменных
    source .env.prod
    
    if [ -z "$DOMAIN" ]; then
        echo -e "${RED}❌ DOMAIN не задан${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✅ DOMAIN: $DOMAIN${NC}"
    fi
    
    if [ -z "$EMAIL" ]; then
        echo -e "${RED}❌ EMAIL не задан${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✅ EMAIL: $EMAIL${NC}"
    fi
    
    if [ "$POSTGRES_PASSWORD" = "your_secure_password_here" ]; then
        echo -e "${YELLOW}⚠️ POSTGRES_PASSWORD не изменен${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅ POSTGRES_PASSWORD настроен${NC}"
    fi
    
    if [ "$DJANGO_SECRET_KEY" = "your-secret-key-here" ]; then
        echo -e "${YELLOW}⚠️ DJANGO_SECRET_KEY не изменен${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅ DJANGO_SECRET_KEY настроен${NC}"
    fi
    
else
    echo -e "${YELLOW}⚠️ .env.prod отсутствует (будет создан из шаблона)${NC}"
    ((WARNINGS++))
fi

echo ""
echo "👑 Проверка настроек админки:"
if [ -f "backend/catalog/admin.py" ]; then
    echo -e "${GREEN}✅ Админка каталога настроена${NC}"
else
    echo -e "${RED}❌ backend/catalog/admin.py отсутствует${NC}"
    ((ERRORS++))
fi

if [ -f "backend/orders/admin.py" ]; then
    echo -e "${GREEN}✅ Админка заказов настроена${NC}"
else
    echo -e "${RED}❌ backend/orders/admin.py отсутствует${NC}"
    ((ERRORS++))
fi

echo -e "${GREEN}✅ Доступ к админке: https://\${DOMAIN}/admin/${NC}"
echo -e "${GREEN}✅ Логин по умолчанию: admin/admin123${NC}"

echo ""
echo "🌐 Проверка Git:"
if git status >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Git репозиторий инициализирован${NC}"
    
    if git remote get-url origin >/dev/null 2>&1; then
        REMOTE_URL=$(git remote get-url origin)
        echo -e "${GREEN}✅ Remote origin: $REMOTE_URL${NC}"
    else
        echo -e "${YELLOW}⚠️ Git remote origin не настроен${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}❌ Git репозиторий не инициализирован${NC}"
    ((ERRORS++))
fi

echo ""
echo "📊 Результат проверки:"
echo "════════════════════════"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Готов к развертыванию!${NC}"
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Купите VPS на REG.RU (VPS-Business, 1990₽/мес)"
    echo "2. Настройте DNS записи для домена labosfera.ru"
    echo "3. Подключитесь к серверу: ssh root@YOUR_SERVER_IP"
    echo "4. Запустите: curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh | bash"
    echo ""
    echo "� После развертывания:"
    echo "- Админка: https://labosfera.ru/admin/"
    echo "- Логин: admin / Пароль: admin123"
    echo "- ⚠️  ОБЯЗАТЕЛЬНО смените пароль после входа!"
    echo ""
    echo "�📖 Подробные инструкции:"
    echo "- Развертывание: DEPLOYMENT_GUIDE.md"
    echo "- Администрирование: ADMIN_GUIDE.md"
    echo "- Быстрые команды: ADMIN_QUICK_REFERENCE.md"
else
    echo -e "${RED}❌ Найдено $ERRORS ошибок${NC}"
    echo "Исправьте ошибки перед развертыванием"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️ Найдено $WARNINGS предупреждений${NC}"
    echo "Рекомендуется исправить предупреждения"
fi

exit $ERRORS