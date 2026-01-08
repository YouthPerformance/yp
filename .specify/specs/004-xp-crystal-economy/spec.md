# Feature Specification: XP + Crystal Economy v2.0

**Version:** 2.0.0
**Created:** 2026-01-07
**Status:** Draft
**Spec ID:** 004-xp-crystal-economy
**Supersedes:** 001-wolf-loop-gamification (crystal sections only)

---

## Overview

The Wolf Pack Economy is a 3-lane reward system designed for scalability from "fun points" to real-world partner value. This spec resolves inflation risks, separates dopamine loops from valuable currency, and enables future partner integrations without redesign.

**Design Philosophy:** "Duolingo + Brawl Stars, but family-safe and partner-ready."

**Core Principle:** Kids see **XP + Shards**. Parents see **Rewards + Credits**.

---

## Constitution Alignment

- [x] **Athlete First:** XP flows constantly (every rep matters). Shards are celebration moments.
- [x] **Parents Partners:** Partner Vault requires parent gate. No RNG for real-world value.
- [x] **Simplicity:** 3 currencies with clear purposes. 5th-grader can explain each.
- [x] **Stack Sacred:** Crystals unlock advanced drill stacks. Training → knowledge → gear.

---

## The 3-Lane Economy

### Lane 1: XP (Always Flowing)

**What kids feel:** "I'm leveling up right now."

**Purpose:**
- Ranks and avatar unlock gates
- Mastery bars and streak visuals
- Immediate feedback (every exercise, every card)

**Properties:**
- Never decreases
- No cap (but diminishing returns after daily threshold)
- Cannot be spent (pure progress meter)

---

### Lane 2: Crystal Shards → Crystals (Scarce + Valuable)

**What kids feel:** "Ohhh shards... I'm close to a Crystal!"

**The Conversion:**
```
10 Shards = 1 Crystal
```

**Purpose:**
- Cosmetics (wolf colors, trails, frames)
- Boosts (streak freeze, XP multiplier)
- Partner Vault redemption (discounts, gear, events)
- AI Credit conversion (compute burn)

**Properties:**
- Shards earned frequently (1-2 at a time)
- Crystals are prestigious and rare
- Shard meter fills daily → satisfying completion animation
- Partner value = deterministic pricing (no RNG)

---

### Lane 3: Credits (AI Fuel)

**What kids feel:** "I can ask Wolf / run form-check / unlock pro analysis."

**Purpose:**
- AI compute consumption (Ask Wolf, form analysis)
- Premium content access
- Parents understand this = "AI budget"

**Conversion:**
```
1 Crystal = 100 Credits
```

**Properties:**
- Burns compute in visible way
- Parents can purchase credit packs (not shards/crystals)
- Earned crystals can convert to credits
- Clear separation from "earned" economy

---

## Shard Emission Design

### Target Pace

**Goal:** ~3-5 Crystals/month for consistently active kid

This is enough for "I can buy cool stuff" but not enough to drain partner budgets.

---

### Daily Wolf Drop (After Sweat Threshold)

| Contents | Amount | Notes |
|----------|--------|-------|
| XP Pack | 50-100 XP | Always |
| Shards | 1 | Guaranteed |
| Cosmetic | Random | Sticker/emote/badge (no real value) |

**Critical Rule:** Wolf Drop surprise = cosmetics only. Never real-world value via RNG.

---

### Playbook Module Completion

| Level | XP Earned | Shards Earned |
|-------|-----------|---------------|
| L1 | +35 | 0 |
| L2 | +50 | +1 |
| L3 | +75 | +1 |
| L4 | +100 | +2 |
| **Completion Bonus** | +100 | +1 (only if quiz accuracy ≥80%) |

**Total per Playbook Module:**
- **360 XP**
- **4-5 Shards** (≈ 0.5 Crystal)

**Rationale:** Learning modules are farmable (speed-run risk). Keep value currency low here.

---

### Streak Milestones

| Streak | Shards | Crystals (Equivalent) |
|--------|--------|----------------------|
| 7 days | +2 | 0.2 |
| 14 days | +3 | 0.3 |
| 30 days | +6 | 0.6 |
| 42 days | +10 | 1.0 |

---

### Rank Up Rewards

| Rank | XP Threshold | Shards | Crystal Bonus |
|------|--------------|--------|---------------|
| Scout | 1,000 | +5 | - |
| Runner | 5,000 | +10 | +1 |
| Hunter | 15,000 | +15 | +1 |
| Alpha | 50,000 | +20 | +2 |
| Apex | 100,000 | +30 | +5 |

---

### Monthly Shard Budget (Active Kid)

| Source | Shards/Month |
|--------|--------------|
| Daily Wolf Drops (20 days active) | ~20 |
| Playbook Modules (2-3 completed) | ~10-15 |
| Streak Milestones (7+14 day) | ~5 |
| **Total** | **~35-40 shards** |

**Result:** 3-4 Crystals/month for active training kid.

---

