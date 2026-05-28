/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        notionBg: '#191919',
        notionCard: '#202020',
        notionBorder: '#2a2a2a',
      }
    },
  },
  plugins: [],
}