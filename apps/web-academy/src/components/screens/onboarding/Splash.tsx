// ═══════════════════════════════════════════════════════════
// SPLASH SCREEN
// Brand moment + loading state
// Auto-advances when auth state resolved
// Intensity Budget: 5 points (logo fade only)
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashProps {
  onComplete: () => void;
  minDuration?: number; // minimum display time in ms
}

export function Splash({ onComplete, minDuration = 2500 }: SplashProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Minimum branding time before allowing navigation
    const timer = setTimeout(() => {
      setIsReady(true);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  useEffect(() => {
    if (isReady) {
      // Small delay for exit animation
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(exitTimer);
    }
  }, [isReady, onComplete]);

  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{ backgroundColor: "var(--bg-primary)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Wolf Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6"
          >
            <span className="text-8xl">🐺</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-bebas text-4xl tracking-widest mb-2"
            style={{ color: "var(--text-primary)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            BAREFOOT RESET
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-sm tracking-wider mb-12"
            style={{ color: "var(--text-tertiary)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            42 Days to Unbreakable
          </motion.p>

          {/* Loading indicator */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <LoadingDots />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoadingDots() {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--accent-primary)" }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      {/* Loading text - Space Grotesk */}
      <span
        className="text-[10px] tracking-[0.2em] uppercase"
        style={{
          fontFamily: "var(--font-loading)",
          color: "var(--text-tertiary)",
        }}
      >
        Loading
      </span>
    </div>
  );
}

export default Splash;
