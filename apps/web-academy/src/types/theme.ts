// ═══════════════════════════════════════════════════════════
// THEME TYPE DEFINITIONS
// Dual-Mode System: Athlete (Kids) vs Parent (Sponsor Report)
// ═══════════════════════════════════════════════════════════

export type ThemeMode = "athlete" | "athlete-light" | "parent";

export interface ThemeColors {
  bg: {
    primary: string;
    secondary: string;
    elevated: string;
    subtle: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
  };
  accent: {
    primary: string;
    primaryHover: string;
    gold: string;
    goldHover: string;
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
    focus: string;
  };
  state: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface ThemeMotion {
  type: "elastic" | "smooth";
  duration: {
    instant: number;
    micro: number;
    fast: number;
    normal: number;
    moderate: number;
    slow: number;
    achievement: number;
  };
  easing: {
    default: string;
    out: string;
    in: string;
    spring: string;
    bounce: string;
  };
}

export interface ThemeFeatures {
  sounds: boolean;
  haptics: boolean;
  particles: boolean;
  glowEffects: boolean;
  chromaticAberration: boolean;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  motion: ThemeMotion;
  features: ThemeFeatures;
}
