# Barefoot App - Linear Tickets

> **Sprint:** Onboarding MVP
> **Created:** Dec 28, 2024
> **Source:** UX Walkthrough Gap Analysis

---

## BLOCKER TICKETS

### BFR-001: Stripe Payment Integration
**Priority:** Blocker | **Estimate:** 5 points | **Labels:** `backend`, `payments`

**Description:**
SubscriptionSelect.tsx displays pricing but has no payment processing.

**Acceptance Criteria:**
- [ ] Stripe SDK integrated
- [ ] Payment intent created on plan selection
- [ ] Credit card element in SubscriptionSelect.tsx
- [ ] 7-day trial activation logic
- [ ] Webhook handler for subscription events
- [ ] subscriptionStatus updated on successful payment

**Files to modify:**
- `src/components/screens/onboarding/SubscriptionSelect.tsx`
- `src/contexts/OnboardingContext.tsx`
- NEW: `src/lib/stripe.ts`
- NEW: `app/api/webhooks/stripe/route.ts`

**Technical Notes:**
```typescript
// Required env vars
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_MONTHLY=
STRIPE_PRICE_ANNUAL=
```

---

### BFR-002: Supabase Authentication
**Priority:** Blocker | **Estimate:** 3 points | **Labels:** `backend`, `auth`

**Description:**
ParentSignup.tsx has email/password UI but auth is mocked. OAuth buttons non-functional.

**Acceptance Criteria:**
- [ ] Supabase auth client configured
- [ ] Email/password signup working
- [ ] Google OAuth working
- [ ] Apple OAuth working
- [ ] Session persistence
- [ ] Auth state in context
- [ ] Protected route wrapper

**Files to modify:**
- `src/components/screens/onboarding/ParentSignup.tsx` (lines 63, 72)
- `src/contexts/OnboardingContext.tsx` (line 220)
- NEW: `src/lib/supabase.ts`
- NEW: `src/contexts/AuthContext.tsx`

