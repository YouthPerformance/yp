import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
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
}

interface GeneratorResult {
  opportunity: Opportunity;
  page: GeneratedPage;
  guardrails: GuardrailResult;
  status: 'published' | 'rejected';
}

// Expert voice profiles
const EXPERT_VOICES = {
  'adam-harrington': {
    name: 'Adam Harrington',
    credentials: 'NBA Skills Development Coach, 20+ years experience',
    tone: 'Direct, confident, uses pro examples',
    phrases: ['In my experience with NBA players...', 'The key is repetition...', 'Quality over quantity...'],
  },
  'james-scott': {
    name: 'James Scott',
    credentials: 'Performance Director, MS Exercise Science, CSCS',
    tone: 'Scientific but accessible, focuses on fundamentals',
    phrases: ['From a biomechanics perspective...', 'The research shows...', 'Start with the basics...'],
  },
};

export class SpokeGenerator {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  async generatePage(opp: Opportunity): Promise<GeneratedPage> {
    const expert = EXPERT_VOICES[opp.expert as keyof typeof EXPERT_VOICES];

    const prompt = `You are ${expert.name}, ${expert.credentials}. Write content for a youth sports training website.

TOPIC: ${opp.keyword}
CONTENT TYPE: ${opp.content_type}
TARGET AUDIENCE: Parents and coaches of youth athletes${opp.age_group ? ` (ages ${opp.age_group})` : ''}
SPORT: ${opp.sport}

YOUR VOICE:
- Tone: ${expert.tone}
- Use phrases like: ${expert.phrases.join(', ')}

REQUIRED STRUCTURE:
1. QUICK ANSWER (2-6 bullet points that could be a featured snippet)
2. INTRODUCTION (2-3 sentences, hook the reader)
3. MAIN CONTENT with sections:
   - The fundamentals
   - Step-by-step guide OR common mistakes to avoid
   - Progressions/regressions by age/skill
4. COACH'S CORNER (your unique insight as ${expert.name})
5. INTERNAL LINKS SECTION (suggest 3 related topics)

RULES:
- Youth-appropriate language only
- Include safety reminders where relevant
- No medical claims or guaranteed results
- Be specific and actionable
- If mentioning injury/pain topics, include disclaimer

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

    return {
      slug: opp.suggested_slug,
      title: generated.title || opp.suggested_title,
      meta_description: generated.meta_description,
      quick_answer: generated.quick_answer,
      content: `${generated.content}\n\n## Coach's Corner\n${generated.coach_corner}`,
      asset_type: opp.unique_asset_type,
      internal_links: internalLinks,
      schema_type: opp.content_type === 'qa' ? 'FAQPage' : 'HowTo',
      expert: opp.expert,
      generated_at: new Date().toISOString(),
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
