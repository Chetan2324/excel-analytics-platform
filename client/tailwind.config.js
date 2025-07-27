/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Add this new animation configuration
      animation: {
        'slow-zoom': 'slow-zoom 20s infinite alternate ease-in-out',
      },
      keyframes: {
        'slow-zoom': {
          'from': { transform: 'scale(1)' },
          'to': { transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}