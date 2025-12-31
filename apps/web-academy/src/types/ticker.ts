// ═══════════════════════════════════════════════════════════
// STAT TICKER TYPE DEFINITIONS
// Based on: docs/ux-research/stat-ticker-ux-spec.md
// ═══════════════════════════════════════════════════════════

export type TickerVariant =
  | 'EPIC'         // Rank up, program complete
  | 'CELEBRATION'  // Workout complete, boss defeat
  | 'STANDARD'     // Quiz results, daily updates
  | 'SUBTLE'       // Home screen, card collection
  | 'PROFESSIONAL' // Parent mode (all contexts)
  | 'MICRO';       // Rep counters, mid-workout

export type UserMode = 'ATHLETE' | 'PARENT';

export type HapticIntensity = 'light' | 'medium' | 'heavy' | null;

export interface TickerConfig {
  // Motion
  duration: number;            // Total animation time (ms)
  easing: string;              // CSS easing function
  overshoot: number;           // Scale multiplier (1.0 = none)
  settleTime: number;          // Time to return to rest (ms)

  // Spring physics
  spring: {
    stiffness: number;
    damping: number;
    mass: number;
  };

  // Audio
  soundRoll: string | null;    // Sound during count
  soundStop: string | null;    // Sound at end
  soundVolume: number;         // 0-1

  // Haptic
  hapticPattern: string | null;
  hapticIntensity: HapticIntensity;

  // Visual
  particles: boolean;
  particleColor: string;
  glowIntensity: number;       // 0-1
  motionBlur: boolean;
  chromatic: boolean;          // RGB split effect
}

export interface StatTickerProps {
  value: number;
  previousValue?: number;
  variant: TickerVariant;
  label: string;
  suffix?: string;
  showDelta?: boolean;
  onComplete?: () => void;
  className?: string;
}

export interface ParticleConfig {
  count: number;
  color: string;
  size: [number, number];      // [min, max]
  velocity: [number, number];  // [min, max]
  angle: [number, number];     // degrees, [min, max]
  lifetime: number;            // ms
  gravity: number;
  fadeOut: boolean;
}
