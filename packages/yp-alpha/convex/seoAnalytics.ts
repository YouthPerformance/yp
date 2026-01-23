// ═══════════════════════════════════════════════════════════
// SEO ANALYTICS QUERIES
// Real-time analytics for the SEO Command Center
// ═══════════════════════════════════════════════════════════

import { query } from "./_generated/server";
import { v } from "convex/values";

// ─────────────────────────────────────────────────────────────
// GET SEO TASK STATS
// Aggregate counts by status for pipeline visualization
// ─────────────────────────────────────────────────────────────
export const getSeoTaskStats = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db
      .query("agent_tasks")
      .filter((q) => q.eq(q.field("domain"), "seo"))
      .collect();

    const stats = {
      total: tasks.length,
      pending: 0,
      in_progress: 0,
      completed: 0,
      blocked: 0,
      cancelled: 0,
    };

    for (const task of tasks) {
      stats[task.status as keyof typeof stats]++;
    }

    return stats;
  },
});

// ─────────────────────────────────────────────────────────────
// GET TASKS BY CLUSTER
// Group SEO tasks by content cluster
// ─────────────────────────────────────────────────────────────
export const getTasksByCluster = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db
      .query("agent_tasks")
      .filter((q) => q.eq(q.field("domain"), "seo"))
      .collect();

    const clusters: Record<string, {
      name: string;
      total: number;
      completed: number;
      pending: number;
      in_progress: number;
      totalVolume: number;
    }> = {};

    for (const task of tasks) {
      const payload = task.payload as { cluster?: string; volume?: number } | undefined;
      const cluster = payload?.cluster || "uncategorized";
      const volume = payload?.volume || 0;

      if (!clusters[cluster]) {
        clusters[cluster] = {
          name: cluster,
          total: 0,
          completed: 0,
          pending: 0,
          in_progress: 0,
          totalVolume: 0,
        };
      }

      clusters[cluster].total++;
      clusters[cluster].totalVolume += volume;

      if (task.status === "completed") {
        clusters[cluster].completed++;
      } else if (task.status === "pending") {
        clusters[cluster].pending++;
      } else if (task.status === "in_progress") {
        clusters[cluster].in_progress++;
      }
    }

    return Object.values(clusters).sort((a, b) => b.totalVolume - a.totalVolume);
  },
});

// ─────────────────────────────────────────────────────────────
// GET RECENT ACTIVITY
// Last N task changes for the activity feed
// ─────────────────────────────────────────────────────────────
export const getRecentActivity = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 10 }) => {
    const tasks = await ctx.db
      .query("agent_tasks")
      .filter((q) => q.eq(q.field("domain"), "seo"))
      .order("desc")
      .take(limit);

    return tasks.map((task) => ({
      id: task._id,
      taskId: task.taskId,
      title: task.title,
      status: task.status,
      updatedAt: task.updatedAt,
      completedAt: task.completedAt,
      payload: task.payload,
    }));
  },
});

// ─────────────────────────────────────────────────────────────
// GET ALL SEO TASKS (for detailed view)
// ─────────────────────────────────────────────────────────────
export const getAllSeoTasks = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, { status }) => {
    let q = ctx.db
      .query("agent_tasks")
      .filter((qb) => qb.eq(qb.field("domain"), "seo"));

    if (status) {
      q = q.filter((qb) => qb.eq(qb.field("status"), status));
    }

    return await q.order("desc").collect();
  },
});
