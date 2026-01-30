"use client";

import {
  DrillV3,
  getIntensityColor,
  IntensityLevel,
  DifficultyLevel,
} from "@/data/drills/drill-v3-types";

// Difficulty badge colors
const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: "var(--pillar-status-success)",
  intermediate: "var(--pillar-status-warning)",
  advanced: "var(--pillar-status-error)",
};

export interface DrillQuickFactsProps {
  duration: string;
  intensity: IntensityLevel;
  equipment: string[];
  space: string;
  level: DifficultyLevel;
  noiseLevel?: string;
}

interface FactItemProps {
  label: string;
  value: string;
  icon?: string;
  color?: string;
}

function FactItem({ label, value, icon, color }: FactItemProps) {
  return (
    <div className="fact-item">
      {icon && <span className="fact-icon">{icon}</span>}
      <div className="fact-content">
        <span className="fact-value" style={color ? { color } : undefined}>
          {value}
        </span>
        <span className="fact-label">{label}</span>
      </div>

      <style jsx>{`
        .fact-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--pillar-space-1);
          min-width: var(--drill-fact-item-min-width, 100px);
          height: var(--drill-fact-item-height, 72px);
          padding: var(--pillar-space-3);
          background: var(--pillar-glass-bg);
          border: 1px solid var(--pillar-glass-border);
          border-radius: 12px;
          text-align: center;
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
        }

        .fact-item:hover {
          border-color: rgba(0, 246, 224, 0.2);
          background: rgba(255, 255, 255, 0.05);
        }

        .fact-icon {
          font-size: 28px;
          margin-bottom: var(--pillar-space-2);
        }

        .fact-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .fact-value {
          font-family: var(--pillar-font-body);
          font-size: 16px;
          font-weight: 700;
          color: var(--pillar-text-primary);
          line-height: 1.2;
        }

        .fact-label {
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--pillar-text-secondary);
        }
      `}</style>
    </div>
  );
}

export function DrillQuickFacts({
  duration,
  intensity,
  equipment,
  space,
  level,
  noiseLevel,
}: DrillQuickFactsProps) {
  const intensityColor = getIntensityColor(intensity);
  const difficultyColor = DIFFICULTY_COLORS[level];
  const difficultyLabel = level.charAt(0).toUpperCase() + level.slice(1);
  const equipmentDisplay = equipment.length > 0 ? equipment.join(", ") : "None";

  return (
    <section className="drill-quick-facts" data-layer="guide">
      <div className="facts-strip">
        <FactItem label="Duration" value={duration} icon="⏱" />
        <FactItem
          label="Intensity"
          value={intensity.charAt(0).toUpperCase() + intensity.slice(1)}
          icon="🔥"
          color={intensityColor}
        />
        <FactItem label="Equipment" value={equipmentDisplay} icon="🏀" />
        <FactItem label="Space" value={space} icon="📐" />
        <FactItem label="Difficulty" value={difficultyLabel} icon="📊" color={difficultyColor} />
        {noiseLevel && <FactItem label="Noise" value={noiseLevel} icon="🔇" />}
      </div>

      <style jsx>{`
        .drill-quick-facts {
          padding: var(--pillar-space-6) 0;
        }

        .facts-strip {
          display: flex;
          flex-wrap: wrap;
          gap: var(--pillar-space-3);
          justify-content: flex-start;
        }

        @media (max-width: 768px) {
          .facts-strip {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--pillar-space-2);
          }
        }

        @media (max-width: 480px) {
          .facts-strip {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}

export default DrillQuickFacts;
