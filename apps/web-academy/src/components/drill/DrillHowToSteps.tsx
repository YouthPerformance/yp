"use client";

import { useState, useCallback } from "react";
import { DrillStepV3 } from "@/data/drills/drill-v3-types";

export interface DrillHowToStepsProps {
  steps: DrillStepV3[];
  drillTitle: string;
}

interface StepCardProps {
  step: DrillStepV3;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function StepCard({ step, isLast, isExpanded, onToggle }: StepCardProps) {
  // Truncate instruction to ~80 chars for collapsed view
  const truncatedInstruction = step.instruction.length > 80
    ? step.instruction.slice(0, 80).trim() + "..."
    : step.instruction;

  return (
    <div className={`step-card ${isExpanded ? "step-card--expanded" : ""}`}>
      {/* Step Number */}
      <div className="step-number-container">
        <div className="step-number">{step.number}</div>
        {!isLast && <div className="step-connector" />}
      </div>

      {/* Step Content */}
      <div className="step-content">
        <button
          type="button"
          className="step-header"
          onClick={onToggle}
          aria-expanded={isExpanded}
        >
          <div className="step-header-text">
            <h3 className="step-title">{step.title}</h3>
            {step.duration && <span className="step-duration">{step.duration}</span>}
          </div>
          <span className="step-toggle" aria-hidden="true">
            {isExpanded ? "▲" : "▼"}
          </span>
        </button>

        {/* Collapsed Preview */}
        {!isExpanded && (
          <p className="step-preview">{truncatedInstruction}</p>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="step-details">
            <p className="step-instruction">{step.instruction}</p>

            {/* Coaching Cue (Positive) */}
            {step.coachingCue && (
              <div className="step-cue step-cue--do">
                <span className="cue-icon">💡</span>
                <div className="cue-content">
                  <span className="cue-label">Coach Tip</span>
                  <span className="cue-text">{step.coachingCue}</span>
                </div>
              </div>
            )}

            {/* Common Mistake (Warning) */}
            {step.commonMistake && (
              <div className="step-cue step-cue--warning">
                <span className="cue-icon">⚠️</span>
                <div className="cue-content">
                  <span className="cue-label">Watch Out</span>
                  <span className="cue-text">{step.commonMistake}</span>
                </div>
              </div>
            )}

            {/* Error Fix (if provided) */}
            {step.errorFix && (
              <div className="step-cue step-cue--fix">
                <span className="cue-icon">✅</span>
                <div className="cue-content">
                  <span className="cue-label">Fix</span>
                  <span className="cue-text">{step.errorFix}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .step-card {
          display: flex;
          gap: var(--pillar-space-5);
        }

        .step-number-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--drill-step-number-size, 48px);
          height: var(--drill-step-number-size, 48px);
          background: var(--pillar-brand-cyan-dim);
          border: 2px solid var(--pillar-brand-cyan);
          border-radius: 50%;
          font-family: var(--pillar-font-display);
          font-size: var(--drill-step-font-size, 24px);
          font-weight: var(--drill-step-font-weight, 700);
          color: var(--pillar-brand-cyan);
        }

        .step-connector {
          width: var(--drill-step-connector-width, 2px);
          flex: 1;
          min-height: 24px;
          background: linear-gradient(
            180deg,
            var(--pillar-brand-cyan) 0%,
            var(--pillar-border-subtle) 100%
          );
          margin-top: var(--pillar-space-3);
        }

        .step-card--expanded .step-connector {
          min-height: 40px;
        }

        .step-content {
          flex: 1;
          padding-bottom: var(--pillar-space-4);
        }

        .step-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--pillar-space-3);
          width: 100%;
          padding: 0;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }

        .step-header-text {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: var(--pillar-space-2);
        }

        .step-title {
          font-family: var(--pillar-font-body);
          font-size: 18px;
          font-weight: 600;
          color: var(--pillar-text-primary);
          margin: 0;
        }

        .step-duration {
          padding: var(--pillar-space-1) var(--pillar-space-2);
          background: var(--pillar-surface-raised);
          border-radius: 4px;
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          color: var(--pillar-text-muted);
        }

        .step-toggle {
          font-size: 12px;
          color: var(--pillar-text-dim);
          flex-shrink: 0;
          padding-top: 4px;
          transition: color var(--pillar-duration-fast);
        }

        .step-header:hover .step-toggle {
          color: var(--pillar-brand-cyan);
        }

        .step-preview {
          font-size: 14px;
          line-height: 1.5;
          color: var(--pillar-text-muted);
          margin: var(--pillar-space-2) 0 0 0;
        }

        .step-details {
          margin-top: var(--pillar-space-3);
        }

        .step-instruction {
          font-size: 15px;
          line-height: 1.7;
          color: var(--pillar-text-secondary);
          margin: 0 0 var(--pillar-space-4) 0;
          padding: var(--pillar-space-3) var(--pillar-space-4);
          background: var(--pillar-surface-raised);
          border-radius: 8px;
        }

        .step-cue {
          display: flex;
          gap: var(--pillar-space-3);
          padding: var(--pillar-space-3) var(--pillar-space-4);
          border-radius: 8px;
          margin-bottom: var(--pillar-space-2);
        }

        .step-cue--do {
          background: var(--drill-cue-do-bg);
          border-left: 3px solid var(--drill-cue-do);
        }

        .step-cue--warning {
          background: rgba(255, 176, 32, 0.08);
          border-left: 3px solid var(--pillar-status-warning);
        }

        .step-cue--fix {
          background: var(--drill-cue-focus-bg);
          border-left: 3px solid var(--drill-cue-focus);
        }

        .cue-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        .cue-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cue-label {
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--pillar-text-muted);
        }

        .cue-text {
          font-size: 14px;
          line-height: 1.5;
          color: var(--pillar-text-primary);
        }

        @media (max-width: 480px) {
          .step-card {
            gap: var(--pillar-space-3);
          }

          .step-number {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          .step-title {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export function DrillHowToSteps({ steps, drillTitle }: DrillHowToStepsProps) {
  // Track which steps are expanded (default: all collapsed)
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const toggleStep = useCallback((stepNumber: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedSteps(new Set(steps.map((s) => s.number)));
  }, [steps]);

  const collapseAll = useCallback(() => {
    setExpandedSteps(new Set());
  }, []);

  const allExpanded = expandedSteps.size === steps.length;

  return (
    <section
      id="how-to"
      className="drill-how-to"
      data-layer="guide"
      aria-labelledby="how-to-heading"
    >
      <div className="section-header">
        <h2 id="how-to-heading" className="section-title">
          How to Perform
        </h2>
        <button
          type="button"
          className="expand-toggle"
          onClick={allExpanded ? collapseAll : expandAll}
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>
      <div className="steps-container">
        {steps.map((step, index) => (
          <StepCard
            key={step.number}
            step={step}
            isLast={index === steps.length - 1}
            isExpanded={expandedSteps.has(step.number)}
            onToggle={() => toggleStep(step.number)}
          />
        ))}
      </div>

      <style jsx>{`
        .drill-how-to {
          padding: var(--drill-section-gap, 48px) 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--pillar-space-4);
          margin-bottom: var(--pillar-space-6);
        }

        .section-title {
          font-family: var(--pillar-font-display);
          font-size: 28px;
          letter-spacing: 0.02em;
          color: var(--pillar-text-primary);
          margin: 0;
        }

        .expand-toggle {
          padding: var(--pillar-space-2) var(--pillar-space-3);
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 6px;
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--pillar-text-muted);
          cursor: pointer;
          transition: all var(--pillar-duration-fast);
        }

        .expand-toggle:hover {
          border-color: var(--pillar-brand-cyan);
          color: var(--pillar-text-primary);
        }

        .steps-container {
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 480px) {
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--pillar-space-3);
          }
        }
      `}</style>
    </section>
  );
}

export default DrillHowToSteps;
