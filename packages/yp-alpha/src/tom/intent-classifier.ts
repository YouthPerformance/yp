/**
 * Tom Intent Classifier
 * =====================
 *
 * Classifies user intents and routes to specialized tools.
 * Handles product visualization, trend search, policy drafts, etc.
 */

import { z } from "zod";
import type { TomUserId, TomIntent, TomIntentType } from "./types";

// ─────────────────────────────────────────────────────────────
// INTENT SCHEMA
// ─────────────────────────────────────────────────────────────

export const TomIntentSchema = z.object({
  intent: z.enum([
    "GENERAL_CHAT",
    "TASK_CAPTURE",
    "PRODUCT_VISUALIZATION",
    "TREND_SEARCH",
    "RESEARCH_DIGEST",
    "POLICY_DRAFT",
    "EXECUTIVE_SUMMARY",
  ]),
  confidence: z.number().min(0).max(1),
  extractedDetails: z.record(z.string(), z.any()).optional(),
});

// ─────────────────────────────────────────────────────────────
// PATTERN MATCHING
// ─────────────────────────────────────────────────────────────

const INTENT_PATTERNS: Record<TomIntentType, RegExp[]> = {
  PRODUCT_VISUALIZATION: [
    /sketch|visualize|draw|design|prototype|concept|picture|image/i,
    /what would .* look like/i,
    /can you show me/i,
  ],
  TREND_SEARCH: [
    /trending|viral|what's hot|pulse|what should i cover/i,
    /what('s| is) happening in (nba|basketball|sports)/i,
    /content ideas?|topic ideas?/i,
  ],
  RESEARCH_DIGEST: [
    /paper|study|research|summarize this|pdf|journal/i,
    /what does the science say/i,
    /explain this (paper|study|research)/i,
  ],
  POLICY_DRAFT: [
    /policy|response|customer|draft|rewrite/i,
    /how should (i|we) respond/i,
    /write a (response|reply|email)/i,
  ],
  EXECUTIVE_SUMMARY: [
    /radar|summary|what's happening|team update/i,
    /what('s| is) the status|give me the rundown/i,
    /how('s| is) the team doing/i,
  ],
  TASK_CAPTURE: [
    /remind me|add to .*(backlog|list|todo)/i,
    /i need to|don't forget/i,
    /^todo:|^task:/i,
  ],
  GENERAL_CHAT: [], // Default fallback
};

// ─────────────────────────────────────────────────────────────
// USER-TOOL MAPPING
// ─────────────────────────────────────────────────────────────

const USER_TOOLS: Record<TomUserId, TomIntentType[]> = {
  mike: ["EXECUTIVE_SUMMARY", "TASK_CAPTURE", "GENERAL_CHAT"],
  james: ["PRODUCT_VISUALIZATION", "RESEARCH_DIGEST", "TASK_CAPTURE", "GENERAL_CHAT"],
  adam: ["TREND_SEARCH", "TASK_CAPTURE", "GENERAL_CHAT"],
  annie: ["POLICY_DRAFT", "TASK_CAPTURE", "GENERAL_CHAT"],
};

// ─────────────────────────────────────────────────────────────
// CLASSIFICATION
// ─────────────────────────────────────────────────────────────

/**
 * Classify intent using pattern matching
 */
export function classifyIntentFast(message: string): TomIntent {
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(message)) {
        return {
          intent: intent as TomIntentType,
          confidence: 0.8,
        };
      }
    }
  }

  return {
    intent: "GENERAL_CHAT",
    confidence: 0.5,
  };
}

/**
 * Classify intent using LLM for uncertain cases
 */
export async function classifyIntentSmart(
  message: string,
  voiceProfileId: string
): Promise<TomIntent> {
  // Try fast pattern matching first
  const fastResult = classifyIntentFast(message);
  if (fastResult.confidence >= 0.7) {
    return fastResult;
  }

  // Fall back to LLM for uncertain cases
  try {
    const { generateStructured } = await import("../ai/structured");

    return generateStructured(
      "FAST",
      TomIntentSchema,
      `Classify the user's intent. User's voice profile: ${voiceProfileId}

Available intents:
- PRODUCT_VISUALIZATION: User wants to see a product concept/sketch
- TREND_SEARCH: User wants to know what's trending
- RESEARCH_DIGEST: User wants a paper/study summarized
- POLICY_DRAFT: User wants help drafting a customer response
- EXECUTIVE_SUMMARY: User wants a team/company status update
- TASK_CAPTURE: User wants to add something to their todo/backlog
- GENERAL_CHAT: General conversation, questions, etc.`,
      message
    );
  } catch {
    return fastResult;
  }
}

// ─────────────────────────────────────────────────────────────
// ROUTING
// ─────────────────────────────────────────────────────────────

export interface RouteResult {
  handled: boolean;
  tool?: string;
  result?: unknown;
}

/**
 * Route a Tom request to the appropriate tool
 */
export async function routeTomRequest(
  userId: TomUserId,
  message: string
): Promise<RouteResult | null> {
  // Get user's allowed tools
  const allowedTools = USER_TOOLS[userId];

  // Classify intent
  const intent = await classifyIntentSmart(message, `${userId.toUpperCase()}_COS`);

  // Check if user has access to this tool
  if (!allowedTools.includes(intent.intent)) {
    return null;
  }

  // Only route to special tools if confidence is high enough
  if (intent.confidence < 0.6) {
    return null;
  }

  // Route to appropriate handler
  switch (intent.intent) {
    case "PRODUCT_VISUALIZATION":
      if (userId === "james") {
        try {
          const { handleProductVisualizationRequest } = await import(
            "./tools/product-viz"
          );
          const result = await handleProductVisualizationRequest(userId, message);
          return { handled: true, tool: "PRODUCT_VISUALIZATION", result };
        } catch (error) {
          console.error("Product visualization error:", error);
          return null;
        }
      }
      break;

    case "TREND_SEARCH":
      if (userId === "adam") {
        try {
          const { handleTrendSearchRequest } = await import("./tools/trend-search");
          const result = await handleTrendSearchRequest(userId, message);
          return { handled: true, tool: "TREND_SEARCH", result };
        } catch (error) {
          console.error("Trend search error:", error);
          return null;
        }
      }
      break;

    case "POLICY_DRAFT":
      if (userId === "annie") {
        try {
          const { handlePolicyDraftRequest } = await import("./tools/policy-writer");
          const result = await handlePolicyDraftRequest(userId, message);
          return { handled: true, tool: "POLICY_DRAFT", result };
        } catch (error) {
          console.error("Policy draft error:", error);
          return null;
        }
      }
      break;

    case "EXECUTIVE_SUMMARY":
      if (userId === "mike") {
        // TODO: Implement executive summary tool
        return null;
      }
      break;
  }

  return null;
}
