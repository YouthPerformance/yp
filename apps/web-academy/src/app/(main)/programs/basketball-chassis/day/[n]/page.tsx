// ═══════════════════════════════════════════════════════════
// DAY PREVIEW PAGE
// Preview workout before starting
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, Dumbbell, Play, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ExerciseList } from "@/components/programs/ExerciseList";
import { getDay, getThemeColor, getThemeLabel, PROGRAM } from "@/data/programs/basketball-chassis";
import { isDayUnlocked, useProgramAccess } from "@/hooks/useProgramAccess";

export default function DayPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const dayNumber = parseInt(params.n as string, 10);

  const { hasAccess, completedDays, isLoading } = useProgramAccess("basketball-chassis");
  const day = getDay(dayNumber);

  // Redirect if day is locked or invalid
  useEffect(() => {
    if (isLoading) return;

    if (!hasAccess) {
      router.replace("/programs/basketball-chassis");
      return;
    }

    if (!day || !isDayUnlocked(dayNumber, completedDays)) {
      router.replace("/programs/basketball-chassis");
    }
  }, [hasAccess, completedDays, dayNumber, day, isLoading, router]);

  // Loading state
  if (isLoading || !day) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-4xl mb-2">🏀</div>
          <p style={{ color: "var(--text-tertiary)" }}>Loading...</p>
        </div>
      </main>
    );
  }

  const themeColor = getThemeColor(day.theme);
  const isCompleted = completedDays.includes(dayNumber);

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      {/* Back Button */}
      <motion.button
        onClick={() => router.push("/programs/basketball-chassis")}
        className="flex items-center gap-2 mb-6 text-sm"
        style={{ color: "var(--text-tertiary)" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        {/* Theme Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          style={{
            backgroundColor: `${themeColor}20`,
            color: themeColor,
          }}
        >
          {getThemeLabel(day.theme)}
        </div>

        {/* Day Number */}
        <p className="text-sm mb-2" style={{ color: "var(--text-tertiary)" }}>
          Day {dayNumber} of {PROGRAM.totalDays}
        </p>

        {/* Title */}
        <h1
          className="font-bebas text-4xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {day.title.toUpperCase()}
        </h1>

        {/* Subtitle */}
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {day.subtitle}
        </p>
      </motion.div>

      {/* Meta Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-6 mb-6"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: themeColor }} />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {day.duration} min
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4" style={{ color: themeColor }} />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {day.exercises.length} exercises
          </span>
        </div>
      </motion.div>

      {/* Exercise List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2
          className="font-bebas text-lg tracking-wider mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          EXERCISES
        </h2>
        <ExerciseList exercises={day.exercises} />
      </motion.div>

      {/* XP Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-xl mb-6 flex items-center justify-between"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {isCompleted ? "Replay for practice" : "Complete to earn"}
          </span>
        </div>
        {!isCompleted && (
          <div className="flex items-center gap-3">
            <span className="font-bebas text-lg" style={{ color: "var(--accent-primary)" }}>
              +{PROGRAM.xpPerDay} XP
            </span>
            <span className="font-bebas text-lg" style={{ color: "#9C27B0" }}>
              +{PROGRAM.crystalsPerDay} 💎
            </span>
          </div>
        )}
      </motion.div>

      {/* Begin Button */}
      <motion.button
        onClick={() => router.push(`/programs/basketball-chassis/day/${dayNumber}/play`)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider flex items-center justify-center gap-2"
        style={{
          backgroundColor: themeColor,
          color: "var(--bg-primary)",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Play className="w-5 h-5" fill="currentColor" />
        {isCompleted ? "REPLAY WORKOUT" : "BEGIN WORKOUT"}
      </motion.button>
    </main>
  );
}
