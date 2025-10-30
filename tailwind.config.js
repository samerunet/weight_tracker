/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#070815",
        surface: "#0C1022",
        text: "#D6E2FF",
        sub: "#8EA4D2",
        cyan: "#00F0FF",
        violet: "#7A77FF",
        pink: "#FF00E5",
        lime: "#00FFA6",
      },
      boxShadow: {
        neon: "0 0 30px rgba(0,240,255,0.35)",
        neonPink: "0 0 30px rgba(255,0,229,0.35)",
      },
      borderRadius: { xl2: "20px" },
    },
  },
  plugins: [],
};
