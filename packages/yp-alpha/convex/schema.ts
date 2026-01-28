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

// Wolf Contract validators
const contractStatusValidator = v.union(
  v.literal("active"),
  v.literal("completed"),
  v.literal("failed"),
);

// Wolf Contract - The Commitment Ceremony
const wolfContractValidator = v.object({
  // Timestamps
  signedAt: v.number(),
  startDate: v.number(),
  expiresAt: v.number(),

  // Contract data
  signatureData: v.string(), // Base64 signature image
  checkboxes: v.object({
    showUp: v.boolean(),
    trustBlueprint: v.boolean(),
    earnGear: v.boolean(),
  }),

  // Geography
  country: v.string(),
  countryCode: v.string(),

  // Progress
  windowDays: v.number(), // 42
  levelsRequired: v.number(), // 30
  levelsCompleted: v.number(),
  levelLog: v.array(
    v.object({
      levelNumber: v.number(), // 1-30
      workoutId: v.string(),
      completedAt: v.number(),
      noteText: v.string(),
      videoWatchPercent: v.number(),
    }),
  ),

  // Status
  status: contractStatusValidator,

  // Reward
  creditEarned: v.number(), // 0 or 88
  creditCode: v.optional(v.string()),
  creditExpiresAt: v.optional(v.number()),
  creditRedeemedAt: v.optional(v.number()),
});

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

    // ═══════════════════════════════════════════════════════════
    // WOLF CONTRACT
    // Gamified commitment: 30 Levels in 42 days → $88 credit
    // ═══════════════════════════════════════════════════════════
    wolfContract: v.optional(wolfContractValidator),

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
  // WOLF CONTRACT RESERVATIONS TABLE
  // 15-minute holds after payment, before contract signing
  // ═══════════════════════════════════════════════════════════
  contractReservations: defineTable({
    // Link to athlete
    athleteUserId: v.id("users"),

    // Payment info
    stripePaymentIntentId: v.string(),
    amountPaid: v.number(), // 88, 588, 69, 79 depending on currency
    currency: v.string(), // USD, CNY, GBP, EUR

    // Geography
    country: v.string(),
    countryCode: v.string(),

    // Status
    status: v.union(
      v.literal("pending"), // Payment received, awaiting contract
      v.literal("claimed"), // Contract signed within window
      v.literal("expired"), // 15-min window passed
    ),

    // Timestamps
    createdAt: v.number(),
    expiresAt: v.number(), // createdAt + 15 minutes
    claimedAt: v.optional(v.number()),
  })
    .index("by_athlete", ["athleteUserId"])
    .index("by_status", ["status"])
    .index("by_stripe_payment", ["stripePaymentIntentId"]),

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
    // Vector embedding for semantic search (1536 dimensions for text-embedding-3-small)
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_user", ["userId"])
    .index("by_user_key", ["userId", "key"])
    .index("by_user_category", ["userId", "category"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["userId", "category"],
    }),

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
    // Vector embedding for semantic search
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "memoryType"])
    .index("by_unprocessed", ["userId", "processed"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["userId", "memoryType"],
    }),

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
    .index("by_slug", ["slug"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["category"],
    }),

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

  // ═══════════════════════════════════════════════════════════
  // VIRAL WAITLIST SYSTEM
  // NeoBall pre-launch waitlist with referral mechanics
  // ═══════════════════════════════════════════════════════════
  waitlistEntries: defineTable({
    // Contact
    email: v.string(),

    // Product preference
    size: v.union(v.literal("6"), v.literal("7")),
    product: v.optional(v.string()), // "neoball" etc.

    // Referral system
    referralCode: v.string(), // Unique code for sharing (nanoid)
    referredBy: v.optional(v.string()), // referralCode of who referred them
    referralCount: v.number(), // Number of people they've referred

    // Position tracking
    // Effective position = basePosition - (referralCount * 10)
    basePosition: v.number(), // Original signup order (immutable)

    // Tier system
    currentTier: v.optional(v.string()), // "recruit", "starter", "captain", etc.
    tierHistory: v.optional(v.array(v.object({
      tier: v.string(),
      unlockedAt: v.number(),
      referralCountAtUnlock: v.number(),
    }))),

    // Source tracking
    source: v.string(), // "neoball-waitlist"

    // Timestamps
    joinedAt: v.number(),

    // Email sent tracking
    confirmationSentAt: v.optional(v.number()),

    // Metadata
    metadata: v.optional(v.any()), // UTM params, user agent, etc.
  })
    .index("by_email", ["email"])
    .index("by_referral_code", ["referralCode"])
    .index("by_base_position", ["basePosition"])
    .index("by_referral_count", ["referralCount"])
    .index("by_joined", ["joinedAt"]),

  // ═══════════════════════════════════════════════════════════
  // PLAYBOOK CONTENT FACTORY
  // AI-generated content with expert voice iteration
  // ═══════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────
  // PLAYBOOK CONTENT TABLE
  // Stores AI-generated pages for James/Adam review
  // ─────────────────────────────────────────────────────────────
  playbook_content: defineTable({
    // Identity
    slug: v.string(), // URL-safe slug: "barefoot-for-golf"

    contentType: v.union(
      v.literal("pillar"), // 2,500-4,000 word comprehensive guides
      v.literal("topic"), // 1,200-2,000 word sub-topic pages
      v.literal("qa"), // 800-1,200 word parent Q&A
      v.literal("drill"), // 400-600 word drill cards
    ),

    // Ownership
    author: v.union(v.literal("JAMES"), v.literal("ADAM"), v.literal("YP"), v.literal("TEAM_YP")),

    // Categorization
    category: v.string(), // "basketball", "barefoot-training", etc.
    subcategory: v.optional(v.string()), // "shooting", "injury-rehab", etc.

    // Target (for age/sport specific content)
    targetAge: v.optional(v.number()), // 8, 9, 10, etc.
    targetSport: v.optional(v.string()), // "golf", "soccer", etc.

    // Content
    title: v.string(),
    frontmatter: v.any(), // All metadata (directAnswer, keywords, keyTakeaways, etc.)
    body: v.string(), // MDX/Markdown content

    // Workflow status
    status: v.union(
      v.literal("DRAFT"), // Just generated, awaiting review
      v.literal("IN_REVIEW"), // Expert is looking at it
      v.literal("CHANGES_REQUESTED"), // Expert wants edits
      v.literal("APPROVED"), // Ready to export
      v.literal("PUBLISHED"), // Exported to Git/Playbook
    ),

    // Version tracking
    version: v.number(), // Current version number
    parentVersion: v.optional(v.id("playbook_content")), // Previous version ID

    // Iteration feedback
    iterationNotes: v.optional(v.string()), // Voice feedback transcript
    changesRequested: v.optional(v.string()), // What the expert wanted changed

    // Approval tracking
    approvedAt: v.optional(v.number()),
    approvedBy: v.optional(v.string()), // "JAMES" or "ADAM"
    approverNotes: v.optional(v.string()),

    // Publishing
    publishedAt: v.optional(v.number()),
    gitPrUrl: v.optional(v.string()), // PR URL for tracking

    // Generation metadata
    generationModel: v.optional(v.string()), // "claude-sonnet-4-5-..."
    promptTokens: v.optional(v.number()),
    completionTokens: v.optional(v.number()),

    // ═══════════════════════════════════════════════════════════
    // VOICE COMMAND CENTER ADDITIONS
    // Auto-scoring and routing for expert review
    // ═══════════════════════════════════════════════════════════

    // Voice compliance score (0-100) - computed by AI
    voiceComplianceScore: v.optional(v.number()),

    // Approval tier based on score: green (auto-approve), yellow (review), red (reject)
    approvalTier: v.optional(v.union(v.literal("green"), v.literal("yellow"), v.literal("red"))),

    // Whether this content requires a spot check (random sampling of green tier)
    spotCheckRequired: v.optional(v.boolean()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_author", ["author"])
    .index("by_status", ["status"])
    .index("by_author_status", ["author", "status"])
    .index("by_category", ["category"])
    .index("by_content_type", ["contentType"])
    .index("by_created", ["createdAt"])
    .index("by_approval_tier", ["approvalTier", "status"]),

  // ─────────────────────────────────────────────────────────────
  // EXPERT VOICE EXAMPLES TABLE
  // Stores approved/rejected examples for voice learning
  // ─────────────────────────────────────────────────────────────
  expert_voice_examples: defineTable({
    // Which expert's voice
    expert: v.union(v.literal("JAMES"), v.literal("ADAM"), v.literal("TEAM_YP")),

    // Example type
    exampleType: v.union(
      v.literal("approved"), // Content they liked
      v.literal("rejected"), // Content they didn't like
    ),

    // The content
    contentSnippet: v.string(), // Up to ~500 chars of example text
    fullContentId: v.optional(v.id("playbook_content")), // Reference to full content

    // Context
    category: v.string(), // For category-specific learning
    contentType: v.string(), // "pillar", "topic", "qa", "drill"

    // Feedback (for rejected)
    feedback: v.optional(v.string()), // Why they rejected it
    correctedVersion: v.optional(v.string()), // What they changed it to

    // Timestamps
    createdAt: v.number(),
  })
    .index("by_expert", ["expert"])
    .index("by_expert_type", ["expert", "exampleType"])
    .index("by_expert_category", ["expert", "category"]),

  // ─────────────────────────────────────────────────────────────
  // VOICE LEARNINGS TABLE
  // THE MOAT: Every voice edit becomes training data
  // Captures before/after text + voice instruction for future self-editing
  // ─────────────────────────────────────────────────────────────
  voice_learnings: defineTable({
    // Who made the edit
    expert: v.union(v.literal("JAMES"), v.literal("ADAM")),

    // What they edited
    contentType: v.string(), // "pillar", "topic", "qa", "drill"
    category: v.string(), // "basketball", "barefoot", etc.

    // The edit itself
    originalText: v.string(), // What the AI wrote
    voiceInstruction: v.string(), // What they said (transcript)
    correctedText: v.string(), // What it became after edit

    // Audio storage (for future voice cloning/analysis)
    audioStorageId: v.optional(v.id("_storage")),
    audioDurationMs: v.optional(v.number()),

    // Context around the edit
    selectedContext: v.optional(v.string()), // Surrounding paragraphs

    // Content reference
    contentId: v.optional(v.id("playbook_content")),

    // Pattern extraction (computed/enriched later)
    editPattern: v.optional(v.string()), // "simplify", "add_example", "tone_shift", etc.
    confidence: v.optional(v.number()), // 0-1 how reliable this example is

    // Did they accept the AI's suggested edit?
    applied: v.boolean(),

    // Timestamps
    createdAt: v.number(),
  })
    .index("by_expert", ["expert"])
    .index("by_expert_category", ["expert", "category"])
    .index("by_expert_content_type", ["expert", "contentType"])
    .index("by_pattern", ["editPattern"])
    .index("by_applied", ["applied"])
    .index("by_created", ["createdAt"]),

  // ═══════════════════════════════════════════════════════════════
  // ANSWER ENGINE - THE WIKIPEDIA OF YOUTH SPORTS
  // Machine-readable content for AI citation (Perplexity, ChatGPT, etc.)
  // ═══════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────
  // EXPERTS TABLE (E-E-A-T)
  // Author profiles for trust signals and citation
  // ─────────────────────────────────────────────────────────────────
  experts: defineTable({
    slug: v.string(), // "james-scott", "adam-harrington"
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
    // Stats (computed, updated periodically)
    drillCount: v.optional(v.number()),
    articleCount: v.optional(v.number()),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"]),

  // ─────────────────────────────────────────────────────────────────
  // ANSWER ENGINE DRILLS TABLE
  // Structured training content for AI retrieval and programmatic SEO
  // ─────────────────────────────────────────────────────────────────
  ae_drills: defineTable({
    // Identity
    slug: v.string(),
    title: v.string(),
    subtitle: v.optional(v.string()),

    // Categorization (programmatic SEO matrix)
    sport: v.string(), // "basketball", "soccer", "general"
    category: v.string(), // "shooting", "ball-handling", "ankle-mobility"
    cluster: v.optional(v.string()), // "pain-relief", "silent-training"

    // Age targeting
    ageMin: v.number(),
    ageMax: v.number(),

    // Filtering
    difficulty: v.string(), // "beginner", "intermediate", "advanced", "scalable"
    tags: v.array(v.string()),
    constraints: v.array(v.string()), // "no-equipment", "indoor", "solo"

    // Core content
    description: v.string(),
    benefits: v.array(v.string()),
    coachNote: v.optional(v.string()),

    // Steps (structured for Schema.org HowTo)
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

    // Coaching metadata
    coachingCues: v.array(v.string()),
    commonMistake: v.optional(v.string()),
    mistakeFix: v.optional(v.string()),
    warmup: v.optional(v.string()),
    cooldown: v.optional(v.string()),

    // Practical info
    duration: v.string(), // "5-10 min"
    reps: v.optional(v.string()), // "3 sets x 10 reps"
    equipment: v.array(v.string()),

    // Variations
    variations: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
          difficulty: v.string(),
        })
      )
    ),

    // Author (E-E-A-T)
    authorId: v.id("experts"),
    reviewedBy: v.optional(v.string()),
    sources: v.optional(v.array(v.string())),

    // Media
    videoUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    gifUrl: v.optional(v.string()),

    // Related content
    relatedDrills: v.array(v.string()), // Slugs
    parentProtocol: v.optional(v.string()),

    // SEO
    keywords: v.array(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),

    // Status & timestamps
    status: v.string(), // "draft", "published", "archived"
    publishedAt: v.optional(v.number()),
    updatedAt: v.number(),

    // Vector embedding (Phase 2 - semantic search)
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_slug", ["slug"])
    .index("by_sport", ["sport", "status"])
    .index("by_category", ["sport", "category", "status"])
    .index("by_status", ["status"])
    .index("by_author", ["authorId"])
    .index("by_cluster", ["cluster"]),

  // ─────────────────────────────────────────────────────────────────
  // ANSWER ENGINE ARTICLES TABLE
  // Q&A Pages / Parent Sidelines for featured snippets
  // ─────────────────────────────────────────────────────────────────
  ae_articles: defineTable({
    // Identity
    slug: v.string(),
    question: v.string(),
    category: v.string(),

    // AEO Critical Elements (Featured Snippet targets)
    directAnswer: v.string(), // 2-3 sentence answer for AI citation
    keyTakeaways: v.array(v.string()),
    safetyNote: v.optional(v.string()),

    // Full content
    body: v.string(), // MDX/Markdown

    // Author (E-E-A-T)
    authorId: v.id("experts"),
    expertTitle: v.optional(v.string()),

    // Linking
    relatedPillar: v.optional(v.string()),
    relatedDrills: v.array(v.string()), // Slugs

    // SEO
    keywords: v.array(v.string()),

    // CTA
    ctaText: v.optional(v.string()),
    ctaUrl: v.optional(v.string()),

    // Status & timestamps
    status: v.string(), // "draft", "published", "archived"
    publishedAt: v.number(),
    updatedAt: v.number(),

    // Vector embedding (Phase 2 - semantic search)
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category", "status"])
    .index("by_status", ["status"])
    .index("by_author", ["authorId"]),

  // ═══════════════════════════════════════════════════════════════
  // YP JUMP - xLENS VERIFICATION PROTOCOL
  // Post-AGI Resilient Athletic Performance Verification
  // "Proof of Physical Work" - The missing standard
  // ═══════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────
  // JUMP USERS TABLE
  // Athlete profiles specific to YP Jump
  // ─────────────────────────────────────────────────────────────────
  jumpUsers: defineTable({
    // Link to BetterAuth
    authUserId: v.string(),

    // Profile
    displayName: v.string(),
    birthYear: v.number(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),

    // Location (city-level only for privacy)
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(), // ISO 3166-1 alpha-2

    // Privacy settings
    profileVisibility: v.union(
      v.literal("public"),
      v.literal("regional"),
      v.literal("private")
    ),
    showOnLeaderboards: v.boolean(),

    // Daily cap tracking
    dailyJumpsUsed: v.number(),
    lastJumpResetAt: v.number(),

    // Device binding
    primaryDeviceKeyId: v.optional(v.id("deviceKeys")),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_auth_user", ["authUserId"])
    .index("by_country", ["country"])
    .index("by_city", ["country", "state", "city"]),

  // ─────────────────────────────────────────────────────────────────
  // SESSIONS TABLE (xLENS)
  // Server-issued nonces for challenge-response verification
  // Prevents pre-recorded video attacks
  // ─────────────────────────────────────────────────────────────────
  sessions: defineTable({
    // Owner
    userId: v.id("jumpUsers"),
    deviceKeyId: v.optional(v.id("deviceKeys")),

    // Nonce data
    nonce: v.string(), // 16 bytes, base64 encoded
    nonceDisplay: v.string(), // 6-8 alphanumeric chars for video overlay
    nonceChirpFreqs: v.optional(v.array(v.number())), // Audio pattern frequencies (Phase C)

    // Lifecycle
    expiresAt: v.number(), // 120 seconds from creation
    used: v.boolean(), // Can only use once

    // Timestamps
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_nonce", ["nonce"])
    .index("by_expires", ["expiresAt"]),

  // ─────────────────────────────────────────────────────────────────
  // xLENS WEB SESSIONS TABLE
  // Simplified sessions for web demo (no jumpUser required)
  // ─────────────────────────────────────────────────────────────────
  xlensWebSessions: defineTable({
    nonce: v.string(),
    nonceDisplay: v.string(),
    expiresAt: v.number(),
    deviceId: v.string(),
    used: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_nonce", ["nonce"])
    .index("by_device", ["deviceId"]),

  // ─────────────────────────────────────────────────────────────────
  // WEB JUMPS TABLE (xLENS Web Demo)
  // Simplified jump records for web-based capture
  // No jumpUser required - uses deviceId for tracking
  // ─────────────────────────────────────────────────────────────────
  xlensWebJumps: defineTable({
    // Session reference (string to work with HTTP API)
    sessionId: v.string(),
    deviceId: v.string(),

    // Video storage
    storageId: v.string(), // Convex storage ID

    // Recording metadata
    durationMs: v.number(),
    fps: v.number(),
    nonce: v.string(),
    nonceDisplay: v.string(),

    // User calibration (for improved accuracy)
    userHeightInches: v.optional(v.number()), // User's standing height for scale reference

    // Measurement results (from Gemini analysis)
    heightInches: v.optional(v.number()), // Measured jump height

    // Verification
    verificationTier: v.string(), // "measured" | "bronze" | "silver" | "rejected"

    // Status
    status: v.string(), // "processing" | "complete" | "failed"

    // Flags from analysis
    flags: v.optional(v.array(v.string())),

    // Timestamps
    createdAt: v.number(),
    processedAt: v.optional(v.number()),
  })
    .index("by_session", ["sessionId"])
    .index("by_device", ["deviceId"])
    .index("by_status", ["status"]),

  // ─────────────────────────────────────────────────────────────────
  // DEVICE KEYS TABLE (xLENS)
  // Hardware-attested signing keys for proof of capture
  // Layer 1 + 2 of the Three-Layer Defense
  // ─────────────────────────────────────────────────────────────────
  deviceKeys: defineTable({
    // Owner
    userId: v.id("jumpUsers"),

    // Key identity
    keyId: v.string(), // Unique identifier
    publicKey: v.string(), // Base64 encoded public key (ES256)

    // Platform info
    platform: v.union(v.literal("ios"), v.literal("android")),
    deviceModel: v.string(),
    osVersion: v.string(),

    // Attestation data (platform-specific)
    attestationData: v.optional(v.any()), // App Attest / Play Integrity chain

    // Trust scoring (0-1, degradable)
    trustScore: v.number(), // Starts at 1.0
    hardwareLevel: v.union(
      v.literal("strongbox"), // Hardware-backed (Gold eligible)
      v.literal("tee"), // Trusted Execution Environment (Silver max)
      v.literal("software") // Software-only (Bronze max)
    ),

    // Lifecycle
    createdAt: v.number(),
    lastUsedAt: v.number(),
    revokedAt: v.optional(v.number()),
    revocationReason: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_key_id", ["keyId"])
    .index("by_platform", ["platform"]),

  // ─────────────────────────────────────────────────────────────────
  // JUMPS TABLE (xLENS)
  // Individual jump records with full proof packs
  // THE MOAT: Always captures IMU data
  // ─────────────────────────────────────────────────────────────────
  jumps: defineTable({
    // Owner
    userId: v.id("jumpUsers"),
    sessionId: v.id("sessions"),

    // Measurement results
    heightInches: v.optional(v.number()),
    heightCm: v.optional(v.number()),
    flightTimeMs: v.optional(v.number()),

    // Verification
    confidence: v.optional(v.number()), // 0-1 overall confidence
    verificationTier: v.union(
      v.literal("measured"), // Phase A: No tier claim
      v.literal("bronze"), // Phase B+: Basic verification
      v.literal("silver"), // Phase B+: Attested + correlated
      v.literal("gold"), // Phase C: Full 4-gate
      v.literal("rejected") // Failed crypto verification
    ),

    // VPC reference (Phase B+)
    vpcId: v.optional(v.id("vpcs")),

    // Evidence storage
    videoStorageId: v.id("_storage"),
    sensorStorageId: v.id("_storage"), // IMU data - ALWAYS CAPTURED

    // Proof payload (what the device signed)
    proofPayload: v.object({
      sessionId: v.string(),
      nonce: v.string(),
      capture: v.object({
        testType: v.literal("VERT_JUMP"),
        startedAtMs: v.number(),
        endedAtMs: v.number(),
        fps: v.number(),
        device: v.object({
          platform: v.union(v.literal("ios"), v.literal("android")),
          model: v.string(),
          osVersion: v.string(),
          appVersion: v.string(),
        }),
      }),
      hashes: v.object({
        videoSha256: v.string(),
        sensorSha256: v.string(),
        metadataSha256: v.string(),
      }),
      signature: v.object({
        alg: v.literal("ES256"),
        keyId: v.string(),
        sig: v.string(), // Base64
      }),
      gps: v.optional(
        v.object({
          lat: v.number(),
          lng: v.number(),
          accuracyM: v.number(),
          capturedAtMs: v.number(),
        })
      ),
    }),

    // Gate scores (ALWAYS computed, enforcement varies by phase)
    gateScores: v.optional(
      v.object({
        attestation: v.number(), // Gate A: Device trust (0-1)
        cryptoValid: v.boolean(), // Gate B: Hash + signature valid
        liveness: v.number(), // Gate C: Nonce detection (0-1)
        physics: v.number(), // Gate D: IMU correlation (0-1) - THE MOAT
      })
    ),

    // AI analysis results
    aiAnalysis: v.optional(
      v.object({
        takeoffFrame: v.number(),
        landingFrame: v.number(),
        nonceDetected: v.boolean(),
        chirpDetected: v.optional(v.boolean()), // Phase C
        imuCorrelation: v.number(),
        confidence: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
        issues: v.optional(v.array(v.string())),
      })
    ),

    // Status
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("complete"),
      v.literal("flagged"),
      v.literal("challenged")
    ),
    isPractice: v.optional(v.boolean()), // Over daily cap (optional for legacy data)

    // Location (reverse geocoded from GPS)
    gpsCity: v.optional(v.string()),
    gpsState: v.optional(v.string()),
    gpsCountry: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    processedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_session", ["sessionId"])
    .index("by_status", ["status"])
    .index("by_tier", ["verificationTier"]),

  // ─────────────────────────────────────────────────────────────────
  // VPCS TABLE (Phase B+)
  // Verified Performance Certificates - Portable credentials
  // "Proof of Physical Work" standard
  // ─────────────────────────────────────────────────────────────────
  vpcs: defineTable({
    // Public identifiers
    vpcId: v.string(), // vpc_xxx format
    athleteId: v.string(), // ath_xxx pseudonymous ID

    // Internal references
    userId: v.id("jumpUsers"),
    jumpId: v.id("jumps"),

    // Test info
    testType: v.literal("VERT_JUMP"),

    // Result
    result: v.object({
      heightInches: v.number(),
      heightCm: v.number(),
      flightTimeMs: v.number(),
    }),

    // Verification details
    verification: v.object({
      tier: v.union(v.literal("bronze"), v.literal("silver"), v.literal("gold")),
      confidence: v.number(),
      gatesPassed: v.array(v.string()),
      phase: v.union(v.literal("A"), v.literal("B"), v.literal("C")),
    }),

    // Evidence hashes (for independent verification)
    proofs: v.object({
      videoHash: v.string(),
      sensorHash: v.string(),
      sessionNonce: v.string(),
    }),

    // Capture metadata
    capture: v.object({
      deviceModel: v.string(),
      appVersion: v.string(),
      capturedAtUtc: v.string(),
      fps: v.number(),
    }),

    // Certificate signing
    issuedAtUtc: v.string(),
    expiresAtUtc: v.optional(v.string()), // null = never expires
    ypCaSignature: v.string(), // Base64 ES256 signature

    // Timestamps
    createdAt: v.number(),
  })
    .index("by_vpc_id", ["vpcId"])
    .index("by_athlete_id", ["athleteId"])
    .index("by_user", ["userId"])
    .index("by_jump", ["jumpId"]),

  // ─────────────────────────────────────────────────────────────────
  // LEADERBOARD ENTRIES TABLE
  // Cached rankings for fast queries (< 3 second load)
  // ─────────────────────────────────────────────────────────────────
  leaderboardEntries: defineTable({
    // User reference
    userId: v.id("jumpUsers"),

    // Best jump reference
    bestJumpId: v.id("jumps"),
    bestVpcId: v.optional(v.id("vpcs")),

    // Cached data for fast filtering
    bestHeightInches: v.number(),
    verificationTier: v.string(),

    // Demographics (for filtering)
    ageGroup: v.union(
      v.literal("13-14"),
      v.literal("15-16"),
      v.literal("17-18"),
      v.literal("19-22")
    ),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),

    // Location (for geographic filtering)
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),

    // Computed ranks (updated periodically)
    rankGlobal: v.optional(v.number()),
    rankCountry: v.optional(v.number()),
    rankState: v.optional(v.number()),
    rankCity: v.optional(v.number()),

    // Timestamps
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_global_rank", ["bestHeightInches"])
    .index("by_country", ["country", "bestHeightInches"])
    .index("by_state", ["country", "state", "bestHeightInches"])
    .index("by_city", ["country", "state", "city", "bestHeightInches"])
    .index("by_age_group", ["ageGroup", "bestHeightInches"])
    .index("by_gender", ["gender", "bestHeightInches"])
    .index("by_tier", ["verificationTier", "bestHeightInches"]),

  // ═══════════════════════════════════════════════════════════════
  // AGENT FILE SYSTEM - CROSS-SESSION TASK COORDINATION
  // Enables multiple Claude agents to share work across sessions
  // ═══════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────
  // AGENT TASKS TABLE
  // Persistent task queue readable/writable by any agent session
  // ─────────────────────────────────────────────────────────────────
  agent_tasks: defineTable({
    // Identity
    taskId: v.optional(v.string()), // Unique identifier (nanoid)
    title: v.optional(v.string()), // Short task name
    description: v.optional(v.string()), // Detailed description

    // Categorization
    domain: v.optional(v.string()), // "seo", "content", "dev", "ops"
    project: v.optional(v.string()), // "gap-miner", "wolfgrow", etc.

    // Status workflow
    status: v.union(
      v.literal("pending"), // Not started
      v.literal("in_progress"), // Agent working on it
      v.literal("blocked"), // Waiting on something
      v.literal("completed"), // Done
      v.literal("cancelled") // Abandoned
    ),

    // Priority (lower = higher priority)
    priority: v.optional(v.number()), // 1=critical, 2=high, 3=normal, 4=low

    // Ownership
    createdBy: v.optional(v.string()), // Agent session ID or "human"
    assignedTo: v.optional(v.string()), // Agent session ID currently working
    completedBy: v.optional(v.string()),

    // Dependencies
    blockedBy: v.optional(v.array(v.string())), // Task IDs that must complete first
    blocks: v.optional(v.array(v.string())), // Task IDs that depend on this

    // Context/payload (flexible JSON for task-specific data)
    payload: v.optional(v.any()), // e.g., { keyword: "...", cluster: "..." }

    // Progress tracking
    progressPercent: v.optional(v.number()), // 0-100
    progressNotes: v.optional(v.string()),

    // Results (populated on completion)
    result: v.optional(v.any()), // Task-specific output data
    errorMessage: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),

    // TTL for auto-cleanup (optional)
    expiresAt: v.optional(v.number()),

    // Legacy fields (for backwards compatibility)
    city: v.optional(v.string()),
    sport: v.optional(v.string()),
    type: v.optional(v.string()),
  })
    .index("by_task_id", ["taskId"])
    .index("by_status", ["status"])
    .index("by_domain", ["domain", "status"])
    .index("by_project", ["project", "status"])
    .index("by_priority", ["status", "priority"])
    .index("by_assigned", ["assignedTo"]),

  // ─────────────────────────────────────────────────────────────────
  // AGENT LOGS TABLE
  // Audit trail of agent actions for debugging and learning
  // ─────────────────────────────────────────────────────────────────
  agent_logs: defineTable({
    // Task reference (optional - some logs are task-independent)
    taskId: v.optional(v.string()),

    // Log metadata
    agentId: v.string(), // Session identifier
    action: v.string(), // "task_claimed", "task_completed", "error", etc.
    domain: v.string(), // "seo", "content", etc.

    // Content
    message: v.string(),
    data: v.optional(v.any()), // Structured payload

    // Severity
    level: v.union(
      v.literal("debug"),
      v.literal("info"),
      v.literal("warn"),
      v.literal("error")
    ),

    // Timestamp
    createdAt: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_agent", ["agentId"])
    .index("by_domain", ["domain", "createdAt"])
    .index("by_level", ["level", "createdAt"]),

  // ═══════════════════════════════════════════════════════════════
  // TOM CHIEF OF STAFF SYSTEM (VIP SECTION)
  // Internal team AI assistant - prefixed with tom_
  // Logical separation from athlete-facing data
  // ═══════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────
  // TOM_LOGS: Every WhatsApp message from internal team
  // ─────────────────────────────────────────────────────────────────
  tom_logs: defineTable({
    userId: v.union(
      v.literal("mike"),
      v.literal("james"),
      v.literal("adam"),
      v.literal("annie")
    ),
    content: v.string(),
    direction: v.union(v.literal("inbound"), v.literal("outbound")),
    intent: v.optional(v.string()), // "PRODUCT_VISUALIZATION", "TREND_SEARCH", etc.
    sentiment: v.optional(v.string()), // "Frustrated", "Hype", "Neutral"
    personalityMode: v.optional(v.string()), // "jarvis", "robbins", "lasso"
    whatsappMessageId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  // ─────────────────────────────────────────────────────────────────
  // TOM_CONTEXTS: Brain for each team member
  // Persistent context files (active_context, backlog, daily_log)
  // ─────────────────────────────────────────────────────────────────
  tom_contexts: defineTable({
    userId: v.union(
      v.literal("mike"),
      v.literal("james"),
      v.literal("adam"),
      v.literal("annie")
    ),
    contextType: v.union(
      v.literal("active_context"),
      v.literal("backlog"),
      v.literal("daily_log"),
      v.literal("preferences")
    ),
    content: v.string(),
    lastUpdatedAt: v.number(),
    lastUpdatedBy: v.union(v.literal("tom"), v.literal("user")),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "contextType"]),

  // ─────────────────────────────────────────────────────────────────
  // TOM_TASKS: Queue for Clawdbot/Mac Mini execution
  // Tasks that require external tool execution
  // ─────────────────────────────────────────────────────────────────
  tom_tasks: defineTable({
    task: v.string(),
    description: v.optional(v.string()),
    assignedTo: v.string(), // "CLAWDBOT_MAC_MINI", "TOM", "MIKE"
    requestedBy: v.union(
      v.literal("mike"),
      v.literal("james"),
      v.literal("adam"),
      v.literal("annie")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
    result: v.optional(v.string()), // PDF link, output, etc.
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo", "status"]),

  // ─────────────────────────────────────────────────────────────────
  // TOM_BRIEFINGS: Morning and weekly briefings
  // Generated summaries delivered via WhatsApp/email
  // ─────────────────────────────────────────────────────────────────
  tom_briefings: defineTable({
    userId: v.union(
      v.literal("mike"),
      v.literal("james"),
      v.literal("adam"),
      v.literal("annie")
    ),
    date: v.string(), // ISO date: "2026-01-28"
    briefingType: v.union(v.literal("morning"), v.literal("weekly")),
    content: v.string(), // Formatted for WhatsApp
    sections: v.object({
      priorities: v.string(),
      blockers: v.string(),
      calendar: v.string(),
      insights: v.string(),
    }),
    deliveredAt: v.optional(v.number()),
    deliveryMethod: v.optional(v.union(v.literal("email"), v.literal("whatsapp"))),
    generatedAt: v.number(),
  })
    .index("by_user_date", ["userId", "date"]),

  // ─────────────────────────────────────────────────────────────────
  // TOM_CAPTURES: Quick capture items from WhatsApp/voice
  // Raw inputs before classification and routing
  // ─────────────────────────────────────────────────────────────────
  tom_captures: defineTable({
    userId: v.union(
      v.literal("mike"),
      v.literal("james"),
      v.literal("adam"),
      v.literal("annie")
    ),
    content: v.string(),
    source: v.union(v.literal("voice"), v.literal("text"), v.literal("whatsapp")),
    classifiedAs: v.optional(
      v.union(
        v.literal("task"),
        v.literal("note"),
        v.literal("idea"),
        v.literal("question")
      )
    ),
    routed: v.boolean(),
    routedTo: v.optional(v.string()), // "backlog", "daily_log", "PRODUCT_VISUALIZATION"
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_unrouted", ["userId", "routed"]),

  // ─────────────────────────────────────────────────────────────────
  // TOM_KNOWLEDGE: Google Drive/Notion sync for RAG
  // Synced documents with optional embeddings
  // ─────────────────────────────────────────────────────────────────
  tom_knowledge: defineTable({
    userId: v.union(
      v.literal("mike"),
      v.literal("james"),
      v.literal("adam"),
      v.literal("annie")
    ),
    sourceType: v.union(
      v.literal("google_drive"),
      v.literal("notion"),
      v.literal("manual")
    ),
    sourceId: v.string(), // External document ID
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
    embedding: v.optional(v.array(v.float64())),
    lastSyncedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_source", ["userId", "sourceType", "sourceId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["userId"],
    }),

  // ─────────────────────────────────────────────────────────────────
  // TOM_USERS: Team member configuration
  // Voice profiles, WhatsApp numbers, preferences
  // ─────────────────────────────────────────────────────────────────
  tom_users: defineTable({
    userId: v.union(
      v.literal("mike"),
      v.literal("james"),
      v.literal("adam"),
      v.literal("annie")
    ),
    email: v.string(),
    displayName: v.string(),
    voiceProfileId: v.string(), // "MIKE_COS", "JAMES_COS", etc.
    whatsappNumber: v.optional(v.string()),
    preferences: v.object({
      briefingTime: v.string(), // "06:00"
      briefingTimezone: v.string(), // "America/New_York"
      deliveryMethod: v.union(v.literal("email"), v.literal("whatsapp")),
    }),
    googleIntegration: v.optional(
      v.object({
        connected: v.boolean(),
        accessToken: v.optional(v.string()),
        refreshToken: v.optional(v.string()),
        tokenExpiresAt: v.optional(v.number()),
        driveRootFolderId: v.optional(v.string()),
        calendarId: v.optional(v.string()),
      })
    ),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_whatsapp", ["whatsappNumber"]),
});
