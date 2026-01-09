# Age-Specific Page Template

> **Word Count:** 1,500-2,500 words
> **Purpose:** Long-tail age query capture, high-intent parent traffic
> **Review Required:** Expert review

---

## The Age Query Goldmine

Parents search by EXACT AGE. This template captures:
- "basketball drills for 8 year olds"
- "drills for 10 year old basketball players"
- "youth basketball training 12 year old"

---

## Frontmatter

```yaml
---
title: "Basketball Drills for [X]-Year-Olds: [Count]+ Age-Appropriate Drills"
description: "Expert-curated basketball drills specifically designed for [X]-year-old players. Developmentally appropriate, fun, and effective. From NBA skills coach Adam Harrington."
author: "[adam-harrington | james-scott]"
publishedDate: [YYYY-MM-DD]
updatedDate: [YYYY-MM-DD]
readTime: "[X] min read"
directAnswer: "**The best basketball drills for [X]-year-olds focus on [key focus area]. At this age, players need [developmental priority 1] and [developmental priority 2]. Sessions should be [duration] and emphasize [approach]. Here are [count] drills perfect for this age...**"
keyTakeaways:
  - "[Developmental reality at this age]"
  - "[Session length recommendation]"
  - "[Key skill focus]"
  - "[What to avoid]"
  - "[Expected progression]"
category: "[basketball | barefoot-training | speed-agility | strength-training]"
subcategory: "by-age"
targetAge: [X]
keywords:
  - "[sport] drills for [X] year olds"
  - "[X] year old [sport] training"
  - "[sport] drills [X] year old"
  - "youth [sport] drills age [X]"
  - "best [sport] drills for [X] year olds"
canonical: "https://playbook.youthperformance.com/[sport]/[X]-year-old-[sport]-drills/"
theme: "[basketball | barefoot]"
relatedPillar: "/[sport]/"
ageGroup: "[u8 | u10 | u12 | u14 | high-school]"
---
```

---

## Page Structure

### Hero Section
```markdown
# [Sport] Drills for [X]-Year-Olds

**[DEFINITION BLOCK - 40-60 words]**
**At [X] years old, [developmental reality]. The best drills for this age focus on [priority 1], [priority 2], and [priority 3]. Sessions should be [duration] with [approach]. Here are [count] drills designed specifically for [X]-year-old [athletes/players]...**
```

### Developmental Context
```markdown
## What to Expect from a [X]-Year-Old

[1-2 paragraphs on the developmental reality at this specific age]

**Physical Development:**
- [Motor skill reality]
- [Coordination level]
- [Attention span]

**Mental Development:**
- [Understanding of instructions]
- [Competitive awareness]
- [Self-correction ability]

**What This Means for Training:**
- [Session length recommendation]
- [Drill complexity level]
- [Coaching approach]

<CoachVoice author="[expert]">
[2-3 sentences on what the expert has observed coaching this age group]
</CoachVoice>
```

### The Core Drills
```markdown
## [Count] Best Drills for [X]-Year-Olds

### Drill Category 1: [Skill Area]

<DrillCard
  title="[Drill Name]"
  description="[Why this works for this age]"
  duration="[X] min"
  difficulty="[appropriate for age]"
  ageNote="Perfect for [X]-year-olds because [specific reason]"
  steps={[...]}
  coachingCues={[...]}
/>

[Repeat for 5-8 drills organized by category]
```

### What NOT to Do
```markdown
## What to Avoid at Age [X]

These common mistakes can hurt development or kill motivation:

❌ **[Mistake 1]:** [Why it's wrong for this age]
✅ **Instead:** [What to do]

❌ **[Mistake 2]:** [Why it's wrong for this age]
✅ **Instead:** [What to do]

❌ **[Mistake 3]:** [Why it's wrong for this age]
✅ **Instead:** [What to do]
```

### Sample Practice Plan
```markdown
## Sample [X]-Minute Practice for [X]-Year-Olds

| Time | Activity | Purpose |
|------|----------|---------|
| 0:00-[X]:00 | [Warm-up activity] | [Why] |
| [X]:00-[X]:00 | [Drill 1] | [Why] |
| [X]:00-[X]:00 | [Drill 2] | [Why] |
| [X]:00-[X]:00 | [Fun game/scrimmage] | [Why] |
| [X]:00-[X]:00 | [Cool-down] | [Why] |

**Total:** [X] minutes (appropriate for [X]-year-old attention span)
```

