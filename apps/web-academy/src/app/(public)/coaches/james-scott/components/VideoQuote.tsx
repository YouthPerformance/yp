"use client";

interface VideoQuoteProps {
  poster: string;
  src?: string;
  duration?: string;
  quote: string;
  attribution: string;
}

export function VideoQuote({
  poster,
  duration,
  quote,
  attribution,
}: VideoQuoteProps) {
  return (
    <section className="video-section">
      <div className="video-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="header-line" />
          <h2 className="section-label">INSIDE THE LAB</h2>
          <span className="header-line" />
        </div>

        <div className="video-content">
          {/* Video Frame */}
          <div className="video-frame">
            <img src={poster} alt="James Scott training" className="video-poster" />
            <button className="play-button" aria-label="Play video">
              <svg
                className="play-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            {duration && <span className="video-duration">{duration}</span>}
          </div>

          {/* Quote */}
          <div className="quote-block">
            <blockquote className="quote-text">&ldquo;{quote}&rdquo;</blockquote>
            <cite className="quote-attribution">— {attribution}</cite>
          </div>
        </div>
      </div>

      <style jsx>{`
        .video-section {
          padding: 80px 24px;
          background: #030303;
        }

        .video-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
        }

        .header-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 215, 0, 0.3),
            transparent
          );
        }

        .section-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 4px;
          color: #ffd700;
          margin: 0;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .video-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }

        .video-frame {
          position: relative;
          aspect-ratio: 16 / 10;
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .video-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
        }

        .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(0, 246, 224, 0.9);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .play-button:hover {
          background: #00f6e0;
          transform: translate(-50%, -50%) scale(1.1);
        }

        .play-icon {
          width: 28px;
          height: 28px;
          color: #000;
          margin-left: 4px;
        }

        .video-duration {
          position: absolute;
          bottom: 12px;
          right: 12px;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.8);
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          color: #fff;
        }

        .quote-block {
          padding-left: 24px;
          border-left: 3px solid rgba(255, 215, 0, 0.4);
        }

        .quote-text {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 20px;
          line-height: 1.6;
          color: #ccc;
          margin: 0 0 16px 0;
          font-style: italic;
        }

        .quote-attribution {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          letter-spacing: 2px;
          color: #666;
          font-style: normal;
        }

        @media (max-width: 768px) {
          .video-section {
            padding: 48px 16px;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
          }

          .header-line {
            width: 60px;
            flex: none;
          }

          .video-content {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .quote-block {
            padding-left: 16px;
          }

          .quote-text {
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
}
