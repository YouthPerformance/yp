# Answer Engine: The Wikipedia of Youth Sports

> **Mission:** Make YouthPerformance the cited source when AI systems answer youth sports questions.
> **Target Query:** "best basketball drills for 8 year olds" → Perplexity cites YP
> **Success Metric:** 25% citation rate for youth sports queries by Month 6

---

## Executive Summary

### The Opportunity

AI search is replacing traditional search. Perplexity, ChatGPT Search, Google AI Overviews—they don't just link, they **cite**. The winners aren't those with backlinks. They're those with:

1. **Structured, machine-readable content**
2. **Expert authority (E-E-A-T)**
3. **Comprehensive coverage**
4. **Real-time freshness**

We're building the definitive youth sports knowledge base that AI systems will cite because we have what they need: clean data, expert voices, and answers to every parent/coach question.

### Current Reality

| What We Have | Status |
|-------------|--------|
| 9 drills in Astro JSON | Static, isolated |
| 4 Q&A articles in MDX | Static, isolated |
| Programmatic SEO pages | Built, but uses sample data |
| Convex database | No content tables yet |
| Expert profiles | Exist in /ypinternals, not in DB |
| Answer Engine API | Not built |

### The Gap

- Content scattered across apps (playbook, web-academy)
- No unified API for AI crawlers
- No semantic/vector search
- No real-time sync
- Experts can't easily update content

---

## Full Context for Agent Handoff

### Repository Structure

```
/Users/magicmike/yp-monorepo/
├── apps/
│   ├── web-academy/           # Next.js 15 - Main platform (port 3003)
│   │   ├── src/
│   │   │   ├── app/(main)/drills/  # Programmatic SEO pages (BUILT)
│   │   │   │   ├── page.tsx              # /drills index
│   │   │   │   ├── [sport]/page.tsx      # /drills/basketball
│   │   │   │   ├── [sport]/[category]/page.tsx  # /drills/basketball/shooting
│   │   │   │   └── [sport]/[category]/[slug]/page.tsx  # Individual drill
│   │   │   ├── data/drills/        # Sample drill data (TypeScript)
│   │   │   │   ├── types.ts        # Matrix types, SEO helpers
│   │   │   │   ├── sample-drills.ts # 6 sample drills
│   │   │   │   └── index.ts
│   │   │   └── components/drills/  # Drill UI components
│   │   │       ├── DrillCard.tsx
│   │   │       ├── DrillFilters.tsx
│   │   │       └── index.ts
│   │   └── CLAUDE.md              # App-specific instructions
│   │
│   ├── playbook/                  # Astro - SEO content site
│   │   └── src/content/
│   │       ├── drills/            # 9 JSON drill files
│   │       │   ├── severs-disease-protocol.json
│   │       │   ├── chicken-wing-fix.json
│   │       │   ├── flat-feet-arch-rebuild.json
│   │       │   └── ... (6 more)
│   │       ├── parent-sidelines/  # 4 MDX Q&A articles
│   │       │   ├── is-barefoot-training-safe-kids.mdx
│   │       │   ├── fix-chicken-wing-shooting.mdx
│   │       │   ├── how-to-practice-basketball-without-hoop.mdx
│   │       │   └── severs-disease-exercises-basketball.mdx
│   │       └── config.ts          # Zod schemas for content
│   │
│   └── shop/                      # Hydrogen - Shopify (port 3001)
│
├── packages/
│   └── yp-alpha/                  # Shared "brain" package
│       └── convex/
│           ├── schema.ts          # Current schema (needs content tables)
│           └── _generated/        # Auto-generated types
│
└── docs/
    └── ANSWER-ENGINE.md           # This document

/Users/magicmike/ypinternals/      # Internal docs (SEPARATE REPO)
├── 00_Start_Here/
│   ├── YP_Manifesto.md            # Mission, culture, values
│   ├── How_We_Use_Claude.md       # AI-native workflows
│   └── Daily_Non_Negotiables.md
├── 01_Brand/
│   ├── Brand_Voice_Guide.md       # Tone: Competitive. Fun. Real.
│   └── Visual_Identity.md
├── 02_Training_Methodology/
│   ├── Coaching_Philosophy.md     # Safety first, competitive edge, fun
│   └── Safety_Guidelines.md
├── 03_Content/
│   └── TikTok/                    # Social content SOPs
└── Profiles/
    ├── james/                     # James Scott assets
    └── adam/                      # Adam Harrington assets
```

