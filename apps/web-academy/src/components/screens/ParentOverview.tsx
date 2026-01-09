// ═══════════════════════════════════════════════════════════
// PARENT OVERVIEW SCREEN
// "Is this working?" answered in 3 seconds
// Sponsor Report Theme: Same brand, calmer energy
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface AthleteData {
  name: string;
  avatar?: string;
  daysCompleted: number;
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  rank: "Pup" | "Hunter" | "Alpha" | "Apex";
  lastActive: Date;
  weeklyActivity: boolean[]; // Last 7 days, true = completed
  engagedMinutes: number; // This week
}

interface ParentOverviewProps {
  athletes: AthleteData[];
  onSelectAthlete?: (index: number) => void;
  onViewProgress?: (index: number) => void;
  onViewSafety?: () => void;
  onViewFamily?: () => void;
}

export function ParentOverview({
  athletes,
  onSelectAthlete,
  onViewProgress,
  onViewSafety,
  onViewFamily,
}: ParentOverviewProps) {
  return (
    <motion.div
      className="min-h-screen px-6 py-8"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="mb-8">
        <h1
          className="font-bebas text-3xl tracking-wider mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          OVERVIEW
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Sponsor Report
        </p>
      </header>

      {/* Athletes Grid */}
      <section className="space-y-4 mb-8">
        {athletes.map((athlete, index) => (
          <AthleteCard
            key={index}
            athlete={athlete}
            onSelect={() => onSelectAthlete?.(index)}
            onViewProgress={() => onViewProgress?.(index)}
          />
        ))}
      </section>

      {/* Quick Actions */}
      <section className="space-y-3">
        <button
          onClick={onViewSafety}
          className={cn(
            "w-full py-4 px-5 rounded-lg text-left",
            "flex items-center justify-between",
            "transition-colors duration-200",
          )}
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <span className="font-medium block" style={{ color: "var(--text-primary)" }}>
                Safety & Notes
              </span>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Pain flags, what's normal
              </span>
            </div>
          </div>
          <ChevronRight />
        </button>

        <button
          onClick={onViewFamily}
          className={cn(
            "w-full py-4 px-5 rounded-lg text-left",
            "flex items-center justify-between",
            "transition-colors duration-200",
          )}
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">👨‍👩‍👧</span>
            <div>
              <span className="font-medium block" style={{ color: "var(--text-primary)" }}>
                Family & Billing
              </span>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Athletes, subscription
              </span>
            </div>
          </div>
          <ChevronRight />
        </button>
      </section>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// ATHLETE CARD COMPONENT
// ─────────────────────────────────────────────────────────────

interface AthleteCardProps {
  athlete: AthleteData;
  onSelect?: () => void;
  onViewProgress?: () => void;
}

function AthleteCard({ athlete, onSelect, onViewProgress }: AthleteCardProps) {
  // Calculate progress percentage
  const progressPercent = useMemo(() => {
    return Math.round((athlete.daysCompleted / athlete.totalDays) * 100);
  }, [athlete.daysCompleted, athlete.totalDays]);

  // Format last active
  const lastActiveText = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - athlete.lastActive.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Active now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  }, [athlete.lastActive]);

  // Determine status color
  const statusColor = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - athlete.lastActive.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "var(--accent-primary)";
    if (days <= 2) return "var(--accent-warning)";
    return "var(--accent-error)";
  }, [athlete.lastActive]);

  return (
    <motion.div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-default)",
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            {athlete.avatar || "🐺"}
          </div>
          <div>
            <h3
              className="font-bebas text-xl tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              {athlete.name}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                {athlete.rank}
              </span>
              <span className="text-xs" style={{ color: statusColor }}>
                {lastActiveText}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="relative w-14 h-14">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="var(--border-default)"
              strokeWidth="3"
            />
            {/* Progress circle */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="3"
              strokeDasharray={`${progressPercent} 100`}
              strokeLinecap="round"
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-xs font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            This Week
          </span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {athlete.engagedMinutes} engaged min
          </span>
        </div>
        <div className="flex gap-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className={cn(
                  "h-6 rounded-sm mb-1 transition-colors",
                  athlete.weeklyActivity[i]
                    ? "bg-[var(--accent-primary)]"
                    : "bg-[var(--border-default)]",
                )}
              />
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatItem label="Days" value={athlete.daysCompleted} suffix={`/${athlete.totalDays}`} />
        <StatItem label="Streak" value={athlete.currentStreak} suffix="days" highlight />
        <StatItem label="XP" value={athlete.totalXP} />
      </div>

      {/* View Progress Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewProgress?.();
        }}
        className={cn(
          "w-full py-2.5 rounded-lg text-sm font-medium",
          "transition-colors duration-200",
        )}
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "var(--bg-primary)",
        }}
      >
        VIEW PROGRESS
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// STAT ITEM COMPONENT
// ─────────────────────────────────────────────────────────────

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
}

function StatItem({ label, value, suffix, highlight }: StatItemProps) {
  return (
    <div className="text-center">
      <div
        className="font-bebas text-2xl"
        style={{ color: highlight ? "var(--accent-primary)" : "var(--text-primary)" }}
      >
        {value.toLocaleString()}
        {suffix && (
          <span className="text-base ml-0.5" style={{ color: "var(--text-secondary)" }}>
            {suffix}
          </span>
        )}
      </div>
      <div className="text-xs uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHEVRON ICON
// ─────────────────────────────────────────────────────────────

function ChevronRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{ color: "var(--text-tertiary)" }}
    >
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ParentOverview;
