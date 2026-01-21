/**
 * Athletic Foundation Data - Ground Force System
 *
 * PILLAR PHILOSOPHY:
 * Feet = Springs (energy storage & return)
 * Ankles = Acceleration system (force transfer & direction change)
 * Pain = Signal that the system is breaking down (one cluster, not the focus)
 *
 * This is PERFORMANCE content, not medical content.
 * We're teaching athletes to unlock power from the ground up.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface FoundationDrill {
  slug: string;
  name: string;
  purpose: string;
  targetSystem: 'feet-springs' | 'ankle-acceleration' | 'integrated';
  athleticBenefit: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  duration: string;
  reps: string;
  instructions: string[];
  coachingCues: string[];
  progressions: string[];
  commonMistakes: string[];
  scienceNote?: string;
}

export interface FoundationWorkout {
  slug: string;
  name: string;
  focus: string;
  athleticGoal: string;
  duration: string;
  drills: string[];
  warmup: string[];
  cooldown: string[];
}

export interface FoundationPage {
  slug: string;
  title: string;
  metaDescription: string;
  targetKeywords: string[];
  athleteType: string;
  sport?: string;
  ageRange?: string;
  problemSolved: string;
  performanceOutcome: string;
  drills: string[];
  workouts?: string[];
}

// =============================================================================
// THE SCIENCE: Why Feet & Ankles = Athletic Performance
// =============================================================================

export const FOUNDATION_SCIENCE = {
  feetAsSprings: {
    title: 'Your Feet Are Springs, Not Platforms',
    explanation: `The human foot contains 26 bones, 33 joints, and over 100 muscles, tendons, and ligaments.
    This isn't random - it's an engineering masterpiece designed for energy storage and return.

    When your foot strikes the ground, the arch compresses like a spring, storing elastic energy.
    On push-off, that energy releases - contributing up to 17% of the power in each stride.

    Most youth athletes have "dead" feet - they've lost this spring mechanism from years of
    cushioned shoes and flat surfaces. We can rebuild it.`,
    keyStats: [
      '17% of running power comes from foot spring mechanism',
      'Arch stiffness correlates with sprint speed',
      'Barefoot populations have 3x stronger foot muscles',
    ],
  },
  ankleAcceleration: {
    title: 'Ankles: The Acceleration Engine',
    explanation: `The ankle joint is where athletic intent becomes athletic action.

    Every cut, every first step, every change of direction flows through the ankle.
    Ankle stiffness (the ability to rapidly transfer force) determines:
    - First-step quickness
    - Cutting speed
    - Vertical jump height
    - Deceleration control

    Strong, reactive ankles don't just prevent injury - they CREATE speed.`,
    keyStats: [
      'Ankle stiffness explains 50% of sprint acceleration variance',
      'Elite athletes show 2x faster ankle stabilization',
      'Ankle power peaks at 13-16 years old (trainable window)',
    ],
  },
  painAsSignal: {
    title: 'Pain = System Breakdown Signal',
    explanation: `When feet or ankles hurt, it's not random bad luck.
    It's the system telling you something is overloaded or underperforming.

    Common youth pain patterns and what they actually mean:
    - Heel pain (Sever's): Calf/ankle system can't handle load
    - Arch pain: Foot spring mechanism is weak
    - Ankle sprains: Proprioception and stiffness deficits

    We don't just treat pain - we fix the system that caused it.`,
    keyStats: [
      '80% of youth foot pain resolves with proper loading',
      'Ankle sprain recurrence drops 60% with proprioception training',
      'Strong feet reduce lower limb injuries by 40%',
    ],
  },
};

// =============================================================================
// FOUNDATION DRILLS
// =============================================================================

export const FOUNDATION_DRILLS: Record<string, FoundationDrill> = {
  // FEET AS SPRINGS
  'toe-yoga': {
    slug: 'toe-yoga',
    name: 'Toe Yoga',
    purpose: 'Wake up the intrinsic foot muscles that control the spring',
    targetSystem: 'feet-springs',
    athleticBenefit: 'Better ground feel, faster reactive movements',
    difficulty: 'beginner',
    equipment: [],
    duration: '3 minutes',
    reps: '10 each movement',
    instructions: [
      'Sit or stand with bare feet flat on floor',
      'Lift only your big toe while keeping other toes down',
      'Hold 3 seconds, lower',
      'Now lift only your small toes while big toe stays down',
      'Hold 3 seconds, lower',
      'Finally, spread all toes wide apart',
      'Hold 5 seconds, relax',
    ],
    coachingCues: [
      '"Imagine your toes are fingers - make them move independently"',
      '"Keep the arch lifted, don\'t let it collapse"',
      '"Slow and controlled beats fast and sloppy"',
    ],
    progressions: [
      'Do while standing on one leg',
      'Do with eyes closed',
      'Do while catching a basketball',
    ],
    commonMistakes: [
      'Moving the whole foot instead of just toes',
      'Holding breath',
      'Giving up after 3 days (takes 2 weeks to see improvement)',
    ],
    scienceNote:
      'Studies show toe yoga increases foot muscle cross-sectional area by 10% in 8 weeks.',
  },

  'short-foot': {
    slug: 'short-foot',
    name: 'Short Foot (Arch Doming)',
    purpose: 'Activate the arch spring without curling toes',
    targetSystem: 'feet-springs',
    athleticBenefit: 'Stiffer arch = more energy return on every step',
    difficulty: 'beginner',
    equipment: [],
    duration: '2 minutes',
    reps: '10 holds x 5 seconds each foot',
    instructions: [
      'Stand barefoot, feet hip-width apart',
      'Without curling your toes, try to "shorten" your foot',
      'Pull the ball of your foot toward your heel using only arch muscles',
      'Your arch should rise and dome upward',
      'Hold for 5 seconds while breathing normally',
      'Relax and repeat',
    ],
    coachingCues: [
      '"Imagine picking up a marble with your arch, not your toes"',
      '"The floor should feel like it\'s pushing up into your arch"',
      '"Your toes should stay long and relaxed"',
    ],
    progressions: [
      'Single leg short foot',
      'Short foot while doing mini squats',
      'Short foot during dribbling',
    ],
    commonMistakes: [
      'Curling toes (this cheats the arch muscles)',
      'Holding breath',
      'Over-gripping with the whole foot',
    ],
    scienceNote:
      'Short foot exercise increases arch height by 4mm on average - that\'s significant spring improvement.',
  },

  'towel-scrunches': {
    slug: 'towel-scrunches',
    name: 'Towel Scrunches',
    purpose: 'Build foot muscle strength and endurance',
    targetSystem: 'feet-springs',
    athleticBenefit: 'Feet that don\'t fatigue in the 4th quarter',
    difficulty: 'beginner',
    equipment: ['Small towel'],
    duration: '3 minutes',
    reps: '3 sets of 30 seconds each foot',
    instructions: [
      'Place a small towel flat on the floor',
      'Put your bare foot on the towel',
      'Using only your toes, scrunch the towel toward you',
      'Continue until the whole towel is bunched under your arch',
      'Spread it back out and repeat',
    ],
    coachingCues: [
      '"Pull with ALL your toes, not just the big one"',
      '"Keep your heel planted - only toes and arch move"',
      '"Go for rhythm, not speed"',
    ],
    progressions: [
      'Add a weight (book, water bottle) on the towel',
      'Do standing on one leg',
      'Race against a sibling',
    ],
    commonMistakes: [
      'Lifting the heel',
      'Only using the big toe',
      'Going too fast and losing control',
    ],
  },

  'marble-pickups': {
    slug: 'marble-pickups',
    name: 'Marble Pickups',
    purpose: 'Fine motor control of foot muscles',
    targetSystem: 'feet-springs',
    athleticBenefit: 'Precision foot placement on cuts and jumps',
    difficulty: 'beginner',
    equipment: ['10-20 marbles or small objects', 'Bowl'],
    duration: '5 minutes',
    reps: 'Pick up all marbles with each foot',
    instructions: [
      'Scatter marbles on the floor',
      'Place a bowl nearby',
      'Using only your toes, pick up one marble at a time',
      'Drop it in the bowl',
      'Complete all marbles with right foot, then left',
    ],
    coachingCues: [
      '"Use your toes like fingers"',
      '"Try to feel every bump on the marble"',
      '"Challenge: can you pick up two at once?"',
    ],
    progressions: [
      'Use smaller objects (beads, rice)',
      'Time yourself and try to beat your record',
      'Do while balancing on opposite foot',
    ],
    commonMistakes: [
      'Getting frustrated (this is hard at first!)',
      'Using momentum instead of control',
    ],
  },

  // ANKLE ACCELERATION
  'ankle-alphabets': {
    slug: 'ankle-alphabets',
    name: 'Ankle Alphabets',
    purpose: 'Full range of motion in all ankle planes',
    targetSystem: 'ankle-acceleration',
    athleticBenefit: 'Ankles that can move in any direction instantly',
    difficulty: 'beginner',
    equipment: [],
    duration: '3 minutes',
    reps: 'Full alphabet each foot',
    instructions: [
      'Sit with one leg extended or hanging off a chair',
      'Using only your ankle (not your whole leg), trace the alphabet in the air',
      'Make each letter as large as possible',
      'Go through A to Z',
      'Switch feet',
    ],
    coachingCues: [
      '"Make the letters BIG - use your full range"',
      '"Keep your leg still - only the ankle moves"',
      '"Try cursive for an extra challenge"',
    ],
    progressions: [
      'Add an ankle weight',
      'Do while holding a wall sit',
      'Write words instead of just alphabet',
    ],
    commonMistakes: [
      'Moving the whole leg',
      'Making letters too small',
      'Rushing through without control',
    ],
  },

  'single-leg-balance-reach': {
    slug: 'single-leg-balance-reach',
    name: 'Single Leg Balance Reaches',
    purpose: 'Train ankle stabilizers under dynamic challenge',
    targetSystem: 'ankle-acceleration',
    athleticBenefit:
      'Stable landings, faster recovery from off-balance positions',
    difficulty: 'intermediate',
    equipment: [],
    duration: '4 minutes',
    reps: '10 reaches each direction, each foot',
    instructions: [
      'Stand on one foot, knee slightly bent',
      'Reach your free leg forward as far as possible without losing balance',
      'Return to start',
      'Reach sideways, return',
      'Reach backward, return',
      "That's one round - do 10 rounds each foot",
    ],
    coachingCues: [
      '"Your standing ankle is doing all the work"',
      '"Try to feel every micro-adjustment"',
      '"Reach SLOW - speed is not the goal"',
    ],
    progressions: [
      'Close your eyes',
      'Stand on a pillow or cushion',
      'Hold a basketball overhead',
    ],
    commonMistakes: [
      'Locking the standing knee',
      'Looking down (disrupts balance)',
      'Going too fast',
    ],
    scienceNote:
      'This drill pattern (Star Excursion) is used by NBA teams to predict and prevent ankle injuries.',
  },

  'pogo-hops': {
    slug: 'pogo-hops',
    name: 'Pogo Hops',
    purpose: 'Train elastic ankle stiffness for explosive movements',
    targetSystem: 'ankle-acceleration',
    athleticBenefit: 'Faster first step, higher vertical jump',
    difficulty: 'intermediate',
    equipment: [],
    duration: '2 minutes',
    reps: '3 sets of 20 hops',
    instructions: [
      'Stand tall with feet together',
      'Hop up and down using ONLY your ankles',
      'Keep your knees almost straight (slight bend only)',
      "Imagine you're a pogo stick - stiff legs, bouncy ankles",
      'Minimize ground contact time - bounce like a rubber ball',
    ],
    coachingCues: [
      '"Stiff legs, springy ankles"',
      '"Get off the ground as FAST as possible"',
      '"You should hear a quick tap-tap-tap rhythm"',
    ],
    progressions: [
      'Single leg pogo hops',
      'Pogo hops forward/backward',
      'Pogo hops over a line (side to side)',
    ],
    commonMistakes: [
      'Bending knees too much (turns into a squat jump)',
      'Spending too long on the ground',
      'Not using arms for rhythm',
    ],
    scienceNote:
      'Pogo hops train the stretch-shortening cycle that powers all explosive movements.',
  },

  'ankle-band-4-way': {
    slug: 'ankle-band-4-way',
    name: 'Ankle Band 4-Way',
    purpose: 'Strengthen all ankle muscles against resistance',
    targetSystem: 'ankle-acceleration',
    athleticBenefit: 'Powerful push-off in any direction',
    difficulty: 'intermediate',
    equipment: ['Resistance band'],
    duration: '5 minutes',
    reps: '15 each direction, each foot',
    instructions: [
      'Sit with legs extended, loop band around foot',
      'Anchor band to something sturdy',
      'Point toes away (plantarflexion) against resistance, return',
      'Pull toes toward you (dorsiflexion), return',
      'Turn sole inward (inversion), return',
      'Turn sole outward (eversion), return',
    ],
    coachingCues: [
      '"Control the return - don\'t let the band snap back"',
      '"Full range of motion every rep"',
      '"3 seconds out, 3 seconds back"',
    ],
    progressions: [
      'Use heavier band',
      'Do standing (more functional)',
      'Add a balance challenge',
    ],
    commonMistakes: [
      'Moving too fast',
      'Not going through full range',
      'Letting the band control you on the return',
    ],
  },

  // INTEGRATED SYSTEM
  'barefoot-walks': {
    slug: 'barefoot-walks',
    name: 'Barefoot Texture Walks',
    purpose: 'Reawaken foot sensory system',
    targetSystem: 'integrated',
    athleticBenefit: 'Better body awareness, faster reactions',
    difficulty: 'beginner',
    equipment: ['Various surfaces: grass, gravel, carpet, tile'],
    duration: '5-10 minutes',
    reps: 'Daily exposure',
    instructions: [
      'Remove shoes and socks',
      'Walk slowly on different surfaces',
      'Focus on feeling every texture, temperature, and contour',
      'Grass -> concrete -> carpet -> gravel (if safe)',
      'Notice how your feet adapt to each surface',
    ],
    coachingCues: [
      '"Your feet have as many nerve endings as your hands"',
      '"Feel, don\'t just walk"',
      '"This is training, not just wandering around"',
    ],
    progressions: [
      'Close your eyes on safe surfaces',
      'Try to identify surfaces blindfolded',
      'Balance challenges on different textures',
    ],
    commonMistakes: [
      'Rushing through',
      'Doing it once and forgetting',
      'Walking on actually dangerous surfaces',
    ],
    scienceNote:
      'Barefoot walking increases foot proprioception by 30% - your brain literally maps the ground better.',
  },

  'single-leg-hop-stick': {
    slug: 'single-leg-hop-stick',
    name: 'Single Leg Hop & Stick',
    purpose: 'Integrate foot spring + ankle stability under load',
    targetSystem: 'integrated',
    athleticBenefit: 'Explosive first step, stable landings',
    difficulty: 'advanced',
    equipment: [],
    duration: '4 minutes',
    reps: '5 each direction, each foot',
    instructions: [
      'Stand on one foot',
      'Hop forward and STICK the landing - hold 3 seconds',
      'Hop back to start, stick it',
      'Hop sideways, stick it',
      'Hop diagonally, stick it',
      'Repeat other foot',
    ],
    coachingCues: [
      '"Land like a cat - soft and controlled"',
      '"Stick means NO wobbling"',
      '"Your foot and ankle work together as one unit"',
    ],
    progressions: [
      'Increase hop distance',
      'Add 180deg turn on landing',
      'Catch a ball on landing',
    ],
    commonMistakes: [
      'Landing too loud (means too stiff)',
      'Excessive wobbling (keep practicing)',
      'Not holding the full 3 seconds',
    ],
  },

  'lateral-line-hops': {
    slug: 'lateral-line-hops',
    name: 'Lateral Line Hops',
    purpose: 'Train rapid direction change through feet and ankles',
    targetSystem: 'integrated',
    athleticBenefit: 'Faster lateral movement, better defensive slides',
    difficulty: 'intermediate',
    equipment: ['Line (tape, crack in sidewalk, etc.)'],
    duration: '3 minutes',
    reps: '3 sets of 30 seconds',
    instructions: [
      'Stand beside a line',
      'Hop side to side over the line',
      'Use both feet together',
      'Minimize ground contact time',
      'Stay light on your feet',
    ],
    coachingCues: [
      '"Quick feet, quiet feet"',
      '"Your ankles are springs - bounce!"',
      '"Eyes up, not at your feet"',
    ],
    progressions: [
      'Single leg lateral hops',
      'Forward/backward line hops',
      'Pattern: 2 lateral, 1 forward, 2 lateral, 1 back',
    ],
    commonMistakes: [
      'Heavy landings',
      'Drifting away from the line',
      'Looking down',
    ],
  },
};

// =============================================================================
// FOUNDATION WORKOUTS
// =============================================================================

export const FOUNDATION_WORKOUTS: Record<string, FoundationWorkout> = {
  'spring-activation': {
    slug: 'spring-activation',
    name: 'Spring Activation',
    focus: 'Wake up foot muscles before practice',
    athleticGoal: 'Better ground feel, more responsive feet',
    duration: '8 minutes',
    warmup: ['30 seconds barefoot walking', '10 ankle circles each direction'],
    drills: ['toe-yoga', 'short-foot', 'barefoot-walks'],
    cooldown: ['30 seconds calf stretch each side'],
  },

  'ankle-power': {
    slug: 'ankle-power',
    name: 'Ankle Power Circuit',
    focus: 'Build explosive ankle stiffness',
    athleticGoal: 'Faster first step, higher jumps',
    duration: '12 minutes',
    warmup: ['Ankle alphabets each foot', '20 gentle calf raises'],
    drills: ['ankle-band-4-way', 'pogo-hops', 'single-leg-balance-reach'],
    cooldown: ['Ankle circles', 'Calf stretch', 'Toe spread hold'],
  },

  'complete-foundation': {
    slug: 'complete-foundation',
    name: 'Complete Foundation Builder',
    focus: 'Full foot + ankle development',
    athleticGoal: 'Total lower leg athletic performance',
    duration: '20 minutes',
    warmup: ['2 min barefoot walk', 'Ankle alphabets', '10 toe raises'],
    drills: [
      'toe-yoga',
      'short-foot',
      'towel-scrunches',
      'ankle-band-4-way',
      'pogo-hops',
      'single-leg-hop-stick',
    ],
    cooldown: ['Deep calf stretch', 'Plantar fascia roll', 'Toe yoga cool down'],
  },

  'pre-game-feet': {
    slug: 'pre-game-feet',
    name: 'Pre-Game Feet Activation',
    focus: 'Game-day preparation',
    athleticGoal: 'Maximize responsiveness for competition',
    duration: '6 minutes',
    warmup: ['Barefoot walk on court'],
    drills: ['toe-yoga', 'pogo-hops', 'lateral-line-hops'],
    cooldown: ['Light calf bounces'],
  },
};

// =============================================================================
// PROGRAMMATIC PAGES
// =============================================================================

export const FOUNDATION_PAGES: FoundationPage[] = [
  // SPORT-SPECIFIC
  {
    slug: 'basketball-foot-speed',
    title: 'Faster Feet for Basketball: The Ground Force System',
    metaDescription:
      'Build explosive basketball footwork through feet and ankle training. The science behind quick first steps and elite court movement.',
    targetKeywords: [
      'basketball footwork training',
      'faster feet basketball',
      'basketball agility feet',
    ],
    athleteType: 'Basketball players',
    sport: 'Basketball',
    problemSolved: 'Slow first step, heavy feet, getting beat on defense',
    performanceOutcome:
      'Quicker cuts, faster closeouts, explosive first step',
    drills: ['toe-yoga', 'pogo-hops', 'lateral-line-hops', 'single-leg-hop-stick'],
    workouts: ['pre-game-feet', 'ankle-power'],
  },
  {
    slug: 'soccer-ankle-acceleration',
    title: 'Soccer Speed Starts with Your Ankles',
    metaDescription:
      'Build the ankle power that drives soccer acceleration, cutting, and agility. Ground-up training for faster feet.',
    targetKeywords: [
      'soccer ankle training',
      'soccer speed drills',
      'soccer agility ankles',
    ],
    athleteType: 'Soccer players',
    sport: 'Soccer',
    problemSolved: 'Slow acceleration, weak cuts, frequent ankle rolls',
    performanceOutcome: 'Explosive push-off, sharper cuts, stable ankles',
    drills: [
      'ankle-band-4-way',
      'single-leg-balance-reach',
      'pogo-hops',
      'barefoot-walks',
    ],
    workouts: ['ankle-power'],
  },
  {
    slug: 'running-foot-spring',
    title: 'Run Faster with Stronger Foot Springs',
    metaDescription:
      'Unlock free speed by training your foot arch to work like a spring. The science of elastic running efficiency.',
    targetKeywords: [
      'foot strength running',
      'arch exercises runners',
      'foot spring running',
    ],
    athleteType: 'Runners',
    sport: 'Running',
    problemSolved: 'Heavy feet, foot fatigue, inefficient stride',
    performanceOutcome:
      'Lighter foot strike, better energy return, less fatigue',
    drills: ['short-foot', 'toe-yoga', 'barefoot-walks', 'towel-scrunches'],
    workouts: ['spring-activation'],
  },

  // AGE-SPECIFIC
  {
    slug: 'youth-foundation-8-10',
    title: 'Athletic Foundation for 8-10 Year Olds',
    metaDescription:
      'Build the foot and ankle foundation that powers all youth athletics. Age-appropriate exercises for developing athletes.',
    targetKeywords: [
      'youth foot exercises',
      'kids ankle training',
      'athletic foundation kids',
    ],
    athleteType: 'Young athletes',
    ageRange: '8-10',
    problemSolved: 'Weak feet from modern shoes, underdeveloped ankle control',
    performanceOutcome: 'Better balance, more body awareness, injury prevention',
    drills: [
      'toe-yoga',
      'marble-pickups',
      'barefoot-walks',
      'ankle-alphabets',
    ],
    workouts: ['spring-activation'],
  },
  {
    slug: 'teen-ankle-power',
    title: 'Ankle Power Training for Teen Athletes (13-16)',
    metaDescription:
      'The critical window for ankle stiffness development. Train during peak adaptation years for maximum athletic gains.',
    targetKeywords: [
      'teen ankle training',
      'adolescent foot exercises',
      'youth ankle power',
    ],
    athleteType: 'Teen athletes',
    ageRange: '13-16',
    problemSolved: 'Missing the ankle stiffness development window',
    performanceOutcome: 'Peak ankle power development, elite-level reactivity',
    drills: [
      'pogo-hops',
      'ankle-band-4-way',
      'single-leg-hop-stick',
      'lateral-line-hops',
    ],
    workouts: ['ankle-power', 'complete-foundation'],
  },

  // PAIN CLUSTERS (Important but not the focus)
  {
    slug: 'heel-pain-youth-athletes',
    title: "Youth Heel Pain: The Real Fix (Not Just Rest)",
    metaDescription:
      "Why youth heel pain (Sever's disease) keeps coming back and how to actually fix the system, not just rest it.",
    targetKeywords: [
      'youth heel pain',
      'Severs disease exercises',
      'kids heel pain treatment',
    ],
    athleteType: 'Youth athletes with heel pain',
    problemSolved: 'Chronic heel pain that keeps returning',
    performanceOutcome: 'Pain resolution AND better athletic performance',
    drills: ['ankle-alphabets', 'short-foot', 'ankle-band-4-way', 'barefoot-walks'],
    workouts: ['spring-activation'],
  },
  {
    slug: 'ankle-sprain-comeback',
    title: 'Ankle Sprain Comeback: Build Back Stronger',
    metaDescription:
      "Don't just recover from ankle sprains - come back with ankles that are more powerful and stable than before.",
    targetKeywords: [
      'ankle sprain recovery exercises',
      'ankle rehab athletes',
      'sprained ankle comeback',
    ],
    athleteType: 'Athletes recovering from ankle sprain',
    problemSolved: 'Recurring ankle sprains, fear of re-injury',
    performanceOutcome: 'Stronger ankles, zero fear, better than before',
    drills: [
      'single-leg-balance-reach',
      'ankle-band-4-way',
      'ankle-alphabets',
      'single-leg-hop-stick',
    ],
    workouts: ['ankle-power'],
  },
  {
    slug: 'flat-feet-athletes',
    title: 'Flat Feet? Build Your Own Arch',
    metaDescription:
      "Flat feet aren't a death sentence for athletes. Train your arch to work as the spring it's meant to be.",
    targetKeywords: [
      'flat feet exercises athletes',
      'arch strengthening sports',
      'flat feet sports training',
    ],
    athleteType: 'Athletes with flat feet',
    problemSolved: 'Lack of arch support, foot fatigue, "you need orthotics"',
    performanceOutcome: 'Functional arch, better spring, no orthotics needed',
    drills: ['short-foot', 'toe-yoga', 'towel-scrunches', 'marble-pickups'],
    workouts: ['spring-activation', 'complete-foundation'],
  },

  // INTEGRATED / GENERAL
  {
    slug: 'athletic-foundation-complete',
    title: 'The Complete Athletic Foundation Guide',
    metaDescription:
      'Everything you need to build elite feet and ankles. The ground-up system that powers all athletic movement.',
    targetKeywords: [
      'athletic foundation training',
      'foot ankle exercises athletes',
      'ground force training',
    ],
    athleteType: 'All athletes',
    problemSolved: 'Neglected foundation, underperforming feet and ankles',
    performanceOutcome: 'Elite-level ground force production',
    drills: [
      'toe-yoga',
      'short-foot',
      'ankle-band-4-way',
      'pogo-hops',
      'single-leg-hop-stick',
    ],
    workouts: ['spring-activation', 'ankle-power', 'complete-foundation'],
  },
];

// =============================================================================
// EXPORT HELPERS
// =============================================================================

export const getAllFoundationDrills = () => Object.values(FOUNDATION_DRILLS);
export const getAllFoundationWorkouts = () => Object.values(FOUNDATION_WORKOUTS);
export const getAllFoundationPages = () => FOUNDATION_PAGES;

export const getFoundationDrillBySlug = (slug: string) =>
  FOUNDATION_DRILLS[slug];
export const getFoundationWorkoutBySlug = (slug: string) =>
  FOUNDATION_WORKOUTS[slug];
export const getFoundationPageBySlug = (slug: string) =>
  FOUNDATION_PAGES.find((p) => p.slug === slug);
