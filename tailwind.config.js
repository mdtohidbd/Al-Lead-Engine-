/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006e2f',
          container: '#22c55e',
          fixed: '#6bff8f',
          dim: '#4ae176',
          dark: '#004b1e'
        },
        surface: {
          DEFAULT: '#f8f9fb',
          dim: '#d9dadc',
          bright: '#f8f9fb',
          container: '#edeef0',
          low: '#f2f4f6',
          lowest: '#ffffff',
          high: '#e7e8ea',
          highest: '#e1e2e4',
        },
        on: {
          surface: '#191c1e',
          'surface-variant': '#3d4a3d',
        },
      },
      spacing: {
        'sidebar-width': '240px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
