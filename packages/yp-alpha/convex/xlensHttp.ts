// ═══════════════════════════════════════════════════════════════
// xLENS HTTP HELPERS
// Internal functions for HTTP API endpoints
// Demo mode - simplified sessions without full auth
// ═══════════════════════════════════════════════════════════════

import { v } from "convex/values";
import { internalMutation, internalQuery, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// ─────────────────────────────────────────────────────────────────
// CREATE DEMO SESSION
// Lightweight session for web demo (no jumpUser required)
// ─────────────────────────────────────────────────────────────────
export const createDemoSession = internalMutation({
  args: {
    nonce: v.string(),
    nonceDisplay: v.string(),
    expiresAt: v.number(),
    deviceId: v.string(),
  },
  handler: async (ctx, args) => {
    // For demo mode, we store sessions in a simplified format
    // Using the existing sessions table but with userId as optional
    const sessionId = await ctx.db.insert("xlensWebSessions", {
      nonce: args.nonce,
      nonceDisplay: args.nonceDisplay,
      expiresAt: args.expiresAt,
      deviceId: args.deviceId,
      used: false,
      createdAt: Date.now(),
    });

    return sessionId;
  },
});

// ─────────────────────────────────────────────────────────────────
// GET SESSION
// Retrieve session by ID
// ─────────────────────────────────────────────────────────────────
export const getSession = internalQuery({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Try to parse as Convex ID
    try {
      const session = await ctx.db.get(args.sessionId as any);
      return session;
    } catch {
      return null;
    }
  },
});

// ─────────────────────────────────────────────────────────────────
// MARK SESSION USED
// ─────────────────────────────────────────────────────────────────
export const markSessionUsed = internalMutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.patch(args.sessionId as any, { used: true });
    } catch {
      // Session might not exist
    }
  },
});

