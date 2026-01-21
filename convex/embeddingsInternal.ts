/**
 * Internal functions for embeddings
 * Called by actions in embeddings.ts
 */

import { internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// ─────────────────────────────────────────────────────────────
// INTERNAL QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Get drill by ID (internal)
 */
export const getDrill = internalQuery({
  args: { id: v.id("drills") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get QnA by ID (internal)
 */
export const getQnA = internalQuery({
  args: { id: v.id("qna") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get all drills that don't have embeddings
 */
export const getDrillsWithoutEmbeddings = internalQuery({
  args: {},
  handler: async (ctx) => {
    const drills = await ctx.db.query("drills").collect();
    return drills.filter((d) => !d.embedding || d.embedding.length === 0);
  },
});

/**
 * Get all QnA entries without embeddings
 */
export const getQnAWithoutEmbeddings = internalQuery({
  args: {},
  handler: async (ctx) => {
    const qnas = await ctx.db.query("qna").collect();
    return qnas.filter((q) => !q.embedding || q.embedding.length === 0);
  },
});

// ─────────────────────────────────────────────────────────────
// INTERNAL MUTATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Set drill embedding
 */
export const setDrillEmbedding = internalMutation({
  args: {
    id: v.id("drills"),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      embedding: args.embedding,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Set QnA embedding
 */
export const setQnAEmbedding = internalMutation({
  args: {
    id: v.id("qna"),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      embedding: args.embedding,
      updatedAt: Date.now(),
    });
  },
});