### Expert Profiles (Critical for E-E-A-T)

#### James Scott - Barefoot & Biomechanics

| Property | Value |
|----------|-------|
| Slug | `james-scott` |
| Title | Biomechanical Specialist |
| Icon | 🦶 |
| Focus | Barefoot training, foot/ankle rehab, injury prevention |
| Content | Ankle mobility, Sever's disease protocols, arch rebuilding |
| Credentials | NBA/NFL athlete work, 20+ years experience |

**Voice Profile:**
- Tone: Scientific but accessible, uses analogies
- Avoid: Medical jargon without explanation, absolute claims
- Patterns: "Here's what the research shows...", "This is the same protocol I use with..."

#### Adam Harrington - Elite Basketball

| Property | Value |
|----------|-------|
| Slug | `adam-harrington` |
| Title | Elite Basketball Coach |
| Icon | 🏀 |
| Focus | Shooting mechanics, ball handling, basketball skills |
| Content | Form shooting, Mikan drill, dribbling series |
| Credentials | Trained 50+ NBA players, skills consultant |

**Voice Profile:**
- Tone: Direct, coach-speak, motivational
- Avoid: Overly technical, boring explanations
- Patterns: "Every NBA player does this...", "The secret is..."

### Existing Content Schemas

#### Astro Drills Schema (from config.ts)

```typescript
// This is what exists in playbook/src/content/config.ts
const drillsCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum([
      "ball-handling", "shooting", "footwork", "defense",
      "barefoot", "balance", "strength", "pain-relief", "silent-training"
    ]),
    cluster: z.enum([
      "silent-training", "home-training", "shooting-mechanics",
      "pain-relief", "foot-structure", "injury-rehab"
    ]).optional(),
    sport: z.enum(["basketball", "barefoot", "all-sports"]),
    author: z.string(),
    ageMin: z.number().min(5).max(18),
    ageMax: z.number().min(5).max(18),
    duration: z.string(),
    reps: z.string(),
    difficulty: z.enum(["beginner", "intermediate", "advanced", "scalable"]),
    tags: z.array(z.string()),
    description: z.string(),
    coachNote: z.string().optional(),
    steps: z.array(z.object({
      title: z.string().optional(),
      instruction: z.string(),
      durationSeconds: z.number().optional(),
      videoUrl: z.string().optional(),
    })),
    coachingCues: z.array(z.string()),
    commonMistake: z.string().optional(),
    mistakeFix: z.string().optional(),
    videoUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    relatedDrills: z.array(z.string()).optional(),
  }),
});
```

#### Sample Astro Drill (Sever's Protocol)

```json
{
  "title": "The Sever's Disease Protocol",
  "slug": "severs-disease-protocol",
  "category": "pain-relief",
  "cluster": "pain-relief",
  "sport": "all-sports",
  "author": "james-scott",
  "ageMin": 9,
  "ageMax": 14,
  "duration": "10 min",
  "reps": "45 sec holds x 3 sets",
  "difficulty": "beginner",
  "tags": ["severs-disease", "heel-pain", "injury-rehab", "isometrics"],
  "description": "The definitive isometric routine to kill heel pain...",
  "coachNote": "James's Take: Rest doesn't fix Sever's...",
  "steps": [
    {
      "title": "The Floating Heel",
      "instruction": "Stand on a stair with just the balls of your feet...",
      "durationSeconds": 45
    }
  ],
  "coachingCues": [
    "Pain during holds should NOT exceed 3/10...",
    "Do NOT stretch aggressively..."
  ],
  "commonMistake": "Aggressive calf stretching",
  "mistakeFix": "Stop stretching during flare-ups. Use isometrics only."
}
```

#### Astro Q&A Schema (Parent Sidelines)

```typescript
const parentSidelinesCollection = defineCollection({
  type: "content",
  schema: z.object({
    question: z.string(),
    category: z.enum([
      "basketball", "barefoot", "general", "safety",
      "training-hacks", "injury-prevention", "skills-mechanics", "health-safety"
    ]),
    author: z.string(),
    expertTitle: z.string().optional(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    directAnswer: z.string(),  // Featured Snippet target
    keyTakeaways: z.array(z.string()).optional(),
    safetyNote: z.string().optional(),
    relatedPillar: z.string(),
    relatedDrillSlug: z.string().optional(),
    relatedDrills: z.array(z.string()).optional(),
    keywords: z.array(z.string()),
    ctaText: z.string().optional(),
    ctaUrl: z.string().optional(),
  }),
});
```

