/**
 * Tom Chief of Staff Types
 * ========================
 *
 * Type definitions for the Tom AI COS system.
 */

// ─────────────────────────────────────────────────────────────
// USER TYPES
// ─────────────────────────────────────────────────────────────

export type TomUserId = "mike" | "james" | "adam" | "annie";

// ─────────────────────────────────────────────────────────────
// PERSONALITY MODES
// ─────────────────────────────────────────────────────────────

export type PersonalityMode = "jarvis" | "robbins" | "lasso" | "auto";

// ─────────────────────────────────────────────────────────────
// INTENT CLASSIFICATION
// ─────────────────────────────────────────────────────────────

export type TomIntentType =
  | "GENERAL_CHAT"
  | "TASK_CAPTURE"
  | "PRODUCT_VISUALIZATION"
  | "TREND_SEARCH"
  | "RESEARCH_DIGEST"
  | "POLICY_DRAFT"
  | "EXECUTIVE_SUMMARY";

export interface TomIntent {
  intent: TomIntentType;
  confidence: number;
  extractedDetails?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// VOICE INTERFACES
// ─────────────────────────────────────────────────────────────

export interface TomVoice {
  id: string;
  userId: TomUserId;
  displayName: string;
  role: string;
  personalityMode: PersonalityMode;

  /** Core system prompt (includes all three personas) */
  systemPrompt: string;

  /** Mode-specific overrides */
  modePrompts: Record<PersonalityMode, string>;

  /** Auto-detection patterns */
  modeTriggers: {
    jarvis: RegExp[];
    robbins: RegExp[];
    lasso: RegExp[];
  };

  /** Words Tom should never use */
  bannedWords: string[];

  /** Word replacements */
  preferredTerms: Record<string, string>;

  /** Signature catchphrases */
  signatureHooks: string[];

  /** Special tools this Tom instance can use */
  specialTools?: string[];
}

// ─────────────────────────────────────────────────────────────
// BRIEFING TYPES
// ─────────────────────────────────────────────────────────────

export interface TomBriefing {
  date: string;
  sections: {
    priorities: string;
    blockers: string;
    calendar: string;
    insights: string;
  };
}

export interface TomBriefingSections {
  priorities: string;
  blockers: string;
  calendar: string;
  insights: string;
}

// ─────────────────────────────────────────────────────────────
// CAPTURE TYPES
// ─────────────────────────────────────────────────────────────

export interface TomCapture {
  userId: TomUserId;
  content: string;
  source: "voice" | "text" | "whatsapp";
  messageId?: string;
}

export interface CaptureClassification {
  type: "task" | "note" | "idea" | "question";
  urgency: "high" | "medium" | "low";
  context: string;
  requiresResponse: boolean;
}

// ─────────────────────────────────────────────────────────────
// CALENDAR TYPES
// ─────────────────────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  attendees?: string[];
}

// ─────────────────────────────────────────────────────────────
// TREND TYPES
// ─────────────────────────────────────────────────────────────

export interface TrendingTopic {
  title: string;
  whyTrending: string;
  contentAngle: string;
  urgency: "🔴" | "🟡" | "🟢";
}

export type TrendCategory = "nba" | "youth_sports" | "basketball_skills" | "general";
