# Barefoot Reset 42-Day Program
## Production Epics, User Flows & Acceptance Criteria

---

## Epic Overview

| Epic | Priority | Status | Description |
|------|----------|--------|-------------|
| E1 | P0 | 🔴 Not Started | Core Workout Flow |
| E2 | P0 | 🔴 Not Started | Data Persistence (Convex) |
| E3 | P0 | 🔴 Not Started | Auth & Access Control |
| E4 | P1 | 🔴 Not Started | Gamification Engine |
| E5 | P1 | 🔴 Not Started | Onboarding & Contract |
| E6 | P2 | 🔴 Not Started | Program Completion |
| E7 | P2 | 🔴 Not Started | Strike WOD System |
| E8 | P3 | 🔴 Not Started | Polish & Celebrations |

---

## E1: Core Workout Flow (P0 - Critical)

### User Story
> As a young athlete, I want to complete daily workout missions so I can build foot strength over 42 days.

### User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE WORKOUT FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

[1. The Den (Home)]
        │
        ▼
┌───────────────────┐     ┌───────────────────┐
│  Today's Mission  │────▶│  Mission Detail   │
│  Card visible     │     │  (6 exercises)    │
└───────────────────┘     └───────────────────┘
                                   │
                                   ▼
                          ┌───────────────────┐
                          │  START MISSION    │
                          │  (CTA Button)     │
                          └───────────────────┘
                                   │
                                   ▼
                          ┌───────────────────┐
                          │  3-2-1 Countdown  │
                          └───────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         WORKOUT PLAYER LOOP                                  │
│                                                                              │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│   │  Exercise   │────▶│  10s Rest   │────▶│  Exercise   │──── ... ───┐      │
│   │  Timer +    │     │  "Next Up"  │     │  Timer +    │            │      │
│   │  Video      │     │  Preview    │     │  Video      │            │      │
│   └─────────────┘     └─────────────┘     └─────────────┘            │      │
│         │                                                             │      │
│         ▼                                                             │      │
│   [SKIP] ───▶ Confirm ───▶ No shards for this exercise               │      │
│   [PAUSE] ──▶ Resume anytime                                          │      │
│   [EXIT] ───▶ Confirm ───▶ Save checkpoint (if >50% complete)        │      │
│                                                                       │      │
└───────────────────────────────────────────────────────────────────────┘      │
                                                                               │
                                   ┌───────────────────────────────────────────┘
                                   ▼
                          ┌───────────────────┐
                          │  EXERCISE 6/6     │
                          │  COMPLETE         │
                          └───────────────────┘
                                   │
                                   ▼
                          ┌───────────────────┐
                          │  Shard Rain       │
                          │  Animation        │
                          └───────────────────┘
                                   │
                                   ▼
                          ┌───────────────────┐
                          │  Spider Chart     │
                          │  Growth Animation │
                          └───────────────────┘
                                   │
                                   ▼
                          ┌───────────────────┐
                          │  Completion       │
                          │  Summary Card     │
                          └───────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    │                    ▼
    ┌─────────────────┐            │          ┌─────────────────┐
    │ Strike WOD      │            │          │ Return to Den   │
    │ Available?      │────YES────▶│          │                 │
    │                 │            │          └─────────────────┘
    └─────────────────┘            │
              │                    ▼
              NO          ┌───────────────────┐
              │           │  Strike WOD Flow  │
              │           │  (See Epic E7)    │
              ▼           └───────────────────┘
    ┌─────────────────┐
    │ Return to Den   │
    └─────────────────┘
