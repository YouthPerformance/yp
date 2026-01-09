// ═══════════════════════════════════════════════════════════
// TAILWIND CONFIG
// YouthPerformance Playbook - YP Design System v2
// ═══════════════════════════════════════════════════════════

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      // ─────────────────────────────────────────────────────────
      // COLORS (CSS Variables - set by data-theme attribute)
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
          DEFAULT: "var(--border-default)",
          default: "var(--border-default)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        accent: {
          primary: "var(--accent-primary)",
          "primary-hover": "var(--accent-primary-hover)",
          gold: "var(--accent-gold)",
          "gold-hover": "var(--accent-gold-hover)",
        },
        state: {
          success: "var(--state-success)",
          warning: "var(--state-warning)",
          error: "var(--state-error)",
          info: "var(--state-info)",
        },
        // Age bands (keep as static for badges)
        age: {
          "7-9": "#7C3AED",
          "10-13": "#2563EB",
          "14-18": "#059669",
        },
        // Wolf brand colors (static)
        wolf: {
          cyan: {
            DEFAULT: "#00F6E0",
            500: "#00F6E0",
            400: "#33F7E6",
            600: "#00D4C4",
          },
        },
      },

      // ─────────────────────────────────────────────────────────
      // TYPOGRAPHY
      // ─────────────────────────────────────────────────────────
      fontFamily: {
        bebas: ["Bebas Neue", "Impact", "Arial Black", "sans-serif"],
        inter: ["Inter", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["SF Mono", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        // Display sizes (headings)
        "display-xl": ["4rem", { lineHeight: "1.1", letterSpacing: "0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.15", letterSpacing: "0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.2", letterSpacing: "0.02em" }],
        "display-xs": ["1.5rem", { lineHeight: "1.2", letterSpacing: "0.02em" }],
        // Body sizes
        "body-xl": ["1.25rem", { lineHeight: "1.6" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "body-xs": ["0.75rem", { lineHeight: "1.5" }],
        // Utility sizes
        label: ["0.75rem", { lineHeight: "1", letterSpacing: "0.05em" }],
      },

      // ─────────────────────────────────────────────────────────
      // SPACING (8px grid)
      // ─────────────────────────────────────────────────────────
      spacing: {
        0.5: "4px",
        1: "8px",
        1.5: "12px",
        2: "16px",
        2.5: "20px",
        3: "24px",
        4: "32px",
        5: "40px",
        6: "48px",
        7: "56px",
        8: "64px",
        9: "72px",
        10: "80px",
        12: "96px",
        16: "128px",
      },

      // ─────────────────────────────────────────────────────────
      // BORDER RADIUS
      // ─────────────────────────────────────────────────────────
      borderRadius: {
        none: "0",
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
        full: "9999px",
      },

      // ─────────────────────────────────────────────────────────
      // BOX SHADOW
      // ─────────────────────────────────────────────────────────
      boxShadow: {
        // Depth shadows (dark mode optimized)
        sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
        DEFAULT: "0 2px 8px rgba(0, 0, 0, 0.4)",
        md: "0 4px 12px rgba(0, 0, 0, 0.5)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.6)",
        xl: "0 16px 48px rgba(0, 0, 0, 0.7)",
        // Glow shadows
        "glow-cyan": "0 0 20px rgba(0, 246, 224, 0.3)",
        "glow-cyan-strong": "0 0 30px rgba(0, 246, 224, 0.5)",
        "glow-gold": "0 0 20px rgba(251, 191, 36, 0.3)",
        "glow-gold-strong": "0 0 30px rgba(251, 191, 36, 0.5)",
        // Focus ring
        focus: "0 0 0 3px rgba(0, 246, 224, 0.4)",
        // Card (for light modes)
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        elevated: "0 4px 20px rgba(0, 0, 0, 0.12)",
      },

      // ─────────────────────────────────────────────────────────
      // ANIMATIONS
      // ─────────────────────────────────────────────────────────
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "glow-gold": "glow-gold 2s ease-in-out infinite alternate",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        spin: "spin 1s linear infinite",
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
        "glow-gold": {
          "0%": { boxShadow: "0 0 20px rgba(251, 191, 36, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(251, 191, 36, 0.6)" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      // ─────────────────────────────────────────────────────────
      // TRANSITIONS
      // ─────────────────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: "200ms",
        fast: "100ms",
        normal: "200ms",
        slow: "300ms",
        slower: "500ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      // ─────────────────────────────────────────────────────────
      // BACKDROP BLUR
      // ─────────────────────────────────────────────────────────
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },

      // ─────────────────────────────────────────────────────────
      // Z-INDEX SCALE
      // ─────────────────────────────────────────────────────────
      zIndex: {
        dropdown: "100",
        sticky: "150",
        modal: "200",
        overlay: "300",
        toast: "400",
        tooltip: "500",
      },

      // ─────────────────────────────────────────────────────────
      // CONTAINER
      // ─────────────────────────────────────────────────────────
      maxWidth: {
        article: "800px",
        content: "1200px",
        wide: "1400px",
      },
    },
  },
  plugins: [],
};
