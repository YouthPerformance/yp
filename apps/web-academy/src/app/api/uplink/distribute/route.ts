// ═══════════════════════════════════════════════════════════
// GPT UPLINK - DISTRIBUTION WEBHOOK
// Sends approved campaigns to Make.com for social distribution
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@yp/alpha/convex/_generated/api";
import { Id } from "@yp/alpha/convex/_generated/dataModel";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ─────────────────────────────────────────────────────────────
// POST: Distribute campaign to Make.com
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request
    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing campaignId" },
        { status: 400 }
      );
    }

    // 2. Fetch campaign with assets
    const campaign = await convex.query(api.campaigns.getCampaign, {
      campaignId: campaignId as Id<"campaigns">,
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Not Found", message: "Campaign not found" },
        { status: 404 }
      );
    }

    // 3. Check campaign is ready for distribution
    if (campaign.status === "PUBLISHED") {
      return NextResponse.json(
        { error: "Conflict", message: "Campaign already published" },
        { status: 409 }
      );
    }

    // 4. Build Campaign Bundle payload for Make.com
    const payload = {
      campaignId: campaign._id,
      author: campaign.author,
      title: campaign.title,
      createdAt: new Date(campaign.createdAt).toISOString(),
      publishedAt: new Date().toISOString(),
      content: {
        blog: {
          title: campaign.assets?.BLOG?.title || campaign.title,
          body: campaign.assets?.BLOG?.body || "",
        },
        linkedin: {
          body: campaign.assets?.LINKEDIN?.body || "",
        },
        twitter: {
          thread: (campaign.assets?.TWITTER?.body || "").split("\n\n---\n\n"),
        },
        instagram: {
          caption: campaign.assets?.INSTAGRAM?.body || "",
        },
      },
    };

    // 5. Send to Make.com webhook
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (!makeWebhookUrl) {
      console.error("[Distribute] MAKE_WEBHOOK_URL not configured");
      return NextResponse.json(
        { error: "Configuration Error", message: "Distribution not configured" },
        { status: 500 }
      );
    }

    const makeResponse = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 6. Record distribution result
    if (makeResponse.ok) {
      const responseData = await makeResponse.json().catch(() => ({}));

      await convex.mutation(api.campaigns.recordDistribution, {
        campaignId: campaignId as Id<"campaigns">,
        success: true,
        response: responseData,
      });

      return NextResponse.json({
        success: true,
        message: "Campaign distributed successfully",
        campaignId,
      });
    } else {
      const errorText = await makeResponse.text().catch(() => "Unknown error");

      await convex.mutation(api.campaigns.recordDistribution, {
        campaignId: campaignId as Id<"campaigns">,
        success: false,
        errorMessage: `Make.com error: ${makeResponse.status} - ${errorText}`,
      });

      return NextResponse.json(
        {
          error: "Distribution Failed",
          message: `Make.com returned ${makeResponse.status}`,
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("[Distribute] Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error", message: "Distribution failed" },
      { status: 500 }
    );
  }
}
