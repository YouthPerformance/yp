// ============================================================================
// DRILLS - The Core Content Unit
// Atomic, structured, ready for programmatic SEO & AI retrieval
// ============================================================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Reusable validators
const ageBandValidator = v.object({
  min: v.number(),
  max: v.number(),
  label: v.string(),
});

const stepValidator = v.object({
  position: v.number(),
  title: v.optional(v.string()),
  instruction: v.string(),
  durationSeconds: v.optional(v.number()),
  coachingCues: v.array(v.string()),
  visualCue: v.optional(v.string()),
  feelCue: v.optional(v.string()),
  commonMistake: v.optional(v.string()),
  mistakeFix: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  videoTimestamp: v.optional(v.number()),
});

const faqItemValidator = v.object({
  question: v.string(),
  answer: v.string(),
});

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get all published drills
 */
export const listPublished = query({
  args: {
    sport: v.optional(v.string()),
    skill: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("drills")
      .withIndex("by_status", (q) => q.eq("status", "published"));

    const drills = await q.collect();

    // Filter by sport and skill if provided
    let filtered = drills;
    if (args.sport) {
      filtered = filtered.filter((d) => d.sport === args.sport);
    }
    if (args.skill) {
      filtered = filtered.filter((d) => d.skill === args.skill);
    }

    // Apply limit
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

/**
 * Get drill by slug
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("drills")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

/**
 * Get drill by ID
 */
export const get = query({
  args: { id: v.id("drills") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get drills by sport and skill (for programmatic pages)
 */
export const getBySportSkill = query({
  args: {
    sport: v.string(),
    skill: v.string(),
    ageBand: v.optional(v.string()),
    constraint: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const drills = await ctx.db
      .query("drills")
      .withIndex("by_sport_skill", (q) =>
        q.eq("sport", args.sport).eq("skill", args.skill)
      )
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();

    let filtered = drills;

    // Filter by age band
    if (args.ageBand) {
      const [minStr, maxStr] = args.ageBand.split("-");
      const min = parseInt(minStr);
      const max = parseInt(maxStr);
      filtered = filtered.filter(
        (d) => d.ageBand.min <= max && d.ageBand.max >= min
      );
    }

    // Filter by constraint
    if (args.constraint) {
      filtered = filtered.filter((d) =>
        d.constraints.includes(args.constraint!)
      );
    }

    // Sort by difficulty
    filtered.sort((a, b) => a.difficultyScore - b.difficultyScore);

    // Apply limit
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

/**
 * Get drills by author
 */
export const getByAuthor = query({
  args: {
    authorId: v.id("authors"),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let drills = await ctx.db
      .query("drills")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();

    if (args.status) {
      drills = drills.filter((d) => d.status === args.status);
    }

    if (args.limit) {
      drills = drills.slice(0, args.limit);
    }

    return drills;
  },
});

/**
 * Get drills pending review
 */
export const getPendingReview = query({
  args: {
    safetyLevel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let drills = await ctx.db
      .query("drills")
      .withIndex("by_status", (q) => q.eq("status", "pending_review"))
      .collect();

    if (args.safetyLevel) {
      drills = drills.filter((d) => d.safetyLevel === args.safetyLevel);
    }

    return drills;
  },
});

/**
 * Search drills by text
 */
export const search = query({
  args: {
    query: v.string(),
    sport: v.optional(v.string()),
    skill: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query("drills")
      .withSearchIndex("search_drills", (q) => {
        let search = q.search("title", args.query);
        if (args.sport) {
          search = search.eq("sport", args.sport);
        }
        if (args.skill) {
          search = search.eq("skill", args.skill);
        }
        return search.eq("status", "published");
      })
      .take(args.limit || 20);

    return results;
  },
});

/**
 * Get related drills
 */
export const getRelated = query({
  args: { drillId: v.id("drills"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const drill = await ctx.db.get(args.drillId);
    if (!drill) return [];

    // Get explicitly related drills
    const relatedIds = drill.relatedDrillIds;
    const related: any[] = [];

    for (const id of relatedIds.slice(0, args.limit || 5)) {
      const relatedDrill = await ctx.db.get(id);
      if (relatedDrill && relatedDrill.status === "published") {
        related.push(relatedDrill);
      }
    }

    return related;
  },
});

/**
 * Get drill with full author info (for rendering)
 */
export const getWithAuthor = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const drill = await ctx.db
      .query("drills")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!drill) return null;

    const author = await ctx.db.get(drill.authorId);
    const reviewer = drill.reviewerId
      ? await ctx.db.get(drill.reviewerId)
      : null;

    return {
      ...drill,
      author,
      reviewer,
    };
  },
});

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a new drill
 */
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    sport: v.string(),
    skill: v.string(),
    subSkill: v.optional(v.string()),
    ageBand: ageBandValidator,
    constraints: v.array(v.string()),
    equipment: v.array(v.string()),
    environment: v.array(v.string()),
    difficulty: v.string(),
    difficultyScore: v.number(),
    goal: v.string(),
    duration: v.string(),
    reps: v.optional(v.string()),
    steps: v.array(stepValidator),
    coachNote: v.optional(v.string()),
    whyItWorks: v.optional(v.string()),
    safetyNotes: v.array(v.string()),
    contraindications: v.array(v.string()),
    ageWarnings: v.optional(
      v.object({
        tooYoung: v.optional(v.string()),
        growthPlate: v.optional(v.string()),
      })
    ),
    requiresSupervision: v.boolean(),
    primaryVideoUrl: v.optional(v.string()),
    primaryVideoId: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    heroImageUrl: v.optional(v.string()),
    authorId: v.id("authors"),
    tags: v.array(v.string()),
    keywords: v.array(v.string()),
    targetKeyword: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    directAnswer: v.optional(v.string()),
    faqItems: v.array(faqItemValidator),
    safetyLevel: v.union(
      v.literal("safe_autopublish"),
      v.literal("requires_human_review"),
      v.literal("blocked")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Determine initial status based on safety level
    const initialStatus =
      args.safetyLevel === "safe_autopublish" ? "draft" : "pending_review";

    return await ctx.db.insert("drills", {
      ...args,
      prerequisiteDrillIds: [],
      progressionDrillIds: [],
      regressionDrillIds: [],
      relatedDrillIds: [],
      relatedEntityIds: [],
      protocolIds: [],
      status: initialStatus,
      isCanonical: true,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update drill
 */
export const update = mutation({
  args: {
    id: v.id("drills"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    sport: v.optional(v.string()),
    skill: v.optional(v.string()),
    subSkill: v.optional(v.string()),
    ageBand: v.optional(ageBandValidator),
    constraints: v.optional(v.array(v.string())),
    equipment: v.optional(v.array(v.string())),
    environment: v.optional(v.array(v.string())),
    difficulty: v.optional(v.string()),
    difficultyScore: v.optional(v.number()),
    goal: v.optional(v.string()),
    duration: v.optional(v.string()),
    reps: v.optional(v.string()),
    steps: v.optional(v.array(stepValidator)),
    coachNote: v.optional(v.string()),
    whyItWorks: v.optional(v.string()),
    safetyNotes: v.optional(v.array(v.string())),
    contraindications: v.optional(v.array(v.string())),
    requiresSupervision: v.optional(v.boolean()),
    primaryVideoUrl: v.optional(v.string()),
    primaryVideoId: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    heroImageUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    keywords: v.optional(v.array(v.string())),
    targetKeyword: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    directAnswer: v.optional(v.string()),
    faqItems: v.optional(v.array(faqItemValidator)),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Drill not found");
    }

    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(id, {
      ...cleanUpdates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

/**
 * Submit drill for review
 */
export const submitForReview = mutation({
  args: { id: v.id("drills") },
  handler: async (ctx, args) => {
    const drill = await ctx.db.get(args.id);
    if (!drill) {
      throw new Error("Drill not found");
    }

    if (drill.status !== "draft") {
      throw new Error("Only drafts can be submitted for review");
    }

    await ctx.db.patch(args.id, {
      status: "pending_review",
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Approve drill (human review)
 */
export const approve = mutation({
  args: {
    id: v.id("drills"),
    reviewerId: v.id("authors"),
    notes: v.optional(v.string()),
    publish: v.boolean(),
  },
  handler: async (ctx, args) => {
    const drill = await ctx.db.get(args.id);
    if (!drill) {
      throw new Error("Drill not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.id, {
      status: args.publish ? "published" : "approved",
      reviewerId: args.reviewerId,
      approvedBy: args.reviewerId,
      approvedAt: now,
      approvalNotes: args.notes,
      lastReviewedAt: now,
      publishedAt: args.publish ? now : drill.publishedAt,
      updatedAt: now,
    });

    return args.id;
  },
});

/**
 * Reject drill
 */
export const reject = mutation({
  args: {
    id: v.id("drills"),
    reviewerId: v.id("authors"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const drill = await ctx.db.get(args.id);
    if (!drill) {
      throw new Error("Drill not found");
    }

    await ctx.db.patch(args.id, {
      status: "rejected",
      reviewerId: args.reviewerId,
      approvalNotes: args.reason,
      lastReviewedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Publish approved drill
 */
export const publish = mutation({
  args: { id: v.id("drills") },
  handler: async (ctx, args) => {
    const drill = await ctx.db.get(args.id);
    if (!drill) {
      throw new Error("Drill not found");
    }

    if (drill.status !== "approved" && drill.safetyLevel !== "safe_autopublish") {
      throw new Error("Drill must be approved before publishing");
    }

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
 * Unpublish drill
 */
export const unpublish = mutation({
  args: { id: v.id("drills") },
  handler: async (ctx, args) => {
    const drill = await ctx.db.get(args.id);
    if (!drill) {
      throw new Error("Drill not found");
    }

    await ctx.db.patch(args.id, {
      status: "archived",
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Link related drills
 */
export const linkRelated = mutation({
  args: {
    drillId: v.id("drills"),
    relatedDrillIds: v.array(v.id("drills")),
  },
  handler: async (ctx, args) => {
    const drill = await ctx.db.get(args.drillId);
    if (!drill) {
      throw new Error("Drill not found");
    }

    // Merge with existing, removing duplicates
    const existing = new Set(drill.relatedDrillIds.map((id) => id.toString()));
    const newIds = args.relatedDrillIds.filter(
      (id) => !existing.has(id.toString())
    );

    await ctx.db.patch(args.drillId, {
      relatedDrillIds: [...drill.relatedDrillIds, ...newIds],
      updatedAt: Date.now(),
    });

    return args.drillId;
  },
});

/**
 * Increment view count
 */
export const incrementViewCount = mutation({
  args: { id: v.id("drills") },
  handler: async (ctx, args) => {
    const drill = await ctx.db.get(args.id);
    if (!drill) return;

    await ctx.db.patch(args.id, {
      viewCount: drill.viewCount + 1,
    });
  },
});

/**
 * Set drill embedding (for AI retrieval)
 */
export const setEmbedding = mutation({
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
