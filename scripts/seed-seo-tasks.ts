#!/usr/bin/env npx tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SEED SEO TASKS - Knowledge Graph Architecture
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Transforms 139 keyword gaps into agent-executable tasks with:
 * - Pillar/Spoke hierarchy (Knowledge Graph structure)
 * - Consolidation logic (prevents cannibalization)
 * - Internal link requirements (SEO glue)
 * - Visual asset assignments
 * - Expert voice routing
 *
 * Run: npx tsx scripts/seed-seo-tasks.ts
 */

import { ConvexHttpClient } from 'convex/browser';
// Note: api import requires Convex codegen. Run `npx convex dev` first.
// import { api } from '../packages/yp-alpha/convex/_generated/api';
import fs from 'fs/promises';
import path from 'path';

// ═══════════════════════════════════════════════════════════════════════════
// KNOWLEDGE GRAPH: PILLAR DEFINITIONS (THE ANCHORS)
// ═══════════════════════════════════════════════════════════════════════════

interface PillarDefinition {
  id: string;
  title: string;
  slug: string;
  cluster: string;
  expert: 'adam-harrington' | 'james-scott';
  description: string;
  targetWordCount: number;
  productTieIn?: string;
  visualRequired: string;
}

const PILLARS: PillarDefinition[] = [
  {
    id: 'silent-training-guide',
    title: 'The Complete Guide to Silent Basketball Training',
    slug: '/basketball/silent-training',
    cluster: 'silent-basketball',
    expert: 'adam-harrington',
    description: 'Master guide covering pocket control, apartment drills, and noise-free training methods.',
    targetWordCount: 3500,
    productTieIn: 'neoball',
    visualRequired: 'HeroInfographic',
  },
  {
    id: 'home-training-guide',
    title: 'Basketball Training at Home: No Gym Required',
    slug: '/basketball/home-training',
    cluster: 'home-training',
    expert: 'adam-harrington',
    description: 'Complete home training system for developing basketball skills without a court.',
    targetWordCount: 3000,
    visualRequired: 'SpaceRequirementsChart',
  },
  {
    id: 'ball-handling-guide',
    title: 'Youth Ball Handling Development Guide',
    slug: '/basketball/ball-handling',
    cluster: 'ball-handling',
    expert: 'adam-harrington',
    description: 'Progressive ball handling curriculum from beginner to advanced.',
    targetWordCount: 2800,
    visualRequired: 'ProgressionLadder',
  },
  {
    id: 'shooting-form-guide',
    title: 'Youth Shooting Form: The Complete Blueprint',
    slug: '/basketball/shooting',
    cluster: 'shooting',
    expert: 'adam-harrington',
    description: 'Comprehensive shooting form development for youth athletes.',
    targetWordCount: 3000,
    visualRequired: 'FormBreakdown',
  },
  {
    id: 'barefoot-training-guide',
    title: 'Barefoot Training for Young Athletes',
    slug: '/barefoot-training',
    cluster: 'barefoot',
    expert: 'james-scott',
    description: 'Science-based approach to foot strength and athletic development.',
    targetWordCount: 2500,
    visualRequired: 'FootAnatomyDiagram',
  },
  {
    id: 'footwork-guide',
    title: 'Basketball Footwork Fundamentals',
    slug: '/basketball/footwork',
    cluster: 'footwork',
    expert: 'james-scott',
    description: 'Movement patterns and footwork drills for basketball.',
    targetWordCount: 2500,
    visualRequired: 'FootworkPatterns',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CONSOLIDATION RULES (PREVENTS CANNIBALIZATION)
// ═══════════════════════════════════════════════════════════════════════════

interface ConsolidationRule {
  primaryKeyword: string;
  primarySlug: string;
  absorbs: string[]; // Keywords that get folded into primary
  searchIntent: string;
}

const CONSOLIDATION_RULES: ConsolidationRule[] = [
  // SILENT BASKETBALL CONSOLIDATIONS
  {
    primaryKeyword: 'silent basketball',
    primarySlug: 'silent-basketball',
    absorbs: ['silent practice basketball', 'silent dribbling ball', 'silent basketball exercises', 'basketball training no bounce'],
    searchIntent: 'concept-understanding',
  },
  {
    primaryKeyword: 'quiet basketball',
    primarySlug: 'quiet-basketball',
    absorbs: ['quiet basketball ball', 'quiet practice basketball', 'quiet ball handling', 'basketball training quiet'],
    searchIntent: 'concept-understanding',
  },
  {
    primaryKeyword: 'quiet basketball drills apartment',
    primarySlug: 'quiet-basketball-drills-apartment',
    absorbs: ['apartment basketball drills', 'basketball drills for apartments', 'basketball practice apartment', 'apartment safe basketball drills', 'quiet basketball drills, apartment friendly'],
    searchIntent: 'drill-seeking',
  },
  {
    primaryKeyword: 'silent basketball for apartments',
    primarySlug: 'silent-basketball-apartments',
    absorbs: ['apartment basketball ball', 'basketball for apartment', 'apartment friendly basketball'],
    searchIntent: 'product-seeking',
  },
  {
    primaryKeyword: 'apartment basketball training',
    primarySlug: 'apartment-basketball-training',
    absorbs: ['basketball training apartment living', 'apartment basketball training kids'],
    searchIntent: 'program-seeking',
  },
  {
    primaryKeyword: 'best quiet basketball',
    primarySlug: 'best-quiet-basketball',
    absorbs: ['indoor basketball ball quiet', 'basketball that doesnt bounce loud', 'low bounce basketball'],
    searchIntent: 'commercial-comparison',
  },
  {
    primaryKeyword: 'silent basketball drills',
    primarySlug: 'silent-basketball-drills',
    absorbs: ['silent dribbling drills', 'no bounce basketball drills', 'no noise basketball drills', 'silent ball handling drills'],
    searchIntent: 'drill-seeking',
  },
  {
    primaryKeyword: 'silent basketball training program',
    primarySlug: 'silent-basketball-training-program',
    absorbs: ['silent basketball conditioning'],
    searchIntent: 'program-seeking',
  },
  {
    primaryKeyword: 'hotel room basketball drills',
    primarySlug: 'hotel-room-basketball-drills',
    absorbs: ['basketball drills hotel room'],
    searchIntent: 'situation-specific',
  },
  {
    primaryKeyword: 'basketball drills upstairs',
    primarySlug: 'basketball-drills-upstairs',
    absorbs: ['basketball drills upstairs apartment'],
    searchIntent: 'situation-specific',
  },
  {
    primaryKeyword: 'quiet basketball drills for kids',
    primarySlug: 'quiet-basketball-drills-kids',
    absorbs: ['silent basketball for kids', 'silent basketball drills youth', 'quiet youth basketball drills'],
    searchIntent: 'age-specific',
  },
  // HOME TRAINING CONSOLIDATIONS
  {
    primaryKeyword: 'basketball training at home',
    primarySlug: 'basketball-training-at-home',
    absorbs: ['basketball training alone at home', 'how to get better at basketball at home', 'basketball skills to practice at home'],
    searchIntent: 'program-seeking',
  },
  {
    primaryKeyword: 'indoor basketball drills no hoop',
    primarySlug: 'indoor-basketball-drills-no-hoop',
    absorbs: ['basketball drills without a hoop', 'kids basketball drills without hoop', 'can you improve at basketball without a hoop'],
    searchIntent: 'constraint-based',
  },
  {
    primaryKeyword: 'basketball drills for kids at home',
    primarySlug: 'basketball-drills-kids-at-home',
    absorbs: ['basketball skills for kids at home', 'basketball drills for 7 year olds at home', 'basketball drills for 10 year olds at home'],
    searchIntent: 'age-specific',
  },
  {
    primaryKeyword: 'small space basketball drills',
    primarySlug: 'small-space-basketball-drills',
    absorbs: ['basketball drills small space quiet', 'best basketball drills for small spaces', 'indoor basketball drills small space'],
    searchIntent: 'constraint-based',
  },
  {
    primaryKeyword: 'how to practice basketball alone',
    primarySlug: 'practice-basketball-alone',
    absorbs: ['basketball drills to do by yourself', 'solo basketball workout', 'what basketball drills can i do at home'],
    searchIntent: 'solo-training',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// INTERNAL LINK GRAPH (THE SEO GLUE)
// ═══════════════════════════════════════════════════════════════════════════

interface LinkRequirement {
  slug: string;
  mustLinkTo: string[]; // Required internal links
  canLinkTo: string[]; // Optional related links
}

const LINK_REQUIREMENTS: Record<string, LinkRequirement> = {
  // All silent basketball spokes MUST link to:
  'silent-basketball': {
    slug: 'silent-basketball',
    mustLinkTo: ['silent-training-guide', 'best-quiet-basketball', 'pocket-control-drills'],
    canLinkTo: ['apartment-basketball-training', 'hotel-room-basketball-drills'],
  },
  'quiet-basketball': {
    slug: 'quiet-basketball',
    mustLinkTo: ['silent-training-guide', 'silent-basketball'],
    canLinkTo: ['quiet-basketball-drills-apartment', 'best-quiet-basketball'],
  },
  'quiet-basketball-drills-apartment': {
    slug: 'quiet-basketball-drills-apartment',
    mustLinkTo: ['silent-training-guide', 'apartment-basketball-training', 'best-quiet-basketball'],
    canLinkTo: ['silent-basketball-drills', 'pocket-control-drills'],
  },
  'apartment-basketball-training': {
    slug: 'apartment-basketball-training',
    mustLinkTo: ['silent-training-guide', 'quiet-basketball-drills-apartment'],
    canLinkTo: ['best-quiet-basketball', 'small-space-basketball-drills'],
  },
  'best-quiet-basketball': {
    slug: 'best-quiet-basketball',
    mustLinkTo: ['silent-training-guide', 'neoball-product'], // COMMERCIAL - product link
    canLinkTo: ['silent-basketball', 'apartment-basketball-training'],
  },
  'silent-basketball-drills': {
    slug: 'silent-basketball-drills',
    mustLinkTo: ['silent-training-guide', 'pocket-control-drills'],
    canLinkTo: ['quiet-basketball-drills-apartment', 'silent-basketball-training-program'],
  },
  'hotel-room-basketball-drills': {
    slug: 'hotel-room-basketball-drills',
    mustLinkTo: ['silent-training-guide', 'silent-basketball-drills'],
    canLinkTo: ['best-quiet-basketball', 'pocket-control-drills'],
  },
  'silent-basketball-training-program': {
    slug: 'silent-basketball-training-program',
    mustLinkTo: ['silent-training-guide', 'silent-basketball-drills', 'pocket-control-drills'],
    canLinkTo: ['apartment-basketball-training', 'best-quiet-basketball'],
  },
};

// Default link requirements for unmapped spokes
function getDefaultLinkRequirements(cluster: string, parentPillar: string): string[] {
  const defaults: Record<string, string[]> = {
    'silent-basketball': ['silent-training-guide', 'best-quiet-basketball'],
    'home-training': ['home-training-guide', 'small-space-basketball-drills'],
    'ball-handling': ['ball-handling-guide', 'figure-8-dribbling'],
    'shooting': ['shooting-form-guide'],
    'barefoot': ['barefoot-training-guide'],
    'footwork': ['footwork-guide'],
    'general': ['home-training-guide'],
  };
  return defaults[cluster] || [parentPillar];
}

// ═══════════════════════════════════════════════════════════════════════════
// VISUAL ASSET ASSIGNMENTS
// ═══════════════════════════════════════════════════════════════════════════

function getVisualRequirement(keyword: string, cluster: string, contentType: string): string {
  // Product comparison pages
  if (keyword.includes('best') || keyword.includes('review')) {
    return 'ComparisonChart';
  }

  // Drill pages
  if (keyword.includes('drill') || keyword.includes('exercise')) {
    return 'DrillDiagram';
  }

  // Program pages
  if (keyword.includes('program') || keyword.includes('training')) {
    return 'ProgressionTimeline';
  }

  // Apartment/space-constrained
  if (keyword.includes('apartment') || keyword.includes('small space') || keyword.includes('hotel')) {
    return 'SpaceLayoutDiagram';
  }

  // Age-specific
  if (keyword.includes('year old') || keyword.includes('kids') || keyword.includes('youth')) {
    return 'AgeProgressionChart';
  }

  // Silent/quiet specific
  if (cluster === 'silent-basketball') {
    return 'NoiseComparisonChart';
  }

  // Default by content type
  if (contentType === 'pillar') return 'HeroInfographic';
  return 'CoachingDiagram';
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIORITY SCORING (Same as opps-factory but with graph awareness)
// ═══════════════════════════════════════════════════════════════════════════

interface Gap {
  keyword: string;
  volume: number;
  difficulty: number;
  intent: string;
  cluster: string;
  sport: string;
  age_group?: string;
  source: string;
}

function calculatePriorityScore(gap: Gap, isPrimaryKeyword: boolean): number {
  const intentMultiplier: Record<string, number> = {
    'informational': 1.0,
    'commercial': 1.3, // Higher for revenue keywords
    'transactional': 0.8,
    'navigational': 0.5,
  };

  const clusterMultiplier: Record<string, number> = {
    'silent-basketball': 2.5, // HIGHEST - NeoBall revenue driver
    'home-training': 1.5,
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

  // Primary keywords get boost (they're not absorbed)
  const primaryBoost = isPrimaryKeyword ? 1.2 : 1.0;

  return Math.round(base * intent * cluster * primaryBoost);
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT TYPE DETECTION
// ═══════════════════════════════════════════════════════════════════════════

function determineContentType(keyword: string): 'pillar' | 'spoke' | 'qa' | 'drill' {
  const kw = keyword.toLowerCase();

  // Question formats -> Q&A
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

// ═══════════════════════════════════════════════════════════════════════════
// SLUG GENERATION
// ═══════════════════════════════════════════════════════════════════════════

function generateSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPERT ROUTING
// ═══════════════════════════════════════════════════════════════════════════

interface ExpertAttribution {
  primary: 'adam-harrington' | 'james-scott';
  secondary?: 'adam-harrington' | 'james-scott';
  adamRole?: string;
  jamesRole?: string;
}

function getExpertAttribution(cluster: string, hasNeoBallCTA: boolean): ExpertAttribution {
  const jamesTerritory = ['barefoot', 'injury-prevention', 'footwork', 'speed-agility'];

  // NEOBALL CONTENT: Dual authority
  // James = Co-founder & Inventor of NeoBall
  // Adam = Founder of YP Basketball Foundations curriculum
  if (hasNeoBallCTA || cluster === 'silent-basketball') {
    return {
      primary: 'adam-harrington',
      secondary: 'james-scott',
      adamRole: 'Founder, YP Basketball Foundations',
      jamesRole: 'Co-founder & Inventor, NeoBall',
    };
  }

  // James's solo territory
  if (jamesTerritory.includes(cluster)) {
    return {
      primary: 'james-scott',
      jamesRole: 'Movement Scientist & Barefoot Training Expert',
    };
  }

  // Adam's solo territory (basketball skills)
  return {
    primary: 'adam-harrington',
    adamRole: 'NBA Skills Coach & Founder, YP Basketball Foundations',
  };
}

// Legacy function for backwards compatibility
function getExpert(cluster: string): 'adam-harrington' | 'james-scott' {
  const jamesTerritory = ['barefoot', 'injury-prevention', 'footwork', 'speed-agility'];
  return jamesTerritory.includes(cluster) ? 'james-scott' : 'adam-harrington';
}

// ═══════════════════════════════════════════════════════════════════════════
// PARENT PILLAR ROUTING
// ═══════════════════════════════════════════════════════════════════════════

function getParentPillar(cluster: string): string {
  const pillarMap: Record<string, string> = {
    'silent-basketball': 'silent-training-guide',
    'home-training': 'home-training-guide',
    'ball-handling': 'ball-handling-guide',
    'shooting': 'shooting-form-guide',
    'barefoot': 'barefoot-training-guide',
    'footwork': 'footwork-guide',
    'injury-prevention': 'barefoot-training-guide', // Falls under James
    'speed-agility': 'footwork-guide',
    'youth-development': 'home-training-guide',
    'general': 'home-training-guide',
  };
  return pillarMap[cluster] || 'home-training-guide';
}

function getParentPillarSlug(cluster: string): string {
  const slugMap: Record<string, string> = {
    'silent-basketball': '/basketball/silent-training',
    'home-training': '/basketball/home-training',
    'ball-handling': '/basketball/ball-handling',
    'shooting': '/basketball/shooting',
    'barefoot': '/barefoot-training',
    'footwork': '/basketball/footwork',
    'injury-prevention': '/barefoot-training',
    'speed-agility': '/basketball/footwork',
    'youth-development': '/basketball/home-training',
    'general': '/basketball/home-training',
  };
  return slugMap[cluster] || '/basketball/home-training';
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN: PROCESS GAPS INTO TASKS
// ═══════════════════════════════════════════════════════════════════════════

interface SEOTask {
  taskId: string;
  title: string;
  description: string;
  domain: string;
  project: string;
  status: 'pending';
  priority: number;
  createdBy: string;
  payload: {
    // Core keyword data
    keyword: string;
    volume: number;
    difficulty: number;
    intent: string;

    // Content structure
    type: 'pillar' | 'spoke' | 'qa' | 'drill';
    slug: string;
    suggestedTitle: string;

    // Knowledge Graph links
    parentPillar: string;
    parentPillarSlug: string;
    internalLinksRequired: string[];
    internalLinksOptional: string[];

    // Consolidation
    consolidates: string[];
    totalVolumeWithConsolidated: number;

    // Content requirements
    expert: string;
    cluster: string;
    sport: string;
    ageGroup?: string;
    visualRequired: string;
    hasNeoBallCTA: boolean;

    // SEO metadata
    priorityScore: number;
    searchIntent: string;
  };
  createdAt: number;
  updatedAt: number;
}

async function processGapsIntoTasks(): Promise<SEOTask[]> {
  // Load gaps
  const gapsPath = path.join(process.cwd(), 'tools/machine-sprint/output/gaps/gaps.json');
  const gapsData = JSON.parse(await fs.readFile(gapsPath, 'utf-8'));
  const gaps: Gap[] = gapsData.gaps;

  console.log(`📥 Loaded ${gaps.length} gaps`);

  // Build consolidation lookup
  const absorbedKeywords = new Set<string>();
  const consolidationMap = new Map<string, ConsolidationRule>();

  for (const rule of CONSOLIDATION_RULES) {
    consolidationMap.set(rule.primaryKeyword.toLowerCase(), rule);
    for (const absorbed of rule.absorbs) {
      absorbedKeywords.add(absorbed.toLowerCase());
    }
  }

  const tasks: SEOTask[] = [];
  const now = Date.now();
  let taskIndex = 0;

  // First: Create PILLAR tasks
  console.log('\n📚 Creating Pillar tasks...');
  for (const pillar of PILLARS) {
    const pillarTask: SEOTask = {
      taskId: `pillar_${pillar.id}`,
      title: `[PILLAR] ${pillar.title}`,
      description: pillar.description,
      domain: 'seo',
      project: 'neoball-territory',
      status: 'pending',
      priority: 1, // Pillars are highest priority
      createdBy: 'seed-seo-tasks',
      payload: {
        keyword: pillar.title.toLowerCase(),
        volume: 0, // Pillars aggregate spoke volume
        difficulty: 0,
        intent: 'informational',
        type: 'pillar',
        slug: pillar.slug,
        suggestedTitle: pillar.title,
        parentPillar: pillar.id,
        parentPillarSlug: pillar.slug,
        internalLinksRequired: [], // Pillars link TO spokes
        internalLinksOptional: [],
        consolidates: [],
        totalVolumeWithConsolidated: 0,
        expert: pillar.expert,
        cluster: pillar.cluster,
        sport: 'basketball',
        visualRequired: pillar.visualRequired,
        hasNeoBallCTA: pillar.productTieIn === 'neoball',
        priorityScore: 10000, // Always first
        searchIntent: 'comprehensive-guide',
      },
      createdAt: now,
      updatedAt: now,
    };
    tasks.push(pillarTask);
    console.log(`   ✅ ${pillar.id}`);
  }

  // Second: Create SPOKE tasks (non-absorbed keywords only)
  console.log('\n📄 Creating Spoke tasks...');

  for (const gap of gaps) {
    const kwLower = gap.keyword.toLowerCase();

    // Skip if this keyword is absorbed by another
    if (absorbedKeywords.has(kwLower)) {
      continue;
    }

    // Check if this is a primary keyword with consolidation
    const consolidationRule = consolidationMap.get(kwLower);
    const isPrimary = !!consolidationRule;

    // Find absorbed keywords and their volumes
    const consolidatedKeywords: string[] = [];
    let totalVolume = gap.volume;

    if (consolidationRule) {
      for (const absorbedKw of consolidationRule.absorbs) {
        const absorbedGap = gaps.find(g => g.keyword.toLowerCase() === absorbedKw.toLowerCase());
        if (absorbedGap) {
          consolidatedKeywords.push(absorbedKw);
          totalVolume += absorbedGap.volume;
        }
      }
    }

    // Generate identifiers
    const slug = consolidationRule?.primarySlug || generateSlug(gap.keyword);
    const contentType = determineContentType(gap.keyword);
    const parentPillar = getParentPillar(gap.cluster);
    const parentPillarSlug = getParentPillarSlug(gap.cluster);
    const fullSlug = `${parentPillarSlug}/${slug}`;

    // Get link requirements
    const linkReqs = LINK_REQUIREMENTS[slug];
    const mustLinkTo = linkReqs?.mustLinkTo || getDefaultLinkRequirements(gap.cluster, parentPillar);
    const canLinkTo = linkReqs?.canLinkTo || [];

    // Determine if NeoBall CTA is needed
    const neoBallTriggers = ['silent', 'quiet', 'apartment', 'indoor', 'no bounce', 'hotel', 'upstairs', 'home'];
    const hasNeoBallCTA = neoBallTriggers.some(trigger => kwLower.includes(trigger));

    // Calculate priority
    const priorityScore = calculatePriorityScore(gap, isPrimary);

    // Determine task priority bucket (1-4)
    let taskPriority = 3; // Default normal
    if (gap.cluster === 'silent-basketball' && priorityScore > 3000) taskPriority = 1;
    else if (gap.cluster === 'silent-basketball') taskPriority = 2;
    else if (priorityScore > 2000) taskPriority = 2;
    else if (priorityScore < 1000) taskPriority = 4;

    // Create title
    const titleBase = gap.keyword
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const suggestedTitle = kwLower.includes('apartment') || kwLower.includes('home')
      ? `${titleBase} (No Gym Needed)`
      : titleBase;

    const task: SEOTask = {
      taskId: `opp_${gap.cluster.replace(/-/g, '_')}_${String(taskIndex).padStart(3, '0')}`,
      title: `[${contentType.toUpperCase()}] ${suggestedTitle}`,
      description: `Generate ${contentType} content for "${gap.keyword}" (${gap.volume} vol, ${gap.difficulty} KD)`,
      domain: 'seo',
      project: gap.cluster === 'silent-basketball' ? 'neoball-territory' : 'yp-content',
      status: 'pending',
      priority: taskPriority,
      createdBy: 'seed-seo-tasks',
      payload: {
        keyword: gap.keyword,
        volume: gap.volume,
        difficulty: gap.difficulty,
        intent: gap.intent,
        type: contentType,
        slug: fullSlug,
        suggestedTitle,
        parentPillar,
        parentPillarSlug,
        internalLinksRequired: mustLinkTo,
        internalLinksOptional: canLinkTo,
        consolidates: consolidatedKeywords,
        totalVolumeWithConsolidated: totalVolume,
        // Expert attribution (dual-authority for NeoBall content)
        ...getExpertAttribution(gap.cluster, hasNeoBallCTA),
        expert: getExpert(gap.cluster), // Legacy field
        cluster: gap.cluster,
        sport: gap.sport,
        ageGroup: gap.age_group,
        visualRequired: getVisualRequirement(gap.keyword, gap.cluster, contentType),
        hasNeoBallCTA,
        priorityScore,
        searchIntent: consolidationRule?.searchIntent || 'informational',
      },
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(task);
    taskIndex++;

    if (isPrimary) {
      console.log(`   ✅ ${gap.keyword} (consolidates ${consolidatedKeywords.length} keywords, ${totalVolume} total vol)`);
    }
  }

  // Sort by priority score (highest first)
  tasks.sort((a, b) => {
    // Pillars always first
    if (a.payload.type === 'pillar' && b.payload.type !== 'pillar') return -1;
    if (b.payload.type === 'pillar' && a.payload.type !== 'pillar') return 1;
    // Then by priority bucket
    if (a.priority !== b.priority) return a.priority - b.priority;
    // Then by score
    return b.payload.priorityScore - a.payload.priorityScore;
  });

  return tasks;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVEX UPLOAD
// ═══════════════════════════════════════════════════════════════════════════

async function uploadToConvex(tasks: SEOTask[]): Promise<void> {
  const convexUrl = process.env.CONVEX_URL;
  if (!convexUrl) {
    throw new Error('CONVEX_URL environment variable is required');
  }

  const client = new ConvexHttpClient(convexUrl);

  console.log(`\n📤 Uploading ${tasks.length} tasks to Convex...`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const task of tasks) {
    try {
      // Use the seedSEOTask mutation (upserts)
      // Direct function reference for HTTP client
      const result = await client.mutation('agentFs:seedSEOTask' as any, {
        taskId: task.taskId,
        title: task.title,
        description: task.description,
        domain: task.domain,
        project: task.project,
        priority: task.priority,
        createdBy: task.createdBy,
        payload: task.payload,
      });

      if (result.action === 'created') created++;
      else updated++;

      if ((created + updated) % 10 === 0) {
        console.log(`   📊 Progress: ${created + updated}/${tasks.length}`);
      }
    } catch (error) {
      console.error(`   ❌ Failed to upload ${task.taskId}:`, error);
      errors++;
    }
  }

  console.log(`\n✅ Upload complete: ${created} created, ${updated} updated, ${errors} failed`);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🐺 SEO TASK SEEDER - Knowledge Graph Architecture');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // Step 1: Process gaps into tasks
    const tasks = await processGapsIntoTasks();

    // Stats
    const pillars = tasks.filter(t => t.payload.type === 'pillar');
    const spokes = tasks.filter(t => t.payload.type === 'spoke');
    const qas = tasks.filter(t => t.payload.type === 'qa');
    const drills = tasks.filter(t => t.payload.type === 'drill');

    const silentTasks = tasks.filter(t => t.payload.cluster === 'silent-basketball');
    const neoBallCTAs = tasks.filter(t => t.payload.hasNeoBallCTA);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 TASK SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`   Total Tasks: ${tasks.length}`);
    console.log(`   ├─ Pillars: ${pillars.length}`);
    console.log(`   ├─ Spokes: ${spokes.length}`);
    console.log(`   ├─ Q&As: ${qas.length}`);
    console.log(`   └─ Drills: ${drills.length}`);
    console.log('');
    console.log(`   🏀 Silent Basketball Tasks: ${silentTasks.length}`);
    console.log(`   🛒 NeoBall CTA Pages: ${neoBallCTAs.length}`);
    console.log('');

    // Priority breakdown
    const p1 = tasks.filter(t => t.priority === 1).length;
    const p2 = tasks.filter(t => t.priority === 2).length;
    const p3 = tasks.filter(t => t.priority === 3).length;
    const p4 = tasks.filter(t => t.priority === 4).length;

    console.log('   Priority Distribution:');
    console.log(`   ├─ P1 (Critical): ${p1}`);
    console.log(`   ├─ P2 (High): ${p2}`);
    console.log(`   ├─ P3 (Normal): ${p3}`);
    console.log(`   └─ P4 (Low): ${p4}`);

    // Step 2: Write to local file for review
    const outputPath = path.join(process.cwd(), 'tools/machine-sprint/output/seo-tasks.json');
    await fs.writeFile(outputPath, JSON.stringify(tasks, null, 2));
    console.log(`\n📁 Tasks written to: ${outputPath}`);

    // Step 3: Upload to Convex (if CONVEX_URL is set)
    if (process.env.CONVEX_URL) {
      await uploadToConvex(tasks);
    } else {
      console.log('\n⚠️  CONVEX_URL not set - skipping database upload');
      console.log('   To upload, run: CONVEX_URL=<your-url> npx tsx scripts/seed-seo-tasks.ts');
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🐺 SEEDING COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
