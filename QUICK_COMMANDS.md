# ⚡ Быстрые команды для Shell-клиента REG.RU

## 🚀 **ГОТОВЫЕ КОМАНДЫ ДЛЯ КОПИРОВАНИЯ:**

### 1️⃣ **Проверка окружения (скопируйте и вставьте):**
```bash
echo "🔍 Проверка сервера REG.RU:" && echo "Текущая папка: $(pwd)" && echo "Содержимое:" && ls -la && echo "Python: $(python3 --version 2>/dev/null || python --version 2>/dev/null || echo 'не найден')" && echo "Node.js: $(node --version 2>/dev/null || echo 'не найден')" && echo "Git: $(git --version 2>/dev/null || echo 'не найден')"
```

### 2️⃣ **Автоматическое развертывание ЛАБОСФЕРА:**
```bash
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy-regru.sh | bash
```

### 3️⃣ **Альтернативный способ (если curl не работает):**
```bash
wget -O deploy.sh https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy-regru.sh && chmod +x deploy.sh && ./deploy.sh
```

### 4️⃣ **Проверка результата:**
```bash
echo "📁 Проверка файлов:" && ls -la public_html/ 2>/dev/null || ls -la www/ 2>/dev/null && echo "🌐 Тестируем сайт:" && curl -I http://labosfera.ru 2>/dev/null | head -3
```

## 🎯 **Пошаговые действия:**

1. **Откройте Shell-клиент** в панели REG.RU (как на вашем скриншоте)

2. **Скопируйте команду проверки** (команда 1️⃣) и вставьте в терминал

3. **Запустите развертывание** (команда 2️⃣)

4. **Дождитесь завершения** (3-5 минут)

5. **Проверьте результат** (команда 4️⃣)

## ✅ **После развертывания будет доступно:**

- 🌐 **http://labosfera.ru** - главная страница с полным дизайном
- 🔧 **http://labosfera.ru/admin/** - админ-панель Django  
- 📡 **http://labosfera.ru/api/** - REST API

**Логин:** `admin`  
**Пароль:** `admin123`

## 🔧 **Что делает скрипт автоматически:**

✅ Определяет тип хостинга и веб-директорию  
✅ Проверяет версии Python и Node.js  
✅ Загружает код ЛАБОСФЕРА с GitHub  
✅ Настраивает Django с совместимыми зависимостями  
✅ Создает базу данных и админ-пользователя  
✅ Копирует файлы в правильные места  
✅ Настраивает права доступа  

## 🎉 **Начинаем развертывание?**

**Просто скопируйте и вставьте в ваш Shell-клиент:**

```bash
curl -fsSL https://raw.githubusercontent.com/Semen1987nsk/Labosfera/main/deploy-regru.sh | bash
```

**Готов помочь на каждом шаге!** 🚀