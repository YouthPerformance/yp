// DrillCard - Wolf response block for displaying a single drill
// Shows drill instruction, cue, and safety note

import { getDrill } from "../../config/drills";
import { Card } from "../ui";

function DrillCard({ drillId, drill: drillProp, showSafetyNote = true, compact = false }) {
  // Get drill from config or use provided drill
  const drill = drillProp || getDrill(drillId);

  if (!drill) return null;

  return (
    <Card className={`bg-black-100 ${compact ? "p-3" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-white">{drill.name}</h4>
        {drill.defaultDuration && (
          <span className="text-cyan-500 text-sm">{drill.defaultDuration}s</span>
        )}
      </div>

      {/* Instruction */}
      <p className="text-dark-text-secondary text-sm mb-2">{drill.instruction}</p>

      {/* Cue */}
      <p className="text-cyan-500 text-sm font-medium mb-2">Cue: {drill.cue}</p>

      {/* Reps/Sets if applicable */}
      {(drill.defaultReps || drill.defaultSets) && (
        <p className="text-dark-text-tertiary text-xs mb-2">
          {drill.defaultReps && <span>{drill.defaultReps}</span>}
          {drill.defaultSets && <span> • {drill.defaultSets} sets</span>}
          {drill.perSide && <span> • each side</span>}
        </p>
      )}

      {/* Safety note */}
      {showSafetyNote && drill.safetyNote && (
        <div className="mt-2 pt-2 border-t border-black-400">
          <p className="text-dark-text-tertiary text-xs flex items-start gap-1">
            <svg
              className="w-3 h-3 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {drill.safetyNote}
          </p>
        </div>
      )}
    </Card>
  );
}

export default DrillCard;
