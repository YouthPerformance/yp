// ═══════════════════════════════════════════════════════════
// CONVEX SCHEMA
// Barefoot Reset - 42-Day Training Program
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
});
