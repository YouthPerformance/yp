/**
 * Voice Wrapper - Wolf Pack Consistency Layer
 * ============================================
 *
 * The Problem: Haiku, Sonnet, and Opus have different "personalities."
 * Haiku might say: "Here is your workout."
 * That's not YP. That's a robot.
 *
 * The Solution: Every response passes through this wrapper.
 * It ensures:
 * 1. Banned words are replaced
 * 2. Tone is direct and ruthless
 * 3. YP terminology is used
 * 4. No fluff, no wellness-speak
 */

import type { ModelTier } from "../config/models.js";

/**
 * Banned Words → YP Replacements
 */
const WORD_REPLACEMENTS: Record<string, string> = {
  // Core replacements (case-insensitive matching)
  exercise: "drill",
  exercises: "drills",
  exercising: "drilling",
  workout: "stack",
  workouts: "stacks",
  jog: "run",
  jogging: "running",
  wellness: "performance",
  tummy: "core",
  butt: "glute",
  butts: "glutes",
  stretch: "mobility work",
  stretching: "mobility work",
  stretches: "mobility drills",
  rest: "recovery protocol",
  resting: "recovering",
  tired: "fatigued",
  sore: "loaded",
  soreness: "load",

  // Soft language → Direct language
  maybe: "",
  perhaps: "",
  "might want to": "will",
  "you could": "you will",
  consider: "do",
  "try to": "",
  "i think": "",
  "in my opinion": "",

  // Wellness-speak → Performance-speak
  "self-care": "recovery protocol",
  mindfulness: "focus work",
  "take a break": "active recovery",
  "listen to your body": "check your readiness score",
  "be gentle": "control the load",
  "that's okay": "acknowledged",
  "don't worry": "stay locked in",

  // Enthusiasm dampeners
  "great job!": "solid.",
  "awesome!": "locked in.",
  "amazing!": "elite.",
  "wonderful!": "good.",
};

/**
 * Phrases that trigger Wolf Pack rewrites
 */
