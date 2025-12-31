# YP Academy - Onboarding Flow

> **Status:** NOT IMPLEMENTED
> **Priority:** High (blocking user acquisition)
> **Intensity Budget:** 15 points per screen (Minor animations only)

---

## Overview

The onboarding flow handles two distinct user types:
1. **Athletes** (kids 8-18) - The primary users doing training programs
2. **Parents/Sponsors** - Account owners who pay and monitor progress

### Available Programs (Academies)

| Program | Duration | Focus | Status |
|---------|----------|-------|--------|
| **Barefoot Reset** | 42 days | Foot strength, durability, injury prevention | Active |
| **Foundations Basketball** | 30 days | Basketball fundamentals, footwork, shooting | Coming Soon |

---

## Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SPLASH SCREEN                            │
│                    (App Launch / Deep Link)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ROLE SELECTION                             │
│              "I'm an Athlete" / "I'm a Parent"                  │
└─────────────────────────────────────────────────────────────────┘
                    │                       │
                    ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROGRAM SELECTION                            │
│           "Choose Your Academy" (Barefoot / Basketball)         │
└─────────────────────────────────────────────────────────────────┘
                    │                       │
                    ▼                       ▼
          ┌─────────────────┐     ┌─────────────────────┐
          │  ATHLETE FLOW   │     │    PARENT FLOW      │
          └─────────────────┘     └─────────────────────┘
```

---

## Screen Inventory

### 1. Splash Screen
**File:** `src/components/screens/Splash.tsx`
**Purpose:** Brand moment + loading state
**Duration:** 2-3 seconds max

```
┌──────────────────────────────────┐
│                                  │
│                                  │
│            🐺                    │
│       BAREFOOT RESET             │
│                                  │
│      ────────────────            │
│         Loading...               │
│                                  │
└──────────────────────────────────┘
```

**Behavior:**
- Wolf logo fade in (0.5s)
- Title reveal with Bebas Neue font
- Subtle progress indicator
- Auto-advance when auth state resolved

---

### 2. Role Selection
**File:** `src/components/screens/RoleSelection.tsx`
**Purpose:** Route users to correct onboarding path

```
┌──────────────────────────────────┐
│                                  │
│      WHO'S JOINING THE PACK?     │
│                                  │
│   ┌────────────────────────┐     │
│   │  🐺  I'M AN ATHLETE    │     │
│   │  Start my 42-day reset │     │
│   └────────────────────────┘     │
│                                  │
│   ┌────────────────────────┐     │
│   │  👤  I'M A PARENT      │     │
│   │  Manage my athlete     │     │
│   └────────────────────────┘     │
│                                  │
│   Already have an account?       │
│           Sign In →              │
│                                  │
└──────────────────────────────────┘
```

**UX Notes:**
- Large tap targets (min 56px height)
- Wolf emoji for athlete option
- Clear distinction between paths
- Sign in link for returning users

---

### 3. Program Selection (Academy Picker)
**File:** `src/components/screens/ProgramSelection.tsx`
**Purpose:** Let users choose which training academy to join

```
┌──────────────────────────────────────┐
│                                      │
│       CHOOSE YOUR ACADEMY            │
│                                      │
│   ┌──────────────────────────────┐   │
│   │  🦶  BAREFOOT RESET          │   │
│   │                              │   │
│   │  42-Day Durability Program   │   │
│   │  Build unbreakable feet      │   │
│   │                              │   │
│   │  ✓ 15 min daily workouts     │   │
│   │  ✓ Wolf rank progression     │   │
│   │  ✓ Anime card rewards        │   │
│   │                              │   │
│   │        [START] →             │   │
│   └──────────────────────────────┘   │
│                                      │
│   ┌──────────────────────────────┐   │
│   │  🏀  FOUNDATIONS BASKETBALL  │   │
│   │                              │   │
│   │  30-Day Skills Program       │   │
│   │  Master the fundamentals     │   │
│   │                              │   │
│   │  ✓ Footwork & handles        │   │
│   │  ✓ Shooting mechanics        │   │
│   │  ✓ Game situation drills     │   │
│   │                              │   │
│   │     [COMING SOON] 🔒         │   │
│   └──────────────────────────────┘   │
│                                      │
│   More academies coming soon...      │
│                                      │
└──────────────────────────────────────┘
```

**Program Data Structure:**
```typescript
interface Program {
  id: string;
  name: string;
  slug: 'barefoot-reset' | 'foundations-basketball';
  icon: string;  // emoji or icon
  tagline: string;
  duration: number;  // days
  features: string[];
  status: 'active' | 'coming-soon' | 'locked';
  color: string;  // accent color
  mascot?: string;  // optional mascot/character
}