### Web Academy Drill Matrix (Just Built)

The programmatic SEO system uses this schema:

```typescript
// apps/web-academy/src/data/drills/types.ts

export const SPORTS = [
  "basketball", "soccer", "baseball", "football", "volleyball",
  "tennis", "golf", "lacrosse", "track", "general"
] as const;

export const CATEGORIES = {
  basketball: ["shooting", "ball-handling", "passing", "defense", ...],
  soccer: ["dribbling", "passing", "shooting", "defense", ...],
  general: ["ankle-mobility", "hip-mobility", "core-strength", "barefoot-training", ...],
  // ...
};

export const AGE_GROUPS = ["6-8", "8-10", "10-12", "12-14", "14-16", "16-18", "adult"];
export const CONSTRAINTS = ["no-equipment", "indoor", "outdoor", "solo", "5-minutes", ...];

export interface Drill {
  id: string;
  slug: string;
  title: string;
  sport: Sport;
  category: string;
  ageGroups: AgeGroup[];
  constraints: Constraint[];
  description: string;
  benefits: string[];
  equipment: string[];
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  steps: DrillStep[];
  variations?: DrillVariation[];
  author: "JAMES" | "ADAM" | "TEAM_YP";
  // ...
}
```

---

## Architecture

### Phase 1: Foundation (Week 1-2)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONTENT SOURCES                          │
├──────────────────┬──────────────────┬───────────────────────────┤
│  Astro Playbook  │  Web Academy     │  Voice Approval UI        │
│  9 drills (JSON) │  6 samples (TS)  │  James/Adam input         │
│  4 articles (MDX)│                  │  (Built in admin)         │
└────────┬─────────┴────────┬─────────┴───────────┬───────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MIGRATION SCRIPT                            │
│  scripts/migrate-content.ts                                     │
│  - Reads Astro JSON/MDX files                                   │
│  - Transforms to unified Convex schema                          │
│  - Inserts via Convex mutations                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CONVEX DATABASE                          │
├─────────────────┬─────────────────┬─────────────────────────────┤
│     drills      │    articles     │        experts              │
│  (structured)   │   (Q&A/guides)  │     (E-E-A-T)               │
│  9 → 100+       │   4 → 50+       │   James, Adam, Team YP      │
└────────┬────────┴────────┬────────┴────────┬────────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ANSWER ENGINE API                            │
│  /api/answer    - Primary search (full-text → vector)           │
│  /api/drills    - Structured queries with filters               │
│  /api/qna       - Direct Q&A pairs for citation                 │
│  /api/experts   - Author credentials (E-E-A-T)                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI CONSUMERS                                 │
│  Perplexity • ChatGPT Search • Gemini • Google AI Overviews     │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 2: Semantic Search (Week 3-4)

```
┌─────────────────────────────────────────────────────────────────┐
│                    EMBEDDING PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│  1. Content mutation (create/update) triggers                   │
│  2. Generate embedding via OpenAI text-embedding-3-small        │
│  3. Store vector in Cloudflare Vectorize index                  │
│  4. /api/answer queries Vectorize for semantic similarity       │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 3: Distribution (Week 5-6)

- Perplexity Publisher application
- Schema.org audit (HowTo, FAQPage, Article, Person)
- robots.txt for AI-friendly crawling
- XML sitemap with all content URLs

---

## Convex Schema (To Add)

```typescript
// packages/yp-alpha/convex/schema.ts - ADD THESE TABLES

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ... existing tables ...

// ═══════════════════════════════════════════════════════════════
// ANSWER ENGINE CONTENT TABLES
// ═══════════════════════════════════════════════════════════════

// Expert Profiles (E-E-A-T)
experts: defineTable({
  slug: v.string(),
  name: v.string(),
  title: v.string(),
  icon: v.string(),
  credentials: v.array(v.string()),
  bio: v.string(),
  avatarUrl: v.optional(v.string()),
  socialLinks: v.optional(v.object({
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    wikipedia: v.optional(v.string()),
  })),
  voiceProfile: v.object({
    tone: v.string(),
    avoid: v.array(v.string()),
    speechPatterns: v.array(v.string()),
  }),
})
  .index("by_slug", ["slug"]),

