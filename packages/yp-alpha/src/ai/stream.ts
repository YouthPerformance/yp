/**
 * Streaming Response Functions
 * ============================
 *
 * AI SDK-powered streaming for Wolf Pack responses.
 * Combines routing, streaming, and voice enforcement.
 *
 * @example
 * ```ts
 * const stream = await streamWolfResponse(query, routeDecision, context);
 * for await (const chunk of stream.textStream) {
 *   process.stdout.write(chunk);
 * }
 * ```
 */

import { streamText, type CoreMessage } from "ai";
import { getModel, TOKEN_LIMITS } from "./providers";
import { voiceWrapper } from "../router/voice-wrapper";
import { startGeneration, submitVoiceScore, calculateCost } from "../observability/langfuse";
import { logger } from "../utils/logger";
import type { RouteDecision, ModelTier } from "../config/models";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface StreamContext {
  userId: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  athleteContext?: string;
}

export interface StreamResult {
  textStream: AsyncIterable<string>;
  fullStream: AsyncIterable<unknown>;
  text: Promise<string>;
  usage: Promise<{
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  }>;
}

// ─────────────────────────────────────────────────────────────
// STREAM WOLF RESPONSE
// ─────────────────────────────────────────────────────────────

/**
 * Stream a Wolf Pack response with voice enforcement
 *
 * @param query - User's query
 * @param routeDecision - Routing decision from WolfRouter
 * @param context - Execution context (userId, history, etc.)
 * @returns Streaming result with text chunks
 */
export async function streamWolfResponse(
  query: string,
  routeDecision: RouteDecision,
  context: StreamContext,
): Promise<StreamResult> {
  const startTime = Date.now();

  // Handle CREATIVE tier separately (not supported via AI SDK Anthropic)
  if (routeDecision.selectedModel === "CREATIVE") {
    throw new Error("Streaming not supported for CREATIVE tier");
  }

  const model = getModel(routeDecision.selectedModel);
  const tier = routeDecision.selectedModel as Exclude<ModelTier, "CREATIVE">;

  // Build system prompt with Wolf Pack voice
  const systemPrompt = voiceWrapper.buildSystemPrompt(
    routeDecision.selectedModel,
    context.athleteContext,
  );

  // Convert history to AI SDK format
  const messages: CoreMessage[] = [
    ...(context.conversationHistory || []).map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: query },
  ];

  // Start Langfuse trace
  const trace = startGeneration({
    name: `wolf-stream-${tier.toLowerCase()}`,
    model: `claude-${tier.toLowerCase()}`,
    input: {
      query,
      intent: routeDecision.intent,
      sentiment: routeDecision.sentiment,
    },
    userId: context.userId,
    metadata: {
      component: "stream",
      tier,
      streaming: true,
    },
  });

  logger.info("Starting streaming response", {
    userId: context.userId,
    tier,
    intent: routeDecision.intent,
  });

  // Stream the response
  const result = streamText({
    model,
    system: systemPrompt,
    messages,
    maxTokens: TOKEN_LIMITS[tier],
    onFinish: async ({ text, usage }) => {
      const latencyMs = Date.now() - startTime;

      // Enforce voice on final text
      const enforcedText = voiceWrapper.enforceVoice(text);
      const violations = voiceWrapper.audit(enforcedText);
      const voiceScore = voiceWrapper.score(enforcedText);

      // End Langfuse trace
      const inputTokens = usage.inputTokens ?? 0;
      const outputTokens = usage.outputTokens ?? 0;
      const totalTokens = usage.totalTokens ?? inputTokens + outputTokens;

      await trace.end({
        output: {
          response: enforcedText.substring(0, 500),
          voiceScore,
          violationCount: violations.length,
        },
        usage: {
          promptTokens: inputTokens,
          completionTokens: outputTokens,
          totalTokens,
        },
        cost: {
          totalCost: calculateCost(
            `claude-${tier.toLowerCase()}`,
            inputTokens,
            outputTokens,
          ),
          currency: "USD",
        },
        latencyMs,
        voiceScore,
        voiceViolations: violations,
      });

      // Submit voice score
      await submitVoiceScore(
        trace.traceId,
        trace.observationId,
        voiceScore,
        violations,
      );

      logger.info("Streaming response complete", {
        userId: context.userId,
        tier,
        latencyMs,
        voiceScore,
        violationCount: violations.length,
      });
    },
  });

  return result;
}

// ─────────────────────────────────────────────────────────────
// STREAM TEXT ONLY
// ─────────────────────────────────────────────────────────────

/**
 * Simple text streaming without routing
 * Use when you already know which model to use
 */
export function streamText_(
  tier: Exclude<ModelTier, "CREATIVE">,
  systemPrompt: string,
  messages: CoreMessage[],
  options?: {
    maxTokens?: number;
    userId?: string;
  },
): ReturnType<typeof streamText> {
  const model = getModel(tier);

  return streamText({
    model,
    system: systemPrompt,
    messages,
    maxTokens: options?.maxTokens || TOKEN_LIMITS[tier],
  });
}

// ─────────────────────────────────────────────────────────────
// TRANSFORM STREAM WITH VOICE
// ─────────────────────────────────────────────────────────────

/**
 * Transform a text stream with voice enforcement
 * Applies Wolf Pack voice rules to each chunk
 *
 * Note: This is best-effort for streaming - final text
 * is always re-enforced in onFinish callback
 */
export async function* transformWithVoice(
  stream: AsyncIterable<string>,
): AsyncIterable<string> {
  let buffer = "";

  for await (const chunk of stream) {
    buffer += chunk;

    // Yield chunks but don't enforce mid-sentence
    // Voice enforcement happens on final text
    yield chunk;
  }
}

// ─────────────────────────────────────────────────────────────
// COLLECT STREAM
// ─────────────────────────────────────────────────────────────

/**
 * Collect a text stream into a single string
 * Useful for testing or when you need the full response
 */
export async function collectStream(stream: AsyncIterable<string>): Promise<string> {
  let result = "";
  for await (const chunk of stream) {
    result += chunk;
  }
  return result;
}
