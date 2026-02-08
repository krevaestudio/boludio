/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        argentina: '#74ACDF', // Un celeste bien patrio para bolud.io
      }
    },
  },
  plugins: [],
}
