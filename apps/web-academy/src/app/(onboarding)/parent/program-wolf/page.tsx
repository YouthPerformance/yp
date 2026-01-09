// ═══════════════════════════════════════════════════════════
// PROGRAM THE WOLF (Secret Sauce)
// Parent customizes the AI buddy's personality and context
// This is what makes Wolf feel personalized to each kid
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOnboarding, type WolfPersonality } from "@/contexts/OnboardingContext";

const PERSONALITIES: {
  id: WolfPersonality;
  name: string;
  emoji: string;
  description: string;
  sample: string;
}[] = [
  {
    id: "hype",
    name: "Hype Coach",
    emoji: "🔥",
    description: "High energy, lots of encouragement",
    sample: "LET'S GO! You're about to crush this workout. Every rep is building a champion!",
  },
  {
    id: "chill",
    name: "Chill Mentor",
    emoji: "🧘",
    description: "Calm, supportive, patient",
    sample: "Good work today. Take your time with each movement. Quality over speed.",
  },
  {
    id: "drill",
    name: "Drill Sergeant",
    emoji: "🎖️",
    description: "Direct, challenging, no-nonsense",
    sample: "Time to work. 3 sets, no excuses. You've got 20 minutes. Let's execute.",
  },
  {
    id: "friend",
    name: "Best Friend",
    emoji: "🤝",
    description: "Fun, casual, game-like",
    sample: "Hey! Ready to level up today? Let's see if we can beat yesterday's record!",
  },
];

const EXAMPLE_PROMPTS = [
  "Alex loves basketball and wants to dunk by summer",
  "She's shy and needs extra encouragement",
  "He gets distracted easily - keep workouts short",
  "She's recovering from an ankle sprain",
  "He responds well to competition and challenges",
];

export default function ProgramWolfPage() {
  const router = useRouter();
  const { data, updateParentData } = useOnboarding();

  const [personality, setPersonality] = useState<WolfPersonality | null>(data.wolfPersonality);
  const [context, setContext] = useState(data.parentContext || "");
  const [showPreview, setShowPreview] = useState(false);

  const athleteName = data.athleteName || "your athlete";

  const handleContinue = () => {
    if (!personality) return;

    updateParentData({
      wolfPersonality: personality,
      parentContext: context,
    });

    router.push("/parent/invite-code");
  };

  const selectedPersonality = PERSONALITIES.find((p) => p.id === personality);

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-14 h-14 mx-auto mb-3 rounded-xl overflow-hidden">
          <Image
            src="/images/wolffront.webp"
            alt="Wolf Pack"
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>
        <h1
          className="font-bebas text-2xl tracking-wider mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          PROGRAM THE WOLF
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Make Wolf {athleteName}'s perfect training buddy
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full space-y-6">
        {/* Personality Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
            How should Wolf talk to {athleteName}?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PERSONALITIES.map((p) => {
              const isSelected = personality === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPersonality(p.id)}
                  className="p-4 rounded-xl text-left transition-all"
                  style={{
                    backgroundColor: isSelected ? "var(--accent-primary)20" : "var(--bg-secondary)",
                    border: `2px solid ${isSelected ? "var(--accent-primary)" : "transparent"}`,
                  }}
                >
                  <span className="text-2xl block mb-2">{p.emoji}</span>
                  <span
                    className="font-bebas text-sm tracking-wider block"
                    style={{ color: isSelected ? "var(--accent-primary)" : "var(--text-primary)" }}
                  >
                    {p.name.toUpperCase()}
                  </span>
                  <span className="text-xs block mt-1" style={{ color: "var(--text-tertiary)" }}>
                    {p.description}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Preview Button */}
        {personality && (
          <motion.button
            onClick={() => setShowPreview(true)}
            className="w-full py-3 rounded-xl text-sm"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--accent-primary)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Preview Wolf's Voice →
          </motion.button>
        )}

        {/* Context Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
            What should Wolf know about {athleteName}?
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Tell Wolf anything that would help personalize the experience..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
          />

          {/* Example Prompts */}
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => setContext((prev) => (prev ? `${prev}\n${prompt}` : prompt))}
                className="px-3 py-1.5 rounded-full text-xs transition-all"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-tertiary)",
                }}
              >
                + {prompt.length > 30 ? `${prompt.slice(0, 30)}...` : prompt}
              </button>
            ))}
          </div>
        </motion.div>

        {/* What This Does */}
        <motion.div
          className="rounded-xl p-4"
          style={{
            backgroundColor: "var(--accent-primary)10",
            border: "1px solid var(--accent-primary)30",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            <span style={{ color: "var(--accent-primary)" }}>How this works:</span> Wolf uses your
            input to personalize conversations. If you say "{athleteName} gets frustrated easily,"
            Wolf will be extra encouraging when things get hard.
          </p>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedPersonality && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowPreview(false)}
            />
            <motion.div
              className="relative z-10 w-full max-w-sm rounded-2xl p-6"
              style={{ backgroundColor: "var(--bg-secondary)" }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="text-center mb-4">
                <span className="text-4xl">{selectedPersonality.emoji}</span>
                <h3
                  className="font-bebas text-xl tracking-wider mt-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {selectedPersonality.name.toUpperCase()}
                </h3>
              </div>

              <div
                className="rounded-xl p-4 mb-4"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/wolffront.webp"
                      alt="Wolf"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p
                      className="font-bebas text-xs tracking-wider mb-1"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      WOLF
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      "{selectedPersonality.sample}"
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowPreview(false)}
                className="w-full py-3 rounded-xl font-bebas tracking-wider"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--bg-primary)",
                }}
              >
                GOT IT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        className="max-w-md mx-auto w-full pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          onClick={handleContinue}
          disabled={!personality}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider transition-all disabled:opacity-50"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
        >
          CREATE {athleteName.toUpperCase()}'S ACCOUNT
        </button>

        <button
          onClick={() => router.back()}
          className="w-full py-3 mt-3 text-sm"
          style={{ color: "var(--text-tertiary)" }}
        >
          Back
        </button>
      </motion.div>
    </motion.div>
  );
}
