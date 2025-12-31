// ═══════════════════════════════════════════════════════════
// STAT TICKER COMPONENT
// "Weighted Vest UX" — Heavy, expensive, deliberate
// Philosophy: Gym Foley, Not Casino Beeps
// Based on: docs/ux-research/stat-ticker-ux-spec.md
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme, useUserMode } from '@/contexts/ThemeContext';
import { useSound } from '@/hooks/useSound';
import { useHaptics } from '@/hooks/useHaptics';
import { TICKER_CONFIGS } from '@/lib/ticker-config';
import { WolfParticles } from '@/components/effects/WolfParticles';
import { cn } from '@/lib/utils';
import type { StatTickerProps, TickerVariant, TickerConfig } from '@/types/ticker';

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export function StatTicker({
  value,
  previousValue = 0,
  variant,
  label,
  suffix = '',
  showDelta = false,
  onComplete,
  className,
}: StatTickerProps) {
  const { theme } = useTheme();
  const userMode = useUserMode();
  const sound = useSound();
  const haptics = useHaptics();

  // State
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showChromatic, setShowChromatic] = useState(false);
  const [triggerParticles, setTriggerParticles] = useState(false);

  // Override to PROFESSIONAL in parent mode
  const effectiveVariant: TickerVariant = useMemo(() => {
    return userMode === 'PARENT' ? 'PROFESSIONAL' : variant;
  }, [userMode, variant]);

  const config = useMemo(() => TICKER_CONFIGS[effectiveVariant], [effectiveVariant]);

  // Check reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Adjust config for reduced motion
  const adjustedConfig = useMemo((): TickerConfig => {
    if (prefersReducedMotion) {
      return {
        ...config,
        duration: config.duration * 0.3,
        overshoot: 1.0,
        motionBlur: false,
        chromatic: false,
        particles: false,
      };
    }
    return config;
  }, [config, prefersReducedMotion]);

  // Spring-based number animation
  const springValue = useSpring(previousValue, {
    stiffness: adjustedConfig.spring.stiffness,
    damping: adjustedConfig.spring.damping,
    mass: adjustedConfig.spring.mass,
  });

  // Formatted display value
  const displayValue = useTransform(springValue, (v) => {
    const num = Math.round(v).toLocaleString();
    return showDelta && v > 0 ? `+${num}` : num;
  });

  // Animate to target value
  useEffect(() => {
    if (hasAnimated) return;

    // Start roll sound
    if (adjustedConfig.soundRoll && theme.features.sounds) {
      sound.play(adjustedConfig.soundRoll, {
        volume: adjustedConfig.soundVolume * 0.5,
        loop: true,
      });
    }

    // Animate spring to target
    springValue.set(value);

    // Schedule end effects
    const endTimer = setTimeout(() => {
      // Stop roll sound and play impact
      if (adjustedConfig.soundStop && theme.features.sounds) {
        sound.stopAll();
        sound.play(adjustedConfig.soundStop, {
          volume: adjustedConfig.soundVolume,
        });
      }

      // Haptic feedback
      if (adjustedConfig.hapticPattern && theme.features.haptics) {
        haptics.trigger(
          adjustedConfig.hapticPattern as any,
          adjustedConfig.hapticIntensity
        );
      }

      // Trigger particles
      if (adjustedConfig.particles && theme.features.particles) {
        setTriggerParticles(true);
      }

      // Trigger chromatic aberration
      if (adjustedConfig.chromatic && theme.features.chromaticAberration) {
        setShowChromatic(true);
        setTimeout(() => setShowChromatic(false), 150);
      }

      setHasAnimated(true);
      onComplete?.();
    }, adjustedConfig.duration);

    return () => {
      clearTimeout(endTimer);
      sound.stopAll();
    };
  }, [value, hasAnimated, adjustedConfig, theme.features, springValue, sound, haptics, onComplete]);

  // Reset animation state when value changes
  useEffect(() => {
    setHasAnimated(false);
    setTriggerParticles(false);
  }, [value]);

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        'relative flex flex-col items-center',
        className
      )}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Screen reader only */}
      <span className="sr-only">
        {label}: {showDelta && value > 0 ? '+' : ''}{value}{suffix}
      </span>

      {/* Particles Layer */}
      <AnimatePresence>
        {adjustedConfig.particles && triggerParticles && (
          <WolfParticles
            color={adjustedConfig.particleColor}
            intensity={adjustedConfig.glowIntensity}
            variant={effectiveVariant === 'EPIC' ? 'epic' : 'celebration'}
          />
        )}
      </AnimatePresence>

      {/* Glow Layer */}
      {adjustedConfig.glowIntensity > 0 && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${adjustedConfig.particleColor} 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: adjustedConfig.glowIntensity * 0.5,
            scale: 1 + adjustedConfig.glowIntensity * 0.3,
          }}
          transition={{
            duration: adjustedConfig.duration / 1000,
            ease: 'easeOut',
          }}
        />
      )}

      {/* Number Display */}
      <div className="relative" aria-hidden="true">
        {/* Chromatic Aberration Effect */}
        <AnimatePresence>
          {showChromatic && (
            <>
              {/* Red channel - offset left */}
              <motion.span
                className="absolute inset-0 text-red-500 opacity-70"
                initial={{ x: -3, opacity: 0.7 }}
                animate={{ x: 0, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <NumberDisplay
                  value={displayValue}
                  suffix={suffix}
                  config={adjustedConfig}
                  showDelta={showDelta}
                />
              </motion.span>

              {/* Blue channel - offset right */}
              <motion.span
                className="absolute inset-0 text-blue-500 opacity-70"
                initial={{ x: 3, opacity: 0.7 }}
                animate={{ x: 0, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <NumberDisplay
                  value={displayValue}
                  suffix={suffix}
                  config={adjustedConfig}
                  showDelta={showDelta}
                />
              </motion.span>
            </>
          )}
        </AnimatePresence>

        {/* Main Number */}
        <motion.div
          initial={{ scale: 1, filter: 'blur(0px)' }}
          animate={{
            scale: [1, adjustedConfig.overshoot, 1],
            filter: adjustedConfig.motionBlur
              ? ['blur(8px)', 'blur(2px)', 'blur(0px)']
              : 'blur(0px)',
          }}
          transition={{
            duration: adjustedConfig.duration / 1000,
            times: [0, 0.85, 1],
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10"
        >
          <NumberDisplay
            value={displayValue}
            suffix={suffix}
            config={adjustedConfig}
            showDelta={showDelta}
            isPrimary
          />
        </motion.div>
      </div>

      {/* Label */}
      <motion.span
        className="mt-2 text-xs tracking-[0.2em] uppercase"
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {label}
      </motion.span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NUMBER DISPLAY COMPONENT
// ─────────────────────────────────────────────────────────────

interface NumberDisplayProps {
  value: ReturnType<typeof useTransform<number, string>>;
  suffix: string;
  config: TickerConfig;
  showDelta: boolean;
  isPrimary?: boolean;
}

function NumberDisplay({
  value,
  suffix,
  config,
  showDelta,
  isPrimary = false,
}: NumberDisplayProps) {
  return (
    <motion.span
      className={cn(
        'font-bebas text-5xl tabular-nums',
        isPrimary && 'text-[var(--text-primary)]'
      )}
    >
      <motion.span>{value}</motion.span>
      {suffix && (
        <span className="text-3xl ml-1 opacity-80">{suffix}</span>
      )}
    </motion.span>
  );
}

// ─────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────

export default StatTicker;
