# Feature Specification: Wolf Pack Onboarding + R3 Sorting

**Version:** 1.0.0
**Created:** 2026-01-02
**Status:** Draft
**Spec ID:** 002-wolf-pack-onboarding
**Depends On:** 001-wolf-loop-gamification

---

## Overview

The Wolf Pack Onboarding is a 45-second AI-powered "sorting" experience that assigns new athletes to both a **Wolf Identity** (aspirational) and a **Training Path** (biological). This solves the "Ego Gap" problem: kids who think they're LeBron, select "Advanced," injure themselves, and quit.

The system separates **what they want to be** (Speed/Tank/Air Wolf) from **what they need** (Release/Restore/Re-Engineer path), then frames the biological prescription in aspirational language.

**Key Insight:** The kid picks their dream. The AI protects their body. Both feel like a win.

---

## Constitution Alignment

- [x] **Athlete First:** Protects kids from ego-driven injury while respecting their aspirations
- [x] **Parents Partners:** Biological sorting prevents injury → fewer refunds, happier parents
- [x] **Simplicity:** 3 questions, 45 seconds, one clear identity reveal
- [x] **Stack Sacred:** First mission is 5-7 minutes, immediately after sorting

---

## The Two-Layer System

### Layer 1: Wolf Identity (Aspirational - "The Skin")

What the athlete **wants to be**. Determines avatar, visuals, and long-term aspiration.

| Identity | Desire | Avatar Style | Color Palette |
|----------|--------|--------------|---------------|
| **Speed Wolf** ⚡ | "I want to be faster" | Sleek, electric | Cyan + white streaks |
| **Tank Wolf** 🛡️ | "I want to be stronger" | Armored, solid | Purple + steel |
| **Air Wolf** 🦅 | "I want to dunk/fly" | Winged, elevated | Gold + sky blue |

**Kid picks this.** It's their dream identity.

### Layer 2: Training Path (Biological - "The Engine")

What the athlete **needs right now**. Determines exercise selection and intensity.

| Path | Biological State | Prescription | Framing (Kid Language) |
|------|------------------|--------------|------------------------|
| **GLASS** | Pain-dominant | RELEASE phase | "Your landing gear needs calibration" |
| **GRINDER** | Volume-dominant | RESTORE phase | "Your engine is redlining" |
| **PROSPECT** | Output-ready | RE-ENGINEER phase | "Time to build power" |

**AI detects this.** Through 2-3 simple questions about pain and volume.

### The Magic Combination

| Scenario | Wolf Identity | Training Path | First Mission | Frame |
|----------|---------------|---------------|---------------|-------|
| Kid with bad knees wants to dunk | Air Wolf | GLASS | Ankle Shield | "Calibrating your landing gear so you can fly" |
| Overworked travel ball kid wants speed | Speed Wolf | GRINDER | System Reboot | "Flushing your engine so you can hit top speed" |
| Fresh kid wants to jump higher | Air Wolf | PROSPECT | Flight Calibration | "Testing your vertical mechanics" |
| Kid with ankle pain wants power | Tank Wolf | GLASS | Ankle Shield | "Reinforcing your chassis foundation" |

---

## User Stories

### Primary Users

- **Athletes (ages 8-14):** New users completing onboarding
- **Parents:** Viewing the athlete's assigned path and understanding why

---

### US-1: Complete AI Sorting Chat

**As a** new athlete
**I want** to answer a few quick questions from AskYP
**So that** I get my Wolf Identity and first mission immediately

**Acceptance Criteria:**
- [ ] AC-1.1: Sorting chat completes in <45 seconds (3 questions max)
- [ ] AC-1.2: Questions feel like a coach conversation, not a form
- [ ] AC-1.3: AI detects pain signals and routes to GLASS path
- [ ] AC-1.4: AI detects overtraining signals and routes to GRINDER path
- [ ] AC-1.5: Default path is PROSPECT if no red flags detected
- [ ] AC-1.6: Chat ends with identity reveal animation, not "goodbye"

---

### US-2: Receive Wolf Identity

**As an** athlete
**I want** to see my Wolf Identity (Speed/Tank/Air) revealed dramatically
**So that** I feel like I'm joining something elite

**Acceptance Criteria:**
- [ ] AC-2.1: Identity reveal has full-screen animation + wolf howl
- [ ] AC-2.2: Wolf avatar displays in selected identity style
- [ ] AC-2.3: Color palette updates to match identity
- [ ] AC-2.4: Locked future colors shown with "Unlock at Hunter" labels
- [ ] AC-2.5: Identity persists but can be changed later (in settings)

---

### US-3: Receive Training Path (Framed Positively)

**As an** athlete
**I want** to understand my training path without feeling "injured" or "weak"
**So that** I'm motivated to start, not discouraged

