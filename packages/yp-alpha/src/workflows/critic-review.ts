/**
 * Critic Review Workflow
 * ======================
 *
 * Durable workflow for Loop-Against-Critic content review.
 * Runs content through Opus critic with automatic revision.
 *
 * Benefits of using Inngest:
 * - Step memoization (don't repeat expensive LLM calls on retry)
 * - Automatic retries with backoff
 * - Observability and debugging
 * - Async processing for non-blocking UX
 */

import { inngest } from "./inngest";
import { runCriticLoop, quickReview } from "../critic/runner";
import type { CriticConfig, CriticLoopResult } from "../critic/types";
import { logger } from "../utils/logger";

// ─────────────────────────────────────────────────────────────
// CRITIC REVIEW WORKFLOW
// ─────────────────────────────────────────────────────────────

/**
 * Full critic loop workflow with revision
 *
 * Steps:
 * 1. Initial review
 * 2. Revise if needed (up to maxAttempts)
 * 3. Final approval check
 * 4. Report results
 */
export const criticReviewWorkflow = inngest.createFunction(
  {
    id: "critic-review",
    retries: 2,
    concurrency: {
      key: "event.data.userId",
      limit: 3, // Max 3 concurrent reviews per user
    },
  },
  { event: "critic/review" },
  async ({ event, step }) => {
    const { content, contentType, userId, config, metadata } = event.data;
    const startTime = Date.now();

    logger.info("Starting critic review workflow", {
      userId,
      contentType,
      contentLength: content.length,
    });

    // Step 1: Run the critic loop
    const result = await step.run("run-critic-loop", async () => {
      return runCriticLoop(content, {
        contentType: contentType || "response",
        approvalThreshold: config?.approvalThreshold ?? 80,
        maxAttempts: config?.maxAttempts ?? 3,
        guidelines: config?.guidelines,
        failOnCritical: config?.failOnCritical ?? true,
        focusAreas: config?.focusAreas,
      });
    });

    // Step 2: Log metrics to observability
    await step.run("log-metrics", async () => {
      const { submitScore } = await import("../observability/langfuse");

      if (metadata?.traceId) {
        await submitScore(
          metadata.traceId,
          "critic_score",
          result.finalScore / 100,
        );
      }

      logger.info("Critic review complete", {
        userId,
        approved: result.approved,
        finalScore: result.finalScore,
        iterations: result.iterations,
        totalLatencyMs: result.totalLatencyMs,
      });

      return { logged: true };
    });

    // Step 3: Trigger follow-up actions if needed
    if (!result.approved && metadata?.onRejection) {
      await step.run("handle-rejection", async () => {
        logger.warn("Content rejected by critic", {
          userId,
          reason: result.rejectionReason,
          finalScore: result.finalScore,
        });

        // Could trigger notification, escalation, etc.
        return { handled: true };
      });
    }

    return {
      success: true,
      approved: result.approved,
      finalContent: result.finalContent,
      finalScore: result.finalScore,
      iterations: result.iterations,
      latencyMs: Date.now() - startTime,
      history: result.history.map((h) => ({
        attempt: h.attempt,
        score: h.review.score,
        passed: h.passed,
        issues: h.review.issues.length,
      })),
    };
  },
);

// ─────────────────────────────────────────────────────────────
// BATCH REVIEW WORKFLOW
// ─────────────────────────────────────────────────────────────

/**
 * Review multiple pieces of content in a batch
 */
export const criticBatchReviewWorkflow = inngest.createFunction(
  {
    id: "critic-batch-review",
    retries: 2,
    concurrency: { limit: 2 }, // Limit concurrent batch operations
  },
  { event: "critic/batch-review" },
  async ({ event, step }) => {
    const { contents, contentType, userId, config } = event.data;

    logger.info("Starting batch critic review", {
      userId,
      contentCount: contents.length,
    });

    // Process in chunks to avoid overwhelming the system
    const CHUNK_SIZE = 5;
    const results: CriticLoopResult[] = [];

    for (let i = 0; i < contents.length; i += CHUNK_SIZE) {
      const chunk = contents.slice(i, i + CHUNK_SIZE);
      const chunkIndex = Math.floor(i / CHUNK_SIZE);

      const chunkResults = await step.run(`review-chunk-${chunkIndex}`, async () => {
        return Promise.all(
          chunk.map((content: string) =>
            runCriticLoop(content, {
              contentType: contentType || "response",
              approvalThreshold: config?.approvalThreshold ?? 80,
              maxAttempts: config?.maxAttempts ?? 2, // Fewer attempts for batch
              failOnCritical: config?.failOnCritical ?? true,
            }),
          ),
        );
      });

      results.push(...chunkResults);
    }

    // Calculate summary
    const approved = results.filter((r) => r.approved).length;
    const averageScore =
      results.reduce((sum, r) => sum + r.finalScore, 0) / results.length;

    logger.info("Batch critic review complete", {
      userId,
      total: results.length,
      approved,
      averageScore,
    });

    return {
      success: true,
      total: results.length,
      approved,
      failed: results.length - approved,
      averageScore: Math.round(averageScore * 10) / 10,
      results: results.map((r, i) => ({
        index: i,
        approved: r.approved,
        score: r.finalScore,
        iterations: r.iterations,
      })),
    };
  },
);

// ─────────────────────────────────────────────────────────────
// QUICK REVIEW WORKFLOW (Single Pass)
// ─────────────────────────────────────────────────────────────

/**
 * Quick single-pass review without revision
 * Use for monitoring/auditing existing content
 */
export const quickReviewWorkflow = inngest.createFunction(
  {
    id: "critic-quick-review",
    retries: 3,
  },
  { event: "critic/quick-review" },
  async ({ event, step }) => {
    const { content, contentType, userId, metadata } = event.data;

    const review = await step.run("quick-review", async () => {
      return quickReview(content, contentType || "response");
    });

    // Log to Langfuse if trace provided
    if (metadata?.traceId) {
      await step.run("log-score", async () => {
        const { submitScore } = await import("../observability/langfuse");
        await submitScore(metadata.traceId, "quick_review_score", review.score / 100);
        return { logged: true };
      });
    }

    logger.info("Quick review complete", {
      userId,
      score: review.score,
      approved: review.approved,
      issues: review.issues.length,
    });

    return {
      success: true,
      approved: review.approved,
      score: review.score,
      issues: review.issues,
      mustFix: review.mustFix,
      suggestions: review.suggestions,
    };
  },
);
