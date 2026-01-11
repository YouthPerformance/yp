/**
 * Ahrefs API Client
 *
 * Provides keyword research, gap analysis, and SEO intelligence
 * using the Ahrefs API v3.
 *
 * API Documentation: https://docs.ahrefs.com/docs/api/
 */

const AHREFS_API_BASE = 'https://api.ahrefs.com/v3';

interface AhrefsConfig {
  apiToken: string;
  apiKey: string;
}

interface KeywordResult {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  clicks: number;
  global_volume: number;
}

interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
}

interface OrganicKeyword {
  keyword: string;
  position: number;
  volume: number;
  traffic: number;
  url: string;
}

interface BacklinkData {
  total_backlinks: number;
  referring_domains: number;
  domain_rating: number;
}

/**
 * Ahrefs API Client
 */
export class AhrefsClient {
  private config: AhrefsConfig;

  constructor(config: AhrefsConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${AHREFS_API_BASE}${endpoint}`);

    // Add query params
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ahrefs API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Get keyword metrics (volume, difficulty, CPC)
   */
  async getKeywordMetrics(keyword: string, country: string = 'us'): Promise<KeywordResult> {
    return this.request<KeywordResult>('/keywords-explorer/metrics', {
      keyword,
      country,
    });
  }

  /**
   * Get keyword suggestions/ideas
   */
  async getKeywordSuggestions(
    keyword: string,
    country: string = 'us',
    limit: number = 100
  ): Promise<KeywordSuggestion[]> {
    const result = await this.request<{ keywords: KeywordSuggestion[] }>(
      '/keywords-explorer/phrase-match',
      {
        keyword,
        country,
        limit: limit.toString(),
      }
    );
    return result.keywords || [];
  }

  /**
   * Get organic keywords a domain ranks for
   */
  async getOrganicKeywords(
    domain: string,
    country: string = 'us',
    limit: number = 100
  ): Promise<OrganicKeyword[]> {
    const result = await this.request<{ keywords: OrganicKeyword[] }>(
      '/site-explorer/organic-keywords',
      {
        target: domain,
        country,
        limit: limit.toString(),
        mode: 'domain',
      }
    );
    return result.keywords || [];
  }

  /**
   * Get keyword gap - keywords competitor ranks for that we don't
   */
  async getKeywordGap(
    ourDomain: string,
    competitorDomain: string,
    country: string = 'us'
  ): Promise<OrganicKeyword[]> {
    // Get competitor keywords
    const competitorKeywords = await this.getOrganicKeywords(competitorDomain, country, 500);

    // Get our keywords
    const ourKeywords = await this.getOrganicKeywords(ourDomain, country, 500);
    const ourKeywordSet = new Set(ourKeywords.map(k => k.keyword.toLowerCase()));

    // Find gap - keywords they have that we don't
    const gap = competitorKeywords.filter(
      k => !ourKeywordSet.has(k.keyword.toLowerCase())
    );

    // Sort by volume
    return gap.sort((a, b) => b.volume - a.volume);
  }

  /**
   * Get backlink overview for a domain
   */
  async getBacklinkOverview(domain: string): Promise<BacklinkData> {
    return this.request<BacklinkData>('/site-explorer/backlinks-stats', {
      target: domain,
      mode: 'domain',
    });
  }

  /**
   * Find content opportunities - low difficulty, decent volume
   */
  async findContentOpportunities(
    seedKeyword: string,
    country: string = 'us',
    maxDifficulty: number = 30,
    minVolume: number = 100
  ): Promise<KeywordSuggestion[]> {
    const suggestions = await this.getKeywordSuggestions(seedKeyword, country, 500);

    // Filter for low difficulty, decent volume
    const opportunities = suggestions.filter(
      k => k.difficulty <= maxDifficulty && k.volume >= minVolume
    );

    // Sort by volume (descending)
    return opportunities.sort((a, b) => b.volume - a.volume);
  }
}

/**
 * Quick helper functions for common operations
 */

export async function analyzeKeyword(keyword: string, country: string = 'us') {
  const client = new AhrefsClient({
    apiToken: process.env.AHREFS_API_TOKEN || '',
    apiKey: process.env.AHREFS_API_KEY || '',
  });

  const [metrics, suggestions] = await Promise.all([
    client.getKeywordMetrics(keyword, country),
    client.getKeywordSuggestions(keyword, country, 20),
  ]);

  return {
    primary: metrics,
    related: suggestions,
  };
}

export async function findGaps(ourDomain: string, competitorDomain: string) {
  const client = new AhrefsClient({
    apiToken: process.env.AHREFS_API_TOKEN || '',
    apiKey: process.env.AHREFS_API_KEY || '',
  });

  return client.getKeywordGap(ourDomain, competitorDomain);
}

export async function findOpportunities(topic: string) {
  const client = new AhrefsClient({
    apiToken: process.env.AHREFS_API_TOKEN || '',
    apiKey: process.env.AHREFS_API_KEY || '',
  });

  return client.findContentOpportunities(topic);
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'keyword':
    case 'keywords':
      analyzeKeyword(args[1]).then(console.log).catch(console.error);
      break;
    case 'gap':
      findGaps(args[1], args[2]).then(console.log).catch(console.error);
      break;
    case 'opportunities':
      findOpportunities(args[1]).then(console.log).catch(console.error);
      break;
    default:
      console.log('Usage: ahrefs-api.ts <command> [args]');
      console.log('Commands: keyword, gap, opportunities');
  }
}
