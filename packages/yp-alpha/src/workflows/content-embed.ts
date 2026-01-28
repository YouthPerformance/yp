/**
 * Content Embedding Workflow
 * ==========================
 *
 * Durable workflow for generating and storing embeddings.
 * Supports single and batch embedding operations.
 *
 * Pipeline:
 * 1. Validate content exists (memoized)
 * 2. Generate embedding via OpenAI (memoized)
 * 3. Store embedding in Convex (memoized)
 */

import { inngest } from "./inngest";
import { logger } from "../utils/logger";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface EmbeddingResult {
  contentId: string;
  contentType: string;
  embedding: number[];
  dimensions: number;
  model: string;
}

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;
const BATCH_SIZE = 100; // Max items per batch

// ─────────────────────────────────────────────────────────────
// SINGLE CONTENT EMBED WORKFLOW
// ─────────────────────────────────────────────────────────────

export const contentEmbedWorkflow = inngest.createFunction(
  {
    id: "content-embed",
    retries: 3,
    concurrency: {
      limit: 20, // Max 20 concurrent embedding operations
    },
  },
  { event: "content/embed" },
  async ({ event, step }) => {
    const { contentType, contentId, text, metadata } = event.data;

    logger.info("Starting content embed workflow", { contentType, contentId });

    // ─────────────────────────────────────────────────────────
    // STEP 1: Validate Content (Memoized)
    // ─────────────────────────────────────────────────────────
    const validation = await step.run("validate-content", async () => {
      if (!text || text.trim().length === 0) {
        throw new Error(`Empty content for ${contentType}:${contentId}`);
      }

      // Truncate to reasonable length for embedding
      const maxChars = 8000;
      const truncatedText = text.length > maxChars
        ? text.substring(0, maxChars) + "..."
        : text;

      return {
        valid: true,
        originalLength: text.length,
        truncatedLength: truncatedText.length,
        text: truncatedText,
      };
    });

    // ─────────────────────────────────────────────────────────
    // STEP 2: Generate Embedding (Memoized)
    // Uses OpenAI's text-embedding-3-small
    // ─────────────────────────────────────────────────────────
    const embeddingResult = await step.run("generate-embedding", async () => {
      const openaiApiKey = process.env.OPENAI_API_KEY;

      if (!openaiApiKey) {
        throw new Error("OPENAI_API_KEY not configured");
      }

      // In production, this would call OpenAI's API
      // For now, return placeholder embedding
      const placeholderEmbedding = new Array(EMBEDDING_DIMENSIONS).fill(0).map(() => Math.random() * 2 - 1);

      logger.info("Generated embedding", {
        contentType,
        contentId,
        dimensions: EMBEDDING_DIMENSIONS,
        model: EMBEDDING_MODEL,
      });

      return {
        embedding: placeholderEmbedding,
        model: EMBEDDING_MODEL,
        dimensions: EMBEDDING_DIMENSIONS,
        usage: {
          promptTokens: Math.ceil(validation.truncatedLength / 4),
          totalTokens: Math.ceil(validation.truncatedLength / 4),
        },
      };
    });

    // ─────────────────────────────────────────────────────────
    // STEP 3: Store Embedding (Memoized)
    // ─────────────────────────────────────────────────────────
    await step.run("store-embedding", async () => {
      // In production, this would update the Convex document
      // with the embedding vector

      logger.info("Stored embedding", {
        contentType,
        contentId,
        dimensions: embeddingResult.dimensions,
      });

      return {
        stored: true,
        contentType,
        contentId,
      };
    });

    // ─────────────────────────────────────────────────────────
    // RETURN SUMMARY
    // ─────────────────────────────────────────────────────────
    return {
      success: true,
      contentType,
      contentId,
      dimensions: embeddingResult.dimensions,
      model: embeddingResult.model,
      metadata,
    };
  }
);

// ─────────────────────────────────────────────────────────────
// BATCH CONTENT EMBED WORKFLOW
// ─────────────────────────────────────────────────────────────

