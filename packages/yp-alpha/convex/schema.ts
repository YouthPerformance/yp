// ═══════════════════════════════════════════════════════════
// CONVEX SCHEMA
// YouthPerformance - Wolf Pack Protocol v2.0
// Memory-First Architecture for Long-Term Athlete Development
// ═══════════════════════════════════════════════════════════

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ─────────────────────────────────────────────────────────────
// TYPE VALIDATORS
// ─────────────────────────────────────────────────────────────

const roleValidator = v.union(v.literal("athlete"), v.literal("parent"));
const rankValidator = v.union(
  v.literal("pup"),
  v.literal("hunter"),
  v.literal("alpha"),
  v.literal("apex")
);
const subscriptionValidator = v.union(v.literal("free"), v.literal("pro"));
const wolfColorValidator = v.union(
  v.literal("cyan"),
  v.literal("gold"),
  v.literal("purple"),
  v.literal("green"),
  v.literal("red")
);

// ─────────────────────────────────────────────────────────────
// SCHEMA DEFINITION
// ─────────────────────────────────────────────────────────────

export default defineSchema({
  // ═══════════════════════════════════════════════════════════
  // USERS TABLE
  // Core user profiles for athletes and parents
  // ═══════════════════════════════════════════════════════════
  users: defineTable({
    // Identity (from Clerk)
    clerkId: v.string(),
    email: v.string(),

    // Profile
    name: v.string(),
    role: roleValidator,
    avatarColor: wolfColorValidator,
    sport: v.optional(v.string()),
    age: v.optional(v.number()),

    // Gamification
    xpTotal: v.number(),
    crystals: v.number(),
    rank: rankValidator,
    streakCurrent: v.number(),
    streakBest: v.number(),
    streakFreezes: v.optional(v.number()),  // Available streak freezes (max 2)
    lastWorkoutAt: v.optional(v.number()),

    // Daily caps tracking (reset at midnight)
    dailyXpEarned: v.optional(v.number()),
    dailyCrystalsEarned: v.optional(v.number()),
    lastXpResetAt: v.optional(v.number()),

    // Daily quests
    dailyQuestIds: v.optional(v.array(v.string())),
    completedQuestIds: v.optional(v.array(v.string())),
    lastQuestResetAt: v.optional(v.number()),

    // Subscription
    subscriptionStatus: subscriptionValidator,
    subscriptionExpiresAt: v.optional(v.number()),

    // Parent-Child Linking
    parentCode: v.optional(v.string()),     // Code this user has (if athlete)
    athleteCodes: v.optional(v.array(v.string())), // Codes of athletes (if parent)
    linkedParentId: v.optional(v.id("users")),     // Parent's user ID (if athlete)
    linkedAthleteIds: v.optional(v.array(v.id("users"))), // Athlete IDs (if parent)

    // Onboarding
    onboardingCompletedAt: v.optional(v.number()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_parent_code", ["parentCode"])
    .index("by_role", ["role"]),

  // ═══════════════════════════════════════════════════════════
  // ENROLLMENTS TABLE
  // Tracks user enrollment in the 42-day program
  // ═══════════════════════════════════════════════════════════
  enrollments: defineTable({
    userId: v.id("users"),
    programSlug: v.string(), // "foundation-42"

    // Progress
    currentDay: v.number(),
    isActive: v.boolean(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),

    // Stats per enrollment
    totalWorkoutsCompleted: v.number(),
    totalXpEarned: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"]),

  // ═══════════════════════════════════════════════════════════
  // WORKOUT COMPLETIONS TABLE
  // Individual workout completion records
  // ═══════════════════════════════════════════════════════════
  workoutCompletions: defineTable({
    userId: v.id("users"),
    enrollmentId: v.id("enrollments"),
    dayNumber: v.number(),

    // Completion data
    completedAt: v.number(),
    durationSeconds: v.number(),
    xpEarned: v.number(),

    // Quiz results
    quizScore: v.optional(v.number()), // 0-100
    quizAnswers: v.optional(v.array(v.number())),

    // Strike WOD results (days 7, 14, 21, 28, 35, 42)
    isStrikeWod: v.optional(v.boolean()),
    strikeWodScore: v.optional(v.number()),
    strikeWodRank: v.optional(v.number()), // Percentile rank

    // Form tracking
    perfectForm: v.optional(v.boolean()),
  })
    .index("by_user", ["userId"])
    .index("by_enrollment", ["enrollmentId"])
    .index("by_user_day", ["userId", "dayNumber"]),

  // ═══════════════════════════════════════════════════════════
  // CARDS TABLE
  // Anime card collection (rewards)
  // ═══════════════════════════════════════════════════════════
  cards: defineTable({
    name: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    rarity: v.union(
      v.literal("common"),
      v.literal("uncommon"),
      v.literal("rare"),
      v.literal("epic"),
      v.literal("legendary")
    ),
    unlockedByDay: v.optional(v.number()), // Day that unlocks this card
    unlockedByAchievement: v.optional(v.string()),
  }),

  // ═══════════════════════════════════════════════════════════
  // USER CARDS TABLE
  // Junction table for user card collection
  // ═══════════════════════════════════════════════════════════
  userCards: defineTable({
    userId: v.id("users"),
    cardId: v.id("cards"),
    unlockedAt: v.number(),
    isNew: v.boolean(), // Show "NEW" badge
  })
    .index("by_user", ["userId"])
    .index("by_user_card", ["userId", "cardId"]),

  // ═══════════════════════════════════════════════════════════
  // PURCHASES TABLE
  // Crystal shop purchases
  // ═══════════════════════════════════════════════════════════
  purchases: defineTable({
    userId: v.id("users"),
    itemType: v.union(
      v.literal("streak_saver"),
      v.literal("xp_boost"),
      v.literal("card_pack"),
      v.literal("theme_pack")
    ),
    crystalsCost: v.number(),
    purchasedAt: v.number(),
    usedAt: v.optional(v.number()),
    metadata: v.optional(v.any()),
  })
    .index("by_user", ["userId"]),

  // ═══════════════════════════════════════════════════════════
  // PARENT CODES TABLE
  // Generated codes for parent-child linking
  // ═══════════════════════════════════════════════════════════
  parentCodes: defineTable({
    code: v.string(), // 6-digit alphanumeric
    parentId: v.id("users"),
    athleteId: v.optional(v.id("users")), // Set when claimed
    createdAt: v.number(),
    claimedAt: v.optional(v.number()),
    expiresAt: v.number(), // 48 hours from creation
  })
    .index("by_code", ["code"])
    .index("by_parent", ["parentId"]),

  // ═══════════════════════════════════════════════════════════
  // WOLF PACK PROTOCOL v2.0 - MEMORY KERNEL
  // The $100M Moat: Long-term athlete memory and context
  // ═══════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────
  // CONVERSATIONS TABLE
  // Chat session tracking for AskYP
  // ─────────────────────────────────────────────────────────────
  conversations: defineTable({
    userId: v.string(), // Clerk ID
    title: v.string(),
    lastMessageAt: v.number(),
    modelUsed: v.string(), // "claude-sonnet-4-5-..."
    messageCount: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_recent", ["userId", "lastMessageAt"]),

  // ─────────────────────────────────────────────────────────────
  // MESSAGES TABLE
  // Individual chat messages within conversations
  // ─────────────────────────────────────────────────────────────
  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    // Metadata for the Router to learn from
    intent: v.optional(v.string()), // "COACHING", "PLANNING"
    sentiment: v.optional(v.string()), // "FRUSTRATED"
    voiceScore: v.optional(v.number()), // Audit score (0-100)
    modelUsed: v.optional(v.string()),
    latencyMs: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"]),

  // ─────────────────────────────────────────────────────────────
  // ATHLETE NODES TABLE (The Graph Nodes)
  // Body parts, metrics, mental states - anything we track
  // e.g., "left_knee", "vertical_jump", "shooting_confidence"
  // ─────────────────────────────────────────────────────────────
  athlete_nodes: defineTable({
    userId: v.string(),
    key: v.string(), // "left_knee", "shooting_confidence", "sleep_quality"
    category: v.union(
      v.literal("body_part"),      // Physical: ankle, knee, hip
      v.literal("metric"),         // Measurable: vertical, sprint_time
      v.literal("mental"),         // Psychological: confidence, focus
      v.literal("recovery")        // Sleep, nutrition, fatigue
    ),
    status: v.string(), // "Healthy", "Sore", "Injured", "Improving", "Plateaued"
    score: v.number(), // 1-10 (1=Critical, 10=Elite)
    notes: v.optional(v.string()), // Context: "Rolled ankle at practice 12/28"
    lastUpdated: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_key", ["userId", "key"])
    .index("by_user_category", ["userId", "category"]),

  // ─────────────────────────────────────────────────────────────
  // CORRELATIONS TABLE (The Graph Edges)
  // Relationships: "high_volume_plyos" CAUSES "knee_pain"
  // ─────────────────────────────────────────────────────────────
  correlations: defineTable({
    userId: v.string(),
    fromNode: v.string(), // "high_volume_plyos"
    toNode: v.string(), // "knee_pain"
    relationship: v.union(
      v.literal("CAUSES"),     // A leads to B
      v.literal("IMPROVES"),   // A makes B better
      v.literal("BLOCKS"),     // A prevents B
      v.literal("CORRELATES")  // A and B move together
    ),
    strength: v.number(), // 0-1 confidence score
    observedAt: v.number(),
    observedCount: v.optional(v.number()), // How many times we've seen this
  })
    .index("by_user", ["userId"])
    .index("by_user_from", ["userId", "fromNode"])
    .index("by_user_to", ["userId", "toNode"]),

  // ─────────────────────────────────────────────────────────────
  // MEMORIES TABLE (Raw Extraction Buffer)
  // Before distilling into nodes, we capture raw insights
  // ─────────────────────────────────────────────────────────────
  memories: defineTable({
    userId: v.string(),
    conversationId: v.optional(v.id("conversations")),
    content: v.string(), // "Athlete mentioned left knee pain after dunking"
    memoryType: v.union(
      v.literal("injury"),     // Pain/injury reports
      v.literal("goal"),       // Goals mentioned
      v.literal("progress"),   // Progress updates
      v.literal("emotion"),    // Emotional state
      v.literal("preference"), // Training preferences
      v.literal("context")     // General context
    ),
    extractedAt: v.number(),
    processed: v.boolean(), // Has it been distilled into athlete_nodes?
    sourceMessage: v.optional(v.string()), // Original user message
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "memoryType"])
    .index("by_unprocessed", ["userId", "processed"]),

  // ─────────────────────────────────────────────────────────────
  // TRAINING CONTENT TABLE (RAG Knowledge Base)
  // Drills, articles, protocols with vector embeddings
  // ─────────────────────────────────────────────────────────────
  training_content: defineTable({
    title: v.string(),
    slug: v.optional(v.string()),
    category: v.union(
      v.literal("drill"),
      v.literal("article"),
      v.literal("protocol"),
      v.literal("faq")
    ),
    text: v.string(),
    tags: v.optional(v.array(v.string())),
    difficulty: v.optional(v.string()),
    duration: v.optional(v.string()),
    equipment: v.optional(v.array(v.string())),
    bodyParts: v.optional(v.array(v.string())), // What body parts it targets
    embedding: v.optional(v.array(v.float64())), // Vector for semantic search
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_slug", ["slug"]),
    // Note: Vector index added separately when embeddings are ready
    // .vectorIndex("by_embedding", { vectorField: "embedding", dimensions: 1536 })

  // ═══════════════════════════════════════════════════════════
  // GPT UPLINK - CONTENT MULTIPLEXER
  // Voice-to-content pipeline for Adam & James
  // ═══════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────
  // CAMPAIGNS TABLE
  // Parent container for multi-platform content bundles
  // ─────────────────────────────────────────────────────────────
  campaigns: defineTable({
    // Author identity
    author: v.union(v.literal("ADAM"), v.literal("JAMES")),

    // Content
    title: v.string(), // Derived from blog title
    rawInput: v.string(), // Original voice transcript

    // Workflow status
    status: v.union(
      v.literal("DRAFT"),      // Just created, awaiting review
      v.literal("READY"),      // Reviewed, ready to publish
      v.literal("PUBLISHED"),  // Sent to Make.com
      v.literal("FAILED")      // Generation or distribution failed
    ),

    // Error tracking
    errorMessage: v.optional(v.string()),

    // Distribution tracking
    publishedAt: v.optional(v.number()),
    makeWebhookResponse: v.optional(v.any()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_author", ["author"])
    .index("by_status", ["status"])
    .index("by_author_status", ["author", "status"])
    .index("by_created", ["createdAt"]),

  // ─────────────────────────────────────────────────────────────
  // CONTENT ASSETS TABLE
  // Platform-specific content versions within a campaign
  // ─────────────────────────────────────────────────────────────
  content_assets: defineTable({
    campaignId: v.id("campaigns"),

    // Platform targeting
    platform: v.union(
      v.literal("BLOG"),
      v.literal("LINKEDIN"),
      v.literal("TWITTER"),
      v.literal("INSTAGRAM")
    ),

    // Content
    title: v.optional(v.string()), // For blog/linkedin
    body: v.string(), // Platform-formatted content

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_campaign", ["campaignId"])
    .index("by_platform", ["platform"]),
});