**Technical Notes:**
```sql
-- Supabase schema
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('parent', 'athlete')),
  subscription_status TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### BFR-010: Parent Unlock Purchase Flow
**Priority:** Blocker | **Estimate:** 8 points | **Labels:** `frontend`, `payments`, `backend`

**Description:**
When athlete hits paywall, parent needs to receive notification and complete $88 purchase.

**Acceptance Criteria:**
- [ ] Athlete paywall triggers parent notification
- [ ] Parent dashboard shows "Unlock Request" alert
- [ ] $88 upsell modal with value proposition
- [ ] Apple Pay / Stripe payment sheet
- [ ] Real-time unlock on payment success
- [ ] Athlete receives "ACCESS GRANTED" animation

**Flow:**
```
Athlete → Paywall → "Ask Sponsor" → Parent Notified →
Parent → Dashboard Alert → Upsell Modal → Payment →
Success Webhook → Update subscriptionStatus →
Athlete → EpicUnlockSequence → Day 1
```

**Files to create:**
- NEW: `src/components/modals/UnlockRequestModal.tsx`
- NEW: `src/components/modals/ParentUpsellModal.tsx`
- NEW: `src/components/screens/onboarding/EpicUnlockSequence.tsx`

---

## HIGH PRIORITY TICKETS

### BFR-003: Pack Code Database Storage
**Priority:** High | **Estimate:** 3 points | **Labels:** `backend`

**Description:**
Pack codes are generated locally and stored in localStorage. Need database persistence with expiry.

**Acceptance Criteria:**
- [ ] `athlete_codes` table in Supabase
- [ ] Code stored on generation with 48h expiry
- [ ] Code validated against DB (not mock)
- [ ] Code marked as "used" on athlete link
- [ ] Parent ID returned on validation for sponsor display

**Schema:**
```sql
CREATE TABLE athlete_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code CHAR(6) NOT NULL UNIQUE,
  parent_id UUID REFERENCES profiles(id),
  athlete_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '48 hours',
  used_at TIMESTAMPTZ,
  used_by UUID REFERENCES profiles(id)
);
```

**Files to modify:**
- `src/contexts/OnboardingContext.tsx` (lines 181-196)
- `src/components/screens/onboarding/AddAthlete.tsx`

---

### BFR-006: Content Gating System
**Priority:** High | **Estimate:** 5 points | **Labels:** `frontend`, `logic`

**Description:**
`subscriptionStatus` exists in context but isn't enforced anywhere. Need paywall component.

**Acceptance Criteria:**
- [ ] AthleteDashboard checks `subscriptionStatus`
- [ ] "Day 1" card shows lock if status = 'free'
- [ ] Clicking locked content shows PaywallModal
- [ ] PaywallModal has "Ask Sponsor to Unlock" CTA
- [ ] Sponsor notification triggered on CTA click

**Files to modify:**
- `src/components/screens/AthleteDashboard.tsx`
- NEW: `src/components/modals/PaywallModal.tsx`

**Design:**
```
┌─────────────────────────────────────┐
│                                     │
│         🔒 PRO CONTENT              │
│                                     │
│    Day 1: Diagnostic Scan           │
│                                     │
│    Unlock the 42-Day Reset          │
│    to access this workout           │
│                                     │
│   ┌───────────────────────────┐     │
│   │   ASK SPONSOR TO UNLOCK   │     │
│   └───────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
```

---

### BFR-008: Upsell Lock Modal
**Priority:** High | **Estimate:** 3 points | **Labels:** `frontend`

**Description:**
When athlete clicks locked Day 1 content, show "ACCESS DENIED" modal with option to ask sponsor.

**Acceptance Criteria:**
- [ ] Modal appears on locked content tap
- [ ] "ACCESS DENIED" title with lock animation
- [ ] "PRO CLEARANCE REQUIRED" subtitle
- [ ] "Ask Sponsor to Unlock" primary CTA
- [ ] "Maybe Later" dismiss option
- [ ] Haptic feedback on interaction

**File to create:**
- NEW: `src/components/modals/AccessDeniedModal.tsx`

---

### BFR-012: Day 1 Workout Interface
**Priority:** High | **Estimate:** 8 points | **Labels:** `frontend`, `content`

**Description:**
After onboarding completes, athlete sees "START DAY 1" but there's no Day 1 content screen.

**Acceptance Criteria:**
- [ ] Day 1 "Diagnostic Scan" screen
- [ ] Sticky scroll workout format
- [ ] Exercise cards with video/animation
- [ ] Rep counter / timer
- [ ] Completion triggers XP award
- [ ] Transition to WorkoutComplete screen

**Files to create:**
- NEW: `src/components/screens/WorkoutDay.tsx`
- NEW: `src/components/workout/ExerciseCard.tsx`
- NEW: `src/components/workout/StickyProgress.tsx`

---

## MEDIUM PRIORITY TICKETS

### BFR-004: Sponsor Link Feedback
**Priority:** Medium | **Estimate:** 2 points | **Labels:** `frontend`, `ux`

**Description:**
After entering valid pack code, show "Linked to Sponsor: [Parent Name]" confirmation.

**Acceptance Criteria:**
- [ ] Fetch parent name from code lookup
- [ ] Show success message with parent name
- [ ] Green checkmark animation
- [ ] Haptic success pattern
- [ ] 1.5s delay before advancing

**File to modify:**
- `src/components/screens/onboarding/ParentCodeEntry.tsx` (lines 79-97)

**Design:**
```
After valid code:
✓ Linked to Sponsor: David
[Brief pause with haptic buzz]
→ Auto-advance to AthleteProfile
```

---

### BFR-007: 3D Globe Component
**Priority:** Medium | **Estimate:** 5 points | **Labels:** `frontend`, `visual`

**Description:**
Dashboard should show spinning 3D globe with global node network (Tokyo, London, NYC).

**Acceptance Criteria:**
- [ ] Three.js or React Three Fiber globe
- [ ] Location nodes with glow effect
- [ ] Slow auto-rotation
- [ ] Light on user's location
- [ ] Works on mobile (performance optimized)

**File to create:**
- NEW: `src/components/effects/GlobeNetwork.tsx`

**Note:** Could defer to post-MVP if timeline tight.

---

### BFR-009: Push Notification Infrastructure
**Priority:** Medium | **Estimate:** 5 points | **Labels:** `backend`, `notifications`

**Description:**
Parents need push notifications when athlete requests unlock or other events.

**Acceptance Criteria:**
- [ ] Service worker for push notifications
- [ ] FCM or OneSignal integration
- [ ] Notification types: unlock_request, streak_warning, weekly_report
- [ ] Parent device token storage
- [ ] Notification queue for offline parents

**Files to create:**
- NEW: `public/sw.js`
- NEW: `src/lib/notifications.ts`

---

### BFR-011: EpicUnlockSequence Component
**Priority:** Medium | **Estimate:** 3 points | **Labels:** `frontend`, `animation`

**Description:**
When parent completes payment, athlete sees epic unlock animation before Day 1.

**Acceptance Criteria:**
- [ ] "AUTHENTICATING..." text with loading spinner
- [ ] Lock icon that shatters into particles
- [ ] "ACCESS GRANTED" text reveal
- [ ] Heavy haptic feedback
- [ ] Auto-advance to Day 1 after 2s

**File to create:**
- NEW: `src/components/screens/EpicUnlockSequence.tsx`

**Animation Budget:** 15 points (Epic moment)

**Design:**
```
Frame 1: Black screen, "AUTHENTICATING..." pulses
Frame 2: Lock icon appears, cracks form
Frame 3: Lock shatters, particles fly outward
Frame 4: "ACCESS GRANTED" fades in with glow
Frame 5: Auto-advance to Day 1
```

---

## LOW PRIORITY TICKETS

### BFR-005: Update CTA Text to "ENTER THE DOJO"
**Priority:** Low | **Estimate:** 0.5 points | **Labels:** `frontend`, `copy`

**Description:**
AthleteReady screen CTA says "START DAY 1" but should say "ENTER THE DOJO" per brand voice.

**Acceptance Criteria:**
- [ ] Change button text to "ENTER THE DOJO"
- [ ] Maintain same functionality

**File to modify:**
- `src/components/screens/onboarding/AthleteReady.tsx` (line 191)

**Change:**
```tsx
// Before
START DAY 1 →

