import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#000000",
        card: "#E5E5E5",
      },
      fontFamily: {
        sans: ["var(--font-display)", "Jockey One", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
