# Implementation Plan: Interactive Learning Modules (ILM)

**Spec ID:** 003-interactive-learning-modules
**Plan Version:** 1.0.0
**Created:** 2026-01-07
**Status:** Ready for Implementation

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        WEB ACADEMY                               │
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │  Playbook   │───▶│  Module     │───▶│  Card Swiper        │  │
│  │  /playbook  │    │  Entry      │    │  /modules/[slug]/   │  │
│  │             │    │  Overview   │    │  play               │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│                                                   │              │
│                                                   ▼              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   STATE MANAGEMENT                          ││
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     ││
│  │  │  Zustand    │◀──▶│  Convex     │◀──▶│  Crystal    │     ││
│  │  │  Store      │    │  Sync       │    │  Economy    │     ││
│  │  └─────────────┘    └─────────────┘    └─────────────┘     ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Pre-Implementation Gates

### Gate 1: Simplicity Check ✓
- [x] Card-based UI is single gesture (swipe up)
- [x] No complex state machines — linear progression
- [x] Reuses existing patterns (FinishedView, progress bars)
- [x] Static data files, not dynamic CMS

### Gate 2: Anti-Abstraction Check ✓
- [x] Module content as TypeScript data (like Basketball Chassis)
- [x] Zustand for local state, Convex for persistence only
- [x] No generic "CardFactory" — explicit card types
- [x] No over-engineered animation system

### Gate 3: Test-First Validation
- [ ] Unit tests for unlock threshold logic
- [ ] Unit tests for crystal calculation
- [ ] Integration test for progress persistence
- [ ] E2E test for full module completion

---

## Implementation Phases

### Phase 1: Data Layer (Foundation)

**Estimated Files:** 5
**Dependencies:** None

#### 1.1 Type Definitions

**File:** `apps/web-academy/src/data/modules/types.ts`

```typescript
// Learning Module Types
export type ContentMode = 'athlete' | 'parent';

export interface CardContent {
  headline: string;
  body: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  caption?: string;
}

export interface DualModeContent {
  athlete: CardContent;
  parent: CardContent;
}

export interface LessonCard {
  id: string;
  type: 'lesson';
  order: number;
  content: DualModeContent;
}

export interface CheckOption {
  id: string;
  text: { athlete: string; parent: string };
  isCorrect: boolean;
  feedback: { athlete: string; parent: string };
}

export interface CheckCard {
  id: string;
  type: 'check';
  order: number;
  question: { athlete: string; parent: string };
  options: CheckOption[];
  crystalReward: number;
  hintAvailable: boolean;
  hint?: { athlete: string; parent: string };
}

export interface CompletionCard {
  id: string;
  type: 'completion';
  order: number;
  content: DualModeContent;
  unlockedContent: UnlockedItem[];
  completionBadge: Badge;
}

export type LearningCard = LessonCard | CheckCard | CompletionCard;

export interface LearningSection {
  id: string;
  order: number;
  title: string;
  unlockThreshold: number; // Cumulative correct answers required
  cards: LearningCard[];
}

export interface LearningModule {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  sport: 'Basketball' | 'Barefoot' | 'General';
  author: string;
  estimatedMins: number;
  totalCrystals: number;
  thumbnailUrl: string;
  heroVideoUrl?: string;
  prerequisites: string[];
  unlocksContent: string[];
  sections: LearningSection[];
  createdAt: string;
  updatedAt: string;
}

export interface UnlockedItem {
  type: 'DrillStack' | 'Program' | 'Product';
  id: string;
  title: string;
  description: string;
  duration?: string;
  ctaLabel?: string;
  handle?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}
```

#### 1.2 BPA Module Data

**File:** `apps/web-academy/src/data/modules/bulletproof-ankles/index.ts`

Export the full BPA module from the PRD JSON content.

**File:** `apps/web-academy/src/data/modules/bulletproof-ankles/sections.ts`

Export individual sections for lazy loading if needed.

#### 1.3 Convex Schema Updates

**File:** `packages/yp-alpha/convex/schema.ts`

Add to existing schema:

