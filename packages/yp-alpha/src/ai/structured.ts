/**
 * Structured Output Generation
 * ============================
 *
 * AI SDK-powered structured output with Zod schemas.
 * Type-safe responses for routing, classification, and extraction.
 *
 * @example
 * ```ts
 * const result = await generateRouteDecision(query);
 * console.log(result.intent); // "COACHING"
 * console.log(result.complexityScore); // 7
 * ```
 */

import { generateObject } from "ai";
import { z } from "zod";
import { getModel, TOKEN_LIMITS } from "./providers";
import { startGeneration, calculateCost } from "../observability/langfuse";
import { logger } from "../utils/logger";
import type { ModelTier } from "../config/models";

// ─────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────

/**
 * Route decision schema for Wolf Router
 */
export const RouteSchema = z.object({
  intent: z.enum(["EXECUTION", "COACHING", "CREATION", "PLANNING"]),
  sentiment: z.enum(["NEUTRAL", "FRUSTRATED", "HYPE", "SAD", "ANXIOUS"]),
  complexityScore: z.number().min(1).max(10),
  reasoning: z.string().optional(),
});

export type RouteDecisionStructured = z.infer<typeof RouteSchema>;

/**
 * Memory extraction schema
 */
export const MemoryExtractionSchema = z.object({
  memories: z.array(
    z.object({
      type: z.enum(["pain", "progress", "goal", "emotion", "insight"]),
      content: z.string(),
      confidence: z.number().min(0).max(1),
      bodyPart: z.string().optional(),
      severity: z.number().min(1).max(10).optional(),
    }),
  ),
  shouldEscalate: z.boolean(),
  escalationReason: z.string().optional(),
});

export type MemoryExtraction = z.infer<typeof MemoryExtractionSchema>;

/**
 * Content classification schema
 */
export const ContentClassificationSchema = z.object({
  category: z.enum([
    "training",
    "nutrition",
    "recovery",
    "mindset",
    "injury",
    "general",
  ]),
  topics: z.array(z.string()),
  actionable: z.boolean(),
  urgency: z.enum(["low", "medium", "high"]),
});

export type ContentClassification = z.infer<typeof ContentClassificationSchema>;

/**
 * Readiness assessment schema
 */
export const ReadinessSchema = z.object({
  overallScore: z.number().min(1).max(10),
  factors: z.object({
    sleep: z.number().min(1).max(10),
    soreness: z.number().min(1).max(10),
    energy: z.number().min(1).max(10),
    motivation: z.number().min(1).max(10),
    stress: z.number().min(1).max(10),
  }),
  recommendation: z.enum(["full_send", "moderate", "light", "rest"]),
  reasoning: z.string(),
});

export type ReadinessAssessment = z.infer<typeof ReadinessSchema>;

/**
 * Critic review schema for Loop-Against-Critic pattern
 */
