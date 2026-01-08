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

---

## Stack Overview

| Layer | Technology | Deploy |
|-------|------------|--------|
| Monorepo | Turborepo + pnpm | - |
| Academy | Next.js 15 | Vercel |
| Marketing | Vite + React | Cloudflare Pages |
| Shop | Hydrogen + Remix | Shopify Oxygen |
| Database | Convex | Convex Cloud |
| Auth | Clerk | - |
| AI | Claude (Anthropic) | - |

---

## Key Files Index

| File | Purpose |
|------|---------|
| `turbo.json` | Build orchestration |
| `packages/yp-alpha/convex/schema.ts` | Database schema (source of truth) |
| `packages/yp-alpha/src/router/` | AI routing brain |
| `.claude/docs/project_status.md` | Current sprint context |
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
