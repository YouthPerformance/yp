import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic colors
        conflict: {
          bg: "#FEF3C7",
          border: "#F59E0B",
          text: "#92400E",
        },
        success: {
          bg: "#D1FAE5",
          border: "#10B981",
          text: "#065F46",
        },
        info: {
          bg: "#DBEAFE",
          border: "#3B82F6",
          text: "#1E40AF",
        },
        protected: {
          bg: "#F3E8FF",
          border: "#A855F7",
          text: "#6B21A8",
        },
        // Athlete swimlane colors
        athlete: {
          1: "#3B82F6", // Blue
          2: "#10B981", // Green
          3: "#F59E0B", // Amber
          4: "#EF4444", // Red
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
