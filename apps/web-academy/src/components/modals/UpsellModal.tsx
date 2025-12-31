// ═══════════════════════════════════════════════════════════
// UPSELL MODAL
// The $88 Barefoot Reset Offer
// Triggered when free users click locked workout content
// Intensity Budget: 8 points
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: () => void;
  athleteName?: string;
}

const FEATURES = [
  { icon: '🦶', text: '42-Day Foundation Program' },
  { icon: '📱', text: 'Daily Guided Workouts' },
  { icon: '🎮', text: 'Gamified XP & Rank System' },
  { icon: '🃏', text: 'Collectible Training Cards' },
  { icon: '👨‍👩‍👧', text: 'Parent Progress Dashboard' },
  { icon: '🏆', text: 'Leaderboards & Achievements' },
];

const PRICE = {
  original: 129,
  sale: 88,
  currency: '$',
};

export function UpsellModal({ isOpen, onClose, onPurchase, athleteName }: UpsellModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }

      // Call optional onPurchase callback
      onPurchase?.();
    } catch (err) {
      console.error('[UpsellModal] Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
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
            className="fixed inset-x-4 top-1/2 z-50 max-w-md mx-auto"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Header with gradient */}
              <div
                className="relative px-6 pt-8 pb-6 text-center"
                style={{
                  background: 'linear-gradient(180deg, rgba(0, 246, 224, 0.15) 0%, transparent 100%)',
                }}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <span style={{ color: 'var(--text-tertiary)' }}>✕</span>
                </button>

                {/* Wolf icon with glow */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-primary) 0%, #00a3b8 100%)',
                    boxShadow: '0 0 40px rgba(0, 246, 224, 0.4)',
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-4xl">🐺</span>
                </motion.div>

                <h2
                  className="font-bebas text-3xl tracking-wider mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  UNLOCK YOUR JOURNEY
                </h2>
                <p
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {athleteName ? `${athleteName}, transform` : 'Transform'} your training with
                  the complete Barefoot Reset program
                </p>
              </div>

              {/* Pricing */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span
                    className="text-2xl line-through"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {PRICE.currency}{PRICE.original}
                  </span>
                  <div className="flex items-baseline">
                    <span
                      className="font-bebas text-6xl"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      {PRICE.currency}{PRICE.sale}
                    </span>
                    <span
                      className="text-sm ml-1"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      one-time
                    </span>
                  </div>
                </div>

                {/* Savings badge */}
                <div className="flex justify-center mb-6">
                  <span
                    className="px-4 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: 'rgba(0, 246, 224, 0.15)',
                      color: 'var(--accent-primary)',
                      border: '1px solid var(--accent-primary)',
                    }}
                  >
                    Save {PRICE.currency}{PRICE.original - PRICE.sale} - Limited Time
                  </span>
                </div>

                {/* Features list */}
                <div className="space-y-3 mb-6">
                  {FEATURES.map((feature, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <span className="text-lg">{feature.icon}</span>
                      <span
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="px-6 pb-6 space-y-3">
                {error && (
                  <div
                    className="p-3 rounded-lg text-sm text-center mb-2"
                    style={{
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      color: '#ef4444',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                    }}
                  >
                    {error}
                  </div>
                )}

                <motion.button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider relative overflow-hidden"
                  style={{
                    backgroundColor: isLoading ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                    color: isLoading ? 'var(--text-tertiary)' : 'var(--bg-primary)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                  whileHover={isLoading ? {} : { scale: 1.02 }}
                  whileTap={isLoading ? {} : { scale: 0.98 }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      REDIRECTING TO CHECKOUT...
                    </span>
                  ) : (
                    'START MY TRANSFORMATION'
                  )}
                </motion.button>

                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full py-3 text-sm"
                  style={{
                    color: 'var(--text-tertiary)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  Maybe Later
                </button>
              </div>

              {/* Trust badges */}
              <div
                className="px-6 py-4 text-center"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderTop: '1px solid var(--border-default)',
                }}
              >
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">🔒</span>
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      Secure Payment
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">💯</span>
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      30-Day Guarantee
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default UpsellModal;
