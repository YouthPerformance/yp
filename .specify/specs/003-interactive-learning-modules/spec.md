# Feature Specification: Interactive Learning Modules (ILM)

**Version:** 1.0.0
**Created:** 2026-01-07
**Status:** Draft
**Spec ID:** 003-interactive-learning-modules

---

## Overview

Interactive Learning Modules (ILM) transform static educational content into swipeable, gamified micro-courses that educate, test, unlock, reward, and progress. The first implementation is **Bulletproof Ankles (BPA)** — James Scott's ankle resilience protocol.

**Core Loop:** "Swipe to Learn, Tap to Prove, Earn to Unlock"

**Strategic Value:**
- **Activation:** Post-scan users understand "why" before "how" — building trust before drills
- **Retention:** Crystal rewards create daily engagement loops
- **Content Velocity:** Framework enables new modules in <48 hours once built
- **SEO/AEO:** Each module generates crawlable pillar + cluster pages automatically

---

## Constitution Alignment

- [x] **Athlete First:** Bite-sized content respects attention spans; Athlete Mode uses 5th-grade reading level
- [x] **Parents Partners:** Parent Mode provides science-backed explanations; parents can track module completion
- [x] **Simplicity:** Card-based UI is single-gesture (swipe up); one action per screen
- [x] **Stack Sacred:** Modules explain the R3 Protocol philosophy; completion unlocks drill stacks

---

## Phase Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1 (MVP)** | BPA module, card swiper, check cards, progress tracking, crystals | This Spec |
| Phase 2 | SEO pages, Ask Wolf integration, hint system, share cards | Future |
| Phase 3 | Audio narration, streak bonuses, module leaderboards | Future |

---

## User Stories (Phase 1 MVP)

### Primary Users

- **Athletes (ages 8-14):** Learn concepts, answer checks, earn crystals
- **Parents:** Toggle to Parent Mode for deeper understanding
- **Coaches:** Assign modules to team members (future)

---

### US-1: Complete BPA Module

**As an** athlete
**I want** to swipe through lesson cards and answer check questions
**So that** I understand why certain exercises matter before doing them

**Acceptance Criteria:**
- [ ] AC-1.1: Athlete sees BPA module entry card in Playbook with title, duration (15 min), crystal reward (170)
- [ ] AC-1.2: Swiping up advances to next card; swiping down returns to previous
- [ ] AC-1.3: Progress bar shows current position (e.g., "Section 2 of 6 • Card 3/4")
- [ ] AC-1.4: Module can be paused and resumed from last position
- [ ] AC-1.5: Completion shows final score, crystals earned, and unlocked content

---

### US-2: Answer Check Cards

**As an** athlete
**I want** to answer multiple-choice questions between sections
**So that** I prove I understood the content and earn crystals

**Acceptance Criteria:**
- [ ] AC-2.1: Check cards display question with 4 answer options
- [ ] AC-2.2: Selecting correct answer on first try awards +10 crystals
- [ ] AC-2.3: Selecting correct answer on retry awards +5 crystals
- [ ] AC-2.4: Wrong answer shows feedback explaining why incorrect
- [ ] AC-2.5: Correct answer shows celebration animation with crystal float
- [ ] AC-2.6: Cannot proceed until correct answer is selected

---

### US-3: Toggle Between Athlete/Parent Mode

**As a** parent (or curious athlete)
**I want** to toggle between reading levels mid-module
**So that** I can understand the science or simplify for my child

**Acceptance Criteria:**
- [ ] AC-3.1: Toggle switch visible at top of card view (Athlete / Parent icons)
- [ ] AC-3.2: Content updates immediately when mode changes (no page reload)
- [ ] AC-3.3: Mode preference persists across sessions
- [ ] AC-3.4: Default mode determined by user profile (age < 18 = Athlete)
- [ ] AC-3.5: Both modes have identical card structure, only language differs

---

### US-4: Unlock Sections via Score Threshold

**As an** athlete
**I want** sections to unlock based on my cumulative score
**So that** I feel progress and can't skip ahead without understanding

**Acceptance Criteria:**
- [ ] AC-4.1: Each section has an unlock threshold (cumulative correct answers required)
- [ ] AC-4.2: Locked sections show gate screen with "X/Y correct to unlock"
- [ ] AC-4.3: Meeting threshold triggers unlock animation (door opening visual)
- [ ] AC-4.4: Already-unlocked sections remain accessible for review
- [ ] AC-4.5: User cannot access cards in locked sections

---

### US-5: Complete Module and Unlock Content

**As an** athlete
**I want** completing the module to unlock related drill stacks
**So that** I can immediately apply what I learned

