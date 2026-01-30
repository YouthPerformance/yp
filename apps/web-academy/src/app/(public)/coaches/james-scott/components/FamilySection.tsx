"use client";

interface FamilySectionProps {
  headline: string;
  content: string;
  quote: string;
}

export function FamilySection({ headline, content, quote }: FamilySectionProps) {
  return (
    <section className="family-section">
      <div className="family-container">
        {/* Header */}
        <div className="section-header">
          <span className="header-icon">👨‍👧‍👦</span>
          <h2 className="section-title">{headline}</h2>
        </div>

        {/* Content */}
        <p className="family-content">{content}</p>

        {/* Quote */}
        <div className="quote-block">
          <span className="quote-mark">&ldquo;</span>
          <blockquote className="quote-text">{quote}</blockquote>
          <span className="quote-mark">&rdquo;</span>
        </div>

        {/* Closing */}
        <p className="family-closing">
          This is why YouthPerformance exists: to give every family access to the
          same movement science used by the best athletes on earth.
        </p>
      </div>

      <style jsx>{`
        .family-section {
          padding: 80px 24px;
          background: linear-gradient(
            180deg,
            #030303 0%,
            rgba(255, 215, 0, 0.02) 50%,
            #030303 100%
          );
        }

        .family-container {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .header-icon {
          font-size: 32px;
        }

        .section-title {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #fff;
          margin: 0;
        }

        .family-content {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 17px;
          line-height: 1.8;
          color: #888;
          margin: 0 0 48px 0;
        }

        .quote-block {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 8px;
          margin-bottom: 48px;
          padding: 32px;
          background: rgba(255, 215, 0, 0.03);
          border: 1px solid rgba(255, 215, 0, 0.1);
        }

        .quote-mark {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 48px;
          color: rgba(255, 215, 0, 0.3);
          line-height: 1;
        }

        .quote-text {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 18px;
          line-height: 1.7;
          color: #ffd700;
          margin: 0;
          font-style: italic;
          padding-top: 8px;
        }

        .family-closing {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 15px;
          line-height: 1.7;
          color: #666;
          margin: 0;
        }

        @media (max-width: 768px) {
          .family-section {
            padding: 48px 16px;
          }

          .quote-block {
            flex-direction: column;
            align-items: center;
            padding: 24px;
          }

          .quote-mark:last-child {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
