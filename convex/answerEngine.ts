/**
 * Answer Engine API Functions
 *
 * Provides structured data access for AI citation systems (Perplexity, ChatGPT, etc.)
 * Maps internal schema to external API format with E-E-A-T signals.
 */

import { query, mutation, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

// Scored response type for vector search results
type DrillWithScore = DrillApiResponse & { _score: number };
type QnAWithScore = ArticleApiResponse & { _score: number };

interface DrillApiResponse {
  _id: Id<"drills">;
  slug: string;
  title: string;
  description: string;
  sport: string;
  category: string;
  ageMin: number;
  ageMax: number;
  difficulty: string;
  duration: string;
  reps?: string;
  equipment: string[];
  tags: string[];
  constraints: string[];
  steps: {
    order: number;
    title?: string;
    instruction: string;
    duration?: string;
    durationSeconds?: number;
    coachingCue?: string;
  }[];
  coachingCues: string[];
  commonMistake?: string;
  mistakeFix?: string;
  author: {
    _id: Id<"authors">;
    slug: string;
    name: string;
    title: string;
    credentials: string[];
  } | null;
  updatedAt: number;
}

interface ExpertApiResponse {
  _id: Id<"authors">;
  slug: string;
  name: string;
  title: string;
  icon: string;
  credentials: string[];
  bio: string;
  avatarUrl?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    wikipedia?: string;
    youtube?: string;
  };
}

interface ArticleApiResponse {
  _id: Id<"qna">;
  slug: string;
  question: string;
  directAnswer: string;
  category: string;
  keywords: string[];
  keyTakeaways: string[];
  safetyNote?: string;
  author: {
    _id: Id<"authors">;
    slug: string;
    name: string;
    title: string;
    credentials: string[];
  } | null;
  updatedAt: number;
}

// ─────────────────────────────────────────────────────────────
// HELPER: Transform drill to API format
// ─────────────────────────────────────────────────────────────

function transformDrill(
  drill: Doc<"drills">,
  author: Doc<"authors"> | null
): DrillApiResponse {
  // Extract coaching cues from steps
  const coachingCues = drill.steps
    .flatMap((s) => s.coachingCues || [])
    .filter(Boolean);

  // Get first step's common mistake/fix if exists
  const firstStepWithMistake = drill.steps.find((s) => s.commonMistake);

  return {
    _id: drill._id,
    slug: drill.slug,
    title: drill.title,
    description: drill.goal, // Map goal to description
    sport: drill.sport,
    category: drill.skill, // Map skill to category
    ageMin: drill.ageBand.min,
    ageMax: drill.ageBand.max,
    difficulty: drill.difficulty,
    duration: drill.duration,
    reps: drill.reps,
    equipment: drill.equipment,
    tags: drill.tags,
    constraints: drill.constraints,
    steps: drill.steps.map((step) => ({
      order: step.position,
      title: step.title,
      instruction: step.instruction,
      durationSeconds: step.durationSeconds,
      coachingCue: step.coachingCues?.[0], // First cue for simple access
    })),
    coachingCues,
    commonMistake: firstStepWithMistake?.commonMistake,
    mistakeFix: firstStepWithMistake?.mistakeFix,
    author: author
      ? {
          _id: author._id,
          slug: author.slug,
          name: author.name,
          title: author.tagline,
          credentials: author.credentials,
        }
      : null,
    updatedAt: drill.updatedAt,
  };
}

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Search published drills with filters
 * Used by: /api/answer-engine/drills, /api/answer-engine/answer
 */
export const searchDrills = query({
  args: {
    sport: v.optional(v.string()),
    category: v.optional(v.string()),
    age: v.optional(v.number()),
    difficulty: v.optional(v.string()),
    constraint: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let drills = await ctx.db
      .query("drills")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // Apply filters
    if (args.sport) {
      drills = drills.filter((d) => d.sport === args.sport);
    }
    if (args.category) {
      drills = drills.filter((d) => d.skill === args.category);
    }
    if (args.age) {
      drills = drills.filter(
        (d) => d.ageBand.min <= args.age! && d.ageBand.max >= args.age!
      );
    }
    if (args.difficulty) {
      drills = drills.filter((d) => d.difficulty === args.difficulty);
    }
    if (args.constraint) {
      drills = drills.filter((d) => d.constraints.includes(args.constraint!));
    }

    // Limit results
    drills = drills.slice(0, args.limit || 20);

    // Get authors for all drills
    const authorIds = [...new Set(drills.map((d) => d.authorId))];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = new Map(
      authors.filter(Boolean).map((a) => [a!._id, a!])
    );

    return drills.map((drill) =>
      transformDrill(drill, authorMap.get(drill.authorId) || null)
    );
  },
});

