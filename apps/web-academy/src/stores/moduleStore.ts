// ═══════════════════════════════════════════════════════════
// MODULE STORE
// Zustand store for Interactive Learning Module state
// ═══════════════════════════════════════════════════════════

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContentMode, LearningSection } from "@/data/modules/types";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface ModuleState {
  // Current module
  currentModule: string | null;
  currentSectionIndex: number;
  currentCardIndex: number;

  // User preferences
  mode: ContentMode;

  // Progress (v2 economy)
  xpEarned: number;
  shardsEarned: number;
  levelsCompleted: number[];
  sectionsUnlocked: Record<string, boolean>;
  answers: Record<string, { optionId: string; isCorrect: boolean; attempts: number }>;
}

interface ModuleActions {
  // Module lifecycle
  startModule: (moduleId: string, sections: LearningSection[]) => void;
  resetModule: () => void;

  // Navigation
  nextCard: (sections: LearningSection[]) => boolean;
  prevCard: (sections: LearningSection[]) => boolean;

  // Mode
  toggleMode: () => void;
  setMode: (mode: ContentMode) => void;

  // Answering
  recordAnswer: (cardId: string, optionId: string, isCorrect: boolean, attempts: number) => void;

  // Section unlock
  unlockSection: (sectionId: string) => void;
  getSectionProgress: () => Record<string, boolean>;

  // Progress restoration
  restoreProgress: (
    sectionIndex: number,
    cardIndex: number,
    mode: ContentMode,
    sectionsUnlocked: Record<string, boolean>,
    answers: Record<string, { optionId: string; isCorrect: boolean; attempts: number }>,
    crystalsEarned: number,
  ) => void;
}

type ModuleStore = ModuleState & ModuleActions;

// ─────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────

const initialState: ModuleState = {
  currentModule: null,
  currentSectionIndex: 0,
  currentCardIndex: 0,
  mode: "athlete",
  xpEarned: 0,
  shardsEarned: 0,
  levelsCompleted: [],
  sectionsUnlocked: {},
  answers: {},
};

// ─────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────

export const useModuleStore = create<ModuleStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ─────────────────────────────────────────────────────────
      // MODULE LIFECYCLE
      // ─────────────────────────────────────────────────────────

      startModule: (moduleId: string, sections: LearningSection[]) => {
        const firstSectionId = sections[0]?.id ?? "";
        set({
          currentModule: moduleId,
          currentSectionIndex: 0,
          currentCardIndex: 0,
          xpEarned: 0,
          shardsEarned: 0,
          levelsCompleted: [],
          sectionsUnlocked: { [firstSectionId]: true },
          answers: {},
        });
      },

      resetModule: () => {
        set(initialState);
      },

      // ─────────────────────────────────────────────────────────
      // NAVIGATION
      // ─────────────────────────────────────────────────────────

      nextCard: (sections: LearningSection[]) => {
        const state = get();
        const currentSection = sections[state.currentSectionIndex];
        if (!currentSection) return false;

        // Try to advance within current section
        if (state.currentCardIndex < currentSection.cards.length - 1) {
          set({ currentCardIndex: state.currentCardIndex + 1 });
          return true;
        }

        // Try to advance to next section
        if (state.currentSectionIndex < sections.length - 1) {
          const nextSection = sections[state.currentSectionIndex + 1];

          // Check if next section is unlocked
          if (state.sectionsUnlocked[nextSection.id]) {
            set({
              currentSectionIndex: state.currentSectionIndex + 1,
              currentCardIndex: 0,
            });
            return true;
          }
        }

        return false;
      },

      prevCard: (sections: LearningSection[]) => {
        const state = get();
        if (!sections.length) return false;

        // Try to go back within current section
        if (state.currentCardIndex > 0) {
          set({ currentCardIndex: state.currentCardIndex - 1 });
          return true;
        }

        // Try to go back to previous section
        if (state.currentSectionIndex > 0) {
          const prevSection = sections[state.currentSectionIndex - 1];
          set({
            currentSectionIndex: state.currentSectionIndex - 1,
            currentCardIndex: prevSection.cards.length - 1,
          });
          return true;
        }

        return false;
      },

      // ─────────────────────────────────────────────────────────
      // MODE
      // ─────────────────────────────────────────────────────────

      toggleMode: () => {
        set((state) => ({
          mode: state.mode === "athlete" ? "parent" : "athlete",
        }));
      },

      setMode: (mode: ContentMode) => {
        set({ mode });
      },

      // ─────────────────────────────────────────────────────────
      // ANSWERING
      // ─────────────────────────────────────────────────────────

      recordAnswer: (cardId: string, optionId: string, isCorrect: boolean, attempts: number) => {
        const state = get();
        const existingAnswer = state.answers[cardId];
        const wasAlreadyCorrect = existingAnswer?.isCorrect ?? false;

        // Calculate XP only for first correct answer (v2 economy)
        // First try: +5 XP, Retry: +2 XP
        let xpToAdd = 0;
        if (isCorrect && !wasAlreadyCorrect) {
          xpToAdd = attempts === 1 ? 5 : 2;
        }

        set({
          answers: {
            ...state.answers,
            [cardId]: {
              optionId,
              isCorrect: isCorrect || wasAlreadyCorrect,
              attempts,
            },
          },
          xpEarned: state.xpEarned + xpToAdd,
        });
      },

      // ─────────────────────────────────────────────────────────
      // SECTION UNLOCK
      // ─────────────────────────────────────────────────────────

      unlockSection: (sectionId: string) => {
        set((state) => ({
          sectionsUnlocked: {
            ...state.sectionsUnlocked,
            [sectionId]: true,
          },
        }));
      },

      getSectionProgress: () => {
        return get().sectionsUnlocked;
      },

      // ─────────────────────────────────────────────────────────
      // PROGRESS RESTORATION
      // ─────────────────────────────────────────────────────────

      restoreProgress: (
        sectionIndex: number,
        cardIndex: number,
        mode: ContentMode,
        sectionsUnlocked: Record<string, boolean>,
        answers: Record<string, { optionId: string; isCorrect: boolean; attempts: number }>,
        xpEarned: number,
      ) => {
        set({
          currentSectionIndex: sectionIndex,
          currentCardIndex: cardIndex,
          mode,
          sectionsUnlocked,
          answers,
          xpEarned,
        });
      },
    }),
    {
      name: "yp-module-store",
      // Only persist mode preference
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);

// ─────────────────────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────────────────────

export const selectCurrentModule = (state: ModuleStore) => state.currentModule;
export const selectMode = (state: ModuleStore) => state.mode;
export const selectXpEarned = (state: ModuleStore) => state.xpEarned;
export const selectShardsEarned = (state: ModuleStore) => state.shardsEarned;
export const selectAnswers = (state: ModuleStore) => state.answers;