// Drills (Structured Training Content)
drills: defineTable({
  // Identity
  slug: v.string(),
  title: v.string(),
  subtitle: v.optional(v.string()),

  // Categorization (for programmatic SEO)
  sport: v.string(),
  category: v.string(),
  cluster: v.optional(v.string()),

  // Age targeting
  ageMin: v.number(),
  ageMax: v.number(),

  // Filtering
  difficulty: v.string(),
  tags: v.array(v.string()),
  constraints: v.array(v.string()),

  // Core content
  description: v.string(),
  benefits: v.array(v.string()),
  coachNote: v.optional(v.string()),

  // Steps (structured for Schema.org HowTo)
  steps: v.array(v.object({
    order: v.number(),
    title: v.optional(v.string()),
    instruction: v.string(),
    duration: v.optional(v.string()),
    durationSeconds: v.optional(v.number()),
    coachingCue: v.optional(v.string()),
    commonMistake: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
  })),

  // Coaching metadata
  coachingCues: v.array(v.string()),
  commonMistake: v.optional(v.string()),
  mistakeFix: v.optional(v.string()),
  warmup: v.optional(v.string()),
  cooldown: v.optional(v.string()),

  // Practical info
  duration: v.string(),
  reps: v.optional(v.string()),
  equipment: v.array(v.string()),

  // Variations
  variations: v.optional(v.array(v.object({
    name: v.string(),
    description: v.string(),
    difficulty: v.string(),
  }))),

  // Author (E-E-A-T)
  authorId: v.id("experts"),
  reviewedBy: v.optional(v.string()),
  sources: v.optional(v.array(v.string())),

  // Media
  videoUrl: v.optional(v.string()),
  thumbnailUrl: v.optional(v.string()),
  gifUrl: v.optional(v.string()),

  // Related content
  relatedDrills: v.array(v.string()),
  parentProtocol: v.optional(v.string()),

  // SEO
  keywords: v.array(v.string()),
  metaTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),

  // Status & timestamps
  status: v.string(),
  publishedAt: v.optional(v.number()),
  updatedAt: v.number(),

  // Vector embedding (Phase 2)
  embedding: v.optional(v.array(v.float64())),
})
  .index("by_slug", ["slug"])
  .index("by_sport", ["sport", "status"])
  .index("by_category", ["sport", "category", "status"])
  .index("by_status", ["status"])
  .index("by_author", ["authorId"]),

// Articles (Q&A Pages / Parent Sidelines)
articles: defineTable({
  // Identity
  slug: v.string(),
  question: v.string(),
  category: v.string(),

  // AEO Critical Elements (for Featured Snippets)
  directAnswer: v.string(),
  keyTakeaways: v.array(v.string()),
  safetyNote: v.optional(v.string()),

  // Full content
  body: v.string(),

  // Author (E-E-A-T)
  authorId: v.id("experts"),
  expertTitle: v.optional(v.string()),

  // Linking
  relatedPillar: v.optional(v.string()),
  relatedDrills: v.array(v.string()),

  // SEO
  keywords: v.array(v.string()),

  // CTA
  ctaText: v.optional(v.string()),
  ctaUrl: v.optional(v.string()),

  // Timestamps
  publishedAt: v.number(),
  updatedAt: v.number(),

  // Vector embedding (Phase 2)
  embedding: v.optional(v.array(v.float64())),
})
  .index("by_slug", ["slug"])
  .index("by_category", ["category"]),
