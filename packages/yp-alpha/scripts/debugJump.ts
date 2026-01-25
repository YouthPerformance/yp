#!/usr/bin/env npx tsx
/**
 * Debug Jump Analysis Script
 *
 * Downloads a jump video and runs Gemini analysis locally
 * so we can see the full response and iterate on prompts.
 *
 * Usage:
 *   npx tsx scripts/debugJump.ts <jumpId>
 *   npx tsx scripts/debugJump.ts --latest
 *   npx tsx scripts/debugJump.ts --list
 */

const CONVEX_SITE_URL = "https://lovable-heron-569.convex.site";

interface Jump {
  _id: string;
  heightInches: number | null;
  userHeightInches?: number;
  status: string;
  verificationTier: string;
  flags?: string[];
  videoUrl?: string;
  createdAt: number;
  storageId?: string;
}

async function listJumps(): Promise<Jump[]> {
  const response = await fetch(`${CONVEX_SITE_URL}/xlens/debug/jumps`);
  if (!response.ok) {
    throw new Error(`Failed to fetch jumps: ${response.status}`);
  }
  return response.json();
}

async function analyzeWithGemini(
  videoUrl: string,
  userHeightInches: number | undefined
): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Set GEMINI_API_KEY or GOOGLE_AI_API_KEY env var");
  }

  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  // Build calibration context
  const heightCalibration = userHeightInches
    ? `
CALIBRATION DATA:
- Athlete's standing height: ${userHeightInches} inches (${(userHeightInches / 12).toFixed(1)} feet / ${Math.round(userHeightInches * 2.54)} cm)
- Use this as a SCALE REFERENCE for photogrammetric verification`
    : `
NOTE: No height calibration provided. Rely solely on chronometric method.`;

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

  console.log("\n📹 Fetching video...");
  const videoResponse = await fetch(videoUrl);
  if (!videoResponse.ok) {
    throw new Error(`Failed to fetch video: ${videoResponse.status}`);
  }

  const videoBuffer = await videoResponse.arrayBuffer();
  const videoBase64 = Buffer.from(videoBuffer).toString('base64');
  const sizeMB = videoBuffer.byteLength / 1024 / 1024;
  console.log(`   Video size: ${sizeMB.toFixed(2)} MB`);

  console.log("\n🤖 Sending to Gemini 2.0 Flash...");

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
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
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API error:", errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

  console.log("\n📄 RAW GEMINI RESPONSE:");
  console.log("─".repeat(60));
  console.log(text);
  console.log("─".repeat(60));

  // Try to parse JSON
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.log("\n⚠️  Could not parse JSON from response");
  }

  return { raw: text };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help") {
    console.log(`
Usage:
  npx tsx scripts/debugJump.ts --list          List recent jumps
  npx tsx scripts/debugJump.ts --latest        Analyze most recent jump
  npx tsx scripts/debugJump.ts <jumpId>        Analyze specific jump
`);
    return;
  }

  if (args[0] === "--list") {
    console.log("\n📋 Recent Jumps:");
    console.log("─".repeat(80));

    const jumps = await listJumps();

    for (const jump of jumps) {
      const date = new Date(jump.createdAt).toLocaleString();
      const height = jump.heightInches ? `${jump.heightInches.toFixed(1)}"` : "N/A";
      const userHeight = jump.userHeightInches ? `${jump.userHeightInches}"` : "none";

      console.log(`
ID: ${jump._id}
  Created: ${date}
  Result: ${height} (${jump.status})
  User Height: ${userHeight}
  Tier: ${jump.verificationTier}
  Flags: ${jump.flags?.join(", ") || "none"}
  Video: ${jump.videoUrl ? "✓" : "✗"}`);
    }
    return;
  }

  // Get jump to analyze
  let targetJump: Jump | undefined;

  if (args[0] === "--latest") {
    const jumps = await listJumps();
    targetJump = jumps[0];
    if (!targetJump) {
      console.error("No jumps found");
      return;
    }
    console.log(`\n🎯 Analyzing latest jump: ${targetJump._id}`);
  } else {
    const jumpId = args[0];
    const jumps = await listJumps();
    targetJump = jumps.find(j => j._id === jumpId);
    if (!targetJump) {
      console.error(`Jump ${jumpId} not found`);
      return;
    }
  }

  if (!targetJump.videoUrl) {
    console.error("Jump has no video URL");
    return;
  }

  console.log(`
═══════════════════════════════════════════════════════════════
JUMP DEBUG ANALYSIS
═══════════════════════════════════════════════════════════════
Jump ID: ${targetJump._id}
Created: ${new Date(targetJump.createdAt).toLocaleString()}
Current Result: ${targetJump.heightInches?.toFixed(1) || "N/A"}" (${targetJump.status})
User Height: ${targetJump.userHeightInches || "not set"}"
Video: ${targetJump.videoUrl}
═══════════════════════════════════════════════════════════════`);

  const analysis = await analyzeWithGemini(
    targetJump.videoUrl,
    targetJump.userHeightInches
  );

  console.log("\n📊 PARSED ANALYSIS:");
  console.log(JSON.stringify(analysis, null, 2));

  if (analysis.chronometricMethod) {
    const chrono = analysis.chronometricMethod;
    console.log(`
═══════════════════════════════════════════════════════════════
SUMMARY
═══════════════════════════════════════════════════════════════
Chronometric Method:
  Takeoff Frame: ${chrono.takeoffFrame}
  Landing Frame: ${chrono.landingFrame}
  FPS: ${chrono.estimatedFPS}
  Hang Time: ${chrono.hangTimeSeconds}s
  Calculated Height: ${chrono.calculatedHeightInches}"

Final Height: ${analysis.heightInches}"
Confidence: ${(analysis.confidence * 100).toFixed(0)}%
Methods Agree: ${analysis.methodsAgree}

Reasoning: ${analysis.reasoning}
═══════════════════════════════════════════════════════════════`);
  }
}

main().catch(console.error);
