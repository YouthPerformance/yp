import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { runGuardrails, type GuardrailResult } from './guardrails';

// ============================================================================
// SPOKE PAGE GENERATOR
// Generates content with guardrails
// ============================================================================

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

// ============================================================================
// KNOWLEDGE GRAPH TASK INTERFACE
// From seo-tasks.json - Graph-Aware content generation
// ============================================================================

interface SEOTask {
  taskId: string;
  title: string;
  description?: string;
  domain: string;
  project?: string;
  priority: number;
  createdBy: string;
  payload: {
    keyword: string;
    volume: number;
    difficulty: number;
    intent: string;
    type: 'pillar' | 'spoke' | 'qa' | 'drill';
    slug: string;
    suggestedTitle: string;
    // KNOWLEDGE GRAPH LINKS
    parentPillar?: string;
    parentPillarSlug?: string;
    internalLinksRequired: string[];
    internalLinksOptional: string[];
    // CONSOLIDATION
    consolidates: string[];
    totalVolumeWithConsolidated: number;
    // DUAL AUTHORITY (E-E-A-T)
    primary: 'adam-harrington' | 'james-scott';
    secondary?: 'adam-harrington' | 'james-scott';
    adamRole?: string;
    jamesRole?: string;
    expert: string;
    // METADATA
    cluster: string;
    sport: string;
    ageGroup?: string;
    visualRequired?: string;
    hasNeoBallCTA: boolean;
    priorityScore: number;
    searchIntent: string;
  };
}

interface GeneratedPage {
  slug: string;
  title: string;
  meta_description: string;
  quick_answer: string[];
  content: string;
  asset_type: string;
  internal_links: string[];
  schema_type: 'HowTo' | 'FAQPage' | 'Article';
  expert: string;
  generated_at: string;
  has_neoball_cta?: boolean; // Track product tie-in pages
}

interface GeneratorResult {
  opportunity: Opportunity;
  page: GeneratedPage;
  guardrails: GuardrailResult;
  status: 'published' | 'rejected';
}

// Import voice profiles from @yp/alpha
import { adamHarringtonVoice } from '../../../packages/yp-alpha/src/voices/adam-harrington';
import { jamesScottVoice } from '../../../packages/yp-alpha/src/voices/james-scott';

// ============================================================================
// VOICE GUIDE LOADER
// Load the full voice guides from .claude/derived for deep brand voice
// ============================================================================

function loadVoiceGuide(expertId: string): string {
  const guidePath = path.join(process.cwd(), '.claude/derived', `${expertId}-voice-guide.md`);
  try {
    return fsSync.readFileSync(guidePath, 'utf-8');
  } catch {
    return '';
  }
}

// Pre-load voice guides
const VOICE_GUIDES = {
  'adam-harrington': loadVoiceGuide('adam'),
  'james-scott': loadVoiceGuide('james'),
};

// ============================================================================
// NEOBALL CTA CONFIGURATION
// For silent/quiet basketball content - the product tie-in
// ============================================================================

const NEOBALL_CTA = {
  headline: "Train Silent. Train Anywhere.",
  subhead: "The world's best silent basketball—according to the kids.",
  cta_text: "Enter the Draft",
  cta_url: "https://neoball.co",
  price: "$168",
  // Keywords that trigger NeoBall CTA injection
  triggers: [
    'silent', 'quiet', 'apartment', 'indoor', 'no bounce', 'without bouncing',
    'noise', 'home training', 'small space', 'hotel', 'upstairs'
  ],
};

/**
 * Determines if content should include NeoBall CTA
 */
function shouldIncludeNeoBallCTA(keyword: string, cluster: string): boolean {
  const kw = keyword.toLowerCase();
  // Check if keyword contains any trigger words
  const hasTrigger = NEOBALL_CTA.triggers.some(trigger => kw.includes(trigger));
  // Also include for home-training cluster
  const isHomeTraining = cluster === 'home-training';
  return hasTrigger || isHomeTraining;
}