/**
 * Get expert by slug
 * Used by: /api/answer-engine/experts?slug=...
 */
export const getExpertBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args): Promise<ExpertApiResponse | null> => {
    const author = await ctx.db
      .query("authors")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!author) return null;

    return {
      _id: author._id,
      slug: author.slug,
      name: author.name,
      title: author.tagline,
      icon: author.initials,
      credentials: author.credentials,
      bio: author.bio,
      avatarUrl: author.avatarUrl,
      socialLinks: author.socialLinks,
    };
  },
});

/**
 * List all active experts
 * Used by: /api/answer-engine/experts
 */
export const listExperts = query({
  args: {},
  handler: async (ctx): Promise<ExpertApiResponse[]> => {
    const authors = await ctx.db
      .query("authors")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return authors.map((author) => ({
      _id: author._id,
      slug: author.slug,
      name: author.name,
      title: author.tagline,
      icon: author.initials,
      credentials: author.credentials,
      bio: author.bio,
      avatarUrl: author.avatarUrl,
      socialLinks: author.socialLinks,
    }));
  },
});

/**
 * List drills with optional author filter
 * Used by: /api/answer-engine/experts (for content counts)
 */
export const listDrills = query({
  args: {
    authorId: v.optional(v.id("authors")),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let drills = await ctx.db
      .query("drills")
      .withIndex("by_status", (q) =>
        q.eq("status", (args.status as any) || "published")
      )
      .collect();

    if (args.authorId) {
      drills = drills.filter((d) => d.authorId === args.authorId);
    }

    drills = drills.slice(0, args.limit || 50);

    // Get authors
    const authorIds = [...new Set(drills.map((d) => d.authorId))];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = new Map(
      authors.filter(Boolean).map((a) => [a!._id, a!])
    );

    return drills.map((drill) =>
      transformDrill(drill, authorMap.get(drill.authorId) || null)
    );
  },
});

/**
 * List articles (QnA entries)
 * Used by: /api/answer-engine/answer, /api/answer-engine/experts
 */
export const listArticles = query({
  args: {
    authorId: v.optional(v.id("authors")),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<ArticleApiResponse[]> => {
    let qnas = await ctx.db.query("qna").collect();

    // Filter by status (QnA uses different field structure)
    if (args.status === "published") {
      qnas = qnas.filter((q) => q.publishedAt);
    }

    if (args.authorId) {
      qnas = qnas.filter((q) => q.authorId === args.authorId);
    }

    qnas = qnas.slice(0, args.limit || 50);

    // Get authors
    const authorIds = [...new Set(qnas.map((q) => q.authorId))];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = new Map(
      authors.filter(Boolean).map((a) => [a!._id, a!])
    );

    return qnas.map((qna) => {
      const author = authorMap.get(qna.authorId);
      return {
        _id: qna._id,
        slug: qna.slug,
        question: qna.question,
        directAnswer: qna.directAnswer,
        category: qna.category,
        keywords: qna.keywords,
        keyTakeaways: qna.keyTakeaways,
        safetyNote: qna.safetyNote,
        author: author
          ? {
              _id: author._id,
              slug: author.slug,
              name: author.name,
              title: author.tagline,
              credentials: author.credentials,
            }
          : null,
        updatedAt: qna.updatedAt,
      };
    });
  },
});

/**
 * Get Q&A pairs for FAQ schema
 * Used by: /api/answer-engine/qna
 */
export const getQnAPairs = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let qnas = await ctx.db.query("qna").collect();

    // Filter by published
    qnas = qnas.filter((q) => q.publishedAt);

    // Filter by category
    if (args.category) {
      qnas = qnas.filter((q) => q.category === args.category);
    }

    qnas = qnas.slice(0, args.limit || 20);

    // Get authors
    const authorIds = [...new Set(qnas.map((q) => q.authorId))];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = new Map(
      authors.filter(Boolean).map((a) => [a!._id, a!])
    );

    const SITE_URL = "https://app.youthperformance.com";

    return qnas.map((qna) => {
      const author = authorMap.get(qna.authorId);
      return {
        id: qna._id,
        question: qna.question,
        answer: qna.directAnswer,
        keyTakeaways: qna.keyTakeaways,
        safetyNote: qna.safetyNote,
        expert: author
          ? {
              name: author.name,
              title: author.tagline,
              credentials: author.credentials,
            }
          : null,
        url: `${SITE_URL}/guides/${qna.slug}`,
        lastUpdated: new Date(qna.updatedAt).toISOString(),
      };
    });
  },
});

