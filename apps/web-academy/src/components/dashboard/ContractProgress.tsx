// ═══════════════════════════════════════════════════════════
// CONTRACT PROGRESS COMPONENT
// Dashboard widget showing Wolf Contract status and progress
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { WolfEvolution } from "./WolfEvolution";

export interface ContractProgressData {
  status: "active" | "completed" | "failed";
  levelsCompleted: number;
  levelsRequired: number;
  daysElapsed: number;
  daysRemaining: number;
  startDate: number;
  expiresAt: number;
  evolutionTier: "base" | "headband" | "chain" | "sleeves" | "legendary";
  nextMilestone: number;
  levelsToNextMilestone: number;
  creditEarned: number;
  creditCode?: string;
  creditExpiresAt?: number;
  recentLevels: Array<{
    levelNumber: number;
    workoutId: string;
    completedAt: number;
    noteText: string;
  }>;
}

interface ContractProgressProps {
  data: ContractProgressData | null;
}

export function ContractProgress({ data }: ContractProgressProps) {
  // No contract - show CTA
  if (!data) {
    return (
      <motion.div
        className="rounded-2xl p-5"
        style={{ backgroundColor: "var(--bg-secondary)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3
          className="font-bebas text-lg tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          WOLF CONTRACT
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
          Complete 30 levels in 42 days. Earn $88 NeoBall credit.
        </p>
        <Link
          href="/contract/country"
          className="inline-block px-4 py-2 rounded-lg font-bebas text-sm tracking-wider"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
        >
          START CONTRACT
        </Link>
      </motion.div>
    );
  }

  const progressPercent = (data.levelsCompleted / data.levelsRequired) * 100;
  const isOnTrack = data.levelsCompleted >= Math.floor((data.daysElapsed / 42) * 30);

  // Completed contract
  if (data.status === "completed") {
    return (
      <motion.div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: "var(--accent-primary)15",
          border: "2px solid var(--accent-primary)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3
              className="font-bebas text-lg tracking-wider"
              style={{ color: "var(--accent-primary)" }}
            >
              CONTRACT COMPLETE
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              You earned your credit. Legend.
            </p>
          </div>
          <WolfEvolution tier="legendary" size="sm" />
        </div>

        {/* Credit Code */}
        {data.creditCode && (
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            <span
              className="text-xs block mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              YOUR $88 NEOBALL CREDIT
            </span>
            <span
              className="font-mono text-xl tracking-widest"
              style={{ color: "var(--accent-primary)" }}
            >
              {data.creditCode}
            </span>
            {data.creditExpiresAt && (
              <span
                className="text-xs block mt-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Expires {new Date(data.creditExpiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  // Failed contract
  if (data.status === "failed") {
    return (
      <motion.div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--status-error)40",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3
          className="font-bebas text-lg tracking-wider mb-2"
          style={{ color: "var(--status-error)" }}
        >
          CONTRACT EXPIRED
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
          {data.levelsCompleted}/{data.levelsRequired} levels completed.
          The credit wasn't earned, but the training is yours forever.
        </p>
        <Link
          href="/programs"
          className="inline-block px-4 py-2 rounded-lg font-bebas text-sm tracking-wider"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
          }}
        >
          CONTINUE TRAINING
        </Link>
      </motion.div>
    );
  }

  // Active contract
  return (
    <motion.div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "var(--bg-secondary)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            className="font-bebas text-lg tracking-wider"
            style={{ color: "var(--text-primary)" }}
          >
            WOLF CONTRACT
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isOnTrack ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {isOnTrack ? "ON TRACK" : "CATCH UP"}
            </span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {data.daysRemaining} days left
            </span>
          </div>
        </div>
        <WolfEvolution tier={data.evolutionTier} size="sm" />
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: "var(--text-secondary)" }}>
            {data.levelsCompleted}/{data.levelsRequired} Levels
          </span>
          <span style={{ color: "var(--accent-primary)" }}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "var(--accent-primary)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Milestone Progress */}
      <div
        className="flex items-center justify-between p-3 rounded-xl mb-4"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div>
          <span
            className="text-xs block"
            style={{ color: "var(--text-tertiary)" }}
          >
            NEXT MILESTONE
          </span>
          <span
            className="font-bebas text-lg tracking-wide"
            style={{ color: "var(--text-primary)" }}
          >
            Level {data.nextMilestone}
          </span>
        </div>
        <div className="text-right">
          <span
            className="font-bebas text-2xl"
            style={{ color: "var(--accent-primary)" }}
          >
            {data.levelsToNextMilestone}
          </span>
          <span
            className="text-xs block"
            style={{ color: "var(--text-tertiary)" }}
          >
            to go
          </span>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/programs"
        className="block w-full py-3 rounded-xl font-bebas text-center tracking-wider"
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "var(--bg-primary)",
        }}
      >
        CONTINUE TO LEVEL {data.levelsCompleted + 1}
      </Link>
    </motion.div>
  );
}

export default ContractProgress;
