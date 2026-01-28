/**
 * Tom Chief of Staff Convex Functions
 * ====================================
 *
 * Database operations for the Tom COS system.
 * All tom_* table queries and mutations.
 */

import { v } from "convex/values";
import { query, mutation, internalMutation, internalQuery } from "./_generated/server";

// ─────────────────────────────────────────────────────────────
// TYPE VALIDATORS
// ─────────────────────────────────────────────────────────────

const tomUserIdValidator = v.union(
  v.literal("mike"),
  v.literal("james"),
  v.literal("adam"),
  v.literal("annie")
);

const contextTypeValidator = v.union(
  v.literal("active_context"),
  v.literal("backlog"),
  v.literal("daily_log"),
  v.literal("preferences")
);

const captureTypeValidator = v.union(
  v.literal("task"),
  v.literal("note"),
  v.literal("idea"),
  v.literal("question")
);

// ─────────────────────────────────────────────────────────────
// USER QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Get a Tom user by ID
 */
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tom_users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId as "mike" | "james" | "adam" | "annie"))
      .unique();
  },
});

/**
 * Get a Tom user by WhatsApp number
 */
export const getUserByWhatsApp = query({
  args: { whatsappNumber: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tom_users")
      .withIndex("by_whatsapp", (q) => q.eq("whatsappNumber", args.whatsappNumber))
      .unique();
  },
});

/**
 * Get all Tom users
 */
export const getAllUsers = query({
  handler: async (ctx) => {
    return ctx.db.query("tom_users").collect();
  },
});

/**
 * Create or update a Tom user
 */
export const upsertUser = mutation({
  args: {
    userId: tomUserIdValidator,
    email: v.string(),
    displayName: v.string(),
    voiceProfileId: v.string(),
    whatsappNumber: v.optional(v.string()),
    preferences: v.object({
      briefingTime: v.string(),
      briefingTimezone: v.string(),
      deliveryMethod: v.union(v.literal("email"), v.literal("whatsapp")),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tom_users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        displayName: args.displayName,
        voiceProfileId: args.voiceProfileId,
        whatsappNumber: args.whatsappNumber,
        preferences: args.preferences,
      });
      return existing._id;
    }

    return ctx.db.insert("tom_users", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────
// CONTEXT OPERATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Get a specific context for a user
 */
export const getContext = query({
  args: {
    userId: v.string(),
    contextType: contextTypeValidator,
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tom_contexts")
      .withIndex("by_user_type", (q) =>
        q.eq("userId", args.userId as "mike" | "james" | "adam" | "annie").eq("contextType", args.contextType)
      )
      .unique();
  },
});

/**
 * Get all contexts for a user
 */
export const getAllContexts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tom_contexts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId as "mike" | "james" | "adam" | "annie"))
      .collect();
  },
});

/**
 * Create or update a context
 */
export const upsertContext = mutation({
  args: {
    userId: tomUserIdValidator,
    contextType: contextTypeValidator,
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tom_contexts")
      .withIndex("by_user_type", (q) =>
        q.eq("userId", args.userId).eq("contextType", args.contextType)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        lastUpdatedAt: Date.now(),
        lastUpdatedBy: "tom",
      });
      return existing._id;
    }

    return ctx.db.insert("tom_contexts", {
      userId: args.userId,
      contextType: args.contextType,
      content: args.content,
      lastUpdatedAt: Date.now(),
      lastUpdatedBy: "tom",
    });
  },
});

/**
 * Append content to an existing context
 */
export const appendToContext = mutation({
  args: {
    userId: tomUserIdValidator,
    contextType: contextTypeValidator,
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tom_contexts")
      .withIndex("by_user_type", (q) =>
        q.eq("userId", args.userId).eq("contextType", args.contextType)
      )
      .unique();

    const newContent = existing
      ? `${existing.content}\n${args.content}`
      : args.content;

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: newContent,
        lastUpdatedAt: Date.now(),
        lastUpdatedBy: "tom",
      });
      return existing._id;
    }

    return ctx.db.insert("tom_contexts", {
      userId: args.userId,
      contextType: args.contextType,
      content: newContent,
      lastUpdatedAt: Date.now(),
      lastUpdatedBy: "tom",
    });
  },
});

// ─────────────────────────────────────────────────────────────
// CAPTURE OPERATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Store a new capture
 */