```

---

## API Endpoint Specifications

### GET /api/answer

**Purpose:** Primary semantic search for AI retrieval systems.

**Request:**
```
GET /api/answer?q=best+basketball+drills+for+8+year+olds&limit=5&type=drill
```

| Param | Type | Description |
|-------|------|-------------|
| q | string | Search query (required) |
| limit | number | Max results (default: 5, max: 20) |
| type | string | Filter by content type: "drill", "article", "all" |

**Response:**
```json
{
  "query": "best basketball drills for 8 year olds",
  "results": [
    {
      "type": "drill",
      "id": "d_abc123",
      "title": "Form Shooting Basics",
      "description": "The foundation of every great shooter. This drill focuses on proper hand placement, elbow alignment, and follow-through.",
      "url": "https://app.youthperformance.com/drills/basketball/shooting/form-shooting-basics",
      "author": {
        "name": "Adam Harrington",
        "title": "Elite Basketball Coach",
        "credentials": ["Trained 50+ NBA players"]
      },
      "metadata": {
        "ageRange": "8-14",
        "difficulty": "beginner",
        "duration": "5-10 min",
        "sport": "basketball",
        "category": "shooting"
      },
      "relevanceScore": 0.95
    }
  ],
  "meta": {
    "totalResults": 23,
    "queryTime": 45,
    "source": "YouthPerformance Academy",
    "lastUpdated": "2026-01-16T00:00:00Z"
  }
}
```

### GET /api/drills

**Purpose:** Structured drill search with filters (for programmatic access).

**Request:**
```
GET /api/drills?sport=basketball&category=shooting&age=8&difficulty=beginner&limit=20
```

| Param | Type | Description |
|-------|------|-------------|
| sport | string | Filter by sport |
| category | string | Filter by category |
| age | number | Filter by age group containing this age |
| difficulty | string | beginner, intermediate, advanced |
| constraint | string | no-equipment, indoor, solo, etc. |
| limit | number | Max results (default: 20) |
| cursor | string | Pagination cursor |

**Response:**
```json
{
  "drills": [...],
  "filters": {
    "sport": "basketball",
    "category": "shooting",
    "age": 8,
    "difficulty": "beginner"
  },
  "pagination": {
    "cursor": "abc123",
    "hasMore": true,
    "total": 45
  }
}
```

### GET /api/qna

**Purpose:** Direct Q&A pairs optimized for AI citation.

**Request:**
```
GET /api/qna?category=health-safety&limit=10
```

**Response:**
```json
{
  "questions": [
    {
      "id": "a_xyz789",
      "question": "Is barefoot training safe for youth athletes?",
      "answer": "Yes, when done correctly, barefoot training is safe for most youth athletes—and often safer than exclusively wearing cushioned shoes. Modern sneakers act like 'casts,' weakening the foot's intrinsic muscles over time.",
      "expert": {
        "name": "James Scott",
        "title": "Biomechanical Specialist"
      },
      "keyTakeaways": [
        "Start Static: Begin with balance work, not running",
        "Surface Matters: Train on grass, not concrete",
        "The 10% Rule: Barefoot volume < 10% in first month"
      ],
      "url": "https://app.youthperformance.com/guides/is-barefoot-training-safe-kids",
      "lastUpdated": "2026-01-08"
    }
  ],
  "meta": {
    "total": 24,
    "categories": ["health-safety", "basketball", "barefoot"]
  }
}
```

### GET /api/experts

**Purpose:** Author credentials for E-E-A-T signals.

**Response:**
```json
{
  "experts": [
    {
      "slug": "james-scott",
      "name": "James Scott",
      "title": "Biomechanical Specialist",
      "credentials": [
        "Barefoot Training Pioneer",
        "Worked with NBA, NFL, MLB athletes",
        "20+ years experience"
      ],
      "bio": "James Scott is a biomechanical specialist who has worked with...",
      "contentCount": {
        "drills": 15,
        "articles": 8
      },
      "topics": ["ankle-mobility", "barefoot-training", "injury-prevention"]
    }
  ]
}
```

---

## Migration Script

```typescript
// scripts/migrate-content.ts

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../packages/yp-alpha/convex/_generated/api';

const PLAYBOOK_ROOT = path.join(__dirname, '../apps/playbook/src/content');
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

const client = new ConvexHttpClient(CONVEX_URL);

// Expert slugs → IDs (we'll populate these first)
const expertIds: Record<string, string> = {};