// After
ENTER THE DOJO
```

---

## BACKLOG (Post-MVP)

### BFR-013: Sign In Screen
**Priority:** Backlog | **Labels:** `frontend`, `auth`

Referenced in RoleSelection.tsx ("Already have an account?") but not built.

### BFR-014: Forgot Password Flow
**Priority:** Backlog | **Labels:** `frontend`, `auth`

### BFR-015: Deep Link Handling
**Priority:** Backlog | **Labels:** `frontend`

`barefoot://join?code=ABC123` pre-fill support.

### BFR-016: Multi-Athlete Management
**Priority:** Backlog | **Labels:** `frontend`

ParentFamily.tsx needs full athlete roster CRUD.

### BFR-017: Subscription Cancellation Flow
**Priority:** Backlog | **Labels:** `frontend`, `payments`

---

## DEPENDENCY GRAPH

```
BFR-002 (Supabase Auth)
    ├── BFR-003 (Pack Code DB) → BFR-004 (Sponsor Feedback)
    └── BFR-001 (Stripe)
            └── BFR-010 (Parent Unlock Flow)
                    ├── BFR-006 (Content Gating)
                    ├── BFR-008 (Upsell Modal)
                    ├── BFR-011 (Epic Unlock)
                    └── BFR-012 (Day 1 Workout)
                            └── BFR-009 (Notifications)
```

---

## SPRINT RECOMMENDATIONS

### Sprint 1: Backend Foundation (Week 1)
- BFR-002: Supabase Auth
- BFR-003: Pack Code Database
- BFR-001: Stripe Integration

### Sprint 2: Core UX (Week 2)
- BFR-010: Parent Unlock Flow
- BFR-006: Content Gating
- BFR-008: Upsell Modal

### Sprint 3: Content & Polish (Week 3)
- BFR-012: Day 1 Workout
- BFR-011: EpicUnlockSequence
- BFR-004: Sponsor Feedback
- BFR-005: CTA Text

### Sprint 4: Nice-to-Haves (Week 4+)
- BFR-007: 3D Globe
- BFR-009: Push Notifications

---

*Linear Tickets Generated from UX Walkthrough - Dec 28, 2024*
