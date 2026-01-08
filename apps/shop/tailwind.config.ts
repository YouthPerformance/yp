import type {Config} from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'wolf-black': '#0a0a0a',
        'neon-green': '#39ff14',
        cyan: '#00f6e0',
        pink: '#ff1693',
        surface: '#141414',
        'surface-elevated': '#1a1a1a',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        loading: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 246, 224, 0.3), 0 0 40px rgba(0, 246, 224, 0.1)',
        'glow-green': '0 0 20px rgba(57, 255, 20, 0.3), 0 0 40px rgba(57, 255, 20, 0.1)',
      },
      keyframes: {
        'slide-up': {
          '0%': {transform: 'translateY(100%)', opacity: '0'},
          '100%': {transform: 'translateY(0)', opacity: '1'},
        },
        'rotate': {
          to: {transform: 'rotate(360deg)'},
        },
        'bloop': {
          '0%': {transform: 'scale(0.9)'},
          '40%': {transform: 'scale(1.1)'},
          '100%': {transform: 'scale(1)'},
        },
        'shine': {
          '0%': {left: '-75%'},
          '100%': {left: '125%'},
        },
        'float': {
          '0%, 100%': {transform: 'translateY(0)'},
          '50%': {transform: 'translateY(-10px)'},
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'rotate': 'rotate 10s linear infinite',
        'rotate-slow': 'rotate 20s linear infinite',
        'rotate-fast': 'rotate 3s linear infinite',
        'bloop': 'bloop 0.3s linear',
        'shine': 'shine 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
