// ═══════════════════════════════════════════════════════════
// ANSWER ENGINE
// CRUD operations for AI-citeable content (experts, drills, articles)
// The Wikipedia of Youth Sports
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─────────────────────────────────────────────────────────────
// TYPE VALIDATORS
// ─────────────────────────────────────────────────────────────

const statusValidator = v.union(
  v.literal("draft"),
  v.literal("published"),
  v.literal("archived")
);

const difficultyValidator = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
  v.literal("scalable")
);

// ═══════════════════════════════════════════════════════════
// EXPERTS (E-E-A-T)
// ═══════════════════════════════════════════════════════════

/**
 * Create a new expert profile
 */
export const createExpert = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    title: v.string(),
    icon: v.string(),
    credentials: v.array(v.string()),
    bio: v.string(),
    avatarUrl: v.optional(v.string()),
    socialLinks: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        twitter: v.optional(v.string()),
        wikipedia: v.optional(v.string()),
        youtube: v.optional(v.string()),
      })
    ),
    voiceProfile: v.object({
      tone: v.string(),
      avoid: v.array(v.string()),
      speechPatterns: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check for existing expert with same slug
    const existing = await ctx.db
      .query("experts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error(`Expert with slug "${args.slug}" already exists`);
    }

    const expertId = await ctx.db.insert("experts", {
      ...args,
      drillCount: 0,
      articleCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    return expertId;
  },
});

/**
 * Update an expert profile
 */
export const updateExpert = mutation({
  args: {
    expertId: v.id("experts"),
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    icon: v.optional(v.string()),
    credentials: v.optional(v.array(v.string())),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    socialLinks: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        twitter: v.optional(v.string()),
        wikipedia: v.optional(v.string()),
        youtube: v.optional(v.string()),
      })
    ),
    voiceProfile: v.optional(
      v.object({
        tone: v.string(),
        avoid: v.array(v.string()),
        speechPatterns: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { expertId, ...updates } = args;

    const existing = await ctx.db.get(expertId);
    if (!existing) throw new Error("Expert not found");

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(expertId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Get expert by slug
 */
export const getExpertBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("experts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

/**
 * Get all experts
 */
export const listExperts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("experts").collect();
  },
});

// ═══════════════════════════════════════════════════════════
// DRILLS (ae_drills)
// ═══════════════════════════════════════════════════════════

/**
 * Create a new drill
 */
export const createDrill = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    subtitle: v.optional(v.string()),
    sport: v.string(),
    category: v.string(),
    cluster: v.optional(v.string()),
    ageMin: v.number(),
    ageMax: v.number(),
    difficulty: v.string(),
    tags: v.array(v.string()),
    constraints: v.array(v.string()),
    description: v.string(),
    benefits: v.array(v.string()),
    coachNote: v.optional(v.string()),
    steps: v.array(
      v.object({
        order: v.number(),
        title: v.optional(v.string()),
        instruction: v.string(),
        duration: v.optional(v.string()),
        durationSeconds: v.optional(v.number()),
        coachingCue: v.optional(v.string()),
        commonMistake: v.optional(v.string()),
        videoUrl: v.optional(v.string()),
      })
    ),
    coachingCues: v.array(v.string()),
    commonMistake: v.optional(v.string()),
    mistakeFix: v.optional(v.string()),
    warmup: v.optional(v.string()),
    cooldown: v.optional(v.string()),
    duration: v.string(),
    reps: v.optional(v.string()),
    equipment: v.array(v.string()),
    variations: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
          difficulty: v.string(),
        })
      )
    ),
    authorId: v.id("experts"),
    reviewedBy: v.optional(v.string()),
    sources: v.optional(v.array(v.string())),
    videoUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    gifUrl: v.optional(v.string()),
    relatedDrills: v.array(v.string()),
    parentProtocol: v.optional(v.string()),
    keywords: v.array(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check for existing drill with same slug
    const existing = await ctx.db
      .query("ae_drills")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error(`Drill with slug "${args.slug}" already exists`);
    }

    // Verify author exists
    const author = await ctx.db.get(args.authorId);
    if (!author) throw new Error("Author not found");

    const drillId = await ctx.db.insert("ae_drills", {
      ...args,
      status: args.status ?? "draft",
      publishedAt: args.status === "published" ? now : undefined,
      updatedAt: now,
    });

    // Update author's drill count
    await ctx.db.patch(args.authorId, {
      drillCount: (author.drillCount ?? 0) + 1,
      updatedAt: now,
    });

    return drillId;
  },
});

/**
 * Update a drill
 */
