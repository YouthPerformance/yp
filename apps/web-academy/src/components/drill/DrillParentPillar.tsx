"use client";

import Link from "next/link";
import { PillarLink } from "@/data/drills/drill-v3-types";

export interface DrillParentPillarProps {
  pillar: PillarLink;
}

export function DrillParentPillar({ pillar }: DrillParentPillarProps) {
  const pillarUrl = `/${pillar.sport}/${pillar.slug}`;

  return (
    <section className="drill-parent-pillar" data-layer="guide">
      <Link href={pillarUrl} className="pillar-card">
        <div className="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17,21 17,13 7,13 7,21" />
            <polyline points="7,3 7,8 15,8" />
          </svg>
        </div>

        <div className="card-content">
          <span className="card-label">Part of</span>
          <span className="card-title">{pillar.title}</span>
          {pillar.description && (
            <p className="card-description">{pillar.description}</p>
          )}
        </div>

        <div className="card-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </div>
      </Link>

      <style jsx>{`
        .drill-parent-pillar {
          padding: var(--drill-section-gap, 48px) 0;
        }

        .pillar-card {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-5);
          padding: var(--pillar-space-6);
          background: linear-gradient(
            135deg,
            rgba(124, 22, 255, 0.08) 0%,
            rgba(0, 246, 224, 0.05) 100%
          );
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 16px;
          text-decoration: none;
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
        }

        .pillar-card:hover {
          border-color: var(--pillar-brand-purple);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(124, 22, 255, 0.15);
        }

        .card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: var(--pillar-brand-purple-dim);
          border-radius: 12px;
          color: var(--pillar-brand-purple);
          flex-shrink: 0;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-1);
          flex: 1;
          min-width: 0;
        }

        .card-label {
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--pillar-brand-purple);
        }

        .card-title {
          font-family: var(--pillar-font-display);
          font-size: 24px;
          letter-spacing: 0.02em;
          color: var(--pillar-text-primary);
        }

        .card-description {
          font-size: 14px;
          line-height: 1.5;
          color: var(--pillar-text-secondary);
          margin: var(--pillar-space-1) 0 0 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-arrow {
          color: var(--pillar-text-dim);
          transition: all var(--pillar-duration-fast);
        }

        .pillar-card:hover .card-arrow {
          color: var(--pillar-brand-purple);
          transform: translateX(4px);
        }

        @media (max-width: 600px) {
          .pillar-card {
            flex-direction: column;
            text-align: center;
            padding: var(--pillar-space-5);
          }

          .card-arrow {
            display: none;
          }

          .card-title {
            font-size: 20px;
          }
        }
      `}</style>
    </section>
  );
}

export default DrillParentPillar;