```

### Acceptance Criteria

#### AC1.1: Mission Card Display
- [ ] Today's mission card shows on home screen
- [ ] Card displays: mission number, name, duration, shard reward
- [ ] Card shows Strike WOD indicator if available
- [ ] Completed missions show checkmark overlay
- [ ] Locked missions show lock icon with unlock requirement

#### AC1.2: Mission Detail Page
- [ ] Shows exercise breakdown by category (Flow/Forge/Volt)
- [ ] Each exercise shows name, duration, shard value
- [ ] Strike WOD banner appears if available
- [ ] "Start Mission" CTA is prominent and accessible
- [ ] Back navigation returns to Den

#### AC1.3: Workout Player - Video
- [ ] HLS video stream plays automatically on exercise start
- [ ] Video loops until timer completes
- [ ] Mute/unmute toggle works
- [ ] Fallback UI shows if video fails (thumbnail + coaching cue)
- [ ] Video preloads next exercise during rest period

#### AC1.4: Workout Player - Timer
- [ ] Countdown starts from exercise duration
- [ ] Timer pulses at 10s, 5s, 3-2-1
- [ ] Timer pauses when pause button pressed
- [ ] Timer resumes from paused state
- [ ] Auto-advances to rest when timer hits 0

#### AC1.5: Workout Player - Controls
- [ ] Pause/Play toggle works correctly
- [ ] Skip button appears after 10 seconds
- [ ] Skip requires confirmation tap
- [ ] Exit shows confirmation dialog
- [ ] Exit with >50% complete offers checkpoint save

#### AC1.6: Rest Period
- [ ] 10-second rest between exercises
- [ ] Shows "Next Up" preview with exercise name
- [ ] "Skip Rest" button advances immediately
- [ ] Timer countdown visible

#### AC1.7: Completion Flow
- [ ] Shard rain animation plays on last exercise complete
- [ ] Spider chart animates growth in trained frequencies
- [ ] Summary card shows: duration, exercises completed, shards earned
- [ ] Chain status updates (incremented, frozen, or broken)
- [ ] New badges display if earned

---

## E2: Data Persistence - Convex (P0 - Critical)

### User Story
> As a user, I want my workout progress saved automatically so I don't lose my achievements.

### Convex Schema

```typescript
// convex/schema.ts additions

barefootResetEnrollments: defineTable({
  userId: v.id("users"),
  enrolledAt: v.number(),
  contractSignedAt: v.optional(v.number()),
  primaryFrequency: v.optional(v.union(
    v.literal("Volt"),
    v.literal("Forge"),
    v.literal("Flow")
  )),
  status: v.union(
    v.literal("active"),
    v.literal("completed"),
    v.literal("paused")
  ),
})
  .index("by_user", ["userId"]),

barefootResetProgress: defineTable({
  userId: v.id("users"),
  currentCalendarDay: v.number(),
  currentWorkout: v.number(),

  // Chain tracking
  chainCurrent: v.number(),
  chainBest: v.number(),
  chainFreezes: v.number(), // Max 2 per program
  lastWorkoutDate: v.optional(v.string()), // ISO date

  // Frequency progress (Spider Chart)
  flowPoints: v.number(),
  forgePoints: v.number(),
  voltPoints: v.number(),

  // Totals
  totalShards: v.number(),
  totalXp: v.number(),
  totalWorkoutsCompleted: v.number(),
  totalStrikeWodsCompleted: v.number(),

  // Wolf evolution
  wolfLevel: v.number(),

  // Timestamps
  startedAt: v.number(),
  lastActivityAt: v.number(),
  completedAt: v.optional(v.number()),
})
  .index("by_user", ["userId"]),

barefootResetWorkoutLogs: defineTable({
  userId: v.id("users"),
  workoutNumber: v.number(),
  calendarDay: v.number(),

  // Exercise details
  exercisesCompleted: v.array(v.string()), // Exercise IDs
  exercisesSkipped: v.array(v.string()),

  // Timing
  startedAt: v.number(),
  completedAt: v.number(),
  totalDurationSec: v.number(),
  pausedDurationSec: v.number(),

  // Rewards earned
  shardsEarned: v.number(),
  xpEarned: v.number(),
  chainUpdated: v.boolean(),

  // Strike WOD (if attempted)
  strikeWodAttempted: v.boolean(),
  strikeWodEffort: v.optional(v.number()), // 1-10
  strikeWodShards: v.optional(v.number()),
})
  .index("by_user", ["userId"])
  .index("by_user_workout", ["userId", "workoutNumber"]),

