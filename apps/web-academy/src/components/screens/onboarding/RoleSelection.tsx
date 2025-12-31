// ═══════════════════════════════════════════════════════════
// ROLE SELECTION SCREEN
// "Who's joining the pack?"
// Routes users to Athlete or Parent onboarding path
// Intensity Budget: 10 points (subtle hover effects)
// ═══════════════════════════════════════════════════════════

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding, UserRole } from '@/contexts/OnboardingContext';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
  onSignIn: () => void;
}

export function RoleSelection({ onSelectRole, onSignIn }: RoleSelectionProps) {
  const { setRole } = useOnboarding();

  const handleSelect = (role: 'athlete' | 'parent') => {
    setRole(role);
    onSelectRole(role);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-5xl mb-4 block">🐺</span>
        <h1
          className="font-bebas text-3xl tracking-wider mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          WHO'S JOINING THE PACK?
        </h1>
        <p
          className="text-sm"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Choose your path to begin
        </p>
      </motion.div>

      {/* Role Cards */}
      <div className="w-full max-w-sm space-y-4 mb-8">
        {/* Athlete Card */}
        <RoleCard
          emoji="🐺"
          title="I'M AN ATHLETE"
          subtitle="Start my 42-day reset"
          color="var(--accent-primary)"
          delay={0.2}
          onClick={() => handleSelect('athlete')}
        />

        {/* Parent Card */}
        <RoleCard
          emoji="👤"
          title="I'M A PARENT"
          subtitle="Manage my athlete"
          color="var(--text-secondary)"
          delay={0.3}
          onClick={() => handleSelect('parent')}
          variant="secondary"
        />
      </div>

      {/* Sign In Link */}
      <motion.button
        onClick={onSignIn}
        className="text-sm"
        style={{ color: 'var(--text-tertiary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ color: 'var(--accent-primary)' }}
      >
        Already have an account?{' '}
        <span style={{ color: 'var(--accent-primary)' }}>Sign In →</span>
      </motion.button>
    </motion.div>
  );
}

interface RoleCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  delay: number;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function RoleCard({
  emoji,
  title,
  subtitle,
  color,
  delay,
  onClick,
  variant = 'primary',
}: RoleCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-6 transition-all"
      style={{
        backgroundColor: isPrimary ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
        border: `1px solid ${isPrimary ? color : 'var(--border-default)'}`,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{
        scale: 1.02,
        borderColor: color,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          style={{
            backgroundColor: isPrimary ? `${color}20` : 'var(--bg-secondary)',
          }}
        >
          {emoji}
        </div>
        <div>
          <h2
            className="font-bebas text-xl tracking-wider mb-1"
            style={{ color: isPrimary ? color : 'var(--text-primary)' }}
          >
            {title}
          </h2>
          <p
            className="text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export default RoleSelection;
