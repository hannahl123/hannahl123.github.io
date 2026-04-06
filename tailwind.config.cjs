const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'background': '#fdf4eb',
        'card': '#f3caca6f',
        'primary': '#916262',
        'secondary': '#9f7282',
        'accent': '#e4699c',
        'accent-hover': '#ffc7dabd',
      }
    },
  },
  plugins: [],
}
