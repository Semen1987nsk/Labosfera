/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#0D1B2A',
        'dark-blue': '#1B263B',
        'light-grey': '#E0E1DD',
        'electric-blue': '#3A86FF',
        'action-orange': '#FFBE0B',
      },
    },
  },
  plugins: [],
}