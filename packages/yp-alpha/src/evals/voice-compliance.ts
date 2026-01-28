/**
 * Voice Compliance Evaluator
 * ==========================
 *
 * Evaluates Wolf Pack brand voice compliance.
 * Uses the same rules as VoiceWrapper for consistency.
 *
 * @example
 * ```ts
 * const result = evaluateVoiceCompliance("Great job! Maybe try again?");
 * console.log(result.score); // 70
 * console.log(result.violations); // ["weak_language: maybe", "banned_phrase: great job"]
 * ```
 */

import { voiceWrapper } from "../router/voice-wrapper";
import { logger } from "../utils/logger";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface VoiceViolation {
  type: "banned_word" | "weak_language" | "apology" | "corporate_speak" | "filler";
  term: string;
  severity: "minor" | "major";
  suggestion?: string;
}

export interface VoiceComplianceResult {
  /** Overall score (0-100) */
  score: number;
  /** Whether it passes minimum threshold (default: 70) */
  passed: boolean;
  /** List of violations found */
  violations: VoiceViolation[];
  /** Detailed breakdown */
  details: {
    bannedWordsFound: string[];
    weakLanguageFound: string[];
    apologiesFound: string[];
    corporateSpeakFound: string[];
  };
  /** Enforced version of the text */
  enforcedText: string;
  /** Summary for logging */
  summary: string;
}

// ─────────────────────────────────────────────────────────────
// BANNED TERMS (Extended from VoiceWrapper)
// ─────────────────────────────────────────────────────────────

const BANNED_WORDS = [
  "workout",
  "exercise",
  "wellness",
  "journey",
  "jog",
  "stretch",
  "cardio",
  "fitness",
  "healthy",
  "lifestyle",
  "routine",
  "body",
  "tired",
  "sore",
  "maybe",
  "perhaps",
  "possibly",
  "might",
  "could be",
  "try to",
  "attempt",
];

const WEAK_LANGUAGE = [
  "i think",
  "i believe",
  "i guess",
  "kind of",
  "sort of",
  "a bit",
  "a little",
  "somewhat",
  "fairly",
  "quite",
  "rather",
  "pretty much",
];

const APOLOGY_PATTERNS = [
  "i'm sorry",
  "i apologize",
  "my apologies",
  "sorry for",
  "sorry about",
  "oh no",
  "my bad",
];

const CORPORATE_SPEAK = [
  "leverage",
  "synergy",
  "paradigm",
  "holistic",
  "optimize",
  "streamline",
  "best practices",
  "moving forward",
  "touch base",
  "circle back",
  "bandwidth",
  "deep dive",
];

// ─────────────────────────────────────────────────────────────
// EVALUATION FUNCTION
// ─────────────────────────────────────────────────────────────

/**
 * Evaluate voice compliance of a text response
 *
 * @param text - Response text to evaluate
 * @param threshold - Minimum passing score (default: 70)
 * @returns Detailed compliance result
 */
