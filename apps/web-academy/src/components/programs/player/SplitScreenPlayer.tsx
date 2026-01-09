// ═══════════════════════════════════════════════════════════
// SplitScreenPlayer Component
// Main orchestrator for dual-video split-screen playback
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Pause, Play, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Exercise } from "@/data/programs/basketball-chassis";
import { getLayoutType, useViewportMode } from "@/hooks/useViewportMode";
import { CinemaLayout } from "./layouts/CinemaLayout";
import { PanelLayout } from "./layouts/PanelLayout";
import { StackedLayout } from "./layouts/StackedLayout";
import { TimerCircle } from "./TimerCircle";
import { VideoPane, type VideoPaneRef } from "./VideoPane";

export interface SplitScreenPlayerProps {
  /** Exercise to display (must have videoUrl and demoVideoUrl) */
  exercise: Exercise;
  /** Current exercise index (0-based) */
  exerciseIndex: number;
  /** Total exercises in workout */
  totalExercises: number;
  /** Called when exercise completes (timer reaches 0) */
  onComplete: () => void;
  /** Called when user skips the exercise */
  onSkip: () => void;
  /** Called when user exits the workout */
  onExit: () => void;
  /** Theme color for accents */
  themeColor: string;
}

type AudioSource = "coach" | "demo";

/**
 * SplitScreenPlayer - Dual-video workout player
 *
 * Automatically adapts layout based on viewport:
 * - Mobile: Stacked (top/bottom)
 * - Tablet landscape: Panel (60/40 split)
 * - TV/Desktop: Cinema (side-by-side)
 *
 * Features:
 * - Synchronized dual HLS video playback
 * - Audio toggle between coach/demo
 * - Responsive layout switching
 * - Timer with auto-advance
 *
 * @example
 * ```tsx
 * <SplitScreenPlayer
 *   exercise={exercise}
 *   exerciseIndex={0}
 *   totalExercises={8}
 *   onComplete={handleComplete}
 *   onSkip={handleSkip}
 *   onExit={handleExit}
 *   themeColor="#FF6B00"
 * />
 * ```
 */
