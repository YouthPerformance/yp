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
  v.literal("apex"),
);
const subscriptionValidator = v.union(v.literal("free"), v.literal("pro"));
const wolfColorValidator = v.union(
  v.literal("cyan"),
  v.literal("gold"),
  v.literal("purple"),
  v.literal("green"),
  v.literal("red"),
);

// R3 Wolf Pack Sorting validators
const wolfIdentityValidator = v.union(v.literal("speed"), v.literal("tank"), v.literal("air"));

const trainingPathValidator = v.union(
  v.literal("glass"), // Pain-dominant → Release phase
  v.literal("grinder"), // Volume-dominant → Restore phase
  v.literal("prospect"), // Output-ready → Re-Engineer phase
);

const sortingMethodValidator = v.union(
  v.literal("voice"),
  v.literal("buttons"),
  v.literal("parent_assisted"),
  v.literal("manual"),
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
    // Identity - BetterAuth (replaces Clerk)
    // authUserId links to betterauth_users table managed by BetterAuth component
    authUserId: v.optional(v.string()),

    // DEPRECATED: clerkId - kept for migration, remove after 30 days
    clerkId: v.optional(v.string()),

    // Primary identifier
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
    streakFreezes: v.optional(v.number()), // Available streak freezes (max 2)
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
    parentCode: v.optional(v.string()), // Code this user has (if athlete)
    athleteCodes: v.optional(v.array(v.string())), // Codes of athletes (if parent)
    linkedParentId: v.optional(v.id("users")), // Parent's user ID (if athlete)
    linkedAthleteIds: v.optional(v.array(v.id("users"))), // Athlete IDs (if parent)

    // Onboarding
    onboardingCompletedAt: v.optional(v.number()),

    // ═══════════════════════════════════════════════════════════
    // R3 WOLF PACK SORTING
    // Two-layer system: Identity (aspirational) + Path (biological)
    // ═══════════════════════════════════════════════════════════

    // Wolf Identity (The Skin) - What they WANT to be
    wolfIdentity: v.optional(wolfIdentityValidator),

    // Training Path (The Engine) - What they NEED right now
    trainingPath: v.optional(trainingPathValidator),

    // Coach explanation for the sorting
    sortingCoachComment: v.optional(v.string()),

    // Classification confidence (0-1)
    sortingConfidence: v.optional(v.number()),

    // How they were sorted
    sortingMethod: v.optional(sortingMethodValidator),

    // When sorted
    sortedAt: v.optional(v.number()),

    // First mission assigned based on path
    firstMissionId: v.optional(v.string()),

    // Path evolution history (for future re-sorting)
    pathHistory: v.optional(
      v.array(
        v.object({
          path: trainingPathValidator,
          assignedAt: v.number(),
          reason: v.string(),
        }),
      ),
    ),

    // COPPA: Age verification for under-13
    dateOfBirth: v.optional(v.string()), // ISO date string
    isUnder13: v.optional(v.boolean()),
    parentConsentId: v.optional(v.id("parentConsents")),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_auth_user_id", ["authUserId"])
    .index("by_clerk_id", ["clerkId"]) // DEPRECATED: Remove after migration
    .index("by_email", ["email"])
    .index("by_parent_code", ["parentCode"])
    .index("by_role", ["role"])
    .index("by_training_path", ["trainingPath"])
    .index("by_wolf_identity", ["wolfIdentity"]),

  // ═══════════════════════════════════════════════════════════
  // PARENT CONSENTS TABLE (COPPA COMPLIANCE)
  // Verifiable parental consent for athletes under 13
  // Required before any AI/voice interaction
  // ═══════════════════════════════════════════════════════════
  parentConsents: defineTable({
    // Parent identification
    parentEmail: v.string(),
    parentPhone: v.optional(v.string()),

    // Link to athlete
    athleteUserId: v.id("users"),

    // What are they consenting to?
    consentType: v.union(
      v.literal("voice_sorting"),
      v.literal("ai_chat"),
      v.literal("data_collection"),
    ),

    // How did they verify? (FTC-approved methods)
    consentMethod: v.union(
      v.literal("sms_verification"),
      v.literal("email_verification"),
      v.literal("credit_card_verification"),
    ),

    // Verification
    verificationCode: v.optional(v.string()), // Hashed
    verified: v.boolean(),
    consentedAt: v.optional(v.number()),

    // Audit trail (required by COPPA)
    ipAddress: v.string(),
    userAgent: v.string(),

    // Timestamps
    createdAt: v.number(),
    expiresAt: v.optional(v.number()), // Some consents may expire
  })
    .index("by_athlete", ["athleteUserId"])
    .index("by_parent_email", ["parentEmail"])
    .index("by_verified", ["verified"]),

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
    .index("by_user_active", ["userId", "isActive"])
    .index("by_user_program", ["userId", "programSlug"]),

  // ═══════════════════════════════════════════════════════════
  // WORKOUT COMPLETIONS TABLE
  // Individual workout completion records
  // ═══════════════════════════════════════════════════════════
  workoutCompletions: defineTable({
    userId: v.id("users"),
    enrollmentId: v.optional(v.id("enrollments")), // Made optional for standalone programs
    programSlug: v.optional(v.string()), // For standalone program tracking
    dayNumber: v.number(),

    // Completion data
    completedAt: v.number(),
    durationSeconds: v.optional(v.number()), // Made optional for simple completions
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
    .index("by_user_day", ["userId", "dayNumber"])
    .index("by_user_program", ["userId", "programSlug"]),

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
      v.literal("legendary"),
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
      v.literal("theme_pack"),
    ),
    crystalsCost: v.number(),
    purchasedAt: v.number(),
    usedAt: v.optional(v.number()),
    metadata: v.optional(v.any()),
  }).index("by_user", ["userId"]),

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
      v.literal("body_part"), // Physical: ankle, knee, hip
      v.literal("metric"), // Measurable: vertical, sprint_time
      v.literal("mental"), // Psychological: confidence, focus
      v.literal("recovery"), // Sleep, nutrition, fatigue
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
      v.literal("CAUSES"), // A leads to B
      v.literal("IMPROVES"), // A makes B better
      v.literal("BLOCKS"), // A prevents B
      v.literal("CORRELATES"), // A and B move together
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
      v.literal("injury"), // Pain/injury reports
      v.literal("goal"), // Goals mentioned
      v.literal("progress"), // Progress updates
      v.literal("emotion"), // Emotional state
      v.literal("preference"), // Training preferences
      v.literal("context"), // General context
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
      v.literal("faq"),
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
      v.literal("DRAFT"), // Just created, awaiting review
      v.literal("READY"), // Reviewed, ready to publish
      v.literal("PUBLISHED"), // Sent to Make.com
      v.literal("FAILED"), // Generation or distribution failed
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
      v.literal("INSTAGRAM"),
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

  // ─────────────────────────────────────────────────────────────
  // LEARNING PROGRESS TABLE
  // Track user progress through interactive learning modules
  // ─────────────────────────────────────────────────────────────
  learningProgress: defineTable({
    userId: v.id("users"),
    moduleId: v.string(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    currentSectionId: v.string(),
    currentCardId: v.string(),
    totalCorrect: v.number(),
    totalAttempts: v.number(),
    crystalsEarned: v.number(),
    sectionsUnlocked: v.array(v.string()),
    mode: v.union(v.literal("athlete"), v.literal("parent")),
    cardHistory: v.array(
      v.object({
        cardId: v.string(),
        viewedAt: v.number(),
        answeredAt: v.optional(v.number()),
        wasCorrect: v.optional(v.boolean()),
        attemptsOnCard: v.number(),
      }),
    ),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_module", ["userId", "moduleId"]),

  // ─────────────────────────────────────────────────────────────
  // USER BADGES TABLE
  // Badges earned by completing modules and achievements
  // ─────────────────────────────────────────────────────────────
  userBadges: defineTable({
    userId: v.id("users"),
    badgeId: v.string(),
    badgeName: v.string(),
    badgeIcon: v.string(),
    badgeDescription: v.string(),
    source: v.string(), // e.g., "module:bpa-v1"
    earnedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_badge", ["userId", "badgeId"]),

  // ─────────────────────────────────────────────────────────────
  // ENTITLEMENTS TABLE
  // Track user access to programs and content
  // ─────────────────────────────────────────────────────────────
  entitlements: defineTable({
    userId: v.id("users"),
    productSlug: v.string(),
    productType: v.union(v.literal("program"), v.literal("content"), v.literal("feature")),
    source: v.union(v.literal("purchase"), v.literal("promo"), v.literal("admin")),
    status: v.union(v.literal("active"), v.literal("expired"), v.literal("revoked")),
    grantedAt: v.number(),
    expiresAt: v.optional(v.number()),
    metadata: v.optional(v.any()),
  })
    .index("by_user", ["userId"])
    .index("by_user_product", ["userId", "productSlug"]),

  // ─────────────────────────────────────────────────────────────
  // EMAIL CAPTURES TABLE
  // Lead capture for teaser modules → paid conversion
  // ─────────────────────────────────────────────────────────────
  emailCaptures: defineTable({
    email: v.string(),
    source: v.string(), // e.g., "bpa-teaser-completion", "homepage-cta"
    capturedAt: v.number(),
    userId: v.optional(v.id("users")), // If they later sign up
    rewardUnlocked: v.optional(v.string()), // e.g., "bpa-drill-stack-preview"
    convertedAt: v.optional(v.number()), // When they purchased
    convertedTo: v.optional(v.string()), // e.g., "barefoot-reset-42"
    metadata: v.optional(v.any()), // Session ID, UTM params, etc.
  })
    .index("by_email", ["email"])
    .index("by_source", ["source"])
    .index("by_converted", ["convertedTo"]),

  // ─────────────────────────────────────────────────────────────
  // SHOPIFY ORDERS TABLE
  // Track Shopify orders for golden ticket generation
  // ─────────────────────────────────────────────────────────────
  shopifyOrders: defineTable({
    shopifyOrderId: v.string(),
    shopifyOrderNumber: v.string(),
    email: v.string(),
    customerName: v.string(),
    lineItems: v.array(
      v.object({
        sku: v.optional(v.string()),
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
      }),
    ),
    totalAmount: v.number(),
    currency: v.string(),
    processed: v.boolean(),
    createdAt: v.number(),
    shopifyCreatedAt: v.string(),
  })
    .index("by_shopify_order", ["shopifyOrderId"])
    .index("by_email", ["email"]),

  // ─────────────────────────────────────────────────────────────
  // GOLDEN TICKETS TABLE
  // Claimable tickets from Shopify purchases
  // ─────────────────────────────────────────────────────────────
  goldenTickets: defineTable({
    token: v.string(),
    orderId: v.id("shopifyOrders"),
    productSlug: v.string(),
    productName: v.string(),
    status: v.union(v.literal("pending"), v.literal("claimed"), v.literal("expired")),
    claimedBy: v.optional(v.id("users")),
    claimedAt: v.optional(v.number()),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_order", ["orderId"])
    .index("by_status", ["status"]),
});
