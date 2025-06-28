# Используем официальный образ Python
FROM python:3.11-slim

# Устанавливаем переменные окружения
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Создаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Копируем исходный код проекта
COPY . /app/
