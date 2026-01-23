// ═══════════════════════════════════════════════════════════════
// AGENT FILE SYSTEM - CROSS-SESSION TASK COORDINATION
// Enables multiple Claude agents to share work across sessions
// Usage: Any agent can read/write tasks to coordinate async work
// ═══════════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper to generate IDs (avoiding nanoid import issues in Convex)
function generateId(prefix: string): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = prefix + "_";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────
// QUERIES - Read tasks and logs
// ─────────────────────────────────────────────────────────────────

/**
 * Get all tasks, optionally filtered by domain and/or status
 */
export const listTasks = query({
  args: {
    domain: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("agent_tasks");

    if (args.domain && args.status) {
      q = q.withIndex("by_domain", (idx) =>
        idx.eq("domain", args.domain!).eq("status", args.status as any)
      );
    } else if (args.status) {
      q = q.withIndex("by_status", (idx) =>
        idx.eq("status", args.status as any)
      );
    } else if (args.domain) {
      q = q.withIndex("by_domain", (idx) => idx.eq("domain", args.domain!));
    }

    const tasks = await q.order("desc").take(args.limit ?? 100);
    return tasks;
  },
});

/**
 * Get a single task by taskId
 */
export const getTask = query({
  args: { taskId: v.string() },
  handler: async (ctx, args) => {
    const task = await ctx.db
      .query("agent_tasks")
      .withIndex("by_task_id", (q) => q.eq("taskId", args.taskId))
      .first();
    return task;
  },
});

/**
 * Get pending tasks for a domain, ordered by priority
 */
export const getPendingTasks = query({
  args: {
    domain: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("agent_tasks")
      .withIndex("by_domain", (q) =>
        q.eq("domain", args.domain).eq("status", "pending")
      )
      .order("asc")
      .take(args.limit ?? 20);

    // Sort by priority (lower number = higher priority)
    return tasks.sort((a, b) => a.priority - b.priority);
  },
});

/**
 * Get logs for a specific task
 */
export const getTaskLogs = query({
  args: { taskId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agent_logs")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .order("desc")
      .take(50);
  },
});

/**
 * Get recent logs for a domain
 */
export const getDomainLogs = query({
  args: {
    domain: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agent_logs")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

// ─────────────────────────────────────────────────────────────────
// MUTATIONS - Create, update, complete tasks
// ─────────────────────────────────────────────────────────────────

/**
 * Create a new task
 */
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    domain: v.string(),
    project: v.optional(v.string()),
    priority: v.optional(v.number()),
    createdBy: v.string(),
    payload: v.optional(v.any()),
    blockedBy: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const taskId = generateId("task");

    const id = await ctx.db.insert("agent_tasks", {
      taskId,
      title: args.title,
      description: args.description,
      domain: args.domain,
      project: args.project,
      status: "pending",
      priority: args.priority ?? 3,
      createdBy: args.createdBy,
      payload: args.payload,
      blockedBy: args.blockedBy,
      createdAt: now,
      updatedAt: now,
    });

    // Log creation
    await ctx.db.insert("agent_logs", {
      taskId,
      agentId: args.createdBy,
      action: "task_created",
      domain: args.domain,
      message: `Created task: ${args.title}`,
      data: { priority: args.priority ?? 3 },
      level: "info",
      createdAt: now,
    });

    return { taskId, _id: id };
  },
});

/**
 * Claim a task (mark as in_progress)
 */
