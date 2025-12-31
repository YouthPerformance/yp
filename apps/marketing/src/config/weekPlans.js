// 7-Day Plan Generator
// Generates weekly training plans based on selected lane
// Universal structure with lane-specific stack sessions

// Micro session definitions (2-minute quick sessions)
export const MICRO_SESSIONS = {
  tripod_balance: {
    id: 'tripod_balance',
    name: 'Tripod + Balance',
    duration: '2 min',
    exercises: ['tripod_activation', 'single_leg_balance'],
    description: 'Quick foot activation and balance check.',
  },
  ankle_shortfoot: {
    id: 'ankle_shortfoot',
    name: 'Ankle Circles + Short Foot',
    duration: '2 min',
    exercises: ['ankle_circles', 'short_foot_holds'],
    description: 'Mobility and arch activation.',
  },
}

// Day types for weekly planning
export const DAY_TYPES = {
  full_stack: 'full_stack',       // Full 8-minute lane stack
  micro: 'micro',                  // 2-minute quick session
  optional_play: 'optional_play',  // Light activity
  rest: 'rest',                    // Complete rest + check-in
  stack_plus: 'stack_plus',        // Stack + extra test
}

// Generate 7-day plan for a lane
export function generate7DayPlan(lane, stackId) {
  const planId = `PLAN_${lane.toUpperCase()}_7D`

  return {
    id: planId,
    lane,
    stackId,
    name: '7-Day Foundation Plan',
    description: 'Build consistency with short, repeatable sessions.',
    days: [
      {
        day: 1,
        label: 'Day 1',
        title: 'Today Stack',
        type: DAY_TYPES.full_stack,
        stackId: stackId,
        description: 'Start with the full 8-minute session.',
        tip: 'Focus on quality over speed.',
      },
      {
        day: 2,
        label: 'Day 2',
        title: 'Micro Session',
        type: DAY_TYPES.micro,
        microId: 'tripod_balance',
        description: 'Quick 2-minute activation.',
        tip: 'Great before school or practice.',
      },
      {
        day: 3,
        label: 'Day 3',
        title: 'Today Stack',
        type: DAY_TYPES.full_stack,
        stackId: stackId,
        description: 'Same stack. Building the habit.',
        tip: 'Notice what feels easier.',
      },
      {
        day: 4,
        label: 'Day 4',
        title: 'Micro Session',
        type: DAY_TYPES.micro,
        microId: 'ankle_shortfoot',
        description: 'Ankle mobility + arch work.',
        tip: 'Can do this anywhere.',
      },
      {
        day: 5,
        label: 'Day 5',
        title: 'Stack + Landing Test',
        type: DAY_TYPES.stack_plus,
        stackId: stackId,
        extra: 'quiet_landing_test',
        description: 'Full stack plus a quiet landing check.',
        tip: 'How silent can you land?',
      },
      {
        day: 6,
        label: 'Day 6',
        title: 'Light Play',
        type: DAY_TYPES.optional_play,
        description: 'Optional light activity. Walk, stretch, or easy play.',
        tip: 'No pressure. Active recovery.',
      },
      {
        day: 7,
        label: 'Day 7',
        title: 'Rest + Check-in',
        type: DAY_TYPES.rest,
        description: 'How did the week feel? Any soreness?',
        tip: 'Progress check before Week 2.',
        checkIn: true,
      },
    ],
    summary: {
      fullSessions: 3,
      microSessions: 2,
      restDays: 2,
      totalMinutes: 30,
    },
  }
}

// Lane-specific upsell copy (E11-4)
export const LANE_UPSELL_COPY = {
  base_lane: {
    headline: 'Ready for the full progression?',
    body: 'Barefoot Reset turns this starter stack into a 4-week progression.',
    cta: 'See the Full Protocol',
  },
  quiet_lane: {
    headline: 'Master quiet landings for good',
    body: 'Barefoot Reset builds absorption so landings stay quiet under speed.',
    cta: 'Unlock the Protocol',
  },
  speed_lane: {
    headline: 'Get faster the right way',
    body: 'Barefoot Reset builds the base so speed doesn\'t leak.',
    cta: 'See the Full Protocol',
  },
  jump_lane: {
    headline: 'Bounce is earned',
    body: 'Barefoot Reset gives you the progression to jump higher safely.',
    cta: 'Unlock the Protocol',
  },
  silent_lane: {
    headline: 'Quiet reps that actually stick',
    body: 'Barefoot Reset expands this into a 4-week apartment-friendly plan.',
    cta: 'See the Full Protocol',
  },
  return_carefully_lane: {
    headline: 'The safest way back',
    body: 'Barefoot Reset gives you the safest ramp back — without guessing.',
    cta: 'Unlock the Protocol',
  },
}

// Get upsell copy for lane
export function getUpsellCopy(lane) {
  return LANE_UPSELL_COPY[lane] || LANE_UPSELL_COPY.base_lane
}

// Check if user should see upsell (trigger conditions)
export function shouldShowUpsell(completedStacks = 0, has7DayPlan = false) {
  // Show upsell after completing stack twice OR unlocking 7-day plan
  return completedStacks >= 2 || has7DayPlan
}
