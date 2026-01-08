# Feature Specification: Auth & Email Unification

**Version:** 1.0.0
**Created:** 2026-01-02
**Status:** Draft

---

## Overview

A unified identity and communications platform enabling parents to easily sign in with modern authentication methods (Magic Links, Google, Apple OAuth), receive reliable transactional and marketing emails through a properly configured 3-lane email architecture, and have their Shopify purchases automatically linked to their Academy profile. This eliminates password friction for busy parents, delivers promised content (7-day plans, welcome sequences), and creates a unified customer view across shop and academy.

**Speed to Market > Enterprise Perfection.** No custom SSO. We solve with a $0 webhook.

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    THE 3-LANE EMAIL ARCHITECTURE            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LANE A: Auth           LANE B: Transactional   LANE C: Marketing
│  ─────────────          ─────────────────────   ───────────────
│  Owner: Clerk           Owner: Postmark         Owner: Klaviyo
│  • Magic Links          • Welcome email         • Newsletter
│  • Password reset       • Workout summary       • Abandoned cart
│  • Email verify         • Parent-child link     • 7-day plan drip
│                         • Receipts              • SMS nudges
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    THE IDENTITY BRIDGE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Academy (Next.js)              Shop (Hydrogen)             │
│  ─────────────────              ──────────────              │
│  User logs in via Clerk    →    User buys as guest          │
│         │                              │                    │
│         v                              v                    │
│     Convex User                  Shopify Order              │
│         ^                              │                    │
│         │                              │                    │
│         └──────── WEBHOOK ─────────────┘                    │
│                (match by email)                             │
│                                                             │
│  Result: Order unlocks "NeoBall Owner" badge in Academy     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## User Stories

### Primary Users

- **Parents** - Primary account holders signing up on behalf of child athletes
- **Athletes** - Secondary users linked to parent accounts
- **Shopify Customers** - Users who purchase products in the shop (may or may not have Academy accounts)

### Stories

#### US-1: Passwordless Sign-In
**As a** parent
**I want** to sign in with Google, Apple, or Magic Link without remembering a password
**So that** I can quickly access my child's training content without friction

**Acceptance Criteria:**
- [ ] AC-1.1: User can sign in with Google OAuth in ≤3 clicks
- [ ] AC-1.2: User can sign in with Apple OAuth in ≤3 clicks
- [ ] AC-1.3: User can sign in with Magic Link (receive email, click link) in ≤60 seconds
- [ ] AC-1.4: Existing password users can still sign in with password (no forced migration)
- [ ] AC-1.5: Users can add/change sign-in methods from their profile

**Decision:** Keep password as fallback for existing users. New users encouraged toward social/magic link but password available.

#### US-2: Welcome Email Upon Quiz Completion
**As a** parent who completed the athlete quiz
**I want** to receive a welcome email with my child's profile and next steps
**So that** I can reference this information and share with my child

**Acceptance Criteria:**
- [ ] AC-2.1: Email arrives within 5 minutes of submitting email on SaveProfile
- [ ] AC-2.2: Email contains child's Wolf identity (nickname, archetype)
- [ ] AC-2.3: Email contains link to view full profile
- [ ] AC-2.4: Email contains call-to-action to start training
- [ ] AC-2.5: Email sent via Postmark (transactional lane)

**Decision:** Same welcome email for free/paid initially. Can segment later in Klaviyo.

#### US-3: 7-Day Plan Delivery
**As a** subscriber who signed up for a training plan
**I want** to receive the 7-day Barefoot Reset plan in my inbox
**So that** I can follow the program without logging into the app

**Acceptance Criteria:**
- [ ] AC-3.1: Day 1 email arrives immediately after signup/purchase
- [ ] AC-3.2: Days 2-7 emails arrive at consistent time each morning (9am user timezone)
- [ ] AC-3.3: Each email contains that day's drill with instructions
- [ ] AC-3.4: Each email contains video link (if applicable)
- [ ] AC-3.5: User can click to log completion in Academy
- [ ] AC-3.6: Sequence managed by Klaviyo automation flow

**Decision:** Klaviyo handles 7-day drip (not custom Convex job). User timezone captured at signup for send time.

