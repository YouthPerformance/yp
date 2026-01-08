# Implementation Plan: XP + Crystal Economy v2.0

**Spec Version:** 2.0.0
**Plan Version:** 1.0.0
**Created:** 2026-01-07
**Status:** Gates Passed

---

## Phase -1: Pre-Implementation Gates

> **STOP.** Complete this section FIRST. Do not proceed until all gates pass or have justified exceptions.

### Gate 1: Simplicity Gate

| Check | Pass? | Notes |
|-------|-------|-------|
| Initial implementation uses ≤3 files | [x] | Per phase, yes. Total: 8 files across 4 phases |
| Building only for current requirements | [x] | No Partner Vault UI (Phase 2+), no credit purchase flow |
| No speculative "might need" features | [x] | Ledger exists for audit, not speculation |
| Using only necessary dependencies | [x] | Convex, Zustand, Framer Motion (all existing) |
| This is the simplest approach that works | [x] | Shards→Crystals is simpler than 5-currency arcade model |

**Gate 1 Status:** ✅ Pass

### Gate 2: Anti-Abstraction Gate

| Check | Pass? | Notes |
|-------|-------|-------|
| Using framework features directly | [x] | Convex mutations directly, no wrapper |
| Each concept has single representation | [x] | Shards in users table, Crystals in users table |
| Not wrapping things that work as-is | [x] | No "EconomyService" layer |
| Not abstracting single-use code | [x] | Conversion logic inline in mutation |
| Data flow is traceable without layers | [x] | User → Mutation → Schema → Query → UI |

**Gate 2 Status:** ✅ Pass

### Gate 3: Test-First Gate

| Check | Pass? | Notes |
|-------|-------|-------|
| Spec has measurable acceptance criteria | [x] | BR-1 through BR-7 are testable |
| Each criterion maps to a test | [x] | See Testing Strategy below |
| Tests will be written before implementation | [x] | Convex test file first |
| Tests will be verified to fail first | [x] | RED → GREEN → Refactor |
| "Done" = tests pass, not feeling done | [x] | CI gate on tests |

**Gate 3 Status:** ✅ Pass

### Gate 4: Artifact Chain Gate

| Check | Pass? | Notes |
|-------|-------|-------|
| spec.md exists and is approved | [x] | 004-xp-crystal-economy/spec.md |
| This plan references specific spec requirements | [x] | All FR/BR mapped below |
| Every planned file traces to a requirement | [x] | See Requirement Mapping |
| No orphan code planned | [x] | All files justified |

**Gate 4 Status:** ✅ Pass

---

## Technical Decisions

### Technology Stack

| Layer | Choice | Rationale | Spec Requirement |
|-------|--------|-----------|------------------|
| Database | Convex | Real-time sync, already in use | All data persistence |
| State (UI) | Zustand | Local state for animations, existing pattern | NFR-1 (animation speed) |
| Animations | Framer Motion | Shard meter fill, crystal pop | UX delight |
| Auth | Clerk | User ID binding, existing | Parent gate for Partner Vault |

### Architecture Approach

The economy is a thin data layer on top of existing user records. No separate "economy service" — just Convex mutations that update user fields atomically.