barefootResetBadges: defineTable({
  userId: v.id("users"),
  badgeId: v.string(),
  earnedAt: v.number(),
  trigger: v.string(), // What triggered the badge
})
  .index("by_user", ["userId"])
  .index("by_user_badge", ["userId", "badgeId"]),
```

### Mutations Required

```typescript
// convex/barefootReset.ts

// Enroll user in program
export const enrollInProgram = mutation({...})

// Sign wolf contract
export const signContract = mutation({...})

// Start workout (creates checkpoint)
export const startWorkout = mutation({...})

// Complete exercise (updates progress mid-workout)
export const completeExercise = mutation({...})

// Skip exercise
export const skipExercise = mutation({...})

// Complete workout (final save)
export const completeWorkout = mutation({...})

// Submit Strike WOD result
export const submitStrikeWod = mutation({...})

// Check and award badges
export const checkBadges = mutation({...})

// Update chain status (daily cron or on workout complete)
export const updateChainStatus = mutation({...})
```

### Acceptance Criteria

#### AC2.1: Progress Persistence
- [ ] Workout completion saves to `barefootResetWorkoutLogs`
- [ ] Progress updates in `barefootResetProgress` on completion
- [ ] Shards and XP accumulate correctly
- [ ] Wolf level updates based on XP thresholds
- [ ] Spider chart values persist across sessions

#### AC2.2: Chain Logic
- [ ] Chain increments when 5+ exercises completed
- [ ] Chain freezes (no change) when 1-4 exercises completed
- [ ] Chain breaks when 0 exercises completed OR missed day
- [ ] Chain freeze tokens (2 max) consumed correctly
- [ ] Chain resets to 0 on break

#### AC2.3: Badge Awards
- [ ] Badges awarded when trigger conditions met
- [ ] Badge notifications display on earn
- [ ] Badges persist in `barefootResetBadges` table
- [ ] Duplicate badges not awarded

#### AC2.4: Checkpoint System
- [ ] Mid-workout exit saves checkpoint if >50% complete
- [ ] Checkpoint stores: current exercise index, elapsed time, earned shards
- [ ] Resume from checkpoint shows confirmation dialog
- [ ] Checkpoint expires after 15 minutes (cold restart required)

---

## E3: Auth & Access Control (P0 - Critical)

### User Story
> As a business owner, I want only enrolled users to access the program so we protect our content.

### User Flow: Access Check

```
[User visits /programs/barefoot-reset/day/1]
        │
        ▼
┌───────────────────┐
│  Auth Check       │
│  (middleware.ts)  │
└───────────────────┘
        │
   ┌────┴────┐
   │         │
Logged In   Not Logged In
   │         │
   ▼         ▼
┌─────────┐ ┌─────────────────┐
│ Check   │ │ Redirect to     │
│ Enroll  │ │ /auth/sign-in   │
└─────────┘ └─────────────────┘
   │
   ┌────┴────┐
   │         │
Enrolled   Not Enrolled
   │         │
   ▼         ▼
┌─────────┐ ┌─────────────────┐
│ Check   │ │ Redirect to     │
│ Access  │ │ /programs/      │
│ Level   │ │ barefoot-reset  │
└─────────┘ │ /enroll         │
   │        └─────────────────┘
   ▼
┌─────────────────────────────┐
│ Day Access Check            │
│ - Is day unlocked?          │
│ - Is user on schedule?      │
│ - Has user completed prev?  │
└─────────────────────────────┘
        │
   ┌────┴────┐
   │         │
Allowed    Locked
   │         │
   ▼         ▼
