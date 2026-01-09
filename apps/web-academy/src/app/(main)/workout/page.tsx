// ═══════════════════════════════════════════════════════════
// WORKOUT PAGE - TROPHY ROAD
// Overview of workout before starting
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Dumbbell, Play, Star } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock workout data
const mockWorkout = {
  dayNumber: 5,
  phases: [
    {
      name: "Release",
      color: "#10B981",
      exercises: [
        { name: "Ankle Circles", duration: 60, reps: "10 each" },
        { name: "Toe Spreads", duration: 45, reps: "15 reps" },
      ],
    },
    {
      name: "Restore",
      color: "var(--accent-primary)",
      exercises: [
        { name: "Calf Raises", duration: 60, reps: "12 reps" },
        { name: "Heel Walks", duration: 30, reps: "20 steps" },
      ],
    },
    {
      name: "Re-Engineer",
      color: "#8B5CF6",
      exercises: [
        { name: "Single Leg Balance", duration: 45, reps: "30s each" },
        { name: "Pogos", duration: 30, reps: "20 reps" },
      ],
    },
  ],
};

const XP_REWARDS = {
  WORKOUT_COMPLETE: 75,
  QUIZ_CORRECT: 15,
};

export default function WorkoutPage() {
  const router = useRouter();
  const totalExercises = mockWorkout.phases.reduce((acc, phase) => acc + phase.exercises.length, 0);

  return (
    <main className="p-4 max-w-md mx-auto">
      {/* Back button */}
      <motion.button
        onClick={() => router.push("/home")}
        className="flex items-center gap-2 mb-6 text-sm"
        style={{ color: "var(--text-tertiary)" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ color: "var(--text-primary)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <span
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-2"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
            color: "var(--accent-primary)",
          }}
        >
          <Clock className="w-4 h-4" />
          ~15 min
        </span>
        <h1
          className="font-bebas text-4xl tracking-wider"
          style={{ color: "var(--accent-primary)" }}
        >
          DAY {mockWorkout.dayNumber}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {totalExercises} exercises across 3 phases
        </p>
      </motion.header>

      {/* Workout Phases */}
      <section className="space-y-4 mb-6">
        {mockWorkout.phases.map((phase, phaseIndex) => (
          <motion.div
            key={phase.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (phaseIndex + 1) }}
            className="rounded-xl p-4"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${phase.color}20` }}
                >
                  <Dumbbell className="w-4 h-4" style={{ color: phase.color }} />
                </div>
                <h3
                  className="font-bebas text-lg tracking-wider"
                  style={{ color: "var(--text-primary)" }}
                >
                  {phase.name.toUpperCase()}
                </h3>
              </div>
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {phase.exercises.length} exercises
              </span>
            </div>

            <div className="space-y-2">
              {phase.exercises.map((exercise, exerciseIndex) => (
                <div
                  key={exercise.name}
                  className="flex items-center justify-between py-2"
                  style={{
                    borderTop: exerciseIndex > 0 ? "1px solid var(--border-default)" : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{
                        backgroundColor: "var(--bg-tertiary)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {exerciseIndex + 1}
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                        {exercise.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {exercise.reps}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {exercise.duration}s
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* XP Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-4 p-3 rounded-xl flex items-center justify-between"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Earn up to
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold" style={{ color: "var(--accent-gold)" }}>
            +{XP_REWARDS.WORKOUT_COMPLETE + 3 * XP_REWARDS.QUIZ_CORRECT}
          </span>
          <span className="text-sm" style={{ color: "var(--accent-gold)" }}>
            XP
          </span>
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.button
        onClick={() => router.push("/workout/player")}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider flex items-center justify-center gap-2"
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "var(--bg-primary)",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Play className="w-5 h-5" fill="currentColor" />
        BEGIN WORKOUT
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </main>
  );
}
