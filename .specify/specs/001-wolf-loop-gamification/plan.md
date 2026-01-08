# Implementation Plan: Wolf Loop Gamification System

**Spec Version:** 1.1.0
**Plan Version:** 1.0.0
**Created:** 2026-01-02
**Status:** Gates Passed

---

## Phase -1: Pre-Implementation Gates

### Gate 1: Simplicity Gate

| Check | Pass? | Notes |
|-------|-------|-------|
| Initial implementation uses ≤3 files | [x] | Core: gamification.ts (extend), wolfDrops.ts (new), streak.ts (new) |
| Building only for current requirements | [x] | Phase 1 MVP only, no shop/pass |
| No speculative "might need" features | [x] | CV prep is data collection only |
| Using only necessary dependencies | [x] | Convex + existing UI libs |
| This is the simplest approach that works | [x] | Extend existing schema, minimal new tables |

**Gate 1 Status:** ✅ Pass

### Gate 2: Anti-Abstraction Gate

| Check | Pass? | Notes |
|-------|-------|-------|
| Using framework features directly | [x] | Convex mutations/queries, React hooks |
| Each concept has single representation | [x] | XP in users table, drops in wolfDrops table |
| Not wrapping things that work as-is | [x] | Using Convex directly, no ORM layer |
| Not abstracting single-use code | [x] | Drop loot table inline, not in separate "rewards engine" |
| Data flow is traceable without layers | [x] | Component → useMutation → Convex → client update |

**Gate 2 Status:** ✅ Pass

### Gate 3: Test-First Gate

| Check | Pass? | Notes |
|-------|-------|-------|
| Spec has measurable acceptance criteria | [x] | 28 ACs across 6 user stories |
| Each criterion maps to a test | [x] | See Testing Strategy below |
| Tests will be written before implementation | [x] | Vitest for Convex functions |
| Tests will be verified to fail first | [x] | RED → GREEN → Refactor |
| "Done" = tests pass, not feeling done | [x] | CI must pass |

**Gate 3 Status:** ✅ Pass

### Gate 4: Artifact Chain Gate

| Check | Pass? | Notes |
|-------|-------|-------|
| spec.md exists and is approved | [x] | Status: Approved |
| This plan references specific spec requirements | [x] | See Requirement Mapping |
| Every planned file traces to a requirement | [x] | See File tables in phases |
| No orphan code planned | [x] | Every component maps to US/AC |

**Gate 4 Status:** ✅ Pass

---

## Technical Decisions

### Technology Stack

| Layer | Choice | Rationale | Spec Requirement |
|-------|--------|-----------|------------------|
| Database | Convex | Already in use, real-time sync | NFR-4 (offline resilience) |
| Backend | Convex mutations | Server-side loot calculation (CEO directive) | FR-4 |
| Frontend | Next.js 15 + React | Existing web-academy app | NFR-3 |
| Styling | Tailwind + Framer Motion | Existing design system, animations | FR-4 (Wolf Drop reveal) |
| Testing | Vitest | Fast, TypeScript-native | Gate 3 |

### Architecture Approach

The Wolf Loop extends the existing gamification system. Backend calculates rewards before client animates (zero-lag reveal). Moon Streak is forgiving (3-day grace).

```
┌─────────────────────────────────────────────────────────────┐
│                     WOLF LOOP FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [HUNT Button] → completeMission() → Backend calculates:   │
│                                       ├── XP earned         │
│                                       ├── Streak update     │
│                                       ├── Rank check        │
│                                       └── Wolf Drop (pre-rolled)
│                                                             │
│  Client receives complete result → Animates in sequence:   │
│   1. XP ticks (fast burst)                                  │
│   2. Rank progress bar                                      │
│   3. Streak moon update                                     │
│   4. Wolf Drop reveal (tap to crack)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Choice | Alternatives Considered | Why This Choice |
|----------|--------|------------------------|-----------------|
| Loot calculation | Server-side pre-roll | Client-side random | CEO: Zero lag, backend determines before animation |
| Streak grace | 3-day reset (not 1) | Duolingo-style instant | Spec: Less punishing, moon "cracks" visual |
| XP display | Live ticks during workout | End-of-workout lump sum | Spec: Feels "alive" (AC-1.2) |
| Rank thresholds | 12-month curve (100K apex) | Fast progression | CEO: Longevity over quick gratification |

---

## Requirement Mapping

| Spec Requirement | Implementation Approach |
|-----------------|------------------------|
| FR-1: Daily Mission card | MissionCard component on home, data from enrollments |
| FR-2: XP awards on completion | Extend `completeWorkout` mutation with new thresholds |
| FR-3: Moon Streak tracking | New `updateStreak` with 3-day grace logic |
| FR-4: Wolf Drop reveal | New `wolfDrops` table + `claimDrop` mutation + animation component |
| FR-5: Rank ladder (6 tiers) | Update `RANK_REQUIREMENTS` + `calculateRank` |
| FR-6: Wolf color unlocks | Extend users schema with `unlockedColors` array |
| FR-7: Crystal earning | Already exists, update milestone amounts |
| FR-8: Daily caps | Already exists at 250 XP / 50 crystals |
| NFR-1: XP animation <100ms | Client-side counter, pre-calculated total |
| NFR-2: Wolf Drop <2s | Pre-rolled result, animation only |
| NFR-4: Offline resilience | Convex offline-first, sync on reconnect |

---

## Data Model

### Schema Changes

```typescript
// packages/yp-alpha/convex/schema.ts

