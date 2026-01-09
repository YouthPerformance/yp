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
| Auth | Clerk | - | - |
| AI | Claude (Anthropic) | - | - |

> **Port conflicts?** See `.claude/docs/ports.md` for full registry and troubleshooting.

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

# Single app
pnpm turbo run dev --filter=@yp/web-academy
```

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
