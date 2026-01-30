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
 * Update playbook content (comprehensive update for Command Center)
 * Handles body, status, and approval tier updates
 */
export const updatePlaybookContent = mutation({
  args: {
    id: v.id("playbook_content"),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("DRAFT"),
      v.literal("IN_REVIEW"),
      v.literal("CHANGES_REQUESTED"),
      v.literal("APPROVED"),
      v.literal("PUBLISHED"),
      v.literal("published"),
      v.literal("rejected"),
    )),
    approvalTier: v.optional(v.union(v.literal("green"), v.literal("yellow"), v.literal("red"))),
    voiceComplianceScore: v.optional(v.number()),
    spotCheckRequired: v.optional(v.boolean()),
    approverNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Content not found");

    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.body !== undefined) {
      updates.body = args.body;
      updates.version = (existing.version || 0) + 1;
    }
    if (args.status !== undefined) {
      // Normalize status to uppercase
      const normalizedStatus = args.status === "published" ? "PUBLISHED" :
                               args.status === "rejected" ? "CHANGES_REQUESTED" :
                               args.status;
      updates.status = normalizedStatus;

      if (normalizedStatus === "PUBLISHED") {
        updates.publishedAt = Date.now();
      } else if (normalizedStatus === "APPROVED") {
        updates.approvedAt = Date.now();
      }
    }
    if (args.approvalTier !== undefined) updates.approvalTier = args.approvalTier;
    if (args.voiceComplianceScore !== undefined) updates.voiceComplianceScore = args.voiceComplianceScore;
    if (args.spotCheckRequired !== undefined) updates.spotCheckRequired = args.spotCheckRequired;
    if (args.approverNotes !== undefined) updates.approverNotes = args.approverNotes;

    await ctx.db.patch(args.id, updates);

    return { success: true };
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

// ═══════════════════════════════════════════════════════════
// VOICE COMMAND CENTER - LEARNING & ROUTING
// ═══════════════════════════════════════════════════════════

/**
 * Save a voice learning (edit) for future training
 * THE MOAT: Every voice edit becomes training data
 */
export const saveLearning = mutation({
  args: {
    expert: v.union(v.literal("JAMES"), v.literal("ADAM")),
    contentType: v.string(),
    category: v.string(),
    originalText: v.string(),
    voiceInstruction: v.string(),
    correctedText: v.string(),
    audioStorageId: v.optional(v.id("_storage")),
    audioDurationMs: v.optional(v.number()),
    selectedContext: v.optional(v.string()),
    contentId: v.optional(v.id("playbook_content")),
    applied: v.boolean(),
  },
  handler: async (ctx, args) => {
    const learningId = await ctx.db.insert("voice_learnings", {
      expert: args.expert,
      contentType: args.contentType,
      category: args.category,
      originalText: args.originalText,
      voiceInstruction: args.voiceInstruction,
      correctedText: args.correctedText,
      audioStorageId: args.audioStorageId,
      audioDurationMs: args.audioDurationMs,
      selectedContext: args.selectedContext,
      contentId: args.contentId,
      applied: args.applied,
      createdAt: Date.now(),
    });

    return { learningId };
  },
});

/**
 * Get similar past edits for few-shot injection
 * Used to show the AI how this expert typically edits
 */
export const getSimilarLearnings = query({
  args: {
    expert: v.union(v.literal("JAMES"), v.literal("ADAM")),
    category: v.string(),
    contentType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;

    // First try to get examples from same category
    let learnings = await ctx.db
      .query("voice_learnings")
      .withIndex("by_expert_category", (q) =>
        q.eq("expert", args.expert).eq("category", args.category),
      )
      .filter((q) => q.eq(q.field("applied"), true))
      .order("desc")
      .take(limit);

    // If not enough, supplement with any applied edits from this expert
    if (learnings.length < limit) {
      const remaining = limit - learnings.length;
      const existingIds = new Set(learnings.map((l) => l._id));

      const moreLearnings = await ctx.db
        .query("voice_learnings")
        .withIndex("by_expert", (q) => q.eq("expert", args.expert))
        .filter((q) => q.eq(q.field("applied"), true))
        .order("desc")
        .take(remaining + learnings.length);

      for (const learning of moreLearnings) {
        if (!existingIds.has(learning._id) && learnings.length < limit) {
          learnings.push(learning);
        }
      }
    }

    return learnings;
  },
});

/**
 * Score and route content based on voice compliance
 * Used for auto-routing: green (auto-approve), yellow (review), red (reject)
 */