// UPDATE: users table
users: defineTable({
  // ... existing fields ...

  // NEW: Extended rank system
  rank: v.union(
    v.literal("pup"),
    v.literal("scout"),    // NEW
    v.literal("runner"),   // NEW
    v.literal("hunter"),
    v.literal("alpha"),
    v.literal("apex")
  ),
  unlockedColors: v.optional(v.array(v.string())), // NEW: ["cyan", "gold", "purple", "green", "red", "cyber", "fire"]

  // UPDATE: Streak with grace state
  streakGraceState: v.optional(v.union(
    v.literal("healthy"),   // All good
    v.literal("cracked"),   // Missed 1 day
    v.literal("fading")     // Missed 2 days
  )),
  streakLastWarningAt: v.optional(v.number()), // For push notification throttle
})

// NEW: Wolf Drops table
wolfDrops: defineTable({
  userId: v.id("users"),
  earnedAt: v.number(),           // When mission was completed
  claimedAt: v.optional(v.number()), // When user tapped to reveal

  // Pre-rolled contents (CEO directive: backend calculates before animation)
  rarity: v.union(v.literal("common"), v.literal("uncommon"), v.literal("rare")),
  xpBonus: v.number(),            // 10-50 bonus XP
  crystals: v.number(),           // 1-15 crystals
  cosmetic: v.optional(v.object({
    type: v.union(v.literal("sticker"), v.literal("emote"), v.literal("loreCard")),
    id: v.string(),
  })),

  calendarDate: v.string(),       // "2026-01-02" - for one-per-day enforcement
})
  .index("by_user", ["userId"])
  .index("by_user_date", ["userId", "calendarDate"])
```

### Updated Constants

```typescript
// packages/yp-alpha/convex/gamification.ts

// NEW: 12-month longevity curve
export const RANK_THRESHOLDS = {
  pup: 0,
  scout: 1_000,      // ~2 weeks regular training
  runner: 5_000,     // ~1 month
  hunter: 15_000,    // ~3 months
  alpha: 50_000,     // ~6 months
  apex: 100_000,     // ~12 months
};

// NEW: Rank color unlocks
export const RANK_COLOR_UNLOCKS = {
  hunter: "cyber",
  alpha: "fire",
  apex: "gold",
};

// UPDATED: Crystal milestones (CEO approved)
export const STREAK_CRYSTAL_REWARDS = {
  7: 50,
  14: 100,
  30: 200,
  42: 500,
};