```
┌─────────────────────────────────────────────────────────────┐
│                         UI LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ ShardMeter   │  │ CrystalBadge │  │ WolfDropV2   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│           │                │                │                │
│           └────────────────┼────────────────┘                │
│                            ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              useEconomy() - Zustand Store               ││
│  │  - optimistic shard updates                             ││
│  │  - animation triggers                                   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      CONVEX LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ awardShards  │  │ convertToXtal│  │ recordLedger │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                            │                                 │
│                            ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    users table                          ││
│  │  + totalShards, totalCrystals, totalCredits             ││
│  │  + dailyShardsEarned, lastShardResetAt                  ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                 economyLedger table                     ││
│  │  + type, amount, source, sourceType, timestamp          ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Choice | Alternatives Considered | Why This Choice |
|----------|--------|------------------------|-----------------|
| Shard storage | Field on users table | Separate shards table | Simpler, atomic updates |
| Conversion trigger | Auto at 10 shards | Manual "claim" button | Less friction, more delight |
| Ledger granularity | Per-transaction | Daily rollup | Audit trail for partner fraud |
| Daily reset | Midnight user timezone | UTC midnight | Matches existing streak logic |

---

## Requirement Mapping

| Spec Requirement | Implementation Approach |
|-----------------|------------------------|
| BR-1: 10 shards = 1 crystal | `convertShardsIfNeeded()` in awardShards mutation |
| BR-2: Crystals never decrease (except spending) | No negative crystal mutations, only spend functions |
| BR-3: Partner redemption requires parent claim | Parent gate check in Clerk + Convex |
| BR-4: Wolf Drop = cosmetics only | Loot table in wolfDrops.ts, no crystal rewards |
| BR-5: Purchased currency = cosmetics only | `sourceType` field in ledger, spend validation |
| BR-6: Daily shard cap: 20 shards | Check `dailyShardsEarned` before awarding |
| BR-7: XP never used for real-world value | XP mutations have no crystal/shard side effects |

---

## Data Model

### Schema Updates (packages/yp-alpha/convex/schema.ts)

```
users (UPDATE existing table)
├── totalShards: number - Fractional currency (0-9 visible)
├── totalCrystals: number - Whole currency
├── totalCredits: number - AI compute budget
├── dailyShardsEarned: number - Reset at midnight
├── lastShardResetAt: number - Timestamp for reset logic
└── (existing fields unchanged)

economyLedger (NEW table)
├── userId: Id<"users"> - Who
├── type: 'xp' | 'shard' | 'crystal' | 'credit' - What
├── amount: number - How much (+/-)
├── source: string - Why (e.g., "wolf_drop", "module:bpa-v1")
├── sourceType: 'earned' | 'purchased' | 'converted' - Origin
├── timestamp: number - When
└── metadata?: object - Extra context

