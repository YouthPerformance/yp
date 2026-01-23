import fs from 'fs/promises';
import path from 'path';
import { AhrefsGapMiner, SEED_KEYWORDS, type Gap } from './sources/ahrefs';
import { AnswerEngineGapMiner } from './sources/answer-engine';
import { CsvGapMiner } from './sources/csv';
import { getMockGaps } from '../seed/mock-gaps';

// ============================================================================
// GAP MINER ORCHESTRATOR
// Combines all gap sources into unified output
// ============================================================================

interface GapMinerConfig {
  ahrefsApiKey?: string;
  answerEngineLogsPath?: string;
  csvPath?: string; // Path to CSV imports folder (the "free" path)
  ourDomain: string;
  outputPath: string;
  useMock?: boolean; // Use mock data for testing
}

interface GapMinerOutput {
  generated_at: string;
  total_gaps: number;
  by_source: Record<string, number>;
  by_cluster: Record<string, number>;
  gaps: Gap[];
}

export async function runGapMiner(config: GapMinerConfig): Promise<GapMinerOutput> {
  console.log('🔍 Starting Gap Miner...\n');

  const allGaps: Gap[] = [];

  // Mock mode for testing
  if (config.useMock) {
    console.log('🧪 Using mock data for testing...');
    const mockGaps = getMockGaps();
    console.log(`   Loaded ${mockGaps.length} mock gaps`);
    allGaps.push(...mockGaps);
  }
  // CSV mode - the "free intelligence" path
  else if (config.csvPath) {
    console.log('📂 CSV Mode: Mining from exported files...');
    const csvMiner = new CsvGapMiner();
    const csvGaps = await csvMiner.getGaps(config.csvPath);
    allGaps.push(...csvGaps);
  }
  // 1. Ahrefs API Content Gaps (paid path)
  else if (config.ahrefsApiKey) {
    console.log('📊 Mining Ahrefs content gaps...');
    const ahrefs = new AhrefsGapMiner(config.ahrefsApiKey);

    // Content gap analysis
    const contentGaps = await ahrefs.getContentGaps(config.ourDomain);
    console.log(`   Found ${contentGaps.length} content gaps`);
    allGaps.push(...contentGaps);

    // Keyword ideas from seeds
    const ideas = await ahrefs.getKeywordIdeas(SEED_KEYWORDS);
    console.log(`   Found ${ideas.length} keyword ideas`);
    allGaps.push(...ideas);

    // Questions
    for (const topic of ['youth basketball', 'barefoot training', 'youth sports injury']) {
      const questions = await ahrefs.getQuestions(topic);
      console.log(`   Found ${questions.length} questions for "${topic}"`);
      allGaps.push(...questions);
    }
  } else {
    console.log('⚠️  No Ahrefs API key - skipping');
  }

  // 2. Answer Engine Internal Gaps
  if (config.answerEngineLogsPath) {
    console.log('\n📝 Mining Answer Engine gaps...');
    const ae = new AnswerEngineGapMiner(config.answerEngineLogsPath);
    const aeGaps = await ae.getGaps();
    console.log(`   Found ${aeGaps.length} internal gaps`);

    // Convert to standard Gap format
    for (const g of aeGaps) {
      allGaps.push({
        keyword: g.keyword,
        source: 'ahrefs', // Treat as ahrefs for typing
        volume: g.query_count * 100, // Estimate
        difficulty: 10, // Low since it's our audience
        intent: 'informational',
        cluster: 'general',
        sport: 'general',
      });
    }
  }

  // 3. Dedupe
  console.log('\n🧹 Deduplicating...');
  const seen = new Set<string>();
  const dedupedGaps = allGaps.filter(g => {
    const key = g.keyword.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`   ${allGaps.length} → ${dedupedGaps.length} unique gaps`);

  // 4. Calculate stats
  const bySource: Record<string, number> = {};
  const byCluster: Record<string, number> = {};

  for (const gap of dedupedGaps) {
    bySource[gap.source] = (bySource[gap.source] || 0) + 1;
    byCluster[gap.cluster] = (byCluster[gap.cluster] || 0) + 1;
  }

  // 5. Build output
  const output: GapMinerOutput = {
    generated_at: new Date().toISOString(),
    total_gaps: dedupedGaps.length,
    by_source: bySource,
    by_cluster: byCluster,
    gaps: dedupedGaps,
  };

  // 6. Write to file
  const outputFile = path.join(config.outputPath, 'gaps.json');
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify(output, null, 2));
  console.log(`\n✅ Wrote ${dedupedGaps.length} gaps to ${outputFile}`);

  return output;
}

// CLI
if (require.main === module) {
  runGapMiner({
    ahrefsApiKey: process.env.AHREFS_API_KEY,
    answerEngineLogsPath: process.env.ANSWER_ENGINE_LOGS,
    ourDomain: 'youthperformance.com',
    outputPath: './tools/machine-sprint/output/gaps',
  }).catch(console.error);
}
