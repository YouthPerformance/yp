// WeekGrid - Wolf response block for displaying 7-day plans
// Shows the week at a glance with day types and progress

import { Card } from '../ui'
import { DAY_TYPES } from '../../config/weekPlans'

// Day type icons and colors
const DAY_TYPE_CONFIG = {
  [DAY_TYPES.full_stack]: {
    icon: '🎯',
    label: 'Full',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/20',
  },
  [DAY_TYPES.micro]: {
    icon: '⚡',
    label: 'Micro',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
  },
  [DAY_TYPES.stack_plus]: {
    icon: '🎯+',
    label: 'Stack+',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/20',
  },
  [DAY_TYPES.optional_play]: {
    icon: '🌿',
    label: 'Play',
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
  },
  [DAY_TYPES.rest]: {
    icon: '😴',
    label: 'Rest',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/20',
  },
}

function WeekGrid({ plan, currentDay = 0, completedDays = [], onDayClick }) {
  if (!plan || !plan.days) return null

  return (
    <Card className="bg-black-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-yp-display uppercase text-white text-lg">
            {plan.name}
          </h3>
          <p className="text-dark-text-tertiary text-sm">{plan.description}</p>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {plan.days.map((day, idx) => {
          const config = DAY_TYPE_CONFIG[day.type] || DAY_TYPE_CONFIG[DAY_TYPES.rest]
          const isCompleted = completedDays.includes(day.day)
          const isCurrent = currentDay === day.day
          const isPast = day.day < currentDay

          return (
            <button
              key={day.day}
              onClick={() => onDayClick?.(day)}
              disabled={!onDayClick}
              className={`
                relative p-2 rounded-lg text-center transition-all
                ${isCurrent ? 'ring-2 ring-cyan-500' : ''}
                ${isCompleted ? 'bg-success/20' : config.bgColor}
                ${onDayClick ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}
              `}
            >
              <p className="text-[10px] text-dark-text-tertiary uppercase mb-1">
                {day.label}
              </p>
              <p className="text-lg">
                {isCompleted ? '✓' : config.icon}
              </p>
              <p className={`text-[10px] ${isCompleted ? 'text-success' : config.color}`}>
                {config.label}
              </p>
            </button>
          )
        })}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-dark-text-tertiary border-t border-black-400 pt-3">
        <span>{plan.summary?.fullSessions || 3} full sessions</span>
        <span>{plan.summary?.microSessions || 2} micro sessions</span>
        <span>~{plan.summary?.totalMinutes || 30} min total</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-black-400">
        {Object.entries(DAY_TYPE_CONFIG).map(([type, config]) => (
          <div key={type} className="flex items-center gap-1 text-xs text-dark-text-tertiary">
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default WeekGrid
