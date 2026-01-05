# YP Onboarding Flow Documentation

> Complete reference for all onboarding questions across YP properties.

---

## Overview

| Flow | App | Purpose | Questions |
|------|-----|---------|-----------|
| Movement Check Quiz | Marketing | Assess athlete movement patterns | 6 |
| Athlete Onboarding | Web Academy | Register & personalize athlete | 5 steps |
| Profile Settings | Marketing | Parent configuration | 4 fields |

---

## 1. Movement Check Quiz (Marketing)

**Route:** `/quiz/athlete-type`
**File:** `apps/marketing/src/pages/Quiz.jsx`
**Purpose:** Diagnose movement dysfunction patterns to create personalized training recommendations.

### Question 1: Foot Fatigue
> **"How do your feet feel after standing or walking for a while?"**

| Option | Value |
|--------|-------|
| Fine, no issues | `fine` |
| Tired or achy | `tired` |
| Tight or stiff | `tight` |
| Inconsistent - varies day to day | `inconsistent` |

---

### Question 2: Landing Quality
> **"When you land from a jump, what do you notice?"**

| Option | Value |
|--------|-------|
| Soft and quiet | `soft` |
| Loud and heavy | `loud` |
| Wobbly or unstable | `wobbly` |
| I don't really pay attention | `unaware` |

---

### Question 3: Explosiveness
> **"How would you describe your explosiveness?"**

| Option | Value |
|--------|-------|
| I feel bouncy and springy | `springy` |
| Strong but not springy | `strong` |
| Explosive early, then I fade | `fades` |
| It's inconsistent | `inconsistent` |

---

### Question 4: Direction Change
> **"When cutting or changing direction, what happens?"**

| Option | Value |
|--------|-------|
| Smooth and sharp | `sharp` |
| I feel like I lose power | `power_loss` |
| Slow to get going again | `slow_recovery` |
| Sometimes good, sometimes not | `inconsistent` |

---

### Question 5: Post-Activity Symptoms
> **"Do you experience any of these after intense activity?"**

| Option | Value |
|--------|-------|
| Nothing unusual | `none` |
| Shin or knee discomfort | `shin_knee` |
| Ankle instability or rolling | `ankle` |
| General tightness everywhere | `tightness` |

---

### Question 6: Recovery State
> **"How does your body feel at the end of a practice or game?"**

| Option | Value |
|--------|-------|
| Tired but good | `good` |
| More beat up than I should be | `beat_up` |
| Feels like I worked harder than I actually did | `overworked` |
| Depends on the day | `variable` |

---

### Quiz Result Categories

Based on answer patterns, athletes are categorized into:

| Category | Description | Primary Focus |
|----------|-------------|---------------|
| **Force Leaker** | Power dissipates through weak foundation | Arch strengthening, tripod activation |
| **Elasticity Block** | Missing spring mechanics | Tendon loading, plyometric prep |
| **Absorption Deficit** | Poor landing/deceleration | Eccentric control, quiet landings |
| **Control Gap** | Inconsistent stability | Proprioception, balance training |

---

## 2. Athlete Onboarding (Web Academy)

**Route:** `/onboarding/*`
**Files:** `apps/web-academy/src/components/screens/onboarding/`
**Purpose:** Register athlete, collect profile data, assign to Foundation Program.

### Step 1: Role Selection
**Route:** `/role`
**Component:** `RoleSelection.tsx`

> **"Who's joining the pack?"**

| Option | Status | Action |
|--------|--------|--------|
| I'M AN ATHLETE | Active | Continue to profile |
| I'M A PARENT | Disabled | Coming soon |

---

### Step 2: Athlete Profile
**Route:** `/athlete-info`
**Component:** `AthleteProfile.tsx`

#### 2a. Name Input
> **"What's your name?"**

| Field | Validation |
|-------|------------|
| `athleteName` | Min 2 chars, Max 20 chars, Required |

#### 2b. Age Selection
> **"How old are you?"**

| Options | Type |
|---------|------|
| 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 | Button grid |

#### 2c. Sports Selection (Optional)
> **"Favorite Sports"** *(Multi-select, max 8)*

| Sport | Emoji |
|-------|-------|
| Basketball | 🏀 |
| Soccer | ⚽ |
| Football | 🏈 |
| Baseball | ⚾ |
| Volleyball | 🏐 |
| Track & Field | 🏃 |
| Tennis | 🎾 |
| Other | 🏅 |

---

