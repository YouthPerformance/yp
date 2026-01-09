// ═══════════════════════════════════════════════════════════
// ONBOARDING CONTEXT
// State management for the onboarding flow
// Handles both Athlete and Parent paths
// ═══════════════════════════════════════════════════════════

"use client";

import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────
// FEATURE FLAGS
// ─────────────────────────────────────────────────────────────

/**
 * Parent flow is now live with:
 * - BetterAuth signup
 * - COPPA compliance for under-13
 * - Wolf personality programming
 */
export const PARENT_FLOW_ENABLED = true;

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type UserRole = "athlete" | "parent" | null;
export type ProgramId = "foundation_42_day"; // Single track - no decision fatigue
export type Subscription = "monthly" | "annual" | null;
export type SubscriptionStatus = "free" | "pro";
export type WolfColor = "black" | "white" | "gray" | "brown";

// Parent-first onboarding types
export type WolfPersonality = "hype" | "chill" | "drill" | "friend";
export type AthleteGoal =
  | "get_faster"
  | "jump_higher"
  | "build_strength"
  | "prevent_injuries"
  | "make_team"
  | "have_fun";
export type TrainingTime = "morning" | "after_school" | "evening";
export type Motivation = "competition" | "personal_bests" | "fun";

// Foundation Program Config
export const FOUNDATION_PROGRAM = {
  id: "foundation_42_day" as ProgramId,
  name: "Foundation",
  duration: 42,
  description: "42-Day Durability Program",
} as const;

export interface OnboardingData {
  // Flow tracking
  step: number;
  role: UserRole;
  programId: ProgramId | null; // Auto-assigned, no selection screen

  // Athlete fields
  athleteName: string;
  athleteAge: number | null;
  avatarColor: WolfColor;
  parentCode: string;
  sponsorName: string; // Parent name from code validation
  sports: string[]; // Multiple favorite sports
  subscriptionStatus: SubscriptionStatus; // For dashboard gating

  // Parent fields
  email: string;
  subscription: Subscription;
  athleteCodes: string[];

  // Parent-First Onboarding (spec 007)
  // COPPA Compliance
  coppaConsentGiven: boolean;
  coppaConsentDate: string | null; // ISO date string

  // Athlete Profile (parent fills out)
  athleteExperience: "beginner" | "intermediate" | "advanced" | null;
  athleteGoals: AthleteGoal[];
  athleteTrainingDays: number | null; // Days per week
  athleteTrainingTime: TrainingTime | null;
  athleteLimitations: string; // Injuries or restrictions
  athleteMotivation: Motivation | null;

  // Wolf Programming
  wolfPersonality: WolfPersonality | null;
  parentContext: string; // The "programming" text for Wolf AI

  // Invite System
  inviteCode: string | null; // Generated code for kid

  // Settings
  notificationsEnabled: boolean;
  onboardingComplete: boolean;
}

interface OnboardingContextType {
  data: OnboardingData;

  // Actions
  setRole: (role: UserRole) => void;
  assignFoundationProgram: () => void; // Auto-assign, no selection
  updateAthleteData: (updates: Partial<OnboardingData>) => void;
  updateParentData: (updates: Partial<OnboardingData>) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Validation
  validateParentCode: (code: string) => Promise<{ valid: boolean; sponsorName?: string }>;
  generateAthleteCode: () => string;

  // Parent-First Onboarding (spec 007)
  generateInviteCode: () => string;
  setCoppaConsent: (consented: boolean) => void;

  // Completion
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => void;

  // Persistence
  saveProgress: () => void;
  loadProgress: () => void;
}

// ─────────────────────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────────────────────

const DEFAULT_DATA: OnboardingData = {
  step: 0,
  role: null,
  programId: null, // Will be auto-assigned to 'foundation_42_day'
  athleteName: "",
  athleteAge: null,
  avatarColor: "black",
  parentCode: "",
  sponsorName: "",
  sports: [],
  subscriptionStatus: "free", // Default to free, upgrade after payment
  email: "",
  subscription: null,
  athleteCodes: [],
  // Parent-first fields
  coppaConsentGiven: false,
  coppaConsentDate: null,
  athleteExperience: null,
  athleteGoals: [],
  athleteTrainingDays: null,
  athleteTrainingTime: null,
  athleteLimitations: "",
  athleteMotivation: null,
  wolfPersonality: null,
  parentContext: "",
  inviteCode: null,
  // Settings
  notificationsEnabled: false,
  onboardingComplete: false,
};

