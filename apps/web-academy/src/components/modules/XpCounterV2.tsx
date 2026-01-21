// ═══════════════════════════════════════════════════════════
// XP COUNTER V2
// Premium trophy-style XP display with particle effects
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface XpCounterV2Props {
  count: number;
  className?: string;
}

export function XpCounterV2({ count, className = "" }: XpCounterV2Props) {
  const [displayCount, setDisplayCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const spawnParticles = useCallback(() => {
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 40 - 20,
      y: Math.random() * -30 - 10,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 800);
  }, []);

  useEffect(() => {
    if (count !== displayCount) {
      setIsAnimating(true);
      spawnParticles();
      const timer = setTimeout(() => {
        setDisplayCount(count);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [count, displayCount, spawnParticles]);

  return (
    <motion.div
      className={`relative ${className}`}
      animate={isAnimating ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)",
        }}
      />

      {/* Main container */}
      <div
        className="relative flex items-center gap-2 px-4 py-2 rounded-full
                   bg-gradient-to-br from-amber-900/30 to-amber-950/50
                   border border-amber-500/30 backdrop-blur-sm
                   shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
      >
        {/* Lightning icon with glow */}
        <div className="relative">
          <motion.svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="relative z-10"
            animate={isAnimating ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              fill="url(#goldGradient)"
              stroke="rgba(255,215,0,0.8)"
              strokeWidth="1"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FF8C00" />
              </linearGradient>
            </defs>
          </motion.svg>
          {/* Icon glow */}
          <div
            className="absolute inset-0 blur-sm"
            style={{
              background: "radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Count */}
        <div className="flex items-baseline gap-1">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={displayCount}
              initial={{ opacity: 0, y: -15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="font-bold text-lg tabular-nums"
              style={{
                background: "linear-gradient(to bottom, #FFD700, #FFA500)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
              }}
            >
              {displayCount}
            </motion.span>
          </AnimatePresence>
          <span
            className="text-xs font-semibold tracking-wider opacity-70"
            style={{ color: "#FFD700" }}
          >
            XP
          </span>
        </div>

        {/* Particle effects */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
              style={{
                left: "50%",
                top: "50%",
                boxShadow: "0 0 6px rgba(255, 215, 0, 0.8)",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default XpCounterV2;
