// ═══════════════════════════════════════════════════════════
// ATHLETE PROFILE WIZARD (Parent Fills Out)
// Parent tells us about their athlete
// Multi-step: Basics → Goals → Training Context
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  type AthleteGoal,
  type Motivation,
  type TrainingTime,
  useOnboarding,
} from "@/contexts/OnboardingContext";

type Step = "basics" | "goals" | "context";

const GOALS: { id: AthleteGoal; label: string; emoji: string }[] = [
  { id: "get_faster", label: "Get Faster", emoji: "⚡" },
  { id: "jump_higher", label: "Jump Higher", emoji: "🚀" },
  { id: "build_strength", label: "Build Strength", emoji: "💪" },
  { id: "prevent_injuries", label: "Prevent Injuries", emoji: "🛡️" },
  { id: "make_team", label: "Make the Team", emoji: "🏆" },
  { id: "have_fun", label: "Have Fun", emoji: "🎉" },
];

const SPORTS = [
  "Basketball",
  "Soccer",
  "Football",
  "Baseball",
  "Volleyball",
  "Track & Field",
  "Tennis",
  "Swimming",
  "Other",
];

export default function AthleteProfilePage() {
  const router = useRouter();
  const { data, updateParentData } = useOnboarding();

  const [step, setStep] = useState<Step>("basics");

  // Form state
  const [name, setName] = useState(data.athleteName || "");
  const [sport, setSport] = useState(data.sports[0] || "");
  const [experience, setExperience] = useState<"beginner" | "intermediate" | "advanced" | null>(
    data.athleteExperience,
  );
  const [goals, setGoals] = useState<AthleteGoal[]>(data.athleteGoals || []);
  const [trainingDays, setTrainingDays] = useState(data.athleteTrainingDays || 3);
  const [trainingTime, setTrainingTime] = useState<TrainingTime | null>(data.athleteTrainingTime);
  const [limitations, setLimitations] = useState(data.athleteLimitations || "");
  const [motivation, setMotivation] = useState<Motivation | null>(data.athleteMotivation);

  const toggleGoal = (goalId: AthleteGoal) => {
    setGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId],
    );
  };

  const handleNext = () => {
    if (step === "basics") {
      updateParentData({
        athleteName: name,
        sports: [sport],
        athleteExperience: experience,
      });
      setStep("goals");
    } else if (step === "goals") {
      updateParentData({ athleteGoals: goals });
      setStep("context");
    } else {
      // Save all context and go to wolf programming
      updateParentData({
        athleteTrainingDays: trainingDays,
        athleteTrainingTime: trainingTime,
        athleteLimitations: limitations,
        athleteMotivation: motivation,
      });
      router.push("/parent/program-wolf");
    }
  };

  const handleBack = () => {
    if (step === "basics") {
      router.back();
    } else if (step === "goals") {
      setStep("basics");
    } else {
      setStep("goals");
    }
  };

  const canContinue = () => {
    if (step === "basics") {
      return name.trim().length > 0 && sport.length > 0 && experience !== null;
    }
    if (step === "goals") {
      return goals.length > 0;
    }
    return trainingTime !== null && motivation !== null;
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
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-14 h-14 mx-auto mb-3 rounded-xl overflow-hidden">
          <Image
            src="/images/wolffront.webp"
            alt="Wolf Pack"
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>
        <h1
          className="font-bebas text-2xl tracking-wider mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {step === "basics" && "TELL US ABOUT YOUR ATHLETE"}
          {step === "goals" && `WHAT ARE ${name.toUpperCase()}'S GOALS?`}
          {step === "context" && "TRAINING CONTEXT"}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          {step === "basics" && "Help Wolf get to know them"}
          {step === "goals" && "Select all that apply"}
          {step === "context" && "Help us personalize the experience"}
        </p>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {(["basics", "goals", "context"] as Step[]).map((s, i) => (
            <div
              key={s}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor:
                  i <= ["basics", "goals", "context"].indexOf(step)
                    ? "var(--accent-primary)"
                    : "var(--bg-tertiary)",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* STEP 1: Basics */}
          {step === "basics" && (
            <motion.div
              key="basics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Name Input */}
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                  First Name (what Wolf calls them)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-default)",
                  }}
                />
              </div>

              {/* Sport Select */}
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                  Primary Sport
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SPORTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSport(s)}
                      className="px-3 py-2 rounded-xl text-sm transition-all"
                      style={{
                        backgroundColor:
                          sport === s ? "var(--accent-primary)" : "var(--bg-secondary)",
                        color: sport === s ? "var(--bg-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setExperience(level)}
                      className="px-3 py-3 rounded-xl font-bebas text-sm tracking-wider transition-all"
                      style={{
                        backgroundColor:
                          experience === level ? "var(--accent-primary)" : "var(--bg-secondary)",
                        color: experience === level ? "var(--bg-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Goals */}
          {step === "goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 gap-3"
            >
              {GOALS.map((goal) => {
                const isSelected = goals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className="p-4 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: isSelected
                        ? "var(--accent-primary)20"
                        : "var(--bg-secondary)",
                      border: `2px solid ${isSelected ? "var(--accent-primary)" : "transparent"}`,
                    }}
                  >
                    <span className="text-2xl block mb-2">{goal.emoji}</span>
                    <span
                      className="font-bebas text-sm tracking-wider"
                      style={{
                        color: isSelected ? "var(--accent-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {goal.label.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* STEP 3: Context */}
          {step === "context" && (
            <motion.div
              key="context"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Training Days */}
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                  How many days per week can they train?
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTrainingDays(Math.max(1, trainingDays - 1))}
                    className="w-10 h-10 rounded-full font-bebas text-lg"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    -
                  </button>
                  <span
                    className="font-bebas text-3xl w-12 text-center"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    {trainingDays}
                  </span>
                  <button
                    onClick={() => setTrainingDays(Math.min(7, trainingDays + 1))}
                    className="w-10 h-10 rounded-full font-bebas text-lg"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Training Time */}
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                  When do they usually train?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "morning", label: "Morning" },
                      { id: "after_school", label: "After School" },
                      { id: "evening", label: "Evening" },
                    ] as { id: TrainingTime; label: string }[]
                  ).map((time) => (
                    <button
                      key={time.id}
                      onClick={() => setTrainingTime(time.id)}
                      className="px-3 py-3 rounded-xl text-sm transition-all"
                      style={{
                        backgroundColor:
                          trainingTime === time.id
                            ? "var(--accent-primary)"
                            : "var(--bg-secondary)",
                        color:
                          trainingTime === time.id ? "var(--bg-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Limitations */}
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                  Any injuries or limitations? (optional)
                </label>
                <textarea
                  value={limitations}
                  onChange={(e) => setLimitations(e.target.value)}
                  placeholder="e.g., recovering from ankle sprain"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-default)",
                  }}
                />
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                  What motivates them?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "competition", label: "Competition" },
                      { id: "personal_bests", label: "Personal Bests" },
                      { id: "fun", label: "Having Fun" },
                    ] as { id: Motivation; label: string }[]
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMotivation(m.id)}
                      className="px-3 py-3 rounded-xl text-sm transition-all"
                      style={{
                        backgroundColor:
                          motivation === m.id ? "var(--accent-primary)" : "var(--bg-secondary)",
                        color: motivation === m.id ? "var(--bg-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div
        className="max-w-md mx-auto w-full pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          onClick={handleNext}
          disabled={!canContinue()}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider transition-all disabled:opacity-50"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
        >
          {step === "context" ? "PROGRAM THE WOLF" : "CONTINUE"}
        </button>

        <button
          onClick={handleBack}
          className="w-full py-3 mt-3 text-sm"
          style={{ color: "var(--text-tertiary)" }}
        >
          Back
        </button>
      </motion.div>
    </motion.div>
  );
}
