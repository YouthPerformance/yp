// ═══════════════════════════════════════════════════════════
// WOLF PARTICLES COMPONENT
// Radial burst particle system for celebrations
// Particles burst OUTWARD from center (not rain down)
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PARTICLE_PRESETS } from '@/lib/ticker-config';
import { random, randomInt } from '@/lib/utils';

interface WolfParticlesProps {
  color?: string;
  intensity?: number;
  variant?: 'celebration' | 'epic';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  velocity: number;
  delay: number;
}

export function WolfParticles({
  color,
  intensity = 1,
  variant = 'celebration',
}: WolfParticlesProps) {
  const preset = PARTICLE_PRESETS[variant];
  const particleColor = color || preset.color;
  const count = Math.round(preset.count * intensity);

  // Generate particles
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = random(preset.angle[0], preset.angle[1]);
      const velocity = random(preset.velocity[0], preset.velocity[1]);
      const size = randomInt(preset.size[0], preset.size[1]);

      // Convert angle to radians for position calculation
      const angleRad = (angle * Math.PI) / 180;

      return {
        id: i,
        x: Math.cos(angleRad) * velocity,
        y: Math.sin(angleRad) * velocity,
        size,
        angle,
        velocity,
        delay: random(0, 0.1),
      };
    });
  }, [count, preset]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particleColor,
            left: '50%',
            top: '50%',
            marginLeft: -particle.size / 2,
            marginTop: -particle.size / 2,
            boxShadow: `0 0 ${particle.size * 2}px ${particleColor}`,
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: particle.x,
            y: particle.y + preset.gravity, // Apply gravity
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: preset.lifetime / 1000,
            delay: particle.delay,
            ease: [0.25, 0.46, 0.45, 0.94], // Custom ease out
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONFETTI VARIANT (For Day 42 / Program Complete)
// ─────────────────────────────────────────────────────────────

interface ConfettiProps {
  colors?: string[];
  count?: number;
}

export function Confetti({
  colors = ['#00F6E0', '#FBBF24', '#FFFFFF'],
  count = 50,
}: ConfettiProps) {
  const confettiPieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[randomInt(0, colors.length - 1)],
      x: random(-200, 200),
      y: random(-300, -100),
      rotation: random(0, 360),
      scale: random(0.5, 1.5),
      delay: random(0, 0.5),
    }));
  }, [count, colors]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3"
          style={{
            backgroundColor: piece.color,
            left: '50%',
            top: '50%',
          }}
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            scale: piece.scale,
            opacity: 1,
          }}
          animate={{
            x: piece.x,
            y: [piece.y, piece.y + 500],
            rotate: piece.rotation + random(180, 540),
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: piece.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  );
}

export default WolfParticles;
