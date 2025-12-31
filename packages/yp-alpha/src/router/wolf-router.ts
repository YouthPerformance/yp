/**
 * Wolf Router - Air Traffic Control for $100M Valuation
 * ======================================================
 *
 * The Gatekeeper that sits before every request.
 * Analyzes "Vibe" (Sentiment) + "Mission" (Intent) in <100ms.
 *
 * Three Paths:
 * - PATH A: THE GRUNT (Haiku 4.5) → Execution, data, logistics
 * - PATH B: THE WOLF (Sonnet 4.5) → Coaching, emotional support
 * - PATH C: THE ARTIST (Gemini) → Visual generation
 */

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  MODEL_CONFIG,
  ModelTier,
  RouteDecision,
  COMPLEXITY_THRESHOLDS,
  SENTIMENT_ESCALATION,
} from "../config/models.js";
import { logger } from "../utils/logger.js";

/**
 * Classification Schema - What the router outputs
 */
export const RouteSchema = z.object({
  intent: z.enum(["EXECUTION", "COACHING", "CREATION", "PLANNING"]),
  sentiment: z.enum(["NEUTRAL", "FRUSTRATED", "HYPE", "SAD", "ANXIOUS"]),
  complexityScore: z.number().min(1).max(10),
  reasoning: z.string(),
});

export type RouteClassification = z.infer<typeof RouteSchema>;

/**
 * User Context for routing decisions
 */
export interface UserContext {
  userId: string;
  recentSentiment?: string[];      // Last 3 messages sentiment
  currentStreak?: number;          // Training streak
  durabilityScore?: number;        // Health metric 0-100
  lastInteractionType?: string;    // What they did last
  equipmentOwned?: string[];       // Gear they have
  injuryStatus?: string;           // Active injuries
}

/**
 * The Gatekeeper System Prompt
 * Haiku 4.5 uses this to classify in <100ms
 */
const GATEKEEPER_SYSTEM = `You are the YP Gatekeeper. Your job is to route athlete requests to the right "Wolf."

ROUTING RULES:

1. EXECUTION (The Grunt - Haiku):
   - Data lookups: "Show my stats", "What's my vertical?"
   - Simple requests: "Give me a 15-min workout"
   - Product questions: "How much is NeoBall?"
   - Scheduling: "Set reminder for tomorrow"
   - Complexity: 1-6

2. COACHING (The Wolf - Sonnet):
   - Emotional content: "I feel like quitting", "I'm frustrated"
   - Complex analysis: "Why am I not improving?"
   - Troubleshooting: "My jump peaked and now it's declining"
   - Injury concerns: "My knee has been hurting"
   - Complexity: 7-9
   - ANY request from a FRUSTRATED, SAD, or ANXIOUS user

3. CREATION (The Artist - Gemini):
   - Visual requests: "Make me a poster", "Show graph"
   - Image generation: "Create motivation image"

4. PLANNING (The Architect - Opus):
   - Season planning: "Plan my next 3 months"
   - Periodization: "Design my offseason"
   - Complexity: 10

SENTIMENT DETECTION:
- NEUTRAL: Standard request, no emotion
- HYPE: Excitement, celebration ("I DUNKED!", "PR!")
- FRUSTRATED: Disappointment, stuck ("not working", "waste of time")
- SAD: Dejection, defeat ("I'm done", "giving up")
- ANXIOUS: Worry, fear ("scared", "nervous about game")

CRITICAL: If sentiment is FRUSTRATED, SAD, or ANXIOUS, ALWAYS route to COACHING regardless of complexity.`;

/**
 * Wolf Router Class
 */
export class WolfRouter {
  private anthropic: Anthropic;
  private routeHistory: Map<string, RouteDecision[]> = new Map();
  private failureCount: Map<string, number> = new Map();

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Route a request to the appropriate model
   * Target: <100ms classification
   */
  async route(
    userQuery: string,
    context: UserContext
  ): Promise<RouteDecision> {
    const startTime = Date.now();

    try {
      // Use Haiku 4.5 for ultra-fast classification
      const response = await this.anthropic.messages.create({
        model: MODEL_CONFIG.FAST,
        max_tokens: 300,
        system: GATEKEEPER_SYSTEM,
        messages: [
          {
            role: "user",
            content: this.buildClassificationPrompt(userQuery, context),
          },
        ],
        tools: [
          {
            name: "classify_request",
            description: "Classify the athlete's request for routing",
            input_schema: {
              type: "object",
              properties: {
                intent: {
                  type: "string",
                  enum: ["EXECUTION", "COACHING", "CREATION", "PLANNING"],
                },
                sentiment: {
                  type: "string",
                  enum: ["NEUTRAL", "FRUSTRATED", "HYPE", "SAD", "ANXIOUS"],
                },
                complexityScore: {
                  type: "number",
                  minimum: 1,
                  maximum: 10,
                },
                reasoning: {
                  type: "string",
                },
              },
              required: ["intent", "sentiment", "complexityScore", "reasoning"],
            },
          },
        ],
        tool_choice: { type: "tool", name: "classify_request" },
      });

      // Extract classification from tool use
      const toolUse = response.content.find((block) => block.type === "tool_use");
      if (!toolUse || toolUse.type !== "tool_use") {
        throw new Error("No classification returned");
      }

      const classification = RouteSchema.parse(toolUse.input);
      const routeDecision = this.buildDecision(classification, startTime);

      // Log for analytics
      logger.info("Wolf Router Decision", {
        userId: context.userId,
        query: userQuery.substring(0, 50),
        decision: routeDecision,
        latencyMs: Date.now() - startTime,
      });

      // Store in history for pattern detection
      this.addToHistory(context.userId, routeDecision);

      return routeDecision;
    } catch (error) {
      logger.error("Wolf Router Error", { error, context });
      return this.fallbackDecision(userQuery, context, startTime);
    }
  }

