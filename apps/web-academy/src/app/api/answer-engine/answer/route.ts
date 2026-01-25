/**
 * Answer Engine: Primary Search API (Vector Search)
 *
 * GET /api/answer-engine/answer?q=basketball+drills&limit=5&type=drill
 *
 * Primary semantic search endpoint for AI retrieval systems (Perplexity, ChatGPT, etc.)
 * Uses OpenAI embeddings + Convex vector search for semantic matching.
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import OpenAI from "openai";
import {
  getCachedEmbedding,
  setCachedEmbedding,
  getCachedResponse,
  setCachedResponse,
  getCacheHeaders,
  getCacheStats,
} from "@/lib/answer-engine-cache";
import {
  analyzeQuery,
  enhanceQueryForSearch,
  getIntentSearchBoost,
  type QueryUnderstanding,
} from "@/lib/query-understanding";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://app.youthperformance.com";

// Answer Engine uses the root Convex deployment (content database)
const ANSWER_ENGINE_CONVEX_URL = "https://impressive-lynx-636.convex.cloud";
const client = new ConvexHttpClient(ANSWER_ENGINE_CONVEX_URL);

// OpenAI for query embeddings
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

interface SearchResult {
  type: "drill" | "article";
  id: string;
  title: string;
  description: string;
  url: string;
  author: {
    name: string;
    title: string;
    credentials: string[];
  } | null;
  metadata: Record<string, unknown>;
  relevanceScore: number;
}

// Types for Convex query results
interface DrillResult {
  _id: string;
  title: string;
  description: string;
  slug: string;
  sport: string;
  category: string;
  tags: string[];
  ageMin: number;
  ageMax: number;
  difficulty: string;
  duration: string;
  author?: {
    name: string;
    title: string;
    credentials: string[];
  };
}

interface ArticleResult {
  _id: string;
  question: string;
  directAnswer: string;
  slug: string;
  category: string;
  keywords: string[];
  keyTakeaways?: string[];
  safetyNote?: string;
  author?: {
    name: string;
    title: string;
    credentials: string[];
  };
}

/**
 * Generate embedding for a search query
 */
