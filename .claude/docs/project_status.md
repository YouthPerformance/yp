# Project Status: The Grind

> **Current Phase:** Phase 8 (Governance & Production Hardening)
> **Last Updated:** January 17, 2026
> **Sprint:** WolfGrow Content Strategy + Hydration Calculator

---

## Active Context (What We're Doing RIGHT NOW)

### Completed This Session
- [x] **WolfGrow Content Strategy Spec** - 2026 Content Quality Standard
  - Spec: `.specify/specs/011-wolfgrow-content-strategy/spec.md`
  - Part 1: E-E-A-T 2.0 Protocol, Answer Engine Optimization, Interactive Utility pillars
  - Part 2: Hydro-Wolf Calculator PRD with Wolf Algorithm formulas
  - Constitution alignment verified, success metrics defined

- [x] **Hydro-Wolf Calculator** - Premium 2026 UI implementation
  - Route: `/hydration-calculator` on youthperformance.com
  - Component: `apps/marketing/src/pages/HydrationCalculator.jsx`
  - Styling: `apps/marketing/src/pages/HydrationCalculator.css`
  - Features: Reactive sliders, animated numbers, water level indicator
  - Wolf Algorithm: Weight × 0.75oz baseline + activity adder
  - Electrolyte Alert triggers at 60+ min duration
  - Email capture modal for printable plan (Resend integration TODO)
  - SoftwareApplication JSON-LD schema for SEO
  - Build verified: passing

### Previous Session
- [x] **WolfLoader Academy Integration** - Premium WebGL loader across apps
  - Academy root page (`/`) now uses WolfLoader (Unicorn WebGL mode)
  - Marketing LP upgraded from YPLoader to WolfLoader
  - Fixed type errors in `WolfEvolution.tsx` (accessory types, ring colors)
  - All apps build successfully

- [x] **WolfLoader Component** - Premium WebGL loader with progressive enhancement
  - Created `packages/ui/src/components/WolfLoader/` (shared component)
  - `useUnicornStudio.ts` - Lazy SDK loading hook with timeout fallback
  - `WolfLoader.tsx` - Orchestrating component (Instant → Video → WebGL)
  - `WolfLoader.css` - Premium animations, reduced motion support
  - Integrated into Marketing LP as first consumer
  - Unicorn Studio project: `J6lD9h4nUQCDLGwKF7Aw`
  - Progressive enhancement: Black+typography (0ms) → Video (~200ms) → WebGL (~1s)

### Previous Session
- [x] **Test Infrastructure Setup** - Critical path testing for auth, payments, data
  - Added Vitest with config: `apps/web-academy/vitest.config.ts`
  - Created test mocks: `src/__tests__/mocks/` (stripe.ts, auth.ts, convex.ts)
  - Written auth tests: `src/__tests__/auth.test.ts`
  - Written Stripe webhook tests: `src/__tests__/stripe-webhook.test.ts`
  - Written Convex mutation tests: `src/__tests__/convex-mutations.test.ts`
  - Created agent guide: `TESTING.md`
  - Updated CI workflow with test job

- [x] **Commerce Architecture Documentation** - Clarified Shop vs Academy payments
  - Updated `CLAUDE.md` with commerce systems table
  - Shop = Shopify Hydrogen (physical goods)
  - Academy = Stripe (digital: SaaS, programs, info products)
  - Added Testing Strategy section to CLAUDE.md

### Previous Session
- [x] **Unified BetaBadge Component** - Created shared `@yp/ui` BetaBadge component
  - Added to `packages/ui/src/components/BetaBadge.tsx`
  - 3 variants: stealth, glow, holographic
  - Integrated into Header component with `showBetaBadge` prop
  - Created Astro-native version for Playbook app
  - Committed: `bacd6d0 feat(ui): add unified BetaBadge component to @yp/ui`

- [x] **BetterAuth Audit & Fixes** - Full auth system validation
  - Fixed `getServerSession()` in `apps/web-academy/src/lib/auth-server.ts` (was returning null)
  - Updated `packages/yp-alpha/convex/auth.config.ts` - removed dead Clerk config, documented auth architecture
  - Updated env docs: `.claude/docs/env-registry.md` and `.github/ENVIRONMENTS.md`
  - **Auth Flow:** BetterAuth sessions → Next.js validates → authUserId passed to Convex

### Previous Session
- [x] **Adam v2.0 "WolfGrow" Spec Created** - Full PRD transformation
  - Spec: `.specify/specs/005-adam-v2-wolfgrow/spec.md`
  - Data: `.specify/specs/005-adam-v2-wolfgrow/data.ts`
  - Dual-track design (Parent vs Athlete journey)
  - "Real World Reset" origin story section
  - Social proof "Receipts" wall
  - Wolf Mode toggle (P1 feature)

