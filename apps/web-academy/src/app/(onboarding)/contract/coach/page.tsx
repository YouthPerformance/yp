// ═══════════════════════════════════════════════════════════
// COACH INTRO PAGE
// Post-contract: Meet your AI coach before first training
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ChatMessage {
  id: number;
  text: string;
  delay: number;
}

const COACH_MESSAGES: ChatMessage[] = [
  { id: 1, text: "Welcome to the Pack.", delay: 0 },
  { id: 2, text: "I'm Wolf — your AI training coach.", delay: 1200 },
  { id: 3, text: "You've got 42 days. 30 levels to complete.", delay: 2400 },
  { id: 4, text: "Each level: watch the video (90%+), write a real note.", delay: 3600 },
  { id: 5, text: "No shortcuts. The Pack doesn't do shortcuts.", delay: 4800 },
  { id: 6, text: "Ready to start Level 1?", delay: 6000 },
];

export default function CoachIntroPage() {
  const router = useRouter();
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [showButton, setShowButton] = useState(false);

  // Reveal messages one by one
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    COACH_MESSAGES.forEach((msg) => {
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg.id]);
      }, msg.delay);
      timers.push(timer);
    });

    // Show button after all messages
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 7200);
    timers.push(buttonTimer);

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const handleStart = () => {
    router.push("/programs"); // Go to programs/training
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Wolf Avatar */}
      <motion.div
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-cyan-500/50">
          <Image
            src="/images/wolffront.webp"
            alt="Wolf Coach"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <span
            className="font-bebas text-lg tracking-wider"
            style={{ color: "var(--accent-primary)" }}
          >
            WOLF
          </span>
          <span
            className="text-xs block"
            style={{ color: "var(--text-tertiary)" }}
          >
            AI Coach
          </span>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-md space-y-4">
        <AnimatePresence>
          {COACH_MESSAGES.filter((msg) => visibleMessages.includes(msg.id)).map(
            (msg) => (
              <motion.div
                key={msg.id}
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Message bubble */}
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Typing indicator */}
        {visibleMessages.length < COACH_MESSAGES.length && (
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="rounded-2xl rounded-tl-sm px-4 py-3"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--text-tertiary)" }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Start Button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            className="max-w-md w-full mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "var(--bg-primary)",
              }}
            >
              START LEVEL 1
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
