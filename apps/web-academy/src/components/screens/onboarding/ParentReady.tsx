// ═══════════════════════════════════════════════════════════
// PARENT READY SCREEN
// Final screen showing waiting state for athlete to join
// Light "Sponsor Report" theme
// Intensity Budget: 5 points
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";

interface ParentReadyProps {
  onStart: () => void;
}

export function ParentReady({ onStart }: ParentReadyProps) {
  const { data, completeOnboarding } = useOnboarding();

  const handleStart = async () => {
    await completeOnboarding();
    onStart();
  };

  const athleteCode = data.athleteCodes[data.athleteCodes.length - 1] || "XXXXXX";

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-8"
      style={{ backgroundColor: "#F6F7F9" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Success Icon */}
        <motion.div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: "#00BFB020" }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          <motion.span
            className="text-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ✓
          </motion.span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-bebas text-3xl tracking-wider mb-4"
          style={{ color: "#1A1A1A" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          YOU'RE ALL SET
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-base mb-8 max-w-xs"
          style={{ color: "#666" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Once your athlete joins with their code, you'll see their progress here
        </motion.p>

        {/* Waiting Card */}
        <motion.div
          className="w-full max-w-xs rounded-2xl p-6"
          style={{ backgroundColor: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Loading animation - Space Grotesk font */}
          <div className="flex flex-col items-center gap-3 mb-4">
            {/* Dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#00BFB0" }}
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
          </div>

          <p
            className="text-xs tracking-[0.15em] uppercase"
            style={{
              fontFamily: "var(--font-loading)",
              color: "#666",
            }}
          >
            Waiting for athlete
          </p>

          {/* Code reminder */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "#E5E5E5" }}>
            <p className="text-xs" style={{ color: "#999" }}>
              Their code:
            </p>
            <p className="font-mono text-lg tracking-widest" style={{ color: "#00BFB0" }}>
              {athleteCode}
            </p>
          </div>
        </motion.div>

        {/* What to expect */}
        <motion.div
          className="mt-8 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs" style={{ color: "#999" }}>
            Once they join, you'll be able to:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Track progress", "View safety flags", "Get weekly reports"].map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs"
                style={{ backgroundColor: "#E5E5E5", color: "#666" }}
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider"
        style={{
          backgroundColor: "#00BFB0",
          color: "white",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        GO TO DASHBOARD →
      </motion.button>

      {/* Add another athlete link */}
      <motion.button
        className="mt-4 text-sm text-center"
        style={{ color: "#00BFB0" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        + Add another athlete
      </motion.button>
    </motion.div>
  );
}

export default ParentReady;
