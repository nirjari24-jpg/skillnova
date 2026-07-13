/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // Slate 900
        surface: 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity for glass
        primary: '#38bdf8', // Light blue
        secondary: '#818cf8', // Indigo
        accent: '#2dd4bf', // Teal
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to bottom right, #0f172a, #1e1b4b, #020617)',
      }
    },
  },
  plugins: [],
}
