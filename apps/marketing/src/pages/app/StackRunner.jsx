import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, ProgressBar } from "../../components/ui";
import { getStack, getStackForLane } from "../../config/laneStacks";
import { useOnboarding } from "../../context/OnboardingContext";
import analytics, { EVENTS } from "../../lib/analytics";

function StackRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useOnboarding();

  // Get stack from lane config or by ID, fallback to base stack
  const stack =
    id === "bulletproof-ankles" || id === "lane"
      ? getStackForLane(data.lane || "base_lane")
      : getStack(id) || getStackForLane("base_lane");

  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(stack.exercises[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);

  const exercise = stack.exercises[currentExercise];
  const totalDuration = stack.exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const hasStarted = useRef(false);

  // Track stack start on first play
  useEffect(() => {
    if (isRunning && !hasStarted.current) {
      hasStarted.current = true;
      analytics.track(EVENTS.STACK_RUN_START, {
        stack_id: stack.id,
        stack_name: stack.name,
        total_exercises: stack.exercises.length,
        total_duration: totalDuration,
      });
    }
  }, [isRunning, stack, totalDuration]);

  // Track exit if user leaves without completing
  useEffect(() => {
    return () => {
      if (hasStarted.current && !isComplete) {
        analytics.track(EVENTS.STACK_RUN_EXIT, {
          stack_id: stack.id,
          exercises_completed: currentExercise,
          total_exercises: stack.exercises.length,
          time_elapsed: totalElapsed,
        });
      }
    };
  }, [currentExercise, isComplete, stack.exercises.length, stack.id, totalElapsed]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
        setTotalElapsed((t) => t + 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Move to next exercise
      if (currentExercise < stack.exercises.length - 1) {
        setCurrentExercise((c) => c + 1);
        setTimeLeft(stack.exercises[currentExercise + 1].duration);
        // Play sound/vibrate
        if (navigator.vibrate) navigator.vibrate(200);
      } else {
        // Stack complete
        setIsComplete(true);
        setIsRunning(false);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

        // Track completion
        analytics.track(EVENTS.STACK_RUN_COMPLETE, {
          stack_id: stack.id,
          stack_name: stack.name,
          exercises_completed: stack.exercises.length,
          total_time: totalElapsed + 1,
        });
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentExercise, stack.exercises, stack.id, stack.name, totalElapsed]);

  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const nextExercise = useCallback(() => {
    if (currentExercise < stack.exercises.length - 1) {
      const nextIdx = currentExercise + 1;
      setCurrentExercise(nextIdx);
      setTimeLeft(stack.exercises[nextIdx].duration);
    } else {
      setIsComplete(true);
      setIsRunning(false);
    }
  }, [currentExercise, stack.exercises]);

  const prevExercise = useCallback(() => {
    if (currentExercise > 0) {
      const prevIdx = currentExercise - 1;
      setCurrentExercise(prevIdx);
      setTimeLeft(stack.exercises[prevIdx].duration);
    }
  }, [currentExercise, stack.exercises]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Completion screen - Parent-friendly copy
  if (isComplete) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          {/* Celebration */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-cyan-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-yp-display uppercase text-white mb-2">
              Session complete.
            </h1>
            <p className="text-dark-text-secondary">
              That was a real rep. The fastest progress comes from short sessions you can repeat.
            </p>
          </div>

          {/* Stats */}
          <Card className="mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-yp-display text-cyan-500">{stack.exercises.length}</p>
                <p className="text-sm text-dark-text-tertiary">Exercises</p>
              </div>
              <div>
                <p className="text-2xl font-yp-display text-cyan-500">{formatTime(totalElapsed)}</p>
                <p className="text-sm text-dark-text-tertiary">Time</p>
              </div>
            </div>
          </Card>

          {/* CTAs - Parent-focused */}
          <div className="space-y-3">
            <Button
              size="lg"
              fullWidth
              onClick={() => navigate("/save-profile")}
              className="shadow-glow-cyan"
            >
              Save Streak + Unlock the 7-Day Plan
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => navigate("/quiz/athlete-type")}
            >
              <span className="flex items-center justify-center gap-2">
                <span>🐺</span>
                Ask Wolf a question
              </span>
            </Button>
          </div>

          {/* Trust line */}
          <p className="text-dark-text-tertiary text-sm mt-4">Saving takes 20 seconds. No spam.</p>

          {/* Back link */}
          <button
            onClick={() => navigate("/bulletproof-ankles")}
            className="mt-6 text-dark-text-tertiary hover:text-dark-text-secondary text-sm transition-colors"
          >
            ← Back to Protocol
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-black-400">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/bulletproof-ankles")}
            className="text-dark-text-secondary hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <span className="text-dark-text-secondary text-sm">
            {currentExercise + 1} / {stack.exercises.length}
          </span>
          <span className="text-dark-text-tertiary text-sm">
            {formatTime(totalDuration - totalElapsed)} left
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-4 py-2">
        <ProgressBar value={currentExercise + 1} max={stack.exercises.length} size="sm" />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          {/* Exercise name */}
          <h1 className="text-2xl md:text-3xl font-yp-display uppercase text-white mb-4">
            {exercise.name}
          </h1>

          {/* Timer */}
          <div className="mb-8">
            <div className="text-7xl md:text-8xl font-yp-display text-cyan-500 mb-2">
              {formatTime(timeLeft)}
            </div>
            {exercise.reps && <p className="text-dark-text-secondary">{exercise.reps}</p>}
          </div>

          {/* Instruction */}
          <Card className="mb-6 text-left">
            <p className="text-dark-text-secondary mb-3">{exercise.instruction}</p>
            <p className="text-cyan-500 font-medium">Cue: {exercise.cue}</p>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={prevExercise}
              disabled={currentExercise === 0}
              className="p-3 rounded-full bg-black-200 text-dark-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={toggleRunning}
              className="w-20 h-20 rounded-full bg-cyan-500 hover:bg-cyan-600 text-black flex items-center justify-center transition-colors shadow-glow-cyan"
            >
              {isRunning ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={nextExercise}
              className="p-3 rounded-full bg-black-200 text-dark-text-secondary hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Skip button */}
          <button
            onClick={nextExercise}
            className="text-dark-text-tertiary hover:text-dark-text-secondary text-sm transition-colors"
          >
            Skip to next →
          </button>
        </div>
      </main>

      {/* Exercise list preview */}
      <footer className="p-4 border-t border-black-400">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {stack.exercises.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => {
                  setCurrentExercise(idx);
                  setTimeLeft(ex.duration);
                }}
                className={`
                  flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-colors
                  ${
                    idx === currentExercise
                      ? "bg-cyan-500/20 text-cyan-500 border border-cyan-500/50"
                      : idx < currentExercise
                        ? "bg-black-200 text-dark-text-tertiary"
                        : "bg-black-100 text-dark-text-secondary hover:bg-black-200"
                  }
                `}
              >
                {idx + 1}. {ex.name.split(" ").slice(0, 2).join(" ")}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StackRunner;
