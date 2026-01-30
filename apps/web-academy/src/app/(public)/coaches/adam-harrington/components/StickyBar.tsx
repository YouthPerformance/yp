"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StickyBarProps {
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function StickyBar({ primaryCta, secondaryCta }: StickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past the hero (100vh)
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.8;
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`sticky-bar ${isVisible ? "sticky-bar--visible" : ""}`}>
      <div className="sticky-inner">
        <Link href={primaryCta.href} className="sticky-cta-primary">
          <span className="cta-arrow">→</span>
          {primaryCta.label}
        </Link>
        {secondaryCta && (
          <Link href={secondaryCta.href} className="sticky-cta-secondary">
            {secondaryCta.label}
          </Link>
        )}
      </div>

      <style jsx>{`
        .sticky-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          transform: translateY(100%);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .sticky-bar--visible {
          transform: translateY(0);
          opacity: 1;
        }

        .sticky-inner {
          display: flex;
          gap: 12px;
          max-width: 500px;
          margin: 0 auto;
        }

        .sticky-cta-primary {
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          background: #00f6e0;
          color: #000;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0, 246, 224, 0.3);
        }

        .cta-arrow {
          font-size: 14px;
        }

        .sticky-cta-secondary {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 16px;
          background: transparent;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
        }

        /* Hide on desktop */
        @media (min-width: 769px) {
          .sticky-bar {
            display: none;
          }
        }

        /* Safe area for iOS */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .sticky-bar {
            padding-bottom: calc(12px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
}
