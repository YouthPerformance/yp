// ═══════════════════════════════════════════════════════════
// CHECK CARD
// Multiple choice question with XP rewards (v2 economy)
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, Zap } from 'lucide-react';
import type { CheckCard as CheckCardType, ContentMode } from '@/data/modules/types';
import { calculateCardXp } from '@/data/modules/types';

interface CheckCardProps {
  card: CheckCardType;
  mode: ContentMode;
  onAnswer: (optionId: string, isCorrect: boolean) => void;
  isAnsweredCorrectly: boolean;
  attempts: number;
}

export function CheckCard({
  card,
  mode,
  onAnswer,
  isAnsweredCorrectly,
  attempts,
}: CheckCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const question = card.question[mode];
  const isCorrectSelection = card.options.find((o) => o.id === selectedOption)?.isCorrect;

  // Calculate potential XP reward
  const potentialXp = calculateCardXp(true, attempts === 0 ? 1 : attempts + 1);

  const handleSelect = (optionId: string) => {
    if (showResult || isAnsweredCorrectly) return;

    setSelectedOption(optionId);
    const option = card.options.find((o) => o.id === optionId);
    if (!option) return;

    setShowResult(true);
    onAnswer(optionId, option.isCorrect);
  };

  const handleContinue = () => {
    // If answered correctly, parent will handle navigation
    // If wrong, reset for retry
    if (!isCorrectSelection) {
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  // If already answered correctly, show success state
  if (isAnsweredCorrectly && !showResult) {
    return (
      <div className="flex flex-col h-full min-h-full px-6 py-8 bg-bg-primary">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-accent-primary/20 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-accent-primary" />
          </div>
          <h2 className="text-2xl font-bebas uppercase text-accent-primary mb-2">
            Already Answered
          </h2>
          <p className="text-text-secondary">
            You got this one correct. Swipe up to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-full px-6 py-8 bg-bg-primary">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20">
          <span className="text-sm font-medium text-accent-gold">
            Quick Check
          </span>
        </div>
        {!isAnsweredCorrectly && (
          <div className="ml-auto flex items-center gap-1 text-sm text-accent-gold">
            <Zap className="w-4 h-4" />
            <span>+{potentialXp} XP</span>
          </div>
        )}
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-medium text-white mb-8">
        {question}
      </h2>

      {/* Options */}
      <div className="flex-1 space-y-3">
        {card.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const showCorrect = showResult && option.isCorrect;
          const showWrong = showResult && isSelected && !option.isCorrect;

          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={showResult}
              className={`
                w-full p-4 rounded-xl border-2 text-left transition-all
                ${
                  showCorrect
                    ? 'border-accent-primary bg-accent-primary/10'
                    : showWrong
                      ? 'border-accent-error bg-accent-error/10'
                      : isSelected
                        ? 'border-accent-primary bg-accent-primary/5'
                        : 'border-border-default bg-bg-tertiary hover:border-accent-primary/50'
                }
                ${showResult ? 'cursor-default' : 'cursor-pointer'}
              `}
              whileTap={!showResult ? { scale: 0.98 } : undefined}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${
                      showCorrect
                        ? 'bg-accent-primary text-black'
                        : showWrong
                          ? 'bg-accent-error text-white'
                          : 'bg-bg-secondary text-text-secondary'
                    }
                  `}
                >
                  {showCorrect ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : showWrong ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    option.id.toUpperCase()
                  )}
                </div>
                <span
                  className={`
                    flex-1 text-base
                    ${showCorrect || showWrong ? 'text-white' : 'text-text-secondary'}
                  `}
                >
                  {option.text[mode]}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Hint */}
      {card.hintAvailable && card.hint && !showResult && !showHint && (
        <button
          onClick={() => setShowHint(true)}
          className="mt-4 flex items-center justify-center gap-2 text-sm text-text-tertiary hover:text-accent-gold transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Show Hint</span>
        </button>
      )}

      <AnimatePresence>
        {showHint && card.hint && !showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 rounded-lg bg-accent-gold/10 border border-accent-gold/20"
          >
            <p className="text-sm text-accent-gold">{card.hint[mode]}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div
              className={`
                p-4 rounded-xl border
                ${
                  isCorrectSelection
                    ? 'bg-accent-primary/10 border-accent-primary/30'
                    : 'bg-accent-error/10 border-accent-error/30'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrectSelection ? (
                  <>
                    <Zap className="w-4 h-4 text-accent-gold" />
                    <span className="text-sm font-bold text-accent-gold">+{potentialXp} XP</span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-accent-error">Try again</span>
                )}
              </div>
              <p
                className={`text-sm ${isCorrectSelection ? 'text-accent-primary' : 'text-accent-error'}`}
              >
                {card.options.find((o) => o.id === selectedOption)?.feedback[mode]}
              </p>
            </div>

            <button
              onClick={handleContinue}
              className={`
                w-full mt-4 py-3 rounded-xl font-bold uppercase tracking-wide transition-all
                ${
                  isCorrectSelection
                    ? 'bg-accent-primary text-black hover:bg-accent-primary-hover'
                    : 'bg-bg-tertiary text-white border border-border-default hover:border-accent-primary/50'
                }
              `}
            >
              {isCorrectSelection ? 'Continue →' : 'Try Again'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
