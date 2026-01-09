import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wolf: {
          black: "#0a0a0a",
          dark: "#141414",
          gray: "#1a1a1a",
          neon: "#00ff88",
          orange: "#ff6b35",
          blue: "#00d4ff",
        },
      },
      fontFamily: {
        display: ["var(--font-tungsten)", "Impact", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        ticker: "ticker 30s linear infinite",
        "fade-up": "fade-up 0.8s ease-out forwards",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(0, 255, 136, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
