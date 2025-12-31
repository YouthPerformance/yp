// ═══════════════════════════════════════════════════════════
// ROLE SELECTION SCREEN
// "Who's joining the pack?"
// Routes users to Athlete or Parent onboarding path
// Intensity Budget: 10 points (subtle hover effects)
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding, UserRole, PARENT_FLOW_ENABLED } from '@/contexts/OnboardingContext';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
  onSignIn: () => void;
}

export function RoleSelection({ onSelectRole, onSignIn }: RoleSelectionProps) {
  const { setRole } = useOnboarding();
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const handleSelect = (role: 'athlete' | 'parent') => {
    // Guard parent flow with feature flag
    if (role === 'parent' && !PARENT_FLOW_ENABLED) {
      setShowComingSoonModal(true);
      return;
    }
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
          subtitle={PARENT_FLOW_ENABLED ? "Manage my athlete" : "Coming Soon"}
          color="var(--text-secondary)"
          delay={0.3}
          onClick={() => handleSelect('parent')}
          variant="secondary"
          disabled={!PARENT_FLOW_ENABLED}
          badge={!PARENT_FLOW_ENABLED ? "COMING SOON" : undefined}
        />
      </div>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoonModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowComingSoonModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative z-10 w-full max-w-sm rounded-2xl p-6 text-center"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="text-4xl mb-4">👤</div>
              <h2
                className="font-bebas text-2xl tracking-wider mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                PARENT PORTAL
              </h2>
              <p
                className="text-sm mb-6"
                style={{ color: 'var(--text-tertiary)' }}
              >
                The parent dashboard is coming soon! For now, athletes can start their journey independently.
              </p>
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="w-full py-3 rounded-xl font-bebas text-lg tracking-wider"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--bg-primary)',
                }}
              >
                GOT IT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
  disabled?: boolean;
  badge?: string;
}

function RoleCard({
  emoji,
  title,
  subtitle,
  color,
  delay,
  onClick,
  variant = 'primary',
  disabled = false,
  badge,
}: RoleCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-6 transition-all relative"
      style={{
        backgroundColor: isPrimary ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
        border: `1px solid ${isPrimary ? color : 'var(--border-default)'}`,
        opacity: disabled ? 0.7 : 1,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: disabled ? 0.7 : 1, x: 0 }}
      transition={{ delay }}
      whileHover={disabled ? {} : {
        scale: 1.02,
        borderColor: color,
      }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {/* Coming Soon Badge */}
      {badge && (
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold tracking-wider"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--bg-primary)',
          }}
        >
          {badge}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          style={{
            backgroundColor: isPrimary ? `${color}20` : 'var(--bg-secondary)',
            opacity: disabled ? 0.6 : 1,
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
            style={{ color: disabled ? 'var(--text-tertiary)' : 'var(--text-tertiary)' }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export default RoleSelection;
