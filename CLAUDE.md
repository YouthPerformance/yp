# YouthPerformance Monorepo

> **Mission:** Elite training for every kid, everywhere.
> **Philosophy:** We build Springs, not Pistons.

---

## Layered Context System

This monorepo uses **layered CLAUDE.md files**. Read only what you need:

| Working In | Read This First |
|------------|-----------------|
| Root / General | This file |
| `packages/yp-alpha` | `packages/yp-alpha/CLAUDE.md` (AI brain, Convex, memory) |
| `apps/web-academy` | `apps/web-academy/CLAUDE.md` (Academy app) |
| `apps/marketing` | `apps/marketing/CLAUDE.md` (Marketing site) |
| `apps/shop` | `apps/shop/CLAUDE.md` (Shopify store) |

**Dynamic context:** `.claude/docs/project_status.md` has current sprint info.

---

## Core Directives

### Before Any Code Change
1. **Read context** - Check the CLAUDE.md in your working directory
2. **No hallucinations** - Reference `packages/yp-alpha/convex/schema.ts` for database
3. **One Brain** - All shared logic lives in `packages/yp-alpha`. Apps are consumers.
4. **No secrets in code** - Use environment variables only

### Before Any Deploy
1. Run `pnpm typecheck && pnpm lint`
2. Run security scan (CI does this automatically)
3. Test on branch first, never push directly to main

### Never Do (Learned the Hard Way)

> **Pattern:** Every mistake becomes a rule. Update this table via `/retro`.

| Don't | Instead | Why | Added |
|-------|---------|-----|-------|
| Commit `.env` files or tokens to git | Use `.gitignore` + env vars + secrets manager | Security breach - exposed Shopify tokens | 2026-01 |
| Push directly to main/master | Use PR workflow with branch protection | Bypasses review, breaks CI gates | 2026-01 |
| Skip `pnpm typecheck` before deploy | Always run typecheck first | Silent type errors cause build failures | 2026-01 |
| Write shared logic in app folders | Put reusable code in `@yp/alpha` | "One Brain" principle - apps are consumers | 2026-01 |
| Change `schema.ts` without `npx convex dev` | Always sync Convex after schema changes | Type mismatches, runtime errors | 2026-01 |
| Guess database field names | Reference `packages/yp-alpha/convex/schema.ts` | Hallucinated fields cause silent failures | 2026-01 |
| Use `workspace:*` with Vercel CLI deploys | Use GitHub integration for monorepo apps | CLI can't resolve workspace dependencies | 2026-01 |
| Hardcode secrets or use placeholder values | Require env vars, fail fast if missing | JWT_SECRET placeholder caused auth bypass | 2026-01 |

---

## Stack Overview

| Layer | Technology | Deploy | Dev Port |
|-------|------------|--------|----------|
| Monorepo | Turborepo + pnpm | - | - |
| Shop | Hydrogen + Remix | Shopify Oxygen | 3001 |
| Neoball LP | Astro | - | 3002 |
| Academy | Next.js 16 | Vercel | 3003 |
| Marketing | Vite + React | Cloudflare Pages | 3004 |
| YP Vision | Next.js 14 | - | 3005 |
| Playbook | Astro | Vercel | 3006 |
| Database | Convex | Convex Cloud | 8188 |
| Auth | BetterAuth | - | - |
| AI | Claude (Anthropic) | - | - |

> **Port conflicts?** See `.claude/docs/ports.md` for full registry and troubleshooting.

---

## Commerce Systems

YP has **two separate commerce systems**. Don't confuse them.

| System | Platform | Payments | Products | Location |
|--------|----------|----------|----------|----------|
| **Shop** | Shopify Hydrogen | Shopify Payments | Physical goods (NeoBall, merch) | `apps/shop/` (Oxygen) |
| **Academy** | Next.js | Stripe | Digital (SaaS, programs, info products) | `apps/web-academy/` (Vercel) |

### Academy Stripe Products (Digital)
| Product | Type | Price | Status |
|---------|------|-------|--------|
| Barefoot Reset 88 | One-time | $88 | Live |
| Pro Subscription | SaaS | TBD | Planned |
| Season Pass | Subscription | TBD | Planned |
| Info Products | One-time | Varies | Planned |

