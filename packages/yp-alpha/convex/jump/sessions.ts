// ═══════════════════════════════════════════════════════════════
// xLENS SESSIONS
// Server-issued nonces for challenge-response verification
// Prevents pre-recorded video attacks (anti-replay)
// ═══════════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Session expiry in milliseconds (120 seconds)
const SESSION_EXPIRY_MS = 120 * 1000;

// Generate a cryptographically random nonce
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

// Generate display-friendly nonce (6-8 alphanumeric chars)
function generateNonceDisplay(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I, O, 0, 1 for clarity
  let result = "";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 8; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────
// CREATE SESSION
// Called when user taps "New Jump" (ideally pre-fetched)
// Returns nonce for video overlay
// ─────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
    userId: v.id("jumpUsers"),
    deviceKeyId: v.optional(v.id("deviceKeys")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Generate nonces
    const nonce = generateNonce();
    const nonceDisplay = generateNonceDisplay();

    // Create session
    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      deviceKeyId: args.deviceKeyId,
      nonce,
      nonceDisplay,
      nonceChirpFreqs: undefined, // Phase C
      expiresAt: now + SESSION_EXPIRY_MS,
      used: false,
      createdAt: now,
    });

    return {
      sessionId,
      nonce,
      nonceDisplay,
      expiresAt: now + SESSION_EXPIRY_MS,
      expiresInMs: SESSION_EXPIRY_MS,
    };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET SESSION
// Retrieve session by ID (for validation)
// ─────────────────────────────────────────────────────────────────
export const get = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

// ─────────────────────────────────────────────────────────────────
// VALIDATE SESSION
// Check if session is valid for use
// Returns { valid, reason? }
// ─────────────────────────────────────────────────────────────────
export const validate = query({
  args: {
    sessionId: v.id("sessions"),
    nonce: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);

    if (!session) {
      return { valid: false, reason: "Session not found" };
    }

    if (session.used) {
      return { valid: false, reason: "Session already used" };
    }

    if (Date.now() > session.expiresAt) {
      return { valid: false, reason: "Session expired" };
    }

    if (session.nonce !== args.nonce) {
      return { valid: false, reason: "Nonce mismatch" };
    }

    return { valid: true };
  },
});

// ─────────────────────────────────────────────────────────────────
// MARK SESSION USED
// Called after successful jump submission
// ─────────────────────────────────────────────────────────────────
export const markUsed = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.used) {
      throw new Error("Session already used");
    }

    await ctx.db.patch(args.sessionId, { used: true });

    return { success: true };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET ACTIVE SESSION FOR USER
// Returns the most recent unused, unexpired session
// ─────────────────────────────────────────────────────────────────
export const getActiveForUser = query({
  args: {
    userId: v.id("jumpUsers"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(q.eq(q.field("used"), false), q.gt(q.field("expiresAt"), now))
      )
      .order("desc")
      .take(1);

    return sessions[0] || null;
  },
});

// ─────────────────────────────────────────────────────────────────
// CLEANUP EXPIRED SESSIONS
// Scheduled job to remove old sessions (run periodically)
// ─────────────────────────────────────────────────────────────────
export const cleanupExpired = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const cutoff = now - 24 * 60 * 60 * 1000; // 24 hours ago

    // Get expired sessions older than 24 hours
    const expiredSessions = await ctx.db
      .query("sessions")
      .withIndex("by_expires")
      .filter((q) => q.lt(q.field("expiresAt"), cutoff))
      .take(100);

    // Delete them
    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
    }

    return { deleted: expiredSessions.length };
  },
});
