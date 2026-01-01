# Wolf Pack Workflow Guide

> The complete guide to developing with Claude Code on the YP monorepo.

---

## The PSB Framework

**P**lan → **S**etup → **B**uild

This framework ensures every feature is well-planned, properly configured, and efficiently built.

---

## Phase 1: Plan

### Before You Code

1. **Read Current State**
   ```
   Read .claude/docs/project_status.md
   ```
   Understand where we left off and current priorities.

2. **Define the Goal**
   - What are you trying to do?
   - What does success look like?
   - What are the milestones?

3. **Create a Spec** (for non-trivial features)
   Use the `/feature` command to scaffold:
   - User story
   - Acceptance criteria
   - Technical scope
   - Edge cases

### AI-Assisted Planning

**Ask Claude to ask YOU questions:**
```
I want to build [feature]. What are the 3 most important
questions I need to answer to build this successfully?
```

**Use Plan Mode:**
Press `Shift+Tab` then type `/plan` to enter planning mode before implementation.

---

## Phase 2: Setup

### Session Startup Checklist

- [ ] Read `project_status.md`
- [ ] Check git status for uncommitted changes
- [ ] Verify local dev servers work
- [ ] Review any blockers

### Environment Check
```bash
# Verify stack is working
pnpm dev

# Check for any issues
pnpm typecheck
pnpm lint
```

---

## Phase 3: Build

### Three Development Workflows

#### Workflow 1: General (Single Feature)

```
Research → Plan → Implement → Test → Deploy
```

1. **Research:** Understand existing code patterns
2. **Plan:** Use plan mode, break into steps
3. **Implement:** Build on feature branch
4. **Test:** Verify locally, check edge cases
5. **Deploy:** Run /prodcheck, merge, deploy

**Best for:** New features, refactors, UI changes

#### Workflow 2: Issue-Based (Organized)

```
GitHub Issue → Branch → Implement → PR → Merge
```

1. Create GitHub issue with clear scope
2. Create branch: `feat/issue-name` or `fix/issue-name`
3. Implement with commits referencing issue
4. Create PR with summary and test plan
5. Merge after review

**Best for:** Bug fixes, tracked improvements, team collaboration

#### Workflow 3: Multi-Agent (Parallel)

```
Split Work → Git Worktrees → Parallel Sessions → Merge
```

1. Split work into independent features
2. Create git worktrees for isolation
3. Run parallel Claude sessions
4. Merge branches when complete

**Best for:** Multiple independent features, sprint mode

---

## Daily Workflow

### Starting a Session

```markdown
1. Open Claude Code in yp-monorepo
2. Read project_status.md
3. Check git status
4. Understand current context
5. Begin work
```

### During Development

- **Use plan mode** for complex features
- **Commit frequently** with descriptive messages
- **Update todos** as you complete tasks
- **Test locally** before considering done

### Ending a Session

```markdown
1. Run /retro command
2. Update project_status.md
3. Commit documentation changes
4. Note next steps for handoff
```

---

## Branching Strategy

```
main (production)
  │
  ├── feat/feature-name    # New features
  ├── fix/bug-description  # Bug fixes
  ├── refactor/area        # Refactoring
  └── docs/topic           # Documentation
```

### Branch Rules

- **Never push directly to main**
- **Use PRs for all changes**
- **Delete branches after merge**
- **Keep branches focused and small**

---

## Commit Convention

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- test: Adding tests
- chore: Maintenance

Examples:
- feat(shop): add horizontal scroll hero
- fix(marketing): correct footer links
- docs: update architecture diagram
```

---

## Pre-Deploy Checklist

Run `/prodcheck` which verifies:

- [ ] **Security:** No secrets in client code
- [ ] **Links:** All navigation works
- [ ] **Build:** Compiles without errors
- [ ] **Types:** No TypeScript errors

If any check fails: **NO-GO for deploy**

---

## Slash Command Quick Reference

| Command | When to Use |
|---------|-------------|
| `/plan` | Before implementing complex features |
| `/prodcheck` | Before any production deploy |
| `/retro` | At end of every session |
| `/deploy [app]` | Deploy with pre-flight checks |
| `/feature` | Scaffold a new feature spec |
| `/sync-docs` | Update all automated docs |
| `/phases` | Break work into phased todos |

---

## Context Management

### Keep CLAUDE.md Lean

The CLAUDE.md file is always in context. Keep it focused on:
- Non-negotiable directives
- Stack overview
- Key file pointers
- Common commands

**Don't bloat it** with detailed documentation—link to other files instead.

### Automated Docs Update

At minimum, update docs when:
- A feature ships
- Architecture changes
- A milestone is reached
- A mistake is made (add to LEARNINGS.md)

---

## Productivity Tips

### 1. Use the Best Model
- **Opus 4.5:** Complex planning, architecture decisions
- **Sonnet:** Implementation, feature building
- **Haiku:** Simple tasks, quick fixes

### 2. Regression Prevention
When Claude makes a mistake, type `#` followed by the lesson:
```
# Always use relative imports in this monorepo
```
Claude will incorporate this into CLAUDE.md.

### 3. Don't Be Afraid to Rewind
Code is cheap. If something isn't working:
- Use checkpoints to rewind
- Start fresh with a better approach
- Throw away unsuccessful experiments

### 4. Parallelize When Possible
Ask Claude to use parallel sub-agents for independent tasks:
```
Implement these three features in parallel:
1. Add avatar selection
2. Update footer links
3. Create loading states
```

---

## Troubleshooting

### Claude Seems Lost
1. Check if CLAUDE.md was loaded
2. Reference specific files explicitly
3. Start a fresh session if context is polluted

### Repeated Mistakes
1. Add to LEARNINGS.md
2. Update CLAUDE.md with constraint
3. Consider creating a hook to prevent

### Context Window Full
1. Summarize conversation so far
2. Start fresh session with summary
3. Use sub-agents for isolated tasks

---

## Quick Start Template

Copy this for new sessions:

```
## Session: [Date]

### Goals
- [ ] Primary goal
- [ ] Secondary goal

### Context
Reading from project_status.md...
[Current state summary]

### Work Log
- [Time]: Started on [task]
- [Time]: Completed [task]

### Blockers
- None / [Blocker description]

### Next Steps
- [ ] Next action 1
- [ ] Next action 2
```

---

*Wolf Pack Protocol v1.0*
*"The pack that plans together, ships together."*
