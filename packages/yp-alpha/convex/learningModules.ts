// ═══════════════════════════════════════════════════════════
// LEARNING MODULES API
// Convex queries and mutations for Interactive Learning Modules
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const DAILY_CRYSTAL_CAP = 50;
const CRYSTALS_FIRST_TRY = 10;
const CRYSTALS_RETRY = 5;

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Get user's progress for a specific module
 */
export const getProgress = query({
  args: {
    userId: v.id("users"),
    moduleId: v.string(),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("learningProgress")
      .withIndex("by_user_module", (q) => q.eq("userId", args.userId).eq("moduleId", args.moduleId))
      .first();
    return progress;
  },
});

/**
 * Get all module progress for a user
 */
export const getAllProgress = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("learningProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return progress;
  },
});

/**
 * Get all badges for a user
 */
export const getUserBadges = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const badges = await ctx.db
      .query("userBadges")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return badges;
  },
});

/**
 * Check if user has a specific badge
 */
export const hasBadge = query({
  args: {
    userId: v.id("users"),
    badgeId: v.string(),
  },
  handler: async (ctx, args) => {
    const badge = await ctx.db
      .query("userBadges")
      .withIndex("by_user_badge", (q) => q.eq("userId", args.userId).eq("badgeId", args.badgeId))
      .first();
    return badge !== null;
  },
});

// ─────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Start a new module or resume existing progress
 */
export const startModule = mutation({
  args: {
    userId: v.id("users"),
    moduleId: v.string(),
    firstSectionId: v.string(),
    firstCardId: v.string(),
    mode: v.union(v.literal("athlete"), v.literal("parent")),
  },
  handler: async (ctx, args) => {
    // Check if progress already exists
    const existing = await ctx.db
      .query("learningProgress")
      .withIndex("by_user_module", (q) => q.eq("userId", args.userId).eq("moduleId", args.moduleId))
      .first();

    if (existing) {
      // Return existing progress ID for resume
      return { progressId: existing._id, isNew: false };
    }

    // Create new progress
    const now = Date.now();
    const progressId = await ctx.db.insert("learningProgress", {
      moduleId: args.moduleId,
      userId: args.userId,
      startedAt: now,
      currentSectionId: args.firstSectionId,
      currentCardId: args.firstCardId,
      totalCorrect: 0,
      totalAttempts: 0,
      crystalsEarned: 0,
      sectionsUnlocked: [args.firstSectionId], // First section always unlocked
      mode: args.mode,
      cardHistory: [],
      updatedAt: now,
    });

    return { progressId, isNew: true };
  },
});

/**
 * Update current position in module
 */
export const updatePosition = mutation({
  args: {
    progressId: v.id("learningProgress"),
    sectionId: v.string(),
    cardId: v.string(),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db.get(args.progressId);
    if (!progress) throw new Error("Progress not found");

    const now = Date.now();

    // Check if card is already in history
    const existingCardIndex = progress.cardHistory.findIndex((h) => h.cardId === args.cardId);

    const updatedHistory = [...progress.cardHistory];

    if (existingCardIndex === -1) {
      // Add new card to history
      updatedHistory.push({
        cardId: args.cardId,
        viewedAt: now,
        attemptsOnCard: 0,
      });
    }

    await ctx.db.patch(args.progressId, {
      currentSectionId: args.sectionId,
      currentCardId: args.cardId,
      cardHistory: updatedHistory,
      updatedAt: now,
    });
  },
});

/**
 * Toggle content mode (athlete/parent)
 */
