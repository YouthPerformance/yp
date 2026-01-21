// ============================================================================
// AUTHORS - The Expert Voices (E-E-A-T)
// James Scott (Barefoot/Biomechanics) & Adam Harrington (Basketball Skills)
// ============================================================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get all active authors
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("authors")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

/**
 * Get author by slug
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("authors")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

/**
 * Get author by ID
 */
export const get = query({
  args: { id: v.id("authors") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get authors by domain expertise
 */
export const getByDomain = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const authors = await ctx.db
      .query("authors")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return authors.filter((author) => author.domains.includes(args.domain));
  },
});

/**
 * Get author voice profile for AI content generation
 */
export const getVoiceProfile = query({
  args: { authorId: v.id("authors") },
  handler: async (ctx, args) => {
    const author = await ctx.db.get(args.authorId);
    if (!author) return null;

    return {
      name: author.name,
      voiceProfile: author.voiceProfile,
      tagline: author.tagline,
      credentials: author.credentials,
    };
  },
});

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a new author
 */
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    initials: v.string(),
    tagline: v.string(),
    credentials: v.array(v.string()),
    bio: v.string(),
    yearsExperience: v.optional(v.number()),
    avatarUrl: v.optional(v.string()),
    socialLinks: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        twitter: v.optional(v.string()),
        youtube: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        wikipedia: v.optional(v.string()),
      })
    ),
    voiceProfile: v.object({
      tone: v.string(),
      vocabulary: v.array(v.string()),
      avoid: v.array(v.string()),
      speechPatterns: v.array(v.string()),
      signaturePhrases: v.array(v.string()),
    }),
    domains: v.array(v.string()),
    sports: v.array(v.string()),
    canApprove: v.array(v.string()),
    canPublishWithoutReview: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("authors", {
      ...args,
      reviewCount: 0,
      approvalRate: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update author
 */
export const update = mutation({
  args: {
    id: v.id("authors"),
    name: v.optional(v.string()),
    tagline: v.optional(v.string()),
    credentials: v.optional(v.array(v.string())),
    bio: v.optional(v.string()),
    yearsExperience: v.optional(v.number()),
    avatarUrl: v.optional(v.string()),
    socialLinks: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        twitter: v.optional(v.string()),
        youtube: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        wikipedia: v.optional(v.string()),
      })
    ),
    voiceProfile: v.optional(
      v.object({
        tone: v.string(),
        vocabulary: v.array(v.string()),
        avoid: v.array(v.string()),
        speechPatterns: v.array(v.string()),
        signaturePhrases: v.array(v.string()),
      })
    ),
    domains: v.optional(v.array(v.string())),
    sports: v.optional(v.array(v.string())),
    canApprove: v.optional(v.array(v.string())),
    canPublishWithoutReview: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Author not found");
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
 * Increment review count (called when author reviews content)
 */
export const incrementReviewCount = mutation({
  args: {
    authorId: v.id("authors"),
    approved: v.boolean(),
  },
  handler: async (ctx, args) => {
    const author = await ctx.db.get(args.authorId);
    if (!author) {
      throw new Error("Author not found");
    }

    const newReviewCount = author.reviewCount + 1;
    const newApprovalRate = args.approved
      ? (author.approvalRate * author.reviewCount + 1) / newReviewCount
      : (author.approvalRate * author.reviewCount) / newReviewCount;

    await ctx.db.patch(args.authorId, {
      reviewCount: newReviewCount,
      approvalRate: newApprovalRate,
      updatedAt: Date.now(),
    });
  },
});

// =============================================================================
// SEED DATA HELPERS
// =============================================================================

/**
 * Seed James Scott (Barefoot/Biomechanics Expert)
 */
export const seedJamesScott = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already exists
    const existing = await ctx.db
      .query("authors")
      .withIndex("by_slug", (q) => q.eq("slug", "james-scott"))
      .first();

    if (existing) {
      return existing._id;
    }

    const now = Date.now();

    return await ctx.db.insert("authors", {
      name: "James Scott",
      slug: "james-scott",
      initials: "JS",
      tagline: "Movement & Biomechanics Specialist",
      credentials: [
        "Certified Strength & Conditioning Specialist (CSCS)",
        "Functional Movement Screen (FMS) Certified",
        "15+ years youth athletic development",
        "Creator of the R3 Method",
      ],
      bio: "James Scott is a movement and biomechanics specialist who has spent over 15 years helping young athletes build bulletproof foundations. His R3 Method (Release, Restore, Re-Engineer) has helped thousands of youth athletes prevent injuries and unlock their athletic potential through proper foot mechanics and movement patterns.",
      yearsExperience: 15,
      avatarUrl: undefined,
      socialLinks: {
        instagram: "https://instagram.com/jamesscottmovement",
        twitter: "https://twitter.com/jamesscottmove",
      },
      voiceProfile: {
        tone: "Authoritative but approachable, science-backed but practical",
        vocabulary: [
          "proprioception",
          "kinetic chain",
          "ground reaction force",
          "movement pattern",
          "load management",
        ],
        avoid: [
          "bro science",
          "quick fix",
          "no pain no gain",
          "just push through",
        ],
        speechPatterns: [
          "Starts with the 'why' before the 'how'",
          "Uses anatomical references but explains them simply",
          "References research but makes it actionable",
          "Acknowledges individual variation",
        ],
        signaturePhrases: [
          "The feet are the foundation of athletic movement",
          "You can't out-train a dysfunction",
          "Release before you restore, restore before you re-engineer",
          "Your body is always adapting - make sure it's adapting to the right things",
        ],
      },
      domains: ["barefoot", "biomechanics", "injury-prevention", "movement"],
      sports: ["all-sports", "basketball", "soccer", "football"],
      canApprove: ["drills", "protocols", "guides", "qna"],
      canPublishWithoutReview: true,
      reviewCount: 0,
      approvalRate: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Seed Adam Harrington (Basketball Skills Expert)
 */
export const seedAdamHarrington = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already exists
    const existing = await ctx.db
      .query("authors")
      .withIndex("by_slug", (q) => q.eq("slug", "adam-harrington"))
      .first();

    if (existing) {
      return existing._id;
    }

    const now = Date.now();

    return await ctx.db.insert("authors", {
      name: "Adam Harrington",
      slug: "adam-harrington",
      initials: "AH",
      tagline: "NBA Skills Development Coach",
      credentials: [
        "Former NBA player",
        "Brooklyn Nets assistant coach",
        "Kevin Durant's longtime skills trainer",
        "Head Coach, Phantom BC (Unrivaled)",
      ],
      bio: "Adam Harrington is an NBA skills development coach and former professional player who has trained some of the biggest names in basketball, including Kevin Durant. His approach focuses on building elite skills through deliberate practice and attention to the smallest details that separate good from great.",
      yearsExperience: 20,
      avatarUrl: undefined,
      socialLinks: {
        instagram: "https://instagram.com/aharrington1",
        twitter: "https://twitter.com/aharrington1",
        wikipedia: "https://en.wikipedia.org/wiki/Adam_Harrington_(basketball)",
      },
      voiceProfile: {
        tone: "Direct, confident, experienced - speaks from decades of elite-level experience",
        vocabulary: [
          "rep quality",
          "game speed",
          "elite habits",
          "decision making",
          "feel for the game",
        ],
        avoid: [
          "easy shortcuts",
          "overnight results",
          "one-size-fits-all",
          "just practice more",
        ],
        speechPatterns: [
          "References specific NBA players and situations",
          "Breaks complex skills into micro-movements",
          "Emphasizes the mental side alongside physical",
          "Uses 'feel' language - what it should feel like",
        ],
        signaturePhrases: [
          "The details matter at every level",
          "Practice doesn't make perfect - perfect practice makes perfect",
          "Your handles should be an extension of your mind",
          "The best players make the hard look easy because they've done the work",
        ],
      },
      domains: ["basketball", "shooting", "ball-handling", "skills"],
      sports: ["basketball"],
      canApprove: ["drills", "protocols", "guides", "qna"],
      canPublishWithoutReview: true,
      reviewCount: 0,
      approvalRate: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Seed both authors
 */
export const seedAllAuthors = mutation({
  args: {},
  handler: async (ctx) => {
    // This will be called by the individual seed functions
    // We just need to trigger them
    return { message: "Use seedJamesScott and seedAdamHarrington individually" };
  },
});
