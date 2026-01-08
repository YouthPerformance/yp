// ═══════════════════════════════════════════════════════════
// ExerciseList Component
// List of exercises for preview
// ═══════════════════════════════════════════════════════════

'use client';

import type { Exercise } from '@/data/programs/basketball-chassis';

interface ExerciseListProps {
  exercises: Exercise[];
}

export function ExerciseList({ exercises }: ExerciseListProps) {
  const formatDuration = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="space-y-2">
      {exercises.map((exercise, index) => (
        <div
          key={exercise.id}
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-default)',
          }}
        >
          {/* Number */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
            }}
          >
            {index + 1}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {exercise.name}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {exercise.reps ? `${exercise.reps} reps` : formatDuration(exercise.duration)}
              {exercise.side && exercise.side !== 'both' && ` • ${exercise.side} side`}
              {exercise.side === 'alternate' && ' • each side'}
            </p>
          </div>

          {/* Duration */}
          <span
            className="text-xs font-mono flex-shrink-0"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {formatDuration(exercise.duration)}
          </span>
        </div>
      ))}
    </div>
  );
}