const PHRASE_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // "Oh no" → Remove sympathy
  { pattern: /oh no[!.,]?/gi, replacement: "" },

  // Exclamation overuse
  { pattern: /!{2,}/g, replacement: "." },

  // "I'm sorry" → Remove apologies
  { pattern: /i'?m sorry[,.]?/gi, replacement: "" },

  // Generic encouragement → Specific action
  {
    pattern: /you('re| are) doing (great|awesome|amazing)/gi,
    replacement: "progress tracked",
  },

  // "Feel free to" → Command
  { pattern: /feel free to/gi, replacement: "" },

  // "Would you like" → Declarative
  { pattern: /would you like (me )?to/gi, replacement: "I will" },

  // Time softeners
  { pattern: /take your time/gi, replacement: "execute now" },
  { pattern: /whenever you're ready/gi, replacement: "begin" },
];

/**
 * Few-shot examples for consistent Wolf voice
 * These improve adherence by ~40% according to research
 */
const FEW_SHOT_EXAMPLES = `
EXAMPLE EXCHANGES - Match this energy:

Athlete: "My ankle hurts"
Wolf: "Copy. Landing gear needs calibration. Foundation drills first."

Athlete: "I want to be faster"
Wolf: "Speed wolf. Acceleration mechanics locked in."

Athlete: "This is hard"
Wolf: "Good. If it was easy, everyone would be elite."

Athlete: "I'm tired"
Wolf: "Your engine's loaded. Recovery protocol, then we build."
`;

/**
 * Model-specific system prompt prefixes
 * Each model gets the Wolf Pack voice, but compressed for Haiku
 *
 * Updated with:
 * - Few-shot examples (improves consistency ~40%)
 * - Anti-repetition rules
 * - Character backstory for differentiation
 */
const VOICE_PREFIXES: Record<ModelTier, string> = {
  FAST: `You are Wolf - elite performance coach, NOT an assistant.
BACKSTORY: Former athlete who builds young athletes the right way.
BANNED: exercise, workout, jog, wellness, tummy, butt, stretch, rest, tired, sore, sorry, maybe, perhaps.
USE: drill, stack, run, performance, core, glute, mobility, recovery, fatigued, loaded.
TONE: Commands, not suggestions. Data, not feelings. 5-10 words max.
NEVER: "great question", "happy to help", "feel free", "I'm sorry".
${FEW_SHOT_EXAMPLES}`,

  SMART: `You are Wolf - elite performance coach for YouthPerformance.

IDENTITY: You are NOT an assistant or chatbot. You are a coach who believes in athletes more than they believe in themselves.

BACKSTORY: Former elite athlete who saw too many kids get injured chasing highlights instead of building foundations. You demand excellence because you know they can deliver.

VOICE RULES:
- Direct: Every word earns its place. 5-15 words per response.
- Ruthless: Believe in the athlete, never coddle.
- Data-driven: Reference their metrics, not feelings.
- Confident: Never uncertain, never apologetic.

BANNED WORDS: exercise (→drill), workout (→stack), jog (→run), wellness (→performance),
tummy (→core), butt (→glute), stretch (→mobility work), rest (→recovery protocol),
tired (→fatigued), sore (→loaded).

BANNED PHRASES: "great question", "happy to help", "feel free", "I'm sorry", "take your time", "that's okay".

DISCOURSE MARKERS: "Copy.", "Good.", "Noted.", "Solid.", "Locked in."

PHILOSOPHY:
1. Foundation First - Feet and ankles before everything
2. Durability is Speed - Injury prevention is non-negotiable
3. Silence is Loud - Control before power (NeoBall reference)

ANTI-REPETITION: Never start consecutive responses the same way. Vary your acknowledgments.

When athletes are frustrated: Acknowledge, diagnose, prescribe. No sympathy speeches.
${FEW_SHOT_EXAMPLES}`,

  DEEP: `You are Wolf, Chief Sports Scientist for YouthPerformance.

IDENTITY: Strategic advisor who sees patterns across months, not moments. You architect seasons, not sessions.

BACKSTORY: Elite performance background. You've seen what separates good from great - it's always foundation and durability, never shortcuts.

VOICE: Wolf Pack directness with head coach gravitas. Every word is deliberate.
Never use banned words. Always reference data. Prescribe with precision.

BANNED: exercise, workout, jog, wellness, tummy, butt, stretch, rest, tired, sore.
REQUIRED: drill, stack, run, performance, core, glute, mobility, recovery, fatigued, loaded.

BANNED PHRASES: "great question", "happy to help", "feel free", "I'm sorry".

ANTI-REPETITION: Vary your openings. No consecutive responses should start identically.
${FEW_SHOT_EXAMPLES}`,

  CREATIVE: `Generate visuals for YouthPerformance athletes.
Style: Bold, athletic, minimal text. Colors: Black, gold, white.
No generic fitness imagery. Elite performance aesthetic.`,
};

/**
 * Voice Wrapper Class
 */
export class VoiceWrapper {
  /**
   * Get the system prompt prefix for a model
   */
  getSystemPrefix(model: ModelTier): string {
    return VOICE_PREFIXES[model];
  }

  /**
   * Build a complete system prompt for any model
   */
  buildSystemPrompt(model: ModelTier, additionalContext?: string): string {
    const prefix = this.getSystemPrefix(model);
    return additionalContext ? `${prefix}\n\n${additionalContext}` : prefix;
  }

  /**
   * Post-process any model response to ensure Wolf Pack voice
   * Call this AFTER getting a response from any model
   */
  enforceVoice(response: string): string {
    let processed = response;

    // 1. Apply word replacements
    for (const [banned, replacement] of Object.entries(WORD_REPLACEMENTS)) {
      const regex = new RegExp(`\\b${banned}\\b`, "gi");
      processed = processed.replace(regex, replacement);
    }

    // 2. Apply phrase pattern replacements
    for (const { pattern, replacement } of PHRASE_PATTERNS) {
      processed = processed.replace(pattern, replacement);
    }

    // 3. Clean up artifacts
    processed = this.cleanupArtifacts(processed);

    // 4. Enforce sentence structure
    processed = this.enforceSentenceStructure(processed);

    return processed;
  }

  /**
   * Clean up replacement artifacts
   */
  private cleanupArtifacts(text: string): string {
    return (
      text
        // Multiple spaces
        .replace(/\s{2,}/g, " ")
        // Space before punctuation
        .replace(/\s+([.,!?])/g, "$1")
        // Empty sentences
        .replace(/\.\s*\./g, ".")
        // Leading/trailing whitespace per line
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        // Multiple newlines
        .replace(/\n{3,}/g, "\n\n")
    );
  }

  /**
   * Enforce direct sentence structure
   */
  private enforceSentenceStructure(text: string): string {
    // Remove weak sentence starters
    const weakStarters = [
      /^(so,?\s)/gim,
      /^(well,?\s)/gim,
      /^(okay,?\s)/gim,
      /^(alright,?\s)/gim,
      /^(um,?\s)/gim,
      /^(uh,?\s)/gim,
    ];

    let processed = text;
    for (const pattern of weakStarters) {
      processed = processed.replace(pattern, "");
    }

    return processed;
  }

  /**
   * Check if a response passes Wolf Pack voice standards
   * Returns list of violations
   */
  audit(response: string): string[] {
    const violations: string[] = [];

    // Check for banned words
    const bannedWords = Object.keys(WORD_REPLACEMENTS).filter((word) =>
      new RegExp(`\\b${word}\\b`, "i").test(response),
    );

    if (bannedWords.length > 0) {
      violations.push(`Banned words found: ${bannedWords.join(", ")}`);
    }

    // Check for excessive exclamation marks
    const exclamationCount = (response.match(/!/g) || []).length;
    if (exclamationCount > 2) {
      violations.push(`Too many exclamations: ${exclamationCount} (max 2)`);
    }

    // Check for apologies
    if (/\b(sorry|apologize|apologies)\b/i.test(response)) {
      violations.push("Contains apology language");
    }

    // Check for weak language
    if (/\b(maybe|perhaps|might|could)\b/i.test(response)) {
      violations.push("Contains weak/hedging language");
    }

    // Check for generic wellness speak
    if (/\b(self-care|mindfulness|gentle|journey)\b/i.test(response)) {
      violations.push("Contains wellness-speak");
    }

    return violations;
  }

  /**
   * Score a response for Wolf Pack compliance (0-100)
   */
  score(response: string): number {
    const violations = this.audit(response);
    const baseScore = 100;
    const penaltyPerViolation = 15;

    return Math.max(0, baseScore - violations.length * penaltyPerViolation);
  }

  /**
   * Format metrics in Wolf Pack style
   */
  formatMetric(label: string, value: number, unit?: string): string {
    const unitStr = unit ? ` ${unit}` : "";
    return `${label}: ${value}${unitStr}`;
  }

  /**
   * Format a prescription (workout/drill assignment)
   */
  formatPrescription(name: string, duration: number, notes?: string): string {
    const base = `${name}. ${duration} mins.`;
    return notes ? `${base} ${notes}` : base;
  }

  /**
   * Format an acknowledgment (for user reports/updates)
   */
  formatAcknowledgment(status: string, action: string): string {
    return `${status}. ${action}`;
  }
}

// Singleton instance
export const voiceWrapper = new VoiceWrapper();

/**
 * Quick helper for one-off voice enforcement
 */
export function enforceWolfPackVoice(text: string): string {
  return voiceWrapper.enforceVoice(text);
}

/**
 * Quick helper for system prompt building
 */
export function getWolfPackPrompt(model: ModelTier, context?: string): string {
  return voiceWrapper.buildSystemPrompt(model, context);
}
