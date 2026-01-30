"use client";

import { useState } from "react";
import Image from "next/image";

interface VideoQuoteProps {
  poster: string;
  src?: string;
  duration?: string;
  quote: string;
  attribution: string;
}

function WaveformVisualizer() {
  return (
    <div className="waveform">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.05}s` }} />
      ))}
      <style jsx>{`
        .waveform {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          height: 32px;
        }

        .wave-bar {
          width: 3px;
          background: #00f6e0;
          border-radius: 2px;
          animation: wave 0.8s ease-in-out infinite;
        }

        @keyframes wave {
          0%,
          100% {
            height: 8px;
            opacity: 0.4;
          }
          50% {
            height: 24px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export function VideoQuote({
  poster,
  src,
  duration,
  quote,
  attribution,
}: VideoQuoteProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="video-quote" id="video">
      <div className="vq-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="header-line" />
          <h2 className="section-label">VOICE LOG</h2>
          <span className="header-line" />
        </div>

        {/* Video Player */}
        <div className="video-wrapper">
          {/* Corner Ticks */}
          <div className="tick tick-tl" />
          <div className="tick tick-tr" />
          <div className="tick tick-bl" />
          <div className="tick tick-br" />

          {src && isPlaying ? (
            <video
              autoPlay
              controls
              className="video-player"
              poster={poster}
              onEnded={() => setIsPlaying(false)}
            >
              <source src={src} type="video/mp4" />
            </video>
          ) : (
            <div className="video-poster" onClick={() => src && setIsPlaying(true)}>
              <Image
                src={poster}
                alt="Video thumbnail"
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="poster-overlay" />

              {/* Play Control */}
              <div className="play-control">
                <div className="file-label">VOICE_LOG_001.MP4</div>
                <WaveformVisualizer />
                <button className="play-button" aria-label="Play video">
                  <span className="play-icon">▶</span>
                </button>
                {duration && <div className="duration-badge">{duration}</div>}
              </div>
            </div>
          )}
        </div>

        {/* Quote Block */}
        <blockquote className="quote-block">
          <p className="quote-text">"{quote}"</p>
          <cite className="quote-attribution">— {attribution}</cite>
        </blockquote>
      </div>

      <style jsx>{`
        .video-quote {
          padding: 80px 24px;
          background: #000;
        }

        .vq-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .header-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 246, 224, 0.2),
            transparent
          );
        }

        .section-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 4px;
          color: #555;
          margin: 0;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #0a0a0a;
          margin-bottom: 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Corner Ticks */
        .tick {
          position: absolute;
          width: 16px;
          height: 16px;
          z-index: 20;
        }

        .tick-tl {
          top: 0;
          left: 0;
          border-top: 2px solid #00f6e0;
          border-left: 2px solid #00f6e0;
        }

        .tick-tr {
          top: 0;
          right: 0;
          border-top: 2px solid #00f6e0;
          border-right: 2px solid #00f6e0;
        }

        .tick-bl {
          bottom: 0;
          left: 0;
          border-bottom: 2px solid #00f6e0;
          border-left: 2px solid #00f6e0;
        }

        .tick-br {
          bottom: 0;
          right: 0;
          border-bottom: 2px solid #00f6e0;
          border-right: 2px solid #00f6e0;
        }

        .video-player {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-poster {
          position: relative;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .poster-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          transition: background 0.3s ease;
        }

        .video-poster:hover .poster-overlay {
          background: rgba(0, 0, 0, 0.4);
        }

        .play-control {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          z-index: 10;
        }

        .file-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 2px;
          color: #00f6e0;
          background: rgba(0, 0, 0, 0.6);
          padding: 6px 12px;
          border: 1px solid rgba(0, 246, 224, 0.3);
        }

        .play-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
        }

        .play-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: rgba(0, 246, 224, 0.9);
          font-size: 20px;
          color: #000;
          padding-left: 4px;
          box-shadow: 0 0 40px rgba(0, 246, 224, 0.4);
          transition: all 0.3s ease;
        }

        .video-poster:hover .play-icon {
          transform: scale(1.1);
          box-shadow: 0 0 60px rgba(0, 246, 224, 0.6);
        }

        .duration-badge {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          color: #888;
          letter-spacing: 1px;
        }

        .quote-block {
          text-align: center;
          margin: 0;
          padding: 0;
        }

        .quote-text {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: clamp(18px, 3vw, 24px);
          font-weight: 300;
          font-style: italic;
          line-height: 1.6;
          color: #fff;
          margin: 0 0 16px;
        }

        .quote-attribution {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          letter-spacing: 2px;
          color: #00f6e0;
          font-style: normal;
        }

        @media (max-width: 768px) {
          .video-quote {
            padding: 48px 16px;
          }

          .play-icon {
            width: 56px;
            height: 56px;
            font-size: 18px;
          }

          .tick {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </section>
  );
}