const PROGRAMS: Program[] = [
  {
    id: 'barefoot-reset',
    name: 'Barefoot Reset',
    slug: 'barefoot-reset',
    icon: '🦶',
    tagline: '42-Day Durability Program',
    duration: 42,
    features: [
      '15 min daily workouts',
      'Wolf rank progression',
      'Anime card rewards',
    ],
    status: 'active',
    color: '#00F6E0',  // cyan
  },
  {
    id: 'foundations-basketball',
    name: 'Foundations Basketball',
    slug: 'foundations-basketball',
    icon: '🏀',
    tagline: '30-Day Skills Program',
    duration: 30,
    features: [
      'Footwork & handles',
      'Shooting mechanics',
      'Game situation drills',
    ],
    status: 'coming-soon',
    color: '#FF6B35',  // orange
  },
];
```

**Behavior:**
- Active programs show "START" button
- Coming soon programs are grayed with lock icon
- Deep links can pre-select a program
- Selection stored in onboarding state
- Determines which curriculum path to follow

**Future Programs (Roadmap):**
- Foundations Soccer
- Speed & Agility
- Vertical Jump
- Recovery & Mobility

---

## Athlete Onboarding Flow

### A1. Athlete Welcome
**File:** `src/components/screens/onboarding/AthleteWelcome.tsx`

```
┌──────────────────────────────────┐
│                                  │
│           🐺                     │
│    WELCOME TO THE PACK           │
│                                  │
│    42 days to build              │
│    unbreakable feet              │
│                                  │
│    • Earn XP every workout       │
│    • Collect wolf cards          │
│    • Rise through the ranks      │
│                                  │
│   ┌────────────────────────┐     │
│   │     LET'S GO →         │     │
│   └────────────────────────┘     │
│                                  │
└──────────────────────────────────┘
```

---

### A2. Parent Code Entry
**File:** `src/components/screens/onboarding/ParentCodeEntry.tsx`
**Purpose:** Link athlete to parent account (COPPA compliance)

```
┌──────────────────────────────────┐
│                                  │
│  ← Back                          │
│                                  │
│      ENTER YOUR PACK CODE        │
│                                  │
│    Ask your parent for the       │
│    6-digit code from their app   │
│                                  │
│   ┌─┬─┬─┬─┬─┬─┐                  │
│   │ │ │ │ │ │ │                  │
│   └─┴─┴─┴─┴─┴─┘                  │
│                                  │
│   Don't have a code?             │
│   Parent needs to sign up first  │
│                                  │
└──────────────────────────────────┘
```

**Behavior:**
- Auto-advance on 6 digits entered
- Haptic feedback on each digit
- Error shake if invalid code
- Link to parent signup flow

---

### A3. Athlete Profile Setup
**File:** `src/components/screens/onboarding/AthleteProfile.tsx`

```
┌──────────────────────────────────┐
│                                  │
│  ← Back                          │
│                                  │
│      WHAT'S YOUR NAME?           │
│                                  │
│   ┌────────────────────────┐     │
│   │ First name             │     │
│   └────────────────────────┘     │
│                                  │
│      HOW OLD ARE YOU?            │
│                                  │
│   ┌────────────────────────┐     │
│   │ 8  9  10 11 12 13 ... │     │
│   └────────────────────────┘     │
│                                  │
│   ┌────────────────────────┐     │
│   │     CONTINUE →         │     │
│   └────────────────────────┘     │
│                                  │
└──────────────────────────────────┘
```

**Fields:**
- First name (required, 2-20 chars)
- Age (picker: 8-18)
- Optional: Sport/activity

---

### A4. Avatar Selection (Wolf Customization)
**File:** `src/components/screens/onboarding/AvatarSelect.tsx`

```
┌──────────────────────────────────┐
│                                  │
│  ← Back                          │
│                                  │
│      CHOOSE YOUR WOLF            │
│                                  │
│      ┌─────────────┐             │
│      │     🐺      │             │
│      │   (large)   │             │
│      └─────────────┘             │
│                                  │
│   Color:                         │
│   ⚫ ⚪ 🟤 ⬛ (selection)        │
│                                  │
│   More wolves unlock as you      │
│   rank up!                       │
│                                  │
│   ┌────────────────────────┐     │
│   │     CONTINUE →         │     │
│   └────────────────────────┘     │
│                                  │
└──────────────────────────────────┘
```

**Notes:**
- Start with 4 basic colors
- Premium wolves locked (show grayed)
- Preview animation on selection

---

### A5. Notifications Permission
**File:** `src/components/screens/onboarding/NotificationPermission.tsx`

```
┌──────────────────────────────────┐
│                                  │
│                                  │
│            🔔                    │
│                                  │
│    STAY ON YOUR STREAK           │
│                                  │
│    Get daily reminders to        │
│    keep your streak alive        │
│                                  │
│   ┌────────────────────────┐     │
│   │   ENABLE NOTIFICATIONS │     │
│   └────────────────────────┘     │
│                                  │
│         Maybe later              │
│                                  │
└──────────────────────────────────┘
```

**Behavior:**
- Request push notification permission
- "Maybe later" skips without penalty
- Store preference for later prompt

---

### A6. Ready Screen
**File:** `src/components/screens/onboarding/AthleteReady.tsx`

```
┌──────────────────────────────────┐
│                                  │
│            🐺                    │
│         MARCUS                   │
│                                  │
│      YOU'RE A PUP                │
│      Day 1 of 42                 │
│                                  │
│    ┌────────────────────┐        │
│    │      0 XP          │        │
│    └────────────────────┘        │
│                                  │
│    Your journey begins now.      │
│    Complete Day 1 to earn        │
│    your first XP!                │
│                                  │
│   ┌────────────────────────┐     │
│   │   START DAY 1 →        │     │
│   └────────────────────────┘     │
│                                  │
└──────────────────────────────────┘
```

**Transition:**
- Button pulses subtly
- Tap → navigate to AthleteDashboard
- Mark onboarding complete in state

---

## Parent Onboarding Flow

### P1. Parent Welcome
**File:** `src/components/screens/onboarding/ParentWelcome.tsx`

```
┌──────────────────────────────────┐
│                                  │
│    BAREFOOT RESET                │
│    Parent Portal                 │
│                                  │
│    Track your athlete's          │
│    progress through their        │
│    42-day durability program     │
│                                  │
│    ✓ Monitor completion          │
│    ✓ View safety flags           │
│    ✓ Weekly progress reports     │
│                                  │
│   ┌────────────────────────┐     │
│   │     GET STARTED →      │     │
│   └────────────────────────┘     │
│                                  │
└──────────────────────────────────┘
```

**Theme:** Uses Parent "Sponsor Report" light theme

---

### P2. Parent Account Creation
**File:** `src/components/screens/onboarding/ParentSignup.tsx`

```
┌──────────────────────────────────┐
│                                  │
│  ← Back                          │
│                                  │
│      CREATE YOUR ACCOUNT         │
│                                  │
│   ┌────────────────────────┐     │
│   │ Email                  │     │
│   └────────────────────────┘     │
│   ┌────────────────────────┐     │
│   │ Password               │     │
│   └────────────────────────┘     │
│   ┌────────────────────────┐     │
│   │ Confirm Password       │     │
│   └────────────────────────┘     │
│                                  │
│   ┌────────────────────────┐     │
│   │     CONTINUE →         │     │
│   └────────────────────────┘     │
│                                  │
│   ─────── or ───────             │
│                                  │
│   [G] Continue with Google       │
│   [A] Continue with Apple        │
│                                  │
└──────────────────────────────────┘
```

**Validation:**
- Email format validation
- Password: min 8 chars
- Real-time feedback

---

### P3. Subscription Selection
**File:** `src/components/screens/onboarding/SubscriptionSelect.tsx`

```
┌──────────────────────────────────┐
│                                  │
│  ← Back                          │
│                                  │
│      CHOOSE YOUR PLAN            │
│                                  │
│   ┌────────────────────────┐     │
│   │  MONTHLY               │     │
│   │  $9.99/month           │     │
│   │  Cancel anytime        │     │
│   └────────────────────────┘     │
│                                  │
│   ┌────────────────────────┐     │
│   │  ANNUAL ⭐ BEST VALUE  │     │
│   │  $79.99/year           │     │
│   │  Save 33%              │     │
│   │  + 3 athlete slots     │     │
│   └────────────────────────┘     │
│                                  │
│   7-day free trial included      │
│                                  │
└──────────────────────────────────┘
```

---

### P4. Add First Athlete
**File:** `src/components/screens/onboarding/AddAthlete.tsx`

```
┌──────────────────────────────────┐
│                                  │
│  ← Back                          │
│                                  │
│      ADD YOUR ATHLETE            │
│                                  │
│   ┌────────────────────────┐     │
│   │ Athlete's first name   │     │
│   └────────────────────────┘     │
│                                  │
│      SHARE THIS CODE             │
│                                  │
│      ┌─────────────────┐         │
│      │    A7X 9K2      │  📋     │
│      └─────────────────┘         │
│                                  │
│    Your athlete enters this      │
│    code in their app to link     │
│    to your account               │
│                                  │
│   ┌────────────────────────┐     │
│   │     DONE →             │     │
│   └────────────────────────┘     │
│                                  │
└──────────────────────────────────┘
```

**Features:**
- Generate unique 6-char code
- Copy to clipboard button
- Share via SMS/email option
- Code expires in 48 hours

---

### P5. Parent Ready
**File:** `src/components/screens/onboarding/ParentReady.tsx`

```
┌──────────────────────────────────┐
│                                  │
│            ✓                     │
│                                  │
│      YOU'RE ALL SET              │
│                                  │
│    Once Marcus joins with        │
│    their code, you'll see        │
│    their progress here           │
│                                  │
│    ┌────────────────────┐        │
│    │  Waiting for        │       │
│    │  athlete to join... │       │
│    └────────────────────┘        │
│                                  │
│   ┌────────────────────────┐     │
│   │   GO TO DASHBOARD →    │     │
│   └────────────────────────┘     │
│                                  │
└──────────────────────────────────┘
```

---

## Sign In Flow (Returning Users)

### SignIn Screen
**File:** `src/components/screens/auth/SignIn.tsx`

```
┌──────────────────────────────────┐
│                                  │
│  ← Back                          │
│                                  │
│      WELCOME BACK                │
│                                  │
│   ┌────────────────────────┐     │
│   │ Email                  │     │
│   └────────────────────────┘     │
│   ┌────────────────────────┐     │
│   │ Password               │     │
│   └────────────────────────┘     │
│                                  │
│   Forgot password?               │
│                                  │
│   ┌────────────────────────┐     │
│   │     SIGN IN →          │     │
│   └────────────────────────┘     │
│                                  │
│   ─────── or ───────             │
│                                  │
│   [G] Continue with Google       │
│   [A] Continue with Apple        │
│                                  │
└──────────────────────────────────┘
```

---

## State Management

### Onboarding State
```typescript
interface OnboardingState {
  step: number;
  role: 'athlete' | 'parent' | null;