/**
 * Generates the NeoBall CTA block for content injection
 */
function getNeoBallCTABlock(): string {
  return `
## Level Up Your Silent Training

**${NEOBALL_CTA.headline}**

${NEOBALL_CTA.subhead}

These drills work with any ball—but if you're training in an apartment, hotel room, or anywhere noise is an issue, NeoBall was built exactly for this.

[${NEOBALL_CTA.cta_text} →](${NEOBALL_CTA.cta_url})
`;
}

// Expert voice profiles - using FULL voice definitions for authentic brand voice
const EXPERT_VOICES = {
  'adam-harrington': {
    name: adamHarringtonVoice.name,
    title: adamHarringtonVoice.title,
    credentials: adamHarringtonVoice.credentials.join(', '),
    tone: adamHarringtonVoice.toneDescriptor,
    phrases: adamHarringtonVoice.signatureHooks,
    systemPrompt: adamHarringtonVoice.systemPromptPrefix,
    speechPatterns: adamHarringtonVoice.speechPatterns,
    exampleQuotes: adamHarringtonVoice.exampleQuotes,
    mustInclude: adamHarringtonVoice.mustInclude,
    mustAvoid: adamHarringtonVoice.mustAvoid,
    bannedWords: adamHarringtonVoice.bannedWords,
    preferredTerms: adamHarringtonVoice.preferredTerms,
    signatureBlock: adamHarringtonVoice.signatureBlock,
    coachVoicePrefix: adamHarringtonVoice.coachVoicePrefix,
  },
  'james-scott': {
    name: jamesScottVoice.name,
    title: jamesScottVoice.title,
    credentials: jamesScottVoice.credentials.join(', '),
    tone: jamesScottVoice.toneDescriptor,
    phrases: jamesScottVoice.signatureHooks,
    systemPrompt: jamesScottVoice.systemPromptPrefix,
    speechPatterns: jamesScottVoice.speechPatterns,
    exampleQuotes: jamesScottVoice.exampleQuotes,
    mustInclude: jamesScottVoice.mustInclude,
    mustAvoid: jamesScottVoice.mustAvoid,
    bannedWords: jamesScottVoice.bannedWords,
    preferredTerms: jamesScottVoice.preferredTerms,
    signatureBlock: jamesScottVoice.signatureBlock,
    coachVoicePrefix: jamesScottVoice.coachVoicePrefix,
  },
};

export class SpokeGenerator {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  async generatePage(opp: Opportunity): Promise<GeneratedPage> {
    const expert = EXPERT_VOICES[opp.expert as keyof typeof EXPERT_VOICES];

    // Get the full voice guide for this expert (the deep brand voice)
    const voiceGuide = VOICE_GUIDES[opp.expert as keyof typeof VOICE_GUIDES] || '';

    // Build terminology replacement rules
    const termRules = expert.preferredTerms
      ? Object.entries(expert.preferredTerms).map(([wrong, right]) => `"${wrong}" → "${right}"`).join(', ')
      : '';

