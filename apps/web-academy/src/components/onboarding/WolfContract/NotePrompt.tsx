// ═══════════════════════════════════════════════════════════
// NOTE PROMPT COMPONENT
// Post-video prompt: Athlete writes 10+ char note to log level
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useCallback } from "react";

interface NotePromptProps {
  levelNumber: number;
  workoutTitle: string;
  videoWatchPercent: number;
  onSubmit: (note: string) => Promise<void>;
  onCancel?: () => void;
}

const MIN_NOTE_LENGTH = 10;

const PROMPTS = [
  "What did you learn?",
  "What felt different today?",
  "What will you focus on next time?",
  "How did your body feel?",
  "What was the hardest part?",
];

export function NotePrompt({
  levelNumber,
  workoutTitle,
  videoWatchPercent,
  onSubmit,
  onCancel,
}: NotePromptProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Random prompt
  const prompt = PROMPTS[levelNumber % PROMPTS.length];

  const canSubmit = note.length >= MIN_NOTE_LENGTH && !isSubmitting;
  const charsRemaining = MIN_NOTE_LENGTH - note.length;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(note);
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note");
      setIsSubmitting(false);
    }
  }, [canSubmit, note, onSubmit]);

  // Success state
  if (showSuccess) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 px-6"
        style={{ backgroundColor: "var(--bg-primary)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-primary)" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="var(--bg-primary)"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          <motion.h2
            className="font-bebas text-2xl tracking-wider mb-2"
            style={{ color: "var(--accent-primary)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            LEVEL {levelNumber} LOGGED
          </motion.h2>

          <motion.p
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Keep stacking. The Pack is watching.
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 flex flex-col z-50"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="/images/wolffront.webp"
              alt="Wolf"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span
              className="font-bebas text-lg tracking-wider"
              style={{ color: "var(--accent-primary)" }}
            >
              LEVEL {levelNumber}
            </span>
            <span
              className="text-xs block"
              style={{ color: "var(--text-tertiary)" }}
            >
              {workoutTitle}
            </span>
          </div>
        </div>

        {/* Video watch badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
          style={{
            backgroundColor:
              videoWatchPercent >= 90 ? "var(--accent-primary)20" : "var(--status-warning)20",
            color: videoWatchPercent >= 90 ? "var(--accent-primary)" : "var(--status-warning)",
          }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
          </svg>
          {Math.round(videoWatchPercent)}% watched
        </div>

        {/* Prompt */}
        <h2
          className="font-bebas text-2xl tracking-wide mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {prompt}
        </h2>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Quick note before we log this level.
        </p>
      </div>

      {/* Text Area */}
      <div className="flex-1 px-6 py-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your thoughts..."
          className="w-full h-full resize-none rounded-xl p-4 text-base focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            borderColor: "transparent",
          }}
          autoFocus
        />
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 pt-4">
        {/* Character count */}
        <div className="flex justify-between items-center mb-4">
          <span
            className="text-xs"
            style={{
              color: charsRemaining > 0 ? "var(--text-tertiary)" : "var(--accent-primary)",
            }}
          >
            {charsRemaining > 0
              ? `${charsRemaining} more characters needed`
              : `${note.length} characters`}
          </span>

          {error && (
            <span className="text-xs" style={{ color: "var(--status-error)" }}>
              {error}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider transition-all disabled:opacity-50"
          style={{
            backgroundColor: canSubmit ? "var(--accent-primary)" : "var(--bg-tertiary)",
            color: canSubmit ? "var(--bg-primary)" : "var(--text-tertiary)",
          }}
        >
          {isSubmitting ? "LOGGING..." : "LOG THIS LEVEL"}
        </button>

        {/* Cancel */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full py-3 mt-2 text-sm"
            style={{ color: "var(--text-tertiary)" }}
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default NotePrompt;
