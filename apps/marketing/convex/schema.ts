import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles from onboarding
  profiles: defineTable({
    clerkId: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.union(v.literal("parent"), v.literal("athlete"), v.literal("coach")),
    // Child/Athlete info
    childNickname: v.optional(v.string()),
    ageBand: v.optional(v.union(v.literal("under8"), v.literal("8-12"), v.literal("13+"))),
    sport: v.optional(v.union(v.literal("basketball"), v.literal("barefoot"), v.literal("both"), v.literal("other"))),
    space: v.optional(v.union(v.literal("apartment"), v.literal("driveway"), v.literal("gym"), v.literal("field"))),
    painFlag: v.optional(v.union(v.literal("none"), v.literal("foot-ankle"), v.literal("knee-hip-back"), v.literal("not-sure"))),
    // Goals from interest pills (array of goal objects)
    goals: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      tag: v.string(),
    }))),
    // Lane routing result
    lane: v.optional(v.string()),
    // Wolf coach prompt
    wolfPrompt: v.optional(v.string()),
    // Quiz identity
    athleteIdentity: v.optional(v.union(v.literal("force-leaker"), v.literal("elasticity-block"), v.literal("absorption-deficit"), v.literal("control-gap"))),
    // UTM tracking
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    // Notification preferences
    trainingReminders: v.optional(v.boolean()),
    progressReports: v.optional(v.boolean()),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // User subscriptions and purchases
  subscriptions: defineTable({
    profileId: v.id("profiles"),
    type: v.union(v.literal("tripwire"), v.literal("academy")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due"), v.literal("trialing")),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_profile", ["profileId"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  // Programs (Barefoot Reset, Court Ready, etc.)
  programs: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    totalWeeks: v.number(),
    totalLessons: v.number(),
    accessLevel: v.union(v.literal("free"), v.literal("tripwire"), v.literal("academy")),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"]),

  // Program weeks
  weeks: defineTable({
    programId: v.id("programs"),
    weekNumber: v.number(),
    title: v.string(),
    description: v.string(),
  })
    .index("by_program", ["programId"]),

  // Individual lessons
  lessons: defineTable({
    programId: v.id("programs"),
    weekId: v.id("weeks"),
    slug: v.string(),
    day: v.number(),
    title: v.string(),
    description: v.string(),
    duration: v.string(),
    videoUrl: v.optional(v.string()),
    steps: v.array(v.string()),
    cues: v.array(v.string()),
    order: v.number(),
  })
    .index("by_program", ["programId"])
    .index("by_week", ["weekId"])
    .index("by_slug", ["slug"]),

  // User progress on lessons
  lessonProgress: defineTable({
    profileId: v.id("profiles"),
    lessonId: v.id("lessons"),
    programId: v.id("programs"),
    status: v.union(v.literal("not_started"), v.literal("in_progress"), v.literal("completed")),
    progressPercent: v.number(),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_profile", ["profileId"])
    .index("by_profile_program", ["profileId", "programId"])
    .index("by_profile_lesson", ["profileId", "lessonId"]),

  // Exercise stacks (8-min protocols)
  // NOTE: This schema accommodates both old and new stack formats
  stacks: defineTable({
    slug: v.string(),
    // Name can be either 'name' or 'title' field
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.string(),
    duration: v.optional(v.string()),
    // New format exercises
    exercises: v.optional(v.array(v.object({
      name: v.string(),
      duration: v.number(),
      instruction: v.string(),
      cue: v.string(),
      reps: v.optional(v.string()),
    }))),
    // Old format steps (references drills)
    steps: v.optional(v.array(v.object({
      drillId: v.string(),
      durationSec: v.number(),
      order: v.number(),
      note: v.optional(v.string()),
    }))),
    accessLevel: v.optional(v.union(v.literal("free"), v.literal("tripwire"), v.literal("academy"))),
    // Metadata
    ageBands: v.optional(v.array(v.string())),
    difficulty: v.optional(v.string()),
    embedding: v.optional(v.array(v.number())),
    // Featured & publishing
    featured: v.optional(v.boolean()),
    featuredOrder: v.optional(v.number()),
    status: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
    schemaVersion: v.optional(v.number()),
    // Training context
    goal: v.optional(v.string()),
    noise: v.optional(v.string()),
    space: v.optional(v.array(v.string())),
    sport: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    totalMinutes: v.optional(v.number()),
    restBetweenDrillsSec: v.optional(v.number()),
    // Session notes
    warmupNote: v.optional(v.string()),
    cooldownNote: v.optional(v.string()),
    parentTip: v.optional(v.string()),
    // Timestamps
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"]),

  // Stack run completions
  stackRuns: defineTable({
    profileId: v.optional(v.id("profiles")),
    stackId: v.id("stacks"),
    anonymousId: v.optional(v.string()),
    exercisesCompleted: v.number(),
    totalExercises: v.number(),
    totalTime: v.number(),
    completedAt: v.number(),
  })
    .index("by_profile", ["profileId"])
    .index("by_anonymous", ["anonymousId"]),

  // Daily streaks
  streaks: defineTable({
    profileId: v.id("profiles"),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActivityDate: v.string(), // YYYY-MM-DD format
    updatedAt: v.number(),
  })
    .index("by_profile", ["profileId"]),

  // Analytics events
  analyticsEvents: defineTable({
    profileId: v.optional(v.id("profiles")),
    anonymousId: v.optional(v.string()),
    event: v.string(),
    properties: v.optional(v.any()),
    url: v.optional(v.string()),
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_profile", ["profileId"])
    .index("by_event", ["event"])
    .index("by_anonymous", ["anonymousId"]),

  // Email leads (from quiz soft gate)
  leads: defineTable({
    email: v.string(),
    profileId: v.optional(v.id("profiles")),
    source: v.string(), // 'quiz_results', 'lead_magnet', etc.
    athleteIdentity: v.optional(v.string()),
    subscribed: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_source", ["source"]),

  // Quiz responses
  quizResponses: defineTable({
    profileId: v.optional(v.id("profiles")),
    anonymousId: v.optional(v.string()),
    answers: v.array(v.object({
      questionId: v.number(),
      answer: v.string(),
    })),
    scores: v.object({
      forceLeaker: v.number(),
      elasticity: v.number(),
      absorption: v.number(),
      control: v.number(),
    }),
    identityType: v.string(),
    completedAt: v.number(),
  })
    .index("by_profile", ["profileId"])
    .index("by_anonymous", ["anonymousId"]),
});
