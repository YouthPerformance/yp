---
description: Sync all automated documentation with current codebase state
---

# Sync Documentation

Update all automated documentation to reflect current codebase state.

## Documents to Update

### 1. Architecture (`architecture.md`)
- Scan for new files/folders in apps/
- Update component diagrams if structure changed
- Verify external service list is current

### 2. Project Status (`project_status.md`)
- Review git log for recent commits
- Update completed items
- Refresh blockers list
- Update deploy status

### 3. Changelog (`changelog.md`)
- Add unreleased changes since last entry
- Group by Added/Changed/Fixed/Security

### 4. LEARNINGS.md
- Check for any new patterns worth documenting
- Remove outdated learnings

## Process

```bash
# 1. Check recent changes
git log --oneline -20

# 2. Check file structure changes
git diff --stat HEAD~10

# 3. Update each doc
# (Manual review and updates)

# 4. Commit updates
git add .claude/docs/ LEARNINGS.md
git commit -m "docs: sync automated documentation"
```

## Output

```
## Documentation Sync Complete

### Updated Files
- architecture.md: [changes summary]
- project_status.md: [changes summary]
- changelog.md: [changes summary]

### No Changes Needed
- LEARNINGS.md (current)

### Committed
- Hash: [commit-hash]
```
