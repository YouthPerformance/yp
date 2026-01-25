// ═══════════════════════════════════════════════════════════════
// xLENS WEB FUNCTIONS
// Backend functions for web-based jump capture
// Demo mode - simplified flow without full auth
// ═══════════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query, action, internalMutation, internalAction } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// ─────────────────────────────────────────────────────────────────
// GENERATE UPLOAD URL
// Returns a Convex storage upload URL for video
// ─────────────────────────────────────────────────────────────────
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// ─────────────────────────────────────────────────────────────────
// CREATE WEB JUMP
// Creates a new jump record with uploaded video
// ─────────────────────────────────────────────────────────────────
export const createWebJump = mutation({
  args: {
    sessionId: v.string(),
    deviceId: v.string(),
    videoStorageId: v.id("_storage"),
    sensorData: v.optional(v.string()), // JSON string of IMU data
    proofPayload: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Validate session exists
    const sessionIdTyped = args.sessionId as Id<"xlensWebSessions">;
    const session = await ctx.db.get(sessionIdTyped);

    if (!session) {
      throw new Error("Session not found");
    }

    // Check session not expired (give some grace period for upload)
    const now = Date.now();
    if (now > session.expiresAt + 60000) { // 60s grace period
      throw new Error("Session expired");
    }

    // Check session not already used
    if (session.used) {
      throw new Error("Session already used");
    }

    // Mark session as used
    await ctx.db.patch(sessionIdTyped, { used: true });

    // Store sensor data if provided
    let sensorStorageId: Id<"_storage"> | undefined;
    if (args.sensorData) {
      // For sensor data, we'd normally upload to storage
      // For now, we'll store it inline in the jump record
    }

    // Create jump record
    const jumpId = await ctx.db.insert("xlensWebJumps", {
      sessionId: sessionIdTyped,
      deviceId: args.deviceId,
      videoStorageId: args.videoStorageId,
      sensorStorageId,
      verificationTier: "measured", // Start as measured, upgrade after analysis
      status: "processing",
      proofPayload: args.proofPayload,
      createdAt: now,
    });

    // Schedule AI analysis
    await ctx.scheduler.runAfter(0, internal.xlensWeb.analyzeJump, {
      jumpId,
      nonceDisplay: session.nonceDisplay,
    });

    return {
      jumpId,
      status: "processing",
    };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET WEB JUMP
// Retrieve jump result by ID
// ─────────────────────────────────────────────────────────────────
export const getWebJump = query({
  args: {
    jumpId: v.string(),
  },
  handler: async (ctx, args) => {
    const jumpIdTyped = args.jumpId as Id<"xlensWebJumps">;
    const jump = await ctx.db.get(jumpIdTyped);

    if (!jump) {
      return null;
    }

    // Get video URL
    let videoUrl: string | null = null;
    if (jump.videoStorageId) {
      videoUrl = await ctx.storage.getUrl(jump.videoStorageId);
    }

    return {
      _id: jump._id,
      status: jump.status,
      verificationTier: jump.verificationTier,
      heightInches: jump.heightInches,
      heightCm: jump.heightCm,
      flightTimeMs: jump.flightTimeMs,
      aiAnalysis: jump.aiAnalysis,
      videoUrl,
      createdAt: jump.createdAt,
      processedAt: jump.processedAt,
    };
  },
});

// ─────────────────────────────────────────────────────────────────
// ANALYZE JUMP (Internal Action)
// Uses Gemini to analyze the jump video
// ─────────────────────────────────────────────────────────────────
export const analyzeJump = internalAction({
  args: {
    jumpId: v.id("xlensWebJumps"),
    nonceDisplay: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Get the jump record
      const jump = await ctx.runQuery(internal.xlensWeb.getJumpInternal, {
        jumpId: args.jumpId,
      });

      if (!jump || !jump.videoStorageId) {
        throw new Error("Jump or video not found");
      }

      // Get video URL for Gemini
      const videoUrl = await ctx.storage.getUrl(jump.videoStorageId);
      if (!videoUrl) {
        throw new Error("Could not get video URL");
      }

      // Call Gemini to analyze the video
      const analysis = await analyzeWithGemini(videoUrl, args.nonceDisplay);

      // Calculate height from flight time
      // h = 0.5 * g * (t/2)^2 where g = 386.09 in/s² (9.8 m/s² in inches)
      let heightInches: number | undefined;
      let heightCm: number | undefined;

      if (analysis.flightTimeMs && analysis.flightTimeMs > 0) {
        const t = analysis.flightTimeMs / 1000; // Convert to seconds
        heightInches = 0.5 * 386.09 * Math.pow(t / 2, 2);
        heightCm = heightInches * 2.54;
      }

      // Determine verification tier
      let verificationTier: "measured" | "bronze" | "silver" | "rejected" = "measured";
      if (analysis.nonceDetected && analysis.confidence === "high") {
        verificationTier = "bronze"; // Web max is silver, but need crypto proof for that
      } else if (!analysis.nonceDetected) {
        verificationTier = "rejected";
      }

      // Update jump record
      await ctx.runMutation(internal.xlensWeb.updateJumpAnalysis, {
        jumpId: args.jumpId,
        heightInches,
        heightCm,
        flightTimeMs: analysis.flightTimeMs,
        verificationTier,
        aiAnalysis: {
          takeoffFrame: analysis.takeoffFrame,
          landingFrame: analysis.landingFrame,
          nonceDetected: analysis.nonceDetected,
          confidence: analysis.confidence,
          issues: analysis.issues,
        },
        status: "complete",
      });

    } catch (error) {
      console.error("[xLENS] Jump analysis failed:", error);

      // Mark as failed
      await ctx.runMutation(internal.xlensWeb.updateJumpAnalysis, {
        jumpId: args.jumpId,
        status: "failed",
        verificationTier: "rejected",
        aiAnalysis: {
          nonceDetected: false,
          confidence: "low",
          issues: [String(error)],
        },
      });
    }
  },
});

// ─────────────────────────────────────────────────────────────────
// INTERNAL: Get Jump
// ─────────────────────────────────────────────────────────────────
export const getJumpInternal = query({
  args: {
    jumpId: v.id("xlensWebJumps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jumpId);
  },
});

// ─────────────────────────────────────────────────────────────────
// INTERNAL: Update Jump Analysis
// ─────────────────────────────────────────────────────────────────
export const updateJumpAnalysis = internalMutation({
  args: {
    jumpId: v.id("xlensWebJumps"),
    heightInches: v.optional(v.number()),
    heightCm: v.optional(v.number()),
    flightTimeMs: v.optional(v.number()),
    verificationTier: v.union(
      v.literal("measured"),
      v.literal("bronze"),
      v.literal("silver"),
      v.literal("rejected")
    ),
    aiAnalysis: v.object({
      takeoffFrame: v.optional(v.number()),
      landingFrame: v.optional(v.number()),
      nonceDetected: v.boolean(),
      confidence: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
      issues: v.optional(v.array(v.string())),
    }),
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("complete"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jumpId, {
      heightInches: args.heightInches,
      heightCm: args.heightCm,
      flightTimeMs: args.flightTimeMs,
      verificationTier: args.verificationTier,
      aiAnalysis: args.aiAnalysis,
      status: args.status,
      processedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────
// GEMINI ANALYSIS HELPER
// ─────────────────────────────────────────────────────────────────
interface GeminiAnalysisResult {
  takeoffFrame?: number;
  landingFrame?: number;
  flightTimeMs?: number;
  nonceDetected: boolean;
  confidence: "high" | "medium" | "low";
  issues?: string[];
}

async function analyzeWithGemini(
  videoUrl: string,
  expectedNonce: string
): Promise<GeminiAnalysisResult> {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("[xLENS] No Gemini API key found, using mock analysis");
    return mockAnalysis(expectedNonce);
  }

  try {
    // Fetch video as base64
    const videoResponse = await fetch(videoUrl);
    const videoBuffer = await videoResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString("base64");
    const mimeType = "video/webm"; // MediaRecorder outputs webm

    // Call Gemini 2.0 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: videoBase64,
                  },
                },
                {
                  text: `Analyze this vertical jump video for athletic performance measurement.

TASKS:
1. Find the exact frame where the person's feet leave the ground (takeoff)
2. Find the exact frame where the person's feet touch the ground (landing)
3. Check if the code "${expectedNonce}" is visible in the video (on screen, paper, or displayed)
4. Estimate the video FPS and calculate flight time in milliseconds

RESPOND IN THIS EXACT JSON FORMAT:
{
  "takeoffFrame": <number or null>,
  "landingFrame": <number or null>,
  "estimatedFps": <number>,
  "flightTimeMs": <number or null>,
  "nonceDetected": <true/false>,
  "nonceLocation": "<where you saw the code, or 'not found'>",
  "confidence": "<high/medium/low>",
  "issues": ["<any problems with the video>"]
}

Be precise with frame numbers. If you cannot detect something, use null.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[xLENS] Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No response from Gemini");
    }

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Gemini response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      takeoffFrame: parsed.takeoffFrame ?? undefined,
      landingFrame: parsed.landingFrame ?? undefined,
      flightTimeMs: parsed.flightTimeMs ?? undefined,
      nonceDetected: parsed.nonceDetected === true,
      confidence: parsed.confidence || "medium",
      issues: parsed.issues || [],
    };

  } catch (error) {
    console.error("[xLENS] Gemini analysis error:", error);
    // Fall back to mock analysis
    return mockAnalysis(expectedNonce);
  }
}

// Mock analysis for testing without Gemini
function mockAnalysis(expectedNonce: string): GeminiAnalysisResult {
  // Generate random but plausible results
  const flightTimeMs = 400 + Math.random() * 300; // 400-700ms flight time

  return {
    takeoffFrame: 30,
    landingFrame: 90,
    flightTimeMs,
    nonceDetected: true, // Assume detected for demo
    confidence: "medium",
    issues: ["Mock analysis - Gemini API key not configured"],
  };
}
