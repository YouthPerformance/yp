# Tasks: [FEATURE_NAME]

> **Spec:** `.specify/specs/NNN-feature-slug/spec.md`
> **Plan:** `.specify/specs/NNN-feature-slug/plan.md`
> **Status:** Not Started | In Progress | Blocked | Complete
> **Last Updated:** YYYY-MM-DD

---

## Task Legend

| Marker | Meaning |
|--------|---------|
| `[P]` | **Parallel** - Can run concurrently with other `[P]` tasks |
| `[S]` | **Sequential** - Must run in order |
| `[S:1.1,1.2]` | **Sequential with deps** - Blocked until tasks 1.1 and 1.2 complete |
| `[B]` | **Blocker** - External dependency, cannot proceed |
| `[T]` | **Test** - Verification task |

---

## Progress Summary

| Phase | Tasks | Complete | Status |
|-------|-------|----------|--------|
| Setup | 0/0 | 0% | Not Started |
| Data Layer | 0/0 | 0% | Not Started |
| UI Components | 0/0 | 0% | Not Started |
| Integration | 0/0 | 0% | Not Started |
| Testing | 0/0 | 0% | Not Started |

---

## Phase 1: Setup [P]

Foundation work that can run in parallel.

- [ ] **1.1** Create feature branch `feat/NNN-feature-slug`
  - `git checkout -b feat/NNN-feature-slug`

- [ ] **1.2** Add environment variables (if needed)
  - Files: `apps/*/env.example`, `.env.local`
  - Variables: [list]

---

## Phase 2: Data Layer [S:1.1]

Database and API changes. Sequential after setup.

### Schema Changes [P]
- [ ] **2.1** Add [table/fields] to Convex schema
  - File: `packages/yp-alpha/convex/schema.ts`
  - Changes: [describe]

- [ ] **2.2** Create indexes for [query pattern]
  - File: `packages/yp-alpha/convex/schema.ts`
  - Index: `by_[field]`

### Mutations [S:2.1]
- [ ] **2.3** Create `[mutationName]` mutation
  - File: `packages/yp-alpha/convex/[domain].ts`
  - Args: [list]
  - Returns: [type]

### Queries [S:2.1]
- [ ] **2.4** Create `[queryName]` query
  - File: `packages/yp-alpha/convex/[domain].ts`
  - Args: [list]
  - Returns: [type]

---

## Phase 3: UI Components [S:2.3,2.4]

Frontend components. Sequential after data layer.

### Shared Components [P]
- [ ] **3.1** Create `[ComponentName]` component
  - File: `apps/web-academy/src/components/[Name].tsx`
  - Props: [interface]
  - Exports: [named/default]

- [ ] **3.2** Create `[ComponentName]` component
  - File: `apps/web-academy/src/components/[Name].tsx`
  - Props: [interface]

### Page Components [S:3.1,3.2]
- [ ] **3.3** Create/update `[PageName]` page
  - File: `apps/web-academy/src/app/(app)/[route]/page.tsx`
  - Uses: [components]
  - Data: [queries/mutations]

---

## Phase 4: Integration [S:3.3]

Wire everything together.

- [ ] **4.1** Connect [Component] to [mutation/query]
  - File: `apps/web-academy/src/components/[Name].tsx`
  - Hook: `useMutation(api.[domain].[function])`

- [ ] **4.2** Add navigation/routing
  - File: `apps/web-academy/src/components/navigation/[Nav].tsx`
  - Route: `/[path]`

- [ ] **4.3** Add loading/error states
  - Files: [list affected components]
  - States: loading, error, empty

---

## Phase 5: Testing & QA [S:4.3]

Verification before merge.

### Automated Tests [P]
- [ ] **5.1** [T] Unit tests for [function]
  - File: `packages/yp-alpha/convex/[domain].test.ts`
  - Cases: [list]

- [ ] **5.2** [T] Component tests for [Component]
  - File: `apps/web-academy/src/components/[Name].test.tsx`
  - Cases: [list]

### Manual QA [S:5.1,5.2]
- [ ] **5.3** [T] Verify acceptance criteria
  - [ ] AC-1.1: [criterion]
  - [ ] AC-1.2: [criterion]
  - [ ] AC-2.1: [criterion]

- [ ] **5.4** [T] Cross-browser testing
  - [ ] Chrome (desktop)
  - [ ] Safari (mobile)
  - [ ] Firefox (desktop)

- [ ] **5.5** [T] Run `/prodcheck`
  - [ ] Security scan passes
  - [ ] Performance >= 90
  - [ ] No broken links

---

## Phase 6: Ship [S:5.5]

Final steps to production.

- [ ] **6.1** Create PR with summary
  - Title: `feat(NNN): [feature name]`
  - Body: Link to spec, summary of changes

- [ ] **6.2** Get review approval

- [ ] **6.3** Merge to main

- [ ] **6.4** Verify production deployment

- [ ] **6.5** Update spec status to "Implemented"

---

## Blockers Log

| Task | Blocker | Owner | ETA | Resolved |
|------|---------|-------|-----|----------|
| [task] | [description] | [who] | [when] | [ ] |

---

## Notes

[Any implementation notes, gotchas, or context for future reference]

---

*Generated from plan: `.specify/specs/NNN-feature-slug/plan.md`*
