/**
 * Dynamic Sitemap for AI Discovery
 *
 * Generates a sitemap.xml that includes:
 * - All published drills
 * - All published QnA articles (guides)
 * - Static pages
 *
 * Optimized for AI crawlers (Perplexity, ChatGPT, etc.)
 * to discover and index all content.
 */

import { MetadataRoute } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

const SITE_URL = "https://academy.youthperformance.com";

// Answer Engine uses the root Convex deployment (content database)
const ANSWER_ENGINE_CONVEX_URL = "https://impressive-lynx-636.convex.cloud";
const client = new ConvexHttpClient(ANSWER_ENGINE_CONVEX_URL);

// Types for Convex query results
interface DrillItem {
  slug: string;
  sport: string;
  category: string;
  updatedAt: number;
}

interface ArticleItem {
  slug: string;
  updatedAt: number;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/programs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/drills`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Fetch drills from Convex
  let drillPages: MetadataRoute.Sitemap = [];
  try {
    const drills = (await client.query(api.answerEngine.searchDrills, {
      limit: 1000,
    })) as DrillItem[];

    drillPages = drills.map((drill: DrillItem) => ({
      url: `${SITE_URL}/drills/${drill.sport}/${drill.category}/${drill.slug}`,
      lastModified: new Date(drill.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to fetch drills for sitemap:", error);
  }

  // Fetch QnA articles from Convex
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const articles = (await client.query(api.answerEngine.listArticles, {
      status: "published",
      limit: 1000,
    })) as ArticleItem[];

    articlePages = articles.map((article: ArticleItem) => ({
      url: `${SITE_URL}/guides/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to fetch articles for sitemap:", error);
  }

  return [...staticPages, ...drillPages, ...articlePages];
}
