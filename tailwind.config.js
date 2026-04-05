/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          teal: '#189D91',
          coral: '#F0624C',
          amber: '#F29F29',
        },
        // Legacy support
        primary: '#189D91',
        secondary: '#189D91',
        accent: '#F29F29',
        // UI Colors
        background: '#F8FAFC',
        foreground: '#FFFFFF',
        'text-dark': '#1F2937',
        'text-muted': '#6B7280',
        'border-light': '#E5E7EB',
        'inactive-toggle': '#D1D5DB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      spacing: {
        'section': '4rem',
        'component': '2rem',
      },
    },
  },
  plugins: [],
}