// ═══════════════════════════════════════════════════════════════
// SEO GAPS - Content Gap Management
// Track keyword opportunities and generated content
// ═══════════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─────────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────────

/**
 * List all gaps, optionally filtered
 */
export const listGaps = query({
  args: {
    status: v.optional(v.string()),
    cluster: v.optional(v.string()),
    sport: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("seo_gaps");

    if (args.cluster && args.status) {
      q = q.withIndex("by_cluster", (idx) =>
        idx.eq("cluster", args.cluster!).eq("status", args.status as any)
      );
    } else if (args.sport && args.status) {
      q = q.withIndex("by_sport", (idx) =>
        idx.eq("sport", args.sport!).eq("status", args.status as any)
      );
    } else if (args.status) {
      q = q.withIndex("by_status", (idx) => idx.eq("status", args.status as any));
    }

    return await q.order("desc").take(args.limit ?? 100);
  },
});

/**
 * Get a gap by keyword
 */
export const getByKeyword = query({
  args: { keyword: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("seo_gaps")
      .withIndex("by_keyword", (q) => q.eq("keyword", args.keyword))
      .first();
  },
});

/**
 * Get top opportunities (gaps sorted by opportunity score)
 */
export const getTopOpportunities = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const gaps = await ctx.db
      .query("seo_gaps")
      .withIndex("by_status", (q) => q.eq("status", "gap"))
      .take(args.limit ?? 50);

    // Sort by opportunity score (volume / difficulty)
    return gaps.sort((a, b) => {
      const scoreA = a.opportunityScore ?? (a.volume ?? 0) / (a.difficulty ?? 100);
      const scoreB = b.opportunityScore ?? (b.volume ?? 0) / (b.difficulty ?? 100);
      return scoreB - scoreA;
    });
  },
});

/**
 * Get gaps by cluster
 */
export const getByCluster = query({
  args: {
    cluster: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("seo_gaps").withIndex("by_cluster", (idx) => {
      if (args.status) {
        return idx.eq("cluster", args.cluster).eq("status", args.status as any);
      }
      return idx.eq("cluster", args.cluster);
    });

    return await q.take(100);
  },
});

// ─────────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────────

/**
 * Add a new gap
 */
export const addGap = mutation({
  args: {
    keyword: v.string(),
    source: v.string(),
    volume: v.optional(v.number()),
    difficulty: v.optional(v.number()),
    intent: v.union(
      v.literal("informational"),
      v.literal("commercial"),
      v.literal("transactional"),
      v.literal("navigational")
    ),
    cluster: v.string(),
    sport: v.string(),
    ageGroup: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if already exists
    const existing = await ctx.db
      .query("seo_gaps")
      .withIndex("by_keyword", (q) => q.eq("keyword", args.keyword))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        volume: args.volume,
        difficulty: args.difficulty,
        opportunityScore: args.volume && args.difficulty
          ? args.volume / Math.max(args.difficulty, 1)
          : undefined,
        updatedAt: now,
      });
      return { _id: existing._id, updated: true };
    }

    // Create new
    const opportunityScore = args.volume && args.difficulty
      ? args.volume / Math.max(args.difficulty, 1)
      : undefined;

    const id = await ctx.db.insert("seo_gaps", {
      keyword: args.keyword,
      source: args.source,
      discoveredAt: now,
      volume: args.volume,
      difficulty: args.difficulty,
      intent: args.intent,
      cluster: args.cluster,
      sport: args.sport,
      ageGroup: args.ageGroup,
      status: "gap",
      opportunityScore,
      createdAt: now,
      updatedAt: now,
    });

    return { _id: id, updated: false };
  },
});

/**
 * Bulk import gaps (from gap miner output)
 */
export const bulkImportGaps = mutation({
  args: {
    gaps: v.array(
      v.object({
        keyword: v.string(),
        source: v.string(),
        volume: v.optional(v.number()),
        difficulty: v.optional(v.number()),
        intent: v.string(),
        cluster: v.string(),
        sport: v.string(),
        age_group: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let created = 0;
    let updated = 0;

    for (const gap of args.gaps) {
      const existing = await ctx.db
        .query("seo_gaps")
        .withIndex("by_keyword", (q) => q.eq("keyword", gap.keyword))
        .first();

      const opportunityScore = gap.volume && gap.difficulty
        ? gap.volume / Math.max(gap.difficulty, 1)
        : undefined;

      if (existing) {
        await ctx.db.patch(existing._id, {
          volume: gap.volume,
          difficulty: gap.difficulty,
          opportunityScore,
          updatedAt: now,
        });
        updated++;
      } else {
        await ctx.db.insert("seo_gaps", {
          keyword: gap.keyword,
          source: gap.source,
          discoveredAt: now,
          volume: gap.volume,
          difficulty: gap.difficulty,
          intent: gap.intent as any,
          cluster: gap.cluster,
          sport: gap.sport,
          ageGroup: gap.age_group,
          status: "gap",
          opportunityScore,
          createdAt: now,
          updatedAt: now,
        });
        created++;
      }
    }

    return { created, updated, total: args.gaps.length };
  },
});

/**
 * Update gap status (when content is created)
 */
export const updateGapStatus = mutation({
  args: {
    keyword: v.string(),
    status: v.union(
      v.literal("gap"),
      v.literal("draft"),
      v.literal("published"),
      v.literal("rejected")
    ),
    contentId: v.optional(v.string()),
    pageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const gap = await ctx.db
      .query("seo_gaps")
      .withIndex("by_keyword", (q) => q.eq("keyword", args.keyword))
      .first();

    if (!gap) throw new Error(`Gap not found: ${args.keyword}`);

    await ctx.db.patch(gap._id, {
      status: args.status,
      contentId: args.contentId,
      pageUrl: args.pageUrl,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Get cluster summary stats
 */
export const getClusterStats = query({
  args: {},
  handler: async (ctx) => {
    const allGaps = await ctx.db.query("seo_gaps").take(1000);

    const stats: Record<string, { total: number; gaps: number; published: number }> = {};

    for (const gap of allGaps) {
      if (!stats[gap.cluster]) {
        stats[gap.cluster] = { total: 0, gaps: 0, published: 0 };
      }
      stats[gap.cluster].total++;
      if (gap.status === "gap") stats[gap.cluster].gaps++;
      if (gap.status === "published") stats[gap.cluster].published++;
    }

    return stats;
  },
});
