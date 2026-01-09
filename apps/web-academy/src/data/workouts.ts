// ═══════════════════════════════════════════════════════════
// BAREFOOT RESET WORKOUT DATA
// 42-Day Durability Program
// ═══════════════════════════════════════════════════════════

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration?: number; // seconds (for timed exercises)
  reps?: number; // for rep-based exercises
  sets?: number;
  restBetweenSets?: number; // seconds
  videoUrl?: string;
  thumbnailUrl?: string;
  cues: string[]; // coaching cues
  targetArea: "feet" | "ankles" | "calves" | "full-lower" | "mobility";
  difficulty: 1 | 2 | 3; // 1=beginner, 2=intermediate, 3=advanced
}

export interface WorkoutDay {
  day: number;
  title: string;
  subtitle: string;
  description: string;
  totalDuration: number; // minutes
  xpReward: number;
  isBossDay: boolean;
  bossName?: string;
  exercises: Exercise[];
  warmup: Exercise[];
  cooldown: Exercise[];
}

// ─────────────────────────────────────────────────────────────
// DAY 1: DIAGNOSTIC SCAN
// Purpose: Assess baseline foot strength and mobility
// ─────────────────────────────────────────────────────────────

export const DAY_1_DIAGNOSTIC_SCAN: WorkoutDay = {
  day: 1,
  title: "Diagnostic Scan",
  subtitle: "Assess Your Foundation",
  description:
    "Today we discover where you are. This diagnostic scan tests your foot strength, ankle mobility, and balance. No judgment—just data.",
  totalDuration: 15,
  xpReward: 50,
  isBossDay: false,

  warmup: [
    {
      id: "w1-toe-wiggles",
      name: "Toe Wiggles",
      description: "Wake up your feet by spreading and wiggling all 10 toes",
      duration: 30,
      cues: [
        "Spread toes as wide as possible",
        "Wiggle each toe individually",
        "Feel the muscles in your foot arch activate",
      ],
      targetArea: "feet",
      difficulty: 1,
    },
    {
      id: "w1-ankle-circles",
      name: "Ankle Circles",
      description: "Rotate each ankle in full circles to mobilize the joint",
      duration: 30,
      reps: 10,
      cues: [
        "10 circles clockwise, then 10 counter-clockwise",
        "Make the biggest circles possible",
        "Keep your leg still—only the ankle moves",
      ],
      targetArea: "ankles",
      difficulty: 1,
    },
  ],

  exercises: [
    {
      id: "d1-single-leg-balance",
      name: "Single Leg Balance Test",
      description: "Stand on one foot with eyes open. How long can you hold it?",
      duration: 30,
      sets: 2,
      restBetweenSets: 10,
      cues: [
        "Stand tall, core engaged",
        "Fix your gaze on a point ahead",
        "If you wobble, that's data—not failure",
        "Note which leg feels stronger",
      ],
      targetArea: "full-lower",
      difficulty: 1,
    },
    {
      id: "d1-toe-yoga",
      name: "Toe Yoga",
      description: "Lift your big toe while pressing other 4 down, then reverse",
      duration: 60,
      reps: 10,
      cues: [
        "Big toe UP, little toes DOWN",
        "Then big toe DOWN, little toes UP",
        "This is hard! Most people can't do it at first",
        "Focus on the mind-muscle connection",
      ],
      targetArea: "feet",
      difficulty: 2,
    },
    {
      id: "d1-calf-raise-test",
      name: "Single Leg Calf Raise Test",
      description: "How many single-leg calf raises can you do with good form?",
      reps: 25,
      sets: 1,
      cues: [
        "Rise up on the ball of your foot",
        "Full range: heel to tippy-toe",
        "Stop when form breaks down",
        "Record your max reps for each leg",
      ],
      targetArea: "calves",
      difficulty: 2,
    },
    {
      id: "d1-deep-squat-hold",
      name: "Deep Squat Hold",
      description: "Sit in the deepest squat you can with heels down",
      duration: 60,
      cues: [
        "Heels stay on the ground",
        "Chest up, back straight",
        "If heels lift, note it—we'll fix this",
        "Breathe deeply and relax into it",
      ],
      targetArea: "ankles",
      difficulty: 2,
    },
    {
      id: "d1-short-foot",
      name: "Short Foot Activation",
      description: "Create an arch by pulling the ball of your foot toward your heel",
      duration: 45,
      reps: 10,
      cues: [
        "Don't curl your toes",
        "Imagine shortening your foot",
        "Your arch should rise",
        "This activates intrinsic foot muscles",
      ],
      targetArea: "feet",
      difficulty: 2,
    },
    {
      id: "d1-wall-ankle-test",
      name: "Wall Ankle Mobility Test",
      description: "Knee-to-wall test to measure ankle dorsiflexion",
      reps: 5,
      sets: 2,
      cues: [
        "Face wall, foot 4 inches away",
        "Touch knee to wall without heel lifting",
        "Move foot back until heel just stays down",
        "Measure distance from toe to wall",
      ],
      targetArea: "ankles",
      difficulty: 1,
    },
  ],

  cooldown: [
    {
      id: "c1-foot-massage",
      name: "Foot Self-Massage",
      description: "Roll out the bottom of each foot with a ball or your thumb",
      duration: 60,
      cues: [
        "Apply firm pressure",
        "Roll from heel to toe",
        "Spend extra time on tight spots",
        "Breathe and relax",
      ],
      targetArea: "feet",
      difficulty: 1,
    },
    {
      id: "c1-calf-stretch",
      name: "Standing Calf Stretch",
      description: "Classic wall stretch for gastrocnemius and soleus",
      duration: 30,
      sets: 2,
      cues: [
        "Back leg straight for gastroc",
        "Back leg bent for soleus",
        "Hold each for 30 seconds",
        "Breathe into the stretch",
      ],
      targetArea: "calves",
      difficulty: 1,
    },
  ],
};

// Export all workouts
export const WORKOUTS: Record<number, WorkoutDay> = {
  1: DAY_1_DIAGNOSTIC_SCAN,
  // Days 2-42 would be added here
};

export function getWorkout(day: number): WorkoutDay | undefined {
  return WORKOUTS[day];
}
