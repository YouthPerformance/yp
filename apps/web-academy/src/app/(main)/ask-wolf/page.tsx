// ═══════════════════════════════════════════════════════════
// ASK WOLF PAGE
// AI assistant - locked for free users
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { Lock, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { UpsellModal } from "@/components/modals";
import { useUserContext } from "@/contexts/UserContext";

export default function AskWolfPage() {
  const [showUpsell, setShowUpsell] = useState(false);
  const { user } = useUserContext();
  const subscriptionStatus = user?.subscriptionStatus || "free";

  const sampleQuestions = [
    "How do I improve my ankle mobility?",
    "What should I eat before training?",
    "How long until I see results?",
    "Can I do this with shin splints?",
  ];

  return (
    <main className="p-4 max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <motion.span
          className="text-6xl block mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🐺
        </motion.span>
        <h1 className="font-bebas text-3xl tracking-wider" style={{ color: "var(--text-primary)" }}>
          ASK WOLF
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Your AI training assistant
        </p>
      </motion.div>

      {/* Locked State */}
      {subscriptionStatus === "free" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center text-center p-6"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
          >
            <Lock className="w-10 h-10" style={{ color: "var(--accent-gold)" }} />
          </div>
          <h2
            className="font-bebas text-2xl tracking-wider mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            UNLOCK WOLF AI
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>
            Get personalized answers to your training questions from our AI coach
          </p>

          {/* Sample Questions */}
          <div className="w-full space-y-2 mb-6">
            {sampleQuestions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg text-left text-sm"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-secondary)",
                }}
              >
                "{q}"
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={() => setShowUpsell(true)}
            className="px-8 py-3 rounded-xl font-bebas text-lg tracking-wider flex items-center gap-2"
            style={{
              backgroundColor: "var(--accent-gold)",
              color: "var(--bg-primary)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5" />
            UNLOCK NOW
          </motion.button>
        </motion.div>
      ) : (
        /* Chat Interface (for Pro users) */
        <div className="flex-1 flex flex-col">
          <div
            className="flex-1 p-4 rounded-xl mb-4"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <p className="text-sm text-center" style={{ color: "var(--text-tertiary)" }}>
              Chat interface coming soon...
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask Wolf anything..."
              className="flex-1 px-4 py-3 rounded-xl outline-none"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
            <motion.button
              className="px-4 rounded-xl"
              style={{ backgroundColor: "var(--accent-primary)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-5 h-5" style={{ color: "var(--bg-primary)" }} />
            </motion.button>
          </div>
        </div>
      )}

      <UpsellModal isOpen={showUpsell} onClose={() => setShowUpsell(false)} />
    </main>
  );
}