export const scoreAndRouteContent = mutation({
  args: {
    contentId: v.id("playbook_content"),
    voiceComplianceScore: v.number(), // 0-100
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.contentId);
    if (!existing) throw new Error("Content not found");

    // Determine tier based on score
    let approvalTier: "green" | "yellow" | "red";
    if (args.voiceComplianceScore >= 85) {
      approvalTier = "green";
    } else if (args.voiceComplianceScore >= 65) {
      approvalTier = "yellow";
    } else {
      approvalTier = "red";
    }

    // Random spot check for green tier (10% of green content)
    const spotCheckRequired = approvalTier === "green" && Math.random() < 0.1;

    await ctx.db.patch(args.contentId, {
      voiceComplianceScore: args.voiceComplianceScore,
      approvalTier,
      spotCheckRequired,
      updatedAt: Date.now(),
    });

    return { approvalTier, spotCheckRequired };
  },
});

/**
 * List content for Command Center review
 * Filtered by approval tier and status
 */
export const listContentForReview = query({
  args: {
    approvalTier: v.optional(v.union(v.literal("green"), v.literal("yellow"), v.literal("red"))),
    status: v.optional(v.union(
      v.literal("DRAFT"),
      v.literal("IN_REVIEW"),
      v.literal("CHANGES_REQUESTED"),
      v.literal("APPROVED"),
      v.literal("PUBLISHED"),
    )),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 8; // Default to 8 cards for grid

    // Get all content that needs review (not published)
    let contentQuery;

    if (args.approvalTier) {
      contentQuery = ctx.db
        .query("playbook_content")
        .withIndex("by_approval_tier", (q) =>
          q.eq("approvalTier", args.approvalTier!),
        );
    } else if (args.status) {
      contentQuery = ctx.db
        .query("playbook_content")
        .withIndex("by_status", (q) => q.eq("status", args.status!));
    } else {
      // Default: get all non-published content
      contentQuery = ctx.db
        .query("playbook_content")
        .withIndex("by_created");
    }

    const results = await contentQuery.order("desc").take(limit + 1);

    // Check if there are more results
    const hasMore = results.length > limit;
    const content = hasMore ? results.slice(0, limit) : results;

    return {
      content,
      hasMore,
      nextCursor: hasMore ? content[content.length - 1]?._id : undefined,
    };
  },
});

/**
 * Get review stats for Command Center dashboard
 */
export const getReviewStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("playbook_content").collect();

    const stats = {
      total: all.length,
      pending: 0,
      today: 0,
      byTier: {
        green: 0,
        yellow: 0,
        red: 0,
        unscored: 0,
      },
      byStatus: {
        draft: 0,
        inReview: 0,
        changesRequested: 0,
        approved: 0,
        published: 0,
      },
    };

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayMs = todayStart.getTime();

    for (const content of all) {
      // Count by status
      switch (content.status) {
        case "DRAFT":
          stats.byStatus.draft++;
          stats.pending++;
          break;
        case "IN_REVIEW":
          stats.byStatus.inReview++;
          stats.pending++;
          break;
        case "CHANGES_REQUESTED":
          stats.byStatus.changesRequested++;
          stats.pending++;
          break;
        case "APPROVED":
          stats.byStatus.approved++;
          break;
        case "PUBLISHED":
          stats.byStatus.published++;
          break;
      }

      // Count by tier
      if (content.approvalTier === "green") {
        stats.byTier.green++;
      } else if (content.approvalTier === "yellow") {
        stats.byTier.yellow++;
      } else if (content.approvalTier === "red") {
        stats.byTier.red++;
      } else {
        stats.byTier.unscored++;
      }

      // Count today's approved
      if (content.approvedAt && content.approvedAt >= todayMs) {
        stats.today++;
      }
    }

    return stats;
  },
});

/**
 * Bulk update content status (for quick approve/reject)
 */
export const bulkUpdateStatus = mutation({
  args: {
    contentIds: v.array(v.id("playbook_content")),
    status: v.union(
      v.literal("DRAFT"),
      v.literal("IN_REVIEW"),
      v.literal("CHANGES_REQUESTED"),
      v.literal("APPROVED"),
      v.literal("PUBLISHED"),
    ),
    approvedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    for (const contentId of args.contentIds) {
      const updates: Record<string, unknown> = {
        status: args.status,
        updatedAt: now,
      };

      if (args.status === "APPROVED") {
        updates.approvedAt = now;
        updates.approvedBy = args.approvedBy;
      }

      if (args.status === "PUBLISHED") {
        updates.publishedAt = now;
      }

      await ctx.db.patch(contentId, updates);
    }

    return { updated: args.contentIds.length };
  },
});
