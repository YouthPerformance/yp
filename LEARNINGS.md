# YP Monorepo Learnings Wiki

> **Purpose:** Context preservation for agent handoffs. Update this file after significant changes.
>
> **Last Updated:** 2024-12-31
> **Phase:** 5 (Production Deployment)

---

## Quick Context (TL;DR for Agents)

```
YouthPerformance (YP) = Premium youth sports consumer tech platform
├── YP Academy    → Training app + AskYP AI coach (subscription)
├── YP Shop       → Shopify store, NeoBall flagship product (commerce)
└── yp-alpha      → The shared AI brain connecting everything
```

**Mission:** Enable elite training for all kids, everywhere.

---

## Current Monorepo Structure

```
yp-monorepo/
├── apps/
│   ├── web-academy/        # Next.js 16 - THE CORE PRODUCT
│   │   ├── src/            # App source (imports from @yp/alpha)
│   │   ├── .env.local      # Convex + Clerk credentials
│   │   └── package.json    # @yp/web-academy
│   │
│   ├── shop/               # Hydrogen - COMMERCE (Phase 4)
│   │   ├── app/            # Remix routes + components
│   │   │   ├── routes/     # _index, products.$handle, collections.$handle, cart
│   │   │   ├── components/ # Layout, shared components
│   │   │   ├── lib/        # session.server.ts
│   │   │   └── styles/     # app.css (YP design tokens)
│   │   ├── server.ts       # Hydrogen server entry
│   │   ├── .env            # Shopify credentials (NEEDS STOREFRONT TOKEN)
│   │   └── package.json    # @yp/shop
│   │
│   └── neoball-lp/         # Astro - NEOBALL LANDING (Phase 4)
│       ├── src/
│       │   ├── pages/      # index.astro
│       │   ├── layouts/    # Layout.astro
│       │   └── components/ # Reusable Astro components
│       ├── public/         # Static assets (images, favicon)
│       └── package.json    # @yp/neoball-lp (deploys to Cloudflare)
│
├── packages/
│   ├── yp-alpha/           # THE BRAIN - Central Intelligence
│   │   ├── convex/         # ⚡ DATABASE LIVES HERE (Phase 3)
│   │   │   ├── schema.ts   # Users, enrollments, cards, etc.
│   │   │   ├── users.ts    # User queries/mutations
│   │   │   ├── gamification.ts  # XP, crystals, ranks
│   │   │   ├── progress.ts # Workout completion
│   │   │   └── _generated/ # API + DataModel
│   │   ├── src/
│   │   │   ├── config/     # Model configs
│   │   │   ├── router/     # Wolf router, voice wrapper
│   │   │   └── tools/      # Daily stack generator
│   │   └── convex.json     # Project: newyp
│   │
│   └── ui/                 # THE LOOK - Design system
│       └── src/
│           ├── components/ # Button (more coming)
│           └── tokens.ts   # Colors, fonts, spacing
│
├── cloud-code/             # THE WORKFORCE (agents, scripts)
│   └── (empty - ready for Linear agent harness)
│
├── turbo.json              # Build orchestration
├── pnpm-workspace.yaml     # Workspace: apps/*, packages/*
└── package.json            # Root scripts
```

### Neural Link (Phase 3)
The app (`web-academy`) imports database functions from the brain (`@yp/alpha`):
```typescript
import { api } from '@yp/alpha/convex/_generated/api';
import { Id } from '@yp/alpha/convex/_generated/dataModel';
```

### Shopify Integration (Phase 4)
The brain provides a Shopify client for fetching product data:
```typescript
import { createYPShopClient } from '@yp/alpha/shopify';

const shopify = createYPShopClient(process.env.STOREFRONT_TOKEN);
const products = await shopify.getFeaturedProducts(6);
const neoball = await shopify.getProduct('neoball');
```

---

## Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2024-12-30 | Use Turborepo + pnpm | Industry standard, fast builds, workspace linking |
| 2024-12-30 | Package naming: `@yp/*` | Clean namespace, easy imports |
| 2024-12-30 | Brain package: `@yp/alpha` | Contains AI routing, model configs, voice wrapper |
| 2024-12-30 | Academy from `/bfr/barefoot-app` | Most complete version of the training app |
| 2024-12-30 | Design tokens in `@yp/ui` | Wolf Black (#0A0A0A), Neon Green (#39FF14) |
| 2024-12-30 | Convex in `@yp/alpha` (Phase 3) | Brain controls the database, app is "headless" |

---

## Source Folder Mapping

Where things came from (for reference/archaeology):

| Monorepo Location | Original Source | Notes |
|-------------------|-----------------|-------|
| `apps/web-academy` | `/bfr/barefoot-app` | Next.js 16, Clerk auth, Convex |
| `packages/yp-alpha` | `/ypprod/.../yp-cortex-build` | AI brain, wolf router |
| `packages/ui` | NEW | Created fresh, needs components |
| (pending) `apps/neoball-lp` | `/neoball` | Static HTML, needs Astro conversion |
| (pending) `apps/shop` | `/ypsupplyrip` reference | Needs fresh Hydrogen build |
| (pending) `apps/library` | `/drake2/ypcampus-astro` | Content/SEO engine |

---

## Tech Stack Summary

### apps/web-academy
- **Framework:** Next.js 16.1.1 (App Router)
- **Auth:** Clerk
- **Database:** Convex (real-time)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Deploy Target:** Vercel (primary), Cloudflare (via OpenNext)

### packages/yp-alpha
- **Build:** tsup (ESM + CJS)
- **Contents:**
  - `wolf-router.ts` - AI model routing
  - `model-executor.ts` - Execution layer
  - `voice-wrapper.ts` - Voice interface
  - `models.ts` - Model configurations
  - `daily-stack.ts` - Training stack generator

### packages/ui
- **Build:** tsup (ESM + CJS)
- **Peer Deps:** React 18
- **Design Tokens:**
  - `wolfBlack`: #0A0A0A
  - `neonGreen`: #39FF14
  - `electricBlue`: #00D4FF

---

## Environment Variables

### web-academy (check .env.local)
```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOY_KEY=
```

### shop (check .env)
```bash
# Shopify Store - Connected to youthperformance.myshopify.com
PUBLIC_STORE_DOMAIN=youthperformance.myshopify.com
PUBLIC_STOREFRONT_API_VERSION=2024-10

# Storefront API Token (for client-side queries)
# Get from: Shopify Admin > Settings > Apps > Develop apps > [App] > Storefront API
PUBLIC_STOREFRONT_API_TOKEN=shpss_xxx  # starts with shpss_

# Admin API Token (for server-side, keep secret)
PRIVATE_ADMIN_API_TOKEN=shpat_xxx  # starts with shpat_

SESSION_SECRET=yp-shop-session-secret-change-me
```

### Shop Deployment (Shopify Oxygen)
```bash
# Link to Hydrogen storefront
cd apps/shop
npx shopify hydrogen link

# Push environment variables to Oxygen
npx shopify hydrogen env push

# Deploy to edge (300+ cities, 0ms cold starts)
npx shopify hydrogen deploy

# Check logs
npx shopify hydrogen logs
```

**IMPORTANT:** Oxygen ignores local `.env` - use `env push` to sync variables.

### Linear Agent (if using)
```bash
LINEAR_API_KEY=lin_api_xxx
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-xxx
```

---

## Commands Reference

```bash
# Development
pnpm dev                          # Run all apps
pnpm dev --filter @yp/web-academy # Run just academy

# Building
pnpm build                        # Build all
pnpm build --filter @yp/alpha     # Build just brain

# Convex (run from packages/yp-alpha)
cd packages/yp-alpha
npx convex dev                    # Start Convex dev server
npx convex deploy                 # Deploy to production

# Adding dependencies
pnpm add <pkg> --filter @yp/web-academy
pnpm add <pkg> --filter @yp/ui -D

# Workspace linking (already configured)
# "@yp/alpha": "workspace:*" in package.json
```

---

## Known Issues & TODOs

### Immediate
- [x] `@yp/alpha` needs Convex peer dep properly configured ✅ Phase 3
- [ ] `@yp/ui` needs more components (Card, Input, Hero)
- [x] web-academy Convex schema should move to shared package ✅ Phase 3
- [x] Initialize git repo ✅ Phase 3

### Phase 5 (Deployment) - IN PROGRESS
- [x] Deploy Academy to Vercel ✅
- [x] Deploy Marketing to Vercel ✅
- [ ] Deploy Shop to Shopify Oxygen (in progress - linked to youthperformance.myshopify.com)
- [ ] Deploy NeoBall LP to Vercel (build fixed, needs deployment)
- [ ] Configure custom domains

### Phase 4 (Complete)
- [x] Convert `/neoball` → `apps/neoball-lp` (Astro) ✅
- [x] Build `apps/shop` (Hydrogen) ✅
- [ ] Move `/Linear-Coding-Agent-Harness` → `cloud-code/agents`
- [x] Extract shared Convex schema to `@yp/alpha/convex` ✅ Phase 3

### Cleanup (Eventually)
- [ ] Archive 200+ scattered folders in `~/yp-archive/`
- [ ] Consolidate duplicate agent harness copies
- [ ] Remove old barefoot iterations

---

## Deployment Gotchas (Lessons Learned)

### Vercel + Monorepo
- Use **GitHub integration** (not CLI) for monorepo apps
- CLI can't resolve `workspace:*` dependencies from subdirectories
- Set **Root Directory** in Vercel dashboard to the app folder
- For apps depending on `@yp/ui`, use turbo build command:
  ```
  cd ../.. && pnpm turbo run build --filter=@yp/neoball-lp
  ```

### Shopify Hydrogen + Oxygen
- **Oxygen > Vercel** for Hydrogen (0ms cold starts, edge network)
- Oxygen deployment needs **correct GitHub repo connected**
- Local `.env` is ignored - use `npx shopify hydrogen env push`
- **Two levels of access control:**
  1. Shopify store password (Online Store > Preferences)
  2. Oxygen deployment access (Staff only vs Anyone with link)
- Storefront API tokens start with `shpss_`, Admin tokens with `shpat_`

### Chrome Extension for Debugging
- Install "Claude in Chrome" extension
- Run `claude --chrome` to enable browser tools
- Can read console logs, network requests, DOM state
- Use `/chrome` command to check connection status

---

## The Business Context

### Products
1. **YP Academy** (Subscription)
   - Training Packs (short sessions that stack)
   - AskYP AI Coach (personalized guidance)
   - Progress tracking + benchmarks
   - "The Pack" community challenges

2. **YP Shop** (Commerce)
   - NeoBall (silent basketball) - flagship
   - Gear bundles (hardware + Academy programs)
   - Shopify-powered

### Method
- **Foundation Stack:** FEET → ELASTIC CHASSIS → ENGINE
- **R3 Framework:** Release → Restore → Re-Engineer

### Target Audience
- Sports parents
- Youth athletes
- Teams/clubs
- Coaches

---

## Agent Handoff Checklist

When picking up work on this repo:

1. **Read this file first**
2. **Check current branch:** `git status`
3. **Check what's running:** `pnpm list --depth 0`
4. **Verify linkage:** `pnpm list --filter @yp/web-academy`
5. **Run dev to test:** `pnpm dev --filter @yp/web-academy`

---

## Update Log

| Date | Agent/Session | Changes |
|------|---------------|---------|
| 2024-12-30 | Phase 2 Init | Scaffolded monorepo, migrated brain + academy, created UI package |
| 2024-12-30 | Phase 3 Neural Link | Moved Convex to @yp/alpha, updated imports, git initialized |
| 2024-12-30 | Phase 4 Shopify | Created apps/shop Hydrogen storefront for shop.youthperformance.com |
| 2024-12-30 | Phase 4 NeoBall | Created apps/neoball-lp Astro landing page for neoball.co |
| 2024-12-30 | Phase 4 Brain | Added @yp/alpha/shopify - Shopify Storefront API client in brain package |
| 2024-12-30 | Grand Unification | All 3 apps running: Shop:3001, NeoBall:3002, Academy:3003 |
| 2024-12-30 | Phase 5 Wolf Skin | Unified Header in @yp/ui deployed to all 3 apps |
| 2024-12-30 | Build Fixes | Fixed @yp/ui tsup config with "use client" banner, fixed TS errors in @yp/alpha |
| 2024-12-30 | Marketing App | Added apps/marketing (Vite+React) from newpeterson for youthperformance.com |
| 2024-12-31 | Phase 5 Deployment | Deployed Academy & Marketing to Vercel via GitHub integration |
| 2024-12-31 | Shop Oxygen Config | Reverted Shop from Vercel to Shopify Oxygen for edge performance |
| 2024-12-31 | NeoBall Vercel Fix | Fixed turbo build command to build @yp/ui dependency first |
| 2024-12-31 | Nav Links Production | Updated all app nav links to production URLs |
| 2024-12-31 | Shop Store Switch | Switched from ypathletes to youthperformance.myshopify.com |
| 2024-12-31 | Chrome Debug Setup | Configured Claude Code + Chrome extension for browser debugging |
| 2024-12-31 | Shop Neoball Alignment | Unified shop design with /neoball premium patterns - cyan fire loader, glass morphism, premium cards |
| 2024-12-31 | Shop Oxygen Deploy Fix | Fixed API version 2025-10→2024-10, pushed env to Oxygen, deployed successfully (needs access toggle) |
| 2024-12-31 | Phase 0 Security | Replaced placeholder SESSION_SECRET with secure value, added Zod env validation, .env.example files, MAINTENANCE_MODE toggle |

---

## Launch Readiness Phases

```
Phase 0 ✅ SECURITY FOUNDATION (Complete)
├── SESSION_SECRET replaced with cryptographically secure value
├── Zod env schema validation (shop + academy)
├── .env.example files created
└── MAINTENANCE_MODE toggle with branded fallback UI

Phase 1 ✅ DISCOVERY & AUDIT (Complete)
├── 1A: Audit web-academy - 6 critical, 5 high
├── 1B: Audit shop - 5 critical, 7 high
├── 1C: Audit neoball-lp - 0 critical, 2 high
├── 1D: Audit marketing - 4 critical, 4 high
└── 1E: Created AUDIT_REPORT.md

Phase 2 ⏳ INFRASTRUCTURE (Deferred)
├── 2A: Sentry for web-academy
├── 2B: Sentry for shop
└── 2C: CI/CD workflows

Phase 3 ✅ ACADEMY CORE LOOP (Complete)
├── 3A: Stripe checkout implemented (UpsellModal + API routes + webhook)
├── 3B: Workout completion wired to Convex (with offline resilience)
└── 3C: Parent flow feature-flagged (PARENT_FLOW_ENABLED = false)

Phase 4 ✅ SHOP REVENUE LOOP (Complete)
├── 4A: Cart implemented with Hydrogen API (add/remove/update/discount)
└── 4B: Variant selection + checkout redirect working

Phase 5 ✅ LEGAL & COMPLIANCE (Complete)
├── 5A: Terms of Service pages (all 4 apps)
├── 5B: Privacy Policy pages (all 4 apps)
└── 5C: Footer links added

Phase 6 ✅ TESTING & VALIDATION (Complete)
└── All 6 builds pass (alpha, ui, academy, shop, neoball, marketing)

Phase 7 🚀 LAUNCH (Ready)
```

---

## Design System Reference

### Unified Color Tokens (Neoball DNA)
```css
--c-bg: #050505;
--c-wolf-black: #0a0a0a;
--c-panel: rgba(12, 12, 14, 0.95);
--c-surface: #141414;
--c-cyan: #00f6e0;
--c-cyan-glow: rgba(0, 246, 224, 0.4);
--c-neon-green: #39ff14;
--c-pink: #ff1693;
```

### Font Stack
```css
--font-display: 'Bebas Neue', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Source Reference Folders
| Folder | Purpose | Status |
|--------|---------|--------|
| `/neoball` | Premium static HTML (PDP, shop.html, physics balls) | Reference |
| `/ypsupplyrip` | Shopify.supply reference (crawled Hydrogen patterns) | Reference |
| `apps/shop` | Production Hydrogen store with Neoball design DNA | Active |

---

## Deployment Targets

| App | Platform | URL |
|-----|----------|-----|
| Marketing | Vercel | youthperformance.com |
| Academy | Vercel | app.youthperformance.com |
| Shop | Shopify Oxygen / Cloudflare | shop.youthperformance.com |
| NeoBall LP | Cloudflare Pages | neoball.co |

---

*Update this file after every significant change.*