export const updateDrill = mutation({
  args: {
    drillId: v.id("ae_drills"),
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    description: v.optional(v.string()),
    benefits: v.optional(v.array(v.string())),
    coachNote: v.optional(v.string()),
    steps: v.optional(
      v.array(
        v.object({
          order: v.number(),
          title: v.optional(v.string()),
          instruction: v.string(),
          duration: v.optional(v.string()),
          durationSeconds: v.optional(v.number()),
          coachingCue: v.optional(v.string()),
          commonMistake: v.optional(v.string()),
          videoUrl: v.optional(v.string()),
        })
      )
    ),
    coachingCues: v.optional(v.array(v.string())),
    commonMistake: v.optional(v.string()),
    mistakeFix: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    status: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { drillId, ...updates } = args;
    const now = Date.now();

    const existing = await ctx.db.get(drillId);
    if (!existing) throw new Error("Drill not found");

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    // If publishing for first time, set publishedAt
    if (args.status === "published" && existing.status !== "published") {
      (filteredUpdates as Record<string, unknown>).publishedAt = now;
    }

    await ctx.db.patch(drillId, {
      ...filteredUpdates,
      updatedAt: now,
    });
  },
});

/**
 * Get drill by slug
 */
export const getDrillBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const drill = await ctx.db
      .query("ae_drills")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!drill) return null;

    // Get author
    const author = await ctx.db.get(drill.authorId);

    return { ...drill, author };
  },
});

/**
 * List drills with filters
 */
