"use client";

import Link from "next/link";
import { DrillLink } from "@/data/drills/drill-v3-types";

export interface DrillProgressionsProps {
  currentTitle: string;
  previousDrill?: DrillLink;
  nextDrill?: DrillLink;
  sport: string;
  category: string;
}

interface ProgressionCardProps {
  drill: DrillLink;
  direction: "previous" | "next";
  sport: string;
  category: string;
}

function ProgressionCard({ drill, direction, sport, category }: ProgressionCardProps) {
  const drillUrl = `/drills/${sport}/${category}/${drill.slug}`;
  const isPrevious = direction === "previous";

  return (
    <Link href={drillUrl} className={`progression-card progression-card--${direction}`}>
      <div className="card-direction">
        <span className="direction-arrow">{isPrevious ? "←" : "→"}</span>
        <span className="direction-label">{isPrevious ? "Previous" : "Next"}</span>
      </div>

      {drill.thumbnail && (
        <div className="card-thumbnail">
          <img src={drill.thumbnail} alt="" loading="lazy" />
        </div>
      )}

      <div className="card-content">
        <span className="card-title">{drill.title}</span>
        <span className="card-hint">{isPrevious ? "Master this first" : "Continue your progress"}</span>
      </div>

      <style jsx>{`
        .progression-card {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-4);
          padding: var(--pillar-space-4);
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 12px;
          text-decoration: none;
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
        }

        .progression-card:hover {
          border-color: var(--pillar-brand-cyan);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .progression-card--previous {
          flex-direction: row;
        }

        .progression-card--next {
          flex-direction: row-reverse;
          text-align: right;
        }

        .card-direction {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--pillar-space-1);
          min-width: 48px;
        }

        .direction-arrow {
          font-size: 24px;
          color: var(--pillar-brand-cyan);
        }

        .direction-label {
          font-family: var(--pillar-font-mono);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--pillar-text-dim);
        }

        .card-thumbnail {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .card-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-1);
          flex: 1;
          min-width: 0;
        }

        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--pillar-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-hint {
          font-size: 12px;
          color: var(--pillar-text-muted);
        }

        @media (max-width: 480px) {
          .progression-card {
            padding: var(--pillar-space-3);
          }

          .card-thumbnail {
            width: 48px;
            height: 48px;
          }

          .card-title {
            font-size: 14px;
          }
        }
      `}</style>
    </Link>
  );
}

export function DrillProgressions({
  currentTitle,
  previousDrill,
  nextDrill,
  sport,
  category,
}: DrillProgressionsProps) {
  // Don't render if no progressions exist
  if (!previousDrill && !nextDrill) {
    return null;
  }

  return (
    <section id="progression" className="drill-progressions" data-layer="guide" aria-labelledby="progressions-heading">
      <h2 id="progressions-heading" className="section-title">Drill Progression</h2>

      <div className="progressions-grid">
        {previousDrill ? (
          <ProgressionCard
            drill={previousDrill}
            direction="previous"
            sport={sport}
            category={category}
          />
        ) : (
          <div className="progression-placeholder">
            <span className="placeholder-text">This is the starting drill</span>
          </div>
        )}

        <div className="current-drill">
          <span className="current-badge">CURRENT</span>
          <span className="current-title">{currentTitle}</span>
        </div>

        {nextDrill ? (
          <ProgressionCard
            drill={nextDrill}
            direction="next"
            sport={sport}
            category={category}
          />
        ) : (
          <div className="progression-placeholder">
            <span className="placeholder-text">Advanced drill coming soon</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .drill-progressions {
          padding: var(--drill-section-gap, 48px) 0;
        }

        .section-title {
          font-family: var(--pillar-font-display);
          font-size: 28px;
          letter-spacing: 0.02em;
          color: var(--pillar-text-primary);
          margin: 0 0 var(--pillar-space-6) 0;
        }

        .progressions-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: var(--pillar-space-4);
          align-items: center;
        }

        .current-drill {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--pillar-space-3);
          padding: var(--pillar-space-5);
          background: var(--pillar-surface-card);
          border: 2px solid var(--pillar-brand-cyan);
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0, 246, 224, 0.2), 0 0 40px rgba(0, 246, 224, 0.1);
        }

        .current-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: var(--pillar-space-1) var(--pillar-space-3);
          background: var(--pillar-brand-cyan);
          border-radius: 100px;
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--pillar-surface-base);
        }

        .current-title {
          font-family: var(--pillar-font-display);
          font-size: 20px;
          color: var(--pillar-text-primary);
          text-align: center;
        }

        .progression-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--pillar-space-5);
          background: var(--pillar-surface-card);
          border: 1px dashed var(--pillar-border-subtle);
          border-radius: 12px;
          min-height: 80px;
        }

        .placeholder-text {
          font-size: 13px;
          color: var(--pillar-text-dim);
          text-align: center;
        }

        @media (max-width: 768px) {
          .progressions-grid {
            grid-template-columns: 1fr;
            gap: var(--pillar-space-3);
          }

          .current-drill {
            order: -1;
            padding: var(--pillar-space-4);
          }
        }
      `}</style>
    </section>
  );
}

export default DrillProgressions;
