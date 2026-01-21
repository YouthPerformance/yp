// ═══════════════════════════════════════════════════════════════
// JUMPS
// Jump submissions with xLENS verification
// Core CRUD + proof validation
// ═══════════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Proof payload validator matching schema
const proofPayloadValidator = v.object({
  sessionId: v.string(),
  nonce: v.string(),
  capture: v.object({
    testType: v.literal("VERT_JUMP"),
    startedAtMs: v.number(),
    endedAtMs: v.number(),
    fps: v.number(),
    device: v.object({
      platform: v.union(v.literal("ios"), v.literal("android")),
      model: v.string(),
      osVersion: v.string(),
      appVersion: v.string(),
    }),
  }),
  hashes: v.object({
    videoSha256: v.string(),
    sensorSha256: v.string(),
    metadataSha256: v.string(),
  }),
  signature: v.object({
    alg: v.literal("ES256"),
    keyId: v.string(),
    sig: v.string(),
  }),
  gps: v.optional(
    v.object({
      lat: v.number(),
      lng: v.number(),
      accuracyM: v.number(),
      capturedAtMs: v.number(),
    })
  ),
});

// ─────────────────────────────────────────────────────────────────
// SUBMIT JUMP
// Called after video/sensor capture, creates pending jump record
// ─────────────────────────────────────────────────────────────────
export const submit = mutation({
  args: {
    userId: v.id("jumpUsers"),
    sessionId: v.id("sessions"),
    videoStorageId: v.id("_storage"),
    sensorStorageId: v.id("_storage"),
    proofPayload: proofPayloadValidator,
    isPractice: v.optional(v.boolean()),
    gps: v.optional(
      v.object({
        city: v.string(),
        state: v.optional(v.string()),
        country: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate session
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    if (session.used) {
      throw new Error("Session already used");
    }

    if (Date.now() > session.expiresAt) {
      throw new Error("Session expired");
    }

    if (session.nonce !== args.proofPayload.nonce) {
      throw new Error("Nonce mismatch");
    }

    // Mark session as used
    await ctx.db.patch(args.sessionId, { used: true });

    // Create jump record in uploading state
    const jumpId = await ctx.db.insert("jumps", {
      userId: args.userId,
      sessionId: args.sessionId,
      status: "uploading",
      heightInches: undefined,
      heightCm: undefined,
      flightTimeMs: undefined,
      confidence: undefined,
      verificationTier: "measured", // Default for Phase A
      vpcId: undefined,
      videoStorageId: args.videoStorageId,
      sensorStorageId: args.sensorStorageId,
      proofPayload: args.proofPayload,
      gateScores: undefined,
      aiAnalysis: undefined,
      isPractice: args.isPractice ?? false,
      gpsCity: args.gps?.city,
      gpsState: args.gps?.state,
      gpsCountry: args.gps?.country,
      createdAt: now,
      processedAt: undefined,
    });

    return { jumpId, status: "uploading" };
  },
});

// ─────────────────────────────────────────────────────────────────
// MARK UPLOADED
// Called when video/sensor upload completes
// ─────────────────────────────────────────────────────────────────
export const markUploaded = mutation({
  args: {
    jumpId: v.id("jumps"),
  },
  handler: async (ctx, args) => {
    const jump = await ctx.db.get(args.jumpId);

    if (!jump) {
      throw new Error("Jump not found");
    }

    if (jump.status !== "uploading") {
      throw new Error("Jump is not in uploading state");
    }

    await ctx.db.patch(args.jumpId, {
      status: "processing",
    });

    return { success: true };
  },
});

// ─────────────────────────────────────────────────────────────────
// UPDATE MEASUREMENT
// Called by measureJump action after AI processing
// ─────────────────────────────────────────────────────────────────
export const updateMeasurement = mutation({
  args: {
    jumpId: v.id("jumps"),
    heightInches: v.number(),
    heightCm: v.number(),
    flightTimeMs: v.number(),
    confidence: v.number(),
    gateScores: v.object({
      attestation: v.number(),
      cryptoValid: v.boolean(),
      liveness: v.number(),
      physics: v.number(),
    }),
    aiAnalysis: v.object({
      takeoffFrame: v.number(),
      landingFrame: v.number(),
      nonceDetected: v.boolean(),
      chirpDetected: v.optional(v.boolean()),
      imuCorrelation: v.number(),
      confidence: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
      issues: v.optional(v.array(v.string())),
    }),
    verificationTier: v.union(
      v.literal("measured"),
      v.literal("bronze"),
      v.literal("silver"),
      v.literal("gold")
    ),
  },
  handler: async (ctx, args) => {
    const jump = await ctx.db.get(args.jumpId);

    if (!jump) {
      throw new Error("Jump not found");
    }

    await ctx.db.patch(args.jumpId, {
      status: "complete",
      heightInches: args.heightInches,
      heightCm: args.heightCm,
      flightTimeMs: args.flightTimeMs,
      confidence: args.confidence,
      gateScores: args.gateScores,
      aiAnalysis: args.aiAnalysis,
      verificationTier: args.verificationTier,
      processedAt: Date.now(),
    });

    return { success: true };
  },
});

// ─────────────────────────────────────────────────────────────────
// FLAG JUMP
// Mark a jump for review
// ─────────────────────────────────────────────────────────────────
export const flag = mutation({
  args: {
    jumpId: v.id("jumps"),
    issues: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const jump = await ctx.db.get(args.jumpId);

    if (!jump) {
      throw new Error("Jump not found");
    }

    await ctx.db.patch(args.jumpId, {
      status: "flagged",
      verificationTier: "rejected",
      aiAnalysis: jump.aiAnalysis
        ? { ...jump.aiAnalysis, issues: args.issues }
        : undefined,
    });

    return { success: true };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET JUMP
// ─────────────────────────────────────────────────────────────────
export const get = query({
  args: {
    jumpId: v.id("jumps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jumpId);
  },
});

// ─────────────────────────────────────────────────────────────────
// LIST USER JUMPS
// Get all jumps for a user, most recent first
// ─────────────────────────────────────────────────────────────────
export const listForUser = query({
  args: {
    userId: v.id("jumpUsers"),
    limit: v.optional(v.number()),
    excludePractice: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let jumps = await ctx.db
      .query("jumps")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit * 2);

    if (args.excludePractice) {
      jumps = jumps.filter((j) => !j.isPractice);
    }

    return jumps.slice(0, limit);
  },
});

// ─────────────────────────────────────────────────────────────────
// GET USER'S BEST JUMP
// Returns the highest verified jump for a user
// ─────────────────────────────────────────────────────────────────
export const getBestForUser = query({
  args: {
    userId: v.id("jumpUsers"),
    minTier: v.optional(
      v.union(
        v.literal("measured"),
        v.literal("bronze"),
        v.literal("silver"),
        v.literal("gold")
      )
    ),
  },
  handler: async (ctx, args) => {
    const jumps = await ctx.db
      .query("jumps")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "complete"),
          q.eq(q.field("isPractice"), false),
          q.neq(q.field("heightInches"), undefined)
        )
      )
      .collect();

    // Filter by minimum tier if specified
    const tierOrder = ["measured", "bronze", "silver", "gold"];
    const minTierIndex = args.minTier ? tierOrder.indexOf(args.minTier) : 0;

    const qualifiedJumps = jumps.filter((j) => {
      const tierIndex = tierOrder.indexOf(j.verificationTier);
      return tierIndex >= minTierIndex;
    });

    if (qualifiedJumps.length === 0) return null;

    // Find highest jump
    return qualifiedJumps.reduce((best, current) =>
      (current.heightInches ?? 0) > (best.heightInches ?? 0) ? current : best
    );
  },
});

// ─────────────────────────────────────────────────────────────────
// GET RECENT JUMPS
// For activity feed / recent activity display
// ─────────────────────────────────────────────────────────────────
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const jumps = await ctx.db
      .query("jumps")
      .withIndex("by_status", (q) => q.eq("status", "complete"))
      .filter((q) => q.eq(q.field("isPractice"), false))
      .order("desc")
      .take(limit);

    // Fetch user info for each jump
    const jumpsWithUsers = await Promise.all(
      jumps.map(async (jump) => {
        const user = await ctx.db.get(jump.userId);
        return {
          ...jump,
          user: user
            ? {
                displayName: user.displayName,
                city: user.city,
                country: user.country,
              }
            : null,
        };
      })
    );

    return jumpsWithUsers;
  },
});

