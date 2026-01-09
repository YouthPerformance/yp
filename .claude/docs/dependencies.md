# Dependency Graph

> **What depends on what.** Understand impact before changing.

---

## Package Dependencies

```
                    ┌─────────────────┐
                    │   @yp/alpha     │  (The Brain)
                    │  - Convex SDK   │
                    │  - Anthropic    │
                    │  - Zod          │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       ┌──────────┐   ┌──────────┐   ┌──────────┐
       │  Shop    │   │ Academy  │   │    UI    │
       │ Hydrogen │   │ Next.js  │   │  React   │
       └────┬─────┘   └────┬─────┘   └────┬─────┘
            │              │              │
            │              │              │
            ▼              ▼              ▼
       ┌──────────┐   ┌──────────┐   ┌──────────┐
       │ Neoball  │   │Marketing │   │ Playbook │
       │  Astro   │   │   Vite   │   │  Astro   │
       └──────────┘   └──────────┘   └──────────┘
```

---

## Workspace Dependencies

| Package | Depends On | Dependents |
|---------|------------|------------|
| `@yp/alpha` | - | Academy, Shop |
| `@yp/ui` | - | Academy, Shop, Marketing, Neoball |
| `@yp/web-academy` | `@yp/alpha`, `@yp/ui` | - |
| `@yp/shop` | `@yp/alpha`, `@yp/ui` | - |
| `@yp/marketing` | `@yp/ui` | - |
| `@yp/neoball-lp` | `@yp/ui` | - |
| `playbook` | - | - |
| `@yp/vision` | - | - |

---

## Build Order

Turbo handles this automatically, but for reference:

```
1. @yp/alpha     (no deps, build first)
2. @yp/ui        (no deps, build first)
3. Apps          (parallel after packages)
```

---

## Impact Analysis

### If you change `@yp/alpha`:
- Rebuild: Academy, Shop
- Redeploy: Vercel (Academy), Oxygen (Shop)
- Test: AI routing, Convex functions, voice APIs

### If you change `@yp/ui`:
- Rebuild: Academy, Shop, Marketing, Neoball
- Redeploy: All frontends
- Test: Visual regression on shared components

### If you change `convex/schema.ts`:
- Run: `npx convex deploy`
- Impact: All apps using Convex
- Risk: Data migration may be needed

---

## External Dependencies (Critical)

| Dependency | Version | Used By | Upgrade Risk |
|------------|---------|---------|--------------|
| `next` | 16.x | Academy, Vision | High (breaking changes) |
| `@remix-run/*` | 2.x | Shop | Medium |
| `astro` | 5.x | Playbook | Medium |
| `astro` | 4.x | Neoball | Low |
| `convex` | 1.31.x | All | Low |
| `@clerk/*` | 6.x | Academy | Medium |
| `tailwindcss` | 3.x | All | Low |
| `framer-motion` | 11.x | Academy | Low |

---

## Upgrade Strategy

1. **Patch versions** (x.x.1 → x.x.2): Auto-merge OK
2. **Minor versions** (x.1.0 → x.2.0): Test in branch
3. **Major versions** (1.0 → 2.0): Spec + Plan required

---

## Lock File

Using `pnpm-lock.yaml` (workspace root). Never commit partial lock files.

```bash
# Update all deps
pnpm update

# Update specific package
pnpm update next --filter @yp/web-academy

# Check outdated
pnpm outdated
```

---

*Updated: January 7, 2026*
