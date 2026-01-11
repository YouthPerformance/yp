// ═══════════════════════════════════════════════════════════
// AUTHOR LEARNING SYSTEM
// Continuous learning from corrections
// The more they use it, the smarter it gets
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─────────────────────────────────────────────────────────────
// TYPE VALIDATORS
// ─────────────────────────────────────────────────────────────

const roleValidator = v.union(v.literal("admin"), v.literal("writer"), v.literal("ghost"));

const correctionTypeValidator = v.union(
  v.literal("vocabulary"),
  v.literal("phrasing"),
  v.literal("technical"),
  v.literal("brand"),
  v.literal("tone"),
  v.literal("factual"),
);

// ═══════════════════════════════════════════════════════════
// AUTHOR PROFILES
// ═══════════════════════════════════════════════════════════

/**
 * Get or create an author profile
 */
export const getOrCreateAuthor = mutation({
  args: {
    authorId: v.string(),
    displayName: v.string(),
    email: v.optional(v.string()),
    role: roleValidator,
    contentTypes: v.array(v.string()),
    publishedAs: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("author_profiles")
      .withIndex("by_author_id", (q) => q.eq("authorId", args.authorId))
      .first();

    if (existing) {
      // Update last active
      await ctx.db.patch(existing._id, {
        lastActiveAt: Date.now(),
        updatedAt: Date.now(),
      });
      return existing;
    }

    const now = Date.now();
    const id = await ctx.db.insert("author_profiles", {
      authorId: args.authorId,
      displayName: args.displayName,
      email: args.email,
      role: args.role,
      contentTypes: args.contentTypes,
      publishedAs: args.publishedAs,
      totalCorrections: 0,
      totalArticles: 0,
      lastActiveAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(id);
  },
});

/**
 * Get author profile
 */
export const getAuthor = query({
  args: { authorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("author_profiles")
      .withIndex("by_author_id", (q) => q.eq("authorId", args.authorId))
      .first();
  },
});

/**
 * List all authors
 */
export const listAuthors = query({
  args: { role: v.optional(roleValidator) },
  handler: async (ctx, args) => {
    if (args.role) {
      return await ctx.db
        .query("author_profiles")
        .withIndex("by_role", (q) => q.eq("role", args.role!))
        .collect();
    }
    return await ctx.db.query("author_profiles").collect();
  },
});

/**
 * Seed default authors
 */
export const seedAuthors = mutation({
  args: {},
  handler: async (ctx) => {
    const authors = [
      {
        authorId: "mike",
        displayName: "Mike Admin",
        role: "admin" as const,
        contentTypes: ["all"],
        publishedAs: "TMYP",
      },
      {
        authorId: "james",
        displayName: "James Scott",
        role: "writer" as const,
        contentTypes: ["drills", "guides", "programs"],
        publishedAs: "James Scott",
      },
      {
        authorId: "adam",
        displayName: "Adam Harris",
        role: "writer" as const,
        contentTypes: ["drills", "rehab", "injury-prevention"],
        publishedAs: "Adam Harris",
      },
      {
        authorId: "lawrence",
        displayName: "Lawrence (Team Voice)",
        role: "ghost" as const,
        contentTypes: ["blog", "announcements", "pr"],
        publishedAs: "TMYP",
      },
    ];

    const now = Date.now();
    const results = [];

    for (const author of authors) {
      const existing = await ctx.db
        .query("author_profiles")
        .withIndex("by_author_id", (q) => q.eq("authorId", author.authorId))
        .first();

      if (!existing) {
        await ctx.db.insert("author_profiles", {
          ...author,
          totalCorrections: 0,
          totalArticles: 0,
          lastActiveAt: now,
          createdAt: now,
          updatedAt: now,
        });
        results.push({ authorId: author.authorId, action: "created" });
      } else {
        results.push({ authorId: author.authorId, action: "exists" });
      }
    }

    return results;
  },
});

// ═══════════════════════════════════════════════════════════
// CORRECTIONS (The Learning Loop)
// ═══════════════════════════════════════════════════════════

/**
 * Record a correction (called when author edits transcribed/suggested text)
 */
export const recordCorrection = mutation({
  args: {
    authorId: v.string(),
    originalText: v.string(),
    correctedText: v.string(),
    context: v.optional(v.string()),
    correctionType: v.optional(correctionTypeValidator),
    articleId: v.optional(v.id("article_briefs")),
    sectionType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Skip if no actual change
    if (args.originalText.trim() === args.correctedText.trim()) {
      return null;
    }

    // Auto-detect correction type if not provided
    let correctionType = args.correctionType;
    if (!correctionType) {
      correctionType = detectCorrectionType(args.originalText, args.correctedText);
    }

    const now = Date.now();

    // Check if this is a repeated correction pattern
    const existingPattern = await findSimilarCorrection(
      ctx,
      args.authorId,
      args.originalText,
      args.correctedText,
    );

    if (existingPattern) {
      // Increase weight of existing pattern
      await ctx.db.patch(existingPattern._id, {
        weight: Math.min(10, existingPattern.weight + 1),
        timesApplied: existingPattern.timesApplied + 1,
      });

      return { correctionId: existingPattern._id, action: "strengthened" };
    }

    // Create new correction record
    const correctionId = await ctx.db.insert("writing_corrections", {
      authorId: args.authorId,
      originalText: args.originalText,
      correctedText: args.correctedText,
      context: args.context,
      correctionType,
      articleId: args.articleId,
      sectionType: args.sectionType,
      weight: 1,
      timesApplied: 1,
      createdAt: now,
    });

    // Update author's correction count
    const author = await ctx.db
      .query("author_profiles")
      .withIndex("by_author_id", (q) => q.eq("authorId", args.authorId))
      .first();

    if (author) {
      await ctx.db.patch(author._id, {
        totalCorrections: author.totalCorrections + 1,
        lastActiveAt: now,
        updatedAt: now,
      });
    }

    // Check if this is a vocabulary replacement
    if (correctionType === "vocabulary" || correctionType === "brand") {
      await extractVocabularyPreference(ctx, args.authorId, args.originalText, args.correctedText, correctionId);
    }

    return { correctionId, action: "created" };
  },
});

/**
 * Get recent corrections for an author
 */
export const getRecentCorrections = query({
  args: {
    authorId: v.string(),
    limit: v.optional(v.number()),
    correctionType: v.optional(correctionTypeValidator),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let query;
    if (args.correctionType) {
      query = ctx.db
        .query("writing_corrections")
        .withIndex("by_author_type", (q) =>
          q.eq("authorId", args.authorId).eq("correctionType", args.correctionType!),
        );
    } else {
      query = ctx.db
        .query("writing_corrections")
        .withIndex("by_author", (q) => q.eq("authorId", args.authorId));
    }

    return await query.order("desc").take(limit);
  },
});

/**
 * Get high-weight corrections (most important learnings)
 */
export const getTopCorrections = query({
  args: {
    authorId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const corrections = await ctx.db
      .query("writing_corrections")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();

    // Sort by weight descending
    return corrections.sort((a, b) => b.weight - a.weight).slice(0, limit);
  },
});

// ═══════════════════════════════════════════════════════════
// VOCABULARY PREFERENCES
// ═══════════════════════════════════════════════════════════

/**
 * Get vocabulary preferences for an author
 */
export const getVocabularyPreferences = query({
  args: { authorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vocabulary_preferences")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();
  },
});

/**
 * Add a manual vocabulary preference
 */
export const addVocabularyPreference = mutation({
  args: {
    authorId: v.string(),
    avoid: v.string(),
    prefer: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("vocabulary_preferences")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .filter((q) => q.eq(q.field("avoid"), args.avoid.toLowerCase()))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        prefer: args.prefer,
        context: args.context,
        timesApplied: existing.timesApplied + 1,
      });
      return { id: existing._id, action: "updated" };
    }

    const id = await ctx.db.insert("vocabulary_preferences", {
      authorId: args.authorId,
      avoid: args.avoid.toLowerCase(),
      prefer: args.prefer,
      context: args.context,
      timesApplied: 0,
      createdAt: Date.now(),
    });

    return { id, action: "created" };
  },
});

