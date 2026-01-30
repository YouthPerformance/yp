"use client";

interface HeroProps {
  badge: string;
  name: string;
  title: string;
  tagline: string;
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const SPECIALTIES = [
  "Barefoot Training",
  "Injury Prevention",
  "Foot & Ankle Strength",
  "Rehab / Return-to-Play",
];

export function Hero({
  badge,
  name,
  title,
  tagline,
  image,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className="hero">
      {/* Background Image */}
      <div className="hero-bg">
        <img src={image} alt={name} className="hero-image" />
        {/* Lighter overlay for "Lab" aesthetic - clinical precision */}
        <div className="color-grade" />
        <div className="vignette" />
        <div className="bottom-fade" />
      </div>

      <div className="hero-container">
        {/* Badge */}
        <div className="badge-row">
          <span className="badge">
            <span className="badge-icon">✓</span>
            {badge}
          </span>
        </div>

        {/* Name */}
        <h1 className="hero-name">{name}</h1>

        {/* Title */}
        <p className="hero-title">{title}</p>

        {/* Entity Definition (Perplexity-critical) */}
        <p className="entity-definition">
          James Scott is a sports performance coach specializing in{" "}
          <strong>barefoot training</strong>, <strong>foot & ankle strength</strong>,
          and <strong>injury prevention</strong> for youth and professional athletes.
        </p>

        {/* Specialties Chips */}
        <div className="specialties-row">
          {SPECIALTIES.map((specialty) => (
            <span key={specialty} className="specialty-chip">
              {specialty}
            </span>
          ))}
        </div>

        {/* CTAs - Aligned to search intent */}
        <div className="cta-row">
          <a href={primaryCta.href} className="cta-primary">
            <span className="cta-arrow">→</span>
            {primaryCta.label}
          </a>
          <a href="/injury-prevention" className="cta-secondary">
            Injury Prevention
          </a>
          <a href={secondaryCta.href} className="cta-tertiary">
            {secondaryCta.label}
          </a>
        </div>
      </div>

      <style jsx>{`
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0 24px 60px;
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          filter: contrast(1.1) saturate(0.85) brightness(1.05);
        }

        /* Clinical/Lab color grade - less dark, more precision */
        .color-grade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 30, 40, 0.2) 0%,
            rgba(10, 10, 10, 0.15) 100%
          );
          mix-blend-mode: multiply;
        }

        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 90% 70% at 50% 35%,
            transparent 0%,
            rgba(0, 0, 0, 0.3) 60%,
            rgba(0, 0, 0, 0.7) 100%
          );
        }

        .bottom-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.6) 20%,
            transparent 45%
          );
        }

        .hero-container {
          position: relative;
          z-index: 2;
          max-width: 900px;
          text-align: center;
          padding-bottom: 20px;
        }

        .badge-row {
          margin-bottom: 20px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 215, 0, 0.4);
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 2px;
          color: #ffd700;
          backdrop-filter: blur(8px);
        }

        .badge-icon {
          font-size: 12px;
        }

        .hero-name {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: clamp(64px, 16vw, 140px);
          font-weight: 700;
          letter-spacing: 0.02em;
          line-height: 0.85;
          color: #fff;
          margin: 0 0 12px 0;
          text-shadow: 0 4px 40px rgba(0, 0, 0, 0.6);
        }

        .hero-title {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          letter-spacing: 4px;
          color: #ffd700;
          text-transform: uppercase;
          margin: 0 0 20px 0;
          opacity: 0.9;
        }

        /* Entity Definition - Critical for Perplexity/Google */
        .entity-definition {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          max-width: 600px;
          margin: 0 auto 24px;
        }

        .entity-definition strong {
          color: #ffd700;
          font-weight: 500;
        }

        /* Specialties Chips */
        .specialties-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
        }

        .specialty-chip {
          padding: 6px 14px;
          background: rgba(255, 215, 0, 0.08);
          border: 1px solid rgba(255, 215, 0, 0.25);
          font-family: var(--pillar-font-mono, monospace);
          font-size: 10px;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
        }

        .cta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #ffd700 0%, #e5a800 100%);
          color: #000;
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .cta-primary:hover {
          background: linear-gradient(135deg, #fff 0%, #ffd700 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255, 215, 0, 0.35);
        }

        .cta-arrow {
          font-size: 14px;
          transition: transform 0.3s ease;
        }

        .cta-primary:hover .cta-arrow {
          transform: translateX(4px);
        }

        .cta-secondary {
          padding: 14px 24px;
          background: rgba(0, 246, 224, 0.08);
          border: 1px solid rgba(0, 246, 224, 0.3);
          color: #00f6e0;
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 2px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .cta-secondary:hover {
          background: rgba(0, 246, 224, 0.15);
          border-color: rgba(0, 246, 224, 0.5);
        }

        .cta-tertiary {
          padding: 14px 24px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.6);
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 2px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .cta-tertiary:hover {
          border-color: rgba(255, 255, 255, 0.3);
          color: #fff;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 0 16px 40px;
          }

          .hero-image {
            object-position: center 25%;
          }

          .hero-name {
            font-size: clamp(48px, 14vw, 90px);
          }

          .entity-definition {
            font-size: 14px;
          }

          .specialties-row {
            gap: 6px;
          }

          .specialty-chip {
            font-size: 9px;
            padding: 5px 10px;
          }

          .cta-row {
            flex-direction: column;
            gap: 10px;
          }

          .cta-primary,
          .cta-secondary,
          .cta-tertiary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
