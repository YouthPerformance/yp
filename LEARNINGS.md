# YP Monorepo Learnings Wiki

> **Purpose:** Context preservation for agent handoffs. Update this file after significant changes.
>
> **Last Updated:** 2024-12-30
> **Phase:** 2 (Scaffold Complete)

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
│   └── web-academy/        # Next.js 16 - THE CORE PRODUCT
│       ├── convex/         # Real-time DB (Convex)
│       ├── src/            # App source
│       └── package.json    # @yp/web-academy
│
├── packages/
│   ├── yp-alpha/           # THE BRAIN - AI routing layer
│   │   └── src/
│   │       ├── config/     # Model configs
│   │       ├── router/     # Wolf router, voice wrapper
│   │       └── tools/      # Daily stack generator
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

---

## Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2024-12-30 | Use Turborepo + pnpm | Industry standard, fast builds, workspace linking |
| 2024-12-30 | Package naming: `@yp/*` | Clean namespace, easy imports |
| 2024-12-30 | Brain package: `@yp/alpha` | Contains AI routing, model configs, voice wrapper |
| 2024-12-30 | Academy from `/bfr/barefoot-app` | Most complete version of the training app |
| 2024-12-30 | Design tokens in `@yp/ui` | Wolf Black (#0A0A0A), Neon Green (#39FF14) |

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

# Adding dependencies
pnpm add <pkg> --filter @yp/web-academy
pnpm add <pkg> --filter @yp/ui -D

# Workspace linking (already configured)
# "@yp/alpha": "workspace:*" in package.json
```

---

## Known Issues & TODOs

### Immediate
- [ ] `@yp/alpha` needs Convex peer dep properly configured
- [ ] `@yp/ui` needs more components (Card, Input, Hero)
- [ ] web-academy Convex schema should move to shared package
- [ ] Initialize git repo

### Phase 3 (Next)
- [ ] Convert `/neoball` → `apps/neoball-lp` (Astro)
- [ ] Build `apps/shop` (Hydrogen)
- [ ] Move `/Linear-Coding-Agent-Harness` → `cloud-code/agents`
- [ ] Extract shared Convex schema to `@yp/alpha/convex`

### Cleanup (Eventually)
- [ ] Archive 200+ scattered folders in `~/yp-archive/`
- [ ] Consolidate duplicate agent harness copies
- [ ] Remove old barefoot iterations

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

---

*Update this file after every significant change.*