// ═══════════════════════════════════════════════════════════
// APPROVED EXAMPLES
// ═══════════════════════════════════════════════════════════

/**
 * Save an approved example
 */
export const saveApprovedExample = mutation({
  args: {
    authorId: v.string(),
    content: v.string(),
    contentType: v.string(),
    qualities: v.array(v.string()),
    articleId: v.optional(v.id("article_briefs")),
    approvedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("approved_examples", {
      authorId: args.authorId,
      content: args.content,
      contentType: args.contentType,
      qualities: args.qualities,
      articleId: args.articleId,
      approvedBy: args.approvedBy,
      createdAt: Date.now(),
    });

    return id;
  },
});

/**
 * Get approved examples for an author
 */
export const getApprovedExamples = query({
  args: {
    authorId: v.string(),
    contentType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    let query;
    if (args.contentType) {
      query = ctx.db
        .query("approved_examples")
        .withIndex("by_author_type", (q) =>
          q.eq("authorId", args.authorId).eq("contentType", args.contentType!),
        );
    } else {
      query = ctx.db
        .query("approved_examples")
        .withIndex("by_author", (q) => q.eq("authorId", args.authorId));
    }

    return await query.order("desc").take(limit);
  },
});

// ═══════════════════════════════════════════════════════════
// LEARNING CONTEXT (For AI Suggestions)
// ═══════════════════════════════════════════════════════════

/**
 * Get complete learning context for an author
 * This is what gets passed to AI for personalized suggestions
 */
