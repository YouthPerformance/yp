# Pillar Page Template

> **Word Count:** 2,500-4,000 words
> **Purpose:** Comprehensive authority piece, citation magnet
> **Review Required:** James Scott or Adam Harrington

---

## Frontmatter

```yaml
---
title: "[Topic]: The Complete Guide to [Outcome] ([Proprietary Framework Name]™)"
description: "[Evidence-based/Science-backed] [topic] guide for [audience]. [Key benefit]. [Safe progressions/Expert-reviewed] by [expert name]."
author: "[james-scott | adam-harrington]"
publishedDate: [YYYY-MM-DD]
updatedDate: [YYYY-MM-DD]
readTime: "[X] min read"
directAnswer: "<strong>[40-60 word definitive answer that can be lifted by AI. Starts with the key fact. Ends with actionable takeaway.]</strong>"
keyTakeaways:
  - "[Takeaway 1 - specific, memorable]"
  - "[Takeaway 2 - data-backed if possible]"
  - "[Takeaway 3 - actionable]"
  - "[Takeaway 4 - addresses common misconception]"
  - "[Takeaway 5 - ties to program/product]"
category: "[basketball | barefoot-training | speed-agility | strength-training]"
subcategory: "[optional cluster]"
keywords:
  - "[primary keyword]"
  - "[secondary keyword]"
  - "[long-tail keyword]"
  - "[question keyword]"
  - "[brand keyword]"
canonical: "https://playbook.youthperformance.com/[path]/"
theme: "[basketball | barefoot]"
programBadge: "[Related Program Name]™"
---
```

---

## Page Structure

### Hero Section
```markdown
# [H1: The Query - What people search for]

[DEFINITION BLOCK - 40-60 words, bolded]
**[Start with the answer. What is this? Why does it matter? What will the reader gain? End with a hook to keep reading.]**
```

### Table of Contents
```markdown
## In This Guide

1. [What Is [Topic]?](#what-is)
2. [Benefits of [Topic]](#benefits)
3. [Safety & When NOT to [Do Thing]](#safety)
4. [The [Framework Name] System](#framework)
5. [Core [Drills/Exercises]](#drills)
6. [30-Day [Topic] Plan](#plan)
7. [[Topic] for Youth Athletes](#youth)
8. [Frequently Asked Questions](#faq)
```

### Chapter I: What Is [Topic]?
```markdown
## What Is [Topic]?

[2-3 paragraphs explaining the concept. Start with the definition, then expand with context. Include why this matters for youth athletes specifically.]

<CoachVoice author="[james|adam]">
[2-3 sentences in expert's authentic voice. Personal, memorable, quotable.]
</CoachVoice>

**[Topic] is NOT:**
- [Common misconception 1]
- [Common misconception 2]
- [Common misconception 3]

**[Topic] IS:**
- [Correct understanding 1]
- [Correct understanding 2]
- [Correct understanding 3]
```

### Chapter II: Benefits
```markdown
## Benefits of [Topic]

[1 paragraph intro - why this matters for athletic performance]

[BENEFITS GRID - 4 cards with icon, title, and 1-sentence description]

| Benefit | Impact |
|---------|--------|
| ⚡ [Benefit 1] | [Specific outcome] |
| 🎯 [Benefit 2] | [Specific outcome] |
| 🛡️ [Benefit 3] | [Specific outcome] |
| 🦶 [Benefit 4] | [Specific outcome] |

[EVIDENCE PARAGRAPH - cite research or proprietary data]
"Studies show..." or "In our analysis of X athletes..."
```

### Chapter III: Safety
```markdown
## Safety & When NOT to [Do Thing]

<SafetyBox>
**Stop immediately if you experience:**
- [Warning sign 1]
- [Warning sign 2]
- [Warning sign 3]
- [Warning sign 4]
</SafetyBox>

**Who should consult a professional before starting:**
- [Population 1]
- [Population 2]
- [Population 3]
- [Population 4]

[1 paragraph on safe progression principles]
```

