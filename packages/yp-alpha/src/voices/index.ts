/**
 * Expert Voice System
 *
 * Routes content generation to the appropriate expert voice based on
 * domain, topic, and explicit assignment.
 */

// Content Expert Voices (athlete-facing)
export { adamHarringtonVoice } from "./adam-harrington";
export { jamesScottVoice } from "./james-scott";
export { preLaunchContentPlan, teamYPCategories, teamYPVoice } from "./team-yp";
export { ypBrandVoice } from "./yp-brand";

// COS Voices (internal team - Tom)
export { mikeDiCOSVoice } from "./mike-di-cos";
export { jamesScottCOSVoice } from "./james-scott-cos";
export { adamHarringtonCOSVoice } from "./adam-harrington-cos";
export { annieOpsCOSVoice } from "./annie-ops-cos";

// Types
export * from "./types";

import { adamHarringtonVoice } from "./adam-harrington";
import { jamesScottVoice } from "./james-scott";
import { teamYPVoice } from "./team-yp";
import { ypBrandVoice } from "./yp-brand";
import { mikeDiCOSVoice } from "./mike-di-cos";
import { jamesScottCOSVoice } from "./james-scott-cos";
import { adamHarringtonCOSVoice } from "./adam-harrington-cos";
import { annieOpsCOSVoice } from "./annie-ops-cos";
import type { ContentDomain, ContentExpertId, COSExpertId, COSVoice, ExpertId, ExpertVoice } from "./types";

// ─────────────────────────────────────────────────────────────
// CONTENT EXPERT VOICE REGISTRY (Athlete-facing)
// ─────────────────────────────────────────────────────────────

export const expertVoices: Record<ContentExpertId, ExpertVoice> = {
  JAMES: jamesScottVoice,
  ADAM: adamHarringtonVoice,
  YP: ypBrandVoice,
  TEAM_YP: teamYPVoice,
};

// ─────────────────────────────────────────────────────────────
// COS VOICE REGISTRY (Internal team - Tom)
// ─────────────────────────────────────────────────────────────

export const cosVoices: Record<COSExpertId, COSVoice> = {
  MIKE_COS: mikeDiCOSVoice,
  JAMES_COS: jamesScottCOSVoice,
  ADAM_COS: adamHarringtonCOSVoice,
  ANNIE_COS: annieOpsCOSVoice,
};

// ─────────────────────────────────────────────────────────────
// DOMAIN ROUTING
// ─────────────────────────────────────────────────────────────

/**
 * Maps content domains to their primary expert owner.
 * Used for automatic expert assignment when not explicitly specified.
 */
export const domainOwnership: Record<ContentDomain, ContentExpertId> = {
  // James Scott domains
  "barefoot-training": "JAMES",
  "speed-agility": "JAMES",
  "strength-training": "JAMES",
  "injury-prevention": "JAMES",
  movement: "JAMES",

  // Adam Harrington domains
  basketball: "ADAM",
  shooting: "ADAM",
  "ball-handling": "ADAM",
  footwork: "ADAM",
};

// ─────────────────────────────────────────────────────────────
// VOICE ROUTER
// ─────────────────────────────────────────────────────────────

/**
 * Get the content expert voice for a given expert ID
 */
export function getVoice(expertId: ContentExpertId): ExpertVoice {
  return expertVoices[expertId];
}

/**
 * Get the COS voice for a given COS expert ID
 */
export function getCOSVoice(expertId: COSExpertId): COSVoice {
  return cosVoices[expertId];
}

/**
 * Check if an expert ID is a COS voice
 */
export function isCOSExpertId(expertId: ExpertId): expertId is COSExpertId {
  return expertId.endsWith("_COS");
}

/**
 * Get the appropriate expert for a content domain
 */
export function getExpertForDomain(domain: ContentDomain): ContentExpertId {
  return domainOwnership[domain] || "YP";
}

/**
 * Get the expert voice for a content domain
 */
export function getVoiceForDomain(domain: ContentDomain): ExpertVoice {
  const expertId = getExpertForDomain(domain);
  return getVoice(expertId);
}

/**
 * Determine the best expert for a topic based on keywords
 */
export function inferExpertFromTopic(topic: string): ContentExpertId {
  const topicLower = topic.toLowerCase();

  // James Scott indicators
  const jamesKeywords = [
    "barefoot",
    "foot",
    "feet",
    "ankle",
    "mobility",
    "movement",
    "agility",
    "speed",
    "strength",
    "injury",
    "sever",
    "osgood",
    "plantar",
    "arch",
    "heel",
    "balance",
    "proprioception",
  ];

  // Adam Harrington indicators
  const adamKeywords = [
    "basketball",
    "shooting",
    "dribbl",
    "ball handling",
    "handles",
    "crossover",
    "layup",
    "free throw",
    "three point",
    "jump shot",
    "form",
    "release",
    "chicken wing",
    "follow through",
    "hoop",
    "court",
  ];

  // Score each expert
  const jamesScore = jamesKeywords.filter((kw) => topicLower.includes(kw)).length;
  const adamScore = adamKeywords.filter((kw) => topicLower.includes(kw)).length;

  if (jamesScore > adamScore) return "JAMES";
  if (adamScore > jamesScore) return "ADAM";
  return "YP"; // Default to brand voice if unclear
}

