/**
 * Embeddings Generation for Answer Engine
 *
 * Uses OpenAI text-embedding-3-small (1536 dims) for semantic search.
 * Generates embeddings for drills, QnA, and other content types.
 */

"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import OpenAI from "openai";

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────

const EMBEDDING_MODEL = "text-embedding-3-small"; // 1536 dims, cheaper than ada-002
const EMBEDDING_DIMENSIONS = 1536;

// ─────────────────────────────────────────────────────────────
// EMBEDDING GENERATION
// ─────────────────────────────────────────────────────────────

/**
 * Generate embedding for a text string
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS,
  });

  return response.data[0].embedding;
}

/**
 * Build embedding text for a drill
 * Combines title, goal, tags, steps for comprehensive semantic matching
 */
function buildDrillEmbeddingText(drill: {
  title: string;
  goal: string;
  sport: string;
  skill: string;
  tags: string[];
  keywords: string[];
  steps: { instruction: string }[];
  directAnswer?: string;
}): string {
  const parts = [
    `Title: ${drill.title}`,
    `Goal: ${drill.goal}`,
    `Sport: ${drill.sport}`,
    `Category: ${drill.skill}`,
    drill.tags.length > 0 ? `Tags: ${drill.tags.join(", ")}` : "",
    drill.keywords.length > 0 ? `Keywords: ${drill.keywords.join(", ")}` : "",
    drill.directAnswer ? `Summary: ${drill.directAnswer}` : "",
    drill.steps.length > 0
      ? `Steps: ${drill.steps.map((s) => s.instruction).join(" ")}`
      : "",
  ];

  return parts.filter(Boolean).join("\n");
}

/**
 * Build embedding text for a QnA entry
 */
function buildQnAEmbeddingText(qna: {
  question: string;
  directAnswer: string;
  category: string;
  keywords: string[];
  keyTakeaways: string[];
}): string {
  const parts = [
    `Question: ${qna.question}`,
    `Answer: ${qna.directAnswer}`,
    `Category: ${qna.category}`,
    qna.keywords.length > 0 ? `Keywords: ${qna.keywords.join(", ")}` : "",
    qna.keyTakeaways.length > 0
      ? `Key Points: ${qna.keyTakeaways.join(". ")}`
      : "",
  ];

  return parts.filter(Boolean).join("\n");
}

// ─────────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Generate and store embedding for a single drill
 */
export const embedDrill = action({
  args: { drillId: v.id("drills") },
  returns: v.object({ success: v.boolean(), drillId: v.id("drills"), textLength: v.number() }),
  handler: async (ctx, args) => {
    // Get drill data
    const drill = await ctx.runQuery(internal.embeddingsInternal.getDrill, {
      id: args.drillId,
    });

    if (!drill) {
      throw new Error(`Drill not found: ${args.drillId}`);
    }

    // Build embedding text
    const text = buildDrillEmbeddingText(drill);

    // Generate embedding
    const embedding = await generateEmbedding(text);

    // Store embedding
    await ctx.runMutation(internal.embeddingsInternal.setDrillEmbedding, {
      id: args.drillId,
      embedding,
    });

    return { success: true, drillId: args.drillId, textLength: text.length };
  },
});

/**
 * Generate and store embedding for a single QnA entry
 */
export const embedQnA = action({
  args: { qnaId: v.id("qna") },
  returns: v.object({ success: v.boolean(), qnaId: v.id("qna"), textLength: v.number() }),
  handler: async (ctx, args) => {
    // Get QnA data
    const qna = await ctx.runQuery(internal.embeddingsInternal.getQnA, {
      id: args.qnaId,
    });

    if (!qna) {
      throw new Error(`QnA not found: ${args.qnaId}`);
    }

    // Build embedding text
    const text = buildQnAEmbeddingText(qna);

    // Generate embedding
    const embedding = await generateEmbedding(text);

    // Store embedding
    await ctx.runMutation(internal.embeddingsInternal.setQnAEmbedding, {
      id: args.qnaId,
      embedding,
    });

    return { success: true, qnaId: args.qnaId, textLength: text.length };
  },
});

/**
 * Backfill embeddings for all drills without embeddings
 */
export const backfillDrillEmbeddings = action({
  args: {},
  returns: v.object({ processed: v.number(), failed: v.number(), total: v.number() }),
  handler: async (ctx) => {
    // Get drills without embeddings - type cast to break circular inference
    const drills = (await ctx.runQuery(internal.embeddingsInternal.getDrillsWithoutEmbeddings, {})) as Array<{
      _id: string;
      slug: string;
      title: string;
      goal: string;
      sport: string;
      skill: string;
      tags: string[];
      keywords: string[];
      steps: { instruction: string }[];
      directAnswer?: string;
    }>;

    console.log(`Found ${drills.length} drills without embeddings`);

    let processed = 0;
    let failed = 0;

    for (const drill of drills) {
      try {
        const text = buildDrillEmbeddingText(drill);
        const embedding = await generateEmbedding(text);

        await ctx.runMutation(internal.embeddingsInternal.setDrillEmbedding, {
          id: drill._id as any,
          embedding,
        });

        processed++;
        console.log(`[${processed}/${drills.length}] Embedded: ${drill.slug}`);
      } catch (error) {
        failed++;
        console.error(`Failed to embed ${drill.slug}:`, error);
      }
    }

    return { processed, failed, total: drills.length };
  },
});

/**
 * Backfill embeddings for all QnA entries without embeddings
 */
export const backfillQnAEmbeddings = action({
  args: {},
  returns: v.object({ processed: v.number(), failed: v.number(), total: v.number() }),
  handler: async (ctx) => {
    // Get QnA entries without embeddings - type cast to break circular inference
    const qnas = (await ctx.runQuery(internal.embeddingsInternal.getQnAWithoutEmbeddings, {})) as Array<{
      _id: string;
      slug: string;
      question: string;
      directAnswer: string;
      category: string;
      keywords: string[];
      keyTakeaways: string[];
    }>;

    console.log(`Found ${qnas.length} QnA entries without embeddings`);

    let processed = 0;
    let failed = 0;

    for (const qna of qnas) {
      try {
        const text = buildQnAEmbeddingText(qna);
        const embedding = await generateEmbedding(text);

        await ctx.runMutation(internal.embeddingsInternal.setQnAEmbedding, {
          id: qna._id as any,
          embedding,
        });

        processed++;
        console.log(`[${processed}/${qnas.length}] Embedded: ${qna.slug}`);
      } catch (error) {
        failed++;
        console.error(`Failed to embed ${qna.slug}:`, error);
      }
    }

    return { processed, failed, total: qnas.length };
  },
});

/**
 * Generate embedding for a search query
 * Returns the embedding vector for use in vector search
 */
export const embedQuery = action({
  args: { query: v.string() },
  returns: v.array(v.float64()),
  handler: async (ctx, args) => {
    const embedding = await generateEmbedding(args.query);
    return embedding;
  },
});