**Acceptance Criteria:**
- [ ] AC-3.1: GLASS path framed as "Calibrating your chassis" (not "you're injured")
- [ ] AC-3.2: GRINDER path framed as "Optimizing your engine" (not "you're overtrained")
- [ ] AC-3.3: PROSPECT path framed as "Building power" (standard)
- [ ] AC-3.4: Coach comment explains WHY in one sentence
- [ ] AC-3.5: Path determines first 7-14 days of mission content

---

### US-4: Start First Mission Immediately

**As an** athlete
**I want** to start my first mission within 60 seconds of identity reveal
**So that** I experience "Time to First Sweat" before I can get distracted

**Acceptance Criteria:**
- [ ] AC-4.1: First mission loads automatically after identity reveal
- [ ] AC-4.2: Mission is 5-7 minutes maximum
- [ ] AC-4.3: Mission matches Training Path (Glass→Ankle Shield, etc.)
- [ ] AC-4.4: Completing first mission triggers Wolf Drop (from 001 spec)
- [ ] AC-4.5: Total onboarding → first sweat is <5 minutes

---

### US-5: Parent Views Sorting Rationale

**As a** parent
**I want** to see why my child was assigned their training path
**So that** I understand the app is protecting them

**Acceptance Criteria:**
- [ ] AC-5.1: Parent dashboard shows Wolf Identity + Training Path
- [ ] AC-5.2: Parent sees coach comment explaining the sorting
- [ ] AC-5.3: Parent can view (but not change) the biological assessment
- [ ] AC-5.4: If GLASS, parent sees note about pain prevention focus

---

## The AskYP Sorting Script

### The 3-Question Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Q1: THE PAIN CHECK                                         │
│  "Welcome to the Pack. I need to calibrate your system.    │
│   Be real—does anything hurt when you play?                │
│   Knees, ankles, back?"                                     │
│                                                             │
│  [Yes, something hurts] → GLASS path → Skip to Q3           │
│  [No pain] → Continue to Q2                                 │
├─────────────────────────────────────────────────────────────┤
│  Q2: THE VOLUME CHECK                                       │
│  "Good. How many teams are you on? Are you waking up       │
│   fresh or feeling heavy?"                                  │
│                                                             │
│  [Multiple teams / Heavy] → GRINDER path → Go to Q3         │
│  [One team / Fresh] → PROSPECT path → Go to Q3              │
├─────────────────────────────────────────────────────────────┤
│  Q3: THE AMBITION CHECK (Wolf Identity)                     │
│  "What's the one thing stopping you from dominating?       │
│   Speed, Bounce, or Strength?"                              │
│                                                             │
│  [Speed] → SPEED WOLF                                       │
│  [Bounce/Dunk/Vertical] → AIR WOLF                          │
│  [Strength/Power] → TANK WOLF                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  IDENTITY REVEAL                                            │
│  "Analyzing... [Wolf howl animation]                        │
│                                                             │
│   You are a [SPEED/TANK/AIR] WOLF.                         │
│   [Coach frame based on path]                               │
│   Loading your first mission now."                          │
└─────────────────────────────────────────────────────────────┘
```

### Coach Frames by Path

| Path | Wolf Identity | Coach Frame |
|------|---------------|-------------|
| GLASS | Speed Wolf | "Your acceleration system is strong, but your chassis needs calibration first. We're locking in your foundation so you can hit top speed safely." |
| GLASS | Tank Wolf | "Your power potential is massive, but your base needs reinforcement. We're fortifying your foundation before we build the engine." |
| GLASS | Air Wolf | "You're built to fly, but your landing gear is compromised. We're calibrating your chassis so you can catch bodies without breaking." |
| GRINDER | Speed Wolf | "Your engine is redlining from too much volume. We're flushing the system so you can unlock your true top speed." |
| GRINDER | Tank Wolf | "You've been grinding hard—your system needs a reset. We're optimizing your recovery so you can build real power." |
| GRINDER | Air Wolf | "Your flight systems are overloaded. We're restoring your elastic energy so you can explode when it counts." |
| PROSPECT | Speed Wolf | "Your system is primed. We're building acceleration mechanics to unlock your speed potential." |
| PROSPECT | Tank Wolf | "Your foundation is solid. We're engineering force production to maximize your power output." |
| PROSPECT | Air Wolf | "Your chassis is ready. We're calibrating your vertical mechanics to unlock your flight ceiling." |

---

## First Mission Mapping

| Training Path | Mission Name | Duration | The Hook |
|---------------|--------------|----------|----------|
| **GLASS** | "Ankle Shield" | 5 min | "Fix your pain immediately. Static holds to bulletproof your base." |
| **GRINDER** | "System Reboot" | 6 min | "Flush the fatigue. Flow and tension to reset your engine." |
| **PROSPECT** | "Flight Calibration" | 7 min | "Test your vertical mechanics. Pogo jumps to measure your bounce." |

---

## Functional Requirements

### Core Requirements

| ID | Requirement | Priority | Verification |
|----|-------------|----------|--------------|
| FR-1 | AI sorting chat via AskYP agent | Must Have | Chat completes in <45s |
| FR-2 | Pain detection routes to GLASS | Must Have | Pain keywords trigger path |
| FR-3 | Volume detection routes to GRINDER | Must Have | Multi-team/heavy triggers path |
| FR-4 | Ambition question determines Wolf Identity | Must Have | 3 options → 3 identities |
| FR-5 | Identity reveal with animation | Must Have | Full-screen reveal plays |
| FR-6 | First mission auto-loads | Must Have | <60s from reveal to mission |
| FR-7 | Sorting result persists to user profile | Must Have | Data saved to Convex |
| FR-8 | Parent can view sorting rationale | Should Have | Parent dashboard shows why |

### Business Rules

| ID | Rule | Example |
|----|------|---------|
| BR-1 | Pain ALWAYS routes to GLASS, regardless of other answers | Kid with knee pain who says "I'm fine" still gets GLASS |
| BR-2 | Wolf Identity is aspirational, never penalized | Air Wolf with GLASS path still shows Air Wolf avatar |
| BR-3 | Path can evolve over time (future spec) | After 14 days of GLASS, AI may promote to GRINDER |
| BR-4 | Identity can be changed in settings (once per 30 days) | Kid can switch from Speed to Air Wolf |

---

## Non-Functional Requirements

| ID | Category | Requirement | Measurement |
|----|----------|-------------|-------------|
| NFR-1 | Performance | Sorting chat <45 seconds total | Timer from first message |
| NFR-2 | Performance | Identity reveal animation <3 seconds | Animation duration |
| NFR-3 | Performance | First mission loads <5 seconds after reveal | Time to workout start |
| NFR-4 | UX | Total onboarding → first sweat <5 minutes | End-to-end timing |

---

## Data Requirements

### Entities

| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| **Wolf Identity** | Aspirational archetype | speed / tank / air |
| **Training Path** | Biological prescription | glass / grinder / prospect |
| **Sorting Result** | Combined assignment | identity, path, first_mission, coach_comment |

### Schema Additions

```typescript
// packages/yp-alpha/convex/schema.ts

