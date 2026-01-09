# Agent Quick Reference Index

> **TL;DR for agents.** Jump to what you need in one hop.

---

## By Task

| I need to... | Go here |
|--------------|---------|
| Understand the project | `CLAUDE.md` (root) |
| Check current sprint | `.claude/docs/project_status.md` |
| See architecture | `.claude/docs/architecture.md` |
| Find a port | `.claude/docs/ports.md` |
| Check env vars | `.claude/docs/env-registry.md` |
| Fix common errors | `.claude/docs/troubleshooting.md` |

---

## By App

| App | Port | CLAUDE.md | Entry Point |
|-----|------|-----------|-------------|
| Shop | 3001 | `apps/shop/CLAUDE.md` | `apps/shop/app/routes/_index.tsx` |
| Neoball | 3002 | - | `apps/neoball-lp/src/pages/index.astro` |
| Academy | 3003 | `apps/web-academy/CLAUDE.md` | `apps/web-academy/src/app/page.tsx` |
| Marketing | 3004 | `apps/marketing/CLAUDE.md` | `apps/marketing/src/App.jsx` |
| Vision | 3005 | - | `apps/yp-vision/src/app/page.tsx` |
| Playbook | 3006 | - | `apps/playbook/src/pages/index.astro` |

---

## By Package

| Package | Purpose | Key File |
|---------|---------|----------|
| `@yp/alpha` | AI brain, Convex, shared logic | `packages/yp-alpha/CLAUDE.md` |
| `@yp/ui` | Shared React components | `packages/ui/src/index.ts` |

---

## Database

| Need | File |
|------|------|
| Schema (source of truth) | `packages/yp-alpha/convex/schema.ts` |
| User functions | `packages/yp-alpha/convex/users.ts` |
| Progress tracking | `packages/yp-alpha/convex/progress.ts` |

---

## Commands (Quick)

```bash
# Start specific app
pnpm turbo run dev --filter=@yp/web-academy

# Build all
pnpm build

# Typecheck all
pnpm typecheck

# Lint all
pnpm lint

# Deploy Convex
cd packages/yp-alpha && npx convex deploy
```

---

## Slash Commands

| Command | Purpose |
|---------|---------|
| `/prime` | Load session context |
| `/retro` | End-of-session retrospective |
| `/deploy` | Production deploy with checks |
| `/feature` | Plan and implement feature |
| `/sync-docs` | Update all auto-docs |

---

## File Patterns

| Pattern | What It Finds |
|---------|---------------|
| `**/CLAUDE.md` | All context files |
| `apps/*/package.json` | All app configs |
| `packages/*/package.json` | All package configs |
| `**/schema.ts` | Database schemas |
| `**/*.env*` | Environment files |

---

*Updated: January 7, 2026*
