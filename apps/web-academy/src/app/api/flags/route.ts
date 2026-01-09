// ═══════════════════════════════════════════════════════════
// FEATURE FLAGS API
// Read current feature flag state (for debugging)
// ═══════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getFeatureFlags } from "@/lib/flags";

export async function GET() {
  try {
    const flags = await getFeatureFlags();

    return NextResponse.json({
      flags,
      source: process.env.EDGE_CONFIG ? "edge-config" : "defaults",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch flags", details: String(error) },
      { status: 500 },
    );
  }
}