export const listDrills = query({
  args: {
    sport: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    authorId: v.optional(v.id("experts")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let drillsQuery;

    if (args.sport && args.category && args.status) {
      drillsQuery = ctx.db
        .query("ae_drills")
        .withIndex("by_category", (q) =>
          q
            .eq("sport", args.sport!)
            .eq("category", args.category!)
            .eq("status", args.status!)
        );
    } else if (args.sport && args.status) {
      drillsQuery = ctx.db
        .query("ae_drills")
        .withIndex("by_sport", (q) =>
          q.eq("sport", args.sport!).eq("status", args.status!)
        );
    } else if (args.status) {
      drillsQuery = ctx.db
        .query("ae_drills")
        .withIndex("by_status", (q) => q.eq("status", args.status!));
    } else if (args.authorId) {
      drillsQuery = ctx.db
        .query("ae_drills")
        .withIndex("by_author", (q) => q.eq("authorId", args.authorId!));
    } else {
      drillsQuery = ctx.db.query("ae_drills");
    }

    const drills = await drillsQuery.take(limit);

    // Get authors for all drills
    const authorIds = [...new Set(drills.map((d) => d.authorId))];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = Object.fromEntries(
      authors.filter(Boolean).map((a) => [a!._id, a])
    );

    return drills.map((drill) => ({
      ...drill,
      author: authorMap[drill.authorId],
    }));
  },
});

/**
 * Search drills (for Answer Engine API)
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
    const limit = args.limit ?? 20;

    // Start with all published drills
    let drills = await ctx.db
      .query("ae_drills")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // Apply filters
    if (args.sport) {
      drills = drills.filter((d) => d.sport === args.sport);
    }

    if (args.category) {
      drills = drills.filter((d) => d.category === args.category);
    }

    if (args.age) {
      drills = drills.filter(
        (d) => d.ageMin <= args.age! && d.ageMax >= args.age!
      );
    }

    if (args.difficulty) {
      drills = drills.filter((d) => d.difficulty === args.difficulty);
    }

    if (args.constraint) {
      drills = drills.filter((d) => d.constraints.includes(args.constraint!));
    }

    // Get authors
    const authorIds = [...new Set(drills.map((d) => d.authorId))];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = Object.fromEntries(
      authors.filter(Boolean).map((a) => [a!._id, a])
    );

    return drills.slice(0, limit).map((drill) => ({
      ...drill,
      author: authorMap[drill.authorId],
    }));
  },
});

// ═══════════════════════════════════════════════════════════
// ARTICLES (ae_articles)
// ═══════════════════════════════════════════════════════════

/**
 * Create a new article
 */
export const createArticle = mutation({
  args: {
    slug: v.string(),
    question: v.string(),
    category: v.string(),
    directAnswer: v.string(),
    keyTakeaways: v.array(v.string()),
    safetyNote: v.optional(v.string()),
    body: v.string(),
    authorId: v.id("experts"),
    expertTitle: v.optional(v.string()),
    relatedPillar: v.optional(v.string()),
    relatedDrills: v.array(v.string()),
    keywords: v.array(v.string()),
    ctaText: v.optional(v.string()),
    ctaUrl: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check for existing article with same slug
    const existing = await ctx.db
      .query("ae_articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error(`Article with slug "${args.slug}" already exists`);
    }

    // Verify author exists
    const author = await ctx.db.get(args.authorId);
    if (!author) throw new Error("Author not found");

    const articleId = await ctx.db.insert("ae_articles", {
      ...args,
      status: args.status ?? "draft",
      publishedAt: args.status === "published" ? now : now,
      updatedAt: now,
    });

    // Update author's article count
    await ctx.db.patch(args.authorId, {
      articleCount: (author.articleCount ?? 0) + 1,
      updatedAt: now,
    });

    return articleId;
  },
});

/**
 * Update an article
 */
export const updateArticle = mutation({
  args: {
    articleId: v.id("ae_articles"),
    question: v.optional(v.string()),
    directAnswer: v.optional(v.string()),
    keyTakeaways: v.optional(v.array(v.string())),
    safetyNote: v.optional(v.string()),
    body: v.optional(v.string()),
    relatedDrills: v.optional(v.array(v.string())),
    keywords: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { articleId, ...updates } = args;

    const existing = await ctx.db.get(articleId);
    if (!existing) throw new Error("Article not found");

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(articleId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Get article by slug
 */
export const getArticleBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("ae_articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!article) return null;

    // Get author
    const author = await ctx.db.get(article.authorId);

    return { ...article, author };
  },
});

/**
 * List articles with filters
 */
export const listArticles = query({
  args: {
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    authorId: v.optional(v.id("experts")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let articlesQuery;

    if (args.category && args.status) {
      articlesQuery = ctx.db
        .query("ae_articles")
        .withIndex("by_category", (q) =>
          q.eq("category", args.category!).eq("status", args.status!)
        );
    } else if (args.status) {
      articlesQuery = ctx.db
        .query("ae_articles")
        .withIndex("by_status", (q) => q.eq("status", args.status!));
    } else if (args.authorId) {
      articlesQuery = ctx.db
        .query("ae_articles")
        .withIndex("by_author", (q) => q.eq("authorId", args.authorId!));
    } else {
      articlesQuery = ctx.db.query("ae_articles");
    }

    const articles = await articlesQuery.take(limit);

    // Get authors for all articles
    const authorIds = [...new Set(articles.map((a) => a.authorId))];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = Object.fromEntries(
      authors.filter(Boolean).map((a) => [a!._id, a])
    );

    return articles.map((article) => ({
      ...article,
      author: authorMap[article.authorId],
    }));
  },
});

/**
 * Get Q&A pairs for Answer Engine API
 */
export const getQnAPairs = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    let articles;

    if (args.category) {
      articles = await ctx.db
        .query("ae_articles")
        .withIndex("by_category", (q) =>
          q.eq("category", args.category!).eq("status", "published")
        )
        .take(limit);
    } else {
      articles = await ctx.db
        .query("ae_articles")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .take(limit);
    }

    // Get authors
    const authorIds = [...new Set(articles.map((a) => a.authorId))];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = Object.fromEntries(
      authors.filter(Boolean).map((a) => [a!._id, a])
    );

    // Format for Q&A API
    return articles.map((article) => {
      const author = authorMap[article.authorId];
      return {
        id: article._id,
        question: article.question,
        answer: article.directAnswer,
        keyTakeaways: article.keyTakeaways,
        safetyNote: article.safetyNote,
        expert: author
          ? {
              name: author.name,
              title: author.title,
              credentials: author.credentials,
            }
          : null,
        url: `https://app.youthperformance.com/guides/${article.slug}`,
        lastUpdated: new Date(article.updatedAt).toISOString().split("T")[0],
      };
    });
  },
});

// ═══════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════

/**
 * Get Answer Engine content stats
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const [experts, drills, articles] = await Promise.all([
      ctx.db.query("experts").collect(),
      ctx.db.query("ae_drills").collect(),
      ctx.db.query("ae_articles").collect(),
    ]);

    const publishedDrills = drills.filter((d) => d.status === "published");
    const publishedArticles = articles.filter((a) => a.status === "published");

    // Count by sport
    const bySport: Record<string, number> = {};
    for (const drill of publishedDrills) {
      bySport[drill.sport] = (bySport[drill.sport] || 0) + 1;
    }

    // Count by category
    const byCategory: Record<string, number> = {};
    for (const drill of publishedDrills) {
      const key = `${drill.sport}/${drill.category}`;
      byCategory[key] = (byCategory[key] || 0) + 1;
    }

    return {
      experts: experts.length,
      drills: {
        total: drills.length,
        published: publishedDrills.length,
        draft: drills.filter((d) => d.status === "draft").length,
      },
      articles: {
        total: articles.length,
        published: publishedArticles.length,
        draft: articles.filter((a) => a.status === "draft").length,
      },
      bySport,
      byCategory,
    };
  },
});
