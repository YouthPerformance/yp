// ═══════════════════════════════════════════════════════════
// BAREFOOT RESET - CONVEX SCHEMA DEFINITIONS
// Copy these into convex/schema.ts to enable persistence
// ═══════════════════════════════════════════════════════════

/**
 * CONVEX SCHEMA ADDITIONS
 *
 * Add these table definitions to your existing convex/schema.ts file
 * alongside your other tables.
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ─────────────────────────────────────────────────────────────
// TABLE: barefootResetEnrollments
// Tracks user enrollment in the program
// ─────────────────────────────────────────────────────────────

export const barefootResetEnrollments = defineTable({
  // User reference
  userId: v.id("users"),

  // Enrollment timestamps
  enrolledAt: v.number(),
  contractSignedAt: v.optional(v.number()),

  // Wolf sorting result
  primaryFrequency: v.optional(v.union(
    v.literal("Volt"),
    v.literal("Forge"),
    v.literal("Flow")
  )),

  // Program status
  status: v.union(
    v.literal("enrolled"),    // Signed up but not started
    v.literal("active"),      // Currently in progress
    v.literal("completed"),   // Finished all 30 workouts
    v.literal("paused"),      // User-initiated pause
    v.literal("expired")      // Subscription lapsed
  ),

  // Metadata
  source: v.optional(v.string()), // How they enrolled (organic, referral, etc.)
})
  .index("by_user", ["userId"])
  .index("by_status", ["status"]);

// ─────────────────────────────────────────────────────────────
// TABLE: barefootResetProgress
// Master progress record (one per user)
// ─────────────────────────────────────────────────────────────

export const barefootResetProgress = defineTable({
  // User reference
  userId: v.id("users"),

  // Calendar position
  currentCalendarDay: v.number(),    // 1-42
  currentWorkout: v.number(),        // 1-30

  // Chain (streak) tracking
  chainCurrent: v.number(),          // Current chain length
  chainBest: v.number(),             // All-time best chain
  chainFreezes: v.number(),          // Remaining freeze tokens (max 2)
  lastWorkoutDate: v.optional(v.string()), // ISO date string (YYYY-MM-DD)

  // Frequency progress (Spider Chart values)
  flowPoints: v.number(),            // Release category
  forgePoints: v.number(),           // Restore category
  voltPoints: v.number(),            // Re-Engineer category

  // Totals
  totalShards: v.number(),
  totalXp: v.number(),
  totalWorkoutsCompleted: v.number(),
  totalStrikeWodsCompleted: v.number(),
  perfectWeeks: v.number(),          // Weeks with all 5 workouts

  // Wolf evolution
  wolfLevel: v.number(),             // Calculated from XP

  // Timestamps
  programStartedAt: v.number(),
  lastActivityAt: v.number(),
  completedAt: v.optional(v.number()),
})
  .index("by_user", ["userId"]);

// ─────────────────────────────────────────────────────────────
// TABLE: barefootResetWorkoutLogs
// Individual workout completion records
// ─────────────────────────────────────────────────────────────

export const barefootResetWorkoutLogs = defineTable({
  // User reference
  userId: v.id("users"),

  // Workout identification
  workoutNumber: v.number(),         // 1-30
  calendarDay: v.number(),           // 1-42
  phase: v.union(
    v.literal("Foundation"),
    v.literal("Progression"),
    v.literal("Mastery")
  ),

  // Exercise completion details
  exercisesCompleted: v.array(v.string()), // Exercise IDs completed
  exercisesSkipped: v.array(v.string()),   // Exercise IDs skipped
  exerciseCount: v.number(),               // Total completed count

  // Timing
  startedAt: v.number(),
  completedAt: v.number(),
  totalDurationSec: v.number(),
  pausedDurationSec: v.number(),

  // Rewards earned this workout
  shardsEarned: v.number(),
  xpEarned: v.number(),

  // Chain impact
  chainUpdated: v.boolean(),         // Did chain increment?
  chainBroken: v.boolean(),          // Did chain break?
  chainValueAfter: v.number(),       // Chain value after this workout

  // Strike WOD (if attempted)
  strikeWodAttempted: v.boolean(),
  strikeWodEffort: v.optional(v.number()),    // 1-10 rating
  strikeWodShards: v.optional(v.number()),
  strikeWodDurationSec: v.optional(v.number()),

  // Device/context
  deviceType: v.optional(v.string()),         // mobile, tablet, desktop, tv
  wasResumed: v.boolean(),                    // Was this a checkpoint resume?
})
  .index("by_user", ["userId"])
  .index("by_user_workout", ["userId", "workoutNumber"])
  .index("by_user_date", ["userId", "calendarDay"]);

// ─────────────────────────────────────────────────────────────
// TABLE: barefootResetBadges
// Earned badges
// ─────────────────────────────────────────────────────────────

export const barefootResetBadges = defineTable({
  // User reference
  userId: v.id("users"),

  // Badge identification
  badgeId: v.string(),               // e.g., "chain-7", "wolf-forming"

  // Award context
  earnedAt: v.number(),
  trigger: v.string(),               // What triggered it
  triggerValue: v.optional(v.number()), // Value that met threshold

  // Associated workout (if applicable)
  workoutNumber: v.optional(v.number()),
})
  .index("by_user", ["userId"])
  .index("by_user_badge", ["userId", "badgeId"]);

// ─────────────────────────────────────────────────────────────
// TABLE: barefootResetCheckpoints
// Mid-workout save points for resume
// ─────────────────────────────────────────────────────────────

export const barefootResetCheckpoints = defineTable({
  // User reference
  userId: v.id("users"),

  // Workout context
  workoutNumber: v.number(),
  calendarDay: v.number(),

  // Progress state
  currentExerciseIndex: v.number(),
  completedExercises: v.array(v.string()),
  skippedExercises: v.array(v.string()),
  elapsedTimeSec: v.number(),
  shardsEarnedSoFar: v.number(),

  // Timestamps
  savedAt: v.number(),
  expiresAt: v.number(),             // 15 minutes after save

  // Status
  isValid: v.boolean(),              // Set to false when resumed or expired
})
  .index("by_user", ["userId"])
  .index("by_user_workout", ["userId", "workoutNumber"]);

// ─────────────────────────────────────────────────────────────
// EXAMPLE MUTATIONS (implement in convex/barefootReset.ts)
// ─────────────────────────────────────────────────────────────

/*
// Enroll user in program
export const enrollInProgram = mutation({
  args: {
    source: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Not authenticated");

    const userId = user.subject as Id<"users">;

    // Check if already enrolled
    const existing = await ctx.db
      .query("barefootResetEnrollments")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (existing) {
      throw new Error("Already enrolled");
    }

    // Create enrollment
    await ctx.db.insert("barefootResetEnrollments", {
      userId,
      enrolledAt: Date.now(),
      status: "enrolled",
      source: args.source,
    });

    // Initialize progress record
    await ctx.db.insert("barefootResetProgress", {
      userId,
      currentCalendarDay: 1,
      currentWorkout: 1,
      chainCurrent: 0,
      chainBest: 0,
      chainFreezes: 2,
      flowPoints: 0,
      forgePoints: 0,
      voltPoints: 0,
      totalShards: 0,
      totalXp: 0,
      totalWorkoutsCompleted: 0,
      totalStrikeWodsCompleted: 0,
      perfectWeeks: 0,
      wolfLevel: 1,
      programStartedAt: Date.now(),
      lastActivityAt: Date.now(),
    });

    return { success: true };
  },
});

// Complete workout
export const completeWorkout = mutation({
  args: {
    workoutNumber: v.number(),
    calendarDay: v.number(),
    exercisesCompleted: v.array(v.string()),
    exercisesSkipped: v.array(v.string()),
    totalDurationSec: v.number(),
    pausedDurationSec: v.number(),
    strikeWodAttempted: v.boolean(),
    strikeWodEffort: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Not authenticated");

    const userId = user.subject as Id<"users">;

    // Get current progress
    const progress = await ctx.db
      .query("barefootResetProgress")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (!progress) throw new Error("Not enrolled");

    // Calculate rewards
    const shardsPerExercise = 8;
    const exerciseShards = args.exercisesCompleted.length * shardsPerExercise;

    // Chain logic
    const completionRate = args.exercisesCompleted.length / 6;
    const chainUpdated = completionRate >= 0.7;
    const chainBroken = args.exercisesCompleted.length === 0;

    let newChain = progress.chainCurrent;
    if (chainUpdated) newChain++;
    else if (chainBroken) newChain = 0;

    // Chain milestone bonus
    const chainMilestones = { 3: 25, 7: 50, 14: 100, 21: 150, 30: 300, 42: 500 };
    const chainBonus = chainMilestones[newChain] || 0;

    // Strike WOD bonus
    let strikeWodShards = 0;
    if (args.strikeWodAttempted && args.strikeWodEffort) {
      if (args.strikeWodEffort <= 4) strikeWodShards = 15;
      else if (args.strikeWodEffort <= 7) strikeWodShards = 20;
      else strikeWodShards = 25;
    }

    const totalShards = exerciseShards + chainBonus + strikeWodShards;
    const xpEarned = 100;

    // Log the workout
    await ctx.db.insert("barefootResetWorkoutLogs", {
      userId,
      workoutNumber: args.workoutNumber,
      calendarDay: args.calendarDay,
      phase: args.workoutNumber <= 10 ? "Foundation" :
             args.workoutNumber <= 20 ? "Progression" : "Mastery",
      exercisesCompleted: args.exercisesCompleted,
      exercisesSkipped: args.exercisesSkipped,
      exerciseCount: args.exercisesCompleted.length,
      startedAt: Date.now() - args.totalDurationSec * 1000,
      completedAt: Date.now(),
      totalDurationSec: args.totalDurationSec,
      pausedDurationSec: args.pausedDurationSec,
      shardsEarned: totalShards,
      xpEarned,
      chainUpdated,
      chainBroken,
      chainValueAfter: newChain,
      strikeWodAttempted: args.strikeWodAttempted,
      strikeWodEffort: args.strikeWodEffort,
      strikeWodShards,
      wasResumed: false,
    });

    // Update progress
    const newTotalXp = progress.totalXp + xpEarned;
    const newWolfLevel = Math.floor(newTotalXp / 100) + 1;

    await ctx.db.patch(progress._id, {
      currentWorkout: args.workoutNumber + 1,
      chainCurrent: newChain,
      chainBest: Math.max(progress.chainBest, newChain),
      lastWorkoutDate: new Date().toISOString().split('T')[0],
      totalShards: progress.totalShards + totalShards,
      totalXp: newTotalXp,
      totalWorkoutsCompleted: progress.totalWorkoutsCompleted + 1,
      totalStrikeWodsCompleted: args.strikeWodAttempted
        ? progress.totalStrikeWodsCompleted + 1
        : progress.totalStrikeWodsCompleted,
      wolfLevel: newWolfLevel,
      lastActivityAt: Date.now(),
      completedAt: args.workoutNumber === 30 ? Date.now() : undefined,
    });

    // Check for badges (simplified)
    const badges = [];
    if (newChain === 3) badges.push("chain-3");
    if (newChain === 7) badges.push("chain-7");
    if (args.workoutNumber === 10) badges.push("phase-foundation");
    if (args.workoutNumber === 30) badges.push("program-complete");

    for (const badgeId of badges) {
      const existing = await ctx.db
        .query("barefootResetBadges")
        .withIndex("by_user_badge", q => q.eq("userId", userId).eq("badgeId", badgeId))
        .first();

      if (!existing) {
        await ctx.db.insert("barefootResetBadges", {
          userId,
          badgeId,
          earnedAt: Date.now(),
          trigger: "workout_complete",
          workoutNumber: args.workoutNumber,
        });
      }
    }

    return {
      shardsEarned: totalShards,
      xpEarned,
      chainUpdated,
      chainBroken,
      newChain,
      newWolfLevel,
      newBadges: badges,
    };
  },
});
*/

// ─────────────────────────────────────────────────────────────
// EXAMPLE QUERIES (implement in convex/barefootReset.ts)
// ─────────────────────────────────────────────────────────────

/*
// Get user's full program state
export const getProgress = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    const userId = user.subject as Id<"users">;

    const enrollment = await ctx.db
      .query("barefootResetEnrollments")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (!enrollment) return null;

    const progress = await ctx.db
      .query("barefootResetProgress")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    const badges = await ctx.db
      .query("barefootResetBadges")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();

    const workoutLogs = await ctx.db
      .query("barefootResetWorkoutLogs")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();

    return {
      enrollment,
      progress,
      badges,
      completedWorkouts: workoutLogs.map(l => l.workoutNumber),
    };
  },
});

// Check for valid checkpoint
export const getCheckpoint = query({
  args: { workoutNumber: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    const userId = user.subject as Id<"users">;

    const checkpoint = await ctx.db
      .query("barefootResetCheckpoints")
      .withIndex("by_user_workout", q =>
        q.eq("userId", userId).eq("workoutNumber", args.workoutNumber)
      )
      .first();

    if (!checkpoint || !checkpoint.isValid || checkpoint.expiresAt < Date.now()) {
      return null;
    }

    return checkpoint;
  },
});
*/
