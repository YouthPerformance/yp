/**
 * Critic Runner
 * =============
 *
 * Implements the Loop-Against-Critic pattern for content quality gates.
 * Content is reviewed by a critic (Opus) and revised until approved.
 *
 * @example
 * ```ts
 * const result = await runCriticLoop(content, {
 *   contentType: "response",
 *   approvalThreshold: 80,
 *   maxAttempts: 3,
 * });
 *
 * if (result.approved) {
 *   return result.finalContent;
 * }
 * ```
 */

import { reviewWithCritic } from "../ai/structured";
import { logger } from "../utils/logger";
import {
  type CriticConfig,
  type CriticIteration,
  type CriticLoopResult,
  type CriticReview,
  type RevisionRequest,
  DEFAULT_CRITIC_CONFIG,
  CRITIC_PROMPTS,
} from "./types";

// ─────────────────────────────────────────────────────────────
// CRITIC RUNNER
// ─────────────────────────────────────────────────────────────

/**
 * Run the critic loop on content
 *
 * @param content - Initial content to review
 * @param config - Critic configuration
 * @param reviseFunction - Function to revise content based on feedback
 * @returns Final result with approval status and history
 */
export async function runCriticLoop(
  content: string,
  config: Partial<CriticConfig> = {},
  reviseFunction?: (request: RevisionRequest) => Promise<string>,
): Promise<CriticLoopResult> {
  const fullConfig: CriticConfig = { ...DEFAULT_CRITIC_CONFIG, ...config };
  const history: CriticIteration[] = [];
  const startTime = Date.now();

  let currentContent = content;
  let approved = false;
  let finalScore = 0;

  logger.info("Starting critic loop", {
    contentType: fullConfig.contentType,
    approvalThreshold: fullConfig.approvalThreshold,
    maxAttempts: fullConfig.maxAttempts,
  });

  for (let attempt = 1; attempt <= fullConfig.maxAttempts; attempt++) {
    const iterationStart = Date.now();

    // Review content with critic
    const review = await reviewContent(currentContent, fullConfig);

    const iterationLatency = Date.now() - iterationStart;
    const passed = review.approved && review.score >= fullConfig.approvalThreshold;

    // Record iteration
    history.push({
      attempt,
      content: currentContent,
      review,
      passed,
      latencyMs: iterationLatency,
    });

    logger.info("Critic iteration complete", {
      attempt,
      score: review.score,
      passed,
      issues: review.issues.length,
      latencyMs: iterationLatency,
    });

    if (passed) {
      approved = true;
      finalScore = review.score;
      break;
    }

    // Check for critical issues
    if (fullConfig.failOnCritical) {
      const criticalIssues = review.issues.filter((i) => i.severity === "critical");
      if (criticalIssues.length > 0 && attempt === fullConfig.maxAttempts) {
        logger.warn("Critical issues found, cannot approve", {
          criticalIssues: criticalIssues.map((i) => i.description),
        });
        break;
      }
    }

    // Try to revise if we have more attempts and a revision function
    if (attempt < fullConfig.maxAttempts && reviseFunction) {
      currentContent = await reviseFunction({
        originalContent: currentContent,
        issues: review.issues,
        mustFix: review.mustFix,
        suggestions: review.suggestions,
        attemptNumber: attempt,
      });

      logger.debug("Content revised", {
        attempt,
        newContentLength: currentContent.length,
      });
    } else if (attempt < fullConfig.maxAttempts && !reviseFunction) {
      // No revision function, use simple enforcement
      currentContent = await simpleRevise(currentContent, review);
    }

    finalScore = review.score;
  }

  const totalLatencyMs = Date.now() - startTime;

  const result: CriticLoopResult = {
    approved,
    finalContent: currentContent,
    finalScore,
    iterations: history.length,
    history,
    totalLatencyMs,
    rejectionReason: approved
      ? undefined
      : `Failed to meet approval threshold (${fullConfig.approvalThreshold}) after ${history.length} attempts`,
  };

  logger.info("Critic loop complete", {
    approved,
    finalScore,
    iterations: history.length,
    totalLatencyMs,
  });

  return result;
}

// ─────────────────────────────────────────────────────────────
// REVIEW CONTENT
// ─────────────────────────────────────────────────────────────

/**
 * Review content using Opus critic
 */
async function reviewContent(
  content: string,
  config: CriticConfig,
): Promise<CriticReview> {
  const guidelines = buildGuidelines(config);

  return reviewWithCritic(content, config.contentType, guidelines);
}

/**
 * Build guidelines string for the critic
 */
function buildGuidelines(config: CriticConfig): string {
  const parts: string[] = [];

  // Add base prompt for content type
  const basePrompt =
    CRITIC_PROMPTS[config.contentType as keyof typeof CRITIC_PROMPTS];
  if (basePrompt) {
    parts.push(basePrompt);
  }

  // Add custom guidelines
  if (config.guidelines) {
    parts.push(`\nAdditional Guidelines:\n${config.guidelines}`);
  }

  // Add focus areas
  if (config.focusAreas && config.focusAreas.length > 0) {
    parts.push(`\nFocus especially on: ${config.focusAreas.join(", ")}`);
  }

  // Add approval threshold
  parts.push(`\nApproval threshold: ${config.approvalThreshold}/100`);

  return parts.join("\n");
}

// ─────────────────────────────────────────────────────────────
// SIMPLE REVISION
// ─────────────────────────────────────────────────────────────

/**
 * Simple revision using voice enforcement when no custom revision function provided
 */
async function simpleRevise(
  content: string,
  review: CriticReview,
): Promise<string> {
  // Import voice wrapper for basic enforcement
  const { voiceWrapper } = await import("../router/voice-wrapper");

  // Apply voice enforcement
  let revised = voiceWrapper.enforceVoice(content);

  // Handle specific issues
  for (const issue of review.issues) {
    if (issue.type === "voice" && issue.suggestion) {
      // Voice issues are handled by enforceVoice
      continue;
    }
    // Other issues would need LLM revision, which requires the custom function
  }

  return revised;
}

// ─────────────────────────────────────────────────────────────
// QUICK REVIEW (Single Pass)
// ─────────────────────────────────────────────────────────────

/**
 * Quick single-pass review without revision loop
 * Use for monitoring/logging when you don't need revision
 */
export async function quickReview(
  content: string,
  contentType: CriticConfig["contentType"] = "response",
): Promise<CriticReview> {
  return reviewWithCritic(content, contentType);
}

// ─────────────────────────────────────────────────────────────
// PARALLEL REVIEW
// ─────────────────────────────────────────────────────────────

/**
 * Review multiple pieces of content in parallel
 */
export async function reviewBatch(
  contents: string[],
  config: Partial<CriticConfig> = {},
): Promise<{
  reviews: CriticReview[];
  summary: {
    total: number;
    approved: number;
    averageScore: number;
  };
}> {
  const fullConfig: CriticConfig = { ...DEFAULT_CRITIC_CONFIG, ...config };

  const reviews = await Promise.all(
    contents.map((content) => reviewContent(content, fullConfig)),
  );

  const approved = reviews.filter((r) => r.approved).length;
  const averageScore =
    reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length;

  return {
    reviews,
    summary: {
      total: contents.length,
      approved,
      averageScore: Math.round(averageScore * 10) / 10,
    },
  };
}
