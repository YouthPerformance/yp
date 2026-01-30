"use client";

import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  badge: string;
  name: string;
  tagline: string;
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export function Hero({
  badge,
  name,
  tagline,
  image,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  // Split name for stacked display
  const nameParts = name.split(" ");

  return (
    <section className="dossier-hero">
      {/* Corner Anchors - HUD Style */}
      <div className="corner-anchor corner-tl">+</div>
      <div className="corner-anchor corner-tr">+</div>
      <div className="corner-anchor corner-bl">+</div>
      <div className="corner-anchor corner-br">+</div>

      {/* Background Image */}
      <div className="hero-bg">
        <Image
          src={image}
          alt={name}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="hero-gradient" />
        <div className="hero-noise" />
        <div className="hero-scanlines" />
      </div>

      {/* Content Overlay */}
      <div className="hero-content">
        <div className="hero-inner">
          {/* Verified Badge */}
          <div className="hero-badge">
            <span className="badge-icon">✓</span>
            <span className="badge-text">{badge}</span>
          </div>

          {/* Name (H1) with Glitch */}
          <h1 className="hero-name">
            {nameParts.map((part, i) => (
              <span key={i} className="name-line" data-text={part}>
                {part}
              </span>
            ))}
          </h1>

          {/* Status Row - Data Density */}
          <div className="status-row">
            <span className="status-item">ID: 001</span>
            <span className="status-divider">//</span>
            <span className="status-item">CLEARANCE: ALPHA</span>
            <span className="status-divider">//</span>
            <span className="status-item status-active">STATUS: ACTIVE</span>
          </div>

          {/* Divider */}
          <div className="hero-divider" />

          {/* Tagline */}
          <p className="hero-tagline">{tagline}</p>

          {/* CTAs */}
          <div className="hero-actions">
            <Link href={primaryCta.href} className="cta-primary">
              <span className="cta-icon">→</span>
              {primaryCta.label}
            </Link>
            <Link href={secondaryCta.href} className="cta-secondary">
              {secondaryCta.label}
            </Link>
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
        .dossier-hero {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        /* Corner Anchors */
        .corner-anchor {
          position: absolute;
          z-index: 20;
          font-family: var(--pillar-font-mono, monospace);
          font-size: 16px;
          color: rgba(0, 246, 224, 0.4);
          user-select: none;
        }

        .corner-tl {
          top: 24px;
          left: 24px;
        }
        .corner-tr {
          top: 24px;
          right: 24px;
        }
        .corner-bl {
          bottom: 24px;
          left: 24px;
        }
        .corner-br {
          bottom: 24px;
          right: 24px;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
        }

        .hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.4) 0%,
            transparent 30%,
            transparent 50%,
            rgba(0, 0, 0, 0.85) 80%,
            rgba(0, 0, 0, 0.98) 100%
          );
        }

        /* Film Grain Noise */
        .hero-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
        }

        /* Scanlines */
        .hero-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          );
          pointer-events: none;
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 0 24px 120px;
        }

        .hero-inner {
          max-width: 800px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(0, 246, 224, 0.1);
          border: 1px solid rgba(0, 246, 224, 0.3);
          margin-bottom: 24px;
        }

        .badge-icon {
          color: #00f6e0;
          font-size: 14px;
        }

        .badge-text {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 2px;
          color: #00f6e0;
        }

        .hero-name {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: clamp(56px, 15vw, 96px);
          line-height: 0.9;
          letter-spacing: -0.01em;
          color: #fff;
          margin: 0;
          text-shadow: 0 0 80px rgba(0, 246, 224, 0.2);
        }

        .name-line {
          display: block;
          position: relative;
        }

        /* Glitch Effect on Hover */
        .hero-name:hover .name-line::before,
        .hero-name:hover .name-line::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }

        .hero-name:hover .name-line::before {
          color: #00f6e0;
          animation: glitch-1 0.3s linear infinite;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }

        .hero-name:hover .name-line::after {
          color: #ff0040;
          animation: glitch-2 0.3s linear infinite;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }

        @keyframes glitch-1 {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-2px);
          }
          40% {
            transform: translateX(2px);
          }
          60% {
            transform: translateX(-1px);
          }
          80% {
            transform: translateX(1px);
          }
        }

        @keyframes glitch-2 {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(2px);
          }
          40% {
            transform: translateX(-2px);
          }
          60% {
            transform: translateX(1px);
          }
          80% {
            transform: translateX(-1px);
          }
        }

        /* Status Row */
        .status-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 1px;
        }

        .status-item {
          color: #555;
        }

        .status-divider {
          color: #333;
        }

        .status-active {
          color: #00f6e0;
        }

        .hero-divider {
          width: 120px;
          height: 2px;
          background: linear-gradient(
            90deg,
            #00f6e0 0%,
            rgba(0, 246, 224, 0) 100%
          );
          margin: 24px 0;
        }

        .hero-tagline {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: clamp(15px, 2.5vw, 18px);
          line-height: 1.6;
          font-weight: 300;
          color: #888;
          max-width: 600px;
          margin: 0 0 32px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #00f6e0 0%, #00d4c4 100%);
          color: #000;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 0 40px rgba(0, 246, 224, 0.35);
          transition: all 0.3s ease;
        }

        .cta-primary:hover {
          box-shadow: 0 0 60px rgba(0, 246, 224, 0.5);
          transform: translateY(-2px);
        }

        .cta-icon {
          font-size: 16px;
        }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 16px 32px;
          background: transparent;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .cta-secondary:hover {
          background: rgba(0, 246, 224, 0.1);
          border-color: #00f6e0;
        }

        .scroll-hint {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          color: #444;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(8px);
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            padding: 0 16px 100px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .cta-primary,
          .cta-secondary {
            width: 100%;
            justify-content: center;
          }

          .status-row {
            flex-wrap: wrap;
            gap: 8px;
          }

          .corner-anchor {
            font-size: 12px;
          }

          .corner-tl,
          .corner-tr {
            top: 16px;
          }
          .corner-bl,
          .corner-br {
            bottom: 80px;
          }
          .corner-tl,
          .corner-bl {
            left: 16px;
          }
          .corner-tr,
          .corner-br {
            right: 16px;
          }
        }
      `}</style>
    </section>
  );
}
