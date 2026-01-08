// ═══════════════════════════════════════════════════════════
// VOICE CLASSIFICATION API
// Ultra-low latency LLM classification via Groq
// Target: <200ms response time
// ═══════════════════════════════════════════════════════════

import Groq from "groq-sdk";
import { type NextRequest, NextResponse } from "next/server";

// Lazy initialization to prevent build errors when env var is missing
let groq: Groq | null = null;
function getGroqClient(): Groq {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type TrainingPath = "glass" | "grinder" | "prospect";
export type WolfIdentity = "speed" | "tank" | "air";
export type QuestionType = "pain" | "volume" | "ambition";

interface ClassificationRequest {
  transcript: string;
  questionType: QuestionType;
}

interface ClassificationResponse {
  // For pain question
  painDetected?: boolean;
  painConfidence?: number;
  bodyPart?: string;

  // For volume question
  highVolume?: boolean;
  volumeConfidence?: number;

  // For ambition question
  wolfIdentity?: WolfIdentity;
  identityConfidence?: number;

  // Derived path (only set after pain/volume)
  trainingPath?: TrainingPath;

  // Raw LLM reasoning (for debugging)
  reasoning?: string;
}

// ─────────────────────────────────────────────────────────────
// KEYWORD DETECTION (Fast path - no LLM needed)
// ─────────────────────────────────────────────────────────────

const PAIN_KEYWORDS = [
  "hurt",
  "hurts",
  "pain",
  "painful",
  "sore",
  "ache",
  "aching",
  "injured",
  "injury",
  "bad",
  "bothers",
  "bothering",
  "tender",
  "swollen",
  "stiff",
  "tight",
  "tweaked",
  "sprained",
  "broken",
];

const BODY_PARTS = [
  "knee",
  "knees",
  "ankle",
  "ankles",
  "back",
  "hip",
  "hips",
  "shin",
  "shins",
  "foot",
  "feet",
  "leg",
  "legs",
  "calf",
  "calves",
  "achilles",
  "hamstring",
  "quad",
  "groin",
];

const HIGH_VOLUME_KEYWORDS = [
  "two",
  "three",
  "four",
  "five",
  "2",
  "3",
  "4",
  "5",
  "multiple",
  "travel",
  "club",
  "aau",
  "select",
  "heavy",
  "tired",
  "exhausted",
  "fatigued",
  "worn out",
  "every day",
  "everyday",
  "7 days",
  "seven days",
];

const FRESH_KEYWORDS = [
  "one",
  "1",
  "just one",
  "single",
  "fresh",
  "good",
  "great",
  "fine",
  "ready",
  "rested",
];

const SPEED_KEYWORDS = [
  "speed",
  "fast",
  "faster",
  "quick",
  "quicker",
  "sprint",
  "run",
  "running",
  "guard",
  "winger",
  "forward",
];

const AIR_KEYWORDS = [
  "dunk",
  "dunking",
  "jump",
  "jumping",
  "fly",
  "flying",
  "vertical",
  "bounce",
  "air",
  "catch bodies",
  "block",
  "above the rim",
  "posterize",
];

const TANK_KEYWORDS = [
  "strong",
  "stronger",
  "strength",
  "power",
  "powerful",
  "big",
  "bigger",
  "muscle",
  "post",
  "defense",
  "physical",
];

function keywordMatch(transcript: string, keywords: string[]): boolean {
  const lower = transcript.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function findBodyPart(transcript: string): string | undefined {
  const lower = transcript.toLowerCase();
  return BODY_PARTS.find((part) => lower.includes(part));
}

// ─────────────────────────────────────────────────────────────
// FAST CLASSIFICATION (Keywords only)
// ─────────────────────────────────────────────────────────────

function fastClassifyPain(transcript: string): ClassificationResponse | null {
  const lower = transcript.toLowerCase();
  const hasPainWord = keywordMatch(transcript, PAIN_KEYWORDS);
  const bodyPart = findBodyPart(transcript);

  // Clear positive: pain keyword + body part
  if (hasPainWord && bodyPart) {
    return {
      painDetected: true,
      painConfidence: 0.95,
      bodyPart,
      trainingPath: "glass",
    };
  }

  // Just pain keyword, still confident
  if (hasPainWord) {
    return {
      painDetected: true,
      painConfidence: 0.85,
      trainingPath: "glass",
    };
  }

  // Clear negative responses
  const negatives = ["no", "nah", "nope", "don't", "nothing", "i'm good", "i'm fine", "all good", "feeling good", "feel good"];
  if (negatives.some((neg) => lower.includes(neg))) {
    return {
      painDetected: false,
      painConfidence: 0.9,
    };
  }

  // SMART DETECTION: If they mention a body part in response to "does anything hurt?",
  // they're implying that body part hurts (e.g., "just my feet", "my knees", "yeah my back")
  // This handles responses like "Just my, feet." or "my ankles" without explicit pain words
  if (bodyPart) {
    // Check if it's a possessive/reference pattern (my, the, just)
    const impliedPainPatterns = [
      "my " + bodyPart,
      "just " + bodyPart,
      "just my " + bodyPart,
      "yeah " + bodyPart,
      "yes " + bodyPart,
      "the " + bodyPart,
    ];

    if (impliedPainPatterns.some((pattern) => lower.includes(pattern)) ||
        lower.trim().split(/\s+/).length <= 4) {
      // Short response mentioning body part = pain implied
      return {
        painDetected: true,
        painConfidence: 0.8,
        bodyPart,
        trainingPath: "glass",
      };
    }
  }

  // Ambiguous - fall through to LLM
  return null;
}

function fastClassifyVolume(transcript: string): ClassificationResponse | null {
  const hasHighVolume = keywordMatch(transcript, HIGH_VOLUME_KEYWORDS);
  const hasFresh = keywordMatch(transcript, FRESH_KEYWORDS);

  if (hasHighVolume && !hasFresh) {
    return {
      highVolume: true,
      volumeConfidence: 0.9,
      trainingPath: "grinder",
    };
  }

  if (hasFresh && !hasHighVolume) {
    return {
      highVolume: false,
      volumeConfidence: 0.9,
      trainingPath: "prospect",
    };
  }

  return null;
}

function fastClassifyAmbition(transcript: string): ClassificationResponse | null {
  const hasSpeed = keywordMatch(transcript, SPEED_KEYWORDS);
  const hasAir = keywordMatch(transcript, AIR_KEYWORDS);
  const hasTank = keywordMatch(transcript, TANK_KEYWORDS);

  // Clear single match
  if (hasSpeed && !hasAir && !hasTank) {
    return { wolfIdentity: "speed", identityConfidence: 0.95 };
  }
  if (hasAir && !hasSpeed && !hasTank) {
    return { wolfIdentity: "air", identityConfidence: 0.95 };
  }
  if (hasTank && !hasSpeed && !hasAir) {
    return { wolfIdentity: "tank", identityConfidence: 0.95 };
  }

  return null;
}

// ─────────────────────────────────────────────────────────────
// LLM CLASSIFICATION (For ambiguous cases)
// ─────────────────────────────────────────────────────────────

async function llmClassify(
  transcript: string,
  questionType: QuestionType,
): Promise<ClassificationResponse> {
  const prompts: Record<QuestionType, string> = {
    pain: `You are classifying an athlete's response about pain/injury.

Transcript: "${transcript}"

Respond with JSON only:
{
  "painDetected": boolean,
  "confidence": 0-1,
  "bodyPart": string or null,
  "reasoning": "one sentence"
}`,

    volume: `You are classifying an athlete's training volume.

Transcript: "${transcript}"

High volume indicators: multiple teams, travel ball, feeling heavy/tired, training daily
Fresh indicators: one team, feeling good/rested, moderate schedule

Respond with JSON only:
{
  "highVolume": boolean,
  "confidence": 0-1,
  "reasoning": "one sentence"
}`,

    ambition: `You are classifying an athlete's primary goal.

Transcript: "${transcript}"

Categories:
- SPEED: wants to be faster, quicker, better sprinter
- AIR: wants to jump higher, dunk, have more bounce
- TANK: wants to be stronger, more powerful, bigger

Respond with JSON only:
{
  "identity": "speed" | "air" | "tank",
  "confidence": 0-1,
  "reasoning": "one sentence"
}`,
  };

  const startTime = Date.now();

  const completion = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a classification model. Respond with valid JSON only. No markdown, no explanation outside the JSON.",
      },
      {
        role: "user",
        content: prompts[questionType],
      },
    ],
    temperature: 0.1,
    max_tokens: 150,
    response_format: { type: "json_object" },
  });

  const latency = Date.now() - startTime;
  console.log(`[Groq] Classification latency: ${latency}ms`);

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from Groq");
  }

  const parsed = JSON.parse(content);

  // Map LLM response to our format
  switch (questionType) {
    case "pain":
      return {
        painDetected: parsed.painDetected,
        painConfidence: parsed.confidence,
        bodyPart: parsed.bodyPart,
        trainingPath: parsed.painDetected ? "glass" : undefined,
        reasoning: parsed.reasoning,
      };
    case "volume":
      return {
        highVolume: parsed.highVolume,
        volumeConfidence: parsed.confidence,
        trainingPath: parsed.highVolume ? "grinder" : "prospect",
        reasoning: parsed.reasoning,
      };
    case "ambition":
      return {
        wolfIdentity: parsed.identity as WolfIdentity,
        identityConfidence: parsed.confidence,
        reasoning: parsed.reasoning,
      };
  }
}

