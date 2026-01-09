/**
 * Model Executor - Run the right model with Wolf Pack voice
 * ==========================================================
 *
 * This is the execution layer after routing.
 * Takes the route decision and runs the appropriate model.
 */

import Anthropic from "@anthropic-ai/sdk";
import { MODEL_CONFIG, type ModelTier, type RouteDecision } from "../config/models";
import { logger } from "../utils/logger";
import { voiceWrapper } from "./voice-wrapper";

export interface ExecutionResult {
  response: string;
  model: string;
  latencyMs: number;
  tokenUsage: {
    input: number;
    output: number;
  };
  voiceScore: number;
  violations: string[];
}

export interface ExecutionContext {
  userId: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  athleteContext?: string;
  toolResults?: string;
}

/**
 * Model Executor Class
 */
export class ModelExecutor {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Execute the routed request
   */
  async execute(
    query: string,
    routeDecision: RouteDecision,
    context: ExecutionContext,
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    // Handle external models (CREATIVE)
    if (routeDecision.selectedModel === "CREATIVE") {
      return this.executeCreative(query, context, startTime);
    }

    // Build system prompt with Wolf Pack voice
    const systemPrompt = voiceWrapper.buildSystemPrompt(
      routeDecision.selectedModel,
      context.athleteContext,
    );

    // Build messages
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...(context.conversationHistory || []),
      { role: "user" as const, content: query },
    ];

    try {
      const response = await this.anthropic.messages.create({
        model: MODEL_CONFIG[routeDecision.selectedModel],
        max_tokens: this.getMaxTokens(routeDecision.selectedModel),
        system: systemPrompt,
        messages,
      });

      // Extract text response
      const textBlock = response.content.find((block) => block.type === "text");
      const rawResponse = textBlock?.type === "text" ? textBlock.text : "";

      // Enforce Wolf Pack voice on output
      const enforcedResponse = voiceWrapper.enforceVoice(rawResponse);

      // Audit for violations
      const violations = voiceWrapper.audit(enforcedResponse);
      const voiceScore = voiceWrapper.score(enforcedResponse);

      // Log if violations found
      if (violations.length > 0) {
        logger.warn("Voice violations detected", {
          userId: context.userId,
          model: routeDecision.selectedModel,
          violations,
          voiceScore,
        });
      }

      return {
        response: enforcedResponse,
        model: MODEL_CONFIG[routeDecision.selectedModel],
        latencyMs: Date.now() - startTime,
        tokenUsage: {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens,
        },
        voiceScore,
        violations,
      };
    } catch (error) {
      logger.error("Model execution failed", {
        error,
        model: routeDecision.selectedModel,
        userId: context.userId,
      });
      throw error;
    }
  }

  /**
   * Execute Haiku for fast execution tasks
   */
  async executeHaiku(query: string, context: ExecutionContext): Promise<ExecutionResult> {
    return this.execute(
      query,
      {
        intent: "EXECUTION",
        sentiment: "NEUTRAL",
        complexityScore: 3,
        reasoning: "Direct Haiku execution",
        selectedModel: "FAST",
        estimatedLatency: 500,
      },
      context,
    );
  }

  /**
   * Execute Sonnet for coaching tasks
   */
  async executeSonnet(query: string, context: ExecutionContext): Promise<ExecutionResult> {
    return this.execute(
      query,
      {
        intent: "COACHING",
        sentiment: "NEUTRAL",
        complexityScore: 7,
        reasoning: "Direct Sonnet execution",
        selectedModel: "SMART",
        estimatedLatency: 2000,
      },
      context,
    );
  }

  /**
   * Execute Opus for deep planning tasks
   */
  async executeOpus(query: string, context: ExecutionContext): Promise<ExecutionResult> {
    return this.execute(
      query,
      {
        intent: "PLANNING",
        sentiment: "NEUTRAL",
        complexityScore: 10,
        reasoning: "Direct Opus execution",
        selectedModel: "DEEP",
        estimatedLatency: 8000,
      },
      context,
    );
  }

  /**
   * Execute creative model (external - Gemini)
   */
  private async executeCreative(
    query: string,
    context: ExecutionContext,
    startTime: number,
  ): Promise<ExecutionResult> {
    // Placeholder for Gemini integration
    // In production, this would call the Gemini API
    logger.info("Creative execution requested", {
      userId: context.userId,
      query: query.substring(0, 50),
    });

    return {
      response: `[CREATIVE MODE] Visual generation queued: "${query}". Estimated delivery: 30 seconds.`,
      model: MODEL_CONFIG.CREATIVE,
      latencyMs: Date.now() - startTime,
      tokenUsage: { input: 0, output: 0 },
      voiceScore: 100,
      violations: [],
    };
  }

  /**
   * Get max tokens based on model tier
   */
  private getMaxTokens(model: ModelTier): number {
    const tokenLimits: Record<ModelTier, number> = {
      FAST: 1024, // Haiku: Keep responses tight
      SMART: 2048, // Sonnet: Allow more depth
      DEEP: 4096, // Opus: Full analysis
      CREATIVE: 256, // Creative: Just commands
    };
    return tokenLimits[model];
  }

  /**
   * Retry with escalation if execution fails
   */
  async executeWithRetry(
    query: string,
    routeDecision: RouteDecision,
    context: ExecutionContext,
    maxRetries: number = 2,
  ): Promise<ExecutionResult> {
    let lastError: Error | null = null;
    const currentDecision = { ...routeDecision };

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.execute(query, currentDecision, context);
      } catch (error) {
        lastError = error as Error;

        logger.warn("Execution attempt failed", {
          attempt: attempt + 1,
          model: currentDecision.selectedModel,
          error: lastError.message,
        });

        // Escalate to next tier on failure
        if (currentDecision.selectedModel === "FAST") {
          currentDecision.selectedModel = "SMART";
        } else if (currentDecision.selectedModel === "SMART") {
          currentDecision.selectedModel = "DEEP";
        } else {
          break; // No more escalation possible
        }
      }
    }

    throw lastError || new Error("Execution failed after all retries");
  }
}

// Singleton instance
export const modelExecutor = new ModelExecutor();