┌─────────┐ ┌─────────────────┐
│ Show    │ │ Show locked     │
│ Content │ │ state + unlock  │
│         │ │ requirements    │
└─────────┘ └─────────────────┘
```

### Acceptance Criteria

#### AC3.1: Authentication
- [ ] Unauthenticated users redirected to sign-in
- [ ] Auth state persists across page refreshes
- [ ] Session timeout handled gracefully

#### AC3.2: Enrollment Check
- [ ] Non-enrolled users see enrollment CTA
- [ ] Enrolled users see program content
- [ ] Enrollment status cached for performance

#### AC3.3: Day Access Rules
- [ ] Day 1 always accessible to enrolled users
- [ ] Subsequent days unlock based on progress
- [ ] Catch-up allows up to 2 workouts per day
- [ ] Future days show locked state with unlock date

---

## E4: Gamification Engine (P1 - Important)

### User Story
> As a young athlete, I want to earn rewards and track my progress so I stay motivated.

### Gamification Flow

```
[Workout Complete]
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                    REWARD CALCULATION                              │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Base Shards = exercisesCompleted × 8                             │
│  Chain Bonus = milestone reached ? bonus : 0                       │
│  Strike WOD  = attempted ? effortBonus : 0                        │
│  ─────────────────────────────────────────                        │
│  Total Shards = Base + Chain + Strike                              │
│                                                                    │
│  XP = 100 (flat per workout)                                       │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                    BADGE CHECK                                     │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  FOR each badge in BADGES:                                         │
│    IF trigger condition met AND badge not earned:                  │
│      Award badge                                                   │
│      Show notification                                             │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                    WOLF EVOLUTION CHECK                            │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  newLevel = floor(totalXP / 100) + 1                               │
│                                                                    │
│  IF newLevel crosses evolution threshold:                          │
│    Ghost (1-5) → Forming (6-15) → Solid (16-29) → Radiant (30+)   │
│    Trigger evolution ceremony                                      │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                    SPIDER CHART UPDATE                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  FOR each completed exercise:                                      │
│    frequency = exercise.frequency                                  │
│    frequencyProgress[frequency] += 10                              │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

### Badge Triggers Reference

| Badge ID | Trigger | Requirement |
|----------|---------|-------------|
| chain-3 | chain_milestone | 3 consecutive days |
| chain-7 | chain_milestone | 7 consecutive days |
| chain-14 | chain_milestone | 14 consecutive days |
| chain-21 | chain_milestone | 21 consecutive days |
| chain-30 | chain_milestone | 30 consecutive days |
| chain-42 | chain_milestone | 42 consecutive days (perfect) |
| phase-foundation | phase_complete | Workouts 1-10 complete |
| phase-progression | phase_complete | Workouts 11-20 complete |
| phase-mastery | phase_complete | Workouts 21-30 complete |
| program-complete | program_complete | All 30 workouts done |
| strike-first | strike_wod_complete | 1 Strike WOD |
| strike-5 | strike_wod_complete | 5 Strike WODs |
| strike-10 | strike_wod_complete | 10 Strike WODs |
| shards-100 | total_shards | 100 shards |
| shards-500 | total_shards | 500 shards |
| shards-1000 | total_shards | 1000 shards |
| wolf-forming | wolf_evolution | Level 6 |
| wolf-solid | wolf_evolution | Level 16 |
| wolf-radiant | wolf_evolution | Level 30 |

### Acceptance Criteria

#### AC4.1: Shard Economy
- [ ] 8 shards per completed exercise
- [ ] 0 shards for skipped exercises
- [ ] Chain milestone bonuses applied correctly
- [ ] Total displayed matches sum of all sources

#### AC4.2: Chain System
- [ ] 70% threshold (5/6) required for chain increment
- [ ] Milestone bonuses: 3→25, 7→50, 14→100, 21→150, 30→300
- [ ] Chain display shows current count and next milestone
- [ ] Chain break shows sympathetic message (not punitive)

#### AC4.3: Wolf Evolution
- [ ] Level = floor(totalXP / 100) + 1
- [ ] Evolution states change at correct thresholds
- [ ] Evolution ceremony plays on state change
- [ ] Wolf avatar reflects current state

#### AC4.4: Badge System
- [ ] Badges awarded on trigger condition
- [ ] Toast notification on badge earn
- [ ] Badge gallery accessible from profile
- [ ] Locked badges show requirements

---

## E5: Onboarding & Contract (P1 - Important)

### User Story
> As a first-time user, I want to commit to the 42-day program so I feel invested from day one.

### Onboarding Flow

