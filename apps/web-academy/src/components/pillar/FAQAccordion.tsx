"use client";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// FAQ accordion using native details/summary for accessibility
// and SEO. The open state is handled by the browser.
// ═══════════════════════════════════════════════════════════

export function FAQAccordion({
  items,
  title = "Frequently Asked Questions",
  className = "",
}: FAQAccordionProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`faq-section ${className}`}>
      <h3 className="faq-title">{title}</h3>
      <div className="faq-list">
        {items.map((item, i) => (
          <details key={i} className="faq-item">
            <summary className="faq-question">{item.question}</summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>

      <style jsx>{`
        .faq-section {
          padding-top: var(--pillar-space-2);
        }

        .faq-title {
          font-family: var(--pillar-font-display);
          font-size: 22px;
          color: var(--pillar-text-primary);
          margin-bottom: var(--pillar-space-5);
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-3);
        }

        .faq-item {
          background: var(--pillar-glass-bg);
          border: 1px solid var(--pillar-glass-border);
          border-radius: 12px;
          overflow: hidden;
          backdrop-filter: blur(var(--pillar-glass-blur));
          -webkit-backdrop-filter: blur(var(--pillar-glass-blur));
          transition: all var(--pillar-duration-slow) var(--pillar-ease-out);
        }

        .faq-item:hover {
          border-color: rgba(0, 246, 224, 0.2);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .faq-item[open] {
          border-color: var(--pillar-brand-cyan);
          box-shadow: 0 10px 40px rgba(0, 246, 224, 0.1);
        }

        .faq-question {
          padding: var(--pillar-space-4) var(--pillar-space-5);
          font-size: 15px;
          font-weight: 600;
          color: var(--pillar-text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          list-style: none;
          user-select: none;
        }

        .faq-question::-webkit-details-marker {
          display: none;
        }

        .faq-question::after {
          content: '+';
          font-family: var(--pillar-font-mono);
          font-size: 20px;
          color: var(--pillar-text-muted);
          transition: transform var(--pillar-duration-fast);
        }

        .faq-item[open] .faq-question::after {
          transform: rotate(45deg);
          color: var(--pillar-brand-cyan);
        }

        .faq-question:hover {
          color: var(--pillar-brand-cyan);
        }

        .faq-answer {
          padding: 0 var(--pillar-space-5) var(--pillar-space-5);
          border-top: 1px solid var(--pillar-border-subtle);
          margin-top: 0;
        }

        .faq-answer p {
          margin: 0;
          padding-top: var(--pillar-space-4);
          font-size: 14px;
          line-height: 1.7;
          color: var(--pillar-text-secondary);
        }
      `}</style>
    </div>
  );
}

export default FAQAccordion;
