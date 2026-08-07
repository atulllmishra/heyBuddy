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
        yt: {
          bg: '#0f0f0f',
          paper: '#181818',
          card: '#272727',
          hover: '#383838',
          border: '#303030',
          red: '#ff0000',
          blue: '#3ea6ff',
          text: '#f1f1f1',
          muted: '#aaaaaa',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
