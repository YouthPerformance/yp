/**
 * Answer Engine: Analytics Dashboard API
 *
 * GET /api/answer-engine/analytics
 *
 * Returns analytics data for monitoring Answer Engine performance:
 * - AI retrieval stats (sources, response times, result counts)
 * - Content gaps (queries with poor results)
 * - Top queries
 *
 * Query params:
 * - view: "overview" | "gaps" | "queries" (default: "overview")
 * - days: number of days to look back (default: 7)
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { getNoCacheHeaders } from "@/lib/answer-engine-cache";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Answer Engine uses the root Convex deployment (content database)
const ANSWER_ENGINE_CONVEX_URL = "https://impressive-lynx-636.convex.cloud";
const client = new ConvexHttpClient(ANSWER_ENGINE_CONVEX_URL);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const view = searchParams.get("view") || "overview";
  const days = parseInt(searchParams.get("days") || "7");
  const since = Date.now() - days * 24 * 60 * 60 * 1000;

  try {
    switch (view) {
      case "gaps": {
        // Get content gaps - queries with few/no results
        const gaps = await client.query(api.analytics.getContentGaps, {
          since,
          limit: 50,
        });

        return NextResponse.json(
          {
            view: "gaps",
            period: { days, since: new Date(since).toISOString() },
            gaps,
            insights: generateGapInsights(gaps),
          },
          { headers: getNoCacheHeaders() }
        );
      }

      case "queries": {
        // Get recent query logs
        const stats = await client.query(api.analytics.getAiRetrievalStats, {
          since,
          limit: 100,
        });

        return NextResponse.json(
          {
            view: "queries",
            period: { days, since: new Date(since).toISOString() },
            topQueries: stats.topQueries,
            recentQueries: stats.recentQueries,
            bySource: stats.bySource,
          },
          { headers: getNoCacheHeaders() }
        );
      }

      case "overview":
      default: {
        // Get full stats overview
        const [stats, gaps] = await Promise.all([
          client.query(api.analytics.getAiRetrievalStats, { since, limit: 100 }),
          client.query(api.analytics.getContentGaps, { since, limit: 10 }),
        ]);

        return NextResponse.json(
          {
            view: "overview",
            period: { days, since: new Date(since).toISOString() },
            summary: {
              totalQueries: stats.totalQueries,
              avgResultsPerQuery: Math.round(stats.avgResultsPerQuery * 10) / 10,
              avgResponseTime: Math.round(stats.avgResponseTime),
              contentGapsCount: gaps.length,
            },
            bySource: stats.bySource,
            topQueries: stats.topQueries.slice(0, 5),
            topGaps: gaps.slice(0, 5),
            health: calculateHealthScore(stats, gaps),
          },
          { headers: getNoCacheHeaders() }
        );
      }
    }
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Generate actionable insights from content gaps
 */
function generateGapInsights(
  gaps: { query: string; occurrences: number; avgResults: number }[]
): string[] {
  const insights: string[] = [];

  if (gaps.length === 0) {
    insights.push("No significant content gaps detected. Great coverage!");
    return insights;
  }

  // High-frequency gaps
  const highFreq = gaps.filter((g) => g.occurrences >= 5);
  if (highFreq.length > 0) {
    insights.push(
      `${highFreq.length} queries appear 5+ times with poor results. Priority content opportunities.`
    );
  }

  // Zero result queries
  const zeroResults = gaps.filter((g) => g.avgResults === 0);
  if (zeroResults.length > 0) {
    insights.push(
      `${zeroResults.length} queries return zero results. Consider creating content for: "${zeroResults[0].query}"`
    );
  }

  // Category patterns
  const categories = detectCategoryPatterns(gaps);
  if (categories.length > 0) {
    insights.push(`Common themes in gaps: ${categories.join(", ")}`);
  }

  return insights;
}

/**
 * Detect category patterns in gap queries
 */
function detectCategoryPatterns(
  gaps: { query: string; occurrences: number }[]
): string[] {
  const patterns: Record<string, number> = {};

  const keywords = [
    "basketball",
    "soccer",
    "football",
    "volleyball",
    "tennis",
    "lacrosse",
    "shooting",
    "dribbling",
    "passing",
    "defense",
    "footwork",
    "speed",
    "agility",
    "strength",
    "injury",
    "prevention",
    "barefoot",
    "ankle",
    "knee",
    "warmup",
    "cooldown",
  ];

  for (const gap of gaps) {
    const queryLower = gap.query.toLowerCase();
    for (const keyword of keywords) {
      if (queryLower.includes(keyword)) {
        patterns[keyword] = (patterns[keyword] || 0) + gap.occurrences;
      }
    }
  }

  return Object.entries(patterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);
}

/**
 * Calculate overall health score for the Answer Engine
 */
function calculateHealthScore(
  stats: {
    totalQueries: number;
    avgResultsPerQuery: number;
    avgResponseTime: number;
  },
  gaps: { query: string; occurrences: number }[]
): {
  score: number;
  status: "excellent" | "good" | "fair" | "poor";
  factors: { name: string; score: number; weight: number }[];
} {
  const factors = [
    {
      name: "Coverage",
      score: Math.min(100, stats.avgResultsPerQuery * 20), // 5+ results = 100
      weight: 0.4,
    },
    {
      name: "Performance",
      score: Math.max(0, 100 - stats.avgResponseTime / 10), // <1s = 100, >10s = 0
      weight: 0.3,
    },
    {
      name: "Gap Ratio",
      score:
        stats.totalQueries > 0
          ? Math.max(0, 100 - (gaps.length / stats.totalQueries) * 500)
          : 100,
      weight: 0.3,
    },
  ];

  const score = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0)
  );

  let status: "excellent" | "good" | "fair" | "poor";
  if (score >= 85) status = "excellent";
  else if (score >= 70) status = "good";
  else if (score >= 50) status = "fair";
  else status = "poor";

  return { score, status, factors };
}