```
[User clicks "Start Barefoot Reset"]
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                    WOLF CONTRACT                                   │
│                                                                    │
│    "I commit to 42 days of training"                               │
│                                                                    │
│    □ I will show up (5 days a week)                               │
│    □ I trust the Blueprint                                         │
│    □ I will earn my gear                                           │
│                                                                    │
│    ┌─────────────────────────────────────────┐                     │
│    │      [FINGERPRINT SCANNER ZONE]         │                     │
│    │           Hold to Sign                  │                     │
│    └─────────────────────────────────────────┘                     │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼ (Hold 2 seconds)
┌───────────────────────────────────────────────────────────────────┐
│                    WOLF SORTING (Optional)                         │
│                                                                    │
│    Wolf: "Welcome to the Pack, [Name]. Are you chasing           │
│           Speed, Power, or Flight?"                                │
│                                                                    │
│    ┌─────────┐    ┌─────────┐    ┌─────────┐                      │
│    │  SPEED  │    │  POWER  │    │ FLIGHT  │                      │
│    │  (Volt) │    │ (Forge) │    │ (Flow)  │                      │
│    └─────────┘    └─────────┘    └─────────┘                      │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                    EQUIPMENT CHECK                                 │
│                                                                    │
│    You'll need:                                                    │
│    ✓ A tennis ball (for Plantar Reset exercises)                  │
│    ✓ A flat surface                                                │
│    ✓ 8-10 minutes per day                                          │
│                                                                    │
│    [ I'M READY ]                                                   │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
[Redirect to /programs/barefoot-reset with Day 1 unlocked]
```

### Acceptance Criteria

#### AC5.1: Contract Screen
- [ ] All 3 checkboxes required before signing
- [ ] Fingerprint scanner requires 2-second hold
- [ ] Animation plays on successful sign
- [ ] Contract timestamp saved to database
- [ ] Skip option available (but discouraged)

#### AC5.2: Wolf Sorting
- [ ] Three frequency options displayed
- [ ] Selection sets `primaryFrequency` in profile
- [ ] Skip option defaults to balanced
- [ ] Voice narration plays if audio enabled

#### AC5.3: Equipment Check
- [ ] Equipment list displays clearly
- [ ] "I'm Ready" CTA unlocks Day 1
- [ ] Enrollment record created in database

---

## E6: Program Completion (P2)

### User Story
> As a user who finished the program, I want to celebrate my achievement and receive my rewards.

### Completion Flow

