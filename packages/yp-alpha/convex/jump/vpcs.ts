// ═══════════════════════════════════════════════════════════════
// VERIFIED PERFORMANCE CERTIFICATES (VPC)
// Portable, verifiable credentials for jump performances
// Phase B: Bronze/Silver | Phase C: Gold with C2PA wrapper
// ═══════════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Generate unique VPC ID
function generateVpcId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return `vpc_${btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, "")}`;
}

// Generate pseudonymous athlete ID
function generateAthleteId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return `ath_${btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, "")}`;
}

// ─────────────────────────────────────────────────────────────────
// ISSUE VPC
// Create a Verified Performance Certificate for a completed jump
// ─────────────────────────────────────────────────────────────────
export const issue = mutation({
  args: {
    jumpId: v.id("jumps"),
    phase: v.union(v.literal("A"), v.literal("B"), v.literal("C")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get the jump
    const jump = await ctx.db.get(args.jumpId);
    if (!jump) {
      throw new Error("Jump not found");
    }

    if (jump.status !== "complete") {
      throw new Error("Can only issue VPC for completed jumps");
    }

    if (!jump.heightInches || !jump.heightCm || !jump.flightTimeMs) {
      throw new Error("Jump missing measurement data");
    }

    // Check if VPC already exists
    const existingVpc = await ctx.db
      .query("vpcs")
      .withIndex("by_jump", (q) => q.eq("jumpId", args.jumpId))
      .first();

    if (existingVpc) {
      return { vpcId: existingVpc._id, vpcPublicId: existingVpc.vpcId, alreadyExists: true };
    }

    // Get user info
    const user = await ctx.db.get(jump.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Determine verification tier from gate scores
    let tier: "bronze" | "silver" | "gold" = "bronze";
    const gatesPassed: string[] = [];

    if (jump.gateScores) {
      if (jump.gateScores.attestation >= 0.5) gatesPassed.push("attestation");
      if (jump.gateScores.cryptoValid) gatesPassed.push("crypto");
      if (jump.gateScores.liveness >= 0.6) gatesPassed.push("liveness");
      if (jump.gateScores.physics >= 0.7) gatesPassed.push("physics");

      if (gatesPassed.length >= 4 && jump.gateScores.attestation >= 0.9) {
        tier = "gold";
      } else if (gatesPassed.length >= 3) {
        tier = "silver";
      }
    }

    const vpcId = generateVpcId();
    const athleteId = generateAthleteId();
    const issuedAtUtc = new Date(now).toISOString();

    // TODO: Generate real YP CA signature in Phase B
    const ypCaSignature = `sig_mock_${Date.now().toString(36)}`;

    // Create VPC
    const vpcDocId = await ctx.db.insert("vpcs", {
      vpcId,
      athleteId,
      userId: jump.userId,
      jumpId: args.jumpId,
      testType: "VERT_JUMP",
      result: {
        heightInches: jump.heightInches,
        heightCm: jump.heightCm,
        flightTimeMs: jump.flightTimeMs,
      },
      verification: {
        tier,
        confidence: jump.confidence ?? 0,
        gatesPassed,
        phase: args.phase,
      },
      proofs: {
        videoHash: jump.proofPayload.hashes.videoSha256,
        sensorHash: jump.proofPayload.hashes.sensorSha256,
        sessionNonce: jump.proofPayload.nonce,
      },
      capture: {
        deviceModel: jump.proofPayload.capture.device.model,
        appVersion: jump.proofPayload.capture.device.appVersion,
        capturedAtUtc: new Date(jump.proofPayload.capture.startedAtMs).toISOString(),
        fps: jump.proofPayload.capture.fps,
      },
      issuedAtUtc,
      expiresAtUtc: undefined, // VPCs don't expire
      ypCaSignature,
      createdAt: now,
    });

    // Link VPC to jump
    await ctx.db.patch(args.jumpId, {
      vpcId: vpcDocId,
    });

    return { vpcId: vpcDocId, vpcPublicId: vpcId, alreadyExists: false };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET VPC
// ─────────────────────────────────────────────────────────────────
export const get = query({
  args: {
    vpcId: v.id("vpcs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.vpcId);
  },
});

// ─────────────────────────────────────────────────────────────────
// GET VPC BY PUBLIC ID
// ─────────────────────────────────────────────────────────────────
export const getByPublicId = query({
  args: {
    vpcId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vpcs")
      .withIndex("by_vpc_id", (q) => q.eq("vpcId", args.vpcId))
      .first();
  },
});

// ─────────────────────────────────────────────────────────────────
// GET VPC BY JUMP
// ─────────────────────────────────────────────────────────────────
export const getByJump = query({
  args: {
    jumpId: v.id("jumps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vpcs")
      .withIndex("by_jump", (q) => q.eq("jumpId", args.jumpId))
      .first();
  },
});

// ─────────────────────────────────────────────────────────────────
// LIST USER'S VPCS
// All certificates issued to a user
// ─────────────────────────────────────────────────────────────────
export const listForUser = query({
  args: {
    userId: v.id("jumpUsers"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    return await ctx.db
      .query("vpcs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});

// ─────────────────────────────────────────────────────────────────
// VERIFY VPC (PUBLIC)
// Verify a certificate by its public ID
// ─────────────────────────────────────────────────────────────────
export const verify = query({
  args: {
    vpcId: v.string(),
  },
  handler: async (ctx, args) => {
    const vpc = await ctx.db
      .query("vpcs")
      .withIndex("by_vpc_id", (q) => q.eq("vpcId", args.vpcId))
      .first();

    if (!vpc) {
      return { valid: false, reason: "Certificate not found" };
    }

    // Return public verification data (no internal IDs)
    return {
      valid: true,
      vpc: {
        vpcId: vpc.vpcId,
        athleteId: vpc.athleteId,
        testType: vpc.testType,
        result: vpc.result,
        verification: vpc.verification,
        capture: vpc.capture,
        issuedAtUtc: vpc.issuedAtUtc,
        proofs: {
          videoHash: vpc.proofs.videoHash,
          sensorHash: vpc.proofs.sensorHash,
        },
      },
    };
  },
});

// ─────────────────────────────────────────────────────────────────
// EXPORT VPC AS JSON
// Portable credential format
// ─────────────────────────────────────────────────────────────────
export const exportJson = query({
  args: {
    vpcId: v.id("vpcs"),
  },
  handler: async (ctx, args) => {
    const vpc = await ctx.db.get(args.vpcId);

    if (!vpc) {
      throw new Error("VPC not found");
    }

    // Build portable JSON credential
    const credential = {
      "@context": ["https://youthperformance.com/vpc/v1"],
      type: "VerifiedPerformanceCertificate",
      version: "1.0.0",
      issuer: {
        id: "yp-jump-ca-v1",
        name: "YouthPerformance",
        domain: "youthperformance.com",
      },
      id: vpc.vpcId,
      athleteId: vpc.athleteId,
      issuedAt: vpc.issuedAtUtc,
      expiresAt: vpc.expiresAtUtc,
      test: {
        type: vpc.testType,
      },
      result: {
        heightInches: vpc.result.heightInches,
        heightCm: vpc.result.heightCm,
        flightTimeMs: vpc.result.flightTimeMs,
        unit: "inches",
        unitSI: "cm",
      },
      verification: {
        tier: vpc.verification.tier,
        confidence: vpc.verification.confidence,
        gatesPassed: vpc.verification.gatesPassed,
        phase: vpc.verification.phase,
      },
      capture: {
        deviceModel: vpc.capture.deviceModel,
        appVersion: vpc.capture.appVersion,
        capturedAt: vpc.capture.capturedAtUtc,
        fps: vpc.capture.fps,
      },
      proofs: {
        videoHash: vpc.proofs.videoHash,
        sensorHash: vpc.proofs.sensorHash,
        sessionNonce: vpc.proofs.sessionNonce,
      },
      signature: vpc.ypCaSignature,
      verifyUrl: `https://youthperformance.com/verify/${vpc.vpcId}`,
    };

    return { credential };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET VPC BY ATHLETE ID
// Find all VPCs for a pseudonymous athlete
// ─────────────────────────────────────────────────────────────────
export const getByAthleteId = query({
  args: {
    athleteId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vpcs")
      .withIndex("by_athlete_id", (q) => q.eq("athleteId", args.athleteId))
      .collect();
  },
});
