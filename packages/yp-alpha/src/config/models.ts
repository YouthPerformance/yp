/**
 * Model Configuration - The $100M Architecture
 * =============================================
 *
 * Cost Blending Strategy:
 * - 90% of requests → Haiku ($1/M tokens) = THE GRUNT
 * - 10% of requests → Sonnet ($3/M tokens) = THE WOLF
 * - Complex planning → Opus ($15/M tokens) = THE ARCHITECT
 *
 * Result: ~70% cost reduction vs all-Sonnet
 */

export const MODEL_CONFIG = {
  // The Daily Driver - Fast execution, data lookup, logistics
  FAST: "claude-haiku-4-5-20251015",

  // The Empathetic Coach - Emotional support, complex troubleshooting
  SMART: "claude-sonnet-4-5-20250929",

  // The Periodization Architect - Long-term planning, deep analysis
  DEEP: "claude-opus-4-5-20251124",

  // The Artist - Visual generation (Gemini/external)
  CREATIVE: "gemini-2.0-flash-exp",
} as const;

export type ModelTier = keyof typeof MODEL_CONFIG;

/**
 * Token Pricing (per 1M tokens) - December 2025
 */
export const MODEL_PRICING = {
  [MODEL_CONFIG.FAST]: { input: 0.25, output: 1.25 },
  [MODEL_CONFIG.SMART]: { input: 3.0, output: 15.0 },
  [MODEL_CONFIG.DEEP]: { input: 15.0, output: 75.0 },
} as const;

/**
 * Latency Targets (p95)
 */
export const LATENCY_TARGETS = {
  ROUTER: 100, // Router classification: <100ms
  FAST: 500, // Haiku response: <500ms
  SMART: 2000, // Sonnet response: <2s
  DEEP: 10000, // Opus response: <10s (batch jobs)
} as const;

/**
 * Model Selection Criteria
 */
export interface RouteDecision {
  intent: "EXECUTION" | "COACHING" | "CREATION" | "PLANNING";
  sentiment: "NEUTRAL" | "FRUSTRATED" | "HYPE" | "SAD" | "ANXIOUS";
  complexityScore: number; // 1-10 (7+ triggers escalation)
  reasoning: string;
  selectedModel: ModelTier;
  estimatedLatency: number;
}

/**
 * Intent → Model Mapping
 */
export const INTENT_MODEL_MAP: Record<string, ModelTier> = {
  // EXECUTION intents → Haiku
  lookup_data: "FAST",
  get_workout: "FAST",
  check_progress: "FAST",
  product_info: "FAST",
  schedule_session: "FAST",

  // COACHING intents → Sonnet
  emotional_support: "SMART",
  troubleshoot_plateau: "SMART",
  analyze_patterns: "SMART",
  injury_assessment: "SMART",
  motivation_crisis: "SMART",

  // PLANNING intents → Opus
  season_planning: "DEEP",
  periodization: "DEEP",
  multi_month_analysis: "DEEP",

  // CREATION intents → External
  generate_visual: "CREATIVE",
  create_poster: "CREATIVE",
  chart_progress: "CREATIVE",
};

/**
 * Complexity Thresholds
 */
export const COMPLEXITY_THRESHOLDS = {
  HAIKU_MAX: 6, // Haiku handles complexity 1-6
  SONNET_MAX: 9, // Sonnet handles complexity 7-9
  OPUS_MIN: 10, // Opus for complexity 10 (rare)
} as const;

/**
 * Sentiment Escalation Rules
 * If user is emotional, escalate even simple requests
 */
export const SENTIMENT_ESCALATION: Record<string, boolean> = {
  NEUTRAL: false, // No escalation
  HYPE: false, // Positive emotion, Haiku can celebrate
  FRUSTRATED: true, // Escalate to Sonnet
  SAD: true, // Escalate to Sonnet
  ANXIOUS: true, // Escalate to Sonnet
};