async function migrateExperts() {
  console.log('🔄 Migrating experts...');

  const experts = [
    {
      slug: 'james-scott',
      name: 'James Scott',
      title: 'Biomechanical Specialist',
      icon: '🦶',
      credentials: [
        'Barefoot Training Pioneer',
        'NBA/NFL/MLB athlete consultant',
        '20+ years experience',
      ],
      bio: 'James Scott is a biomechanical specialist focused on barefoot training and foot health...',
      voiceProfile: {
        tone: 'Scientific but accessible, uses analogies',
        avoid: ['Medical jargon without explanation', 'Absolute claims'],
        speechPatterns: [
          "Here's what the research shows...",
          "This is the same protocol I use with...",
        ],
      },
    },
    {
      slug: 'adam-harrington',
      name: 'Adam Harrington',
      title: 'Elite Basketball Coach',
      icon: '🏀',
      credentials: [
        'Trained 50+ NBA players',
        'Skills consultant for multiple NBA teams',
        '15+ years coaching experience',
      ],
      bio: 'Adam Harrington is an elite basketball coach who has trained...',
      voiceProfile: {
        tone: 'Direct, coach-speak, motivational',
        avoid: ['Overly technical', 'Boring explanations'],
        speechPatterns: [
          'Every NBA player does this...',
          'The secret is...',
        ],
      },
    },
    {
      slug: 'team-yp',
      name: 'Team YP',
      title: 'YouthPerformance Coaching Staff',
      icon: '🐺',
      credentials: ['Collective coaching expertise'],
      bio: 'The YouthPerformance coaching team...',
      voiceProfile: {
        tone: 'Encouraging, clear, structured',
        avoid: ['Jargon'],
        speechPatterns: [],
      },
    },
  ];

  for (const expert of experts) {
    const id = await client.mutation(api.experts.create, expert);
    expertIds[expert.slug] = id;
    console.log(`  ✅ ${expert.name}`);
  }
}

async function migrateDrills() {
  console.log('🔄 Migrating drills...');

  const drillsDir = path.join(PLAYBOOK_ROOT, 'drills');
  const files = fs.readdirSync(drillsDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const content = JSON.parse(fs.readFileSync(path.join(drillsDir, file), 'utf-8'));

    // Transform Astro format → Convex format
    const drill = {
      slug: content.slug,
      title: content.title,
      sport: content.sport === 'all-sports' ? 'general' : content.sport,
      category: content.category,
      cluster: content.cluster,
      ageMin: content.ageMin,
      ageMax: content.ageMax,
      difficulty: content.difficulty,
      tags: content.tags,
      constraints: content.tags.filter(t =>
        ['no-equipment', 'indoor', 'outdoor', 'solo', 'partner'].includes(t)
      ),
      description: content.description,
      benefits: [], // Extract from description or add manually
      coachNote: content.coachNote,
      steps: content.steps.map((s, i) => ({
        order: i + 1,
        title: s.title,
        instruction: s.instruction,
        durationSeconds: s.durationSeconds,
        coachingCue: undefined,
      })),
      coachingCues: content.coachingCues,
      commonMistake: content.commonMistake,
      mistakeFix: content.mistakeFix,
      duration: content.duration,
      reps: content.reps,
      equipment: [],
      variations: [],
      authorId: expertIds[content.author] || expertIds['team-yp'],
      videoUrl: content.videoUrl,
      thumbnailUrl: content.thumbnailUrl,
      relatedDrills: content.relatedDrills || [],
      keywords: content.tags,
      status: 'published',
      updatedAt: Date.now(),
      publishedAt: Date.now(),
    };

    await client.mutation(api.drills.create, drill);
    console.log(`  ✅ ${content.title}`);
  }
}

async function migrateArticles() {
  console.log('🔄 Migrating articles...');

  const articlesDir = path.join(PLAYBOOK_ROOT, 'parent-sidelines');
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
    const { data, content } = matter(raw);

    const article = {
      slug: file.replace('.mdx', ''),
      question: data.question,
      category: data.category,
      directAnswer: data.directAnswer,
      keyTakeaways: data.keyTakeaways || [],
      safetyNote: data.safetyNote,
      body: content,
      authorId: expertIds['james-scott'], // Map from data.author
      expertTitle: data.expertTitle,
      relatedPillar: data.relatedPillar,
      relatedDrills: data.relatedDrills || [],
      keywords: data.keywords,
      ctaText: data.ctaText,
      ctaUrl: data.ctaUrl,
      publishedAt: new Date(data.publishedDate).getTime(),
      updatedAt: new Date(data.updatedDate).getTime(),
    };

    await client.mutation(api.articles.create, article);
    console.log(`  ✅ ${data.question}`);
  }
}

async function main() {
  console.log('🚀 Starting content migration...\n');

  await migrateExperts();
  await migrateDrills();
  await migrateArticles();

  console.log('\n✅ Migration complete!');
}

