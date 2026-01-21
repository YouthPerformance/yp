import OpenAI from 'openai';

// ============================================================================
// UNIQUENESS GATE
// Uses embeddings to check similarity against existing content
// ============================================================================

interface UniquenessResult {
  score: number;           // 0-100 (100 = completely unique)
  mostSimilarPage: string;
  mostSimilarScore: number;
  pass: boolean;           // score >= 70
}

export class ContentDeduper {
  private openai: OpenAI;
  private existingEmbeddings: Map<string, number[]> = new Map();

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Load existing page embeddings from your vector store
   */
  async loadExistingEmbeddings(embeddings: Array<{ slug: string; embedding: number[] }>) {
    for (const { slug, embedding } of embeddings) {
      this.existingEmbeddings.set(slug, embedding);
    }
    console.log(`Loaded ${this.existingEmbeddings.size} existing page embeddings`);
  }

  /**
   * Generate embedding for text
   */
  async getEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Check uniqueness of proposed content
   */
  async checkUniqueness(proposedTitle: string, proposedDescription: string): Promise<UniquenessResult> {
    // Generate embedding for proposed content
    const proposedText = `${proposedTitle}\n\n${proposedDescription}`;
    const proposedEmbedding = await this.getEmbedding(proposedText);

    // Find most similar existing page
    let mostSimilarSlug = '';
    let highestSimilarity = 0;

    for (const [slug, embedding] of this.existingEmbeddings) {
      const similarity = this.cosineSimilarity(proposedEmbedding, embedding);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        mostSimilarSlug = slug;
      }
    }

    // Convert similarity to uniqueness score (inverse)
    // similarity 0.85+ = too similar = uniqueness < 70 = FAIL
    const uniquenessScore = Math.round((1 - highestSimilarity) * 100);

    return {
      score: uniquenessScore,
      mostSimilarPage: mostSimilarSlug,
      mostSimilarScore: Math.round(highestSimilarity * 100),
      pass: uniquenessScore >= 70, // Must be at least 70% unique
    };
  }

  /**
   * Batch check multiple opportunities
   */
  async batchCheck(opportunities: Array<{ title: string; description: string }>): Promise<UniquenessResult[]> {
    const results: UniquenessResult[] = [];

    for (const opp of opportunities) {
      const result = await this.checkUniqueness(opp.title, opp.description);
      results.push(result);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }
}

// ============================================================================
// CLOUDFLARE VECTORIZE ALTERNATIVE
// ============================================================================

export class CloudflareDeduper {
  private accountId: string;
  private apiToken: string;
  private indexName: string;

  constructor(accountId: string, apiToken: string, indexName: string = 'yp-content') {
    this.accountId = accountId;
    this.apiToken = apiToken;
    this.indexName = indexName;
  }

  /**
   * Query Vectorize for similar content
   */
  async checkUniqueness(text: string): Promise<UniquenessResult> {
    // Generate embedding using Cloudflare AI
    const embeddingResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/@cf/baai/bge-base-en-v1.5`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: [text] }),
      }
    );

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.result.data[0];

    // Query Vectorize for similar vectors
    const queryResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/vectorize/indexes/${this.indexName}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vector: embedding,
          topK: 1,
          returnMetadata: true,
        }),
      }
    );

    const queryData = await queryResponse.json();
    const topMatch = queryData.result.matches?.[0];

    if (!topMatch) {
      return {
        score: 100,
        mostSimilarPage: '',
        mostSimilarScore: 0,
        pass: true,
      };
    }

    const similarity = topMatch.score;
    const uniquenessScore = Math.round((1 - similarity) * 100);

    return {
      score: uniquenessScore,
      mostSimilarPage: topMatch.metadata?.slug || topMatch.id,
      mostSimilarScore: Math.round(similarity * 100),
      pass: uniquenessScore >= 70,
    };
  }
}
