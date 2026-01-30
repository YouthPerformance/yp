/**
 * Tom Capture Workflow
 * ====================
 *
 * Inngest workflow for processing captured messages.
 * Classifies, routes, and responds to team member inputs.
 *
 * NOTE: Convex queries are placeholders until `npx convex dev` generates types.
 */

import { inngest, type TomUserId } from "./inngest";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────

const CaptureClassificationSchema = z.object({
  type: z.enum(["task", "note", "idea", "question"]),
  urgency: z.enum(["high", "medium", "low"]),
  context: z.string(),
  requiresResponse: z.boolean(),
});

type CaptureClassification = z.infer<typeof CaptureClassificationSchema>;

// ─────────────────────────────────────────────────────────────
// CAPTURE WORKFLOW
// ─────────────────────────────────────────────────────────────

export const tomCaptureWorkflow = inngest.createFunction(
  {
    id: "tom-capture",
    retries: 3,
  },
  { event: "tom/capture" },
  async ({ event, step }) => {
    const { userId, content, source, messageId } = event.data;

    // Step 1: Store raw capture
    const captureId = await step.run("store-capture", async (): Promise<string> => {
      const { ConvexHttpClient } = await import("convex/browser");
      const { api } = await import("../../convex/_generated/api");
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      const id = await convex.mutation(api.tom.storeCapture, {
        userId: userId as "mike" | "james" | "adam" | "annie",
        content,
        source,
        routed: false,
        createdAt: Date.now(),
      });

      console.log(`[TomCapture] Stored capture ${id} for ${userId}`);
      return id;
    });

    // Step 2: Log inbound message
    await step.run("log-message", async () => {
      const { ConvexHttpClient } = await import("convex/browser");
      const { api } = await import("../../convex/_generated/api");
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      await convex.mutation(api.tom.logMessage, {
        userId: userId as "mike" | "james" | "adam" | "annie",
        content,
        direction: "inbound",
        whatsappMessageId: messageId,
      });

      console.log(`[TomCapture] Logged inbound message from ${userId}`);
    });

    // Step 3: Check for special intents (product viz, trend search, etc.)
    const specialIntent = await step.run("check-special-intent", async () => {
      try {
        const { routeTomRequest } = await import("../tom/intent-classifier");
        return await routeTomRequest(userId as TomUserId, content);
      } catch {
        return null;
      }
    });

    if (specialIntent?.handled) {
      // Special tool handled it, mark as routed
      await step.run("mark-routed-special", async () => {
        const { ConvexHttpClient } = await import("convex/browser");
        const { api } = await import("../../convex/_generated/api");
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

        // captureId is already the correct type from storeCapture mutation
        await convex.mutation(api.tom.updateCapture, {
          captureId: captureId as never, // Type assertion needed due to dynamic import
          routed: true,
          routedTo: specialIntent.tool,
          classifiedAs: "question",
        });

        console.log(`[TomCapture] Marked ${captureId} as routed to ${specialIntent.tool}`);
      });

      return {
        success: true,
        captureId,
        handledBy: specialIntent.tool,
      };
    }

    // Step 4: Classify input
    const classification = await step.run("classify", async (): Promise<CaptureClassification> => {
      const { generateStructured } = await import("../ai/structured");

      return generateStructured(
        "FAST",
        CaptureClassificationSchema,
        `Classify this message from a team member. Determine if it's a task, note, idea, or question.
Tasks: Action items, to-dos, things to complete
Notes: Information to remember, observations
Ideas: Creative thoughts, suggestions, concepts
Questions: Requests for information, clarifications`,
        content
      );
    });

    // Step 5: Route to appropriate context
    await step.run("route", async () => {
      const { ConvexHttpClient } = await import("convex/browser");
      const { api } = await import("../../convex/_generated/api");
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });

      const typedUserId = userId as "mike" | "james" | "adam" | "annie";

      switch (classification.type) {
        case "task":
          await convex.mutation(api.tom.appendToContext, {
            userId: typedUserId,
            contextType: "backlog",
            content: `- [ ] ${content}`,
          });
          console.log(`[TomCapture] Added task to ${userId} backlog`);
          break;

        case "note":
          await convex.mutation(api.tom.appendToContext, {
            userId: typedUserId,
            contextType: "daily_log",
            content: `[${timestamp}] ${content}`,
          });
          console.log(`[TomCapture] Added note to ${userId} daily log`);
          break;

        case "idea":
          await convex.mutation(api.tom.appendToContext, {
            userId: typedUserId,
            contextType: "backlog",
            content: `💡 ${content}`,
          });
          console.log(`[TomCapture] Added idea to ${userId} backlog`);
          break;

        case "question":
          // Will handle response below
          break;
      }
    });

    // Step 6: Update capture record
    await step.run("update-capture", async () => {
      const { ConvexHttpClient } = await import("convex/browser");
      const { api } = await import("../../convex/_generated/api");
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      // captureId is already the correct type from storeCapture mutation
      await convex.mutation(api.tom.updateCapture, {
        captureId: captureId as never, // Type assertion needed due to dynamic import
        routed: true,
        routedTo: classification.type,
        classifiedAs: classification.type,
      });

      console.log(`[TomCapture] Updated capture ${captureId}: routed to ${classification.type}`);
    });

    // Step 7: Generate response if needed
    let responseMessage: string | null = null;

    if (classification.requiresResponse && source === "whatsapp") {
      responseMessage = await step.run("generate-response", async (): Promise<string> => {
        // Check for greeting first - return onboarding message
        const { getGreetingResponse, buildTomSystemPrompt } = await import("../tom/voice");
        const greetingResponse = getGreetingResponse(userId as TomUserId, content);

        if (greetingResponse) {
          return greetingResponse;
        }

        // Not a greeting - generate contextual response
        const { generateStructured } = await import("../ai/structured");
        const systemPrompt = buildTomSystemPrompt(userId as TomUserId, content);

        const response = await generateStructured(
          "SMART",
          z.object({ message: z.string() }),
          `${systemPrompt}

Keep responses concise (under 500 chars for WhatsApp).
Be helpful but direct.`,
          `Message: ${content}`
        );

        return response.message;
      });

      await step.run("send-response", async () => {
        if (!responseMessage) return;

        const { sendWhatsAppMessage } = await import("../tom/whatsapp");

        try {
          await sendWhatsAppMessage(userId as TomUserId, responseMessage);
          console.log(`[TomCapture] Sent response to ${userId}: ${responseMessage.substring(0, 50)}...`);
        } catch (error) {
          console.error(`Failed to send WhatsApp response to ${userId}:`, error);
        }
      });
    }

    return {
      success: true,
      captureId,
      classification,
      responseGenerated: !!responseMessage,
    };
  }
);
