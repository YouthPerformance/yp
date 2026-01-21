import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// ANSWER ENGINE GAP DETECTION
// Find queries that returned 0 or low-relevance results
// ============================================================================

interface AnswerEngineLog {
  query: string;
  timestamp: string;
  results_count: number;
  top_score: number;
  clicked: boolean;
}

interface InternalGap {
  keyword: string;
  source: 'answer-engine';
  query_count: number;
  avg_results: number;
  avg_score: number;
  click_rate: number;
  suggested_type: 'spoke' | 'qa' | 'drill';
}

export class AnswerEngineGapMiner {
  private logsPath: string;

  constructor(logsPath: string) {
    this.logsPath = logsPath;
  }

  async getGaps(minQueries: number = 3): Promise<InternalGap[]> {
    // Read logs from Answer Engine
    const logsFile = path.join(this.logsPath, 'search-logs.json');

    let logs: AnswerEngineLog[] = [];
    try {
      const content = await fs.readFile(logsFile, 'utf-8');
      logs = JSON.parse(content);
    } catch {
      console.warn('No Answer Engine logs found');
      return [];
    }

    // Aggregate by query
    const queryStats = new Map<string, {
      count: number;
      total_results: number;
      total_score: number;
      clicks: number;
    }>();

    for (const log of logs) {
      const normalized = log.query.toLowerCase().trim();
      const existing = queryStats.get(normalized) || {
        count: 0,
        total_results: 0,
        total_score: 0,
        clicks: 0,
      };

      queryStats.set(normalized, {
        count: existing.count + 1,
        total_results: existing.total_results + log.results_count,
        total_score: existing.total_score + log.top_score,
        clicks: existing.clicks + (log.clicked ? 1 : 0),
      });
    }

    // Find gaps (low results, low scores, repeated queries)
    const gaps: InternalGap[] = [];

    for (const [query, stats] of queryStats) {
      if (stats.count < minQueries) continue;

      const avgResults = stats.total_results / stats.count;
      const avgScore = stats.total_score / stats.count;
      const clickRate = stats.clicks / stats.count;

      // Gap criteria: low results OR low score OR low click rate
      if (avgResults < 3 || avgScore < 0.7 || clickRate < 0.1) {
        gaps.push({
          keyword: query,
          source: 'answer-engine',
          query_count: stats.count,
          avg_results: avgResults,
          avg_score: avgScore,
          click_rate: clickRate,
          suggested_type: this.suggestContentType(query),
        });
      }
    }

    // Sort by query count (most requested gaps first)
    return gaps.sort((a, b) => b.query_count - a.query_count);
  }

  private suggestContentType(query: string): 'spoke' | 'qa' | 'drill' {
    const q = query.toLowerCase();

    // Questions -> Q&A page
    if (q.startsWith('how') || q.startsWith('what') || q.startsWith('why') ||
        q.startsWith('can') || q.startsWith('is') || q.includes('?')) {
      return 'qa';
    }

    // Specific drills -> Drill page
    if (q.includes('drill') || q.includes('exercise') || q.includes('workout')) {
      return 'drill';
    }

    // Default -> Spoke page
    return 'spoke';
  }
}
