/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Crimson Pro', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Barefoot theme (James Scott) - Earthy, grounded
        earth: {
          DEFAULT: '#FAF6F0',
          dark: '#F0EBE3',
        },
        bark: {
          DEFAULT: '#1A1A1A',
          soft: '#3D3D3D',
          muted: '#6B6B6B',
        },
        moss: {
          DEFAULT: '#2D5016',
          light: '#4A7C23',
        },
        copper: {
          DEFAULT: '#B87333',
          light: '#D4956A',
        },

        // Basketball theme (Adam Harrington) - Trust, energy
        paper: {
          DEFAULT: '#FAF8F5',
          dark: '#F5F1EA',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          soft: '#4A4A4A',
          muted: '#757575',
        },
        gold: {
          DEFAULT: '#B8860B',
          light: '#DAA520',
        },
        'trust-blue': {
          DEFAULT: '#1E3A5F',
          light: '#2563EB',
        },

        // Shared action colors
        action: {
          green: '#16A34A',
          'green-hover': '#22C55E',
          orange: '#E85A1B',
          'orange-hover': '#FF6B35',
        },
        warning: '#DC8025',
        danger: '#DC2626',

        // Age bands
        'age-7-9': '#7C3AED',
        'age-10-13': '#2563EB',
        'age-14-18': '#059669',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        elevated: '0 4px 20px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
