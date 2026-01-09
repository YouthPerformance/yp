# Project Status: The Grind

> **Current Phase:** Phase 8 (Governance & Production Hardening)
> **Last Updated:** January 8, 2026 @ 18:00 PST
> **Sprint:** BetterAuth Migration + Unified UI

---

## Active Context (What We're Doing RIGHT NOW)

### Completed This Session
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
- Adam v2.0 spec ready for design/dev handoff
- Voice onboarding ready for mobile testing
- Dev server: http://localhost:3003 | Network: http://192.168.2.1:3003

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
| Test Coverage | 30% | 0% | - |

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

1. **Test voice onboarding** on mobile device (192.168.2.1:3003/voice-sorting)
2. **Rotate Shopify tokens** (security P0) - user handling
3. **Configure Linear MCP** (user has API key ready)
4. **Set production OAuth credentials** - Google/Apple client IDs for BetterAuth
5. **Test auth flow end-to-end** - sign-up → OTP → session → Convex queries

---

*Updated by: Claude (Wolf Pack Protocol)*
*Session: BetterAuth Audit + Unified BetaBadge*