partnerRedemptions (NEW table - Phase 2)
├── userId: Id<"users"> - Athlete
├── claimedByUserId: Id<"users"> - Parent
├── partnerId: string - Partner brand
├── rewardId: string - Specific reward
├── crystalCost: number - Price paid
├── claimedAt: number - When claimed
├── redeemedAt?: number - When used
└── code?: string - Discount code
```

---

## Implementation Phases

### Phase 1: Schema & Core Mutations

**Goal:** Users can earn and store shards, auto-convert to crystals
**Prerequisites:** None
**Deliverables:**
- Updated Convex schema with economy fields
- Core mutations for shard/crystal operations
- Ledger recording for all transactions

**Files:**
| File | Purpose | Spec Requirement |
|------|---------|------------------|
| `packages/yp-alpha/convex/schema.ts` | Add economy fields to users, new economyLedger table | All data storage |
| `packages/yp-alpha/convex/economy.ts` | Mutations: awardShards, awardXp, convertToCrystals, recordLedger | BR-1, BR-2, BR-6 |

**Tests:**
| Test | Validates | Acceptance Criterion |
|------|-----------|---------------------|
| `awardShards respects daily cap` | BR-6 | Cannot exceed 20 shards/day |
| `10 shards auto-converts to 1 crystal` | BR-1 | Conversion happens atomically |
| `crystals never decrease from earn` | BR-2 | No negative crystal mutations |
| `ledger records all transactions` | Audit trail | Every award has ledger entry |

**Checkpoint:**
- [ ] `npx convex dev` runs without errors
- [ ] Test: Award 10 shards → user has 1 crystal, 0 shards
- [ ] Test: Award 25 shards in one day → user has 20 shards (capped)
- [ ] Ledger shows all transactions with correct source

---

### Phase 2: UI Components

**Goal:** Users see shard meter, crystal badge, and earning animations
**Prerequisites:** Phase 1 complete
**Deliverables:**
- ShardMeter component (fills toward 10)
- CrystalBadge component (shows total)
- useEconomy Zustand store for optimistic updates

**Files:**
| File | Purpose | Spec Requirement |
|------|---------|------------------|
| `apps/web-academy/src/stores/economyStore.ts` | Zustand store for UI state | Local state management |
| `apps/web-academy/src/components/economy/ShardMeter.tsx` | Visual shard progress (0-10) | "Kids see shards filling" |
| `apps/web-academy/src/components/economy/CrystalBadge.tsx` | Crystal count display | Profile/nav visibility |
| `apps/web-academy/src/components/economy/ShardReward.tsx` | "+1 shard" animation on earn | Dopamine feedback |

**Tests:**
| Test | Validates | Acceptance Criterion |
|------|-----------|---------------------|
| `ShardMeter renders 0-10 correctly` | Visual accuracy | Shows current/10 |
| `ShardMeter animates on increment` | UX delight | Smooth fill animation |
| `CrystalBadge shows correct count` | Data binding | Matches Convex state |
| `ShardReward plays animation` | Feedback | Visible "+1" float |

**Checkpoint:**
- [ ] ShardMeter visible on profile page
- [ ] Earning shards shows animation
- [ ] Crystal count updates in real-time
- [ ] 10th shard triggers conversion celebration

---

### Phase 3: Wolf Drop v2 Integration

**Goal:** Wolf Drop awards shards + cosmetics, no crystals
**Prerequisites:** Phase 2 complete
**Deliverables:**
- Updated Wolf Drop loot table (shards not crystals)
- Wolf Drop reveal includes shard meter update
- No real-world value in drops

**Files:**
| File | Purpose | Spec Requirement |
|------|---------|------------------|
| `packages/yp-alpha/convex/wolfDrops.ts` | Update loot table: XP + 1 shard + cosmetic | BR-4 |
| `apps/web-academy/src/components/wolfloop/WolfDropReveal.tsx` | Show shard earned in reveal | UX integration |

**Tests:**
| Test | Validates | Acceptance Criterion |
|------|-----------|---------------------|
| `Wolf Drop always includes 1 shard` | BR-4 | Guaranteed shard |
| `Wolf Drop never includes crystals` | BR-4 | No crystal in loot table |
| `Wolf Drop cosmetics are random` | Dopamine variety | 80/15/5 rarity distribution |

**Checkpoint:**
- [ ] Complete workout → Wolf Drop includes "+1 shard"
- [ ] Shard meter updates after Wolf Drop claim
- [ ] No crystals awarded directly from drops
- [ ] Cosmetic rarity feels varied

---

### Phase 4: Module Rewards Integration

**Goal:** ILM modules award shards per level, not crystals
**Prerequisites:** Phase 3 complete
**Deliverables:**
- Update module completion to use new economy
- Level rewards: 0/1/1/2 shards
- Completion bonus: +1 shard if ≥80% accuracy

**Files:**
| File | Purpose | Spec Requirement |
|------|---------|------------------|
| `packages/yp-alpha/convex/learningModules.ts` | Update completeModule to award shards | ILM integration |
| `apps/web-academy/src/components/modules/cards/CompletionCard.tsx` | Show shard rewards on completion | UX feedback |

**Tests:**
| Test | Validates | Acceptance Criterion |
|------|-----------|---------------------|
| `Level 2 completion awards 1 shard` | Spec alignment | Per LEVEL_REWARDS |
| `80%+ accuracy awards bonus shard` | Quality gate | Accuracy check |
| `Module replay earns XP not shards` | Anti-farming | Shards once per module |

**Checkpoint:**
- [ ] Complete BPA Level 2 → see "+1 shard" animation
- [ ] Complete BPA with 90% → see "+1 bonus shard"
- [ ] Total BPA completion = 5 shards maximum
- [ ] Replay BPA = XP only, no additional shards

---

## Testing Strategy

### Test Hierarchy

| Level | What We Test | How We Test | When |
|-------|--------------|-------------|------|
| Contract | Convex mutations match spec | Convex test runner | Before implementation |
| Integration | Shard→Crystal conversion | Convex test with state | After Phase 1 |
| E2E | Full earn→convert→display flow | Playwright | After Phase 2 |
| Unit | Calculation functions | Vitest | During implementation |

### Critical Test Scenarios

| Scenario | Validates | Priority |
|----------|-----------|----------|
| Award 10 shards → 1 crystal appears | BR-1 conversion | Must Pass |
| Award 21 shards in day → capped at 20 | BR-6 daily cap | Must Pass |
| Wolf Drop → shard not crystal | BR-4 no RNG value | Must Pass |
| Module completion → correct shard count | ILM alignment | Must Pass |
| Crystal spend → ledger records negative | Audit trail | Must Pass |

### Test File Locations

```
packages/yp-alpha/convex/
  economy.test.ts         # Mutation tests

