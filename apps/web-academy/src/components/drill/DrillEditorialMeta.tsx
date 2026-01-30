"use client";

import { DrillAuthor } from "@/data/drills/drill-v3-types";

export interface DrillEditorialMetaProps {
  author: DrillAuthor;
  lastUpdated: string;
  reviewedBy?: string;
}

export function DrillEditorialMeta({
  author,
  lastUpdated,
  reviewedBy,
}: DrillEditorialMetaProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="drill-editorial-meta" data-layer="guide">
      <div className="meta-content">
        {/* Author */}
        <div className="author-section">
          <div className="author-avatar">
            {author.avatarUrl ? (
              <img src={author.avatarUrl} alt={author.name} loading="lazy" />
            ) : (
              <span className="avatar-icon">{author.icon}</span>
            )}
          </div>
          <div className="author-info">
            <span className="author-label">Written by</span>
            <span className="author-name" itemProp="author">
              {author.name}
            </span>
            <span className="author-title">{author.title}</span>
          </div>
        </div>

        {/* Meta Info */}
        <div className="meta-info">
          <div className="meta-item">
            <span className="meta-label">Last Updated</span>
            <time className="meta-value" dateTime={lastUpdated} itemProp="dateModified">
              {formatDate(lastUpdated)}
            </time>
          </div>

          {reviewedBy && (
            <div className="meta-item">
              <span className="meta-label">Reviewed by</span>
              <span className="meta-value">{reviewedBy}</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .drill-editorial-meta {
          padding: var(--pillar-space-6) 0;
          border-top: 1px solid var(--pillar-border-subtle);
          margin-top: var(--drill-section-gap, 48px);
        }

        .meta-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--pillar-space-6);
        }

        .author-section {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-4);
        }

        .author-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--pillar-surface-raised);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .author-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-icon {
          font-size: 28px;
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .author-label {
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--pillar-text-dim);
        }

        .author-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--pillar-text-primary);
        }

        .author-title {
          font-size: 13px;
          color: var(--pillar-text-muted);
        }

        .meta-info {
          display: flex;
          gap: var(--pillar-space-8);
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meta-label {
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--pillar-text-dim);
        }

        .meta-value {
          font-size: 14px;
          color: var(--pillar-text-secondary);
        }

        @media (max-width: 600px) {
          .meta-content {
            flex-direction: column;
            gap: var(--pillar-space-4);
          }

          .meta-info {
            flex-direction: column;
            gap: var(--pillar-space-4);
          }
        }
      `}</style>
    </section>
  );
}

export default DrillEditorialMeta;
