/**
 * AI SDK Provider Configuration
 * =============================
 *
 * Configures AI SDK providers for Wolf Pack.
 * Bridges between Wolf Pack model tiers and AI SDK providers.
 *
 * Providers:
 * - Anthropic: Claude models (Haiku, Sonnet, Opus)
 * - OpenAI: Embeddings (text-embedding-3-small)
 */

import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { ModelTier } from "../config/models";

// ─────────────────────────────────────────────────────────────
// PROVIDER INSTANCES
// ─────────────────────────────────────────────────────────────

/**
 * Anthropic provider for Claude models
 */
export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * OpenAI provider for embeddings
 */
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─────────────────────────────────────────────────────────────
// MODEL MAPPING
// ─────────────────────────────────────────────────────────────

// Pre-create model instances to lock in types
const _haikuModel = anthropic("claude-haiku-4-5-20251015");
const _sonnetModel = anthropic("claude-sonnet-4-5-20250929");
const _opusModel = anthropic("claude-opus-4-5-20251124");
const _embeddingModel = openai.embedding("text-embedding-3-small");

/** Language model type (AI SDK Anthropic) */
export type WolfModel = ReturnType<typeof anthropic>;

/** Embedding model type (AI SDK OpenAI) */
export type WolfEmbeddingModel = typeof _embeddingModel;

/**
 * Map Wolf Pack model tiers to AI SDK model instances
 */
export const MODEL_MAP = {
  FAST: _haikuModel,
  SMART: _sonnetModel,
  DEEP: _opusModel,
  CREATIVE: null,
} as const satisfies Record<ModelTier, WolfModel | null>;

/**
 * Get AI SDK model for Wolf Pack tier
 * @throws Error if CREATIVE tier is requested (uses Gemini, not supported)
 */
export function getModel(tier: ModelTier): typeof _haikuModel {
  if (tier === "CREATIVE") {
    throw new Error("CREATIVE tier uses Gemini, not supported via AI SDK Anthropic");
  }
  return MODEL_MAP[tier]!;
}

// ─────────────────────────────────────────────────────────────
// EMBEDDING MODEL
// ─────────────────────────────────────────────────────────────

/**
 * OpenAI embedding model for vector search
 */
export const embeddingModel = _embeddingModel;

// ─────────────────────────────────────────────────────────────
// MODEL CONFIG
// ─────────────────────────────────────────────────────────────

/**
 * Token limits per model tier
 */
export const TOKEN_LIMITS = {
  FAST: 1024,
  SMART: 2048,
  DEEP: 4096,
  CREATIVE: 256,
} as const;

/**
 * Latency targets (p95) per model tier
 */
export const LATENCY_TARGETS = {
  FAST: 500, // ms
  SMART: 2000,
  DEEP: 8000,
  CREATIVE: 3000,
} as const;

/**
 * Cost per million tokens (as of Jan 2026)
 */
export const COST_PER_MILLION = {
  FAST: { input: 1.0, output: 5.0 },
  SMART: { input: 3.0, output: 15.0 },
  DEEP: { input: 15.0, output: 75.0 },
  CREATIVE: { input: 0, output: 0 }, // External
} as const;