```
[Workout 30 Complete]
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                    COMPLETION CEREMONY                             │
│                                                                    │
│                         🐺🎉                                       │
│                                                                    │
│              "WOLF REBORN - PROGRAM COMPLETE"                      │
│                                                                    │
│    ┌─────────────────────────────────────────────────────┐        │
│    │  42 Days        30 Workouts     1,500+ Shards       │        │
│    │  Completed      Crushed         Earned              │        │
│    └─────────────────────────────────────────────────────┘        │
│                                                                    │
│                    YOUR REWARDS:                                   │
│                                                                    │
│    ┌─────────┐    ┌─────────┐    ┌─────────┐                      │
│    │ 🏆      │    │ 🐺      │    │ $88     │                      │
│    │ Cert    │    │ Badge   │    │ Credit  │                      │
│    └─────────┘    └─────────┘    └─────────┘                      │
│                                                                    │
│              [ CLAIM REWARDS ]                                     │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                    CERTIFICATE GENERATION                          │
│                                                                    │
│    ┌─────────────────────────────────────────────────────┐        │
│    │                                                       │        │
│    │           CERTIFICATE OF COMPLETION                   │        │
│    │                                                       │        │
│    │           This certifies that                         │        │
│    │                                                       │        │
│    │               [USER NAME]                             │        │
│    │                                                       │        │
│    │    Has successfully completed the                     │        │
│    │    42-Day Barefoot Reset Program                      │        │
│    │                                                       │        │
│    │    Date: [COMPLETION DATE]                            │        │
│    │                                                       │        │
│    └─────────────────────────────────────────────────────┘        │
│                                                                    │
│    [ DOWNLOAD PDF ]    [ SHARE ]                                   │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                    WHAT'S NEXT?                                    │
│                                                                    │
│    Your $88 credit is ready!                                       │
│                                                                    │
│    ┌───────────────────────┐    ┌───────────────────────┐         │
│    │  Basketball Chassis   │    │  Speed Academy        │         │
│    │  8-Day Program        │    │  Coming Soon          │         │
│    │  [ USE $88 CREDIT ]   │    │  [ NOTIFY ME ]        │         │
│    └───────────────────────┘    └───────────────────────┘         │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

#### AC6.1: Completion Detection
- [ ] Program marked complete when workout 30 finished
- [ ] `completedAt` timestamp saved
- [ ] Status changes to "completed"

#### AC6.2: Rewards Distribution
- [ ] $88 credit added to wallet balance
- [ ] "Wolf Reborn" badge awarded
- [ ] Certificate PDF generated
- [ ] Email sent with certificate link

#### AC6.3: Certificate
- [ ] Personalized with user name
- [ ] Includes completion date
- [ ] Downloadable as PDF
- [ ] Shareable via link

#### AC6.4: Next Steps
- [ ] $88 credit visible and usable
- [ ] Related programs suggested
- [ ] Credit applies at checkout

---

## E7: Strike WOD System (P2)

### User Story
> As an athlete wanting extra challenge, I want to attempt bonus workouts for additional rewards.

### Strike WOD Flow

```
[Workout Complete Summary Card]
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                    STRIKE WOD PROMPT                               │
│                                                                    │
│    ⚡ STRIKE WOD AVAILABLE                                         │
│                                                                    │
│    "6-Minute AMRAP"                                                │
│                                                                    │
│    Exercises:                                                      │
│    • Tuck Jumps × 5                                                │
│    • Skater Squats × 8                                             │
│    • Flutter Kicks × 12                                            │
│    • Low Squat Soleus Raise × 20                                   │
│                                                                    │
│    POTENTIAL: +25 Shards                                           │
│                                                                    │
│    [ ⚡ BEGIN CHALLENGE ]    [ Skip for today ]                    │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼ (Begin)
┌───────────────────────────────────────────────────────────────────┐
│                    STRIKE WOD TIMER                                │
│                                                                    │
│                      ⏱ 5:42                                        │
│                                                                    │
│    Current: Tuck Jumps × 5                                         │
│                                                                    │
│    Round 2                                                         │
│                                                                    │
│    [ NEXT EXERCISE ]                                               │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼ (Timer ends)
┌───────────────────────────────────────────────────────────────────┐
│                    EFFORT RATING                                   │
│                                                                    │
│         How hard did you push today?                               │
│                                                                    │
│              ┌─────────────────┐                                   │
│              │                 │                                   │
│              │    🐺           │                                   │
│              │  [Wolf face     │                                   │
│              │   changes with  │                                   │
│              │   slider]       │                                   │
│              │                 │                                   │
│              └─────────────────┘                                   │
│                                                                    │
│    😴──────────●──────────────────💀                               │
│     1  2  3  4  5  6  7  8  9  10                                  │
│                                                                    │
│              Current: 4                                            │
│                                                                    │
│              [ SUBMIT EFFORT ]                                     │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                    STRIKE WOD COMPLETE                             │
│                                                                    │
│    ⚡ CHALLENGE COMPLETE                                           │
│                                                                    │
│    Effort: 4/10                                                    │
│    Bonus: +15 Shards                                               │
│                                                                    │
│    [ RETURN TO DEN ]                                               │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

### Effort → Shard Mapping

| Effort Range | Wolf Face | Bonus Shards |
|--------------|-----------|--------------|
| 1-4 | 😴 Sleepy | +15 |
| 5-7 | 😤 Focused | +20 |
| 8-10 | 💀 Beast Mode | +25 |

### Acceptance Criteria

#### AC7.1: Strike WOD Entry
- [ ] Prompt appears after workout completion (if available)
- [ ] Skip option returns to Den without penalty
- [ ] Begin loads Strike WOD timer

