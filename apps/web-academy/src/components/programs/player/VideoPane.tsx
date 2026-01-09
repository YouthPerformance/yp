// ═══════════════════════════════════════════════════════════
// VideoPane Component
// Single video container with HLS support, reusable for split-screen
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Hls from "hls.js";
import { Volume2, VolumeX } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface VideoPaneProps {
  /** Video URL (supports .m3u8 HLS streams and regular video files) */
  videoUrl: string;
  /** Whether this video should play audio */
  hasAudio?: boolean;
  /** Label to display on the video (e.g., "COACH", "DEMO") */
  label?: string;
  /** Whether the video is currently paused */
  isPaused?: boolean;
  /** Callback when video is ready to play */
  onReady?: () => void;
  /** Callback when video errors */
  onError?: (error: Error) => void;
  /** Optional class name for custom styling */
  className?: string;
  /** Whether to show the audio indicator badge */
  showAudioIndicator?: boolean;
  /** Theme color for accents */
  themeColor?: string;
}

export interface VideoPaneRef {
  /** Get current playback time in seconds */
  getCurrentTime: () => number;
  /** Seek to a specific time in seconds */
  seekTo: (time: number) => void;
  /** Play the video */
  play: () => Promise<void>;
  /** Pause the video */
  pause: () => void;
  /** Get the underlying video element */
  getVideoElement: () => HTMLVideoElement | null;
}

/**
 * VideoPane - A single video container with HLS support
 *
 * Used as the building block for split-screen layouts.
 * Handles HLS.js initialization for .m3u8 streams with Safari fallback.
 *
 * @example
 * ```tsx
 * <VideoPane
 *   videoUrl="https://cdn.example.com/video.m3u8"
 *   hasAudio={true}
 *   label="COACH"
 *   isPaused={false}
 * />
 * ```
 */
export const VideoPane = forwardRef<VideoPaneRef, VideoPaneProps>(function VideoPane(
  {
    videoUrl,
    hasAudio = false,
    label,
    isPaused = false,
    onReady,
    onError,
    className = "",
    showAudioIndicator = true,
    themeColor = "#00f6e0",
  },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getCurrentTime: () => videoRef.current?.currentTime ?? 0,
    seekTo: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    play: async () => {
      if (videoRef.current) {
        await videoRef.current.play();
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    getVideoElement: () => videoRef.current,
  }));

  // Initialize HLS or native video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    const isHls = videoUrl.includes(".m3u8");

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        // Optimize for smooth playback
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsReady(true);
        onReady?.();
        if (!isPaused) {
          video.play().catch(() => {});
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          onError?.(new Error(`HLS Error: ${data.type} - ${data.details}`));
        }
      });

      hlsRef.current = hls;

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS support
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsReady(true);
        onReady?.();
      });
      if (!isPaused) {
        video.play().catch(() => {});
      }
    } else if (!isHls) {
      // Regular video file
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsReady(true);
        onReady?.();
      });
      if (!isPaused) {
        video.play().catch(() => {});
      }
    }
  }, [videoUrl, onReady, onError, isPaused]);

  // Sync play/pause state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    if (isPaused) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [isPaused, isReady]);

  // Sync audio state
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = !hasAudio;
    }
  }, [hasAudio]);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={!hasAudio}
      />

      {/* Gradient overlay for label readability */}
      {label && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      )}

      {/* Label Badge */}
      {label && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold tracking-wider"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            color: "var(--text-primary)",
          }}
        >
          {label}
        </motion.div>
      )}

      {/* Audio Indicator */}
      {showAudioIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-3 right-3 p-2 rounded-full"
          style={{
            backgroundColor: hasAudio ? `${themeColor}30` : "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
          }}
        >
          {hasAudio ? (
            <Volume2 className="w-4 h-4" style={{ color: themeColor }} />
          ) : (
            <VolumeX className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
          )}
        </motion.div>
      )}

      {/* Loading State */}
      {!isReady && videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${themeColor} transparent ${themeColor} ${themeColor}` }}
          />
        </div>
      )}
    </div>
  );
});
