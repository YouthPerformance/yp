// ═══════════════════════════════════════════════════════════
// KID AVATAR SELECTION
// Quick personalization before starting training
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOnboarding, type WolfColor } from "@/contexts/OnboardingContext";

const WOLF_COLORS: { id: WolfColor; name: string; gradient: string }[] = [
  { id: "black", name: "Shadow", gradient: "from-gray-800 to-gray-900" },
  { id: "white", name: "Ghost", gradient: "from-gray-100 to-gray-300" },
  { id: "gray", name: "Storm", gradient: "from-gray-500 to-gray-700" },
  { id: "brown", name: "Timber", gradient: "from-amber-700 to-amber-900" },
];

export default function KidAvatarPage() {
  const router = useRouter();
  const { data, updateAthleteData, completeOnboarding } = useOnboarding();

  const [selectedColor, setSelectedColor] = useState<WolfColor>(data.avatarColor || "black");
  const [nickname, setNickname] = useState(data.athleteName || "");

  const handleContinue = async () => {
    updateAthleteData({
      avatarColor: selectedColor,
      athleteName: nickname.trim() || data.athleteName,
    });

    // Complete onboarding
    await completeOnboarding();

    // Go to first mission/training
    router.push("/kid/first-mission");
  };

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
      >
        <h1
          className="font-bebas text-3xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          CUSTOMIZE YOUR WOLF
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Pick your style
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center max-w-md mx-auto w-full">
        {/* Avatar Preview */}
        <motion.div
          className="relative w-40 h-40 mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
        >
          <div
            className={`w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br ${
              WOLF_COLORS.find((c) => c.id === selectedColor)?.gradient ||
              "from-gray-800 to-gray-900"
            } p-1`}
          >
            <div
              className="w-full h-full rounded-xl overflow-hidden"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <Image
                src="/images/wolffront.webp"
                alt="Your Wolf"
                width={160}
                height={160}
                className="w-full h-full object-cover"
                style={{
                  filter: selectedColor === "white" ? "invert(0.9)" : "none",
                }}
              />
            </div>
          </div>

          {/* Color Ring */}
          <motion.div
            className="absolute -inset-1 rounded-2xl -z-10"
            style={{
              background: `linear-gradient(135deg, var(--accent-primary), transparent)`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Color Selection */}
        <motion.div
          className="w-full mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm mb-3 text-center" style={{ color: "var(--text-secondary)" }}>
            Choose your pack color
          </p>
          <div className="flex justify-center gap-4">
            {WOLF_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color.gradient} transition-all relative`}
                style={{
                  border:
                    selectedColor === color.id
                      ? "3px solid var(--accent-primary)"
                      : "3px solid transparent",
                  transform: selectedColor === color.id ? "scale(1.1)" : "scale(1)",
                }}
              >
                {selectedColor === color.id && (
                  <motion.div
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span
                      className="text-xs font-bebas tracking-wider"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      {color.name.toUpperCase()}
                    </span>
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Nickname Input */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
            What should Wolf call you?
          </p>
          <div
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={data.athleteName || "Your name"}
              className="w-full px-4 py-4 text-center font-bebas text-xl tracking-wider bg-transparent outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
          <p className="text-xs text-center mt-2" style={{ color: "var(--text-tertiary)" }}>
            Default: {data.athleteName || "Champion"}
          </p>
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div
        className="max-w-md mx-auto w-full pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-xl font-bebas text-xl tracking-wider transition-all"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
        >
          START TRAINING 🚀
        </button>
      </motion.div>
    </motion.div>
  );
}
