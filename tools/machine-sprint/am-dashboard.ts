#!/usr/bin/env node
/**
 * AM DASHBOARD - Daily Content Status Report
 *
 * Run this every morning to get:
 * - Total pages generated vs target
 * - Pages by cluster/status
 * - Quality metrics
 * - What's in review queue
 * - Today's priorities
 *
 * Usage:
 *   pnpm tsx tools/machine-sprint/am-dashboard.ts
 *   pnpm am:report  # (add to package.json)
 */

import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';

config({ path: '.env.local' });

// ============================================================================
// TARGETS
// ============================================================================

const TARGETS = {
  total: 1000,
  byCluster: {
    'silent-basketball': { target: 100, priority: 'P0', deadline: '2025-02-15' },
    'home-training': { target: 120, priority: 'P0', deadline: '2025-03-15' },
    'girls-basketball': { target: 80, priority: 'P0', deadline: '2025-04-15' },
    'speed-agility': { target: 200, priority: 'P1', deadline: '2025-05-15' },
    'strength-power': { target: 200, priority: 'P2', deadline: '2025-07-15' },
  },
};

// ============================================================================
// DATA COLLECTION
// ============================================================================

interface PageData {
  id: string;
  cluster: string;
  status: 'generated' | 'reviewed' | 'published' | 'rejected';
  createdAt: string;
  quality?: {
    similarityScore?: number;
    helpfulnessScore?: number;
    passedGuardrails?: boolean;
  };
}

async function collectStats() {
  const stats = {
    totalGenerated: 0,
    totalReviewed: 0,
    totalPublished: 0,
    totalRejected: 0,
    byCluster: {} as Record<string, {
      generated: number;
      reviewed: number;
      published: number;
      target: number;
      percentComplete: number;
    }>,
    recentPages: [] as { id: string; cluster: string; createdAt: string }[],
    pendingReview: 0,
    qualityMetrics: {
      avgSimilarity: 0,
      avgHelpfulness: 0,
      guardrailPassRate: 0,
    },
    todaysGenerated: 0,
    yesterdaysGenerated: 0,
  };

  // Scan output directories
  const outputPath = './tools/machine-sprint/output';

  try {
    // Check pages directory
    const pagesDir = path.join(outputPath, 'pages');
    const pageFiles = await fs.readdir(pagesDir).catch(() => []);

    for (const file of pageFiles) {
      if (!file.endsWith('.json')) continue;

      try {
        const content = await fs.readFile(path.join(pagesDir, file), 'utf-8');
        const page = JSON.parse(content);

        stats.totalGenerated++;

        // Determine cluster from filename or content
        const cluster = page.cluster || extractCluster(file);
        if (cluster) {
          if (!stats.byCluster[cluster]) {
            const target = TARGETS.byCluster[cluster as keyof typeof TARGETS.byCluster];
            stats.byCluster[cluster] = {
              generated: 0,
              reviewed: 0,
              published: 0,
              target: target?.target || 0,
              percentComplete: 0,
            };
          }
          stats.byCluster[cluster].generated++;
        }

        // Track recent pages
        if (page.createdAt) {
          stats.recentPages.push({
            id: file.replace('.json', ''),
            cluster: cluster || 'unknown',
            createdAt: page.createdAt,
          });

          // Count today's vs yesterday's
          const pageDate = new Date(page.createdAt);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          if (pageDate.toDateString() === today.toDateString()) {
            stats.todaysGenerated++;
          } else if (pageDate.toDateString() === yesterday.toDateString()) {
            stats.yesterdaysGenerated++;
          }
        }

        // Quality metrics
        if (page.quality) {
          if (page.quality.similarityScore !== undefined) {
            stats.qualityMetrics.avgSimilarity += page.quality.similarityScore;
          }
          if (page.quality.helpfulnessScore !== undefined) {
            stats.qualityMetrics.avgHelpfulness += page.quality.helpfulnessScore;
          }
        }
      } catch {
        // Skip invalid files
      }
    }

    // Calculate averages
    if (stats.totalGenerated > 0) {
      stats.qualityMetrics.avgSimilarity /= stats.totalGenerated;
      stats.qualityMetrics.avgHelpfulness /= stats.totalGenerated;
    }

    // Calculate completion percentages
    for (const [cluster, data] of Object.entries(stats.byCluster)) {
      if (data.target > 0) {
        data.percentComplete = Math.round((data.generated / data.target) * 100);
      }
    }

    // Check run logs for historical data
    const logsDir = path.join(outputPath, 'run-logs');
    const logFiles = await fs.readdir(logsDir).catch(() => []);

    // Sort recent pages
    stats.recentPages.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    stats.recentPages = stats.recentPages.slice(0, 10);

  } catch (error) {
    console.error('Error collecting stats:', error);
  }

  return stats;
}