export const CriticReviewSchema = z.object({
  approved: z.boolean(),
  score: z.number().min(0).max(100),
  issues: z.array(
    z.object({
      type: z.enum(["voice", "accuracy", "safety", "clarity", "tone"]),
      description: z.string(),
      severity: z.enum(["minor", "major", "critical"]),
      suggestion: z.string().optional(),
    }),
  ),
  mustFix: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export type CriticReview = z.infer<typeof CriticReviewSchema>;

// ─────────────────────────────────────────────────────────────
// GENERATION FUNCTIONS
// ─────────────────────────────────────────────────────────────

interface GenerateStructuredOptions {
  userId?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Generate structured output with a Zod schema
 */
export async function generateStructured<T extends z.ZodType>(
  tier: Exclude<ModelTier, "CREATIVE">,
  schema: T,
  systemPrompt: string,
  userPrompt: string,
  options?: GenerateStructuredOptions,
): Promise<z.infer<T>> {
  const startTime = Date.now();
  const model = getModel(tier);

  // Start Langfuse trace
  const trace = startGeneration({
    name: `structured-${tier.toLowerCase()}`,
    model: `claude-${tier.toLowerCase()}`,
    input: { userPrompt: userPrompt.substring(0, 500) },
    userId: options?.userId,
    metadata: {
      component: "structured",
      tier,
      schemaName: schema.description || "unknown",
    },
  });

  logger.info("Generating structured output", {
    tier,
    userId: options?.userId,
  });

  const result = await generateObject({
    model,
    schema,
    system: systemPrompt,
    prompt: userPrompt,
    maxTokens: options?.maxTokens || TOKEN_LIMITS[tier],
    temperature: options?.temperature ?? 0.3,
  });

  const latencyMs = Date.now() - startTime;

  // End Langfuse trace
  const inputTokens = result.usage.inputTokens ?? 0;
  const outputTokens = result.usage.outputTokens ?? 0;
  const totalTokens = result.usage.totalTokens ?? inputTokens + outputTokens;

  await trace.end({
    output: result.object,
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
  });

  logger.info("Structured output complete", {
    tier,
    latencyMs,
    inputTokens,
    outputTokens,
  });

  return result.object;
}

// ─────────────────────────────────────────────────────────────
// CONVENIENCE FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Generate route decision using FAST tier
 */
export async function generateRouteDecision(
  query: string,
  context?: string,
  options?: GenerateStructuredOptions,
): Promise<RouteDecisionStructured> {
  const systemPrompt = `You are a routing classifier for a sports coaching AI.
Analyze the user's query and determine:
1. Intent: What the user wants (EXECUTION=action items, COACHING=guidance, CREATION=content, PLANNING=strategy)
2. Sentiment: User's emotional state
3. Complexity: 1-10 scale of how complex this request is

Be precise and fast. This classification drives model selection.`;

  const userPrompt = context
    ? `Context: ${context}\n\nQuery: ${query}`
    : `Query: ${query}`;

  return generateStructured("FAST", RouteSchema, systemPrompt, userPrompt, options);
}

/**
 * Extract memories from conversation using SMART tier
 */
export async function extractMemories(
  conversation: string,
  athleteContext?: string,
  options?: GenerateStructuredOptions,
): Promise<MemoryExtraction> {
  const systemPrompt = `You are a memory extraction system for athlete coaching.
Extract important memories from the conversation:
- Pain points (injuries, soreness, limitations)
- Progress markers (PRs, improvements, milestones)
- Goals (stated objectives, targets)
- Emotions (how they're feeling about training)
- Insights (realizations, learnings)

Flag if this needs escalation to a human coach.`;

  const userPrompt = athleteContext
    ? `Athlete Context: ${athleteContext}\n\nConversation:\n${conversation}`
    : `Conversation:\n${conversation}`;

  return generateStructured("SMART", MemoryExtractionSchema, systemPrompt, userPrompt, options);
}

/**
 * Classify content using FAST tier
 */
export async function classifyContent(
  content: string,
  options?: GenerateStructuredOptions,
): Promise<ContentClassification> {
  const systemPrompt = `You are a content classifier for sports coaching.
Classify the content into the appropriate category and extract topics.
Determine if it's actionable and its urgency level.`;

  return generateStructured("FAST", ContentClassificationSchema, systemPrompt, content, options);
}

/**
 * Assess athlete readiness using SMART tier
 */
export async function assessReadiness(
  athleteInput: string,
  recentHistory?: string,
  options?: GenerateStructuredOptions,
): Promise<ReadinessAssessment> {
  const systemPrompt = `You are a readiness assessment system for athletes.
Based on the athlete's input, assess their readiness to train.
Consider sleep, soreness, energy, motivation, and stress.
Provide a clear recommendation: full_send, moderate, light, or rest.`;

  const userPrompt = recentHistory
    ? `Recent History: ${recentHistory}\n\nToday's Check-in: ${athleteInput}`
    : `Today's Check-in: ${athleteInput}`;

  return generateStructured("SMART", ReadinessSchema, systemPrompt, userPrompt, options);
}

/**
 * Critic review for Loop-Against-Critic pattern using DEEP tier
 */
export async function reviewWithCritic(
  content: string,
  contentType: "response" | "article" | "plan",
  guidelines?: string,
  options?: GenerateStructuredOptions,
): Promise<CriticReview> {
  const systemPrompt = `You are a quality critic for Wolf Pack coaching content.
Review the ${contentType} for:
1. Voice compliance (no weak language, apologies, corporate speak)
2. Accuracy (factually correct, safe advice)
3. Safety (no dangerous recommendations)
4. Clarity (easy to understand, actionable)
5. Tone (confident, supportive, Wolf Pack energy)

Be strict. Only approve if quality is 80+.
${guidelines ? `\nAdditional Guidelines:\n${guidelines}` : ""}`;

  return generateStructured("DEEP", CriticReviewSchema, systemPrompt, content, {
    ...options,
    temperature: 0.2, // Lower temperature for consistent reviews
  });
}
