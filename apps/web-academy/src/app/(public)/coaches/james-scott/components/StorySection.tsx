"use client";

interface StorySectionProps {
  headline: string;
  paragraphs: string[];
  philosophy: {
    quote: string;
    subtext: string;
  };
}

export function StorySection({
  headline,
  paragraphs,
  philosophy,
}: StorySectionProps) {
  return (
    <section className="story-section">
      <div className="story-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="header-line" />
          <h2 className="section-title">{headline}</h2>
          <span className="header-line" />
        </div>

        {/* Story Content */}
        <div className="story-content">
          {paragraphs.map((para, index) => {
            const isQuote = para.startsWith('"') || para.includes('"The science');
            const isTransition = para === "Then he became a coach dad.";

            return (
              <p
                key={index}
                className={`story-paragraph ${isQuote ? "quote-style" : ""} ${
                  isTransition ? "transition-style" : ""
                }`}
              >
                {para}
              </p>
            );
          })}
        </div>

        {/* Philosophy Callout */}
        <div className="philosophy-block">
          <div className="philosophy-marker">
            <span className="marker-line" />
            <span className="marker-dot" />
          </div>
          <div className="philosophy-content">
            <h3 className="philosophy-quote">&ldquo;{philosophy.quote}&rdquo;</h3>
            <p className="philosophy-subtext">{philosophy.subtext}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .story-section {
          padding: 80px 24px;
          background: #030303;
          position: relative;
        }

        .story-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 48px;
        }

        .header-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 215, 0, 0.3),
            transparent
          );
        }

        .section-title {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #fff;
          margin: 0;
          white-space: nowrap;
        }

        .story-content {
          margin-bottom: 64px;
        }

        .story-paragraph {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 17px;
          line-height: 1.9;
          color: #888;
          margin: 0 0 24px 0;
        }

        .story-paragraph:last-child {
          margin-bottom: 0;
        }

        .quote-style {
          color: #00f6e0;
          font-style: italic;
          padding-left: 24px;
          border-left: 2px solid rgba(0, 246, 224, 0.3);
        }

        .transition-style {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 28px;
          color: #fff;
          letter-spacing: 0.02em;
          text-align: center;
          margin: 48px 0;
          padding: 32px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Philosophy Callout */
        .philosophy-block {
          display: flex;
          gap: 24px;
          padding: 32px;
          background: rgba(255, 215, 0, 0.02);
          border: 1px solid rgba(255, 215, 0, 0.15);
          position: relative;
        }

        .philosophy-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding-top: 8px;
        }

        .marker-line {
          width: 2px;
          height: 40px;
          background: linear-gradient(
            180deg,
            #ffd700,
            transparent
          );
        }

        .marker-dot {
          width: 8px;
          height: 8px;
          background: #ffd700;
          border-radius: 50%;
        }

        .philosophy-content {
          flex: 1;
        }

        .philosophy-quote {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: clamp(28px, 5vw, 40px);
          color: #ffd700;
          margin: 0 0 16px 0;
          letter-spacing: 0.02em;
          line-height: 1.1;
        }

        .philosophy-subtext {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 15px;
          line-height: 1.7;
          color: #888;
          margin: 0;
        }

        @media (max-width: 768px) {
          .story-section {
            padding: 48px 16px;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
          }

          .header-line {
            width: 60px;
            flex: none;
          }

          .philosophy-block {
            flex-direction: column;
            gap: 16px;
            padding: 24px;
          }

          .philosophy-marker {
            flex-direction: row;
            padding-top: 0;
          }

          .marker-line {
            width: 40px;
            height: 2px;
            background: linear-gradient(
              90deg,
              #ffd700,
              transparent
            );
          }

          .transition-style {
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  );
}
