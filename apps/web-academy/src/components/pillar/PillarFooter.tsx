"use client";

import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface RelatedPillar {
  slug: string;
  title: string;
  description?: string;
  volume?: number;
}

export interface Author {
  name: string;
  title: string;
  slug: string; // Coach page slug for backlink
  image?: string;
}

export interface PillarFooterProps {
  relatedPillars?: RelatedPillar[];
  author?: Author;
  showAIDisclosure?: boolean;
  showMachineAccess?: boolean;
  pageSlug?: string;
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// Footer section with related pillars and AI disclosure.
// ═══════════════════════════════════════════════════════════

export function PillarFooter({
  relatedPillars = [],
  author,
  showAIDisclosure = true,
  showMachineAccess = true,
  pageSlug = "",
  className = "",
}: PillarFooterProps) {
  return (
    <footer className={`pillar-footer ${className}`}>
      <div className="pillar-container">
        {/* Author Attribution - Links to coach page for entity backlink */}
        {author && (
          <section className="author-section">
            <Link href={`/coaches/${author.slug}`} className="author-card">
              {author.image && (
                <div className="author-image">
                  <img src={author.image} alt={author.name} />
                </div>
              )}
              <div className="author-info">
                <span className="author-label">Written by</span>
                <span className="author-name">{author.name}</span>
                <span className="author-title">{author.title}</span>
              </div>
              <span className="author-arrow">→</span>
            </Link>
          </section>
        )}

        {/* Related Pillars */}
        {relatedPillars.length > 0 && (
          <section className="related-section">
            <h2 className="related-title">Related Guides</h2>
            <div className="related-grid">
              {relatedPillars.map((pillar) => (
                <Link key={pillar.slug} href={pillar.slug} className="related-card">
                  <h3 className="related-card-title">{pillar.title}</h3>
                  {pillar.description && (
                    <p className="related-card-desc">{pillar.description}</p>
                  )}
                  {pillar.volume && (
                    <span className="related-card-volume">
                      {pillar.volume.toLocaleString()} monthly searches
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* AI Disclosure */}
        {showAIDisclosure && (
          <div className="ai-disclosure">
            <div className="ai-disclosure-icon">\uD83E\uDD16</div>
            <div className="ai-disclosure-content">
              <p className="ai-disclosure-title">AI Transparency Note</p>
              <p className="ai-disclosure-text">
                This guide was researched and written by our coaching team with assistance
                from AI tools for organization and formatting. All training recommendations
                are reviewed and approved by certified coaches.{" "}
                <Link href="/about/methodology">Learn about our methodology</Link>
              </p>
            </div>
          </div>
        )}

        {/* For Machines - Collapsible */}
        {showMachineAccess && (
          <details className="machine-access-disclosure">
            <summary className="machine-access-summary">
              <span className="machine-access-icon">\uD83E\uDD16</span>
              <span>For Machines</span>
              <span className="machine-access-toggle">+</span>
            </summary>
            <div className="machine-access-content">
              <p className="machine-access-desc">
                This page is optimized for AI agents and crawlers. Access structured data:
              </p>
              <div className="machine-access-links">
                <a href="/llms.txt" className="machine-link">
                  <code>/llms.txt</code>
                  <span>Site context for LLMs</span>
                </a>
                <a href={`${pageSlug}.md`} className="machine-link">
                  <code>{pageSlug || "/page"}.md</code>
                  <span>Markdown version</span>
                </a>
                <a href={`/api/pillars${pageSlug}`} className="machine-link">
                  <code>/api/pillars{pageSlug}</code>
                  <span>JSON API</span>
                </a>
              </div>
              <div className="machine-access-selectors">
                <span className="selector-label">Extract targets:</span>
                <code>#guide</code>
                <code>.pillar-definition-block</code>
                <code>.faq-section</code>
              </div>
            </div>
          </details>
        )}

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-meta">
            <span className="footer-copyright">
              &copy; {new Date().getFullYear()} YouthPerformance
            </span>
            <span className="footer-sep">·</span>
            <Link href="/legal/privacy">Privacy</Link>
            <span className="footer-sep">·</span>
            <Link href="/legal/terms">Terms</Link>
          </div>
          <div className="footer-agent-hint">
            <span className="agent-hint-label">Agent Access:</span>
            <code className="agent-hint-code">#guide</code>
            <code className="agent-hint-code">.definition-block</code>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pillar-footer {
          margin-top: var(--pillar-space-16);
          padding: var(--pillar-space-12) 0 var(--pillar-space-8);
          border-top: 1px solid var(--pillar-border-subtle);
          background: var(--pillar-surface-card);
        }

        /* Author Attribution */
        .author-section {
          margin-bottom: var(--pillar-space-10);
        }

        .author-card {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-4);
          padding: var(--pillar-space-5);
          background: var(--pillar-surface-raised);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 12px;
          text-decoration: none;
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
        }

        .author-card:hover {
          border-color: var(--pillar-brand-cyan);
          transform: translateY(-2px);
        }

        .author-image {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid var(--pillar-brand-cyan-dim);
        }

        .author-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-grow: 1;
        }

        .author-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--pillar-text-dim);
        }

        .author-name {
          font-family: var(--pillar-font-display);
          font-size: 18px;
          color: var(--pillar-text-primary);
        }

        .author-title {
          font-size: 13px;
          color: var(--pillar-text-muted);
        }

        .author-arrow {
          font-size: 20px;
          color: var(--pillar-brand-cyan);
          opacity: 0;
          transition: opacity var(--pillar-duration-fast);
        }

        .author-card:hover .author-arrow {
          opacity: 1;
        }

        .related-section {
          margin-bottom: var(--pillar-space-10);
        }

        .related-title {
          font-family: var(--pillar-font-display);
          font-size: 24px;
          color: var(--pillar-text-primary);
          margin-bottom: var(--pillar-space-5);
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--pillar-space-4);
        }

        .related-card {
          padding: var(--pillar-space-5);
          background: var(--pillar-surface-raised);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 12px;
          text-decoration: none;
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
        }

        .related-card:hover {
          border-color: var(--pillar-brand-cyan);
          transform: translateY(-2px);
        }

        .related-card-title {
          font-family: var(--pillar-font-display);
          font-size: 18px;
          color: var(--pillar-text-primary);
          margin-bottom: var(--pillar-space-2);
        }

        .related-card-desc {
          font-size: 14px;
          line-height: 1.5;
          color: var(--pillar-text-muted);
          margin-bottom: var(--pillar-space-3);
        }

        .related-card-volume {
          display: inline-block;
          padding: var(--pillar-space-1) var(--pillar-space-2);
          background: var(--pillar-brand-cyan-dim);
          border-radius: 4px;
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          color: var(--pillar-brand-cyan);
        }

        /* AI Disclosure */
        .ai-disclosure {
          display: flex;
          gap: var(--pillar-space-4);
          padding: var(--pillar-space-5);
          background: var(--pillar-surface-raised);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 12px;
          margin-bottom: var(--pillar-space-8);
        }

        .ai-disclosure-icon {
          flex-shrink: 0;
          font-size: 24px;
        }

        .ai-disclosure-content {
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-2);
        }

        .ai-disclosure-title {
          font-family: var(--pillar-font-mono);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--pillar-text-muted);
          margin: 0;
        }

        .ai-disclosure-text {
          font-size: 13px;
          line-height: 1.6;
          color: var(--pillar-text-secondary);
          margin: 0;
        }

        .ai-disclosure-text :global(a) {
          color: var(--pillar-brand-cyan);
        }

        /* Machine Access Disclosure */
        .machine-access-disclosure {
          margin-bottom: var(--pillar-space-6);
          background: var(--pillar-surface-raised);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 10px;
          overflow: hidden;
        }

        .machine-access-summary {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-3);
          padding: var(--pillar-space-4);
          cursor: pointer;
          user-select: none;
          list-style: none;
          font-size: 14px;
          color: var(--pillar-text-muted);
        }

