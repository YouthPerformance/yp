---
description: End-of-session retrospective - update docs and learnings
---

# Session Retrospective

Run this command at the end of every development session to maintain project memory.

## Steps

1. **Analyze the Session**
   - What tasks were completed?
   - What went wrong or caused friction?
   - What patterns emerged that should be documented?

2. **Capture Mistakes → Rules** (Boris Cherny Pattern)

   > **"Every mistake becomes a rule"** - If something broke, add it to CLAUDE.md so it never happens again.

   For each mistake/friction point:
   - **Determine scope:**
     - Global (all projects) → `~/.claude/CLAUDE.md`
     - Project-wide → `/CLAUDE.md` "Never Do" table
     - App-specific → `apps/*/CLAUDE.md` "Anti-Patterns" table
   - **Format:** `| Don't | Instead | Why | YYYY-MM |`
   - **Append** to the appropriate table (don't replace)

   Example:
   ```markdown
   | Skip typecheck before deploy | Run `pnpm typecheck` first | Build failed on Vercel | 2026-01 |
   ```

3. **Update Project Status**
   - Read `.claude/docs/project_status.md`
   - Update "Completed This Session" with today's work
   - Move items from "Active" to "Completed"
   - Add any new blockers discovered
   - Update "Notes for Next Session" with handoff context

4. **Update Changelog**
   - If features were shipped, add to `.claude/docs/changelog.md`
   - Group changes under Added/Changed/Fixed/Security
   - Include file paths for significant changes

5. **Update LEARNINGS.md (if applicable)**
   - For historical context/wiki entries (not rules)
   - Include: What happened, why, how it was fixed

6. **Update Architecture (if applicable)**
   - If new components/services were added, update `.claude/docs/architecture.md`
   - Keep diagrams current

7. **Commit Documentation**
   ```bash
   git add .claude/docs/ CLAUDE.md apps/*/CLAUDE.md LEARNINGS.md
   git commit -m "docs: wolf retro - $(date +%Y-%m-%d)"
   ```

## Output Format

After running retro, output:

```
## Session Retro Complete

### Completed
- [List of completed items]

### Mistakes → Rules Added
- [CLAUDE.md location]: [rule summary]
- (none if no mistakes)

### Updated Docs
- project_status.md ✓
- CLAUDE.md ✓ (if rules added)
- changelog.md ✓ (if applicable)

### Next Session Focus
- [Top 3 priorities for next session]
```