    const prompt = `# VOICE IDENTITY - YOU ARE ${expert.name.toUpperCase()}

READ AND INTERNALIZE THIS COMPLETE VOICE GUIDE:

${voiceGuide}

---

# CONTENT GENERATION TASK

TOPIC: ${opp.keyword}
CONTENT TYPE: ${opp.content_type}
TARGET AUDIENCE: Parents and coaches of youth athletes${opp.age_group ? ` (ages ${opp.age_group})` : ''}
SPORT: ${opp.sport}

## VOICE ENFORCEMENT (CRITICAL):
You MUST write as ${expert.name}. Study the voice guide above carefully.
- Use the EXACT tone profile described
- Use signature hooks and speech patterns
- Follow vocabulary replacements precisely
- Embody the archetype (${opp.expert === 'adam-harrington' ? 'The Cerebral Architect - calm, intellectual, chess-player energy' : 'The Movement Scientist - direct, evidence-based, biomechanics-focused'})

## TERMINOLOGY RULES (USE THESE EXACT TERMS):
${termRules}

## BANNED WORDS (INSTANT REJECTION):
${expert.bannedWords ? expert.bannedWords.join(', ') : 'None'}

## MUST INCLUDE:
${expert.mustInclude.map(item => `- ${item}`).join('\n')}

## MUST AVOID:
${expert.mustAvoid.map(item => `- ${item}`).join('\n')}

## REQUIRED STRUCTURE:
1. QUICK ANSWER (2-6 bullet points for featured snippet)
2. INTRODUCTION (hook with a signature phrase from the voice guide)
3. MAIN CONTENT:
   - WHY this matters (philosophy/context)
   - WHAT to do (the drill/protocol)
   - HOW to execute (precision details)
   - Age/skill progressions
4. ${expert.coachVoicePrefix || "COACH'S CORNER"} (first-person, sign with "${expert.signatureBlock || `— ${expert.name}`}")
5. RELATED TOPICS (suggest 3)

## RULES:
- Youth-appropriate language only
- Safety reminders where relevant
- No medical claims or guaranteed results
- Be specific and actionable
- If injury/pain topics, include disclaimer
- Connect to real athletic performance
- For SILENT/QUIET basketball: emphasize "Pocket Control" - manipulating ball in the air without pounding

Output as JSON:
{
  "title": "...",
  "meta_description": "...",
  "quick_answer": ["bullet 1", "bullet 2", ...],
  "content": "...",
  "coach_corner": "...",
  "related_topics": ["topic 1", "topic 2", "topic 3"]
}`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    // Parse response
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Failed to parse generated content');
    }

    const generated = JSON.parse(jsonMatch[0]);

    // Map related topics to internal links
    const internalLinks = [
      opp.parent_pillar, // Always link to parent pillar
      ...generated.related_topics.slice(0, 2).map((t: string) =>
        `${opp.parent_pillar}/${t.toLowerCase().replace(/\s+/g, '-')}`
      ),
    ];

    // Build content with optional NeoBall CTA
    let fullContent = `${generated.content}\n\n## Coach's Corner\n${generated.coach_corner}`;

    // Inject NeoBall CTA for silent/quiet basketball content
    if (shouldIncludeNeoBallCTA(opp.keyword, opp.cluster)) {
      fullContent += '\n' + getNeoBallCTABlock();
    }

