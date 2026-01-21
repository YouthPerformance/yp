// ═══════════════════════════════════════════════════════════
// DRILL FILTERS COMPONENT
// Age group and constraint filters with URL state
// ═══════════════════════════════════════════════════════════

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Sport, AgeGroup, Constraint } from "@/data/drills";
import { ageGroupDisplayName, constraintDisplayName } from "@/data/drills";

interface DrillFiltersProps {
  sport: Sport;
  category: string;
  currentAge?: AgeGroup;
  currentConstraint?: Constraint;
  availableAgeGroups: AgeGroup[];
  availableConstraints: Constraint[];
}

export function DrillFilters({
  sport,
  category,
  currentAge,
  currentConstraint,
  availableAgeGroups,
  availableConstraints,
}: DrillFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      const queryString = params.toString();
      const newPath = `/drills/${sport}/${category}${queryString ? `?${queryString}` : ""}`;
      router.push(newPath, { scroll: false });
    },
    [router, searchParams, sport, category]
  );

  const clearFilters = useCallback(() => {
    router.push(`/drills/${sport}/${category}`, { scroll: false });
  }, [router, sport, category]);

  const hasFilters = currentAge || currentConstraint;

  return (
    <div className="mb-8">
      {/* Age Group Filters */}
      {availableAgeGroups.length > 0 && (
        <div className="mb-4">
          <label
            className="block text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            Age Group
          </label>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="All Ages"
              isActive={!currentAge}
              onClick={() => updateFilters("age", null)}
            />
            {availableAgeGroups.map((age) => (
              <FilterButton
                key={age}
                label={ageGroupDisplayName(age)}
                isActive={currentAge === age}
                onClick={() => updateFilters("age", currentAge === age ? null : age)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Constraint Filters */}
      {availableConstraints.length > 0 && (
        <div className="mb-4">
          <label
            className="block text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            Filter By
          </label>
          <div className="flex flex-wrap gap-2">
            {availableConstraints.map((constraint) => (
              <FilterButton
                key={constraint}
                label={constraintDisplayName(constraint)}
                icon={getConstraintIcon(constraint)}
                isActive={currentConstraint === constraint}
                onClick={() =>
                  updateFilters("constraint", currentConstraint === constraint ? null : constraint)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{
            color: "var(--text-secondary)",
            backgroundColor: "var(--bg-tertiary)",
          }}
        >
          <span>Clear Filters</span>
          <span>✕</span>
        </button>
      )}
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  icon?: string;
  isActive: boolean;
  onClick: () => void;
}

function FilterButton({ label, icon, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
      style={{
        backgroundColor: isActive ? "var(--accent-primary)" : "var(--bg-tertiary)",
        color: isActive ? "var(--bg-primary)" : "var(--text-secondary)",
        border: isActive ? "none" : "1px solid var(--border-default)",
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

function getConstraintIcon(constraint: Constraint): string {
  const icons: Record<Constraint, string> = {
    "no-equipment": "🚫",
    indoor: "🏠",
    outdoor: "🌳",
    solo: "👤",
    partner: "👥",
    team: "👪",
    "5-minutes": "⏱️",
    "10-minutes": "⏰",
    beginner: "🟢",
    intermediate: "🟡",
    advanced: "🔴",
  };

  return icons[constraint] || "";
}
