// Interest Pills Configuration - Parent-focused outcomes
// Max 3 selections, maps to lanes for personalized stacks

export const PILLS_CONFIG = {
  maxPills: 3,
  categories: [
    {
      id: 'durability',
      label: 'Durability & Control',
      pills: [
        { id: 'stability', label: 'Stop rolling ankles', helper: 'Build ankle stability for cuts + landings.', tag: 'stability' },
        { id: 'balance', label: 'Better balance', helper: 'Steady on one leg. Better control under load.', tag: 'balance' },
        { id: 'quiet_landings', label: 'Quieter landings', helper: 'Land softer and quieter (less slam).', tag: 'quiet_landings' },
        { id: 'foot_strength', label: 'Stronger feet + calves', helper: 'Wake up the base and build strength safely.', tag: 'foot_strength' },
      ],
    },
    {
      id: 'speed',
      label: 'Game Speed',
      pills: [
        { id: 'first_step', label: 'Faster first step', helper: 'Explode without losing control.', tag: 'first_step' },
        { id: 'change_direction', label: 'Quicker cuts', helper: 'Sharper direction changes with less wobble.', tag: 'change_direction' },
        { id: 'deceleration', label: 'Better stopping', helper: 'Decelerate cleanly. Stronger stops.', tag: 'deceleration' },
      ],
    },
    {
      id: 'power',
      label: 'Strength & Power',
      pills: [
        { id: 'jump_power', label: 'Jump higher (safe)', helper: 'Build bounce with clean takeoff + landings.', tag: 'jump_power' },
      ],
    },
    {
      id: 'comfort',
      label: 'Comfort & Constraints',
      pills: [
        { id: 'apartment_quiet', label: 'Apartment-friendly', helper: 'Low-impact options that don\'t annoy neighbors.', tag: 'apartment_quiet' },
        { id: 'return_carefully', label: 'Coming back carefully', helper: 'Rebuilding after a tweak. Step-by-step.', tag: 'return_carefully' },
        { id: 'reduce_soreness', label: 'Reduce soreness', helper: 'Start gentle. Build tolerance the right way.', tag: 'reduce_soreness' },
        { id: 'routine', label: 'Build a routine', helper: 'A plan you can actually repeat (3x/week).', tag: 'routine' },
      ],
    },
  ],
  basketballAddOns: {
    enabledWhenSport: 'basketball',
    label: 'Basketball Skills',
    pills: [
      { id: 'bball_footwork', label: 'Better footwork', helper: 'Court-ready movement patterns.', tag: 'bball_footwork' },
      { id: 'bball_handles', label: 'Better handles', helper: 'Stable base for ball control.', tag: 'bball_handles' },
      { id: 'bball_shooting', label: 'More consistent shooting', helper: 'Better balance = better shot.', tag: 'bball_shooting' },
      { id: 'bball_lateral', label: 'Quicker defense slides', helper: 'Faster lateral movement.', tag: 'bball_lateral' },
    ],
  },
}

// Lane routing configuration - priority order (safety first)
export const LANE_CONFIG = {
  priority: [
    'return_carefully_lane',
    'silent_lane',
    'base_lane',
    'quiet_lane',
    'speed_lane',
    'jump_lane',
  ],
  rules: [
    { ifTagAny: ['return_carefully', 'reduce_soreness'], lane: 'return_carefully_lane' },
    { ifSpaceIs: ['apartment'], lane: 'silent_lane' },
    { ifTagAny: ['apartment_quiet'], lane: 'silent_lane' },
    { ifTagAny: ['stability', 'balance', 'foot_strength', 'routine'], lane: 'base_lane' },
    { ifTagAny: ['quiet_landings', 'deceleration'], lane: 'quiet_lane' },
    { ifTagAny: ['first_step', 'change_direction'], lane: 'speed_lane' },
    { ifTagAny: ['jump_power'], lane: 'jump_lane' },
    // Basketball pills map to base lane (foundation enables skills)
    { ifTagAny: ['bball_footwork', 'bball_handles', 'bball_shooting', 'bball_lateral'], lane: 'base_lane' },
  ],
  defaultLane: 'base_lane',
}

// Lane outputs - which stack and plan to use
export const LANE_OUTPUTS = {
  base_lane: {
    stackId: 'STACK_BASE_8',
    planId: 'PLAN_ANKLES_7D_BASE',
    name: 'Base Stability',
    tagline: 'Seal the base so speed + cuts don\'t leak.',
  },
  quiet_lane: {
    stackId: 'STACK_QUIET_8',
    planId: 'PLAN_ANKLES_7D_QUIET',
    name: 'Quiet Landing',
    tagline: 'Quiet landings = better absorption and safer joints.',
  },
  speed_lane: {
    stackId: 'STACK_SPEED_8',
    planId: 'PLAN_ANKLES_7D_SPEED',
    name: 'Speed',
    tagline: 'You don\'t need more effort — you need a cleaner push + cleaner stop.',
  },
  jump_lane: {
    stackId: 'STACK_JUMP_8',
    planId: 'PLAN_ANKLES_7D_JUMP',
    name: 'Jump & Land',
    tagline: 'Bounce is earned by landing cleaner.',
  },
  silent_lane: {
    stackId: 'STACK_SILENT_8',
    planId: 'PLAN_ANKLES_7D_SILENT',
    name: 'Silent Stack',
    tagline: 'Quiet reps you actually repeat beat loud reps you avoid.',
  },
  return_carefully_lane: {
    stackId: 'STACK_RETURN_8',
    planId: 'PLAN_ANKLES_7D_RETURN',
    name: 'Restore & Rebuild',
    tagline: 'We rebuild confidence by stacking clean reps.',
  },
}

