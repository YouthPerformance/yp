/**
 * Embeddings Generation
 * =====================
 *
 * AI SDK-powered embeddings for semantic search.
 * Uses OpenAI text-embedding-3-small (1536 dimensions).
 *
 * @example
 * ```ts
 * const embedding = await generateEmbedding("ankle pain after running");
 * const embeddings = await generateEmbeddings(["pain", "progress", "goal"]);
 * ```
 */

import { embed, embedMany } from "ai";
import { embeddingModel } from "./providers";
import { logger } from "../utils/logger";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface EmbeddingResult {
  embedding: number[];
  usage: {
    tokens: number;
  };
}

export interface BatchEmbeddingResult {
  embeddings: number[][];
  usage: {
    tokens: number;
  };
}

// ─────────────────────────────────────────────────────────────
// SINGLE EMBEDDING
// ─────────────────────────────────────────────────────────────

/**
 * Generate embedding for a single text
 *
 * @param text - Text to embed
 * @returns Embedding vector (1536 dimensions)
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  const startTime = Date.now();

  const result = await embed({
    model: embeddingModel,
    value: text,
  });

  const latencyMs = Date.now() - startTime;

  logger.debug("Generated embedding", {
    textLength: text.length,
    latencyMs,
    tokens: result.usage.tokens,
  });

  return {
    embedding: result.embedding,
    usage: {
      tokens: result.usage.tokens,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// BATCH EMBEDDINGS
// ─────────────────────────────────────────────────────────────

/**
 * Generate embeddings for multiple texts
 * More efficient than calling generateEmbedding in a loop
 *
 * @param texts - Array of texts to embed
 * @returns Array of embedding vectors
 */
export async function generateEmbeddings(
  texts: string[],
): Promise<BatchEmbeddingResult> {
  if (texts.length === 0) {
    return {
      embeddings: [],
      usage: { tokens: 0 },
    };
  }

  const startTime = Date.now();

  const result = await embedMany({
    model: embeddingModel,
    values: texts,
  });

  const latencyMs = Date.now() - startTime;

  logger.debug("Generated batch embeddings", {
    count: texts.length,
    latencyMs,
    tokens: result.usage.tokens,
  });

  return {
    embeddings: result.embeddings,
    usage: {
      tokens: result.usage.tokens,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// SEMANTIC SIMILARITY
// ─────────────────────────────────────────────────────────────

/**
 * Calculate cosine similarity between two embedding vectors
 *
 * @param a - First embedding
 * @param b - Second embedding
 * @returns Similarity score (0-1)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Embeddings must have the same dimensions");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Find most similar items from a list based on embedding similarity
 *
 * @param queryEmbedding - Query embedding to compare against
 * @param items - Items with embeddings to search
 * @param topK - Number of results to return
 * @returns Top K most similar items with scores
 */
export function findMostSimilar<T extends { embedding: number[] }>(
  queryEmbedding: number[],
  items: T[],
  topK: number = 5,
): Array<T & { similarity: number }> {
  const withScores = items.map((item) => ({
    ...item,
    similarity: cosineSimilarity(queryEmbedding, item.embedding),
  }));

  return withScores
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

// ─────────────────────────────────────────────────────────────
// CONTENT PREPARATION
// ─────────────────────────────────────────────────────────────

/**
 * Prepare athlete node for embedding
 * Combines key, status, notes into searchable text
 */
export function prepareAthleteNodeForEmbedding(node: {
  key: string;
  category: string;
  status: string;
  score: number;
  notes?: string;
}): string {
  const parts = [
    `${node.key.replace(/_/g, " ")} (${node.category})`,
    `Status: ${node.status}`,
    `Score: ${node.score}/10`,
  ];

  if (node.notes) {
    parts.push(`Notes: ${node.notes}`);
  }

  return parts.join(". ");
}

/**
 * Prepare memory for embedding
 */
export function prepareMemoryForEmbedding(memory: {
  content: string;
  memoryType: string;
  sourceMessage?: string;
}): string {
  const parts = [
    `[${memory.memoryType}] ${memory.content}`,
  ];

  if (memory.sourceMessage) {
    parts.push(`Original: ${memory.sourceMessage}`);
  }

  return parts.join(". ");
}

/**
 * Prepare training content for embedding
 */
export function prepareTrainingContentForEmbedding(content: {
  title: string;
  category: string;
  text: string;
  tags?: string[];
  bodyParts?: string[];
}): string {
  const parts = [
    content.title,
    `Category: ${content.category}`,
    content.text,
  ];

  if (content.tags && content.tags.length > 0) {
    parts.push(`Tags: ${content.tags.join(", ")}`);
  }

  if (content.bodyParts && content.bodyParts.length > 0) {
    parts.push(`Body parts: ${content.bodyParts.join(", ")}`);
  }

  return parts.join(". ");
}
