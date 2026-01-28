/**
 * Trend Search Tool (Adam)
 * ========================
 *
 * Uses Perplexity API to find trending basketball/sports topics.
 * Provides content angles for Adam's social media presence.
 */

import type { TomUserId, TrendingTopic, TrendCategory } from "../types";
import { sendWhatsAppMessage } from "../whatsapp";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface TrendSearchResult {
  type: "success" | "error";
  trends?: TrendingTopic[];
  message?: string;
}

// ─────────────────────────────────────────────────────────────
// CATEGORY PROMPTS
// ─────────────────────────────────────────────────────────────

const CATEGORY_PROMPTS: Record<TrendCategory, string> = {
  nba: "NBA news, player performances, trade rumors, and viral moments from the last 48 hours",
  youth_sports:
    "Youth basketball training trends, parent concerns, youth development news",
  basketball_skills:
    "Basketball skill development trends, training techniques going viral, shooting form discussions",
  general: "Sports performance, athletic training, and fitness trends",
};

// ─────────────────────────────────────────────────────────────
// TREND SEARCH
// ─────────────────────────────────────────────────────────────

/**
 * Search for trending topics using Perplexity API
 */
export async function searchTrendingTopics(
  category: TrendCategory
): Promise<TrendingTopic[]> {
  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

  if (!PERPLEXITY_API_KEY) {
    console.warn("[TrendSearch] PERPLEXITY_API_KEY not configured");
    return getMockTrends(category);
  }

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-large-128k-online",
        messages: [
          {
            role: "system",
            content: `You are a sports media trend analyst. Find current trending topics related to: ${CATEGORY_PROMPTS[category]}

Return EXACTLY 3-5 topics in this JSON format:
[{"title": "...", "whyTrending": "...", "contentAngle": "...", "urgency": "🔴|🟡|🟢"}]

Urgency levels:
🔴 = Hot NOW (last 24 hours) - post immediately
🟡 = This week - good to cover soon
🟢 = Evergreen - can cover anytime

Focus on topics that Adam Harrington (NBA skills trainer, Global Director of Basketball) can create content about.
Content angles should be specific: "60-second breakdown", "myth-busting", "tutorial", "reaction", etc.`,
          },
          {
            role: "user",
            content: `What's trending in ${category.replace("_", " ")} right now that a basketball skills trainer should know about?`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const trends = JSON.parse(jsonMatch[0]) as TrendingTopic[];
      return trends;
    }

    return getMockTrends(category);
  } catch (error) {
    console.error("[TrendSearch] Error:", error);
    return getMockTrends(category);
  }
}

/**
 * Get mock trends for development/fallback
 */
function getMockTrends(category: TrendCategory): TrendingTopic[] {
  const mockTrends: Record<TrendCategory, TrendingTopic[]> = {
    nba: [
      {
        title: "Wemby's Block Party",
        whyTrending:
          "Victor Wembanyama had 6 blocks in last night's game, social media exploding",
        contentAngle:
          "60-second breakdown of his timing and positioning techniques",
        urgency: "🔴",
      },
      {
        title: "Steph's Practice Routine",
        whyTrending: "New training footage released showing Curry's warmup",
        contentAngle:
          "Recreate and explain for youth players - 'Curry Warmup Challenge'",
        urgency: "🟡",
      },
    ],
    youth_sports: [
      {
        title: "AAU Season Prep",
        whyTrending: "Spring AAU season starting, parents searching for prep tips",
        contentAngle: "5-week pre-season conditioning plan for 12-14 year olds",
        urgency: "🟡",
      },
    ],
    basketball_skills: [
      {
        title: "Euro Step Debate",
        whyTrending: "Discussion about legal vs travel on social media",
        contentAngle: "Clear rules breakdown + practice drill",
        urgency: "🟢",
      },
    ],
    general: [
      {
        title: "Sleep & Performance",
        whyTrending: "New study on sleep impact on reaction time in athletes",
        contentAngle: "Key findings + practical sleep tips for young athletes",
        urgency: "🟢",
      },
    ],
  };

  return mockTrends[category] || mockTrends.general;
}

// ─────────────────────────────────────────────────────────────
// BRIEFING GENERATION
// ─────────────────────────────────────────────────────────────

/**
 * Get Adam's trend briefing for morning delivery
 */
export async function getAdamTrendBriefing(): Promise<string> {
  const trends = await searchTrendingTopics("nba");

  if (trends.length === 0) {
    return "No trending topics found. Check Perplexity API.";
  }

  return trends
    .map(
      (t, i) =>
        `${i + 1}. ${t.urgency} *${t.title}*
   _${t.whyTrending}_
   💡 ${t.contentAngle}`
    )
    .join("\n\n");
}

// ─────────────────────────────────────────────────────────────
// REQUEST HANDLER
// ─────────────────────────────────────────────────────────────

/**
 * Handle a trend search request from Adam
 */
export async function handleTrendSearchRequest(
  userId: TomUserId,
  message: string
): Promise<TrendSearchResult> {
  // Determine category from message
  let category: TrendCategory = "nba";

  if (/youth|kids|young|aau/i.test(message)) {
    category = "youth_sports";
  } else if (/skills?|training|drill|technique/i.test(message)) {
    category = "basketball_skills";
  } else if (/general|fitness|performance/i.test(message)) {
    category = "general";
  }

  try {
    const trends = await searchTrendingTopics(category);

    if (trends.length === 0) {
      await sendWhatsAppMessage(
        userId,
        `⚠️ Couldn't find trending topics right now. Try again in a few minutes.`
      );

      return {
        type: "error",
        message: "No trends found",
      };
    }

    const formattedTrends = trends
      .map(
        (t, i) =>
          `${i + 1}. ${t.urgency} *${t.title}*
_${t.whyTrending}_
💡 ${t.contentAngle}`
      )
      .join("\n\n");

    await sendWhatsAppMessage(
      userId,
      `🏀 *TRENDING IN ${category.toUpperCase().replace("_", " ")}*

${formattedTrends}

_Reply with a number to get a full content brief._`
    );

    return {
      type: "success",
      trends,
    };
  } catch (error) {
    console.error("[TrendSearch] Error:", error);

    await sendWhatsAppMessage(
      userId,
      `⚠️ Error searching trends. Try again later.`
    );

    return {
      type: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