main().catch(console.error);
```

---

## Learnings & Context

### What's Been Built This Session

1. **Programmatic SEO Drill Matrix** (web-academy)
   - 4 route levels: /drills, /drills/[sport], /drills/[sport]/[category], /drills/[sport]/[category]/[slug]
   - Matrix: 10 sports × 7-10 categories × 7 age groups × 11 constraints
   - Schema.org: BreadcrumbList, ItemList, HowTo, FAQPage
   - Components: DrillCard, DrillFilters
   - 6 sample drills with full type safety

2. **Voice-Enabled Review UI** (previous session)
   - Quick Review Mode at /admin/quick-review
   - VoiceReviewPanel with commands
   - QuickReviewQueue for batch processing

### Key Decisions Made

1. **Static TypeScript for now** - Drill data in TS files (easy to edit, type-safe) but will migrate to Convex
2. **Astro schema as reference** - The playbook config.ts has the most complete schema, use as source of truth
3. **Expert profiles critical** - E-E-A-T requires author credentials everywhere

### What Needs to Happen Next

```
Priority 1: Convex Schema
├── Add experts table
├── Add drills table
├── Add articles table
└── Run migration

Priority 2: API Endpoints
├── /api/answer (search)
├── /api/drills (structured)
├── /api/qna (Q&A pairs)
└── /api/experts (E-E-A-T)

Priority 3: Content Backfill
├── 50+ drills from James/Adam
├── 20+ Q&A articles
└── Daily sync workflow
```

### Commands

```bash
# Run migration
pnpm tsx scripts/migrate-content.ts

# Start Convex dev
pnpm --filter @yp/alpha convex dev

# Test API locally
curl http://localhost:3003/api/answer?q=basketball+drills
```

---

## Success Metrics

| Metric | Week 2 | Month 1 | Month 3 | Month 6 |
|--------|--------|---------|---------|---------|
| Drills in DB | 15 | 50 | 200 | 500 |
| Q&A Articles | 4 | 20 | 75 | 200 |
| API Queries/Day | 100 | 1K | 10K | 50K |
| Perplexity Citations | 0 | 10 | 50 | 200 |
| Response Time (p95) | <500ms | <300ms | <200ms | <150ms |

---

## Open Questions

1. **Vector search timing**: Start with Convex full-text, add Vectorize in Phase 2?
2. **Embedding model**: OpenAI text-embedding-3-small vs Claude embeddings?
3. **Cache layer**: Vercel Edge cache or Cloudflare KV?
4. **Rate limiting**: How to handle AI crawler traffic spikes?
5. **Content approval**: How often should James/Adam review via voice UI?

---

## Implementation Status

### Phase 1: Foundation - COMPLETE

| Component | Status | Location |
|-----------|--------|----------|
| Convex Schema (experts, ae_drills, ae_articles) | Done | `packages/yp-alpha/convex/schema.ts` |
| Convex Mutations & Queries | Done | `packages/yp-alpha/convex/answerEngine.ts` |
| Migration Script | Done | `scripts/migrate-content.ts` |
| API: `/api/answer-engine/answer` | Done | `apps/web-academy/src/app/api/answer-engine/answer/route.ts` |
| API: `/api/answer-engine/drills` | Done | `apps/web-academy/src/app/api/answer-engine/drills/route.ts` |
| API: `/api/answer-engine/qna` | Done | `apps/web-academy/src/app/api/answer-engine/qna/route.ts` |
| API: `/api/answer-engine/experts` | Done | `apps/web-academy/src/app/api/answer-engine/experts/route.ts` |
| Schema.org (HowTo, FAQPage, Person) | Done | Embedded in API responses |

### Next Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Run Convex dev to sync schema
cd packages/yp-alpha && npx convex dev

# 3. Run migration to populate data
pnpm migrate:content

# 4. Test API endpoints
curl http://localhost:3003/api/answer-engine/answer?q=basketball
curl http://localhost:3003/api/answer-engine/drills?sport=basketball
curl http://localhost:3003/api/answer-engine/qna
curl http://localhost:3003/api/answer-engine/experts
```

---

*Last Updated: 2026-01-16*
*Status: Phase 1 Complete - Ready for Testing*
*Owner: Mike / MAI*
