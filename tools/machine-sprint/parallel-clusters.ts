#!/usr/bin/env node
/**
 * PARALLEL CLUSTER RUNNER
 * Runs all 3 P0 clusters simultaneously:
 * - Silent Basketball (Adam)
 * - Home Training (Adam)
 * - Girls Basketball (Adam)
 *
 * Usage:
 *   pnpm tsx tools/machine-sprint/parallel-clusters.ts
 *   pnpm tsx tools/machine-sprint/parallel-clusters.ts --count 20
 *   pnpm tsx tools/machine-sprint/parallel-clusters.ts --dry-run
 */

import { spawn } from 'child_process';
import { config } from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

config({ path: '.env.local' });

// ============================================================================
// CLUSTER DEFINITIONS (P0 Priority)
// ============================================================================

interface Cluster {
  name: string;
  slug: string;
  expert: 'adam' | 'james';
  keywords: string[];
  targetPages: number;
}

const P0_CLUSTERS: Cluster[] = [
  {
    name: 'Silent Basketball',
    slug: 'silent-basketball',
    expert: 'adam',
    keywords: [
      'silent basketball training',
      'quiet basketball drills',
      'apartment basketball drills',
      'basketball drills no noise',
      'indoor basketball no hoop',
      'training ball basketball',
      'silent ball handling drills',
      'quiet dribbling exercises',
      'basketball practice apartment',
      'late night basketball training',
    ],
    targetPages: 100,
  },
  {
    name: 'Home Training',
    slug: 'home-training',
    expert: 'adam',
    keywords: [
      'home basketball training',
      'basketball drills without hoop',
      'driveway basketball drills',
      'solo basketball drills',
      'basketball drills by yourself',
      'backyard basketball training',
      'garage basketball drills',
      'no equipment basketball drills',
      'basketball training at home',
      'self training basketball',
    ],
    targetPages: 120,
  },
  {
    name: 'Girls Basketball',
    slug: 'girls-basketball',
    expert: 'adam',
    keywords: [
      'girls basketball drills',
      'basketball drills for girls',
      'girls basketball training',
      'youth girls basketball drills',
      'girls basketball shooting drills',
      'basketball camps for girls',
      'girls basketball tryout preparation',
      'middle school girls basketball drills',
      'girls basketball ball handling',
      'wnba training drills',
    ],
    targetPages: 80,
  },
];

// ============================================================================
// PARALLEL EXECUTION
// ============================================================================

