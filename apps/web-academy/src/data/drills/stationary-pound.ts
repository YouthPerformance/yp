// ═══════════════════════════════════════════════════════════
// STATIONARY POUND - Pilot Drill for V3.1 "Skill Injector"
// Part of Silent Training pillar
// ═══════════════════════════════════════════════════════════

import { DrillV3, DRILL_AUTHORS } from "./drill-v3-types";

export const stationaryPoundDrill: DrillV3 = {
  // ═══════════════════════════════════════════════════════════
  // CORE IDENTITY
  // ═══════════════════════════════════════════════════════════
  id: "drill-stationary-pound-001",
  slug: "stationary-pound",
  title: "Stationary Pound",
  subtitle: "Foundation drill for silent ball control",
  definition:
    "The stationary pound builds ball control by training your fingertips to push the ball down with rhythm rather than slapping it. Standing still eliminates variables, letting you focus purely on hand-ball connection. This drill forms the foundation for all advanced dribbling—master it before adding movement.",

  sport: "basketball",
  category: "ball-handling",

  // ═══════════════════════════════════════════════════════════
  // TAGS
  // ═══════════════════════════════════════════════════════════
  tags: ["silent", "indoor", "no-hoop", "beginner", "solo"],

  // ═══════════════════════════════════════════════════════════
  // QUICK FACTS
  // ═══════════════════════════════════════════════════════════
  duration: "5-10 min",
  intensity: "low",
  equipment: ["Basketball"],
  space: "3×3 ft",
  level: "beginner",
  noiseLevel: "Silent",

  // ═══════════════════════════════════════════════════════════
  // QUICK SCAN
  // ═══════════════════════════════════════════════════════════
  trains: ["Ball control", "Fingertip strength", "Dribbling rhythm", "Hand-eye coordination"],
  useWhen: ["Limited space available", "Early morning training", "Apartment or shared space", "Building fundamentals"],
  scale: "Beginner → Advanced: Add crossovers, increase speed, close eyes",
  topMistake: "Looking at the ball instead of keeping your eyes up",

  // ═══════════════════════════════════════════════════════════
  // VIDEO
  // ═══════════════════════════════════════════════════════════
  videoUrl: "/videos/drills/stationary-pound.mp4",
  videoPoster: "/images/drills/stationary-pound-poster.jpg",
  videoDuration: "2:15",
  chapters: [
    { timestamp: "0:00", seconds: 0, title: "Setup", description: "Athletic stance and ball position" },
    { timestamp: "0:30", seconds: 30, title: "Right Hand", description: "Pound dribble technique" },
    { timestamp: "1:00", seconds: 60, title: "Left Hand", description: "Mirror the motion" },
    { timestamp: "1:30", seconds: 90, title: "Common Mistakes", description: "What to avoid" },
    { timestamp: "2:00", seconds: 120, title: "Level Up", description: "Add difficulty" },
  ],
  transcript: `Welcome to the Stationary Pound drill. This is the foundation of silent basketball training.

Start in an athletic stance—feet shoulder-width apart, knees bent, core engaged. Hold the basketball at waist height with your dominant hand.

Now, begin pounding the ball using your fingertips, not your palm. The key is to push the ball down, not slap it. Keep your wrist loose and let your fingers do the work.

Count to yourself: one, two, three, four. Establish a rhythm. The ball should return to your hand at the same height each time—below your knee.

Switch to your non-dominant hand. This will feel awkward at first—that's normal. Focus on the same fingertip contact and rhythm.

Common mistakes: Don't look at the ball. Keep your eyes up and forward. Don't straighten your legs—stay low in your athletic stance. Don't slap the ball—push it down with control.

To level up: close your eyes, increase your speed, or add a crossover between hands. Master this before moving to the walking pound.`,

  // ═══════════════════════════════════════════════════════════
  // HOW TO PERFORM
  // ═══════════════════════════════════════════════════════════
  steps: [
    {
      number: 1,
      title: "Set Your Stance",
      instruction:
        "Stand with feet shoulder-width apart, knees bent at 45 degrees, weight on the balls of your feet. This athletic stance is your home base for all dribbling drills.",
      duration: "Setup",
      coachingCue: "Imagine sitting in an invisible chair—that's how low you should be",
      commonMistake: "Standing too upright with locked knees",
      errorFix: "Drop your hips until you feel tension in your quads",
    },
    {
      number: 2,
      title: "Position the Ball",
      instruction:
        "Hold the ball at waist height with your dominant hand. Your fingers should be spread wide across the top of the ball, not cupped underneath. The ball rests on your fingertips, not your palm.",
      duration: "Setup",
      coachingCue: "Spread your fingers like you're palming a large grapefruit",
      commonMistake: "Letting the ball rest in your palm",
      errorFix: "Push your palm away from the ball—only fingertips touch",
    },
    {
      number: 3,
      title: "Begin the Pound",
      instruction:
        "Push the ball straight down using your fingertips. The ball should bounce and return to below knee height. Establish a steady rhythm—count 1-2-3-4 in your head. Complete 30 seconds with your dominant hand.",
      duration: "30 seconds each hand",
      coachingCue: "Push, don't slap. The motion comes from your wrist and fingers, not your arm.",
      commonMistake: "Slapping the ball with an open palm, creating noise",
      errorFix: "Focus on the fingertip push—the quieter the dribble, the better your technique",
    },
    {
      number: 4,
      title: "Switch Hands",
      instruction:
        "Transfer the ball to your non-dominant hand and repeat. This hand will feel less coordinated—that's the point. Give it equal attention. Complete 30 seconds, maintaining the same rhythm and height.",
      duration: "30 seconds",
      coachingCue: "Your weak hand needs twice the reps to catch up—embrace the struggle",
      commonMistake: "Rushing through weak hand work or reducing time",
      errorFix: "Set a timer and commit to equal practice for both hands",
    },
  ],

  // ═══════════════════════════════════════════════════════════
  // SUCCESS CRITERIA
  // ═══════════════════════════════════════════════════════════
  successLooksLike:
    "Ball bounces to the same height (below knee) every time. Your eyes stay forward, not on the ball. The dribble is nearly silent—no palm slapping. You maintain rhythm for the full 30 seconds without losing control.",
  advanceWhen:
    "You can complete 50 consecutive pounds with each hand without looking at the ball and without the ball bouncing above knee height.",

  // ═══════════════════════════════════════════════════════════
  // CUES
  // ═══════════════════════════════════════════════════════════
  doThis: "Push the ball down with your fingertips, keeping your wrist loose and eyes forward",
  dontDoThis: "Slap the ball with your palm or watch the ball while dribbling",
  focusOn: "The feel of the ball on your fingertips—train by touch, not by sight",

  // ═══════════════════════════════════════════════════════════
  // COMMON MISTAKES
  // ═══════════════════════════════════════════════════════════
  mistakes: [
    {
      id: "mistake-1",
      ifStatement: "If the ball makes a loud slapping sound...",
      cause: "You're hitting the ball with your palm instead of pushing with your fingertips",
      fix: "Exaggerate the fingertip contact. Imagine you're pushing the ball through the floor, not hitting it.",
    },
    {
      id: "mistake-2",
      ifStatement: "If the ball bounces too high (above your waist)...",
      cause: "You're pushing too hard or not staying low in your stance",
      fix: "Soften your push and drop lower in your athletic stance. The ball should never bounce higher than your hip.",
    },
    {
      id: "mistake-3",
      ifStatement: "If you keep losing control of the ball...",
      cause: "Your hand isn't centered on top of the ball, or you're dribbling too fast",
      fix: "Slow down and focus on hand position. Your middle finger should be at the ball's center.",
      relatedDrillSlug: "fingertip-push-ups",
      relatedDrillTitle: "Fingertip Push-Ups",
    },
    {
      id: "mistake-4",
      ifStatement: "If your arm gets tired quickly...",
      cause: "You're using your whole arm instead of your wrist and fingers",
      fix: "Keep your elbow relatively still. The motion should come from your wrist down.",
    },
  ],

  // ═══════════════════════════════════════════════════════════
  // BENCHMARKS
  // ═══════════════════════════════════════════════════════════
  benchmarks: [
    {
      level: "beginner",
      levelLabel: "Beginner",
      goal: "30 consecutive pounds per hand",
      sets: "3 sets of 30 seconds each hand",
      advanceWhen: "Complete 3 sessions without losing control",
    },
    {
      level: "intermediate",
      levelLabel: "Intermediate",
      goal: "50 consecutive pounds, eyes up",
      sets: "3 sets of 45 seconds each hand",
      advanceWhen: "Complete without looking at the ball",
    },
    {
      level: "advanced",
      levelLabel: "Advanced",
      goal: "100 consecutive pounds, eyes closed",
      sets: "3 sets of 60 seconds each hand",
      advanceWhen: "Complete with eyes closed for full duration",
    },
    {
      level: "elite",
      levelLabel: "Elite",
      goal: "Add crossover every 10 pounds",
      sets: "3 sets of 90 seconds alternating",
      advanceWhen: "Seamless crossovers with rhythm maintained",
    },
  ],

  // ═══════════════════════════════════════════════════════════
  // PROGRESSIONS
  // ═══════════════════════════════════════════════════════════
  previousDrill: undefined, // This is the entry point
  nextDrill: {
    slug: "walking-pound",
    title: "Walking Pound",
    thumbnail: "/images/drills/walking-pound-thumb.jpg",
  },

  // ═══════════════════════════════════════════════════════════
  // RELATED DRILLS
  // ═══════════════════════════════════════════════════════════
  relatedDrills: [
    {
      slug: "fingertip-push-ups",
      title: "Fingertip Push-Ups",
      relationship: "prerequisite",
      relationshipLabel: "Build finger strength first",
      thumbnail: "/images/drills/fingertip-pushups-thumb.jpg",
    },
    {
      slug: "walking-pound",
      title: "Walking Pound",
      relationship: "progression",
      relationshipLabel: "Next step",
      thumbnail: "/images/drills/walking-pound-thumb.jpg",
    },
    {
      slug: "figure-eight-stationary",
      title: "Figure Eight (Stationary)",
      relationship: "similar",
      relationshipLabel: "Similar difficulty",
      thumbnail: "/images/drills/figure-eight-thumb.jpg",
    },
    {
      slug: "two-ball-pound",
      title: "Two Ball Pound",
      relationship: "alternative",
      relationshipLabel: "Challenge variation",
      thumbnail: "/images/drills/two-ball-pound-thumb.jpg",
    },
  ],

  // ═══════════════════════════════════════════════════════════
  // PARENT PILLAR
  // ═══════════════════════════════════════════════════════════
  parentPillar: {
    slug: "silent-training",
    title: "Silent Training",
    sport: "basketball",
    category: "ball-handling",
    description:
      "Master ball control without making a sound. Perfect for apartment training, early morning sessions, or building elite touch.",
  },

  // ═══════════════════════════════════════════════════════════
  // EDITORIAL METADATA
  // ═══════════════════════════════════════════════════════════
  author: DRILL_AUTHORS.ADAM,
  reviewedBy: "James Scott",
  lastUpdated: "2026-01-28",
  publishedAt: "2026-01-28",

  // ═══════════════════════════════════════════════════════════
  // SEO & AI OPTIMIZATION
  // ═══════════════════════════════════════════════════════════
  metaTitle: "Stationary Pound Drill — Silent Basketball Training | YouthPerformance",
  metaDescription:
    "Learn the stationary pound, the foundation drill for silent basketball training. Build fingertip control, rhythm, and hand-eye coordination without making noise. Perfect for apartment training.",
  keywords: [
    "stationary pound drill",
    "silent basketball drills",
    "quiet dribbling practice",
    "basketball ball handling",
    "apartment basketball training",
    "indoor basketball drills",
    "beginner dribbling drills",
    "fingertip dribbling",
  ],
  canonicalUrl: "https://app.youthperformance.com/drills/basketball/ball-handling/stationary-pound",

  schemaOrg: {
    estimatedDuration: "PT10M",
    skillLevel: "Beginner",
  },

  apiEndpoint: "/api/drills/stationary-pound",
  markdownUrl: "/drills/stationary-pound.md",

  // ═══════════════════════════════════════════════════════════
  // STATUS
  // ═══════════════════════════════════════════════════════════
  status: "published",
};

export default stationaryPoundDrill;
