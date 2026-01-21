import fs from 'fs/promises';
import path from 'path';
import { ContentDeduper } from './deduper';

// ============================================================================
// OPPS FACTORY
// Prioritize, dedupe, and prepare opportunities for generation
// ============================================================================

interface Gap {
  keyword: string;
  source: string;
  volume: number;
  difficulty: number;
  intent: string;
  cluster: string;
  sport: string;
  age_group?: string;
}

interface Opportunity {
  id: string;
  keyword: string;
  priority_score: number;
  content_type: 'spoke' | 'qa' | 'drill' | 'pillar';
  parent_pillar: string;
  suggested_slug: string;
  suggested_title: string;
  suggested_description: string;
  expert: string;
  unique_asset_type: string;
  sport: string;
  cluster: string;
  age_group?: string;
  uniqueness_score?: number;
}

// Pillar mappings
const PILLAR_MAP: Record<string, { path: string; expert: string; asset: string }> = {
  'home-training': {
    path: '/basketball/home-training',
    expert: 'adam-harrington',
    asset: 'session-builder-embed',
  },
  'shooting': {
    path: '/basketball/shooting',
    expert: 'adam-harrington',
    asset: 'miss-analyzer-embed',
  },
  'ball-handling': {
    path: '/basketball/ball-handling',
    expert: 'adam-harrington',
    asset: 'drill-picker-embed',
  },
  'barefoot': {
    path: '/barefoot-training',
    expert: 'james-scott',
    asset: 'r3-progress-tracker',
  },
  'injury-prevention': {
    path: '/athletic-development/injury-prevention',
    expert: 'james-scott',
    asset: 'coach-corner-tip',
  },
  'speed-agility': {
    path: '/athletic-development/speed-agility',
    expert: 'james-scott',
    asset: 'drill-picker-embed',
  },
  'footwork': {
    path: '/basketball/footwork',
    expert: 'james-scott',
    asset: 'coach-corner-tip',
  },
  'youth-development': {
    path: '/athletic-development',
    expert: 'james-scott',
    asset: 'coach-corner-tip',
  },
};

function generateSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}

function generateTitle(keyword: string): string {
  // Capitalize first letter of each word, add parenthetical hook
  const base = keyword
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Add hook based on content type
  if (keyword.includes('at home') || keyword.includes('apartment')) {
    return `${base} (No Gym Needed)`;
  }
  if (keyword.includes('for') && keyword.includes('year old')) {
    return `${base} - Age-Appropriate Guide`;
  }
  return base;
}

function determineContentType(keyword: string, intent: string): Opportunity['content_type'] {
  const kw = keyword.toLowerCase();

  // Questions -> Q&A
  if (kw.startsWith('how') || kw.startsWith('what') || kw.startsWith('why') ||
      kw.startsWith('can') || kw.startsWith('is') || kw.includes('?')) {
    return 'qa';
  }

  // Specific drill keywords -> Drill
  if (kw.includes('drill') && !kw.includes('drills')) {
    return 'drill';
  }

  // Default -> Spoke
  return 'spoke';
}

function calculatePriorityScore(gap: Gap): number {
  // Score = volume × (1 - difficulty/100) × intent_multiplier × cluster_multiplier

  const intentMultiplier: Record<string, number> = {
    'informational': 1.0,
    'commercial': 1.2,
    'transactional': 0.8, // We're not selling directly
    'navigational': 0.5,
  };

  // Prioritize our key clusters
  const clusterMultiplier: Record<string, number> = {
    'home-training': 1.5,  // Our differentiation
    'shooting': 1.3,
    'barefoot': 1.4,
    'injury-prevention': 1.2,
    'ball-handling': 1.2,
    'footwork': 1.1,
    'speed-agility': 1.1,
    'youth-development': 1.0,
    'general': 0.8,
  };

  const base = gap.volume * (1 - gap.difficulty / 100);
  const intent = intentMultiplier[gap.intent] || 1.0;
  const cluster = clusterMultiplier[gap.cluster] || 1.0;

  return Math.round(base * intent * cluster);
}

