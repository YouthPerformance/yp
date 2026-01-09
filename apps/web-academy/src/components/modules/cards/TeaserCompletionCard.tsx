// ═══════════════════════════════════════════════════════════
// TEASER COMPLETION CARD
// End screen for teaser modules with conversion CTAs
// Email gate → Drill Stack OR Upsell → Paid Program
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { Mail, Sparkles, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { ContentMode, TeaserModule } from "@/data/modules/types";
import { EmailCaptureModal } from "@/components/modals/EmailCaptureModal";
import { UpsellModal } from "@/components/modals/UpsellModal";

interface TeaserCompletionCardProps {
  module: TeaserModule;
  mode: ContentMode;
  score: number;
  totalChecks: number;
  xpEarned: number;
  shardsEarned: number;
  timeElapsed: number;
  onComplete: () => void;
}

export function TeaserCompletionCard({
  module,
  mode,
  score,
  totalChecks,
  xpEarned,
  shardsEarned,
  timeElapsed,
  onComplete,
}: TeaserCompletionCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);

  const badge = module.teaserBadge;
  const conversion = module.conversion;
  const emailGate = module.emailGate;
  const percentage = totalChecks > 0 ? Math.round((score / totalChecks) * 100) : 100;

  // Format time
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEmailSuccess = (email: string) => {
    setEmailCaptured(true);
    setShowEmailModal(false);
  };

  return (
    <div className="flex flex-col h-full px-6 py-8 overflow-y-auto">
      {/* Confetti effect */}
      {showConfetti && <ConfettiEffect />}

      {/* Trophy with gradient glow */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center mb-6"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-gold) 100%)",
            boxShadow: "0 0 60px rgba(0, 246, 224, 0.4)",
          }}
        >
          <Trophy className="w-12 h-12 text-black" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-bebas uppercase tracking-wide text-center mb-2"
        style={{ color: "var(--accent-cyan)" }}
      >
        {mode === "parent" ? "Knowledge Unlocked!" : "You Did It!"}
      </motion.h1>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-4 mb-6"
      >
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {percentage}%
          </p>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Score
          </p>
        </div>
        <div
          className="w-px"
          style={{ backgroundColor: "var(--border-default)" }}
        />
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {timeString}
          </p>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Time
          </p>
        </div>
      </motion.div>

      {/* XP + Shards earned */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center gap-3 mb-6"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            backgroundColor: "rgba(255, 215, 0, 0.1)",
            border: "1px solid rgba(255, 215, 0, 0.3)",
          }}
        >
          <Zap className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
          <span className="text-lg font-bold" style={{ color: "var(--accent-gold)" }}>
            +{xpEarned} XP
          </span>
        </div>
        {shardsEarned > 0 && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              backgroundColor: "rgba(0, 246, 224, 0.1)",
              border: "1px solid rgba(0, 246, 224, 0.3)",
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: "var(--accent-cyan)" }} />
            <span className="text-lg font-bold" style={{ color: "var(--accent-cyan)" }}>
              +{shardsEarned}
            </span>
          </div>
        )}
      </motion.div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center mb-8"
      >
        <div
          className="flex items-center gap-3 px-6 py-3 rounded-xl"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <span className="text-3xl">{badge.icon}</span>
          <div>
            <p className="font-bold" style={{ color: "var(--text-primary)" }}>
              {badge.name}
            </p>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              {badge.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Conversion section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4 mt-auto"
      >
        {/* Headline */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bebas uppercase tracking-wide mb-1" style={{ color: "var(--text-primary)" }}>
            {conversion.headline}
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {conversion.subheadline}
          </p>
        </div>

        {/* CTA 1: Email Gate (if enabled and not yet captured) */}
        {emailGate.enabled && !emailCaptured && (
          <motion.button
            onClick={() => setShowEmailModal(true)}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-gold) 100%)",
              color: "black",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mail className="w-5 h-5" />
            {emailGate.ctaText || "Get Free Drill Stack"}
          </motion.button>
        )}

        {/* Success message after email captured */}
        {emailCaptured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl text-center"
            style={{
              backgroundColor: "rgba(0, 246, 224, 0.1)",
              border: "1px solid var(--accent-cyan)",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--accent-cyan)" }}>
              ✓ Check your inbox for your free drill stack!
            </p>
          </motion.div>
        )}

        {/* CTA 2: Upsell to paid program */}
        <motion.button
          onClick={() => setShowUpsellModal(true)}
          className="w-full py-4 rounded-xl font-bebas text-xl tracking-wider relative overflow-hidden"
          style={{
            backgroundColor: emailCaptured ? "var(--accent-primary)" : "var(--bg-tertiary)",
            color: emailCaptured ? "black" : "var(--text-primary)",
            border: emailCaptured ? "none" : "1px solid var(--border-default)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          UNLOCK FULL CHALLENGE — ${Math.round(conversion.price / 100)}
          {conversion.originalPrice && (
            <span className="ml-2 line-through opacity-60">
              ${Math.round(conversion.originalPrice / 100)}
            </span>
          )}
        </motion.button>

        {/* CTA 3: Maybe Later */}
        <button
          onClick={onComplete}
          className="w-full py-3 text-sm transition-colors"
          style={{ color: "var(--text-tertiary)" }}
        >
          Maybe Later
        </button>
      </motion.div>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSuccess={handleEmailSuccess}
        source={`${module.slug}-completion`}
        rewardSlug={emailGate.rewardSlug}
        rewardName={emailGate.rewardName}
        headline="Unlock Your Free Drill Stack"
        subheadline="Get instant access to the exercises that build bulletproof ankles."
      />

      {/* Upsell Modal */}
      <UpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
      />
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
    color: ["var(--accent-cyan)", "var(--accent-gold)", "#ffffff"][
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
