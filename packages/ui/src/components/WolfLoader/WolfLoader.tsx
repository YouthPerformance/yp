/**
 * WolfLoader - Premium Loading Screen with Progressive Enhancement
 * =================================================================
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Layer 1: INSTANT (0ms)                                     │
 * │  Black screen + typography + progress bar                   │
 * │  ↓                                                          │
 * │  Layer 2: FAST (~200ms)                                     │
 * │  Video shard animation (.webm/.mp4)                         │
 * │  ↓                                                          │
 * │  Layer 3: PREMIUM (~500-1000ms)                             │
 * │  Unicorn Studio WebGL canvas (takes over when ready)        │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Why hybrid? A loader loading itself is bad UX.
 * Video shows instantly while Unicorn initializes.
 *
 * @package @yp/ui
 */

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useUnicornStudio, type UnicornStatus } from "./useUnicornStudio";
import "./WolfLoader.css";

// Default Unicorn Studio project ID for Wolf animation
const DEFAULT_PROJECT_ID = "J6lD9h4nUQCDLGwKF7Aw";

// Progress phases for natural feel
const PROGRESS_PHASES = {
  INITIAL: { target: 30, speed: 2.5 },    // Quick rise to 30%
  LOADING: { target: 70, speed: 0.8 },    // Slower climb to 70%
  WAITING: { target: 92, speed: 0.15 },   // Crawl to ~92% (anticipation)
  COMPLETE: { target: 100, speed: 10 },   // Snap to 100%
};

export interface WolfLoaderProps {
  /** Whether content is still loading */
  isLoading: boolean;
  /** Callback when loader completes exit animation */
  onLoadComplete?: () => void;
  /** Minimum display duration in ms (default: 3000) */
  minDuration?: number;
  /** Unicorn Studio project ID (default: Wolf animation) */
  projectId?: string;
  /** Custom video sources (webm, mp4) */
  videoSources?: {
    webm?: string;
    mp4?: string;
  };
  /** Timeout for Unicorn SDK before falling back to video (default: 2000ms) */
  unicornTimeout?: number;
  /** Force video-only mode (skip Unicorn) */
  videoOnly?: boolean;
}

function WolfLoaderComponent({
  isLoading,
  onLoadComplete,
  minDuration = 3000,
  projectId = DEFAULT_PROJECT_ID,
  videoSources = {
    webm: "/loader/loadernew.webm",
    mp4: "/loader/loadernew.mp4",
  },
  unicornTimeout = 2000,
  videoOnly = false,
}: WolfLoaderProps) {
  // Core states
  const [visible, setVisible] = useState(true);
  const [entered, setEntered] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  // Video states
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Unicorn Studio hook (only if not video-only)
  const { status: unicornStatus, containerRef } = useUnicornStudio(
    projectId,
    videoOnly ? 0 : unicornTimeout
  );

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTime = useRef(Date.now());
  const fadeOutTimer = useRef<ReturnType<typeof setTimeout>>();
  const removeTimer = useRef<ReturnType<typeof setTimeout>>();

  // Determine which layer is active
  const unicornReady = !videoOnly && unicornStatus === "ready";
  const showVideo = !unicornReady && videoLoaded;

  // Entrance animation
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setEntered(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Phased progress simulation
  useEffect(() => {
    if (!isLoading && progress >= 92) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        let phase;
        if (prev < 30) {
          phase = PROGRESS_PHASES.INITIAL;
        } else if (prev < 70) {
          phase = PROGRESS_PHASES.LOADING;
        } else if (prev < 92) {
          phase = PROGRESS_PHASES.WAITING;
        } else {
          clearInterval(interval);
          return prev;
        }

        const remaining = phase.target - prev;
        const increment = Math.max(0.1, remaining * phase.speed * 0.1);
        return Math.min(prev + increment, phase.target);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isLoading, progress]);

  // Handle fade out when loading completes
  useEffect(() => {
    if (!isLoading && visible && !fadeOut) {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, minDuration - elapsed);

      fadeOutTimer.current = setTimeout(() => {
        // Phase 1: Progress snaps to 100%, glow activates
        setProgress(100);
        setComplete(true);

        // Phase 2: Short pause to appreciate completion (200ms)
        setTimeout(() => {
          // Phase 3: Begin staggered fade out
          setFadeOut(true);

          // Phase 4: Remove from DOM after exit animation
          removeTimer.current = setTimeout(() => {
            setVisible(false);
            onLoadComplete?.();
          }, 1200);
        }, 200);
      }, remaining);
    }

    return () => {
      if (fadeOutTimer.current) clearTimeout(fadeOutTimer.current);
      if (removeTimer.current) clearTimeout(removeTimer.current);
    };
  }, [isLoading, visible, fadeOut, minDuration, onLoadComplete]);

  // Video event handlers
  const handleVideoCanPlay = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleVideoError = useCallback(() => {
    console.warn("[WolfLoader] Video not found - using typography fallback");
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`wolf-loader ${entered ? "entered" : ""} ${complete ? "complete" : ""} ${fadeOut ? "fade-out" : ""}`}
    >
      {/* Layer 3: Unicorn Studio WebGL (Premium) */}
      {!videoOnly && (
        <div
          ref={containerRef}
          data-us-project={projectId}
          className={`wolf-loader-unicorn ${unicornReady ? "active" : ""}`}
          style={{ width: "30vw", height: "30vh" }}
        />
      )}

      {/* Layer 2: Video Fallback (Fast) */}
      <div
        className={`wolf-loader-video-container ${complete ? "complete" : ""} ${unicornReady ? "hidden" : ""}`}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`wolf-loader-video ${showVideo ? "loaded" : ""}`}
          onCanPlay={handleVideoCanPlay}
          onError={handleVideoError}
        >
          {videoSources.webm && (
            <source src={videoSources.webm} type="video/webm" />
          )}
          {videoSources.mp4 && (
            <source src={videoSources.mp4} type="video/mp4" />
          )}
        </video>
      </div>

      {/* Footer: Typography + Progress */}
      <div className={`wolf-loader-footer ${fadeOut ? "exit" : ""}`}>
        {/* Status Line */}
        <div className="wolf-loader-status">
          {/* Blinking Dot */}
          <div className={`wolf-loader-dot ${complete ? "complete" : ""}`}>
            <div className="wolf-loader-dot-ping" />
            <div className="wolf-loader-dot-core" />
          </div>

          <span className={`wolf-loader-text ${complete ? "complete" : ""}`}>
            {complete ? "SYSTEM READY" : "SYSTEM SYNC // V2.0"}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className={`wolf-loader-progress-track ${complete ? "complete" : ""}`}
        >
          <div
            className={`wolf-loader-progress-bar ${complete ? "complete" : ""}`}
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const WolfLoader = memo(WolfLoaderComponent);
export default WolfLoader;
