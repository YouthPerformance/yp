/**
 * Streaming Model Executor
 * ========================
 *
 * Streaming variant of ModelExecutor using AI SDK.
 * Use for real-time responses in chat interfaces.
 *
 * @example
 * ```ts
 * const executor = new StreamingModelExecutor();
 * const stream = await executor.executeStream(query, routeDecision, context);
 * for await (const chunk of stream.textStream) {
 *   process.stdout.write(chunk);
 * }
 * ```
 */

import { streamWolfResponse, type StreamContext, type StreamResult } from "../ai/stream";
import { voiceWrapper } from "./voice-wrapper";
import { logger } from "../utils/logger";
import type { RouteDecision, ModelTier } from "../config/models";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface StreamExecutionContext extends StreamContext {
  memoryContext?: string;
  redFlags?: Array<{ category: string; value: string; score: number }>;
}

export interface StreamExecutionResult extends StreamResult {
  routeDecision: RouteDecision;
  tier: ModelTier;
}

// ─────────────────────────────────────────────────────────────
// STREAMING EXECUTOR
// ─────────────────────────────────────────────────────────────

/**
 * Streaming model executor using AI SDK
 *
 * Differences from ModelExecutor:
 * - Returns streaming response immediately
 * - Voice enforcement happens in onFinish callback
 * - Uses AI SDK streamText instead of Anthropic SDK directly
 */
export class StreamingModelExecutor {
  /**
   * Execute a streaming response
   *
   * @param query - User's query
   * @param routeDecision - Routing decision from WolfRouter
   * @param context - Execution context with memory and history
   * @returns Streaming result with text chunks
   */
  async executeStream(
    query: string,
    routeDecision: RouteDecision,
    context: StreamExecutionContext,
  ): Promise<StreamExecutionResult> {
    const tier = routeDecision.selectedModel;

    // CREATIVE tier not supported for streaming via AI SDK Anthropic
    if (tier === "CREATIVE") {
      throw new Error(
        "Streaming not supported for CREATIVE tier. Use non-streaming executor.",
      );
    }

    logger.info("Starting streaming execution", {
      userId: context.userId,
      tier,
      intent: routeDecision.intent,
      sentiment: routeDecision.sentiment,
      hasRedFlags: (context.redFlags?.length || 0) > 0,
    });

    // Build athlete context from memory
    const athleteContext = this.buildAthleteContext(context);

    // Execute streaming response
    const streamResult = await streamWolfResponse(query, routeDecision, {
      userId: context.userId,
      conversationHistory: context.conversationHistory,
      athleteContext,
    });

    return {
      ...streamResult,
      routeDecision,
      tier,
    };
  }

  /**
   * Build athlete context string from memory context and red flags
   */
  private buildAthleteContext(context: StreamExecutionContext): string {
    const parts: string[] = [];

    // Add memory context
    if (context.memoryContext) {
      parts.push(`Background:\n${context.memoryContext}`);
    }

    // Add red flags with emphasis
    if (context.redFlags && context.redFlags.length > 0) {
      const flagsText = context.redFlags
        .map((f) => `⚠️ ${f.category}: ${f.value} (score: ${f.score}/10)`)
        .join("\n");
      parts.push(`Active Concerns (address with care):\n${flagsText}`);
    }

    return parts.join("\n\n");
  }

  /**
   * Execute and collect full response
   * Useful for testing or when you need the complete text
   */
  async executeAndCollect(
    query: string,
    routeDecision: RouteDecision,
    context: StreamExecutionContext,
  ): Promise<{
    text: string;
    routeDecision: RouteDecision;
    tier: ModelTier;
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    const streamResult = await this.executeStream(query, routeDecision, context);

    // Collect full response
    const text = await streamResult.text;
    const usage = await streamResult.usage;

    // Enforce voice on collected text
    const enforcedText = voiceWrapper.enforceVoice(text);

    return {
      text: enforcedText,
      routeDecision: streamResult.routeDecision,
      tier: streamResult.tier,
      usage,
    };
  }
}

// ─────────────────────────────────────────────────────────────
// SINGLETON EXPORT
// ─────────────────────────────────────────────────────────────

/**
 * Default streaming executor instance
 */
export const streamingExecutor = new StreamingModelExecutor();
