// ═══════════════════════════════════════════════════════════
// ATHLETE PROFILE SETUP SCREEN
// Collects name, age, and optional sport
// Intensity Budget: 5 points
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";

interface AthleteProfileProps {
  onContinue: () => void;
  onBack: () => void;
}

const AGES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const SPORTS = [
  { id: "basketball", label: "Basketball", icon: "🏀" },
  { id: "soccer", label: "Soccer", icon: "⚽" },
  { id: "football", label: "Football", icon: "🏈" },
  { id: "baseball", label: "Baseball", icon: "⚾" },
  { id: "volleyball", label: "Volleyball", icon: "🏐" },
  { id: "track", label: "Track & Field", icon: "🏃" },
  { id: "tennis", label: "Tennis", icon: "🎾" },
  { id: "other", label: "Other", icon: "🏅" },
];

export function AthleteProfile({ onContinue, onBack }: AthleteProfileProps) {
  const { data, updateAthleteData } = useOnboarding();
  const [name, setName] = useState(data.athleteName || "");
  const [age, setAge] = useState<number | null>(data.athleteAge);
  const [sports, setSports] = useState<string[]>(data.sports || []);
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; age?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your name";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!age) {
      newErrors.age = "Please select your age";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      updateAthleteData({
        athleteName: name.trim(),
        athleteAge: age,
        sports,
      });
      onContinue();
    }
  };

  // Toggle sport selection (multi-select)
  const toggleSport = (sportId: string) => {
    setSports((prev) =>
      prev.includes(sportId) ? prev.filter((s) => s !== sportId) : [...prev, sportId],
    );
  };

  const isValid = name.trim().length >= 2 && age !== null;

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

      {/* Content */}
      <div className="flex-1">
        {/* Name Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label
            className="font-bebas text-xl tracking-wider block mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            WHAT'S YOUR NAME?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="First name"
            maxLength={20}
            className="w-full px-4 py-4 rounded-xl text-lg outline-none transition-all"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: `2px solid ${errors.name ? "var(--accent-error)" : "var(--border-default)"}`,
              color: "var(--text-primary)",
            }}
          />
          {errors.name && (
            <p className="text-sm mt-2" style={{ color: "var(--accent-error)" }}>
              {errors.name}
            </p>
          )}
        </motion.div>

        {/* Age Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label
            className="font-bebas text-xl tracking-wider block mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            HOW OLD ARE YOU?
          </label>
          <div className="flex flex-wrap gap-2">
            {AGES.map((a) => (
              <button
                key={a}
                onClick={() => {
                  setAge(a);
                  setErrors((prev) => ({ ...prev, age: undefined }));
                }}
                className="w-12 h-12 rounded-xl font-mono text-lg transition-all"
                style={{
                  backgroundColor: age === a ? "var(--accent-primary)" : "var(--bg-secondary)",
                  color: age === a ? "var(--bg-primary)" : "var(--text-secondary)",
                  border: `2px solid ${age === a ? "var(--accent-primary)" : "var(--border-default)"}`,
                }}
              >
                {a}
              </button>
            ))}
          </div>
          {errors.age && (
            <p className="text-sm mt-2" style={{ color: "var(--accent-error)" }}>
              {errors.age}
            </p>
          )}
        </motion.div>

        {/* Sports Section (Optional, Multi-select) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-1">
            <label
              className="font-bebas text-xl tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              FAVORITE SPORTS
            </label>
            {sports.length > 0 && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: "var(--accent-primary)20",
                  color: "var(--accent-primary)",
                }}
              >
                {sports.length} selected
              </span>
            )}
          </div>
          <p className="text-sm mb-3" style={{ color: "var(--text-tertiary)" }}>
            Optional · Pick all that apply
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SPORTS.map((s) => {
              const isSelected = sports.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSport(s.id)}
                  className="relative flex flex-col items-center p-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: isSelected ? "var(--accent-primary)20" : "var(--bg-secondary)",
                    border: `2px solid ${isSelected ? "var(--accent-primary)" : "var(--border-default)"}`,
                  }}
                >
                  <span className="text-2xl mb-1">{s.icon}</span>
                  <span
                    className="text-xs"
                    style={{
                      color: isSelected ? "var(--accent-primary)" : "var(--text-tertiary)",
                    }}
                  >
                    {s.label}
                  </span>
                  {isSelected && (
                    <motion.div
                      className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--accent-primary)" }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <span className="text-[10px]" style={{ color: "var(--bg-primary)" }}>
                        ✓
                      </span>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={handleContinue}
        disabled={!isValid}
        className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider transition-all"
        style={{
          backgroundColor: isValid ? "var(--accent-primary)" : "var(--bg-secondary)",
          color: isValid ? "var(--bg-primary)" : "var(--text-tertiary)",
          opacity: isValid ? 1 : 0.5,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
      >
        CONTINUE →
      </motion.button>
    </motion.div>
  );
}

export default AthleteProfile;
