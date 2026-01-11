// ═══════════════════════════════════════════════════════════
// CONTENT STRATEGY
// SEO keyword tracking, article briefs, and voice-dictated drafts
// Mobile-optimized for James & Adam
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─────────────────────────────────────────────────────────────
// TYPE VALIDATORS
// ─────────────────────────────────────────────────────────────

const authorValidator = v.union(v.literal("james"), v.literal("adam"));

const keywordStatusValidator = v.union(
  v.literal("target"),
  v.literal("ranking"),
  v.literal("opportunity"),
  v.literal("monitoring"),
);

const briefStatusValidator = v.union(
  v.literal("planned"),
  v.literal("assigned"),
  v.literal("in_progress"),
  v.literal("review"),
  v.literal("published"),
);

const contentTypeValidator = v.union(
  v.literal("pillar"),
  v.literal("cluster"),
  v.literal("support"),
);

const sectionTypeValidator = v.union(
  v.literal("intro"),
  v.literal("body"),
  v.literal("drill"),
  v.literal("faq"),
  v.literal("cta"),
);

// ═══════════════════════════════════════════════════════════
// PILLARS
// ═══════════════════════════════════════════════════════════

/**
 * List all content pillars
 */
export const listPillars = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("content_pillars")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

/**
 * Get pillar by slug
 */
export const getPillar = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("content_pillars")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

/**
 * Create a new content pillar
 */
