// Lane-Specific 8-Minute Stacks
// Each lane has a specialized stack based on user goals
// Safety-first design: Return lane has no jumps, Silent lane has no loud movements

import { DRILLS } from "./drills";

// Helper to build exercise from drill with overrides
const buildExercise = (drillId, overrides = {}) => {
  const drill = DRILLS[drillId];
  if (!drill) {
    console.warn(`Drill not found: ${drillId}`);
    return null;
  }
  return {
    id: drillId,
    name: drill.name,
    duration: drill.defaultDuration,
    instruction: drill.instruction,
    cue: drill.cue,
    safetyNote: drill.safetyNote,
    reps: drill.defaultReps,
    sets: drill.defaultSets,
    ...overrides,
  };
};

export const LANE_STACKS = {
  // === STACK_BASE_8: Base Stability - "Seal the Base" ===
  STACK_BASE_8: {
    id: "STACK_BASE_8",
    name: "Base Stability",
    tagline: "Seal the Base",
    description: "Build ankle stability and foot strength. The foundation for everything else.",
    duration: "8 min",
    lane: "base_lane",
    exercises: [
      buildExercise("tripod_activation", { duration: 60 }),
      buildExercise("short_foot_holds", { duration: 45, label: "Short Foot Holds (Set 1)" }),
      buildExercise("short_foot_holds", {
        duration: 45,
        label: "Short Foot Holds (Set 2)",
        id: "short_foot_holds_2",
      }),
      buildExercise("single_leg_balance", {
        duration: 30,
        label: "Single Leg Balance - Left",
        side: "left",
      }),
      buildExercise("single_leg_balance", {
        duration: 30,
        label: "Single Leg Balance - Right",
        side: "right",
        id: "single_leg_balance_right",
      }),
      buildExercise("calf_raises_slow", { duration: 60, reps: "10 reps" }),
      buildExercise("ankle_circles", { duration: 40, label: "Ankle Circles - Left", side: "left" }),
      buildExercise("ankle_circles", {
        duration: 40,
        label: "Ankle Circles - Right",
        side: "right",
        id: "ankle_circles_right",
      }),
      buildExercise("landing_prep", { duration: 45, reps: "5 soft jumps" }),
    ].filter(Boolean),
  },

  // === STACK_QUIET_8: Quiet Landing - "Soft + Controlled" ===
  STACK_QUIET_8: {
    id: "STACK_QUIET_8",
    name: "Quiet Landing",
    tagline: "Soft + Controlled",
    description: "Master absorption and quiet landings. Less slam, better control.",
    duration: "8 min",
    lane: "quiet_lane",
    exercises: [
      buildExercise("tripod_activation", { duration: 45 }),
      buildExercise("short_foot_holds", { duration: 30, label: "Short Foot Holds (Set 1)" }),
      buildExercise("short_foot_holds", {
        duration: 30,
        label: "Short Foot Holds (Set 2)",
        id: "short_foot_holds_2",
      }),
      buildExercise("toe_heel_rockers", { duration: 45 }),
      buildExercise("single_leg_balance", {
        duration: 20,
        label: "Single Leg Balance - Left",
        side: "left",
      }),
      buildExercise("single_leg_balance", {
        duration: 20,
        label: "Single Leg Balance - Right",
        side: "right",
        id: "single_leg_balance_right",
      }),
      buildExercise("silent_step_downs", { duration: 45, reps: "5 each side" }),
      buildExercise("landing_prep", { duration: 45, reps: "5 soft jumps" }),
    ].filter(Boolean),
  },

  // === STACK_SPEED_8: Speed - "Quick Off the Floor" ===
  STACK_SPEED_8: {
    id: "STACK_SPEED_8",
    name: "Speed",
    tagline: "Quick Off the Floor",
    description: "Faster first step, sharper cuts, cleaner stops.",
    duration: "8 min",
    lane: "speed_lane",
    exercises: [
      buildExercise("tripod_activation", { duration: 45 }),
      buildExercise("short_foot_holds", { duration: 30, label: "Short Foot Holds (Set 1)" }),
      buildExercise("short_foot_holds", {
        duration: 30,
        label: "Short Foot Holds (Set 2)",
        id: "short_foot_holds_2",
      }),
      buildExercise("calf_raises_slow", { duration: 60, reps: "10 reps" }),
      buildExercise("fast_feet", { duration: 20, label: "Fast Feet (Set 1)" }),
      buildExercise("fast_feet", { duration: 20, label: "Fast Feet (Set 2)", id: "fast_feet_2" }),
      buildExercise("stick_the_stop", {
        duration: 45,
        label: "Stick the Stop - Left",
        side: "left",
      }),
      buildExercise("stick_the_stop", {
        duration: 45,
        label: "Stick the Stop - Right",
        side: "right",
        id: "stick_the_stop_right",
      }),
    ].filter(Boolean),
  },

  // === STACK_JUMP_8: Jump & Land - "Bounce Safely" ===
  STACK_JUMP_8: {
    id: "STACK_JUMP_8",
    name: "Jump & Land",
    tagline: "Bounce Safely",
    description: "Build bounce with clean takeoff and safe landings.",
    duration: "8 min",
    lane: "jump_lane",
    exercises: [
      buildExercise("tripod_activation", { duration: 45 }),
      buildExercise("short_foot_holds", { duration: 30, label: "Short Foot Holds (Set 1)" }),
      buildExercise("short_foot_holds", {
        duration: 30,
        label: "Short Foot Holds (Set 2)",
        id: "short_foot_holds_2",
      }),
      buildExercise("calf_raises_slow", { duration: 60, reps: "10 reps" }),
      buildExercise("landing_prep", { duration: 45, reps: "5 soft jumps" }),
      buildExercise("snap_down", { duration: 45, reps: "3 reps" }),
      buildExercise("landing_prep", {
        duration: 45,
        reps: "5 more soft jumps",
        id: "landing_prep_2",
      }),
    ].filter(Boolean),
  },

  // === STACK_SILENT_8: Silent Stack - "Apartment Friendly" ===
  STACK_SILENT_8: {
    id: "STACK_SILENT_8",
    name: "Silent Stack",
    tagline: "Apartment Friendly",
    description: "Low-impact, quiet reps. No jumps. No loud steps. Perfect for small spaces.",
    duration: "8 min",
    lane: "silent_lane",
    noJumps: true,
    exercises: [
      buildExercise("tripod_activation", { duration: 60 }),
      buildExercise("short_foot_holds", { duration: 45, label: "Short Foot Holds (Set 1)" }),
      buildExercise("short_foot_holds", {
        duration: 45,
        label: "Short Foot Holds (Set 2)",
        id: "short_foot_holds_2",
      }),
      buildExercise("single_leg_balance", {
        duration: 30,
        label: "Single Leg Balance - Left",
        side: "left",
      }),
      buildExercise("single_leg_balance", {
        duration: 30,
        label: "Single Leg Balance - Right",
        side: "right",
        id: "single_leg_balance_right",
      }),
      buildExercise("ankle_circles", { duration: 40, label: "Ankle Circles - Left", side: "left" }),
      buildExercise("ankle_circles", {
        duration: 40,
        label: "Ankle Circles - Right",
        side: "right",
        id: "ankle_circles_right",
      }),
      buildExercise("calf_raises_slow", { duration: 60, reps: "10 reps" }),
      buildExercise("toe_heel_rockers", { duration: 45 }),
    ].filter(Boolean),
  },

  // === STACK_RETURN_8: Return Carefully - "Restore + Rebuild" ===
  STACK_RETURN_8: {
    id: "STACK_RETURN_8",
    name: "Restore & Rebuild",
    tagline: "Return Carefully",
    description: "Coming back from a tweak or injury. No jumps. Extra gentle. Pain check at end.",
    duration: "8 min",
    lane: "return_carefully_lane",
    noJumps: true,
    safetyFirst: true,
    exercises: [
      buildExercise("tripod_activation", { duration: 60 }),
      buildExercise("ankle_circles", { duration: 40, label: "Ankle Circles - Left", side: "left" }),
      buildExercise("ankle_circles", {
        duration: 40,
        label: "Ankle Circles - Right",
        side: "right",
        id: "ankle_circles_right",
      }),
      buildExercise("short_foot_holds", { duration: 30, label: "Short Foot Holds (Set 1)" }),
      buildExercise("short_foot_holds", {
        duration: 30,
        label: "Short Foot Holds (Set 2)",
        id: "short_foot_holds_2",
      }),
      buildExercise("supported_single_leg_balance", {
        duration: 20,
        label: "Supported Balance - Left",
        side: "left",
      }),
      buildExercise("supported_single_leg_balance", {
        duration: 20,
        label: "Supported Balance - Right",
        side: "right",
        id: "supported_balance_right",
      }),
      buildExercise("calf_raises_slow", { duration: 50, reps: "8 reps (slower)" }),
      buildExercise("pain_check", { duration: 15 }),
    ].filter(Boolean),
  },
};

// Get stack by ID
export function getStack(stackId) {
  return LANE_STACKS[stackId] || null;
}

// Get stack by lane
export function getStackForLane(lane) {
  const stack = Object.values(LANE_STACKS).find((s) => s.lane === lane);
  return stack || LANE_STACKS.STACK_BASE_8;
}

// Get all stacks
export function getAllStacks() {
  return Object.values(LANE_STACKS);
}

// Default export the bulletproof ankles stack (backwards compatible)
export const BULLETPROOF_ANKLES_STACK = LANE_STACKS.STACK_BASE_8;
