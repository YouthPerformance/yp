"use client";

import Link from "next/link";
import { DrillMistakeV3 } from "@/data/drills/drill-v3-types";

export interface DrillMistakesCardsProps {
  mistakes: DrillMistakeV3[];
  sport: string;
  category: string;
}

interface MistakeCardProps {
  mistake: DrillMistakeV3;
  sport: string;
  category: string;
}

function MistakeCard({ mistake, sport, category }: MistakeCardProps) {
  const drillUrl = mistake.relatedDrillSlug
    ? `/drills/${sport}/${category}/${mistake.relatedDrillSlug}`
    : null;

  return (
    <div className="mistake-card">
      {/* IF Statement */}
      <div className="mistake-section mistake-section--if">
        <span className="section-label">If</span>
        <p className="section-text">{mistake.ifStatement}</p>
      </div>

      {/* CAUSE */}
      <div className="mistake-section mistake-section--cause">
        <span className="section-label">Cause</span>
        <p className="section-text">{mistake.cause}</p>
      </div>

      {/* FIX */}
      <div className="mistake-section mistake-section--fix">
        <span className="section-label">Fix</span>
        <p className="section-text">{mistake.fix}</p>

        {drillUrl && mistake.relatedDrillTitle && (
          <Link href={drillUrl} className="related-drill-link">
            <span className="link-icon">→</span>
            <span className="link-text">Try: {mistake.relatedDrillTitle}</span>
          </Link>
        )}
      </div>

      <style jsx>{`
        .mistake-card {
          background: var(--pillar-surface-card);
          border: 1px solid rgba(255, 176, 32, 0.25);
          border-radius: 12px;
          overflow: hidden;
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
          box-shadow: 0 0 12px rgba(255, 176, 32, 0.05);
        }

        .mistake-card:hover {
          border-color: rgba(255, 176, 32, 0.5);
          box-shadow: 0 0 20px rgba(255, 176, 32, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .mistake-section {
          padding: var(--pillar-space-4) var(--pillar-space-5);
          border-left: 3px solid transparent;
        }

        .mistake-section--if {
          border-left-color: var(--drill-mistake-if);
          background: rgba(255, 176, 32, 0.05);
        }

        .mistake-section--cause {
          border-left-color: var(--pillar-text-dim);
          background: transparent;
        }

        .mistake-section--fix {
          border-left-color: var(--drill-mistake-fix);
          background: rgba(0, 246, 224, 0.03);
        }

        .section-label {
          display: block;
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: var(--pillar-space-1);
        }

        .mistake-section--if .section-label {
          color: var(--drill-mistake-if);
        }

        .mistake-section--cause .section-label {
          color: var(--pillar-text-dim);
        }

        .mistake-section--fix .section-label {
          color: var(--drill-mistake-fix);
        }

        .section-text {
          font-size: 14px;
          line-height: 1.6;
          color: var(--pillar-text-primary);
          margin: 0;
        }

        .related-drill-link {
          display: inline-flex;
          align-items: center;
          gap: var(--pillar-space-2);
          margin-top: var(--pillar-space-3);
          padding: var(--pillar-space-2) var(--pillar-space-3);
          background: var(--pillar-brand-cyan-dim);
          border-radius: 6px;
          font-size: 13px;
          color: var(--pillar-brand-cyan);
          text-decoration: none;
          transition: all var(--pillar-duration-fast);
        }

        .related-drill-link:hover {
          background: rgba(0, 246, 224, 0.2);
        }

        .link-icon {
          font-size: 12px;
        }

        .link-text {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

export function DrillMistakesCards({ mistakes, sport, category }: DrillMistakesCardsProps) {
  return (
    <section id="mistakes" className="drill-mistakes" data-layer="guide" aria-labelledby="mistakes-heading">
      <h2 id="mistakes-heading" className="section-title">Common Mistakes</h2>
      <div className="mistakes-grid">
        {mistakes.map((mistake) => (
          <MistakeCard
            key={mistake.id}
            mistake={mistake}
            sport={sport}
            category={category}
          />
        ))}
      </div>

      <style jsx>{`
        .drill-mistakes {
          padding: var(--drill-section-gap, 48px) 0;
        }

        .section-title {
          font-family: var(--pillar-font-display);
          font-size: 28px;
          letter-spacing: 0.02em;
          color: var(--pillar-text-primary);
          margin: 0 0 var(--pillar-space-6) 0;
        }

        .mistakes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--pillar-space-4);
        }

        @media (max-width: 480px) {
          .mistakes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

export default DrillMistakesCards;
