// ═══════════════════════════════════════════════════════════
// TICKER CONFIGURATION
// Based on: docs/ux-research/stat-ticker-ux-spec.md
// Philosophy: Gym Foley, Not Casino Beeps
// ═══════════════════════════════════════════════════════════

import type { ParticleConfig, TickerConfig, TickerVariant } from "@/types/ticker";

// ─────────────────────────────────────────────────────────────
// TICKER VARIANT CONFIGURATIONS
// ─────────────────────────────────────────────────────────────

export const TICKER_CONFIGS: Record<TickerVariant, TickerConfig> = {
  // Rank up, program complete - Maximum drama
  EPIC: {
    duration: 3000,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)", // Expo out
    overshoot: 1.15,
    settleTime: 400,
    spring: {
      stiffness: 180,
      damping: 12,
      mass: 1.2,
    },
    soundRoll: "chain_wind.mp3",
    soundStop: "plate_drop_heavy.mp3",
    soundVolume: 0.9,
    hapticPattern: "success_pattern",
    hapticIntensity: "heavy",
    particles: true,
    particleColor: "#FBBF24", // Gold
    glowIntensity: 0.8,
    motionBlur: true,
    chromatic: true,
  },

  // Workout complete, boss defeat - Strong but not max
  CELEBRATION: {
    duration: 2500,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    overshoot: 1.12,
    settleTime: 300,
    spring: {
      stiffness: 200,
      damping: 15,
      mass: 1.0,
    },
    soundRoll: "ratchet_soft.mp3",
    soundStop: "plate_drop_medium.mp3",
    soundVolume: 0.8,
    hapticPattern: "impact_heavy",
    hapticIntensity: "heavy",
    particles: true,
    particleColor: "#00F6E0", // Cyan
    glowIntensity: 0.6,
    motionBlur: true,
    chromatic: false,
  },

  // Quiz results, daily updates - Present but polite
  STANDARD: {
    duration: 1500,
    easing: "cubic-bezier(0.33, 1, 0.68, 1)",
    overshoot: 1.08,
    settleTime: 200,
    spring: {
      stiffness: 300,
      damping: 25,
      mass: 0.8,
    },
    soundRoll: null,
    soundStop: "locker_latch.mp3",
    soundVolume: 0.6,
    hapticPattern: "impact_medium",
    hapticIntensity: "medium",
    particles: false,
    particleColor: "#00F6E0",
    glowIntensity: 0.3,
    motionBlur: false,
    chromatic: false,
  },

  // Home screen, card collection - Barely there
  SUBTLE: {
    duration: 800,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    overshoot: 1.04,
    settleTime: 150,
    spring: {
      stiffness: 350,
      damping: 30,
      mass: 0.6,
    },
    soundRoll: null,
    soundStop: "soft_click.mp3",
    soundVolume: 0.3,
    hapticPattern: "impact_light",
    hapticIntensity: "light",
    particles: false,
    particleColor: "#00F6E0",
    glowIntensity: 0.1,
    motionBlur: false,
    chromatic: false,
  },

  // Parent mode - No effects, smooth and efficient
  PROFESSIONAL: {
    duration: 800,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)", // Material standard
    overshoot: 1.0, // No bounce
    settleTime: 0,
    spring: {
      stiffness: 400,
      damping: 40,
      mass: 0.5,
    },
    soundRoll: null,
    soundStop: null,
    soundVolume: 0,
    hapticPattern: null,
    hapticIntensity: null,
    particles: false,
    particleColor: "transparent",
    glowIntensity: 0,
    motionBlur: false,
    chromatic: false,
  },

  // Rep counters, mid-workout - Instant, subconscious
  MICRO: {
    duration: 200,
    easing: "ease-out",
    overshoot: 1.0,
    settleTime: 0,
    spring: {
      stiffness: 500,
      damping: 50,
      mass: 0.3,
    },
    soundRoll: null,
    soundStop: null,
    soundVolume: 0,
    hapticPattern: "selection",
    hapticIntensity: "light",
    particles: false,
    particleColor: "transparent",
    glowIntensity: 0,
    motionBlur: false,
    chromatic: false,
  },
};

// ─────────────────────────────────────────────────────────────
// PARTICLE PRESETS
// ─────────────────────────────────────────────────────────────

export const PARTICLE_PRESETS: Record<"celebration" | "epic", ParticleConfig> = {
  celebration: {
    count: 12,
    color: "#00F6E0",
    size: [4, 8],
    velocity: [100, 200],
    angle: [0, 360], // Radial burst
    lifetime: 800,
    gravity: 50,
    fadeOut: true,
  },

  epic: {
    count: 24,
    color: "#FBBF24",
    size: [6, 12],
    velocity: [150, 300],
    angle: [0, 360],
    lifetime: 1200,
    gravity: 30,
    fadeOut: true,
  },
};

// ─────────────────────────────────────────────────────────────
// INTENSITY BUDGET
// ─────────────────────────────────────────────────────────────

export const INTENSITY_BUDGET = {
  session: 100, // Total points per session
  micro: 0, // Unlimited
  minor: 5, // Soft acknowledgment
  major: 25, // Workout complete, quiz pass
  epic: 50, // Rank up, boss defeat
};

// ─────────────────────────────────────────────────────────────
// COOLDOWN RULES
// ─────────────────────────────────────────────────────────────

export const COOLDOWN_MS = {
  afterMajor: 2000, // 2 seconds after Major/Epic events
  afterMinor: 400, // 400ms after Minor events
};

// ─────────────────────────────────────────────────────────────
// COMBO SOUND PITCHES (Quiz Feature)
// Musical pitch ladder: C → D → E → F → G
// ─────────────────────────────────────────────────────────────

export const COMBO_PITCHES: Record<number, number> = {
  1: 1.0, // C (base)
  2: 1.122, // D (major 2nd)
  3: 1.26, // E (major 3rd)
  4: 1.335, // F (perfect 4th)
  5: 1.498, // G (perfect 5th)
};
