/**
 * Standalone Jump Video Analysis Script
 * Uses Gemini 2.0 Flash to analyze jump videos and verify accuracy
 *
 * Usage: npx tsx scripts/analyzeJumpVideos.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Video data from Convex (Production - lovable-heron-569)
const VIDEOS = [
  {
    id: 'kg28zxy4cbjvqs9e6ch3f2jq8n7zvzfm',
    recordedHeight: 22.7,
    userHeight: 52, // First subject - 6'2" should be 74 inches, but stored 52?
    uploadedAt: '1/23/2026, 8:37:09 PM',
    size: '4.9 MB',
    subject: 'Subject 1 (reported 6\'2")'
  },
  {
    id: 'kg281849jgnzaer34py7pzjyz97zve9q',
    recordedHeight: 29,
    userHeight: undefined, // No calibration
    uploadedAt: '1/23/2026, 8:35:01 PM',
    size: '2.5 MB',
    subject: 'Subject 2 (reported 4\'4")'
  },
  {
    id: 'kg2f8wd9srf3my7p6scsnkd9j57zvfns',
    recordedHeight: 28.4,
    userHeight: undefined,
    uploadedAt: '1/23/2026, 8:32:32 PM',
    size: '5.14 MB',
    subject: 'Unknown subject'
  },
  {
    id: 'kg28qsk0ccmq1f0qx2m4gpbq8n7zty8v',
    recordedHeight: 22.6,
    userHeight: undefined,
    uploadedAt: '1/23/2026, 8:32:01 PM',
    size: '10.87 MB',
    subject: 'Unknown subject'
  }
];

// Convex storage URL pattern
const CONVEX_DEPLOYMENT = 'lovable-heron-569';
const getStorageUrl = (storageId: string) =>
  `https://${CONVEX_DEPLOYMENT}.convex.cloud/api/storage/${storageId}`;

async function analyzeVideoWithGemini(
  videoUrl: string,
  userHeightInches: number | undefined,
  subject: string,
  apiKey: string
): Promise<{
  heightInches: number;
  confidence: number;
  method: string;
  reasoning: string;
}> {
  // Using Gemini 3 Flash Preview for best video analysis
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

  // Build calibration context
  const heightCalibration = userHeightInches
    ? `
CALIBRATION DATA:
- User's standing height: ${userHeightInches} inches (${(userHeightInches / 12).toFixed(1)} feet / ${Math.round(userHeightInches * 2.54)} cm)
- Use this as a SCALE REFERENCE for visual measurement`
    : `NOTE: No height calibration provided. Use flight time method.`;

  const prompt = `Analyze this vertical jump video to determine JUMP HEIGHT with precision.

${heightCalibration}

METHODS TO USE:

1. VISUAL REFERENCE (if calibration available):
   - Find a frame where person is standing still
   - Measure body height in pixels
   - Measure feet displacement from ground at peak jump
   - Calculate: jump_height = (displacement_pixels / body_height_pixels) * user_height

2. FLIGHT TIME (physics):
   - Find takeoff frame (feet leave ground)
   - Find landing frame (feet touch ground)
   - flight_time = (landing - takeoff) / fps
   - height = 0.5 * 386.4 * (flight_time / 2)^2 inches

EXPECTED RANGES:
- Child (4-6 feet tall): 6-14 inches
- Average adult: 16-20 inches
- Trained athlete: 24-32 inches
- Elite: 35-45+ inches

Return ONLY valid JSON:
{
  "method": "visual_reference" | "flight_time",
  "takeoffFrame": <number>,
  "landingFrame": <number>,
  "estimatedFPS": <number>,
  "flightTimeSeconds": <number>,
  "standingHeightPixels": <number or null>,
  "jumpDisplacementPixels": <number or null>,
  "heightInches": <FINAL measurement>,
  "confidence": <0.0 to 1.0>,
  "reasoning": "<explain your measurement approach>"
}`;

  try {
    // Fetch video as base64
    console.log(`  Fetching video from ${videoUrl}...`);
    const videoResponse = await fetch(videoUrl);

    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.status}`);
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    const mimeType = "video/mp4";

    console.log(`  Video size: ${(videoBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Sending to Gemini 2.0 Flash...`);

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: mimeType,
                data: videoBase64
              }
            },
            { text: prompt }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`  Gemini API error: ${errorText}`);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`  Raw response: ${text}`);
      throw new Error("No JSON found in Gemini response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return {
      heightInches: analysis.heightInches || 0,
      confidence: analysis.confidence || 0.5,
      method: analysis.method || 'unknown',
      reasoning: analysis.reasoning || ''
    };
  } catch (e) {
    console.error(`  Analysis error:`, e);
    return {
      heightInches: 0,
      confidence: 0,
      method: 'error',
      reasoning: String(e)
    };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('xLENS Jump Video Analysis - Accuracy Verification');
  console.log('='.repeat(60));
  console.log();

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: No Gemini API key found!');
    console.error('Set GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variable');
    process.exit(1);
  }

  console.log(`API Key: ${apiKey.substring(0, 10)}...`);
  console.log();

  // Analyze each video
  const results: Array<{
    subject: string;
    recordedHeight: number;
    geminiHeight: number;
    difference: number;
    confidence: number;
    method: string;
    reasoning: string;
  }> = [];

  for (const video of VIDEOS) {
    console.log('-'.repeat(60));
    console.log(`Analyzing: ${video.subject}`);
    console.log(`  Storage ID: ${video.id}`);
    console.log(`  Recorded Height: ${video.recordedHeight}" (mock analysis)`);
    console.log(`  User Height Calibration: ${video.userHeight ? `${video.userHeight}"` : 'NONE'}`);
    console.log();

    const videoUrl = getStorageUrl(video.id);

    const analysis = await analyzeVideoWithGemini(
      videoUrl,
      video.userHeight,
      video.subject,
      apiKey
    );

    const difference = Math.abs(analysis.heightInches - video.recordedHeight);

    results.push({
      subject: video.subject,
      recordedHeight: video.recordedHeight,
      geminiHeight: analysis.heightInches,
      difference,
      confidence: analysis.confidence,
      method: analysis.method,
      reasoning: analysis.reasoning
    });

    console.log();
    console.log(`  RESULT:`);
    console.log(`    Gemini Height: ${analysis.heightInches.toFixed(1)}"`);
    console.log(`    Method: ${analysis.method}`);
    console.log(`    Confidence: ${(analysis.confidence * 100).toFixed(0)}%`);
    console.log(`    Difference from mock: ${difference.toFixed(1)}"`);
    console.log(`    Reasoning: ${analysis.reasoning}`);
    console.log();
  }

  // Summary
  console.log('='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log();
  console.log('| Subject | Mock | Gemini | Diff | Confidence | Method |');
  console.log('|---------|------|--------|------|------------|--------|');

  for (const r of results) {
    console.log(
      `| ${r.subject.substring(0, 20).padEnd(20)} | ${r.recordedHeight.toFixed(1).padStart(4)}" | ` +
      `${r.geminiHeight.toFixed(1).padStart(5)}" | ${r.difference.toFixed(1).padStart(4)}" | ` +
      `${(r.confidence * 100).toFixed(0).padStart(3)}% | ${r.method.padEnd(6)} |`
    );
  }

  console.log();
  console.log('NOTES:');
  console.log('- Subject 1 (6\'2") should have ~74" standing height, but userHeightInches shows 52');
  console.log('- Subject 2 (4\'4") = 52" standing height - expected jump: 6-12"');
  console.log('- Mock analysis uses random 18-30" which is inaccurate');
  console.log();
}

main().catch(console.error);
