// ═══════════════════════════════════════════════════════════
// PLAYBOOK PAGE
// Content library with FREE teaser module
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Lock, Play, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UpsellModal } from "@/components/modals";
import { useUserContext } from "@/contexts/UserContext";
import { teaserRegistry } from "@/data/modules/bulletproof-ankles";

// Get the BPA teaser module
const bpaTeaser = teaserRegistry["bulletproof-ankles-teaser"];

const mockContent = [
  { id: "1", title: "The Science of Barefoot Training", duration: "5 min", type: "article" },
  { id: "2", title: "Why Ankle Mobility Matters", duration: "3 min", type: "video" },
  { id: "3", title: "Building Your Foundation", duration: "4 min", type: "article" },
  { id: "4", title: "Spring vs Piston Movement", duration: "6 min", type: "video" },
  { id: "5", title: "Recovery Protocols", duration: "4 min", type: "article" },
];

export default function PlaybookPage() {
  const [showUpsell, setShowUpsell] = useState(false);
  const { user } = useUserContext();
  const subscriptionStatus = user?.subscriptionStatus || "free";

  return (
    <main className="p-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-bebas text-3xl tracking-wider" style={{ color: "var(--text-primary)" }}>
          PLAYBOOK
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Training guides and educational content
        </p>
      </motion.div>

      {/* FREE Teaser Module - Featured */}
      {bpaTeaser && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link href={`/playbook/modules/${bpaTeaser.slug}/play`}>
            <motion.div
              className="relative p-5 rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 246, 224, 0.15) 0%, rgba(255, 215, 0, 0.1) 100%)",
                border: "1px solid var(--accent-cyan)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* FREE Badge */}
              <div
                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-gold))",
                  color: "black",
                }}
              >
                FREE
              </div>

              {/* Content */}
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-gold))",
                  }}
                >
                  <span className="text-2xl">{bpaTeaser.teaserBadge.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bebas text-xl tracking-wider mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {bpaTeaser.title}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                    {bpaTeaser.subtitle}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" style={{ color: "var(--text-tertiary)" }} />
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {bpaTeaser.estimatedMinutes} min
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" style={{ color: "var(--accent-gold)" }} />
                      <span className="text-xs" style={{ color: "var(--accent-gold)" }}>
                        +{bpaTeaser.maxXp} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" style={{ color: "var(--accent-cyan)" }} />
                      <span className="text-xs" style={{ color: "var(--accent-cyan)" }}>
                        +{bpaTeaser.maxShards} shards
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Play button */}
              <motion.div
                className="mt-4 py-3 rounded-xl text-center font-bebas tracking-wider"
                style={{
                  backgroundColor: "var(--accent-cyan)",
                  color: "black",
                }}
              >
                START FREE LESSON
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      )}

      {/* Locked Banner */}
      {subscriptionStatus === "free" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-4 rounded-xl text-center"
          style={{
            backgroundColor: "rgba(255, 215, 0, 0.1)",
            border: "1px solid rgba(255, 215, 0, 0.3)",
          }}
        >
          <Lock className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--accent-gold)" }} />
          <h3
            className="font-bebas text-lg tracking-wider mb-1"
            style={{ color: "var(--accent-gold)" }}
          >
            PREMIUM CONTENT
          </h3>
          <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
            Upgrade to access the full playbook library
          </p>
          <motion.button
            onClick={() => setShowUpsell(true)}
            className="px-6 py-2 rounded-lg font-bebas tracking-wider"
            style={{
              backgroundColor: "var(--accent-gold)",
              color: "var(--bg-primary)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            UNLOCK NOW
          </motion.button>
        </motion.div>
      )}

      {/* Content List */}
      <div className="space-y-3">
        {mockContent.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl flex items-center gap-4 relative overflow-hidden"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              opacity: subscriptionStatus === "free" ? 0.5 : 1,
            }}
            onClick={() => subscriptionStatus === "free" && setShowUpsell(true)}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              {item.type === "video" ? (
                <Play className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
              ) : (
                <BookOpen className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3" style={{ color: "var(--text-tertiary)" }} />
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {item.duration}
                </span>
              </div>
            </div>
            {subscriptionStatus === "free" && (
              <Lock className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
            )}
          </motion.div>
        ))}
      </div>

      <UpsellModal isOpen={showUpsell} onClose={() => setShowUpsell(false)} />
    </main>
  );
}