export function SplitScreenPlayer({
  exercise,
  exerciseIndex,
  totalExercises,
  onComplete,
  onSkip,
  onExit,
  themeColor,
}: SplitScreenPlayerProps) {
  // Refs for video synchronization
  const coachVideoRef = useRef<VideoPaneRef>(null);
  const demoVideoRef = useRef<VideoPaneRef>(null);

  // State
  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [isPaused, setIsPaused] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioSource>("coach");
  const [videosReady, setVideosReady] = useState({ coach: false, demo: false });

  // Viewport detection
  const viewport = useViewportMode();
  const layoutType = getLayoutType(viewport);

  // Reset state when exercise changes
  useEffect(() => {
    setTimeLeft(exercise.duration);
    setIsPaused(false);
    setShowSkipConfirm(false);
    setVideosReady({ coach: false, demo: false });
  }, [exercise.id, exercise.duration]);

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

  // Sync playback between videos
  useEffect(() => {
    const syncInterval = setInterval(() => {
      const coachTime = coachVideoRef.current?.getCurrentTime() ?? 0;
      const demoTime = demoVideoRef.current?.getCurrentTime() ?? 0;
      const drift = Math.abs(coachTime - demoTime);

      // Correct drift if > 100ms
      if (drift > 0.1 && videosReady.coach && videosReady.demo) {
        // Use coach as master
        demoVideoRef.current?.seekTo(coachTime);
      }
    }, 1000);

    return () => clearInterval(syncInterval);
  }, [videosReady]);

  // Callbacks
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleSkipPress = useCallback(() => {
    if (showSkipConfirm) {
      onSkip();
    } else {
      setShowSkipConfirm(true);
      setTimeout(() => setShowSkipConfirm(false), 3000);
    }
  }, [showSkipConfirm, onSkip]);

  const toggleAudioSource = useCallback(() => {
    setAudioSource((prev) => (prev === "coach" ? "demo" : "coach"));
  }, []);

  const handleCoachReady = useCallback(() => {
    setVideosReady((prev) => ({ ...prev, coach: true }));
  }, []);

  const handleDemoReady = useCallback(() => {
    setVideosReady((prev) => ({ ...prev, demo: true }));
  }, []);

  // Helper functions
  const getSideLabel = () => {
    if (!exercise.side || exercise.side === "both") return null;
    if (exercise.side === "alternate") return "Alternate Sides";
    return `${exercise.side.charAt(0).toUpperCase() + exercise.side.slice(1)} Side`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Video panes (shared across layouts)
  const coachPane = (
    <VideoPane
      ref={coachVideoRef}
      videoUrl={exercise.videoUrl}
      hasAudio={audioSource === "coach"}
      label="COACH"
      isPaused={isPaused}
      onReady={handleCoachReady}
      themeColor={themeColor}
      className="h-full"
    />
  );

  const demoPane = (
    <VideoPane
      ref={demoVideoRef}
      videoUrl={exercise.demoVideoUrl || exercise.videoUrl}
      hasAudio={audioSource === "demo"}
      label="FOLLOW ALONG"
      isPaused={isPaused}
      onReady={handleDemoReady}
      themeColor={themeColor}
      className="h-full"
    />
  );

  // Header component (for stacked/panel)
  const header = (
    <div className="flex items-center justify-between px-4 py-2">
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
  );

  // Controls component (shared)
  const controls = (
    <div className="flex flex-col items-center gap-4">
      {/* Main controls row */}
      <div className="flex items-center justify-center gap-6">
        {/* Audio Toggle */}
        <motion.button
          onClick={toggleAudioSource}
          className="p-3 rounded-full"
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          {audioSource === "coach" ? (
            <Volume2 className="w-5 h-5" style={{ color: themeColor }} />
          ) : (
            <VolumeX className="w-5 h-5" style={{ color: "var(--text-tertiary)" }} />
          )}
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          onClick={togglePause}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: themeColor,
            boxShadow: `0 4px 20px ${themeColor}60`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPaused ? (
            <Play className="w-6 h-6 ml-1" fill="white" style={{ color: "white" }} />
          ) : (
            <Pause className="w-6 h-6" fill="white" style={{ color: "white" }} />
          )}
        </motion.button>

        {/* Skip */}
        <motion.button
          onClick={handleSkipPress}
          className="p-3 rounded-full"
          style={{
            backgroundColor: showSkipConfirm ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipForward
            className="w-5 h-5"
            style={{ color: showSkipConfirm ? "#EF4444" : "var(--text-tertiary)" }}
          />
        </motion.button>
      </div>

      {/* Skip confirmation text */}
      <AnimatePresence>
        {showSkipConfirm && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs"
            style={{ color: "#EF4444" }}
          >
            Tap again to skip
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  // Timer component
  const timer = (
    <TimerCircle
      timeLeft={timeLeft}
      totalTime={exercise.duration}
      size={layoutType === "cinema" ? 120 : layoutType === "panel" ? 140 : 100}
      strokeWidth={layoutType === "cinema" ? 3 : 4}
    />
  );

  // Info overlay for stacked layout
  const infoOverlay = (
    <div className="text-center px-6">
      <h1
        className="font-bebas text-3xl tracking-wide mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        {exercise.name.toUpperCase()}
      </h1>
      {getSideLabel() && (
        <span
          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1"
          style={{
            backgroundColor: `${themeColor}30`,
            color: themeColor,
          }}
        >
          {getSideLabel()}
        </span>
      )}
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {exercise.cue}
      </p>
    </div>
  );

  // Render appropriate layout
  if (layoutType === "cinema") {
    return (
      <CinemaLayout
        coachPane={coachPane}
        demoPane={demoPane}
        exerciseName={exercise.name}
        cue={exercise.cue}
        exerciseIndex={exerciseIndex}
        totalExercises={totalExercises}
        timeDisplay={formatTime(timeLeft)}
        progress={(timeLeft / exercise.duration) * 100}
        themeColor={themeColor}
        isPaused={isPaused}
      />
    );
  }

  if (layoutType === "panel") {
    return (
      <PanelLayout
        coachPane={coachPane}
        demoPane={demoPane}
        controls={controls}
        header={header}
        exerciseName={exercise.name}
        cue={exercise.cue}
        timer={timer}
        sideLabel={getSideLabel()}
        exerciseIndex={exerciseIndex}
        totalExercises={totalExercises}
        themeColor={themeColor}
        isPaused={isPaused}
      />
    );
  }

  // Default: Stacked layout
  return (
    <StackedLayout
      coachPane={coachPane}
      demoPane={demoPane}
      controls={controls}
      header={header}
      timer={timer}
      infoOverlay={infoOverlay}
      isPaused={isPaused}
    />
  );
}
