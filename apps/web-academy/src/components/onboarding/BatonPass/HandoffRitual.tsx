// ═══════════════════════════════════════════════════════════
// HANDOFF RITUAL
// Theatrical experience when parent hands device to athlete
// Dark screen → Haptics → Wolf Eyes → Voice start
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { WolfEyes } from "./WolfEyes";

interface HandoffRitualProps {
  athleteName: string;
  onComplete?: () => void;
}

type RitualPhase = "dark" | "scanning" | "eyes" | "welcome" | "complete";

export function HandoffRitual({ athleteName, onComplete }: HandoffRitualProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<RitualPhase>("dark");

  // Haptic feedback helper
  const triggerHaptic = useCallback((pattern: "light" | "medium" | "heavy" | "heartbeat") => {
    if (!("vibrate" in navigator)) return;

    switch (pattern) {
      case "light":
        navigator.vibrate(50);
        break;
      case "medium":
        navigator.vibrate(100);
        break;
      case "heavy":
        navigator.vibrate(200);
        break;
      case "heartbeat":
        // Thump... Thump... pattern
        navigator.vibrate([100, 200, 100, 400, 100, 200, 100]);
        break;
    }
  }, []);

  // Run the ritual sequence
  useEffect(() => {
    const runRitual = async () => {
      // Phase 1: Dark (1s)
      await new Promise((resolve) => setTimeout(resolve, 500));
      triggerHaptic("heartbeat");

      // Phase 2: Scanning (1.5s)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPhase("scanning");
      triggerHaptic("light");

      // Phase 3: Eyes (2s)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPhase("eyes");
      triggerHaptic("medium");

      // Phase 4: Welcome (2s)
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setPhase("welcome");
      triggerHaptic("heavy");

      // Phase 5: Complete - redirect to voice sorting
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPhase("complete");
    };

    runRitual();
  }, [triggerHaptic]);

  // Handle completion
  useEffect(() => {
    if (phase === "complete") {
      if (onComplete) {
        onComplete();
      } else {
        // Default: go to voice sorting with athlete context
        router.push("/voice-sorting?mode=athlete&voice=realtime");
      }
    }
  }, [phase, onComplete, router]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#0A0F0F" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {/* Phase 1: Dark with heartbeat text */}
        {phase === "dark" && (
          <motion.div
            key="dark"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-4 h-4 rounded-full mx-auto"
              style={{ backgroundColor: "var(--accent-primary)" }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}

        {/* Phase 2: Scanning */}
        {phase === "scanning" && (
          <motion.div
            key="scanning"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Scan line */}
            <motion.div
              className="w-48 h-1 rounded-full mx-auto mb-8"
              style={{ backgroundColor: "var(--accent-primary)" }}
              animate={{
                scaleX: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.p
              className="font-bebas text-sm tracking-[0.4em]"
              style={{ color: "var(--accent-primary)" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              SCANNING BIOMETRICS
            </motion.p>
          </motion.div>
        )}

        {/* Phase 3: Wolf Eyes */}
        {phase === "eyes" && (
          <motion.div
            key="eyes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WolfEyes delay={200} />
          </motion.div>
        )}

        {/* Phase 4: Welcome Message */}
        {phase === "welcome" && (
          <motion.div
            key="welcome"
            className="text-center px-8 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.p
              className="text-lg mb-2"
              style={{ color: "var(--text-secondary)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to the Pack,
            </motion.p>
            <motion.h1
              className="font-bebas text-4xl tracking-wider mb-6"
              style={{ color: "var(--accent-primary)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {athleteName.toUpperCase()}
            </motion.h1>
            <motion.p
              className="text-sm"
              style={{ color: "var(--text-tertiary)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Your parent briefed me. Let's work.
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              className="mt-8 flex justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