export const createPillar = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    color: v.string(),
    primaryKeyword: v.string(),
    primaryKeywordVolume: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("content_pillars", {
      name: args.name,
      slug: args.slug,
      color: args.color,
      primaryKeyword: args.primaryKeyword,
      primaryKeywordVolume: args.primaryKeywordVolume,
      articleCount: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update pillar metrics (called when articles change)
 */
export const updatePillarMetrics = mutation({
  args: {
    pillarId: v.id("content_pillars"),
    articleCount: v.number(),
    totalTraffic: v.optional(v.number()),
    avgPosition: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.pillarId, {
      articleCount: args.articleCount,
      totalTraffic: args.totalTraffic,
      avgPosition: args.avgPosition,
      updatedAt: Date.now(),
    });
  },
});

// ═══════════════════════════════════════════════════════════
// KEYWORDS
// ═══════════════════════════════════════════════════════════

/**
 * List keywords with filters
 */
export const listKeywords = query({
  args: {
    pillar: v.optional(v.string()),
    status: v.optional(keywordStatusValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let keywordQuery;

    if (args.pillar) {
      keywordQuery = ctx.db
        .query("seo_keywords")
        .withIndex("by_pillar", (q) => q.eq("pillar", args.pillar!));
    } else if (args.status) {
      keywordQuery = ctx.db
        .query("seo_keywords")
        .withIndex("by_status", (q) => q.eq("status", args.status!));
    } else {
      keywordQuery = ctx.db.query("seo_keywords").withIndex("by_volume");
    }

    return await keywordQuery.order("desc").take(limit);
  },
});

/**
 * Get keyword by keyword text
 */
export const getKeyword = query({
  args: { keyword: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("seo_keywords")
      .withIndex("by_keyword", (q) => q.eq("keyword", args.keyword))
      .first();
  },
});

/**
 * Add a new keyword to track
 */
export const addKeyword = mutation({
  args: {
    keyword: v.string(),
    pillar: v.string(),
    volume: v.number(),
    difficulty: v.number(),
    cpc: v.optional(v.number()),
    clicks: v.optional(v.number()),
    position: v.optional(v.number()),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Determine initial status based on position
    const status = args.position
      ? "ranking"
      : args.difficulty <= 30 && args.volume >= 500
        ? "opportunity"
        : "target";

    return await ctx.db.insert("seo_keywords", {
      keyword: args.keyword,
      pillar: args.pillar,
      volume: args.volume,
      difficulty: args.difficulty,
      cpc: args.cpc,
      clicks: args.clicks,
      position: args.position,
      trend: "stable",
      priority: args.priority,
      status,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update keyword position (for rank tracking)
 */
export const updateKeywordPosition = mutation({
  args: {
    keywordId: v.id("seo_keywords"),
    position: v.optional(v.number()),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.keywordId);
    if (!existing) throw new Error("Keyword not found");

    // Calculate trend
    let trend: "up" | "down" | "stable" = "stable";
    if (existing.position && args.position) {
      if (args.position < existing.position) trend = "up";
      else if (args.position > existing.position) trend = "down";
    }

    // Update position history
    const history = existing.positionHistory || [];
    if (args.position) {
      history.push({ position: args.position, recordedAt: Date.now() });
      // Keep last 30 entries
      if (history.length > 30) history.shift();
    }

    // Update status
    const status = args.position ? "ranking" : existing.status;

    await ctx.db.patch(args.keywordId, {
      position: args.position,
      url: args.url,
      trend,
      status,
      positionHistory: history,
      lastPositionUpdate: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

/**
 * Bulk import keywords (from Ahrefs)
 */
export const bulkImportKeywords = mutation({
  args: {
    keywords: v.array(
      v.object({
        keyword: v.string(),
        pillar: v.string(),
        volume: v.number(),
        difficulty: v.number(),
        cpc: v.optional(v.number()),
        clicks: v.optional(v.number()),
        position: v.optional(v.number()),
        priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const results = [];

    for (const kw of args.keywords) {
      // Check if keyword already exists
      const existing = await ctx.db
        .query("seo_keywords")
        .withIndex("by_keyword", (q) => q.eq("keyword", kw.keyword))
        .first();

      if (existing) {
        // Update existing
        await ctx.db.patch(existing._id, {
          volume: kw.volume,
          difficulty: kw.difficulty,
          cpc: kw.cpc,
          clicks: kw.clicks,
          updatedAt: now,
        });
        results.push({ keyword: kw.keyword, action: "updated" });
      } else {
        // Create new
        const status = kw.position
          ? "ranking"
          : kw.difficulty <= 30 && kw.volume >= 500
            ? "opportunity"
            : "target";

        await ctx.db.insert("seo_keywords", {
          keyword: kw.keyword,
          pillar: kw.pillar,
          volume: kw.volume,
          difficulty: kw.difficulty,
          cpc: kw.cpc,
          clicks: kw.clicks,
          position: kw.position,
          trend: "stable",
          priority: kw.priority,
          status,
          createdAt: now,
          updatedAt: now,
        });
        results.push({ keyword: kw.keyword, action: "created" });
      }
    }

    return results;
  },
});

/**
 * Delete a keyword
 */
export const deleteKeyword = mutation({
  args: { keywordId: v.id("seo_keywords") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.keywordId);
  },
});

// ═══════════════════════════════════════════════════════════
// ARTICLE BRIEFS
// ═══════════════════════════════════════════════════════════

/**
 * List article briefs with filters
 */
export const listBriefs = query({
  args: {
    author: v.optional(authorValidator),
    status: v.optional(briefStatusValidator),
    pillar: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let briefQuery;

    if (args.author && args.status) {
      briefQuery = ctx.db
        .query("article_briefs")
        .withIndex("by_author_status", (q) =>
          q.eq("author", args.author!).eq("status", args.status!),
        );
    } else if (args.author) {
      briefQuery = ctx.db
        .query("article_briefs")
        .withIndex("by_author", (q) => q.eq("author", args.author!));
    } else if (args.status) {
      briefQuery = ctx.db
        .query("article_briefs")
        .withIndex("by_status", (q) => q.eq("status", args.status!));
    } else if (args.pillar) {
      briefQuery = ctx.db
        .query("article_briefs")
        .withIndex("by_pillar", (q) => q.eq("pillar", args.pillar!));
    } else {
      briefQuery = ctx.db.query("article_briefs");
    }

    return await briefQuery.order("desc").take(limit);
  },
});

/**
 * Get brief by slug
 */
export const getBrief = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("article_briefs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

/**
 * Get brief by ID
 */
export const getBriefById = query({
  args: { briefId: v.id("article_briefs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.briefId);
  },
});

/**
 * Create an article brief
 */
export const createBrief = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    targetKeyword: v.string(),
    secondaryKeywords: v.optional(v.array(v.string())),
    targetVolume: v.number(),
    pillar: v.string(),
    contentType: contentTypeValidator,
    author: authorValidator,
    outline: v.optional(v.string()),
    keyTakeaways: v.optional(v.array(v.string())),
    targetWordCount: v.optional(v.number()),
    internalLinks: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("article_briefs", {
      title: args.title,
      slug: args.slug,
      targetKeyword: args.targetKeyword,
      secondaryKeywords: args.secondaryKeywords,
      targetVolume: args.targetVolume,
      pillar: args.pillar,
      contentType: args.contentType,
      author: args.author,
      outline: args.outline,
      keyTakeaways: args.keyTakeaways,
      targetWordCount: args.targetWordCount,
      internalLinks: args.internalLinks,
      dueDate: args.dueDate,
      status: "planned",
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update brief status
 */
export const updateBriefStatus = mutation({
  args: {
    briefId: v.id("article_briefs"),
    status: briefStatusValidator,
    publishedUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.status === "published") {
      updates.publishedAt = Date.now();
      if (args.publishedUrl) {
        updates.publishedUrl = args.publishedUrl;
      }
    }

    await ctx.db.patch(args.briefId, updates);
  },
});

/**
 * Update brief content
 */
export const updateBrief = mutation({
  args: {
    briefId: v.id("article_briefs"),
    title: v.optional(v.string()),
    outline: v.optional(v.string()),
    keyTakeaways: v.optional(v.array(v.string())),
    targetWordCount: v.optional(v.number()),
    internalLinks: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { briefId, ...updates } = args;

    // Filter out undefined values
    const filteredUpdates: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        filteredUpdates[key] = value;
      }
    }

    await ctx.db.patch(briefId, filteredUpdates);
  },
});

/**
 * Delete a brief
 */
export const deleteBrief = mutation({
  args: { briefId: v.id("article_briefs") },
  handler: async (ctx, args) => {
    // Also delete associated draft
    const draft = await ctx.db
      .query("article_drafts")
      .withIndex("by_brief", (q) => q.eq("briefId", args.briefId))
      .first();

    if (draft) {
      await ctx.db.delete(draft._id);
    }

    await ctx.db.delete(args.briefId);
  },
});

// ═══════════════════════════════════════════════════════════
// ARTICLE DRAFTS (Voice Editing)
// ═══════════════════════════════════════════════════════════

/**
 * Get or create a draft for a brief
 */
export const getOrCreateDraft = mutation({
  args: {
    briefId: v.id("article_briefs"),
  },
  handler: async (ctx, args) => {
    // Check for existing draft
    const existing = await ctx.db
      .query("article_drafts")
      .withIndex("by_brief", (q) => q.eq("briefId", args.briefId))
      .first();

    if (existing) {
      return existing;
    }

    // Get the brief to create initial sections
    const brief = await ctx.db.get(args.briefId);
    if (!brief) throw new Error("Brief not found");

    // Create default sections based on content type
    const defaultSections = [
      { id: "intro", type: "intro" as const, title: "Introduction", content: "" },
      { id: "body-1", type: "body" as const, title: "Key Concepts", content: "" },
      { id: "body-2", type: "body" as const, title: "Training Approach", content: "" },
      { id: "drill-1", type: "drill" as const, title: "Drill 1", content: "" },
      { id: "drill-2", type: "drill" as const, title: "Drill 2", content: "" },
      { id: "faq", type: "faq" as const, title: "FAQs", content: "" },
      { id: "cta", type: "cta" as const, title: "Call to Action", content: "" },
    ];

    const now = Date.now();
    const draftId = await ctx.db.insert("article_drafts", {
      briefId: args.briefId,
      author: brief.author,
      sections: defaultSections,
      wordCount: 0,
      completedSections: 0,
      totalSections: defaultSections.length,
      lastSavedAt: now,
      isDirty: false,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(draftId);
  },
});

/**
 * Get draft by brief ID
 */
export const getDraftByBrief = query({
  args: { briefId: v.id("article_briefs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("article_drafts")
      .withIndex("by_brief", (q) => q.eq("briefId", args.briefId))
      .first();
  },
});

/**
 * Update a section's content (auto-save)
 */
export const updateSection = mutation({
  args: {
    draftId: v.id("article_drafts"),
    sectionId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const draft = await ctx.db.get(args.draftId);
    if (!draft) throw new Error("Draft not found");

    const now = Date.now();
    const updatedSections = draft.sections.map((s) =>
      s.id === args.sectionId ? { ...s, content: args.content, lastEditedAt: now } : s,
    );

    // Calculate word count
    const wordCount = updatedSections.reduce((sum, s) => {
      return sum + (s.content.split(/\s+/).filter(Boolean).length || 0);
    }, 0);

    // Count completed sections (with content)
    const completedSections = updatedSections.filter((s) => s.content.length > 0).length;

    await ctx.db.patch(args.draftId, {
      sections: updatedSections,
      wordCount,
      completedSections,
      lastSavedAt: now,
      isDirty: false,
      updatedAt: now,
    });
  },
});

/**
 * Add a new section to the draft
 */
export const addSection = mutation({
  args: {
    draftId: v.id("article_drafts"),
    type: sectionTypeValidator,
    title: v.string(),
    afterSectionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const draft = await ctx.db.get(args.draftId);
    if (!draft) throw new Error("Draft not found");

    const newSection = {
      id: `${args.type}-${Date.now()}`,
      type: args.type,
      title: args.title,
      content: "",
    };

    let updatedSections;
    if (args.afterSectionId) {
      const index = draft.sections.findIndex((s) => s.id === args.afterSectionId);
      updatedSections = [
        ...draft.sections.slice(0, index + 1),
        newSection,
        ...draft.sections.slice(index + 1),
      ];
    } else {
      updatedSections = [...draft.sections, newSection];
    }

    await ctx.db.patch(args.draftId, {
      sections: updatedSections,
      totalSections: updatedSections.length,
      updatedAt: Date.now(),
    });

    return newSection.id;
  },
});

/**
 * Remove a section
 */
export const removeSection = mutation({
  args: {
    draftId: v.id("article_drafts"),
    sectionId: v.string(),
  },
  handler: async (ctx, args) => {
    const draft = await ctx.db.get(args.draftId);
    if (!draft) throw new Error("Draft not found");

    const updatedSections = draft.sections.filter((s) => s.id !== args.sectionId);
    const completedSections = updatedSections.filter((s) => s.content.length > 0).length;

    await ctx.db.patch(args.draftId, {
      sections: updatedSections,
      completedSections,
      totalSections: updatedSections.length,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Update voice metadata
 */
export const updateVoiceMetadata = mutation({
  args: {
    draftId: v.id("article_drafts"),
    voiceProvider: v.union(v.literal("groq"), v.literal("deepgram"), v.literal("browser")),
    minutesAdded: v.number(),
  },
  handler: async (ctx, args) => {
    const draft = await ctx.db.get(args.draftId);
    if (!draft) throw new Error("Draft not found");

    const totalMinutes = (draft.totalVoiceMinutes || 0) + args.minutesAdded;

    await ctx.db.patch(args.draftId, {
      voiceProvider: args.voiceProvider,
      totalVoiceMinutes: totalMinutes,
      updatedAt: Date.now(),
    });
  },
});

// ═══════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════

/**
 * Get content strategy dashboard stats
 */
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    // Get all keywords
    const keywords = await ctx.db.query("seo_keywords").collect();
    const rankingKeywords = keywords.filter((k) => k.position !== null);
    const totalVolume = keywords.reduce((sum, k) => sum + k.volume, 0);

    // Get all briefs
    const briefs = await ctx.db.query("article_briefs").collect();
    const publishedBriefs = briefs.filter((b) => b.status === "published");
    const plannedBriefs = briefs.filter((b) => b.status === "planned");
    const inProgressBriefs = briefs.filter((b) => b.status === "in_progress");

    // Get pillars
    const pillars = await ctx.db
      .query("content_pillars")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    // Calculate pillar stats
    const pillarStats = await Promise.all(
      pillars.map(async (pillar) => {
        const pillarKeywords = keywords.filter((k) => k.pillar === pillar.name);
        const pillarBriefs = briefs.filter((b) => b.pillar === pillar.name);
        const publishedCount = pillarBriefs.filter((b) => b.status === "published").length;
        const avgPosition =
          pillarKeywords.filter((k) => k.position).reduce((sum, k) => sum + (k.position || 0), 0) /
            (pillarKeywords.filter((k) => k.position).length || 1) || 0;

        return {
          ...pillar,
          articleCount: publishedCount,
          keywordCount: pillarKeywords.length,
          avgPosition: avgPosition > 0 ? avgPosition : null,
        };
      }),
    );

    return {
      keywords: {
        total: keywords.length,
        ranking: rankingKeywords.length,
        totalVolume,
        opportunities: keywords.filter((k) => k.status === "opportunity").length,
      },
      content: {
        total: briefs.length,
        published: publishedBriefs.length,
        planned: plannedBriefs.length,
        inProgress: inProgressBriefs.length,
        byAuthor: {
          james: briefs.filter((b) => b.author === "james").length,
          adam: briefs.filter((b) => b.author === "adam").length,
        },
      },
      pillars: pillarStats,
    };
  },
});
