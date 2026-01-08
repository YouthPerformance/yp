# 🐺 Wolf Pack Prime

  Read and internalize the following context in order.

  ## 1. Current State (MANDATORY FIRST)
  Read `.claude/docs/project_status.md` to understand:
  - What was just completed
  - Current focus area
  - Active blockers
  - Notes from previous session

  ## 2. Constitution Reference
  The spec-driven constitution lives at `.specify/constitution.md`.
  **Only read if** your task involves:
  - Creating new features (spec required)
  - Architecture decisions
  - Quality gates

  ## 3. Context Routing

  | If task involves... | Load... |
  |---------------------|---------|
  | New feature | `/create-spec` then `.specify/templates/` |
  | Existing spec | `.specify/specs/[NNN-name]/spec.md` |
  | Database changes | `packages/yp-alpha/convex/schema.ts` |
  | Marketing app | `apps/marketing/README.md` or explore `src/` |
  | Shop app | `apps/shop/README.md` or explore `app/` |
  | Academy app | `apps/web-academy/README.md` or explore `src/` |
  | Deployment | `/deploy` command |

  ## 4. Workflow Selection

  Based on task complexity:

  **Quick Fix (< 3 files):**
  Read → Fix → Test → Commit

  **Standard Feature (3-10 files):**
  /plan → Implement → /prodcheck → Commit

  **Complex Feature (> 10 files or cross-app):**
  /create-spec → /plan-product → /execute-tasks

  ## 5. Session End Protocol

  Before ending any session:
  /retro → Update project_status.md → Commit docs

  ---

  **Ready.** State your objective and I'll route to the appropriate workflow.

  ---
  Design Rationale

  | Principle       | Implementation                                            |
  |-----------------|-----------------------------------------------------------|
  | Stable prefix   | Identity + current state always first (KV-cache friendly) |
  | JIT loading     | Routes to docs, doesn't inline them                       |
  | Layered context | State → Principles → Domain → Historical                  |
  | No bloat        | 50 lines vs 500 - only pointers                           |
  | End-state focus | "State your objective" → let agent figure out path        |
  | Position-aware  | Critical rules at top, routing table in middle            |

  What NOT to Include

  - ❌ Full constitution (reference it)
  - ❌ Template contents (load on-demand)
  - ❌ Extensive code examples (bloat)
  - ❌ Step-by-step for every workflow (agent figures it out)
  - ❌ Historical changelogs (stale context)