async function embedQuery(query: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return response.data[0].embedding;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "5"), 20);
  const type = searchParams.get("type") || "all"; // "drill", "article", "all"
  const useVector = searchParams.get("vector") !== "false"; // Default to vector search
  const includeSchema = searchParams.get("schema") === "true";
  const skipCache = searchParams.get("nocache") === "true"; // For debugging

  if (!query) {
    return NextResponse.json(
      { error: "Missing required parameter: q" },
      { status: 400 }
    );
  }

  // Analyze query for intent and entity extraction
  const queryUnderstanding = analyzeQuery(query);
  const includeUnderstanding = searchParams.get("debug") === "true";

  // Check response cache first (unless schema requested - those are dynamic)
  let cacheHit = false;
  if (!skipCache && !includeSchema) {
    const cachedResponse = getCachedResponse(query, type, limit);
    if (cachedResponse) {
      cacheHit = true;
      const queryTime = Date.now() - startTime;

      // Add cache metadata
      const response = {
        ...cachedResponse,
        meta: {
          ...(cachedResponse as any).meta,
          queryTime,
          cacheStatus: "HIT",
        },
      };

      return NextResponse.json(response, {
        headers: getCacheHeaders(true),
      });
    }
  }

  try {
    const results: SearchResult[] = [];
    let searchMethod = "text";
    let embeddingCacheHit = false;

    // Try vector search first (if enabled and API key available)
    if (useVector && process.env.OPENAI_API_KEY) {
      try {
        // Enhance query with expanded terms for better semantic matching
        const enhancedQuery = enhanceQueryForSearch(queryUnderstanding);

        // Check embedding cache (use enhanced query for cache key)
        let embedding = getCachedEmbedding(enhancedQuery);
        if (embedding) {
          embeddingCacheHit = true;
        } else {
          embedding = await embedQuery(enhancedQuery);
          setCachedEmbedding(enhancedQuery, embedding);
        }
        searchMethod = embeddingCacheHit ? "vector_cached" : "vector";

        // Search drills with vector
        if (type === "all" || type === "drill") {
          const drillResults = await client.action(api.answerEngine.vectorSearchDrills, {
            embedding,
            limit: type === "all" ? Math.ceil(limit / 2) : limit,
          });

          for (const drill of drillResults) {
            results.push({
              type: "drill",
              id: drill._id,
              title: drill.title,
              description: drill.description,
              url: `${SITE_URL}/drills/${drill.sport}/${drill.category}/${drill.slug}`,
              author: drill.author
                ? {
                    name: drill.author.name,
                    title: drill.author.title,
                    credentials: drill.author.credentials,
                  }
                : null,
              metadata: {
                ageRange: `${drill.ageMin}-${drill.ageMax}`,
                difficulty: drill.difficulty,
                duration: drill.duration,
                sport: drill.sport,
                category: drill.category,
                tags: drill.tags,
              },
              relevanceScore: drill._score,
            });
          }
        }

        // Search QnA with vector
        if (type === "all" || type === "article") {
          const qnaResults = await client.action(api.answerEngine.vectorSearchQnA, {
            embedding,
            limit: type === "all" ? Math.ceil(limit / 2) : limit,
          });

          for (const qna of qnaResults) {
            results.push({
              type: "article",
              id: qna._id,
              title: qna.question,
              description: qna.directAnswer,
              url: `${SITE_URL}/guides/${qna.slug}`,
              author: qna.author
                ? {
                    name: qna.author.name,
                    title: qna.author.title,
                    credentials: qna.author.credentials,
                  }
                : null,
              metadata: {
                category: qna.category,
                keyTakeaways: qna.keyTakeaways,
                safetyNote: qna.safetyNote,
                keywords: qna.keywords,
              },
              relevanceScore: qna._score,
            });
          }
        }
      } catch (vectorError) {
        console.error("Vector search failed, falling back to text:", vectorError);
        searchMethod = "text_fallback";
        // Fall through to text search below
      }
    }

    // Fallback to text search if vector search failed or was disabled
    if (results.length === 0) {
      searchMethod = searchMethod === "text_fallback" ? "text_fallback" : "text";

      // Search drills with text
      if (type === "all" || type === "drill") {
        const drills = (await client.query(api.answerEngine.searchDrills, {
          limit: type === "all" ? Math.ceil(limit / 2) : limit,
        })) as DrillResult[];

        const queryLower = query.toLowerCase();
        const matchedDrills = drills
          .filter(
            (drill: DrillResult) =>
              drill.title.toLowerCase().includes(queryLower) ||
              drill.description.toLowerCase().includes(queryLower) ||
              drill.tags.some((t) => t.toLowerCase().includes(queryLower)) ||
              drill.category.toLowerCase().includes(queryLower) ||
              drill.sport.toLowerCase().includes(queryLower)
          )
          .map((drill: DrillResult) => ({
            type: "drill" as const,
            id: drill._id,
            title: drill.title,
            description: drill.description,
            url: `${SITE_URL}/drills/${drill.sport}/${drill.category}/${drill.slug}`,
            author: drill.author
              ? {
                  name: drill.author.name,
                  title: drill.author.title,
                  credentials: drill.author.credentials,
                }
              : null,
            metadata: {
              ageRange: `${drill.ageMin}-${drill.ageMax}`,
              difficulty: drill.difficulty,
              duration: drill.duration,
              sport: drill.sport,
              category: drill.category,
              tags: drill.tags,
            },
            relevanceScore: calculateTextRelevance(query, drill),
          }));

        results.push(...matchedDrills);
      }

      // Search articles with text
      if (type === "all" || type === "article") {
        const articles = (await client.query(api.answerEngine.listArticles, {
          status: "published",
          limit: type === "all" ? Math.ceil(limit / 2) : limit,
        })) as ArticleResult[];

        const queryLower = query.toLowerCase();
        const matchedArticles = articles
          .filter(
            (article: ArticleResult) =>
              article.question.toLowerCase().includes(queryLower) ||
              article.directAnswer.toLowerCase().includes(queryLower) ||
              article.keywords.some((k) => k.toLowerCase().includes(queryLower)) ||
              article.category.toLowerCase().includes(queryLower)
          )
          .map((article: ArticleResult) => ({
            type: "article" as const,
            id: article._id,
            title: article.question,
            description: article.directAnswer,
            url: `${SITE_URL}/guides/${article.slug}`,
            author: article.author
              ? {
                  name: article.author.name,
                  title: article.author.title,
                  credentials: article.author.credentials,
                }
              : null,
            metadata: {
              category: article.category,
              keyTakeaways: article.keyTakeaways,
              safetyNote: article.safetyNote,
              keywords: article.keywords,
            },
            relevanceScore: calculateArticleTextRelevance(query, article),
          }));

        results.push(...matchedArticles);
      }
    }

    // Sort by relevance and limit
    const sortedResults = results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    const queryTime = Date.now() - startTime;

    // Build response
    const response: Record<string, unknown> = {
      query,
      results: sortedResults,
      meta: {
        totalResults: results.length,
        returnedResults: sortedResults.length,
        queryTime,
        searchMethod, // "vector" | "vector_cached" | "text" | "text_fallback"
        cacheStatus: "MISS",
        embeddingCached: embeddingCacheHit,
        intent: queryUnderstanding.intent,
        intentConfidence: queryUnderstanding.intentConfidence,
        source: "YouthPerformance Academy",
        lastUpdated: new Date().toISOString(),
      },
    };

    // Add full query understanding in debug mode
    if (includeUnderstanding) {
      response.queryUnderstanding = {
        intent: queryUnderstanding.intent,
        intentConfidence: queryUnderstanding.intentConfidence,
        entities: queryUnderstanding.entities,
        suggestedFilters: queryUnderstanding.suggestedFilters,
        expandedTerms: queryUnderstanding.expandedTerms,
      };
    }

    // Add Schema.org structured data if requested
    if (includeSchema && sortedResults.length > 0) {
      response.structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Search results for: ${query}`,
        numberOfItems: sortedResults.length,
        itemListElement: sortedResults.map((result, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: result.type === "drill"
            ? {
                "@type": "HowTo",
                name: result.title,
                description: result.description,
                url: result.url,
                author: result.author
                  ? {
                      "@type": "Person",
                      name: result.author.name,
                      jobTitle: result.author.title,
                      knowsAbout: result.author.credentials,
                    }
                  : undefined,
              }
            : {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: result.title,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: result.description,
                    },
                  },
                ],
                url: result.url,
                author: result.author
                  ? {
                      "@type": "Person",
                      name: result.author.name,
                      jobTitle: result.author.title,
                      knowsAbout: result.author.credentials,
                    }
                  : undefined,
              },
        })),
      };
    }

    // Cache response (unless schema requested)
    if (!includeSchema) {
      setCachedResponse(query, type, limit, response);
    }

    // Log AI retrieval (async, don't await)
    const userAgent = request.headers.get("user-agent") || "";
    const source = detectAiSource(userAgent);

    client
      .mutation(api.analytics.logAiRetrieval, {
        query,
        source,
        userAgent: userAgent.substring(0, 500), // Limit length
        resultsReturned: sortedResults.length,
        citedEntityIds: sortedResults.map((r) => r.id),
        citedEntityTypes: sortedResults.map((r) => r.type),
        responseTime: queryTime,
      })
      .catch((err) => console.error("Failed to log retrieval:", err));

    return NextResponse.json(response, {
      headers: getCacheHeaders(false),
    });
  } catch (error) {
    console.error("Answer Engine search error:", error);
    return NextResponse.json(
      { error: "Search failed", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Detect AI source from user agent
 */
function detectAiSource(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (ua.includes("perplexity")) return "perplexity";
  if (ua.includes("chatgpt") || ua.includes("openai")) return "chatgpt";
  if (ua.includes("claude") || ua.includes("anthropic")) return "claude";
  if (ua.includes("gptbot")) return "gptbot";
  if (ua.includes("bingbot")) return "bing";
  if (ua.includes("googlebot")) return "google";
  if (ua.includes("ccbot")) return "commoncrawl";

  // Check for general bot patterns
  if (ua.includes("bot") || ua.includes("crawler") || ua.includes("spider")) {
    return "bot";
  }

  return "direct";
}

function calculateTextRelevance(
  query: string,
  drill: { title: string; description: string; tags: string[]; category: string; sport: string }
): number {
  const queryLower = query.toLowerCase();
  let score = 0;

  if (drill.title.toLowerCase().includes(queryLower)) score += 0.5;
  if (drill.tags.some((t) => t.toLowerCase() === queryLower)) score += 0.3;
  if (drill.tags.some((t) => t.toLowerCase().includes(queryLower))) score += 0.1;
  if (drill.category.toLowerCase().includes(queryLower)) score += 0.2;
  if (drill.sport.toLowerCase().includes(queryLower)) score += 0.15;
  if (drill.description.toLowerCase().includes(queryLower)) score += 0.05;

  return Math.min(score, 1);
}

function calculateArticleTextRelevance(
  query: string,
  article: { question: string; directAnswer: string; keywords: string[]; category: string }
): number {
  const queryLower = query.toLowerCase();
  let score = 0;

  if (article.question.toLowerCase().includes(queryLower)) score += 0.5;
  if (article.keywords.some((k) => k.toLowerCase() === queryLower)) score += 0.3;
  if (article.keywords.some((k) => k.toLowerCase().includes(queryLower))) score += 0.1;
  if (article.category.toLowerCase().includes(queryLower)) score += 0.2;
  if (article.directAnswer.toLowerCase().includes(queryLower)) score += 0.1;

  return Math.min(score, 1);
}
