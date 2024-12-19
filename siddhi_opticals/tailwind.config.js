/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "text-primary": "#090d0b",
        bg: "#fbfcfb",
        primary: "#72a485",
        secondary: "#cdb1cc",
        accent: "#b99295",
        button : "#4dc743",
        card : "#90decd"
      },
    },
  },
  plugins: [],
};
