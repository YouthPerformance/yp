// ═══════════════════════════════════════════════════════════════
// DEVICE KEYS
// Hardware-attested device identity for xLENS Protocol
// Secure Enclave (iOS) / StrongBox (Android) backed
// ═══════════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Generate a unique key ID
function generateKeyId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return `dk_${btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, "")}`;
}

// ─────────────────────────────────────────────────────────────────
// REGISTER DEVICE KEY
// Called after App Attest / Play Integrity verification
// ─────────────────────────────────────────────────────────────────
export const register = mutation({
  args: {
    userId: v.id("jumpUsers"),
    publicKey: v.string(), // Base64-encoded P-256 public key
    platform: v.union(v.literal("ios"), v.literal("android")),
    deviceModel: v.string(),
    osVersion: v.string(),
    hardwareLevel: v.union(
      v.literal("strongbox"),
      v.literal("tee"),
      v.literal("software")
    ),
    attestationData: v.optional(v.any()), // App Attest / Play Integrity chain
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const keyId = generateKeyId();

    // Check if this public key is already registered
    const existing = await ctx.db
      .query("deviceKeys")
      .filter((q) => q.eq(q.field("publicKey"), args.publicKey))
      .first();

    if (existing) {
      // Device already registered - update last used
      await ctx.db.patch(existing._id, {
        lastUsedAt: now,
      });
      return { deviceKeyId: existing._id, keyId: existing.keyId, isNew: false };
    }

    // Create new device key record
    const deviceKeyId = await ctx.db.insert("deviceKeys", {
      userId: args.userId,
      keyId,
      publicKey: args.publicKey,
      platform: args.platform,
      deviceModel: args.deviceModel,
      osVersion: args.osVersion,
      attestationData: args.attestationData,
      trustScore: 1.0, // Starts at max trust
      hardwareLevel: args.hardwareLevel,
      createdAt: now,
      lastUsedAt: now,
      revokedAt: undefined,
      revocationReason: undefined,
    });

    return { deviceKeyId, keyId, isNew: true };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET BY ID
// ─────────────────────────────────────────────────────────────────
export const get = query({
  args: {
    deviceKeyId: v.id("deviceKeys"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.deviceKeyId);
  },
});

// ─────────────────────────────────────────────────────────────────
// GET BY KEY ID
// ─────────────────────────────────────────────────────────────────
export const getByKeyId = query({
  args: {
    keyId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deviceKeys")
      .withIndex("by_key_id", (q) => q.eq("keyId", args.keyId))
      .first();
  },
});

// ─────────────────────────────────────────────────────────────────
// GET USER'S DEVICES
// List all devices registered to a user
// ─────────────────────────────────────────────────────────────────
export const listForUser = query({
  args: {
    userId: v.id("jumpUsers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deviceKeys")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("revokedAt"), undefined))
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────
// REVOKE DEVICE KEY
// Mark a device as revoked (lost/stolen/compromised)
// ─────────────────────────────────────────────────────────────────
export const revoke = mutation({
  args: {
    deviceKeyId: v.id("deviceKeys"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const deviceKey = await ctx.db.get(args.deviceKeyId);

    if (!deviceKey) {
      throw new Error("Device key not found");
    }

    if (deviceKey.revokedAt) {
      throw new Error("Device key already revoked");
    }

    await ctx.db.patch(args.deviceKeyId, {
      revokedAt: Date.now(),
      revocationReason: args.reason,
      trustScore: 0, // Zero trust after revocation
    });

    return { success: true };
  },
});

// ─────────────────────────────────────────────────────────────────
// UPDATE LAST USED
// Called on each jump submission
// ─────────────────────────────────────────────────────────────────
export const updateLastUsed = mutation({
  args: {
    deviceKeyId: v.id("deviceKeys"),
  },
  handler: async (ctx, args) => {
    const deviceKey = await ctx.db.get(args.deviceKeyId);

    if (!deviceKey) {
      throw new Error("Device key not found");
    }

    await ctx.db.patch(args.deviceKeyId, {
      lastUsedAt: Date.now(),
    });

    return { success: true };
  },
});

// ─────────────────────────────────────────────────────────────────
// DEGRADE TRUST
// Lower trust score if suspicious activity detected
// ─────────────────────────────────────────────────────────────────
export const degradeTrust = mutation({
  args: {
    deviceKeyId: v.id("deviceKeys"),
    newScore: v.number(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const deviceKey = await ctx.db.get(args.deviceKeyId);

    if (!deviceKey) {
      throw new Error("Device key not found");
    }

    // Trust can only go down, never up
    const newTrust = Math.min(deviceKey.trustScore, Math.max(0, args.newScore));

    await ctx.db.patch(args.deviceKeyId, {
      trustScore: newTrust,
    });

    return { success: true, newTrust };
  },
});

// ─────────────────────────────────────────────────────────────────
// VALIDATE DEVICE
// Check if a device is valid for signing
// ─────────────────────────────────────────────────────────────────
export const validateDevice = query({
  args: {
    keyId: v.string(),
  },
  handler: async (ctx, args) => {
    const deviceKey = await ctx.db
      .query("deviceKeys")
      .withIndex("by_key_id", (q) => q.eq("keyId", args.keyId))
      .first();

    if (!deviceKey) {
      return { valid: false, reason: "Device key not found" };
    }

    if (deviceKey.revokedAt) {
      return { valid: false, reason: "Device key has been revoked" };
    }

    if (deviceKey.trustScore < 0.5) {
      return { valid: false, reason: "Device trust too low" };
    }

    return {
      valid: true,
      deviceKeyId: deviceKey._id,
      publicKey: deviceKey.publicKey,
      platform: deviceKey.platform,
      hardwareLevel: deviceKey.hardwareLevel,
      trustScore: deviceKey.trustScore,
    };
  },
});
