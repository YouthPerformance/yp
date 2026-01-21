// ═══════════════════════════════════════════════════════════
// DRILL CARD COMPONENT
// Displays a drill preview in grid/list layouts
// ═══════════════════════════════════════════════════════════

import Link from "next/link";
import type { Drill } from "@/data/drills";
import { ageGroupDisplayName, constraintDisplayName } from "@/data/drills";

interface DrillCardProps {
  drill: Drill;
  href: string;
  variant?: "default" | "compact";
}

export function DrillCard({ drill, href, variant = "default" }: DrillCardProps) {
  const difficultyColors = {
    beginner: { bg: "rgba(76, 175, 80, 0.2)", text: "#4CAF50" },
    intermediate: { bg: "rgba(255, 193, 7, 0.2)", text: "#FFC107" },
    advanced: { bg: "rgba(244, 67, 54, 0.2)", text: "#F44336" },
  };

  const colors = difficultyColors[drill.difficulty];

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.02]"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <span className="text-xl">{getDrillIcon(drill.sport, drill.category)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-bebas tracking-wider text-sm truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {drill.title}
          </h3>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {drill.duration}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group block p-5 rounded-xl transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-default)",
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <span className="text-3xl">{getDrillIcon(drill.sport, drill.category)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-bebas text-xl tracking-wider mb-1 group-hover:text-[#00F6E0] transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            {drill.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span
              className="text-xs px-2 py-0.5 rounded capitalize"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {drill.difficulty}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
            >
              {drill.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-sm mb-4 line-clamp-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {drill.description}
      </p>

      {/* Benefits */}
      {drill.benefits.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {drill.benefits.slice(0, 3).map((benefit, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(0, 246, 224, 0.1)",
                  color: "#00F6E0",
                }}
              >
                {benefit}
              </span>
            ))}
            {drill.benefits.length > 3 && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-tertiary)",
                }}
              >
                +{drill.benefits.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border-default)" }}>
        <div className="flex flex-wrap gap-1">
          {drill.ageGroups.slice(0, 2).map((age) => (
            <span
              key={age}
              className="text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-tertiary)",
              }}
            >
              {ageGroupDisplayName(age)}
            </span>
          ))}
          {drill.ageGroups.length > 2 && (
            <span
              className="text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              +{drill.ageGroups.length - 2}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {drill.constraints.includes("no-equipment") && (
            <span title="No equipment needed" className="text-lg">🚫🏋️</span>
          )}
          {drill.constraints.includes("indoor") && (
            <span title="Indoor drill" className="text-lg">🏠</span>
          )}
          {drill.constraints.includes("solo") && (
            <span title="Solo drill" className="text-lg">👤</span>
          )}
        </div>
      </div>

      {/* Equipment */}
      {drill.equipment.length > 0 && drill.equipment[0] !== "None" && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border-default)" }}>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Equipment: {drill.equipment.join(", ")}
          </span>
        </div>
      )}
    </Link>
  );
}

function getDrillIcon(sport: string, category: string): string {
  const icons: Record<string, Record<string, string>> = {
    basketball: {
      shooting: "🎯",
      "ball-handling": "✋",
      passing: "🤝",
      defense: "🛡️",
      footwork: "👟",
      conditioning: "🏃",
      agility: "⚡",
      "vertical-jump": "🚀",
      strength: "💪",
    },
    soccer: {
      dribbling: "⚽",
      passing: "🎯",
      shooting: "🥅",
      defense: "🛡️",
      footwork: "👟",
      conditioning: "🏃",
      agility: "⚡",
      "first-touch": "✋",
      heading: "🗣️",
    },
    general: {
      "ankle-mobility": "🦶",
      "hip-mobility": "🦵",
      "core-strength": "💪",
      balance: "⚖️",
      coordination: "🤹",
      speed: "⚡",
      agility: "🔄",
      flexibility: "🧘",
      plyometrics: "💥",
      "barefoot-training": "🦶",
    },
  };

  return icons[sport]?.[category] || "🏋️";
}
