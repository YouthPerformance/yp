// ═══════════════════════════════════════════════════════════
// FEATURE FLAGS - AI-Native Phased Rollouts
// Toggle features without redeploying
// ═══════════════════════════════════════════════════════════

import { get } from "@vercel/edge-config";

// ─────────────────────────────────────────────────────────────
// FLAG DEFINITIONS
// ─────────────────────────────────────────────────────────────

export interface FeatureFlags {
  // Onboarding
  voiceSorting: boolean; // Voice-based wolf sorting (vs legacy form)
  voiceSortingRollout: number; // Percentage of users (0-100)
  realtimeVoice: boolean; // OpenAI Realtime API (vs modular pipeline)
  realtimeVoiceRollout: number; // Percentage for A/B testing (0-100)

  // Training
  interactiveLearning: boolean; // ILM card-based modules
  videoWorkouts: boolean; // Video workout player

  // Economy
  crystalRewards: boolean; // In-app currency
  shopEnabled: boolean; // Merch shop

  // AI Features
  askWolf: boolean; // AI coach chat
  adaptiveTraining: boolean; // AI-adjusted difficulty
}

// Default values (used when Edge Config unavailable)
const DEFAULT_FLAGS: FeatureFlags = {
  voiceSorting: true,
  voiceSortingRollout: 100,
  realtimeVoice: true, // Enabled for testing
  realtimeVoiceRollout: 10, // 10% of users get Realtime API
  interactiveLearning: true,
  videoWorkouts: true,
  crystalRewards: true,
  shopEnabled: true,
  askWolf: true,
  adaptiveTraining: false,
};

// ─────────────────────────────────────────────────────────────
// FLAG FETCHING
// ─────────────────────────────────────────────────────────────

/**
 * Get all feature flags from Edge Config
 * Falls back to defaults if Edge Config unavailable
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    // Edge Config returns the entire config object
    const flags = await get<Partial<FeatureFlags>>("featureFlags");

    if (!flags) {
      console.log("[Flags] Edge Config empty, using defaults");
      return DEFAULT_FLAGS;
    }

    // Merge with defaults to ensure all flags exist
    return { ...DEFAULT_FLAGS, ...flags };
  } catch (error) {
    console.warn("[Flags] Edge Config unavailable, using defaults:", error);
    return DEFAULT_FLAGS;
  }
}

/**
 * Get a single feature flag
 */
export async function getFlag<K extends keyof FeatureFlags>(key: K): Promise<FeatureFlags[K]> {
  const flags = await getFeatureFlags();
  return flags[key];
}

/**
 * Check if user is in rollout percentage
 * Uses deterministic hash based on userId for consistent experience
 */
export function isInRollout(userId: string, percentage: number): boolean {
  if (percentage >= 100) return true;
  if (percentage <= 0) return false;

  // Simple hash function for deterministic bucketing
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Normalize to 0-100
  const bucket = Math.abs(hash) % 100;
  return bucket < percentage;
}

/**
 * Check if voice sorting is enabled for a specific user
 */
export async function isVoiceSortingEnabled(userId?: string): Promise<boolean> {
  const flags = await getFeatureFlags();

  if (!flags.voiceSorting) return false;
  if (!userId) return flags.voiceSortingRollout >= 100;

  return isInRollout(userId, flags.voiceSortingRollout);
}

/**
 * Check if OpenAI Realtime Voice API is enabled for a specific user
 * This is for A/B testing Realtime API vs modular pipeline
 */
export async function isRealtimeVoiceEnabled(userId?: string): Promise<boolean> {
  const flags = await getFeatureFlags();

  if (!flags.realtimeVoice) return false;
  if (!userId) return flags.realtimeVoiceRollout >= 100;

  return isInRollout(userId, flags.realtimeVoiceRollout);
}

/**
 * Get voice implementation for a user
 * Returns 'realtime' or 'modular' based on feature flags
 */
export async function getVoiceImplementation(userId?: string): Promise<"realtime" | "modular"> {
  const isRealtime = await isRealtimeVoiceEnabled(userId);
  return isRealtime ? "realtime" : "modular";
}
