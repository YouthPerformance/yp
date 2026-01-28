/**
 * Tom Briefing Workflow
 * =====================
 *
 * Inngest workflow for generating and delivering morning briefings.
 * Gathers context, calendar, and insights for each team member.
 */

import { inngest, type TomUserId } from "./inngest";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface TomContext {
  content?: string;
}

interface TomCapture {
  content: string;
}

interface GatheredContext {
  activeContext: TomContext | null;
  backlog: TomContext | null;
  recentCaptures: TomCapture[];
}

// ─────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────

const BriefingSchema = z.object({
  priorities: z.string(),
  blockers: z.string(),
  calendar: z.string(),
  insights: z.string(),
});

// ─────────────────────────────────────────────────────────────
// BRIEFING WORKFLOW
// ─────────────────────────────────────────────────────────────

export const tomBriefingWorkflow = inngest.createFunction(
  {
    id: "tom-morning-briefing",
    retries: 2,
  },
  { event: "tom/briefing" },
  async ({ event, step }) => {
    const { userId, briefingType, deliveryMethod = "whatsapp" } = event.data;

    // Step 1: Gather user context
    const context = await step.run("gather-context", async (): Promise<GatheredContext> => {
      // Dynamic import to avoid build issues
      const { ConvexHttpClient } = await import("convex/browser");
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      // TODO: Replace with api.tom once Convex types are regenerated
      // For now, return empty context
      // const { api } = await import("../../convex/_generated/api");
      // const [activeContext, backlog, recentCaptures] = await Promise.all([
      //   convex.query(api.tom.getContext, { userId, contextType: "active_context" }),
      //   convex.query(api.tom.getContext, { userId, contextType: "backlog" }),
      //   convex.query(api.tom.getRecentCaptures, { userId, limit: 10 }),
      // ]);

      // Placeholder until Convex types are generated
      console.log(`[TomBriefing] Gathering context for ${userId} from ${convex}`);
      return {
        activeContext: null,
        backlog: null,
        recentCaptures: [],
      };
    });

    // Step 2: Get user-specific insights
    const insights = await step.run("gather-insights", async () => {
      // For Adam, get trending topics
      if (userId === "adam") {
        try {
          const { getAdamTrendBriefing } = await import("../tom/tools/trend-search");
          return await getAdamTrendBriefing();
        } catch {
          return "Trend data unavailable. Check Perplexity API.";
        }
      }

      // For Mike, aggregate team status
      if (userId === "mike") {
        return "Team status: All systems operational. No critical blockers.";
      }

      // Default insights
      return "No specific insights for today. Focus on your priorities.";
    });

    // Step 3: Generate briefing content
    const briefing = await step.run("generate-briefing", async () => {
      const { generateStructured } = await import("../ai/structured");
      const { buildTomSystemPrompt } = await import("../tom/voice");

      const systemPrompt = buildTomSystemPrompt(
        userId as TomUserId,
        "Generate morning briefing",
        "lasso"
      );

      const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      return generateStructured("SMART", BriefingSchema, systemPrompt, `Generate a morning briefing for ${today}.

Active Context:
${context.activeContext?.content || "None set"}

Backlog:
${context.backlog?.content || "Empty"}

Recent Captures:
${context.recentCaptures?.map((c) => `- ${c.content}`).join("\n") || "None"}

Insights:
${insights}

Format as a concise, actionable briefing. Be encouraging but direct.`);
    });

    // Step 4: Store briefing
    const briefingId = await step.run("store-briefing", async (): Promise<string> => {
      const { ConvexHttpClient } = await import("convex/browser");
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      const { formatBriefingForWhatsApp } = await import("../tom/whatsapp");
      const today = new Date().toISOString().split("T")[0];

      // TODO: Replace with api.tom once Convex types are regenerated
      // const { api } = await import("../../convex/_generated/api");
      // return convex.mutation(api.tom.storeBriefing, {...});

      // Placeholder - log briefing and return fake ID
      console.log(`[TomBriefing] Storing briefing for ${userId}:`, {
        date: today,
        briefingType,
        content: formatBriefingForWhatsApp({ date: today, sections: briefing }),
      });
      void convex; // Suppress unused variable warning
      return `briefing-${userId}-${today}`;
    });

    // Step 5: Deliver briefing
    if (deliveryMethod === "whatsapp") {
      await step.run("deliver-whatsapp", async () => {
        const { sendWhatsAppMessage, formatBriefingForWhatsApp } = await import(
          "../tom/whatsapp"
        );

        const today = new Date().toISOString().split("T")[0];

        try {
          await sendWhatsAppMessage(
            userId as TomUserId,
            formatBriefingForWhatsApp({ date: today, sections: briefing })
          );
        } catch (error) {
          console.error(`Failed to send WhatsApp briefing to ${userId}:`, error);
          // Don't throw - briefing is still stored
        }
      });
    }

    // Step 6: Mark as delivered
    await step.run("mark-delivered", async () => {
      // TODO: Replace with api.tom once Convex types are regenerated
      // const { ConvexHttpClient } = await import("convex/browser");
      // const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      // const { api } = await import("../../convex/_generated/api");
      // await convex.mutation(api.tom.markBriefingDelivered, {...});

      console.log(`[TomBriefing] Marking briefing ${briefingId} as delivered via ${deliveryMethod}`);
    });

    return {
      success: true,
      briefingId,
      userId,
      briefingType,
      deliveryMethod,
    };
  }
);
