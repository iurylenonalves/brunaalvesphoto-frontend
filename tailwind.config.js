module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        questrial: ["var(--font-questrial)", "sans-serif"],
        raleway: ["var(--font-raleway)", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Plugin para animações
  ],
};