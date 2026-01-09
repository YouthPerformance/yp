// ═══════════════════════════════════════════════════════════
// PROGRESS FUNCTIONS
// Workout completion and progress tracking
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Strike WOD days
const STRIKE_WOD_DAYS = [7, 14, 21, 28, 35, 42];

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Get all workout completions for a user
 */
export const getUserProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workoutCompletions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

/**
 * Get progress for a specific day
 */
export const getDayProgress = query({
  args: {
    userId: v.id("users"),
    dayNumber: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workoutCompletions")
      .withIndex("by_user_day", (q) => q.eq("userId", args.userId).eq("dayNumber", args.dayNumber))
      .first();
  },
});

/**
 * Get completion stats for user
 */
export const getCompletionStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const completions = await ctx.db
      .query("workoutCompletions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const totalWorkouts = completions.length;
    const totalXp = completions.reduce((sum, c) => sum + c.xpEarned, 0);
    const avgQuizScore =
      completions.filter((c) => c.quizScore !== undefined).length > 0
        ? completions
            .filter((c) => c.quizScore !== undefined)
            .reduce((sum, c) => sum + (c.quizScore ?? 0), 0) /
          completions.filter((c) => c.quizScore !== undefined).length
        : 0;
    const strikeWodsCompleted = completions.filter((c) => c.isStrikeWod).length;

    return {
      totalWorkouts,
      totalXp,
      avgQuizScore: Math.round(avgQuizScore),
      strikeWodsCompleted,
      completedDays: completions.map((c) => c.dayNumber),
    };
  },
});

// ─────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Complete a workout
 */
export const completeWorkout = mutation({
  args: {
    userId: v.id("users"),
    enrollmentId: v.id("enrollments"),
    dayNumber: v.number(),
    durationSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const isStrikeWod = STRIKE_WOD_DAYS.includes(args.dayNumber);

    // Base XP for workout completion
    let xpEarned = 100;

    // Check existing completion
    const existing = await ctx.db
      .query("workoutCompletions")
      .withIndex("by_user_day", (q) => q.eq("userId", args.userId).eq("dayNumber", args.dayNumber))
      .first();

    if (existing) {
      return { success: false, error: "Day already completed" };
    }

    // Create completion record
    const completionId = await ctx.db.insert("workoutCompletions", {
      userId: args.userId,
      enrollmentId: args.enrollmentId,
      dayNumber: args.dayNumber,
      completedAt: now,
      durationSeconds: args.durationSeconds,
      xpEarned,
      isStrikeWod,
    });

    // Update enrollment progress
    const enrollment = await ctx.db.get(args.enrollmentId);
    if (enrollment) {
      await ctx.db.patch(args.enrollmentId, {
        currentDay: Math.min(args.dayNumber + 1, 42),
        totalWorkoutsCompleted: enrollment.totalWorkoutsCompleted + 1,
        totalXpEarned: enrollment.totalXpEarned + xpEarned,
        ...(args.dayNumber === 42 ? { completedAt: now, isActive: false } : {}),
      });
    }

    // Update user streak
    const user = await ctx.db.get(args.userId);
    if (user) {
      const lastWorkout = user.lastWorkoutAt;
      const _oneDayAgo = now - 24 * 60 * 60 * 1000;
      const twoDaysAgo = now - 48 * 60 * 60 * 1000;

      let newStreak = 1;
      if (lastWorkout && lastWorkout > twoDaysAgo) {
        newStreak = user.streakCurrent + 1;
      }

      // Streak bonuses
      if (newStreak === 7 || newStreak === 14 || newStreak === 21) {
        xpEarned += 50;
      }

      await ctx.db.patch(args.userId, {
        streakCurrent: newStreak,
        streakBest: Math.max(newStreak, user.streakBest),
        lastWorkoutAt: now,
        xpTotal: user.xpTotal + xpEarned,
        updatedAt: now,
      });
    }

    return {
      success: true,
      completionId,
      xpEarned,
      isStrikeWod,
    };
  },
});

/**
 * Submit quiz answers
 */
