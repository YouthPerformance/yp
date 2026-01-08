# yp-alpha - The Brain

> Core AI logic, Convex database, and Wolf Pack Protocol.
> This package is the **source of truth** for all shared logic.

---

## Package Exports

```typescript
import { wolfRouter, modelExecutor, voiceWrapper } from "@yp/alpha/router"
import { MODEL_CONFIG } from "@yp/alpha/config"
import { api } from "@yp/alpha/convex/_generated/api"
```

---

## Architecture: Wolf Pack Protocol v2.0

```
User Request → Memory Retrieval → Router (Haiku) → Executor → Voice Wrapper → Response
                                                                    ↓
                                                              Memory Ingest (async)
```

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **WolfRouter** | `src/router/wolf-router.ts` | Intent/sentiment classification (<100ms) |
| **ModelExecutor** | `src/router/model-executor.ts` | Execute Haiku/Sonnet/Opus |
| **VoiceWrapper** | `src/router/voice-wrapper.ts` | Brand voice enforcement |
| **Memory Retrieve** | `convex/memory/retrieve.ts` | Fetch athlete context |
| **Memory Ingest** | `convex/memory/ingest.ts` | Extract and store insights |

---

## Model Tiers

| Tier | Model | Cost | Use Case | Latency |
|------|-------|------|----------|---------|
| FAST | `claude-haiku-4-5-20251015` | $1.50/M | Data, quick answers | <500ms |
| SMART | `claude-sonnet-4-5-20250929` | $18/M | Coaching, complex | <2s |
| DEEP | `claude-opus-4-5-20251124` | $90/M | Planning, deep analysis | <10s |

**Cost Target:** 90% Haiku / 10% Sonnet / <1% Opus

---

## Routing Rules

### Intent Classification
```
EXECUTION (Haiku) → Data lookups, simple requests, scheduling
COACHING (Sonnet) → Emotional, analysis, troubleshooting, injuries
CREATION (Gemini) → Visual generation (placeholder)
PLANNING (Opus)   → Season planning, periodization
```

### Sentiment Escalation
```
FRUSTRATED, SAD, ANXIOUS → Always escalate to Sonnet
HYPE, NEUTRAL → No escalation
```

### Complexity Scoring
```
1-6 → Haiku
7-9 → Sonnet
10  → Opus
```

---

## Convex Schema (Key Tables)

```typescript
// Core user data
users              // Clerk ID, XP, crystals, subscription
enrollments        // Program enrollments
workoutCompletions // Daily completions

// Memory System (The Moat)
athlete_nodes      // Graph vertices: body parts, metrics, mental state
correlations       // Graph edges: what causes what
memories           // Raw extraction buffer
conversations      // Chat sessions
messages           // Individual messages with metadata

// Gamification
cards              // Collectible anime cards
userCards          // User card collection
purchases          // Crystal shop transactions
learningProgress   // ILM module progress
```

**Schema file:** `convex/schema.ts` - Always reference this for database work.

---

## Voice Wrapper Rules

### Banned Terms (Auto-replaced)
```
exercise → drill       wellness → performance
workout  → stack       tired    → fatigued
jog      → run         sore     → loaded
stretch  → mobility    maybe    → (removed)
```

### Phrase Patterns
```
"oh no"           → (removed)
"i'm sorry"       → (removed)
"take your time"  → "execute now"
"great job"       → "solid."
```

### Voice Score
```
100 base points
-15 per banned word
-15 per weak language
Score < 70 = warning logged
```

---

## Memory System

### What We Track (athlete_nodes)
- **Body parts:** ankle, knee, hip → status + score (1-10)
- **Metrics:** vertical_jump, sprint_time
- **Mental:** confidence, motivation
- **Recovery:** sleep_quality, fatigue

### Correlations (edges)
```
high_volume_plyos CAUSES knee_pain (strength: 0.85)
ankle_mobility IMPROVES vertical_jump (strength: 0.72)
```

### RED FLAG System
Nodes with score < 6 are "red flags" and injected into every prompt.

---

## Development

```bash
# Build
pnpm build

# Convex dev
npx convex dev

# Deploy Convex
npx convex deploy

# Type check
pnpm typecheck
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/router/index.ts` | Main export, `routeAndExecute()` |
| `src/router/wolf-router.ts` | Classification logic |
| `src/router/model-executor.ts` | LLM execution |
| `src/router/voice-wrapper.ts` | Brand voice |
| `src/config/models.ts` | Model IDs, pricing, thresholds |
| `convex/schema.ts` | Database schema |
| `convex/memory/retrieve.ts` | Memory retrieval |
| `convex/memory/ingest.ts` | Memory extraction |

---

## TODO (Not Yet Implemented)

- [ ] `/api/chat` endpoint in web-academy
- [ ] Streaming responses
- [ ] Prompt caching (`prompt-caching-2024-07-31`)
- [ ] Vector search for training_content
- [ ] Gemini visual generation
