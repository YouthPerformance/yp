// ═══════════════════════════════════════════════════════════
// WOLF CONTRACT MUTATIONS & QUERIES
// Gamified onboarding: 30 Levels in 42 days → $88 credit
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { nanoid } from "nanoid";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const WINDOW_DAYS = 42;
const LEVELS_REQUIRED = 30;
const CREDIT_AMOUNT = 88;
const CREDIT_EXPIRY_DAYS = 90;
const RESERVATION_MINUTES = 15;

// ─────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Create a reservation after successful payment
 * Called by Stripe webhook after payment confirmation
 */
export const createReservation = mutation({
  args: {
    athleteUserId: v.id("users"),
    stripePaymentIntentId: v.string(),
    amountPaid: v.number(),
    currency: v.string(),
    country: v.string(),
    countryCode: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + RESERVATION_MINUTES * 60 * 1000;

    const reservationId = await ctx.db.insert("contractReservations", {
      athleteUserId: args.athleteUserId,
      stripePaymentIntentId: args.stripePaymentIntentId,
      amountPaid: args.amountPaid,
      currency: args.currency,
      country: args.country,
      countryCode: args.countryCode,
      status: "pending",
      createdAt: now,
      expiresAt,
    });

    return { reservationId, expiresAt };
  },
});

/**
 * Sign the Wolf Contract
 * Called when athlete completes the contract ceremony
 */
