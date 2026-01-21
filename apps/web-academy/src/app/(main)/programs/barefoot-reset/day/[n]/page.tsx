// ═══════════════════════════════════════════════════════════
// Barefoot Reset - Day/Mission Detail Page
// Preview of workout exercises before starting
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Clock, Gem, Play, Zap } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  WORKOUTS,
  ALL_EXERCISES,
  PROGRAM_CONFIG,
} from "@/data/programs/barefoot-reset";

const PHASE_COLORS = {
  Foundation: "#60A5FA",
  Progression: "#34D399",
  Mastery: "#FBBF24",
};

const NEON_COLORS = {
  Flow: "#A855F7",
  Forge: "#FF6B35",
  Volt: "#00FFFF",
};

export default function DayDetailPage() {
  const params = useParams();
  const workoutNumber = parseInt(params.n as string);

  const workout = WORKOUTS.find((w) => w.workoutNumber === workoutNumber);

  if (!workout) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <p className="text-white">Workout not found</p>
      </div>
    );
  }

  const themeColor = PHASE_COLORS[workout.phase];

  // Build exercise list with details
  const getExercises = (ids: typeof workout.release) =>
    ids.map((ex) => ({
      ...ex,
      exercise: ALL_EXERCISES.find((e) => e.id === ex.exerciseId),
    })).filter((ex) => ex.exercise);

  const releaseExercises = getExercises(workout.release);
  const restoreExercises = getExercises(workout.restore);
  const reengineerExercises = getExercises(workout.reengineer);

  const totalDuration = Math.round(workout.totalDurationSec / 60);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Hero Header */}
      <div
        className="relative h-64"
        style={{
          background: `linear-gradient(180deg, ${themeColor}30 0%, #0A0A0F 100%)`,
        }}
      >
        {/* Back button */}
        <Link
          href="/programs/barefoot-reset"
          className="absolute top-4 left-4 p-2 rounded-full bg-black/30 backdrop-blur"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>

        {/* Mission info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div
            className="inline-block px-3 py-1 rounded text-xs font-bold mb-2"
            style={{ backgroundColor: `${themeColor}30`, color: themeColor }}
          >
            {workout.phase.toUpperCase()} • MISSION {workout.workoutNumber}
          </div>
          <h1 className="font-bebas text-4xl tracking-wide mb-1">
            {workout.missionName.toUpperCase()}
          </h1>
          {workout.missionSubtitle && (
            <p className="text-gray-400">{workout.missionSubtitle}</p>
          )}
        </div>
      </div>

      <main className="p-4 pb-32 space-y-6">
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="flex-1 p-4 rounded-xl bg-white/5">
            <Clock className="w-5 h-5 text-gray-400 mb-2" />
            <p className="font-bebas text-2xl">{totalDuration} MIN</p>
            <p className="text-xs text-gray-500">Duration</p>
          </div>
          <div className="flex-1 p-4 rounded-xl bg-white/5">
            <Gem className="w-5 h-5 text-cyan-400 mb-2" />
            <p className="font-bebas text-2xl text-cyan-400">
              {workout.shardsReward}
            </p>
            <p className="text-xs text-gray-500">Shards</p>
          </div>
          <div className="flex-1 p-4 rounded-xl bg-white/5">
            <span className="text-xl">💪</span>
            <p className="font-bebas text-2xl mt-1">6</p>
            <p className="text-xs text-gray-500">Exercises</p>
          </div>
        </div>

        {/* Strike WOD Banner */}
        {workout.strikeWod && (
          <motion.div
            className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-yellow-400">STRIKE WOD AVAILABLE</span>
            </div>
            <p className="text-sm text-gray-300">
              {workout.strikeWod.durationMinutes}-minute AMRAP challenge after workout
            </p>
            <p className="text-sm text-yellow-400/80 mt-1">
              +{workout.strikeWod.bonusShards} bonus shards
            </p>
          </motion.div>
        )}

        {/* Exercise List by Category */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 mb-3 tracking-wider">
            EXERCISE BREAKDOWN
          </h2>

          {/* Flow / Release */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NEON_COLORS.Flow }} />
              <span className="text-sm font-medium" style={{ color: NEON_COLORS.Flow }}>
                FLOW (Release)
              </span>
            </div>
            <div className="space-y-2">
              {releaseExercises.map((ex, i) => (
                <ExerciseCard
                  key={ex.exerciseId}
                  name={ex.exercise?.name || ex.exerciseId}
                  duration={ex.durationSec}
                  rounds={ex.rounds}
                  color={NEON_COLORS.Flow}
                />
              ))}
            </div>
          </div>

          {/* Forge / Restore */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NEON_COLORS.Forge }} />
              <span className="text-sm font-medium" style={{ color: NEON_COLORS.Forge }}>
                FORGE (Restore)
              </span>
            </div>
            <div className="space-y-2">
              {restoreExercises.map((ex, i) => (
                <ExerciseCard
                  key={ex.exerciseId}
                  name={ex.exercise?.name || ex.exerciseId}
                  duration={ex.durationSec}
                  rounds={ex.rounds}
                  color={NEON_COLORS.Forge}
                />
              ))}
            </div>
          </div>

          {/* Volt / Re-Engineer */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NEON_COLORS.Volt }} />
              <span className="text-sm font-medium" style={{ color: NEON_COLORS.Volt }}>
                VOLT (Re-Engineer)
              </span>
            </div>
            <div className="space-y-2">
              {reengineerExercises.map((ex, i) => (
                <ExerciseCard
                  key={ex.exerciseId}
                  name={ex.exercise?.name || ex.exerciseId}
                  duration={ex.durationSec}
                  rounds={ex.rounds}
                  color={NEON_COLORS.Volt}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Coaching Tips */}
        <section className="p-4 rounded-xl bg-white/5">
          <h3 className="font-bold mb-2">📝 Mission Brief</h3>
          <p className="text-sm text-gray-400">
            Focus on quality over speed. Each exercise builds on the last.
            If you need to skip, that's okay - just complete 5 of 6 to keep your Chain intact.
          </p>
        </section>
      </main>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F] to-transparent">
        <Link
          href={`/programs/barefoot-reset/day/${workoutNumber}/play`}
          className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-lg"
          style={{ backgroundColor: themeColor, color: "#000" }}
        >
          <Play className="w-5 h-5" fill="currentColor" />
          START MISSION
        </Link>
      </div>
    </div>
  );
}

function ExerciseCard({
  name,
  duration,
  rounds,
  color,
}: {
  name: string;
  duration: number;
  rounds: number;
  color: string;
}) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg"
      style={{ backgroundColor: `${color}10`, borderLeft: `3px solid ${color}` }}
    >
      <div>
        <p className="font-medium text-white">{name}</p>
        <p className="text-xs text-gray-400">
          {duration}s {rounds > 1 ? `× ${rounds} rounds` : ""}
        </p>
      </div>
      <div className="text-sm text-gray-500">
        +{PROGRAM_CONFIG.shardsPerExercise} 💎
      </div>
    </div>
  );
}