### Step 3: Parent Code (COPPA Compliance)
**Route:** `/code`
**Component:** `ParentCodeEntry.tsx`

> **"Enter Your Pack Code"**
> *"Ask your parent for the 6-digit code from their app"*

| Field | Format | Validation |
|-------|--------|------------|
| `parentCode` | 6 alphanumeric characters | Required for under-13 |

**On Success:** Displays sponsor name (parent who generated code)

---

### Step 4: Avatar Selection
**Route:** `/avatar`
**Component:** `AvatarSelect.tsx`

> **"Choose Your Wolf"**
> *"This is your pack identity"*

#### Available Colors
| Color | Name | Status |
|-------|------|--------|
| ⬛ | Shadow | Available |
| ⬜ | Ghost | Available |
| 🔘 | Steel | Available |
| 🟤 | Earth | Available |

#### Locked Colors (Unlock with Rank)
| Color | Name | Unlock At |
|-------|------|-----------|
| 🔵 | Cyber | Hunter Rank |
| 🔴 | Fire | Alpha Rank |
| 🟡 | Gold | Apex Rank |

---

### Step 5: Ready Confirmation
**Route:** `/ready`
**Component:** `AthleteReady.tsx`

> **"Are you ready to start?"**

**On Confirm:**
1. Creates user in Convex database
2. Assigns Foundation Program (42 days)
3. Clears onboarding state
4. Redirects to `/home`

---

## 3. Profile Settings (Marketing - Parent View)

**Route:** `/settings`
**File:** `apps/marketing/src/pages/Settings.jsx`
**Purpose:** Parent configuration for personalized training experience.

### Field 1: Child's Nickname
> **"Child's Nickname"**

| Type | Use |
|------|-----|
| Text input | Personalizes Wolf coach responses |

---

### Field 2: Age Group
> **"Age Group"**

| Option | Value |
|--------|-------|
| Under 8 | `under_8` |
| 8-12 years | `8_12` |
| 13+ years | `13_plus` |

---

### Field 3: Training Space
> **"Training Space"**

| Option | Affects |
|--------|---------|
| Apartment | No-equipment, quiet exercises |
| Driveway / Backyard | Outdoor mobility work |
| Gym / Court | Full equipment access |
| Field | Sport-specific drills |

---

### Field 4: Current Pain/Discomfort
> **"Current Pain/Discomfort"**

| Option | Program Modification |
|--------|----------------------|
| No pain | Standard progression |
| Foot / Ankle | Lower intensity, more mobility |
| Knee / Hip / Back | Modified loading patterns |
| Not sure | Conservative approach |

---

## 4. Interest Pills / Goals

**File:** `apps/marketing/src/config/interestPills.js`
**Purpose:** Goal selection for personalized content curation.

### Durability & Control
- Stop rolling ankles
- Better balance
- Quieter landings
- Stronger feet + calves

### Game Speed
- Faster first step
- Quicker cuts
- Better stopping

### Strength & Power
- Jump higher (safe)

### Comfort & Constraints
- Apartment-friendly
- Coming back carefully
- Reduce soreness
- Build a routine

### Basketball-Specific *(if sport selected)*
- Better footwork
- Better handles
- More consistent shooting
- Quicker defense slides

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     ONBOARDING DATA FLOW                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Marketing Quiz ──► Quiz Results ──► Recommended Program     │
│        │                                    │                │
│        ▼                                    ▼                │
│  Settings Form ──────────────────► Personalization Layer     │
│                                             │                │
│  Web Academy ──► Athlete Profile ──► Convex Database         │
│        │                │                   │                │
│        ▼                ▼                   ▼                │
│  Parent Code ──► Link Athlete ──► Foundation Program         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Convex)

### Users Table
```typescript
{
  clerkId: string,
  email: string,
  name: string,
  age: number,
  sports: string[],
  avatarColor: string,
  parentCode?: string,
  sponsorId?: string,
  tier: 'free' | 'pro' | 'elite',
  onboardingComplete: boolean,
  createdAt: number
}
```

### Quiz Results (LocalStorage)
```typescript
{
  answers: string[],
  resultType: 'force_leaker' | 'elasticity_block' | 'absorption_deficit' | 'control_gap',
  completedAt: string
}
```

---

## Future Additions

- [ ] Parent onboarding flow (I'M A PARENT option)
- [ ] Coach/trainer onboarding
- [ ] Team registration flow
- [ ] Injury history intake
- [ ] Movement video assessment
- [ ] Equipment inventory check

---

*Last updated: January 2026*