    return {
      slug: opp.suggested_slug,
      title: generated.title || opp.suggested_title,
      meta_description: generated.meta_description,
      quick_answer: generated.quick_answer,
      content: fullContent,
      asset_type: opp.unique_asset_type,
      internal_links: internalLinks,
      schema_type: opp.content_type === 'qa' ? 'FAQPage' : 'HowTo',
      expert: opp.expert,
      generated_at: new Date().toISOString(),
      // Track if this page has product tie-in
      has_neoball_cta: shouldIncludeNeoBallCTA(opp.keyword, opp.cluster),
    };
  }

  async processOpportunity(opp: Opportunity): Promise<GeneratorResult> {
    console.log(`\n📝 Generating: ${opp.keyword}`);

    // Generate page
    const page = await this.generatePage(opp);

    // Run guardrails
    const guardrails = runGuardrails({
      title: page.title,
      content: page.content,
      quick_answer: page.quick_answer,
      asset_type: page.asset_type,
      internal_links: page.internal_links,
      uniqueness_score: opp.uniqueness_score,
    });

    const status = guardrails.pass ? 'published' : 'rejected';

    if (guardrails.pass) {
      console.log(`   ✅ PASSED (score: ${guardrails.overall_score}%)`);
    } else {
      console.log(`   ❌ REJECTED (score: ${guardrails.overall_score}%)`);
      for (const [check, result] of Object.entries(guardrails.checks)) {
        if (!result.pass) {
          console.log(`      - ${check}: ${result.reason}`);
        }
      }
    }

    return { opportunity: opp, page, guardrails, status };
  }

  // ============================================================================
  // GRAPH-AWARE GENERATION (Knowledge Graph Mode)
  // ============================================================================

  /**
   * Generate page from SEO Task with full Knowledge Graph context
   * Injects internal link requirements directly into Claude's prompt
   */
  async generateFromTask(task: SEOTask): Promise<GeneratedPage> {
    const p = task.payload;
    const expert = EXPERT_VOICES[p.primary as keyof typeof EXPERT_VOICES];
    const voiceGuide = VOICE_GUIDES[p.primary as keyof typeof VOICE_GUIDES] || '';

    // Build terminology replacement rules
    const termRules = expert.preferredTerms
      ? Object.entries(expert.preferredTerms).map(([wrong, right]) => `"${wrong}" → "${right}"`).join(', ')
      : '';

    // Build dual-authority byline for NeoBall content
    const authorityByline = p.secondary
      ? `Written by ${expert.name} (${p.adamRole || expert.title}) with ${p.secondary === 'james-scott' ? 'James Scott' : 'Adam Harrington'} (${p.jamesRole || 'Co-founder'})`
      : `Written by ${expert.name}, ${p.adamRole || expert.title}`;

    // Build internal link injection
    const linkInstructions = p.internalLinksRequired.length > 0
      ? `## REQUIRED INTERNAL LINKS (SEO CRITICAL)
You MUST naturally weave markdown links to these specific pages within your content:
${p.internalLinksRequired.map(slug => `- [relevant anchor text](/basketball/${slug})`).join('\n')}

Additionally, you MAY link to these optional related pages if contextually appropriate:
${p.internalLinksOptional.map(slug => `- /basketball/${slug}`).join('\n')}

IMPORTANT: Links must feel natural. Don't force them. But the REQUIRED links must appear somewhere in the content.`
      : '';

    // Build consolidated keywords for LSI
    const consolidatedContext = p.consolidates.length > 0
      ? `## SEMANTIC COVERAGE (LSI Keywords)
This page consolidates these related searches (total volume: ${p.totalVolumeWithConsolidated}):
${p.consolidates.map(kw => `- "${kw}"`).join('\n')}
Naturally incorporate these variants throughout the content for comprehensive coverage.`
      : '';

    const prompt = `# VOICE IDENTITY - YOU ARE ${expert.name.toUpperCase()}

READ AND INTERNALIZE THIS COMPLETE VOICE GUIDE:

${voiceGuide}

---

# CONTENT GENERATION TASK

PRIMARY KEYWORD: ${p.keyword}
CONTENT TYPE: ${p.type}
SEARCH INTENT: ${p.searchIntent}
TARGET AUDIENCE: Parents and coaches of youth athletes${p.ageGroup ? ` (ages ${p.ageGroup})` : ''}
SPORT: ${p.sport}

${consolidatedContext}

${linkInstructions}

## VOICE ENFORCEMENT (CRITICAL):
You MUST write as ${expert.name}. Study the voice guide above carefully.
- Use the EXACT tone profile described
- Use signature hooks and speech patterns
- Follow vocabulary replacements precisely
- Embody the archetype (${p.primary === 'adam-harrington' ? 'The Cerebral Architect - calm, intellectual, chess-player energy' : 'The Movement Scientist - direct, evidence-based, biomechanics-focused'})

## AUTHORITY BYLINE:
${authorityByline}

## TERMINOLOGY RULES (USE THESE EXACT TERMS):
${termRules}

## BANNED WORDS (INSTANT REJECTION):
${expert.bannedWords ? expert.bannedWords.join(', ') : 'None'}

## MUST INCLUDE:
${expert.mustInclude.map(item => `- ${item}`).join('\n')}

## MUST AVOID:
${expert.mustAvoid.map(item => `- ${item}`).join('\n')}

## REQUIRED STRUCTURE:
1. QUICK ANSWER (2-6 bullet points for featured snippet)
2. INTRODUCTION (hook with a signature phrase from the voice guide)
3. MAIN CONTENT:
   - WHY this matters (philosophy/context)
   - WHAT to do (the drill/protocol)
   - HOW to execute (precision details)
   - Age/skill progressions
4. ${expert.coachVoicePrefix || "COACH'S CORNER"} (first-person, sign with "${expert.signatureBlock || `— ${expert.name}`}")
5. RELATED TOPICS (suggest 3)

## RULES:
- Youth-appropriate language only
- Safety reminders where relevant
- No medical claims or guaranteed results
- Be specific and actionable
- If injury/pain topics, include disclaimer
- Connect to real athletic performance
- For SILENT/QUIET basketball: emphasize "Pocket Control" - manipulating ball in the air without pounding

Output as JSON:
{
  "title": "...",
  "meta_description": "...",
  "quick_answer": ["bullet 1", "bullet 2", ...],
  "content": "...",
  "coach_corner": "...",
  "related_topics": ["topic 1", "topic 2", "topic 3"]
}`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    // Parse response
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Failed to parse generated content');
    }

    const generated = JSON.parse(jsonMatch[0]);

    // Use Knowledge Graph links (already resolved)
    const internalLinks = [
      ...(p.parentPillarSlug ? [p.parentPillarSlug] : []),
      ...p.internalLinksRequired,
      ...p.internalLinksOptional.slice(0, 2),
    ];

    // Build content with optional NeoBall CTA
    let fullContent = `${generated.content}\n\n## Coach's Corner\n${generated.coach_corner}`;

    // Inject NeoBall CTA if flagged in task
    if (p.hasNeoBallCTA) {
      fullContent += '\n' + getNeoBallCTABlock();
    }

    return {
      slug: p.slug,
      title: generated.title || p.suggestedTitle,
      meta_description: generated.meta_description,
      quick_answer: generated.quick_answer,
      content: fullContent,
      asset_type: p.visualRequired || 'none',
      internal_links: internalLinks,
      schema_type: p.type === 'qa' ? 'FAQPage' : 'HowTo',
      expert: p.primary,
      generated_at: new Date().toISOString(),
      has_neoball_cta: p.hasNeoBallCTA,
    };
  }

  /**
   * Process a Knowledge Graph SEO Task
   */
  async processTask(task: SEOTask): Promise<GeneratorResult> {
    console.log(`\n📝 Generating: ${task.payload.keyword}`);
    console.log(`   📊 Volume: ${task.payload.totalVolumeWithConsolidated} | Priority: P${task.priority}`);
    console.log(`   🔗 Required Links: ${task.payload.internalLinksRequired.join(', ') || 'none'}`);

    // Generate page from task
    const page = await this.generateFromTask(task);

    // Run guardrails
    const guardrails = runGuardrails({
      title: page.title,
      content: page.content,
      quick_answer: page.quick_answer,
      asset_type: page.asset_type,
      internal_links: page.internal_links,
    });

    const status = guardrails.pass ? 'published' : 'rejected';

    if (guardrails.pass) {
      console.log(`   ✅ PASSED (score: ${guardrails.overall_score}%)`);
    } else {
      console.log(`   ❌ REJECTED (score: ${guardrails.overall_score}%)`);
      for (const [check, result] of Object.entries(guardrails.checks)) {
        if (!result.pass) {
          console.log(`      - ${check}: ${result.reason}`);
        }
      }
    }

    // Convert task to opportunity format for result
    const opp: Opportunity = {
      id: task.taskId,
      keyword: task.payload.keyword,
      priority_score: task.payload.priorityScore,
      content_type: task.payload.type,
      parent_pillar: task.payload.parentPillar || '',
      suggested_slug: task.payload.slug,
      suggested_title: task.payload.suggestedTitle,
      suggested_description: task.description || '',
      expert: task.payload.primary,
      unique_asset_type: task.payload.visualRequired || 'none',
      sport: task.payload.sport,
      cluster: task.payload.cluster,
      age_group: task.payload.ageGroup,
    };

    return { opportunity: opp, page, guardrails, status };
  }
}