// NEW: Wolf Drop loot table
export const WOLF_DROP_LOOT = {
  common: { weight: 70, xpRange: [10, 20], crystalRange: [1, 5] },
  uncommon: { weight: 25, xpRange: [20, 35], crystalRange: [5, 10] },
  rare: { weight: 5, xpRange: [35, 50], crystalRange: [10, 15], hasCosmetic: true },
};
```

---

## Implementation Phases

### Phase 1: Data Layer & Core Logic

**Goal:** Backend can calculate XP, streaks, ranks, and pre-roll Wolf Drops

**Prerequisites:** None

**Deliverables:**
- Updated schema with new rank tiers and Wolf Drops table
- `completeMission` mutation that returns complete reward package
- `getStreakState` query with grace period logic
- `rollWolfDrop` internal function (pre-roll before client reveals)

**Files:**

| File | Purpose | Spec Requirement |
|------|---------|------------------|
| `packages/yp-alpha/convex/schema.ts` | Add wolfDrops table, update rank enum | FR-4, FR-5 |
| `packages/yp-alpha/convex/gamification.ts` | Update thresholds, add new functions | FR-2, FR-3, FR-5 |
| `packages/yp-alpha/convex/wolfDrops.ts` | Wolf Drop mutations/queries | FR-4 |
| `packages/yp-alpha/convex/streak.ts` | Moon Streak with 3-day grace | FR-3 |

**Tests:**

| Test | Validates | Acceptance Criterion |
|------|-----------|---------------------|
| Rank calculation at 1K, 5K, 15K, 50K, 100K XP | Correct tier assignment | AC-4.2 |
| Streak grace: miss 1 day = cracked | Grace state logic | AC-2.3 |
| Streak grace: miss 2 days = fading | Grace state logic | AC-2.4 |
| Streak reset: miss 3 days = 0 | Reset logic | AC-2.5 |
| Wolf Drop: one per calendar day | Daily limit | AC-3.6 |
| Wolf Drop: loot table distribution | Rarity weights | AC-3.5 |

**Checkpoint:**
- [ ] `npx convex dev` runs without errors
- [ ] Unit tests pass for rank calculation
- [ ] Unit tests pass for streak grace logic
- [ ] Wolf Drop pre-roll returns valid loot

---

### Phase 2: Mission Completion Flow

**Goal:** Completing a mission triggers XP, streak update, and Wolf Drop in one atomic operation

**Prerequisites:** Phase 1 complete

**Deliverables:**
- Unified `completeMission` mutation returning full reward package
- Streak milestone detection and crystal bonus
- Rank-up detection with color unlock

**Files:**

| File | Purpose | Spec Requirement |
|------|---------|------------------|
| `packages/yp-alpha/convex/missions.ts` | Mission completion orchestration | FR-1, FR-2 |
| `packages/yp-alpha/convex/gamification.ts` | Extend with rank-up detection | FR-5, FR-6 |

**Tests:**

| Test | Validates | Acceptance Criterion |
|------|-----------|---------------------|
| Complete mission awards 200 XP base | Base XP award | AC-1.3 |
| Streak milestone triggers crystal bonus | Milestone detection | AC-2.6 |
| Rank up from Scout to Runner at 5K XP | Rank progression | AC-4.2 |
| Hunter unlock grants "cyber" color | Color unlock | AC-4.4 |
| Second mission same day: no extra drop | Daily drop limit | AC-3.6 |

**Checkpoint:**
- [ ] Complete mission returns: `{ xp, crystals, streak, rankUp?, drop, colorsUnlocked? }`
- [ ] Streak milestones award correct crystal amounts
- [ ] Rank-up triggers color unlock in `unlockedColors` array
- [ ] Only one Wolf Drop per calendar day

---

### Phase 3: UI Components

**Goal:** Athlete sees animated rewards after mission completion

**Prerequisites:** Phase 2 complete

**Deliverables:**
- `MissionCard` component with HUNT button
- `XPBurst` animation component (live ticks)
- `MoonStreak` visual component (phase + crack state)
- `WolfDropReveal` animation component (tap to crack)
- `RankUpCelebration` modal

**Files:**

| File | Purpose | Spec Requirement |
|------|---------|------------------|
| `apps/web-academy/src/components/gamification/MissionCard.tsx` | Daily mission display | FR-1 |
| `apps/web-academy/src/components/gamification/XPBurst.tsx` | Animated XP counter | AC-1.2 |
| `apps/web-academy/src/components/gamification/MoonStreak.tsx` | Moon phase visual | AC-2.1 |
| `apps/web-academy/src/components/gamification/WolfDropReveal.tsx` | Drop animation | AC-3.2 |
| `apps/web-academy/src/components/gamification/RankUpCelebration.tsx` | Rank up modal | AC-4.3 |

**Tests:**

| Test | Validates | Acceptance Criterion |
|------|-----------|---------------------|
| MissionCard shows name, duration, reward | Card content | AC-1.1 |
| XPBurst animates from 0 to final value | Animation plays | AC-1.2 |
| MoonStreak renders correct phase (7, 14, 30 days) | Moon visual | AC-2.1 |
| WolfDropReveal has tap handler + haptics | Reveal interaction | AC-3.2 |
| RankUpCelebration shows new rank + unlocked color | Celebration content | AC-4.3 |

**Checkpoint:**
- [ ] Mission card visible on home screen
- [ ] XP ticks animate during workout
- [ ] Wolf Drop tap-to-crack animation completes in <2s
- [ ] Rank up shows celebration modal with coach line

---

### Phase 4: Integration & Polish

**Goal:** End-to-end flow works, parent can view progress

**Prerequisites:** Phase 3 complete

**Deliverables:**
- Home screen integration
- Parent dashboard streak/rank display
- Push notification setup for streak warnings
- Offline handling for mission completion

**Files:**

| File | Purpose | Spec Requirement |
|------|---------|------------------|
| `apps/web-academy/src/app/(app)/dashboard/page.tsx` | Integrate MissionCard | FR-1 |
| `apps/web-academy/src/app/(app)/parent/page.tsx` | Parent progress view | US-6 |
| `apps/web-academy/src/lib/notifications.ts` | Push notification triggers | AC-2.3 (cracked moon) |

**Tests:**

| Test | Validates | Acceptance Criterion |
|------|-----------|---------------------|
| E2E: Open app → complete mission → see drop | Full flow | All Phase 1 ACs |
| Parent sees athlete streak and rank | Parent view | AC-6.1, AC-6.2 |
| Offline completion syncs on reconnect | Offline resilience | NFR-4 |

**Checkpoint:**
- [ ] Complete "Time to First Sweat" flow in <3 taps
- [ ] Parent dashboard shows streak/rank
- [ ] Push notification fires at 6 PM if streak at risk
- [ ] All acceptance criteria verified

---

## Testing Strategy

### Test Hierarchy

| Level | What We Test | How We Test | When |
|-------|--------------|-------------|------|
| Contract | Convex mutations return expected shape | Vitest + Convex testing | Before implementation |
| Integration | Mission → XP → Drop flow | Vitest + Convex emulator | After Phase 2 |
| E2E | Full user flow | Playwright | After Phase 4 |
| Component | UI renders correctly | React Testing Library | During Phase 3 |

### Critical Test Scenarios

| Scenario | Validates | Priority |
|----------|-----------|----------|
| Complete mission, receive 200+ XP | FR-2 | Must Pass |
| Wolf Drop reveals with pre-rolled loot | FR-4, CEO directive | Must Pass |
| Miss 2 days, streak not reset | AC-2.4 | Must Pass |
| Miss 3 days, streak resets to 0 | AC-2.5 | Must Pass |
| Reach 15K XP, rank up to Hunter, unlock Cyber | AC-4.4 | Must Pass |
| Second mission same day gives XP but no drop | AC-3.6 | Must Pass |

---

## Complexity Notes

> No gate failures. All implementations use direct Convex patterns.

### Technical Debt Accepted

| Debt | Reason | Plan to Address |
|------|--------|-----------------|
| CV video collection but no scoring | MVP needs ship speed | Phase 2 adds CV scoring |
| No pity timer on Wolf Drops | Simple loot table first | Phase 2 if needed |

---

## Quickstart Validation

### Scenario 1: First Workout (Happy Path)

1. Open app → See "Today's Mission: Fast Feet (7 min)"
2. Tap HUNT → Complete workout
3. See XP burst (+200 ticking up)
4. See Moon Streak update (Day 1)
5. Tap Wolf Drop → Reveal: +15 XP, +8 Crystals
6. **Expected:** Total XP visible, crystals added, rank bar moves

### Scenario 2: Streak at Risk

1. Complete mission Day 1
2. Miss Day 2
3. Open app Day 2 (before midnight)
4. **Expected:** Moon shows "cracked" state, push notification at 6 PM

### Scenario 3: Rank Up

1. Accumulate 4,900 XP (Runner rank)
2. Complete mission (+200 XP = 5,100 total)
3. **Expected:** Rank up celebration, "You are now a RUNNER" coach line

### Scenario 4: Daily Drop Limit

1. Complete mission → Get Wolf Drop
2. Complete second workout same day
3. **Expected:** Get XP, but "Wolf Drop already claimed today"

---

## Review Checklist

### Gates
- [x] All gates pass OR have documented exceptions
- [x] Complexity notes explain any gate failures

### Traceability
- [x] Every file traces to a spec requirement
- [x] Every test traces to an acceptance criterion
- [x] No orphan implementations planned

### Completeness
- [x] All spec requirements have implementation approaches
- [x] All phases have checkpoints
- [x] Testing strategy covers acceptance criteria

### Quality
- [x] Architecture is as simple as possible
- [x] No unnecessary abstractions
- [x] Test-first approach planned

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-02 | Claude (MAI) | Initial plan - 4 phases |
