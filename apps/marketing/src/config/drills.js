// Drill Definitions - Parent-friendly barefoot training exercises
// Each drill has instruction copy, cue text, and safety notes

export const DRILLS = {
  // === Foundation Drills ===
  tripod_activation: {
    id: 'tripod_activation',
    name: 'Tripod Foot Activation',
    category: 'foundation',
    instruction: 'Stand barefoot. Press big toe, pinky toe, and heel into the floor equally. Feel the arch lift slightly.',
    cue: 'Three points of contact. Soft grip.',
    safetyNote: 'No pain. If arch cramps, rest and shake it out.',
    defaultDuration: 60,
  },
  short_foot_holds: {
    id: 'short_foot_holds',
    name: 'Short Foot Holds',
    category: 'foundation',
    instruction: 'Without curling your toes, try to shorten your foot by pulling the ball of your foot toward your heel.',
    cue: 'Dome the arch. No toe curling.',
    safetyNote: 'Start with 30 seconds. Stop if cramping.',
    defaultDuration: 45,
    defaultSets: 2,
  },
  single_leg_balance: {
    id: 'single_leg_balance',
    name: 'Single Leg Balance',
    category: 'foundation',
    instruction: 'Stand on one foot. Keep your knee soft, not locked. Find your balance point.',
    cue: 'Quiet foot. Small corrections.',
    safetyNote: 'Hold a wall if needed. Safety first.',
    defaultDuration: 30,
    perSide: true,
  },
  supported_single_leg_balance: {
    id: 'supported_single_leg_balance',
    name: 'Supported Single Leg Balance',
    category: 'foundation',
    instruction: 'Stand on one foot with fingertips lightly touching a wall or chair. Focus on stability without relying on support.',
    cue: 'Light touch only. Let your foot do the work.',
    safetyNote: 'Use support as needed. Coming back carefully.',
    defaultDuration: 20,
    perSide: true,
  },
  ankle_circles: {
    id: 'ankle_circles',
    name: 'Ankle Circles',
    category: 'mobility',
    instruction: 'Lift your foot. Draw slow, controlled circles with your ankle. 20 clockwise, 20 counter-clockwise.',
    cue: 'Full range. Smooth circles.',
    safetyNote: 'Move slowly. No forcing through pain.',
    defaultDuration: 40,
    defaultReps: '20 each way',
    perSide: true,
  },
  calf_raises_slow: {
    id: 'calf_raises_slow',
    name: 'Slow Calf Raises',
    category: 'strength',
    instruction: 'Rise up on your toes slowly (3 seconds up). Pause at the top. Lower slowly (3 seconds down).',
    cue: '3 up. Pause. 3 down.',
    safetyNote: 'Hold a wall for balance. Quality over quantity.',
    defaultDuration: 60,
    defaultReps: '10 reps',
  },
  landing_prep: {
    id: 'landing_prep',
    name: 'Landing Prep',
    category: 'plyometric',
    instruction: 'Small jumps in place. Focus on landing softly and quietly. Bend your knees on landing.',
    cue: 'Quiet landings. Absorb with your legs.',
    safetyNote: 'Land soft. If knees hurt, stop and rest.',
    defaultDuration: 45,
    defaultReps: '5 soft jumps',
  },

  // === New Lane-Specific Drills ===
  toe_heel_rockers: {
    id: 'toe_heel_rockers',
    name: 'Toe-to-Heel Rockers',
    category: 'mobility',
    instruction: 'Stand with feet hip-width apart. Rock forward onto your toes, then back onto your heels. Keep it controlled.',
    cue: 'Smooth transition. Feel the full foot.',
    safetyNote: 'Go slow. Hold a wall if balance is tricky.',
    defaultDuration: 45,
  },
  fast_feet: {
    id: 'fast_feet',
    name: 'Fast Feet in Place',
    category: 'speed',
    instruction: 'Quick, light foot taps in place. Stay on the balls of your feet. Keep your core tight.',
    cue: 'Light and quick. Minimal ground contact.',
    safetyNote: 'Stop if feeling unstable. Quality over speed.',
    defaultDuration: 20,
    defaultSets: 2,
  },
  stick_the_stop: {
    id: 'stick_the_stop',
    name: 'Stick the Stop',
    category: 'deceleration',
    instruction: 'Take 2-3 quick steps forward, then stop suddenly and hold. Focus on absorbing into the floor.',
    cue: 'Load and freeze. Quiet stop.',
    safetyNote: 'Start slow. No sharp pain. Hold wall nearby.',
    defaultDuration: 45,
    defaultReps: '3 reps each side',
    perSide: true,
  },
  snap_down: {
    id: 'snap_down',
    name: 'Snap Down',
    category: 'plyometric',
    instruction: 'Start standing tall. Quick dip down into an athletic stance with soft knees. Arms back. Freeze.',
    cue: 'Quick down. Quiet landing. Freeze.',
    safetyNote: 'Start gentle. Build up intensity over days.',
    defaultDuration: 45,
    defaultReps: '3 reps',
  },
  silent_step_downs: {
    id: 'silent_step_downs',
    name: 'Silent Step-downs',
    category: 'control',
    instruction: 'Stand on a low step or book. Step down with one foot, landing silently. Return and repeat.',
    cue: 'No sound. Control the descent.',
    safetyNote: 'Use a low step (2-4 inches). Safety first.',
    defaultDuration: 45,
    defaultReps: '5 each side',
    perSide: true,
  },
  pain_check: {
    id: 'pain_check',
    name: 'Pain Check',
    category: 'safety',
    instruction: 'Take a moment. How does everything feel? Any sharp pain? Limping? If yes, stop here. If no, you\'re good.',
    cue: 'Listen to your body. Honest check.',
    safetyNote: 'Sharp pain or limping = stop and rest. No pushing through.',
    defaultDuration: 15,
  },
}

// Get drill by ID with fallback
export function getDrill(id) {
  return DRILLS[id] || null
}

// Get all drills in a category
export function getDrillsByCategory(category) {
  return Object.values(DRILLS).filter(d => d.category === category)
}
