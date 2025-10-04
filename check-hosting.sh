#!/bin/bash
# Скрипт проверки совместимости хостинга с ЛАБОСФЕРА

echo "🔍 Проверка совместимости хостинга с ЛАБОСФЕРА..."

# Цвета
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCORE=0
MAX_SCORE=10

check_requirement() {
    local name=$1
    local command=$2
    local min_version=$3
    local current_version=$4
    local points=$5
    
    echo -n "📋 $name: "
    
    if command -v $command &> /dev/null; then
        if [[ "$current_version" != "" ]]; then
            echo -e "${GREEN}✅ $current_version${NC}"
            if [[ "$current_version" >= "$min_version" ]]; then
                echo "   ${GREEN}✓ Совместимо (требуется $min_version+)${NC}"
                ((SCORE += points))
            else
                echo "   ${YELLOW}⚠️ Устарело (требуется $min_version+)${NC}"
                ((SCORE += points/2))
            fi
        else
            echo -e "${GREEN}✅ Установлено${NC}"
            ((SCORE += points))
        fi
    else
        echo -e "${RED}❌ Не найдено${NC}"
        echo "   ${RED}✗ Требуется для работы${NC}"
    fi
}

echo ""
echo "🖥️  Операционная система:"
echo "   $(uname -a)"

echo ""
echo "📦 Проверка требований:"

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version 2>/dev/null | sed 's/v//')
    check_requirement "Node.js" "node" "18.0.0" "$NODE_VERSION" 3
else
    check_requirement "Node.js" "node" "18.0.0" "" 3
fi

# Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>/dev/null | cut -d' ' -f2)
    check_requirement "Python 3" "python3" "3.9.0" "$PYTHON_VERSION" 2
else
    check_requirement "Python 3" "python3" "3.9.0" "" 2
fi

# Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version 2>/dev/null | cut -d' ' -f3)
    check_requirement "Git" "git" "2.0.0" "$GIT_VERSION" 1
else
    check_requirement "Git" "git" "2.0.0" "" 1
fi

# curl
if command -v curl &> /dev/null; then
    CURL_VERSION=$(curl --version 2>/dev/null | head -n1 | cut -d' ' -f2)
    check_requirement "curl" "curl" "7.0.0" "$CURL_VERSION" 1
else
    check_requirement "curl" "curl" "7.0.0" "" 1
fi

# pip
if command -v pip3 &> /dev/null || command -v pip &> /dev/null; then
    if command -v pip3 &> /dev/null; then
        PIP_VERSION=$(pip3 --version 2>/dev/null | cut -d' ' -f2)
    else
        PIP_VERSION=$(pip --version 2>/dev/null | cut -d' ' -f2)
    fi
    check_requirement "pip" "pip" "20.0.0" "$PIP_VERSION" 1
else
    check_requirement "pip" "pip" "20.0.0" "" 1
fi

# npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version 2>/dev/null)
    check_requirement "npm" "npm" "8.0.0" "$NPM_VERSION" 2
else
    check_requirement "npm" "npm" "8.0.0" "" 2
fi

echo ""
echo "💾 Проверка ресурсов:"

# RAM
TOTAL_RAM=$(free -m 2>/dev/null | grep '^Mem:' | awk '{print $2}')
if [[ $TOTAL_RAM -gt 0 ]]; then
    echo -n "📊 RAM: "
    if [[ $TOTAL_RAM -gt 2048 ]]; then
        echo -e "${GREEN}✅ ${TOTAL_RAM}MB${NC}"
        echo "   ${GREEN}✓ Достаточно (требуется 2048MB+)${NC}"
    elif [[ $TOTAL_RAM -gt 1024 ]]; then
        echo -e "${YELLOW}⚠️ ${TOTAL_RAM}MB${NC}"
        echo "   ${YELLOW}⚠️ Ограниченно (рекомендуется 2048MB+)${NC}"
    else
        echo -e "${RED}❌ ${TOTAL_RAM}MB${NC}"
        echo "   ${RED}✗ Недостаточно (требуется 2048MB+)${NC}"
    fi
fi

