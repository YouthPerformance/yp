// ═══════════════════════════════════════════════════════════
// SAMPLE DRILL DATA
// Seed data for programmatic SEO pages
// ═══════════════════════════════════════════════════════════

import type { Drill, AgeGroup, Constraint } from "./types";

export const SAMPLE_DRILLS: Drill[] = [
  // ─────────────────────────────────────────────────────────
  // BASKETBALL - SHOOTING
  // ─────────────────────────────────────────────────────────
  {
    id: "bball-form-shooting-1",
    slug: "basketball-shooting-form-shooting-basics",
    title: "Form Shooting Basics",
    subtitle: "Build perfect shooting mechanics from the ground up",
    sport: "basketball",
    category: "shooting",
    ageGroups: ["8-10", "10-12", "12-14"],
    constraints: ["no-equipment", "indoor", "solo", "5-minutes", "beginner"],
    description:
      "The foundation of every great shooter. This drill focuses on proper hand placement, elbow alignment, and follow-through using a wall or close-range shots.",
    benefits: [
      "Develops muscle memory for proper form",
      "Eliminates bad habits early",
      "Builds confidence through repetition",
      "Can be done anywhere, anytime",
    ],
    equipment: ["Basketball", "Wall or basket"],
    duration: "5-10 minutes",
    difficulty: "beginner",
    warmup: "10 wrist flicks, 10 elbow extensions without the ball",
    steps: [
      {
        order: 1,
        instruction: "Stand 2-3 feet from a wall or directly under the basket",
        coachingCue: "Feet shoulder-width apart, knees slightly bent",
        commonMistake: "Standing too far away - this drill is about form, not distance",
      },
      {
        order: 2,
        instruction: "Hold the ball in your shooting hand only, balanced on your fingertips",
        duration: "Hold for 5 seconds",
        coachingCue: "Ball should NOT touch your palm",
        commonMistake: "Letting the ball rest in your palm kills your touch",
      },
      {
        order: 3,
        instruction: "Shooting elbow directly under the ball, forming an L-shape",
        coachingCue: "Elbow in, not chicken-winged out",
      },
      {
        order: 4,
        instruction:
          "Push the ball up and out, snapping your wrist. Hold your follow-through for 2 seconds.",
        duration: "20 reps",
        coachingCue: "Cookie jar - reach into the cookie jar on the top shelf",
        commonMistake: "Dropping your guide hand too early",
      },
      {
        order: 5,
        instruction: "Add your guide hand. It just guides - no pushing!",
        duration: "20 reps",
        coachingCue: "Guide hand stays still, thumb points to the ceiling at release",
      },
    ],
    cooldown: "10 free throws focusing on the same form",
    variations: [
      {
        name: "One-Hand Wall Shots",
        description: "Shoot against a wall, catching your own rebound. Focus only on the snap.",
        difficulty: "easier",
      },
      {
        name: "Eyes Closed",
        description: "Close your eyes and feel the shot. Trust the form.",
        difficulty: "harder",
      },
    ],
    author: "ADAM",
    reviewedBy: "James Scott",
    sources: [
      "Shot Science - Pro Shooting Mechanics",
      "NBA Shooting Coaches Association Guidelines",
    ],
    relatedDrills: ["bball-free-throw-routine-1", "bball-one-hand-flicks"],
    keywords: [
      "basketball shooting form",
      "youth basketball shooting",
      "form shooting drill",
      "basketball mechanics",
      "shooting for beginners",
    ],
    status: "published",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },

  {
    id: "bball-mikan-drill",
    slug: "basketball-shooting-mikan-drill",
    title: "Mikan Drill",
    subtitle: "The classic big man finishing drill",
    sport: "basketball",
    category: "shooting",
    ageGroups: ["10-12", "12-14", "14-16", "16-18"],
    constraints: ["indoor", "solo", "5-minutes", "beginner"],
    description:
      "Named after George Mikan, this drill develops soft touch and footwork around the basket. Essential for any player who wants to finish inside.",
    benefits: [
      "Develops soft touch around the rim",
      "Improves footwork and coordination",
      "Builds ambidexterity - both hands",
      "Great warm-up before practice",
    ],
    equipment: ["Basketball", "Basket"],
    duration: "5 minutes",
    difficulty: "beginner",
    steps: [
      {
        order: 1,
        instruction: "Start on the right side of the basket, ball in your right hand",
        coachingCue: "Close to the basket - you should almost be able to touch the rim",
      },
      {
        order: 2,
        instruction: "Step with your inside foot (left) and lay the ball off the backboard",
        coachingCue: "High off the glass, soft touch",
        commonMistake: "Jumping too far away from the basket",
      },
      {
        order: 3,
        instruction:
          "Catch your own rebound, land on two feet, then repeat on the left side with your left hand",
        duration: "Continuous for 30 seconds",
        coachingCue: "Two feet, then push off inside foot",
      },
      {
        order: 4,
        instruction: "Continue alternating sides without letting the ball touch the ground",
        duration: "3 sets of 30 seconds",
        coachingCue: "Quick feet, soft hands, use the glass",
      },
    ],
    variations: [
      {
        name: "Reverse Mikan",
        description: "Reverse layups on both sides instead of regular layups",
        difficulty: "harder",
      },
      {
        name: "Power Mikan",
        description: "Jump off two feet on both sides for power finishes",
        difficulty: "harder",
      },
    ],
    author: "ADAM",
    keywords: [
      "mikan drill",
      "basketball finishing",
      "layup drill",
      "post moves",
      "basketball fundamentals",
    ],
    status: "published",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },

  // ─────────────────────────────────────────────────────────
  // BASKETBALL - BALL HANDLING
  // ─────────────────────────────────────────────────────────
  {
    id: "bball-stationary-dribble-series",
    slug: "basketball-ball-handling-stationary-dribble-series",
    title: "Stationary Dribble Series",
    subtitle: "The foundation of ball handling",
    sport: "basketball",
    category: "ball-handling",
    ageGroups: ["6-8", "8-10", "10-12"],
    constraints: ["no-equipment", "indoor", "outdoor", "solo", "5-minutes", "beginner"],
    description:
      "Every great ball handler masters these stationary drills first. This series develops hand-eye coordination, touch, and control before adding movement.",
    benefits: [
      "Builds fundamental ball control",
      "Develops both hands equally",
      "Creates muscle memory",
      "Can be done in small spaces",
    ],
    equipment: ["Basketball"],
    duration: "5-10 minutes",
    difficulty: "beginner",
    steps: [
      {
        order: 1,
        instruction: "Low pound dribble - dribble as low and hard as possible",
        duration: "30 seconds each hand",
        coachingCue: "Ball should bounce back to your hand instantly",
        commonMistake: "Looking at the ball - eyes up!",
      },
      {
        order: 2,
        instruction: "High pound dribble - dribble waist-high with power",
        duration: "30 seconds each hand",
        coachingCue: "Push down hard, the ball will come back up",
      },
      {
        order: 3,
        instruction: "Front crossover - dribble in front of your body from hand to hand",
        duration: "30 seconds",
        coachingCue: "Low and quick, ball stays below your knees",
      },
      {
        order: 4,
        instruction: "Between the legs - alternate legs each dribble",
        duration: "30 seconds",
        coachingCue: "Step forward with opposite foot",
      },
      {
        order: 5,
        instruction: "Behind the back - wrap the ball around your back",
        duration: "30 seconds",
        coachingCue: "Push the ball with your fingertips, not your palm",
      },
    ],
    variations: [
      {
        name: "Two Ball",
        description: "Do all moves with two balls simultaneously",
        difficulty: "harder",
      },
      {
        name: "Tennis Ball Combo",
        description: "Hold a tennis ball in one hand while dribbling with the other",
        difficulty: "harder",
      },
    ],
    author: "ADAM",
    keywords: [
      "basketball dribbling",
      "ball handling drills",
      "youth basketball",
      "crossover drill",
      "dribbling for beginners",
    ],
    status: "published",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },

  // ─────────────────────────────────────────────────────────
  // GENERAL - ANKLE MOBILITY (James Scott)
  // ─────────────────────────────────────────────────────────
  {
    id: "gen-ankle-circles",
    slug: "general-ankle-mobility-ankle-circles",
    title: "Ankle Circles",
    subtitle: "The simplest way to unlock ankle mobility",
    sport: "general",
    category: "ankle-mobility",
    ageGroups: ["6-8", "8-10", "10-12", "12-14", "14-16", "16-18", "adult"],
    constraints: ["no-equipment", "indoor", "outdoor", "solo", "5-minutes", "beginner"],
    description:
      "Ankle circles are the foundation of ankle mobility work. This simple drill activates the ankle joint through its full range of motion, preparing it for more demanding movements.",
    benefits: [
      "Increases ankle range of motion",
      "Activates the muscles around the ankle",
      "Reduces injury risk",
      "Great warm-up before any activity",
    ],
    equipment: [],
    duration: "2-3 minutes",
    difficulty: "beginner",
    steps: [
      {
        order: 1,
        instruction: "Stand on one leg (hold onto something for balance if needed)",
        coachingCue: "Standing leg stays strong and stable",
      },
      {
        order: 2,
        instruction: "Lift the other foot slightly off the ground",
        coachingCue: "Just a few inches - you don't need to lift high",
      },
      {
        order: 3,
        instruction:
          "Draw slow, controlled circles with your toes, rotating from the ankle joint",
        duration: "10 circles clockwise",
        coachingCue: "Make the circles as big as your ankle allows - push the range",
        commonMistake: "Moving too fast - slow is better",
      },
      {
        order: 4,
        instruction: "Reverse direction",
        duration: "10 circles counter-clockwise",
      },
      {
        order: 5,
        instruction: "Switch legs and repeat",
        duration: "10 circles each direction",
      },
    ],
    variations: [
      {
        name: "Seated Ankle Circles",
        description:
          "Sit on a chair with your foot off the ground. Easier for those with balance issues.",
        difficulty: "easier",
      },
      {
        name: "Alphabet Ankles",
        description: "Draw the entire alphabet with your big toe. Takes longer but covers all angles.",
        difficulty: "harder",
      },
    ],
    author: "JAMES",
    sources: ["Barefoot Training Principles", "Functional Range Conditioning"],
    keywords: [
      "ankle mobility",
      "ankle circles",
      "ankle warm-up",
      "injury prevention",
      "barefoot training",
    ],
    status: "published",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },

  {
    id: "gen-calf-raises-barefoot",
    slug: "general-ankle-mobility-barefoot-calf-raises",
    title: "Barefoot Calf Raises",
    subtitle: "Build bulletproof ankles from the ground up",
    sport: "general",
    category: "ankle-mobility",
    ageGroups: ["8-10", "10-12", "12-14", "14-16", "16-18", "adult"],
    constraints: ["no-equipment", "indoor", "outdoor", "solo", "5-minutes", "beginner"],
    description:
      "Barefoot calf raises strengthen the entire lower leg complex while improving ankle stability. This is a foundational drill for injury prevention.",
    benefits: [
      "Strengthens calf muscles",
      "Improves ankle stability",
      "Activates intrinsic foot muscles",
      "Builds foundation for plyometrics",
    ],
    equipment: ["Elevated surface optional (step, curb)"],
    duration: "5 minutes",
    difficulty: "beginner",
    steps: [
      {
        order: 1,
        instruction: "Stand barefoot on flat ground, feet hip-width apart",
        coachingCue: "Feel the ground with your whole foot",
      },
      {
        order: 2,
        instruction: "Slowly rise up onto your toes, lifting your heels as high as possible",
        duration: "2-3 seconds up",
        coachingCue: "Imagine a string pulling you up from the top of your head",
        commonMistake: "Bouncing - control the movement",
      },
      {
        order: 3,
        instruction: "Pause at the top for 1 second",
        coachingCue: "Squeeze your calves at the peak",
      },
      {
        order: 4,
        instruction: "Slowly lower back down",
        duration: "3-4 seconds down",
        coachingCue: "The slow lowering (eccentric) is where the strength is built",
      },
      {
        order: 5,
        instruction: "Repeat for 15-20 reps",
        duration: "3 sets",
      },
    ],
    variations: [
      {
        name: "Single Leg Calf Raises",
        description: "Perform on one leg for increased intensity and balance challenge",
        difficulty: "harder",
      },
      {
        name: "Deficit Calf Raises",
        description: "Stand on a step with heels hanging off for increased range of motion",
        difficulty: "harder",
      },
    ],
    author: "JAMES",
    sources: ["Barefoot Strong", "Sports Science Research on Ankle Injuries"],
    keywords: [
      "calf raises",
      "ankle strength",
      "barefoot training",
      "injury prevention",
      "lower leg workout",
    ],
    status: "published",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },

  // ─────────────────────────────────────────────────────────
  // SOCCER - DRIBBLING
  // ─────────────────────────────────────────────────────────
  {
    id: "soccer-toe-taps",
    slug: "soccer-dribbling-toe-taps",
    title: "Toe Taps",
    subtitle: "The foundation of soccer ball control",
    sport: "soccer",
    category: "dribbling",
    ageGroups: ["6-8", "8-10", "10-12"],
    constraints: ["solo", "5-minutes", "beginner", "indoor", "outdoor"],
    description:
      "Toe taps develop the quick feet and light touch essential for soccer dribbling. This drill trains your feet to stay active and ready.",
    benefits: [
      "Develops quick feet",
      "Improves ball control",
      "Builds coordination",
      "Great warm-up drill",
    ],
    equipment: ["Soccer ball"],
    duration: "3-5 minutes",
    difficulty: "beginner",
    steps: [
      {
        order: 1,
        instruction: "Stand with the ball in front of you",
        coachingCue: "Athletic stance - knees slightly bent",
      },
      {
        order: 2,
        instruction:
          "Lightly tap the top of the ball with the sole of your right foot, then quickly switch to your left foot",
        duration: "30 seconds",
        coachingCue: "Stay on your toes, light and quick",
        commonMistake: "Pressing too hard on the ball - you want light taps",
      },
      {
        order: 3,
        instruction: "Continue alternating feet as fast as you can while staying in control",
        duration: "3 sets of 30 seconds",
        coachingCue: "The ball should barely move - your feet are dancing on top of it",
      },
    ],
    variations: [
      {
        name: "Traveling Toe Taps",
        description: "Move forward while toe tapping, pushing the ball slightly ahead",
        difficulty: "harder",
      },
      {
        name: "Toe Tap Spins",
        description: "Rotate 360 degrees while maintaining toe taps",
        difficulty: "harder",
      },
    ],
    author: "TEAM_YP",
    keywords: [
      "soccer toe taps",
      "ball control",
      "youth soccer",
      "dribbling drill",
      "soccer warm-up",
    ],
    status: "published",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────────
// DRILL ACCESS FUNCTIONS
// ─────────────────────────────────────────────────────────────

export function getDrillById(id: string): Drill | undefined {
  return SAMPLE_DRILLS.find((d) => d.id === id);
}

export function getDrillBySlug(slug: string): Drill | undefined {
  return SAMPLE_DRILLS.find((d) => d.slug === slug);
}

export function getDrillsBySport(sport: string): Drill[] {
  return SAMPLE_DRILLS.filter((d) => d.sport === sport && d.status === "published");
}

export function getDrillsByCategory(sport: string, category: string): Drill[] {
  return SAMPLE_DRILLS.filter(
    (d) => d.sport === sport && d.category === category && d.status === "published"
  );
}

export function getDrillsByFilters(filters: {
  sport?: string;
  category?: string;
  ageGroup?: string;
  constraint?: string;
}): Drill[] {
  return SAMPLE_DRILLS.filter((drill) => {
    if (drill.status !== "published") return false;
    if (filters.sport && drill.sport !== filters.sport) return false;
    if (filters.category && drill.category !== filters.category) return false;
    if (filters.ageGroup && !drill.ageGroups.includes(filters.ageGroup as any)) return false;
    if (filters.constraint && !drill.constraints.includes(filters.constraint as any)) return false;
    return true;
  });
}

export function getAvailableCategories(sport: string): string[] {
  const categories = new Set<string>();
  SAMPLE_DRILLS.filter((d) => d.sport === sport && d.status === "published").forEach((d) =>
    categories.add(d.category)
  );
  return Array.from(categories);
}

export function getAvailableAgeGroups(sport: string, category?: string): AgeGroup[] {
  const ageGroups = new Set<AgeGroup>();
  SAMPLE_DRILLS.filter(
    (d) =>
      d.sport === sport &&
      d.status === "published" &&
      (!category || d.category === category)
  ).forEach((d) => d.ageGroups.forEach((ag) => ageGroups.add(ag)));
  return Array.from(ageGroups);
}

export function getAvailableConstraints(sport: string, category?: string): Constraint[] {
  const constraints = new Set<Constraint>();
  SAMPLE_DRILLS.filter(
    (d) =>
      d.sport === sport &&
      d.status === "published" &&
      (!category || d.category === category)
  ).forEach((d) => d.constraints.forEach((c) => constraints.add(c)));
  return Array.from(constraints);
}
