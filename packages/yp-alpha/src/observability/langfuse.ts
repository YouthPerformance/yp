/**
 * Langfuse Observability Layer
 * ============================
 *
 * LLM-specific traces, cost tracking, and voice compliance scoring.
 * Wraps Wolf Router + Model Executor with full observability.
 *
 * Features:
 * - Automatic trace creation for all LLM calls
 * - Token usage and cost tracking
 * - Voice compliance scoring (0-100)
 * - Latency metrics per model tier
 */

import { LangfuseClient } from "@langfuse/client";
import {
  observe as langfuseObserve,
  startObservation,
  updateActiveObservation,
  updateActiveTrace,
} from "@langfuse/tracing";
import { logger } from "../utils/logger";

// ─────────────────────────────────────────────────────────────
// SINGLETON CLIENT
// ─────────────────────────────────────────────────────────────

let langfuseClient: LangfuseClient | null = null;

/**
 * Get or create Langfuse client singleton
 */
export function getLangfuse(): LangfuseClient {
  if (!langfuseClient) {
    const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
    const secretKey = process.env.LANGFUSE_SECRET_KEY;

    if (!publicKey || !secretKey) {
      logger.warn("Langfuse credentials not configured, tracing disabled");
      // Return a no-op client for development
      return {
        score: { create: async () => ({}) },
        trace: { create: async () => ({}) },
      } as unknown as LangfuseClient;
    }

    langfuseClient = new LangfuseClient({
      publicKey,
      secretKey,
      baseUrl: process.env.LANGFUSE_BASE_URL || "https://cloud.langfuse.com",
    });
  }

  return langfuseClient;
}

// ─────────────────────────────────────────────────────────────
// OBSERVE WRAPPER
// ─────────────────────────────────────────────────────────────

export interface ObserveOptions {
  name: string;
  userId?: string;
  sessionId?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  asType?: "span" | "generation" | "retriever" | "evaluator";
}

/**
 * Observe wrapper - wraps any async function with Langfuse tracing
 *
 * @example
 * ```ts
 * const result = await observe(async () => {
 *   const response = await anthropic.messages.create({...});
 *   return response;
 * }, { name: "wolf-execute", asType: "generation" });
 * ```
 */
export async function observe<T>(
  fn: () => Promise<T>,
  options: ObserveOptions,
): Promise<T> {
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;

  // If Langfuse not configured, run function without tracing
  if (!publicKey) {
    return fn();
  }

  return langfuseObserve(fn, {
    name: options.name,
    asType: options.asType || "span",
    captureInput: true,
    captureOutput: true,
  });
}

// ─────────────────────────────────────────────────────────────
// GENERATION TRACING
// ─────────────────────────────────────────────────────────────

export interface GenerationTrace {
  traceId: string;
  observationId: string;
}

