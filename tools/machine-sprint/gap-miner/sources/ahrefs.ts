import { z } from 'zod';

// ============================================================================
// AHREFS API INTEGRATION
// Docs: https://docs.ahrefs.com/docs/api
// ============================================================================

const AHREFS_API_BASE = 'https://api.ahrefs.com/v3';

// Schema for keyword data
const KeywordSchema = z.object({
  keyword: z.string(),
  volume: z.number(),
  difficulty: z.number(),
  cpc: z.number().optional(),
  parent_topic: z.string().optional(),
  serp_features: z.array(z.string()).optional(),
});

const GapSchema = z.object({
  keyword: z.string(),
  source: z.literal('ahrefs'),
  volume: z.number(),
  difficulty: z.number(),
  intent: z.enum(['informational', 'commercial', 'transactional', 'navigational']),
  cluster: z.string(),
  sport: z.string(),
  age_group: z.string().optional(),
});

type Gap = z.infer<typeof GapSchema>;

// Competitor domains to analyze
const COMPETITORS = [
  'breakthroughbasketball.com',
  'coachmac-basketball.com',
  'basketballforcoaches.com',
  'stack.com',
  'activekids.com',
];

// Our target topics
const TARGET_CLUSTERS = {
  'home-training': ['home', 'apartment', 'indoor', 'quiet', 'no hoop', 'small space'],
  'shooting': ['shooting', 'shot', 'form', 'accuracy', 'free throw'],
  'ball-handling': ['dribbling', 'ball handling', 'handles', 'crossover'],
  'footwork': ['footwork', 'feet', 'movement', 'agility'],
  'barefoot': ['barefoot', 'foot strength', 'toe', 'ankle', 'flat feet'],
  'injury-prevention': ['injury', 'prevent', 'sever', 'knee', 'ankle sprain'],
  'speed-agility': ['speed', 'agility', 'quick', 'fast', 'acceleration'],
  'youth-development': ['youth', 'kids', 'children', 'young', 'beginner'],
};

// Age group detection
function detectAgeGroup(keyword: string): string | undefined {
  const agePatterns = [
    { pattern: /\b(5|6|7)\s*(year|yr)/, group: '5-7' },
    { pattern: /\b(7|8|9)\s*(year|yr)/, group: '7-9' },
    { pattern: /\b(8|9|10)\s*(year|yr)/, group: '8-10' },
    { pattern: /\b(10|11|12)\s*(year|yr)/, group: '10-12' },
    { pattern: /\b(13|14|15)\s*(year|yr)/, group: '13-15' },
    { pattern: /\b(16|17|18)\s*(year|yr)/, group: '16-18' },
    { pattern: /\bkids?\b/i, group: '7-12' },
    { pattern: /\byouth\b/i, group: '8-14' },
    { pattern: /\bteen/i, group: '13-18' },
    { pattern: /\belementary/i, group: '6-10' },
    { pattern: /\bmiddle school/i, group: '11-14' },
    { pattern: /\bhigh school/i, group: '14-18' },
  ];

  for (const { pattern, group } of agePatterns) {
    if (pattern.test(keyword)) return group;
  }
  return undefined;
}

// Detect sport from keyword
function detectSport(keyword: string): string {
  const kw = keyword.toLowerCase();
  if (kw.includes('basketball') || kw.includes('hoop') || kw.includes('dribbl')) return 'basketball';
  if (kw.includes('soccer') || kw.includes('football') && !kw.includes('american')) return 'soccer';
  if (kw.includes('football') || kw.includes('quarterback')) return 'football';
  if (kw.includes('baseball') || kw.includes('batting')) return 'baseball';
  if (kw.includes('barefoot') || kw.includes('foot strength')) return 'barefoot';
  return 'general';
}

// Detect cluster from keyword
function detectCluster(keyword: string): string {
  const kw = keyword.toLowerCase();
  for (const [cluster, patterns] of Object.entries(TARGET_CLUSTERS)) {
    if (patterns.some(p => kw.includes(p))) return cluster;
  }
  return 'general';
}

// Detect search intent
function detectIntent(keyword: string): Gap['intent'] {
  const kw = keyword.toLowerCase();
  if (kw.includes('buy') || kw.includes('price') || kw.includes('cost')) return 'transactional';
  if (kw.includes('best') || kw.includes('review') || kw.includes('vs')) return 'commercial';
  if (kw.includes('how') || kw.includes('what') || kw.includes('why') || kw.includes('drill')) return 'informational';
  return 'informational';
}

