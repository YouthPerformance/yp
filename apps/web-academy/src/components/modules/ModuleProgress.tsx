// ═══════════════════════════════════════════════════════════
// MODULE PROGRESS
// Overall progress indicator for the learning module
// ═══════════════════════════════════════════════════════════

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock } from 'lucide-react';
import type { LearningSection } from '@/data/modules/types';

interface ModuleProgressProps {
  sections: LearningSection[];
  currentSectionIndex: number;
  currentCardIndex: number;
  sectionProgress: Record<string, boolean>;
  className?: string;
}

export function ModuleProgress({
  sections,
  currentSectionIndex,
  currentCardIndex,
  sectionProgress,
  className = '',
}: ModuleProgressProps) {
  // Calculate total progress
  const totalCards = sections.reduce((sum, s) => sum + s.cards.length, 0);
  let cardsCompleted = 0;

  for (let i = 0; i < currentSectionIndex; i++) {
    cardsCompleted += sections[i].cards.length;
  }
  cardsCompleted += currentCardIndex;

  const progressPercent = Math.round((cardsCompleted / totalCards) * 100);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Overall progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-primary to-accent-primary-hover rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <span className="text-sm font-medium text-accent-primary min-w-[3rem] text-right">
          {progressPercent}%
        </span>
      </div>

      {/* Section indicators */}
      <div className="flex justify-between gap-1">
        {sections.map((section, idx) => {
          const isCompleted = idx < currentSectionIndex;
          const isCurrent = idx === currentSectionIndex;
          const isLocked = !sectionProgress[section.id] && idx > 0;
          const sectionCards = section.cards.length;
          const sectionCardsCompleted = isCurrent ? currentCardIndex : isCompleted ? sectionCards : 0;

          return (
            <div
              key={section.id}
              className="flex-1 flex flex-col items-center gap-1"
            >
              {/* Section indicator */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  border-2 transition-all
                  ${
                    isCompleted
                      ? 'bg-accent-primary border-accent-primary'
                      : isCurrent
                        ? 'border-accent-primary bg-accent-primary/20'
                        : isLocked
                          ? 'border-border-default bg-bg-tertiary'
                          : 'border-border-default bg-bg-secondary'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-black" />
                ) : isLocked ? (
                  <Lock className="w-3 h-3 text-text-tertiary" />
                ) : (
                  <span
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-accent-primary' : 'text-text-tertiary'
                    }`}
                  >
                    {idx + 1}
                  </span>
                )}
              </div>

              {/* Section progress bar */}
              <div className="w-full h-1 bg-bg-tertiary rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    isCompleted
                      ? 'bg-accent-primary'
                      : isCurrent
                        ? 'bg-accent-primary/70'
                        : 'bg-transparent'
                  }`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(sectionCardsCompleted / sectionCards) * 100}%`,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPACT VARIANT
// For use in card header
// ─────────────────────────────────────────────────────────────

interface CompactProgressProps {
  currentSection: number;
  totalSections: number;
  currentCard: number;
  totalCards: number;
}

export function CompactProgress({
  currentSection,
  totalSections,
  currentCard,
  totalCards,
}: CompactProgressProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-text-tertiary">
        Section {currentSection + 1}/{totalSections}
      </span>
      <span className="text-border-default">•</span>
      <span className="text-text-secondary">
        {currentCard + 1}/{totalCards}
      </span>
    </div>
  );
}
