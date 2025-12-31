import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all programs
export const getAllPrograms = query({
  handler: async (ctx) => {
    return await ctx.db.query("programs").collect();
  },
});

// Get program by slug
export const getProgramBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("programs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get program with weeks and lessons
export const getProgramWithContent = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const program = await ctx.db
      .query("programs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!program) return null;

    const weeks = await ctx.db
      .query("weeks")
      .withIndex("by_program", (q) => q.eq("programId", program._id))
      .collect();

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_program", (q) => q.eq("programId", program._id))
      .collect();

    // Organize lessons by week
    const weeksWithLessons = weeks.map((week) => ({
      ...week,
      lessons: lessons
        .filter((l) => l.weekId === week._id)
        .sort((a, b) => a.order - b.order),
    }));

    return {
      ...program,
      weeks: weeksWithLessons.sort((a, b) => a.weekNumber - b.weekNumber),
    };
  },
});

// Get lesson by slug
export const getLessonBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get all stacks
export const getAllStacks = query({
  handler: async (ctx) => {
    return await ctx.db.query("stacks").collect();
  },
});

// Get stack by slug
export const getStackBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stacks")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Seed Barefoot Reset program (run once)
export const seedBarefootReset = mutation({
  handler: async (ctx) => {
    // Check if already exists
    const existing = await ctx.db
      .query("programs")
      .withIndex("by_slug", (q) => q.eq("slug", "barefoot-reset"))
      .first();

    if (existing) {
      return { message: "Program already exists", programId: existing._id };
    }

    const now = Date.now();

    // Create program
    const programId = await ctx.db.insert("programs", {
      slug: "barefoot-reset",
      name: "Barefoot Reset",
      description:
        "Build your foundation with the 4-week protocol that fixes force leaks, improves absorption, and creates bulletproof ankles.",
      totalWeeks: 4,
      totalLessons: 20,
      accessLevel: "tripwire",
      createdAt: now,
    });

    // Week data
    const weeksData = [
      { number: 1, title: "Foundation", description: "Wake up your feet and build the tripod" },
      { number: 2, title: "Stability", description: "Build control under load" },
      { number: 3, title: "Elasticity", description: "Unlock your spring" },
      { number: 4, title: "Integration", description: "Put it all together" },
    ];

    // Lessons data
    const lessonsData = [
      // Week 1
      { week: 1, day: 1, title: "Tripod Activation", duration: "12 min" },
      { week: 1, day: 2, title: "Short Foot Mastery", duration: "10 min" },
      { week: 1, day: 3, title: "Single Leg Balance", duration: "12 min" },
      { week: 1, day: 4, title: "Ankle Mobility", duration: "10 min" },
      { week: 1, day: 5, title: "Week 1 Integration", duration: "15 min" },
      // Week 2
      { week: 2, day: 1, title: "Loaded Balance", duration: "12 min" },
      { week: 2, day: 2, title: "Band Resistance", duration: "10 min" },
      { week: 2, day: 3, title: "Eccentric Control", duration: "12 min" },
      { week: 2, day: 4, title: "Multi-Plane Stability", duration: "10 min" },
      { week: 2, day: 5, title: "Week 2 Integration", duration: "15 min" },
      // Week 3
      { week: 3, day: 1, title: "Plyometric Prep", duration: "12 min" },
      { week: 3, day: 2, title: "Rebound Mechanics", duration: "10 min" },
      { week: 3, day: 3, title: "Hop Progressions", duration: "12 min" },
      { week: 3, day: 4, title: "Elastic Loading", duration: "10 min" },
      { week: 3, day: 5, title: "Week 3 Integration", duration: "15 min" },
      // Week 4
      { week: 4, day: 1, title: "Sport Transfer", duration: "12 min" },
      { week: 4, day: 2, title: "Change of Direction", duration: "10 min" },
      { week: 4, day: 3, title: "Landing Mechanics", duration: "12 min" },
      { week: 4, day: 4, title: "Full Protocol", duration: "15 min" },
      { week: 4, day: 5, title: "Assessment & Next Steps", duration: "10 min" },
    ];

    // Create weeks
    const weekIds: Record<number, any> = {};
    for (const weekData of weeksData) {
      const weekId = await ctx.db.insert("weeks", {
        programId,
        weekNumber: weekData.number,
        title: weekData.title,
        description: weekData.description,
      });
      weekIds[weekData.number] = weekId;
    }

    // Create lessons
    let order = 0;
    for (const lessonData of lessonsData) {
      order++;
      await ctx.db.insert("lessons", {
        programId,
        weekId: weekIds[lessonData.week],
        slug: `w${lessonData.week}-d${lessonData.day}`,
        day: lessonData.day,
        title: lessonData.title,
        description: `Day ${lessonData.day} of Week ${lessonData.week}`,
        duration: lessonData.duration,
        steps: [],
        cues: [],
        order,
      });
    }

    return { message: "Program seeded successfully", programId };
  },
});

// Seed Bulletproof Ankles stack
export const seedBulletproofAnklesStack = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("stacks")
      .withIndex("by_slug", (q) => q.eq("slug", "bulletproof-ankles"))
      .first();

    if (existing) {
      return { message: "Stack already exists", stackId: existing._id };
    }

    const stackId = await ctx.db.insert("stacks", {
      slug: "bulletproof-ankles",
      name: "Bulletproof Ankles",
      description: "8-minute protocol for ankle stability and foot strength",
      duration: "8 min",
      exercises: [
        {
          name: "Tripod Foot Activation",
          duration: 60,
          instruction: "Stand barefoot. Press big toe, pinky toe, and heel into the floor equally.",
          cue: "Three points of contact. Soft grip.",
        },
        {
          name: "Short Foot Holds",
          duration: 45,
          instruction: "Without curling your toes, try to shorten your foot by pulling the ball toward your heel.",
          cue: "Dome the arch. No toe curling.",
          reps: "2 sets",
        },
        {
          name: "Single Leg Balance - Left",
          duration: 30,
          instruction: "Stand on your left foot. Keep your knee soft, not locked.",
          cue: "Quiet foot. Small corrections.",
        },
        {
          name: "Single Leg Balance - Right",
          duration: 30,
          instruction: "Stand on your right foot. Keep your knee soft, not locked.",
          cue: "Quiet foot. Small corrections.",
        },
        {
          name: "Ankle Circles - Left",
          duration: 40,
          instruction: "Lift your left foot. Draw slow, controlled circles with your ankle.",
          cue: "Full range. Smooth circles.",
          reps: "20 each way",
        },
        {
          name: "Ankle Circles - Right",
          duration: 40,
          instruction: "Lift your right foot. Draw slow, controlled circles with your ankle.",
          cue: "Full range. Smooth circles.",
          reps: "20 each way",
        },
        {
          name: "Slow Calf Raises",
          duration: 60,
          instruction: "Rise up on your toes slowly (3 seconds up). Pause at the top. Lower slowly.",
          cue: "3 up. Pause. 3 down.",
          reps: "10 reps",
        },
        {
          name: "Landing Prep",
          duration: 45,
          instruction: "Small jumps in place. Focus on landing softly and quietly.",
          cue: "Quiet landings. Absorb with your legs.",
          reps: "5 soft jumps",
        },
      ],
      accessLevel: "free",
    });

    return { message: "Stack seeded successfully", stackId };
  },
});
