#!/usr/bin/env node
import { program } from 'commander';
import { runGapMiner } from './gap-miner';
import { runOppsFactory } from './opps-factory';
import { runGenerator } from './generator';
import { addVisualsToPages } from './generator/hooks/visuals';
import { updateLlmsTxt, updateSitemap } from './publish/llms-update';
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';

// ============================================================================
// MACHINE SPRINT CLI - WITH COMPLETION HOOKS
// ============================================================================

program
  .name('machine-sprint')
  .description('🐺 YouthPerformance Content Machine')
  .version('1.0.0');

program
  .command('mine')
  .description('Run Gap Miner to discover content opportunities')
  .action(async () => {
    await runGapMiner({
      ahrefsApiKey: process.env.AHREFS_API_KEY,
      answerEngineLogsPath: process.env.ANSWER_ENGINE_LOGS,
      ourDomain: 'youthperformance.com',
      outputPath: './tools/machine-sprint/output/gaps',
    });
  });

program
  .command('opps')
  .description('Run Opps Factory to prioritize opportunities')
  .option('-n, --max <number>', 'Maximum opportunities to generate', '50')
  .action(async (options) => {
    await runOppsFactory({
      gapsPath: './tools/machine-sprint/output/gaps',
      outputPath: './tools/machine-sprint/output/opportunities',
      maxOpportunities: parseInt(options.max),
      openaiApiKey: process.env.OPENAI_API_KEY,
    });
  });

program
  .command('generate')
  .description('Generate spoke pages from opportunities')
  .option('-n, --max <number>', 'Maximum pages to generate', '50')
  .action(async (options) => {
    await runGenerator({
      opportunitiesPath: './tools/machine-sprint/output/opportunities',
      outputPath: './tools/machine-sprint/output',
      anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
      maxPages: parseInt(options.max),
    });
  });

program
  .command('run')
  .description('🚀 Run full pipeline with all hooks')
  .option('-n, --count <number>', 'Number of pages to generate', '50')
  .action(async (options) => {
    console.log('🐺 MACHINE SPRINT - FULL PIPELINE\n');
    console.log('='.repeat(60));

    const count = parseInt(options.count);

    // Step 1: Gap Miner
    console.log('\n📍 STEP 1/5: Gap Mining\n');
    await runGapMiner({
      ahrefsApiKey: process.env.AHREFS_API_KEY,
      answerEngineLogsPath: process.env.ANSWER_ENGINE_LOGS,
      ourDomain: 'youthperformance.com',
      outputPath: './tools/machine-sprint/output/gaps',
    });

    // Step 2: Opps Factory
    console.log('\n📍 STEP 2/5: Opps Factory\n');
    await runOppsFactory({
      gapsPath: './tools/machine-sprint/output/gaps',
      outputPath: './tools/machine-sprint/output/opportunities',
      maxOpportunities: count,
      openaiApiKey: process.env.OPENAI_API_KEY,
    });

    // Step 3: Generator
    console.log('\n📍 STEP 3/5: Content Generation\n');
    const generatedPages = await runGenerator({
      opportunitiesPath: './tools/machine-sprint/output/opportunities',
      outputPath: './tools/machine-sprint/output',
      anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
      maxPages: count,
    });

    // Load generated pages for hooks
    const pagesDir = './tools/machine-sprint/output/pages';
    const pageFiles = await fs.readdir(pagesDir);
    const pages = await Promise.all(
      pageFiles.map(async (file) => {
        const content = await fs.readFile(path.join(pagesDir, file), 'utf-8');
        return { id: file.replace('.json', ''), ...JSON.parse(content) };
      })
    );

    // Step 4: Gemini Visuals
    console.log('\n📍 STEP 4/5: Visual Generation (Gemini)\n');
    if (process.env.GEMINI_API_KEY) {
      await addVisualsToPages(pages, process.env.GEMINI_API_KEY);

      // Write back pages with visuals
      for (const page of pages) {
        const pageFile = path.join(pagesDir, `${page.id}.json`);
        await fs.writeFile(pageFile, JSON.stringify(page, null, 2));
      }
    } else {
      console.log('   ⚠️ GEMINI_API_KEY not set - skipping visuals');
    }

    // Step 5: Update llms.txt + Sitemap
    console.log('\n📍 STEP 5/5: Publishing Hooks\n');
    await updateLlmsTxt(pages, 'https://youthperformance.com');
    await updateSitemap(pages, 'https://youthperformance.com');

    // Final Report
    console.log('\n' + '='.repeat(60));
    console.log('🐺 MACHINE SPRINT COMPLETE - ALL HOOKS FIRED');
    console.log('='.repeat(60));
    console.log(`\n✅ Pages Generated: ${pages.length}`);
    console.log(`✅ Visuals Created: ${pages.filter((p: any) => p.visual_asset).length}`);
    console.log(`✅ llms.txt Updated: YES`);
    console.log(`✅ Sitemap Updated: YES`);
    console.log('\n📁 Output: ./tools/machine-sprint/output/pages/');
    console.log('\nNext steps:');
    console.log('1. Deploy to production');
    console.log('2. Submit sitemap to GSC');
    console.log('3. Verify first page is live');
  });

program.parse();