### Previous Session
- [x] Voice APIs deployed and verified on production
  - `/api/voice/classify` - Wolf identity classification (keyword + LLM fallback)
  - `/api/voice/speak` - ElevenLabs TTS for Wolf persona
  - `/api/voice/deepgram-token` - STT token generation
- [x] Fixed Vercel deployment config issues
- [x] Added turbo-ignore for smarter monorepo deploys
- [x] Production verified at https://academy.youthperformance.com

### Current Focus
- Hydration Calculator live at `/hydration-calculator` - needs Resend email integration
- WolfGrow Content Strategy spec ready for rollout to other content pages
- Adam v2.0 spec ready for design/dev handoff
- Dev server: http://localhost:3004 (marketing)

---

## Auth System Status (BetterAuth)

> **Migration Status:** Complete (January 2026)
> **Previous System:** Clerk (deprecated)

| Component | Status | Notes |
|-----------|--------|-------|
| BetterAuth Config | ✅ Working | `packages/yp-alpha/src/auth/index.ts` |
| Session Validation | ✅ Fixed | `apps/web-academy/src/lib/auth-server.ts` |
| Email OTP | ✅ Working | 6-digit codes, 10 min expiry |
| Google OAuth | ⚙️ Configured | Needs production client ID |
| Apple OAuth | ⚙️ Configured | Needs production client ID |
| Convex Integration | ✅ Working | authUserId passed to queries |
| Cross-Subdomain Cookies | ✅ Configured | `.youthperformance.com` domain |

### Key Files
- `packages/yp-alpha/src/auth/index.ts` - BetterAuth config
- `apps/web-academy/src/lib/auth-server.ts` - Server session validation
- `apps/web-academy/src/lib/auth.ts` - Client auth hook
- `packages/yp-alpha/convex/users.ts` - `getByAuthUserId`, `getOrCreateFromAuth`

### Required Env Vars (Academy)
```bash
BETTER_AUTH_SECRET=       # Required - 32+ char random string
NEXT_PUBLIC_SITE_URL=     # Required - app URL
GOOGLE_CLIENT_ID=         # Optional - OAuth
GOOGLE_CLIENT_SECRET=     # Optional - OAuth
```

---

## On Deck (Next 24h)

### P0 - Critical (Before Launch)
- [ ] Rotate exposed Shopify tokens (`packages/yp-alpha/.env`)
- [x] ~~Remove hardcoded JWT fallback~~ - Fixed: now requires JWT_SECRET env var

### P1 - High Priority
- [ ] Mobile test voice onboarding on real device
- [ ] Add pre-commit hooks (Husky + lint-staged)
- [ ] Create ErrorBoundary components
- [ ] Configure Linear MCP for issue tracking

### P2 - Should Have
- [ ] Add Vitest to all apps
- [ ] Create root ESLint config
- [ ] Add Prettier config

---

## Blockers

| Blocker | Impact | Owner | Status |
|---------|--------|-------|--------|
| Exposed tokens in git | Security risk | Mike | **Needs rotation** |
| No test suites | Quality risk | Mike | Planning (CI ready) |

---

## Recent Deploys

| Date | App | Environment | Status |
|------|-----|-------------|--------|
| Jan 7 | Academy | Production (Vercel) | **Live** - Voice APIs enabled |
| Jan 1 | Marketing | Production (CF Pages) | Live |
| Dec 31 | Shop | Production (Oxygen) | Live |

---

## Sprint Metrics

| Metric | Target | Current | Change |
|--------|--------|---------|--------|
| Security Issues | 0 | 1 (tokens) | Improved |
| Broken Links | 0 | 0 | Stable |
| CI Coverage | 100% | 75% | - |
| Test Coverage | 30% | 15% | +15% (critical paths)

---

## Git Status

**Branch:** `master`

```
216f709 chore(academy): add turbo-ignore for smarter deploys
e76bc8a fix(academy): SSG-safe providers for Vercel build
21c1ae6 fix(academy): add missing dependencies for Vercel build
50126ae chore: update pnpm lockfile for Vercel deploy
69f682c fix(convex): add completeProgramDay mutation and fix type errors
```

**Synced with origin**

---

## Notes for Next Session

1. **Hydration Calculator Enhancements:**
   - Integrate Resend API for email capture (printable plan + electrolyte recipes)
   - Add PostHog events: `hydration_calc_complete`, `hydration_email_capture`
   - Test mobile UX at 375px viewport
2. **WolfGrow Rollout:**
   - Apply WolfGrow Content Standard to existing drill pages
   - Add "Proof of Life" video embeds for Adam/James
   - Create Author Entity schemas
3. **Rotate Shopify tokens** (security P0) - user handling
4. **Configure Linear MCP** (user has API key ready)
5. **Set production OAuth credentials** - Google/Apple client IDs for BetterAuth

---

*Updated by: Claude (Wolf Pack Protocol)*
*Session: WolfGrow Content Strategy + Hydration Calculator*