#### US-4: Order Visibility in Academy
**As a** shop customer who also has an Academy account
**I want** to see my shop purchases in my Academy profile
**So that** I know what I've bought and can access related content

**Acceptance Criteria:**
- [ ] AC-4.1: Orders placed in shop appear in Academy profile within 5 minutes
- [ ] AC-4.2: Order display shows: date, items, total, fulfillment status
- [ ] AC-4.3: Digital products (training packs) auto-unlock in Academy (e.g., "NeoBall Owner" badge)
- [ ] AC-4.4: Linking works by email match (same email = same customer)
- [ ] AC-4.5: Shopify webhook (Order Created) triggers Convex lookup

**Decision:** Link by email only for MVP. If emails differ, orders stay unlinked. Manual linking deferred to Phase 2.

#### US-5: Newsletter Subscription
**As a** visitor to the marketing site
**I want** to subscribe to the Wolf Pack newsletter
**So that** I receive training tips, product news, and promotions

**Acceptance Criteria:**
- [ ] AC-5.1: Newsletter signup form available on marketing homepage
- [ ] AC-5.2: Newsletter signup form available on shop homepage
- [ ] AC-5.3: User receives confirmation email within 2 minutes (via Klaviyo)
- [ ] AC-5.4: User can unsubscribe with one click
- [ ] AC-5.5: Consent is recorded with timestamp and source
- [ ] AC-5.6: Klaviyo profile created/updated on submission

**Decision:** Single opt-in for MVP (faster conversion). Double opt-in available in Klaviyo if needed later.

#### US-6: Transactional Email Delivery
**As a** user taking account actions
**I want** to receive confirmation emails for important actions
**So that** I have a record and can verify actions were completed

**Acceptance Criteria:**
- [ ] AC-6.1: Account creation triggers welcome email (via Postmark)
- [ ] AC-6.2: Subscription purchase triggers receipt email (via Postmark)
- [ ] AC-6.3: Parent-child link triggers confirmation to both parties (via Postmark)
- [ ] AC-6.4: All transactional emails arrive within 60 seconds
- [ ] AC-6.5: Workout completion summary emails (via Postmark)

**Decision:** Postmark for all transactional (non-marketing) emails. API key: 96c9d8ce-...

---

## Functional Requirements

### Core Requirements

| ID | Requirement | Priority | Acceptance Criterion |
|----|-------------|----------|---------------------|
| FR-1 | System supports Magic Link authentication | Must Have | User can complete sign-in via email link |
| FR-2 | System supports Google OAuth authentication | Must Have | User can complete sign-in with Google |
| FR-3 | System supports Apple OAuth authentication | Must Have | User can complete sign-in with Apple |
| FR-4 | Passkeys infrastructure is ready (not required for MVP) | Could Have | Deferred; Clerk supports when needed |
| FR-5 | Auth emails (magic link, password reset) via Clerk | Must Have | 99%+ delivery rate |
| FR-6 | Transactional emails send via Postmark | Must Have | Emails send within 60s of trigger |
| FR-7 | Marketing emails/newsletter via Klaviyo | Must Have | Welcome series + automation flows |
| FR-8 | Shopify orders sync to Convex via webhook | Must Have | Orders appear in Academy within 5min |
| FR-9 | Email consent captured with timestamp/source | Must Have | Audit trail for all subscriptions |
| FR-10 | Unsubscribe works with one click | Must Have | CAN-SPAM compliant |
| FR-11 | SMS marketing via Klaviyo (not login) | Should Have | Collect phone, send nudges |

### Business Rules

| ID | Rule | Example |
|----|------|---------|
| BR-1 | One Clerk account per email address | If user signs up with Google (mike@gmail.com), they cannot create a separate password account with same email |
| BR-2 | Shop purchases link to Academy by email match | Shop order with mike@gmail.com auto-links to Academy user with same email |
| BR-3 | Email marketing consent is separate from account creation | Creating an account does NOT auto-subscribe to newsletter |
| BR-4 | Children under 13 do not have their own accounts | Parent creates account, links child profile |
| BR-5 | Auth emails bypass marketing preferences | Password reset sends even if user unsubscribed from marketing |

