---
description: Plan and implement a new feature using the R3 Framework
---

# Feature Development Command

Structured approach to building new features.

## R3 Framework: Research → Requirements → Realize

### Phase 1: Research

Before writing code, gather context:

1. **Read existing code** in the target area
2. **Check architecture.md** for system design context
3. **Search codebase** for similar patterns
4. **Identify dependencies** and potential conflicts

Output a brief research summary.

### Phase 2: Requirements

Define what success looks like:

1. **User Story**: As a [user], I want [feature], so that [benefit]
2. **Acceptance Criteria**: Specific, testable conditions
3. **Technical Scope**: Files to create/modify
4. **Edge Cases**: What could go wrong?

### Phase 3: Realize

Implement in small, testable increments:

1. **Create feature branch**: `git checkout -b feat/[feature-name]`
2. **Plan mode first**: Break into implementation steps
3. **Implement incrementally**: One component at a time
4. **Test locally**: Verify each piece works
5. **Commit frequently**: Small, descriptive commits

## Template

When starting a feature, fill out:

```markdown
## Feature: [Name]

### Research
- Relevant files: [list]
- Existing patterns: [notes]
- Dependencies: [list]

### Requirements
**User Story:** As a [user], I want [feature], so that [benefit]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Files to Modify:**
- [ ] `path/to/file1.tsx`
- [ ] `path/to/file2.tsx`

### Implementation Plan
1. Step 1
2. Step 2
3. Step 3

### Edge Cases
- Edge case 1: [handling]
- Edge case 2: [handling]
```

## Best Practices

- **Use plan mode** for complex features (shift+tab → /plan)
- **One feature per branch** for clean git history
- **Update docs** if feature changes architecture
- **Add to changelog** when feature ships