// ─────────────────────────────────────────────────────────────────
// GET PENDING JUMPS
// For processing queue
// ─────────────────────────────────────────────────────────────────
export const getPending = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    return await ctx.db
      .query("jumps")
      .withIndex("by_status", (q) => q.eq("status", "processing"))
      .order("asc") // FIFO
      .take(limit);
  },
});

// ─────────────────────────────────────────────────────────────────
// LINK VPC
// Associate a Verified Performance Certificate with a jump
// ─────────────────────────────────────────────────────────────────
export const linkVpc = mutation({
  args: {
    jumpId: v.id("jumps"),
    vpcId: v.id("vpcs"),
  },
  handler: async (ctx, args) => {
    const jump = await ctx.db.get(args.jumpId);

    if (!jump) {
      throw new Error("Jump not found");
    }

    await ctx.db.patch(args.jumpId, {
      vpcId: args.vpcId,
    });

    return { success: true };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET VIDEO URL
// Generate temporary URL for video playback
// ─────────────────────────────────────────────────────────────────
export const getVideoUrl = query({
  args: {
    jumpId: v.id("jumps"),
  },
  handler: async (ctx, args) => {
    const jump = await ctx.db.get(args.jumpId);

    if (!jump) {
      throw new Error("Jump not found");
    }

    const url = await ctx.storage.getUrl(jump.videoStorageId);
    return { url };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET SENSOR DATA URL
// Generate temporary URL for IMU data download
// ─────────────────────────────────────────────────────────────────
export const getSensorUrl = query({
  args: {
    jumpId: v.id("jumps"),
  },
  handler: async (ctx, args) => {
    const jump = await ctx.db.get(args.jumpId);

    if (!jump) {
      throw new Error("Jump not found");
    }

    const url = await ctx.storage.getUrl(jump.sensorStorageId);
    return { url };
  },
});
