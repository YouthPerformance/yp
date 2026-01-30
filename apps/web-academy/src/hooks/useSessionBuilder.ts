"use client";

import { useState, useCallback, useMemo } from "react";
import type { DrillData } from "@/components/pillar/DrillCard";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface SessionBuilderState {
  duration: string;
  floor: string;
  difficulty: string;
  noiseCap: number;
}

export interface SessionBuilderResult {
  drills: DrillData[];
  totalDuration: number;
  totalXP: number;
  sessionMeta: string;
}

export interface UseSessionBuilderOptions {
  availableDrills: DrillData[];
  defaultState?: Partial<SessionBuilderState>;
}

// Default state
const DEFAULT_STATE: SessionBuilderState = {
  duration: "20",
  floor: "carpet",
  difficulty: "intermediate",
  noiseCap: 40,
};

// ═══════════════════════════════════════════════════════════
// HOOK
// Form state management for the session builder with
// protocol generation logic.
// ═══════════════════════════════════════════════════════════

export function useSessionBuilder({
  availableDrills,
  defaultState = {},
}: UseSessionBuilderOptions) {
  const [state, setState] = useState<SessionBuilderState>({
    ...DEFAULT_STATE,
    ...defaultState,
  });

  const [generatedProtocol, setGeneratedProtocol] = useState<SessionBuilderResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Update a single field
  const updateField = useCallback(
    <K extends keyof SessionBuilderState>(key: K, value: SessionBuilderState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Reset to defaults
  const reset = useCallback(() => {
    setState({ ...DEFAULT_STATE, ...defaultState });
    setGeneratedProtocol(null);
  }, [defaultState]);

  // Generate protocol based on current state
  const generateProtocol = useCallback(() => {
    setIsGenerating(true);

    // Parse target duration in minutes
    const targetMinutes = parseInt(state.duration, 10);

    // Parse noise level from string (e.g., "<40dB" -> 40)
    const parseNoiseLevel = (noiseStr: string): number => {
      const match = noiseStr.match(/\d+/);
      return match ? parseInt(match[0], 10) : 50;
    };

    // Filter drills based on constraints
    const eligibleDrills = availableDrills.filter((drill) => {
      const drillNoise = parseNoiseLevel(drill.noiseLevel);
      return drillNoise <= state.noiseCap;
    });

    // Sort by difficulty preference
    const difficultyOrder = {
      beginner: state.difficulty === "beginner" ? 0 : state.difficulty === "intermediate" ? 1 : 2,
      intermediate: state.difficulty === "intermediate" ? 0 : 1,
      advanced: state.difficulty === "advanced" ? 0 : state.difficulty === "intermediate" ? 1 : 2,
    };

    const sortedDrills = [...eligibleDrills].sort((a, b) => {
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

    // Select drills to fit target duration
    const selectedDrills: DrillData[] = [];
    let totalMinutes = 0;

    for (const drill of sortedDrills) {
      const drillMinutes = parseInt(drill.duration, 10) || 3;
      if (totalMinutes + drillMinutes <= targetMinutes) {
        selectedDrills.push(drill);
        totalMinutes += drillMinutes;
      }
      if (totalMinutes >= targetMinutes) break;
    }

    // Calculate total XP
    const totalXP = selectedDrills.reduce((sum, d) => sum + (d.xp || 50), 0);

    // Build session meta string
    const sessionMeta = `${state.duration}m · ${state.floor.charAt(0).toUpperCase() + state.floor.slice(1)} · <${state.noiseCap}dB`;

    const result: SessionBuilderResult = {
      drills: selectedDrills,
      totalDuration: totalMinutes,
      totalXP,
      sessionMeta,
    };

    // Simulate async generation
    setTimeout(() => {
      setGeneratedProtocol(result);
      setIsGenerating(false);
    }, 300);

    return result;
  }, [state, availableDrills]);

  // Derived values
  const hasProtocol = generatedProtocol !== null && generatedProtocol.drills.length > 0;

  return {
    state,
    updateField,
    reset,
    generateProtocol,
    generatedProtocol,
    isGenerating,
    hasProtocol,
  };
}

export default useSessionBuilder;
