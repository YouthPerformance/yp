// Motion Config - Premium animation curves and variants
// E14-1: Foundation Setup

// Custom Bezier Easing Curves
export const EASE = {
  // Premium Reveal - Fast start, very slow/smooth finish
  reveal: [0.25, 1, 0.5, 1],
  // Impact - For text that needs to hit hard
  impact: [0.22, 1, 0.36, 1],
  // Smooth - General purpose smooth
  smooth: [0.43, 0.13, 0.23, 0.96],
  // Bounce - Subtle overshoot
  bounce: [0.68, -0.6, 0.32, 1.6],
}

// Stagger config - 100ms between items
export const STAGGER = {
  fast: 0.05,
  default: 0.1,
  slow: 0.15,
}

// Animation Variants

// Fade up - Simple fade + translate
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.reveal },
  },
}

// Clip reveal - Text rising from masked container
export const clipReveal = {
  hidden: { y: '100%' },
  visible: {
    y: '0%',
    transition: { duration: 1, ease: EASE.reveal },
  },
}

// Scale up - Button/card entrance
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE.reveal },
  },
}

// Blur swap - For scrollytelling text swaps
export const blurSwap = {
  enter: {
    filter: 'blur(0px)',
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: EASE.reveal },
  },
  exit: {
    filter: 'blur(10px)',
    scale: 0.9,
    opacity: 0,
    transition: { duration: 0.3, ease: EASE.impact },
  },
}

// Stagger container
export const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.default,
      delayChildren: 0.2,
    },
  },
}

// Parallax layer - For exploded phone effect
export const parallaxLayer = (offset = 100) => ({
  hidden: { z: 0, rotateX: 0 },
  visible: {
    z: offset,
    rotateX: 5,
    transition: { duration: 0.8, ease: EASE.smooth },
  },
})

// Glow pulse - For buttons and accents
export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(0, 255, 255, 0.3)',
      '0 0 40px rgba(0, 255, 255, 0.5)',
      '0 0 20px rgba(0, 255, 255, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Design tokens
export const COLORS = {
  voidBlack: '#050505',
  wolfCyan: '#00FFFF',
  wolfCyanDim: 'rgba(0, 255, 255, 0.2)',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textTertiary: '#666666',
}

export default { EASE, STAGGER, COLORS }
