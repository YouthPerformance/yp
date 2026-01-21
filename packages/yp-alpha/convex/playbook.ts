// ═══════════════════════════════════════════════════════════
// PLAYBOOK CONTENT FACTORY
// CRUD operations for AI-generated content with expert voice
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// ─────────────────────────────────────────────────────────────
// TYPE VALIDATORS
// ─────────────────────────────────────────────────────────────

const authorValidator = v.union(
  v.literal("JAMES"),
  v.literal("ADAM"),
  v.literal("YP"),
  v.literal("TEAM_YP"),
);

const contentTypeValidator = v.union(
  v.literal("pillar"),
  v.literal("topic"),
  v.literal("qa"),
  v.literal("drill"),
);

const statusValidator = v.union(
  v.literal("DRAFT"),
  v.literal("IN_REVIEW"),
  v.literal("CHANGES_REQUESTED"),
  v.literal("APPROVED"),
  v.literal("PUBLISHED"),
);

// ─────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Create a new playbook content item
 */
export const createContent = mutation({
  args: {
    slug: v.string(),
    contentType: contentTypeValidator,
    author: authorValidator,
    category: v.string(),
    subcategory: v.optional(v.string()),
    targetAge: v.optional(v.number()),
    targetSport: v.optional(v.string()),
    title: v.string(),
    frontmatter: v.any(),
    body: v.string(),
    generationModel: v.optional(v.string()),
    promptTokens: v.optional(v.number()),
    completionTokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const contentId = await ctx.db.insert("playbook_content", {
      slug: args.slug,
      contentType: args.contentType,
      author: args.author,
      category: args.category,
      subcategory: args.subcategory,
      targetAge: args.targetAge,
      targetSport: args.targetSport,
      title: args.title,
      frontmatter: args.frontmatter,
      body: args.body,
      status: "DRAFT",
      version: 1,
      generationModel: args.generationModel,
      promptTokens: args.promptTokens,
      completionTokens: args.completionTokens,
      createdAt: now,
      updatedAt: now,
    });

    return { contentId };
  },
});

/**
 * Update content body (for voice iteration edits)
 */
export const updateContent = mutation({
  args: {
    contentId: v.id("playbook_content"),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    frontmatter: v.optional(v.any()),
    iterationNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.contentId);
    if (!existing) throw new Error("Content not found");

    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
      version: existing.version + 1,
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.body !== undefined) updates.body = args.body;
    if (args.frontmatter !== undefined) updates.frontmatter = args.frontmatter;
    if (args.iterationNotes !== undefined) updates.iterationNotes = args.iterationNotes;

    await ctx.db.patch(args.contentId, updates);
  },
});

/**
 * Update content status (DRAFT → IN_REVIEW → APPROVED, etc.)
 */
export const updateStatus = mutation({
  args: {
    contentId: v.id("playbook_content"),
    status: statusValidator,
    changesRequested: v.optional(v.string()),
    approverNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.contentId);
    if (!existing) throw new Error("Content not found");

    const updates: Record<string, unknown> = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.changesRequested !== undefined) {
      updates.changesRequested = args.changesRequested;
    }

    if (args.status === "APPROVED") {
      updates.approvedAt = Date.now();
      updates.approvedBy = existing.author;
      if (args.approverNotes !== undefined) {
        updates.approverNotes = args.approverNotes;
      }
    }

    if (args.status === "PUBLISHED") {
      updates.publishedAt = Date.now();
    }

    await ctx.db.patch(args.contentId, updates);
  },
});

/**
 * Approve content (shorthand for updateStatus)
 */