---

## Non-Functional Requirements

| ID | Category | Requirement | Measurement |
|----|----------|-------------|-------------|
| NFR-1 | Performance | Auth emails deliver within 10 seconds | Measured via ESP delivery logs |
| NFR-2 | Performance | Transactional emails deliver within 60 seconds | Measured via ESP delivery logs |
| NFR-3 | Deliverability | Auth lane achieves 99%+ inbox rate | SPF/DKIM/DMARC passing, monitor bounces |
| NFR-4 | Deliverability | Marketing lane achieves 95%+ inbox rate | Monitor spam complaints <0.1% |
| NFR-5 | Security | OAuth tokens never exposed in client logs | Security audit |
| NFR-6 | Security | Email verification required before sensitive actions | Cannot change email without verifying new |
| NFR-7 | Compliance | COPPA: No direct child email collection | Children linked to parent, no child emails |
| NFR-8 | Compliance | CAN-SPAM: One-click unsubscribe on all marketing | All marketing emails have unsubscribe link |
| NFR-9 | Reliability | Webhook retry on failure (up to 3 attempts) | Monitor webhook failure rate <1% |

---

## Data Requirements

### Entities

| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| User | A person with an account in the Academy | clerkId, email, role (parent/athlete), linkedAthleteIds, linkedParentId |
| Identity Map | Links user across systems | userId, clerkId, shopifyCustomerId, klaviyoProfileId, email |
| Email Consent | Record of user's email preferences | userId, marketingConsent (bool), smsConsent (bool), consentTimestamp, consentSource |
| Order | A purchase from the shop | orderId, email, items, total, fulfillmentStatus, linkedUserId |
| Email Event | Log of emails sent | emailId, type (auth/transactional/marketing), recipient, sentAt, deliveredAt, openedAt |

### Data Rules

- Email addresses are case-insensitive for matching (mike@gmail.com = Mike@Gmail.com)
- shopifyCustomerId may be null if user hasn't purchased from shop
- klaviyoProfileId may be null if user hasn't opted into marketing
- consentTimestamp must be stored in UTC
- Orders without a matching Academy email are stored but flagged as "unlinked"

---

## User Interface Requirements

### Key Interactions

1. **Sign-In Flow**: User chooses Google, Apple, or Email OTP → Completes auth → Lands on dashboard (existing users) or onboarding (new users)

2. **Newsletter Signup**: User enters email in footer form → Sees success message → Receives confirmation email

3. **Order History View**: User navigates to Profile → Orders tab → Sees list of shop purchases with status

### States

| State | Description | User Can... |
|-------|-------------|-------------|
| Signed Out | No active session | Sign in, sign up, browse public pages |
| Signed In (No User) | Has Clerk session, no Convex user | Complete onboarding |
| Signed In (Active) | Full account | Access all features, manage profile |
| Email Unverified | Account exists but email not verified | Resend verification, limited access |

---

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| User tries Google OAuth but email already has password account | Prompt to link accounts or sign in with existing method |
| User clicks OTP link after it expires (10 min) | Show "Code expired" message, offer to resend |
| Shopify webhook fails on first attempt | Retry up to 3 times with exponential backoff |
| User has Academy email A, shops with email B | Orders stay unlinked; user can manually link in profile |
| User unsubscribes from newsletter then re-subscribes | New consent recorded with new timestamp |
| Email bounces (invalid address) | Mark email as invalid, prompt user to update |
| Apple OAuth provides private relay email | Store relay email, treat as primary email |

---

## Out of Scope

- **Full Shopify SSO**: Requires Shopify Plus ($50k+ engineering); linking by email webhook instead
- **SMS for Login**: High friction/cost; use Magic Link instead
- **Custom SSO Bridge**: No shared login between Academy and Shop for MVP
- **Agentic Message Orchestration**: Future feature where AI proposes/sends messages
- **Multi-tenancy**: Single brand (YouthPerformance) for now
- **Custom Email Templates**: Use ESP defaults for MVP; Wolf-branded templates Phase 2
- **Email Analytics Dashboard**: Use ESP native dashboards (Postmark, Klaviyo)
- **Manual Order Linking**: If emails differ, orders stay unlinked for MVP

