// ═══════════════════════════════════════════════════════════════
// MEASURE JUMP ACTION
// AI-powered jump measurement with xLENS verification
// Processes video + IMU data, computes gate scores
// ═══════════════════════════════════════════════════════════════

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";

// Physics constants
const GRAVITY_MS2 = 9.81; // m/s²

// ─────────────────────────────────────────────────────────────────
// MEASURE JUMP ACTION
// Main entry point - fetches files, runs AI, computes gates
// ─────────────────────────────────────────────────────────────────
export const measureJump = action({
  args: {
    jumpId: v.id("jumps"),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    heightInches?: number;
    flightTimeMs?: number;
    verificationTier?: string;
    error?: string;
  }> => {
    // Get the jump record
    const jump = await ctx.runQuery(api.jump.jumps.get, { jumpId: args.jumpId });

    if (!jump) {
      return { success: false, error: "Jump not found" };
    }

    if (jump.status !== "processing") {
      return { success: false, error: `Jump not in processing state (currently: ${jump.status})` };
    }

    try {
      // Fetch video and sensor data from storage
      const videoUrl = await ctx.storage.getUrl(jump.videoStorageId);
      const sensorUrl = await ctx.storage.getUrl(jump.sensorStorageId);

      if (!videoUrl || !sensorUrl) {
        await ctx.runMutation(api.jump.jumps.flag, {
          jumpId: args.jumpId,
          issues: ["Missing video or sensor data"],
        });
        return { success: false, error: "Missing video or sensor data" };
      }

      // TODO: Phase A - Use Claude Vision API for measurement
      // For now, use mock AI processing
      const aiResult = await mockAiMeasurement(videoUrl, sensorUrl);

      // Compute gate scores
      const gateScores = await computeGateScores(ctx, jump, aiResult);

      // Check if physics gate fails (the moat!)
      if (gateScores.physics < 0.5) {
        await ctx.runMutation(api.jump.jumps.flag, {
          jumpId: args.jumpId,
          issues: ["Physics verification failed - IMU data inconsistent with video"],
        });
        return {
          success: false,
          error: "Physics verification failed",
        };
      }

      // Determine verification tier
      const verificationTier = determineVerificationTier(gateScores);

      // Update jump with measurement
      await ctx.runMutation(api.jump.jumps.updateMeasurement, {
        jumpId: args.jumpId,
        heightInches: aiResult.heightInches,
        heightCm: aiResult.heightInches * 2.54,
        flightTimeMs: aiResult.flightTimeMs,
        confidence: aiResult.confidence,
        gateScores,
        aiAnalysis: aiResult.aiAnalysis,
        verificationTier,
      });

      // Increment user's daily jump count
      await ctx.runMutation(api.jump.jumpUsers.incrementDailyJumps, {
        userId: jump.userId,
      });

      // Update leaderboard if not a practice jump
      if (!jump.isPractice) {
        await ctx.runMutation(api.jump.leaderboards.updateEntry, {
          userId: jump.userId,
          jumpId: args.jumpId,
          heightInches: aiResult.heightInches,
          verificationTier,
        });
      }

      return {
        success: true,
        heightInches: aiResult.heightInches,
        flightTimeMs: aiResult.flightTimeMs,
        verificationTier,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      await ctx.runMutation(api.jump.jumps.flag, {
        jumpId: args.jumpId,
        issues: [`Processing error: ${errorMessage}`],
      });

      return { success: false, error: errorMessage };
    }
  },
});

// ─────────────────────────────────────────────────────────────────
// DETERMINE VERIFICATION TIER
// Phase A: All pass as "measured"
// Phase B+: Bronze/Silver/Gold based on gates
// ─────────────────────────────────────────────────────────────────
function determineVerificationTier(gateScores: {
  attestation: number;
  cryptoValid: boolean;
  liveness: number;
  physics: number;
}): "measured" | "bronze" | "silver" | "gold" {
  // Phase A: Everyone gets "measured" regardless of gates
  // The gates are still computed for data collection

  // Uncomment for Phase B/C enforcement:
  // if (
  //   gateScores.attestation >= 0.9 &&
  //   gateScores.cryptoValid &&
  //   gateScores.liveness >= 0.95 &&
  //   gateScores.physics >= 0.9
  // ) {
  //   return "gold";
  // }
  //
  // if (
  //   gateScores.attestation >= 0.7 &&
  //   gateScores.liveness >= 0.8 &&
  //   gateScores.physics >= 0.8
  // ) {
  //   return "silver";
  // }
  //
  // if (
  //   gateScores.attestation >= 0.5 &&
  //   gateScores.liveness >= 0.6 &&
  //   gateScores.physics >= 0.7
  // ) {
  //   return "bronze";
  // }

  return "measured";
}

// ─────────────────────────────────────────────────────────────────
// MOCK AI MEASUREMENT
// Placeholder for Claude Vision API integration
// Phase A: Returns reasonable mock values
// ─────────────────────────────────────────────────────────────────
async function mockAiMeasurement(
  videoUrl: string,
  sensorUrl: string
): Promise<{
  heightInches: number;
  flightTimeMs: number;
  confidence: number;
  aiAnalysis: {
    takeoffFrame: number;
    landingFrame: number;
    nonceDetected: boolean;
    chirpDetected?: boolean;
    imuCorrelation: number;
    confidence: "high" | "medium" | "low";
    issues?: string[];
  };
}> {
  // TODO: Replace with actual Claude Vision API call
  // For Phase A launch, this returns mock values

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Mock realistic jump heights (18-36 inches typical for youth)
  const heightInches = 18 + Math.random() * 18;

  // Calculate flight time from height using physics
  // h = gt²/8, so t = sqrt(8h/g)
  const heightMeters = heightInches * 0.0254;
  const flightTimeSeconds = Math.sqrt((8 * heightMeters) / GRAVITY_MS2);
  const flightTimeMs = flightTimeSeconds * 1000;

  const confidence = 0.85 + Math.random() * 0.1; // 85-95%
  const imuCorrelation = 0.7 + Math.random() * 0.25; // 70-95%

  return {
    heightInches: Math.round(heightInches * 10) / 10,
    flightTimeMs: Math.round(flightTimeMs),
    confidence,
    aiAnalysis: {
      takeoffFrame: 30,
      landingFrame: 60,
      nonceDetected: true,
      chirpDetected: undefined, // Phase C
      imuCorrelation,
      confidence: confidence > 0.9 ? "high" : confidence > 0.75 ? "medium" : "low",
      issues: undefined,
    },
  };
}

// ─────────────────────────────────────────────────────────────────
// COMPUTE GATE SCORES
// The 4-Gate verification system
// ─────────────────────────────────────────────────────────────────
async function computeGateScores(
  ctx: any,
  jump: any,
  aiResult: any
): Promise<{
  attestation: number;
  cryptoValid: boolean;
  liveness: number;
  physics: number;
}> {
  // Gate A: Attestation
  // Check if device key is registered and attestation-verified
  let attestationScore = 0.5; // Default: unverified device

  const keyId = jump.proofPayload.signature.keyId;
  if (keyId) {
    const deviceValidation = await ctx.runQuery(api.jump.deviceKeys.validateDevice, {
      keyId,
    });

    if (deviceValidation.valid) {
      if (deviceValidation.hardwareLevel === "strongbox") {
        attestationScore = 1.0; // Hardware-backed
      } else if (deviceValidation.hardwareLevel === "tee") {
        attestationScore = 0.8; // TEE-backed
      } else {
        attestationScore = 0.6; // Software-only
      }

      // Apply trust score degradation
      attestationScore *= deviceValidation.trustScore;
    }
  }

  // Gate B: Crypto
  // Verify device signature (Phase A: always true, signature check happens client-side)
  const cryptoValid = true; // TODO: Verify signature in Phase B

  // Gate C: Liveness
  // Check session nonce freshness
  let livenessScore = 0.5;

  const session = await ctx.runQuery(api.jump.sessions.get, {
    sessionId: jump.sessionId,
  });

  if (session) {
    // Check how quickly after session creation the jump was submitted
    const sessionAge = jump.proofPayload.capture.startedAtMs - session.createdAt;
    const maxSessionAge = 120000; // 120 seconds

    if (sessionAge < maxSessionAge && sessionAge > 0) {
      // Score based on freshness - faster is better
      livenessScore = Math.max(0.6, 1 - sessionAge / maxSessionAge);
    }

    // Verify nonce matches
    if (session.nonce === jump.proofPayload.nonce) {
      livenessScore = Math.min(1.0, livenessScore + 0.2);
    }

    // Bonus for detected nonce in video
    if (aiResult.aiAnalysis.nonceDetected) {
      livenessScore = Math.min(1.0, livenessScore + 0.1);
    }
  }

  // Gate D: Physics (THE MOAT)
  // Compare IMU data with video-derived physics
  const physicsScore = computePhysicsScore(jump.proofPayload, aiResult);

  return {
    attestation: attestationScore,
    cryptoValid,
    liveness: livenessScore,
    physics: physicsScore,
  };
}

// ─────────────────────────────────────────────────────────────────
// COMPUTE PHYSICS SCORE
// The unfakeable moat - correlates IMU with video
// AI can fake pixels, AI cannot fake synchronized G-forces
// ─────────────────────────────────────────────────────────────────
function computePhysicsScore(
  proofPayload: {
    capture: {
      startedAtMs: number;
      endedAtMs: number;
      fps: number;
    };
  },
  aiResult: {
    flightTimeMs: number;
    aiAnalysis: {
      imuCorrelation: number;
    };
  }
): number {
  let score = 0;

  // The IMU correlation from AI analysis is the primary signal
  // This would compare video-detected jump with IMU-detected jump
  const imuCorrelation = aiResult.aiAnalysis.imuCorrelation;
  score += imuCorrelation * 0.5; // 50% weight on IMU correlation

  // Check that flight time is physically plausible
  // Max human vertical jump is ~48 inches = ~1 second flight time
  // Min detectable is ~6 inches = ~175ms flight time
  if (aiResult.flightTimeMs > 150 && aiResult.flightTimeMs < 1100) {
    score += 0.25; // Physically plausible
  } else if (aiResult.flightTimeMs > 100 && aiResult.flightTimeMs < 1200) {
    score += 0.1; // Edge case but possible
  }

  // Check video timing consistency
  const videoDuration = proofPayload.capture.endedAtMs - proofPayload.capture.startedAtMs;
  const frameInterval = videoDuration / (proofPayload.capture.fps * (videoDuration / 1000));

  if (frameInterval > 25 && frameInterval < 50) {
    // 20-40 fps expected
    score += 0.25;
  } else if (frameInterval > 15 && frameInterval < 70) {
    score += 0.15;
  }

  // TODO: Phase B/C - Actual IMU acceleration analysis
  // - Detect takeoff spike (>1.5g)
  // - Detect freefall period (~0g)
  // - Detect landing spike (>2g)
  // - Correlate with video frame timestamps

  return Math.min(1.0, score);
}

// ─────────────────────────────────────────────────────────────────
// BATCH PROCESS PENDING JUMPS
// Scheduled job to process queue
// ─────────────────────────────────────────────────────────────────
export const processPendingJumps = action({
  args: {
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ processed: number; results: Array<{ jumpId: string }> }> => {
    const batchSize = args.batchSize ?? 10;

    const pendingJumps = await ctx.runQuery(api.jump.jumps.getPending, {
      limit: batchSize,
    });

    const results: Array<{ jumpId: string }> = [];

    for (const jump of pendingJumps) {
      const result = await ctx.runAction(api.jump.measureJump.measureJump, {
        jumpId: jump._id
      });
      results.push({ jumpId: jump._id, ...(result as object) });
    }

    return {
      processed: results.length,
      results,
    };
  },
});
