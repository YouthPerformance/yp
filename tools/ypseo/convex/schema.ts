// ═══════════════════════════════════════════════════════════════
// YPSEO - AGENT FILE SYSTEM SCHEMA
// Cross-session task coordination for SEO content generation
// Deployment: wandering-wren-102 (longevitymike/ypseo)
// ═══════════════════════════════════════════════════════════════

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─────────────────────────────────────────────────────────────────
  // AGENT TASKS TABLE
  // Persistent task queue readable/writable by any agent session
  // ─────────────────────────────────────────────────────────────────
  agent_tasks: defineTable({
    // Identity
    taskId: v.string(), // Unique identifier (nanoid)
    title: v.string(), // Short task name
    description: v.optional(v.string()), // Detailed description

    // Categorization
    domain: v.string(), // "seo", "content", "dev", "ops"
    project: v.optional(v.string()), // "gap-miner", "wolfgrow", etc.

    // Status workflow
    status: v.union(
      v.literal("pending"), // Not started
      v.literal("in_progress"), // Agent working on it
      v.literal("blocked"), // Waiting on something
      v.literal("completed"), // Done
      v.literal("cancelled") // Abandoned
    ),

    // Priority (lower = higher priority)
    priority: v.number(), // 1=critical, 2=high, 3=normal, 4=low

    // Ownership
    createdBy: v.string(), // Agent session ID or "human"
    assignedTo: v.optional(v.string()), // Agent session ID currently working
    completedBy: v.optional(v.string()),

    // Dependencies
    blockedBy: v.optional(v.array(v.string())), // Task IDs that must complete first
    blocks: v.optional(v.array(v.string())), // Task IDs that depend on this

    // Context/payload (flexible JSON for task-specific data)
    payload: v.optional(v.any()), // e.g., { keyword: "...", cluster: "..." }

    // Progress tracking
    progressPercent: v.optional(v.number()), // 0-100
    progressNotes: v.optional(v.string()),

    // Results (populated on completion)
    result: v.optional(v.any()), // Task-specific output data
    errorMessage: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),

    // TTL for auto-cleanup (optional)
    expiresAt: v.optional(v.number()),
  })
    .index("by_task_id", ["taskId"])
    .index("by_status", ["status"])
    .index("by_domain", ["domain", "status"])
    .index("by_project", ["project", "status"])
    .index("by_priority", ["status", "priority"])
    .index("by_assigned", ["assignedTo"]),

  // ─────────────────────────────────────────────────────────────────
  // AGENT LOGS TABLE
  // Audit trail of agent actions for debugging and learning
  // ─────────────────────────────────────────────────────────────────
  agent_logs: defineTable({
    // Task reference (optional - some logs are task-independent)
    taskId: v.optional(v.string()),

    // Log metadata
    agentId: v.string(), // Session identifier
    action: v.string(), // "task_claimed", "task_completed", "error", etc.
    domain: v.string(), // "seo", "content", etc.

    // Content
    message: v.string(),
    data: v.optional(v.any()), // Structured payload

    // Severity
    level: v.union(
      v.literal("debug"),
      v.literal("info"),
      v.literal("warn"),
      v.literal("error")
    ),

    // Timestamp
    createdAt: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_agent", ["agentId"])
    .index("by_domain", ["domain", "createdAt"])
    .index("by_level", ["level", "createdAt"]),

  // ─────────────────────────────────────────────────────────────────
  // SEO GAPS TABLE
  // Content gap opportunities from keyword research
  // ─────────────────────────────────────────────────────────────────
  seo_gaps: defineTable({
    // Identity
    keyword: v.string(),
    slug: v.optional(v.string()), // URL-safe slug if page exists

    // Source tracking
    source: v.string(), // "ahrefs", "paa", "manual", "answer-engine"
    discoveredAt: v.number(),

    // Metrics
    volume: v.optional(v.number()), // Monthly search volume
    difficulty: v.optional(v.number()), // 0-100 difficulty score
    cpc: v.optional(v.number()), // Cost per click (commercial intent signal)

    // Categorization
    intent: v.union(
      v.literal("informational"),
      v.literal("commercial"),
      v.literal("transactional"),
      v.literal("navigational")
    ),
    cluster: v.string(), // "home-training", "barefoot", etc.
    sport: v.string(), // "basketball", "soccer", "general"
    ageGroup: v.optional(v.string()), // "7-9", "10-12", etc.

    // Content status
    status: v.union(
      v.literal("gap"), // No content exists
      v.literal("draft"), // Content in progress
      v.literal("published"), // Content live
      v.literal("rejected") // Won't create content
    ),

    // Related content
    contentId: v.optional(v.string()), // Reference to playbook_content or ae_drills
    pageUrl: v.optional(v.string()),

    // Scoring
    opportunityScore: v.optional(v.number()), // Computed: volume/difficulty
    priorityTier: v.optional(v.number()), // 1=high, 2=medium, 3=low

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_keyword", ["keyword"])
    .index("by_status", ["status"])
    .index("by_cluster", ["cluster", "status"])
    .index("by_sport", ["sport", "status"])
    .index("by_priority", ["priorityTier", "opportunityScore"]),

  // ─────────────────────────────────────────────────────────────────
  // GENERATED PAGES TABLE
  // Track all programmatically generated content
  // ─────────────────────────────────────────────────────────────────
  generated_pages: defineTable({
    // Identity
    slug: v.string(),
    title: v.string(),

    // Source
    gapId: v.optional(v.id("seo_gaps")),
    keyword: v.string(),

    // Content
    contentType: v.union(
      v.literal("drill"),
      v.literal("article"),
      v.literal("qa"),
      v.literal("pillar")
    ),
    author: v.string(), // "ADAM", "JAMES", "TEAM_YP"

    // Status
    status: v.union(
      v.literal("draft"),
      v.literal("review"),
      v.literal("approved"),
      v.literal("published"),
      v.literal("rejected")
    ),

    // Quality metrics
    qualityScore: v.optional(v.number()), // 0-100
    passedGuardrails: v.boolean(),
    rejectionReason: v.optional(v.string()),

    // Generation metadata
    generationModel: v.optional(v.string()),
    promptVersion: v.optional(v.string()),

    // File references
    outputPath: v.optional(v.string()), // Local file path
    publishedUrl: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_keyword", ["keyword"])
    .index("by_author", ["author", "status"]),
});