export const getLearningContext = query({
  args: {
    authorId: v.string(),
    sectionType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get author profile
    const author = await ctx.db
      .query("author_profiles")
      .withIndex("by_author_id", (q) => q.eq("authorId", args.authorId))
      .first();

    if (!author) {
      return null;
    }

    // Get vocabulary preferences
    const vocabulary = await ctx.db
      .query("vocabulary_preferences")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();

    // Get top corrections (most important learnings)
    const corrections = await ctx.db
      .query("writing_corrections")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();

    const topCorrections = corrections
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 20);

    // Get relevant approved examples
    let examples;
    if (args.sectionType) {
      examples = await ctx.db
        .query("approved_examples")
        .withIndex("by_author_type", (q) =>
          q.eq("authorId", args.authorId).eq("contentType", args.sectionType!),
        )
        .order("desc")
        .take(5);
    } else {
      examples = await ctx.db
        .query("approved_examples")
        .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
        .order("desc")
        .take(5);
    }

    return {
      author: {
        id: author.authorId,
        name: author.displayName,
        role: author.role,
        publishedAs: author.publishedAs,
        totalCorrections: author.totalCorrections,
      },
      vocabulary: vocabulary.map((v) => ({
        avoid: v.avoid,
        prefer: v.prefer,
        context: v.context,
      })),
      recentLearnings: topCorrections.map((c) => ({
        original: c.originalText,
        corrected: c.correctedText,
        type: c.correctionType,
        weight: c.weight,
      })),
      approvedExamples: examples.map((e) => ({
        content: e.content,
        type: e.contentType,
        qualities: e.qualities,
      })),
    };
  },
});

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Detect the type of correction based on the change
 */
function detectCorrectionType(
  original: string,
  corrected: string,
): "vocabulary" | "phrasing" | "technical" | "brand" | "tone" | "factual" {
  const originalWords = original.toLowerCase().split(/\s+/);
  const correctedWords = corrected.toLowerCase().split(/\s+/);

  // Brand vocabulary detection
  const brandTerms = ["stack", "drill", "chassis", "springs", "pack", "build", "load"];
  const genericTerms = ["workout", "exercise", "body", "muscles", "team", "develop", "add"];

  for (let i = 0; i < genericTerms.length; i++) {
    if (originalWords.includes(genericTerms[i]) && correctedWords.includes(brandTerms[i])) {
      return "brand";
    }
  }

  // Single word replacement = vocabulary
  if (originalWords.length === correctedWords.length && originalWords.length <= 3) {
    return "vocabulary";
  }

  // Significant restructuring = phrasing
  if (Math.abs(original.length - corrected.length) > original.length * 0.3) {
    return "phrasing";
  }

  // Technical terms detection
  const technicalTerms = [
    "proprioception",
    "mechanoreceptor",
    "kinetic",
    "neuromuscular",
    "dorsiflexion",
    "plantarflexion",
    "rfd",
  ];
  for (const term of technicalTerms) {
    if (corrected.toLowerCase().includes(term) && !original.toLowerCase().includes(term)) {
      return "technical";
    }
  }

  // Default to phrasing
  return "phrasing";
}

/**
 * Find similar existing correction pattern
 */
async function findSimilarCorrection(
  ctx: { db: any },
  authorId: string,
  original: string,
  corrected: string,
) {
  const corrections = await ctx.db
    .query("writing_corrections")
    .withIndex("by_author", (q: any) => q.eq("authorId", authorId))
    .collect();

  // Look for similar patterns (simple substring matching)
  const originalLower = original.toLowerCase().trim();
  const correctedLower = corrected.toLowerCase().trim();

  for (const correction of corrections) {
    const existingOriginal = correction.originalText.toLowerCase().trim();
    const existingCorrected = correction.correctedText.toLowerCase().trim();

    // Exact match or very similar
    if (existingOriginal === originalLower && existingCorrected === correctedLower) {
      return correction;
    }

    // Partial match (one contains the other)
    if (
      (originalLower.includes(existingOriginal) || existingOriginal.includes(originalLower)) &&
      (correctedLower.includes(existingCorrected) || existingCorrected.includes(correctedLower))
    ) {
      return correction;
    }
  }

  return null;
}

/**
 * Extract vocabulary preference from a correction
 */
async function extractVocabularyPreference(
  ctx: { db: any },
  authorId: string,
  original: string,
  corrected: string,
  correctionId: any,
) {
  const originalWords = original.toLowerCase().split(/\s+/);
  const correctedWords = corrected.toLowerCase().split(/\s+/);

  // Simple case: single word replacement
  if (originalWords.length === 1 && correctedWords.length === 1) {
    const existing = await ctx.db
      .query("vocabulary_preferences")
      .withIndex("by_author", (q: any) => q.eq("authorId", authorId))
      .filter((q: any) => q.eq(q.field("avoid"), originalWords[0]))
      .first();

    if (!existing) {
      await ctx.db.insert("vocabulary_preferences", {
        authorId,
        avoid: originalWords[0],
        prefer: correctedWords[0],
        learnedFrom: correctionId,
        timesApplied: 0,
        createdAt: Date.now(),
      });
    } else {
      await ctx.db.patch(existing._id, {
        timesApplied: existing.timesApplied + 1,
      });
    }
  }
}
