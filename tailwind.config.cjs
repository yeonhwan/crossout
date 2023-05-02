/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  important: "#__next",
  theme: {
    extend: {
      backgroundImage: {
        dummy:
          "url('https://img.freepik.com/free-vector/realistic-mountain-landscape-illustration_23-2149156109.jpg?w=1800&t=st=1683017865~exp=1683018465~hmac=2a544efe21cb9908e901b126f33631437ec235ad1879c02ff05dd7f05176b6f9')",
      },
    },
  },
  plugins: [],
};

module.exports = config;