// ─────────────────────────────────────────────────────────────
// API ROUTE
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ClassificationRequest = await request.json();
    const { transcript, questionType } = body;

    if (!transcript || !questionType) {
      return NextResponse.json({ error: "Missing transcript or questionType" }, { status: 400 });
    }

    // Try fast path first
    let result: ClassificationResponse | null = null;

    switch (questionType) {
      case "pain":
        result = fastClassifyPain(transcript);
        break;
      case "volume":
        result = fastClassifyVolume(transcript);
        break;
      case "ambition":
        result = fastClassifyAmbition(transcript);
        break;
    }

    // If fast path succeeded, return immediately
    if (result) {
      const latency = Date.now() - startTime;
      console.log(`[FastPath] Classification: ${latency}ms`);
      return NextResponse.json({
        ...result,
        method: "keyword",
        latencyMs: latency,
      });
    }

    // Fall back to LLM for ambiguous cases
    result = await llmClassify(transcript, questionType);
    const latency = Date.now() - startTime;

    return NextResponse.json({
      ...result,
      method: "llm",
      latencyMs: latency,
    });
  } catch (error) {
    console.error("[Classify] Error:", error);
    return NextResponse.json(
      { error: "Classification failed", details: String(error) },
      { status: 500 },
    );
  }
}
