"use client";

import { DrillV3, getTagData } from "@/data/drills/drill-v3-types";

export interface DrillHeroProps {
  drill: DrillV3;
  onStartTimer?: () => void;
  onAddToPlan?: () => void;
  onSave?: () => void;
}

export function DrillHero({ drill, onStartTimer, onAddToPlan, onSave }: DrillHeroProps) {
  return (
    <section className="drill-hero" data-layer="guide">
      {/* Video Background (Mobile-first: video becomes bg) */}
      <div className="hero-video-bg">
        {drill.videoUrl && (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={drill.videoPoster}
            aria-hidden="true"
          >
            <source src={drill.videoUrl} type="video/mp4" />
          </video>
        )}
        <div className="hero-gradient-overlay" />
      </div>

      {/* Content Overlay */}
      <div className="hero-content-overlay">
        <div className="pillar-container">
          {/* Tags */}
          <div className="hero-tags">
            {drill.tags.map((tagType) => {
              const tag = getTagData(tagType);
              return (
                <span key={tagType} className={`drill-tag drill-tag--${tagType}`}>
                  {tag.icon && <span className="tag-icon">{tag.icon}</span>}
                  {tag.label}
                </span>
              );
            })}
          </div>

          {/* H1 Title - Critical for SEO */}
          <h1 className="hero-title" itemProp="headline">
            {drill.title}
          </h1>

          {/* Definition - Answer-first for AI crawlers */}
          <p className="hero-definition" itemProp="description">
            {drill.definition}
          </p>

          {/* Action Row (TRAIN layer - interactive) */}
          <div className="hero-actions" data-layer="train">
            <button
              className="hero-cta-glow"
              onClick={onStartTimer}
              aria-label="Start drill timer"
            >
              <span className="cta-icon">▶</span>
              Start Drill
            </button>
            <button
              className="hero-cta-outline"
              onClick={onAddToPlan}
              aria-label="Add drill to training plan"
            >
              <span className="cta-icon">+</span>
              Add to Plan
            </button>
            <button
              className="hero-cta-ghost"
              onClick={onSave}
              aria-label="Save drill for later"
            >
              <span className="cta-icon">🔖</span>
            </button>
          </div>

          {/* Quick Stats Row */}
          <div className="hero-stats-row">
            <div className="hero-stat">
              <span className="hero-stat-value">{drill.duration}</span>
              <span className="hero-stat-label">Duration</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className={`hero-stat-value hero-stat-value--${drill.level}`}>
                {drill.level.charAt(0).toUpperCase() + drill.level.slice(1)}
              </span>
              <span className="hero-stat-label">Difficulty</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value white">{drill.noiseLevel || "—"}</span>
              <span className="hero-stat-label">Noise Level</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="scroll-hint" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 16L6 10h12l-6 6z" />
        </svg>
      </div>

      <style jsx>{`
        .drill-hero {
          position: relative;
          min-height: var(--drill-hero-min-height, 100vh);
          min-height: var(--drill-hero-min-height-dvh, 100dvh);
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .hero-video-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a0a0a 0%, #000 50%, #050510 100%);
          overflow: hidden;
        }

        .hero-video-bg video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
        }

        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.2) 0%,
            transparent 20%,
            transparent 40%,
            rgba(0, 0, 0, 0.7) 70%,
            rgba(0, 0, 0, 0.95) 100%
          );
          pointer-events: none;
        }

        .hero-content-overlay {
          position: relative;
          z-index: 10;
          width: 100%;
          padding-bottom: var(--drill-hero-padding-bottom, 120px);
        }

        .hero-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--pillar-space-2);
          margin-bottom: var(--pillar-space-4);
        }

        /* Tags: white text with white/20 border - reserve cyan for CTA only */
        .drill-tag {
          display: inline-flex;
          align-items: center;
          gap: var(--pillar-space-1);
          padding: var(--pillar-space-1) var(--pillar-space-3);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--pillar-text-primary);
        }

        .tag-icon {
          font-size: 12px;
        }

        .hero-title {
          font-family: var(--pillar-font-display);
          font-size: clamp(48px, 12vw, 80px);
          line-height: 0.95;
          letter-spacing: -0.01em;
          color: var(--pillar-text-primary);
          text-shadow: 0 0 60px rgba(0, 246, 224, 0.15);
          margin: 0 0 var(--pillar-space-4) 0;
        }

        .hero-definition {
          font-size: clamp(16px, 2.5vw, 20px);
          line-height: 1.6;
          color: var(--pillar-text-secondary);
          max-width: var(--drill-definition-max-width, 600px);
          margin: 0 0 var(--pillar-space-8) 0;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--pillar-space-4);
          margin-bottom: var(--pillar-space-8);
        }

        .hero-cta-glow {
          display: inline-flex;
          align-items: center;
          gap: var(--pillar-space-2);
          background: linear-gradient(135deg, var(--pillar-brand-cyan) 0%, #00d4c4 100%);
          color: var(--pillar-surface-base);
          padding: var(--pillar-space-4) var(--pillar-space-8);
          border-radius: 14px;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          box-shadow: 0 0 40px rgba(0, 246, 224, 0.35);
          transition: all 0.3s ease;
        }

        .hero-cta-glow:hover {
          box-shadow: 0 0 60px rgba(0, 246, 224, 0.5);
          transform: translateY(-2px);
        }

        .hero-cta-outline {
          display: inline-flex;
          align-items: center;
          gap: var(--pillar-space-2);
          background: transparent;
          color: var(--pillar-text-primary);
          padding: var(--pillar-space-4) var(--pillar-space-8);
          border-radius: 14px;
          font-weight: 600;
          font-size: 15px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .hero-cta-outline:hover {
          border-color: var(--pillar-brand-cyan);
          background: rgba(0, 246, 224, 0.1);
        }

        .hero-cta-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hero-cta-ghost:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .cta-icon {
          font-size: 14px;
        }

        .hero-stats-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--pillar-space-6);
          align-items: center;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-1);
        }

        .hero-stat-value {
          font-family: var(--pillar-font-display);
          font-size: clamp(24px, 4vw, 32px);
          color: var(--pillar-brand-cyan);
        }

        .hero-stat-value.white {
          color: var(--pillar-text-primary);
        }

        .hero-stat-value--beginner {
          color: var(--pillar-status-success);
        }

        .hero-stat-value--intermediate {
          color: var(--pillar-status-warning);
        }

        .hero-stat-value--advanced {
          color: var(--pillar-status-error);
        }

        .hero-stat-label {
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--pillar-text-dim);
        }

        .hero-stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
        }

        .scroll-hint {
          position: absolute;
          bottom: var(--pillar-space-6);
          left: 50%;
          transform: translateX(-50%);
          color: var(--pillar-text-dim);
          animation: scroll-bounce 2s ease-in-out infinite;
        }

        @keyframes scroll-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(40px, 14vw, 60px);
          }

          .hero-actions {
            flex-direction: column;
            gap: var(--pillar-space-3);
          }

          .hero-cta-glow,
          .hero-cta-outline {
            width: 100%;
            justify-content: center;
          }

          .hero-cta-ghost {
            position: absolute;
            top: var(--pillar-space-6);
            right: var(--pillar-space-6);
          }

          .hero-stats-row {
            gap: var(--pillar-space-4);
          }

          .hero-stat-divider {
            height: 32px;
          }
        }
      `}</style>
    </section>
  );
}

export default DrillHero;
