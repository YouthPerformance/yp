"use client";

import { useState, useMemo } from "react";
import { DrillCard, type DrillData } from "./DrillCard";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type FilterValue = "all" | "beginner" | "intermediate" | "advanced";

export interface DrillInventoryProps {
  drills: DrillData[];
  title?: string;
  showFilters?: boolean;
  showProgress?: boolean;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function DrillInventory({
  drills,
  title = "Drill Inventory",
  showFilters = true,
  showProgress = false,
}: DrillInventoryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filters: { value: FilterValue; label: string }[] = [
    { value: "all", label: "All" },
    { value: "beginner", label: "\u2605 Easy" },
    { value: "intermediate", label: "\u2605\u2605 Med" },
    { value: "advanced", label: "\u2605\u2605\u2605 Hard" },
  ];

  const filteredDrills = useMemo(() => {
    if (activeFilter === "all") return drills;
    return drills.filter((d) => d.difficulty === activeFilter);
  }, [drills, activeFilter]);

  const drillCount = drills.length;
  const filteredCount = filteredDrills.length;

  return (
    <section className="drill-inventory-section">
      <div className="inventory-header">
        <div className="inventory-title-row">
          <h2 className="pillar-section-title">{title}</h2>
          <span className="inventory-count">
            {filteredCount === drillCount
              ? `${drillCount} Drills`
              : `${filteredCount} of ${drillCount}`}
          </span>
        </div>

        {showFilters && (
          <div className="filter-chips">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`filter-chip ${activeFilter === filter.value ? "active" : ""}`}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="drill-grid">
        {filteredDrills.map((drill) => (
          <DrillCard key={drill.slug} drill={drill} showProgress={showProgress} />
        ))}
      </div>

      {filteredDrills.length === 0 && (
        <div className="no-results">
          No drills match the selected filter.
        </div>
      )}

      <style jsx>{`
        .drill-inventory-section {
          margin-top: var(--pillar-space-10);
          padding-top: var(--pillar-space-8);
          border-top: 1px solid var(--pillar-border-subtle);
        }

        .inventory-header {
          margin-bottom: var(--pillar-space-6);
        }

        .inventory-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--pillar-space-4);
        }

        .inventory-count {
          font-family: var(--pillar-font-mono);
          font-size: 13px;
          color: var(--pillar-text-muted);
        }

        .filter-chips {
          display: flex;
          gap: var(--pillar-space-2);
          flex-wrap: wrap;
        }

        .filter-chip {
          padding: var(--pillar-space-2) var(--pillar-space-4);
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 100px;
          font-family: var(--pillar-font-body);
          font-size: 13px;
          color: var(--pillar-text-secondary);
          cursor: pointer;
          transition: all var(--pillar-duration-fast) var(--pillar-ease-out);
        }

        .filter-chip:hover {
          border-color: var(--pillar-border-strong);
        }

        .filter-chip.active {
          background: var(--pillar-brand-cyan-dim);
          border-color: var(--pillar-brand-cyan);
          color: var(--pillar-brand-cyan);
        }

        .drill-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--pillar-space-4);
        }

        .no-results {
          padding: var(--pillar-space-10);
          text-align: center;
          color: var(--pillar-text-muted);
        }
      `}</style>
    </section>
  );
}

export default DrillInventory;