export const signContract = mutation({
  args: {
    athleteUserId: v.id("users"),
    signatureData: v.string(), // Base64 signature image
    checkboxes: v.object({
      showUp: v.boolean(),
      trustBlueprint: v.boolean(),
      earnGear: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get user
    const user = await ctx.db.get(args.athleteUserId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check for existing contract
    if (user.wolfContract) {
      throw new Error("Contract already signed");
    }

    // Validate checkboxes - all must be true
    const { checkboxes } = args;
    if (!checkboxes.showUp || !checkboxes.trustBlueprint || !checkboxes.earnGear) {
      throw new Error("All checkboxes must be checked");
    }

    // Find and claim reservation
    const reservation = await ctx.db
      .query("contractReservations")
      .withIndex("by_athlete", (q) => q.eq("athleteUserId", args.athleteUserId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    if (!reservation) {
      throw new Error("No pending reservation found");
    }

    if (now > reservation.expiresAt) {
      // Mark reservation as expired
      await ctx.db.patch(reservation._id, { status: "expired" });
      throw new Error("Reservation expired");
    }

    // Claim reservation
    await ctx.db.patch(reservation._id, {
      status: "claimed",
      claimedAt: now,
    });

    // Calculate dates
    const startDate = now;
    const expiresAt = now + WINDOW_DAYS * 24 * 60 * 60 * 1000;

    // Create wolf contract
    const wolfContract = {
      signedAt: now,
      startDate,
      expiresAt,
      signatureData: args.signatureData,
      checkboxes: args.checkboxes,
      country: reservation.country,
      countryCode: reservation.countryCode,
      windowDays: WINDOW_DAYS,
      levelsRequired: LEVELS_REQUIRED,
      levelsCompleted: 0,
      levelLog: [],
      status: "active" as const,
      creditEarned: 0,
    };

    // Update user with contract
    await ctx.db.patch(args.athleteUserId, {
      wolfContract,
      updatedAt: now,
    });

    return { success: true, expiresAt };
  },
});

/**
 * Log a completed level
 * Called when athlete finishes a workout with 90% video watch + note
 */
export const logLevel = mutation({
  args: {
    athleteUserId: v.id("users"),
    workoutId: v.string(),
    noteText: v.string(),
    videoWatchPercent: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate note
    if (args.noteText.length < 10) {
      throw new Error("Note must be at least 10 characters");
    }

    // Validate video watch
    if (args.videoWatchPercent < 90) {
      throw new Error("Must watch at least 90% of video");
    }

    // Get user
    const user = await ctx.db.get(args.athleteUserId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get contract
    const contract = user.wolfContract;
    if (!contract) {
      throw new Error("No active contract");
    }

    if (contract.status !== "active") {
      throw new Error(`Contract is ${contract.status}`);
    }

    // Check if expired
    if (now > contract.expiresAt) {
      // Mark as failed
      await ctx.db.patch(args.athleteUserId, {
        wolfContract: { ...contract, status: "failed" },
        updatedAt: now,
      });
      throw new Error("Contract expired");
    }

    // Check if already completed
    if (contract.levelsCompleted >= LEVELS_REQUIRED) {
      throw new Error("Contract already completed");
    }

    // Check for duplicate workout
    const alreadyLogged = contract.levelLog.some(
      (log) => log.workoutId === args.workoutId
    );
    if (alreadyLogged) {
      throw new Error("Workout already logged");
    }

    // Add level to log
    const newLevelNumber = contract.levelsCompleted + 1;
    const newLevelLog = [
      ...contract.levelLog,
      {
        levelNumber: newLevelNumber,
        workoutId: args.workoutId,
        completedAt: now,
        noteText: args.noteText,
        videoWatchPercent: args.videoWatchPercent,
      },
    ];

    const newLevelsCompleted = newLevelLog.length;
    const isComplete = newLevelsCompleted >= LEVELS_REQUIRED;

    // Generate credit code if complete
    let creditCode: string | undefined;
    let creditExpiresAt: number | undefined;

    if (isComplete) {
      creditCode = `WOLF-${nanoid(6).toUpperCase()}`;
      creditExpiresAt = now + CREDIT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    }

    // Update contract
    const updatedContract = {
      ...contract,
      levelLog: newLevelLog,
      levelsCompleted: newLevelsCompleted,
      status: isComplete ? ("completed" as const) : ("active" as const),
      creditEarned: isComplete ? CREDIT_AMOUNT : 0,
      creditCode,
      creditExpiresAt,
    };

    await ctx.db.patch(args.athleteUserId, {
      wolfContract: updatedContract,
      updatedAt: now,
    });

    return {
      success: true,
      levelNumber: newLevelNumber,
      levelsCompleted: newLevelsCompleted,
      isComplete,
      creditCode,
    };
  },
});

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Get contract progress for dashboard display
 */
export const getContractProgress = query({
  args: {
    athleteUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.athleteUserId);
    if (!user) {
      return null;
    }

    const contract = user.wolfContract;
    if (!contract) {
      return null;
    }

    const now = Date.now();
    const daysElapsed = Math.floor((now - contract.startDate) / (24 * 60 * 60 * 1000));
    const daysRemaining = Math.max(0, contract.windowDays - daysElapsed);

    // Calculate wolf evolution tier
    let evolutionTier: "base" | "headband" | "chain" | "sleeves" | "legendary" = "base";
    if (contract.levelsCompleted >= 30) {
      evolutionTier = "legendary";
    } else if (contract.levelsCompleted >= 21) {
      evolutionTier = "sleeves";
    } else if (contract.levelsCompleted >= 14) {
      evolutionTier = "chain";
    } else if (contract.levelsCompleted >= 7) {
      evolutionTier = "headband";
    }

    // Calculate milestone progress
    const nextMilestone =
      contract.levelsCompleted < 7
        ? 7
        : contract.levelsCompleted < 14
          ? 14
          : contract.levelsCompleted < 21
            ? 21
            : 30;

    return {
      status: contract.status,
      levelsCompleted: contract.levelsCompleted,
      levelsRequired: contract.levelsRequired,
      daysElapsed,
      daysRemaining,
      startDate: contract.startDate,
      expiresAt: contract.expiresAt,
      evolutionTier,
      nextMilestone,
      levelsToNextMilestone: nextMilestone - contract.levelsCompleted,
      creditEarned: contract.creditEarned,
      creditCode: contract.creditCode,
      creditExpiresAt: contract.creditExpiresAt,
      recentLevels: contract.levelLog.slice(-5), // Last 5 for UI
    };
  },
});

/**
 * Get public pack status for LP urgency display
 * Returns: confirmed members, country flags, country count
 * No auth required - public query
 */
export const getPackStatus = query({
  args: {},
  handler: async (ctx) => {
    // Get all users with wolfContract (signed)
    const users = await ctx.db.query("users").collect();

    // Filter to users with active or completed contracts
    const contractMembers = users.filter(
      (user) => user.wolfContract &&
        (user.wolfContract.status === "active" || user.wolfContract.status === "completed")
    );

    // Get unique countries with flag data
    const countryMap = new Map<string, number>();
    for (const user of contractMembers) {
      const code = user.wolfContract?.countryCode;
      if (code) {
        countryMap.set(code, (countryMap.get(code) || 0) + 1);
      }
    }

    // Sort by count descending, take top 8 for display
    const sortedCountries = Array.from(countryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([code]) => code);

    return {
      confirmedMembers: contractMembers.length,
      memberFlags: sortedCountries,
      countryCount: countryMap.size,
      maxMembers: 88, // Pack cap
      closeDate: "JAN 31",
    };
  },
});

/**
 * Check if user has pending reservation
 */
export const getPendingReservation = query({
  args: {
    athleteUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const reservation = await ctx.db
      .query("contractReservations")
      .withIndex("by_athlete", (q) => q.eq("athleteUserId", args.athleteUserId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    if (!reservation) {
      return null;
    }

    // Check if expired
    if (now > reservation.expiresAt) {
      return { ...reservation, isExpired: true };
    }

    return {
      ...reservation,
      isExpired: false,
      timeRemainingMs: reservation.expiresAt - now,
    };
  },
});

// ─────────────────────────────────────────────────────────────
// INTERNAL MUTATIONS (for cron jobs)
// ─────────────────────────────────────────────────────────────

/**
 * Check for expired contracts and mark as failed
 * Called by daily cron job
 */
export const checkExpiredContracts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Get all users with active contracts
    const users = await ctx.db.query("users").collect();

    let expiredCount = 0;

    for (const user of users) {
      const contract = user.wolfContract;

      if (
        contract &&
        contract.status === "active" &&
        now > contract.expiresAt
      ) {
        await ctx.db.patch(user._id, {
          wolfContract: { ...contract, status: "failed" },
          updatedAt: now,
        });
        expiredCount++;
      }
    }

    return { expiredCount };
  },
});

/**
 * Expire pending reservations that passed 15-min window
 * Called by cron job
 */
export const expireReservations = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const pendingReservations = await ctx.db
      .query("contractReservations")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    let expiredCount = 0;

    for (const reservation of pendingReservations) {
      if (now > reservation.expiresAt) {
        await ctx.db.patch(reservation._id, { status: "expired" });
        expiredCount++;
      }
    }

    return { expiredCount };
  },
});

/**
 * Send weekly progress emails to all parents with active contracts
 * Called by Sunday 2pm UTC cron
 */
export const sendWeeklyProgressEmails = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Get all users with active contracts
    const users = await ctx.db.query("users").collect();

    let sentCount = 0;

    for (const user of users) {
      const contract = user.wolfContract;

      // Only active contracts
      if (!contract || contract.status !== "active") continue;

      // Need a linked parent with email
      if (!user.linkedParentId) continue;

      const parent = await ctx.db.get(user.linkedParentId);
      if (!parent?.email) continue;

      // Calculate progress
      const daysElapsed = Math.floor(
        (now - contract.startDate) / (24 * 60 * 60 * 1000)
      );
      const daysRemaining = Math.max(0, contract.windowDays - daysElapsed);
      const expectedLevels = Math.floor((daysElapsed / 42) * 30);
      const isOnTrack = contract.levelsCompleted >= expectedLevels;

      // Schedule email action
      await ctx.scheduler.runAfter(0, internal.emails.sendWeeklyProgressEmail, {
        to: parent.email,
        athleteName: user.name,
        levelsCompleted: contract.levelsCompleted,
        levelsRequired: contract.levelsRequired,
        daysRemaining,
        isOnTrack,
      });

      sentCount++;
    }

    return { sentCount };
  },
});
