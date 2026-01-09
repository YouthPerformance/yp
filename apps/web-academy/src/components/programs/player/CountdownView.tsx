// ═══════════════════════════════════════════════════════════
// CountdownView Component
// 3-2-1 countdown before workout starts
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CountdownViewProps {
  onComplete: () => void;
  workoutTitle: string;
}

export function CountdownView({ onComplete, workoutTitle }: CountdownViewProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full space-y-12"
    >
      {/* Timer Circle */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background ring */}
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            stroke="var(--accent-primary)"
            strokeWidth="4"
            fill="none"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: count / 3 }}
            transition={{ duration: 1, ease: "linear" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Number */}
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-8xl font-bebas font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {count || "GO!"}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Workout Title */}
      <div className="text-center px-12">
        <h1
          className="font-bebas text-5xl uppercase leading-none mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {workoutTitle}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Get ready...
        </p>
      </div>
    </motion.div>
  );
}
