// ═══════════════════════════════════════════════════════════
// Barefoot Reset - Workout Player ("Wolf Command")
// Timed exercise playback with video, cues, and controls
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Hls from "hls.js";
import { ChevronLeft, Pause, Play, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { ShardRain } from "@/components/barefoot-reset/ShardCounter";
import {
  WORKOUTS,
  ALL_EXERCISES,
  PROGRAM_CONFIG,
  type WorkoutExercise,
  type Exercise,
} from "@/data/programs/barefoot-reset";

type WorkoutPhase = "countdown" | "exercise" | "rest" | "complete" | "strike-wod";

interface ExerciseWithDetails extends WorkoutExercise {
  exercise: Exercise;
}

export default function WorkoutPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const workoutNumber = parseInt(params.n as string);

  // Find the workout
  const workout = WORKOUTS.find((w) => w.workoutNumber === workoutNumber);

  // Build exercise queue with full details
  const exerciseQueue: ExerciseWithDetails[] = workout
    ? [
        ...workout.release.map((ex) => ({
          ...ex,
          exercise: ALL_EXERCISES.find((e) => e.id === ex.exerciseId)!,
        })),
        ...workout.restore.map((ex) => ({
          ...ex,
          exercise: ALL_EXERCISES.find((e) => e.id === ex.exerciseId)!,
        })),
        ...workout.reengineer.map((ex) => ({
          ...ex,
          exercise: ALL_EXERCISES.find((e) => e.id === ex.exerciseId)!,
        })),
      ].filter((ex) => ex.exercise)
    : [];

  // State
  const [phase, setPhase] = useState<WorkoutPhase>("countdown");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3); // Countdown starts at 3
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [skippedExercises, setSkippedExercises] = useState<number[]>([]);
  const [showShardRain, setShowShardRain] = useState(false);
  const [totalShards, setTotalShards] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const currentExercise = exerciseQueue[currentIndex];
  const totalExercises = exerciseQueue.length;

  // Phase colors
  const PHASE_COLORS = {
    Foundation: "#60A5FA",
    Progression: "#34D399",
    Mastery: "#FBBF24",
  };
  const themeColor = workout ? PHASE_COLORS[workout.phase] : "#60A5FA";

  // Initialize HLS video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentExercise?.exercise?.videoUrl || phase !== "exercise") return;

    const videoUrl = currentExercise.exercise.videoUrl;
    const isHls = videoUrl.includes(".m3u8");

    if (isHls && Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!isPaused) {
          video.play().catch(() => {});
        }
      });
      hlsRef.current = hls;

      return () => {
        hls.destroy();
      };
    } else if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      if (!isPaused) {
        video.play().catch(() => {});
      }
    } else if (!isHls) {
      video.src = videoUrl;
      if (!isPaused) {
        video.play().catch(() => {});
      }
    }
  }, [currentExercise?.exercise?.videoUrl, phase, isPaused]);

  // Sync video with pause state
  useEffect(() => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isPaused]);

  // Countdown timer
  useEffect(() => {
    if (phase === "countdown" && !isPaused) {
      if (timeLeft <= 0) {
        setPhase("exercise");
        setTimeLeft(currentExercise?.durationSec || 60);
        return;
      }

      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [phase, timeLeft, isPaused, currentExercise?.durationSec]);

  // Exercise timer
  useEffect(() => {
    if (phase === "exercise" && !isPaused) {
      if (timeLeft <= 0) {
        handleExerciseComplete();
        return;
      }

      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [phase, timeLeft, isPaused]);

  // Rest timer
  useEffect(() => {
    if (phase === "rest" && !isPaused) {
      if (timeLeft <= 0) {
        // Move to next exercise
        if (currentIndex < totalExercises - 1) {
          setCurrentIndex((prev) => prev + 1);
          setPhase("countdown");
          setTimeLeft(3);
        } else {
          handleWorkoutComplete();
        }
        return;
      }

      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [phase, timeLeft, isPaused, currentIndex, totalExercises]);

  const handleExerciseComplete = useCallback(() => {
    setCompletedExercises((prev) => [...prev, currentIndex]);
    setTotalShards((prev) => prev + PROGRAM_CONFIG.shardsPerExercise);

    if (currentIndex < totalExercises - 1) {
      setPhase("rest");
      setTimeLeft(10); // 10 second rest
    } else {
      handleWorkoutComplete();
    }
  }, [currentIndex, totalExercises]);

  const handleSkip = useCallback(() => {
    setSkippedExercises((prev) => [...prev, currentIndex]);

    if (currentIndex < totalExercises - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPhase("countdown");
      setTimeLeft(3);
    } else {
      handleWorkoutComplete();
    }
    setShowSkipConfirm(false);
  }, [currentIndex, totalExercises]);

  const handleWorkoutComplete = useCallback(() => {
    setShowShardRain(true);
    setPhase("complete");
  }, []);

  const handleExit = useCallback(() => {
    router.push("/programs/barefoot-reset");
  }, [router]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleSkipPress = useCallback(() => {
    if (showSkipConfirm) {
      handleSkip();
    } else {
      setShowSkipConfirm(true);
      setTimeout(() => setShowSkipConfirm(false), 3000);
    }
  }, [showSkipConfirm, handleSkip]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!workout) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Workout not found</p>
      </div>
    );
  }

  // Countdown view
  if (phase === "countdown") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <motion.div
          key={timeLeft}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="font-bebas text-[120px] text-white"
        >
          {timeLeft > 0 ? timeLeft : "GO!"}
        </motion.div>
        <p className="text-gray-400 mt-4">
          Get ready for: {currentExercise?.exercise?.name}
        </p>
      </div>
    );
  }

  // Complete view
  if (phase === "complete") {
    const exercisesCompleted = completedExercises.length;
    const chainUpdated = exercisesCompleted >= 5; // 70% threshold

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        {showShardRain && (
          <ShardRain count={30} duration={3} onComplete={() => setShowShardRain(false)} />
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.5 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🐺</div>
          <h1 className="font-bebas text-4xl text-white mb-2">MISSION COMPLETE</h1>
          <p className="text-gray-400 mb-6">{workout.missionName}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-2xl font-bold text-cyan-400">+{totalShards}</p>
              <p className="text-xs text-gray-400">Shards</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-2xl font-bold text-white">
                {exercisesCompleted}/{totalExercises}
              </p>
              <p className="text-xs text-gray-400">Exercises</p>
            </div>
          </div>

          {chainUpdated ? (
            <div className="text-green-400 mb-6">🔗 Chain +1</div>
          ) : (
            <div className="text-yellow-400 mb-6">Chain frozen (need 5+ exercises)</div>
          )}

          {workout.strikeWod && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="w-full py-4 rounded-xl bg-yellow-500/20 text-yellow-400 font-bold mb-4"
            >
              ⚡ START STRIKE WOD (+25 Shards)
            </motion.button>
          )}

          <button
            onClick={handleExit}
            className="w-full py-4 rounded-xl bg-white/10 text-white font-bold"
          >
            RETURN TO DEN
          </button>
        </motion.div>
      </div>
    );
  }

  // Exercise / Rest view
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-black"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {currentExercise?.exercise?.videoUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${themeColor}40 0%, #0A0A0F 100%)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleExit}
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-black/30 backdrop-blur"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs">Exit</span>
          </button>

          <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur text-xs">
            {currentIndex + 1} / {totalExercises}
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-black/30 backdrop-blur"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Rest overlay */}
        {phase === "rest" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80"
          >
            <p className="text-cyan-400 text-sm tracking-wider mb-2">REST</p>
            <p className="font-bebas text-[80px] text-white">{timeLeft}</p>
            <p className="text-gray-400 mt-4">
              Next: {exerciseQueue[currentIndex + 1]?.exercise?.name || "Complete!"}
            </p>
            <button
              onClick={() => {
                setCurrentIndex((prev) => prev + 1);
                setPhase("countdown");
                setTimeLeft(3);
              }}
              className="mt-6 px-6 py-3 rounded-full bg-white/10 text-white"
            >
              Skip Rest →
            </button>
          </motion.div>
        )}

        {/* Timer & Exercise Info */}
        <div className="flex flex-col items-center mb-8">
          {/* Timer Circle */}
          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="74"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="74"
                fill="none"
                stroke={themeColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 74}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 74 * (1 - timeLeft / (currentExercise?.durationSec || 60)),
                }}
                transition={{ duration: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bebas text-5xl text-white">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Exercise Name */}
          <motion.h1
            key={currentExercise?.exercise?.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-bebas text-3xl text-center text-white mb-2"
          >
            {currentExercise?.exercise?.name?.toUpperCase()}
          </motion.h1>

          {/* Category Badge */}
          <div
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor:
                currentExercise?.exercise?.frequency === "Volt"
                  ? "rgba(0, 255, 255, 0.2)"
                  : currentExercise?.exercise?.frequency === "Forge"
                  ? "rgba(255, 107, 53, 0.2)"
                  : "rgba(168, 85, 247, 0.2)",
              color:
                currentExercise?.exercise?.frequency === "Volt"
                  ? "#00FFFF"
                  : currentExercise?.exercise?.frequency === "Forge"
                  ? "#FF6B35"
                  : "#A855F7",
            }}
          >
            {currentExercise?.exercise?.frequency}
          </div>

          {/* Coaching Cue */}
          <motion.p
            key={`cue-${currentExercise?.exercise?.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-center text-gray-300 mt-4 px-8 max-w-xs"
          >
            {currentExercise?.exercise?.cues?.[0] || "Focus on form"}
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 mb-6">
          <motion.button
            onClick={togglePause}
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 4px 20px ${themeColor}60`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPaused ? (
              <Play className="w-8 h-8 ml-1" fill="white" style={{ color: "white" }} />
            ) : (
              <Pause className="w-8 h-8" fill="white" style={{ color: "white" }} />
            )}
          </motion.button>
        </div>

        {/* Skip Button */}
        <div className="flex justify-center mb-4">
          <motion.button
            onClick={handleSkipPress}
            className="flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur"
            style={{
              backgroundColor: showSkipConfirm ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)",
              color: showSkipConfirm ? "#EF4444" : "rgba(255,255,255,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <SkipForward className="w-4 h-4" />
            <span className="text-sm font-medium">
              {showSkipConfirm ? "Tap to skip (no shards)" : "Skip"}
            </span>
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 rounded-full overflow-hidden bg-white/10">
          <motion.div
            className="h-full"
            style={{ backgroundColor: themeColor }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / totalExercises) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Exercise Queue Preview */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {exerciseQueue.map((ex, i) => (
            <div
              key={ex.exerciseId}
              className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xs ${
                i === currentIndex
                  ? "bg-white/20 border border-white/50"
                  : completedExercises.includes(i)
                  ? "bg-green-500/20"
                  : skippedExercises.includes(i)
                  ? "bg-red-500/20"
                  : "bg-white/5"
              }`}
            >
              {completedExercises.includes(i)
                ? "✓"
                : skippedExercises.includes(i)
                ? "✗"
                : i + 1}
            </div>
          ))}
        </div>

        {/* Paused Overlay */}
        <AnimatePresence>
          {isPaused && phase === "exercise" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 z-30"
            >
              <div className="text-center">
                <p className="font-bebas text-4xl text-white mb-2">PAUSED</p>
                <p className="text-sm text-gray-400">Tap play to continue</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
