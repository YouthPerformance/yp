# Barefoot App + YP Academy Integration Plan

## Executive Summary

Combine the **barefoot-app** onboarding flow with the **yp-academy** main app experience to create a unified athlete journey from first launch to daily training.

---

## Current State Analysis

### barefoot-app (Onboarding)
```
src/app/
├── layout.tsx              # Root layout + ThemeProvider
├── page.tsx                # Entry point
└── onboarding/
    └── page.tsx            # Onboarding flow controller

src/components/screens/onboarding/
├── RoleSelection.tsx       # Athlete vs Parent
├── AthleteProfile.tsx      # Name, age, sports (multi-select)
├── ParentCodeEntry.tsx     # 6-digit code validation
├── AvatarSelection.tsx     # Wolf color picker
└── AthleteReady.tsx        # Launch screen

src/contexts/
├── OnboardingContext.tsx   # Onboarding state + localStorage
└── ThemeContext.tsx        # Dark theme
```

### yp-academy (Main App)
```
src/app/
├── (auth)/login, signup
├── (main)/
│   ├── layout.tsx          # BottomNav wrapper
│   ├── home/               # Dashboard
│   ├── workout/            # Trophy road + player
│   ├── playbook/           # Content library
│   ├── ask-wolf/           # AI assistant
│   ├── shop/               # Crystal store
│   ├── profile/            # User settings
│   └── cards/              # Anime card collection
└── (onboarding)/quiz, welcome

src/components/
├── dashboard/
│   ├── LockerRoomHeader.tsx
│   ├── StatsBar.tsx
│   ├── TodaysMission.tsx
│   └── AcademyLockers.tsx
├── navigation/
│   └── BottomNav.tsx
└── video/
    └── DailyWorkoutPlayer.tsx

src/hooks/
├── useGamification.ts      # XP, ranks, achievements
├── useStreak.ts            # Daily streak tracking
└── useBadges.ts            # Badge collection

src/contexts/
├── AuthContext.tsx         # Authentication
└── (uses Convex for data)
```

---

## Target Architecture

### Route Structure
```
src/app/
├── layout.tsx              # Root: fonts, metadata, providers
├── page.tsx                # Smart router (onboarding vs home)
│
├── (onboarding)/           # Pre-auth flow
│   ├── layout.tsx          # No nav, OnboardingProvider
│   ├── role/               # Athlete vs Parent
│   ├── profile/            # Name, age, sports
│   ├── code/               # Parent code entry
│   ├── avatar/             # Wolf selection
│   └── ready/              # Launch screen
│
├── (auth)/                 # Auth screens (future)
│   ├── login/
│   └── signup/
│
└── (main)/                 # Authenticated app
    ├── layout.tsx          # BottomNav + providers
    ├── home/               # Dashboard (TodaysMission + Lockers)
    ├── workout/            # Trophy road + player
    ├── playbook/           # Content library
    ├── ask-wolf/           # AI assistant
    ├── shop/               # Crystal store
    ├── profile/            # Settings + HunterCard
    └── cards/              # Anime collection
```

### State Management
```
Root Layout
├── ThemeProvider
├── HapticsProvider
└── AuthProvider (new)
    ├── OnboardingProvider (for onboarding routes)
    └── UserProvider (for main routes)
        ├── useGamification
        ├── useStreak
        └── useBadges
```

---

## Migration Tasks

### Phase 1: Route Groups Setup
1. Create `(onboarding)` route group
   - Move onboarding screens to individual pages
   - Add layout with OnboardingProvider
   - Remove BottomNav

2. Create `(main)` route group
   - Add layout with BottomNav
   - Migrate home page from yp-academy

3. Update root `page.tsx`
   - Check if onboarding complete
   - Redirect to `/home` or `/role`

### Phase 2: Component Migration
From yp-academy to barefoot-app:

| Component | Priority | Notes |
|-----------|----------|-------|
| `BottomNav` | P0 | Core navigation |
| `TodaysMission` | P0 | Dashboard CTA |
| `LockerRoomHeader` | P0 | Dashboard header |
| `StatsBar` | P0 | XP, streak, crystals |
| `AcademyLockers` | P1 | Program cards |
| `DailyWorkoutPlayer` | P1 | Video player |
| `ProgressBar` | P1 | UI component |
| `Button` | P2 | Already have similar |
| `Card` | P2 | Already have similar |

### Phase 3: State Integration
1. **Merge User Data Models**
   ```typescript
   // Combined user state
   interface User {
     // From OnboardingContext
     athleteName: string;
     athleteAge: number;
     avatarColor: WolfColor;
     sports: string[];
     parentCode: string;
     sponsorName: string;

     // From yp-academy
     xpTotal: number;
     streakCurrent: number;
     streakBest: number;
     rank: Rank;
     crystals: number;
     currentDay: number;

     // Subscription
     subscriptionStatus: 'free' | 'pro';
   }
   ```

2. **Create UserContext**
   - Wraps authenticated main app
   - Merges onboarding data with ongoing progress
   - Syncs to Supabase (not Convex)

3. **AuthContext**
   - Anonymous auth for athletes (code-based)
   - Email auth for parents
   - Session persistence