export const approveContent = mutation({
  args: {
    contentId: v.id("playbook_content"),
    approverNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.contentId);
    if (!existing) throw new Error("Content not found");

    await ctx.db.patch(args.contentId, {
      status: "APPROVED",
      approvedAt: Date.now(),
      approvedBy: existing.author,
      approverNotes: args.approverNotes,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Request changes to content
 */
export const requestChanges = mutation({
  args: {
    contentId: v.id("playbook_content"),
    changesRequested: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.contentId, {
      status: "CHANGES_REQUESTED",
      changesRequested: args.changesRequested,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Delete content
 */
export const deleteContent = mutation({
  args: {
    contentId: v.id("playbook_content"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.contentId);
  },
});

/**
 * Save a voice example (for learning)
 */
export const saveVoiceExample = mutation({
  args: {
    expert: v.union(v.literal("JAMES"), v.literal("ADAM"), v.literal("TEAM_YP")),
    exampleType: v.union(v.literal("approved"), v.literal("rejected")),
    contentSnippet: v.string(),
    fullContentId: v.optional(v.id("playbook_content")),
    category: v.string(),
    contentType: v.string(),
    feedback: v.optional(v.string()),
    correctedVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("expert_voice_examples", {
      expert: args.expert,
      exampleType: args.exampleType,
      contentSnippet: args.contentSnippet,
      fullContentId: args.fullContentId,
      category: args.category,
      contentType: args.contentType,
      feedback: args.feedback,
      correctedVersion: args.correctedVersion,
      createdAt: Date.now(),
    });
  },
});

/**
 * Capture lead email and send Bulletproof Ankles PDF
 * Used by marketing LP for lead magnet funnel
 */
export const captureLeadAndSendPDF = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // 1. Check if email already captured
    const existing = await ctx.db
      .query("emailCaptures")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return { success: true, isExisting: true, entryId: existing._id };
    }

    // 2. Create email capture entry
    const entryId = await ctx.db.insert("emailCaptures", {
      email: args.email,
      source: args.source ?? "marketing-lp-bulletproof",
      capturedAt: Date.now(),
      rewardUnlocked: "bulletproof-ankles-pdf",
      metadata: args.metadata,
    });

    // 3. Schedule PDF delivery email
    await ctx.scheduler.runAfter(0, internal.emails.sendBulletproofAnklesPDF, {
      to: args.email,
    });

    return { success: true, isExisting: false, entryId };
  },
});

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Get a single content item by ID
 */
export const getContent = query({
  args: {
    contentId: v.id("playbook_content"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contentId);
  },
});

/**
 * Get content by slug
 */
export const getContentBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("playbook_content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

/**
 * List content with filters
 */
export const listContent = query({
  args: {
    author: v.optional(authorValidator),
    status: v.optional(statusValidator),
    contentType: v.optional(contentTypeValidator),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let contentQuery;

    if (args.author && args.status) {
      contentQuery = ctx.db
        .query("playbook_content")
        .withIndex("by_author_status", (q) =>
          q.eq("author", args.author!).eq("status", args.status!),
        );
    } else if (args.author) {
      contentQuery = ctx.db
        .query("playbook_content")
        .withIndex("by_author", (q) => q.eq("author", args.author!));
    } else if (args.status) {
      contentQuery = ctx.db
        .query("playbook_content")
        .withIndex("by_status", (q) => q.eq("status", args.status!));
    } else if (args.contentType) {
      contentQuery = ctx.db
        .query("playbook_content")
        .withIndex("by_content_type", (q) => q.eq("contentType", args.contentType!));
    } else if (args.category) {
      contentQuery = ctx.db
        .query("playbook_content")
        .withIndex("by_category", (q) => q.eq("category", args.category!));
    } else {
      contentQuery = ctx.db.query("playbook_content").withIndex("by_created");
    }

    return await contentQuery.order("desc").take(limit);
  },
});

/**
 * Get content stats for dashboard
 */
export const getContentStats = query({
  args: {
    author: v.optional(authorValidator),
  },
  handler: async (ctx, args) => {
    let all;

    if (args.author) {
      all = await ctx.db
        .query("playbook_content")
        .withIndex("by_author", (q) => q.eq("author", args.author!))
        .collect();
    } else {
      all = await ctx.db.query("playbook_content").collect();
    }

    const stats = {
      total: all.length,
      draft: 0,
      inReview: 0,
      changesRequested: 0,
      approved: 0,
      published: 0,
      byAuthor: {} as Record<string, number>,
      byContentType: {} as Record<string, number>,
    };

    for (const content of all) {
      // Count by status
      switch (content.status) {
        case "DRAFT":
          stats.draft++;
          break;
        case "IN_REVIEW":
          stats.inReview++;
          break;
        case "CHANGES_REQUESTED":
          stats.changesRequested++;
          break;
        case "APPROVED":
          stats.approved++;
          break;
        case "PUBLISHED":
          stats.published++;
          break;
      }

      // Count by author
      stats.byAuthor[content.author] = (stats.byAuthor[content.author] || 0) + 1;

      // Count by content type
      stats.byContentType[content.contentType] =
        (stats.byContentType[content.contentType] || 0) + 1;
    }

    return stats;
  },
});

/**
 * Get voice examples for a specific expert
 */
export const getVoiceExamples = query({
  args: {
    expert: v.union(v.literal("JAMES"), v.literal("ADAM"), v.literal("TEAM_YP")),
    exampleType: v.optional(v.union(v.literal("approved"), v.literal("rejected"))),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    let query;

    if (args.exampleType) {
      query = ctx.db
        .query("expert_voice_examples")
        .withIndex("by_expert_type", (q) =>
          q.eq("expert", args.expert).eq("exampleType", args.exampleType!),
        );
    } else if (args.category) {
      query = ctx.db
        .query("expert_voice_examples")
        .withIndex("by_expert_category", (q) =>
          q.eq("expert", args.expert).eq("category", args.category!),
        );
    } else {
      query = ctx.db
        .query("expert_voice_examples")
        .withIndex("by_expert", (q) => q.eq("expert", args.expert));
    }

    return await query.order("desc").take(limit);
  },
});
