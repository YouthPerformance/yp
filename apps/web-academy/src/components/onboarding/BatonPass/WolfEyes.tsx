// ═══════════════════════════════════════════════════════════
// WOLF EYES - Opening Animation
// Theatrical reveal: Wolf eyes open to greet the athlete
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface WolfEyesProps {
  onComplete?: () => void;
  delay?: number;
}

export function WolfEyes({ onComplete, delay = 0 }: WolfEyesProps) {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // Wait for initial delay
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Eyes closed → slightly open
      await controls.start({
        scaleY: 0.1,
        transition: { duration: 0.3, ease: "easeOut" },
      });

      // Brief pause
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Eyes open fully
      await controls.start({
        scaleY: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });

      // Glow pulse
      await controls.start({
        filter: [
          "drop-shadow(0 0 20px rgba(0, 246, 224, 0.8))",
          "drop-shadow(0 0 40px rgba(0, 246, 224, 1))",
          "drop-shadow(0 0 20px rgba(0, 246, 224, 0.8))",
        ],
        transition: { duration: 0.8 },
      });

      onComplete?.();
    };

    sequence();
  }, [controls, delay, onComplete]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Background glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 0.3, 0.2],
          scale: [0.5, 1.2, 1],
        }}
        transition={{ duration: 1.5, delay: delay / 1000 }}
        style={{
          background:
            "radial-gradient(circle, rgba(0, 246, 224, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Wolf Eyes Container */}
      <div className="relative flex gap-12">
        {/* Left Eye */}
        <motion.div
          className="relative"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={controls}
        >
          <motion.div
            className="w-16 h-10 rounded-[50%] relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse at center, #00F6E0 0%, #00C4B4 50%, #008B80 100%)",
              boxShadow: "0 0 30px rgba(0, 246, 224, 0.6)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay / 1000 + 0.3 }}
          >
            {/* Pupil */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-4 h-6 rounded-[40%] -translate-x-1/2 -translate-y-1/2"
              style={{ backgroundColor: "#0A0F0F" }}
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 0.8, 0.7] }}
              transition={{ delay: delay / 1000 + 0.5, duration: 0.4 }}
            />
            {/* Eye highlight */}
            <motion.div
              className="absolute top-2 right-3 w-2 h-2 rounded-full bg-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay / 1000 + 0.7 }}
            />
          </motion.div>
        </motion.div>

        {/* Right Eye */}
        <motion.div
          className="relative"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={controls}
        >
          <motion.div
            className="w-16 h-10 rounded-[50%] relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse at center, #00F6E0 0%, #00C4B4 50%, #008B80 100%)",
              boxShadow: "0 0 30px rgba(0, 246, 224, 0.6)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay / 1000 + 0.3 }}
          >
            {/* Pupil */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-4 h-6 rounded-[40%] -translate-x-1/2 -translate-y-1/2"
              style={{ backgroundColor: "#0A0F0F" }}
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 0.8, 0.7] }}
              transition={{ delay: delay / 1000 + 0.5, duration: 0.4 }}
            />
            {/* Eye highlight */}
            <motion.div
              className="absolute top-2 right-3 w-2 h-2 rounded-full bg-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay / 1000 + 0.7 }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* "Identity Verified" text */}
      <motion.p
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 font-bebas text-lg tracking-[0.3em] whitespace-nowrap"
        style={{ color: "var(--accent-primary)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay / 1000 + 1.2 }}
      >
        IDENTITY VERIFIED
      </motion.p>
    </div>
  );
}
