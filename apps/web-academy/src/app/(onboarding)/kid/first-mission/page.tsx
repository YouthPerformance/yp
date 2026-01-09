// ═══════════════════════════════════════════════════════════
// FIRST MISSION (Kid Ready Screen)
// Shows their first workout card and sends them to home
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function FirstMissionPage() {
  const router = useRouter();
  const { data } = useOnboarding();

  const athleteName = data.athleteName || "Champion";

  const handleStart = () => {
    // Go to main app
    router.push("/home");
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Confetti Effect (simplified) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor:
                i % 2 === 0 ? "var(--accent-primary)" : "var(--accent-secondary, #FF00FF)",
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: ["0vh", "100vh"],
              opacity: [1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-sm w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {/* Wolf */}
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden"
          animate={{ y: [0, -5, 0] }}
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

        {/* Badge */}
        <motion.div
          className="inline-block px-4 py-2 rounded-full mb-4"
          style={{
            backgroundColor: "var(--accent-primary)20",
            border: "1px solid var(--accent-primary)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <span className="font-bebas tracking-wider" style={{ color: "var(--accent-primary)" }}>
            DAY 1 READY
          </span>
        </motion.div>

        <h1
          className="font-bebas text-3xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          YOUR FIRST MISSION IS READY
        </h1>

        <p className="text-sm mb-8" style={{ color: "var(--text-tertiary)" }}>
          Let's start your 42-day journey, {athleteName}
        </p>

        {/* Mission Card */}
        <motion.div
          className="rounded-2xl p-6 mb-8 text-left"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--accent-primary)40",
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: "var(--accent-primary)20" }}
            >
              🎯
            </div>
            <div>
              <p
                className="font-bebas text-lg tracking-wider"
                style={{ color: "var(--accent-primary)" }}
              >
                FOUNDATION DAY 1
              </p>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                ~15 min • Build Your Base
              </p>
            </div>
          </div>

          <div
            className="flex items-center justify-between text-sm px-3 py-2 rounded-lg"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            <span style={{ color: "var(--text-secondary)" }}>Reward:</span>
            <span style={{ color: "var(--accent-primary)" }}>+50 XP</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          onClick={handleStart}
          className="w-full py-4 rounded-xl font-bebas text-xl tracking-wider"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          START TRAINING
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
