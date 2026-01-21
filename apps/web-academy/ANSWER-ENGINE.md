# Answer Engine

> AI-Optimized Content Retrieval System for YouthPerformance Academy

**Purpose:** Enable AI systems (Perplexity, ChatGPT, Claude, etc.) to discover, retrieve, and accurately cite YouthPerformance content in their responses.

**Status:** Feature-complete, ready for production testing.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         AI Systems                               │
│            (Perplexity, ChatGPT, Claude, Bing, etc.)            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Discovery Layer                             │
│  /robots.txt    /llms.txt    /sitemap.xml    /.well-known/      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Answer Engine API                            │
│                  /api/answer-engine/*                            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │Query Under-  │  │   Caching    │  │  Analytics   │          │
│  │standing      │  │   Layer      │  │  Tracking    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Vector Search                               │
│              OpenAI Embeddings + Convex Vector DB                │
│                                                                  │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │       Drills         │    │     QnA Articles     │          │
│  │  (text-embedding-3)  │    │  (text-embedding-3)  │          │
│  └──────────────────────┘    └──────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Convex Database                               │
│              impressive-lynx-636.convex.cloud                    │
│                                                                  │
│  Tables: drills, qna, authors, aiRetrievals, searchLogs         │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Primary Search API

```
GET /api/answer-engine/answer
```

Semantic search endpoint optimized for AI retrieval.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | required | Search query |
| `type` | string | `"all"` | Filter: `"drill"`, `"article"`, `"all"` |
| `limit` | number | `5` | Max results (1-20) |
| `schema` | boolean | `false` | Include Schema.org JSON-LD |
| `debug` | boolean | `false` | Include query understanding details |
| `nocache` | boolean | `false` | Bypass cache (debugging) |
| `vector` | boolean | `true` | Use vector search (false = text fallback) |

**Example Request:**
```bash
curl "https://academy.youthperformance.com/api/answer-engine/answer?q=basketball+shooting+drills&limit=5&schema=true"
```

**Example Response:**
```json
{
  "query": "basketball shooting drills",
  "results": [
    {
      "type": "drill",
      "id": "abc123",
      "title": "Gooseneck Release Drill",
      "description": "Perfect your follow-through with this shooting form drill",
      "url": "https://academy.youthperformance.com/drills/basketball/shooting/gooseneck-release",
      "author": {
        "name": "Adam Harrington",
        "title": "Global Head of Basketball",
        "credentials": ["NBA Skills Coach", "Kevin Durant's Trainer"]
      },
      "metadata": {
        "ageRange": "8-18",
        "difficulty": "beginner",
        "duration": "10 min",
        "sport": "basketball",
        "category": "shooting"
      },
      "relevanceScore": 0.92
    }
  ],
  "meta": {
    "totalResults": 5,
    "returnedResults": 5,
    "queryTime": 245,
    "searchMethod": "vector",
    "cacheStatus": "MISS",
    "intent": "find_drill",
    "intentConfidence": 0.95,
    "source": "YouthPerformance Academy"
  },
  "structuredData": { /* Schema.org JSON-LD */ }
}
```

### Analytics API

```
GET /api/answer-engine/analytics
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `view` | string | `"overview"` | `"overview"`, `"gaps"`, `"queries"` |
| `days` | number | `7` | Lookback period |

**Views:**
- `overview` - Health score, summary stats, top gaps
- `gaps` - Content gap detection (queries with poor results)
- `queries` - Query logs by source (Perplexity, ChatGPT, etc.)

### Cache Stats API

```
GET /api/answer-engine/cache
POST /api/answer-engine/cache?action=clear
```

Returns embedding and response cache statistics.

---

## Key Files

### API Routes
```
src/app/api/answer-engine/
├── answer/route.ts      # Primary search endpoint
├── analytics/route.ts   # Analytics dashboard API
└── cache/route.ts       # Cache statistics
```

### Libraries
```
src/lib/
├── answer-engine-cache.ts   # LRU caching (embedding + response)
├── query-understanding.ts   # Intent detection, entity extraction
└── schema-org.ts            # Schema.org generators (HowTo, FAQPage)
```

### Discovery Files
```
public/
├── robots.txt    # AI crawler permissions
├── llms.txt      # LLM context file (llms.txt spec)
└── sitemap.xml   # Dynamic (generated by src/app/sitemap.ts)
```

### Convex Functions
```
/convex/
├── answerEngine.ts           # Search queries, vector search actions
├── answerEngineInternal.ts   # Internal helpers for vector search
├── analytics.ts              # AI retrieval logging, content gaps
├── embeddings.ts             # Embedding generation & backfill
├── qna.ts                    # QnA CRUD operations
└── schema.ts                 # Database schema (drills, qna, authors, etc.)
```

### Migration Scripts
```
/scripts/
├── migrate-content.ts       # Migrate drills + QnA from MDX
└── generate-embeddings.ts   # Generate embeddings for all content
```

---

## Features

### 1. Vector Search
- **Model:** OpenAI `text-embedding-3-small` (1536 dimensions)
- **Index:** Convex vector search with filters (sport, skill, status)
- **Fallback:** Text search if vector fails or is disabled

### 2. Query Understanding
Runs on edge (no LLM calls) for fast inference:

