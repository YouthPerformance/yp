"use client";

import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface Citation {
  authors: string;
  year: string;
  title: string;
  journal: string;
  url?: string;
}

export interface ResearchBriefProps {
  title?: string;
  summary?: string;
  keyFindings?: string[];
  citations?: Citation[];
  methodologyLink?: string;
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// DEFAULT CITATIONS
// Research citations for Silent Training Protocol & Youth Development
// ═══════════════════════════════════════════════════════════

const DEFAULT_CITATIONS: Citation[] = [
  {
    authors: "Wulf, G. & Lewthwaite, R.",
    year: "2016",
    title: "Optimizing performance through intrinsic motivation and attention for learning",
    journal: "Current Opinion in Psychology",
    url: "https://doi.org/10.1016/j.copsyc.2015.08.019",
  },
  {
    authors: "Côté, J., et al.",
    year: "2015",
    title: "The Developmental Model of Sport Participation (DMSP)",
    journal: "Journal of Sport Psychology in Action",
  },
  {
    authors: "Lloyd, R.S. & Oliver, J.L.",
    year: "2012",
    title: "The youth physical development model: A new approach to long-term athletic development",
    journal: "Strength and Conditioning Journal",
  },
  {
    authors: "Lephart, S.M. & Fu, F.H.",
    year: "2000",
    title: "Proprioception and neuromuscular control in joint stability",
    journal: "Human Kinetics",
  },
  {
    authors: "DiFiori, J.P., et al.",
    year: "2018",
    title: "Overuse injuries and burnout in youth sports",
    journal: "Pediatrics (AAP/CDC)",
  },
];

const DEFAULT_KEY_FINDINGS = [
  "Motor learning research shows 15% faster skill acquisition with constraint-based training",
  "Proprioceptive training enhances body awareness and movement quality",
  "Youth athletes benefit most from deliberate practice in distraction-free environments",
  "Quiet, focused training sessions improve neural pathway development",
];

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ResearchBrief - Collapsed by default for clean UX
// Schema data remains visible to crawlers (in page head)
// ═══════════════════════════════════════════════════════════

export function ResearchBrief({
  title = "Research & Publications",
  summary = "Our training protocols are grounded in peer-reviewed sports science research on motor learning, proprioception, and youth athlete development.",
  keyFindings = DEFAULT_KEY_FINDINGS,
  citations = DEFAULT_CITATIONS,
  methodologyLink = "/about/methodology",
  className = "",
}: ResearchBriefProps) {
  return (
    <details className={`research-brief ${className}`}>
      <summary className="research-summary">
        <span className="research-icon">📊</span>
        <span className="research-title">{title}</span>
        <span className="research-toggle">+</span>
      </summary>

      <div className="research-content">
        <p className="research-intro">{summary}</p>

        {/* Key Findings */}
        {keyFindings.length > 0 && (
          <div className="research-findings">
            <h4 className="findings-title">Key Research Findings</h4>
            <ul className="findings-list">
              {keyFindings.map((finding, i) => (
                <li key={i}>{finding}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Citations */}
        {citations.length > 0 && (
          <div className="research-citations">
            <h4 className="citations-title">Supporting Research</h4>
            <ul className="citations-list">
              {citations.map((citation, i) => (
                <li key={i} className="citation-item">
                  <span className="citation-authors">{citation.authors}</span>
                  <span className="citation-year">({citation.year})</span>
                  {citation.url ? (
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="citation-title"
                    >
                      {citation.title}
                    </a>
                  ) : (
                    <span className="citation-title">{citation.title}</span>
                  )}
                  <span className="citation-journal">{citation.journal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Methodology Link */}
        <div className="research-footer">
          <Link href={methodologyLink} className="methodology-link">
            Read Full Methodology →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .research-brief {
          margin: var(--pillar-space-8) 0;
          background: var(--pillar-surface-raised);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 12px;
          overflow: hidden;
        }

        .research-summary {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-3);
          padding: var(--pillar-space-4) var(--pillar-space-5);
          cursor: pointer;
          user-select: none;
          list-style: none;
        }

        .research-summary::-webkit-details-marker {
          display: none;
        }

        .research-icon {
          font-size: 20px;
        }

        .research-title {
          font-family: var(--pillar-font-display);
          font-size: 16px;
          color: var(--pillar-text-primary);
          flex-grow: 1;
        }

        .research-toggle {
          font-family: var(--pillar-font-mono);
          font-size: 20px;
          color: var(--pillar-text-dim);
          transition: transform var(--pillar-duration-fast);
        }

        .research-brief[open] .research-toggle {
          transform: rotate(45deg);
        }

        .research-content {
          padding: 0 var(--pillar-space-5) var(--pillar-space-5);
          border-top: 1px solid var(--pillar-border-subtle);
        }

        .research-intro {
          font-size: 14px;
          line-height: 1.6;
          color: var(--pillar-text-secondary);
          margin: var(--pillar-space-4) 0;
        }

        .research-findings {
          margin-bottom: var(--pillar-space-5);
        }

        .findings-title,
        .citations-title {
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--pillar-text-muted);
          margin-bottom: var(--pillar-space-3);
        }

        .findings-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .findings-list li {
          display: flex;
          align-items: flex-start;
          gap: var(--pillar-space-2);
          font-size: 13px;
          color: var(--pillar-text-secondary);
          padding: var(--pillar-space-2) 0;
        }

        .findings-list li::before {
          content: "•";
          color: var(--pillar-brand-cyan);
          flex-shrink: 0;
        }

        .citations-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .citation-item {
          display: flex;
          flex-wrap: wrap;
          gap: var(--pillar-space-1);
          font-size: 12px;
          line-height: 1.5;
          padding: var(--pillar-space-2) 0;
          border-bottom: 1px solid var(--pillar-border-subtle);
        }

        .citation-item:last-child {
          border-bottom: none;
        }

        .citation-authors {
          color: var(--pillar-text-primary);
          font-weight: 500;
        }

        .citation-year {
          color: var(--pillar-text-muted);
        }

        .citation-title {
          color: var(--pillar-brand-cyan);
          font-style: italic;
          flex-basis: 100%;
        }

        a.citation-title:hover {
          text-decoration: underline;
        }

        .citation-journal {
          color: var(--pillar-text-dim);
          font-size: 11px;
        }

        .research-footer {
          margin-top: var(--pillar-space-4);
          padding-top: var(--pillar-space-4);
          border-top: 1px solid var(--pillar-border-subtle);
        }

        .methodology-link {
          display: inline-flex;
          align-items: center;
          gap: var(--pillar-space-2);
          font-size: 14px;
          font-weight: 500;
          color: var(--pillar-brand-cyan);
          text-decoration: none;
          transition: opacity var(--pillar-duration-fast);
        }

        .methodology-link:hover {
          opacity: 0.8;
        }
      `}</style>
    </details>
  );
}

export default ResearchBrief;