**Acceptance Criteria:**
- [ ] AC-5.1: Completion screen shows score (e.g., "11/12 correct - 92%")
- [ ] AC-5.2: Total crystals earned displayed with animation
- [ ] AC-5.3: Badge awarded (e.g., "Armor Builder" for BPA)
- [ ] AC-5.4: Unlocked content listed with "Start Now" CTAs (drill stack, related programs)
- [ ] AC-5.5: Optional: Product recommendation (Iso-Strap) with "Learn More" CTA
- [ ] AC-5.6: Share button generates social card with score

---

### US-6: Track Module Progress

**As an** athlete
**I want** my progress to persist across sessions
**So that** I can complete modules over multiple days

**Acceptance Criteria:**
- [ ] AC-6.1: Progress saved to Convex after each card view/answer
- [ ] AC-6.2: Reopening module resumes from last position
- [ ] AC-6.3: Profile/Playbook shows module completion percentage
- [ ] AC-6.4: Completed modules show checkmark with final score
- [ ] AC-6.5: Parent dashboard shows child's module progress

---

## Functional Requirements

### Core Requirements (Phase 1 MVP)

| ID | Requirement | Priority | Verification |
|----|-------------|----------|--------------|
| FR-1 | Module entry card renders in Playbook grid | Must Have | Card visible at /playbook |
| FR-2 | Card swiper supports vertical swipe navigation | Must Have | Swipe gestures work on mobile |
| FR-3 | Lesson cards display dual-mode content | Must Have | Toggle changes content |
| FR-4 | Check cards award crystals on correct answer | Must Have | Crystal balance increases |
| FR-5 | Section unlock gates enforce thresholds | Must Have | Locked sections inaccessible |
| FR-6 | Module completion awards badge | Must Have | Badge appears in profile |
| FR-7 | Progress persists in Convex | Must Have | Resume works after app close |
| FR-8 | Completion unlocks linked drill stack | Must Have | Drill stack accessible post-completion |

### Business Rules

| ID | Rule | Example |
|----|------|---------|
| BR-1 | Crystals awarded once per check card per user | Retry after wrong = +5, not +10 |
| BR-2 | Check cards must be answered correctly to proceed | Cannot skip questions |
| BR-3 | Module completion requires ≥80% score | 9/12 minimum for BPA |
| BR-4 | Daily crystal cap applies to module earnings | 50/day cap from Wolf Loop |
| BR-5 | Unlocked content never re-locks | Complete once = permanent access |
| BR-6 | Same content structure for both modes | Cards/sections identical, only text differs |

---

## Non-Functional Requirements

| ID | Category | Requirement | Measurement |
|----|----------|-------------|-------------|
| NFR-1 | Performance | Card transition completes in <200ms | Animation smoothness |
| NFR-2 | Performance | Content switch (mode toggle) <100ms | No visible lag |
| NFR-3 | Accessibility | Text readable at 375px viewport | Mobile responsive |
| NFR-4 | Reliability | Progress survives offline with sync | Resume after reconnect |
| NFR-5 | Performance | Module data loads in <1s on 3G | Initial load time |

---

## Data Model

### New Convex Tables Required

#### learningModules
```
- id: string (e.g., "bpa-v1")
- slug: string (e.g., "bulletproof-ankles")
- title: string
- subtitle: string
- sport: string ("Basketball" | "Barefoot" | "General")
- author: string
- estimatedMins: number
- totalCrystals: number
- thumbnailUrl: string
- heroVideoUrl?: string
- prerequisites: string[] (module IDs)
- unlocksContent: string[] (drill stack IDs)
- seo: object { title, description, pillarSlug, clusterSlug }
- createdAt: number
- updatedAt: number
```

#### learningProgress
```
- id: auto
- moduleId: string
- userId: Id<"users">
- startedAt: number
- completedAt?: number
- currentSectionId: string
- currentCardId: string
- totalCorrect: number
- totalAttempts: number
- crystalsEarned: number
- sectionsUnlocked: string[]
- cardHistory: array of {
    cardId: string
    viewedAt: number
    answeredAt?: number
    wasCorrect?: boolean
    attemptsOnCard: number
  }
- mode: "Athlete" | "Parent"
```

### Data Storage Approach

Module content (sections, cards) stored as **static TypeScript data files** in:
```
apps/web-academy/src/data/modules/
  bulletproof-ankles/
    types.ts
    index.ts
    sections.ts
```

This mirrors the Basketball Chassis pattern and avoids over-engineering.

---

## UI Components Required

### New Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `ModuleEntryCard` | Grid card in Playbook | `/components/modules/` |
| `CardSwiper` | Vertical swipe container | `/components/modules/` |
| `LessonCard` | Displays lesson content | `/components/modules/cards/` |
| `CheckCard` | Multiple choice question | `/components/modules/cards/` |
| `UnlockGate` | Section threshold screen | `/components/modules/cards/` |
| `CompletionView` | Module finish screen | `/components/modules/cards/` |
| `ModeToggle` | Athlete/Parent switcher | `/components/modules/` |
| `ModuleProgress` | Section/card progress bar | `/components/modules/` |
| `CrystalReward` | Crystal animation on correct | `/components/modules/` |