// ─────────────────────────────────────────────────────────────
// CONTENT GENERATION HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Build a system prompt for content generation with expert voice
 */
export function buildContentSystemPrompt(
  expert: ExpertVoice,
  contentType: "pillar" | "topic" | "qa" | "drill",
): string {
  const contentTypeInstructions = {
    pillar: `You are writing a comprehensive PILLAR PAGE (2,500-4,000 words).
This is an authoritative guide that will be cited by AI search engines.
Structure: Hero definition (40-60 words) → Table of Contents → 7-8 chapters → FAQ → CTA`,

    topic: `You are writing a TOPIC PAGE (1,200-2,000 words).
This is a focused sub-topic that links to a parent pillar.
Structure: Definition block → Why it matters → Core content → Common mistakes → Age modifications → Related content`,

    qa: `You are writing a PARENT SIDELINES Q&A page (800-1,200 words).
This is an AEO traffic magnet targeting a specific parent question.
Structure: Question as H1 → Direct answer (40-60 words) → Key takeaways → Full explanation → Expert insight → Recommended drill → CTA`,

    drill: `You are writing a DRILL CARD (400-600 words equivalent).
This is a structured, atomic content unit for a single exercise.
Structure: Title → Description → Steps (3-6) → Coaching cues (4) → Common mistake + fix → Duration/reps`,
  };

  return `${expert.systemPromptPrefix}

---

CONTENT TYPE: ${contentType.toUpperCase()}
${contentTypeInstructions[contentType]}

---

VOICE ENFORCEMENT:

Signature hooks to use (pick 1-2 where natural):
${expert.signatureHooks.map((h) => `- "${h}"`).join("\n")}

Speech patterns:
${expert.speechPatterns.map((p) => `- "${p}"`).join("\n")}

Words to AVOID: ${expert.bannedWords.join(", ")}

Word replacements (use the RIGHT term):
${Object.entries(expert.preferredTerms)
  .map(([wrong, right]) => `- "${wrong}" → "${right}"`)
  .join("\n")}

MUST INCLUDE:
${expert.mustInclude.map((m) => `- ${m}`).join("\n")}

MUST AVOID:
${expert.mustAvoid.map((m) => `- ${m}`).join("\n")}

---

Coach voice format: "${expert.coachVoicePrefix} [insight]"

Sign off as: ${expert.signatureBlock}`;
}

/**
 * Validate content against expert voice rules
 * Returns violations if any
 */
export function validateVoice(
  content: string,
  expert: ExpertVoice,
): { isValid: boolean; violations: string[] } {
  const violations: string[] = [];
  const contentLower = content.toLowerCase();

  // Check banned words
  for (const word of expert.bannedWords) {
    if (contentLower.includes(word.toLowerCase())) {
      violations.push(`Banned word detected: "${word}"`);
    }
  }

  // Check wrong terms that should be replaced
  for (const [wrong, right] of Object.entries(expert.preferredTerms)) {
    const wrongRegex = new RegExp(`\\b${wrong}\\b`, "gi");
    if (wrongRegex.test(content)) {
      violations.push(`Use "${right}" instead of "${wrong}"`);
    }
  }

  // Check for weak language
  const weakPatterns = [
    /\bmaybe\b/gi,
    /\bperhaps\b/gi,
    /\bmight\b/gi,
    /\bcould\b/gi,
    /\bi think\b/gi,
    /\bi believe\b/gi,
    /\bfeel free\b/gi,
    /\bno worries\b/gi,
  ];

  for (const pattern of weakPatterns) {
    if (pattern.test(content)) {
      violations.push(`Weak language detected: ${pattern.source}`);
    }
  }

  // Check exclamation mark count
  const exclamationCount = (content.match(/!/g) || []).length;
  if (exclamationCount > 3) {
    violations.push(`Too many exclamation marks (${exclamationCount}). Keep it under 3.`);
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}

/**
 * Auto-fix common voice violations
 */
export function enforceVoice(content: string, expert: ExpertVoice): string {
  let fixed = content;

  // Replace wrong terms with preferred terms
  for (const [wrong, right] of Object.entries(expert.preferredTerms)) {
    const regex = new RegExp(`\\b${wrong}\\b`, "gi");
    fixed = fixed.replace(regex, right);
  }

  // Remove weak language
  fixed = fixed.replace(/\bmaybe\s+/gi, "");
  fixed = fixed.replace(/\bperhaps\s+/gi, "");
  fixed = fixed.replace(/\bI think\s+/gi, "");
  fixed = fixed.replace(/\bfeel free to\s+/gi, "");

  return fixed;
}