// ─────────────────────────────────────────────────────────────────
// CREATE WEB JUMP
// Create a jump record from web submission
// ─────────────────────────────────────────────────────────────────
export const createWebJump = internalMutation({
  args: {
    sessionId: v.string(),
    storageId: v.string(),
    deviceId: v.string(),
    durationMs: v.number(),
    fps: v.number(),
    nonce: v.string(),
    nonceDisplay: v.string(),
    userHeightInches: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Mark session as used
    await ctx.db.patch(args.sessionId as any, { used: true });

    // Create jump record
    const jumpId = await ctx.db.insert("xlensWebJumps", {
      sessionId: args.sessionId,
      storageId: args.storageId,
      deviceId: args.deviceId,
      durationMs: args.durationMs,
      fps: args.fps,
      nonce: args.nonce,
      nonceDisplay: args.nonceDisplay,
      userHeightInches: args.userHeightInches,
      status: "processing",
      verificationTier: args.userHeightInches ? "bronze" : "measured", // Calibrated starts at bronze
      createdAt: Date.now(),
    });

    return { jumpId, userHeightInches: args.userHeightInches };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET JUMP
// Retrieve jump by ID
// ─────────────────────────────────────────────────────────────────
export const getJump = internalQuery({
  args: {
    jumpId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const jump = await ctx.db.get(args.jumpId as any);
      return jump;
    } catch {
      return null;
    }
  },
});

// ─────────────────────────────────────────────────────────────────
// ANALYZE JUMP (AI Action)
// Uses Gemini to analyze video and calculate jump height
// Now supports user height calibration for improved accuracy
// ─────────────────────────────────────────────────────────────────
export const analyzeJump = internalAction({
  args: {
    jumpId: v.string(),
    storageId: v.string(),
    userHeightInches: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      // Get video URL from storage
      const videoUrl = await ctx.storage.getUrl(args.storageId);
      if (!videoUrl) {
        throw new Error("Video not found in storage");
      }

      // Get jump record
      const jump = await ctx.runQuery(internal.xlensHttp.getJump, { jumpId: args.jumpId });
      if (!jump) {
        throw new Error("Jump record not found");
      }

      // Check for Gemini API key
      const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

      let heightInches: number;
      let flags: string[] = [];
      let verificationTier = "bronze";
      let confidence = 0.5;

      if (apiKey) {
        // Use Gemini 3 Flash for video analysis with height calibration
        const geminiResult = await analyzeWithGemini(
          videoUrl,
          (jump as { nonceDisplay?: string }).nonceDisplay || "",
          apiKey,
          args.userHeightInches
        );
        heightInches = geminiResult.heightInches;
        flags = geminiResult.flags;
        confidence = geminiResult.confidence;

        // Upgrade tier based on confidence and calibration
        if (args.userHeightInches && confidence >= 0.8) {
          verificationTier = "silver"; // Higher confidence with calibration
        }

        // Verify nonce was visible
        if (!geminiResult.nonceVerified) {
          flags.push("nonce_not_verified");
          // Only reject if confidence is also low
          if (confidence < 0.6) {
            verificationTier = "rejected";
          }
        }
      } else {
        // Mock analysis for demo (no API key configured)
        console.log("[xLENS] No Gemini API key, using mock analysis");
        heightInches = 18 + Math.random() * 12; // Random 18-30 inches
      }

      // Update jump record with results
      await ctx.runMutation(internal.xlensHttp.updateJumpResult, {
        jumpId: args.jumpId,
        heightInches: Math.round(heightInches * 10) / 10,
        verificationTier,
        flags,
        status: "complete",
      });

      console.log(`[xLENS] Jump ${args.jumpId} analyzed: ${heightInches.toFixed(1)} inches`);
    } catch (e) {
      console.error("[xLENS] Analysis failed:", e);

      // Mark as failed
      await ctx.runMutation(internal.xlensHttp.updateJumpResult, {
        jumpId: args.jumpId,
        heightInches: null,
        verificationTier: "rejected",
        flags: ["analysis_failed"],
        status: "failed",
      });
    }
  },
});

// ─────────────────────────────────────────────────────────────────
// HELPER: Convert ArrayBuffer to Base64 (Convex runtime compatible)
// ─────────────────────────────────────────────────────────────────
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// ─────────────────────────────────────────────────────────────────
// GEMINI VIDEO ANALYSIS
// Uses Gemini 3 Flash to analyze jump video with height calibration
// ─────────────────────────────────────────────────────────────────
async function analyzeWithGemini(
  videoUrl: string,
  expectedNonce: string,
  apiKey: string,
  userHeightInches?: number
): Promise<{ heightInches: number; flags: string[]; nonceVerified: boolean; confidence: number }> {
  // Using Gemini 3 Flash Preview for video analysis (best for sports biomechanics)
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

  // Build dynamic prompt based on available calibration data
  const heightCalibration = userHeightInches
    ? `
CALIBRATION DATA:
- Athlete's standing height: ${userHeightInches} inches (${(userHeightInches / 12).toFixed(1)} feet / ${Math.round(userHeightInches * 2.54)} cm)
- Use this as a SCALE REFERENCE for photogrammetric verification`
    : `
NOTE: No height calibration provided. Rely solely on chronometric method.`;

  // XLENS PHYSICS-BASED PROMPT - Optimized for accuracy
  const prompt = `You are an ELITE BIOMECHANICS AI for the xLENS vertical jump measurement system.

CRITICAL: You must act as a PHYSICS ENGINE, not a visual estimator. AI cannot guess distances accurately - you MUST calculate using physics.

${heightCalibration}

═══════════════════════════════════════════════════════════════
METHOD 1: CHRONOMETRIC (Time-of-Flight) - PRIMARY METHOD
This is the GOLD STANDARD used by NFL Combine and elite sports testing.
═══════════════════════════════════════════════════════════════

Step 1: Analyze video frame-by-frame
Step 2: Find EXACT takeoff timestamp (the frame where feet completely leave ground)
Step 3: Find EXACT landing timestamp (the frame where feet touch ground)
Step 4: Calculate HANG TIME: t = (landing_frame - takeoff_frame) / fps
Step 5: Apply physics formula: h = (1/8) × g × t²
        Where g = 386.09 in/s² (gravity in inches)
        Simplified: h = 48.26 × t² (result in inches)

PHYSICS TRUTH: A 0.4 second hang time = 7.72 inches, regardless of athlete size.

═══════════════════════════════════════════════════════════════
METHOD 2: PHOTOGRAMMETRIC (Pixel Ratio) - VERIFICATION ONLY
Use athlete's body as a measuring stick to verify chronometric result.
═══════════════════════════════════════════════════════════════

Step 1: Find a frame where athlete is standing still on ground
Step 2: Measure athlete's height in pixels (head to floor)
Step 3: Calculate pixel-to-inch ratio: ratio = ${userHeightInches || 'unknown'} inches / height_pixels
Step 4: At peak jump, measure gap between feet and floor in pixels
Step 5: Convert: jump_height = gap_pixels × ratio

═══════════════════════════════════════════════════════════════
FINAL RESULT: Use CHRONOMETRIC as primary. Photogrammetric to verify.
If methods differ by >20%, flag for review and prefer chronometric.
═══════════════════════════════════════════════════════════════

VERIFICATION CHECKS:
- Is the nonce code "${expectedNonce}" visible in video?
- Is full jump captured (takeoff AND landing visible)?
- Is person fully in frame throughout?

EXPECTED RANGES (sanity check only - trust the physics):
- Child under 5ft tall: 4-12 inches typical
- Average adult: 14-20 inches
- Trained athlete: 22-32 inches
- Elite: 35-45+ inches

Return ONLY valid JSON:
{
  "chronometricMethod": {
    "takeoffFrame": <exact frame number>,
    "landingFrame": <exact frame number>,
    "estimatedFPS": <video fps, likely 30 or 60>,
    "hangTimeSeconds": <calculated t>,
    "calculatedHeightInches": <48.26 × t²>
  },
  "photogrammetricMethod": {
    "standingHeightPixels": <pixels or null>,
    "jumpGapPixels": <pixels at peak or null>,
    "pixelToInchRatio": <ratio or null>,
    "calculatedHeightInches": <number or null>
  },
  "heightInches": <FINAL - use chronometric, verify with photogrammetric>,
  "confidence": <0.0 to 1.0>,
  "methodsAgree": <true if within 20% of each other>,
  "nonceVisible": <true/false>,
  "nonceMatches": <true/false if visible>,
  "flags": [<any issues>],
  "reasoning": "<explain frame analysis and calculation>"
}`;

  try {
    // For larger videos, use Gemini File API to avoid memory issues
    // First, check video size by fetching headers only
    console.log(`[xLENS] Checking video at ${videoUrl}`);

    const headResponse = await fetch(videoUrl, { method: 'HEAD' });
    const contentLength = parseInt(headResponse.headers.get('content-length') || '0');
    const videoSizeMB = contentLength / 1024 / 1024;
    console.log(`[xLENS] Video size: ${videoSizeMB.toFixed(2)} MB`);

    // ALWAYS download video and send as inline_data
    // Gemini cannot fetch from Convex storage URLs (authentication/CORS)
    // Even for larger videos, we must download and encode as base64
    console.log(`[xLENS] Downloading video (${videoSizeMB.toFixed(2)} MB) for analysis...`);

    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.status}`);
    }
    const videoBuffer = await videoResponse.arrayBuffer();
    const videoBase64 = arrayBufferToBase64(videoBuffer);
    console.log(`[xLENS] Video downloaded, base64 size: ${(videoBase64.length / 1024 / 1024).toFixed(2)} MB`);

    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "video/mp4",
              data: videoBase64
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[xLENS] Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Log raw response for debugging
    console.log(`[xLENS] Gemini response length: ${text.length}`);
    console.log(`[xLENS] Gemini raw response (first 500 chars): ${text.substring(0, 500)}`);

    // Check if response is empty
    if (!text || text.trim().length === 0) {
      console.error("[xLENS] Empty response from Gemini");
      console.error("[xLENS] Full result:", JSON.stringify(result));
      return {
        heightInches: 18 + Math.random() * 12,
        flags: ["gemini_empty_response"],
        nonceVerified: false,
        confidence: 0,
      };
    }

    let analysis: any;

    // Parse JSON - the response should be clean JSON with responseMimeType set
    try {
      // First, try direct parse
      analysis = JSON.parse(text);
      console.log(`[xLENS] SUCCESS: Parsed JSON directly, heightInches: ${analysis.heightInches}`);
    } catch (e1) {
      const err1 = e1 instanceof Error ? e1.message : String(e1);
      console.log(`[xLENS] Direct parse failed: ${err1}`);

      // Try trimming and parsing
      try {
        analysis = JSON.parse(text.trim());
        console.log(`[xLENS] SUCCESS: Parsed JSON after trim, heightInches: ${analysis.heightInches}`);
      } catch (e2) {
        const err2 = e2 instanceof Error ? e2.message : String(e2);
        console.log(`[xLENS] Trim parse failed: ${err2}`);

        // Try regex extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            analysis = JSON.parse(jsonMatch[0]);
            console.log(`[xLENS] SUCCESS: Parsed JSON from regex, heightInches: ${analysis.heightInches}`);
          } catch (e3) {
            const err3 = e3 instanceof Error ? e3.message : String(e3);
            console.log(`[xLENS] Regex parse failed: ${err3}`);
            console.log(`[xLENS] Regex match length: ${jsonMatch[0].length}`);
            console.log(`[xLENS] Regex match first 100: ${jsonMatch[0].substring(0, 100)}`);
            console.log(`[xLENS] Regex match last 100: ${jsonMatch[0].substring(jsonMatch[0].length - 100)}`);

            return {
              heightInches: 18 + Math.random() * 12,
              flags: ["gemini_parse_error", `err: ${err3.substring(0, 50)}`],
              nonceVerified: false,
              confidence: 0,
            };
          }
        } else {
          console.log(`[xLENS] No JSON match found in: ${text.substring(0, 200)}`);
          return {
            heightInches: 18 + Math.random() * 12,
            flags: ["gemini_no_json", `raw: ${text.substring(0, 100)}`],
            nonceVerified: false,
            confidence: 0,
          };
        }
      }
    }

    const confidence = analysis.confidence || 0.5;

    // Log detailed chronometric analysis
    const chrono = analysis.chronometricMethod;
    if (chrono) {
      console.log(`[xLENS] Chronometric: takeoff=${chrono.takeoffFrame}, landing=${chrono.landingFrame}, fps=${chrono.estimatedFPS}`);
      console.log(`[xLENS] Hang time: ${chrono.hangTimeSeconds}s → ${chrono.calculatedHeightInches}" (physics: h = 48.26 × t²)`);
    }

    const photo = analysis.photogrammetricMethod;
    if (photo && photo.calculatedHeightInches) {
      console.log(`[xLENS] Photogrammetric verification: ${photo.calculatedHeightInches}"`);
    }

    console.log(`[xLENS] FINAL: ${analysis.heightInches}" (confidence: ${confidence}, methods agree: ${analysis.methodsAgree})`);
    if (analysis.reasoning) {
      console.log(`[xLENS] Reasoning: ${analysis.reasoning}`);
    }

    return {
      heightInches: analysis.heightInches || 0,
      flags: analysis.flags || [],
      nonceVerified: analysis.nonceVisible && analysis.nonceMatches,
      confidence,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    const errorStack = e instanceof Error ? e.stack : undefined;
    console.error("[xLENS] Gemini analysis error:", errorMessage);
    if (errorStack) console.error("[xLENS] Stack:", errorStack);
    // Fall back to mock on API error
    return {
      heightInches: 18 + Math.random() * 12,
      flags: ["gemini_fallback", `error: ${errorMessage.substring(0, 100)}`],
      nonceVerified: false,
      confidence: 0,
    };
  }
}