export const submitQuiz = mutation({
  args: {
    userId: v.id("users"),
    dayNumber: v.number(),
    answers: v.array(v.number()),
    correctCount: v.number(),
  },
  handler: async (ctx, args) => {
    const quizScore = Math.round((args.correctCount / args.answers.length) * 100);
    const passed = quizScore >= 70;

    // XP: 10 per correct answer
    const xpEarned = args.correctCount * 10;

    // Find and update the completion record
    const completion = await ctx.db
      .query("workoutCompletions")
      .withIndex("by_user_day", (q) => q.eq("userId", args.userId).eq("dayNumber", args.dayNumber))
      .first();

    if (completion) {
      await ctx.db.patch(completion._id, {
        quizScore,
        quizAnswers: args.answers,
        xpEarned: completion.xpEarned + xpEarned,
      });
    }

    // Add XP to user
    const user = await ctx.db.get(args.userId);
    if (user) {
      await ctx.db.patch(args.userId, {
        xpTotal: user.xpTotal + xpEarned,
        updatedAt: Date.now(),
      });
    }

    return {
      quizScore,
      passed,
      xpEarned,
    };
  },
});

/**
 * Submit Strike WOD score
 */
export const submitStrikeWodScore = mutation({
  args: {
    userId: v.id("users"),
    dayNumber: v.number(),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    if (!STRIKE_WOD_DAYS.includes(args.dayNumber)) {
      return { success: false, error: "Not a Strike WOD day" };
    }

    // Find completion record
    const completion = await ctx.db
      .query("workoutCompletions")
      .withIndex("by_user_day", (q) => q.eq("userId", args.userId).eq("dayNumber", args.dayNumber))
      .first();

    if (!completion) {
      return { success: false, error: "Complete workout first" };
    }

    // Calculate percentile rank (simplified)
    // In production, compare against all users' scores
    const percentile = Math.min(99, Math.floor(args.score / 10));

    // XP based on percentile
    let bonusXp = 0;
    if (percentile >= 99) bonusXp = 100;
    else if (percentile >= 90) bonusXp = 50;
    else if (percentile >= 75) bonusXp = 25;

    await ctx.db.patch(completion._id, {
      strikeWodScore: args.score,
      strikeWodRank: percentile,
      xpEarned: completion.xpEarned + bonusXp,
    });

    // Add bonus XP
    if (bonusXp > 0) {
      const user = await ctx.db.get(args.userId);
      if (user) {
        await ctx.db.patch(args.userId, {
          xpTotal: user.xpTotal + bonusXp,
          updatedAt: Date.now(),
        });
      }
    }

    return {
      success: true,
      percentile,
      bonusXp,
    };
  },
});

/**
 * Award crystals for workout completion
 */
export const awardCrystals = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(args.userId, {
      crystals: user.crystals + args.amount,
      updatedAt: Date.now(),
    });

    return { newTotal: user.crystals + args.amount };
  },
});

/**
 * Complete a program day (42-day programs)
 */
export const completeProgramDay = mutation({
  args: {
    authUserId: v.string(),
    programSlug: v.string(),
    dayNumber: v.number(),
    xpEarned: v.number(),
    crystalsEarned: v.number(),
  },
  handler: async (ctx, args) => {
    // Find user by BetterAuth ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", args.authUserId))
      .unique();

    if (!user) throw new Error("User not found");

    // Find or create enrollment
    let enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("programSlug"), args.programSlug))
      .first();

    if (!enrollment) {
      // Create enrollment
      const enrollmentId = await ctx.db.insert("enrollments", {
        userId: user._id,
        programSlug: args.programSlug,
        currentDay: 1,
        isActive: true,
        startedAt: Date.now(),
        totalWorkoutsCompleted: 0,
        totalXpEarned: 0,
      });
      enrollment = await ctx.db.get(enrollmentId);
    }

    if (!enrollment) throw new Error("Failed to create enrollment");

    // Check if already completed this day
    const existing = await ctx.db
      .query("workoutCompletions")
      .withIndex("by_enrollment", (q) => q.eq("enrollmentId", enrollment._id))
      .filter((q) => q.eq(q.field("dayNumber"), args.dayNumber))
      .first();

    if (existing) {
      return { alreadyCompleted: true, completionId: existing._id };
    }

    // Record completion
    const completionId = await ctx.db.insert("workoutCompletions", {
      userId: user._id,
      enrollmentId: enrollment._id,
      dayNumber: args.dayNumber,
      completedAt: Date.now(),
      durationSeconds: 0, // Not tracked in this flow
      xpEarned: args.xpEarned,
    });

    // Award XP and crystals
    await ctx.db.patch(user._id, {
      xpTotal: user.xpTotal + args.xpEarned,
      crystals: user.crystals + args.crystalsEarned,
      updatedAt: Date.now(),
    });

    return { alreadyCompleted: false, completionId };
  },
});