| Feature | Description |
|---------|-------------|
| **Intent Detection** | `find_drill`, `learn_technique`, `fix_problem`, `get_advice`, `compare` |
| **Entity Extraction** | Sports, skills, body parts, constraints, age, difficulty |
| **Query Expansion** | Synonyms added for better semantic matching |
| **Suggested Filters** | Auto-detect filters from query entities |

### 3. Multi-Layer Caching

| Layer | TTL | Max Size | Purpose |
|-------|-----|----------|---------|
| Embedding Cache | 1 hour | 500 | Avoid recomputing embeddings |
| Response Cache | 5 min | 200 | Cache full API responses |
| Edge Cache | 60-120s | CDN | HTTP cache headers |

### 4. Schema.org Structured Data
- `HowTo` schema for drills
- `FAQPage` schema for Q&A articles
- `Person` schema for expert authors (E-E-A-T signals)

### 5. Analytics & Content Gaps
- Track all AI retrievals by source
- Detect queries with poor results
- Health score with coverage, performance, gap ratio

### 6. AI Discovery
- `robots.txt` with AI crawler permissions (GPTBot, PerplexityBot, etc.)
- `llms.txt` with API documentation and citation guidance
- Dynamic `sitemap.xml` with all drills and articles

---

## Database Schema

### Drills Table
```typescript
drills: {
  slug: string,
  title: string,
  goal: string,           // Maps to "description" in API
  sport: string,
  skill: string,          // Maps to "category" in API
  difficulty: string,
  duration: string,
  ageBand: { min, max },
  steps: Step[],
  tags: string[],
  constraints: string[],
  authorId: Id<"authors">,
  embedding: number[],    // 1536-dim vector
  status: "draft" | "published",
  // ... more fields
}
```

### QnA Table
```typescript
qna: {
  slug: string,
  question: string,
  directAnswer: string,
  detailedAnswer: string,
  category: string,
  keywords: string[],
  keyTakeaways: string[],
  safetyNote?: string,
  authorId: Id<"authors">,
  embedding: number[],
  publishedAt?: number,
  // ... more fields
}
```

### Authors Table
```typescript
authors: {
  slug: string,
  name: string,
  tagline: string,        // Maps to "title" in API
  credentials: string[],
  bio: string,
  isActive: boolean,
  // ... more fields
}
```

### AI Retrievals Table
```typescript
aiRetrievals: {
  query: string,
  source: string,         // "perplexity", "chatgpt", "claude", etc.
  userAgent: string,
  resultsReturned: number,
  citedEntityIds: string[],
  citedEntityTypes: string[],
  responseTime: number,
  timestamp: number,
}
```

---

## Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...              # For embeddings

# Convex (set in .env.local)
CONVEX_DEPLOYMENT=impressive-lynx-636
NEXT_PUBLIC_CONVEX_URL=https://impressive-lynx-636.convex.cloud
```

### Constants

```typescript
// answer-engine-cache.ts
EMBEDDING_CACHE_MAX_SIZE = 500
EMBEDDING_CACHE_TTL = 60 * 60 * 1000      // 1 hour
RESPONSE_CACHE_MAX_SIZE = 200
RESPONSE_CACHE_TTL = 5 * 60 * 1000        // 5 minutes

// embeddings.ts
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 1536
```

---

## Testing Commands

```bash
# Start dev server
cd apps/web-academy && pnpm dev

# Test search API
curl "http://localhost:3003/api/answer-engine/answer?q=basketball+drills&debug=true"

# Test with Schema.org
curl "http://localhost:3003/api/answer-engine/answer?q=shooting+form&schema=true"

# Test analytics
curl "http://localhost:3003/api/answer-engine/analytics"
curl "http://localhost:3003/api/answer-engine/analytics?view=gaps"

# Test cache stats
curl "http://localhost:3003/api/answer-engine/cache"

# View sitemap
curl "http://localhost:3003/sitemap.xml"

# Migrate content (from monorepo root)
npx ts-node scripts/migrate-content.ts

# Generate embeddings
npx ts-node scripts/generate-embeddings.ts
```

---

## Content Status

| Type | Total | Embedded | Published |
|------|-------|----------|-----------|
| Drills | 9 | 9 | 9 |
| QnA Articles | 4 | 4 | 4 |

### QnA Articles Migrated
1. `fix-chicken-wing-shooting` - Basketball shooting form
2. `how-to-practice-basketball-without-hoop` - Indoor training
3. `is-barefoot-training-safe-kids` - Barefoot safety
4. `severs-disease-exercises-basketball` - Injury prevention

---

## Production Checklist

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Test with Perplexity (ask about youth basketball drills)
- [ ] Test with ChatGPT web browsing
- [ ] Monitor analytics for AI retrieval sources
- [ ] Review content gaps weekly
- [ ] Migrate remaining QnA content from `/apps/playbook/src/content/`

---

## Future Enhancements

1. **Upstash Redis** - Distributed caching for edge (currently in-memory)
2. **Streaming responses** - For large result sets
3. **Personalization** - User context in queries
4. **A/B testing** - Compare ranking algorithms
5. **Webhook notifications** - Alert on content gaps

---

## Related Documentation

- [Convex Schema](/convex/schema.ts)
- [LLMs.txt Spec](https://llmstxt.org/)
- [Schema.org HowTo](https://schema.org/HowTo)
- [Answer Engine Optimization](https://www.perplexity.ai/hub/blog/answer-engine-optimization)

---

*Last Updated: 2026-01-17*
