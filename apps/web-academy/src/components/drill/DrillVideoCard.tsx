"use client";

import { useState, useRef } from "react";
import { VideoChapter } from "@/data/drills/drill-v3-types";

export interface DrillVideoCardProps {
  videoUrl: string;
  poster?: string;
  duration?: string;
  chapters?: VideoChapter[];
  transcript?: string;
  title: string;
}

export function DrillVideoCard({
  videoUrl,
  poster,
  duration,
  chapters,
  transcript,
  title,
}: DrillVideoCardProps) {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const seekToChapter = (seconds: number, index: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
      setActiveChapter(index);
      setIsPlaying(true);
    }
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);

  return (
    <section className="drill-video-card" data-layer="guide">
      <h2 className="section-title">Watch & Learn</h2>

      {/* Video Player */}
      <div className={`video-container ${!poster ? "video-container--no-poster" : ""}`}>
        <video
          ref={videoRef}
          className="video-player"
          controls
          poster={poster}
          preload="metadata"
          aria-label={`${title} demonstration video`}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Gradient overlay for contrast */}
        <div className="video-gradient-overlay" aria-hidden="true" />

        {/* Large centered play button overlay */}
        {!isPlaying && (
          <button
            className="video-play-overlay"
            onClick={handlePlayClick}
            aria-label="Play video"
          >
            <span className="play-button">
              <span className="play-icon">▶</span>
            </span>
          </button>
        )}

        {duration && (
          <span className="video-duration" aria-label={`Video duration: ${duration}`}>
            {duration}
          </span>
        )}
      </div>

      {/* Chapters */}
      {chapters && chapters.length > 0 && (
        <div className="video-chapters">
          <h3 className="chapters-title">Chapters</h3>
          <div className="chapters-list">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.timestamp}
                className={`chapter-item ${activeChapter === index ? "chapter-item--active" : ""}`}
                onClick={() => seekToChapter(chapter.seconds, index)}
                aria-label={`Jump to ${chapter.title} at ${chapter.timestamp}`}
              >
                <span className="chapter-time">{chapter.timestamp}</span>
                <span className="chapter-name">{chapter.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Transcript Toggle */}
      {transcript && (
        <details
          className="video-transcript"
          open={isTranscriptOpen}
          onToggle={(e) => setIsTranscriptOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary className="transcript-toggle">
            <span className="toggle-icon">{isTranscriptOpen ? "−" : "+"}</span>
            <span className="toggle-text">Transcript</span>
          </summary>
          <div className="transcript-content">
            {transcript.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </details>
      )}

      <style jsx>{`
        .drill-video-card {
          padding: var(--drill-section-gap, 48px) 0;
        }

        .section-title {
          font-family: var(--pillar-font-display);
          font-size: 28px;
          letter-spacing: 0.02em;
          color: var(--pillar-text-primary);
          margin: 0 0 var(--pillar-space-6) 0;
        }

        .video-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: var(--pillar-surface-card);
          border-radius: 16px;
          overflow: hidden;
        }

        /* Placeholder background pattern when no poster */
        .video-container--no-poster {
          background:
            linear-gradient(135deg, rgba(0, 246, 224, 0.05) 0%, transparent 50%),
            linear-gradient(225deg, rgba(0, 246, 224, 0.03) 0%, transparent 50%),
            repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.02) 0px,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px,
              transparent 20px
            ),
            var(--pillar-surface-card);
        }

        .video-player {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Gradient overlay for contrast */
        .video-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.1) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0, 0, 0, 0.4) 100%
          );
          pointer-events: none;
        }

        /* Large centered play button overlay */
        .video-play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
        }

        .video-play-overlay:hover .play-button {
          transform: scale(1.1);
          box-shadow: 0 0 40px rgba(0, 246, 224, 0.5);
        }

        .play-button {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 246, 224, 0.9);
          border-radius: 50%;
          box-shadow: 0 0 24px rgba(0, 246, 224, 0.3);
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
        }

        .play-icon {
          font-size: 24px;
          color: var(--pillar-surface-base);
          margin-left: 4px; /* Optical center adjustment for play icon */
        }

        .video-duration {
          position: absolute;
          bottom: var(--pillar-space-4);
          right: var(--pillar-space-4);
          padding: var(--pillar-space-1) var(--pillar-space-3);
          background: rgba(0, 0, 0, 0.7);
          border-radius: 4px;
          font-family: var(--pillar-font-mono);
          font-size: 12px;
          color: var(--pillar-text-primary);
          pointer-events: none;
          z-index: 1;
        }

        .video-chapters {
          margin-top: var(--pillar-space-5);
        }

        .chapters-title {
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--pillar-text-muted);
          margin: 0 0 var(--pillar-space-3) 0;
        }

        .chapters-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--pillar-space-2);
        }

        .chapter-item {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          padding: var(--pillar-space-2) var(--pillar-space-3);
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 8px;
          cursor: pointer;
          transition: all var(--pillar-duration-fast) var(--pillar-ease-out);
        }

        .chapter-item:hover {
          border-color: var(--pillar-brand-cyan);
          background: var(--pillar-surface-raised);
        }

        .chapter-item--active {
          border-color: var(--pillar-brand-cyan);
          background: var(--pillar-brand-cyan-dim);
        }

        .chapter-time {
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          color: var(--pillar-brand-cyan);
        }

        .chapter-name {
          font-size: 13px;
          color: var(--pillar-text-primary);
        }

        .video-transcript {
          margin-top: var(--pillar-space-5);
        }

        .transcript-toggle {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          padding: var(--pillar-space-4);
          background: var(--pillar-surface-card);
          border: 1px dashed var(--pillar-border-subtle);
          border-radius: 8px;
          cursor: pointer;
          list-style: none;
          transition: all var(--pillar-duration-fast);
        }

        .transcript-toggle::-webkit-details-marker {
          display: none;
        }

        .transcript-toggle:hover {
          border-color: var(--pillar-brand-cyan);
        }

        .toggle-icon {
          font-size: 16px;
          font-weight: bold;
          color: var(--pillar-text-dim);
        }

        .toggle-text {
          font-family: var(--pillar-font-mono);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--pillar-text-muted);
        }

        .video-transcript[open] .transcript-toggle {
          border-style: solid;
          border-color: var(--pillar-brand-cyan);
          border-radius: 8px 8px 0 0;
        }

        .video-transcript[open] .toggle-icon {
          color: var(--pillar-brand-cyan);
        }

        .transcript-content {
          padding: var(--pillar-space-5);
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-brand-cyan);
          border-top: none;
          border-radius: 0 0 8px 8px;
        }

        .transcript-content p {
          font-size: 14px;
          line-height: 1.8;
          color: var(--pillar-text-secondary);
          margin: 0 0 var(--pillar-space-4) 0;
        }

        .transcript-content p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .video-container {
            border-radius: 12px;
          }

          .chapters-list {
            flex-direction: column;
          }

          .chapter-item {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

export default DrillVideoCard;
