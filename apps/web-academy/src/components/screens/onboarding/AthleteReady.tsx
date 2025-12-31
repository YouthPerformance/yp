// ═══════════════════════════════════════════════════════════
// ATHLETE READY SCREEN
// Final screen before entering the app
// Shows initial stats and calls to action
// Intensity Budget: 15 points (celebration moment)
// ═══════════════════════════════════════════════════════════

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding, FOUNDATION_PROGRAM } from '@/contexts/OnboardingContext';

interface AthleteReadyProps {
  onStart: () => void;
}

export function AthleteReady({ onStart }: AthleteReadyProps) {
  const { data, completeOnboarding } = useOnboarding();

  const handleStart = async () => {
    await completeOnboarding();
    onStart();
  };

  // Get wolf background based on selected color
  const getWolfBg = () => {
    switch (data.avatarColor) {
      case 'white': return '#E5E5E5';
      case 'gray': return '#4A4A4A';
      case 'brown': return '#5D4037';
      default: return '#1A1A1A';
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
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Wolf Avatar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: getWolfBg(),
              border: '4px solid var(--accent-primary)',
              boxShadow: '0 0 30px var(--accent-primary)40',
            }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(0, 246, 224, 0.4)',
                '0 0 50px rgba(0, 246, 224, 0.6)',
                '0 0 30px rgba(0, 246, 224, 0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-6xl">🐺</span>
          </motion.div>
        </motion.div>

        {/* Name */}
        <motion.h1
          className="font-bebas text-4xl tracking-wider mb-2"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {data.athleteName.toUpperCase()}
        </motion.h1>

        {/* Rank */}
        <motion.div
          className="flex items-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span
            className="font-bebas text-xl tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            YOU'RE A
          </span>
          <span
            className="font-bebas text-xl tracking-wider"
            style={{ color: '#A0A0A0' }}
          >
            PUP
          </span>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          className="w-full max-w-xs rounded-2xl p-6 mb-8"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-around">
            <div className="text-center">
              <p
                className="font-bebas text-3xl"
                style={{ color: 'var(--text-primary)' }}
              >
                1
              </p>
              <p
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Day
              </p>
            </div>
            <div
              className="w-px"
              style={{ backgroundColor: 'var(--border-default)' }}
            />
            <div className="text-center">
              <p
                className="font-bebas text-3xl"
                style={{ color: 'var(--accent-primary)' }}
              >
                0
              </p>
              <p
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)' }}
              >
                XP
              </p>
            </div>
            <div
              className="w-px"
              style={{ backgroundColor: 'var(--border-default)' }}
            />
            <div className="text-center">
              <p
                className="font-bebas text-3xl"
                style={{ color: 'var(--text-primary)' }}
              >
                0
              </p>
              <p
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Streak
              </p>
            </div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.p
          className="text-sm max-w-xs"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your journey begins now. Complete Day 1 to earn your first XP and start your streak!
        </motion.p>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider relative overflow-hidden"
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
        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: 'white' }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="relative">ENTER THE DOJO</span>
      </motion.button>

      {/* Program info */}
      <motion.p
        className="text-xs text-center mt-4"
        style={{ color: 'var(--text-tertiary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {data.programId === 'foundation_42_day' ? `${FOUNDATION_PROGRAM.name} • ${FOUNDATION_PROGRAM.duration} Days` : ''}
      </motion.p>
    </motion.div>
  );
}

export default AthleteReady;
