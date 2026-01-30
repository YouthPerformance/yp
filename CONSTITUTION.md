# YouthPerformance Constitution

> The governing principles for all content, code, and agent behavior.

## Mission

**Elite training for every kid, everywhere.**

We build Springs, not Pistons. Movement is life.

---

## Brand Voice Principles

### The Two Voices

| Expert | Archetype | Tone | Domain |
|--------|-----------|------|--------|
| **Adam Harrington** | The Cerebral Architect | Calm, intellectual, chess-player energy | Basketball skills, game IQ |
| **James Scott** | The Movement Scientist | Direct, evidence-based, biomechanics-focused | Speed, agility, strength, injury prevention |

### Voice Enforcement Rules

1. **Every piece of content has ONE primary author** - never blend voices
2. **Use signature phrases** - each expert has hooks that must appear
3. **Banned words are instant rejection** - "master", "perfect", "guarantee"
4. **Preferred terminology** - use the vocabulary replacements defined in voice profiles

---

## Content Quality Gates

### Gate 1: Helpfulness Minimum

Every page MUST include:
- [ ] Quick Answer (2-6 bullets for featured snippets)
- [ ] Age-appropriate safety notes
- [ ] Actionable steps or drill instructions
- [ ] Common mistakes section OR progressions/regressions
- [ ] Internal links (1 pillar + 2 related spokes)
- [ ] Unique asset (tool output, coach cue, proprietary drill, or diagram)

**If missing any → REJECT**

### Gate 2: Similarity Threshold

- Cosine similarity to existing pages must be < 85%
- If above threshold: MERGE or REJECT
- No "different slug, same content" pages

### Gate 3: Youth Safety

- No medical claims or guaranteed results
- No supplement or protocol recommendations without disclaimers
- Age-appropriate language only
- Injury/pain topics require "consult a professional" disclaimer

---

## Technical Standards

### Stack Constraints

| Layer | Technology | Non-Negotiable |
|-------|------------|----------------|
| Database | Convex | Real-time, type-safe |
| Auth | BetterAuth | Unified across apps |
| Payments | Stripe | Server-side only |
| AI | Claude (Anthropic) | Primary generation |
| Hosting | Vercel (apps), Cloudflare (marketing) | Edge-first |

### Code Quality

- TypeScript strict mode
- No `any` types without justification
- Tests for critical paths (auth, payments, workout tracking)
- Zod validation at boundaries

---

## SEO Principles

### The Anti-Thin-Content Rules

1. **Unique Data Fingerprint** - Every programmatic page needs at least one unique datapoint
2. **Structural Mutation** - Different clusters get different page layouts
3. **No Doorway Pages** - If two pages serve the same intent, consolidate

### Content Velocity Targets

| Priority | Cluster | Target Pages | Deadline |
|----------|---------|--------------|----------|
| P0 | Silent Basketball | 100 | Feb 15 |
| P0 | Home Training | 120 | Mar 15 |
| P0 | Girls Basketball | 80 | Apr 15 |
| P1 | Speed & Agility | 200 | May 15 |

---

## Agent Behavior

### Clawdbot/Claude Code Rules

1. **Read before writing** - Never propose changes to code you haven't read
2. **Commit scope** - Only commit files you explicitly changed
3. **Multi-agent safety** - Don't stash, don't switch branches without permission
4. **Verify in code** - Don't guess; confirm in source

### Content Generation Rules

1. **Use the voice guide** - Load full voice profile before generating
2. **Run guardrails** - Every generated page passes through quality gates
3. **Track lineage** - Every page links to its source task in Convex

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-26 | Parallel cluster generation | April product launch requires all P0 content ready |
| 2026-01-26 | 1,000 page target (not 10K) | Quality + human QA bottleneck |
| 2026-01-26 | Silent basketball first | Product tie-in (NeoBall launch) |

---

## Amendment Process

To change this constitution:
1. Propose change in `.claude/specs/`
2. Review with stakeholders
3. Update this document
4. Update related CLAUDE.md sections
