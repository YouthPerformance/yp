/**
 * Answer Engine: Cache Statistics API
 *
 * GET /api/answer-engine/cache
 *
 * Returns cache hit/miss statistics for monitoring.
 * Useful for tuning cache sizes and TTLs.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCacheStats, clearCaches, getNoCacheHeaders } from "@/lib/answer-engine-cache";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const stats = getCacheStats();

  return NextResponse.json(
    {
      caches: {
        embedding: {
          ...stats.embedding,
          hitRatePercent: Math.round(stats.embedding.hitRate * 100),
        },
        response: {
          ...stats.response,
          hitRatePercent: Math.round(stats.response.hitRate * 100),
        },
      },
      timestamp: new Date().toISOString(),
    },
    { headers: getNoCacheHeaders() }
  );
}

/**
 * POST /api/answer-engine/cache
 * Clear all caches (admin only - add auth in production)
 */
export async function POST(request: NextRequest) {
  // In production, add authentication here
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "clear") {
    clearCaches();
    return NextResponse.json(
      { success: true, message: "All caches cleared" },
      { headers: getNoCacheHeaders() }
    );
  }

  return NextResponse.json(
    { error: "Invalid action. Use ?action=clear" },
    { status: 400 }
  );
}