async function runCluster(cluster: Cluster, count: number, dryRun: boolean): Promise<{
  cluster: string;
  success: boolean;
  pagesGenerated: number;
  errors: string[];
  duration: number;
}> {
  const startTime = Date.now();
  const errors: string[] = [];
  let pagesGenerated = 0;

  console.log(`\n🏀 Starting ${cluster.name} (${cluster.slug})...`);
  console.log(`   Target: ${count} pages | Expert: ${cluster.expert}`);

  try {
    // Create cluster-specific SEO tasks file
    const tasksPath = `./tools/machine-sprint/output/clusters/${cluster.slug}/seo-tasks.json`;
    await fs.mkdir(path.dirname(tasksPath), { recursive: true });

    // Generate tasks from keywords in SEOTask format
    const tasks = cluster.keywords.flatMap((keyword, i) => {
      const ageBands = ['U8', 'U10', 'U12', 'U14', 'U16'];
      return ageBands.map((age, j) => ({
        taskId: `${cluster.slug}-${i}-${j}`,
        title: `${keyword} for ${age}`,
        description: `Content about ${keyword} for ${age} athletes`,
        domain: 'basketball',
        priority: i < 3 ? 1 : 2,
        createdBy: 'parallel-clusters',
        payload: {
          keyword: `${keyword} ${age.toLowerCase()}`,
          volume: 500,
          difficulty: 30,
          intent: 'informational',
          type: 'drill' as const,
          slug: `basketball/${cluster.slug}/${keyword.replace(/\s+/g, '-').toLowerCase()}-${age.toLowerCase()}`,
          suggestedTitle: `${keyword} for ${age} Athletes`,
          parentPillar: cluster.slug,
          parentPillarSlug: `basketball/${cluster.slug}`,
          internalLinksRequired: [],
          internalLinksOptional: [],
          consolidates: [],
          totalVolumeWithConsolidated: 500,
          primary: cluster.expert === 'adam' ? 'adam-harrington' as const : 'james-scott' as const,
          expert: cluster.expert === 'adam' ? 'adam-harrington' : 'james-scott',
          cluster: cluster.slug,
          sport: 'basketball',
          ageGroup: age,
          hasNeoBallCTA: cluster.slug === 'silent-basketball',
          priorityScore: i < 3 ? 90 : 70,
          searchIntent: 'informational',
        },
      }));
    });

    await fs.writeFile(tasksPath, JSON.stringify({ tasks, cluster }, null, 2));

    if (dryRun) {
      console.log(`   📋 [DRY RUN] Would generate ${Math.min(count, tasks.length)} pages`);
      return {
        cluster: cluster.name,
        success: true,
        pagesGenerated: 0,
        errors: [],
        duration: Date.now() - startTime,
      };
    }

    // Run the graph generator for this cluster
    const result = await new Promise<number>((resolve, reject) => {
      const proc = spawn('pnpm', [
        'tsx', 'tools/machine-sprint/cli.ts', 'graph',
        '--count', String(count),
        '--cluster', cluster.slug,
        '--tasks-path', tasksPath,
        '--bootstrap', // Relaxed guardrails for initial content generation
      ], {
        cwd: process.cwd(),
        env: { ...process.env },
        stdio: 'pipe',
      });

      let output = '';
      proc.stdout?.on('data', (data) => {
        output += data.toString();
        process.stdout.write(`   [${cluster.slug}] ${data}`);
      });
      proc.stderr?.on('data', (data) => {
        errors.push(data.toString());
      });

      proc.on('close', (code) => {
        // Parse pages generated from output
        const match = output.match(/Pages Generated: (\d+)/);
        resolve(match ? parseInt(match[1]) : 0);
      });

      proc.on('error', reject);
    });

    pagesGenerated = result;

  } catch (error) {
    errors.push(String(error));
  }

  return {
    cluster: cluster.name,
    success: errors.length === 0,
    pagesGenerated,
    errors,
    duration: Date.now() - startTime,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const countArg = args.find(a => a.startsWith('--count='));
  const perClusterCount = countArg ? parseInt(countArg.split('=')[1]) : 30;

  console.log('🐺 PARALLEL CLUSTER RUNNER');
  console.log('='.repeat(60));
  console.log(`Running ${P0_CLUSTERS.length} clusters in parallel`);
  console.log(`Pages per cluster: ${perClusterCount}`);
  console.log(`Total target: ${perClusterCount * P0_CLUSTERS.length} pages`);
  if (dryRun) console.log('🏃 DRY RUN MODE');
  console.log('='.repeat(60));

  const startTime = Date.now();

  // Run all clusters in parallel
  const results = await Promise.all(
    P0_CLUSTERS.map(cluster => runCluster(cluster, perClusterCount, dryRun))
  );

  // Summary
  const totalDuration = Date.now() - startTime;
  const totalPages = results.reduce((sum, r) => sum + r.pagesGenerated, 0);
  const successCount = results.filter(r => r.success).length;

  console.log('\n' + '='.repeat(60));
  console.log('📊 PARALLEL RUN COMPLETE');
  console.log('='.repeat(60));

  for (const result of results) {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.cluster}: ${result.pagesGenerated} pages (${(result.duration / 1000).toFixed(1)}s)`);
    if (result.errors.length > 0) {
      console.log(`   Errors: ${result.errors.join(', ')}`);
    }
  }

  console.log('\n' + '-'.repeat(60));
  console.log(`Total Pages: ${totalPages}`);
  console.log(`Clusters: ${successCount}/${P0_CLUSTERS.length} successful`);
  console.log(`Duration: ${(totalDuration / 1000).toFixed(1)}s`);

  // Write run log
  const logPath = './tools/machine-sprint/output/run-logs';
  await fs.mkdir(logPath, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await fs.writeFile(
    `${logPath}/parallel-run-${timestamp}.json`,
    JSON.stringify({ timestamp: new Date().toISOString(), results, totalPages, totalDuration }, null, 2)
  );

  console.log(`\n📁 Log: ${logPath}/parallel-run-${timestamp}.json`);
}

main().catch(console.error);
