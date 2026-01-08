# Feature Specification: Wolf Loop Gamification System

**Version:** 1.0.0
**Created:** 2026-01-02
**Status:** Approved
**Spec ID:** 001-wolf-loop-gamification

---

## Overview

The Wolf Loop is YP's core engagement engine: a daily habit system that rewards young athletes for consistent training with XP, crystals, and surprise rewards. Designed for 5th-graders, the system follows one rule: **"One big button → do mission → get cool reward → repeat."**

This spec covers Phase 1 (MVP) with expansion phases documented for future development.

---

## Constitution Alignment

- [x] **Athlete First:** Rewards consistency and effort, not intensity. Every reward reinforces training habits.
- [x] **Parents Partners:** No paid loot boxes. Crystals never buy performance. Parents can see progress.
- [x] **Simplicity:** Two currencies max. One daily action. Three-tap loop.
- [x] **Stack Sacred:** Daily Mission = one Stack (5-10 min). Extends streak without requiring full program.

---

## Phase Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1 (MVP)** | XP + Rank + Moon Streak + Wolf Drop + Crystal earning | This Spec |
| Phase 2 | Crystal Shop + Streak Shield + Lucky Hunt | Future |
| Phase 3 | Hunt Pass + Pack Challenges + Leaderboards (opt-in) | Future |

---

## User Stories (Phase 1 MVP)

### Primary Users

- **Athletes (ages 8-14):** Complete daily missions, earn rewards, track progress
- **Parents:** View child's streak and rank progress

---

### US-1: Complete Daily Mission & Earn XP

**As an** athlete
**I want** to complete one daily mission and immediately see XP earned
**So that** I feel rewarded for training and see progress toward my next rank

**Acceptance Criteria:**
- [ ] AC-1.1: Athlete sees one "Today's Mission" card on home screen with name, duration (5-10 min), and reward preview
- [ ] AC-1.2: XP animates in real-time during workout (+10 XP ticks visible)
- [ ] AC-1.3: Mission completion awards guaranteed base XP (+200)
- [ ] AC-1.4: Form/accuracy bonus awards 0-100 additional XP (if CV scoring exists)
- [ ] AC-1.5: XP bar shows progress toward next rank with percentage

---

### US-2: Maintain Moon Streak

**As an** athlete
**I want** my streak to be forgiving but meaningful
**So that** missing one day doesn't destroy my progress

**Acceptance Criteria:**
- [ ] AC-2.1: Streak displays as Moon Phase visual (sliver → half → full)
- [ ] AC-2.2: Completing Today's Mission extends streak by 1 day
- [ ] AC-2.3: Missing 1 day shows "cracked moon" warning (streak intact)
- [ ] AC-2.4: Missing 2 days shows "fading moon" warning (streak intact)
- [ ] AC-2.5: Missing 3+ days resets streak to 0
- [ ] AC-2.6: Streak milestones (7, 14, 30, 42 days) trigger celebration + bonus crystals

---

### US-3: Receive Daily Wolf Drop

**As an** athlete
**I want** a surprise reward after completing my daily mission
**So that** I feel excited to open the app tomorrow

**Acceptance Criteria:**
- [ ] AC-3.1: One Wolf Drop unlocks per day after mission completion
- [ ] AC-3.2: Drop reveal has tap-to-crack animation with haptics
- [ ] AC-3.3: Every drop contains: XP pack (always) + Crystals (1-15, varies)
- [ ] AC-3.4: Occasional drops include: Stickers, Emotes, or Lore Cards
- [ ] AC-3.5: Drop rarity affects glow color (common/uncommon/rare)
- [ ] AC-3.6: No second drop available until next day (prevents grind addiction)

---

### US-4: Progress Through Ranks

**As an** athlete
**I want** to level up my wolf rank
**So that** I unlock cooler colors and feel elite

**Acceptance Criteria:**
- [ ] AC-4.1: Rank ladder: Pup → Scout → Runner → Hunter → Alpha → Apex
- [ ] AC-4.2: Rank progress is based on cumulative XP thresholds
- [ ] AC-4.3: Rank up triggers celebration: badge pop, wolf howl, coach line
- [ ] AC-4.4: Hunter rank unlocks "Cyber" wolf color
- [ ] AC-4.5: Alpha rank unlocks "Fire" wolf color
- [ ] AC-4.6: Apex rank unlocks "Gold" wolf color
- [ ] AC-4.7: Locked colors visible during onboarding with "Unlock at [Rank]" label

---

### US-5: Earn Crystals (Not Spend Yet)

**As an** athlete
**I want** to accumulate crystals as a status currency
**So that** I can save for cosmetics (Phase 2)

