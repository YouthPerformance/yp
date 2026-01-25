/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// YP Brand Colors - Premium Dark Theme
				'yp-cyan': '#00f6e0',
				'yp-cyan-dark': '#00c4b4',
				'yp-cyan-glow': 'rgba(0, 246, 224, 0.3)',
				'yp-primary': '#00f6e0',
				'yp-secondary': '#1E3A5F',
				'yp-success': '#10B981',
				'yp-warning': '#F59E0B',
				'yp-error': '#EF4444',
				'yp-dark': '#0a0a0a',
				'yp-darker': '#050505',
				'yp-light': '#F9FAFB',
				// Glass effect colors
				'glass-white': 'rgba(255, 255, 255, 0.05)',
				'glass-border': 'rgba(255, 255, 255, 0.1)',
				'glass-highlight': 'rgba(255, 255, 255, 0.15)',
			},
			fontFamily: {
				'bebas': ['Bebas Neue', 'Impact', 'sans-serif'],
				'display': ['Bebas Neue', 'Impact', 'sans-serif'],
				'body': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
			},
			animation: {
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'recording': 'recording 1.5s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'float': 'float 6s ease-in-out infinite',
				'shimmer': 'shimmer 2.5s linear infinite',
			},
			keyframes: {
				recording: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				glow: {
					'0%': { boxShadow: '0 0 20px rgba(0, 246, 224, 0.3), 0 0 40px rgba(0, 246, 224, 0.1)' },
					'100%': { boxShadow: '0 0 30px rgba(0, 246, 224, 0.5), 0 0 60px rgba(0, 246, 224, 0.2)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			boxShadow: {
				'glow-cyan': '0 0 20px rgba(0, 246, 224, 0.3)',
				'glow-cyan-strong': '0 0 30px rgba(0, 246, 224, 0.5), 0 0 60px rgba(0, 246, 224, 0.2)',
				'glow-cyan-intense': '0 0 40px rgba(0, 246, 224, 0.6), 0 0 80px rgba(0, 246, 224, 0.3), 0 0 120px rgba(0, 246, 224, 0.1)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
				'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.5)',
			},
			backdropBlur: {
				'xs': '2px',
				'glass': '16px',
			},
			borderRadius: {
				'glass': '20px',
				'glass-lg': '28px',
			}
		}
	},
	plugins: []
};
