// ═══════════════════════════════════════════════════════════
// HANDOVER PAGE
// Parent hands device to athlete with ceremonial hold-to-unlock
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";

const HOLD_DURATION = 3000; // 3 seconds

export default function HandoverPage() {
  const router = useRouter();
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startHold = useCallback(() => {
    if (isUnlocked) return;

    setIsHolding(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        // Unlock!
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsUnlocked(true);
        setIsHolding(false);

        // Navigate after celebration
        setTimeout(() => {
          router.push("/contract/sign");
        }, 800);
      }
    }, 16); // ~60fps
  }, [isUnlocked, router]);

  const endHold = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsHolding(false);

    // Reset if not unlocked
    if (!isUnlocked) {
      setHoldProgress(0);
    }
  }, [isUnlocked]);

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1
          className="font-bebas text-3xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          HAND THE DEVICE TO YOUR ATHLETE
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          It's their turn to make the commitment
        </p>
      </motion.div>

      {/* Wolf Image */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div
          className={`relative w-40 h-40 mb-8 ${isUnlocked ? "animate-pulse" : ""}`}
        >
          <Image
            src="/images/wolffront.webp"
            alt="Wolf Pack"
            fill
            className={`object-cover rounded-2xl transition-all duration-300 ${
              isUnlocked ? "brightness-110" : isHolding ? "brightness-125" : ""
            }`}
          />

          {/* Glow effect when holding */}
          {isHolding && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                boxShadow: `0 0 ${20 + holdProgress * 0.5}px var(--accent-primary)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: holdProgress / 100 }}
            />
          )}
        </div>

        {/* Instructions */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p
            className="font-bebas text-xl tracking-wide mb-2"
            style={{
              color: isUnlocked ? "var(--accent-primary)" : "var(--text-secondary)",
            }}
          >
            {isUnlocked
              ? "UNLOCKED"
              : isHolding
                ? "HOLD..."
                : "ATHLETE: HOLD THE BUTTON BELOW"}
          </p>
          {!isUnlocked && (
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              3 seconds to prove you're ready
            </p>
          )}
        </motion.div>

        {/* Hold Button */}
        {!isUnlocked && (
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Progress Ring */}
            <svg
              className="absolute inset-0 w-32 h-32 -rotate-90"
              viewBox="0 0 128 128"
            >
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="var(--bg-tertiary)"
                strokeWidth="6"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${holdProgress * 3.64} 364`}
                className="transition-all"
              />
            </svg>

            {/* Button */}
            <button
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              className="relative w-32 h-32 rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: isHolding ? "var(--accent-primary)" : "var(--bg-secondary)",
                transform: isHolding ? "scale(0.95)" : "scale(1)",
              }}
            >
              <span
                className="font-bebas text-lg tracking-wider"
                style={{
                  color: isHolding ? "var(--bg-primary)" : "var(--text-secondary)",
                }}
              >
                HOLD
              </span>
            </button>
          </motion.div>
        )}

        {/* Success State */}
        {isUnlocked && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "var(--accent-primary)" }}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="var(--bg-primary)"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p
              className="font-bebas text-lg tracking-wider"
              style={{ color: "var(--accent-primary)" }}
            >
              LET'S GO
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Back Button (for parent if needed) */}
      <motion.div
        className="max-w-md mx-auto w-full pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={() => router.back()}
          className="w-full py-3 text-sm"
          style={{ color: "var(--text-tertiary)" }}
        >
          Back (Parent Only)
        </button>
      </motion.div>
    </motion.div>
  );
}
