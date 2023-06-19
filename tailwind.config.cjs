/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  important: "#__next",
  theme: {
    extend: {
      gridTemplateColumns: {
        listboard: "repeat(auto-fill, minmax(280px, 320px))",
      },
      screens: {
        mobile: "400px",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

module.exports = config;