// Test function to verify JSON parsing works
export const testJsonParse = internalAction({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    console.log(`Testing JSON parse with: ${args.text.substring(0, 100)}`);
    try {
      const result = JSON.parse(args.text);
      return { success: true, keys: Object.keys(result) };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : String(e) };
    }
  },
});

// ─────────────────────────────────────────────────────────────────
// RE-ANALYZE JUMP
// Manually trigger re-analysis with corrected user height
// ─────────────────────────────────────────────────────────────────
export const reanalyzeJump = internalAction({
  args: {
    jumpId: v.string(),
    userHeightInches: v.number(), // Corrected user height
  },
  handler: async (ctx, args) => {
    // Get the jump record
    const jump = await ctx.runQuery(internal.xlensHttp.getJump, { jumpId: args.jumpId });
    if (!jump) {
      throw new Error(`Jump ${args.jumpId} not found`);
    }

    console.log(`[xLENS] Re-analyzing jump ${args.jumpId} with corrected height: ${args.userHeightInches}"`);

    // Run analysis with corrected height
    const storageId = (jump as { storageId?: string }).storageId;
    if (!storageId) {
      throw new Error(`Jump ${args.jumpId} has no storageId`);
    }
    await ctx.runAction(internal.xlensHttp.analyzeJump, {
      jumpId: args.jumpId,
      storageId,
      userHeightInches: args.userHeightInches,
    });
  },
});

