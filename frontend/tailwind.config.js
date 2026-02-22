/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'brand-pink': '#E91E63',
        'dark-bg': '#0A0A0A',
        'dark-card': '#1A1A1A',
        'cream': '#FFF8F0',
      }
    },
  },
  plugins: [],
}