// Determine which lane to use based on selected goals and context
export function determineLane(selectedGoals = [], space = null, painFlag = null) {
  const tags = selectedGoals.map(g => g.tag || g)

  // Check pain flag first (safety wins)
  if (painFlag === 'foot-ankle') {
    return 'return_carefully_lane'
  }

  // Check each rule in priority order
  for (const rule of LANE_CONFIG.rules) {
    if (rule.ifTagAny && tags.some(t => rule.ifTagAny.includes(t))) {
      return rule.lane
    }
    if (rule.ifSpaceIs && rule.ifSpaceIs.includes(space)) {
      return rule.lane
    }
  }

  return LANE_CONFIG.defaultLane
}

// Get recommended pills based on context
export function getRecommendedPills(sport, space, painFlag) {
  const recommended = []

  // Pain-based recommendations (safety first)
  if (painFlag === 'foot-ankle') {
    recommended.push('return_carefully', 'stability')
  } else if (painFlag === 'knee-hip-back') {
    recommended.push('quiet_landings', 'balance')
  }

  // Space-based recommendations
  if (space === 'apartment' && !recommended.includes('apartment_quiet')) {
    recommended.push('apartment_quiet')
  }

  // Sport-based recommendations (if no pain recommendations)
  if (recommended.length === 0) {
    if (sport === 'basketball') {
      recommended.push('first_step', 'deceleration')
    } else if (sport === 'barefoot') {
      recommended.push('stability', 'balance')
    } else {
      recommended.push('stability', 'quiet_landings')
    }
  }

  // Ensure we don't exceed max
  return recommended.slice(0, PILLS_CONFIG.maxPills)
}

// Get preselected pills based on context (E12-3)
// Returns pill objects that should be auto-selected
export function getPreselectedPills(sport, space, painFlag) {
  const recommendedTags = getRecommendedPills(sport, space, painFlag)

  // Find full pill objects from tags
  const allPills = [
    ...PILLS_CONFIG.categories.flatMap(c => c.pills),
    ...PILLS_CONFIG.basketballAddOns.pills,
  ]

  return recommendedTags
    .map(tag => allPills.find(p => p.tag === tag || p.id === tag))
    .filter(Boolean)
    .slice(0, 2) // Preselect max 2 to leave room for user choice
}

// Generate Wolf prompt from onboarding data
export function generateWolfPrompt(data) {
  const { childNickname = 'your athlete', ageBand, sport, space, goals = [], painFlag } = data
  const goalLabels = goals.map(g => g.label || g).join(', ') || 'general foundation'
  const safetyNote = painFlag && painFlag !== 'none' ? `Safety flag: ${painFlag}.` : ''

  return `You are "Wolf," the YouthPerformance training buddy for ${childNickname}.
${childNickname} is in the ${ageBand || 'youth'} age band and plays ${sport || 'multiple sports'}.
They train mostly in ${space || 'various spaces'}. Parent goals: ${goalLabels}. ${safetyNote}

Coach style: calm, practical, safety-first. Use short sessions (8-12 minutes).
Always start with "Do this today" (a SessionStack). Then offer a 7-day plan (WeekGrid).
No medical diagnosis. Include stop rules: sharp pain or limping = stop and reset.
When appropriate, recommend the next step: Barefoot Reset (lifetime protocol).`
}

// Wolf First Message Template (E13-1)
export function generateWolfFirstMessage(data) {
  const {
    childNickname = 'your athlete',
    ageBand,
    space,
    goals = [],
    lane
  } = data

  const goalLabels = goals.map(g => g.label || g).slice(0, 3).join(', ') || 'building a strong foundation'
  const spaceLabel = space === 'apartment' ? 'a smaller space' :
                     space === 'gym' ? 'a gym' :
                     space === 'outdoor' ? 'outdoor spaces' : 'home'

  return `Got it. For ${childNickname} (age ${ageBand || 'youth'}) training in ${spaceLabel}, your top goals are: ${goalLabels}.

Do this today: run the 8-minute stack below. Keep it controlled — quiet landings beat bigger reps.

If anything feels sharp or causes limping, stop and reset.

Want me to build your 3x/week plan for the next 7 days?`
}

// Suggested questions for Wolf chat (E10-8)
export const WOLF_SUGGESTED_QUESTIONS = [
  {
    id: 'safety',
    text: "Is barefoot training safe for my child's age?",
    category: 'safety',
  },
  {
    id: 'frequency',
    text: 'How often should we do this each week?',
    category: 'planning',
  },
  {
    id: 'week1',
    text: "What's a safe Week 1 plan?",
    category: 'planning',
  },
  {
    id: 'pain',
    text: 'What if my child feels pain during an exercise?',
    category: 'safety',
  },
  {
    id: 'progress',
    text: 'How will I know if this is working?',
    category: 'progress',
  },
]
