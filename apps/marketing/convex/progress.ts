import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get lesson progress for a user
export const getLessonProgress = query({
  args: {
    profileId: v.id("profiles"),
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessonProgress")
      .withIndex("by_profile_lesson", (q) =>
        q.eq("profileId", args.profileId).eq("lessonId", args.lessonId)
      )
      .first();
  },
});

// Get all progress for a program
export const getProgramProgress = query({
  args: {
    profileId: v.id("profiles"),
    programId: v.id("programs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessonProgress")
      .withIndex("by_profile_program", (q) =>
        q.eq("profileId", args.profileId).eq("programId", args.programId)
      )
      .collect();
  },
});

// Update lesson progress
export const updateLessonProgress = mutation({
  args: {
    profileId: v.id("profiles"),
    lessonId: v.id("lessons"),
    programId: v.id("programs"),
    status: v.union(v.literal("not_started"), v.literal("in_progress"), v.literal("completed")),
    progressPercent: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existing = await ctx.db
      .query("lessonProgress")
      .withIndex("by_profile_lesson", (q) =>
        q.eq("profileId", args.profileId).eq("lessonId", args.lessonId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        progressPercent: args.progressPercent,
        completedAt: args.status === "completed" ? now : existing.completedAt,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("lessonProgress", {
      profileId: args.profileId,
      lessonId: args.lessonId,
      programId: args.programId,
      status: args.status,
      progressPercent: args.progressPercent,
      completedAt: args.status === "completed" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mark lesson complete
export const markLessonComplete = mutation({
  args: {
    profileId: v.id("profiles"),
    lessonId: v.id("lessons"),
    programId: v.id("programs"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existing = await ctx.db
      .query("lessonProgress")
      .withIndex("by_profile_lesson", (q) =>
        q.eq("profileId", args.profileId).eq("lessonId", args.lessonId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "completed",
        progressPercent: 100,
        completedAt: now,
        updatedAt: now,
      });

      // Update streak
      await updateStreak(ctx, args.profileId);

      return existing._id;
    }

    const progressId = await ctx.db.insert("lessonProgress", {
      profileId: args.profileId,
      lessonId: args.lessonId,
      programId: args.programId,
      status: "completed",
      progressPercent: 100,
      completedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Update streak
    await updateStreak(ctx, args.profileId);

    return progressId;
  },
});

// Helper to update streak
async function updateStreak(ctx: any, profileId: any) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const streak = await ctx.db
    .query("streaks")
    .withIndex("by_profile", (q: any) => q.eq("profileId", profileId))
    .first();

  if (!streak) {
    // Create new streak
    await ctx.db.insert("streaks", {
      profileId,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: today,
      updatedAt: Date.now(),
    });
    return;
  }

  const lastDate = new Date(streak.lastActivityDate);
  const dayDiff = Math.floor(
    (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (streak.lastActivityDate === today) {
    // Already logged today, no change
    return;
  }

  if (dayDiff === 1) {
    // Consecutive day - increment streak
    const newStreak = streak.currentStreak + 1;
    await ctx.db.patch(streak._id, {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastActivityDate: today,
      updatedAt: Date.now(),
    });
  } else {
    // Streak broken - reset to 1
    await ctx.db.patch(streak._id, {
      currentStreak: 1,
      lastActivityDate: today,
      updatedAt: Date.now(),
    });
  }
}

// Get user streak
export const getStreak = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("streaks")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .first();
  },
});

// Record stack run completion
export const recordStackRun = mutation({
  args: {
    profileId: v.optional(v.id("profiles")),
    stackId: v.id("stacks"),
    anonymousId: v.optional(v.string()),
    exercisesCompleted: v.number(),
    totalExercises: v.number(),
    totalTime: v.number(),
  },
  handler: async (ctx, args) => {
    const runId = await ctx.db.insert("stackRuns", {
      profileId: args.profileId,
      stackId: args.stackId,
      anonymousId: args.anonymousId,
      exercisesCompleted: args.exercisesCompleted,
      totalExercises: args.totalExercises,
      totalTime: args.totalTime,
      completedAt: Date.now(),
    });

    // Update streak if logged in
    if (args.profileId) {
      await updateStreak(ctx, args.profileId);
    }

    return runId;
  },
});

// Get stack runs for user
export const getStackRuns = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stackRuns")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .order("desc")
      .take(50);
  },
});

// Get progress summary for settings page
export const getProgressSummary = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    // Get streak
    const streak = await ctx.db
      .query("streaks")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .first();

    // Get total stack runs
    const stackRuns = await ctx.db
      .query("stackRuns")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();

    // Get last session date
    const lastRun = stackRuns.length > 0
      ? stackRuns.reduce((latest, run) => run.completedAt > latest.completedAt ? run : latest)
      : null;

    return {
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      totalSessions: stackRuns.length,
      lastSessionDate: lastRun ? new Date(lastRun.completedAt).toISOString().split('T')[0] : null,
    };
  },
});

// Get streak by email (for unauthenticated users who provided email)
export const getStreakByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Find profile by email
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!profile) {
      return null;
    }

    // Get streak
    const streak = await ctx.db
      .query("streaks")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .first();

    // Get total stack runs
    const stackRuns = await ctx.db
      .query("stackRuns")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();

    return {
      profileId: profile._id,
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      totalSessions: stackRuns.length,
    };
  },
});
