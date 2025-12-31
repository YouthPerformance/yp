// ═══════════════════════════════════════════════════════════
// THEME CONFIGURATION
// Based on: docs/ux-research/yp-design-system-v2.md
// Philosophy: Same brand, calmer energy for Parent mode
// ═══════════════════════════════════════════════════════════

import type { Theme, ThemeColors, ThemeMotion, ThemeFeatures } from '@/types/theme';

// ─────────────────────────────────────────────────────────────
// ATHLETE THEME (Kids 12-16)
// Pure black, Wolf Cyan, particles, heavy bass, elastic physics
// ─────────────────────────────────────────────────────────────

const athleteColors: ThemeColors = {
  bg: {
    primary: '#000000',      // Pure black, OLED-friendly
    secondary: '#0A0A0A',    // Cards
    elevated: '#141414',     // Modals
    subtle: '#1A1A1A',       // Hover states
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0A0',
    tertiary: '#666666',
    muted: '#444444',
  },
  accent: {
    primary: '#00F6E0',      // Wolf Cyan (full saturation)
    primaryHover: '#00DCCE',
    gold: '#FBBF24',         // Spotlight Gold
    goldHover: '#F59E0B',
  },
  border: {
    default: '#2A2A2A',
    subtle: '#1A1A1A',
    strong: '#3A3A3A',
    focus: '#00F6E0',
  },
  state: {
    success: '#10B981',
    warning: '#FBBF24',
    error: '#EF4444',
    info: '#3B82F6',
  },
};

