// ═══════════════════════════════════════════════════════════
// PROGRAM SELECTION (DEPRECATED)
// This screen has been removed from the onboarding flow.
// All athletes now auto-enroll in the Foundation 42-Day program.
// Kept for reference but not used in navigation.
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// PROGRAM DATA (Legacy)
// ─────────────────────────────────────────────────────────────

export interface Program {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  duration: number;
  features: string[];
  status: "active" | "coming-soon";
  color: string;
}

const PROGRAMS: Program[] = [
  {
    id: "foundation_42_day",
    name: "Foundation",
    icon: "🦶",
    tagline: "42-Day Durability Program",
    duration: 42,
    features: ["15 min daily workouts", "Wolf rank progression", "Anime card rewards"],
    status: "active",
    color: "#00F6E0",
  },
  {
    id: "foundations-basketball",
    name: "Foundations Basketball",
    icon: "🏀",
    tagline: "30-Day Skills Program",
    duration: 30,
    features: ["Footwork & handles", "Shooting mechanics", "Game situation drills"],
    status: "coming-soon",
    color: "#FF6B35",
  },
];

// ─────────────────────────────────────────────────────────────
// COMPONENT (Deprecated - kept for reference)
// ─────────────────────────────────────────────────────────────

interface ProgramSelectionProps {
  onSelectProgram: () => void;
  onBack: () => void;
}

export function ProgramSelection({ onSelectProgram, onBack }: ProgramSelectionProps) {
  const handleSelect = (program: Program) => {
    if (program.status === "coming-soon") return;
    onSelectProgram();
  };

  const activePrograms = PROGRAMS.filter((p) => p.status === "active");
  const comingSoonPrograms = PROGRAMS.filter((p) => p.status === "coming-soon");

  return (
    <motion.div
      className="min-h-screen px-6 py-8"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm"
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
        CHOOSE YOUR ACADEMY
      </motion.h1>

      <motion.p
        className="text-sm text-center mb-8"
        style={{ color: "var(--text-tertiary)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Select a program to begin your journey
      </motion.p>

      {/* Active Programs */}
      <div className="space-y-4 mb-8">
        {activePrograms.map((program, i) => (
          <motion.button
            key={program.id}
            onClick={() => handleSelect(program)}
            className="w-full rounded-2xl p-5 text-left"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: `2px solid ${program.color}`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${program.color}20` }}
              >
                <span className="text-3xl">{program.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bebas text-xl tracking-wider" style={{ color: program.color }}>
                  {program.name.toUpperCase()}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  {program.tagline}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{ backgroundColor: `${program.color}20`, color: program.color }}
                  >
                    {program.duration} Days
                  </span>
                </div>
              </div>
              <span style={{ color: program.color }}>→</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Coming Soon */}
      {comingSoonPrograms.length > 0 && (
        <>
          <p
            className="text-xs uppercase tracking-wider mb-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            Coming Soon
          </p>
          <div className="space-y-4">
            {comingSoonPrograms.map((program, i) => (
              <motion.div
                key={program.id}
                className="w-full rounded-2xl p-5 opacity-50"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "var(--bg-tertiary)" }}
                  >
                    <span className="text-3xl grayscale">{program.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-bebas text-xl tracking-wider"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {program.name.toUpperCase()}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                      {program.tagline}
                    </p>
                  </div>
                  <span
                    className="px-2 py-1 rounded text-xs"
                    style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}
                  >
                    Soon
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

export default ProgramSelection;
