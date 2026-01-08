# AskYP / Wolf AI Coach - Technical Specification

> **Last Updated:** January 2, 2026
> **Status:** Wolf Pack Protocol v2.0 - Memory-First Architecture
> **Location:** `packages/yp-alpha/src/router/`
> **Version:** 2.0.0 (Memory Kernel Active)

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Models & Pricing](#models--pricing)
4. [Routing System](#routing-system)
5. [Voice Wrapper (Guardrails)](#voice-wrapper-guardrails)
6. [Knowledge Base](#knowledge-base)
7. [API Keys & Configuration](#api-keys--configuration)
8. [UI Components](#ui-components)
9. [Current Limitations](#current-limitations)
10. [Upgrade Roadmap](#upgrade-roadmap)

---

## Overview

**AskYP** (internally called "Wolf AI Coach") is a multi-tier AI assistant for the YouthPerformance ecosystem. It uses intelligent routing to balance cost, quality, and latency.

### Core Philosophy
- **Direct & Ruthless** - No wellness-speak, no fluff
- **Data-Driven** - Reference metrics, not feelings
- **Cost-Optimized** - 90% Haiku, 10% Sonnet, <1% Opus

### Product Features
| Feature | Status | Model Used |
|---------|--------|------------|
| Quick Q&A | ✅ Complete | Haiku 4.5 |
| Emotional Coaching | ✅ Complete | Sonnet 4.5 |
| Season Planning | ✅ Complete | Opus 4.5 |
| Daily Stack Generator | ✅ Complete | Haiku 4.5 |
| Visual Generation | 🔄 Placeholder | Gemini 2.0 |
| Chat UI | 🔄 Skeleton only | - |

---

## Architecture

### Wolf Pack Protocol v2.0 - Memory-First Architecture

**Previous Flow (v1.0 - Stateless):**
```
User Request → Router → LLM → Regex Filter → Response
```

**New Flow (v2.0 - Stateful & Sovereign):**
```
1. INGEST: User Request → MEMORY RETRIEVAL (Who is this kid? What hurts?)
2. THINK:  Router decides Model + injects Memory Context (HUD)
3. ACT:    LLM generates response with full athlete context
4. STORE:  Memory Agent extracts new data → Graph Update → Convex
```

### Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER REQUEST                             │
│            "I want to dunk today"                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│             MEMORY RETRIEVAL (The "Recall")                 │
│  • Fetch "Red List" - Critical nodes (Score < 6)            │
│  • Fetch "Topic Context" - Relevant body parts/metrics      │
│  • Fetch "Correlations" - Known patterns                    │
│  • Location: convex/memory/retrieve.ts                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              CONTEXT INJECTION (The "HUD")                  │
│  === ATHLETE BIO-DATA (LIVE GRAPH) ===                      │
│  RED FLAGS: left_ankle is CRITICAL - Swollen (3/10)         │
│  RELEVANT CONTEXT: vertical_jump: Plateaued (6/10)          │
│  KNOWN PATTERNS: high_plyos CAUSES knee_pain (85%)          │
│  ================================================           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              WOLF ROUTER (Haiku 4.5)                        │
│  • Classifies intent (EXECUTION/COACHING/CREATION/PLANNING) │
│  • Detects sentiment (NEUTRAL/FRUSTRATED/HYPE/SAD/ANXIOUS)  │
│  • Scores complexity (1-10)                                 │
│  • NOW SEES: Injury context from Memory                     │
│  • Target: <100ms classification                            │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   THE GRUNT     │ │   THE WOLF      │ │  THE ARCHITECT  │
│   (Haiku 4.5)   │ │   (Sonnet 4.5)  │ │   (Opus 4.5)    │
│                 │ │                 │ │                 │
│ • Data lookups  │ │ • Coaching      │ │ • Season plans  │
│ • Quick Q&A     │ │ • Emotional     │ │ • Periodization │
│ • Product info  │ │ • Troubleshoot  │ │ • Deep analysis │
│ • Scheduling    │ │ • Injury assess │ │                 │
│                 │ │                 │ │                 │
│ Latency: <500ms │ │ Latency: <2s    │ │ Latency: <10s   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              VOICE WRAPPER (Post-Processing)                │
│  • Enforces Wolf Pack terminology                           │
│  • Removes banned words                                     │
│  • Audits & scores responses (0-100)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     RESPONSE TO USER                         │
│  "Negative. Your left ankle is flagged as swollen.          │
│   We are grounding you today. Do Floor Handle stack."       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│             MEMORY INGESTION (Background)                   │
│  • Extract insights from conversation                       │
│  • Update athlete_nodes with new data                       │
│  • Store in memories table for processing                   │
│  • Location: convex/memory/ingest.ts                        │
│  • Fire-and-forget (doesn't block response)                 │
└─────────────────────────────────────────────────────────────┘
```

### File Structure
```
packages/yp-alpha/
├── src/
│   ├── router/
│   │   ├── index.ts           # Main entry: routeAndExecute() + memory wiring
│   │   ├── wolf-router.ts     # Request classification + context injection
│   │   ├── model-executor.ts  # Model execution layer
│   │   └── voice-wrapper.ts   # Guardrails & voice enforcement
│   ├── config/
│   │   └── models.ts          # Model definitions & pricing
│   ├── tools/
│   │   └── daily-stack.ts     # Training stack generator
│   └── utils/
│       └── logger.ts          # Logging system
└── convex/
    ├── schema.ts              # Memory Kernel tables + existing tables
    ├── memory/
    │   ├── retrieve.ts        # getAthleteContext(), getFullGraph()
    │   └── ingest.ts          # ingestConversation(), updateAthleteNode()
    ├── gamification.ts        # XP, crystals, ranks
    ├── progress.ts            # Workout completions
    └── users.ts               # User management
```

---

## Models & Pricing

### Model Definitions
```typescript
export const MODEL_CONFIG = {
  FAST: "claude-haiku-4-5-20251015",     // The Grunt
  SMART: "claude-sonnet-4-5-20250929",   // The Wolf
  DEEP: "claude-opus-4-5-20251124",      // The Architect
  CREATIVE: "gemini-2.0-flash-exp"       // The Artist (external)
}
```

### Token Pricing (per 1M tokens) - December 2025
| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| Haiku 4.5 | $0.25 | $1.25 | 90% of requests |
| Sonnet 4.5 | $3.00 | $15.00 | 10% of requests |
| Opus 4.5 | $15.00 | $75.00 | <1% of requests |

### Max Token Limits
| Model | Max Tokens | Reason |
|-------|------------|--------|
| FAST (Haiku) | 1,024 | Keep responses tight |
| SMART (Sonnet) | 2,048 | Allow more depth |
| DEEP (Opus) | 4,096 | Full analysis |
| CREATIVE | 256 | Just commands |

### Latency Targets (p95)
| Stage | Target |
|-------|--------|
| Router Classification | <100ms |
| Haiku Response | <500ms |
| Sonnet Response | <2s |
| Opus Response | <10s |

---

## Routing System

### Intent Classification
| Intent | Description | Default Model |
|--------|-------------|---------------|
| EXECUTION | Data lookups, simple requests | Haiku |
| COACHING | Emotional support, troubleshooting | Sonnet |
| CREATION | Visual generation | Gemini |
| PLANNING | Season planning, periodization | Opus |

### Sentiment Detection
| Sentiment | Description | Escalation? |
|-----------|-------------|-------------|
| NEUTRAL | Standard request | No |
| HYPE | Excitement, celebration | No |
| FRUSTRATED | Disappointment, stuck | **Yes → Sonnet** |
| SAD | Dejection, defeat | **Yes → Sonnet** |
| ANXIOUS | Worry, fear | **Yes → Sonnet** |

### Complexity Scoring (1-10)
| Range | Model Assignment |
|-------|------------------|
| 1-6 | Haiku handles |
| 7-9 | Sonnet handles |
| 10 | Opus handles |

### Gatekeeper System Prompt
```
You are the YP Gatekeeper. Your job is to route athlete requests to the right "Wolf."

ROUTING RULES:
1. EXECUTION (The Grunt - Haiku):
   - Data lookups: "Show my stats", "What's my vertical?"
   - Simple requests: "Give me a 15-min workout"
   - Complexity: 1-6

2. COACHING (The Wolf - Sonnet):
   - Emotional content: "I feel like quitting", "I'm frustrated"
   - Complex analysis: "Why am I not improving?"
   - Complexity: 7-9
   - ANY request from FRUSTRATED, SAD, or ANXIOUS user

3. PLANNING (The Architect - Opus):
   - Season planning: "Plan my next 3 months"
   - Complexity: 10

CRITICAL: If sentiment is FRUSTRATED, SAD, or ANXIOUS,
ALWAYS route to COACHING regardless of complexity.
```

### Escalation Logic
1. **Sentiment Escalation**: Emotional users → Always Sonnet
2. **Frustrated Loop Detection**: 3+ consecutive FRUSTRATED → Proactive intervention
3. **Failure Escalation**: 2+ failures on Haiku → Auto-escalate to Sonnet
4. **Retry with Escalation**: Failed request → Try next tier model

---

## Voice Wrapper (Guardrails)

### Banned Words → Replacements
```typescript
const WORD_REPLACEMENTS = {
  // Core terminology
  "exercise" → "drill",
  "workout" → "stack",
  "jog" → "run",
  "wellness" → "performance",
  "tummy" → "core",
  "butt" → "glute",
  "stretch" → "mobility work",
  "rest" → "recovery protocol",
  "tired" → "fatigued",
  "sore" → "loaded",

  // Soft language removal
  "maybe" → "",
  "perhaps" → "",
  "might want to" → "will",
  "you could" → "you will",
  "consider" → "do",
  "try to" → "",
  "i think" → "",

  // Wellness-speak elimination
  "self-care" → "recovery protocol",
  "mindfulness" → "focus work",
  "take a break" → "active recovery",
  "listen to your body" → "check your readiness score",
  "be gentle" → "control the load",

  // Enthusiasm dampeners
  "great job!" → "solid.",
  "awesome!" → "locked in.",
  "amazing!" → "elite.",
}
```

### Phrase Pattern Replacements
```typescript
const PHRASE_PATTERNS = [
  /oh no[!.,]?/ → "",                     // Remove sympathy
  /!{2,}/ → ".",                          // Reduce exclamations
  /i'm sorry[,.]?/ → "",                  // Remove apologies
  /you're doing great/ → "progress tracked",
  /feel free to/ → "",
  /would you like to/ → "I will",
  /take your time/ → "execute now",
  /whenever you're ready/ → "begin",
]
```

### Model-Specific System Prompts

**Haiku (FAST):**
```
You are AskYP. Direct. Ruthless. No fluff.
BANNED: exercise, workout, jog, wellness, tummy, butt, stretch, rest, tired, sore.
USE: drill, stack, run, performance, core, glute, mobility, recovery, fatigued, loaded.
TONE: Commands, not suggestions. Data, not feelings.
```

**Sonnet (SMART):**
```
You are AskYP, an elite performance coach for the YouthPerformance ecosystem.

VOICE RULES:
- Direct: Every word earns its place. No filler.
- Ruthless: Believe in the athlete, never coddle.
- Data-driven: Reference their metrics, not feelings.

PHILOSOPHY:
1. Foundation First - Feet and ankles before everything
2. Durability is Speed - Injury prevention is non-negotiable
3. Silence is Loud - Control before power (NeoBall reference)

When athletes are frustrated: Acknowledge, diagnose, prescribe. No sympathy speeches.
```

**Opus (DEEP):**
```
You are AskYP, the Chief Sports Scientist for YouthPerformance.

Your role is strategic periodization and long-term athlete development.
You see patterns across months, not moments.
You architect seasons, not sessions.

VOICE: The same Wolf Pack directness, but with the gravitas of a head coach.
```

### Voice Audit Scoring
| Violation | Penalty |
|-----------|---------|
| Banned word found | -15 points |
| >2 exclamation marks | -15 points |
| Apology language | -15 points |
| Weak/hedging language | -15 points |
| Wellness-speak | -15 points |

**Score**: 100 - (violations × 15)

---

## Knowledge Base

### Memory Kernel (Wolf Pack Protocol v2.0)

| Table | Type | Status | Used For |
|-------|------|--------|----------|
| `conversations` | Chat sessions | ✅ Active | Conversation tracking |
| `messages` | Individual messages | ✅ Active | Chat history |
| `athlete_nodes` | Graph nodes | ✅ Active | Body parts, metrics, mental state |
| `correlations` | Graph edges | ✅ Active | "A CAUSES B" relationships |
| `memories` | Raw extraction | ✅ Active | Buffer before graph distillation |
| `training_content` | RAG | 🔄 Needs embeddings | Drills, articles, FAQs |

### Athlete Graph Schema
```typescript
// The Nodes - What we track about each athlete
athlete_nodes: {
  userId: string;
  key: string;           // "left_knee", "vertical_jump", "confidence"
  category: "body_part" | "metric" | "mental" | "recovery";
  status: string;        // "Healthy", "Sore", "Injured", "Improving"
  score: number;         // 1-10 (1=Critical, 10=Elite)
  notes?: string;        // "Rolled ankle at practice 12/28"
  lastUpdated: number;
}

// The Edges - How things relate
correlations: {
  userId: string;
  fromNode: string;      // "high_volume_plyos"
  toNode: string;        // "knee_pain"
  relationship: "CAUSES" | "IMPROVES" | "BLOCKS" | "CORRELATES";
  strength: number;      // 0-1 confidence
}
```

### Memory Context (Injected to LLM)
```typescript
interface MemoryContext {
  red_flags: Array<{
    key: string;       // "left_ankle"
    status: string;    // "Swollen"
    score: number;     // 3
    formatted: string; // "left ankle is CRITICAL - Swollen (3/10)"
  }>;
  relevant_context: Array<{ key, status, score, formatted }>;
  known_correlations: Array<{ from, to, relationship, formatted }>;
  recent_insights: string[];
  stats: {
    total_nodes: number;
    critical_count: number;
    has_active_issues: boolean;
  };
}
```

### User Context Schema
```typescript
interface UserContext {
  userId: string;
  recentSentiment?: string[];      // Last 3 messages sentiment
  currentStreak?: number;          // Training streak
  durabilityScore?: number;        // Health metric 0-100
  lastInteractionType?: string;    // What they did last
  equipmentOwned?: string[];       // Gear they have
  injuryStatus?: string;           // Auto-populated from memory red flags
}
```

### RAG/Knowledge Base Status
- **Implemented**: Athlete Graph memory system
- **Pending**: Vector embeddings for `training_content` table
- **Requires**: OpenAI API key for `text-embedding-3-small`

---

## API Keys & Configuration

### Required Environment Variables
```bash
# Anthropic (Claude API)
ANTHROPIC_API_KEY=sk-ant-...

# Convex Database
CONVEX_DEPLOYMENT=dev:wry-cuttlefish-942
NEXT_PUBLIC_CONVEX_URL=https://wry-cuttlefish-942.convex.cloud

# Shopify (for product queries)
SHOPIFY_STOREFRONT_API_TOKEN=...
```

### SDK Versions
```json
{
  "@anthropic-ai/sdk": "^0.33.0",
  "convex": "^1.31.2",
  "zod": "^3.x"
}
```

---

## UI Components

### Ask Wolf Page
**Location:** `apps/web-academy/src/app/(main)/ask-wolf/page.tsx`

| State | Behavior |
|-------|----------|
| Free User | Locked - shows upsell modal |
| Pro User | Chat interface (skeleton only) |

### Sample Questions (Marketing)
```
- How do I improve my ankle mobility?
- What should I eat before training?
- How long until I see results?
- Can I do this with shin splints?
```

### Marketing Wolf Chat
**Location:** `apps/marketing/src/pages/WolfChat.jsx`
- Preloaded demo experience
- Analytics tracking
- First message based on onboarding context

---

## Current Limitations

### Not Yet Implemented
1. ~~**Conversation History**~~ ✅ - Now persisted in Convex
2. **Chat API Route** - No `/api/chat` endpoint yet
3. **Full Chat UI** - Pro users see skeleton "coming soon"
4. **RAG/Vector DB** - Schema ready, needs embeddings ingestion
5. **Gemini Integration** - Placeholder only for visual generation
6. **Streaming** - Responses are not streamed

### Technical Debt
1. TypeScript errors in `daily-stack.ts` (MCP import issues)
2. ~~No conversation/message tables~~ ✅ - Added in v2.0
3. Voice wrapper runs post-hoc (should move to context caching)

---

## Upgrade Roadmap

### Phase 1: Core Chat ✅ COMPLETE
- [x] Add `conversations` and `messages` tables to Convex
- [x] Add `athlete_nodes`, `correlations`, `memories` tables (Athlete Graph)
- [x] Memory retrieval layer (`convex/memory/retrieve.ts`)
- [x] Memory ingestion layer (`convex/memory/ingest.ts`)
- [x] Context injection in wolf-router (HUD)
- [ ] Create `/api/chat` API route
- [ ] Implement full chat UI for Pro users
- [ ] Add streaming responses

### Phase 2: Knowledge Enhancement
- [x] Schema for `training_content` with vector field
- [ ] Ingest drill library with embeddings
- [ ] Enable vector index for semantic search
- [ ] RAG for training content retrieval

### Phase 3: Advanced Features
- [ ] Gemini visual generation
- [ ] Voice input/output
- [ ] Multi-modal (image analysis of form)
- [ ] Tool use (calendar, reminders)

### Phase 4: Optimization
- [ ] Move voice rules to context caching (Anthropic `prompt-caching-2024-07-31`)
- [ ] Add response caching for common queries
- [ ] A/B test model routing thresholds

---

## Usage Examples

### Basic Usage (v2.0 with Memory)
```typescript
import { routeAndExecute } from "@yp/alpha/router";

const result = await routeAndExecute(
  "I want to dunk today",
  { userId: "user123" }
);

// If athlete has injured ankle (score < 6), response will be:
// "Negative. Your left ankle is flagged as swollen.
//  We are grounding you today. Do Floor Handle stack."

console.log(result.response);       // Wolf Pack voice response
console.log(result.model);          // "claude-sonnet-4-5-..."
console.log(result.voiceScore);     // 85 (audit score)
console.log(result.latencyMs);      // 1847
console.log(result.memoryInjected); // true (memory context was used)
```

### Memory Management
```typescript
import { getAthleteGraph, updateAthleteNode } from "@yp/alpha/router";

// Get athlete's full graph for dashboard
const graph = await getAthleteGraph("user123");
console.log(graph.summary); // { total: 12, critical: 2, healthy: 8, improving: 3 }
console.log(graph.byCategory.body_part); // All body part nodes

// Manually update a node (from coach or assessment)
await updateAthleteNode(
  "user123",
  "left_ankle",
  "body_part",
  "Recovering",
  5,
  "Cleared for light activity"
);
```

### Direct Model Execution
```typescript
import { modelExecutor } from "@yp/alpha/router";

// Force Haiku
const result = await modelExecutor.executeHaiku(
  "What's my vertical jump?",
  { userId: "user123" }
);

// Force Sonnet with custom context
const result = await modelExecutor.executeSonnet(
  "Why am I plateauing?",
  {
    userId: "user123",
    systemPromptOverride: "Custom prompt with athlete HUD..."
  }
);
```

### Voice Enforcement
```typescript
import { enforceWolfPackVoice, voiceWrapper } from "@yp/alpha/router";

// Quick enforcement
const cleaned = enforceWolfPackVoice("Great job on your workout!");
// Output: "solid. on your stack."

// Full audit
const violations = voiceWrapper.audit(response);
const score = voiceWrapper.score(response);
```

---

## Summary

**AskYP is a memory-first, cost-optimized AI coaching system** that intelligently routes requests while maintaining long-term context about each athlete. The Wolf Pack Protocol v2.0 transforms AskYP from a "smart FAQ bot" into a **Long-Term Development Partner**.

**Key Stats:**
- 90% Haiku / 10% Sonnet / <1% Opus cost split
- <100ms routing classification
- 100-point voice compliance scoring
- Automatic sentiment-based escalation
- **Memory injection before every response**
- **Athlete Graph with body parts, metrics, correlations**
- **Fire-and-forget memory ingestion after responses**

**What's New in v2.0:**
- Athlete nodes track body parts, metrics, mental state (1-10 scores)
- Correlations map relationships ("plyos CAUSES knee_pain")
- Memory retrieval fetches "Red Flags" before every response
- HUD injection shows LLM the athlete's live bio-data
- Background ingestion learns from every conversation

**Next Priority:** Create `/api/chat` endpoint and full chat UI for Pro users.

---

*Generated by Wolf Pack Protocol v2.0*
*Memory-First Architecture for $100M*
