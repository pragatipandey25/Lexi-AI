/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e5edff',
          200: '#cddbfe',
          300: '#b4c6fc',
          400: '#819efa',
          500: '#4f6bf5',
          600: '#354cdb',
          700: '#2637b3',
          800: '#1e2c8f',
          900: '#1a2675',
          950: '#0f1742',
        },
      },
    },
  },
  plugins: [],
};
