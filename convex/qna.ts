/**
 * QnA CRUD Operations
 *
 * Manages Q&A content for the Answer Engine.
 * These are parent-friendly articles that answer common questions.
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * List all published QnA entries
 */
export const listPublished = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let qnas = await ctx.db
      .query("qna")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    if (args.category) {
      qnas = qnas.filter((q) => q.category === args.category);
    }

    return qnas.slice(0, args.limit || 50);
  },
});

/**
 * Get QnA by slug
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("qna")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

/**
 * Get QnA by ID
 */
export const get = query({
  args: { id: v.id("qna") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ─────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Create a new QnA entry
 */
export const create = mutation({
  args: {
    question: v.string(),
    slug: v.string(),
    category: v.string(),
    sport: v.optional(v.string()),
    intent: v.string(),
    directAnswer: v.string(),
    fullAnswer: v.string(),
    sources: v.array(
      v.object({
        type: v.string(),
        title: v.string(),
        url: v.optional(v.string()),
        quote: v.optional(v.string()),
      })
    ),
    keyTakeaways: v.array(v.string()),
    safetyNote: v.optional(v.string()),
    disclaimer: v.optional(v.string()),
    authorId: v.id("authors"),
    relatedDrillIds: v.array(v.id("drills")),
    keywords: v.array(v.string()),
    searchQueries: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const id = await ctx.db.insert("qna", {
      ...args,
      relatedQnaIds: [],
      searchQueries: args.searchQueries || args.keywords,
      status: "draft",
      safetyLevel: "safe_autopublish",
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

/**
 * Publish a QnA entry
 */
export const publish = mutation({
  args: { id: v.id("qna") },
  handler: async (ctx, args) => {
    const qna = await ctx.db.get(args.id);
    if (!qna) throw new Error("QnA not found");

    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: "published",
      publishedAt: now,
      updatedAt: now,
    });

    return args.id;
  },
});

/**
 * Set QnA embedding
 */
export const setEmbedding = mutation({
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
