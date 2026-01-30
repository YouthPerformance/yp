/**
 * Vector Search Actions
 * =====================
 *
 * Semantic search across athlete memory using Convex vector indexes.
 * Enables "find similar" queries for context-aware responses.
 *
 * @example
 * ```ts
 * const results = await ctx.runAction(api.memory.vectorSearch.searchAthleteNodes, {
 *   userId: "user_123",
 *   queryEmbedding: [...],
 *   limit: 5,
 * });
 * ```
 */

import { v } from "convex/values";
import { action, internalAction } from "../_generated/server";

// ─────────────────────────────────────────────────────────────
// ATHLETE NODES SEARCH
// ─────────────────────────────────────────────────────────────

/**
 * Search athlete nodes by semantic similarity
 * Returns nodes most relevant to the query
 */
export const searchAthleteNodes = action({
  args: {
    userId: v.string(),
    queryEmbedding: v.array(v.float64()),
    limit: v.optional(v.number()),
    category: v.optional(
      v.union(
        v.literal("body_part"),
        v.literal("metric"),
        v.literal("mental"),
        v.literal("recovery"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;

    // Build filter expression
    const filter = args.category
      ? { userId: args.userId, category: args.category }
      : { userId: args.userId };

    const results = await ctx.vectorSearch("athlete_nodes", "by_embedding", {
      vector: args.queryEmbedding,
      limit,
      filter: (q) =>
        args.category
          ? q.eq("userId", args.userId) && q.eq("category", args.category)
          : q.eq("userId", args.userId),
    });

    // Fetch full documents
    const nodes = await Promise.all(
      results.map(async (result) => {
        const node = await ctx.runQuery(
          // @ts-expect-error - internal query
          "memory/vector-search:getNodeById",
          { id: result._id },
        );
        return {
          ...node,
          _score: result._score,
        };
      }),
    );

    return nodes.filter(Boolean);
  },
});

/**
 * Search memories by semantic similarity
 */
export const searchMemories = action({
  args: {
    userId: v.string(),
    queryEmbedding: v.array(v.float64()),
    limit: v.optional(v.number()),
    memoryType: v.optional(
      v.union(
        v.literal("injury"),
        v.literal("goal"),
        v.literal("progress"),
        v.literal("emotion"),
        v.literal("preference"),
        v.literal("context"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const results = await ctx.vectorSearch("memories", "by_embedding", {
      vector: args.queryEmbedding,
      limit,
      filter: (q) =>
        args.memoryType
          ? q.eq("userId", args.userId) && q.eq("memoryType", args.memoryType)
          : q.eq("userId", args.userId),
    });

    // Fetch full documents
    const memories = await Promise.all(
      results.map(async (result) => {
        const memory = await ctx.runQuery(
          // @ts-expect-error - internal query
          "memory/vector-search:getMemoryById",
          { id: result._id },
        );
        return {
          ...memory,
          _score: result._score,
        };
      }),
    );

    return memories.filter(Boolean);
  },
});

/**
 * Search training content by semantic similarity
 */
export const searchTrainingContent = action({
  args: {
    queryEmbedding: v.array(v.float64()),
    limit: v.optional(v.number()),
    category: v.optional(
      v.union(
        v.literal("drill"),
        v.literal("article"),
        v.literal("protocol"),
        v.literal("faq"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;

    const results = await ctx.vectorSearch("training_content", "by_embedding", {
      vector: args.queryEmbedding,
      limit,
      filter: args.category
        ? (q) => q.eq("category", args.category)
        : undefined,
    });

    // Fetch full documents
    const content = await Promise.all(
      results.map(async (result) => {
        const item = await ctx.runQuery(
          // @ts-expect-error - internal query
          "memory/vector-search:getContentById",
          { id: result._id },
        );
        return {
          ...item,
          _score: result._score,
        };
      }),
    );

    return content.filter(Boolean);
  },
});

// ─────────────────────────────────────────────────────────────
// COMBINED SEMANTIC SEARCH
// ─────────────────────────────────────────────────────────────

/**
 * Search across all memory types for comprehensive context
 * Returns a combined result from nodes, memories, and content
 */
export const semanticSearch = action({
  args: {
    userId: v.string(),
    queryEmbedding: v.array(v.float64()),
    options: v.optional(
      v.object({
        includeNodes: v.optional(v.boolean()),
        includeMemories: v.optional(v.boolean()),
        includeContent: v.optional(v.boolean()),
        nodeLimit: v.optional(v.number()),
        memoryLimit: v.optional(v.number()),
        contentLimit: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const options = args.options ?? {};
    const includeNodes = options.includeNodes ?? true;
    const includeMemories = options.includeMemories ?? true;
    const includeContent = options.includeContent ?? true;

    const results: {
      nodes: Array<Record<string, unknown>>;
      memories: Array<Record<string, unknown>>;
      content: Array<Record<string, unknown>>;
    } = {
      nodes: [],
      memories: [],
      content: [],
    };

    // Search in parallel
    const searches: Promise<void>[] = [];

    if (includeNodes) {
      searches.push(
        (async () => {
          const nodeResults = await ctx.vectorSearch("athlete_nodes", "by_embedding", {
            vector: args.queryEmbedding,
            limit: options.nodeLimit ?? 5,
            filter: (q) => q.eq("userId", args.userId),
          });

          results.nodes = await Promise.all(
            nodeResults.map(async (result) => {
              const node = await ctx.runQuery(
                // @ts-expect-error - internal query
                "memory/vector-search:getNodeById",
                { id: result._id },
              );
              return { ...node, _score: result._score };
            }),
          );
        })(),
      );
    }

    if (includeMemories) {
      searches.push(
        (async () => {
          const memoryResults = await ctx.vectorSearch("memories", "by_embedding", {
            vector: args.queryEmbedding,
            limit: options.memoryLimit ?? 5,
            filter: (q) => q.eq("userId", args.userId),
          });

          results.memories = await Promise.all(
            memoryResults.map(async (result) => {
              const memory = await ctx.runQuery(
                // @ts-expect-error - internal query
                "memory/vector-search:getMemoryById",
                { id: result._id },
              );
              return { ...memory, _score: result._score };
            }),
          );
        })(),
      );
    }

    if (includeContent) {
      searches.push(
        (async () => {
          const contentResults = await ctx.vectorSearch("training_content", "by_embedding", {
            vector: args.queryEmbedding,
            limit: options.contentLimit ?? 3,
          });

          results.content = await Promise.all(
            contentResults.map(async (result) => {
              const item = await ctx.runQuery(
                // @ts-expect-error - internal query
                "memory/vector-search:getContentById",
                { id: result._id },
              );
              return { ...item, _score: result._score };
            }),
          );
        })(),
      );
    }

    await Promise.all(searches);

    return results;
  },
});

// ─────────────────────────────────────────────────────────────
// HELPER QUERIES (Internal)
// ─────────────────────────────────────────────────────────────

import { query } from "../_generated/server";

export const getNodeById = query({
  args: { id: v.id("athlete_nodes") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const getMemoryById = query({
  args: { id: v.id("memories") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const getContentById = query({
  args: { id: v.id("training_content") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});
