// ═══════════════════════════════════════════════════════════
// GPT UPLINK - CAMPAIGN WEBHOOK
// Receives content campaigns from ChatGPT Custom GPTs
// ═══════════════════════════════════════════════════════════

import { api } from "@yp/alpha/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { type NextRequest, NextResponse } from "next/server";
import { validateAuthor, verifyUplinkToken } from "@/lib/uplink-auth";

// Lazy Convex client initialization to prevent build errors
let convex: ConvexHttpClient | null = null;
function getConvexClient(): ConvexHttpClient {
  if (!convex) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");
    }
    convex = new ConvexHttpClient(url);
  }
  return convex;
}

// ─────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────

interface CampaignPayload {
  author: string;
  rawInput: string;
  content: {
    blog: {
      title: string;
      body: string;
    };
    linkedin: {
      body: string;
    };
    twitter: {
      thread: string[];
    };
    instagram: {
      caption: string;
    };
  };
}

// ─────────────────────────────────────────────────────────────
// POST: Create a new campaign
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication
    if (!verifyUplinkToken(request)) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or missing Bearer token" },
        { status: 401 },
      );
    }

    // 2. Parse and validate payload
    let payload: CampaignPayload;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid JSON payload" },
        { status: 400 },
      );
    }

    // 3. Validate author
    const author = validateAuthor(payload.author);
    if (!author) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Invalid author. Must be 'ADAM' or 'JAMES'",
        },
        { status: 400 },
      );
    }

    // 4. Validate content structure
    if (!payload.content?.blog?.title || !payload.content?.blog?.body) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing blog title or body" },
        { status: 400 },
      );
    }

    if (!payload.content?.linkedin?.body) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing LinkedIn content" },
        { status: 400 },
      );
    }

    if (!payload.content?.twitter?.thread || !Array.isArray(payload.content.twitter.thread)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing or invalid Twitter thread" },
        { status: 400 },
      );
    }

    if (!payload.content?.instagram?.caption) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing Instagram caption" },
        { status: 400 },
      );
    }

    // 5. Create campaign in Convex
    const result = await getConvexClient().mutation(api.campaigns.createCampaign, {
      author,
      rawInput: payload.rawInput || "",
      content: {
        blog: {
          title: payload.content.blog.title,
          body: payload.content.blog.body,
        },
        linkedin: {
          body: payload.content.linkedin.body,
        },
        twitter: {
          thread: payload.content.twitter.thread,
        },
        instagram: {
          caption: payload.content.instagram.caption,
        },
      },
    });

    // 6. Return success response
    const origin = request.headers.get("origin") || "https://app.youthperformance.com";
    const previewUrl = `${origin}/admin/campaigns/${result.campaignId}`;

    return NextResponse.json({
      success: true,
      message: "Campaign saved to YP Vault",
      campaignId: result.campaignId,
      previewUrl,
    });
  } catch (error) {
    console.error("[Uplink] Error creating campaign:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create campaign",
      },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────────────────────
// OPTIONS: CORS preflight
// ─────────────────────────────────────────────────────────────

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