        .machine-access-summary::-webkit-details-marker {
          display: none;
        }

        .machine-access-icon {
          font-size: 18px;
        }

        .machine-access-toggle {
          margin-left: auto;
          font-family: var(--pillar-font-mono);
          font-size: 18px;
          color: var(--pillar-text-dim);
          transition: transform var(--pillar-duration-fast);
        }

        .machine-access-disclosure[open] .machine-access-toggle {
          transform: rotate(45deg);
        }

        .machine-access-content {
          padding: 0 var(--pillar-space-4) var(--pillar-space-4);
          border-top: 1px solid var(--pillar-border-subtle);
        }

        .machine-access-desc {
          font-size: 13px;
          color: var(--pillar-text-muted);
          margin: var(--pillar-space-3) 0;
        }

        .machine-access-links {
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-2);
          margin-bottom: var(--pillar-space-4);
        }

        .machine-link {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-3);
          padding: var(--pillar-space-2) var(--pillar-space-3);
          background: var(--pillar-surface-elevated);
          border-radius: 6px;
          text-decoration: none;
          font-size: 12px;
          transition: background var(--pillar-duration-fast);
        }

        .machine-link:hover {
          background: var(--pillar-brand-cyan-dim);
        }

        .machine-link code {
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          color: var(--pillar-brand-cyan);
          background: transparent;
        }

        .machine-link span {
          color: var(--pillar-text-muted);
        }

        .machine-access-selectors {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          flex-wrap: wrap;
        }

        .selector-label {
          font-size: 11px;
          color: var(--pillar-text-dim);
        }

        .machine-access-selectors code {
          padding: 2px 6px;
          background: var(--pillar-surface-elevated);
          border-radius: 4px;
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          color: var(--pillar-text-muted);
        }

        /* Footer Bottom */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--pillar-space-4);
          padding-top: var(--pillar-space-6);
          border-top: 1px solid var(--pillar-border-subtle);
        }

        .footer-meta {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          font-size: 13px;
          color: var(--pillar-text-muted);
        }

        .footer-meta :global(a) {
          color: var(--pillar-text-secondary);
        }

        .footer-meta :global(a):hover {
          color: var(--pillar-brand-cyan);
        }

        .footer-sep {
          color: var(--pillar-text-dim);
        }

        .footer-agent-hint {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          font-size: 11px;
        }

        .agent-hint-label {
          color: var(--pillar-text-dim);
        }

        .agent-hint-code {
          padding: 2px 6px;
          background: var(--pillar-surface-elevated);
          border-radius: 4px;
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          color: var(--pillar-text-muted);
        }

        @media (max-width: 600px) {
          .ai-disclosure {
            flex-direction: column;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}

export default PillarFooter;