## XP Economy (Unchanged from Wolf Loop)

### XP Earning

| Action | XP | Notes |
|--------|-----|-------|
| Complete Daily Mission | +200 base | Core loop |
| Form/Accuracy Bonus | +0-100 | If CV scoring exists |
| Playbook Module (per level) | +35/50/75/100 | See above |
| Quiz (70%+) | +20 | Knowledge |
| Perfect Quiz (100%) | +35 | Excellence |
| StrikeWOD Complete | +50 | Challenge mode |
| StrikeWOD PR | +30 bonus | Improvement |

### XP Caps (Anti-Gaming)

| Cap Type | Value |
|----------|-------|
| Workout XP Daily | 350 (1 workout max) |
| Quiz XP Daily | 50 (diminishing after 3) |
| Education XP Daily | 45 (3 videos max) |
| **Total Daily Max** | 500 XP |

### Rank Ladder (12-Month Longevity)

| Rank | Total XP | Unlock |
|------|----------|--------|
| Pup | 0 | Default |
| Scout | 1,000 | - |
| Runner | 5,000 | - |
| Hunter | 15,000 | Cyber Wolf color |
| Alpha | 50,000 | Fire Wolf color |
| Apex | 100,000 | Gold Wolf color |

**Curve Shape:** Fast early wins (Scout day 2-3), meaningful midgame (Hunter ~2 weeks), Apex aligns with 42+ day completion.

---

## Crystal Shop (Phase 2)

### Cosmetics Tier

| Item | Cost | Type |
|------|------|------|
| Sticker/Emote | 1 Crystal | Common |
| Avatar Frame | 3 Crystals | Uncommon |
| Wolf Color (additional) | 5 Crystals | Rare |
| Trail Effect | 8 Crystals | Epic |
| Legendary Frame | 15 Crystals | Legendary |

### Utility Tier

| Item | Cost | Effect |
|------|------|--------|
| Streak Freeze | 5 Crystals | Protect 1 missed day |
| XP Boost (2x) | 8 Crystals | Next workout doubled |
| Module Hint | 1 Crystal | Reveal check card hint |
| Streak Repair (24hr) | 10 Crystals | Restore broken streak |
| Streak Repair (48hr) | 20 Crystals | Restore broken streak |

### AI Credits Tier

| Conversion | Rate |
|------------|------|
| 1 Crystal | 100 Credits |
| 5 Crystals | 550 Credits (10% bonus) |
| 10 Crystals | 1200 Credits (20% bonus) |

---

## Partner Vault (Parent-Gated)

### What It Is

A separate redemption area in parent settings where earned crystals unlock real-world value:
- % discounts on partner brands
- Free shipping codes
- Gear drops (equipment, apparel)
- Event tickets (camps, clinics)
- Exclusive experiences

### Critical Rules

1. **No RNG for Real-World Rewards**
   - Wolf Drops = random cosmetics only
   - Partner perks = deterministic "X Crystals = claim"

2. **Earned-Only Policy**
   - Crystals used for partner perks must be earned (not purchased)
   - If we ever sell currency, track "earned vs bought" in ledger
   - Purchased currency = cosmetics only

3. **Parent Gate Required**
   - Child cannot redeem partner rewards
   - Parent claims on behalf of athlete
   - Fraud control + COPPA compliance

### Example Partner Pricing

| Reward | Crystal Cost | Notes |
|--------|--------------|-------|
| 10% off Partner Brand | 10 Crystals | Monthly claimable |
| 20% off Partner Brand | 20 Crystals | Monthly claimable |
| Free Shipping Code | 15 Crystals | 1 per order |
| Equipment Bundle Drop | 50 Crystals | Quarterly |
| Camp/Clinic Discount | 30 Crystals | Seasonal |

---

## Wolf Drop v2 (Updated)

### Contents (Deterministic Safety)

| Slot | Contents | Rarity |
|------|----------|--------|
| Slot 1 | XP Pack (50-100) | Always |
| Slot 2 | 1 Shard | Always |
| Slot 3 | Cosmetic (sticker/emote/badge) | 80% common, 15% uncommon, 5% rare |

### What's NOT in Wolf Drop

- Crystals (only shards)
- Partner discounts
- Real-world value items
- Anything requiring parent gate

### Animation Upgrade

- Tap-to-crack with haptics (keep)
- Shard meter fills visibly (+1 toward next Crystal)
- Rare cosmetics get special reveal glow
- Sound design: satisfying "ding" for shard, bigger sound for rare cosmetic

---

## Data Model Updates

### Convex Schema Additions

