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
        listboard: "repeat(auto-fill, minmax(320px, 25%))",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

module.exports = config;
