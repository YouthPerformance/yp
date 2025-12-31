// ═══════════════════════════════════════════════════════════
// WOLF EYES TRANSITION COMPONENT
// Dramatic reveal for rank ups and epic moments
// Glowing cyan wolf eyes that fade in from black
// ═══════════════════════════════════════════════════════════

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WolfEyesProps {
  color?: string;
  glowIntensity?: number;
  size?: 'sm' | 'md' | 'lg';
  breathing?: boolean;
  onComplete?: () => void;
  duration?: number;
}

export function WolfEyes({
  color = '#00F6E0',
  glowIntensity = 1,
  size = 'md',
  breathing = true,
  onComplete,
  duration = 1000,
}: WolfEyesProps) {
  // Size configurations
  const sizes = {
    sm: { eye: 16, gap: 60, blur: 20 },
    md: { eye: 24, gap: 80, blur: 30 },
    lg: { eye: 32, gap: 100, blur: 40 },
  };

  const config = sizes[size];

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: '#000000' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration / 1000 }}
      onAnimationComplete={() => {
        // Call onComplete after the fade in is done
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }}
    >
      <div className="relative flex items-center" style={{ gap: config.gap }}>
        {/* Left Eye */}
        <Eye
          color={color}
          size={config.eye}
          blur={config.blur}
          glowIntensity={glowIntensity}
          breathing={breathing}
          delay={0}
        />

        {/* Right Eye */}
        <Eye
          color={color}
          size={config.eye}
          blur={config.blur}
          glowIntensity={glowIntensity}
          breathing={breathing}
          delay={0.1}
        />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SINGLE EYE COMPONENT
// ─────────────────────────────────────────────────────────────

interface EyeProps {
  color: string;
  size: number;
  blur: number;
  glowIntensity: number;
  breathing: boolean;
  delay: number;
}

function Eye({ color, size, blur, glowIntensity, breathing, delay }: EyeProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: breathing ? [1, 1.1, 1] : 1,
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: breathing
          ? {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: delay + 0.5,
            }
          : { duration: 0 },
      }}
    >
      {/* Outer glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 3,
          height: size * 3,
          left: -size,
          top: -size,
          background: `radial-gradient(circle, ${color}${Math.round(glowIntensity * 40).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          filter: `blur(${blur}px)`,
        }}
      />

      {/* Middle glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 2,
          height: size * 2,
          left: -size / 2,
          top: -size / 2,
          background: `radial-gradient(circle, ${color}${Math.round(glowIntensity * 60).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          filter: `blur(${blur / 2}px)`,
        }}
      />

      {/* Core eye */}
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: `
            0 0 ${size / 2}px ${color},
            0 0 ${size}px ${color},
            0 0 ${size * 1.5}px ${color}
          `,
        }}
      />

      {/* Inner highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: size / 3,
          height: size / 3,
          left: size / 4,
          top: size / 4,
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          filter: 'blur(2px)',
        }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// WOLF EYES TRANSITION WRAPPER
// Full sequence: fade in eyes -> hold -> fade out -> callback
// ─────────────────────────────────────────────────────────────

interface WolfEyesTransitionProps {
  children: React.ReactNode;
  show: boolean;
  color?: string;
  holdDuration?: number;
  onComplete?: () => void;
}

export function WolfEyesTransition({
  children,
  show,
  color = '#00F6E0',
  holdDuration = 1500,
  onComplete,
}: WolfEyesTransitionProps) {
  const [phase, setPhase] = React.useState<'hidden' | 'eyes' | 'content'>('hidden');

  React.useEffect(() => {
    if (show && phase === 'hidden') {
      setPhase('eyes');
    }
  }, [show, phase]);

  const handleEyesComplete = React.useCallback(() => {
    // Hold the eyes, then transition to content
    setTimeout(() => {
      setPhase('content');
      onComplete?.();
    }, holdDuration);
  }, [holdDuration, onComplete]);

  if (phase === 'hidden') {
    return null;
  }

  if (phase === 'eyes') {
    return (
      <WolfEyes
        color={color}
        size="lg"
        glowIntensity={1.2}
        onComplete={handleEyesComplete}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

export default WolfEyes;
