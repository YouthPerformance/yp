/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "wolf-black": "#0a0a0a",
        "neon-green": "#39ff14",
        cyan: "#00f6e0",
        pink: "#ff1493",
        surface: "#141414",
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        shimmer: "shimmer 8s ease-in-out infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite alternate",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "300% center" },
          "100%": { backgroundPosition: "-300% center" },
        },
        glowPulse: {
          "0%": { filter: "drop-shadow(0 0 8px rgba(255,255,255,0.15))" },
          "100%": { filter: "drop-shadow(0 0 12px rgba(255,255,255,0.25))" },
        },
      },
    },
  },
  plugins: [],
};