# Disk space
DISK_AVAILABLE=$(df -m . 2>/dev/null | tail -1 | awk '{print $4}')
if [[ $DISK_AVAILABLE -gt 0 ]]; then
    echo -n "💽 Свободное место: "
    if [[ $DISK_AVAILABLE -gt 10240 ]]; then
        echo -e "${GREEN}✅ ${DISK_AVAILABLE}MB${NC}"
        echo "   ${GREEN}✓ Достаточно (требуется 10GB+)${NC}"
    elif [[ $DISK_AVAILABLE -gt 5120 ]]; then
        echo -e "${YELLOW}⚠️ ${DISK_AVAILABLE}MB${NC}"
        echo "   ${YELLOW}⚠️ Ограниченно (рекомендуется 10GB+)${NC}"
    else
        echo -e "${RED}❌ ${DISK_AVAILABLE}MB${NC}"
        echo "   ${RED}✗ Недостаточно (требуется 10GB+)${NC}"
    fi
fi

echo ""
echo "🌐 Проверка сетевых возможностей:"

# SSL
if command -v openssl &> /dev/null; then
    echo -e "🔒 OpenSSL: ${GREEN}✅ Установлен${NC}"
else
    echo -e "🔒 OpenSSL: ${RED}❌ Не найден${NC}"
fi

# Port 80/443
if command -v netstat &> /dev/null; then
    if netstat -tuln 2>/dev/null | grep -q ":80 "; then
        echo -e "🌐 Порт 80: ${YELLOW}⚠️ Занят${NC}"
    else
        echo -e "🌐 Порт 80: ${GREEN}✅ Доступен${NC}"
    fi
    
    if netstat -tuln 2>/dev/null | grep -q ":443 "; then
        echo -e "🔒 Порт 443: ${YELLOW}⚠️ Занят${NC}"
    else
        echo -e "🔒 Порт 443: ${GREEN}✅ Доступен${NC}"
    fi
fi

echo ""
echo "📊 Итоговая оценка:"
echo "════════════════════════"

PERCENTAGE=$((SCORE * 100 / MAX_SCORE))

if [[ $PERCENTAGE -ge 90 ]]; then
    echo -e "${GREEN}🎉 ОТЛИЧНО! Совместимость: $PERCENTAGE% ($SCORE/$MAX_SCORE)${NC}"
    echo -e "${GREEN}✅ Хостинг идеально подходит для ЛАБОСФЕРА${NC}"
    echo -e "${GREEN}🚀 Можно развертывать с полным дизайном!${NC}"
elif [[ $PERCENTAGE -ge 70 ]]; then
    echo -e "${YELLOW}⚠️ ХОРОШО! Совместимость: $PERCENTAGE% ($SCORE/$MAX_SCORE)${NC}"
    echo -e "${YELLOW}✅ Хостинг подходит с небольшими ограничениями${NC}"
    echo -e "${YELLOW}🔧 Рекомендуется обновить некоторые компоненты${NC}"
elif [[ $PERCENTAGE -ge 50 ]]; then
    echo -e "${YELLOW}🔄 СРЕДНЕ! Совместимость: $PERCENTAGE% ($SCORE/$MAX_SCORE)${NC}"
    echo -e "${YELLOW}⚠️ Хостинг требует обновлений для полной функциональности${NC}"
    echo -e "${YELLOW}🛠️ Возможно развертывание в упрощенном режиме${NC}"
else
    echo -e "${RED}❌ ПЛОХО! Совместимость: $PERCENTAGE% ($SCORE/$MAX_SCORE)${NC}"
    echo -e "${RED}✗ Хостинг не подходит для современной версии ЛАБОСФЕРА${NC}"
    echo -e "${RED}📋 Рекомендуется сменить хостинг или обновить ПО${NC}"
fi

echo ""
echo "📋 Рекомендации:"

if [[ $PERCENTAGE -ge 90 ]]; then
    echo "🚀 Используйте команду для полного развертывания:"
    echo "   curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy.sh | bash"
elif [[ $PERCENTAGE -ge 50 ]]; then
    echo "🔧 Рекомендуется обновить ПО или использовать хостинг-версию:"
    echo "   curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy-hosting.sh | bash"
else
    echo "📖 Ознакомьтесь с рекомендациями по современному хостингу:"
    echo "   https://github.com/Semen1987nsk/Labosfera/blob/main/MODERN_HOSTING_GUIDE.md"
fi

echo ""
echo "🆘 Нужна помощь с выбором хостинга? Смотрите MODERN_HOSTING_GUIDE.md"