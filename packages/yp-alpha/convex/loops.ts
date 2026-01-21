// ═══════════════════════════════════════════════════════════
// LOOPS.SO EMAIL MARKETING INTEGRATION
// Wolf Mail - The Sunday Protocol
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const LOOPS_API_URL = "https://app.loops.so/api/v1";

// Sender Identities (Wolf Mail Coaches)
export const WOLF_MAIL_SENDERS = {
  james: {
    name: "Coach James",
    email: "james@send.youthperformance.com",
    focus: "barefoot", // Barefoot training specialist
  },
  adam: {
    name: "Coach Adam",
    email: "adam@send.youthperformance.com",
    focus: "basketball", // Basketball training specialist
  },
  alpha: {
    name: "YP Alpha",
    email: "alpha@send.youthperformance.com",
    focus: "announcements", // Dean of Academy - announcements
  },
} as const;

type WolfMailSender = keyof typeof WOLF_MAIL_SENDERS;

// ─────────────────────────────────────────────────────────────
// LOOPS API HELPER
// ─────────────────────────────────────────────────────────────

interface LoopsContact {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
  subscribed?: boolean;
  userGroup?: string;
  userId?: string;
  // YP-specific properties
  sportFocus?: string; // "basketball", "barefoot", "multi-sport"
  wolfIdentity?: string; // "speed", "tank", "air"
  trainingPath?: string; // "glass", "grinder", "prospect"
  hasNeoBall?: boolean;
  hasWolfContract?: boolean;
  subscriptionStatus?: string; // "free", "pro"
  createdAt?: string; // ISO date
}