export async function runOppsFactory(config: {
  gapsPath: string;
  outputPath: string;
  maxOpportunities: number;
  openaiApiKey?: string;
  existingEmbeddings?: Array<{ slug: string; embedding: number[] }>;
}): Promise<Opportunity[]> {
  console.log('🏭 Starting Opps Factory...\n');

  // 1. Load gaps
  const gapsFile = path.join(config.gapsPath, 'gaps.json');
  const gapsData = JSON.parse(await fs.readFile(gapsFile, 'utf-8'));
  const gaps: Gap[] = gapsData.gaps;
  console.log(`📥 Loaded ${gaps.length} gaps`);

  // 2. Convert to opportunities
  let opportunities: Opportunity[] = gaps.map((gap, index) => {
    const pillarConfig = PILLAR_MAP[gap.cluster] || PILLAR_MAP['youth-development'];
    const contentType = determineContentType(gap.keyword, gap.intent);
    const slug = generateSlug(gap.keyword);

    return {
      id: `opp_${String(index).padStart(5, '0')}`,
      keyword: gap.keyword,
      priority_score: calculatePriorityScore(gap),
      content_type: contentType,
      parent_pillar: pillarConfig.path,
      suggested_slug: `${pillarConfig.path}/${slug}`,
      suggested_title: generateTitle(gap.keyword),
      suggested_description: `Comprehensive guide to ${gap.keyword} for youth athletes.`,
      expert: pillarConfig.expert,
      unique_asset_type: pillarConfig.asset,
      sport: gap.sport,
      cluster: gap.cluster,
      age_group: gap.age_group,
    };
  });

  console.log(`🔄 Converted to ${opportunities.length} opportunities`);

  // 3. Sort by priority
  opportunities.sort((a, b) => b.priority_score - a.priority_score);

  // 4. Dedupe with embeddings (if available)
  if (config.openaiApiKey && config.existingEmbeddings) {
    console.log('\n🧹 Running uniqueness check...');
    const deduper = new ContentDeduper(config.openaiApiKey);
    await deduper.loadExistingEmbeddings(config.existingEmbeddings);

    const checkedOpps: Opportunity[] = [];

    for (const opp of opportunities.slice(0, config.maxOpportunities * 2)) {
      const result = await deduper.checkUniqueness(opp.suggested_title, opp.suggested_description);

      if (result.pass) {
        checkedOpps.push({
          ...opp,
          uniqueness_score: result.score,
        });

        if (checkedOpps.length >= config.maxOpportunities) break;
      } else {
        console.log(`   ❌ Rejected "${opp.keyword}" (${result.score}% unique, similar to ${result.mostSimilarPage})`);
      }
    }

    opportunities = checkedOpps;
    console.log(`   ✅ ${opportunities.length} passed uniqueness check`);
  } else {
    // Just take top N
    opportunities = opportunities.slice(0, config.maxOpportunities);
  }

  // 5. Write output
  const outputFile = path.join(config.outputPath, 'opportunities.json');
  await fs.mkdir(path.dirname(outputFile), { recursive: true });

  const output = {
    generated_at: new Date().toISOString(),
    total_opportunities: opportunities.length,
    by_cluster: opportunities.reduce((acc, o) => {
      acc[o.cluster] = (acc[o.cluster] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    by_content_type: opportunities.reduce((acc, o) => {
      acc[o.content_type] = (acc[o.content_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    opportunities,
  };

  await fs.writeFile(outputFile, JSON.stringify(output, null, 2));
  console.log(`\n✅ Wrote ${opportunities.length} opportunities to ${outputFile}`);

  return opportunities;
}

// CLI
if (require.main === module) {
  runOppsFactory({
    gapsPath: './tools/machine-sprint/output/gaps',
    outputPath: './tools/machine-sprint/output/opportunities',
    maxOpportunities: 50,
    openaiApiKey: process.env.OPENAI_API_KEY,
  }).catch(console.error);
}
