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
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 246, 224, 0.3), 0 0 40px rgba(0, 246, 224, 0.1)',
        'glow-green': '0 0 20px rgba(57, 255, 20, 0.3), 0 0 40px rgba(57, 255, 20, 0.1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