**Acceptance Criteria:**
- [ ] AC-5.1: Crystals earned from: Wolf Drops (1-15), Streak milestones, Rank ups
- [ ] AC-5.2: Crystal balance visible on profile/home screen
- [ ] AC-5.3: Crystal earning has sparkle animation
- [ ] AC-5.4: Crystals never buy performance advantages (hard rule)
- [ ] AC-5.5: Daily crystal cap prevents infinite farming (50/day max)

---

### US-6: Parent Views Athlete Progress

**As a** parent
**I want** to see my child's streak and rank at a glance
**So that** I can encourage their consistency

**Acceptance Criteria:**
- [ ] AC-6.1: Parent dashboard shows: current streak, rank, total XP
- [ ] AC-6.2: Parent sees streak milestone achievements
- [ ] AC-6.3: No detailed crystal balance (that's the athlete's private economy)

---

## Functional Requirements

### Core Requirements (Phase 1 MVP)

| ID | Requirement | Priority | Verification |
|----|-------------|----------|--------------|
| FR-1 | Daily Mission appears on home screen | Must Have | Mission card visible |
| FR-2 | XP awards on mission completion | Must Have | XP increases in database |
| FR-3 | Moon Streak tracks consecutive days | Must Have | Streak increments correctly |
| FR-4 | Wolf Drop reveals after mission | Must Have | Drop animation plays, rewards credited |
| FR-5 | Rank ladder with 6 tiers | Must Have | Rank updates at thresholds |
| FR-6 | Wolf color unlocks at ranks | Must Have | Colors become selectable |
| FR-7 | Crystal earning from drops/milestones | Must Have | Crystal balance increases |
| FR-8 | Daily caps prevent grinding | Must Have | Caps enforced |

### Business Rules

| ID | Rule | Example |
|----|------|---------|
| BR-1 | Streak extends by completing ANY mission (not full program) | 5-min mobility session counts |
| BR-2 | Crystals never buy XP, rank progress, or training advantages | No "pay to win" |
| BR-3 | Missed days give 2-day grace period before streak reset | Miss Mon/Tue, streak dies Wed midnight |
| BR-4 | Only one Wolf Drop per calendar day | Complete 3 workouts = still 1 drop |
| BR-5 | Rank never decreases | Once Hunter, always Hunter+ |

---

## Non-Functional Requirements

| ID | Category | Requirement | Measurement |
|----|----------|-------------|-------------|
| NFR-1 | Performance | XP animation ticks within 100ms | Visual responsiveness |
| NFR-2 | Performance | Wolf Drop reveal completes in <2s | Animation duration |
| NFR-3 | Accessibility | Moon phase readable at 375px viewport | Mobile responsive |
| NFR-4 | Reliability | Streak state survives offline completion | Sync on reconnect |

---

## Data Requirements

### Entities

| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| **Athlete XP** | Cumulative training effort | total, daily earned, last reset |
| **Crystals** | Prestige currency balance | total, daily earned |
| **Moon Streak** | Consecutive training days | current, best, last workout date, grace state |
| **Wolf Rank** | Progression tier | current rank, unlocked colors |
| **Wolf Drop** | Daily reward record | date, contents, rarity, claimed |

### Data Rules

