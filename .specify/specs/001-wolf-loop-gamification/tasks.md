# Tasks: Wolf Loop Gamification System

> **Spec:** `.specify/specs/001-wolf-loop-gamification/spec.md`
> **Plan:** `.specify/specs/001-wolf-loop-gamification/plan.md`
> **Status:** Ready for Implementation
> **Last Updated:** 2026-01-02

---

## Task Legend

| Marker | Meaning |
|--------|---------|
| `[P]` | **Parallel** - Can run concurrently with other `[P]` tasks |
| `[S]` | **Sequential** - Must run in order |
| `[S:1.1,1.2]` | **Sequential with deps** - Blocked until tasks 1.1 and 1.2 complete |
| `[B]` | **Blocker** - Checkpoint, cannot proceed until verified |
| `[T]` | **Test** - Verification task |

---

## Progress Summary

| Phase | Tasks | Complete | Status |
|-------|-------|----------|--------|
| Phase 0: Setup | 3 | 0% | Not Started |
| Phase 1: Data Layer | 8 | 0% | Not Started |
| Phase 2: Mission Flow | 6 | 0% | Not Started |
| Phase 3: UI Components | 10 | 0% | Not Started |
| Phase 4: Integration | 6 | 0% | Not Started |
| **Total** | **33** | **0%** | **Not Started** |

---

## Dependency Graph

```
Phase 0: Setup
  0.1 ─── 0.2 ─── 0.3
                   │
                   ▼
Phase 1: Data Layer
  1.1 (tests) ────────────────────┐
       │                          │
       ├─▶ 1.2 (schema) ──┐       │
       │                  │       │
       ├─▶ 1.3 (ranks) ───┼───────┤
       │                  │       │
       ├─▶ 1.4 (streak) ──┤       │
       │                  │       │
       └─▶ 1.5 (drops) ───┘       │
                          │       │
                    1.6 (verify)  │
                          │       │
                    1.7 [B] ◀─────┘
                          │
                          ▼
Phase 2: Mission Flow
  2.1 (tests) ────────────────────┐
       │                          │
       ├─▶ 2.2 (completeMission)  │
       │                          │
       └─▶ 2.3 (milestones) ──────┤
                                  │
                    2.4 (verify)  │
                          │       │
                    2.5 [B] ◀─────┘
                          │
                          ▼
Phase 3: UI Components
  3.1 (tests) ─────────────────────────┐
       │                               │
       ├─▶ 3.2 (MissionCard) ──┐       │
       │                       │       │
       ├─▶ 3.3 (XPBurst) ──────┤       │
       │                       │       │
       ├─▶ 3.4 (MoonStreak) ───┼───────┤
       │                       │       │
       ├─▶ 3.5 (WolfDropReveal)│       │
       │                       │       │
       └─▶ 3.6 (RankUp) ───────┘       │
                               │       │
                    3.7 (integrate)    │
                               │       │
                    3.8 [B] ◀──────────┘
                               │
                               ▼
Phase 4: Integration
  4.1 ─── 4.2 ─── 4.3 ─── 4.4 ─── 4.5 [B]
```

---

## Phase 0: Setup [S]

Foundation work before implementation begins.

- [ ] **0.1** [S] Create feature branch
  ```bash
  git checkout -b feat/001-wolf-loop-gamification
  ```

- [ ] **0.2** [S] Verify Convex dev environment
  ```bash
  cd packages/yp-alpha && npx convex dev
  ```
  - **Verify:** Convex dashboard accessible, schema synced

- [ ] **0.3** [S] Create gamification component directory
  ```bash
  mkdir -p apps/web-academy/src/components/gamification
  ```

---

## Phase 1: Data Layer & Core Logic [S:0.3]

Backend can calculate XP, streaks, ranks, and pre-roll Wolf Drops.

### Tests First

- [ ] **1.1** [S] Create test files for gamification logic
  - File: `packages/yp-alpha/convex/gamification.test.ts`
  - File: `packages/yp-alpha/convex/streak.test.ts`
  - File: `packages/yp-alpha/convex/wolfDrops.test.ts`

  **Test Cases:**
  - [ ] Rank calculation: 0 XP → Pup
  - [ ] Rank calculation: 1000 XP → Scout
  - [ ] Rank calculation: 5000 XP → Runner
  - [ ] Rank calculation: 15000 XP → Hunter (+ cyber unlock)
  - [ ] Rank calculation: 50000 XP → Alpha (+ fire unlock)
  - [ ] Rank calculation: 100000 XP → Apex (+ gold unlock)
  - [ ] Streak grace: miss 1 day → cracked state
  - [ ] Streak grace: miss 2 days → fading state
  - [ ] Streak reset: miss 3 days → 0
  - [ ] Wolf Drop: one per calendar day enforced
  - [ ] Wolf Drop: loot table weights (70% common, 25% uncommon, 5% rare)

  **Verify:** Tests fail (RED state)

