#!/bin/bash

# ==========================================
# ЛАБОСФЕРА - Скрипт мониторинга Timeweb Cloud
# Проверка состояния всех сервисов и производительности
# ==========================================

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Функции для вывода
print_header() {
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                     🚀 ЛАБОСФЕРА - Мониторинг Timeweb Cloud                 ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_section() {
    echo -e "${CYAN}━━━ $1 ━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Проверка Docker и Docker Compose
check_docker() {
    print_section "Проверка Docker"
    
    if command -v docker >/dev/null 2>&1; then
        print_success "Docker установлен: $(docker --version)"
    else
        print_error "Docker не установлен!"
        return 1
    fi
    
    if command -v docker-compose >/dev/null 2>&1; then
        print_success "Docker Compose установлен: $(docker-compose --version)"
    else
        print_error "Docker Compose не установлен!"
        return 1
    fi
    
    # Проверка демона Docker
    if docker info >/dev/null 2>&1; then
        print_success "Docker демон работает"
    else
        print_error "Docker демон не запущен!"
        return 1
    fi
    
    echo ""
}

# Проверка состояния контейнеров
check_containers() {
    print_section "Состояние контейнеров"
    
    if [ ! -f "docker-compose.timeweb.yml" ]; then
        print_error "Файл docker-compose.timeweb.yml не найден!"
        return 1
    fi
    
    echo "📊 Статус контейнеров:"
    docker-compose -f docker-compose.timeweb.yml ps
    echo ""
    
    # Проверка каждого контейнера
    local containers=("labosfera_db" "labosfera_backend" "labosfera_frontend" "labosfera_nginx")
    
    for container in "${containers[@]}"; do
        if docker ps --format "table {{.Names}}" | grep -q "$container"; then
            local status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null)
            local health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null)
            
            if [ "$status" = "running" ]; then
                if [ "$health" = "healthy" ] || [ "$health" = "<no value>" ]; then
                    print_success "$container запущен и здоров"
                else
                    print_warning "$container запущен, но статус здоровья: $health"
                fi
            else
                print_error "$container не запущен (статус: $status)"
            fi
        else
            print_error "$container не найден"
        fi
    done
    
    echo ""
}

# Проверка ресурсов системы
check_system_resources() {
    print_section "Ресурсы системы"
    
    # CPU
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    echo -e "🖥️  CPU использование: ${YELLOW}${cpu_usage}%${NC}"
    
    # Память
    local mem_info=$(free -h | awk '/^Mem:/ {print $3 "/" $2}')
    local mem_percent=$(free | awk '/^Mem:/ {printf("%.1f"), $3/$2 * 100.0}')
    echo -e "🧠 Память: ${YELLOW}${mem_info} (${mem_percent}%)${NC}"
    
    # Диск
    local disk_info=$(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 ")"}')
    echo -e "💾 Диск /: ${YELLOW}${disk_info}${NC}"
    
    # Загрузка системы
    local load_avg=$(uptime | awk -F'load average:' '{print $2}')
    echo -e "📈 Загрузка системы:${YELLOW}${load_avg}${NC}"
    
    # Аптайм
    local uptime_info=$(uptime -p)
    echo -e "⏱️  Аптайм: ${GREEN}${uptime_info}${NC}"
    
    echo ""
}

# Проверка использования ресурсов Docker
check_docker_resources() {
    print_section "Ресурсы Docker контейнеров"
    
    echo "📊 Использование ресурсов:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}"
    echo ""
}

# Проверка доступности сервисов
check_services() {
    print_section "Доступность сервисов"
    
    # Проверка базы данных
    if docker exec labosfera_db pg_isready -U labosfera -d labosfera >/dev/null 2>&1; then
        print_success "PostgreSQL доступен"
    else
        print_error "PostgreSQL недоступен"
    fi
    
    # Проверка Backend API
    if curl -f http://localhost:8000/api/health/ >/dev/null 2>&1; then
        print_success "Backend API доступен (http://localhost:8000)"
    else
        print_error "Backend API недоступен"
    fi
    
    # Проверка Frontend
    if curl -f http://localhost:3000/ >/dev/null 2>&1; then
        print_success "Frontend доступен (http://localhost:3000)"
    else
        print_error "Frontend недоступен"
    fi
    
    # Проверка Nginx
    if curl -f http://localhost/health/ >/dev/null 2>&1; then
        print_success "Nginx доступен (http://localhost)"
    else
        print_error "Nginx недоступен"
    fi
    
    # Проверка HTTPS (если настроен)
    if curl -f -k https://localhost/health/ >/dev/null 2>&1; then
        print_success "HTTPS доступен (https://localhost)"
    else
        print_warning "HTTPS недоступен (возможно не настроен SSL)"
    fi
    
    echo ""
}

# Проверка логов на ошибки
check_logs() {
    print_section "Проверка логов на ошибки"
    
    local containers=("labosfera_db" "labosfera_backend" "labosfera_frontend" "labosfera_nginx")
    
    for container in "${containers[@]}"; do
        if docker ps --format "{{.Names}}" | grep -q "$container"; then
            local errors=$(docker logs "$container" --since="1h" 2>&1 | grep -i -E "(error|exception|fail|fatal)" | wc -l)
            if [ "$errors" -gt 0 ]; then
                print_warning "$container: найдено $errors ошибок за последний час"
            else
                print_success "$container: ошибок не найдено за последний час"
            fi
        fi
    done
    
    echo ""
}

