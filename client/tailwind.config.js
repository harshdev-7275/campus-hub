/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#f5f5f5",
          dark: "#333",
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")],
};
