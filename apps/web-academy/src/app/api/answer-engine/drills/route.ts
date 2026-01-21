/**
 * Answer Engine: Structured Drills API
 *
 * GET /api/answer-engine/drills?sport=basketball&category=shooting&age=8&limit=20
 *
 * Structured drill search with filters for programmatic access.
 * Returns detailed drill data with Schema.org HowTo markup.
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

interface HowToStep {
  "@type": "HowToStep";
  position: number;
  name?: string;
  text: string;
  image?: string;
}

interface DrillWithSchema {
  id: string;
  slug: string;
  title: string;
  description: string;
  url: string;
  sport: string;
  category: string;
  ageRange: { min: number; max: number };
  difficulty: string;
  duration: string;
  reps?: string;
  equipment: string[];
  tags: string[];
  constraints: string[];
  steps: {
    order: number;
    title?: string;
    instruction: string;
    duration?: string;
    durationSeconds?: number;
    coachingCue?: string;
  }[];
  coachingCues: string[];
  commonMistake?: string;
  mistakeFix?: string;
  author: {
    name: string;
    title: string;
    credentials: string[];
    url: string;
  } | null;
  schema: {
    "@context": string;
    "@type": string;
    name: string;
    description: string;
    step: HowToStep[];
    totalTime?: string;
    tool?: string[];
  };
  lastUpdated: string;
}

// Type for Convex drill query result
interface DrillQueryResult {
  _id: string;
  slug: string;
  title: string;
  description: string;
  sport: string;
  category: string;
  ageMin: number;
  ageMax: number;
  difficulty: string;
  duration: string;
  reps?: string;
  equipment: string[];
  tags: string[];
  constraints: string[];
  steps: {
    order: number;
    title?: string;
    instruction: string;
    duration?: string;
    durationSeconds?: number;
    coachingCue?: string;
  }[];
  coachingCues: string[];
  commonMistake?: string;
  mistakeFix?: string;
  author?: {
    name: string;
    title: string;
    credentials: string[];
    slug: string;
  };
  updatedAt: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const sport = searchParams.get("sport") || undefined;
  const category = searchParams.get("category") || undefined;
  const age = searchParams.get("age") ? parseInt(searchParams.get("age")!) : undefined;
  const difficulty = searchParams.get("difficulty") || undefined;
  const constraint = searchParams.get("constraint") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const cursor = searchParams.get("cursor") || undefined;

  try {
    const drills = (await client.query(api.answerEngine.searchDrills, {
      sport,
      category,
      age,
      difficulty,
      constraint,
      limit,
    })) as DrillQueryResult[];

    // Transform to API response with Schema.org markup
    const formattedDrills: DrillWithSchema[] = drills.map((drill: DrillQueryResult) => ({
      id: drill._id,
      slug: drill.slug,
      title: drill.title,
      description: drill.description,
      url: `${SITE_URL}/drills/${drill.sport}/${drill.category}/${drill.slug}`,
      sport: drill.sport,
      category: drill.category,
      ageRange: { min: drill.ageMin, max: drill.ageMax },
      difficulty: drill.difficulty,
      duration: drill.duration,
      reps: drill.reps,
      equipment: drill.equipment,
      tags: drill.tags,
      constraints: drill.constraints,
      steps: drill.steps.map((step) => ({
        order: step.order,
        title: step.title,
        instruction: step.instruction,
        duration: step.duration,
        durationSeconds: step.durationSeconds,
        coachingCue: step.coachingCue,
      })),
      coachingCues: drill.coachingCues,
      commonMistake: drill.commonMistake,
      mistakeFix: drill.mistakeFix,
      author: drill.author
        ? {
            name: drill.author.name,
            title: drill.author.title,
            credentials: drill.author.credentials,
            url: `${SITE_URL}/experts/${drill.author.slug}`,
          }
        : null,
      schema: buildHowToSchema(drill),
      lastUpdated: new Date(drill.updatedAt).toISOString(),
    }));

    return NextResponse.json({
      drills: formattedDrills,
      filters: {
        sport,
        category,
        age,
        difficulty,
        constraint,
      },
      pagination: {
        cursor,
        hasMore: drills.length === limit,
        total: drills.length,
      },
      meta: {
        source: "YouthPerformance Academy",
        documentation: `${SITE_URL}/api/docs`,
      },
    });
  } catch (error) {
    console.error("Drills API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch drills", details: String(error) },
      { status: 500 }
    );
  }
}

function buildHowToSchema(drill: {
  title: string;
  description: string;
  duration: string;
  equipment: string[];
  steps: { order: number; title?: string; instruction: string }[];
}): DrillWithSchema["schema"] {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: drill.title,
    description: drill.description,
    totalTime: parseDurationToISO(drill.duration),
    tool: drill.equipment.length > 0 ? drill.equipment : undefined,
    step: drill.steps.map((step) => ({
      "@type": "HowToStep" as const,
      position: step.order,
      name: step.title,
      text: step.instruction,
    })),
  };
}

function parseDurationToISO(duration: string): string | undefined {
  // Parse duration strings like "5-10 min", "10 min", etc.
  const match = duration.match(/(\d+)(?:-\d+)?\s*min/i);
  if (match) {
    return `PT${match[1]}M`;
  }
  return undefined;
}
