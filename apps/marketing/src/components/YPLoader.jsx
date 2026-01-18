/**
 * YPLoader - "Silent Luxury" Loading Screen
 * ==========================================
 * Premium loader with shard video animation and military-spec typography.
 *
 * ULTRATHINK Edition:
 * - Smart video/fallback detection
 * - Phased progress (natural feel)
 * - Entrance animation
 * - Subtle glitch effect
 * - Proper cleanup
 *
 * Asset Requirements:
 * - /loader/loader.webm (primary, transparent)
 * - /loader/loader.mp4 (fallback for Safari/iOS)
 * - Files should be <2MB compressed
 */

import { useState, useEffect, useRef, useCallback, memo } from "react";
import "./YPLoader.css";

// Progress phases for natural feel
const PROGRESS_PHASES = {
  INITIAL: { target: 30, speed: 2.5 },    // Quick rise to 30%
  LOADING: { target: 70, speed: 0.8 },    // Slower climb to 70%
  WAITING: { target: 92, speed: 0.15 },   // Crawl to ~92% (anticipation)
  COMPLETE: { target: 100, speed: 10 },   // Snap to 100%
};

function YPLoader({ isLoading, onLoadComplete, minDuration = 3000 }) {
  // Core states
  const [visible, setVisible] = useState(true);
  const [entered, setEntered] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false); // Progress hit 100%

  // Video states
  const [videoState, setVideoState] = useState('idle'); // idle | loading | playing | failed
  const [glitchActive, setGlitchActive] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const startTime = useRef(Date.now());
  const fadeOutTimer = useRef(null);
  const removeTimer = useRef(null);
  const glitchTimer = useRef(null);

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
      // Snap to 100 when loading complete
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Determine current phase
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

        // Calculate increment with easing
        const remaining = phase.target - prev;
        const increment = Math.max(0.1, remaining * phase.speed * 0.1);

        return Math.min(prev + increment, phase.target);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isLoading, progress]);

  // Handle fade out when loading completes - STAGGERED EXIT
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

          // Phase 4: Remove from DOM after exit animation (1.2s for smooth exit)
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

  // Subtle glitch effect on YP (only when video not loaded)
  useEffect(() => {
    if (videoState === 'playing') return;

    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);

      // Random interval between 2-5 seconds
      const nextGlitch = 2000 + Math.random() * 3000;
      glitchTimer.current = setTimeout(triggerGlitch, nextGlitch);
    };

    // Start first glitch after 1.5s
    glitchTimer.current = setTimeout(triggerGlitch, 1500);

    return () => {
      if (glitchTimer.current) clearTimeout(glitchTimer.current);
    };
  }, [videoState]);

  // Video event handlers
  const handleVideoCanPlay = useCallback(() => {
    setVideoState('playing');
  }, []);

  const handleVideoError = useCallback(() => {
    console.log("[Loader] Video not found - using fallback");
    setVideoState('failed');
  }, []);

  const handleVideoLoadStart = useCallback(() => {
    setVideoState('loading');
  }, []);

  if (!visible) return null;

  const showFallback = videoState !== 'playing';

  return (
    <div className={`yp-loader ${entered ? 'entered' : ''} ${complete ? 'complete' : ''} ${fadeOut ? 'fade-out' : ''}`}>
      {/* THE ARTIFACT: Video Container */}
      <div className={`yp-loader-video-container ${complete ? 'complete' : ''}`}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`yp-loader-video ${videoState === 'playing' ? 'loaded' : ''}`}
          onLoadStart={handleVideoLoadStart}
          onCanPlay={handleVideoCanPlay}
          onError={handleVideoError}
        >
          <source src="/loader/loadernew.webm" type="video/webm" />
          <source src="/loader/loadernew.mp4" type="video/mp4" />
        </video>

        {/* No fallback - shard video only */}
      </div>

      {/* THE TYPOGRAPHY: "Silent Luxury" Specs */}
      <div className={`yp-loader-footer ${fadeOut ? 'exit' : ''}`}>
        {/* Line 1: The Status Code */}
        <div className="yp-loader-status">
          {/* Blinking cyan dot */}
          <div className={`yp-loader-dot ${complete ? 'complete' : ''}`}>
            <div className="yp-loader-dot-ping" />
            <div className="yp-loader-dot-core" />
          </div>

          <span className={`yp-loader-text ${complete ? 'complete' : ''}`}>
            {complete ? 'SYSTEM READY' : 'SYSTEM SYNC // V2.0'}
          </span>
        </div>

        {/* Line 2: Ultra-Thin Progress Bar */}
        <div className={`yp-loader-progress-track ${complete ? 'complete' : ''}`}>
          <div
            className={`yp-loader-progress-bar ${complete ? 'complete' : ''}`}
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders from parent
export default memo(YPLoader);
