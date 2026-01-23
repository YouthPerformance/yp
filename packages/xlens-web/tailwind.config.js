/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// YP Brand Colors
				'yp-primary': '#FF6B35',
				'yp-secondary': '#1E3A5F',
				'yp-success': '#10B981',
				'yp-warning': '#F59E0B',
				'yp-error': '#EF4444',
				'yp-dark': '#111827',
				'yp-light': '#F9FAFB'
			},
			animation: {
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'recording': 'recording 1.5s ease-in-out infinite'
			},
			keyframes: {
				recording: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				}
			}
		}
	},
	plugins: []
};
