// SessionStack - Wolf response block for displaying a runnable stack
// Used in Wolf chat to show the "Do this today" stack

import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../ui'

function SessionStack({ stack, showCTA = true, compact = false }) {
  const navigate = useNavigate()

  if (!stack) return null

  const handleStart = () => {
    navigate(`/app/stacks/${stack.id}/run`)
  }

  return (
    <Card className={`bg-black-100 border-cyan-500/30 ${compact ? 'p-3' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-yp-display uppercase text-white text-lg">
            {stack.name}
          </h3>
          <p className="text-dark-text-tertiary text-sm">{stack.tagline}</p>
        </div>
        <div className="text-right">
          <span className="text-cyan-500 font-medium">{stack.duration}</span>
          <p className="text-dark-text-tertiary text-xs">
            {stack.exercises?.length || 0} exercises
          </p>
        </div>
      </div>

      {/* Exercise preview (compact list) */}
      {!compact && (
        <div className="mb-4 space-y-1">
          {stack.exercises?.slice(0, 4).map((exercise, idx) => (
            <div
              key={exercise.id || idx}
              className="flex items-center gap-2 text-sm text-dark-text-secondary"
            >
              <span className="w-5 h-5 rounded-full bg-black-300 flex items-center justify-center text-xs text-dark-text-tertiary">
                {idx + 1}
              </span>
              <span>{exercise.label || exercise.name}</span>
            </div>
          ))}
          {stack.exercises?.length > 4 && (
            <p className="text-dark-text-tertiary text-xs pl-7">
              + {stack.exercises.length - 4} more
            </p>
          )}
        </div>
      )}

      {/* Safety note for return lane */}
      {stack.safetyFirst && (
        <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-xs flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            No jumps. Pain check included. Safety first.
          </p>
        </div>
      )}

      {/* No jumps note */}
      {stack.noJumps && !stack.safetyFirst && (
        <p className="text-dark-text-tertiary text-xs mb-3">
          No jumps. Quiet and controlled.
        </p>
      )}

      {/* CTA */}
      {showCTA && (
        <Button onClick={handleStart} fullWidth className="shadow-glow-cyan">
          Start Stack
        </Button>
      )}
    </Card>
  )
}

export default SessionStack