### Chapter IV: The Framework
```markdown
## The [Framework Name]™ System

[1 paragraph intro - the philosophy behind the system]

### Stage 1: [Name] (Week 1-2)
**Focus:** [What we're building]
**Duration:** [X-X] min/session

- [Exercise/Drill 1]
- [Exercise/Drill 2]
- [Exercise/Drill 3]

### Stage 2: [Name] (Week 3-6)
**Focus:** [What we're building]
**Duration:** [X-X] min/session

- [Exercise/Drill 1]
- [Exercise/Drill 2]
- [Exercise/Drill 3]

### Stage 3: [Name] (Week 7+)
**Focus:** [What we're building]
**Duration:** [X-X] min/session

- [Exercise/Drill 1]
- [Exercise/Drill 2]
- [Exercise/Drill 3]
```

### Chapter V: Core Drills
```markdown
## Core [Topic] Drills

[1 sentence intro]

<DrillCard
  number={1}
  title="[Drill Name]"
  tags={["[Tag1]", "[Tag2]"]}
  ageBadge={{ label: "[Age Range]", class: "age-[X]-[X]" }}
  description="[2 sentences on what this drill does and why it matters]"
  steps={[
    { instruction: "[Step 1 - action verb, specific]" },
    { instruction: "[Step 2 - measurable outcome]" },
    { instruction: "[Step 3 - common cue]" },
    { instruction: "[Step 4 - completion criteria]" },
  ]}
  coachingCues={[
    "[Cue 1 - what to feel]",
    "[Cue 2 - what to avoid]",
    "[Cue 3 - quality indicator]",
  ]}
  duration="[X-X] min"
  reps="[X reps x X sec holds]"
  difficulty="[Beginner|Intermediate|Advanced|Scalable]"
/>

[Repeat for 3-5 drills]
```

### Chapter VI: The Plan
```markdown
## 30-Day [Topic] Plan

[1 sentence intro - what to expect]

| Week | Focus | Drills | Duration |
|------|-------|--------|----------|
| Week 1 | [Phase name] | [Drill 1, Drill 2, Drill 3] | [X-X] min, [X]x/week |
| Week 2 | [Phase name] | [Drill 1, Drill 2, Drill 3] | [X-X] min, [X]x/week |
| Week 3 | [Phase name] | [Drill 1, Drill 2, Drill 3] | [X-X] min, [X]x/week |
| Week 4 | [Phase name] | [Drill 1, Drill 2, Drill 3] | [X-X] min, [X]x/week |

<CoachVoice author="[james|adam]">
[Warning about rushing the progression. Emphasize consistency over intensity.]
</CoachVoice>
```

### Chapter VII: Youth Athletes
```markdown
## [Topic] for Youth Athletes

[1 paragraph - why kids need this, how to approach differently]

| Age Band | Approach | Weekly Volume |
|----------|----------|---------------|
| Ages 7-9 | [Playful approach description] | [X]x, [X-X] min |
| Ages 10-13 | [Structured approach description] | [X]x, [X-X] min |
| Ages 14-18 | [Full program description] | [X-X]x, [X-X] min |

**For [sport] specifically:** [1-2 sentences on sport-specific application]
```

### FAQ Section
```markdown
<FAQSection
  faqs={[
    {
      question: "[Exact query people search - question format]",
      answer: "[Direct answer in 2-3 sentences. Start with Yes/No if applicable.]"
    },
    {
      question: "[Question 2]",
      answer: "[Answer 2]"
    },
    // 5-8 FAQs total
  ]}
  title="Frequently Asked Questions"
  subtitle="Common questions about [topic]"
/>
```

### CTA Block
```markdown
<CTABlock
  title="Start the [Program Name] Today"
  description="Get the complete [X]-Day [Program] in the Playbook app. Video demos, daily schedules, and progress tracking."
  buttonText="Get the Program"
  buttonUrl="https://app.youthperformance.com/programs/[slug]"
/>
```

### Related Content
```markdown
<RelatedGrid items={[
  {
    title: "[Related Topic 1]",
    description: "[3-5 word description]",
    url: "/[path]/",
    icon: "[emoji]",
  },
  // 4 items total
]} />
```

---

## Quality Checklist

Before submitting for review:

- [ ] Definition block is exactly 40-60 words
- [ ] All 5 key takeaways are unique and memorable
- [ ] Expert voice matches their profile
- [ ] At least one proprietary data point or framework
- [ ] FAQ questions match real search queries
- [ ] Internal links to 3+ related pages
- [ ] Age-specific guidance included
- [ ] Safety section is comprehensive
- [ ] CTA links to correct product/program
