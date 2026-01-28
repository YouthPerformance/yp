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
      // TODO: Use Convex mutation once api.tom types are generated
      // const { ConvexHttpClient } = await import("convex/browser");
      // const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      // const { api } = await import("../../convex/_generated/api");
      // return convex.mutation(api.tom.storeCapture, {...});

      console.log(`[TomCapture] Storing capture for ${userId}: ${content.substring(0, 50)}...`);
      return `capture-${userId}-${Date.now()}`;
    });

    // Step 2: Log inbound message
    await step.run("log-message", async () => {
      // TODO: Use Convex mutation once api.tom types are generated
      console.log(`[TomCapture] Logging inbound message from ${userId}`, { messageId });
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
        // TODO: Use Convex mutation once api.tom types are generated
        console.log(`[TomCapture] Marking ${captureId} as routed to ${specialIntent.tool}`);
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
      // TODO: Use Convex mutation once api.tom types are generated
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });

      switch (classification.type) {
        case "task":
          console.log(`[TomCapture] Adding task to ${userId} backlog: ${content}`);
          break;

        case "note":
          console.log(`[TomCapture] Adding note to ${userId} daily log: [${timestamp}] ${content}`);
          break;

        case "idea":
          console.log(`[TomCapture] Adding idea to ${userId} backlog: 💡 ${content}`);
          break;

        case "question":
          // Will handle response below
          break;
      }
    });

    // Step 6: Update capture record
    await step.run("update-capture", async () => {
      // TODO: Use Convex mutation once api.tom types are generated
      console.log(`[TomCapture] Updating capture ${captureId}: routed to ${classification.type}`);
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
