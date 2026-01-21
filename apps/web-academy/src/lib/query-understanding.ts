/**
 * Query Understanding Module
 *
 * Analyzes user queries to extract:
 * - Intent: What type of content they're looking for
 * - Entities: Sports, skills, age groups, constraints
 * - Query expansion: Synonyms and related terms
 *
 * Runs entirely on edge (no LLM calls) for fast inference.
 */

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type QueryIntent =
  | "find_drill" // Looking for a specific drill or exercise
  | "learn_technique" // Wants to learn how to do something
  | "fix_problem" // Has a problem to solve (injury, bad form, etc.)
  | "get_advice" // General advice or guidance
  | "compare" // Comparing options
  | "unknown";

export interface QueryEntity {
  type: "sport" | "skill" | "age" | "difficulty" | "constraint" | "body_part" | "equipment";
  value: string;
  confidence: number;
}

export interface QueryUnderstanding {
  originalQuery: string;
  normalizedQuery: string;
  intent: QueryIntent;
  intentConfidence: number;
  entities: QueryEntity[];
  expandedTerms: string[];
  suggestedFilters: {
    sport?: string;
    skill?: string;
    age?: number;
    difficulty?: string;
    constraint?: string;
  };
}

// ─────────────────────────────────────────────────────────────
// KNOWLEDGE BASE
// ─────────────────────────────────────────────────────────────

const SPORTS = [
  "basketball",
  "soccer",
  "football",
  "volleyball",
  "tennis",
  "lacrosse",
  "flag football",
  "all-sports",
  "general",
];

const SKILLS: Record<string, string[]> = {
  basketball: [
    "shooting",
    "dribbling",
    "passing",
    "defense",
    "footwork",
    "rebounding",
    "post moves",
    "ball handling",
  ],
  soccer: ["dribbling", "passing", "shooting", "defense", "goalkeeping", "first touch"],
  football: ["throwing", "catching", "route running", "blocking", "tackling"],
  volleyball: ["serving", "passing", "setting", "hitting", "blocking", "digging"],
  tennis: ["serve", "forehand", "backhand", "volley", "footwork"],
  lacrosse: ["cradling", "passing", "shooting", "ground balls", "defense"],
  general: ["speed", "agility", "strength", "flexibility", "balance", "coordination"],
};

const BODY_PARTS = [
  "ankle",
  "knee",
  "hip",
  "foot",
  "feet",
  "leg",
  "arm",
  "shoulder",
  "wrist",
  "back",
  "core",
  "arch",
];

