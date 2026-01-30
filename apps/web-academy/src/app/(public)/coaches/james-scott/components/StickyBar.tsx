"use client";

import { useEffect, useState } from "react";

interface StickyBarProps {
  name: string;
  cta: {
    label: string;
    href: string;
  };
}

export function StickyBar({ name, cta }: StickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (roughly 500px)
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`sticky-bar ${isVisible ? "is-visible" : ""}`}>
      <div className="sticky-container">
        <div className="sticky-left">
          <span className="sticky-indicator" />
          <span className="sticky-name">{name}</span>
          <span className="sticky-divider">//</span>
          <span className="sticky-status">Movement Specialist</span>
        </div>

        <a href={cta.href} className="sticky-cta">
          <span className="cta-text">{cta.label}</span>
          <span className="cta-icon">→</span>
        </a>
      </div>

      <style jsx>{`
        .sticky-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }

        .sticky-bar.is-visible {
          transform: translateY(0);
        }

        .sticky-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.95);
          border-top: 1px solid rgba(255, 215, 0, 0.2);
          backdrop-filter: blur(12px);
        }

        .sticky-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sticky-indicator {
          width: 8px;
          height: 8px;
          background: #ffd700;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }

        .sticky-name {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 18px;
          letter-spacing: 0.05em;
          color: #fff;
        }

        .sticky-divider {
          color: #333;
        }

        .sticky-status {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 10px;
          letter-spacing: 2px;
          color: #555;
          text-transform: uppercase;
        }

        .sticky-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
          color: #000;
          text-decoration: none;
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }

        .sticky-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
        }

        .cta-icon {
          transition: transform 0.3s ease;
        }

        .sticky-cta:hover .cta-icon {
          transform: translateX(3px);
        }

        @media (max-width: 768px) {
          .sticky-container {
            padding: 12px 16px;
          }

          .sticky-divider,
          .sticky-status {
            display: none;
          }

          .sticky-name {
            font-size: 16px;
          }

          .sticky-cta {
            padding: 10px 16px;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
