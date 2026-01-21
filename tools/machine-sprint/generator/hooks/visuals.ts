import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================================================
// GEMINI VISUAL GENERATION HOOK
// Generates JSON chart data for each page
// ============================================================================

interface VisualAsset {
  type: 'bar_chart' | 'progress_tracker' | 'comparison_table' | 'drill_flow';
  title: string;
  data: any;
  generated_at: string;
}

const VISUAL_PROMPTS: Record<string, string> = {
  'spoke': `Generate a JSON chart showing progression milestones for this drill/skill.
    Format: { "type": "progress_tracker", "title": "...", "milestones": [...], "timeframe": "..." }`,

  'qa': `Generate a JSON comparison table answering this question with pros/cons or options.
    Format: { "type": "comparison_table", "title": "...", "columns": [...], "rows": [...] }`,

  'drill': `Generate a JSON drill flow diagram showing the steps visually.
    Format: { "type": "drill_flow", "title": "...", "steps": [...], "tips": [...] }`,
};

export class GeminiVisualGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async generateVisual(page: {
    title: string;
    content: string;
    content_type: 'spoke' | 'qa' | 'drill';
    sport: string;
    age_group?: string;
  }): Promise<VisualAsset> {
    const prompt = `You are creating a visual data asset for a youth sports training page.

PAGE TITLE: ${page.title}
CONTENT TYPE: ${page.content_type}
SPORT: ${page.sport}
${page.age_group ? `AGE GROUP: ${page.age_group}` : ''}

CONTENT SUMMARY:
${page.content.substring(0, 1000)}...

TASK: ${VISUAL_PROMPTS[page.content_type]}

Rules:
- Data must be realistic and age-appropriate
- Numbers should be achievable for youth athletes
- Include encouraging progression markers
- Output ONLY valid JSON, no markdown`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse visual JSON from Gemini');
    }

    const visualData = JSON.parse(jsonMatch[0]);

    return {
      type: visualData.type,
      title: visualData.title,
      data: visualData,
      generated_at: new Date().toISOString(),
    };
  }

  async batchGenerate(pages: Array<{
    id: string;
    title: string;
    content: string;
    content_type: 'spoke' | 'qa' | 'drill';
    sport: string;
    age_group?: string;
  }>): Promise<Map<string, VisualAsset>> {
    const results = new Map<string, VisualAsset>();

    for (const page of pages) {
      try {
        console.log(`   🎨 Generating visual for: ${page.title}`);
        const visual = await this.generateVisual(page);
        results.set(page.id, visual);

        // Rate limiting for Gemini
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`   ❌ Visual generation failed for ${page.id}:`, error);
      }
    }

    return results;
  }
}

// Integrate into generator
export async function addVisualsToPages(
  pages: Array<{ id: string; slug: string; title: string; content: string; content_type: string; sport: string; age_group?: string }>,
  geminiApiKey: string
): Promise<void> {
  console.log('\n🎨 HOOK 1: Generating Gemini Visuals...\n');

  const generator = new GeminiVisualGenerator(geminiApiKey);
  const visuals = await generator.batchGenerate(pages as any);

  // Write visuals to each page's JSON
  for (const page of pages) {
    const visual = visuals.get(page.id);
    if (visual) {
      // Add visual to page data
      (page as any).visual_asset = visual;
      console.log(`   ✅ ${page.slug} → ${visual.type}`);
    }
  }

  console.log(`\n✅ Generated ${visuals.size}/${pages.length} visuals`);
}
