"use client";

import { useState } from "react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface SessionBuilderOption {
  value: string;
  label: string;
  xp?: number;
}

export interface SessionBuilderConfig {
  durations: SessionBuilderOption[];
  floorTypes: SessionBuilderOption[];
  difficulties: SessionBuilderOption[];
  noiseRange?: {
    min: number;
    max: number;
    default: number;
  };
}

export interface SessionBuilderState {
  duration: string;
  floor: string;
  difficulty: string;
  noiseCap: number;
}

export interface SessionBuilderProps {
  config?: SessionBuilderConfig;
  onGenerate: (state: SessionBuilderState) => void;
}

// Default config
const DEFAULT_CONFIG: SessionBuilderConfig = {
  durations: [
    { value: "10", label: "10m", xp: 100 },
    { value: "20", label: "20m", xp: 250 },
    { value: "30", label: "30m", xp: 400 },
  ],
  floorTypes: [
    { value: "carpet", label: "Carpet" },
    { value: "wood", label: "Wood" },
    { value: "tile", label: "Tile" },
  ],
  difficulties: [
    { value: "beginner", label: "Easy" },
    { value: "intermediate", label: "Med" },
    { value: "advanced", label: "Hard" },
  ],
  noiseRange: { min: 25, max: 55, default: 40 },
};

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function SessionBuilder({
  config = DEFAULT_CONFIG,
  onGenerate,
}: SessionBuilderProps) {
  const [state, setState] = useState<SessionBuilderState>({
    duration: config.durations[1]?.value || "20",
    floor: config.floorTypes[0]?.value || "carpet",
    difficulty: config.difficulties[1]?.value || "intermediate",
    noiseCap: config.noiseRange?.default || 40,
  });

  const handleOptionSelect = (
    key: keyof SessionBuilderState,
    value: string | number
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    onGenerate(state);
  };

  const getDifficultyStars = (value: string) => {
    switch (value) {
      case "beginner":
        return "\u2B50";
      case "intermediate":
        return "\u2B50\u2B50";
      case "advanced":
        return "\u2B50\u2B50\u2B50";
      default:
        return "\u2B50";
    }
  };

  return (
    <div className="session-builder">
      <h2 className="builder-title">
        <span role="img" aria-hidden="true">\u26A1</span> Quick Start
      </h2>

      {/* Duration */}
      <div className="builder-row">
        <div className="builder-label">Duration</div>
        <div className="builder-options">
          {config.durations.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`builder-option ${state.duration === opt.value ? "selected" : ""}`}
              onClick={() => handleOptionSelect("duration", opt.value)}
            >
              <div className="option-value">{opt.label}</div>
              {opt.xp && <div className="option-xp athlete-only">+{opt.xp} XP</div>}
            </button>
          ))}
        </div>
      </div>

      {/* Floor Type */}
      <div className="builder-row">
        <div className="builder-label">Floor Type</div>
        <div className="builder-options">
          {config.floorTypes.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`builder-option ${state.floor === opt.value ? "selected" : ""}`}
              onClick={() => handleOptionSelect("floor", opt.value)}
            >
              <div className="option-value">{opt.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="builder-row">
        <div className="builder-label">Difficulty</div>
        <div className="builder-options">
          {config.difficulties.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`builder-option ${state.difficulty === opt.value ? "selected" : ""}`}
              onClick={() => handleOptionSelect("difficulty", opt.value)}
            >
              <div className="option-value">
                {getDifficultyStars(opt.value)} {opt.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Noise Cap Slider */}
      {config.noiseRange && (
        <div className="builder-row">
          <div className="builder-label">Noise Cap</div>
          <div className="noise-slider-wrap">
            <div className="noise-header">
              <span />
              <span className="noise-value">{state.noiseCap}dB</span>
            </div>
            <input
              type="range"
              className="noise-slider"
              min={config.noiseRange.min}
              max={config.noiseRange.max}
              value={state.noiseCap}
              onChange={(e) =>
                handleOptionSelect("noiseCap", parseInt(e.target.value, 10))
              }
            />
            <div className="noise-labels">
              <span>Whisper</span>
              <span>Normal</span>
              <span>Loud</span>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="pillar-btn pillar-btn-generate"
        onClick={handleGenerate}
      >
        Generate Protocol \u2192
      </button>

      <style jsx>{`
        .session-builder {
          padding: var(--pillar-space-6);
          background: var(--pillar-surface-elevated);
          border: 1px solid var(--pillar-border-default);
          border-radius: 16px;
        }

        .builder-title {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-3);
          font-family: var(--pillar-font-display);
          font-size: 24px;
          margin-bottom: var(--pillar-space-6);
          color: var(--pillar-text-primary);
        }

        .builder-row {
          margin-bottom: var(--pillar-space-5);
        }

        .builder-label {
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--pillar-text-muted);
          margin-bottom: var(--pillar-space-3);
        }

        .builder-options {
          display: flex;
          gap: var(--pillar-space-3);
          flex-wrap: wrap;
        }

        .builder-option {
          flex: 1;
          min-width: 100px;
          padding: var(--pillar-space-4);
          background: var(--pillar-surface-raised);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          transition: all var(--pillar-duration-fast) var(--pillar-ease-out);
          font-family: inherit;
          color: var(--pillar-text-primary);
        }

        .builder-option:hover {
          border-color: var(--pillar-border-strong);
        }

        .builder-option.selected {
          background: var(--pillar-brand-cyan-dim);
          border-color: var(--pillar-brand-cyan);
        }

        .option-value {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .builder-option.selected .option-value {
          color: var(--pillar-brand-cyan);
        }

        .option-xp {
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          color: var(--pillar-status-success);
        }

        /* Noise Slider */
        .noise-slider-wrap {
          padding: var(--pillar-space-4) 0;
        }

        .noise-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--pillar-space-2);
        }

        .noise-value {
          font-family: var(--pillar-font-mono);
          font-size: 14px;
          font-weight: 600;
          color: var(--pillar-brand-cyan);
        }

        .noise-slider {
          width: 100%;
          height: 8px;
          background: var(--pillar-surface-raised);
          border-radius: 4px;
          appearance: none;
          cursor: pointer;
        }

        .noise-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: var(--pillar-brand-cyan);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px var(--pillar-brand-cyan-dim);
        }

        .noise-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: var(--pillar-brand-cyan);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px var(--pillar-brand-cyan-dim);
        }

        .noise-labels {
          display: flex;
          justify-content: space-between;
          margin-top: var(--pillar-space-2);
          font-size: 11px;
          color: var(--pillar-text-muted);
        }
      `}</style>
    </div>
  );
}

export default SessionBuilder;
