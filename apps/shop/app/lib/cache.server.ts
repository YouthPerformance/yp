/**
 * YP Shop Caching Strategies
 *
 * Based on Shopify Hydrogen best practices and what top DTC brands do:
 * - Gymshark, Allbirds, SKIMS all use aggressive edge caching
 * - Stale-while-revalidate for instant responses
 * - Short TTL for dynamic content, long TTL for static
 */

import type { CachingStrategy } from "@shopify/hydrogen";

/**
 * Cache durations (in seconds)
 */
export const CACHE_DURATIONS = {
  /** 1 minute - for frequently changing data */
  SHORT: 60,
  /** 10 minutes - for product data */
  MEDIUM: 60 * 10,
  /** 1 hour - for collections, homepage */
  LONG: 60 * 60,
  /** 24 hours - for static content */
  DAY: 60 * 60 * 24,
} as const;

/**
 * Stale-while-revalidate durations
 * Content is served stale while fresh content is fetched in background
 */
export const SWR_DURATIONS = {
  SHORT: 60 * 5, // 5 min stale window
  MEDIUM: 60 * 30, // 30 min stale window
  LONG: 60 * 60 * 2, // 2 hour stale window
} as const;

/**
 * Cache strategies by content type
 *
 * Use these with storefront.query():
 * const {product} = await storefront.query(QUERY, {
 *   cache: CACHE_STRATEGIES.product(storefront),
 * });
 */
export const createCacheStrategies = (storefront: {
  CacheShort: () => CachingStrategy;
  CacheLong: () => CachingStrategy;
  CacheNone: () => CachingStrategy;
  CacheCustom: (options: {
    mode?: string;
    maxAge?: number;
    staleWhileRevalidate?: number;
    sMaxAge?: number;
    staleIfError?: number;
  }) => CachingStrategy;
}) => ({
  /**
   * Homepage - cached for 10 min, SWR for 30 min
   * Balance between freshness and speed
   */
  homepage: () =>
    storefront.CacheCustom({
      mode: "public",
      maxAge: CACHE_DURATIONS.MEDIUM,
      staleWhileRevalidate: SWR_DURATIONS.MEDIUM,
      sMaxAge: CACHE_DURATIONS.MEDIUM,
      staleIfError: CACHE_DURATIONS.DAY,
    }),

  /**
   * Product pages - cached for 1 min, SWR for 5 min
   * Shorter TTL for inventory accuracy
   */
  product: () =>
    storefront.CacheCustom({
      mode: "public",
      maxAge: CACHE_DURATIONS.SHORT,
      staleWhileRevalidate: SWR_DURATIONS.SHORT,
      sMaxAge: CACHE_DURATIONS.SHORT,
      staleIfError: CACHE_DURATIONS.LONG,
    }),

  /**
   * Collections - cached for 10 min, SWR for 30 min
   * Collections change less frequently than individual products
   */
  collection: () =>
    storefront.CacheCustom({
      mode: "public",
      maxAge: CACHE_DURATIONS.MEDIUM,
      staleWhileRevalidate: SWR_DURATIONS.MEDIUM,
      sMaxAge: CACHE_DURATIONS.MEDIUM,
      staleIfError: CACHE_DURATIONS.DAY,
    }),

  /**
   * All products listing - cached for 10 min
   */
  productListing: () =>
    storefront.CacheCustom({
      mode: "public",
      maxAge: CACHE_DURATIONS.MEDIUM,
      staleWhileRevalidate: SWR_DURATIONS.MEDIUM,
      sMaxAge: CACHE_DURATIONS.MEDIUM,
      staleIfError: CACHE_DURATIONS.DAY,
    }),

  /**
   * Static pages (legal, about) - cached for 1 day
   */
  static: () =>
    storefront.CacheCustom({
      mode: "public",
      maxAge: CACHE_DURATIONS.DAY,
      staleWhileRevalidate: CACHE_DURATIONS.DAY,
      sMaxAge: CACHE_DURATIONS.DAY,
      staleIfError: CACHE_DURATIONS.DAY,
    }),

  /**
   * Cart - never cached (user-specific)
   */
  cart: () => storefront.CacheNone(),

  /**
   * Search results - short cache
   */
  search: () =>
    storefront.CacheCustom({
      mode: "public",
      maxAge: CACHE_DURATIONS.SHORT,
      staleWhileRevalidate: SWR_DURATIONS.SHORT,
      sMaxAge: CACHE_DURATIONS.SHORT,
    }),
});

/**
 * HTTP Response headers for edge caching
 * Apply these to loader responses for CDN/Oxygen caching
 */
export const CACHE_HEADERS = {
  /**
   * Standard cacheable response
   */
  standard: {
    "Cache-Control": `public, max-age=${CACHE_DURATIONS.MEDIUM}, stale-while-revalidate=${SWR_DURATIONS.MEDIUM}`,
  },

  /**
   * Product pages - shorter cache for inventory accuracy
   */
  product: {
    "Cache-Control": `public, max-age=${CACHE_DURATIONS.SHORT}, stale-while-revalidate=${SWR_DURATIONS.SHORT}`,
  },

  /**
   * Static content - long cache
   */
  static: {
    "Cache-Control": `public, max-age=${CACHE_DURATIONS.DAY}, immutable`,
  },

  /**
   * No cache (cart, checkout, user-specific)
   */
  none: {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  },
} as const;

/**
 * Performance timing headers
 * Helps with debugging and monitoring
 */
export const addServerTimingHeader = (
  headers: Headers,
  name: string,
  duration: number,
  description?: string,
) => {
  const existing = headers.get("Server-Timing") || "";
  const timing = description
    ? `${name};dur=${duration};desc="${description}"`
    : `${name};dur=${duration}`;
  headers.set("Server-Timing", existing ? `${existing}, ${timing}` : timing);
};