```typescript
// Add to schema.ts

// ═══════════════════════════════════════════════════════════
// LEARNING PROGRESS TABLE
// Tracks user progress through learning modules
// ═══════════════════════════════════════════════════════════
learningProgress: defineTable({
  moduleId: v.string(),           // e.g., "bpa-v1"
  userId: v.id("users"),

  // Progress tracking
  startedAt: v.number(),
  completedAt: v.optional(v.number()),
  currentSectionId: v.string(),
  currentCardId: v.string(),

  // Scoring
  totalCorrect: v.number(),
  totalAttempts: v.number(),
  crystalsEarned: v.number(),

  // State
  sectionsUnlocked: v.array(v.string()),
  mode: v.union(v.literal("athlete"), v.literal("parent")),

  // Card history for resume
  cardHistory: v.array(v.object({
    cardId: v.string(),
    viewedAt: v.number(),
    answeredAt: v.optional(v.number()),
    wasCorrect: v.optional(v.boolean()),
    attemptsOnCard: v.number(),
  })),
})
  .index("by_user", ["userId"])
  .index("by_user_module", ["userId", "moduleId"]),

// ═══════════════════════════════════════════════════════════
// USER BADGES TABLE
// Badges earned from completing modules, achievements, etc.
// ═══════════════════════════════════════════════════════════
userBadges: defineTable({
  userId: v.id("users"),
  badgeId: v.string(),          // e.g., "armor-builder"
  badgeName: v.string(),        // e.g., "Armor Builder"
  badgeIcon: v.string(),        // e.g., "🛡️"
  source: v.string(),           // e.g., "module:bpa-v1"
  earnedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_badge", ["userId", "badgeId"]),
```

#### 1.4 Convex Mutations

**File:** `packages/yp-alpha/convex/learningModules.ts`

```typescript
// Key mutations:
// - startModule(moduleId) → creates learningProgress record
// - updateProgress(progressId, cardId, sectionId)
// - answerCheck(progressId, cardId, optionId, isCorrect) → updates score, awards crystals
// - completeModule(progressId, finalScore) → awards badge, marks complete
// - getProgress(userId, moduleId) → returns current progress or null
```

---

### Phase 2: Core Components

**Estimated Files:** 10
**Dependencies:** Phase 1 complete

#### 2.1 Zustand Store

**File:** `apps/web-academy/src/stores/moduleStore.ts`

```typescript
interface ModuleStore {
  // State
  currentModule: LearningModule | null;
  currentSectionIndex: number;
  currentCardIndex: number;
  mode: ContentMode;
  crystalsEarned: number;
  correctAnswers: number;
  totalAttempts: number;
  sectionsUnlocked: Set<string>;
  cardHistory: Map<string, CardHistoryEntry>;

  // Actions
  startModule: (module: LearningModule) => void;
  nextCard: () => void;
  prevCard: () => void;
  answerCheck: (cardId: string, optionId: string) => AnswerResult;
  toggleMode: () => void;
  setCurrentPosition: (sectionId: string, cardId: string) => void;
  reset: () => void;
}
```

#### 2.2 Card Components

**Directory:** `apps/web-academy/src/components/modules/cards/`

| Component | Props | Description |
|-----------|-------|-------------|
| `LessonCard.tsx` | `card, mode, onContinue` | Displays lesson content |
| `CheckCard.tsx` | `card, mode, onAnswer, attempts` | Multiple choice question |
| `UnlockGate.tsx` | `section, currentScore, threshold, onUnlock` | Threshold gate |
| `CompletionCard.tsx` | `card, score, crystals, badge, onFinish` | Final screen |

#### 2.3 Swiper Container

**File:** `apps/web-academy/src/components/modules/CardSwiper.tsx`

- Framer Motion for swipe gestures
- Vertical swipe (up = next, down = prev)
- Touch and drag support
- Keyboard navigation (ArrowUp/Down)
- Momentum and snap behavior

#### 2.4 Mode Toggle

**File:** `apps/web-academy/src/components/modules/ModeToggle.tsx`

- Two-option toggle (Athlete icon / Parent icon)
- Animated switch
- Persists to store

