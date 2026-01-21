// ============================================================================
// CONTENT PIPELINE - Agentic CMS
// The production line: Discover → Research → Draft → Review → Publish
// Humans approve patterns and representations, not individual outputs at scale
// ============================================================================

import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

// =============================================================================
// CONTENT QUEUE MANAGEMENT
// =============================================================================

/**
 * Add keyword to content queue
 */
export const addToQueue = mutation({
  args: {
    keyword: v.string(),
    searchVolume: v.optional(v.number()),
    difficulty: v.optional(v.number()),
    source: v.string(),
    targetEntityType: v.string(),
    sport: v.string(),
    skill: v.optional(v.string()),
    priority: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if keyword already exists
    const existing = await ctx.db
      .query("contentQueue")
      .filter((q) => q.eq(q.field("keyword"), args.keyword))
      .first();

    if (existing) {
      // Update priority if higher
      if (args.priority > existing.priority) {
        await ctx.db.patch(existing._id, {
          priority: args.priority,
          updatedAt: now,
        });
      }
      return existing._id;
    }

    return await ctx.db.insert("contentQueue", {
      ...args,
      stage: "queued",
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Bulk add keywords (from Ahrefs export, etc.)
 */
export const bulkAddToQueue = mutation({
  args: {
    items: v.array(
      v.object({
        keyword: v.string(),
        searchVolume: v.optional(v.number()),
        difficulty: v.optional(v.number()),
        source: v.string(),
        targetEntityType: v.string(),
        sport: v.string(),
        skill: v.optional(v.string()),
        priority: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const added: string[] = [];

    for (const item of args.items) {
      const existing = await ctx.db
        .query("contentQueue")
        .filter((q) => q.eq(q.field("keyword"), item.keyword))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("contentQueue", {
          ...item,
          stage: "queued",
          createdAt: now,
          updatedAt: now,
        });
        added.push(id);
      }
    }

    return { added: added.length, total: args.items.length };
  },
});

/**
 * Get queue items by stage
 */
export const getByStage = query({
  args: {
    stage: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contentQueue")
      .withIndex("by_stage_priority", (q) => q.eq("stage", args.stage))
      .take(args.limit || 50);
  },
});

/**
 * Get next item to process
 */
export const getNextToProcess = query({
  args: {
    stage: v.string(),
  },
  handler: async (ctx, args) => {
    // Get highest priority item in this stage
    const items = await ctx.db
      .query("contentQueue")
      .withIndex("by_stage_priority", (q) => q.eq("stage", args.stage))
      .take(10);

    // Sort by priority (highest first)
    items.sort((a, b) => b.priority - a.priority);

    return items[0] || null;
  },
});

/**
 * Get items pending human review
 */
export const getPendingReview = query({
  args: {
    reviewerDomain: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("contentQueue")
      .withIndex("by_stage", (q) => q.eq("stage", "review"))
      .take(args.limit || 50);

    // Filter by reviewer domain if specified
    if (args.reviewerDomain) {
      return items.filter(
        (item) =>
          item.safetyOutput?.reviewerDomain === args.reviewerDomain
      );
    }

    return items;
  },
});

// =============================================================================
// PIPELINE STAGE TRANSITIONS
// =============================================================================

/**
 * Move to planning stage (Content Planner Agent output)
 */
export const completePlanning = mutation({
  args: {
    id: v.id("contentQueue"),
    output: v.object({
      contentType: v.string(),
      headOrTail: v.string(),
      uniquenessAssessment: v.string(),
      recommendedAuthor: v.string(),
      competitorAnalysis: v.array(
        v.object({
          url: v.string(),
          strengths: v.array(v.string()),
          gaps: v.array(v.string()),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.patch(args.id, {
      stage: "researching",
      planningOutput: {
        ...args.output,
        completedAt: now,
      },
      updatedAt: now,
    });

    return args.id;
  },
});

/**
 * Move to drafting stage (Research Agent output)
 */
export const completeResearch = mutation({
  args: {
    id: v.id("contentQueue"),
    output: v.object({
      relatedQuestions: v.array(v.string()),
      suggestedStudies: v.array(v.string()),
      expertQuotes: v.array(v.string()),
      safetyConsiderations: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.patch(args.id, {
      stage: "drafting",
      researchOutput: {
        ...args.output,
        completedAt: now,
      },
      updatedAt: now,
    });

    return args.id;
  },
});

/**
 * Move to safety review (Draft Generator Agent output)
 */
export const completeDraft = mutation({
  args: {
    id: v.id("contentQueue"),
    output: v.object({
      generatedContent: v.any(),
      model: v.string(),
      promptVersion: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.patch(args.id, {
      stage: "safety_check",
      draftOutput: {
        ...args.output,
        generatedAt: now,
      },
      updatedAt: now,
    });

    return args.id;
  },
});

/**
 * Complete safety check (Evidence + Safety Agent output)
 */
export const completeSafetyCheck = mutation({
  args: {
    id: v.id("contentQueue"),
    output: v.object({
      safetyLevel: v.union(
        v.literal("safe_autopublish"),
        v.literal("requires_human_review"),
        v.literal("blocked")
      ),
      flags: v.array(v.string()),
      requiredDisclaimers: v.array(v.string()),
      requiresExpertReview: v.boolean(),
      reviewerDomain: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Determine next stage based on safety level
    let nextStage = "seo_packaging";
    if (args.output.safetyLevel === "requires_human_review") {
      nextStage = "review";
    } else if (args.output.safetyLevel === "blocked") {
      nextStage = "blocked";
    }

    await ctx.db.patch(args.id, {
      stage: nextStage,
      safetyOutput: {
        ...args.output,
        completedAt: now,
      },
      updatedAt: now,
    });

    return args.id;
  },
});

/**
 * Complete SEO packaging (SEO Packager Agent output)
 */
export const completeSeoPackaging = mutation({
  args: {
    id: v.id("contentQueue"),
    output: v.object({
      title: v.string(),
      metaDescription: v.string(),
      targetKeyword: v.string(),
      secondaryKeywords: v.array(v.string()),
      internalLinks: v.array(
        v.object({
          anchorText: v.string(),
          targetSlug: v.string(),
        })
      ),
      schemaType: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if human review is still required
    const item = await ctx.db.get(args.id);
    const nextStage =
      item?.safetyOutput?.requiresExpertReview ? "review" : "ready_to_publish";

    await ctx.db.patch(args.id, {
      stage: nextStage,
      seoOutput: {
        ...args.output,
        completedAt: now,
      },
      updatedAt: now,
    });

    return args.id;
  },
});

// =============================================================================
// HUMAN REVIEW
// =============================================================================

/**
 * Submit human review
 */
export const submitReview = mutation({
  args: {
    id: v.id("contentQueue"),
    reviewerId: v.id("authors"),
    status: v.union(
      v.literal("approved"),
      v.literal("changes_requested"),
      v.literal("rejected")
    ),
    feedback: v.optional(v.string()),
    changesRequested: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    let nextStage = "ready_to_publish";
    if (args.status === "changes_requested") {
      nextStage = "drafting"; // Go back to drafting
    } else if (args.status === "rejected") {
      nextStage = "rejected";
    }

    await ctx.db.patch(args.id, {
      stage: nextStage,
      review: {
        reviewerId: args.reviewerId,
        status: args.status,
        feedback: args.feedback,
        changesRequested: args.changesRequested,
        reviewedAt: now,
      },
      updatedAt: now,
    });

    return args.id;
  },
});

// =============================================================================
// PUBLISHING
// =============================================================================

/**
 * Publish content (creates the actual entity)
 */
export const publish = mutation({
  args: {
    id: v.id("contentQueue"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Queue item not found");
    }

    if (item.stage !== "ready_to_publish") {
      throw new Error("Item is not ready to publish");
    }

    if (!item.draftOutput?.generatedContent) {
      throw new Error("No content to publish");
    }

    const now = Date.now();
    let publishedEntityId: string | undefined;

    // Create the entity based on type
    switch (item.targetEntityType) {
      case "drill":
        // Would create drill here
        // publishedEntityId = await ctx.db.insert("drills", item.draftOutput.generatedContent);
        break;
      case "guide":
        // Would create guide here
        break;
      case "qna":
        // Would create Q&A here
        break;
      case "protocol":
        // Would create protocol here
        break;
    }

    // Update queue item
    await ctx.db.patch(args.id, {
      stage: "published",
      publishedEntityId,
      publishedEntityType: item.targetEntityType,
      publishedAt: now,
      publishedUrl: `https://playbook.youthperformance.com/${item.sport}/${item.skill || ""}/${item.keyword.replace(/\s+/g, "-").toLowerCase()}`,
      updatedAt: now,
    });

    return { id: args.id, publishedEntityId };
  },
});

// =============================================================================
// APPROVAL PATTERNS
// =============================================================================

/**
 * Create an approval pattern (James/Adam approves a template)
 */
export const createApprovalPattern = mutation({
  args: {
    name: v.string(),
    entityType: v.string(),
    sport: v.string(),
    category: v.optional(v.string()),
    ageBand: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        label: v.string(),
      })
    ),
    requiredFields: v.array(v.string()),
    requiredSafetyNotes: v.array(v.string()),
    requiredDisclaimers: v.array(v.string()),
    uxPattern: v.object({
      componentOrder: v.array(v.string()),
      mobileLayout: v.string(),
    }),
    voiceConstraints: v.object({
      authorId: v.id("authors"),
      requiredPhrases: v.array(v.string()),
      forbiddenPhrases: v.array(v.string()),
    }),
    approvedBy: v.id("authors"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("approvalPatterns", {
      ...args,
      approvedAt: now,
      timesUsed: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Get matching approval pattern for content
 */
export const getMatchingPattern = query({
  args: {
    entityType: v.string(),
    sport: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patterns = await ctx.db
      .query("approvalPatterns")
      .withIndex("by_entity_type", (q) => q.eq("entityType", args.entityType))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Find best matching pattern
    for (const pattern of patterns) {
      if (pattern.sport === args.sport) {
        if (!args.category || pattern.category === args.category) {
          return pattern;
        }
      }
    }

    return null;
  },
});

/**
 * Increment pattern usage
 */
export const incrementPatternUsage = mutation({
  args: { id: v.id("approvalPatterns") },
  handler: async (ctx, args) => {
    const pattern = await ctx.db.get(args.id);
    if (!pattern) return;

    await ctx.db.patch(args.id, {
      timesUsed: pattern.timesUsed + 1,
      lastUsedAt: Date.now(),
    });
  },
});

// =============================================================================
// ANALYTICS
// =============================================================================

/**
 * Get pipeline statistics
 */
export const getPipelineStats = query({
  args: {},
  handler: async (ctx) => {
    const allItems = await ctx.db.query("contentQueue").collect();

    const byStage: Record<string, number> = {};
    const bySport: Record<string, number> = {};
    const byType: Record<string, number> = {};

    for (const item of allItems) {
      byStage[item.stage] = (byStage[item.stage] || 0) + 1;
      bySport[item.sport] = (bySport[item.sport] || 0) + 1;
      byType[item.targetEntityType] = (byType[item.targetEntityType] || 0) + 1;
    }

    // Calculate averages
    const publishedItems = allItems.filter((i) => i.stage === "published");
    const avgTimeToPublish =
      publishedItems.length > 0
        ? publishedItems.reduce(
            (sum, i) => sum + ((i.publishedAt || 0) - i.createdAt),
            0
          ) / publishedItems.length
        : 0;

    return {
      total: allItems.length,
      byStage,
      bySport,
      byType,
      avgTimeToPublishMs: avgTimeToPublish,
      avgTimeToPublishDays: avgTimeToPublish / (1000 * 60 * 60 * 24),
      pendingReview: byStage["review"] || 0,
      readyToPublish: byStage["ready_to_publish"] || 0,
      published: byStage["published"] || 0,
    };
  },
});
