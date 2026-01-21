/**
 * Answer Engine Caching Layer
 *
 * Multi-tier caching strategy:
 * 1. Embedding Cache - Avoid recomputing embeddings for same queries
 * 2. Response Cache - Cache full responses for hot queries
 * 3. Edge Cache - HTTP headers for CDN caching
 *
 * For Edge Runtime compatibility, uses simple Map-based LRU cache.
 * In production, can be upgraded to Upstash Redis for distributed caching.
 */

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────

const EMBEDDING_CACHE_MAX_SIZE = 500; // Max cached query embeddings
const EMBEDDING_CACHE_TTL = 60 * 60 * 1000; // 1 hour

const RESPONSE_CACHE_MAX_SIZE = 200; // Max cached responses
const RESPONSE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hits: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
  hitRate: number;
}

// ─────────────────────────────────────────────────────────────
// LRU CACHE IMPLEMENTATION
// ─────────────────────────────────────────────────────────────

class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private ttl: number;
  private hits = 0;
  private misses = 0;

  constructor(maxSize: number, ttl: number) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Update access (LRU behavior)
    entry.hits++;
    this.cache.delete(key);
    this.cache.set(key, entry);

    this.hits++;
    return entry.value;
  }

  set(key: string, value: T): void {
    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hits: 0,
    });
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

// ─────────────────────────────────────────────────────────────
// CACHE INSTANCES
// ─────────────────────────────────────────────────────────────

// Embedding cache: query string → embedding vector
const embeddingCache = new LRUCache<number[]>(
  EMBEDDING_CACHE_MAX_SIZE,
  EMBEDDING_CACHE_TTL
);

// Response cache: cache key → full API response
const responseCache = new LRUCache<object>(
  RESPONSE_CACHE_MAX_SIZE,
  RESPONSE_CACHE_TTL
);

// ─────────────────────────────────────────────────────────────
// CACHE KEY GENERATION
// ─────────────────────────────────────────────────────────────

/**
 * Generate cache key for embedding lookups
 * Normalizes query for better hit rates
 */
export function getEmbeddingCacheKey(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " "); // Normalize whitespace
}

/**
 * Generate cache key for response lookups
 * Includes all query parameters that affect the response
 */
export function getResponseCacheKey(
  query: string,
  type: string,
  limit: number
): string {
  const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, " ");
  return `${normalizedQuery}|${type}|${limit}`;
}

// ─────────────────────────────────────────────────────────────
// EMBEDDING CACHE API
// ─────────────────────────────────────────────────────────────

/**
 * Get cached embedding for a query
 */
export function getCachedEmbedding(query: string): number[] | null {
  const key = getEmbeddingCacheKey(query);
  return embeddingCache.get(key);
}

/**
 * Cache an embedding for a query
 */
export function setCachedEmbedding(query: string, embedding: number[]): void {
  const key = getEmbeddingCacheKey(query);
  embeddingCache.set(key, embedding);
}

// ─────────────────────────────────────────────────────────────
// RESPONSE CACHE API
// ─────────────────────────────────────────────────────────────

/**
 * Get cached response for a query
 */
export function getCachedResponse(
  query: string,
  type: string,
  limit: number
): object | null {
  const key = getResponseCacheKey(query, type, limit);
  return responseCache.get(key);
}

/**
 * Cache a response
 */
export function setCachedResponse(
  query: string,
  type: string,
  limit: number,
  response: object
): void {
  const key = getResponseCacheKey(query, type, limit);
  responseCache.set(key, response);
}

// ─────────────────────────────────────────────────────────────
// CACHE STATS
// ─────────────────────────────────────────────────────────────

/**
 * Get combined cache statistics
 */
export function getCacheStats(): {
  embedding: CacheStats;
  response: CacheStats;
} {
  return {
    embedding: embeddingCache.getStats(),
    response: responseCache.getStats(),
  };
}

/**
 * Clear all caches
 */
export function clearCaches(): void {
  embeddingCache.clear();
  responseCache.clear();
}

// ─────────────────────────────────────────────────────────────
// HTTP CACHE HEADERS
// ─────────────────────────────────────────────────────────────

/**
 * Generate cache control headers for API responses
 *
 * Strategy:
 * - Edge/CDN: Cache for 60s (stale-while-revalidate for 5 min)
 * - Browser: No cache (to ensure fresh analytics)
 */
export function getCacheHeaders(isHit: boolean): Record<string, string> {
  // If response was cached, allow longer edge caching
  const maxAge = isHit ? 120 : 60;
  const staleWhileRevalidate = 300;

  return {
    "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    "CDN-Cache-Control": `max-age=${maxAge}`,
    "Vercel-CDN-Cache-Control": `max-age=${maxAge}`,
    "X-Cache-Status": isHit ? "HIT" : "MISS",
  };
}

/**
 * Generate no-cache headers (for analytics endpoints, etc.)
 */
export function getNoCacheHeaders(): Record<string, string> {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
  };
}
