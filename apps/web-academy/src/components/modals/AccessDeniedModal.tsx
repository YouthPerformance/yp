// ═══════════════════════════════════════════════════════════
// ACCESS DENIED MODAL
// Shown when athlete tries to access locked content
// "PRO CLEARANCE REQUIRED" with option to ask sponsor
// Intensity Budget: 10 points
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/hooks/useHaptics';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskSponsor: () => void;
  contentTitle?: string;
}

export function AccessDeniedModal({
  isOpen,
  onClose,
  onAskSponsor,
  contentTitle = 'Day 1: Diagnostic Scan',
}: AccessDeniedModalProps) {
  const { trigger } = useHaptics();

  // Haptic on open
  useEffect(() => {
    if (isOpen) {
      trigger('impact_heavy');
    }
  }, [isOpen, trigger]);

  const handleAskSponsor = () => {
    trigger('success_pattern');
    onAskSponsor();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 z-50 max-w-sm mx-auto"
            style={{ transform: 'translateY(-50%)' }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              {/* Lock Icon with Animation */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(255, 68, 68, 0.15)',
                  border: '2px solid #FF4444',
                }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(255, 68, 68, 0.4)',
                    '0 0 0 20px rgba(255, 68, 68, 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.span
                  className="text-4xl"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  🔒
                </motion.span>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="font-bebas text-2xl tracking-wider mb-2"
                style={{ color: '#FF4444' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                ACCESS DENIED
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="text-sm mb-4"
                style={{ color: 'var(--text-tertiary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                PRO CLEARANCE REQUIRED
              </motion.p>

              {/* Content Title */}
              <motion.div
                className="rounded-xl p-4 mb-6"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-default)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p
                  className="font-bebas text-lg tracking-wider"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {contentTitle}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Unlock the 42-Day Reset to access this workout
                </p>
              </motion.div>

              {/* Primary CTA */}
              <motion.button
                onClick={handleAskSponsor}
                className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider mb-3"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--bg-primary)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ASK SPONSOR TO UNLOCK
              </motion.button>

              {/* Dismiss */}
              <motion.button
                onClick={onClose}
                className="text-sm py-2"
                style={{ color: 'var(--text-tertiary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ color: 'var(--text-secondary)' }}
              >
                Maybe later
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AccessDeniedModal;
