# Используем официальный образ Nginx
FROM nginx:alpine

# Удаляем стандартную конфигурацию
RUN rm /etc/nginx/conf.d/default.conf

# Копируем нашу конфигурацию для продакшена
COPY prod.conf /etc/nginx/nginx.conf

# Копируем SSL сертификаты
COPY ssl/ /etc/nginx/ssl/
