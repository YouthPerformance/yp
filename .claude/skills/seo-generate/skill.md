# /seo-generate - AI SEO Content Engine

> Generate SEO pages directly from the Knowledge Graph using Claude Code.
> No API keys. No CLI. Just point and generate.

## Trigger

`/seo-generate [cluster] [count]`

Examples:
- `/seo-generate silent-basketball 5`
- `/seo-generate home-training 10`
- `/seo-generate all-pillars`

## Workflow

### Step 1: Load Knowledge Graph
```
Read: tools/machine-sprint/output/seo-tasks.json
```

### Step 2: Filter Tasks
Filter by:
- `payload.cluster` (silent-basketball, home-training, ball-handling, shooting, barefoot)
- `priority` (1 = highest)
- `payload.type` (pillar, spoke, qa, drill)

### Step 3: Load Voice Guides
```
Read: .claude/derived/adam-voice-guide.md (skills, strategy, shooting)
Read: .claude/derived/james-voice-guide.md (biomechanics, movement, barefoot)
```

### Step 4: Generate Content
For each task, generate:
- `title` - SEO-optimized H1
- `meta_description` - 155 chars max
- `quick_answer` - 3-6 bullet points (featured snippet bait)
- `content` - Full markdown article with:
  - WHY section (philosophy/context)
  - WHAT section (the protocol/drill)
  - HOW section (execution details)
  - Age/skill progressions
  - Coach's Corner (first-person expert sign-off)
  - Related topics/internal links
- `schema_type` - HowTo, FAQPage, or Article

### Step 5: Output
Save to: `tools/machine-sprint/output/pages/[taskId].json`

Or deploy directly to:
- `apps/marketing/src/pages/basketball/[slug].jsx` (Vite/React)
- `apps/playbook/src/pages/basketball/[slug].astro` (Astro - if exists)

## Voice Rules

### Adam Harrington (skills, strategy, shooting)
- Archetype: "The Cerebral Architect"
- Tone: Calm, intellectual, chess-player energy
- Power words: Balance, Consistency, Foundation, Investment, Efficient
- Sign-off: "— Adam Harrington, NBA Skills Coach"

### James Scott (biomechanics, movement, barefoot)
- Archetype: "The Movement Scientist"
- Tone: Direct, evidence-based, biomechanics-focused
- Power words: Ground contact, Proprioception, Springs (not pistons)
- Sign-off: "— James Scott, Co-founder & Director of Athletic Development"

## Banned Words
- "Journey" (overused)
- "Unlock your potential" (cliche)
- "Game-changer" (hype)
- Generic fitness jargon

## NeoBall CTA Trigger
If cluster is `silent-basketball` or `home-training`, append:

```markdown
## Level Up Your Silent Training

**Train Silent. Train Anywhere.**

The world's best silent basketball—according to the kids.

[Enter the Draft →](https://neoball.co)
```

## Example Invocation

```
/seo-generate silent-basketball 5
```

This will:
1. Read seo-tasks.json
2. Filter for silent-basketball cluster, priority 1-2
3. Generate 5 pages using Adam's voice
4. Save to output/pages/
5. Report what was generated