- XP and crystals reset daily earned counter at midnight (user's timezone)
- Streak grace period calculated from last workout timestamp
- Drop eligibility: one per calendar day, tied to mission completion
- Rank thresholds are cumulative XP, not daily

---

## User Interface Requirements

### Key Interactions

1. **Open App → See Today's Mission:** Large card with mission name, duration, reward preview, big "HUNT" button
2. **Complete Mission → XP Burst:** Numbers tick up with sound, rank bar animates
3. **Mission Done → Wolf Drop:** Geode/crystal appears, tap to crack, reveal contents
4. **Rank Up → Celebration:** Full-screen moment, wolf howl, new color unlocks
5. **Check Streak → Moon Phase:** Visual moon shows progress, milestone markers

### States

| State | Description | User Can... |
|-------|-------------|-------------|
| Mission Available | Start of day, mission not done | Tap HUNT to begin |
| Mission In Progress | Workout active | See live XP ticks |
| Mission Complete | Daily mission finished | Claim Wolf Drop |
| Drop Ready | Wolf Drop unclaimed | Tap to reveal |
| Drop Claimed | Reward collected | See contents, return home |
| Streak Cracked | Missed 1 day | See warning, complete mission to heal |
| Streak Fading | Missed 2 days | See urgent warning |
| Streak Broken | Missed 3+ days | Restart from 0 |

---

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Complete mission offline | Rewards stored locally, sync when online |
| Complete 2+ missions same day | Only first triggers Wolf Drop; others give XP only |
| App crash during Wolf Drop reveal | Drop marked claimed, contents already credited |
| Timezone change during streak | Use athlete's registered timezone, not device |
| Rank up during offline session | Celebration shows on next app open |

---

## Out of Scope (Phase 1)

- **Crystal Shop / Spending:** Deferred to Phase 2
- **Streak Shield / Freeze:** Deferred to Phase 2
- **Lucky Hunt Day:** Deferred to Phase 2
- **Hunt Pass (28-day battle pass):** Deferred to Phase 2
- **Pack Challenges (co-op):** Deferred to Phase 3
- **Leaderboards / Leagues:** Deferred to Phase 3
- **Widgets / Live Activity:** Deferred to Phase 3
- **Lore Cards collection view:** Deferred to Phase 2
- **Territory map progression:** Future world-building, not MVP

---

## Phase 2 Preview (Future Spec)

| Feature | Description |
|---------|-------------|
| Crystal Shop | Spend crystals on cosmetics (stickers, emotes, wolf colors) |
| Streak Shield | Earn-only item that protects streak for 1 missed day |
| Lucky Hunt | Weekly random day with boosted Wolf Drop rewards |
| Lore Cards | Collectible story pieces from rare drops |

---

## Phase 3 Preview (Future Spec)

| Feature | Description |
|---------|-------------|
| Hunt Pass | 28-day XP-driven battle pass with free/premium tracks |
| Pack Challenges | Weekly team goals (optional, co-op) |
| Opt-in Leaderboards | Weekly leagues with parent controls |
| Widgets | iOS/Android widget showing moon phase + mascot mood |

---

## Clarifications Resolved

> All clarifications resolved by CEO on 2026-01-02.

### 1. Rank XP Thresholds (12-Month Longevity Curve)

| Rank | XP Required | Phase |
|------|-------------|-------|
| Pup | 0 | Onboarding |
| Scout | 1,000 | Onboarding |
| Runner | 5,000 | Regular |
| Hunter | 15,000 | Committed |
| Alpha | 50,000 | Elite |
| Apex | 100,000 | Legend (~1 year consistency) |

**Rationale:** Original thresholds too low. At 10 XP/min, Apex at 4K = only 6.5 hours. New scale ensures meaningful progression.

### 2. Cracked Moon Warning

**Decision:** BOTH push notification + in-app visual.
- **Push:** "The Moon is fading. 2 hours left to save the streak." (Trigger at 6 PM local)
- **In-App:** Moon visually cracks/dims in UI

### 3. Timezone for Streak Reset

**Decision:** Device timezone.
**Rationale:** Kids travel for tournaments. App respects local sunset, not home base.

### 4. CV/Form Bonus

**Decision:** Defer strict CV scoring to Phase 2.
- **MVP:** Use "Time + Completion" (Honesty Mode)
- **Data Hook:** Collect video in background (with permission) to train CV models
- **Rationale:** Cannot risk buggy CV killing retention on Day 1 ("Time to First Sweat")

### 5. Crystal Milestone Amounts

**Decision:** Approved as proposed.

| Milestone | Crystals |
|-----------|----------|
| 7-day streak | 50 |
| 14-day streak | 100 |
| 30-day streak | 200 |
| 42-day streak (Foundation) | 500 |

**Note:** Cosmetics priced so 500 feels like windfall (e.g., cool skin = 300)

### 6. CEO Directive: Wolf Drop Architecture

**Critical:** Wolf Drop animation is the #1 priority asset.
- Backend determines loot rarity BEFORE animation plays
- Client receives result, then renders animation
- **Zero lag** between tap and reveal

---

## Dependencies

### External Dependencies

- Existing workout completion system (records mission done)
- Convex real-time database (already in place)
- Animation library for XP ticks and Wolf Drop reveal

### Assumptions

- User has completed onboarding (wolf color selected)
- At least one "Daily Mission" is always available
- Parent-child linking already functional

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| 7-day streak rate | 40% of active users | Users with streak >= 7 / DAU |
| Daily mission completion | 70% of DAU | Missions completed / daily active users |
| Wolf Drop claim rate | 95% | Drops claimed / drops earned |
| Rank progression | 50% reach Hunter (Rank 4) within 30 days | Rank distribution |

---

## Review Checklist

### Completeness
- [x] All user stories have acceptance criteria
- [x] All functional requirements have verification methods
- [x] Edge cases and error scenarios documented
- [x] Out of scope items explicitly listed
- [x] Dependencies and assumptions documented

### Quality
- [x] No `[NEEDS CLARIFICATION]` markers remain ← **All resolved**
- [x] Requirements are testable
- [x] Requirements are unambiguous
- [x] No implementation details (tech-agnostic)
- [x] Non-technical stakeholder could understand this

### Traceability
- [x] Each requirement traces to a user need
- [x] Each acceptance criterion is measurable
- [x] Success metrics defined

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-02 | Claude (MAI) | Initial specification - Phase 1 MVP |
| 1.1.0 | 2026-01-02 | Claude (MAI) | All clarifications resolved by CEO, status → Approved |
