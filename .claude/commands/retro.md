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

2. **Update Project Status**
   - Read `.claude/docs/project_status.md`
   - Update "Completed This Session" with today's work
   - Move items from "Active" to "Completed"
   - Add any new blockers discovered
   - Update "Notes for Next Session" with handoff context

3. **Update Changelog**
   - If features were shipped, add to `.claude/docs/changelog.md`
   - Group changes under Added/Changed/Fixed/Security
   - Include file paths for significant changes

4. **Update Learnings (if applicable)**
   - If a mistake was made and fixed, document it in `LEARNINGS.md`
   - Include: What happened, why, how it was fixed, prevention

5. **Update Architecture (if applicable)**
   - If new components/services were added, update `.claude/docs/architecture.md`
   - Keep diagrams current

6. **Commit Documentation**
   ```bash
   git add .claude/docs/ LEARNINGS.md
   git commit -m "docs: wolf retro - $(date +%Y-%m-%d)"
   ```

## Output Format

After running retro, output:

```
## Session Retro Complete

### Completed
- [List of completed items]

### Updated Docs
- project_status.md ✓
- changelog.md ✓ (if applicable)
- LEARNINGS.md ✓ (if applicable)

### Next Session Focus
- [Top 3 priorities for next session]
```
