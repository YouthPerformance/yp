"use client";

import { useState, useEffect } from "react";
import { DrillActionRow } from "./DrillActionRow";

export interface DrillStickyBarProps {
  drillId: string;
  drillTitle: string;
  onStartTimer?: () => void;
  onAddToPlan?: () => void;
  onSave?: () => void;
  scrollThreshold?: number;
}

export function DrillStickyBar({
  drillId,
  drillTitle,
  onStartTimer,
  onAddToPlan,
  onSave,
  scrollThreshold = 400,
}: DrillStickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > scrollThreshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  return (
    <div
      className={`drill-sticky-bar ${isVisible ? "drill-sticky-bar--visible" : ""}`}
      data-layer="train"
      role="toolbar"
      aria-label="Drill actions"
    >
      <div className="sticky-bar-content">
        <div className="sticky-bar-title">
          <span className="title-text">{drillTitle}</span>
        </div>
        <DrillActionRow
          drillId={drillId}
          drillTitle={drillTitle}
          onStartTimer={onStartTimer}
          onAddToPlan={onAddToPlan}
          onSave={onSave}
          variant="compact"
        />
      </div>

      <style jsx>{`
        .drill-sticky-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: var(--drill-sticky-bar-height, 64px);
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid var(--pillar-border-subtle);
          transform: translateY(100%);
          transition: transform var(--drill-sticky-morph-duration, 300ms) var(--pillar-ease-out);
        }

        .drill-sticky-bar--visible {
          transform: translateY(0);
        }

        .sticky-bar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          max-width: var(--pillar-max-width, 1200px);
          margin: 0 auto;
          padding: 0 var(--pillar-content-padding, 24px);
        }

        .sticky-bar-title {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          flex: 1;
          min-width: 0;
        }

        .title-text {
          font-family: var(--pillar-font-display);
          font-size: 18px;
          color: var(--pillar-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 768px) {
          .drill-sticky-bar {
            height: var(--drill-sticky-bar-height-mobile, 56px);
          }

          .sticky-bar-content {
            padding: 0 var(--pillar-space-4);
          }

          .title-text {
            font-size: 16px;
            max-width: 140px;
          }
        }

        @media (max-width: 375px) {
          .sticky-bar-title {
            display: none;
          }

          .sticky-bar-content {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default DrillStickyBar;