### Schema Updates

- [ ] **1.2** [P:1.1] Update Convex schema with Wolf Loop entities
  - File: `packages/yp-alpha/convex/schema.ts`
  - Add: `wolfDrops` table
  - Update: `users.rank` enum (add scout, runner)
  - Add: `users.unlockedColors` array
  - Add: `users.streakGraceState` field
  - Traces to: FR-4, FR-5, FR-6

  **Verify:** `npx convex dev` runs without errors

### Core Logic Implementation

- [ ] **1.3** [P:1.1] Update rank calculation with 12-month curve
  - File: `packages/yp-alpha/convex/gamification.ts`
  - Update: `RANK_THRESHOLDS` (0, 1K, 5K, 15K, 50K, 100K)
  - Update: `calculateRank()` function
  - Add: `RANK_COLOR_UNLOCKS` mapping
  - Add: `getUnlockedColors()` helper
  - Traces to: FR-5, AC-4.2, AC-4.4, AC-4.5, AC-4.6

- [ ] **1.4** [P:1.1] Create Moon Streak logic with 3-day grace
  - File: `packages/yp-alpha/convex/streak.ts`
  - Function: `updateStreakState()` - healthy/cracked/fading/reset
  - Function: `getStreakDisplayData()` - moon phase calculation
  - Function: `checkStreakMilestone()` - 7/14/30/42 day detection
  - Constant: `STREAK_CRYSTAL_REWARDS` (50, 100, 200, 500)
  - Traces to: FR-3, AC-2.1 through AC-2.6

- [ ] **1.5** [P:1.1] Create Wolf Drop system (CEO priority)
  - File: `packages/yp-alpha/convex/wolfDrops.ts`
  - Mutation: `rollWolfDrop()` - pre-calculate loot on backend
  - Mutation: `claimWolfDrop()` - mark as claimed
  - Query: `getTodaysDrop()` - check if drop available
  - Query: `getUnclaimedDrop()` - for reveal animation
  - Constant: `WOLF_DROP_LOOT` table with weights
  - Traces to: FR-4, AC-3.1 through AC-3.6

  **Critical (CEO Directive):** Backend calculates rarity + contents BEFORE client animates. Zero lag.

### Verification

- [ ] **1.6** [S:1.2,1.3,1.4,1.5] Run Phase 1 tests
  - Command: `cd packages/yp-alpha && pnpm test`
  - **Verify:** All rank calculation tests pass (GREEN)
  - **Verify:** All streak grace tests pass (GREEN)
  - **Verify:** All Wolf Drop tests pass (GREEN)

### Phase 1 Checkpoint

- [ ] **1.7** [B] Validate Phase 1 complete
  - [ ] Schema deploys to Convex without errors
  - [ ] Rank thresholds: 0→1K→5K→15K→50K→100K verified
  - [ ] Streak grace: 3-day reset logic verified
  - [ ] Wolf Drop: one-per-day enforcement verified
  - [ ] Wolf Drop: pre-roll returns valid loot

---

## Phase 2: Mission Completion Flow [S:1.7]

Completing a mission triggers XP, streak update, and Wolf Drop in one atomic operation.

### Tests First

- [ ] **2.1** [S] Create mission completion tests
  - File: `packages/yp-alpha/convex/missions.test.ts`

  **Test Cases:**
  - [ ] Complete mission awards 200 XP base
  - [ ] Complete mission extends streak
  - [ ] Complete mission triggers Wolf Drop roll
  - [ ] Streak milestone (7d) awards 50 crystals
  - [ ] Streak milestone (42d) awards 500 crystals
  - [ ] Rank up at 5K XP triggers Runner + no color
  - [ ] Rank up at 15K XP triggers Hunter + "cyber" unlock
  - [ ] Second mission same day: XP yes, drop no

  **Verify:** Tests fail (RED state)

### Implementation

