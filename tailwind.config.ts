import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Royal blue — primary brand color
        royal: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#4f46e5",
          600: "#3730a3",
          700: "#1e2266",   // primary deep royal blue
          800: "#161b4d",
          900: "#0e1233",
        },
        // Burgundy — secondary accent
        burgundy: {
          50: "#fdf2f4",
          100: "#fce7ea",
          400: "#c2385a",
          500: "#9d1f3f",
          600: "#7a1832",   // primary burgundy
          700: "#5c1226",
          800: "#3f0c1a",
        },
        // Gold — highlight accent
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          300: "#fcd34d",
          400: "#f5b942",
          500: "#d4a017",   // primary gold
          600: "#a97e12",
          700: "#7d5c0d",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "royal-gradient": "linear-gradient(135deg, #1e2266 0%, #161b4d 60%, #0e1233 100%)",
        "gold-shine": "linear-gradient(90deg, #d4a017 0%, #f5b942 50%, #d4a017 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
