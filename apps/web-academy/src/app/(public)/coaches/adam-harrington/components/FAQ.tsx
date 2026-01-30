"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

function IntelAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`intel-item ${isOpen ? "intel-item--open" : ""}`}>
      <button
        className="intel-header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="intel-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="intel-question">{item.question}</span>
        <span className="intel-toggle">{isOpen ? "−" : "+"}</span>
      </button>
      <div className={`intel-content ${isOpen ? "intel-content--visible" : ""}`}>
        <div className="intel-answer">
          <span className="answer-prefix">{">"}</span>
          <p>{item.answer}</p>
        </div>
      </div>

      <style jsx>{`
        .intel-item {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.3s ease;
        }

        .intel-item:hover {
          border-color: rgba(255, 255, 255, 0.15);
        }

        .intel-item--open {
          border-color: rgba(0, 246, 224, 0.3);
          background: rgba(0, 246, 224, 0.02);
        }

        .intel-header {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }

        .intel-index {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          color: #00f6e0;
          opacity: 0.6;
        }

        .intel-question {
          flex: 1;
          font-family: var(--pillar-font-mono, monospace);
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          letter-spacing: 0.5px;
        }

        .intel-toggle {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 18px;
          color: #00f6e0;
          width: 24px;
          text-align: center;
        }

        .intel-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .intel-content--visible {
          max-height: 500px;
        }

        .intel-answer {
          display: flex;
          gap: 12px;
          padding: 0 24px 24px 56px;
        }

        .answer-prefix {
          font-family: var(--pillar-font-mono, monospace);
          color: #00f6e0;
          opacity: 0.5;
        }

        .intel-answer p {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 14px;
          line-height: 1.7;
          color: #888;
          margin: 0;
        }

        @media (max-width: 768px) {
          .intel-header {
            padding: 16px;
            gap: 12px;
          }

          .intel-question {
            font-size: 13px;
          }

          .intel-answer {
            padding: 0 16px 20px 44px;
          }
        }
      `}</style>
    </div>
  );
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="intel-section">
      <div className="intel-container">
        <div className="section-header">
          <span className="header-line" />
          <h2 className="section-label">INTEL REQUESTS</h2>
          <span className="header-line" />
        </div>
        <p className="section-subtext">Frequently requested intelligence</p>

        <div className="intel-list">
          {items.map((item, index) => (
            <IntelAccordionItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .intel-section {
          padding: 80px 24px;
          background: #050505;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-blend-mode: overlay;
        }

        .intel-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
        }

        .header-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 246, 224, 0.3),
            transparent
          );
        }

        .section-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 4px;
          color: #00f6e0;
          margin: 0;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .section-subtext {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          color: #555;
          text-align: center;
          margin: 0 0 40px;
          letter-spacing: 1px;
        }

        .intel-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        @media (max-width: 768px) {
          .intel-section {
            padding: 48px 16px;
          }

          .section-header {
            gap: 12px;
          }

          .section-label {
            font-size: 11px;
            letter-spacing: 3px;
          }
        }
      `}</style>
    </section>
  );
}
