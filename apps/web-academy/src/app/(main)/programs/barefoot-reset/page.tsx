// ═══════════════════════════════════════════════════════════
// Barefoot Reset - Program Home ("The Den")
// The Radar: Wolf + Spider Chart + Today's Mission
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Settings, Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SpiderChart } from "@/components/barefoot-reset/SpiderChart";
import { WolfAvatar } from "@/components/barefoot-reset/WolfAvatar";
import { MissionCard } from "@/components/barefoot-reset/MissionCard";
import { ChainDisplay } from "@/components/barefoot-reset/ChainDisplay";
import { ShardCounter } from "@/components/barefoot-reset/ShardCounter";

import {
  WORKOUTS,
  CALENDAR,
  type CalendarDay,
} from "@/data/programs/barefoot-reset";

// Helper to get workout for a calendar day
function getWorkoutForDay(dayNumber: number) {
  const day = CALENDAR.find((d) => d.dayNumber === dayNumber);
  if (!day || day.type === "rest") return null;
  return WORKOUTS.find((w) => w.workoutNumber === day.workoutNumber) || null;
}

// Mock user progress (would come from Convex in production)
const MOCK_PROGRESS = {
  currentCalendarDay: 5,
  currentWorkout: 4,
  workoutsCompleted: [1, 2, 3],
  chainCurrent: 3,
  chainBest: 3,
  totalShards: 144,
  totalXp: 300,
  wolfLevel: 4,
  frequencyProgress: {
    Flow: 30,
    Forge: 25,
    Volt: 35,
  },
};

export default function BarefootResetPage() {
  const [progress] = useState(MOCK_PROGRESS);

  // Get today's calendar day info
  const today = CALENDAR.find((d) => d.dayNumber === progress.currentCalendarDay);
  const todayWorkout = today ? getWorkoutForDay(today.dayNumber) : null;

  // Normalize frequency progress for spider chart (0-100 scale)
  const maxFreq = Math.max(
    progress.frequencyProgress.Flow,
    progress.frequencyProgress.Forge,
    progress.frequencyProgress.Volt,
    1
  );
  const normalizedFreq = {
    flow: Math.round((progress.frequencyProgress.Flow / 100) * 100),
    forge: Math.round((progress.frequencyProgress.Forge / 100) * 100),
    volt: Math.round((progress.frequencyProgress.Volt / 100) * 100),
  };

  const isRestDay = today?.type === "rest";
  const isBehind = progress.currentWorkout < (today?.workoutNumber || 0);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <Link href="/programs" className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-bebas text-xl tracking-wider">THE DEN</h1>
        <div className="flex items-center gap-2">
          <button className="p-2">
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

      <main className="p-4 pb-24 space-y-6">
        {/* System Instability Warning (if behind) */}
        {isBehind && (
          <motion.div
            className="p-4 rounded-xl border border-yellow-500/50 bg-yellow-500/10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-yellow-400 font-bold mb-1">
              ⚠️ SYSTEM INSTABILITY DETECTED
            </div>
            <p className="text-sm text-gray-300">
              Network integrity at{" "}
              {Math.round(
                (progress.workoutsCompleted.length / progress.currentCalendarDay) * 100
              )}
              %. Your Wolf needs you.
            </p>
          </motion.div>
        )}

        {/* The Radar: Spider Chart + Wolf */}
        <section className="flex flex-col items-center py-6">
          {/* Spider Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SpiderChart
              volt={normalizedFreq.volt}
              forge={normalizedFreq.forge}
              flow={normalizedFreq.flow}
              size={200}
              showLabels
              animated
              glowing={progress.wolfLevel >= 10}
            />
          </motion.div>

          {/* Wolf Avatar */}
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <WolfAvatar
              level={progress.wolfLevel}
              size={100}
              showLevel
              mood={isRestDay ? "sleeping" : isBehind ? "concerned" : "idle"}
            />
          </motion.div>
        </section>

        {/* Today's Mission / Rest Day */}
        <section>
          {isRestDay ? (
            <motion.div
              className="rounded-2xl p-6 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-4xl mb-3">😴</div>
              <h2 className="font-bebas text-2xl mb-2">REST DAY</h2>
              <p className="text-gray-400 text-sm mb-4">
                Your system is recovering. Next mission: Tomorrow
              </p>
              {isBehind && (
                <Link
                  href={`/programs/barefoot-reset/day/${progress.currentWorkout}/play`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium"
                >
                  🔧 Catch-up Workout Available
                </Link>
              )}
            </motion.div>
          ) : todayWorkout ? (
            <MissionCard
              missionNumber={todayWorkout.workoutNumber}
              missionName={todayWorkout.missionName}
              subtitle={todayWorkout.missionSubtitle}
              phase={todayWorkout.phase}
              durationMin={Math.round(todayWorkout.totalDurationSec / 60)}
              shardsReward={todayWorkout.shardsReward}
              hasStrikeWod={!!todayWorkout.strikeWod}
              isCompleted={progress.workoutsCompleted.includes(todayWorkout.workoutNumber)}
              href={`/programs/barefoot-reset/day/${todayWorkout.workoutNumber}/play`}
            />
          ) : null}
        </section>

        {/* Stats Row */}
        <section className="flex items-center justify-between">
          <ChainDisplay
            currentChain={progress.chainCurrent}
            bestChain={progress.chainBest}
            compact
          />
          <ShardCounter shards={progress.totalShards} size="md" />
        </section>

        {/* Quick Progress */}
        <section className="rounded-xl p-4 bg-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">42-Day Journey</span>
            <span className="text-xs text-gray-500">
              Day {progress.currentCalendarDay} of 42
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.currentCalendarDay / 42) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Foundation</span>
            <span>Progression</span>
            <span>Mastery</span>
          </div>
        </section>

        {/* Calendar Preview (first 7 days) */}
        <section>
          <h3 className="text-sm font-medium text-gray-400 mb-3">This Week</h3>
          <div className="grid grid-cols-7 gap-2">
            {CALENDAR.slice(0, 7).map((day) => {
              const isToday = day.dayNumber === progress.currentCalendarDay;
              const isCompleted =
                day.workoutNumber &&
                progress.workoutsCompleted.includes(day.workoutNumber);
              const isRest = day.type === "rest";

              return (
                <div
                  key={day.dayNumber}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${
                    isToday
                      ? "bg-cyan-500/20 border border-cyan-500"
                      : isCompleted
                      ? "bg-green-500/20"
                      : isRest
                      ? "bg-gray-800"
                      : "bg-white/5"
                  }`}
                >
                  <span className={isToday ? "text-cyan-400" : "text-gray-500"}>
                    {["M", "T", "W", "T", "F", "S", "S"][day.dayNumber % 7]}
                  </span>
                  <span className={isToday ? "text-white font-bold" : "text-gray-400"}>
                    {isCompleted ? "✓" : isRest ? "○" : day.dayNumber}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* View Full Calendar Link */}
        <Link
          href="/programs/barefoot-reset/calendar"
          className="block text-center text-sm text-cyan-400 py-2"
        >
          View Full Calendar →
        </Link>
      </main>
    </div>
  );
}