```typescript
// User economy fields
users: {
  // XP (unchanged)
  totalXp: number;
  dailyXpEarned: number;
  lastXpResetAt: number;

  // NEW: Shards + Crystals
  totalShards: number;          // Fractional currency
  totalCrystals: number;        // Whole currency
  dailyShardsEarned: number;    // For potential daily cap
  lastShardResetAt: number;

  // NEW: Credits
  totalCredits: number;

  // Streak (unchanged)
  currentStreak: number;
  bestStreak: number;
  lastWorkoutAt: number;
  graceState: 'healthy' | 'cracked' | 'fading';

  // Rank (unchanged)
  currentRank: 'pup' | 'scout' | 'runner' | 'hunter' | 'alpha' | 'apex';
  unlockedColors: string[];
}

// NEW: Economy Transaction Ledger
economyLedger: {
  id: auto;
  userId: Id<"users">;
  type: 'xp' | 'shard' | 'crystal' | 'credit';
  amount: number;              // Positive = earn, Negative = spend
  source: string;              // e.g., "wolf_drop", "module:bpa-v1", "streak:7"
  sourceType: 'earned' | 'purchased' | 'converted';
  timestamp: number;
  metadata?: object;           // Optional context
}
  .index("by_user", ["userId"])
  .index("by_user_type", ["userId", "type"])

// NEW: Partner Redemptions
partnerRedemptions: {
  id: auto;
  userId: Id<"users">;         // Athlete
  claimedByUserId: Id<"users">; // Parent
  partnerId: string;           // e.g., "nike", "adidas"
  rewardId: string;            // e.g., "10-percent-off"
  crystalCost: number;
  claimedAt: number;
  redeemedAt?: number;         // When used at partner
  code?: string;               // Discount code if applicable
}
  .index("by_user", ["userId"])
  .index("by_partner", ["partnerId"])
```

---

## Migration Plan (If Existing Crystals)

If users already have crystals from Wolf Loop MVP:

1. **Convert existing crystals to shards at 1:1**
   - User with 50 crystals → 50 shards (= 5 new crystals)

2. **Communicate clearly**
   - "We upgraded the economy! Your crystals are now more valuable."
   - Show shard meter prominently

3. **Grace period**
   - 30 days of boosted shard earning (1.5x)
   - Helps early adopters not feel punished

---

## ILM Spec Updates Required

### Current (003-interactive-learning-modules)

```
Crystal Economy (Module-Specific)
- Correct answer (first try): +10 crystals
- Correct answer (retry): +5 crystals
- Complete section: +10 bonus
- Complete module (≥80%): +20 bonus
- Perfect score (100%): +30 bonus
- Max possible for BPA: 170 crystals
```

### Updated (Align with v2 Economy)

```
Shard Economy (Module-Specific)
- Correct answer (first try): +5 XP (no shards per card)
- Correct answer (retry): +2 XP
- Complete Level 1: +35 XP, 0 shards
- Complete Level 2: +50 XP, +1 shard
- Complete Level 3: +75 XP, +1 shard
- Complete Level 4: +100 XP, +2 shards
- Completion bonus (≥80%): +100 XP, +1 shard
- Max possible for BPA: 360 XP, 5 shards
```

**Rationale:** Modules are content that can be replayed. Keep high XP (learning value) but low shards (economic value).

---

## Business Rules

| ID | Rule | Enforcement |
|----|------|-------------|
| BR-1 | 10 shards = 1 crystal (always) | Backend conversion |
| BR-2 | Crystals never decrease (except spending) | No negative transactions |
| BR-3 | Partner redemption requires parent claim | UI gate + backend check |
| BR-4 | Wolf Drop = cosmetics only, no real value | Drop loot table design |
| BR-5 | Purchased currency = cosmetics only | Track sourceType in ledger |
| BR-6 | Daily shard cap: 20 shards | Prevents extreme grinding |
| BR-7 | XP never used for real-world value | Separation enforced |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| User earns 10th shard | Auto-convert to 1 crystal + celebration |
| User tries to redeem partner reward | Check parent gate, reject if child |
| Wolf Drop while at shard cap | Drop still gives cosmetic, shard queued for next day |
| Module replay | XP still earned (diminishing), no additional shards |
| Streak breaks, crystals invested | Crystals preserved (never decrease) |
| Parent redeems, code expires unused | Code marked expired, no crystal refund |

---

## Success Metrics

| Metric | Target | Why |
|--------|--------|-----|
| Shard meter engagement | 70% notice it daily | Visual feedback working |
| Crystal conversion events | 2-4/month per active user | Healthy earning pace |
| Partner redemption rate | 30% of eligible crystals | Value proposition works |
| Shop purchase diversity | >5 items purchased avg | Store has breadth |
| Credit conversion rate | 20% of crystals → credits | AI value proposition |

---

## Out of Scope (This Spec)

- Detailed Partner Vault UI design
- Credit package purchasing flow
- Shard trading between users
- Crystal gifting
- Leaderboards by crystals (never - preserves privacy)

---

## Dependencies

- Wolf Loop MVP (streak, XP, ranks)
- ILM MVP (module completion flow)
- Parent dashboard (for Partner Vault)
- Convex schema updates

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0.0 | 2026-01-07 | Claude (MAI) | Complete economy redesign: XP + Shards + Crystals + Credits |

---

*This spec is technology-agnostic. Technical decisions belong in plan.md*