### Phase 4: Onboarding Transition
```
RoleSelection → AthleteProfile → ParentCodeEntry → AvatarSelection → AthleteReady
                                                                            ↓
                                                                   [CREATE USER]
                                                                            ↓
                                                                   /home (Dashboard)
```

Key transition logic:
```typescript
// In AthleteReady.tsx
const handleStart = async () => {
  // 1. Complete onboarding
  await completeOnboarding();

  // 2. Create user in Supabase
  await createUser({
    name: data.athleteName,
    age: data.athleteAge,
    avatarColor: data.avatarColor,
    sports: data.sports,
    parentCode: data.parentCode,
    programId: data.programId, // 'foundation_42_day'
    subscriptionStatus: 'free',
    // Initialize gamification
    xpTotal: 0,
    streakCurrent: 0,
    currentDay: 1,
    rank: 'pup',
  });

  // 3. Navigate to main app
  router.push('/home');
};
```

---

## Subscription Gating

### Free Tier
- Dashboard visible (TodaysMission teased)
- Day 1 workout unlocked
- Cards collection (view only)
- Profile page
- Shop (view only)

### Pro Tier ($88)
- All 42 workouts unlocked
- Ask Wolf AI assistant
- Full card collection
- Crystal earning
- Playbook content

### Implementation
```typescript
// In TodaysMission.tsx
<TodaysMission
  isLocked={subscriptionStatus === 'free' && currentDay > 1}
  onLockedClick={() => setShowUpsellModal(true)}
/>

// In BottomNav.tsx
const lockedTabs = subscriptionStatus === 'free'
  ? ['ask-wolf', 'playbook']
  : [];
```

---

## File Mapping

### Create New
```
src/app/(onboarding)/layout.tsx
src/app/(onboarding)/role/page.tsx
src/app/(onboarding)/profile/page.tsx
src/app/(onboarding)/code/page.tsx
src/app/(onboarding)/avatar/page.tsx
src/app/(onboarding)/ready/page.tsx
src/app/(main)/layout.tsx
src/app/(main)/home/page.tsx
src/app/(main)/workout/page.tsx
src/app/(main)/workout/player/page.tsx
src/contexts/AuthContext.tsx
src/contexts/UserContext.tsx
```

### Migrate from yp-academy
```
src/components/navigation/BottomNav.tsx
src/components/dashboard/LockerRoomHeader.tsx
src/components/dashboard/StatsBar.tsx
src/components/dashboard/TodaysMission.tsx
src/components/dashboard/AcademyLockers.tsx
src/components/video/DailyWorkoutPlayer.tsx
src/hooks/useGamification.ts
src/hooks/useStreak.ts
```

### Keep from barefoot-app
```
src/components/screens/onboarding/* (adapt to pages)
src/components/modals/UpsellModal.tsx
src/components/dashboard/WorkoutCard.tsx
src/contexts/OnboardingContext.tsx
src/contexts/ThemeContext.tsx
src/hooks/useHaptics.ts
```

---

## Navigation Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        APP LAUNCH                              │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Check Onboarding │
                    │    Complete?     │
                    └─────────────────┘
                     │              │
                    NO             YES
                     │              │
                     ▼              ▼
           ┌─────────────┐   ┌─────────────┐
           │  /role      │   │   /home     │
           │ (Onboarding)│   │ (Dashboard) │
           └─────────────┘   └─────────────┘
                 │                  │
                 ▼                  ▼
           ┌─────────────┐   ┌─────────────────────────────────┐
           │  /profile   │   │          MAIN APP               │
           └─────────────┘   │  ┌───────┬───────┬───────────┐  │
                 │           │  │ Home  │Workout│  Profile  │  │
                 ▼           │  ├───────┼───────┼───────────┤  │
           ┌─────────────┐   │  │Playbook│ Shop │ Ask Wolf  │  │
           │  /code      │   │  └───────┴───────┴───────────┘  │
           └─────────────┘   └─────────────────────────────────┘
                 │
                 ▼
           ┌─────────────┐
           │  /avatar    │
           └─────────────┘
                 │
                 ▼
           ┌─────────────┐
           │  /ready     │──────────────────┐
           └─────────────┘                  │
                                            ▼
                                      ┌───────────┐
                                      │  /home    │
                                      │(Dashboard)│
                                      └───────────┘
```

---

## Implementation Order

1. **Restructure routes** - Create route groups, move files
2. **Add BottomNav** - Migrate and integrate
3. **Build home dashboard** - Combine components
4. **Wire up subscription gating** - UpsellModal + locks
5. **Add gamification hooks** - XP, streaks, ranks
6. **Build workout player** - Video + quizzes
7. **Remaining pages** - Playbook, Shop, Cards, Ask Wolf

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend | **Convex** | Real-time updates, already set up in yp-academy |
| Auth | Convex Auth | Code-based for athletes, email for parents |
| Video | Mux | Already have account, HLS streaming |
| State | Context + Convex | Real-time sync, optimistic updates |
| CSS | Tailwind + CSS vars | Keep existing design token system |
| Parent UX | **Same app, role toggle** | Single codebase, unified experience |
| Scope | **Full migration** | All components in one pass |

---

## Remaining Questions

1. **Offline Support** - Service worker caching for workouts?
2. **Push Notifications** - FCM for streak reminders?
3. **Analytics** - Amplitude, Mixpanel, or PostHog?