#### AC7.2: Strike WOD Timer
- [ ] Countdown from configured duration
- [ ] Exercise list visible
- [ ] Self-paced "Next Exercise" button
- [ ] Round counter tracks progress

#### AC7.3: Effort Rating
- [ ] Slider from 1-10
- [ ] Wolf face animates with slider position
- [ ] Submit saves rating to database

#### AC7.4: Rewards
- [ ] Bonus shards calculated from effort
- [ ] Added to total shards
- [ ] Strike WOD count incremented
- [ ] Related badges checked

---

## E8: Polish & Celebrations (P3)

### Features
- Wolf howl sound on workout complete
- Confetti particle effects
- Badge unlock animations
- Phase transition ceremonies
- Weekly summary emails
- Push notifications for chain at risk
- Social sharing of achievements
- Leaderboard (opt-in)

### Acceptance Criteria

#### AC8.1: Sound Effects
- [ ] Timer countdown beeps (10s, 5s, 3-2-1)
- [ ] Exercise complete click
- [ ] Workout complete wolf howl
- [ ] Shard collect crystalline ding
- [ ] Skip negative buzz

#### AC8.2: Animations
- [ ] Shard rain on completion
- [ ] Spider chart growth pulse
- [ ] Wolf evolution morph
- [ ] Badge unlock glow
- [ ] Chain milestone fire effect

#### AC8.3: Notifications
- [ ] "Chain at risk" push if no workout by 6pm
- [ ] "Milestone approaching" at 3, 7, 14 day marks
- [ ] Weekly summary email with stats
- [ ] Badge earned notification

---

## Test Scenarios

### Scenario 1: First-Time User Complete Flow
1. New user signs up
2. Navigates to Barefoot Reset program
3. Signs Wolf Contract
4. Completes Wolf Sorting
5. Views Day 1 mission detail
6. Starts workout
7. Completes all 6 exercises
8. Earns 48 shards + chain started
9. Returns to Den
10. Day 1 shows complete, Day 2 unlocked

### Scenario 2: Partial Workout with Skip
1. User starts workout
2. Completes 3 exercises
3. Skips 2 exercises
4. Completes 1 exercise
5. Total: 4/6 exercises
6. Earns 32 shards (4 × 8)
7. Chain FROZEN (not incremented, not broken)

### Scenario 3: Catch-Up Workout
1. User is on Day 10 but only completed 6 workouts
2. System shows "System Instability" warning
3. User completes Workout 7
4. Option to do second workout appears
5. User completes Workout 8
6. Both workouts earn full rewards
7. Progress synced to schedule

### Scenario 4: Strike WOD with High Effort
1. User completes regular workout
2. Strike WOD prompt appears
3. User begins 6-minute AMRAP
4. Timer expires
5. User rates effort 9/10
6. Earns +25 bonus shards
7. "First Strike" badge if first time

### Scenario 5: Chain Break Recovery
1. User has 7-day chain
2. Misses Day 8 entirely
3. Chain breaks → 0
4. "Comeback Kid" badge opportunity
5. User can restart chain from Day 9

### Scenario 6: Program Completion
1. User completes Workout 30
2. Completion ceremony plays
3. "Wolf Reborn" badge awarded
4. Certificate generated
5. $88 credit added to wallet
6. "What's next" suggestions shown

---

## Definition of Done

A feature is considered DONE when:

- [ ] Code written and compiles without errors
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass
- [ ] Acceptance criteria verified
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Error states handled gracefully
- [ ] Loading states implemented
- [ ] Analytics events tracked
- [ ] Code reviewed and approved
- [ ] Deployed to staging
- [ ] QA sign-off
- [ ] Documentation updated

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Video CDN outage | High | Low | Fallback to thumbnail + audio |
| Chain calculation bug | High | Medium | Server-side validation |
| Progress data loss | Critical | Low | Optimistic updates + retry |
| Mobile performance | Medium | Medium | Video preloading, lazy load |
| Clock manipulation cheating | Low | Low | Server timestamps |

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Owner: Product Team*
