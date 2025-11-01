/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        panel: "#0B0F1E",
        text: "#D6E2FF",
        sub: "#8EA4D2",
        baby: "#9BEFFF",
        cyan: "#00F0FF",
        violet: "#7A77FF",
        pink: "#FF00E5"
      },
      boxShadow: {
        neon: "0 0 24px rgba(0,240,255,.18)",
      }
    },
  },
  plugins: [],
};