export function evaluateVoiceCompliance(
  text: string,
  threshold: number = 70,
): VoiceComplianceResult {
  const lowerText = text.toLowerCase();
  const violations: VoiceViolation[] = [];

  // Track found terms
  const bannedWordsFound: string[] = [];
  const weakLanguageFound: string[] = [];
  const apologiesFound: string[] = [];
  const corporateSpeakFound: string[] = [];

  // Check banned words
  for (const word of BANNED_WORDS) {
    if (lowerText.includes(word)) {
      bannedWordsFound.push(word);
      violations.push({
        type: "banned_word",
        term: word,
        severity: "major",
        suggestion: getBannedWordReplacement(word),
      });
    }
  }

  // Check weak language
  for (const phrase of WEAK_LANGUAGE) {
    if (lowerText.includes(phrase)) {
      weakLanguageFound.push(phrase);
      violations.push({
        type: "weak_language",
        term: phrase,
        severity: "minor",
        suggestion: "Remove hedging language. Be direct.",
      });
    }
  }

  // Check apologies
  for (const pattern of APOLOGY_PATTERNS) {
    if (lowerText.includes(pattern)) {
      apologiesFound.push(pattern);
      violations.push({
        type: "apology",
        term: pattern,
        severity: "major",
        suggestion: "Wolves don't apologize. State facts directly.",
      });
    }
  }

  // Check corporate speak
  for (const term of CORPORATE_SPEAK) {
    if (lowerText.includes(term)) {
      corporateSpeakFound.push(term);
      violations.push({
        type: "corporate_speak",
        term,
        severity: "minor",
        suggestion: "Use direct, athletic language instead.",
      });
    }
  }

  // Calculate score
  const baseScore = 100;
  const majorPenalty = 15;
  const minorPenalty = 5;

  const majorViolations = violations.filter((v) => v.severity === "major").length;
  const minorViolations = violations.filter((v) => v.severity === "minor").length;

  const score = Math.max(
    0,
    baseScore - majorViolations * majorPenalty - minorViolations * minorPenalty,
  );

  // Get enforced text using VoiceWrapper
  const enforcedText = voiceWrapper.enforceVoice(text);

  // Build summary
  const summary = buildSummary(score, violations);

  logger.debug("Voice compliance evaluated", {
    score,
    violationCount: violations.length,
    passed: score >= threshold,
  });

  return {
    score,
    passed: score >= threshold,
    violations,
    details: {
      bannedWordsFound,
      weakLanguageFound,
      apologiesFound,
      corporateSpeakFound,
    },
    enforcedText,
    summary,
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function getBannedWordReplacement(word: string): string {
  const replacements: Record<string, string> = {
    workout: "stack",
    exercise: "drill",
    wellness: "performance",
    journey: "path",
    jog: "run",
    stretch: "mobility",
    cardio: "conditioning",
    fitness: "training",
    healthy: "strong",
    lifestyle: "approach",
    routine: "protocol",
    body: "chassis",
    tired: "fatigued",
    sore: "loaded",
    maybe: "(remove)",
    perhaps: "(remove)",
    possibly: "(remove)",
  };

  return replacements[word] || "(remove or rephrase)";
}

function buildSummary(score: number, violations: VoiceViolation[]): string {
  if (score >= 90) {
    return "Excellent voice compliance. Wolf Pack approved.";
  }
  if (score >= 70) {
    return `Acceptable voice compliance with ${violations.length} minor issue(s).`;
  }
  if (score >= 50) {
    return `Voice needs work. ${violations.length} violation(s) detected.`;
  }
  return `Poor voice compliance. Major revision needed. ${violations.length} violation(s).`;
}

// ─────────────────────────────────────────────────────────────
// BATCH EVALUATION
// ─────────────────────────────────────────────────────────────

/**
 * Evaluate multiple responses
 */
export function evaluateVoiceComplianceBatch(
  texts: string[],
  threshold: number = 70,
): {
  results: VoiceComplianceResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    averageScore: number;
    commonViolations: Array<{ term: string; count: number }>;
  };
} {
  const results = texts.map((text) => evaluateVoiceCompliance(text, threshold));

  // Calculate summary statistics
  const passed = results.filter((r) => r.passed).length;
  const averageScore =
    results.reduce((sum, r) => sum + r.score, 0) / results.length;

  // Find common violations
  const violationCounts = new Map<string, number>();
  for (const result of results) {
    for (const violation of result.violations) {
      const count = violationCounts.get(violation.term) || 0;
      violationCounts.set(violation.term, count + 1);
    }
  }

  const commonViolations = Array.from(violationCounts.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    results,
    summary: {
      total: texts.length,
      passed,
      failed: texts.length - passed,
      averageScore: Math.round(averageScore * 10) / 10,
      commonViolations,
    },
  };
}