- [ ] **2.2** [S:2.1] Create unified `completeMission` mutation
  - File: `packages/yp-alpha/convex/missions.ts`
  - Input: `userId, enrollmentId, dayNumber, durationSeconds`
  - Returns: `{ xp, crystals, streak, rankUp?, drop, colorsUnlocked? }`
  - Orchestrates: XP award → streak update → rank check → drop roll
  - Traces to: FR-1, FR-2, FR-3, FR-4

  **Atomic:** All updates in single transaction

- [ ] **2.3** [S:2.1] Add streak milestone detection
  - File: `packages/yp-alpha/convex/streak.ts` (extend)
  - Function: `processStreakMilestone()` - awards crystals on 7/14/30/42
  - Traces to: AC-2.6, AC-5.1

### Verification

- [ ] **2.4** [S:2.2,2.3] Run Phase 2 tests
  - Command: `cd packages/yp-alpha && pnpm test`
  - **Verify:** Mission completion flow tests pass (GREEN)
  - **Verify:** Milestone crystal awards correct

### Phase 2 Checkpoint

- [ ] **2.5** [B] Validate Phase 2 complete
  - [ ] `completeMission` returns full reward package
  - [ ] Streak milestones award correct crystal amounts
  - [ ] Rank-up triggers color unlock
  - [ ] Only one Wolf Drop per calendar day

---

## Phase 3: UI Components [S:2.5]

Athlete sees animated rewards after mission completion.

### Tests First

- [ ] **3.1** [S] Create component tests
  - File: `apps/web-academy/src/components/gamification/__tests__/`

  **Test Cases:**
  - [ ] MissionCard renders name, duration, reward preview
  - [ ] XPBurst animates from 0 to final value
  - [ ] MoonStreak renders correct phase for 7/14/30 days
  - [ ] MoonStreak shows cracked state when streakGraceState = "cracked"
  - [ ] WolfDropReveal has tap handler
  - [ ] RankUpCelebration shows new rank name
  - [ ] RankUpCelebration shows unlocked color if applicable

  **Verify:** Tests fail (RED state)

### Component Implementation

- [ ] **3.2** [P:3.1] Create MissionCard component
  - File: `apps/web-academy/src/components/gamification/MissionCard.tsx`
  - Props: `mission: { name, duration, xpReward }`
  - Features: Big HUNT button, duration badge, reward preview
  - Traces to: FR-1, AC-1.1

- [ ] **3.3** [P:3.1] Create XPBurst animation component (Sweat Meter)
  - File: `apps/web-academy/src/components/gamification/XPBurst.tsx`
  - Props: `targetXP: number, onComplete: () => void`
  - Animation: Ticks from 0 to target with easing
  - Sound: Optional tick sound effect
  - Traces to: AC-1.2, NFR-1

- [ ] **3.4** [P:3.1] Create MoonStreak visual component
  - File: `apps/web-academy/src/components/gamification/MoonStreak.tsx`
  - Props: `streakDays: number, graceState: "healthy" | "cracked" | "fading"`
  - Visual: Moon phase (sliver → half → full)
  - States: Healthy glow, cracked overlay, fading dim
  - Traces to: AC-2.1, AC-2.3, AC-2.4