// ============================================================================
// GRAPH-AWARE GENERATOR (Reads from seo-tasks.json)
// ============================================================================

export async function runGraphGenerator(config: {
  tasksPath: string;
  outputPath: string;
  anthropicApiKey: string;
  maxPages?: number;
  priorityFilter?: number[]; // e.g., [1, 2] for P1 and P2 only
  clusterFilter?: string; // e.g., 'silent-basketball'
}): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🐺 GRAPH-AWARE GENERATOR - Knowledge Graph Mode');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Load SEO tasks from seo-tasks.json
  const tasksData: SEOTask[] = JSON.parse(await fs.readFile(config.tasksPath, 'utf-8'));

  // Filter tasks
  let tasks = tasksData.filter(t => {
    // Only pending tasks (skip if already generated)
    // Note: For now we process all since we're reading from JSON not Convex
    const priorityMatch = !config.priorityFilter || config.priorityFilter.includes(t.priority);
    const clusterMatch = !config.clusterFilter || t.payload.cluster === config.clusterFilter;
    return priorityMatch && clusterMatch;
  });

  // Sort by priority (lower = higher priority), then by volume
  tasks = tasks.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.payload.totalVolumeWithConsolidated - a.payload.totalVolumeWithConsolidated;
  });

  const maxPages = config.maxPages ?? tasks.length;
  tasks = tasks.slice(0, maxPages);

  console.log(`📥 Loaded ${tasksData.length} total tasks`);
  console.log(`📊 Filtered to ${tasks.length} tasks (max: ${maxPages})`);
  if (config.priorityFilter) console.log(`   Priority filter: P${config.priorityFilter.join(', P')}`);
  if (config.clusterFilter) console.log(`   Cluster filter: ${config.clusterFilter}`);

  const generator = new SpokeGenerator(config.anthropicApiKey);

  const results: GeneratorResult[] = [];
  const published: GeneratedPage[] = [];
  const rejected: Array<{ task: SEOTask; reason: string }> = [];

  for (const task of tasks) {
    try {
      const result = await generator.processTask(task);
      results.push(result);

      if (result.status === 'published') {
        published.push(result.page);

        // Write individual page file
        const pageFile = path.join(config.outputPath, 'pages', `${task.taskId}.json`);
        await fs.mkdir(path.dirname(pageFile), { recursive: true });
        await fs.writeFile(pageFile, JSON.stringify(result.page, null, 2));
      } else {
        rejected.push({
          task,
          reason: Object.entries(result.guardrails.checks)
            .filter(([, r]) => !r.pass)
            .map(([k, r]) => `${k}: ${r.reason}`)
            .join('; '),
        });

        // Write to rejected folder
        const rejectedFile = path.join(config.outputPath, 'rejected', `${task.taskId}.json`);
        await fs.mkdir(path.dirname(rejectedFile), { recursive: true });
        await fs.writeFile(rejectedFile, JSON.stringify(result, null, 2));
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`   ❌ Error: ${error}`);
      rejected.push({ task, reason: String(error) });
    }
  }

  // Write summary
  const summary = {
    generated_at: new Date().toISOString(),
    mode: 'graph-aware',
    total_processed: results.length,
    published: published.length,
    rejected: rejected.length,
    pass_rate: results.length > 0 ? Math.round((published.length / results.length) * 100) : 0,
    by_expert: published.reduce((acc, p) => {
      acc[p.expert] = (acc[p.expert] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    pages: published.map(p => ({
      id: p.slug.split('/').pop(),
      keyword: p.title,
      title: p.title,
      slug: p.slug,
      has_neoball_cta: p.has_neoball_cta,
    })),
    rejected_reasons: rejected.map(r => ({
      id: r.task.taskId,
      keyword: r.task.payload.keyword,
      reason: r.reason,
    })),
    notes: 'Generated via Graph-Aware mode from seo-tasks.json Knowledge Graph.',
  };

  await fs.writeFile(
    path.join(config.outputPath, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\n' + '═'.repeat(60));
  console.log('🐺 GRAPH-AWARE GENERATION COMPLETE');
  console.log('═'.repeat(60));
  console.log(`✅ Published: ${published.length}`);
  console.log(`❌ Rejected:  ${rejected.length}`);
  console.log(`📊 Pass Rate: ${summary.pass_rate}%`);
  console.log(`\n📁 Output: ${config.outputPath}`);
}

export async function runGenerator(config: {
  opportunitiesPath: string;
  outputPath: string;
  anthropicApiKey: string;
  maxPages?: number;
}): Promise<void> {
  console.log('🚀 Starting Spoke Generator...\n');

  // Load opportunities
  const oppsFile = path.join(config.opportunitiesPath, 'opportunities.json');
  const oppsData = JSON.parse(await fs.readFile(oppsFile, 'utf-8'));
  const opportunities: Opportunity[] = oppsData.opportunities;

  const maxPages = config.maxPages ?? opportunities.length;
  console.log(`📥 Loaded ${opportunities.length} opportunities (processing ${maxPages})`);

  const generator = new SpokeGenerator(config.anthropicApiKey);

  const results: GeneratorResult[] = [];
  const published: GeneratedPage[] = [];
  const rejected: Array<{ opp: Opportunity; reason: string }> = [];

  for (const opp of opportunities.slice(0, maxPages)) {
    try {
      const result = await generator.processOpportunity(opp);
      results.push(result);

      if (result.status === 'published') {
        published.push(result.page);

        // Write individual page file
        const pageFile = path.join(config.outputPath, 'pages', `${opp.id}.json`);
        await fs.mkdir(path.dirname(pageFile), { recursive: true });
        await fs.writeFile(pageFile, JSON.stringify(result.page, null, 2));
      } else {
        rejected.push({
          opp,
          reason: Object.entries(result.guardrails.checks)
            .filter(([, r]) => !r.pass)
            .map(([k, r]) => `${k}: ${r.reason}`)
            .join('; '),
        });

        // Write to rejected folder
        const rejectedFile = path.join(config.outputPath, 'rejected', `${opp.id}.json`);
        await fs.mkdir(path.dirname(rejectedFile), { recursive: true });
        await fs.writeFile(rejectedFile, JSON.stringify(result, null, 2));
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`   ❌ Error: ${error}`);
      rejected.push({ opp, reason: String(error) });
    }
  }

  // Write summary
  const summary = {
    generated_at: new Date().toISOString(),
    total_processed: results.length,
    published: published.length,
    rejected: rejected.length,
    pass_rate: Math.round((published.length / results.length) * 100),
    by_expert: published.reduce((acc, p) => {
      acc[p.expert] = (acc[p.expert] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    rejected_reasons: rejected.map(r => ({ id: r.opp.id, keyword: r.opp.keyword, reason: r.reason })),
  };

  await fs.writeFile(
    path.join(config.outputPath, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log('🐺 GENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Published: ${published.length}`);
  console.log(`❌ Rejected:  ${rejected.length}`);
  console.log(`📊 Pass Rate: ${summary.pass_rate}%`);
  console.log(`\n📁 Output: ${config.outputPath}`);
}

// CLI
if (require.main === module) {
  runGenerator({
    opportunitiesPath: './tools/machine-sprint/output/opportunities',
    outputPath: './tools/machine-sprint/output',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
    maxPages: 50,
  }).catch(console.error);
}