async function loopsRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const apiKey = process.env.LOOPS_API_KEY;

  if (!apiKey) {
    console.error("[LOOPS] LOOPS_API_KEY not configured");
    return { success: false, error: "Loops API key not configured" };
  }

  try {
    const response = await fetch(`${LOOPS_API_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[LOOPS] API error:", data);
      return { success: false, error: data.message || "Loops API error" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[LOOPS] Network error:", error);
    return { success: false, error: "Failed to connect to Loops" };
  }
}

// ═══════════════════════════════════════════════════════════
// CONTACT SYNC ACTIONS
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// Sync User to Loops (Create or Update Contact)
// Called when: user signs up, profile updates, purchase made
// ─────────────────────────────────────────────────────────────

export const syncUserToLoops = internalAction({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    userId: v.optional(v.string()),
    source: v.optional(v.string()),
    sportFocus: v.optional(v.string()),
    wolfIdentity: v.optional(v.string()),
    trainingPath: v.optional(v.string()),
    hasNeoBall: v.optional(v.boolean()),
    hasWolfContract: v.optional(v.boolean()),
    subscriptionStatus: v.optional(v.string()),
  },
  returns: v.any(),
  handler: async (_ctx, args) => {
    const contact: LoopsContact = {
      email: args.email,
      subscribed: true,
      source: args.source || "yp-academy",
    };

    // Add optional fields
    if (args.firstName) contact.firstName = args.firstName;
    if (args.lastName) contact.lastName = args.lastName;
    if (args.userId) contact.userId = args.userId;
    if (args.sportFocus) contact.sportFocus = args.sportFocus;
    if (args.wolfIdentity) contact.wolfIdentity = args.wolfIdentity;
    if (args.trainingPath) contact.trainingPath = args.trainingPath;
    if (args.hasNeoBall !== undefined) contact.hasNeoBall = args.hasNeoBall;
    if (args.hasWolfContract !== undefined) contact.hasWolfContract = args.hasWolfContract;
    if (args.subscriptionStatus) contact.subscriptionStatus = args.subscriptionStatus;

    // Determine user group based on sport focus (for segmentation)
    if (args.sportFocus) {
      contact.userGroup = args.sportFocus;
    }

    const result = await loopsRequest("/contacts/create", "POST", contact);

    if (result.success) {
      console.log(`[LOOPS] Synced contact: ${args.email}`);
    } else {
      // If contact exists, try to update instead
      if (result.error?.includes("already exists")) {
        const updateResult = await loopsRequest("/contacts/update", "PUT", contact);
        if (updateResult.success) {
          console.log(`[LOOPS] Updated contact: ${args.email}`);
          return { success: true };
        }
      }
      console.error(`[LOOPS] Failed to sync contact: ${args.email}`, result.error);
    }

    return result;
  },
});

// ─────────────────────────────────────────────────────────────
// Sync Email Capture to Loops (Lead Magnet Downloads)
// Called when: user downloads lead magnet, joins waitlist
// ─────────────────────────────────────────────────────────────

export const syncLeadToLoops = internalAction({
  args: {
    email: v.string(),
    source: v.string(), // "bulletproof-ankles", "neoball-waitlist", etc.
    tags: v.optional(v.array(v.string())),
  },
  returns: v.any(),
  handler: async (_ctx, args) => {
    const contact: LoopsContact = {
      email: args.email,
      source: args.source,
      subscribed: true,
      userGroup: "lead", // Mark as lead (not full user yet)
    };

    const result = await loopsRequest("/contacts/create", "POST", contact);

    if (result.success) {
      console.log(`[LOOPS] Synced lead: ${args.email} (source: ${args.source})`);
    }

    return result;
  },
});

// ─────────────────────────────────────────────────────────────
// Update Contact Properties (After Purchase, Training, etc.)
// ─────────────────────────────────────────────────────────────

export const updateLoopsContact = internalAction({
  args: {
    email: v.string(),
    properties: v.object({
      hasNeoBall: v.optional(v.boolean()),
      hasWolfContract: v.optional(v.boolean()),
      wolfIdentity: v.optional(v.string()),
      trainingPath: v.optional(v.string()),
      subscriptionStatus: v.optional(v.string()),
      userGroup: v.optional(v.string()),
    }),
  },
  returns: v.any(),
  handler: async (_ctx, args) => {
    const updatePayload = {
      email: args.email,
      ...args.properties,
    };

    const result = await loopsRequest("/contacts/update", "PUT", updatePayload);

    if (result.success) {
      console.log(`[LOOPS] Updated contact properties: ${args.email}`);
    }

    return result;
  },
});

// ═══════════════════════════════════════════════════════════
// EVENT TRIGGERS
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// Trigger Transactional Email (Via Loops Events)
// Use for: welcome, contract signed, weekly progress, etc.
// ─────────────────────────────────────────────────────────────

export const triggerLoopsEvent = internalAction({
  args: {
    email: v.string(),
    eventName: v.string(),
    eventProperties: v.optional(v.any()),
  },
  returns: v.any(),
  handler: async (_ctx, args) => {
    const payload = {
      email: args.email,
      eventName: args.eventName,
      eventProperties: args.eventProperties || {},
    };

    const result = await loopsRequest("/events/send", "POST", payload);

    if (result.success) {
      console.log(`[LOOPS] Triggered event '${args.eventName}' for ${args.email}`);
    }

    return result;
  },
});

// ═══════════════════════════════════════════════════════════
// WOLF MAIL CAMPAIGN TRIGGERS
// Transactional events that trigger automated emails
// ═══════════════════════════════════════════════════════════

// Event names for Loops automation
export const WOLF_MAIL_EVENTS = {
  // Onboarding
  USER_SIGNED_UP: "user_signed_up",
  WOLF_SORTED: "wolf_sorted",

  // Wolf Contract
  CONTRACT_SIGNED: "wolf_contract_signed",
  CONTRACT_WEEKLY_UPDATE: "wolf_contract_weekly_update",
  CONTRACT_COMPLETED: "wolf_contract_completed",
  CONTRACT_FAILED: "wolf_contract_failed",

  // Training
  FIRST_WORKOUT_COMPLETED: "first_workout_completed",
  STREAK_MILESTONE: "streak_milestone", // 7, 14, 30 days

  // Commerce
  NEOBALL_PURCHASED: "neoball_purchased",
  GOLDEN_TICKET_SENT: "golden_ticket_sent",

  // Lead Magnets
  LEAD_MAGNET_DOWNLOADED: "lead_magnet_downloaded",
  WAITLIST_JOINED: "waitlist_joined",
} as const;

// ─────────────────────────────────────────────────────────────
// Helper: Trigger Welcome Event (after signup)
// ─────────────────────────────────────────────────────────────

export const triggerWelcomeEvent = internalAction({
  args: {
    email: v.string(),
    firstName: v.string(),
    wolfIdentity: v.optional(v.string()),
    trainingPath: v.optional(v.string()),
  },
  returns: v.any(),
  handler: async (ctx, args): Promise<unknown> => {
    // First sync the user to Loops
    await ctx.runAction(internal.loops.syncUserToLoops, {
      email: args.email,
      firstName: args.firstName,
      source: "yp-academy-signup",
      wolfIdentity: args.wolfIdentity,
      trainingPath: args.trainingPath,
    });

    // Then trigger the welcome event
    const result = await ctx.runAction(internal.loops.triggerLoopsEvent, {
      email: args.email,
      eventName: WOLF_MAIL_EVENTS.USER_SIGNED_UP,
      eventProperties: {
        firstName: args.firstName,
        wolfIdentity: args.wolfIdentity,
        trainingPath: args.trainingPath,
      },
    });
    return result;
  },
});

// ─────────────────────────────────────────────────────────────
// Helper: Trigger Wolf Contract Signed Event
// ─────────────────────────────────────────────────────────────

export const triggerContractSignedEvent = internalAction({
  args: {
    email: v.string(),
    athleteName: v.string(),
    expiresAt: v.number(),
    levelsRequired: v.number(),
  },
  returns: v.any(),
  handler: async (ctx, args): Promise<unknown> => {
    // Update contact to mark as having Wolf Contract
    await ctx.runAction(internal.loops.updateLoopsContact, {
      email: args.email,
      properties: {
        hasWolfContract: true,
      },
    });

    // Trigger the event
    const result = await ctx.runAction(internal.loops.triggerLoopsEvent, {
      email: args.email,
      eventName: WOLF_MAIL_EVENTS.CONTRACT_SIGNED,
      eventProperties: {
        athleteName: args.athleteName,
        expiresAt: args.expiresAt,
        levelsRequired: args.levelsRequired,
        windowDays: 42,
      },
    });
    return result;
  },
});

// ─────────────────────────────────────────────────────────────
// Helper: Trigger Weekly Progress Event
// ─────────────────────────────────────────────────────────────

export const triggerWeeklyProgressEvent = internalAction({
  args: {
    email: v.string(),
    athleteName: v.string(),
    levelsCompleted: v.number(),
    levelsRequired: v.number(),
    daysRemaining: v.number(),
    isOnTrack: v.boolean(),
  },
  returns: v.any(),
  handler: async (ctx, args): Promise<unknown> => {
    const result = await ctx.runAction(internal.loops.triggerLoopsEvent, {
      email: args.email,
      eventName: WOLF_MAIL_EVENTS.CONTRACT_WEEKLY_UPDATE,
      eventProperties: {
        athleteName: args.athleteName,
        levelsCompleted: args.levelsCompleted,
        levelsRequired: args.levelsRequired,
        daysRemaining: args.daysRemaining,
        isOnTrack: args.isOnTrack,
        progressPercent: Math.round((args.levelsCompleted / args.levelsRequired) * 100),
      },
    });
    return result;
  },
});

// ═══════════════════════════════════════════════════════════
// BULK SYNC (Initial Migration)
// ═══════════════════════════════════════════════════════════

// Note: For bulk import, use Loops dashboard CSV upload
// or call syncUserToLoops in batches from a scheduled function

export const bulkSyncUsersToLoops = action({
  args: {
    userIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // This would be called with user IDs to sync
    // Implementation would query users and call syncUserToLoops for each
    console.log(`[LOOPS] Bulk sync requested for ${args.userIds.length} users`);
    return { queued: args.userIds.length };
  },
});
