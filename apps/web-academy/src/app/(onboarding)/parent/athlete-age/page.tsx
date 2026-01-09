// ═══════════════════════════════════════════════════════════
// ATHLETE AGE SELECTION (Parent Flow)
// Determines COPPA consent requirement
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function AthleteAgePage() {
  const router = useRouter();
  const { updateParentData } = useOnboarding();
  const [selectedAge, setSelectedAge] = useState<number | null>(null);

  const handleContinue = () => {
    if (selectedAge === null) return;

    updateParentData({ athleteAge: selectedAge });

    // Under 13 requires COPPA consent
    if (selectedAge < 13) {
      router.push("/parent/coppa-consent");
    } else {
      // 13+ can skip COPPA, go to profile
      router.push("/parent/athlete-profile");
    }
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
        transition={{ delay: 0.1 }}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden">
          <Image
            src="/images/wolffront.webp"
            alt="Wolf Pack"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <h1
          className="font-bebas text-3xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          HOW OLD IS YOUR ATHLETE?
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          This helps us personalize their experience
        </p>
      </motion.div>

      {/* Age Selector */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Age Input with Stepper */}
          <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setSelectedAge((prev) => Math.max(6, (prev || 10) - 1))}
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bebas transition-all"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                -
              </button>

              <div className="text-center">
                <span className="font-bebas text-6xl" style={{ color: "var(--accent-primary)" }}>
                  {selectedAge || 10}
                </span>
                <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
                  years old
                </p>
              </div>

              <button
                onClick={() => setSelectedAge((prev) => Math.min(18, (prev || 10) + 1))}
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bebas transition-all"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Age Presets */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[8, 10, 12, 14].map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className="py-2 rounded-xl font-bebas text-lg transition-all"
                style={{
                  backgroundColor:
                    selectedAge === age ? "var(--accent-primary)" : "var(--bg-tertiary)",
                  color: selectedAge === age ? "var(--bg-primary)" : "var(--text-secondary)",
                }}
              >
                {age}
              </button>
            ))}
          </div>

          {/* Under 13 Notice */}
          {selectedAge !== null && selectedAge < 13 && (
            <motion.div
              className="rounded-xl p-4 mb-6"
              style={{
                backgroundColor: "var(--accent-primary)15",
                border: "1px solid var(--accent-primary)40",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--accent-primary)" }}>COPPA Protection:</span> We'll need
                your consent to create an account for athletes under 13.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div
        className="max-w-sm mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={handleContinue}
          disabled={selectedAge === null}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider transition-all disabled:opacity-50"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
        >
          CONTINUE
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