- [ ] **3.5** [P:3.1] Create WolfDropReveal animation (CEO #1 priority)
  - File: `apps/web-academy/src/components/gamification/WolfDropReveal.tsx`
  - Props: `drop: { rarity, xpBonus, crystals, cosmetic? }`
  - Animation: Geode/crystal → tap to crack → reveal contents
  - Haptics: Vibration on crack
  - Timing: <2s total animation
  - Traces to: AC-3.2, AC-3.3, AC-3.4, AC-3.5, NFR-2

  **Critical:** Drop contents already calculated. Animation is reveal only.

- [ ] **3.6** [P:3.1] Create RankUpCelebration modal
  - File: `apps/web-academy/src/components/gamification/RankUpCelebration.tsx`
  - Props: `newRank: string, unlockedColor?: string`
  - Animation: Badge pop, wolf howl sound
  - Content: "You are now a HUNTER", color swatch if unlocked
  - Coach line: "LOCK IN. LEVEL UP."
  - Traces to: AC-4.3, AC-4.4, AC-4.5, AC-4.6

### Integration

- [ ] **3.7** [S:3.2,3.3,3.4,3.5,3.6] Create reward flow orchestrator
  - File: `apps/web-academy/src/components/gamification/RewardFlow.tsx`
  - Orchestrates: XPBurst → MoonStreak update → RankUp (if any) → WolfDropReveal
  - Uses: `completeMission` result to drive sequence
  - Traces to: US-1, US-2, US-3, US-4

### Phase 3 Checkpoint

- [ ] **3.8** [B] Validate Phase 3 complete
  - [ ] All component tests pass (GREEN)
  - [ ] MissionCard visible with HUNT button
  - [ ] XPBurst animation ticks <100ms responsiveness
  - [ ] MoonStreak shows correct phase
  - [ ] WolfDropReveal completes in <2s
  - [ ] RankUpCelebration shows coach line

---

## Phase 4: Integration & Polish [S:3.8]

End-to-end flow works, parent can view progress.

### Home Screen Integration

- [ ] **4.1** [S] Integrate MissionCard on dashboard
  - File: `apps/web-academy/src/app/(app)/dashboard/page.tsx`
  - Add: MissionCard component with today's mission data
  - Add: Hook to fetch daily mission from enrollment
  - Traces to: FR-1, AC-1.1

- [ ] **4.2** [S:4.1] Wire up mission completion flow
  - File: `apps/web-academy/src/app/(app)/workout/[day]/page.tsx`
  - On workout complete: Call `completeMission` mutation
  - On response: Trigger RewardFlow component
  - Traces to: US-1, US-3

### Parent Dashboard

- [ ] **4.3** [S:4.2] Add parent progress view
  - File: `apps/web-academy/src/app/(app)/parent/page.tsx`
  - Display: Current streak, rank, total XP
  - Display: Streak milestone achievements
  - Hide: Crystal balance (athlete's private economy)
  - Traces to: US-6, AC-6.1, AC-6.2, AC-6.3

### Push Notifications

- [ ] **4.4** [S:4.3] Add streak warning notifications
  - File: `apps/web-academy/src/lib/notifications.ts`
  - Trigger: 6 PM local time if streak at risk
  - Message: "The Moon is fading. 2 hours left to save the streak."
  - Traces to: AC-2.3 (cracked moon warning)

### Final Validation

- [ ] **4.5** [B] E2E Validation
  - [ ] [T] Scenario 1: First Workout Happy Path
    1. Open app → See "Today's Mission"
    2. Tap HUNT → Complete workout
    3. See XP burst (+200)
    4. See Moon Streak update
    5. Tap Wolf Drop → Reveal rewards
    - **Expected:** All animations play, data persists

  - [ ] [T] Scenario 2: Streak at Risk
    1. Complete mission Day 1
    2. Miss Day 2, open app before midnight
    - **Expected:** Moon shows "cracked", push at 6 PM

  - [ ] [T] Scenario 3: Rank Up
    1. Accumulate 4,900 XP
    2. Complete mission (+200 = 5,100)
    - **Expected:** RankUpCelebration shows "RUNNER"

  - [ ] [T] Scenario 4: Daily Drop Limit
    1. Complete mission → Get Wolf Drop
    2. Complete second workout
    - **Expected:** Get XP, no second drop

---

## Phase 5: Ship [S:4.5]

Final steps to production.

- [ ] **5.1** [S] Run `/prodcheck`
  - [ ] Security scan passes
  - [ ] No broken links
  - [ ] Performance >= 90

- [ ] **5.2** [S:5.1] Create PR with summary
  - Title: `feat(001): Wolf Loop Gamification System`
  - Body: Link to spec, summary of changes
  - Include: Test coverage report

- [ ] **5.3** [S:5.2] Get review approval

- [ ] **5.4** [S:5.3] Merge to main

- [ ] **5.5** [S:5.4] Verify production deployment

- [ ] **5.6** [S:5.5] Update spec status to "Implemented"

---

## Blockers Log

| Task | Blocker | Owner | Status |
|------|---------|-------|--------|
| None yet | - | - | - |

---

## Notes

### CEO Directives
1. **Wolf Drop is #1 priority asset** - Backend pre-rolls, client reveals
2. **Sweat Meter (XP Ticks)** - Must feel "alive" during workout
3. **12-month longevity** - Apex at 100K XP, not 4K

### Technical Notes
- Convex handles offline resilience automatically
- Use Framer Motion for animations (already in project)
- Device timezone for streak reset (travel-friendly)

### Phase 2 Prep (Not in Scope)
- CV video collection happening in background (data only)
- Crystal shop UI deferred
- Streak Shield deferred

---

*Generated from plan: `.specify/specs/001-wolf-loop-gamification/plan.md`*