export interface GenerationStartOptions {
  name: string;
  model: string;
  input: unknown;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface GenerationEndOptions {
  output: unknown;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost?: {
    totalCost: number;
    currency?: string;
  };
  latencyMs?: number;
  voiceScore?: number;
  voiceViolations?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Start a generation observation
 * Use for LLM calls that need detailed tracking
 */
export function startGeneration(options: GenerationStartOptions) {
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;

  if (!publicKey) {
    return {
      traceId: "noop",
      observationId: "noop",
      end: async (_opts: GenerationEndOptions) => {},
    };
  }

  const observation = startObservation(options.name, {
    input: options.input,
    model: options.model,
    metadata: {
      ...options.metadata,
      userId: options.userId,
      sessionId: options.sessionId,
    },
  }, { asType: "generation" });

  return {
    traceId: observation.traceId,
    observationId: observation.id,
    end: async (endOpts: GenerationEndOptions) => {
      observation.update({
        output: endOpts.output,
        usageDetails: endOpts.usage ? {
          promptTokens: endOpts.usage.promptTokens,
          completionTokens: endOpts.usage.completionTokens,
          totalTokens: endOpts.usage.totalTokens,
        } : undefined,
        costDetails: endOpts.cost ? {
          totalCost: endOpts.cost.totalCost,
          currency: endOpts.cost.currency || "USD",
        } : undefined,
        metadata: {
          ...endOpts.metadata,
          latencyMs: endOpts.latencyMs,
          voiceScore: endOpts.voiceScore,
          voiceViolations: endOpts.voiceViolations,
        },
      });
      observation.end();
    },
  };
}

// ─────────────────────────────────────────────────────────────
// SCORING
// ─────────────────────────────────────────────────────────────

export interface ScoreOptions {
  traceId: string;
  observationId?: string;
  name: string;
  value: number;
  comment?: string;
  dataType?: "NUMERIC" | "CATEGORICAL" | "BOOLEAN";
  stringValue?: string;
}

/**
 * Submit a score to Langfuse
 *
 * @example
 * ```ts
 * await submitScore({
 *   traceId: "trace-123",
 *   name: "voice-compliance",
 *   value: 0.85,
 *   comment: "Minor violation: used 'maybe'",
 * });
 * ```
 */
export async function submitScore(options: ScoreOptions): Promise<void> {
  const langfuse = getLangfuse();

  try {
    await langfuse.score.create({
      traceId: options.traceId,
      observationId: options.observationId,
      name: options.name,
      value: options.value,
      comment: options.comment,
      dataType: options.dataType,
      stringValue: options.stringValue,
    });
  } catch (error) {
    logger.warn("Failed to submit Langfuse score", { error, options });
  }
}

/**
 * Submit voice compliance score
 * Normalized to 0-1 for Langfuse (internally 0-100)
 */
export async function submitVoiceScore(
  traceId: string,
  observationId: string,
  voiceScore: number,
  violations: string[],
): Promise<void> {
  await submitScore({
    traceId,
    observationId,
    name: "voice-compliance",
    value: voiceScore / 100, // Normalize to 0-1
    comment: violations.length > 0
      ? `Violations: ${violations.join(", ")}`
      : "No violations",
  });
}

// ─────────────────────────────────────────────────────────────
// MODEL COST TRACKING
// ─────────────────────────────────────────────────────────────

/**
 * Calculate estimated cost for Anthropic models
 * Prices per million tokens as of Jan 2026
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const pricing: Record<string, { input: number; output: number }> = {
    // Haiku 4.5
    "claude-haiku-4-5-20251015": { input: 1.0, output: 5.0 },
    // Sonnet 4.5
    "claude-sonnet-4-5-20250929": { input: 3.0, output: 15.0 },
    // Opus 4.5
    "claude-opus-4-5-20251124": { input: 15.0, output: 75.0 },
  };

  const modelPricing = pricing[model] || { input: 3.0, output: 15.0 };

  const inputCost = (inputTokens / 1_000_000) * modelPricing.input;
  const outputCost = (outputTokens / 1_000_000) * modelPricing.output;

  return inputCost + outputCost;
}

// ─────────────────────────────────────────────────────────────
// TRACE HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Update the active trace with additional context
 * Use within an observed function
 */
export function updateTrace(updates: {
  name?: string;
  userId?: string;
  sessionId?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  public?: boolean;
}): void {
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  if (!publicKey) return;

  updateActiveTrace(updates);
}

/**
 * Update the active observation with results
 * Use within an observed function
 */
export function updateObservation(
  updates: {
    output?: unknown;
    metadata?: Record<string, unknown>;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    cost?: {
      totalCost: number;
      currency?: string;
    };
  },
  options?: { asType?: "span" | "generation" },
): void {
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  if (!publicKey) return;

  updateActiveObservation({
    output: updates.output,
    metadata: updates.metadata,
    usageDetails: updates.usage,
    costDetails: updates.cost,
  }, options);
}

// ─────────────────────────────────────────────────────────────
// WOLF PACK SPECIFIC HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Create a Wolf Pack execution trace
 * Combines routing + execution + voice into single trace
 */
export function startWolfTrace(options: {
  userId: string;
  query: string;
  sessionId?: string;
}) {
  return startGeneration({
    name: "wolf-pack-execution",
    model: "wolf-router",
    input: { query: options.query },
    userId: options.userId,
    sessionId: options.sessionId,
    metadata: {
      component: "wolf-pack",
      version: "2.0",
    },
  });
}

/**
 * Record a routing decision span
 */
export async function traceRoute<T>(
  fn: () => Promise<T>,
  options: { userId: string; query: string },
): Promise<T> {
  return observe(fn, {
    name: "wolf-router",
    userId: options.userId,
    asType: "span",
    metadata: {
      component: "router",
      query: options.query.substring(0, 100),
    },
  });
}

/**
 * Record a model execution generation
 */
export async function traceExecution<T>(
  fn: () => Promise<T>,
  options: {
    userId: string;
    model: string;
    intent: string;
    sentiment: string;
  },
): Promise<T> {
  return observe(fn, {
    name: `wolf-execute-${options.model.toLowerCase()}`,
    userId: options.userId,
    asType: "generation",
    metadata: {
      component: "executor",
      model: options.model,
      intent: options.intent,
      sentiment: options.sentiment,
    },
  });
}

// Re-export for convenience
export { langfuseObserve as observeRaw };
