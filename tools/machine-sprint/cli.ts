#!/usr/bin/env node
import { program } from 'commander';
import { runGapMiner } from './gap-miner';
import { runOppsFactory } from './opps-factory';
import { runGenerator, runGraphGenerator } from './generator';
import { addVisualsToPages } from './generator/hooks/visuals';
import { updateLlmsTxt, updateSitemap } from './publish/llms-update';
import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';
config({ path: '.env.local' });

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
  .option('--mock', 'Use mock data for testing (no API keys needed)')
  .option('--csv', 'Use CSV files from imports folder (free mode - no API)')
  .option('--csv-path <path>', 'Custom path to CSV file(s)')
  .action(async (options) => {
    // Determine CSV path
    const csvPath = options.csv
      ? (options.csvPath || './tools/ypseo/data/imports')
      : options.csvPath;

    await runGapMiner({
      ahrefsApiKey: (options.mock || csvPath) ? undefined : process.env.AHREFS_API_KEY,
      answerEngineLogsPath: (options.mock || csvPath) ? undefined : process.env.ANSWER_ENGINE_LOGS,
      csvPath,
      ourDomain: 'youthperformance.com',
      outputPath: './tools/machine-sprint/output/gaps',
      useMock: options.mock,
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

// ============================================================================
// GRAPH-AWARE GENERATION (Knowledge Graph Mode)
// ============================================================================

program
  .command('graph')
  .description('🧠 Generate from Knowledge Graph (seo-tasks.json)')
  .option('-n, --count <number>', 'Number of pages to generate', '10')
  .option('-p, --priority <levels>', 'Priority filter (e.g., "1,2" for P1 and P2)', '1,2')
  .option('-c, --cluster <name>', 'Cluster filter (e.g., "silent-basketball")')
  .option('--tasks-path <path>', 'Path to seo-tasks.json', './tools/machine-sprint/output/seo-tasks.json')
  .action(async (options) => {
    console.log('🧠 GRAPH-AWARE GENERATOR - Knowledge Graph Mode\n');
    console.log('='.repeat(60));

    // Check for ANTHROPIC_API_KEY
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('\n❌ ERROR: ANTHROPIC_API_KEY is required for content generation');
      console.log('   Set it in .env.local');
      process.exit(1);
    }

    const priorityFilter = options.priority
      ? options.priority.split(',').map((p: string) => parseInt(p.trim()))
      : undefined;

    await runGraphGenerator({
      tasksPath: options.tasksPath,
      outputPath: './tools/machine-sprint/output',
      anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
      maxPages: parseInt(options.count),
      priorityFilter,
      clusterFilter: options.cluster,
    });

    // Load generated pages for hooks
    const pagesDir = './tools/machine-sprint/output/pages';
    let pages: any[] = [];
    try {
      const pageFiles = await fs.readdir(pagesDir);
      pages = await Promise.all(
        pageFiles.filter(f => f.endsWith('.json')).map(async (file) => {
          const content = await fs.readFile(path.join(pagesDir, file), 'utf-8');
          return { id: file.replace('.json', ''), ...JSON.parse(content) };
        })
      );
    } catch {
      console.log('   ⚠️ No pages found');
    }

    if (pages.length > 0) {
      // Gemini Visuals (if key available)
      if (process.env.GEMINI_API_KEY) {
        console.log('\n📍 Visual Generation (Gemini)\n');
        await addVisualsToPages(pages, process.env.GEMINI_API_KEY);

        // Write back pages with visuals
        for (const page of pages) {
          const pageFile = path.join(pagesDir, `${page.id}.json`);
          await fs.writeFile(pageFile, JSON.stringify(page, null, 2));
        }
      }

      // Update llms.txt + Sitemap
      console.log('\n📍 Publishing Hooks\n');
      await updateLlmsTxt(pages, 'https://youthperformance.com');
      await updateSitemap(pages, 'https://youthperformance.com');
    }

    console.log('\n🐺 GRAPH GENERATION COMPLETE');
  });

program
  .command('run')
  .description('🚀 Run full pipeline with all hooks')
  .option('-n, --count <number>', 'Number of pages to generate', '50')
  .option('--mock', 'Use mock data for gap mining (no Ahrefs API needed)')
  .option('--csv', 'Use CSV files from imports folder (free mode - no API)')
  .option('--filter <cluster>', 'Only process gaps from specific cluster (e.g., "silent-basketball")')
  .option('--dry-run', 'Skip content generation (test gap mining + opps only)')
  .option('--graph', 'Use Knowledge Graph mode (reads from seo-tasks.json instead of running full pipeline)')
  .action(async (options) => {
    // If --graph mode, delegate to graph generator
    if (options.graph) {
      console.log('🧠 GRAPH MODE: Using Knowledge Graph from seo-tasks.json\n');

      if (!process.env.ANTHROPIC_API_KEY) {
        console.error('\n❌ ERROR: ANTHROPIC_API_KEY is required for content generation');
        process.exit(1);
      }

      await runGraphGenerator({
        tasksPath: './tools/machine-sprint/output/seo-tasks.json',
        outputPath: './tools/machine-sprint/output',
        anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
        maxPages: parseInt(options.count),
        priorityFilter: [1, 2], // P1 and P2 by default
        clusterFilter: options.filter,
      });
      return;
    }

    console.log('🐺 MACHINE SPRINT - FULL PIPELINE\n');
    console.log('='.repeat(60));

    if (options.mock) {
      console.log('🧪 MOCK MODE: Using seed data for testing\n');
    }
    if (options.csv) {
      console.log('📂 CSV MODE: Using exported Ahrefs data (free intelligence)\n');
    }
    if (options.filter) {
      console.log(`🎯 FILTER MODE: Only processing "${options.filter}" cluster\n`);
    }
    if (options.dryRun) {
      console.log('🏃 DRY RUN: Skipping content generation\n');
    }

    const count = parseInt(options.count);

    // Step 1: Gap Miner
    console.log('\n📍 STEP 1/5: Gap Mining\n');
    const csvPath = options.csv ? './tools/ypseo/data/imports' : undefined;
    await runGapMiner({
      ahrefsApiKey: (options.mock || options.csv) ? undefined : process.env.AHREFS_API_KEY,
      answerEngineLogsPath: (options.mock || options.csv) ? undefined : process.env.ANSWER_ENGINE_LOGS,
      csvPath,
      ourDomain: 'youthperformance.com',
      outputPath: './tools/machine-sprint/output/gaps',
      useMock: options.mock,
    });

    // Step 2: Opps Factory
    console.log('\n📍 STEP 2/5: Opps Factory\n');
    const opportunities = await runOppsFactory({
      gapsPath: './tools/machine-sprint/output/gaps',
      outputPath: './tools/machine-sprint/output/opportunities',
      maxOpportunities: count,
      openaiApiKey: process.env.OPENAI_API_KEY,
      clusterFilter: options.filter,
    });

    // Dry run stops here
    if (options.dryRun) {
      console.log('\n' + '='.repeat(60));
      console.log('🏃 DRY RUN COMPLETE');
      console.log('='.repeat(60));
      console.log(`\n📊 Gaps Discovered: See ./tools/machine-sprint/output/gaps/gaps.json`);
      console.log(`📊 Opportunities: ${opportunities.length}`);
      console.log('\nTo generate content, run without --dry-run:');
      console.log(`  pnpm machine:run --count=${count}${options.mock ? ' --mock' : ''}`);
      return;
    }

    // Check for ANTHROPIC_API_KEY
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('\n❌ ERROR: ANTHROPIC_API_KEY is required for content generation');
      console.log('   Set it in .env.local or use --dry-run to skip generation');
      process.exit(1);
    }

    // Step 3: Generator
    console.log('\n📍 STEP 3/5: Content Generation\n');
    await runGenerator({
      opportunitiesPath: './tools/machine-sprint/output/opportunities',
      outputPath: './tools/machine-sprint/output',
      anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
      maxPages: count,
    });

    // Load generated pages for hooks
    const pagesDir = './tools/machine-sprint/output/pages';
    let pages: any[] = [];
    try {
      const pageFiles = await fs.readdir(pagesDir);
      pages = await Promise.all(
        pageFiles.filter(f => f.endsWith('.json')).map(async (file) => {
          const content = await fs.readFile(path.join(pagesDir, file), 'utf-8');
          return { id: file.replace('.json', ''), ...JSON.parse(content) };
        })
      );
    } catch {
      console.log('   ⚠️ No pages generated');
    }

    if (pages.length === 0) {
      console.log('\n⚠️ No pages passed guardrails - check ./tools/machine-sprint/output/rejected/');
      return;
    }

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
    console.log('1. Review generated pages');
    console.log('2. Deploy to production');
    console.log('3. Submit sitemap to GSC');
  });

program.parse();