const athleteMotion: ThemeMotion = {
  type: 'elastic',
  duration: {
    instant: 0,
    micro: 100,
    fast: 150,
    normal: 200,
    moderate: 300,
    slow: 400,
    achievement: 800,
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

const athleteFeatures: ThemeFeatures = {
  sounds: true,
  haptics: true,
  particles: true,
  glowEffects: true,
  chromaticAberration: true,
};

// ─────────────────────────────────────────────────────────────
// ATHLETE LIGHT THEME (Light Mode for Kids)
// White background, full saturation cyan, same energy as dark
// Same gamification, just easier on the eyes in daylight
// ─────────────────────────────────────────────────────────────

const athleteLightColors: ThemeColors = {
  bg: {
    primary: '#FFFDF9',      // Special warm white
    secondary: '#FFFFFF',    // Cards (pure white)
    elevated: '#FFFFFF',     // Modals
    subtle: '#F5F3EF',       // Hover states
  },
  text: {
    primary: '#0A0A0A',      // Near black (not pure)
    secondary: '#4A4A4A',    // Dark gray
    tertiary: '#7A7A7A',     // Medium gray
    muted: '#AAAAAA',        // Light gray
  },
  accent: {
    primary: '#00D4C4',      // Wolf Cyan (slightly darker for contrast)
    primaryHover: '#00BFB0',
    gold: '#F59E0B',         // Spotlight Gold (darker for light bg)
    goldHover: '#D97706',
  },
  border: {
    default: '#E8E4DC',      // Warm gray border
    subtle: '#F0EDE6',       // Very subtle
    strong: '#D0CAC0',       // Stronger border
    focus: '#00D4C4',        // Cyan focus
  },
  state: {
    success: '#059669',      // Darker green for light bg
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
  },
};

// Athlete Light uses same motion as dark (elastic, energetic)
const athleteLightMotion: ThemeMotion = athleteMotion;

// Athlete Light keeps the fun features
const athleteLightFeatures: ThemeFeatures = {
  sounds: true,
  haptics: true,
  particles: true,           // Still fun!
  glowEffects: false,        // Glows don't work well on white
  chromaticAberration: false,
};

// ─────────────────────────────────────────────────────────────
// PARENT THEME (Sponsor Report)
// Off-white, muted cyan, no effects, smooth motion
// Same brand DNA, just calmer
// ─────────────────────────────────────────────────────────────

const parentColors: ThemeColors = {
  bg: {
    primary: '#F6F7F9',      // Off-white (not pure white)
    secondary: '#FFFFFF',    // Cards (white)
    elevated: '#FFFFFF',     // Modals
    subtle: '#EBEDF0',       // Hover states
  },
  text: {
    primary: '#1A1A2E',      // Deep navy (not black)
    secondary: '#64748B',    // Slate
    tertiary: '#94A3B8',
    muted: '#CBD5E1',
  },
  accent: {
    primary: '#00BFB0',      // Wolf Cyan (de-saturated, darker)
    primaryHover: '#009F8E',
    gold: '#F59E0B',         // Warmer gold
    goldHover: '#D97706',
  },
  border: {
    default: '#E2E8F0',
    subtle: '#F1F5F9',
    strong: '#CBD5E1',
    focus: '#00BFB0',
  },
  state: {
    success: '#16A34A',      // Slightly different for light bg
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#2563EB',
  },
};

const parentMotion: ThemeMotion = {
  type: 'smooth',
  duration: {
    instant: 0,
    micro: 50,
    fast: 100,
    normal: 150,
    moderate: 200,
    slow: 300,
    achievement: 400,        // Much faster, no drama
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',  // Material standard
    out: 'cubic-bezier(0.0, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.4, 0, 0.2, 1)',   // No bounce in parent
    bounce: 'cubic-bezier(0.4, 0, 0.2, 1)',   // No bounce in parent
  },
};

const parentFeatures: ThemeFeatures = {
  sounds: false,
  haptics: false,            // Or very subtle
  particles: false,
  glowEffects: false,
  chromaticAberration: false,
};

// ─────────────────────────────────────────────────────────────
// EXPORTED THEMES
// ─────────────────────────────────────────────────────────────

export const themes: Record<'athlete' | 'athlete-light' | 'parent', Theme> = {
  athlete: {
    mode: 'athlete',
    colors: athleteColors,
    motion: athleteMotion,
    features: athleteFeatures,
  },
  'athlete-light': {
    mode: 'athlete-light',
    colors: athleteLightColors,
    motion: athleteLightMotion,
    features: athleteLightFeatures,
  },
  parent: {
    mode: 'parent',
    colors: parentColors,
    motion: parentMotion,
    features: parentFeatures,
  },
};

// ─────────────────────────────────────────────────────────────
// CSS VARIABLE GENERATOR
// ─────────────────────────────────────────────────────────────

export function generateCSSVariables(theme: Theme): Record<string, string> {
  return {
    // Backgrounds
    '--bg-primary': theme.colors.bg.primary,
    '--bg-secondary': theme.colors.bg.secondary,
    '--bg-elevated': theme.colors.bg.elevated,
    '--bg-subtle': theme.colors.bg.subtle,

    // Text
    '--text-primary': theme.colors.text.primary,
    '--text-secondary': theme.colors.text.secondary,
    '--text-tertiary': theme.colors.text.tertiary,
    '--text-muted': theme.colors.text.muted,

    // Accent
    '--accent-primary': theme.colors.accent.primary,
    '--accent-primary-hover': theme.colors.accent.primaryHover,
    '--accent-gold': theme.colors.accent.gold,
    '--accent-gold-hover': theme.colors.accent.goldHover,

    // Borders
    '--border-default': theme.colors.border.default,
    '--border-subtle': theme.colors.border.subtle,
    '--border-strong': theme.colors.border.strong,
    '--border-focus': theme.colors.border.focus,

    // States
    '--state-success': theme.colors.state.success,
    '--state-warning': theme.colors.state.warning,
    '--state-error': theme.colors.state.error,
    '--state-info': theme.colors.state.info,

    // Motion
    '--motion-instant': `${theme.motion.duration.instant}ms`,
    '--motion-micro': `${theme.motion.duration.micro}ms`,
    '--motion-fast': `${theme.motion.duration.fast}ms`,
    '--motion-normal': `${theme.motion.duration.normal}ms`,
    '--motion-moderate': `${theme.motion.duration.moderate}ms`,
    '--motion-slow': `${theme.motion.duration.slow}ms`,
    '--motion-achievement': `${theme.motion.duration.achievement}ms`,

    // Easing
    '--ease-default': theme.motion.easing.default,
    '--ease-out': theme.motion.easing.out,
    '--ease-in': theme.motion.easing.in,
    '--ease-spring': theme.motion.easing.spring,
    '--ease-bounce': theme.motion.easing.bounce,
  };
}
