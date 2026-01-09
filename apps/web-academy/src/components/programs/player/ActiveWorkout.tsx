// ═══════════════════════════════════════════════════════════
// ActiveWorkout Component
// Main workout view with video, timer, and controls
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Hls from "hls.js";
import { ChevronLeft, Pause, Play, SkipForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Exercise } from "@/data/programs/basketball-chassis";
import { TimerCircle } from "./TimerCircle";

interface ActiveWorkoutProps {
  exercise: Exercise;
  exerciseIndex: number;
  totalExercises: number;
  onComplete: () => void;
  onSkip: () => void;
  onExit: () => void;
  themeColor: string;
}

export function ActiveWorkout({
  exercise,
  exerciseIndex,
  totalExercises,
  onComplete,
  onSkip,
  onExit,
  themeColor,
}: ActiveWorkoutProps) {
  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [isPaused, setIsPaused] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset timer when exercise changes
  useEffect(() => {
    setTimeLeft(exercise.duration);
    setIsPaused(false);
    setShowSkipConfirm(false);
  }, [exercise.duration]);

  // Timer countdown
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLeft, onComplete]);

  // Initialize HLS for .m3u8 streams
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !exercise.videoUrl) return;

    const isHls = exercise.videoUrl.includes(".m3u8");

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(exercise.videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!isPaused) {
          video.play().catch(() => {});
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS support
      video.src = exercise.videoUrl;
      if (!isPaused) {
        video.play().catch(() => {});
      }
    } else if (!isHls) {
      video.src = exercise.videoUrl;
      if (!isPaused) {
        video.play().catch(() => {});
      }
    }
  }, [exercise.videoUrl, isPaused]);

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

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleSkipPress = useCallback(() => {
    if (showSkipConfirm) {
      onSkip();
    } else {
      setShowSkipConfirm(true);
      // Auto-hide after 3 seconds
      setTimeout(() => setShowSkipConfirm(false), 3000);
    }
  }, [showSkipConfirm, onSkip]);

  const getSideLabel = () => {
    if (!exercise.side || exercise.side === "both") return null;
    if (exercise.side === "alternate") return "Alternate Sides";
    return `${exercise.side.charAt(0).toUpperCase() + exercise.side.slice(1)} Side`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col h-full"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {exercise.videoUrl ? (
          <video ref={videoRef} className="w-full h-full object-cover" loop muted playsInline />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${themeColor}40 0%, var(--bg-primary) 100%)`,
            }}
          />
        )}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full p-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={onExit}
            className="flex items-center gap-1 px-3 py-2 rounded-full backdrop-blur-md"
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "var(--text-primary)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-medium">Exit</span>
          </motion.button>

          <div
            className="px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md"
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "var(--text-primary)",
            }}
          >
            {exerciseIndex + 1} / {totalExercises}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Timer & Exercise Info */}
        <div className="flex flex-col items-center mb-8">
          {/* Timer Circle */}
          <TimerCircle
            timeLeft={timeLeft}
            totalTime={exercise.duration}
            size={160}
            strokeWidth={4}
          />

          {/* Exercise Name */}
          <motion.h1
            key={exercise.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-bebas text-4xl text-center mt-6 mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {exercise.name.toUpperCase()}
          </motion.h1>

          {/* Side indicator */}
          {getSideLabel() && (
            <div
              className="px-3 py-1 rounded-full text-xs font-medium mb-2"
              style={{
                backgroundColor: `${themeColor}30`,
                color: themeColor,
              }}
            >
              {getSideLabel()}
            </div>
          )}

          {/* Coaching Cue */}
          <motion.p
            key={`cue-${exercise.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-center px-8 max-w-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {exercise.cue}
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {/* Pause/Play Button */}
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
            className="flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md"
            style={{
              backgroundColor: showSkipConfirm ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)",
              color: showSkipConfirm ? "#EF4444" : "var(--text-tertiary)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <SkipForward className="w-4 h-4" />
            <span className="text-sm font-medium">
              {showSkipConfirm ? "Tap again to skip" : "Skip"}
            </span>
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <motion.div
            className="h-full"
            style={{ backgroundColor: themeColor }}
            initial={{ width: 0 }}
            animate={{ width: `${((exerciseIndex + 1) / totalExercises) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Paused Overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="text-center"
              >
                <p
                  className="font-bebas text-3xl tracking-wider mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  PAUSED
                </p>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  Tap play to continue
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
