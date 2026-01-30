"use client";

import Link from "next/link";
import { RelatedDrill } from "@/data/drills/drill-v3-types";

export interface DrillRelatedCardsProps {
  relatedDrills: RelatedDrill[];
  sport: string;
  category: string;
}

interface RelatedCardProps {
  drill: RelatedDrill;
  sport: string;
  category: string;
}

function RelatedCard({ drill, sport, category }: RelatedCardProps) {
  const drillUrl = `/drills/${sport}/${category}/${drill.slug}`;

  const relationshipColors: Record<string, string> = {
    prerequisite: "var(--pillar-status-warning)",
    alternative: "var(--pillar-brand-purple)",
    progression: "var(--pillar-brand-cyan)",
    similar: "var(--pillar-text-muted)",
  };

  const color = relationshipColors[drill.relationship] || "var(--pillar-text-muted)";

  return (
    <Link href={drillUrl} className="related-card">
      <div className="card-thumbnail">
        {drill.thumbnail ? (
          <img src={drill.thumbnail} alt="" loading="lazy" />
        ) : (
          <div className="thumbnail-fallback">
            <span className="fallback-icon">🏀</span>
            <span className="fallback-text">DRILL</span>
          </div>
        )}
      </div>

      <div className="card-content">
        <span className="card-title">{drill.title}</span>
        <div className="card-meta">
          <span className="card-relationship-chip" style={{ borderColor: color, color }}>
            {drill.relationshipLabel}
          </span>
          {drill.duration && (
            <span className="card-duration">{drill.duration}</span>
          )}
        </div>
      </div>

      <div className="card-arrow">→</div>

      <style jsx>{`
        .related-card {
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

        .related-card:hover {
          border-color: var(--pillar-brand-cyan);
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .card-thumbnail {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--pillar-surface-raised);
        }

        .card-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          background: linear-gradient(135deg, var(--pillar-surface-raised) 0%, var(--pillar-surface-card) 100%);
        }

        .fallback-icon {
          font-size: 20px;
        }

        .fallback-text {
          font-family: var(--pillar-font-mono);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1px;
          color: var(--pillar-text-dim);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-2);
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

        .card-meta {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
        }

        .card-relationship-chip {
          display: inline-flex;
          padding: var(--pillar-space-1) var(--pillar-space-2);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid;
          border-radius: 4px;
          font-family: var(--pillar-font-mono);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .card-duration {
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          color: var(--pillar-text-muted);
        }

        .card-arrow {
          font-size: 20px;
          color: var(--pillar-text-dim);
          transition: all var(--pillar-duration-fast);
        }

        .related-card:hover .card-arrow {
          color: var(--pillar-brand-cyan);
          transform: translateX(4px);
        }

        @media (max-width: 480px) {
          .related-card {
            padding: var(--pillar-space-3);
          }

          .card-thumbnail {
            width: 56px;
            height: 56px;
          }

          .card-title {
            font-size: 14px;
          }
        }
      `}</style>
    </Link>
  );
}

const MAX_RELATED_DRILLS = 6;

export function DrillRelatedCards({ relatedDrills, sport, category }: DrillRelatedCardsProps) {
  if (relatedDrills.length === 0) {
    return null;
  }

  // Limit to 6 drills max
  const displayedDrills = relatedDrills.slice(0, MAX_RELATED_DRILLS);

  return (
    <section className="drill-related" data-layer="guide" aria-labelledby="related-heading">
      <h2 id="related-heading" className="section-title">Related Drills</h2>

      <div className="related-grid">
        {displayedDrills.map((drill) => (
          <RelatedCard
            key={drill.slug}
            drill={drill}
            sport={sport}
            category={category}
          />
        ))}
      </div>

      <style jsx>{`
        .drill-related {
          padding: var(--drill-section-gap, 48px) 0;
        }

        .section-title {
          font-family: var(--pillar-font-display);
          font-size: 28px;
          letter-spacing: 0.02em;
          color: var(--pillar-text-primary);
          margin: 0 0 var(--pillar-space-6) 0;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--pillar-space-4);
        }

        @media (max-width: 600px) {
          .related-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

export default DrillRelatedCards;
