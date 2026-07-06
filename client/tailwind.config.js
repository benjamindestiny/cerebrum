/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C2BD9',
          light: '#8B5CF6',
          dark: '#5A1BB8',
        },
        secondary: {
          DEFAULT: '#00C9A7',
          light: '#34D399',
          dark: '#059669',
        },
        dark: {
          DEFAULT: '#0A0A1A',
          card: '#1A1A3E',
          input: '#2D2D5E',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