# Проверка SSL сертификатов
check_ssl() {
    print_section "SSL сертификаты"
    
    if [ -f "/opt/labosfera/ssl/letsencrypt/live/labosfera.ru/fullchain.pem" ]; then
        local expiry=$(openssl x509 -in /opt/labosfera/ssl/letsencrypt/live/labosfera.ru/fullchain.pem -noout -enddate | cut -d= -f2)
        local expiry_epoch=$(date -d "$expiry" +%s)
        local current_epoch=$(date +%s)
        local days_left=$(( (expiry_epoch - current_epoch) / 86400 ))
        
        if [ "$days_left" -gt 30 ]; then
            print_success "SSL сертификат действителен ($days_left дней до истечения)"
        elif [ "$days_left" -gt 7 ]; then
            print_warning "SSL сертификат истекает через $days_left дней"
        else
            print_error "SSL сертификат истекает через $days_left дней!"
        fi
    else
        print_warning "SSL сертификат не найден"
    fi
    
    echo ""
}

# Проверка бэкапов
check_backups() {
    print_section "Бэкапы"
    
    local backup_dir="/opt/labosfera/backups"
    if [ -d "$backup_dir" ]; then
        local latest_backup=$(find "$backup_dir" -name "*.sql" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
        if [ -n "$latest_backup" ]; then
            local backup_date=$(date -r "$latest_backup" '+%Y-%m-%d %H:%M:%S')
            local backup_age=$(( ($(date +%s) - $(date -r "$latest_backup" +%s)) / 86400 ))
            
            if [ "$backup_age" -le 1 ]; then
                print_success "Последний бэкап: $backup_date (свежий)"
            elif [ "$backup_age" -le 7 ]; then
                print_warning "Последний бэкап: $backup_date ($backup_age дней назад)"
            else
                print_error "Последний бэкап: $backup_date ($backup_age дней назад) - слишком старый!"
            fi
        else
            print_warning "Бэкапы не найдены"
        fi
    else
        print_warning "Директория бэкапов не существует"
    fi
    
    echo ""
}

# Проверка производительности сети (Timeweb Cloud)
check_network() {
    print_section "Производительность сети"
    
    # Проверка скорости отклика
    local ping_result=$(ping -c 4 8.8.8.8 | tail -1 | awk -F '/' '{print $5}')
    echo -e "🌐 Средний ping до 8.8.8.8: ${YELLOW}${ping_result}ms${NC}"
    
    # Проверка DNS
    local dns_time=$(dig @8.8.8.8 google.com | grep "Query time" | awk '{print $4}')
    echo -e "🔍 DNS запрос: ${YELLOW}${dns_time}ms${NC}"
    
    # Проверка подключений
    local connections=$(ss -tuln | wc -l)
    echo -e "🔗 Активных подключений: ${YELLOW}$connections${NC}"
    
    echo ""
}

# Рекомендации по оптимизации
show_recommendations() {
    print_section "Рекомендации для Timeweb Cloud"
    
    # Проверка оптимизаций
    local recommendations=0
    
    # Проверка swap
    local swap_usage=$(free | awk '/^Swap:/ {if ($2 > 0) printf("%.1f"), $3/$2 * 100.0; else print "0"}')
    if (( $(echo "$swap_usage > 10" | bc -l) )); then
        print_warning "Высокое использование swap ($swap_usage%) - рассмотрите увеличение RAM"
        ((recommendations++))
    fi
    
    # Проверка CPU
    if (( $(echo "$cpu_usage > 80" | bc -l) )); then
        print_warning "Высокая загрузка CPU ($cpu_usage%) - рассмотрите оптимизацию или масштабирование"
        ((recommendations++))
    fi
    
    # Проверка места на диске
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 80 ]; then
        print_warning "Мало места на диске ($disk_usage%) - рассмотрите очистку или увеличение диска"
        ((recommendations++))
    fi
    
    if [ "$recommendations" -eq 0 ]; then
        print_success "Система работает оптимально для Timeweb Cloud!"
    fi
    
    echo ""
    print_info "💡 Дополнительные оптимизации для Timeweb Cloud:"
    echo "   • Используйте NVMe диски для базы данных"
    echo "   • Настройте CDN для статических файлов"
    echo "   • Включите HTTP/2 и Brotli сжатие"
    echo "   • Используйте Redis для кэширования"
    echo "   • Настройте мониторинг с Grafana + Prometheus"
    echo ""
}

# Генерация отчета
generate_report() {
    local report_file="/tmp/labosfera_monitoring_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "ЛАБОСФЕРА - Отчет мониторинга Timeweb Cloud"
        echo "Дата: $(date)"
        echo "Хост: $(hostname)"
        echo "========================================"
        echo ""
        
        echo "СИСТЕМА:"
        echo "CPU: ${cpu_usage}%"
        echo "Память: ${mem_info} (${mem_percent}%)"
        echo "Диск: ${disk_info}"
        echo "Аптайм: ${uptime_info}"
        echo ""
        
        echo "DOCKER КОНТЕЙНЕРЫ:"
        docker-compose -f docker-compose.timeweb.yml ps
        echo ""
        
        echo "ИСПОЛЬЗОВАНИЕ РЕСУРСОВ:"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
        
    } > "$report_file"
    
    print_success "Отчет сохранен: $report_file"
}

# Главная функция
main() {
    print_header
    
    # Проверки
    check_docker || exit 1
    check_containers
    check_system_resources
    check_docker_resources
    check_services
    check_logs
    check_ssl
    check_backups
    check_network
    show_recommendations
    
    # Опциональная генерация отчета
    if [ "$1" = "--report" ]; then
        generate_report
    fi
    
    echo -e "${GREEN}✅ Мониторинг завершен!${NC}"
    echo -e "${BLUE}💡 Для полного отчета используйте: $0 --report${NC}"
}

# Запуск
main "$@"