### Stripe Integration (Academy)
- **Checkout:** `apps/web-academy/src/app/api/checkout/route.ts`
- **Webhooks:** `apps/web-academy/src/app/api/webhooks/stripe/route.ts`
- **Flow:** Checkout → Stripe → Webhook → Convex (entitlements + subscription)

### Shopify Integration (Shop)
- Separate from Academy - physical products only
- Uses Shopify Payments (not Stripe)
- Golden tickets connect purchases to Academy entitlements

---

## Agent Context Hub

> **Start here.** `.claude/docs/index.md` is the single-hop reference for everything.

| Doc | Purpose |
|-----|---------|
| `.claude/docs/index.md` | **Quick reference index (start here)** |
| `.claude/docs/project_status.md` | Current sprint context |
| `.claude/docs/ports.md` | Port registry |
| `.claude/docs/env-registry.md` | Environment variables |
| `.claude/docs/dependencies.md` | Package dependency graph |
| `.claude/docs/cheatsheet.md` | Common commands |
| `.claude/docs/troubleshooting.md` | Error fixes |
| `.claude/docs/architecture.md` | System design |

---

## Private Context Vault

Proprietary brand documents are stored locally and never committed to git.

```
.claude/
├── private/           # GITIGNORED - Proprietary docs stay local
│   ├── adam/          # Adam Harrington brand assets
│   ├── james/         # James Scott brand assets
│   └── mike/          # Mike Di brand assets
├── derived/           # COMMITTED - Sanitized voice guides for agents
│   ├── adam-voice-guide.md
│   ├── james-voice-guide.md
│   └── mike-voice-guide.md
└── docs/              # COMMITTED - Agent context docs
```

### For Content Generation
1. Read derived guides from `.claude/derived/` for voice patterns
2. Reference TypeScript voice definitions in `packages/yp-alpha/src/voices/` for production AI

### For Updating Voice Guides
1. Read private docs from `.claude/private/`
2. Update derived guides (commit-safe)
3. Update TS voice files if needed

---

## Key Files Index

| File | Purpose |
|------|---------|
| `turbo.json` | Build orchestration |
| `packages/yp-alpha/convex/schema.ts` | Database schema (source of truth) |
| `packages/yp-alpha/src/router/` | AI routing brain |
| `.github/ENVIRONMENTS.md` | CI/CD secrets setup |

---

## Commands

```bash
# Development
pnpm dev                    # Start all apps
pnpm build                  # Build all
pnpm typecheck              # Type check all
pnpm lint                   # Lint all
pnpm test                   # Run all tests
pnpm test:critical          # Run critical path tests only

# Single app
pnpm turbo run dev --filter=@yp/web-academy
pnpm turbo run test --filter=@yp/web-academy
```

---

## Testing Strategy

> **Philosophy:** Test what matters. Auth, payments, and data mutations are critical. UI can be manually tested.

### Critical Test Coverage
| Area | What We Test | Why |
|------|--------------|-----|
| Auth | Session validation, OTP flow, user creation | Login breaks = everything breaks |
| Stripe | Webhook signatures, checkout creation, subscription updates | Money = trust |
| Convex | Authorization, user mutations, entitlement updates | Data corruption = disaster |

### Test Locations
```
packages/yp-alpha/src/__tests__/     # Shared logic, Convex mocks
apps/web-academy/src/__tests__/      # Academy-specific (Stripe, auth)
```

### For Onboarding Agents
Before making changes:
1. Run `pnpm test:critical` - must pass
2. If adding auth/payment/data logic, add tests
3. Never skip webhook signature validation
4. See `TESTING.md` for mocking patterns

---

## Session Protocol

### Starting
1. Check git status
2. Read `.claude/docs/project_status.md`
3. Read the CLAUDE.md in your target directory

### Ending
1. Update `project_status.md` with what was done
2. Commit with conventional message

---

## Brand Voice

| Use | Don't Use |
|-----|-----------|
| Stack | Workout |
| Drill | Exercise |
| Chassis | Body |
| Pack | Group |

**Tone:** Elite, direct, encouraging. No fluff.