export const storeCapture = mutation({
  args: {
    userId: tomUserIdValidator,
    content: v.string(),
    source: v.union(v.literal("voice"), v.literal("text"), v.literal("whatsapp")),
    routed: v.boolean(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("tom_captures", args);
  },
});

/**
 * Update a capture
 */
export const updateCapture = mutation({
  args: {
    captureId: v.id("tom_captures"),
    routed: v.optional(v.boolean()),
    routedTo: v.optional(v.string()),
    classifiedAs: v.optional(captureTypeValidator),
  },
  handler: async (ctx, args) => {
    const { captureId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(captureId, filteredUpdates);
  },
});

/**
 * Get recent captures for a user
 */
export const getRecentCaptures = query({
  args: { userId: v.string(), limit: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tom_captures")
      .withIndex("by_user", (q) => q.eq("userId", args.userId as "mike" | "james" | "adam" | "annie"))
      .order("desc")
      .take(args.limit);
  },
});

/**
 * Get unrouted captures for a user
 */
export const getUnroutedCaptures = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tom_captures")
      .withIndex("by_unrouted", (q) =>
        q.eq("userId", args.userId as "mike" | "james" | "adam" | "annie").eq("routed", false)
      )
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────
// BRIEFING OPERATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Store a briefing
 */
export const storeBriefing = mutation({
  args: {
    userId: tomUserIdValidator,
    date: v.string(),
    briefingType: v.union(v.literal("morning"), v.literal("weekly")),
    content: v.string(),
    sections: v.object({
      priorities: v.string(),
      blockers: v.string(),
      calendar: v.string(),
      insights: v.string(),
    }),
    generatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("tom_briefings", args);
  },
});

/**
 * Mark a briefing as delivered
 */
export const markBriefingDelivered = mutation({
  args: {
    briefingId: v.id("tom_briefings"),
    deliveryMethod: v.union(v.literal("email"), v.literal("whatsapp")),
    deliveredAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.briefingId, {
      deliveryMethod: args.deliveryMethod,
      deliveredAt: args.deliveredAt,
    });
  },
});

/**
 * Get today's briefing for a user
 */
export const getTodaysBriefing = query({
  args: { userId: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tom_briefings")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId as "mike" | "james" | "adam" | "annie").eq("date", args.date)
      )
      .first();
  },
});

// ─────────────────────────────────────────────────────────────
// LOG OPERATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Log a message
 */
export const logMessage = mutation({
  args: {
    userId: tomUserIdValidator,
    content: v.string(),
    direction: v.union(v.literal("inbound"), v.literal("outbound")),
    intent: v.optional(v.string()),
    sentiment: v.optional(v.string()),
    personalityMode: v.optional(v.string()),
    whatsappMessageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("tom_logs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

/**
 * Get recent logs for a user
 */
export const getRecentLogs = query({
  args: { userId: v.string(), limit: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tom_logs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId as "mike" | "james" | "adam" | "annie"))
      .order("desc")
      .take(args.limit);
  },
});

// ─────────────────────────────────────────────────────────────
// TASK OPERATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Create a task
 */
export const createTask = mutation({
  args: {
    task: v.string(),
    description: v.optional(v.string()),
    assignedTo: v.string(),
    requestedBy: tomUserIdValidator,
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("tom_tasks", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

/**
 * Update task status
 */
export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tom_tasks"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
    result: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = { status: args.status };
    if (args.result) updates.result = args.result;
    if (args.status === "completed" || args.status === "failed") {
      updates.completedAt = Date.now();
    }
    await ctx.db.patch(args.taskId, updates);
  },
});

/**
 * Get pending tasks for an assignee
 */
export const getPendingTasks = query({
  args: { assignedTo: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tom_tasks")
      .withIndex("by_assigned", (q) =>
        q.eq("assignedTo", args.assignedTo).eq("status", "pending")
      )
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────
// INTERNAL FUNCTIONS (Called by crons)
// ─────────────────────────────────────────────────────────────

/**
 * Schedule a briefing (called by cron)
 * This triggers the Inngest workflow
 */
export const scheduleBriefing = internalMutation({
  args: {
    userId: v.string(),
    briefingType: v.string(),
  },
  handler: async (ctx, args) => {
    // Log that we're scheduling a briefing
    // The actual Inngest trigger happens in the API layer
    console.log(`[Tom] Scheduling ${args.briefingType} briefing for ${args.userId}`);

    // We could store a "scheduled" record here if needed
    // For now, just log it - the Inngest function will handle the actual work
    return { scheduled: true, userId: args.userId, briefingType: args.briefingType };
  },
});

/**
 * Schedule knowledge sync for all users (called by cron)
 */
export const scheduleKnowledgeSync = internalMutation({
  handler: async (ctx) => {
    const users = await ctx.db.query("tom_users").collect();

    const usersWithGoogle = users.filter(
      (user) => user.googleIntegration?.connected
    );

    console.log(`[Tom] Scheduling knowledge sync for ${usersWithGoogle.length} users`);

    return {
      scheduled: true,
      userCount: usersWithGoogle.length,
      userIds: usersWithGoogle.map((u) => u.userId),
    };
  },
});

/**
 * Internal query to get user for cron jobs
 */
export const internalGetUser = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tom_users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId as "mike" | "james" | "adam" | "annie"))
      .unique();
  },
});
