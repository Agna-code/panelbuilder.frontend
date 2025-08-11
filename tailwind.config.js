/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tru: {
          blue: '#00A0DF',
          gray: '#F3F4F6',
          dark: '#1F2937'
        }
      }
    },
  },
  plugins: [],
};
 