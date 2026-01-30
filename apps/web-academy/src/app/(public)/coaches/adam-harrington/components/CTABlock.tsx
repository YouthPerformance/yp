"use client";

import Link from "next/link";

interface CTABlockProps {
  headline: string;
  subtext: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function CTABlock({
  headline,
  subtext,
  primaryCta,
  secondaryCta,
}: CTABlockProps) {
  return (
    <section className="cta-block">
      <div className="cta-container">
        <h2 className="cta-headline">{headline}</h2>
        <p className="cta-subtext">{subtext}</p>

        <div className="cta-actions">
          <Link href={primaryCta.href} className="cta-primary">
            <span className="cta-arrow">→</span>
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link href={secondaryCta.href} className="cta-secondary">
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .cta-block {
          padding: 100px 24px;
          background: linear-gradient(
            180deg,
            rgba(0, 246, 224, 0.03) 0%,
            rgba(0, 246, 224, 0.08) 50%,
            rgba(0, 246, 224, 0.03) 100%
          );
          border-top: 1px solid rgba(0, 246, 224, 0.1);
          border-bottom: 1px solid rgba(0, 246, 224, 0.1);
        }

        .cta-container {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-headline {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: clamp(36px, 8vw, 56px);
          color: #fff;
          margin: 0 0 16px;
          letter-spacing: 0.02em;
        }

        .cta-subtext {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 18px;
          line-height: 1.6;
          color: #a0a0a0;
          margin: 0 0 40px;
        }

        .cta-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 40px;
          background: linear-gradient(135deg, #00f6e0 0%, #00d4c4 100%);
          color: #000;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          border-radius: 8px;
          box-shadow: 0 0 50px rgba(0, 246, 224, 0.4);
          transition: all 0.3s ease;
        }

        .cta-primary:hover {
          box-shadow: 0 0 70px rgba(0, 246, 224, 0.6);
          transform: translateY(-2px);
        }

        .cta-arrow {
          font-size: 18px;
          transition: transform 0.3s ease;
        }

        .cta-primary:hover .cta-arrow {
          transform: translateX(4px);
        }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 18px 40px;
          background: transparent;
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .cta-block {
            padding: 64px 16px;
          }

          .cta-actions {
            flex-direction: column;
          }

          .cta-primary,
          .cta-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