#### 2.5 Progress Indicator

**File:** `apps/web-academy/src/components/modules/ModuleProgress.tsx`

- Section indicator (Section 2 of 6)
- Card progress bar (████░░░░)
- Crystal counter (💎 40)

#### 2.6 Crystal Animation

**File:** `apps/web-academy/src/components/modules/CrystalReward.tsx`

- Floating "+10" animation
- Sparkle effect
- Sound effect trigger (optional)

---

### Phase 3: Page Routes

**Estimated Files:** 4
**Dependencies:** Phase 2 complete

#### 3.1 Modules Grid Page

**File:** `apps/web-academy/src/app/(main)/playbook/modules/page.tsx`

- Grid of ModuleEntryCard components
- Filter by sport/category
- Show completion status

#### 3.2 Module Entry Page

**File:** `apps/web-academy/src/app/(main)/playbook/modules/[slug]/page.tsx`

- Hero image/video
- Title, subtitle, author
- Stats (duration, crystals, sections)
- "What You'll Learn" list
- Start/Resume button
- Progress indicator if in-progress

#### 3.3 Card Player Page

**File:** `apps/web-academy/src/app/(main)/playbook/modules/[slug]/play/page.tsx`

- Full-screen card swiper
- Close button (with confirm if in progress)
- Progress header
- Mode toggle
- Card content area

#### 3.4 Playbook Integration

**File:** Update `apps/web-academy/src/app/(main)/playbook/page.tsx`

- Add "Learning" section
- Link to modules grid
- Show featured module (BPA)

---

### Phase 4: Integration & Polish

**Estimated Files:** 3
**Dependencies:** Phase 3 complete

#### 4.1 Crystal Integration

Connect module completion to Wolf Loop crystal economy:
- Use existing `awardCrystals` mutation
- Respect daily cap (50)
- Show in profile crystal balance

#### 4.2 Drill Stack Unlock

Connect module completion to entitlements:
- Create entitlement for "bpa-drill-stack-v1" on completion
- Show unlock in drill stack access check

#### 4.3 Badge Display

Update profile page to show earned badges:
- Add badges section
- Show badge modal on tap

---

## File Manifest

### New Files (21 total)

| Path | Type | Phase |
|------|------|-------|
| `src/data/modules/types.ts` | Types | 1 |
| `src/data/modules/bulletproof-ankles/index.ts` | Data | 1 |
| `src/data/modules/bulletproof-ankles/sections.ts` | Data | 1 |
| `convex/schema.ts` (update) | Schema | 1 |
| `convex/learningModules.ts` | API | 1 |
| `src/stores/moduleStore.ts` | Store | 2 |
| `src/components/modules/cards/LessonCard.tsx` | Component | 2 |
| `src/components/modules/cards/CheckCard.tsx` | Component | 2 |
| `src/components/modules/cards/UnlockGate.tsx` | Component | 2 |
| `src/components/modules/cards/CompletionCard.tsx` | Component | 2 |
| `src/components/modules/cards/index.ts` | Export | 2 |
| `src/components/modules/CardSwiper.tsx` | Component | 2 |
| `src/components/modules/ModeToggle.tsx` | Component | 2 |
| `src/components/modules/ModuleProgress.tsx` | Component | 2 |
| `src/components/modules/CrystalReward.tsx` | Component | 2 |
| `src/components/modules/ModuleEntryCard.tsx` | Component | 2 |
| `src/app/(main)/playbook/modules/page.tsx` | Page | 3 |
| `src/app/(main)/playbook/modules/[slug]/page.tsx` | Page | 3 |
| `src/app/(main)/playbook/modules/[slug]/play/page.tsx` | Page | 3 |
| `src/hooks/useModuleProgress.ts` | Hook | 3 |
| `src/hooks/useLearningModule.ts` | Hook | 3 |

### Modified Files (3 total)

| Path | Changes |
|------|---------|
| `convex/schema.ts` | Add learningProgress, userBadges tables |
| `src/app/(main)/playbook/page.tsx` | Add Learning section |
| `src/app/(main)/profile/page.tsx` | Add badges display |

---

