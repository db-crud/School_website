/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        school: {
          primary: '#047857',   // emerald-700
          secondary: '#064e3b', // emerald-950
          accent: '#fbbf24',    // amber-400
          light: '#f0fdf4'      // green-50
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