export const claimTask = mutation({
  args: {
    taskId: v.string(),
    agentId: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db
      .query("agent_tasks")
      .withIndex("by_task_id", (q) => q.eq("taskId", args.taskId))
      .first();

    if (!task) throw new Error(`Task ${args.taskId} not found`);
    if (task.status !== "pending") {
      throw new Error(`Task ${args.taskId} is not pending (status: ${task.status})`);
    }

    const now = Date.now();

    await ctx.db.patch(task._id, {
      status: "in_progress",
      assignedTo: args.agentId,
      startedAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("agent_logs", {
      taskId: args.taskId,
      agentId: args.agentId,
      action: "task_claimed",
      domain: task.domain,
      message: `Agent claimed task: ${task.title}`,
      level: "info",
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Update task progress
 */
export const updateProgress = mutation({
  args: {
    taskId: v.string(),
    agentId: v.string(),
    progressPercent: v.optional(v.number()),
    progressNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db
      .query("agent_tasks")
      .withIndex("by_task_id", (q) => q.eq("taskId", args.taskId))
      .first();

    if (!task) throw new Error(`Task ${args.taskId} not found`);

    const now = Date.now();

    await ctx.db.patch(task._id, {
      progressPercent: args.progressPercent,
      progressNotes: args.progressNotes,
      updatedAt: now,
    });

    await ctx.db.insert("agent_logs", {
      taskId: args.taskId,
      agentId: args.agentId,
      action: "progress_updated",
      domain: task.domain,
      message: args.progressNotes ?? `Progress: ${args.progressPercent}%`,
      data: { percent: args.progressPercent },
      level: "debug",
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Complete a task with results
 */
export const completeTask = mutation({
  args: {
    taskId: v.string(),
    agentId: v.string(),
    result: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db
      .query("agent_tasks")
      .withIndex("by_task_id", (q) => q.eq("taskId", args.taskId))
      .first();

    if (!task) throw new Error(`Task ${args.taskId} not found`);

    const now = Date.now();

    await ctx.db.patch(task._id, {
      status: "completed",
      completedBy: args.agentId,
      completedAt: now,
      progressPercent: 100,
      result: args.result,
      updatedAt: now,
    });

    await ctx.db.insert("agent_logs", {
      taskId: args.taskId,
      agentId: args.agentId,
      action: "task_completed",
      domain: task.domain,
      message: `Completed task: ${task.title}`,
      data: args.result,
      level: "info",
      createdAt: now,
    });

    // Unblock dependent tasks
    if (task.blocks && task.blocks.length > 0) {
      for (const blockedTaskId of task.blocks) {
        const blockedTask = await ctx.db
          .query("agent_tasks")
          .withIndex("by_task_id", (q) => q.eq("taskId", blockedTaskId))
          .first();

        if (blockedTask && blockedTask.blockedBy) {
          const newBlockedBy = blockedTask.blockedBy.filter((id) => id !== args.taskId);
          await ctx.db.patch(blockedTask._id, {
            blockedBy: newBlockedBy,
            status: newBlockedBy.length === 0 ? "pending" : blockedTask.status,
            updatedAt: now,
          });
        }
      }
    }

    return { success: true };
  },
});

/**
 * Fail a task with error message
 */
export const failTask = mutation({
  args: {
    taskId: v.string(),
    agentId: v.string(),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db
      .query("agent_tasks")
      .withIndex("by_task_id", (q) => q.eq("taskId", args.taskId))
      .first();

    if (!task) throw new Error(`Task ${args.taskId} not found`);

    const now = Date.now();

    await ctx.db.patch(task._id, {
      status: "blocked",
      errorMessage: args.errorMessage,
      updatedAt: now,
    });

    await ctx.db.insert("agent_logs", {
      taskId: args.taskId,
      agentId: args.agentId,
      action: "task_failed",
      domain: task.domain,
      message: `Task failed: ${args.errorMessage}`,
      level: "error",
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Bulk create tasks (for seeding)
 */
export const bulkCreateTasks = mutation({
  args: {
    tasks: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        domain: v.string(),
        project: v.optional(v.string()),
        priority: v.optional(v.number()),
        payload: v.optional(v.any()),
      })
    ),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const results = [];

    for (const task of args.tasks) {
      const taskId = generateId("task");

      const id = await ctx.db.insert("agent_tasks", {
        taskId,
        title: task.title,
        description: task.description,
        domain: task.domain,
        project: task.project,
        status: "pending",
        priority: task.priority ?? 3,
        createdBy: args.createdBy,
        payload: task.payload,
        createdAt: now,
        updatedAt: now,
      });

      results.push({ taskId, _id: id });
    }

    await ctx.db.insert("agent_logs", {
      agentId: args.createdBy,
      action: "bulk_tasks_created",
      domain: args.tasks[0]?.domain ?? "unknown",
      message: `Created ${args.tasks.length} tasks`,
      data: { count: args.tasks.length },
      level: "info",
      createdAt: now,
    });

    return results;
  },
});

/**
 * Log an agent action (without task context)
 */
export const logAction = mutation({
  args: {
    agentId: v.string(),
    action: v.string(),
    domain: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    level: v.optional(
      v.union(
        v.literal("debug"),
        v.literal("info"),
        v.literal("warn"),
        v.literal("error")
      )
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("agent_logs", {
      agentId: args.agentId,
      action: args.action,
      domain: args.domain,
      message: args.message,
      data: args.data,
      level: args.level ?? "info",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
