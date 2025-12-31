# UX Walkthrough Gap Analysis

> **Test Date:** Dec 28, 2024
> **Test Subjects:** Marcus (14yo Athlete), David (Parent)
> **Critical Finding:** 12 gaps identified across 6 acts

---

## Executive Summary

The onboarding UI is **95% complete** on the frontend. The primary gaps are:
1. **Backend integration** (Supabase, Stripe) - ALL auth/payment is mocked
2. **Content gating logic** - `subscriptionStatus` exists but isn't enforced
3. **Parent-Athlete linking UX** - No sponsor name display after code entry
4. **Epic unlock sequence** - Component doesn't exist
5. **Day 1 content** - No actual workout interface

---

## ACT-BY-ACT ANALYSIS

### ACT 1: THE HOOK (Landing Page)
**Status:** Out of Scope (separate barefootacademy.com site)

| Element | Expected | Status |
|---------|----------|--------|
| Facebook Ad redirect | barefootacademy.com | External |
| "CLAIM HUNTER ID" CTA | Redirects to app.barefootacademy.com/onboarding | External |

**Gap:** Need deep link from landing page to PWA.

---

### ACT 2: THE ONBOARDING (Parent Path)

| Step | File | Status | Gap |
|------|------|--------|-----|
| Splash Screen | `Splash.tsx` | ✅ DONE | - |
| Role Selection | `RoleSelection.tsx` | ✅ DONE | - |
| Parent Welcome | `ParentWelcome.tsx` | ✅ DONE | - |
| Parent Signup | `ParentSignup.tsx` | ⚠️ UI ONLY | No Supabase auth |
| Subscription Select | `SubscriptionSelect.tsx` | ⚠️ UI ONLY | No Stripe integration |
| Add Athlete | `AddAthlete.tsx` | ⚠️ UI ONLY | Code not stored in DB |
| Parent Ready | `ParentReady.tsx` | ✅ DONE | - |

**Critical Gaps:**

1. **GAP-001: Stripe Payment Integration**
   - SubscriptionSelect shows $9.99/mo and $79.99/yr
   - "START FREE TRIAL" button does nothing
   - No credit card collection
   - No trial activation
   - **Severity:** BLOCKER

2. **GAP-002: Supabase Auth**
   - ParentSignup.tsx has TODO comments
   - OAuth buttons (Google, Apple) are non-functional
   - Email/password signup is mocked
   - **Severity:** BLOCKER

3. **GAP-003: Pack Code Database Storage**
   - `generateAthleteCode()` creates codes locally
   - Codes stored in localStorage, not DB
   - No expiry enforcement (48h)
   - **Severity:** HIGH

---

### ACT 3: THE ATHLETE ENTRY

| Step | File | Status | Gap |
|------|------|--------|-----|
| Role Selection | `RoleSelection.tsx` | ✅ DONE | - |
| Pack Code Entry | `ParentCodeEntry.tsx` | ⚠️ PARTIAL | Missing sponsor feedback |
| Athlete Profile | `AthleteProfile.tsx` | ✅ DONE | - |
| Avatar Select | `AvatarSelect.tsx` | ✅ DONE | - |
| Notifications | `NotificationPermission.tsx` | ✅ DONE | - |
| Athlete Ready | `AthleteReady.tsx` | ✅ DONE | CTA text differs |

**Critical Gaps:**

4. **GAP-004: Sponsor Link Feedback**
   - Current: Code validates → moves to next screen silently
   - Expected: "Linked to Sponsor: David" message with haptic
   - Need: Parent name lookup from code
   - **File:** `ParentCodeEntry.tsx:79-97`
   - **Severity:** MEDIUM

5. **GAP-005: "ENTER THE DOJO" vs "START DAY 1"**
   - Current CTA: "START DAY 1 →"
   - Expected CTA: "ENTER THE DOJO"
   - **File:** `AthleteReady.tsx:191`
   - **Severity:** LOW (cosmetic)

---

### ACT 4: THE TRAP (Free Experience / Upsell)

| Element | File | Status | Gap |
|---------|------|--------|-----|
| 3D Globe | N/A | ❌ MISSING | Component doesn't exist |
| XP Display | `AthleteDashboard.tsx` | ✅ DONE | - |
| Day 1 Lock | N/A | ❌ MISSING | No content gating |
| Upsell Modal | N/A | ❌ MISSING | No $88 lock modal |
| Ask Sponsor | N/A | ❌ MISSING | No sponsor notification |

**Critical Gaps:**

6. **GAP-006: Content Gating System**
   - `subscriptionStatus` exists in OnboardingContext
   - BUT: AthleteDashboard doesn't check it
   - BUT: No "locked" content states
   - Need: Paywall component for Day 1
   - **Severity:** HIGH

7. **GAP-007: 3D Globe Component**
   - Expected: Spinning 3D Globe with global nodes
   - Current: None
   - **Severity:** MEDIUM (visual polish)