## Technical Decisions

### 1. Data Storage: Static TypeScript vs CMS

**Decision:** Static TypeScript files

**Rationale:**
- Matches Basketball Chassis pattern
- Type-safe content
- No CMS dependency
- Easy to version control
- Fast builds, no runtime fetch

### 2. State Management: Zustand + Convex

**Decision:** Zustand for UI state, Convex for persistence

**Rationale:**
- Zustand is already used in the codebase
- Real-time sync with Convex
- Offline-capable with queue
- Simple mental model

### 3. Animation: Framer Motion

**Decision:** Use Framer Motion for card swiper

**Rationale:**
- Already in project dependencies
- Gesture handling built-in
- Spring physics for natural feel
- Cross-platform support

### 4. Content Mode Toggle

**Decision:** Store in Zustand, persist preference in localStorage

**Rationale:**
- Immediate UI update (no server round-trip)
- Survives page refresh
- Default from user profile age

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Swipe gesture conflicts with scroll | Medium | Use dedicated swipe zone, disable body scroll |
| Content too long for cards | Low | Content authored with word limits |
| Crystal economy inflation | Low | Daily cap enforced globally |
| Progress desync (offline) | Medium | Optimistic updates with Convex queue |
| Mode toggle confuses users | Low | Clear visual indicators, tutorial prompt |

---

## Testing Strategy

### Unit Tests

```typescript
// unlock-threshold.test.ts
describe('Section Unlock Logic', () => {
  it('unlocks section when threshold met', () => {
    const section = { unlockThreshold: 5 };
    expect(canUnlockSection(section, 5)).toBe(true);
    expect(canUnlockSection(section, 4)).toBe(false);
  });
});

// crystal-calculation.test.ts
describe('Crystal Calculation', () => {
  it('awards 10 for first try correct', () => {
    expect(calculateCrystals(true, 1)).toBe(10);
  });
  it('awards 5 for retry correct', () => {
    expect(calculateCrystals(true, 2)).toBe(5);
  });
  it('awards 0 for wrong', () => {
    expect(calculateCrystals(false, 1)).toBe(0);
  });
});
```

### Integration Tests

- Module start creates progress record
- Answer submission updates score and crystals
- Completion awards badge and creates entitlement
- Resume loads correct position

### E2E Tests

- Full BPA module completion flow
- Mode toggle mid-module
- Close and resume module
- Check card retry behavior

---

## Definition of Done

### Phase 1 Complete When:
- [ ] Types defined and exported
- [ ] BPA module data file complete with all 7 sections
- [ ] Convex schema updated with learningProgress, userBadges
- [ ] Convex mutations created and tested
- [ ] TypeScript compiles without errors

### Phase 2 Complete When:
- [ ] All card components render correctly
- [ ] CardSwiper handles vertical swipe gestures
- [ ] ModeToggle switches content instantly
- [ ] CrystalReward animation plays on correct answer
- [ ] Zustand store manages all UI state

### Phase 3 Complete When:
- [ ] Modules grid page shows BPA
- [ ] Module entry page displays all info
- [ ] Card player page completes full flow
- [ ] Progress persists across sessions
- [ ] Playbook links to modules

### Phase 4 Complete When:
- [ ] Crystals awarded to user balance
- [ ] Badge appears in profile
- [ ] Drill stack unlocked on completion
- [ ] All tests passing

---

## Rollback Plan

If critical issues discovered post-deploy:

1. **Feature flag:** Can disable `/playbook/modules` route
2. **Data safe:** Learning progress is additive, no destructive changes
3. **Crystal rollback:** Can query and reverse crystal transactions
4. **Badge removal:** Can delete badge records if needed

---

## Post-Launch Monitoring

| Metric | Alert Threshold | Action |
|--------|-----------------|--------|
| Module start errors | >5% | Check Convex logs |
| Crystal award failures | >1% | Investigate race conditions |
| Swiper gesture issues | >10% mobile users | Review gesture implementation |
| Completion rate <40% | After 7 days | Review content/UX |

---

*Plan Version: 1.0.0*
*Ready for implementation pending spec approval*