const CONSTRAINTS = [
  "indoor",
  "outdoor",
  "no equipment",
  "solo",
  "partner",
  "team",
  "silent",
  "quiet",
  "apartment",
  "small space",
  "barefoot",
  "home",
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced", "pro", "easy", "hard"];

const INTENT_PATTERNS: { pattern: RegExp; intent: QueryIntent; confidence: number }[] = [
  { pattern: /how (do|to|can) (i|you|we)/i, intent: "learn_technique", confidence: 0.9 },
  { pattern: /what('s| is) the best way/i, intent: "learn_technique", confidence: 0.85 },
  { pattern: /teach me/i, intent: "learn_technique", confidence: 0.9 },
  { pattern: /show me/i, intent: "find_drill", confidence: 0.8 },
  { pattern: /drill(s)? for/i, intent: "find_drill", confidence: 0.95 },
  { pattern: /exercise(s)? for/i, intent: "find_drill", confidence: 0.9 },
  { pattern: /workout(s)? for/i, intent: "find_drill", confidence: 0.85 },
  { pattern: /fix (my|the|a)/i, intent: "fix_problem", confidence: 0.9 },
  { pattern: /improve (my|the)/i, intent: "fix_problem", confidence: 0.8 },
  { pattern: /prevent/i, intent: "fix_problem", confidence: 0.85 },
  { pattern: /stop (my|the)/i, intent: "fix_problem", confidence: 0.8 },
  { pattern: /why (do|does|is|am)/i, intent: "get_advice", confidence: 0.7 },
  { pattern: /should (i|we|my)/i, intent: "get_advice", confidence: 0.75 },
  { pattern: /is .* (safe|ok|good|bad|dangerous)/i, intent: "get_advice", confidence: 0.8 },
  { pattern: /(better than|vs\.?|versus|\bor\b.*\bor\b|compared to)/i, intent: "compare", confidence: 0.8 },
];

const SYNONYMS: Record<string, string[]> = {
  drill: ["exercise", "workout", "training", "practice"],
  shooting: ["shot", "jumper", "three pointer", "free throw"],
  dribbling: ["ball handling", "handles", "crossover"],
  barefoot: ["shoeless", "no shoes", "minimalist"],
  ankle: ["ankles", "ankle joint"],
  injury: ["pain", "hurt", "sore", "injured"],
  kid: ["child", "youth", "young", "junior"],
  fast: ["quick", "speed", "rapid"],
};

// ─────────────────────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────────────────────

export function analyzeQuery(query: string): QueryUnderstanding {
  const normalizedQuery = normalizeQuery(query);
  const entities = extractEntities(normalizedQuery);
  const intent = detectIntent(normalizedQuery, entities);
  const expandedTerms = expandQuery(normalizedQuery);
  const suggestedFilters = buildFilters(entities);

  return {
    originalQuery: query,
    normalizedQuery,
    intent: intent.intent,
    intentConfidence: intent.confidence,
    entities,
    expandedTerms,
    suggestedFilters,
  };
}

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, " ") // Remove punctuation
    .replace(/\s+/g, " "); // Normalize whitespace
}

function extractEntities(query: string): QueryEntity[] {
  const entities: QueryEntity[] = [];
  const seen = new Set<string>(); // Deduplicate

  // Extract sports
  for (const sport of SPORTS) {
    if (query.includes(sport) && !seen.has(`sport:${sport}`)) {
      entities.push({ type: "sport", value: sport, confidence: 0.95 });
      seen.add(`sport:${sport}`);
    }
  }

  // Extract skills (check sport-specific, deduplicate)
  for (const [sport, skills] of Object.entries(SKILLS)) {
    for (const skill of skills) {
      if (query.includes(skill) && !seen.has(`skill:${skill}`)) {
        entities.push({ type: "skill", value: skill, confidence: 0.9 });
        seen.add(`skill:${skill}`);
      }
    }
  }

  // Extract body parts
  for (const part of BODY_PARTS) {
    if (query.includes(part)) {
      entities.push({ type: "body_part", value: part, confidence: 0.85 });
    }
  }

  // Extract constraints
  for (const constraint of CONSTRAINTS) {
    if (query.includes(constraint)) {
      entities.push({ type: "constraint", value: constraint, confidence: 0.9 });
    }
  }

  // Extract difficulty
  for (const diff of DIFFICULTIES) {
    if (query.includes(diff)) {
      entities.push({ type: "difficulty", value: normalizeDifficulty(diff), confidence: 0.85 });
    }
  }

  // Extract age (look for patterns like "8 year old", "u12", "ages 6-10")
  const agePatterns = [
    /(\d{1,2})\s*year\s*old/i,
    /age[sd]?\s*(\d{1,2})/i,
    /u(\d{1,2})/i,
    /(\d{1,2})\s*-\s*(\d{1,2})/i,
  ];

  for (const pattern of agePatterns) {
    const match = query.match(pattern);
    if (match) {
      const age = parseInt(match[1]);
      if (age >= 4 && age <= 18) {
        entities.push({ type: "age", value: String(age), confidence: 0.9 });
      }
    }
  }

  return entities;
}

function normalizeDifficulty(diff: string): string {
  const mapping: Record<string, string> = {
    easy: "beginner",
    hard: "advanced",
    pro: "advanced",
  };
  return mapping[diff] || diff;
}

function detectIntent(
  query: string,
  entities: QueryEntity[]
): { intent: QueryIntent; confidence: number } {
  // Check pattern matches
  for (const { pattern, intent, confidence } of INTENT_PATTERNS) {
    if (pattern.test(query)) {
      return { intent, confidence };
    }
  }

  // Infer from entities
  if (entities.some((e) => e.type === "body_part")) {
    // Body part mentions often indicate injury/fix intent
    if (query.includes("safe") || query.includes("prevent") || query.includes("injury")) {
      return { intent: "fix_problem", confidence: 0.75 };
    }
    return { intent: "find_drill", confidence: 0.6 };
  }

  if (entities.some((e) => e.type === "skill")) {
    return { intent: "find_drill", confidence: 0.7 };
  }

  if (entities.some((e) => e.type === "sport")) {
    return { intent: "find_drill", confidence: 0.6 };
  }

  return { intent: "unknown", confidence: 0.3 };
}

function expandQuery(query: string): string[] {
  const expanded: Set<string> = new Set();

  for (const [term, synonyms] of Object.entries(SYNONYMS)) {
    if (query.includes(term)) {
      for (const syn of synonyms) {
        expanded.add(syn);
      }
    }
    // Also check reverse - if query has a synonym, add the main term
    for (const syn of synonyms) {
      if (query.includes(syn)) {
        expanded.add(term);
      }
    }
  }

  return Array.from(expanded);
}

function buildFilters(entities: QueryEntity[]): QueryUnderstanding["suggestedFilters"] {
  const filters: QueryUnderstanding["suggestedFilters"] = {};

  for (const entity of entities) {
    switch (entity.type) {
      case "sport":
        if (!filters.sport) filters.sport = entity.value;
        break;
      case "skill":
        if (!filters.skill) filters.skill = entity.value;
        break;
      case "age":
        if (!filters.age) filters.age = parseInt(entity.value);
        break;
      case "difficulty":
        if (!filters.difficulty) filters.difficulty = entity.value;
        break;
      case "constraint":
        if (!filters.constraint) filters.constraint = entity.value;
        break;
    }
  }

  return filters;
}

// ─────────────────────────────────────────────────────────────
// QUERY ENHANCEMENT
// ─────────────────────────────────────────────────────────────

/**
 * Enhance the original query with expanded terms for better search
 */
export function enhanceQueryForSearch(understanding: QueryUnderstanding): string {
  const parts = [understanding.normalizedQuery];

  // Add high-confidence expanded terms
  if (understanding.expandedTerms.length > 0) {
    parts.push(...understanding.expandedTerms.slice(0, 3));
  }

  return parts.join(" ");
}

/**
 * Generate a semantic search boost based on intent
 */
export function getIntentSearchBoost(intent: QueryIntent): {
  drillWeight: number;
  articleWeight: number;
} {
  switch (intent) {
    case "find_drill":
      return { drillWeight: 1.5, articleWeight: 0.7 };
    case "learn_technique":
      return { drillWeight: 1.2, articleWeight: 1.0 };
    case "fix_problem":
      return { drillWeight: 0.8, articleWeight: 1.5 };
    case "get_advice":
      return { drillWeight: 0.5, articleWeight: 1.5 };
    case "compare":
      return { drillWeight: 0.8, articleWeight: 1.2 };
    default:
      return { drillWeight: 1.0, articleWeight: 1.0 };
  }
}