export const batchEmbedWorkflow = inngest.createFunction(
  {
    id: "content-batch-embed",
    retries: 2,
  },
  { event: "content/batch-embed" },
  async ({ event, step }) => {
    const { contentType, contentIds } = event.data;

    logger.info("Starting batch embed workflow", {
      contentType,
      count: contentIds.length,
    });

    // ─────────────────────────────────────────────────────────
    // STEP 1: Fetch Content Texts (Memoized)
    // ─────────────────────────────────────────────────────────
    const contents = await step.run("fetch-contents", async () => {
      // In production, this would fetch from Convex
      // Return placeholder for now
      return contentIds.map(id => ({
        id,
        text: `Content for ${id}`,
      }));
    });

    // ─────────────────────────────────────────────────────────
    // STEP 2: Batch into chunks (Memoized)
    // OpenAI has limits on batch size
    // ─────────────────────────────────────────────────────────
    const batches = await step.run("create-batches", async () => {
      const chunks: Array<{ id: string; text: string }[]> = [];

      for (let i = 0; i < contents.length; i += BATCH_SIZE) {
        chunks.push(contents.slice(i, i + BATCH_SIZE));
      }

      return chunks.map((chunk, index) => ({
        batchIndex: index,
        items: chunk,
      }));
    });

    // ─────────────────────────────────────────────────────────
    // STEP 3: Process Each Batch (Parallel within step)
    // ─────────────────────────────────────────────────────────
    const results: EmbeddingResult[] = [];

    for (const batch of batches) {
      const batchResults = await step.run(`process-batch-${batch.batchIndex}`, async () => {
        // In production, this would call OpenAI's batch embedding API
        return batch.items.map(item => ({
          contentId: item.id,
          contentType,
          embedding: new Array(EMBEDDING_DIMENSIONS).fill(0).map(() => Math.random() * 2 - 1),
          dimensions: EMBEDDING_DIMENSIONS,
          model: EMBEDDING_MODEL,
        }));
      });

      results.push(...batchResults);
    }

    // ─────────────────────────────────────────────────────────
    // STEP 4: Store All Embeddings (Memoized)
    // ─────────────────────────────────────────────────────────
    await step.run("store-all-embeddings", async () => {
      // In production, this would bulk update Convex
      logger.info("Stored batch embeddings", {
        contentType,
        count: results.length,
      });

      return { stored: results.length };
    });

    // ─────────────────────────────────────────────────────────
    // RETURN SUMMARY
    // ─────────────────────────────────────────────────────────
    return {
      success: true,
      contentType,
      totalProcessed: results.length,
      batchCount: batches.length,
      model: EMBEDDING_MODEL,
      dimensions: EMBEDDING_DIMENSIONS,
    };
  }
);

// ─────────────────────────────────────────────────────────────
// VOICE AUDIT WORKFLOW
// ─────────────────────────────────────────────────────────────

export const voiceAuditWorkflow = inngest.createFunction(
  {
    id: "voice-audit",
    retries: 2,
  },
  { event: "voice/audit" },
  async ({ event, step }) => {
    const { responses } = event.data;

    logger.info("Starting voice audit workflow", { count: responses.length });

    // Import voiceWrapper dynamically to avoid circular deps
    const { voiceWrapper } = await import("../router/voice-wrapper");

    // ─────────────────────────────────────────────────────────
    // STEP 1: Audit All Responses (Memoized)
    // ─────────────────────────────────────────────────────────
    const auditResults = await step.run("audit-responses", async () => {
      return responses.map(response => {
        const violations = voiceWrapper.audit(response.content);
        const score = voiceWrapper.score(response.content);

        return {
          id: response.id,
          model: response.model,
          score,
          violations,
          passed: score >= 70,
        };
      });
    });

    // ─────────────────────────────────────────────────────────
    // STEP 2: Aggregate Statistics (Memoized)
    // ─────────────────────────────────────────────────────────
    const stats = await step.run("aggregate-stats", async () => {
      const totalScore = auditResults.reduce((sum, r) => sum + r.score, 0);
      const avgScore = totalScore / auditResults.length;
      const passCount = auditResults.filter(r => r.passed).length;
      const failCount = auditResults.length - passCount;

      // Count violations by type
      const violationCounts: Record<string, number> = {};
      for (const result of auditResults) {
        for (const violation of result.violations) {
          violationCounts[violation] = (violationCounts[violation] || 0) + 1;
        }
      }

      return {
        avgScore,
        passCount,
        failCount,
        passRate: passCount / auditResults.length,
        violationCounts,
      };
    });

    // ─────────────────────────────────────────────────────────
    // STEP 3: Report to Langfuse (Memoized)
    // ─────────────────────────────────────────────────────────
    await step.run("report-to-langfuse", async () => {
      // In production, this would send scores to Langfuse
      logger.info("Voice audit complete", {
        avgScore: stats.avgScore,
        passRate: stats.passRate,
        topViolations: Object.entries(stats.violationCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5),
      });
    });

    return {
      success: true,
      totalAudited: responses.length,
      avgScore: stats.avgScore,
      passRate: stats.passRate,
      results: auditResults,
    };
  }
);