function extractCluster(filename: string): string | null {
  const clusters = ['silent-basketball', 'home-training', 'girls-basketball', 'speed-agility', 'strength-power'];
  for (const cluster of clusters) {
    if (filename.includes(cluster)) return cluster;
  }
  return null;
}

// ============================================================================
// RENDER DASHBOARD
// ============================================================================

function renderDashboard(stats: Awaited<ReturnType<typeof collectStats>>) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║            🐺 YP CONTENT MACHINE - AM DASHBOARD                ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║  ${dateStr.padEnd(50)}${timeStr.padStart(10)} ║`);
  console.log('╚════════════════════════════════════════════════════════════════╝');

  // Overall Progress
  const overallPercent = Math.round((stats.totalGenerated / TARGETS.total) * 100);
  const progressBar = createProgressBar(overallPercent, 40);

  console.log('\n📊 OVERALL PROGRESS');
  console.log('─'.repeat(60));
  console.log(`   ${progressBar} ${overallPercent}%`);
  console.log(`   ${stats.totalGenerated} / ${TARGETS.total} pages generated`);
  console.log(`   Today: +${stats.todaysGenerated} | Yesterday: +${stats.yesterdaysGenerated}`);

  // By Cluster
  console.log('\n🏀 BY CLUSTER (P0 Priority)');
  console.log('─'.repeat(60));
  console.log('   Cluster               Generated  Target   Progress');
  console.log('   ' + '─'.repeat(55));

  const clusterOrder = ['silent-basketball', 'home-training', 'girls-basketball', 'speed-agility', 'strength-power'];

  for (const clusterSlug of clusterOrder) {
    const target = TARGETS.byCluster[clusterSlug as keyof typeof TARGETS.byCluster];
    const data = stats.byCluster[clusterSlug] || {
      generated: 0,
      target: target?.target || 0,
      percentComplete: 0,
    };

    const priority = target?.priority || 'P3';
    const priorityIcon = priority === 'P0' ? '🔴' : priority === 'P1' ? '🟡' : '⚪';
    const miniBar = createProgressBar(data.percentComplete, 15);

    const name = clusterSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    console.log(
      `   ${priorityIcon} ${name.padEnd(20)} ${String(data.generated).padStart(4)}/${String(data.target).padEnd(4)}  ${miniBar} ${data.percentComplete}%`
    );
  }

  // Quality Metrics
  console.log('\n✅ QUALITY METRICS');
  console.log('─'.repeat(60));
  console.log(`   Avg Similarity Score:  ${(stats.qualityMetrics.avgSimilarity * 100).toFixed(1)}% (< 85% is good)`);
  console.log(`   Avg Helpfulness:       ${(stats.qualityMetrics.avgHelpfulness * 100).toFixed(1)}%`);
  console.log(`   Pending Review:        ${stats.pendingReview} pages`);

  // Recent Activity
  if (stats.recentPages.length > 0) {
    console.log('\n📝 RECENT PAGES (last 10)');
    console.log('─'.repeat(60));
    for (const page of stats.recentPages.slice(0, 5)) {
      const time = new Date(page.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      console.log(`   ${time}  ${page.cluster.padEnd(20)} ${page.id.slice(0, 30)}`);
    }
  }

  // Today's Priorities
  console.log('\n🎯 TODAY\'S PRIORITIES');
  console.log('─'.repeat(60));

  // Calculate what's behind
  for (const [slug, target] of Object.entries(TARGETS.byCluster)) {
    if (target.priority !== 'P0') continue;
    const data = stats.byCluster[slug];
    const behind = target.target - (data?.generated || 0);
    if (behind > 0) {
      console.log(`   ⚡ ${slug}: Need ${behind} more pages by ${target.deadline}`);
    }
  }

  // Quick Commands
  console.log('\n⚡ QUICK COMMANDS');
  console.log('─'.repeat(60));
  console.log('   pnpm machine:parallel              # Run all clusters');
  console.log('   pnpm machine:parallel --count=50   # 50 pages per cluster');
  console.log('   pnpm machine:run --filter=silent-basketball');
  console.log('   pnpm am:report                     # This report');

  console.log('\n');
}

function createProgressBar(percent: number, width: number): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const stats = await collectStats();
  renderDashboard(stats);
}

main().catch(console.error);
