/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        emme: {
          primary: '#A63E68',
          'primary-soft': '#F5E4EB',
          background: '#F3F4F5',
          surface: '#FFFFFF',
          foreground: '#191617',
          secondary: '#665E62',
          border: '#E7E4E5',
          success: '#216648',
          warning: '#795200',
          error: '#A52A3A',
        },
      },
      borderRadius: { card: '20px', hero: '28px', field: '18px' },
    },
  },
  plugins: [],
};
