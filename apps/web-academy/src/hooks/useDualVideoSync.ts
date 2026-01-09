// ═══════════════════════════════════════════════════════════
// useDualVideoSync Hook
// Synchronizes playback between two video elements
// ═══════════════════════════════════════════════════════════

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VideoPaneRef } from "@/components/programs/player/VideoPane";

export interface DualVideoSyncOptions {
  /** Maximum allowed drift in seconds before correction (default: 0.1) */
  maxDrift?: number;
  /** How often to check for drift in ms (default: 500) */
  syncInterval?: number;
  /** Which video is the master for sync (default: "primary") */
  masterVideo?: "primary" | "secondary";
}

export interface DualVideoSyncState {
  /** Whether both videos are ready to play */
  isReady: boolean;
  /** Whether videos are currently playing */
  isPlaying: boolean;
  /** Current drift between videos in seconds */
  currentDrift: number;
  /** Number of sync corrections made */
  syncCorrections: number;
}

export interface DualVideoSyncReturn {
  /** Ref for primary video (coach) */
  primaryRef: React.RefObject<VideoPaneRef>;
  /** Ref for secondary video (demo) */
  secondaryRef: React.RefObject<VideoPaneRef>;
  /** Current sync state */
  state: DualVideoSyncState;
  /** Play both videos */
  play: () => Promise<void>;
  /** Pause both videos */
  pause: () => void;
  /** Seek both videos to a time */
  seekTo: (time: number) => void;
  /** Mark a video as ready */
  setVideoReady: (which: "primary" | "secondary") => void;
  /** Force resync videos */
  forceSync: () => void;
}

/**
 * Hook for synchronized dual-video playback
 *
 * Uses the primary video (coach) as master and corrects drift on secondary.
 * Drift tolerance is 100ms by default - anything more triggers a seek correction.
 *
 * @example
 * ```tsx
 * const {
 *   primaryRef,
 *   secondaryRef,
 *   state,
 *   play,
 *   pause,
 *   setVideoReady
 * } = useDualVideoSync();
 *
 * return (
 *   <>
 *     <VideoPane ref={primaryRef} onReady={() => setVideoReady("primary")} />
 *     <VideoPane ref={secondaryRef} onReady={() => setVideoReady("secondary")} />
 *     <button onClick={play}>Play</button>
 *   </>
 * );
 * ```
 */
export function useDualVideoSync(options: DualVideoSyncOptions = {}): DualVideoSyncReturn {
  const {
    maxDrift = 0.1,
    syncInterval = 500,
    masterVideo = "primary",
  } = options;

  const primaryRef = useRef<VideoPaneRef>(null);
  const secondaryRef = useRef<VideoPaneRef>(null);

  const [state, setState] = useState<DualVideoSyncState>({
    isReady: false,
    isPlaying: false,
    currentDrift: 0,
    syncCorrections: 0,
  });

  const [videoReady, setVideoReadyState] = useState({
    primary: false,
    secondary: false,
  });

  // Update isReady when both videos are ready
  useEffect(() => {
    const bothReady = videoReady.primary && videoReady.secondary;
    setState((prev) => ({ ...prev, isReady: bothReady }));
  }, [videoReady.primary, videoReady.secondary]);

  // Sync loop
  useEffect(() => {
    if (!state.isReady || !state.isPlaying) return;

    const interval = setInterval(() => {
      const primaryTime = primaryRef.current?.getCurrentTime() ?? 0;
      const secondaryTime = secondaryRef.current?.getCurrentTime() ?? 0;
      const drift = Math.abs(primaryTime - secondaryTime);

      setState((prev) => ({ ...prev, currentDrift: drift }));

      // Correct drift if needed
      if (drift > maxDrift) {
        const masterRef = masterVideo === "primary" ? primaryRef : secondaryRef;
        const slaveRef = masterVideo === "primary" ? secondaryRef : primaryRef;
        const masterTime = masterRef.current?.getCurrentTime() ?? 0;

        slaveRef.current?.seekTo(masterTime);

        setState((prev) => ({
          ...prev,
          syncCorrections: prev.syncCorrections + 1,
          currentDrift: 0,
        }));
      }
    }, syncInterval);

    return () => clearInterval(interval);
  }, [state.isReady, state.isPlaying, maxDrift, syncInterval, masterVideo]);

  // Public methods
  const play = useCallback(async () => {
    if (!state.isReady) return;

    // Sync before playing
    const masterRef = masterVideo === "primary" ? primaryRef : secondaryRef;
    const slaveRef = masterVideo === "primary" ? secondaryRef : primaryRef;
    const masterTime = masterRef.current?.getCurrentTime() ?? 0;
    slaveRef.current?.seekTo(masterTime);

    // Play both
    await Promise.all([
      primaryRef.current?.play(),
      secondaryRef.current?.play(),
    ]);

    setState((prev) => ({ ...prev, isPlaying: true }));
  }, [state.isReady, masterVideo]);

  const pause = useCallback(() => {
    primaryRef.current?.pause();
    secondaryRef.current?.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const seekTo = useCallback((time: number) => {
    primaryRef.current?.seekTo(time);
    secondaryRef.current?.seekTo(time);
    setState((prev) => ({ ...prev, currentDrift: 0 }));
  }, []);

  const setVideoReady = useCallback((which: "primary" | "secondary") => {
    setVideoReadyState((prev) => ({ ...prev, [which]: true }));
  }, []);

  const forceSync = useCallback(() => {
    const masterRef = masterVideo === "primary" ? primaryRef : secondaryRef;
    const slaveRef = masterVideo === "primary" ? secondaryRef : primaryRef;
    const masterTime = masterRef.current?.getCurrentTime() ?? 0;
    slaveRef.current?.seekTo(masterTime);
    setState((prev) => ({ ...prev, currentDrift: 0 }));
  }, [masterVideo]);

  return {
    primaryRef,
    secondaryRef,
    state,
    play,
    pause,
    seekTo,
    setVideoReady,
    forceSync,
  };
}
