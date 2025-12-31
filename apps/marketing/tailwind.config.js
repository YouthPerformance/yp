/**
 * Peterson Academy + YouthPerformance Design System
 * Merged Tailwind Configuration v2.0
 *
 * Peterson Academy: Navy/Gold, EB Garamond/Montserrat
 * YP Design System: Pure Black, Cyan/Gold, Bebas Neue/Inter
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ================================
      // COLORS
      // ================================
      colors: {
        // Peterson Academy exact colors
        primary: {
          DEFAULT: '#C9A227',  // Gold - main accent color
          hover: '#D4A853',
          light: '#E5C766',
        },
        brand: {
          DEFAULT: '#2C3957',  // rgb(44, 57, 87) - Navy blue CTA
          hover: '#3D4F6F',
          light: '#4A6080',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#D4A853',
          // YP Gold (Spotlight Gold)
          400: '#FCD34D',
          500: '#FBBF24',
          600: '#F59E0B',
          700: '#D97706',
        },

        // Peterson Academy backgrounds
        background: {
          DEFAULT: '#071520',   // rgb(7, 21, 32) - Main dark
          dark: '#040c0e',      // Theme color - Darkest
          secondary: '#262626', // rgb(38, 38, 38)
          surface: '#1A1A1A',
          card: '#141414',
          elevated: '#2A2A2A',
        },

        // Pure Black Dark Mode (YP Design System)
        black: {
          DEFAULT: '#000000',
          50: '#0A0A0A',   // Cards, sections
          100: '#141414',  // Modals, dropdowns
          200: '#1A1A1A',  // Hover states
          300: '#222222',  // Input fields, wells
          400: '#2A2A2A',  // Borders
          500: '#3A3A3A',  // Strong borders
        },

        // Clean Light Mode (YP Design System)
        white: {
          DEFAULT: '#FFFFFF',
          50: '#F8F8F8',   // Cards, sections
          100: '#F0F0F0',  // Modals, dropdowns
          200: '#E8E8E8',  // Hover states
          300: '#E0E0E0',  // Input fields, wells
          400: '#CCCCCC',  // Strong borders
        },

        // Wolf Cyan (YP Brand Primary)
        cyan: {
          500: '#00F6E0',  // Dark mode primary
          600: '#00DCCE',  // Hover dark
          700: '#00BFB0',  // Light mode primary
          800: '#009F8E',  // Light mode hover
          900: '#007F72',  // Pressed
        },

        border: {
          DEFAULT: '#333333',
          light: '#404040',
          // YP borders
          dark: {
            DEFAULT: '#2A2A2A',
            subtle: '#1A1A1A',
            strong: '#3A3A3A',
          },
        },

        text: {
          primary: '#E8E8E8',   // rgb(232, 232, 232)
          secondary: '#A3A3A3', // rgb(163, 163, 163)
          tertiary: '#A6A6A6',  // rgb(166, 166, 166)
          muted: '#808080',
        },

        // YP Dark mode text
        'dark-text': {
          primary: '#FFFFFF',   // 21:1 contrast
          secondary: '#A0A0A0', // 10:1 contrast
          tertiary: '#666666',  // 4.5:1 contrast
          muted: '#444444',     // Decorative only
        },

        // YP Light mode text
        'light-text': {
          primary: '#000000',   // 21:1 contrast
          secondary: '#555555', // 7:1 contrast
          tertiary: '#888888',  // 4.5:1 contrast
          muted: '#AAAAAA',     // Decorative only
        },

        // State colors
        success: '#10B981',
        warning: '#FBBF24',
        error: '#EF4444',
        info: '#3B82F6',
      },

      // ================================
      // TYPOGRAPHY
      // ================================
      fontFamily: {
        // Peterson Academy fonts
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"EB Garamond"', 'serif'],
        // YP Design System fonts
        'yp-display': ['"Bebas Neue"', 'Impact', '"Arial Black"', 'sans-serif'],
        'bebas': ['"Bebas Neue"', 'Impact', '"Arial Black"', 'sans-serif'],
        'yp-body': ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"SF Mono"', 'Monaco', '"Cascadia Code"', 'Consolas', 'monospace'],
      },

      fontSize: {
        // Peterson Academy typography scale
        'hero': ['60px', { lineHeight: '63.6px', letterSpacing: '-1.4px' }],
        'h1': ['56px', { lineHeight: '70px', letterSpacing: '-1.4px' }],
        'h2': ['36px', { lineHeight: '45px', letterSpacing: '-0.9px' }],
        'h3': ['24px', { lineHeight: '32px', letterSpacing: '-0.6px' }],
        'body-lg': ['20px', { lineHeight: '25px', letterSpacing: '1px' }],
        'body': ['16px', { lineHeight: '24px', letterSpacing: '0.19px' }],
        'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '0.15px' }],
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0.1px' }],
        'cta': ['16px', { lineHeight: '24px', letterSpacing: '1.68px' }],

        // YP Design System typography
        'display-hero': ['56px', { lineHeight: '1.15', letterSpacing: '0.02em' }],
        'display-xl': ['44px', { lineHeight: '1.15', letterSpacing: '0.02em' }],
        'display-lg': ['32px', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'display-md': ['24px', { lineHeight: '1.25', letterSpacing: '0.02em' }],
        'title-lg': ['20px', { lineHeight: '1.4' }],
        'title-md': ['18px', { lineHeight: '1.4' }],
        'yp-body-lg': ['18px', { lineHeight: '1.6' }],
        'yp-body-md': ['16px', { lineHeight: '1.6' }],
        'yp-body-sm': ['14px', { lineHeight: '1.5' }],
        'label-lg': ['14px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'label-md': ['12px', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        'label-sm': ['11px', { lineHeight: '1.4', letterSpacing: '0.04em' }],
      },

      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.02em',
        caps: '0.04em',
      },

      // ================================
      // SPACING
      // ================================
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '32px',
        '8': '40px',
        '9': '48px',
        '10': '56px',
        '12': '64px',
        '16': '80px',
        '18': '4.5rem',
        '22': '5.5rem',
        'safe': '34px',
        'navbar': '64px',
        'tabbar': '49px',
      },

      // ================================
      // BORDER RADIUS
      // ================================
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'pill': '9999px',
        'full': '9999px',
      },

      // ================================
      // SHADOWS
      // ================================
      boxShadow: {
        // Dark mode shadows
        'dark-sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 12px rgba(0, 0, 0, 0.6)',
        'dark-lg': '0 8px 24px rgba(0, 0, 0, 0.7)',
        'dark-xl': '0 16px 48px rgba(0, 0, 0, 0.8)',

        // Light mode shadows
        'light-sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'light-md': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'light-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'light-xl': '0 16px 48px rgba(0, 0, 0, 0.16)',

        // Glows
        'glow-cyan': '0 0 24px rgba(0, 246, 224, 0.5)',
        'glow-cyan-light': '0 0 24px rgba(0, 191, 176, 0.25)',
        'glow-gold': '0 0 24px rgba(251, 191, 36, 0.5)',
        'glow-gold-light': '0 0 24px rgba(245, 158, 11, 0.25)',

        // Focus rings
        'focus-dark': '0 0 0 3px rgba(0, 246, 224, 0.4)',
        'focus-light': '0 0 0 3px rgba(0, 191, 176, 0.3)',
      },

      // ================================
      // ANIMATION
      // ================================
      transitionDuration: {
        'micro': '100ms',
        'fast': '150ms',
        'normal': '200ms',
        'moderate': '300ms',
        'slow': '400ms',
        'achievement': '800ms',
        '250': '250ms',
      },

      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 24px rgba(0, 246, 224, 0.5)' },
          '50%': { boxShadow: '0 0 32px rgba(0, 246, 224, 0.7)' },
        },
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fadeIn': 'fadeIn 0.2s ease-out',
        'slideUp': 'slideUp 0.3s ease-out',
        'slide-up': 'slide-up 300ms ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },

      // ================================
      // COMPONENT SIZES
      // ================================
      height: {
        'btn-sm': '36px',
        'btn-md': '44px',
        'btn-lg': '48px',
        'btn-xl': '56px',
        'input': '48px',
        'input-lg': '56px',
      },

      maxWidth: {
        'reading': '65ch', // Optimal reading width
      },
    },
  },
  plugins: [],
}
