/** @type {import('tailwindcss').Config} */
module.exports = {
  // Указываем Tailwind, где искать классы для оптимизации CSS
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  // Расширяем стандартную тему, добавляя наши фирменные цвета
  theme: {
    extend: {
      colors: {
        'deep-blue': '#0D1B2A',      // Основной фон
        'dark-blue': '#1B263B',      // Фон для карточек
        'light-grey': '#E0E1DD',     // Основной текст
        'electric-blue': '#3A86FF', // Главный акцент
        'action-orange': '#FFBE0B',  // Вторичный акцент для CTA-кнопок
      },
    },
  },

  // Подключаем плагины
  plugins: [
    require('@tailwindcss/forms'), // Плагин для красивой стилизации форм
  ],
}