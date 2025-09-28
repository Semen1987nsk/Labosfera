/** @type {import('tailwindcss').Config} */
module.exports = {
  // Указываем Tailwind, где искать классы для оптимизации CSS
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  // Расширяем стандартную тему
  theme: {
    extend: {
      // Наши фирменные цвета
      colors: {
        'deep-blue': '#0D1B2A',      // Основной фон
        'dark-blue': '#1B263B',      // Фон для карточек
        'light-grey': '#E0E1DD',     // Основной текст
        'electric-blue': '#3A86FF', // Главный акцент
        'action-orange': '#FFBE0B',  // Вторичный акцент для CTA-кнопок
      },
      // Наша кастомная анимация для бегущей строки
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },

  // Подключаем плагины
  plugins: [
    require('@tailwindcss/forms'), // Плагин для красивой стилизации форм
  ],
}