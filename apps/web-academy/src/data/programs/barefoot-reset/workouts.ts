// ═══════════════════════════════════════════════════════════
// BAREFOOT RESET - 30 WORKOUT (MISSION) DATABASE
// Each workout has 6 exercises: 2 Release, 2 Restore, 2 Re-Engineer
// ═══════════════════════════════════════════════════════════

import { Workout, WorkoutExercise, StrikeWod, WorkoutPhase } from './types';

// ─────────────────────────────────────────────────────────────
// WORKOUT DATA
// ─────────────────────────────────────────────────────────────

export const WORKOUTS: Workout[] = [
  // ═══════════════════════════════════════════════════════════
  // PHASE 1: FOUNDATION (Workouts 1-10)
  // "The Wake Up" - Restore range of motion and eliminate pain
  // ═══════════════════════════════════════════════════════════
  {
    workoutNumber: 1,
    phase: 'Foundation',
    missionName: 'Foundation Fundamentals',
    missionSubtitle: 'Introduction to foot and ankle mobility basics',
    release: [
      { exerciseId: 'beast-rock-backs', durationSec: 75, rounds: 1 },
      { exerciseId: 'low-squat-walks', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'split-squat-iso-hold', durationSec: 75, rounds: 1 },
      { exerciseId: 'forefoot-wall-sits', durationSec: 30, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'recoil-series', durationSec: 90, rounds: 2 },
      { exerciseId: 'massai-jumps', durationSec: 120, rounds: 2 },
    ],
    totalDurationSec: 480,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 6,
      format: 'AMRAP',
      exercises: [
        { name: 'Tuck Jumps', reps: 5 },
        { name: 'Skater Squats', reps: 8 },
        { name: 'Flutter Kicks', reps: 12 },
        { name: 'Low Squat Soleus Raise', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 6 minutes. Prioritize quality and intensity.',
      bonusShards: 25,
      bonusXp: 50,
    },
  },
  {
    workoutNumber: 2,
    phase: 'Foundation',
    missionName: 'Ankle Mobility Foundation',
    missionSubtitle: 'Focus on ankle mobility and isometric holds',
    release: [
      { exerciseId: 'ankle-sits', durationSec: 90, rounds: 1 },
      { exerciseId: 'power-ankle-series', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'rfess-iso-hold', durationSec: 60, rounds: 1 },
      { exerciseId: 'supine-long-lever-hip-bridge', durationSec: 75, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: '3-way-jumping-jacks', durationSec: 90, rounds: 2 },
      { exerciseId: 'ffe-rear-foot-hop-series', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 480,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 3,
    phase: 'Foundation',
    missionName: 'Foot Reset Fundamentals',
    missionSubtitle: 'Targeting plantar surface and big toe mobility',
    release: [
      { exerciseId: 'plantar-reset', durationSec: 75, rounds: 1 },
      { exerciseId: 'forward-leans-towel', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'pac-man-squats', durationSec: 60, rounds: 1 },
      { exerciseId: 'big-toe-smash-rdl-lunges', durationSec: 90, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'tik-toks', durationSec: 60, rounds: 2 },
      { exerciseId: 'sagittal-3d-lunge-1-2-steps-reach', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 450,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 4,
    phase: 'Foundation',
    missionName: 'Lower Body Connection',
    missionSubtitle: 'Connecting foot function to overall movement',
    release: [
      { exerciseId: 'bear-squats', durationSec: 90, rounds: 1 },
      { exerciseId: 'foot-cradle-lateral-lunge-stutters', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'standing-leg-raise', durationSec: 90, rounds: 1 },
      { exerciseId: 'bear-hold-shoulder-taps', durationSec: 60, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'lateral-1-2-step-tennis-ball-catches', durationSec: 60, rounds: 2 },
      { exerciseId: 'split-squat-snap-downs', durationSec: 60, rounds: 2 },
    ],
    totalDurationSec: 435,
    estimatedMinutes: 7,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 5,
    phase: 'Foundation',
    missionName: 'Multi-Directional Foundation',
    missionSubtitle: 'Movement in multiple planes with deceleration control',
    release: [
      { exerciseId: 'tennis-ball-big-toe-stretch', durationSec: 90, rounds: 1 },
      { exerciseId: 'frontal-plane-3d-reaches', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'skater-squat-isos', durationSec: 75, rounds: 1 },
      { exerciseId: '3-way-quad-pumps', durationSec: 90, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'knee-hug-forward-lunge-stutters', durationSec: 90, rounds: 2 },
      { exerciseId: 'transverse-1-2-steps', durationSec: 60, rounds: 2 },
    ],
    totalDurationSec: 480,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 6,
      format: 'AMRAP',
      exercises: [
        { name: 'Jump Squats', reps: 5 },
        { name: 'Lateral Bounds', reps: 8 },
        { name: 'Plank Walk-Ups', reps: 12 },
        { name: 'Staggered Stance Massai Jumps', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 6 minutes. Prioritize quality and intensity.',
      bonusShards: 25,
      bonusXp: 50,
    },
  },
  {
    workoutNumber: 6,
    phase: 'Foundation',
    missionName: 'Toe & Forefoot Focus',
    missionSubtitle: 'Targeting toe dexterity and forefoot strength',
    release: [
      { exerciseId: 'big-toe-sit', durationSec: 90, rounds: 1 },
      { exerciseId: 'towel-scrunch', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'split-squat-iso-hold', durationSec: 60, rounds: 2 },
      { exerciseId: 'vmo-taps', durationSec: 75, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'legs-cross-jumps', durationSec: 90, rounds: 2 },
      { exerciseId: 'two-foot-hop-series', durationSec: 60, rounds: 2 },
    ],
    totalDurationSec: 450,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 7,
    phase: 'Foundation',
    missionName: 'Foot Strength Progression',
    missionSubtitle: 'Building vertical foot strength and hop series',
    release: [
      { exerciseId: 'heel-to-toe-touches', durationSec: 90, rounds: 1 },
      { exerciseId: 'couch-stretch', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'forefoot-wall-sits', durationSec: 60, rounds: 2 },
      { exerciseId: 'wide-leg-good-morning-iso-hold', durationSec: 90, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'lateral-bounds', durationSec: 60, rounds: 2 },
      { exerciseId: 'rfess-hop-series', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 465,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 8,
      format: 'AMRAP',
      exercises: [
        { name: 'Depth Jumps (Vertical)', reps: 5 },
        { name: 'Skater Squats', reps: 8 },
        { name: 'Side-Lying Leg Lifts', reps: 12 },
        { name: 'Low Squat Soleus Raises', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 8 minutes. Prioritize quality and intensity.',
      bonusShards: 30,
      bonusXp: 60,
    },
  },
  {
    workoutNumber: 8,
    phase: 'Foundation',
    missionName: 'Lateral Line Development',
    missionSubtitle: 'Opening the lateral line and building Pac Man Squats',
    release: [
      { exerciseId: 'tennis-ball-big-toe-stretch', durationSec: 90, rounds: 1 },
      { exerciseId: 'power-ankle-series', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'pacman-squat-iso-hold', durationSec: 90, rounds: 2 },
      { exerciseId: 'big-toe-smash-rdl-lunges', durationSec: 75, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'tik-toks', durationSec: 90, rounds: 2 },
      { exerciseId: 'speed-lunge-switches', durationSec: 60, rounds: 2 },
    ],
    totalDurationSec: 480,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 9,
    phase: 'Foundation',
    missionName: 'Hip Mobility Progression',
    missionSubtitle: 'Addressing hip mobility and single leg control',
    release: [
      { exerciseId: 'plantar-reset', durationSec: 75, rounds: 1 },
      { exerciseId: 'quad-stretch-reverse-lunge', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'skater-squat-knee-drives', durationSec: 75, rounds: 2 },
      { exerciseId: 'cossack-squats', durationSec: 60, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'wide-to-wider-jumping-jacks', durationSec: 60, rounds: 2 },
      { exerciseId: 'massai-jumps', durationSec: 60, rounds: 2 },
    ],
    totalDurationSec: 420,
    estimatedMinutes: 7,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 8,
      format: 'AMRAP',
      exercises: [
        { name: 'Staggered Stance Massai Jumps', reps: 5 },
        { name: 'Floating Heel Split Squats', reps: 8 },
        { name: 'Flutter Kicks', reps: 12 },
        { name: 'Single-Leg Vertical Bounds', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 8 minutes. Prioritize quality and intensity.',
      bonusShards: 30,
      bonusXp: 60,
    },
  },
  {
    workoutNumber: 10,
    phase: 'Foundation',
    missionName: 'Foundation Complete',
    missionSubtitle: 'Forefoot power and staggered stance mastery',
    release: [
      { exerciseId: 'forefoot-chest-opener-squats', durationSec: 75, rounds: 1 },
      { exerciseId: 'hip-circles', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'split-squat-soleus-raise', durationSec: 60, rounds: 2 },
      { exerciseId: 'bear-hold-shoulder-taps', durationSec: 60, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'staggered-stance-massai-jumps', durationSec: 90, rounds: 2 },
      { exerciseId: 'forefoot-speed-squats', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 450,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },

  // ═══════════════════════════════════════════════════════════
  // PHASE 2: PROGRESSION (Workouts 11-20)
  // "The Armor" - Build steel ankles and load capacity
  // ═══════════════════════════════════════════════════════════
  {
    workoutNumber: 11,
    phase: 'Progression',
    missionName: 'Progression Begins',
    missionSubtitle: 'Advanced ankle mobility and hop series',
    release: [
      { exerciseId: 'ankle-sits', durationSec: 75, rounds: 1 },
      { exerciseId: 'low-squat-walks', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'heel-to-toe-touches', durationSec: 75, rounds: 2 },
      { exerciseId: 'split-squat-iso-hold', durationSec: 60, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'ffe-rear-foot-hop-series', durationSec: 60, rounds: 2 },
      { exerciseId: '3-way-quad-pumps', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 435,
    estimatedMinutes: 7,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 8,
      format: 'AMRAP',
      exercises: [
        { name: 'Tuck Jumps', reps: 5 },
        { name: 'Forefoot RFESS', reps: 8 },
        { name: 'Shoulder Taps', reps: 12 },
        { name: 'Massai Jumps', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 8 minutes. Prioritize quality and intensity.',
      bonusShards: 30,
      bonusXp: 60,
    },
  },
  {
    workoutNumber: 12,
    phase: 'Progression',
    missionName: 'Hip & Ankle Integration',
    missionSubtitle: 'Connecting hip and ankle mobility',
    release: [
      { exerciseId: 'kneeling-adductor-stretch', durationSec: 90, rounds: 1 },
      { exerciseId: 'kneeling-hip-flexor-hamstring-stretch', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'airplanes', durationSec: 60, rounds: 2 },
      { exerciseId: 'supine-long-lever-hip-bridge', durationSec: 90, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'forefoot-snap-downs', durationSec: 90, rounds: 2 },
      { exerciseId: 'tik-toks', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 510,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 13,
    phase: 'Progression',
    missionName: 'Mobility Recall',
    missionSubtitle: 'Revisiting Beast Rock Backs with increased challenge',
    release: [
      { exerciseId: 'ankle-sits', durationSec: 75, rounds: 1 },
      { exerciseId: 'beast-rock-backs', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'split-squat-soleus-raise', durationSec: 60, rounds: 2 },
      { exerciseId: 'forward-leans-towel', durationSec: 90, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'lateral-1-2-step-tennis-ball-catches', durationSec: 90, rounds: 2 },
      { exerciseId: 'rfess-hop-series', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 480,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 10,
      format: 'AMRAP',
      exercises: [
        { name: 'Broad Jumps', reps: 5 },
        { name: 'Lateral Bounds', reps: 8 },
        { name: 'Knee Drive Crunches', reps: 12 },
        { name: 'Single-Leg Calf Raises', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 10 minutes. Prioritize quality and intensity.',
      bonusShards: 35,
      bonusXp: 70,
    },
  },
  {
    workoutNumber: 14,
    phase: 'Progression',
    missionName: 'Plantar Reset Advanced',
    missionSubtitle: 'Advanced plantar work and 3D movement',
    release: [
      { exerciseId: 'lateral-line-stretch', durationSec: 90, rounds: 1 },
      { exerciseId: 'bear-squats', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'forefoot-wall-sits', durationSec: 75, rounds: 2 },
      { exerciseId: 'floating-heel-split-squats', durationSec: 60, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'front-back-hops', durationSec: 90, rounds: 2 },
      { exerciseId: 'massai-jumps', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 495,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 15,
    phase: 'Progression',
    missionName: 'Vertical Foot Strength',
    missionSubtitle: 'Introducing the Recoil Series',
    release: [
      { exerciseId: 'tennis-ball-big-toe-stretch', durationSec: 75, rounds: 1 },
      { exerciseId: 'straight-leg-windmill-squats', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'wide-leg-good-morning-iso-hold', durationSec: 60, rounds: 2 },
      { exerciseId: 'vmo-taps', durationSec: 60, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'forefoot-hops-knee-tuck', durationSec: 60, rounds: 2 },
      { exerciseId: 'recoil-series', durationSec: 60, rounds: 2 },
    ],
    totalDurationSec: 390,
    estimatedMinutes: 6,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 10,
      format: 'AMRAP',
      exercises: [
        { name: 'Depth Jumps (Vertical)', reps: 5 },
        { name: 'Skater Squats', reps: 8 },
        { name: 'Plank Walk-Ups', reps: 12 },
        { name: 'Low Squat Soleus Raises', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 10 minutes. Prioritize quality and intensity.',
      bonusShards: 35,
      bonusXp: 70,
    },
  },
  {
    workoutNumber: 16,
    phase: 'Progression',
    missionName: 'Foot-to-Movement Integration',
    missionSubtitle: 'Toe mobility with movement integration',
    release: [
      { exerciseId: 'hurdle-unders', durationSec: 75, rounds: 1 },
      { exerciseId: 'big-toe-sit', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'single-leg-calf-raise', durationSec: 90, rounds: 2 },
      { exerciseId: 'rfess', durationSec: 90, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'tik-toks', durationSec: 60, rounds: 2 },
      { exerciseId: 'staggered-stance-massai-jumps', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 495,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 17,
    phase: 'Progression',
    missionName: 'Big Toe Activation',
    missionSubtitle: 'Focused big toe and foot intrinsic work',
    release: [
      { exerciseId: 'big-toe-sit', durationSec: 90, rounds: 1 },
      { exerciseId: 'towel-scrunch', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'vmo-taps', durationSec: 90, rounds: 2 },
      { exerciseId: 'supine-long-lever-hip-bridge', durationSec: 60, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'ffe-rear-foot-hop-series', durationSec: 60, rounds: 2 },
      { exerciseId: 'two-foot-hop-series', durationSec: 60, rounds: 2 },
    ],
    totalDurationSec: 435,
    estimatedMinutes: 7,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 10,
      format: 'AMRAP',
      exercises: [
        { name: 'Jump Squats', reps: 5 },
        { name: 'Forefoot RFESS', reps: 8 },
        { name: 'Flutter Kicks', reps: 12 },
        { name: 'Staggered Stance Massai Jumps', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 10 minutes. Prioritize quality and intensity.',
      bonusShards: 35,
      bonusXp: 70,
    },
  },
  {
    workoutNumber: 18,
    phase: 'Progression',
    missionName: 'Hip Opening Integration',
    missionSubtitle: 'Deep hip opening with lateral strength',
    release: [
      { exerciseId: 'beast-rock-backs', durationSec: 90, rounds: 1 },
      { exerciseId: 'long-lunge-hip-pushups', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'side-lying-bridge-top-leg-lifts', durationSec: 60, rounds: 2 },
      { exerciseId: 'airplanes', durationSec: 75, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'single-leg-vertical-bounds', durationSec: 60, rounds: 2 },
      { exerciseId: 'speed-lunge-switches', durationSec: 60, rounds: 2 },
    ],
    totalDurationSec: 420,
    estimatedMinutes: 7,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 19,
    phase: 'Progression',
    missionName: 'Frog & Mobility Flow',
    missionSubtitle: 'Deep hip opening and lateral strength',
    release: [
      { exerciseId: 'kneeling-hip-flexor-hamstring-stretch', durationSec: 90, rounds: 1 },
      { exerciseId: 'heel-to-toe-touches', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'cossack-squats', durationSec: 90, rounds: 2 },
      { exerciseId: 'plank-walk-ups', durationSec: 60, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'foot-cradle-lateral-lunge-stutters', durationSec: 90, rounds: 2 },
      { exerciseId: 'legs-cross-jumps', durationSec: 60, rounds: 2 },
    ],
    totalDurationSec: 480,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 12,
      format: 'AMRAP',
      exercises: [
        { name: 'Tuck Jumps', reps: 5 },
        { name: 'Lateral Bounds', reps: 8 },
        { name: 'Side-Lying Leg Lifts', reps: 12 },
        { name: 'Single-Leg Calf Raises', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 12 minutes. Prioritize quality and intensity.',
      bonusShards: 40,
      bonusXp: 80,
    },
  },
  {
    workoutNumber: 20,
    phase: 'Progression',
    missionName: 'Progression Complete',
    missionSubtitle: 'Overhead mobility and deceleration mastery',
    release: [
      { exerciseId: 'quad-stretch-reverse-lunge', durationSec: 90, rounds: 1 },
      { exerciseId: 'couch-stretch', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'skater-squat-knee-drives', durationSec: 75, rounds: 2 },
      { exerciseId: 'supine-long-lever-hip-bridge', durationSec: 75, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'forefoot-snap-downs', durationSec: 90, rounds: 2 },
      { exerciseId: 'forefoot-speed-squats', durationSec: 60, rounds: 2 },
    ],
    totalDurationSec: 480,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },

  // ═══════════════════════════════════════════════════════════
  // PHASE 3: MASTERY (Workouts 21-30)
  // "The Ignition" - Explosive power and sport transfer
  // ═══════════════════════════════════════════════════════════
  {
    workoutNumber: 21,
    phase: 'Mastery',
    missionName: 'Rotational Control Refinement',
    missionSubtitle: 'Refining rotational control and quad pumps',
    release: [
      { exerciseId: 'reverse-lunge-rotation', durationSec: 90, rounds: 1 },
      { exerciseId: 'sagittal-1-2-step-reaches', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'vmo-taps', durationSec: 90, rounds: 2 },
      { exerciseId: 'pac-man-squats', durationSec: 60, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: '3-way-quad-pumps', durationSec: 90, rounds: 2 },
      { exerciseId: '3-way-jumping-jacks', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 510,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 12,
      format: 'AMRAP',
      exercises: [
        { name: 'Broad Jumps', reps: 5 },
        { name: 'Floating Heel Split Squats', reps: 8 },
        { name: 'Knee Drive Crunches', reps: 12 },
        { name: 'Massai Jumps', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 12 minutes. Prioritize quality and intensity.',
      bonusShards: 40,
      bonusXp: 80,
    },
  },
  {
    workoutNumber: 22,
    phase: 'Mastery',
    missionName: 'Ankle Mobility Mastery',
    missionSubtitle: 'Deepening ankle mobility with power',
    release: [
      { exerciseId: 'ankle-sits', durationSec: 90, rounds: 1 },
      { exerciseId: 'power-ankle-series', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'inline-tennis-ball-catches', durationSec: 60, rounds: 2 },
      { exerciseId: 'low-squat-soleus-raise', durationSec: 60, rounds: 2 },
    ],
    reengineer: [
      { exerciseId: 'transverse-1-2-steps', durationSec: 60, rounds: 2 },
      { exerciseId: 'tuck-jumps', durationSec: 60, rounds: 2 },
    ],
    totalDurationSec: 420,
    estimatedMinutes: 7,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 23,
    phase: 'Mastery',
    missionName: 'Hip Flexor Refinement',
    missionSubtitle: 'Refined hip mobility and airplane mastery',
    release: [
      { exerciseId: 'plantar-reset', durationSec: 75, rounds: 1 },
      { exerciseId: 'kneeling-hip-flexor-hamstring-stretch', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'knee-hug-forward-lunge-stutters', durationSec: 90, rounds: 1 },
      { exerciseId: 'airplanes', durationSec: 60, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'massai-jumps', durationSec: 90, rounds: 2 },
      { exerciseId: 'lateral-1-2-step-tennis-ball-catches', durationSec: 60, rounds: 1 },
    ],
    totalDurationSec: 465,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 12,
      format: 'AMRAP',
      exercises: [
        { name: 'Depth Jumps (Vertical)', reps: 5 },
        { name: 'Forefoot RFESS', reps: 8 },
        { name: 'Shoulder Taps', reps: 12 },
        { name: 'Single-Leg Vertical Bounds', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 12 minutes. Prioritize quality and intensity.',
      bonusShards: 40,
      bonusXp: 80,
    },
  },
  {
    workoutNumber: 24,
    phase: 'Mastery',
    missionName: 'Lunge Push-Up Refinement',
    missionSubtitle: 'Hip pushups with split squat mastery',
    release: [
      { exerciseId: 'long-lunge-hip-pushups', durationSec: 90, rounds: 1 },
      { exerciseId: 'beast-rock-backs', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'heel-to-toe-touches', durationSec: 60, rounds: 1 },
      { exerciseId: 'split-squat-iso-hold', durationSec: 75, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'forefoot-speed-squats', durationSec: 60, rounds: 1 },
      { exerciseId: 'rfess-hop-series', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 465,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 25,
    phase: 'Mastery',
    missionName: 'Rear Foot Elevation Mastery',
    missionSubtitle: 'Mastering rear foot calf raises and reaches',
    release: [
      { exerciseId: 'big-toe-sit', durationSec: 90, rounds: 1 },
      { exerciseId: 'bear-squats', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'single-leg-calf-raise', durationSec: 60, rounds: 1 },
      { exerciseId: 'wide-leg-good-morning-iso-hold', durationSec: 60, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'jump-squats', durationSec: 90, rounds: 2 },
      { exerciseId: '3-way-jumping-jacks', durationSec: 60, rounds: 1 },
    ],
    totalDurationSec: 450,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 14,
      format: 'AMRAP',
      exercises: [
        { name: 'Broad Jumps', reps: 5 },
        { name: 'Skater Squats', reps: 8 },
        { name: 'Plank Walk-Ups', reps: 12 },
        { name: 'Staggered Stance Massai Jumps', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 14 minutes. Prioritize quality and intensity.',
      bonusShards: 50,
      bonusXp: 100,
    },
  },
  {
    workoutNumber: 26,
    phase: 'Mastery',
    missionName: 'Knee Mechanics Mastery',
    missionSubtitle: 'Perfecting knee control and dynamic bridges',
    release: [
      { exerciseId: 'frontal-plane-3d-reaches', durationSec: 90, rounds: 1 },
      { exerciseId: '3d-lunge-touches-sagittal', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'forefoot-wall-sits', durationSec: 90, rounds: 1 },
      { exerciseId: 'cossack-squats', durationSec: 60, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'recoil-series-level-2', durationSec: 60, rounds: 1 },
      { exerciseId: 'legs-cross-jumps', durationSec: 60, rounds: 1 },
    ],
    totalDurationSec: 435,
    estimatedMinutes: 7,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 27,
    phase: 'Mastery',
    missionName: 'Toe Mobility Mastery',
    missionSubtitle: 'Advanced toe mobility and explosive control',
    release: [
      { exerciseId: 'kneeling-hip-flexor-hamstring-stretch', durationSec: 90, rounds: 1 },
      { exerciseId: 'single-leg-bear-squat', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'forward-leans-towel', durationSec: 90, rounds: 1 },
      { exerciseId: 'big-toe-smash-rdl-lunges', durationSec: 60, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'tik-toks', durationSec: 90, rounds: 2 },
      { exerciseId: 'forefoot-snap-downs', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 510,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 14,
      format: 'AMRAP',
      exercises: [
        { name: 'Jump Squats', reps: 5 },
        { name: 'Floating Heel Split Squats', reps: 8 },
        { name: 'Knee Drive Crunches', reps: 12 },
        { name: 'Low Squat Soleus Raises', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 14 minutes. Prioritize quality and intensity.',
      bonusShards: 50,
      bonusXp: 100,
    },
  },
  {
    workoutNumber: 28,
    phase: 'Mastery',
    missionName: 'Low Squat Mastery',
    missionSubtitle: 'Perfecting deep squat and RDL jumps',
    release: [
      { exerciseId: 'hip-circles', durationSec: 75, rounds: 1 },
      { exerciseId: 'low-squat-walks', durationSec: 90, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'skater-squat-isos', durationSec: 90, rounds: 1 },
      { exerciseId: 'vmo-taps', durationSec: 75, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'hamstring-clap-track-warm-up', durationSec: 60, rounds: 1 },
      { exerciseId: 'lateral-bounds', durationSec: 60, rounds: 1 },
    ],
    totalDurationSec: 450,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },
  {
    workoutNumber: 29,
    phase: 'Mastery',
    missionName: 'Lateral Mobility Mastery',
    missionSubtitle: 'Final lateral line refinement',
    release: [
      { exerciseId: 'ankle-sits', durationSec: 90, rounds: 1 },
      { exerciseId: 'couch-stretch', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'rfess-iso-hold', durationSec: 75, rounds: 1 },
      { exerciseId: 'knee-hug-forward-lunge-stutters', durationSec: 90, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'transverse-1-2-steps', durationSec: 90, rounds: 2 },
      { exerciseId: 'wide-to-wider-jumping-jacks', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 510,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
    strikeWod: {
      durationMinutes: 14,
      format: 'AMRAP',
      exercises: [
        { name: 'Tuck Jumps', reps: 5 },
        { name: 'Forefoot RFESS', reps: 8 },
        { name: 'Side-Lying Leg Lifts', reps: 12 },
        { name: 'Single-Leg Vertical Bounds', reps: 20 },
      ],
      instructions: 'As many rounds as possible in 14 minutes. Prioritize quality and intensity.',
      bonusShards: 50,
      bonusXp: 100,
    },
  },
  {
    workoutNumber: 30,
    phase: 'Mastery',
    missionName: 'Complete Integration Mastery',
    missionSubtitle: 'Final integration - ready for sport transfer',
    release: [
      { exerciseId: 'power-ankle-series', durationSec: 90, rounds: 1 },
      { exerciseId: 'low-squat-ankle-rocks', durationSec: 75, rounds: 1 },
    ],
    restore: [
      { exerciseId: 'front-to-back-tennis-ball-pivots', durationSec: 60, rounds: 1 },
      { exerciseId: 'foot-cradle-lateral-lunge-stutters', durationSec: 90, rounds: 1 },
    ],
    reengineer: [
      { exerciseId: 'tuck-jumps', durationSec: 90, rounds: 2 },
      { exerciseId: 'recoil-series-level-2', durationSec: 90, rounds: 2 },
    ],
    totalDurationSec: 495,
    estimatedMinutes: 8,
    shardsReward: 48,
    xpReward: 100,
  },
];

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

export function getWorkoutByNumber(workoutNumber: number): Workout | undefined {
  return WORKOUTS.find(w => w.workoutNumber === workoutNumber);
}

export function getWorkoutsByPhase(phase: WorkoutPhase): Workout[] {
  return WORKOUTS.filter(w => w.phase === phase);
}

export function getWorkoutsWithStrikeWod(): Workout[] {
  return WORKOUTS.filter(w => w.strikeWod !== undefined);
}

// Summary stats
export const WORKOUT_STATS = {
  total: WORKOUTS.length,
  foundation: getWorkoutsByPhase('Foundation').length,
  progression: getWorkoutsByPhase('Progression').length,
  mastery: getWorkoutsByPhase('Mastery').length,
  withStrikeWod: getWorkoutsWithStrikeWod().length,
  totalExercises: WORKOUTS.reduce((sum, w) => sum + w.release.length + w.restore.length + w.reengineer.length, 0),
  avgDurationMinutes: Math.round(WORKOUTS.reduce((sum, w) => sum + w.estimatedMinutes, 0) / WORKOUTS.length),
};
