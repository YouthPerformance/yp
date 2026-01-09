// ═══════════════════════════════════════════════════════════
// MEET YOUR WOLF (Kid Experience)
// Wolf greets the kid using their profile data
// Exciting, animated, magical experience
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function MeetWolfPage() {
  const router = useRouter();
  const { data, assignFoundationProgram } = useOnboarding();

  const [phase, setPhase] = useState<"intro" | "greeting" | "ready">("intro");
  const athleteName = data.athleteName || "Champion";
  const firstGoal = data.athleteGoals[0];

  // Map goal to display text
  const goalText: Record<string, string> = {
    get_faster: "get faster",
    jump_higher: "jump higher",
    build_strength: "build strength",
    prevent_injuries: "stay healthy",
    make_team: "make the team",
    have_fun: "have some fun",
  };

  // Progress through phases
  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("greeting"), 2000);
    const timer2 = setTimeout(() => setPhase("ready"), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleStart = () => {
    // Auto-assign Foundation program
    assignFoundationProgram();
    // Go to avatar selection
    router.push("/kid/avatar");
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "intro" ? 0 : 0.3 }}
        transition={{ duration: 1 }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--accent-primary)" }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-sm w-full">
        <AnimatePresence mode="wait">
          {/* PHASE 1: Wolf Appears */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="space-y-4"
            >
              <motion.div
                className="w-32 h-32 mx-auto rounded-2xl overflow-hidden"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <Image
                  src="/images/wolffront.webp"
                  alt="Wolf"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p
                  className="font-bebas text-3xl tracking-wider"
                  style={{ color: "var(--accent-primary)" }}
                >
                  ...
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* PHASE 2: Wolf Greets */}
          {phase === "greeting" && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div
                className="w-28 h-28 mx-auto rounded-2xl overflow-hidden"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Image
                  src="/images/wolffront.webp"
                  alt="Wolf"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Speech Bubble */}
              <motion.div
                className="rounded-2xl p-6 relative"
                style={{ backgroundColor: "var(--bg-secondary)" }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Pointer */}
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                />

                <motion.p
                  className="text-xl"
                  style={{ color: "var(--text-primary)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Hey <span style={{ color: "var(--accent-primary)" }}>{athleteName}</span>!
                </motion.p>

                <motion.p
                  className="text-xl mt-2"
                  style={{ color: "var(--text-primary)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  I'm <span style={{ color: "var(--accent-primary)" }}>Wolf</span>.
                </motion.p>

                {firstGoal && (
                  <motion.p
                    className="text-lg mt-3"
                    style={{ color: "var(--text-secondary)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    I heard you want to {goalText[firstGoal] || "train hard"}.
                    <br />
                    I'm here to help you get there.
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* PHASE 3: Ready to Start */}
          {phase === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <motion.div
                className="w-24 h-24 mx-auto rounded-2xl overflow-hidden"
                animate={{ rotate: [0, -3, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Image
                  src="/images/wolffront.webp"
                  alt="Wolf"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "var(--bg-secondary)" }}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                <h2
                  className="font-bebas text-2xl tracking-wider mb-2"
                  style={{ color: "var(--accent-primary)" }}
                >
                  READY TO START TRAINING?
                </h2>

                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  Let's set up your avatar first
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                onClick={handleStart}
                className="w-full py-4 rounded-xl font-bebas text-xl tracking-wider transition-all"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--bg-primary)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                LET'S GO! 🚀
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip Button (only in early phases) */}
      {phase !== "ready" && (
        <motion.button
          onClick={() => setPhase("ready")}
          className="absolute bottom-8 text-sm"
          style={{ color: "var(--text-tertiary)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
        >
          Skip
        </motion.button>
      )}
    </motion.div>
  );
}
