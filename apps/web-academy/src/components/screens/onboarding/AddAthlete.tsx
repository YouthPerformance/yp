// ═══════════════════════════════════════════════════════════
// ADD ATHLETE SCREEN
// Generate 6-digit code for athlete to link account
// Light "Sponsor Report" theme
// Intensity Budget: 5 points
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface AddAthleteProps {
  onContinue: () => void;
  onBack: () => void;
}

export function AddAthlete({ onContinue, onBack }: AddAthleteProps) {
  const { generateAthleteCode } = useOnboarding();
  const [athleteName, setAthleteName] = useState('');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate code when name is entered
  useEffect(() => {
    if (athleteName.trim().length >= 2 && !code) {
      setCode(generateAthleteCode());
    }
  }, [athleteName, code, generateAthleteCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Barefoot Reset',
          text: `Join me on Barefoot Reset! Use code: ${code}`,
          url: `https://barefootreset.app/join?code=${code}`,
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    }
  };

  const isValid = athleteName.trim().length >= 2;

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-8"
      style={{ backgroundColor: '#F6F7F9' }}
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

      {/* Title */}
      <motion.h1
        className="font-bebas text-2xl tracking-wider mb-8 text-center"
        style={{ color: '#1A1A1A' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ADD YOUR ATHLETE
      </motion.h1>

      {/* Athlete Name Input */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label
          className="text-sm block mb-2"
          style={{ color: '#666' }}
        >
          Athlete's first name
        </label>
        <input
          type="text"
          value={athleteName}
          onChange={(e) => setAthleteName(e.target.value)}
          placeholder="Enter name"
          className="w-full px-4 py-4 rounded-xl text-base outline-none"
          style={{
            backgroundColor: 'white',
            border: '2px solid #E5E5E5',
            color: '#1A1A1A',
          }}
        />
      </motion.div>

      {/* Code Display */}
      {code && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p
            className="text-sm text-center mb-3"
            style={{ color: '#666' }}
          >
            Share this code with {athleteName || 'your athlete'}
          </p>

          {/* Code Box */}
          <div
            className="rounded-2xl p-6 text-center mb-4"
            style={{ backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <p
              className="font-mono text-4xl tracking-[0.3em] mb-2"
              style={{ color: '#00BFB0' }}
            >
              {code.slice(0, 3)} {code.slice(3)}
            </p>
            <p
              className="text-xs"
              style={{ color: '#999' }}
            >
              Code expires in 48 hours
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'white',
                border: '2px solid #E5E5E5',
                color: '#333',
              }}
            >
              <span>{copied ? '✓' : '📋'}</span>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {'share' in navigator && (
              <button
                onClick={handleShare}
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'white',
                  border: '2px solid #E5E5E5',
                  color: '#333',
                }}
              >
                <span>📤</span>
                <span>Share</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: '#E5F7F6' }}
        >
          <p className="text-sm" style={{ color: '#333' }}>
            <strong>How it works:</strong>
          </p>
          <ol className="text-sm mt-2 space-y-1" style={{ color: '#666' }}>
            <li>1. Your athlete downloads the app</li>
            <li>2. They select "I'm an Athlete"</li>
            <li>3. They enter this code to link accounts</li>
          </ol>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        onClick={onContinue}
        disabled={!isValid}
        className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider"
        style={{
          backgroundColor: isValid ? '#00BFB0' : '#CCC',
          color: 'white',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
      >
        DONE →
      </motion.button>
    </motion.div>
  );
}

export default AddAthlete;
