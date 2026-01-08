# YP Constitution

> The immutable principles that govern all YouthPerformance development.
> Every spec, plan, and task must align with this constitution.

---

## Mission

**Elite training for every kid, everywhere.**

We build Springs, not Pistons. We develop athletes who move with elastic efficiency, not mechanical force.

---

## Core Principles

### 1. The Athlete Comes First
Every feature must answer: "Does this help a young athlete train better?"
- If yes → proceed
- If no → reject or redesign

### 2. Parents Are Partners
COPPA compliance isn't optional. Parents must:
- Approve athlete accounts (parent code system)
- Have visibility into training activity
- Control subscription and data

### 3. Simplicity Over Complexity
- One clear path through the app
- No feature bloat
- If it takes more than 3 taps, redesign it

### 4. The Stack is Sacred
Training sessions are "Stacks" - short, focused, stackable:
- **12 minutes max** per session
- **Foundation → Elastic → Engine** progression
- **Daily consistency** over occasional intensity

---

## Technical Constraints

### Architecture
| Constraint | Rationale |
|------------|-----------|
| Shared logic in `@yp/alpha` | One brain, multiple apps |
| Convex for real-time data | Offline-first, sync when connected |
| Clerk for auth | COPPA compliance, SSO |
| Stripe for payments | Subscriptions + one-time |

### Security (Non-Negotiable)
- **Never** expose API keys in client code
- **Never** store PII beyond what's necessary
- **Always** validate on server, not just client
- **Always** run `/prodcheck` before deploy

### Performance Targets
| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 90 |
| LCP | < 2.5s |
| Time to Interactive | < 3s |
| Bundle Size (initial) | < 200KB |

---

## Brand Voice

### We Are
- **Elite** - Professional quality, not amateur hour
- **Direct** - Say it once, say it clearly
- **Encouraging** - Push hard, but with respect

### We Are NOT
- Childish or condescending
- Overly technical with users
- Fluffy or vague

### Vocabulary
| Use | Don't Use |
|-----|-----------|
| Stack | Workout |
| Drill | Exercise |
| Chassis | Body |
| Pack | Group/Team |
| Hunt | Practice |
| Wolf | Coach/AI |

---

## Product Boundaries

### In Scope
- Training content (video, guided sessions)
- Progress tracking (XP, streaks, levels)
- AI coaching (Wolf - personalized guidance)
- Commerce (NeoBall, gear)
- Parent oversight (dashboard, controls)

### Out of Scope
- Social features (no public profiles, no messaging)
- User-generated content
- Live coaching/video calls
- Team management (v1)

---

## Quality Gates

Every feature must pass before merge:

### 1. Spec Complete
- [ ] User stories defined
- [ ] Acceptance criteria testable
- [ ] Edge cases documented

### 2. Plan Approved
- [ ] Technical approach reviewed
- [ ] File paths identified
- [ ] No architecture violations

### 3. Implementation Verified
- [ ] All acceptance criteria met
- [ ] No console errors
- [ ] Mobile responsive (375px minimum)
- [ ] Accessible (keyboard nav, screen reader)

### 4. Production Ready
- [ ] `/prodcheck` passes
- [ ] No secrets exposed
- [ ] Performance targets met
- [ ] Links verified

---

## Decision Framework

When faced with ambiguity, ask in order:

1. **Is it safe?** (Security, privacy, COPPA)
2. **Does it serve the athlete?** (Training value)
3. **Is it simple?** (UX clarity)
4. **Is it sustainable?** (Tech debt, maintenance)

If any answer is "no" - stop and redesign.

---

## Governance

### Who Can Change This Constitution
- Only the YP core team (Mike + designated maintainers)
- Requires explicit discussion, not casual edits
- All changes logged with rationale

### How Specs Reference This
Every spec must include:
```markdown
## Constitution Alignment
- [ ] Principle 1: Athlete First - [explanation]
- [ ] Principle 2: Parents Partners - [explanation]
- [ ] Principle 3: Simplicity - [explanation]
- [ ] Principle 4: Stack Sacred - [explanation]
```

---

*Last Updated: January 2, 2026*
*Version: 1.0*