### Parent Tips
```markdown
## Tips for Parents of [X]-Year-Olds

**At practice:**
- [Behavior/expectation 1]
- [Behavior/expectation 2]

**At home:**
- [How to support 1]
- [How to support 2]

**Signs of progress to look for:**
- [Observable milestone 1]
- [Observable milestone 2]

**When to be concerned:**
- [Red flag 1]
- [Red flag 2]
```

### Age Progression
```markdown
## What Comes Next?

At [X+1] years old, your child will be ready for:
- [New skill/drill type 1]
- [New skill/drill type 2]
- [Increased complexity/duration]

[Link to [X+1]-year-old drills page]

**Looking back:** If your child is struggling with these drills, try [link to [X-1]-year-old page] first.
```

### Related Ages
```markdown
## Related Age Guides

- **[[X-1]-Year-Old Drills](/[path]/)** - One step easier
- **[[X+1]-Year-Old Drills](/[path]/)** - Next progression
- **[U[bracket] Complete Guide](/[path]/)** - Full age group overview
```

---

## Age-Specific Guidelines

### Ages 5-7 (U8)
```yaml
sessionLength: "15-25 minutes"
approach: "Play-based, game-focused"
skillFocus: "Basic motor patterns, ball familiarity"
drillComplexity: "1-2 step instructions"
competitiveness: "Minimal - focus on fun"
coachLanguage: "Visual demos, simple cues"
parentRole: "Active participation encouraged"
avoid:
  - "Standing in lines"
  - "Complex multi-step drills"
  - "Competitive pressure"
  - "Position specialization"
  - "Winning/losing emphasis"
```

### Ages 8-9 (U10)
```yaml
sessionLength: "30-45 minutes"
approach: "Structured play with purpose"
skillFocus: "Fundamental skills, coordination"
drillComplexity: "2-3 step instructions"
competitiveness: "Friendly competition ok"
coachLanguage: "Explain WHY, not just WHAT"
parentRole: "Supportive spectator"
avoid:
  - "Over-coaching technique"
  - "Too much standing"
  - "Adult-level intensity"
  - "Single-sport specialization"
```

### Ages 10-11 (U12)
```yaml
sessionLength: "45-60 minutes"
approach: "Skill-focused with game application"
skillFocus: "Technical refinement, game awareness"
drillComplexity: "Multi-step with progressions"
competitiveness: "Healthy competition encouraged"
coachLanguage: "Introduce concepts, encourage questions"
parentRole: "Let coach lead"
avoid:
  - "Over-emphasis on winning"
  - "Burnout schedules"
  - "Ignoring mental skills"
  - "Comparing to others"
```

### Ages 12-13 (U14)
```yaml
sessionLength: "60-75 minutes"
approach: "Competition prep with skill work"
skillFocus: "Position skills, tactical awareness"
drillComplexity: "Full progressions, self-correction"
competitiveness: "Real competition, learn from losses"
coachLanguage: "Athlete-led problem solving"
parentRole: "Support, don't coach from sidelines"
avoid:
  - "Burning out on one sport"
  - "Ignoring strength/conditioning"
  - "Recruiting pressure"
  - "Over-scheduling"
```

### Ages 14-18 (High School)
```yaml
sessionLength: "75-90 minutes"
approach: "Performance-focused"
skillFocus: "Advanced skills, game IQ, physical development"
drillComplexity: "Elite-level detail"
competitiveness: "High stakes, learn to perform under pressure"
coachLanguage: "Athlete ownership of development"
parentRole: "Advocate, not coach"
avoid:
  - "Neglecting rest/recovery"
  - "Single-dimensional training"
  - "Ignoring mental health"
  - "Short-term thinking"
```

---

## Quality Checklist

- [ ] Title includes exact age (not range)
- [ ] Definition block mentions the specific age
- [ ] Developmental context is age-accurate (not generic)
- [ ] Drills are truly appropriate for the age
- [ ] Session length matches age attention span
- [ ] "What to Avoid" section is specific to age
- [ ] Sample practice plan fits age-appropriate duration
- [ ] Links to adjacent ages (X-1 and X+1)
- [ ] Parent tips are relevant to age stage
- [ ] Expert voice reflects experience with this age
