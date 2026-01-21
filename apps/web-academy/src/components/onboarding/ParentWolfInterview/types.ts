// ═══════════════════════════════════════════════════════════
// PARENT WOLF INTERVIEW TYPES
// Conversational onboarding for parents to "program" Wolf
// ═══════════════════════════════════════════════════════════

import type { WolfPersonality } from "@/contexts/OnboardingContext";

export type ConversationStep =
  | "greeting"
  | "name"
  | "age"
  | "sport"
  | "injuries"
  | "personality"
  | "confirmation";

export interface Message {
  id: string;
  sender: "wolf" | "parent";
  content: string;
  timestamp: number;
}

export interface InterviewResult {
  athleteName: string;
  athleteAge: number;
  sport: string;
  injuries: string | null;
  wolfPersonality: WolfPersonality;
}

export interface QuickReply {
  id: string;
  label: string;
  value: string;
  emoji?: string;
}

export interface ConversationConfig {
  step: ConversationStep;
  wolfMessage: string | ((name: string) => string);
  inputType: "text" | "number" | "select" | "quick-reply" | "personality";
  placeholder?: string;
  quickReplies?: QuickReply[];
  validation?: (value: string) => boolean;
  nextStep: ConversationStep | null;
}

// Sport options
export const SPORTS: QuickReply[] = [
  { id: "basketball", label: "Basketball", value: "basketball", emoji: "🏀" },
  { id: "soccer", label: "Soccer", value: "soccer", emoji: "⚽" },
  { id: "football", label: "Football", value: "football", emoji: "🏈" },
  { id: "baseball", label: "Baseball", value: "baseball", emoji: "⚾" },
  { id: "volleyball", label: "Volleyball", value: "volleyball", emoji: "🏐" },
  { id: "track", label: "Track", value: "track", emoji: "🏃" },
  { id: "tennis", label: "Tennis", value: "tennis", emoji: "🎾" },
  { id: "swimming", label: "Swimming", value: "swimming", emoji: "🏊" },
];

// Personality options with sample dialogue
export const PERSONALITIES: {
  id: WolfPersonality;
  name: string;
  emoji: string;
  description: string;
  sample: string;
}[] = [
  {
    id: "hype",
    name: "Hype Coach",
    emoji: "🔥",
    description: "High energy, lots of encouragement",
    sample: "LET'S GO! You're about to crush this!",
  },
  {
    id: "chill",
    name: "Chill Mentor",
    emoji: "🧘",
    description: "Calm, supportive, patient",
    sample: "Good work. Take your time with each movement.",
  },
  {
    id: "drill",
    name: "Drill Sergeant",
    emoji: "🎖️",
    description: "Direct, challenging, no-nonsense",
    sample: "Time to work. 3 sets, no excuses. Execute.",
  },
  {
    id: "friend",
    name: "Best Friend",
    emoji: "🤝",
    description: "Fun, casual, game-like",
    sample: "Hey! Ready to level up today?",
  },
];
