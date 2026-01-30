# YP Agents v1

Purpose: define the agent ecosystem for the YP monorepo and how requests flow through YP Alpha and Tom.

---

## System Index (start here)

- Root context: `CLAUDE.md`
- Agent hub: `.claude/docs/index.md`
- Architecture: `.claude/docs/architecture.md`
- Current sprint: `.claude/docs/project_status.md`
- Brain package: `packages/yp-alpha/` (router, memory, Convex)
- Tom COS system: `packages/yp-alpha/src/tom/`
- Apps:
  - Academy: `apps/web-academy/`
  - Marketing: `apps/marketing/`
  - Shop: `apps/shop/`

---

## Core Agents

### 1) YP Alpha (the brain)
- Location: `packages/yp-alpha/`
- Responsibility: shared logic, routing, memory, and voice enforcement
- Routing pipeline (Wolf Pack Protocol):
  - User request -> memory retrieval -> router -> executor -> voice wrapper -> response
  - Memory ingest runs asynchronously
- Model tiers:
  - FAST (Haiku) for data/lookups and simple requests
  - SMART (Sonnet) for coaching, analysis, troubleshooting
  - DEEP (Opus) for planning and complex reasoning
- Source of truth for data: `packages/yp-alpha/convex/schema.ts`

### 2) Tom (Chief of Staff layer)
- Location: `packages/yp-alpha/src/tom/`
- Role: internal COS for the core team; handles captures, summaries, and specialized tools
- Voices by user:
  - mike, james, adam, annie (see `packages/yp-alpha/src/tom/voice.ts`)
- Intent routing:
  - Fast pattern match, then LLM fallback if uncertain
  - Tool access is user-scoped (e.g., trend search for Adam, policy drafts for Annie)

---

## Support Agents (Sub-Agents)

### QA Agent
- File: `.claude/agents/qa-agent.md`
- Purpose: pre-deploy validation (security scan, link audit, build/typecheck)

### Changelog Agent
- File: `.claude/agents/changelog-agent.md`
- Purpose: update `.claude/docs/changelog.md` after feature work

### Retro Agent
- File: `.claude/agents/retro-agent.md`
- Purpose: turn mistakes into rules and update CLAUDE/LEARNINGS docs

---

## Codex Sidekick (proposed)

Goal: assist Tom with fast suggestions without replacing Tom's voice or authority.

### Responsibilities
- Suggest intent classification and next action
- Surface relevant context (memory, project status, blockers)
- Flag risks (security, deploy, data integrity)
- Provide quick options or drafts for Tom to adapt

### Non-Goals
- No direct user-facing responses
- No bypass of Tom voice rules
- No direct data writes without Tom approval

### Proposed Interface
- Input:
  - userId, message, recent context, memory summaries
- Output:
  - intent_hint, tool_hint, draft_options, risk_flags, required_followups

### Placement in Flow
- Pre-response advisor to Tom (before final response is generated)
- Optional post-response review to catch issues

---

## Operating Rules (global)

- Always read the local `CLAUDE.md` before working in a folder
- One Brain: shared logic lives in `packages/yp-alpha`
- Never hardcode secrets; use env vars only
- Before deploy: `pnpm typecheck && pnpm lint`
- For database work: reference `packages/yp-alpha/convex/schema.ts`

---

## How to Use This

1) Start at `.claude/docs/index.md` for quick navigation
2) Follow the layered `CLAUDE.md` system for scoped context
3) Use support agents for QA, changelog updates, and retros
4) Treat Codex as Tom's sidekick: suggestions only, Tom is final