8. **GAP-008: Upsell Lock Modal**
   - Expected: "ACCESS DENIED. PRO CLEARANCE REQUIRED."
   - Expected: "Ask Sponsor to Unlock" button
   - Current: None
   - **Severity:** HIGH

9. **GAP-009: Parent Notification System**
   - Expected: Push notification to parent device
   - "Marcus is trying to start Day 1"
   - Current: No notification infrastructure
   - **Severity:** MEDIUM

---

### ACT 5: THE TRANSACTION (Parent Purchase)

| Element | File | Status | Gap |
|---------|------|--------|-----|
| Parent Alert | N/A | ❌ MISSING | No unlock notification |
| $88 Upsell | N/A | ❌ MISSING | No upsell modal |
| Apple Pay | N/A | ❌ MISSING | No payment processing |

**Critical Gaps:**

10. **GAP-010: Parent Unlock Flow**
    - Expected flow:
      1. Parent receives "Unlock request" notification
      2. Opens ParentDashboard
      3. Sees "$88 one-time offer" modal
      4. Pays via Apple Pay/Stripe
    - Current: None of this exists
    - **Severity:** BLOCKER

---

### ACT 6: THE EPIC UNLOCK

| Element | File | Status | Gap |
|---------|------|--------|-----|
| EpicUnlockSequence | N/A | ❌ MISSING | Component doesn't exist |
| Day 1 Interface | N/A | ❌ MISSING | No workout UI |

**Critical Gaps:**

11. **GAP-011: EpicUnlockSequence Component**
    - Expected animation sequence:
      1. "AUTHENTICATING..." text
      2. Lock icon shatter animation
      3. "ACCESS GRANTED" with haptic
    - Current: Component doesn't exist
    - **File to create:** `EpicUnlockSequence.tsx`
    - **Severity:** MEDIUM (delightful UX)

12. **GAP-012: Day 1 Diagnostic Scan Interface**
    - Expected: "Sticky Scroll" workout interface
    - Current: Nothing after onboarding completes
    - Need: Full workout day component
    - **Severity:** HIGH

---

## EDGE CASES IDENTIFIED

### Authentication Edge Cases
| Case | Expected Behavior | Current |
|------|-------------------|---------|
| Parent email already exists | "Try signing in instead" | Not implemented |
| OAuth cancelled | Return to signup screen | Not implemented |
| Session timeout | Re-authenticate modal | Not implemented |
| Multi-device parent login | Session sync | Not implemented |

### Code Linking Edge Cases
| Case | Expected Behavior | Current |
|------|-------------------|---------|
| Expired code (48h) | "Code expired" error | Not enforced |
| Code already used | "Code already redeemed" | Not checked |
| Invalid code format | Shake + error message | ✅ Works |
| Parent deletes account | Orphan athlete handling | Not handled |

### Subscription Edge Cases
| Case | Expected Behavior | Current |
|------|-------------------|---------|
| Trial expires | Paywall all content | Not implemented |
| Payment fails | Retry modal | Not implemented |
| Subscription cancelled | Downgrade to free | Not implemented |
| Multi-athlete limit (3) | "Upgrade for more" | Not enforced |

### Notification Edge Cases
| Case | Expected Behavior | Current |
|------|-------------------|---------|
| Push permission denied | Fallback to email | Not implemented |
| Parent device offline | Queue notification | Not implemented |
| Streak about to break | Urgent notification | Not implemented |

---

## LINEAR TICKET SUMMARY

### BLOCKERS (Must Fix Before Launch)
1. **[BFR-001] Stripe Payment Integration** - SubscriptionSelect
2. **[BFR-002] Supabase Auth** - ParentSignup + OAuth
3. **[BFR-010] Parent Unlock Flow** - Full purchase flow

### HIGH Priority
4. **[BFR-003] Pack Code Database** - Store codes in Supabase
5. **[BFR-006] Content Gating System** - Enforce subscriptionStatus
6. **[BFR-008] Upsell Lock Modal** - "Ask Sponsor to Unlock"
7. **[BFR-012] Day 1 Workout Interface** - First workout screen

### MEDIUM Priority
8. **[BFR-004] Sponsor Link Feedback** - Show parent name
9. **[BFR-007] 3D Globe Component** - Dashboard visual
10. **[BFR-009] Push Notifications** - Parent alerts
11. **[BFR-011] EpicUnlockSequence** - Unlock animation

### LOW Priority
12. **[BFR-005] CTA Text Update** - "ENTER THE DOJO"

---

## RECOMMENDED IMPLEMENTATION ORDER

### Phase 1: Backend Foundation (Blockers)
1. Supabase schema + auth setup
2. Stripe integration
3. Pack code database

### Phase 2: Core UX Gaps (High Priority)
4. Content gating logic
5. Upsell modal
6. Day 1 workout interface

### Phase 3: Delight Features (Medium/Low)
7. Sponsor link feedback
8. EpicUnlockSequence
9. 3D Globe (if time permits)
10. CTA text cosmetics

---

*Generated from UX Walkthrough Test - Dec 28, 2024*
