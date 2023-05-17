/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  important: "#__next",
  theme: {
    extend: {
      backgroundImage: {
        dummy:
          "url('https://cdn.dribbble.com/users/181520/screenshots/9447082/media/ef346873f7ca645f056310305167e101.jpg')",
      },
      gridTemplateColumns: {
        listboard: "repeat(auto-fill, minmax(320px, 25%))",
      },
    },
  },
  plugins: [],
};

module.exports = config;