users: defineTable({
  // ... existing fields ...

  // NEW: R3 Sorting
  wolfIdentity: v.optional(v.union(
    v.literal("speed"),
    v.literal("tank"),
    v.literal("air")
  )),
  trainingPath: v.optional(v.union(
    v.literal("glass"),
    v.literal("grinder"),
    v.literal("prospect")
  )),
  sortingCoachComment: v.optional(v.string()),
  sortedAt: v.optional(v.number()),

  // Path evolution tracking
  pathHistory: v.optional(v.array(v.object({
    path: v.string(),
    assignedAt: v.number(),
    reason: v.string(),
  }))),
})
```

---

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Kid says "everything hurts" | Route to GLASS, coach comment addresses multiple issues |
| Kid says "nothing hurts" but has injury history in profile | Prioritize current self-report, but flag for parent |
| Kid refuses to answer pain question | Default to PROSPECT, but prompt again after first mission |
| Chat times out mid-flow | Save partial state, resume on next app open |
| Kid picks identity but closes before first mission | Resume at identity reveal screen |

---

## Out of Scope (Phase 1)

- **Path Evolution:** Automatic promotion from GLASS → GRINDER after 14 days (future)
- **Re-sorting:** AI-triggered re-evaluation based on training data (future)
- **Parent Override:** Parent cannot override AI sorting (by design)
- **Custom Identities:** Only Speed/Tank/Air in v1 (future: hybrid identities)

---

## Integration with Wolf Loop (001)

| Wolf Loop Feature | Integration Point |
|-------------------|-------------------|
| Daily Mission | Content determined by Training Path |
| Wolf Avatar | Style/color determined by Wolf Identity |
| XP + Ranks | Same system, no changes |
| Wolf Drops | Same system, first drop after first mission |
| Moon Streak | Starts after first mission completion |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Sorting completion rate | 95% | Users who complete all 3 questions |
| Time to First Sweat | <5 min | Onboarding start → first mission start |
| First mission completion | 80% | Users who finish first mission same session |
| 7-day retention by path | GLASS ≥ 60%, others ≥ 70% | D7 retention segmented by path |
| Injury reports (30-day) | <1% of active users | Support tickets + in-app reports |

---

## Open Questions

- [NEEDS CLARIFICATION: Should the AI use voice or text for sorting? Voice is faster but requires permissions.]
- [NEEDS CLARIFICATION: Can kids skip the sorting chat and pick manually? (Recommend: No, to protect them)]
- [NEEDS CLARIFICATION: What happens if a GLASS kid completes Foundation 42 days? Auto-promote to GRINDER?]

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-02 | Claude (MAI) | Initial specification |