  // Program selection
  selectedProgram: 'barefoot-reset' | 'foundations-basketball' | null;

  // Athlete fields
  athleteName: string;
  athleteAge: number;
  avatarColor: string;
  parentCode: string;

  // Parent fields
  email: string;
  subscription: 'monthly' | 'annual' | null;
  athleteCodes: string[];

  // Completion
  notificationsEnabled: boolean;
  onboardingComplete: boolean;
}
```

### Persistence
- Store partial state in AsyncStorage
- Resume if user exits mid-flow
- Clear on successful completion

---

## Deep Links

| Link | Destination |
|------|-------------|
| `barefoot://join?code=ABC123` | Athlete code entry with pre-fill |
| `barefoot://signup/athlete` | Athlete welcome screen |
| `barefoot://signup/parent` | Parent welcome screen |
| `barefoot://login` | Sign in screen |

---

## Analytics Events

| Event | Trigger |
|-------|---------|
| `onboarding_started` | Role selection viewed |
| `role_selected` | Athlete/Parent chosen |
| `athlete_code_entered` | Valid code submitted |
| `profile_completed` | Name/age submitted |
| `avatar_selected` | Wolf customization done |
| `notifications_prompted` | Permission screen shown |
| `notifications_enabled` | Permission granted |
| `onboarding_completed` | Ready screen CTA tapped |
| `onboarding_abandoned` | Exit before completion |

