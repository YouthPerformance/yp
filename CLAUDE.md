# YouthPerformance Wolf Pack Protocol v1.0

> **Mission:** Elite training for every kid, everywhere.
> **Philosophy:** We build Springs, not Pistons.

---

## 1. The Directives (Non-Negotiable)

### Before You Act
1. **Read First:** Check `.claude/docs/project_status.md` to see where we left off
2. **No Hallucinations:** Reference `packages/yp-alpha/convex/schema.ts` for any database work
3. **Wolf Guard:** NEVER push to `main` without running `/prodcheck`
4. **One Brain:** All shared logic lives in `packages/yp-alpha` and `packages/ui`. Apps are consumers.

### Safety Rules
- Never expose secrets in client-side code
- Always use environment variables for credentials
- Run security scan before any deploy
- Test on branch before merging to main

---

## 2. The Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Monorepo** | Turborepo + pnpm | `turbo.json` orchestrates builds |
| **Marketing** | Vite + React | Cloudflare Pages (`yp-landing`) |
| **Academy** | Next.js 15 | Vercel (`academy.youthperformance.com`) |
| **Shop** | Hydrogen + Remix | Shopify Oxygen (`shop.youthperformance.com`) |
| **Landing** | Astro | Vercel (`neoball.co`) |
| **Database** | Convex | Real-time, serverless |
| **Auth** | Clerk | SSO, COPPA compliance |
| **Payments** | Stripe | Subscriptions + one-time |
| **AI** | OpenAI + Anthropic | Wolf coach, content generation |

---

## 3. The Map (Context Pointers)

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| `.claude/docs/project_status.md` | Current sprint, blockers, next steps | Every session |
| `.claude/docs/architecture.md` | System design, data flow, integrations | After major features |
| `.claude/docs/changelog.md` | Version history, what shipped | After each deploy |
| `LEARNINGS.md` | Past mistakes, fixes, patterns | After retros |
| `ONBOARDING.md` | User onboarding flows & questions | When flows change |

**Always read `project_status.md` first to understand current context.**

---

## 4. Toolkit (Slash Commands)

| Command | Purpose |
|---------|---------|
| `/prodcheck` | Run Release Wolf QA gate (security, links, performance) |
| `/retro` | End-of-session retrospective, update docs |
| `/plan` | Enter plan mode for feature development |
| `/commit` | Stage, commit with conventional message |
| `/phases` | Break down work into phases with todos |

---

## 5. App-Specific Context

### Marketing (`apps/marketing`)
- **Deploy:** `pnpm build && npx wrangler pages deploy dist --project-name=yp-landing`
- **Local:** `pnpm dev` (port 3004)
- **Router:** React Router in `App.jsx`

### Academy (`apps/web-academy`)
- **Deploy:** Push to main → Vercel auto-deploys
- **Local:** `pnpm dev --turbo`
- **Router:** Next.js App Router (`src/app/`)
- **State:** Convex + Clerk

### Shop (`apps/shop`)
- **Deploy:** `shopify hydrogen deploy` or push to main
- **Local:** `shopify hydrogen dev`
- **Router:** Remix file-based (`app/routes/`)
- **Data:** Shopify Storefront API

---

## 6. Development Workflows

### Single Feature (General)
```
1. Research → Understand requirements
2. Plan → Use /plan mode, break into steps
3. Implement → Build on feature branch
4. Test → Run locally, check edge cases
5. Deploy → /prodcheck then merge
```

### Issue-Based (Organized)
```
1. Create GitHub issue with clear scope
2. Create branch: feat/issue-name
3. Implement with commits referencing issue
4. PR with summary, test plan
5. Merge after review
```

### Multi-Agent (Parallel)
```
1. Split work into independent features
2. Use git worktrees for isolation
3. Run parallel Claude sessions
4. Merge branches when complete
```

---

## 7. Brand Voice (Wolf Pack)

| Term | Use | Don't Use |
|------|-----|-----------|
| Stack | Training session | Workout |
| Drill | Specific exercise | Exercise |
| Chassis | Athlete's body/foundation | Body |
| Pack | Community/team | Group |
| Hunt | Training session | Practice |

**Tone:** Elite, direct, encouraging. No fluff. Like a coach, not a cheerleader.

---

## 8. Quick Reference

### Common Commands
```bash
# Root
pnpm dev          # Start all apps
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm typecheck    # Type check all

# Marketing
cd apps/marketing && pnpm build
npx wrangler pages deploy dist --project-name=yp-landing

# Shop
cd apps/shop && shopify hydrogen deploy

# Academy
# Auto-deploys on push to main via Vercel
```

### Key Files
- `turbo.json` - Build orchestration
- `pnpm-workspace.yaml` - Workspace config
- `packages/yp-alpha/convex/schema.ts` - Database schema
- `apps/*/vercel.json` - Deploy configs

---

## 9. Session Protocol

### Starting a Session
1. Read `.claude/docs/project_status.md`
2. Check git status for uncommitted changes
3. Understand current context before acting

### Ending a Session
1. Run `/retro` to update documentation
2. Commit any documentation changes
3. Update `project_status.md` with next steps

---

*Last updated: January 2026*
*Protocol version: 1.0*
