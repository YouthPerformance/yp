/**
 * Analytics for Answer Engine
 *
 * Tracks:
 * - AI retrieval queries (Perplexity, ChatGPT, etc.)
 * - Search impressions and clicks
 * - Content performance metrics
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─────────────────────────────────────────────────────────────
// AI RETRIEVAL LOGGING
// ─────────────────────────────────────────────────────────────

/**
 * Log an AI retrieval query
 * Called by the Answer Engine API on each request
 */
export const logAiRetrieval = mutation({
  args: {
    query: v.string(),
    source: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    resultsReturned: v.number(),
    citedEntityIds: v.array(v.string()),
    citedEntityTypes: v.array(v.string()),
    responseTime: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("aiRetrievals", {
      ...args,
      timestamp: Date.now(),
    });
    return id;
  },
});

/**
 * Log a search query (internal site search)
 */
export const logSearch = mutation({
  args: {
    query: v.string(),
    resultsCount: v.number(),
    source: v.string(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("searchLogs", {
      ...args,
      timestamp: Date.now(),
    });
    return id;
  },
});

/**
 * Log a click on a search result
 */
export const logClick = mutation({
  args: {
    query: v.string(),
    clickedEntityId: v.string(),
    clickedEntityType: v.string(),
    source: v.string(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("searchLogs", {
      query: args.query,
      resultsCount: 0, // Click log, not search log
      clickedEntityId: args.clickedEntityId,
      clickedEntityType: args.clickedEntityType,
      source: args.source,
      sessionId: args.sessionId,
      timestamp: Date.now(),
    });
    return id;
  },
});

// ─────────────────────────────────────────────────────────────
// ANALYTICS QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Get AI retrieval stats for a time period
 */
export const getAiRetrievalStats = query({
  args: {
    since: v.optional(v.number()), // Timestamp
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const since = args.since || Date.now() - 7 * 24 * 60 * 60 * 1000; // Last 7 days

    const retrievals = await ctx.db
      .query("aiRetrievals")
      .withIndex("by_timestamp", (q) => q.gt("timestamp", since))
      .order("desc")
      .take(args.limit || 100);

    // Aggregate stats
    const bySource: Record<string, number> = {};
    const topQueries: Record<string, number> = {};
    let totalResults = 0;
    let totalResponseTime = 0;

    for (const r of retrievals) {
      const source = r.source || "unknown";
      bySource[source] = (bySource[source] || 0) + 1;
      topQueries[r.query] = (topQueries[r.query] || 0) + 1;
      totalResults += r.resultsReturned;
      totalResponseTime += r.responseTime;
    }

    return {
      totalQueries: retrievals.length,
      avgResultsPerQuery: retrievals.length > 0 ? totalResults / retrievals.length : 0,
      avgResponseTime: retrievals.length > 0 ? totalResponseTime / retrievals.length : 0,
      bySource,
      topQueries: Object.entries(topQueries)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([query, count]) => ({ query, count })),
      recentQueries: retrievals.slice(0, 10).map((r) => ({
        query: r.query,
        source: r.source,
        resultsReturned: r.resultsReturned,
        timestamp: r.timestamp,
      })),
    };
  },
});

/**
 * Get search logs for analysis
 */
export const getSearchLogs = query({
  args: {
    since: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const since = args.since || Date.now() - 7 * 24 * 60 * 60 * 1000;

    const logs = await ctx.db
      .query("searchLogs")
      .withIndex("by_timestamp", (q) => q.gt("timestamp", since))
      .order("desc")
      .take(args.limit || 100);

    return logs;
  },
});

/**
 * Get content gap detection - queries with zero results
 */
export const getContentGaps = query({
  args: {
    since: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const since = args.since || Date.now() - 30 * 24 * 60 * 60 * 1000; // Last 30 days

    const retrievals = await ctx.db
      .query("aiRetrievals")
      .withIndex("by_timestamp", (q) => q.gt("timestamp", since))
      .collect();

    // Find queries with zero or few results
    const gaps: Record<string, { count: number; avgResults: number }> = {};

    for (const r of retrievals) {
      if (r.resultsReturned < 3) {
        if (!gaps[r.query]) {
          gaps[r.query] = { count: 0, avgResults: 0 };
        }
        gaps[r.query].count += 1;
        gaps[r.query].avgResults =
          (gaps[r.query].avgResults * (gaps[r.query].count - 1) + r.resultsReturned) /
          gaps[r.query].count;
      }
    }

    return Object.entries(gaps)
      .filter(([_, stats]) => stats.count >= 2) // At least 2 occurrences
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, args.limit || 20)
      .map(([query, stats]) => ({
        query,
        occurrences: stats.count,
        avgResults: Math.round(stats.avgResults * 10) / 10,
      }));
  },
});