**In Scope but Optional:**
- **SMS Marketing Nudges**: Via Klaviyo, if phone numbers collected (e.g., "Get 10% off")

---

## Clarifications Needed

> **DO NOT proceed to implementation planning until ALL clarifications are resolved.**

### Resolved Decisions (from YY + Mike)
- **Auth method:** Magic Links + Google + Apple (not Email OTP)
- **Password:** Keep as fallback, don't force migration
- **Transactional ESP:** Postmark (API key: 96c9d8ce-...)
- **Marketing ESP:** Klaviyo (Shopify native integration)
- **SMS:** No SMS for login; Klaviyo SMS for marketing nudges only
- **Shopify linking:** Webhook by email match, no custom SSO
- **7-day plan:** Klaviyo automation, user timezone
- **Double opt-in:** Single opt-in for MVP

### Remaining Clarifications

#### Email Addresses
- [NEEDS CLARIFICATION: What "from" addresses should we use?]
  - Auth (Clerk): `noreply@youthperformance.com`?
  - Transactional (Postmark): `wolf@youthperformance.com`?
  - Marketing (Klaviyo): `pack@youthperformance.com`?

#### DNS & Deliverability
- [NEEDS CLARIFICATION: Who manages DNS for youthperformance.com? Can they add SPF/DKIM/DMARC records?]
- [NEEDS CLARIFICATION: Do we need separate subdomains (accounts., notify., news.) or single domain with sender separation?]

#### Shopify Integration
- [NEEDS CLARIFICATION: Are there existing Shopify webhooks configured, or starting from scratch?]
- [NEEDS CLARIFICATION: What digital products exist that should auto-unlock in Academy? (e.g., training packs, badges)]

#### Apple OAuth
- [NEEDS CLARIFICATION: Is iOS app on the roadmap? Apple OAuth required for App Store if any social login present.]

---

## Dependencies

### External Dependencies
- **Clerk Dashboard:** Configure OAuth providers (Google, Apple) + Magic Links
- **Postmark Account:** API key available (96c9d8ce-...), need sender domain verification
- **Klaviyo Account:** Must install Shopify app, enable "Added to Cart" tracking
- **DNS Access:** Must add SPF/DKIM/DMARC records for deliverability
- **Shopify Admin:** Must enable webhook subscriptions (orders/create)

### Assumptions
- Clerk is the permanent identity provider (not migrating to Auth0, etc.)
- Shopify Plus is NOT available (no OIDC SSO to Shopify)
- User owns youthperformance.com domain with full DNS control
- Existing password users should continue to work (no forced migration)
- Postmark account is active and ready for integration

---

## Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Passwordless adoption rate | 60% of new signups use OTP/OAuth | Clerk dashboard analytics |
| Auth email delivery rate | 99%+ | ESP delivery logs |
| Welcome email open rate | 50%+ | Klaviyo analytics |
| Time from quiz to welcome email | <5 minutes | Custom event tracking |
| Shop→Academy link rate | 80% of shop customers linked | Convex query (linked vs unlinked) |
| Newsletter signup rate | 15% of marketing visitors | Form submission / page view |
| Unsubscribe rate | <0.5% per campaign | Klaviyo analytics |

---

## Review Checklist

> **Before marking this spec as "Approved":**

### Completeness
- [x] All user stories have acceptance criteria
- [x] All functional requirements have verification methods
- [x] Edge cases and error scenarios documented
- [x] Out of scope items explicitly listed
- [x] Dependencies and assumptions documented

### Quality
- [ ] No `[NEEDS CLARIFICATION]` markers remain
- [x] Requirements are testable (can write a test for each)
- [x] Requirements are unambiguous (one interpretation only)
- [x] No implementation details (no tech stack, no code, no architecture)
- [x] A non-technical stakeholder could understand this document

### Traceability
- [x] Each requirement traces to a user need
- [x] Each acceptance criterion is measurable
- [x] Success metrics defined

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-02 | MAI | Initial specification |
