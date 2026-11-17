import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0B080D", plum: "#1A0D1D", burgundy: "#42142D",
        rose: "#E85D91", blush: "#F5B8CE", cream: "#F8EDE8", lavender: "#BBA8C2",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      boxShadow: { glow: "0 0 40px -8px rgba(232,93,145,.55)" },
    },
  },
  plugins: [],
};
export default config;