apps/web-academy/
  src/components/economy/__tests__/
    ShardMeter.test.tsx   # Component tests
    CrystalBadge.test.tsx

  e2e/
    economy.spec.ts       # Playwright E2E
```

---

## Complexity Notes

> No gate failures. All implementations are straightforward.

### Technical Debt Accepted

| Debt | Reason | Plan to Address |
|------|--------|-----------------|
| No Partner Vault UI | Phase 2+ per spec | Separate spec when needed |
| No credit purchase flow | Phase 2+ per spec | Stripe integration later |
| Ledger not pruned | Audit requirements unclear | Add TTL when policy defined |

---

## Quickstart Validation

### Scenario 1: Shard Earning Flow

1. User completes daily workout
2. Wolf Drop reveals "+1 shard"
3. ShardMeter on profile shows 1/10
4. **Expected:** Shard visible, ledger entry exists

### Scenario 2: Crystal Conversion

1. User has 9 shards
2. Completes workout → earns 1 shard
3. ShardMeter fills to 10, then resets to 0
4. CrystalBadge increments by 1
5. **Expected:** Celebration animation, crystal +1, shards reset to 0

### Scenario 3: Daily Cap Enforcement

1. User earns 18 shards today
2. Completes action worth 5 shards
3. **Expected:** Only 2 shards awarded (cap at 20), UI shows "Daily limit reached"

### Scenario 4: Module Shard Rewards

1. User starts BPA module
2. Completes Level 2
3. **Expected:** "+1 shard" animation, 50 XP awarded
4. Completes full module with 85% accuracy
5. **Expected:** "+1 bonus shard" for accuracy

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

## File Manifest

### Phase 1 Files (3)
| File | Type | Lines Est. |
|------|------|------------|
| `convex/schema.ts` | UPDATE | +30 |
| `convex/economy.ts` | NEW | ~150 |
| `convex/economy.test.ts` | NEW | ~100 |

### Phase 2 Files (4)
| File | Type | Lines Est. |
|------|------|------------|
| `stores/economyStore.ts` | NEW | ~50 |
| `components/economy/ShardMeter.tsx` | NEW | ~80 |
| `components/economy/CrystalBadge.tsx` | NEW | ~40 |
| `components/economy/ShardReward.tsx` | NEW | ~60 |

### Phase 3 Files (2)
| File | Type | Lines Est. |
|------|------|------------|
| `convex/wolfDrops.ts` | UPDATE | +20 |
| `components/wolfloop/WolfDropReveal.tsx` | UPDATE | +30 |

### Phase 4 Files (2)
| File | Type | Lines Est. |
|------|------|------------|
| `convex/learningModules.ts` | UPDATE | +40 |
| `components/modules/cards/CompletionCard.tsx` | UPDATE | +20 |

**Total: 11 files, ~620 lines**

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-07 | Claude (MAI) | Initial plan - 4 phases |

---

*Ready for implementation. Run `/execute-tasks` to generate task breakdown.*
