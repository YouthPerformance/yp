"use client";

import Link from "next/link";
import { MetricsStrip, type Metric } from "./MetricsStrip";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface Expert {
  name: string;
  title: string;
  icon: string;
  image?: string;
  slug?: string; // Coach page slug for backlink (e.g., "adam-harrington")
}

export interface PillarHeroProps {
  title: string;
  subtitle?: string;
  definition: string;
  expert?: Expert;
  metrics?: Metric[];
  isPillar?: boolean;
  noiseLevel?: string;
  videoXP?: number;
  videoUrl?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// V7.2 Immersive Hero - Video background with overlaid content
// ═══════════════════════════════════════════════════════════

export function PillarHero({
  title,
  subtitle,
  definition,
  expert,
  metrics,
  isPillar = false,
  noiseLevel = "<40dB",
  videoXP = 50,
  videoUrl,
  primaryCTA,
  secondaryCTA,
}: PillarHeroProps) {
  // Split title for multi-line display
  const titleLines = title.toUpperCase().split(" ");

  return (
    <section className="pillar-hero--immersive">
      {/* Video Background */}
      <div className="hero-video-bg">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/images/hero-placeholder.jpg"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="hero-video-placeholder">
            <div className="hero-video-placeholder-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="hero-video-placeholder-text">9:16 Demo Loop</span>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="hero-gradient-overlay" />

      {/* dB Badge - Top Right */}
      <div className="hero-floating-badge db">
        <span className="hero-badge-dot" />
        <span className="hero-badge-text">{noiseLevel}</span>
      </div>

      {/* Trust Badge - Top Left - Links to coach page for entity backlink */}
      {expert && (
        <div className="hero-floating-badge trust">
          <span className="hero-trust-dot" />
          <span className="hero-trust-text">
            Verified ·{" "}
            {expert.slug ? (
              <Link
                href={`/coaches/${expert.slug}`}
                className="hero-expert-link"
              >
                {expert.name}
              </Link>
            ) : (
              expert.name
            )}
          </span>
        </div>
      )}

      {/* Main Content - Bottom Overlay */}
      <div className="hero-content-overlay">
        <div className="pillar-container">
          {/* Title */}
          <h1 className="hero-title-immersive">
            {titleLines.map((word, i) => (
              <span key={i}>
                {word}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Definition */}
          <p
            className="hero-definition-immersive"
            dangerouslySetInnerHTML={{ __html: definition }}
          />

          {/* Action Buttons */}
          <div className="hero-actions-immersive">
            {primaryCTA && (
              <Link href={primaryCTA.href} className="hero-cta-glow">
                {primaryCTA.label}
              </Link>
            )}
            {secondaryCTA && (
              <Link href={secondaryCTA.href} className="hero-cta-outline">
                {secondaryCTA.label} →
              </Link>
            )}
          </div>

          {/* Metrics Strip / Quick Stats */}
          {metrics && metrics.length > 0 ? (
            <MetricsStrip metrics={metrics} />
          ) : (
            <div className="hero-stats-row">
              <div className="hero-stat">
                <span className="hero-stat-value">{noiseLevel}</span>
                <span className="hero-stat-label">Max Noise</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value white">12</span>
                <span className="hero-stat-label">Core Drills</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value white">15min</span>
                <span className="hero-stat-label">Daily Stack</span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll Hint */}
        <div className="scroll-hint">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        .pillar-hero--immersive {
          min-height: 90vh;
          min-height: 90dvh;
          position: relative;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .hero-video-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a0a0a 0%, #000 50%, #050510 100%);
        }

        .hero-video-bg video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.6;
        }

        .hero-video-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0.3;
        }

        .hero-video-placeholder-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--pillar-space-4);
        }

        .hero-video-placeholder-icon svg {
          width: 32px;
          height: 32px;
          color: rgba(255, 255, 255, 0.5);
          margin-left: 4px;
        }

        .hero-video-placeholder-text {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3);
        }

        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.3) 0%,
            transparent 30%,
            transparent 50%,
            rgba(0, 0, 0, 0.8) 80%,
            rgba(0, 0, 0, 0.95) 100%
          );
          pointer-events: none;
        }

        .hero-floating-badge {
          position: absolute;
          z-index: 20;
          padding: var(--pillar-space-2) var(--pillar-space-4);
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          font-size: 13px;
        }

        .hero-floating-badge.db {
          top: var(--pillar-space-6);
          right: var(--pillar-space-6);
          background: rgba(0, 246, 224, 0.15);
          border-color: rgba(0, 246, 224, 0.4);
          animation: db-pulse 2s ease-in-out infinite;
        }

        .hero-floating-badge.trust {
          top: var(--pillar-space-6);
          left: var(--pillar-space-6);
        }

        @keyframes db-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 246, 224, 0.2); }
          50% { box-shadow: 0 0 30px rgba(0, 246, 224, 0.4); }
        }

        .hero-badge-dot {
          width: 6px;
          height: 6px;
          background: var(--pillar-brand-cyan);
          border-radius: 50%;
        }

        .hero-badge-text {
          font-family: var(--pillar-font-display);
          font-size: 16px;
          color: var(--pillar-brand-cyan);
          letter-spacing: 0.5px;
        }

        .hero-trust-dot {
          width: 8px;
          height: 8px;
          background: var(--pillar-status-success);
          border-radius: 50%;
        }

        .hero-trust-text {
          color: var(--pillar-text-secondary);
        }

        .hero-trust-text :global(.hero-expert-link) {
          color: var(--pillar-brand-cyan);
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .hero-trust-text :global(.hero-expert-link):hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .hero-content-overlay {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: var(--pillar-space-8) 0;
          padding-bottom: var(--pillar-space-16);
        }

        .hero-title-immersive {
          font-family: var(--pillar-font-display);
          font-size: clamp(48px, 10vw, 96px);
          line-height: 0.92;
          letter-spacing: -0.01em;
          color: var(--pillar-text-primary);
          text-shadow: 0 0 60px rgba(0, 246, 224, 0.2);
          margin-bottom: var(--pillar-space-6);
        }

        .hero-definition-immersive {
          font-size: clamp(16px, 2vw, 20px);
          line-height: 1.6;
          color: var(--pillar-text-secondary);
          max-width: 600px;
          margin-bottom: var(--pillar-space-8);
        }

        .hero-definition-immersive :global(strong) {
          color: var(--pillar-brand-cyan);
          font-weight: 600;
        }

        .hero-actions-immersive {
          display: flex;
          flex-wrap: wrap;
          gap: var(--pillar-space-4);
          margin-bottom: var(--pillar-space-10);
        }

        .hero-cta-glow {
          background: linear-gradient(135deg, var(--pillar-brand-cyan) 0%, #00d4c4 100%);
          color: var(--pillar-surface-base);
          padding: var(--pillar-space-5) var(--pillar-space-10);
          border-radius: 16px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
          border: none;
          cursor: pointer;
          box-shadow: 0 0 60px rgba(0, 246, 224, 0.4), 0 10px 40px rgba(0, 246, 224, 0.3);
          transition: all 0.4s ease;
          text-decoration: none;
        }

        .hero-cta-glow:hover {
          box-shadow: 0 0 80px rgba(0, 246, 224, 0.6), 0 15px 50px rgba(0, 246, 224, 0.4);
          transform: translateY(-4px) scale(1.02);
          opacity: 1;
        }

        .hero-cta-outline {
          border: 2px solid rgba(255, 255, 255, 0.3);
          background: transparent;
          backdrop-filter: blur(10px);
          color: var(--pillar-text-primary);
          padding: var(--pillar-space-5) var(--pillar-space-10);
          border-radius: 16px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .hero-cta-outline:hover {
          border-color: var(--pillar-brand-cyan);
          background: rgba(0, 246, 224, 0.1);
          opacity: 1;
        }

        .hero-stats-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--pillar-space-8);
          align-items: center;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
        }

        .hero-stat-value {
          font-family: var(--pillar-font-display);
          font-size: clamp(28px, 4vw, 40px);
          color: var(--pillar-brand-cyan);
        }

        .hero-stat-value.white {
          color: var(--pillar-text-primary);
        }

        .hero-stat-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--pillar-text-dim);
        }

        .hero-stat-divider {
          width: 1px;
          height: 48px;
          background: rgba(255, 255, 255, 0.1);
        }

        .scroll-hint {
          position: absolute;
          bottom: var(--pillar-space-6);
          left: 50%;
          transform: translateX(-50%);
          animation: scroll-bounce 2s ease-in-out infinite;
          color: var(--pillar-text-dim);
        }

        @keyframes scroll-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .hero-floating-badge {
            padding: var(--pillar-space-1) var(--pillar-space-3);
            font-size: 11px;
          }

          .hero-floating-badge.db {
            top: var(--pillar-space-4);
            right: var(--pillar-space-4);
          }

          .hero-floating-badge.trust {
            top: var(--pillar-space-4);
            left: var(--pillar-space-4);
          }

          .hero-badge-text {
            font-size: 14px;
          }

          .hero-cta-glow,
          .hero-cta-outline {
            padding: var(--pillar-space-4) var(--pillar-space-6);
            font-size: 14px;
            border-radius: 12px;
          }

          .hero-stats-row {
            gap: var(--pillar-space-6);
          }

          .hero-stat-divider {
            height: 36px;
          }
        }
      `}</style>
    </section>
  );
}

export default PillarHero;
