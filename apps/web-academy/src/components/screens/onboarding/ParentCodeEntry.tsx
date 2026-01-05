// ═══════════════════════════════════════════════════════════
// PARENT CODE ENTRY SCREEN
// 6-digit code from parent account (COPPA compliance)
// Haptic feedback on entry, error shake on invalid
// Intensity Budget: 10 points
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useHaptics } from '@/hooks/useHaptics';

interface ParentCodeEntryProps {
  onSuccess: () => void;
  onBack: () => void;
  onNoCode: () => void;
}

export function ParentCodeEntry({ onSuccess, onBack, onNoCode }: ParentCodeEntryProps) {
  const { validateParentCode } = useOnboarding();
  const { trigger } = useHaptics();
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [sponsorName, setSponsorName] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow alphanumeric
    const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanValue && value) return;

    setError(false);

    // Haptic on valid input
    if (cleanValue) {
      trigger('impact_light');
    }

    const newCode = [...code];
    newCode[index] = cleanValue.slice(-1); // Only take last char
    setCode(newCode);

    // Auto-advance to next input
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newCode.every(c => c) && newCode.join('').length === 6) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pastedText.length >= 6) {
      const newCode = pastedText.slice(0, 6).split('');
      setCode(newCode);
      trigger('impact_light');
      handleSubmit(newCode.join(''));
    }
  };

  const handleSubmit = async (fullCode: string) => {
    setIsValidating(true);

    const result = await validateParentCode(fullCode);

    if (result.valid && result.sponsorName) {
      trigger('success_pattern');
      setSponsorName(result.sponsorName);
      setShowSuccess(true);
      // Show success message for 1.5s before advancing
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      trigger('impact_heavy');
      setError(true);
      // Clear code after error
      setTimeout(() => {
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }, 500);
      setIsValidating(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-8"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm self-start"
        style={{ color: 'var(--text-tertiary)' }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ color: 'var(--text-primary)' }}
      >
        ← Back
      </motion.button>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center pt-12">
        {/* Title */}
        <motion.h1
          className="font-bebas text-3xl tracking-wider mb-2 text-center"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ENTER YOUR PACK CODE
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-sm text-center mb-12"
          style={{ color: 'var(--text-tertiary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Ask your parent for the 6-digit code from their app
        </motion.p>

        {/* Code Input Grid */}
        <motion.div
          className="flex gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={error ? { x: [-10, 10, -10, 10, 0] } : { opacity: 1, y: 0 }}
          transition={error ? { duration: 0.4 } : { delay: 0.2 }}
        >
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              disabled={isValidating}
              className="w-12 h-14 text-center text-2xl font-mono rounded-xl outline-none transition-all"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: `2px solid ${error ? 'var(--accent-error)' : digit ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                color: error ? 'var(--accent-error)' : 'var(--accent-primary)',
              }}
            />
          ))}
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-sm text-center mb-8"
              style={{ color: 'var(--accent-error)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Hmm, that code didn't work. Double-check with your parent and try again.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Loading indicator - Space Grotesk font */}
        {isValidating && !showSuccess && (
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative w-5 h-5">
              <div
                className="absolute inset-0 border-2 rounded-full"
                style={{
                  borderColor: 'var(--accent-primary)',
                  opacity: 0.2,
                }}
              />
              <div
                className="absolute inset-0 border-2 rounded-full animate-spin"
                style={{
                  borderColor: 'transparent',
                  borderTopColor: 'var(--accent-primary)',
                }}
              />
            </div>
            <span
              className="text-xs tracking-[0.15em] uppercase"
              style={{
                fontFamily: 'var(--font-loading)',
                color: 'var(--text-tertiary)'
              }}
            >
              Checking
            </span>
          </motion.div>
        )}

        {/* Success feedback - Linked to Sponsor */}
        <AnimatePresence>
          {showSuccess && sponsorName && (
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(0, 246, 224, 0.15)',
                  border: '2px solid var(--accent-primary)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <motion.span
                  className="text-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  ✓
                </motion.span>
              </motion.div>
              <motion.p
                className="text-sm text-center"
                style={{ color: 'var(--accent-primary)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Linked to Sponsor:{' '}
                <span className="font-bold">{sponsorName}</span>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* No Code Link */}
      <motion.button
        onClick={onNoCode}
        className="text-sm text-center py-4"
        style={{ color: 'var(--text-tertiary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ color: 'var(--accent-primary)' }}
      >
        Don't have a code?{' '}
        <span style={{ color: 'var(--accent-primary)' }}>
          Parent needs to sign up first
        </span>
      </motion.button>
    </motion.div>
  );
}

export default ParentCodeEntry;
