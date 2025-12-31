// ═══════════════════════════════════════════════════════════
// PARENT WELCOME SCREEN
// "Sponsor Report" light theme introduction
// Parent portal features overview
// Intensity Budget: 5 points (smooth, professional)
// ═══════════════════════════════════════════════════════════

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ParentWelcomeProps {
  onContinue: () => void;
  onBack: () => void;
}

export function ParentWelcome({ onContinue, onBack }: ParentWelcomeProps) {
  const features = [
    { icon: '📊', text: 'Monitor completion' },
    { icon: '🛡️', text: 'View safety flags' },
    { icon: '📈', text: 'Weekly progress reports' },
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-8"
      style={{ backgroundColor: '#F6F7F9' }} // Parent light theme
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm self-start"
        style={{ color: '#666' }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ color: '#333' }}
      >
        ← Back
      </motion.button>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Logo */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1
            className="font-bebas text-3xl tracking-wider"
            style={{ color: '#1A1A1A' }}
          >
            BAREFOOT RESET
          </h1>
          <p
            className="text-sm"
            style={{ color: '#00BFB0' }}
          >
            Parent Portal
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-base mb-10 max-w-xs"
          style={{ color: '#666' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Track your athlete's progress through their 42-day durability program
        </motion.p>

        {/* Features */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {features.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 px-6 py-3 rounded-xl"
              style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span style={{ color: '#333' }}>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={onContinue}
        className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider"
        style={{
          backgroundColor: '#00BFB0', // Muted cyan for parent theme
          color: 'white',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        GET STARTED →
      </motion.button>
    </motion.div>
  );
}

export default ParentWelcome;