export class AhrefsGapMiner {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetch(endpoint: string, params: Record<string, string>) {
    const url = new URL(`${AHREFS_API_BASE}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ahrefs API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Content Gap Analysis
   * Find keywords competitors rank for that we don't
   */
  async getContentGaps(ourDomain: string): Promise<Gap[]> {
    const gaps: Gap[] = [];

    for (const competitor of COMPETITORS) {
      try {
        // Get keywords competitor ranks for in top 10
        const data = await this.fetch('/site-explorer/organic-keywords', {
          target: competitor,
          mode: 'domain',
          country: 'us',
          limit: '1000',
          where: JSON.stringify({
            and: [
              { field: 'position', is: 'lte', value: 10 },
              { field: 'volume', is: 'gte', value: 100 },
              { field: 'keyword_difficulty', is: 'lte', value: 30 },
            ]
          }),
        });

        for (const kw of data.keywords || []) {
          // Filter for our target topics
          const cluster = detectCluster(kw.keyword);
          if (cluster === 'general') continue;

          gaps.push({
            keyword: kw.keyword,
            source: 'ahrefs',
            volume: kw.volume,
            difficulty: kw.keyword_difficulty,
            intent: detectIntent(kw.keyword),
            cluster,
            sport: detectSport(kw.keyword),
            age_group: detectAgeGroup(kw.keyword),
          });
        }
      } catch (error) {
        console.error(`Error fetching gaps for ${competitor}:`, error);
      }
    }

    // Dedupe by keyword
    const seen = new Set<string>();
    return gaps.filter(g => {
      if (seen.has(g.keyword)) return false;
      seen.add(g.keyword);
      return true;
    });
  }

  /**
   * Keyword Ideas
   * Expand from seed keywords
   */
  async getKeywordIdeas(seedKeywords: string[]): Promise<Gap[]> {
    const gaps: Gap[] = [];

    for (const seed of seedKeywords) {
      try {
        const data = await this.fetch('/keywords-explorer/keyword-ideas', {
          keyword: seed,
          country: 'us',
          limit: '500',
          where: JSON.stringify({
            and: [
              { field: 'volume', is: 'gte', value: 50 },
              { field: 'keyword_difficulty', is: 'lte', value: 25 },
            ]
          }),
        });

        for (const kw of data.keywords || []) {
          gaps.push({
            keyword: kw.keyword,
            source: 'ahrefs',
            volume: kw.volume,
            difficulty: kw.keyword_difficulty,
            intent: detectIntent(kw.keyword),
            cluster: detectCluster(kw.keyword),
            sport: detectSport(kw.keyword),
            age_group: detectAgeGroup(kw.keyword),
          });
        }
      } catch (error) {
        console.error(`Error fetching ideas for "${seed}":`, error);
      }
    }

    return gaps;
  }

  /**
   * Questions
   * Get question-format keywords (great for Q&A pages)
   */
  async getQuestions(topic: string): Promise<Gap[]> {
    const data = await this.fetch('/keywords-explorer/questions', {
      keyword: topic,
      country: 'us',
      limit: '200',
    });

    return (data.keywords || []).map((kw: any) => ({
      keyword: kw.keyword,
      source: 'ahrefs' as const,
      volume: kw.volume,
      difficulty: kw.keyword_difficulty,
      intent: 'informational' as const,
      cluster: detectCluster(kw.keyword),
      sport: detectSport(kw.keyword),
      age_group: detectAgeGroup(kw.keyword),
    }));
  }
}

// Seed keywords for expansion
export const SEED_KEYWORDS = [
  // Basketball
  'youth basketball drills',
  'basketball drills for kids',
  'basketball training at home',
  'quiet basketball drills apartment',
  'basketball shooting form',

  // Barefoot / Movement
  'barefoot training youth',
  'foot strengthening exercises kids',
  'flat feet exercises children',
  'severs disease exercises',
  'ankle strengthening youth athletes',

  // General Athletic Development
  'youth speed training',
  'agility drills for kids',
  'injury prevention youth sports',
  'youth athlete nutrition',
];

export type { Gap };