---

## Error States

### Invalid Parent Code
```
"Hmm, that code didn't work.
Double-check with your parent
and try again."

[TRY AGAIN]
```

### Email Already Exists
```
"This email is already registered.
Try signing in instead."

[SIGN IN]  [USE DIFFERENT EMAIL]
```

### Network Error
```
"Can't connect right now.
Check your internet and try again."

[RETRY]
```

---

## Implementation Checklist

- [ ] Splash screen
- [ ] Role selection
- [ ] **Program selection (Academy picker)**
- [ ] Athlete: Welcome
- [ ] Athlete: Parent code entry
- [ ] Athlete: Profile setup
- [ ] Athlete: Avatar selection
- [ ] Athlete: Notification permission
- [ ] Athlete: Ready screen
- [ ] Parent: Welcome
- [ ] Parent: Account creation
- [ ] Parent: Subscription selection
- [ ] Parent: Add athlete (code generation)
- [ ] Parent: Ready screen
- [ ] Sign in screen
- [ ] Forgot password flow
- [ ] Deep link handling
- [ ] Analytics integration
- [ ] Error states
- [ ] Loading states
- [ ] Accessibility audit

---

## Related Files

- `src/contexts/AuthContext.tsx` - Auth state management
- `src/contexts/OnboardingContext.tsx` - Onboarding state
- `src/lib/supabase.ts` - Auth provider
- `src/hooks/useOnboarding.ts` - Onboarding logic

---

*Last updated: Dec 28, 2024*