### Existing Components to Reuse

- `FinishedView` pattern from workout player (celebration animation)
- Crystal counter from Wolf Loop
- Progress bar styling from program overview

---

## Route Structure

```
app/
  (main)/
    playbook/
      page.tsx              # Add modules section
      modules/
        page.tsx            # All modules grid
        [slug]/
          page.tsx          # Module entry/overview
          play/
            page.tsx        # Card swiper (the player)
    learn/                  # SEO routes (Phase 2)
      [moduleSlug]/
        page.tsx            # Pillar page
        [clusterSlug]/
          page.tsx          # Cluster page
```

---

## User Interface Specifications

### Module Entry Card (Playbook)

```
┌────────────────────────────────────┐
│  [Hero Image: Ankle X-ray style]   │
│                                    │
│  BULLETPROOF ANKLES               │
│  The Armor-Building System         │
│                                    │
│  ⏱ 15 min  │  💎 170 crystals     │
│  📚 6 sections  │  🎯 12 checks    │
│                                    │
│  By James Scott                    │
│                                    │
│  [START MODULE →]                  │
└────────────────────────────────────┘
```

### Card Swiper View

```
┌────────────────────────────────────┐
│  Section 2 of 6          [X close] │
│  ████████░░░░░░░░░░   Card 3/4    │
│                                    │
│  [Toggle: 🏀 Athlete | 👨‍👩‍👧 Parent]  │
│                                    │
│  ┌────────────────────────────┐   │
│  │                            │   │
│  │    [CARD CONTENT]          │   │
│  │                            │   │
│  └────────────────────────────┘   │
│                                    │
│         SWIPE UP TO CONTINUE       │
│                ↑                   │
└────────────────────────────────────┘
```

### Check Card (Before Answer)

```
┌────────────────────────────────────┐
│  🔮 QUICK CHECK                    │
│                                    │
│  [Question text here]              │
│                                    │
│  ┌──────────────────────┐         │
│  │ A) Option one        │         │
│  └──────────────────────┘         │
│  ┌──────────────────────┐         │
│  │ B) Option two        │         │
│  └──────────────────────┘         │
│  ┌──────────────────────┐         │
│  │ C) Option three      │         │
│  └──────────────────────┘         │
│  ┌──────────────────────┐         │
│  │ D) Option four       │         │
│  └──────────────────────┘         │
└────────────────────────────────────┘
```

### Check Card (Correct Answer)

```
┌────────────────────────────────────┐
│                                    │
│           ✅ CORRECT!              │
│                                    │
│           +10 💎                   │
│                                    │
│  ─────────────────────────────────│
│                                    │
│  [Feedback text explaining why     │
│   this answer is correct]          │
│                                    │
│         [CONTINUE →]               │
│                                    │
└────────────────────────────────────┘
```

### Module Completion

```
┌────────────────────────────────────┐
│                                    │
│      🏆 MODULE COMPLETE! 🏆        │
│                                    │
│      BULLETPROOF ANKLES           │
│                                    │
│      Score: 11/12 (92%)           │
│      Crystals: +110 💎            │
│      Time: 14:32                  │
│                                    │
│      [Badge: ARMOR BUILDER 🛡️]    │
│                                    │
│       UNLOCKED FOR YOU:           │
│                                    │
│   [🎬 BPA Drill Stack]            │
│   → Start Now                     │
│                                    │
│         [SHARE RESULTS]           │
│                                    │
└────────────────────────────────────┘
```

---

## Reward Economy (Module-Specific)

> **Note:** This section aligns with Spec 004-xp-crystal-economy (Shards → Crystals model).

### XP + Shard Earning

| Action | XP | Shards |
|--------|-----|--------|
| Complete Level 1 | +35 | 0 |
| Complete Level 2 | +50 | +1 |
| Complete Level 3 | +75 | +1 |
| Complete Level 4 | +100 | +2 |
| Completion bonus (≥80% accuracy) | +100 | +1 |
| **Max possible for BPA:** | **360 XP** | **5 shards** |

### Per-Card Rewards (Within Levels)

| Action | XP | Notes |
|--------|-----|-------|
| Correct answer (first try) | +5 | Immediate feedback |
| Correct answer (retry) | +2 | Reduced for retry |
| View lesson card | +2 | Encourages reading |

### Why Shards Not Crystals

Learning modules are content that can be replayed. High XP rewards learning value, but low shard emission prevents economic inflation. Per Spec 004:
- **10 shards = 1 crystal**
- Target pace: 3-5 crystals/month for active kid
- Modules contribute ~0.5 crystal per completion

### Shard Spending (Phase 2)