// ─────────────────────────────────────────────────────────────────
// REANALYZE ALL JUMPS
// Batch re-analysis for testing/calibration
// ─────────────────────────────────────────────────────────────────
export const reanalyzeAllJumps = internalAction({
  args: {
    jumpConfigs: v.array(v.object({
      jumpId: v.string(),
      userHeightInches: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    console.log(`[xLENS] Batch re-analysis of ${args.jumpConfigs.length} jumps`);

    const results = [];
    for (const config of args.jumpConfigs) {
      try {
        await ctx.runAction(internal.xlensHttp.reanalyzeJump, {
          jumpId: config.jumpId,
          userHeightInches: config.userHeightInches,
        });
        results.push({ jumpId: config.jumpId, status: "queued" });
      } catch (e) {
        results.push({ jumpId: config.jumpId, status: "error", error: String(e) });
      }
    }

    return results;
  },
});

// ─────────────────────────────────────────────────────────────────
// UPDATE JUMP RESULT
// ─────────────────────────────────────────────────────────────────
export const updateJumpResult = internalMutation({
  args: {
    jumpId: v.string(),
    heightInches: v.union(v.number(), v.null()),
    verificationTier: v.string(),
    flags: v.array(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jumpId as any, {
      heightInches: args.heightInches ?? undefined,
      verificationTier: args.verificationTier,
      flags: args.flags,
      status: args.status,
      processedAt: Date.now(),
    });
  },
});
