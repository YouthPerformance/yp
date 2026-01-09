// ═══════════════════════════════════════════════════════════
// AVATAR SELECTION SCREEN
// Wolf customization - choose your wolf color
// More wolves unlock as you rank up
// Intensity Budget: 10 points
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useOnboarding, type WolfColor } from "@/contexts/OnboardingContext";

interface AvatarSelectProps {
  onContinue: () => void;
  onBack: () => void;
}

interface WolfOption {
  id: WolfColor;
  name: string;
  bgColor: string;
  borderColor: string;
  locked?: boolean;
  unlockRank?: string;
}

const WOLF_OPTIONS: WolfOption[] = [
  { id: "black", name: "Shadow", bgColor: "#1A1A1A", borderColor: "#333" },
  { id: "white", name: "Ghost", bgColor: "#E5E5E5", borderColor: "#CCC" },
  { id: "gray", name: "Steel", bgColor: "#4A4A4A", borderColor: "#666" },
  { id: "brown", name: "Earth", bgColor: "#5D4037", borderColor: "#795548" },
];

const LOCKED_WOLVES = [
  { name: "Cyber", color: "#00F6E0", unlockRank: "Hunter" },
  { name: "Fire", color: "#FF6B6B", unlockRank: "Alpha" },
  { name: "Gold", color: "#FFD700", unlockRank: "Apex" },
];

export function AvatarSelect({ onContinue, onBack }: AvatarSelectProps) {
  const { data, updateAthleteData } = useOnboarding();
  const [selected, setSelected] = useState<WolfColor>(data.avatarColor || "black");

  const handleSelect = (color: WolfColor) => {
    setSelected(color);
    updateAthleteData({ avatarColor: color });
  };

  const handleContinue = () => {
    updateAthleteData({ avatarColor: selected });
    onContinue();
  };

  const selectedWolf = WOLF_OPTIONS.find((w) => w.id === selected);

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-8"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm self-start"
        style={{ color: "var(--text-tertiary)" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ color: "var(--text-primary)" }}
      >
        ← Back
      </motion.button>

      {/* Title */}
      <motion.h1
        className="font-bebas text-3xl tracking-wider mb-2 text-center"
        style={{ color: "var(--text-primary)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        CHOOSE YOUR WOLF
      </motion.h1>

      <motion.p
        className="text-sm text-center mb-8"
        style={{ color: "var(--text-tertiary)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        This is your pack identity
      </motion.p>

      {/* Wolf Preview */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          key={selected}
          className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: selectedWolf?.bgColor,
            border: `4px solid ${selectedWolf?.borderColor}`,
            boxShadow: `0 0 30px ${selectedWolf?.borderColor}50`,
          }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="text-6xl">🐺</span>
        </motion.div>
      </motion.div>

      {/* Wolf Name */}
      <motion.p
        className="font-bebas text-xl tracking-wider text-center mb-8"
        style={{ color: "var(--accent-primary)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {selectedWolf?.name.toUpperCase()} WOLF
      </motion.p>

      {/* Color Selection */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p
          className="text-xs uppercase tracking-wider mb-3 text-center"
          style={{ color: "var(--text-tertiary)" }}
        >
          Select Color
        </p>
        <div className="flex justify-center gap-4">
          {WOLF_OPTIONS.map((wolf) => (
            <motion.button
              key={wolf.id}
              onClick={() => handleSelect(wolf.id)}
              className="w-14 h-14 rounded-full transition-all"
              style={{
                backgroundColor: wolf.bgColor,
                border: `3px solid ${selected === wolf.id ? "var(--accent-primary)" : wolf.borderColor}`,
                boxShadow: selected === wolf.id ? "0 0 15px var(--accent-primary)50" : "none",
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Locked Wolves Preview */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p
          className="text-xs uppercase tracking-wider mb-3 text-center"
          style={{ color: "var(--text-tertiary)" }}
        >
          Unlock with Rank
        </p>
        <div className="flex justify-center gap-4">
          {LOCKED_WOLVES.map((wolf, i) => (
            <div key={i} className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center relative opacity-40"
                style={{
                  backgroundColor: `${wolf.color}30`,
                  border: `2px solid ${wolf.color}50`,
                }}
              >
                <span className="text-2xl grayscale">🐺</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg">🔒</span>
                </div>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                {wolf.unlockRank}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-center mt-4" style={{ color: "var(--text-tertiary)" }}>
          More wolves unlock as you rank up!
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        onClick={handleContinue}
        className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider"
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "var(--bg-primary)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        CONTINUE →
      </motion.button>
    </motion.div>
  );
}

export default AvatarSelect;
