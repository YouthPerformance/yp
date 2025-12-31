// ═══════════════════════════════════════════════════════════
// ATHLETE WELCOME SCREEN
// "Welcome to the Pack"
// First screen in athlete onboarding flow
// Intensity Budget: 10 points
// ═══════════════════════════════════════════════════════════

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AthleteWelcomeProps {
  onContinue: () => void;
  onBack: () => void;
}

export function AthleteWelcome({ onContinue, onBack }: AthleteWelcomeProps) {
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
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Wolf Icon */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-7xl">🐺</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-bebas text-4xl tracking-wider mb-4"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          WELCOME TO THE PACK
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-lg mb-8"
          style={{ color: 'var(--accent-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          42 days to build unbreakable feet
        </motion.p>

        {/* Features */}
        <motion.div
          className="space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: '⚡', text: 'Earn XP every workout' },
            { icon: '🃏', text: 'Collect wolf cards' },
            { icon: '🏆', text: 'Rise through the ranks' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span
                className="text-base"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={onContinue}
        className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider"
        style={{
          backgroundColor: 'var(--accent-primary)',
          color: 'var(--bg-primary)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        LET'S GO →
      </motion.button>
    </motion.div>
  );
}

export default AthleteWelcome;
