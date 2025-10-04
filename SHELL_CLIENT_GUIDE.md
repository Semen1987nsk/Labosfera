# 🖥️ Развертывание ЛАБОСФЕРА через Shell-клиент REG.RU

## 🎯 **Идеальная ситуация!**

У вас есть **Shell-клиент** в панели управления REG.RU - это означает полный доступ к серверу для развертывания ЛАБОСФЕРА!

## 🚀 **Пошаговое развертывание:**

### **Шаг 1: Подключение к терминалу**
1. ✅ Вы уже в Shell-клиенте (как на скриншоте)
2. В терминале появится приглашение типа: `user@server293 ~]$`

### **Шаг 2: Проверка окружения**
Введите в терминале:
```bash
# Проверим где мы находимся
pwd

# Проверим доступные команды
which python3 && python3 --version
which node && node --version
which git && git --version

# Найдем веб-директорию
ls -la
ls -la public_html 2>/dev/null || ls -la www 2>/dev/null || echo "Ищем веб-папку..."
```

### **Шаг 3: Запуск автоматического развертывания**
```bash
# Загружаем и запускаем скрипт развертывания
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy-regru.sh | bash
```

### **Шаг 4: Если curl недоступен**
Альтернативный способ:
```bash
# Используем wget
wget -O deploy.sh https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy-regru.sh
chmod +x deploy.sh
./deploy.sh
```

### **Шаг 5: Ручная загрузка (если нет интернета)**
```bash
# Создаем директории
mkdir -p ~/public_html/labosfera
cd ~/public_html/labosfera

# Загружаем архив (если доступен wget)
wget https://github.com/Semen1987nsk/Labosfera/archive/main.zip
unzip main.zip
mv Labosfera-main/* .
```

## 📋 **Команды для копирования в терминал:**

### Команда 1: Быстрая проверка
```bash
echo "🔍 Проверка окружения ЛАБОСФЕРА:" && pwd && ls -la && python3 --version 2>/dev/null || python --version 2>/dev/null && node --version 2>/dev/null || echo "Node.js не найден"
```

### Команда 2: Автоматическое развертывание
```bash
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy-regru.sh | bash
```

### Команда 3: Проверка результата
```bash
ls -la public_html/ && echo "✅ Файлы развернуты!" || echo "❌ Нужна ручная настройка"
```

## 🎉 **Ожидаемый результат:**

После выполнения команд:
- 🌐 **http://labosfera.ru** - заработает полная версия
- 🔧 **http://labosfera.ru/admin/** - админ-панель Django
- 📱 **Все анимации и функции** будут доступны

**Данные для входа:**
- Логин: `admin`
- Пароль: `admin123`

## ⚡ **Самый быстрый способ:**

Просто скопируйте и вставьте в терминал Shell-клиента:

```bash
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy-regru.sh | bash
```

## 🆘 **Если возникают проблемы:**

### Проблема: "curl: command not found"
```bash
wget -O deploy.sh https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy-regru.sh && bash deploy.sh
```

### Проблема: "Permission denied"
```bash
chmod +x deploy.sh && ./deploy.sh
```

### Проблема: Старые версии ПО
Скрипт автоматически адаптируется:
- Использует Django 3.2+ для старого Python
- Создает статическую версию для старого Node.js
- Настраивает совместимые зависимости

## 📞 **Готов помочь!**

**Давайте запустим развертывание прямо сейчас!**

1. Откройте Shell-клиент (как на скриншоте)
2. Скопируйте команду автоматического развертывания
3. Вставьте в терминал и нажмите Enter
4. Ждите завершения (3-5 минут)
5. Проверяйте результат на labosfera.ru

**Готовы начать?** 🚀