| Action | Cost |
|--------|------|
| Unlock hint on Check Card | 1 shard |
| Skip to next section (if stuck) | 5 shards |

---

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Complete card offline | Save locally, sync when online |
| App crash during check answer | Answer already submitted = crystals credited |
| Switch mode mid-check-card | Question text updates, answer state preserved |
| Close app mid-module | Resume from exact card on reopen |
| Already completed module | Can review but no additional crystals |
| Prerequisite module not completed | Show "Complete [X] first" prompt |
| Daily crystal cap reached | Module still completable, crystals queued for next day |

---

## Out of Scope (Phase 1)

- **SEO Pillar/Cluster Pages:** Deferred to Phase 2
- **Ask Wolf Citation Integration:** Deferred to Phase 2
- **Hint System (-5 crystals):** Deferred to Phase 2
- **Audio Narration:** Deferred to Phase 3
- **Module Streak Bonuses:** Deferred to Phase 3
- **Leaderboards:** Deferred to Phase 3
- **Animated Illustrations:** Deferred to Phase 2
- **Share Card Generation:** Deferred to Phase 2
- **Offline Caching:** Deferred based on complexity

---

## Phase 2 Preview (Future Spec)

| Feature | Description |
|---------|-------------|
| SEO Pages | Auto-generate /learn/[module]/[section] crawlable pages |
| Hint System | Spend 5 crystals to reveal hint on check cards |
| Ask Wolf Integration | Wolf cites module content with deep links |
| Share Cards | Generate social images with score/badge |
| Animated Illustrations | Per-section motion graphics |

---

## BPA Content Summary

### Section Breakdown

| Section | Title | Lessons | Checks | Unlock Threshold |
|---------|-------|---------|--------|------------------|
| 0 | The Impossible Recovery | 3 | 1 | 0 (entry) |
| 1 | The Glass Cannon Problem | 4 | 2 | 1 correct |
| 2 | Armor Building (Not Rehab) | 4 | 2 | 3 cumulative |
| 3 | The Angles | 3 | 2 | 5 cumulative |
| 4 | The Solution: Isometrics | 4 | 2 | 7 cumulative |
| 5 | The R3 System | 5 | 3 | 9 cumulative |
| 6 | Your BPA Journey | 2 | 0 | 12 cumulative |

**Total:** 25 Lesson Cards, 12 Check Cards, ~15 minutes

### Content Characteristics

- **Athlete Mode:** 5th-grade reading level (Flesch-Kincaid 5.0)
- **Parent Mode:** 9th-grade reading level (Flesch-Kincaid 9.0)
- **Max Lesson Card:** 150 words
- **Max Check Question:** 50 words
- **Media:** Optional images/videos per card

---

## Dependencies

### External Dependencies

- Convex real-time database (already in place)
- Crystal economy from Wolf Loop spec
- Entitlements system for unlocking drill stacks

### Internal Dependencies

- Wolf Loop gamification (crystals integration)
- Drill stack system (unlock target)
- Profile system (badge storage)

### Assumptions

- User has completed onboarding
- Crystal daily cap (50) is enforced globally
- At least one module (BPA) is always available
- Content authored in TypeScript data files

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Module start rate (from Playbook) | >30% | Starts / Playbook visits |
| Completion rate | >65% | Completes / starts |
| Average score | >75% | Mean of final scores |
| Avg time per lesson card | 8-15 sec | Analytics |
| Check card first-try accuracy | 60-80% | Correct first / total |
| Drill stack unlock → start rate | >50% | Drill starts / completions |

---

## Review Checklist

### Completeness
- [x] All user stories have acceptance criteria
- [x] All functional requirements have verification methods
- [x] Edge cases and error scenarios documented
- [x] Out of scope items explicitly listed
- [x] Dependencies and assumptions documented

### Quality
- [x] No `[NEEDS CLARIFICATION]` markers remain
- [x] Requirements are testable
- [x] Requirements are unambiguous
- [x] No implementation details (tech-agnostic)
- [x] Non-technical stakeholder could understand this

### Traceability
- [x] Each requirement traces to a user need
- [x] Each acceptance criterion is measurable
- [x] Success metrics defined

---

## Open Questions (Resolved)

1. **Skip penalty:** Should users be able to skip Check Cards?
   **Decision:** No. Must answer correctly to proceed.

2. **Retry policy:** Unlimited retries for higher score?
   **Decision:** Yes, free retries but no additional crystals for already-answered cards.

3. **Prerequisite enforcement:** Hard block or soft recommendation?
   **Decision:** Soft recommendation with "Complete [X] first" message.

4. **Offline support:** Cache module content?
   **Decision:** Defer to Phase 2 based on complexity.

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-07 | Claude (MAI) | Initial specification - Phase 1 MVP |

---

*Note: This spec is technology-agnostic. Technical decisions belong in plan.md*
