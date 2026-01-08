// ═══════════════════════════════════════════════════════════
// CARD SWIPER
// Vertical swipe container for navigating module cards
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useModuleStore } from '@/stores/moduleStore';
import { LessonCard, CheckCard, UnlockGate, CompletionCard } from './cards';
import type { LearningCard, LearningSection, ContentMode } from '@/data/modules/types';

interface CardSwiperProps {
  sections: LearningSection[];
  mode: ContentMode;
  onComplete: (stats: { score: number; totalChecks: number; xp: number; time: number }) => void;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY = 500;

export function CardSwiper({ sections, mode, onComplete }: CardSwiperProps) {
  const {
    currentSectionIndex,
    currentCardIndex,
    answers,
    xpEarned,
    nextCard,
    prevCard,
    recordAnswer,
    unlockSection,
    getSectionProgress,
  } = useModuleStore();

  const [startTime] = useState(() => Date.now());
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  const currentSection = sections[currentSectionIndex];
  const currentCard = currentSection?.cards[currentCardIndex];
  const sectionProgress = getSectionProgress();

  // Build flat card list with unlock gates
  const allCards = buildCardSequence(sections, sectionProgress);
  const flatIndex = getFlatIndex(sections, currentSectionIndex, currentCardIndex);

  const handleNext = useCallback(() => {
    // Don't advance if current card is a check that hasn't been answered correctly
    if (currentCard?.type === 'Check') {
      const answer = answers[currentCard.id];
      if (!answer?.isCorrect) return;
    }

    // Check if we need to show unlock gate
    const nextSection = sections[currentSectionIndex + 1];
    if (currentCardIndex === currentSection.cards.length - 1 && nextSection) {
      // End of section - check if next section is unlocked
      const totalCorrect = Object.values(answers).filter((a) => a.isCorrect).length;
      if (totalCorrect < nextSection.unlockThreshold) {
        // Show unlock gate (handled in card sequence)
      }
    }

    setDirection('up');
    nextCard(sections);
  }, [currentCard, currentSection, currentSectionIndex, currentCardIndex, answers, sections, nextCard]);

  const handlePrev = useCallback(() => {
    setDirection('down');
    prevCard(sections);
  }, [sections, prevCard]);

  // Handle swipe gesture
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;

      // Swipe up = next card
      if (offset.y < -SWIPE_THRESHOLD || velocity.y < -SWIPE_VELOCITY) {
        handleNext();
      }
      // Swipe down = previous card
      else if (offset.y > SWIPE_THRESHOLD || velocity.y > SWIPE_VELOCITY) {
        handlePrev();
      }
    },
    [handleNext, handlePrev]
  );

  // Handle answer submission
  const handleAnswer = useCallback(
    (optionId: string, isCorrect: boolean) => {
      if (!currentCard || currentCard.type !== 'Check') return;
      const existingAnswer = answers[currentCard.id];
      const attemptNumber = existingAnswer ? existingAnswer.attempts : 0;
      recordAnswer(currentCard.id, optionId, isCorrect, attemptNumber + 1);
    },
    [currentCard, answers, recordAnswer]
  );

  // Handle section unlock
  const handleUnlock = useCallback(() => {
    const nextSection = sections[currentSectionIndex + 1];
    if (nextSection) {
      unlockSection(nextSection.id);
      setDirection('up');
      nextCard(sections);
    }
  }, [currentSectionIndex, sections, unlockSection, nextCard]);

  // Handle module completion
  const handleComplete = useCallback(() => {
    const totalChecks = sections.flatMap((s) => s.cards.filter((c) => c.type === 'Check')).length;
    const score = Object.values(answers).filter((a) => a.isCorrect).length;
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);

    onComplete({
      score,
      totalChecks,
      xp: xpEarned,
      time: timeElapsed,
    });
  }, [sections, answers, xpEarned, startTime, onComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!currentCard) {
    return null;
  }

  // Check if we should show unlock gate
  const shouldShowUnlockGate = checkShouldShowUnlockGate(
    sections,
    currentSectionIndex,
    currentCardIndex,
    sectionProgress,
    answers
  );

  // Animation variants - simplified for reliability
  const variants = {
    enter: (dir: 'up' | 'down') => ({
      y: dir === 'up' ? 100 : -100,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (dir: 'up' | 'down') => ({
      y: dir === 'up' ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg-primary">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={`${currentSectionIndex}-${currentCardIndex}-${shouldShowUnlockGate ? 'gate' : 'card'}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: 'tween',
            duration: 0.3,
            ease: 'easeInOut',
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 touch-pan-y overflow-y-auto"
        >
          {shouldShowUnlockGate ? (
            <UnlockGate
              section={sections[currentSectionIndex + 1]}
              currentScore={Object.values(answers).filter((a) => a.isCorrect).length}
              isUnlocked={sectionProgress[sections[currentSectionIndex + 1]?.id]}
              onUnlock={handleUnlock}
            />
          ) : (
            renderCard(currentCard, mode, answers, handleAnswer, handleComplete, {
              score: Object.values(answers).filter((a) => a.isCorrect).length,
              totalChecks: sections.flatMap((s) => s.cards.filter((c) => c.type === 'Check')).length,
              xpEarned,
              timeElapsed: Math.floor((Date.now() - startTime) / 1000),
            })
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {currentSection?.cards.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentCardIndex
                ? 'bg-accent-primary w-4'
                : idx < currentCardIndex
                  ? 'bg-accent-primary/50'
                  : 'bg-border-default'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

function renderCard(
  card: LearningCard,
  mode: ContentMode,
  answers: Record<string, { optionId: string; isCorrect: boolean; attempts: number }>,
  onAnswer: (optionId: string, isCorrect: boolean) => void,
  onComplete: () => void,
  stats: { score: number; totalChecks: number; xpEarned: number; timeElapsed: number }
) {
  switch (card.type) {
    case 'Lesson':
      return <LessonCard card={card} mode={mode} />;

    case 'Check':
      const answer = answers[card.id];
      return (
        <CheckCard
          card={card}
          mode={mode}
          onAnswer={onAnswer}
          isAnsweredCorrectly={answer?.isCorrect ?? false}
          attempts={answer?.attempts ?? 0}
        />
      );

    case 'Completion':
      return (
        <CompletionCard
          card={card}
          mode={mode}
          score={stats.score}
          totalChecks={stats.totalChecks}
          xpEarned={stats.xpEarned}
          timeElapsed={stats.timeElapsed}
          onComplete={onComplete}
        />
      );

    default:
      return null;
  }
}

function buildCardSequence(
  sections: LearningSection[],
  sectionProgress: Record<string, boolean>
): Array<{ type: 'card' | 'gate'; sectionIndex: number; cardIndex: number }> {
  const sequence: Array<{ type: 'card' | 'gate'; sectionIndex: number; cardIndex: number }> = [];

  sections.forEach((section, sectionIndex) => {
    section.cards.forEach((_, cardIndex) => {
      sequence.push({ type: 'card', sectionIndex, cardIndex });
    });

    // Add unlock gate after each section (except the last)
    if (sectionIndex < sections.length - 1) {
      const nextSection = sections[sectionIndex + 1];
      if (!sectionProgress[nextSection.id]) {
        sequence.push({ type: 'gate', sectionIndex, cardIndex: section.cards.length - 1 });
      }
    }
  });

  return sequence;
}

function getFlatIndex(sections: LearningSection[], sectionIndex: number, cardIndex: number): number {
  let index = 0;
  for (let s = 0; s < sectionIndex; s++) {
    index += sections[s].cards.length;
  }
  return index + cardIndex;
}

function checkShouldShowUnlockGate(
  sections: LearningSection[],
  sectionIndex: number,
  cardIndex: number,
  sectionProgress: Record<string, boolean>,
  answers: Record<string, { optionId: string; isCorrect: boolean; attempts: number }>
): boolean {
  const currentSection = sections[sectionIndex];
  const nextSection = sections[sectionIndex + 1];

  // Only show gate at the end of a section
  if (!nextSection || cardIndex !== currentSection.cards.length - 1) {
    return false;
  }

  // Don't show gate if section is already unlocked
  if (sectionProgress[nextSection.id]) {
    return false;
  }

  // If the last card is a Check card, only show gate after it's been answered correctly
  const lastCard = currentSection.cards[cardIndex];
  if (lastCard.type === 'Check') {
    const answer = answers[lastCard.id];
    // Show the Check card if not answered correctly yet
    if (!answer?.isCorrect) {
      return false;
    }
  }

  return true;
}
