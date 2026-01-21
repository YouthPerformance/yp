# Barefoot Reset 42-Day Program - UI/UX Specification

## Wolf Protocol Design Language

This document specifies every screen, state, and interaction for the Barefoot Reset program within the Wolf Den.

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Entry Flow (First-Time User)](#entry-flow)
3. [Home Screen (The Radar)](#home-screen)
4. [Workout Player (Wolf Command)](#workout-player)
5. [Workout Completion](#workout-completion)
6. [Strike WOD Flow](#strike-wod-flow)
7. [Progress & Stats](#progress--stats)
8. [Rest Day Experience](#rest-day-experience)
9. [Error States](#error-states)
10. [Animations & Transitions](#animations--transitions)

---

## Design Principles

### Visual Language
- **Aesthetic**: "Cyber-Nature" - Neon organics, wireframes, glitches
- **Animation**: On Twos (12fps) - crunchy, hand-drawn Spider-Verse feel
- **Colors**: Neon Trinity (Cyan/Volt, Orange/Forge, Purple/Flow)

### Wolf Protocol Terminology
| Old Term | Wolf Protocol Term | Usage |
|----------|-------------------|-------|
| Gym/App | The Den | "Meet me in The Den" |
| Workout | Mission | "Mission: Foundation Fundamentals" |
| Exercise | Charge | "Charge your Wolf with 50 reps" |
| Streak | Chain | "Don't break the Chain" |
| Progress | Signal Strength | "Your signal is fading" |
| XP/Points | Shards | "Collected 48 Glitch Shards" |
| Level Up | Evolution | "Wolf Evolution Imminent" |

---

## Entry Flow

### Screen 1: Wolf Contract

**Purpose**: Commitment device - user signs the 42-day contract

**Layout**:
```
┌──────────────────────────────────────┐
│         🐺 THE WOLF CONTRACT          │
│                                       │
│  "I commit to 42 days of training"    │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │                                 │  │
│  │    [Contract text with         │  │
│  │     checkbox commitments]      │  │
│  │                                 │  │
│  │    □ I will show up            │  │
│  │    □ I trust the Blueprint     │  │
│  │    □ I will earn my gear       │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │  [FINGERPRINT SCANNER ZONE]    │  │
│  │       Hold to Sign             │  │
│  └─────────────────────────────────┘  │
│                                       │
└──────────────────────────────────────┘
```

**Interactions**:
- Checkboxes must all be checked to enable signature
- Fingerprint scanner = hold thumb for 2 seconds
- On hold: fingerprint glitches → morphs into Wolf logo
- Audio: "Thump-thump... Identity Verified."

**States**:
- `empty`: All checkboxes unchecked
- `partial`: Some checked, signature disabled
- `ready`: All checked, signature pulsing
- `signing`: Hold in progress, fingerprint animating
- `complete`: Contract accepted, transition to sorting

---

### Screen 2: Wolf Sorting (Optional Voice Flow)

**Purpose**: Determine user's primary Frequency

**Note**: This can be skipped if parent already completed during signup

**Flow**:
1. Wolf materializes with entrance animation
2. Wolf speaks: "Welcome to the Pack, [Name]. Your [parent] told me about the [injury]. We fix those first."
3. Wolf asks: "But first... are you chasing Speed, Power, or Flight?"
4. User responds (voice or buttons)
5. System sets primary Frequency

**Frequency Mapping**:
- Speed → Volt (Cyan)
- Power → Forge (Orange)
- Flight → Flow (Purple)

---

## Home Screen

### "The Radar" Layout

**Purpose**: Central hub showing Wolf, Spider Chart, and today's mission

**Layout (Portrait)**:
```
┌──────────────────────────────────────┐
│  [≡]     THE DEN       [🔔] [⚙️]    │
│─────────────────────────────────────-│
│                                       │
│         ┌─────────────┐               │
│         │   SPIDER    │               │
│         │   CHART     │               │
│         │  ▲ VOLT     │               │
│         │ ◄── ──►     │               │
│         │  FORGE FLOW │               │
│         └─────────────┘               │
│                                       │
│        ┌─────────────────┐            │
│        │   🐺 WOLF       │            │
│        │  [Evolution]    │            │
│        │   Lv. 7         │            │
│        └─────────────────┘            │
│                                       │
│  ┌────────────────────────────────┐   │
│  │  TODAY'S MISSION               │   │
│  │  ─────────────────────         │   │
│  │  Foundation Fundamentals       │   │
│  │  Mission 1 • 8 min • 48 Shards │   │
│  │                                │   │
│  │        [▶ START MISSION]       │   │
│  └────────────────────────────────┘   │
│                                       │
│  ┌────────────────────────────────┐   │
│  │  🔗 CHAIN: 3 days │ 🔷 147     │   │
│  └────────────────────────────────┘   │
│                                       │
└──────────────────────────────────────┘
```

**Spider Chart Behavior**:
- Three axes: Volt (top), Forge (bottom-left), Flow (bottom-right)
- Chart grows outward as user completes exercises in each category
- Pulses neon when about to level up
- Shows "gap" visually (weak areas appear smaller)

**Wolf Display**:
- Shows current evolution state (Ghost/Forming/Solid/Radiant)
- Level number displayed
- Tapping Wolf shows evolution progress

**Today's Mission Card**:
- Shows mission name, number, duration, potential shards
- If Strike WOD available: small badge indicator
- If behind: shows "System Instability" styling (see Error States)

**Stats Bar**:
- Chain count with link icon
- Total Shards count
- Both tap to expand details

**States**:
- `ready`: Normal state, mission available
- `completed_today`: Mission done, shows completion state
- `rest_day`: Rest day content instead of mission
- `behind`: System instability styling
- `milestone`: Special styling for milestone days

---

## Workout Player

### "Wolf Command" Layout

**Purpose**: The workout execution interface

### Landscape Layout (iPad/TV) - "70/30 Split"

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌──────────────────────────────────────────┬──────────────────────────┐│
│  │                                          │                          ││
│  │                                          │    ┌──────────────┐      ││
│  │                                          │    │              │      ││
│  │              VIDEO ARENA                 │    │   ⏱ 0:45     │      ││
│  │              (70% width)                 │    │   [TIMER]    │      ││
│  │                                          │    │              │      ││
│  │                                          │    └──────────────┘      ││
│  │   ┌──────┐                               │                          ││
│  │   │ 📍   │  Mission: 4:32               │    ┌──────────────┐      ││
│  │   │ Time │                               │    │ ✓ Beast Rock │      ││
│  │   └──────┘                               │    │ ► Low Squat  │◄────-││
│  │                                          │    │ ○ Split Squat│      ││
│  │                                          │    │ ○ Forefoot   │      ││
│  │                                          │    │ ○ Recoil     │      ││
│  │                                          │    │ ○ Massai     │      ││
│  │                                          │    └──────────────┘      ││
│  │                                          │                          ││
│  │                                          │    ┌──────────────┐      ││
│  │                                          │    │ "KNEES OUT"  │      ││
│  │                                          │    │  Coaching    │      ││
│  │                                          │    │    Cue       │      ││
│  │                                          │    └──────────────┘      ││
│  │                                          │                          ││
│  └──────────────────────────────────────────┴──────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Portrait Layout (Mobile)

```
┌──────────────────────────────────────┐
│  ← Back     Mission 1      [II]      │
│─────────────────────────────────────-│
│                                       │
│  ┌─────────────────────────────────┐  │
│  │                                 │  │
│  │          VIDEO FEED             │  │
│  │          (40% height)           │  │
│  │                                 │  │
│  │   [Neon ring progress bar       │  │
│  │    around video frame]          │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │                                 │  │
│  │         ⏱ 0:45                  │  │
│  │     [MASSIVE TIMER]             │  │
│  │                                 │  │
│  │    "Low Squat Walks"            │  │
│  │    1:30 total • Round 1/1       │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │  COACHING CUE                   │  │
│  │  "Stay low—no bouncing up"      │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ ✓ Beast Rock  │ ► Low Squat     │  │
│  │ ○ Split Squat │ ○ Forefoot      │  │
│  │ ○ Recoil      │ ○ Massai        │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌──────┐  ┌──────────┐  ┌──────┐    │
│  │ SKIP │  │ ▶ PAUSE  │  │ DONE │    │
│  └──────┘  └──────────┘  └──────┘    │
│                                       │
└──────────────────────────────────────┘
```

**Key Elements**:

1. **Video Arena**
   - HLS video stream from Cloudflare
   - Neon ring progress bar around frame (closes as workout progresses)
   - Mission elapsed time overlay (top-left)

2. **Timer**
   - Massive, readable from 10 feet
   - Pulses with "Wolf Breath" rhythm
   - Color: Green = Work, Blue = Rest
   - Countdown with audio cues at 10s, 5s, 3, 2, 1

3. **Exercise Queue**
   - Current exercise expanded and bright
   - Completed exercises collapsed with checkmark
   - Upcoming exercises dimmed
   - Animation on completion: item "digitizes/dissolves" collecting shards

4. **Coaching Cue**
   - Large, bold text
   - Updates dynamically with exercise
   - Primary cue shown, secondary cues cycle

5. **Controls (Thumb Zone)**
   - SKIP: Appears after 10 seconds (Safe Skip)
   - PAUSE/PLAY: Center, largest button
   - DONE: Manual complete for current exercise

**Safe Skip Logic**:
- Skip button hidden for first 10 seconds
- Tapping skip: No shards for that exercise
- Chain only updates if >70% exercises completed (5 of 6)
- Skip animation: Red "X" overlay, then dissolve

**Rest Period (10 seconds between exercises)**:
```
┌─────────────────────────────────────┐
│                                      │
│            REST                      │
│            ⏱ 0:08                    │
│                                      │
│     NEXT UP: Split Squat Iso Hold   │
│     [Thumbnail preview]              │
│                                      │
│     "Get ready for your next        │
│      charge..."                      │
│                                      │
│         [SKIP REST →]                │
│                                      │
└─────────────────────────────────────┘
```

**Schematic Mode (Video Failure Fallback)**:
```
┌─────────────────────────────────────┐
│                                      │
│   ┌───────────────────────────────┐  │
│   │                               │  │
│   │    [EXERCISE THUMBNAIL]       │  │
│   │    (Pre-cached image)         │  │
│   │                               │  │
│   │    "LOW SQUAT WALKS"          │  │
│   │                               │  │
│   └───────────────────────────────┘  │
│                                      │
│           ⏱ 0:45                     │
│                                      │
│   🎧 AUDIO ACTIVE                    │
│   "Stay low—no bouncing up"          │
│                                      │
│   [Retry Video]                      │
│                                      │
└─────────────────────────────────────┘
```

**TV Mode (Cast to TV)**:
- Font sizes 2x larger for 10-foot viewing
- No touch controls visible
- Audio becomes primary UI:
  - "3... 2... 1... Rest. Next up: Pogo Jumps."
  - Distinct chime when exercise complete

---

## Workout Completion

### Celebration Sequence

**Flow**: Exercise 6 completes → Shard rain → Spider chart update → Summary

**Screen 1: Shard Rain (2-3 seconds)**
```
┌─────────────────────────────────────┐
│                                      │
│         🐺 WOLF HOWLS                │
│                                      │
│    ┌─────────────────────────────┐   │
│    │     💎 💎 💎 💎 💎           │   │
│    │       💎 💎 💎 💎           │   │
│    │   [SHARDS RAINING DOWN]     │   │
│    │        💎 💎 💎             │   │
│    │          💎 💎              │   │
│    └─────────────────────────────┘   │
│                                      │
│            +48 SHARDS                │
│                                      │
│         [auto-advances]              │
│                                      │
└─────────────────────────────────────┘
```
- Wolf howl sound effect
- Shards animate falling into collection
- Counter animates up: +48

**Screen 2: Spider Chart Update (1-2 seconds)**
```
┌─────────────────────────────────────┐
│                                      │
│      SIGNAL STRENGTH INCREASED       │
│                                      │
│         ┌─────────────┐              │
│         │   SPIDER    │              │
│         │   CHART     │              │
│         │  [PULSES    │              │
│         │   OUTWARD]  │              │
│         └─────────────┘              │
│                                      │
│    VOLT +2   FORGE +2   FLOW +2      │
│                                      │
│         [auto-advances]              │
│                                      │
└─────────────────────────────────────┘
```
- Chart visibly grows in the trained categories
- Category labels pulse with earned points

**Screen 3: Summary Card**
```
┌─────────────────────────────────────┐
│                                      │
│       ✓ MISSION COMPLETE             │
│       Foundation Fundamentals        │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │  ⏱ 8:32        │  +48 SHARDS    │ │
│  │  Duration      │  Earned        │ │
│  │────────────────┼────────────────│ │
│  │  6/6           │  🔗 4 days     │ │
│  │  Exercises     │  Chain         │ │
│  └─────────────────────────────────┘ │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │  ⚡ STRIKE WOD AVAILABLE        │ │
│  │  Bonus challenge • 6 min AMRAP  │ │
│  │  +25 bonus shards possible      │ │
│  │                                 │ │
│  │        [START STRIKE WOD]       │ │
│  │        [Skip for today]         │ │
│  └─────────────────────────────────┘ │
│                                      │
│           [RETURN TO DEN]            │
│                                      │
└─────────────────────────────────────┘
```

**If no Strike WOD available**:
- Strike WOD card not shown
- Just "Return to Den" button

**Chain Update Logic**:
- If 5+ exercises completed: Chain increments
- If <5 exercises completed: Chain frozen (no penalty, no increment)
- If 0 exercises completed: Chain breaks

---

## Strike WOD Flow

### Entry Screen
```
┌─────────────────────────────────────┐
│                                      │
│        ⚡ STRIKE WOD                 │
│                                      │
│        "6-Minute AMRAP"              │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │  Tuck Jumps            x5       │ │
│  │  Skater Squats         x8       │ │
│  │  Flutter Kicks         x12      │ │
│  │  Low Squat Soleus Raise x20     │ │
│  └─────────────────────────────────┘ │
│                                      │
│  Complete as many rounds as          │
│  possible. Quality > Speed.          │
│                                      │
│  POTENTIAL REWARD: +25 SHARDS        │
│                                      │
│         [⚡ BEGIN CHALLENGE]         │
│         [Not today]                  │
│                                      │
└─────────────────────────────────────┘
```

### During Strike WOD
- Countdown timer (6:00 → 0:00)
- Exercise list visible with current highlighted
- Round counter: "Round 2"
- No video, just exercise names and timer
- Self-paced - user taps "Next" after each exercise

### Effort Rating Screen
```
┌─────────────────────────────────────┐
│                                      │
│        ⚡ STRIKE WOD COMPLETE        │
│                                      │
│     How hard did you push today?     │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │         🐺                      │ │
│  │    [WOLF FACE CHANGES          │ │
│  │     WITH SLIDER POSITION]      │ │
│  │                                 │ │
│  │    😴 → 😐 → 😤 → 🔥 → 💀       │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                      │
│      ──────●──────────────────        │
│      1  2  3  4  5  6  7  8  9  10   │
│                                      │
│           Current: 3                 │
│                                      │
│          [SUBMIT EFFORT]             │
│                                      │
└─────────────────────────────────────┘
```

**Wolf Face Reactions**:
- 1-2: Sleepy wolf (😴)
- 3-4: Neutral wolf (😐)
- 5-6: Focused wolf (😤)
- 7-8: Fired up wolf (🔥)
- 9-10: Beast mode wolf (💀 or 🐺⚡)

**Rewards**:
- Effort 1-4: +15 bonus shards
- Effort 5-7: +20 bonus shards
- Effort 8-10: +25 bonus shards

---

## Progress & Stats

### Progress Screen (Tap from Home)
```
┌─────────────────────────────────────┐
│  ← Back       PROGRESS               │
│─────────────────────────────────────-│
│                                      │
│  ┌─────────────────────────────────┐ │
│  │  42-DAY JOURNEY                 │ │
│  │  ████████████░░░░░░░░░░░░░░░░░  │ │
│  │  Day 12 of 42 • 8 workouts done │ │
│  └─────────────────────────────────┘ │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │  PHASE: FOUNDATION              │ │
│  │  ████████░░ 8/10 complete       │ │
│  └─────────────────────────────────┘ │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │  CALENDAR                       │ │
│  │  M  T  W  T  F  S  S            │ │
│  │  ✓  ✓  ✓  ✓  ✓  ○  ○  Week 1   │ │
│  │  ✓  ✓  ✓  ●  ○  ○  ○  Week 2   │ │
│  │  ○  ○  ○  ○  ○  ○  ○  Week 3   │ │
│  │  ...                            │ │
│  └─────────────────────────────────┘ │
│                                      │
│  Legend: ✓=Done ●=Today ○=Upcoming   │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │  STATS                          │ │
│  │  Total Shards: 384              │ │
│  │  Current Chain: 8 days          │ │
│  │  Best Chain: 8 days             │ │
│  │  Strike WODs: 3/4 completed     │ │
│  └─────────────────────────────────┘ │
│                                      │
└─────────────────────────────────────┘
```

### Badges Screen
```
┌─────────────────────────────────────┐
│  ← Back        BADGES                │
│─────────────────────────────────────-│
│                                      │
│  EARNED (4)                          │
│  ┌───────┐  ┌───────┐  ┌───────┐    │
│  │  🔗   │  │  🔗   │  │ ⚡    │    │
│  │ 3-Day │  │ 7-Day │  │Strike │    │
│  │ Chain │  │ Chain │  │ WOD   │    │
│  └───────┘  └───────┘  └───────┘    │
│                                      │
│  LOCKED (8)                          │
│  ┌───────┐  ┌───────┐  ┌───────┐    │
│  │  🔒   │  │  🔒   │  │  🔒   │    │
│  │ 14-Day│  │ 21-Day│  │ Phase │    │
│  │ Chain │  │ Chain │  │ 1 Done│    │
│  └───────┘  └───────┘  └───────┘    │
│                                      │
└─────────────────────────────────────┘
```

---

## Rest Day Experience

### Rest Day Home Screen
```
┌──────────────────────────────────────┐
│  [≡]     THE DEN       [🔔] [⚙️]    │
│─────────────────────────────────────-│
│                                       │
│         ┌─────────────────┐           │
│         │   🐺 REST MODE   │           │
│         │   [Wolf sleeping │           │
│         │    animation]    │           │
│         └─────────────────┘           │
│                                       │
│  ┌────────────────────────────────┐   │
│  │  REST DAY                      │   │
│  │  ─────────────────────         │   │
│  │  Your system is recovering.    │   │
│  │  Next mission: Monday          │   │
│  └────────────────────────────────┘   │
│                                       │
│  ┌────────────────────────────────┐   │
│  │  📚 RECOVERY CONTENT           │   │
│  │                                │   │
│  │  • Why Rest Matters            │   │
│  │  • Hydration Tips              │   │
│  │  • Stretch Routine (optional)  │   │
│  └────────────────────────────────┘   │
│                                       │
│  ┌────────────────────────────────┐   │
│  │  📍 BEHIND? DO A CATCH-UP      │   │
│  │  [Start Bonus Workout]         │   │
│  └────────────────────────────────┘   │
│                                       │
└──────────────────────────────────────┘
```

---

## Error States

### Behind Schedule ("System Instability")

When user has missed days, we visualize as "System Instability" not "falling behind"

```
┌──────────────────────────────────────┐
│  [≡]     THE DEN       [🔔] [⚙️]    │
│─────────────────────────────────────-│
│                                       │
│  ⚠️ SYSTEM INSTABILITY DETECTED       │
│                                       │
│         ┌─────────────────┐           │
│         │   SPIDER CHART  │           │
│         │   [GLITCHING    │           │
│         │    ANIMATION]   │           │
│         └─────────────────┘           │
│                                       │
│  ┌────────────────────────────────┐   │
│  │  ⚠️ STABILIZATION REQUIRED     │   │
│  │                                │   │
│  │  Network integrity at 70%      │   │
│  │  2 missions needed to repair   │   │
│  │                                │   │
│  │  Your Wolf needs you.          │   │
│  │                                │   │
│  │     [🔧 REPAIR NETWORK]        │   │
│  │     (Start Mission 8)          │   │
│  └────────────────────────────────┘   │
│                                       │
└──────────────────────────────────────┘
```

**Behavior**:
- Spider chart has visual glitch effect
- Wolf looks concerned/wounded
- CTA changes to "Repair Network" instead of "Start Mission"
- User can do 2 workouts per day to catch up

### Mid-Workout Exit & Resume

**Checkpoint State (Within 15 minutes)**:
```
┌─────────────────────────────────────┐
│                                      │
│        🐺 CHECKPOINT SAVED           │
│                                      │
│  You left Mission 5 at Exercise 3    │
│  Time away: 8 minutes                │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │  [▶ RESUME MISSION]             │ │
│  │  Continue from Split Squat      │ │
│  │                                 │ │
│  │  [↺ START OVER]                 │ │
│  │  Begin fresh from Exercise 1    │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                      │
└─────────────────────────────────────┘
```

**Cold Restart Required (After 15 minutes)**:
```
┌─────────────────────────────────────┐
│                                      │
│        ⚠️ MUSCLES COOLED DOWN        │
│                                      │
│  You've been away for 47 minutes.    │
│  For safety, please restart warm.    │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │  [↺ RESTART MISSION]            │ │
│  │  Begin fresh (recommended)      │ │
│  │                                 │ │
│  │  [⚠️ RESUME ANYWAY]             │ │
│  │  I stretched and I'm warm       │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                      │
└─────────────────────────────────────┘
```

### Video Failure ("Schematic Mode")

Seamless degradation - workout continues uninterrupted

- Pre-cached thumbnail image displays
- Exercise name shown large
- Audio cues continue (voice countdown, coaching)
- Timer keeps running
- Small "Retry Video" button available

---

## Animations & Transitions

### Required Rive Animations

**Wolf States**:
1. `wolf_idle` - Natural breathing loop
2. `wolf_speaking` - Mouth moves, head nods
3. `wolf_entrance` - Materialize effect (scale/opacity pop)
4. `wolf_thinking` - Head tilt
5. `wolf_celebrate` - Howl celebration
6. `wolf_sleeping` - Rest day animation
7. `wolf_concerned` - System instability state

**Wolf Evolution States**:
1. `wolf_ghost` - Wireframe/hologram (Lvl 1-5)
2. `wolf_forming` - Low-poly/matte (Lvl 6-15)
3. `wolf_solid` - High-fidelity/textured (Lvl 16-29)
4. `wolf_radiant` - Emissive glow/particles (Lvl 30+)

**Effort Rating Faces**:
- 5 face states mapped to slider position

### CSS/Framer Motion Animations (MVP)

1. **Shard rain** - Particle system, shards fall from top
2. **Exercise dissolve** - Completed exercise "digitizes" with shard collection
3. **Timer pulse** - Gentle scale pulse on timer
4. **Neon ring progress** - SVG stroke-dashoffset animation
5. **Spider chart grow** - Smooth axis growth animation
6. **Glitch effect** - CSS filter + transform jitter for instability

### Sound Effects

1. Timer: 10s beep, 5s beep, 3-2-1 countdown
2. Exercise complete: Mechanical click
3. Workout complete: Wolf howl
4. Shard collect: Crystalline "ding"
5. Skip: Negative buzz
6. Rest start: Soft chime
7. Strike WOD start: Power-up sound

---

## Implementation Priority

### Phase 1 (MVP)
1. Home screen with Spider Chart (static)
2. Workout player with timer
3. Exercise queue with transitions
4. Basic completion screen
5. Safe Skip with 70% threshold

### Phase 2
1. Wolf animations (Rive integration)
2. Shard rain celebration
3. Spider chart growth animation
4. Strike WOD flow
5. Effort rating with wolf faces

### Phase 3
1. Contract signing flow
2. Voice sorting
3. TV Mode optimization
4. Schematic Mode fallback
5. System Instability styling
6. All sound effects

---

## Notes for Dev Team

1. **Timer must be reliable** - Use requestAnimationFrame or Web Worker, not setInterval
2. **Video preloading** - Preload next exercise video during current exercise
3. **Offline support** - Cache thumbnails and audio for Schematic Mode
4. **Accessibility** - Large touch targets (48px min), high contrast
5. **Analytics events** - Track: workout_start, exercise_complete, exercise_skip, workout_complete, strike_wod_complete, effort_rating

---

*Last updated: January 2026*
*Wolf Protocol v1.0*
