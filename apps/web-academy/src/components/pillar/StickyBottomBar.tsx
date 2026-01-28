"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface StickyBottomBarProps {
  title: string;
  meta?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCTAClick?: () => void;
  showOnMobileOnly?: boolean;
  threshold?: number;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// Mobile sticky bottom bar for quick CTA access.
// Shows after scrolling past threshold.
// ═══════════════════════════════════════════════════════════

export function StickyBottomBar({
  title,
  meta = "Complete Guide",
  ctaLabel = "Start Training",
  ctaHref = "#train",
  onCTAClick,
  showOnMobileOnly = true,
  threshold = 400,
}: StickyBottomBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const handleClick = () => {
    if (onCTAClick) {
      onCTAClick();
    }
  };

  return (
    <div
      className={`sticky-bottom-bar ${isVisible ? "visible" : ""} ${showOnMobileOnly ? "mobile-only" : ""}`}
    >
      <div className="sticky-bottom-content">
        <div className="sticky-bottom-info">
          <span className="sticky-bottom-meta">{meta}</span>
          <span className="sticky-bottom-title">{title}</span>
        </div>
        {onCTAClick ? (
          <button
            type="button"
            className="pillar-btn pillar-btn-primary sticky-bottom-cta"
            onClick={handleClick}
          >
            {ctaLabel}
          </button>
        ) : (
          <Link href={ctaHref} className="pillar-btn pillar-btn-primary sticky-bottom-cta">
            {ctaLabel}
          </Link>
        )}
      </div>

      <style jsx>{`
        .sticky-bottom-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 90;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--pillar-border-subtle);
          padding: var(--pillar-space-3) var(--pillar-space-4);
          padding-bottom: max(var(--pillar-space-3), env(safe-area-inset-bottom));
          transform: translateY(100%);
          opacity: 0;
          transition:
            transform var(--pillar-duration-normal) var(--pillar-ease-out),
            opacity var(--pillar-duration-normal);
        }

        .sticky-bottom-bar.visible {
          transform: translateY(0);
          opacity: 1;
        }

        .sticky-bottom-bar.mobile-only {
          display: none;
        }

        @media (max-width: 768px) {
          .sticky-bottom-bar.mobile-only {
            display: block;
          }
        }

        .sticky-bottom-content {
          max-width: var(--pillar-max-width);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--pillar-space-4);
        }

        .sticky-bottom-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .sticky-bottom-meta {
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--pillar-text-muted);
        }

        .sticky-bottom-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--pillar-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sticky-bottom-cta {
          flex-shrink: 0;
          padding: var(--pillar-space-3) var(--pillar-space-5);
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}

export default StickyBottomBar;
