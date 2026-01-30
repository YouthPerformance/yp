"use client";

import { useState } from "react";

export interface DrillAIDevLinksProps {
  apiEndpoint?: string;
  markdownUrl?: string;
  drillSlug: string;
}

export function DrillAIDevLinks({
  apiEndpoint,
  markdownUrl,
  drillSlug,
}: DrillAIDevLinksProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if no links provided
  if (!apiEndpoint && !markdownUrl) {
    return null;
  }

  return (
    <details
      className="drill-ai-dev-links"
      data-layer="guide"
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="links-toggle">
        <span className="toggle-icon">{isOpen ? "−" : "+"}</span>
        <span className="toggle-text">AI & Developer Resources</span>
        <span className="toggle-badge">API</span>
      </summary>

      <div className="links-content">
        <p className="links-description">
          Access this drill programmatically for integrations, AI assistants, or custom applications.
        </p>

        <div className="links-grid">
          {apiEndpoint && (
            <div className="link-item">
              <span className="link-label">JSON API</span>
              <code className="link-code">{apiEndpoint}</code>
              <button
                className="link-copy"
                onClick={() => navigator.clipboard.writeText(apiEndpoint)}
                aria-label="Copy API endpoint"
              >
                Copy
              </button>
            </div>
          )}

          {markdownUrl && (
            <div className="link-item">
              <span className="link-label">Markdown</span>
              <code className="link-code">{markdownUrl}</code>
              <button
                className="link-copy"
                onClick={() => navigator.clipboard.writeText(markdownUrl)}
                aria-label="Copy Markdown URL"
              >
                Copy
              </button>
            </div>
          )}
        </div>

        <p className="links-note">
          These resources are optimized for LLM consumption with structured content and semantic markup.
        </p>
      </div>

      <style jsx>{`
        .drill-ai-dev-links {
          margin-top: var(--pillar-space-6);
        }

        .links-toggle {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          padding: var(--pillar-space-3) var(--pillar-space-4);
          background: var(--pillar-surface-card);
          border: 1px dashed var(--pillar-border-subtle);
          border-radius: 8px;
          cursor: pointer;
          list-style: none;
          transition: all var(--pillar-duration-fast);
        }

        .links-toggle::-webkit-details-marker {
          display: none;
        }

        .links-toggle:hover {
          border-color: var(--pillar-brand-cyan);
        }

        .toggle-icon {
          font-size: 14px;
          font-weight: bold;
          color: var(--pillar-text-dim);
          width: 16px;
        }

        .toggle-text {
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--pillar-text-muted);
          flex: 1;
        }

        .toggle-badge {
          padding: 2px 8px;
          background: var(--pillar-brand-purple-dim);
          border-radius: 4px;
          font-family: var(--pillar-font-mono);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--pillar-brand-purple);
        }

        .drill-ai-dev-links[open] .links-toggle {
          border-style: solid;
          border-color: var(--pillar-brand-cyan);
          border-radius: 8px 8px 0 0;
        }

        .drill-ai-dev-links[open] .toggle-icon {
          color: var(--pillar-brand-cyan);
        }

        .links-content {
          padding: var(--pillar-space-5);
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-brand-cyan);
          border-top: none;
          border-radius: 0 0 8px 8px;
        }

        .links-description {
          font-size: 14px;
          color: var(--pillar-text-secondary);
          margin: 0 0 var(--pillar-space-4) 0;
        }

        .links-grid {
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-3);
        }

        .link-item {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-3);
          padding: var(--pillar-space-3);
          background: var(--pillar-surface-raised);
          border-radius: 6px;
        }

        .link-label {
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--pillar-text-muted);
          width: 80px;
          flex-shrink: 0;
        }

        .link-code {
          flex: 1;
          font-family: var(--pillar-font-mono);
          font-size: 12px;
          color: var(--pillar-brand-cyan);
          background: none;
          padding: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .link-copy {
          padding: var(--pillar-space-1) var(--pillar-space-2);
          background: var(--pillar-surface-elevated);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 4px;
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--pillar-text-muted);
          cursor: pointer;
          transition: all var(--pillar-duration-fast);
        }

        .link-copy:hover {
          border-color: var(--pillar-brand-cyan);
          color: var(--pillar-brand-cyan);
        }

        .links-note {
          font-size: 12px;
          color: var(--pillar-text-dim);
          margin: var(--pillar-space-4) 0 0 0;
          font-style: italic;
        }

        @media (max-width: 480px) {
          .link-item {
            flex-wrap: wrap;
          }

          .link-label {
            width: 100%;
          }

          .link-code {
            order: 1;
            width: 100%;
            flex: none;
          }

          .link-copy {
            order: 2;
            margin-left: auto;
          }
        }
      `}</style>
    </details>
  );
}

export default DrillAIDevLinks;