const STORAGE_KEY = "barefoot_onboarding_state";

// ─────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(DEFAULT_DATA);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Don't restore if onboarding was completed
          if (!parsed.onboardingComplete) {
            setData((prev) => ({ ...prev, ...parsed }));
          }
        } catch (e) {
          console.error("Failed to parse onboarding state:", e);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage on change
  const saveProgress = useCallback(() => {
    if (typeof window !== "undefined" && isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isHydrated]);

  // Auto-save on data change
  useEffect(() => {
    if (isHydrated && !data.onboardingComplete) {
      saveProgress();
    }
  }, [data, isHydrated, saveProgress]);

  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────

  const setRole = useCallback((role: UserRole) => {
    setData((prev) => ({ ...prev, role }));
  }, []);

  // Auto-assign Foundation program - called before AthleteReady screen
  const assignFoundationProgram = useCallback(() => {
    setData((prev) => ({ ...prev, programId: FOUNDATION_PROGRAM.id }));
  }, []);

  const updateAthleteData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateParentData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const setStep = useCallback((step: number) => {
    setData((prev) => ({ ...prev, step }));
  }, []);

  const nextStep = useCallback(() => {
    setData((prev) => ({ ...prev, step: prev.step + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setData((prev) => ({ ...prev, step: Math.max(0, prev.step - 1) }));
  }, []);

  // ─────────────────────────────────────────────────────────────
  // VALIDATION
  // ─────────────────────────────────────────────────────────────

  const validateParentCode = useCallback(
    async (code: string): Promise<{ valid: boolean; sponsorName?: string }> => {
      // TODO: Replace with actual Supabase validation
      // For now, mock validation - any 6 char alphanumeric code works
      const cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, "");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock: Accept any 6-character code for testing
      // In production, this would validate against the database and return real sponsor name
      if (cleanCode.length === 6) {
        // Mock sponsor name - in production this comes from DB lookup
        const mockSponsorName = "David";
        setData((prev) => ({ ...prev, parentCode: cleanCode, sponsorName: mockSponsorName }));
        return { valid: true, sponsorName: mockSponsorName };
      }
      return { valid: false };
    },
    [],
  );

  const generateAthleteCode = useCallback((): string => {
    // Generate a random 6-character alphanumeric code
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude confusing chars (0,O,1,I)
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Add to athlete codes list
    setData((prev) => ({
      ...prev,
      athleteCodes: [...prev.athleteCodes, code],
    }));

    return code;
  }, []);

  // Generate invite code in WOLF-XXXX-XX format (spec 007)
  const generateInviteCode = useCallback((): string => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const part1 = Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
    const part2 = Array.from({ length: 2 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
    const code = `WOLF-${part1}-${part2}`;

    setData((prev) => ({
      ...prev,
      inviteCode: code,
      athleteCodes: [...prev.athleteCodes, code],
    }));

    return code;
  }, []);

  // Record COPPA consent
  const setCoppaConsent = useCallback((consented: boolean) => {
    setData((prev) => ({
      ...prev,
      coppaConsentGiven: consented,
      coppaConsentDate: consented ? new Date().toISOString() : null,
    }));
  }, []);

  // ─────────────────────────────────────────────────────────────
  // COMPLETION
  // ─────────────────────────────────────────────────────────────

  const completeOnboarding = useCallback(async () => {
    // TODO: Submit to Supabase when backend is ready
    setData((prev) => ({ ...prev, onboardingComplete: true }));

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const resetOnboarding = useCallback(() => {
    setData(DEFAULT_DATA);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const loadProgress = useCallback(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load onboarding state:", e);
        }
      }
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // PROVIDER
  // ─────────────────────────────────────────────────────────────

  return (
    <OnboardingContext.Provider
      value={{
        data,
        setRole,
        assignFoundationProgram,
        updateAthleteData,
        updateParentData,
        setStep,
        nextStep,
        prevStep,
        validateParentCode,
        generateAthleteCode,
        generateInviteCode,
        setCoppaConsent,
        completeOnboarding,
        resetOnboarding,
        saveProgress,
        loadProgress,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}

export default OnboardingContext;
