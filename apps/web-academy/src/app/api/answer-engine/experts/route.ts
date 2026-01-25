/**
 * Answer Engine: Experts API
 *
 * GET /api/answer-engine/experts
 * GET /api/answer-engine/experts?slug=james-scott
 *
 * Author credentials for E-E-A-T signals.
 * Provides structured data about content authors for trust verification.
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://app.youthperformance.com";

// Answer Engine uses the root Convex deployment (content database)
const ANSWER_ENGINE_CONVEX_URL = "https://impressive-lynx-636.convex.cloud";
const client = new ConvexHttpClient(ANSWER_ENGINE_CONVEX_URL);

interface ExpertResponse {
  slug: string;
  name: string;
  title: string;
  icon: string;
  credentials: string[];
  bio: string;
  avatarUrl?: string;
  url: string;
  contentCount: {
    drills: number;
    articles: number;
  };
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    wikipedia?: string;
    youtube?: string;
  };
  topics: string[];
  schema: {
    "@context": string;
    "@type": string;
    name: string;
    description: string;
    jobTitle: string;
    url: string;
    image?: string;
    sameAs?: string[];
  };
}

// Types for Convex query results
interface DrillItem {
  _id: unknown;
  category: string;
}

interface ArticleItem {
  _id: unknown;
  category: string;
}

interface ExpertItem {
  _id: unknown;
  slug: string;
  name: string;
  title: string;
  icon: string;
  credentials: string[];
  bio: string;
  avatarUrl?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    wikipedia?: string;
    youtube?: string;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  try {
    // Single expert lookup
    if (slug) {
      const expert = await client.query(api.answerEngine.getExpertBySlug, {
        slug,
      });

      if (!expert) {
        return NextResponse.json(
          { error: "Expert not found" },
          { status: 404 }
        );
      }

      // Get expert's content for topics
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const expertId = expert._id as any;
      const [drills, articles] = await Promise.all([
        client.query(api.answerEngine.listDrills, {
          authorId: expertId,
          status: "published",
          limit: 50,
        }) as Promise<DrillItem[]>,
        client.query(api.answerEngine.listArticles, {
          authorId: expertId,
          status: "published",
          limit: 50,
        }) as Promise<ArticleItem[]>,
      ]);

      // Extract unique topics
      const topics = [
        ...new Set([
          ...drills.map((d: DrillItem) => d.category),
          ...articles.map((a: ArticleItem) => a.category),
        ]),
      ];

      const formattedExpert: ExpertResponse = {
        slug: expert.slug,
        name: expert.name,
        title: expert.title,
        icon: expert.icon,
        credentials: expert.credentials,
        bio: expert.bio,
        avatarUrl: expert.avatarUrl,
        url: `${SITE_URL}/experts/${expert.slug}`,
        contentCount: {
          drills: drills.length,
          articles: articles.length,
        },
        socialLinks: expert.socialLinks,
        topics,
        schema: buildPersonSchema(expert, topics),
      };

      return NextResponse.json({ expert: formattedExpert });
    }

    // All experts
    const experts = (await client.query(api.answerEngine.listExperts, {})) as ExpertItem[];

    const formattedExperts: ExpertResponse[] = await Promise.all(
      experts.map(async (expert: ExpertItem) => {
        // Get content counts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const expertIdForQuery = expert._id as any;
        const [drills, articles] = await Promise.all([
          client.query(api.answerEngine.listDrills, {
            authorId: expertIdForQuery,
            status: "published",
            limit: 50,
          }) as Promise<DrillItem[]>,
          client.query(api.answerEngine.listArticles, {
            authorId: expertIdForQuery,
            status: "published",
            limit: 50,
          }) as Promise<ArticleItem[]>,
        ]);

        const topics = [
          ...new Set([
            ...drills.map((d: DrillItem) => d.category),
            ...articles.map((a: ArticleItem) => a.category),
          ]),
        ];

        return {
          slug: expert.slug,
          name: expert.name,
          title: expert.title,
          icon: expert.icon,
          credentials: expert.credentials,
          bio: expert.bio,
          avatarUrl: expert.avatarUrl,
          url: `${SITE_URL}/experts/${expert.slug}`,
          contentCount: {
            drills: drills.length,
            articles: articles.length,
          },
          socialLinks: expert.socialLinks,
          topics,
          schema: buildPersonSchema(expert, topics),
        };
      })
    );

    return NextResponse.json({
      experts: formattedExperts,
      meta: {
        total: formattedExperts.length,
        source: "YouthPerformance Academy",
      },
    });
  } catch (error) {
    console.error("Experts API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch experts", details: String(error) },
      { status: 500 }
    );
  }
}

function buildPersonSchema(
  expert: {
    slug: string;
    name: string;
    title: string;
    bio: string;
    avatarUrl?: string;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      wikipedia?: string;
      youtube?: string;
    };
  },
  topics: string[]
): ExpertResponse["schema"] {
  const sameAs: string[] = [];

  if (expert.socialLinks?.instagram) {
    const ig = expert.socialLinks.instagram;
    sameAs.push(ig.startsWith("http") ? ig : `https://instagram.com/${ig.replace("@", "")}`);
  }
  if (expert.socialLinks?.twitter) {
    const tw = expert.socialLinks.twitter;
    sameAs.push(tw.startsWith("http") ? tw : `https://twitter.com/${tw.replace("@", "")}`);
  }
  if (expert.socialLinks?.youtube) {
    const yt = expert.socialLinks.youtube;
    sameAs.push(yt.startsWith("http") ? yt : `https://youtube.com/${yt.replace("@", "")}`);
  }
  if (expert.socialLinks?.wikipedia) {
    sameAs.push(expert.socialLinks.wikipedia);
  }

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: expert.name,
    description: expert.bio,
    jobTitle: expert.title,
    url: `${SITE_URL}/experts/${expert.slug}`,
    image: expert.avatarUrl ? `${SITE_URL}${expert.avatarUrl}` : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}
