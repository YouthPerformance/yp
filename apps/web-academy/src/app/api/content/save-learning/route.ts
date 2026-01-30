// ═══════════════════════════════════════════════════════════
// SAVE LEARNING API
// Stores voice edits for future training data
// THE MOAT: Every edit makes the system smarter
// ═══════════════════════════════════════════════════════════

import { ConvexHttpClient } from "convex/browser";
import { api } from "@yp/alpha/convex/_generated/api";
import { type NextRequest, NextResponse } from "next/server";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

// Initialize Convex client
const convex = CONVEX_URL ? new ConvexHttpClient(CONVEX_URL) : null;

interface SaveLearningRequest {
  expert: "JAMES" | "ADAM";
  contentType: string;
  category: string;
  originalText: string;
  voiceInstruction: string;
  correctedText: string;
  audioStorageId?: string;
  audioDurationMs?: number;
  selectedContext?: string;
  contentId?: string;
  applied: boolean;
}

export async function POST(request: NextRequest) {
  try {
    if (!convex) {
      return NextResponse.json({ error: "Convex not configured" }, { status: 500 });
    }

    const body = (await request.json()) as SaveLearningRequest;

    // Validate required fields
    if (!body.expert || !body.contentType || !body.category || !body.originalText || !body.voiceInstruction || !body.correctedText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save the learning
    const result = await convex.mutation(api.playbook.saveLearning, {
      expert: body.expert,
      contentType: body.contentType,
      category: body.category,
      originalText: body.originalText,
      voiceInstruction: body.voiceInstruction,
      correctedText: body.correctedText,
      audioStorageId: body.audioStorageId as Id<"_storage"> | undefined,
      audioDurationMs: body.audioDurationMs,
      selectedContext: body.selectedContext,
      contentId: body.contentId as Id<"playbook_content"> | undefined,
      applied: body.applied,
    });

    return NextResponse.json({
      success: true,
      learningId: result.learningId,
    });
  } catch (error) {
    console.error("Save learning failed:", error);
    return NextResponse.json({ error: "Failed to save learning" }, { status: 500 });
  }
}
