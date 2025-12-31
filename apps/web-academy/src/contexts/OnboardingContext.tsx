// ═══════════════════════════════════════════════════════════
// ONBOARDING CONTEXT
// State management for the onboarding flow
// Handles both Athlete and Parent paths
// ═══════════════════════════════════════════════════════════

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type UserRole = 'athlete' | 'parent' | null;
export type ProgramId = 'foundation_42_day'; // Single track - no decision fatigue
export type Subscription = 'monthly' | 'annual' | null;
export type SubscriptionStatus = 'free' | 'pro';
export type WolfColor = 'black' | 'white' | 'gray' | 'brown';

// Foundation Program Config
export const FOUNDATION_PROGRAM = {
  id: 'foundation_42_day' as ProgramId,
  name: 'Foundation',
  duration: 42,
  description: '42-Day Durability Program',
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
  athleteName: '',
  athleteAge: null,
  avatarColor: 'black',
  parentCode: '',
  sponsorName: '',
  sports: [],
  subscriptionStatus: 'free', // Default to free, upgrade after payment
  email: '',
  subscription: null,
  athleteCodes: [],
  notificationsEnabled: false,
  onboardingComplete: false,
};

const STORAGE_KEY = 'barefoot_onboarding_state';

// ─────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(DEFAULT_DATA);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Don't restore if onboarding was completed
          if (!parsed.onboardingComplete) {
            setData(prev => ({ ...prev, ...parsed }));
          }
        } catch (e) {
          console.error('Failed to parse onboarding state:', e);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage on change
  const saveProgress = useCallback(() => {
    if (typeof window !== 'undefined' && isHydrated) {
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
    setData(prev => ({ ...prev, role }));
  }, []);

  // Auto-assign Foundation program - called before AthleteReady screen
  const assignFoundationProgram = useCallback(() => {
    setData(prev => ({ ...prev, programId: FOUNDATION_PROGRAM.id }));
  }, []);

  const updateAthleteData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateParentData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const setStep = useCallback((step: number) => {
    setData(prev => ({ ...prev, step }));
  }, []);

  const nextStep = useCallback(() => {
    setData(prev => ({ ...prev, step: prev.step + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setData(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));
  }, []);

  // ─────────────────────────────────────────────────────────────
  // VALIDATION
  // ─────────────────────────────────────────────────────────────

  const validateParentCode = useCallback(async (code: string): Promise<{ valid: boolean; sponsorName?: string }> => {
    // TODO: Replace with actual Supabase validation
    // For now, mock validation - any 6 char alphanumeric code works
    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock: Accept any 6-character code for testing
    // In production, this would validate against the database and return real sponsor name
    if (cleanCode.length === 6) {
      // Mock sponsor name - in production this comes from DB lookup
      const mockSponsorName = 'David';
      setData(prev => ({ ...prev, parentCode: cleanCode, sponsorName: mockSponsorName }));
      return { valid: true, sponsorName: mockSponsorName };
    }
    return { valid: false };
  }, []);

  const generateAthleteCode = useCallback((): string => {
    // Generate a random 6-character alphanumeric code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars (0,O,1,I)
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Add to athlete codes list
    setData(prev => ({
      ...prev,
      athleteCodes: [...prev.athleteCodes, code],
    }));

    return code;
  }, []);

  // ─────────────────────────────────────────────────────────────
  // COMPLETION
  // ─────────────────────────────────────────────────────────────

  const completeOnboarding = useCallback(async () => {
    // TODO: Submit to Supabase
    console.log('Onboarding Complete:', data);

    setData(prev => ({ ...prev, onboardingComplete: true }));

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [data]);

  const resetOnboarding = useCallback(() => {
    setData(DEFAULT_DATA);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const loadProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load onboarding state:', e);
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
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

export default OnboardingContext;