// ─────────────────────────────────────────────────────────────
// ADMIN / INTERNAL FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * List all drills (including drafts) - for admin purposes
 */
export const listAllDrills = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("drills")
      .take(args.limit || 100);
  },
});

/**
 * Publish all drills with safe_autopublish safety level
 * Used for bulk publishing after migration
 */
export const publishSafeAutopublish = mutation({
  args: {},
  handler: async (ctx) => {
    const drills = await ctx.db.query("drills").collect();
    const now = Date.now();
    let published = 0;

    for (const drill of drills) {
      if (
        drill.status !== "published" &&
        drill.safetyLevel === "safe_autopublish"
      ) {
        await ctx.db.patch(drill._id, {
          status: "published",
          publishedAt: now,
          updatedAt: now,
        });
        published++;
      }
    }

    return { published, total: drills.length };
  },
});

// ─────────────────────────────────────────────────────────────
// VECTOR SEARCH (Actions - required for vector search in Convex)
// ─────────────────────────────────────────────────────────────

/**
 * Semantic search for drills using vector similarity
 * Used by: /api/answer-engine/answer (primary search)
 *
 * Note: Vector search in Convex MUST be done in an action, not a query
 */
export const vectorSearchDrills = action({
  args: {
    embedding: v.array(v.float64()),
    sport: v.optional(v.string()),
    skill: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    // Perform vector search - filter by status only (Convex vector filter limitations)
    // Additional filtering by sport/skill done after fetching
    const results = await ctx.vectorSearch("drills", "by_embedding", {
      vector: args.embedding,
      limit: (args.limit || 10) * 3, // Fetch more to account for post-filtering
      filter: (q) => q.eq("status", "published"),
    });

    // Get full drill documents with authors
    const drillsWithAuthors = (await ctx.runQuery(
      internal.answerEngineInternal.getDrillsWithAuthors,
      { ids: results.map((r) => r._id) }
    )) as DrillApiResponse[];

    // Merge scores with drill data
    const scoreMap = new Map(results.map((r) => [r._id, r._score]));
    let scoredDrills: DrillWithScore[] = drillsWithAuthors.map((drill) => ({
      ...drill,
      _score: scoreMap.get(drill._id) || 0,
    }));

    // Apply additional filters
    if (args.sport) {
      scoredDrills = scoredDrills.filter((d) => d.sport === args.sport);
    }
    if (args.skill) {
      scoredDrills = scoredDrills.filter((d) => d.category === args.skill);
    }

    // Return limited results
    return scoredDrills.slice(0, args.limit || 10);
  },
});

/**
 * Semantic search for QnA entries using vector similarity
 */
export const vectorSearchQnA = action({
  args: {
    embedding: v.array(v.float64()),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    // Perform vector search - no filter support, do post-filtering
    const results = await ctx.vectorSearch("qna", "by_embedding", {
      vector: args.embedding,
      limit: (args.limit || 10) * 3, // Fetch more to account for post-filtering
    });

    // Get full QnA documents with authors
    const qnasWithAuthors = (await ctx.runQuery(
      internal.answerEngineInternal.getQnAsWithAuthors,
      { ids: results.map((r) => r._id) }
    )) as ArticleApiResponse[];

    // Merge scores
    const scoreMap = new Map(results.map((r) => [r._id, r._score]));
    let scoredQnas: QnAWithScore[] = qnasWithAuthors.map((qna) => ({
      ...qna,
      _score: scoreMap.get(qna._id) || 0,
    }));

    // Apply category filter if specified
    if (args.category) {
      scoredQnas = scoredQnas.filter((q) => q.category === args.category);
    }

    // Return limited results
    return scoredQnas.slice(0, args.limit || 10);
  },
});