export const toggleMode = mutation({
  args: {
    progressId: v.id("learningProgress"),
    mode: v.union(v.literal("athlete"), v.literal("parent")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.progressId, {
      mode: args.mode,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Answer a check card
 * Returns crystals earned (0 if already answered correctly)
 */
export const answerCheck = mutation({
  args: {
    progressId: v.id("learningProgress"),
    userId: v.id("users"),
    cardId: v.string(),
    isCorrect: v.boolean(),
    baseReward: v.number(), // Crystal reward for this card
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db.get(args.progressId);
    if (!progress) throw new Error("Progress not found");

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const now = Date.now();

    // Find card in history
    const cardIndex = progress.cardHistory.findIndex((h) => h.cardId === args.cardId);

    const updatedHistory = [...progress.cardHistory];
    let crystalsToAward = 0;
    let isFirstCorrect = false;

    if (cardIndex === -1) {
      // Card not in history yet, add it
      updatedHistory.push({
        cardId: args.cardId,
        viewedAt: now,
        answeredAt: now,
        wasCorrect: args.isCorrect,
        attemptsOnCard: 1,
      });
      isFirstCorrect = args.isCorrect;
    } else {
      // Card exists in history
      const cardHistory = updatedHistory[cardIndex];
      const previouslyCorrect = cardHistory.wasCorrect === true;
      const newAttempts = cardHistory.attemptsOnCard + 1;

      updatedHistory[cardIndex] = {
        ...cardHistory,
        answeredAt: now,
        wasCorrect: args.isCorrect || previouslyCorrect, // Once correct, stays correct
        attemptsOnCard: newAttempts,
      };

      // Only award crystals if this is the first correct answer
      isFirstCorrect = args.isCorrect && !previouslyCorrect;
    }

    // Calculate crystals
    if (isFirstCorrect) {
      const attempts = cardIndex === -1 ? 1 : updatedHistory[cardIndex].attemptsOnCard;
      crystalsToAward = attempts === 1 ? CRYSTALS_FIRST_TRY : CRYSTALS_RETRY;

      // Check daily cap
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const dailyEarned = user.dailyCrystalsEarned ?? 0;
      const lastReset = user.lastXpResetAt ?? 0;

      // If last reset was before today, reset daily counter
      if (lastReset < todayStart.getTime()) {
        crystalsToAward = Math.min(crystalsToAward, DAILY_CRYSTAL_CAP);
      } else {
        // Apply remaining cap
        const remaining = Math.max(0, DAILY_CRYSTAL_CAP - dailyEarned);
        crystalsToAward = Math.min(crystalsToAward, remaining);
      }
    }

    // Update progress
    await ctx.db.patch(args.progressId, {
      totalAttempts: progress.totalAttempts + 1,
      totalCorrect: isFirstCorrect ? progress.totalCorrect + 1 : progress.totalCorrect,
      crystalsEarned: progress.crystalsEarned + crystalsToAward,
      cardHistory: updatedHistory,
      updatedAt: now,
    });

    // Award crystals to user
    if (crystalsToAward > 0) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const lastReset = user.lastXpResetAt ?? 0;
      const wasResetToday = lastReset >= todayStart.getTime();

      await ctx.db.patch(args.userId, {
        crystals: user.crystals + crystalsToAward,
        dailyCrystalsEarned: wasResetToday
          ? (user.dailyCrystalsEarned ?? 0) + crystalsToAward
          : crystalsToAward,
        lastXpResetAt: wasResetToday ? lastReset : todayStart.getTime(),
        updatedAt: now,
      });
    }

    return {
      isCorrect: args.isCorrect,
      isFirstCorrect,
      crystalsAwarded: crystalsToAward,
      totalCorrect: isFirstCorrect ? progress.totalCorrect + 1 : progress.totalCorrect,
    };
  },
});

/**
 * Unlock a new section
 */
export const unlockSection = mutation({
  args: {
    progressId: v.id("learningProgress"),
    sectionId: v.string(),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db.get(args.progressId);
    if (!progress) throw new Error("Progress not found");

    // Check if already unlocked
    if (progress.sectionsUnlocked.includes(args.sectionId)) {
      return { alreadyUnlocked: true };
    }

    await ctx.db.patch(args.progressId, {
      sectionsUnlocked: [...progress.sectionsUnlocked, args.sectionId],
      updatedAt: Date.now(),
    });

    return { alreadyUnlocked: false };
  },
});

/**
 * Complete a module
 * Awards badge and bonus crystals
 */
export const completeModule = mutation({
  args: {
    progressId: v.id("learningProgress"),
    userId: v.id("users"),
    moduleId: v.string(),
    finalScore: v.number(), // Percentage 0-100
    badge: v.object({
      id: v.string(),
      name: v.string(),
      icon: v.string(),
      description: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db.get(args.progressId);
    if (!progress) throw new Error("Progress not found");

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const now = Date.now();

    // Check if already completed
    if (progress.completedAt) {
      return {
        alreadyCompleted: true,
        bonusCrystals: 0,
      };
    }

    // Calculate bonus crystals
    let bonusCrystals = 0;
    if (args.finalScore >= 80) bonusCrystals += 20; // Completion bonus
    if (args.finalScore === 100) bonusCrystals += 30; // Perfect score bonus

    // Mark module complete
    await ctx.db.patch(args.progressId, {
      completedAt: now,
      updatedAt: now,
    });

    // Check if badge already exists
    const existingBadge = await ctx.db
      .query("userBadges")
      .withIndex("by_user_badge", (q) => q.eq("userId", args.userId).eq("badgeId", args.badge.id))
      .first();

    if (!existingBadge) {
      // Award badge
      await ctx.db.insert("userBadges", {
        userId: args.userId,
        badgeId: args.badge.id,
        badgeName: args.badge.name,
        badgeIcon: args.badge.icon,
        badgeDescription: args.badge.description,
        source: `module:${args.moduleId}`,
        earnedAt: now,
      });
    }

    // Award bonus crystals (respecting daily cap)
    if (bonusCrystals > 0) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const lastReset = user.lastXpResetAt ?? 0;
      const wasResetToday = lastReset >= todayStart.getTime();
      const dailyEarned = wasResetToday ? (user.dailyCrystalsEarned ?? 0) : 0;
      const remaining = Math.max(0, DAILY_CRYSTAL_CAP - dailyEarned);
      const actualBonus = Math.min(bonusCrystals, remaining);

      if (actualBonus > 0) {
        await ctx.db.patch(args.userId, {
          crystals: user.crystals + actualBonus,
          dailyCrystalsEarned: dailyEarned + actualBonus,
          lastXpResetAt: wasResetToday ? lastReset : todayStart.getTime(),
          updatedAt: now,
        });
      }

      // Update progress with bonus
      await ctx.db.patch(args.progressId, {
        crystalsEarned: progress.crystalsEarned + actualBonus,
      });

      bonusCrystals = actualBonus;
    }

    return {
      alreadyCompleted: false,
      bonusCrystals,
      badgeAwarded: !existingBadge,
    };
  },
});

/**
 * Create entitlement for unlocked content
 */
export const createUnlockEntitlement = mutation({
  args: {
    userId: v.id("users"),
    productSlug: v.string(),
    source: v.string(), // e.g., "module:bpa-v1"
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if entitlement already exists
    const existing = await ctx.db
      .query("entitlements")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", args.userId).eq("productSlug", args.productSlug),
      )
      .first();

    if (existing) {
      return { entitlementId: existing._id, isNew: false };
    }

    // Create new entitlement
    const entitlementId = await ctx.db.insert("entitlements", {
      userId: args.userId,
      productSlug: args.productSlug,
      productType: "program",
      source: "promo", // Unlocked via module completion
      status: "active",
      grantedAt: now,
      metadata: { unlockedBy: args.source },
    });

    return { entitlementId, isNew: true };
  },
});
