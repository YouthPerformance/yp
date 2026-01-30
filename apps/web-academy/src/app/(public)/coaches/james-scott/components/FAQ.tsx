"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="faq-section">
      <div className="faq-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="header-line" />
          <h2 className="section-label">INTEL REQUESTS</h2>
          <span className="header-line" />
        </div>

        {/* FAQ Items */}
        <div className="faq-list">
          {items.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "is-open" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="question-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="question-text">{item.question}</span>
                <span className="question-toggle">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div className="faq-answer">
                <p className="answer-text">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .faq-section {
          padding: 80px 24px;
          background: #050505;
        }

        .faq-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
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
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 4px;
          color: #00f6e0;
          margin: 0;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .faq-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: border-color 0.3s ease;
        }

        .faq-item.is-open {
          border-color: rgba(0, 246, 224, 0.2);
        }

        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }

        .question-number {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          color: #00f6e0;
          opacity: 0.5;
        }

        .question-text {
          flex: 1;
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 15px;
          color: #ccc;
        }

        .question-toggle {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 20px;
          color: #555;
          width: 24px;
          text-align: center;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .faq-item.is-open .faq-answer {
          max-height: 300px;
        }

        .answer-text {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 14px;
          line-height: 1.8;
          color: #777;
          padding: 0 24px 20px 56px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .faq-section {
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

          .faq-question {
            padding: 16px;
          }

          .answer-text {
            padding: 0 16px 16px 42px;
          }
        }
      `}</style>
    </section>
  );
}
