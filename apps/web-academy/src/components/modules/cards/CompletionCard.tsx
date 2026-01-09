// ═══════════════════════════════════════════════════════════
// COMPLETION CARD
// Module finish screen with badge, XP, and unlocked content
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Share2, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CompletionCard as CompletionCardType, ContentMode } from "@/data/modules/types";

interface CompletionCardProps {
  card: CompletionCardType;
  mode: ContentMode;
  score: number; // Correct answers
  totalChecks: number;
  xpEarned: number;
  timeElapsed: number; // Seconds
  onComplete: () => void;
}

export function CompletionCard({
  card,
  mode,
  score,
  totalChecks,
  xpEarned,
  timeElapsed,
  onComplete,
}: CompletionCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const content = card.content[mode];
  const badge = card.completionBadge;
  const percentage = Math.round((score / totalChecks) * 100);

  // Format time
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  useEffect(() => {
    // Trigger confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full px-6 py-8 overflow-y-auto">
      {/* Confetti effect */}
      {showConfetti && <ConfettiEffect />}

      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold/50 flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.4)]">
          <Trophy className="w-12 h-12 text-black" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-bebas uppercase tracking-wide text-center text-accent-gold mb-2"
      >
        Module Complete!
      </motion.h1>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <p className="text-xl text-white mb-1">
          Score: {score}/{totalChecks} ({percentage}%)
        </p>
        <p className="text-text-secondary">Time: {timeString}</p>
      </motion.div>

      {/* XP earned */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center mb-6"
      >
        <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-gold/10 border border-accent-gold/30">
          <Zap className="w-6 h-6 text-accent-gold" />
          <span className="text-2xl font-bold text-accent-gold">+{xpEarned} XP</span>
        </div>
      </motion.div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center mb-8"
      >
        <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-bg-tertiary border border-border-default">
          <span className="text-3xl">{badge.icon}</span>
          <div>
            <p className="font-bold text-white">{badge.name}</p>
            <p className="text-sm text-text-tertiary">{badge.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Unlocked content */}
      {card.unlockedContent && card.unlockedContent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-center text-sm uppercase tracking-widest text-text-tertiary mb-4">
            Unlocked for You
          </h3>
          <div className="space-y-3">
            {card.unlockedContent.map((item) => (
              <Link
                key={item.id}
                href={
                  item.type === "Product"
                    ? `/shop/${item.handle}`
                    : item.type === "DrillStack"
                      ? `/playbook/drills/${item.id}`
                      : `/programs/${item.id}`
                }
                className="flex items-center gap-4 p-4 rounded-xl bg-bg-tertiary border border-border-default
                         hover:border-accent-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                  {item.type === "DrillStack" && <span className="text-xl">🎬</span>}
                  {item.type === "Program" && <span className="text-xl">📚</span>}
                  {item.type === "Product" && <span className="text-xl">🛒</span>}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white group-hover:text-accent-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-sm text-text-tertiary">
                    {item.description}
                    {item.duration && ` • ${item.duration}`}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-accent-primary transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* What's next content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bebas uppercase tracking-wide text-white mb-3">
          {content.headline}
        </h3>
        {content.body && <p className="text-text-secondary whitespace-pre-line">{content.body}</p>}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3 mt-auto"
      >
        <button
          onClick={onComplete}
          className="w-full py-4 bg-accent-primary text-black font-bold uppercase tracking-wide rounded-xl
                   hover:bg-accent-primary-hover transition-colors
                   shadow-[0_0_20px_rgba(0,246,224,0.3)]"
        >
          Done
        </button>

        <button
          onClick={() => {
            // Share functionality - could be implemented with Web Share API
            if (navigator.share) {
              navigator.share({
                title: "I completed Bulletproof Ankles!",
                text: `I scored ${percentage}% on the Bulletproof Ankles module at YP Academy!`,
                url: window.location.href,
              });
            }
          }}
          className="w-full py-3 flex items-center justify-center gap-2 rounded-xl
                   border border-border-default text-text-secondary
                   hover:border-accent-primary/50 hover:text-white transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span>Share Results</span>
        </button>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONFETTI EFFECT
// ─────────────────────────────────────────────────────────────

function ConfettiEffect() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    size: 6 + Math.random() * 8,
    color: ["var(--accent-primary)", "var(--accent-gold)", "#ffffff"][
      Math.floor(Math.random() * 3)
    ],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: "100vh", opacity: 0 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </div>
  );
}
