// ============================================================================
// MIGRATION LOGS
// Track auth system unification & domain migration progress
// ============================================================================

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Log a migration action
export const logAction = mutation({
  args: {
    migrationId: v.string(),
    phase: v.string(),
    phaseName: v.string(),
    action: v.string(),
    file: v.optional(v.string()),
    description: v.string(),
    status: v.string(),
    error: v.optional(v.string()),
    details: v.optional(v.any()),
    executedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("migrationLogs", {
      ...args,
      startedAt: now,
      completedAt: args.status === "completed" ? now : undefined,
    });
  },
});

// Update a migration log status
export const updateStatus = mutation({
  args: {
    logId: v.id("migrationLogs"),
    status: v.string(),
    error: v.optional(v.string()),
    details: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.logId, {
      status: args.status,
      error: args.error,
      details: args.details,
      completedAt: args.status === "completed" || args.status === "failed" ? now : undefined,
    });
  },
});

// Get all logs for a migration
export const getByMigration = query({
  args: {
    migrationId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("migrationLogs")
      .withIndex("by_migration", (q) => q.eq("migrationId", args.migrationId))
      .order("desc")
      .collect();
  },
});

// Get logs by phase
export const getByPhase = query({
  args: {
    phase: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("migrationLogs")
      .withIndex("by_phase", (q) => q.eq("phase", args.phase))
      .order("desc")
      .collect();
  },
});

// Get recent logs
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("migrationLogs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);
  },
});

// Get migration summary
export const getSummary = query({
  args: {
    migrationId: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("migrationLogs")
      .withIndex("by_migration", (q) => q.eq("migrationId", args.migrationId))
      .collect();

    const byPhase: Record<string, { total: number; completed: number; failed: number }> = {};

    for (const log of logs) {
      if (!byPhase[log.phase]) {
        byPhase[log.phase] = { total: 0, completed: 0, failed: 0 };
      }
      byPhase[log.phase].total++;
      if (log.status === "completed") byPhase[log.phase].completed++;
      if (log.status === "failed") byPhase[log.phase].failed++;
    }

    return {
      migrationId: args.migrationId,
      totalActions: logs.length,
      byPhase,
      latestLog: logs[0],
    };
  },
});
