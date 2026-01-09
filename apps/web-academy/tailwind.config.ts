// ═══════════════════════════════════════════════════════════
// TAILWIND CONFIG
// Barefoot Reset - YP Design System v2
// ═══════════════════════════════════════════════════════════

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─────────────────────────────────────────────────────────
      // COLORS (CSS Variables - set by ThemeProvider)
      // ─────────────────────────────────────────────────────────
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          elevated: "var(--bg-elevated)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          muted: "var(--text-muted)",
        },
        border: {
          default: "var(--border-default)",
          subtle: "var(--border-subtle)",
        },
        accent: {
          primary: "var(--accent-primary)",
          "primary-hover": "var(--accent-primary-hover)",
          gold: "var(--accent-gold)",
          warning: "var(--accent-warning)",
          error: "var(--accent-error)",
        },
      },

      // ─────────────────────────────────────────────────────────
      // TYPOGRAPHY
      // ─────────────────────────────────────────────────────────
      fontFamily: {
        bebas: ["var(--font-bebas)", "Bebas Neue", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["SF Mono", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        // Display sizes
        "display-xl": ["4rem", { lineHeight: "1.1", letterSpacing: "0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.2", letterSpacing: "0.02em" }],
        // Body sizes
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "body-xs": ["0.75rem", { lineHeight: "1.5" }],
      },

      // ─────────────────────────────────────────────────────────
      // SPACING (8px grid)
      // ─────────────────────────────────────────────────────────
      spacing: {
        "0.5": "4px",
        "1": "8px",
        "1.5": "12px",
        "2": "16px",
        "2.5": "20px",
        "3": "24px",
        "4": "32px",
        "5": "40px",
        "6": "48px",
        "7": "56px",
        "8": "64px",
        "9": "72px",
        "10": "80px",
      },

      // ─────────────────────────────────────────────────────────
      // BORDER RADIUS
      // ─────────────────────────────────────────────────────────
      borderRadius: {
        none: "0",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        full: "9999px",
      },

      // ─────────────────────────────────────────────────────────
      // ANIMATIONS
      // ─────────────────────────────────────────────────────────
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
      },
      keyframes: {
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5%)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0, 246, 224, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(0, 246, 224, 0.6)" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
      },

      // ─────────────────────────────────────────────────────────
      // TRANSITIONS
      // ─────────────────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: "200ms",
        fast: "100ms",
        slow: "300ms",
        slower: "500ms",
      },
      transitionTimingFunction: {
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      // ─────────────────────────────────────────────────────────
      // BOX SHADOW (Glow effects)
      // ─────────────────────────────────────────────────────────
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 246, 224, 0.3)",
        "glow-cyan-strong": "0 0 30px rgba(0, 246, 224, 0.5), 0 0 60px rgba(0, 246, 224, 0.2)",
        "glow-gold": "0 0 20px rgba(251, 191, 36, 0.3)",
        "glow-gold-strong": "0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.2)",
      },

      // ─────────────────────────────────────────────────────────
      // BACKDROP BLUR
      // ─────────────────────────────────────────────────────────
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },

      // ─────────────────────────────────────────────────────────
      // Z-INDEX SCALE
      // ─────────────────────────────────────────────────────────
      zIndex: {
        dropdown: "100",
        modal: "200",
        overlay: "300",
        toast: "400",
        tooltip: "500",
      },
    },
  },
  plugins: [],
};

export default config;
