/**
 * Critic Framework Types
 * ======================
 *
 * Type definitions for the Loop-Against-Critic pattern.
 * Enables content quality gates with automatic revision.
 */

import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// CRITIC REVIEW SCHEMA
// ─────────────────────────────────────────────────────────────

/**
 * Issue found during critic review
 */
export const CriticIssueSchema = z.object({
  /** Type of issue */
  type: z.enum(["voice", "accuracy", "safety", "clarity", "tone", "length", "format"]),
  /** Description of the issue */
  description: z.string(),
  /** Severity level */
  severity: z.enum(["minor", "major", "critical"]),
  /** Optional fix suggestion */
  suggestion: z.string().optional(),
  /** Location in the content (line number or section) */
  location: z.string().optional(),
});

export type CriticIssue = z.infer<typeof CriticIssueSchema>;

/**
 * Full critic review result
 */
export const CriticReviewSchema = z.object({
  /** Whether content is approved */
  approved: z.boolean(),
  /** Overall quality score (0-100) */
  score: z.number().min(0).max(100),
  /** Issues found */
  issues: z.array(CriticIssueSchema),
  /** Must-fix items (blocks approval) */
  mustFix: z.array(z.string()),
  /** Optional suggestions (don't block approval) */
  suggestions: z.array(z.string()),
  /** Reviewer reasoning */
  reasoning: z.string().optional(),
});

export type CriticReview = z.infer<typeof CriticReviewSchema>;

// ─────────────────────────────────────────────────────────────
// CRITIC CONFIG
// ─────────────────────────────────────────────────────────────

/**
 * Configuration for critic review
 */
export interface CriticConfig {
  /** Content type being reviewed */
  contentType: "response" | "article" | "plan" | "email" | "social";
  /** Minimum score to approve (default: 80) */
  approvalThreshold: number;
  /** Maximum revision attempts (default: 3) */
  maxAttempts: number;
  /** Custom guidelines for the reviewer */
  guidelines?: string;
  /** Whether to fail on any critical issue */
  failOnCritical: boolean;
  /** Focus areas for review */
  focusAreas?: Array<"voice" | "accuracy" | "safety" | "clarity" | "tone">;
}

export const DEFAULT_CRITIC_CONFIG: CriticConfig = {
  contentType: "response",
  approvalThreshold: 80,
  maxAttempts: 3,
  failOnCritical: true,
  focusAreas: ["voice", "accuracy", "safety", "clarity", "tone"],
};

// ─────────────────────────────────────────────────────────────
// CRITIC LOOP STATE
// ─────────────────────────────────────────────────────────────

/**
 * State of a critic loop iteration
 */
export interface CriticIteration {
  /** Iteration number (1-based) */
  attempt: number;
  /** Content that was reviewed */
  content: string;
  /** Review result */
  review: CriticReview;
  /** Whether this iteration passed */
  passed: boolean;
  /** Time taken for this iteration (ms) */
  latencyMs: number;
}

/**
 * Final result of a critic loop
 */
export interface CriticLoopResult {
  /** Whether content was approved */
  approved: boolean;
  /** Final content (may be revised) */
  finalContent: string;
  /** Final score */
  finalScore: number;
  /** Number of iterations */
  iterations: number;
  /** All iteration details */
  history: CriticIteration[];
  /** Total time taken (ms) */
  totalLatencyMs: number;
  /** Reason if not approved */
  rejectionReason?: string;
}

// ─────────────────────────────────────────────────────────────
// REVISION REQUEST
// ─────────────────────────────────────────────────────────────

/**
 * Request for content revision based on critic feedback
 */
export interface RevisionRequest {
  /** Original content */
  originalContent: string;
  /** Issues to address */
  issues: CriticIssue[];
  /** Must-fix items */
  mustFix: string[];
  /** Suggestions (optional to address) */
  suggestions: string[];
  /** Attempt number */
  attemptNumber: number;
}

// ─────────────────────────────────────────────────────────────
// CRITIC PROMPTS
// ─────────────────────────────────────────────────────────────

/**
 * System prompt templates for critic review
 */
export const CRITIC_PROMPTS = {
  response: `You are a quality critic for Wolf Pack coaching responses.
Review the response for:
1. Voice compliance (no weak language, apologies, corporate speak)
2. Accuracy (factually correct, safe advice)
3. Safety (no dangerous recommendations)
4. Clarity (easy to understand, actionable)
5. Tone (confident, supportive, Wolf Pack energy)

Be strict. Only approve if quality is 80+.`,

  article: `You are an editorial critic for Wolf Pack content.
Review the article for:
1. Voice compliance (Wolf Pack brand voice)
2. Accuracy (factually correct, well-researched)
3. Clarity (logical structure, clear explanations)
4. Engagement (compelling, valuable to readers)
5. SEO (good headings, scannable format)

Be thorough. Content represents the brand.`,

  plan: `You are a technical reviewer for implementation plans.
Review the plan for:
1. Completeness (all steps covered)
2. Feasibility (realistic, achievable)
3. Clarity (unambiguous instructions)
4. Safety (no risky shortcuts)
5. Quality (follows best practices)

Plans must be production-ready.`,
};
