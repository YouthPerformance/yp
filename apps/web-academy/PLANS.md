# Web Academy Page Build Plans

> **Purpose:** Central reference for confirmed page architectures, component logic, and build decisions.
> **Updated:** 2026-01-28

---

## Table of Contents

1. [Homepage (Athlete Dashboard)](#1-homepage-athlete-dashboard)
2. [Pillar Pages (V7 Dual-Layer)](#2-pillar-pages-v7-dual-layer)
3. [Drills Page](#3-drills-page) _(Planned)_
4. [Answers Engine Page](#4-answers-engine-page) _(Planned)_

---

## 1. Homepage (Athlete Dashboard)

**Route:** `/home`
**File:** `src/app/(main)/home/page.tsx`
**Status:** ✅ Live

### Purpose

Main athlete dashboard showing stats, daily mission, and program progress. Mobile-first design optimized for young athletes (8-18).

### Architecture

```
┌─────────────────────────────────────┐
│         LockerRoomHeader            │  ← Avatar, name, rank, settings
├─────────────────────────────────────┤
│            StatsBar                 │  ← Level, XP, streak, crystals
├─────────────────────────────────────┤
│      [Free User Banner]             │  ← Conditional: upgrade CTA
├─────────────────────────────────────┤
│          TodaysMission              │  ← Day X workout card
├─────────────────────────────────────┤
│        Progress Summary             │  ← Journey progress bar
└─────────────────────────────────────┘
```

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `LockerRoomHeader` | `components/dashboard/` | User avatar, name, rank, parent mode toggle |
| `StatsBar` | `components/dashboard/` | Level/XP bar, streak flame, crystal count |
| `TodaysMission` | `components/dashboard/` | Today's workout card with start CTA |
| `UpsellModal` | `components/modals/` | Paywall for free users (Day 2+) |

### Data Flow

```typescript
useUserContext() → {
  user,           // Convex user record
  enrollment,     // Program enrollment (currentDay)
  level,          // Calculated from XP
  xpToNextLevel,  // XP needed for next level
  isLoaded,       // Loading state
  authState       // Auth status
}
```

### Key Logic

1. **Workout Locking:** Day 2+ locked for `subscriptionStatus === "free"`
2. **Program Phases:** Days 1-14 = Release, 15-28 = Restore, 29-42 = Reengineer
3. **Wolf Colors:** Avatar color mapped to hex (cyan, gold, purple, green, red)
4. **Loading State:** Shows wolf emoji + spinner while `isLoaded === false`

### Monetization

- Free users see Day 1 only
- Upgrade banner + modal for locked content
- CTA routes to checkout

---

## 2. Pillar Pages (V7 Dual-Layer)

**Route:** `/basketball/[...slug]`
**Files:**
- `src/app/(public)/basketball/[...slug]/page.tsx` (Server)
- `src/app/(public)/basketball/[...slug]/PillarPageClient.tsx` (Client)

**Status:** ✅ Live

### Purpose

SEO pillar pages with dual-layer architecture:
- **TRAIN layer:** Interactive product experience for athletes
- **GUIDE layer:** Canonical content for AI crawlers and research readers

### Design Philosophy

> "Nike Training Club meets Cyberpunk 2077"

Combines:
- V5 gamification (XP, progress bars, achievements)
- V2 data density (metrics, intel grids)
- V3 immersive hero (video preview, play button)
- V4 card structure (drill cards, filters)

### Architecture

```
┌─────────────────────────────────────┐
│          PillarTopBar               │  ← Breadcrumbs + XP header (athlete-only)
├─────────────────────────────────────┤
│           PillarHero                │  ← Title, definition, video, metrics
│  ┌─────────────┬─────────────────┐  │
│  │   Content   │     Video       │  │
│  │   + CTA     │    Preview      │  │
│  └─────────────┴─────────────────┘  │
├─────────────────────────────────────┤
│        TRAIN LAYER (#train)         │
│  ┌─────────────────────────────┐    │
│  │      SessionBuilder         │    │  ← Duration/floor/difficulty form
│  ├─────────────────────────────┤    │
│  │     ProtocolSummary         │    │  ← Generated drill list (SEO links)
│  ├─────────────────────────────┤    │
│  │     ProgressionPath         │    │  ← Skill nodes (athlete-only)
│  ├─────────────────────────────┤    │
│  │      KeyIntelGrid           │    │  ← 2x2 bento (objective/avoid/tip/safety)
│  ├─────────────────────────────┤    │
│  │     DrillInventory          │    │  ← Filterable drill cards
│  ├─────────────────────────────┤    │
│  │    TextListFallback         │    │  ← Collapsible text list for SEO
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│        GUIDE LAYER (#guide)         │
│  ┌─────────────────────────────┐    │
│  │      GuideSection           │    │  ← Canonical content wrapper
│  │  - Quick Answer Box         │    │
│  │  - Article Content (HTML)   │    │
│  │  - TakeawaysList            │    │
│  │  - MistakesFixes            │    │
│  │  - FAQAccordion             │    │
│  │  - SafetyBox                │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│          PillarFooter               │  ← Related pillars + AI disclosure
├─────────────────────────────────────┤
│        StickyBottomBar              │  ← Mobile CTA (shows on scroll)
└─────────────────────────────────────┘
```

### Components

**Directory:** `src/components/pillar/`

| Component | Purpose |
|-----------|---------|
| `PillarTopBar` | Sticky header with breadcrumbs + XP header (athlete-only) |
| `PillarHero` | Two-column: content left + video right |
| `MetricsStrip` | Key metrics display (`<40dB · 12 drills · 15min`) |
| `SessionBuilder` | Interactive form (duration/floor/difficulty/noise) |
| `ProtocolSummary` | Generated drill list with internal links |
| `ProgressionPath` | Horizontal skill node visualization |
| `KeyIntelGrid` | 2x2 bento grid (objective, avoid, tip, safety) |
| `DrillCard` | Card with status, stars, progress bar, XP |
| `DrillInventory` | Filter chips + drill cards grid |
| `TextListFallback` | Collapsible `<details>` text list for SEO |
| `GuideSection` | Canonical #guide wrapper |
| `TakeawaysList` | Key takeaways with arrow bullets |
| `MistakesFixes` | If/Cause/Fix cards |
| `FAQAccordion` | Native details/summary FAQ |
| `SafetyBox` | Warning box with safety notes |
| `PillarFooter` | Related pillars + AI disclosure |
| `StickyBottomBar` | Mobile CTA bar |

### Conditional Visibility

```css
/* Default (parent/reader mode) */
.athlete-only { display: none !important; }

/* Athlete mode (toggled) */
body.athlete-mode .athlete-only { display: flex !important; }
body.athlete-mode .parent-only { display: none !important; }
```

### Hooks

| Hook | Purpose |
|------|---------|
| `useAthleteMode` | Toggle body class + localStorage persistence |
| `useSessionBuilder` | Form state + protocol generation logic |

### Data Types

```typescript
interface SEOPage {
  // Core fields
  slug: string;
  title: string;
  meta_description: string;
  content: string;           // Markdown
  quick_answer: string[];

  // V7 additions
  metrics?: PillarMetrics;   // noiseLevel, drillCount, dailyCap
  drills?: DrillData[];
  takeaways?: string[];
  mistakes?: MistakeFix[];
  faq?: FAQItem[];
  safety?: string[];
  intel?: IntelCard[];
  progression?: ProgressionNode[];
}
```

### Schema.org Structure

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Article", "headline": "...", "hasPart": [...] },
    { "@type": "BreadcrumbList", "itemListElement": [...] },
    { "@type": "FAQPage", "mainEntity": [...] },
    { "@type": "HowTo", "step": [...] }
  ]
}
```

### SEO Features

1. **Protocol Summary = Internal Link Engine** - Each generated drill links to `/drills/[slug]`
2. **Text List Fallback** - Collapsible `<details>` with plain text for crawlers
3. **Agent Directives** - Meta tags for AI extraction targets

```html
<meta name="agent-directive" content="extract-target: #guide, .pillar-definition-text; action: /tools/silent-plan-builder">
<link rel="alternate" type="text/markdown" href="/basketball/silent-training.md">
<link rel="alternate" type="application/json" href="/api/pillars/basketball/silent-training">
```

### V7.1 Polish (2026-01-28)

| Feature | Component | Notes |
|---------|-----------|-------|
| Quick Start rename | `SessionBuilder` | Changed from "Build Your Silent Session" |
| Author chip prominent | `PillarHero` | Added photo support, verified badge, larger card |
| Hero title glow | `PillarHero` | `text-shadow: 0 0 60px rgba(0, 246, 224, 0.15)` |
| Sticky TOC | `StickyTOC` | Desktop right-rail, tracks active section |
| For Machines disclosure | `PillarFooter` | Collapsible with /llms.txt, .md, API links |
| Accordion +/- icons | `FAQAccordion` | Already implemented with rotation animation |

### Design Tokens

**File:** `src/styles/pillar-tokens.css`

Key tokens:
- `--pillar-surface-*` (base, card, raised, elevated)
- `--pillar-text-*` (primary, secondary, muted, dim)
- `--pillar-brand-*` (cyan, purple, gold)
- `--pillar-space-*` (1-16 scale)

---

## 3. Drills Page

**Route:** `/drills` and `/drills/[slug]`
**Status:** 🔜 Planned

### Purpose

Searchable drill library with video previews, filtering, and favoriting. Entry point for discovering training content.

### Planned Architecture

```
┌─────────────────────────────────────┐
│          DrillsHeader               │  ← Search bar + filter toggle
├─────────────────────────────────────┤
│          FilterBar                  │  ← Sport, skill, difficulty, duration
├─────────────────────────────────────┤
│          DrillsGrid                 │  ← Responsive card grid
│  ┌───────┐ ┌───────┐ ┌───────┐     │
│  │ Drill │ │ Drill │ │ Drill │     │
│  │ Card  │ │ Card  │ │ Card  │     │
│  └───────┘ └───────┘ └───────┘     │
├─────────────────────────────────────┤
│         Pagination/Infinite         │  ← Load more or paginate
└─────────────────────────────────────┘
```

### Planned Features

- [ ] Search with instant results
- [ ] Multi-filter (sport, skill, difficulty, duration, noise level)
- [ ] Video preview on hover
- [ ] Favorite/save drills
- [ ] "Add to session" quick action
- [ ] Related drills sidebar on detail page

### Data Requirements

```typescript
interface Drill {
  slug: string;
  title: string;
  description: string;
  sport: string;
  skill: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  noiseLevel: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  steps: string[];
  equipment: string[];
  tags: string[];
}
```

---

## 4. Answers Engine Page

**Route:** `/answers` and `/answers/[slug]`
**Status:** 🔜 Planned

### Purpose

AI-powered Q&A system that surfaces answers from pillar content. Optimized for featured snippets and voice search.

### Planned Architecture

```
┌─────────────────────────────────────┐
│        AnswersSearch                │  ← Search/question input
├─────────────────────────────────────┤
│        PopularQuestions             │  ← Trending/common questions
├─────────────────────────────────────┤
│        AnswerCard                   │  ← Featured answer with sources
│  ┌─────────────────────────────┐    │
│  │  Question (H1)              │    │
│  │  ─────────────────────────  │    │
│  │  Quick Answer               │    │  ← 2-3 sentence direct answer
│  │  ─────────────────────────  │    │
│  │  Detailed Explanation       │    │  ← Expandable full answer
│  │  ─────────────────────────  │    │
│  │  Sources: [Pillar Links]    │    │  ← Internal links to pillars
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│        RelatedQuestions             │  ← "People also ask" style
└─────────────────────────────────────┘
```

### Planned Features

- [ ] Natural language question input
- [ ] AI-generated answers from pillar content
- [ ] Source attribution with pillar links
- [ ] "People also ask" related questions
- [ ] Schema.org QAPage markup
- [ ] Voice search optimization
- [ ] Answer upvoting/feedback

### SEO Strategy

1. **Question-based URLs:** `/answers/how-to-train-basketball-silently`
2. **Featured Snippet Optimization:** Quick answer box format
3. **QAPage Schema:** Structured data for search results
4. **Internal Linking:** Every answer links back to source pillars

### Data Flow

```
User Question → AI Processing → Match to Pillar Content → Generate Answer → Display with Sources
```

---

## File Reference

### Pillar System

| File | Purpose |
|------|---------|
| `src/styles/pillar-tokens.css` | V7 design tokens |
| `src/components/pillar/index.ts` | Barrel export |
| `src/components/pillar/*.tsx` | 17 pillar components |
| `src/hooks/useAthleteMode.ts` | Mode toggle hook |
| `src/hooks/useSessionBuilder.ts` | Session form hook |
| `src/lib/seo-content.ts` | SEOPage types + utilities |
| `src/lib/seo-pages-data.ts` | Generated page content |

### Homepage System

| File | Purpose |
|------|---------|
| `src/app/(main)/home/page.tsx` | Homepage component |
| `src/components/dashboard/*.tsx` | Dashboard components |
| `src/contexts/UserContext.tsx` | User data context |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-28 | V7.1 Polish: Quick Start rename, prominent author chip with photo, sticky TOC, glow effects, For Machines disclosure |
| 2026-01-28 | Added V7 Pillar Page architecture |
| 2026-01-28 | Created initial PLANS.md |
