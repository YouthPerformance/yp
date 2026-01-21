/**
 * Answer Engine: Q&A Pairs API
 *
 * GET /api/answer-engine/qna?category=health-safety&limit=10
 *
 * Direct Q&A pairs optimized for AI citation.
 * Designed for featured snippets and voice search answers.
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const SITE_URL = "https://academy.youthperformance.com";

// Answer Engine uses the root Convex deployment (content database)
const ANSWER_ENGINE_CONVEX_URL = "https://impressive-lynx-636.convex.cloud";
const client = new ConvexHttpClient(ANSWER_ENGINE_CONVEX_URL);

interface QnAItem {
  id: string;
  question: string;
  answer: string;
  keyTakeaways: string[];
  safetyNote?: string;
  expert: {
    name: string;
    title: string;
    credentials: string[];
  } | null;
  category: string;
  url: string;
  lastUpdated: string;
}

interface FAQSchema {
  "@context": string;
  "@type": string;
  mainEntity: {
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }[];
}

// Types for Convex query results
interface ArticleItem {
  _id: string;
  category: string;
}

interface QnAPair {
  id: string;
  question: string;
  answer: string;
  keyTakeaways: string[];
  safetyNote?: string;
  expert: {
    name: string;
    title: string;
    credentials: string[];
  } | null;
  url: string;
  lastUpdated: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  try {
    const qnaPairs = (await client.query(api.answerEngine.getQnAPairs, {
      category,
      limit,
    })) as QnAPair[];

    // Get unique categories for meta
    const articles = (await client.query(api.answerEngine.listArticles, {
      status: "published",
      limit: 100,
    })) as ArticleItem[];

    const categories = [...new Set(articles.map((a: ArticleItem) => a.category))];

    // Format response
    const questions: QnAItem[] = qnaPairs.map((qa) => ({
      id: qa.id,
      question: qa.question,
      answer: qa.answer,
      keyTakeaways: qa.keyTakeaways,
      safetyNote: qa.safetyNote,
      expert: qa.expert,
      category: category || "all",
      url: qa.url,
      lastUpdated: qa.lastUpdated,
    }));

    // Build FAQPage schema
    const faqSchema: FAQSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: q.answer,
        },
      })),
    };

    return NextResponse.json({
      questions,
      schema: faqSchema,
      meta: {
        total: qnaPairs.length,
        categories,
        source: "YouthPerformance Academy",
        documentation: `${SITE_URL}/api/docs`,
      },
    });
  } catch (error) {
    console.error("Q&A API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Q&A pairs", details: String(error) },
      { status: 500 }
    );
  }
}