  /**
   * Build the classification prompt with context
   */
  private buildClassificationPrompt(
    query: string,
    context: UserContext
  ): string {
    const contextParts: string[] = [];

    if (context.durabilityScore !== undefined) {
      contextParts.push(`Health: ${context.durabilityScore}/100`);
    }
    if (context.currentStreak) {
      contextParts.push(`Streak: ${context.currentStreak} days`);
    }
    if (context.injuryStatus) {
      contextParts.push(`Injury: ${context.injuryStatus}`);
    }
    if (context.recentSentiment?.length) {
      contextParts.push(`Recent mood: ${context.recentSentiment.join(", ")}`);
    }

    const contextStr =
      contextParts.length > 0 ? `\nContext: ${contextParts.join(" | ")}` : "";

    return `Athlete Query: "${query}"${contextStr}

Classify this request. Consider both the explicit ask AND the emotional state.`;
  }

  /**
   * Build final route decision from classification
   */
  private buildDecision(
    classification: RouteClassification,
    startTime: number
  ): RouteDecision {
    let selectedModel: ModelTier;

    // Sentiment escalation check
    const needsEscalation = SENTIMENT_ESCALATION[classification.sentiment];

    if (classification.intent === "CREATION") {
      selectedModel = "CREATIVE";
    } else if (classification.intent === "PLANNING") {
      selectedModel = "DEEP";
    } else if (
      needsEscalation ||
      classification.complexityScore >= COMPLEXITY_THRESHOLDS.HAIKU_MAX + 1
    ) {
      selectedModel = "SMART";
    } else {
      selectedModel = "FAST";
    }

    // Override: If complexity is 10, use Opus
    if (classification.complexityScore >= COMPLEXITY_THRESHOLDS.OPUS_MIN) {
      selectedModel = "DEEP";
    }

    return {
      ...classification,
      selectedModel,
      estimatedLatency: this.getLatencyEstimate(selectedModel),
    };
  }

  /**
   * Fallback decision if router fails
   * Conservative: Default to Sonnet for safety
   */
  private fallbackDecision(
    query: string,
    context: UserContext,
    startTime: number
  ): RouteDecision {
    // Track failures for this user
    const failures = (this.failureCount.get(context.userId) || 0) + 1;
    this.failureCount.set(context.userId, failures);

    logger.warn("Router fallback triggered", {
      userId: context.userId,
      failureCount: failures,
    });

    // Conservative fallback to Sonnet
    return {
      intent: "COACHING",
      sentiment: "NEUTRAL",
      complexityScore: 7,
      reasoning: "Router fallback - defaulting to Sonnet for safety",
      selectedModel: "SMART",
      estimatedLatency: 2000,
    };
  }

  /**
   * Get latency estimate for model
   */
  private getLatencyEstimate(model: ModelTier): number {
    const estimates: Record<ModelTier, number> = {
      FAST: 500,
      SMART: 2000,
      DEEP: 8000,
      CREATIVE: 3000,
    };
    return estimates[model];
  }

  /**
   * Store route in history for pattern detection
   */
  private addToHistory(userId: string, decision: RouteDecision): void {
    const history = this.routeHistory.get(userId) || [];
    history.push(decision);

    // Keep last 20 decisions
    if (history.length > 20) {
      history.shift();
    }

    this.routeHistory.set(userId, history);
  }

  /**
   * Check if user is in a "frustrated loop"
   * If 3+ FRUSTRATED sentiments in a row, proactively intervene
   */
  isFrustratedLoop(userId: string): boolean {
    const history = this.routeHistory.get(userId) || [];
    const recent = history.slice(-3);

    return (
      recent.length >= 3 &&
      recent.every((d) => d.sentiment === "FRUSTRATED")
    );
  }

  /**
   * Get user's dominant sentiment pattern
   */
  getDominantSentiment(userId: string): string {
    const history = this.routeHistory.get(userId) || [];
    if (history.length === 0) return "NEUTRAL";

    const counts: Record<string, number> = {};
    for (const decision of history) {
      counts[decision.sentiment] = (counts[decision.sentiment] || 0) + 1;
    }

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * Auto-escalation check
   * If Haiku failed twice on similar queries, escalate to Sonnet
   */
  shouldAutoEscalate(userId: string, currentDecision: RouteDecision): boolean {
    const failures = this.failureCount.get(userId) || 0;
    return failures >= 2 && currentDecision.selectedModel === "FAST";
  }

  /**
   * Reset failure count after successful interaction
   */
  resetFailures(userId: string): void {
    this.failureCount.set(userId, 0);
  }

  /**
   * Get routing analytics for a user
   */
  getAnalytics(userId: string): {
    totalRoutes: number;
    modelDistribution: Record<string, number>;
    avgComplexity: number;
    dominantSentiment: string;
  } {
    const history = this.routeHistory.get(userId) || [];

    const modelCounts: Record<string, number> = {};
    let totalComplexity = 0;

    for (const decision of history) {
      modelCounts[decision.selectedModel] =
        (modelCounts[decision.selectedModel] || 0) + 1;
      totalComplexity += decision.complexityScore;
    }

    return {
      totalRoutes: history.length,
      modelDistribution: modelCounts,
      avgComplexity: history.length > 0 ? totalComplexity / history.length : 0,
      dominantSentiment: this.getDominantSentiment(userId),
    };
  }
}

// Singleton instance
export const wolfRouter = new WolfRouter();
