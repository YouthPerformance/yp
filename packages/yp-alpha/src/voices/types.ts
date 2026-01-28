/**
 * Expert Voice System Types
 *
 * Defines the structure for expert-specific voice profiles used in
 * content generation and AI interactions.
 */

/** Content expert IDs (athlete-facing) */
export type ContentExpertId = "JAMES" | "ADAM" | "YP" | "TEAM_YP";

/** COS expert IDs (internal team) */
export type COSExpertId = "MIKE_COS" | "JAMES_COS" | "ADAM_COS" | "ANNIE_COS";

/** All expert IDs */
export type ExpertId = ContentExpertId | COSExpertId;

export type ContentDomain =
  | "barefoot-training"
  | "basketball"
  | "speed-agility"
  | "strength-training"
  | "injury-prevention"
  | "movement"
  | "shooting"
  | "ball-handling"
  | "footwork";

export interface ExpertVoice {
  /** Unique identifier */
  id: ExpertId;

  /** Display name */
  name: string;

  /** Professional title/tagline */
  title: string;

  /** Content domains this expert owns */
  domains: ContentDomain[];

  /** Credentials for authority (used in author boxes) */
  credentials: string[];

  // ─────────────────────────────────────────────────────────────
  // PROMPT ENGINEERING
  // ─────────────────────────────────────────────────────────────

  /** System prompt prefix injected before content generation */
  systemPromptPrefix: string;

  /** Signature opening hooks (e.g., "Weak feet don't eat...") */
  signatureHooks: string[];

  /** How this expert phrases things */
  speechPatterns: string[];

  /** Example quotes in their authentic voice */
  exampleQuotes: string[];

  // ─────────────────────────────────────────────────────────────
  // VOICE ENFORCEMENT
  // ─────────────────────────────────────────────────────────────

  /** Words this expert would NEVER use */
  bannedWords: string[];

  /** Word replacements (generic → expert-preferred) */
  preferredTerms: Record<string, string>;

  /** Tone descriptor for prompt engineering */
  toneDescriptor: string;

  /** Things to always include */
  mustInclude: string[];

  /** Things to always avoid */
  mustAvoid: string[];

  // ─────────────────────────────────────────────────────────────
  // CONTENT GENERATION
  // ─────────────────────────────────────────────────────────────

  /** How to sign off content (e.g., "— James Scott, Movement Specialist") */
  signatureBlock: string;

  /** Coach voice callout format */
  coachVoicePrefix: string;

  /** Default CTA for this expert's content */
  defaultCTA: {
    text: string;
    url: string;
  };
}

/**
 * Chief of Staff Voice Profile
 * Extended voice profile for Tom COS instances
 */
export interface COSVoice extends Omit<ExpertVoice, "domains" | "credentials" | "defaultCTA"> {
  /** Special tools this COS can trigger */
  specialTools?: (
    | "PRODUCT_VISUALIZATION"
    | "TREND_SEARCH"
    | "RESEARCH_DIGEST"
    | "POLICY_DRAFT"
    | "EXECUTIVE_SUMMARY"
  )[];
}

/**
 * Tom User ID type
 */
export type TomUserId = "mike" | "james" | "adam" | "annie";

/**
 * Content generation request for a specific expert
 */
export interface ContentGenerationRequest {
  /** Which expert should write this */
  expertId: ExpertId;

  /** Content type */
  contentType: "pillar" | "topic" | "qa" | "drill";

  /** Topic/title */
  topic: string;

  /** Primary category */
  category: string;

  /** Subcategory if applicable */
  subcategory?: string;

  /** Target age range (for age-specific content) */
  targetAge?: number | { min: number; max: number };

  /** Target sport (for sport-specific barefoot content) */
  targetSport?: string;

  /** Additional context for generation */
  additionalContext?: string;

  /** Keywords to target */
  targetKeywords?: string[];
}

/**
 * Generated content output
 */
export interface GeneratedContent {
  /** URL-safe slug */
  slug: string;

  /** Page title */
  title: string;

  /** Full frontmatter object */
  frontmatter: Record<string, unknown>;

  /** MDX/Markdown body content */
  body: string;

  /** Expert who generated it */
  author: ExpertId;

  /** Generation metadata */
  metadata: {
    generatedAt: number;
    model: string;
    promptTokens: number;
    completionTokens: number;
  };
}
