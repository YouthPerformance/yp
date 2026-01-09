// ═══════════════════════════════════════════════════════════
// CONTENT ITERATION API
// Uses Groq for fast voice-to-edit iteration
// Takes feedback transcript + original content → returns updated version
// ═══════════════════════════════════════════════════════════

import { type ExpertId, expertVoices } from "@yp/alpha/voices";
import { type NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Use Groq for speed, fallback to Claude if needed
const USE_GROQ = true;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalContent, feedbackTranscript, author, contentType } = body as {
      contentId: string;
      originalContent: string;
      feedbackTranscript: string;
      author: ExpertId;
      contentType: "pillar" | "topic" | "qa" | "drill";
    };

    if (!originalContent || !feedbackTranscript) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get expert voice profile
    const expertVoice = expertVoices[author] || expertVoices.YP;

    // Build the iteration prompt
    const systemPrompt = `You are an expert editor helping ${expertVoice.name} revise their content.

VOICE PROFILE:
${expertVoice.systemPromptPrefix}

EDITING TASK:
You will receive:
1. ORIGINAL CONTENT - The current version of the content
2. FEEDBACK - Voice feedback from the expert on what to change

Your job is to apply the feedback while maintaining the expert's voice.

RULES:
- Apply the requested changes precisely
- Maintain the expert's signature style and tone
- Preserve any content structure that isn't mentioned in feedback
- Avoid these words: ${expertVoice.bannedWords.join(", ")}
- Use preferred terms: ${Object.entries(expertVoice.preferredTerms)
      .map(([k, v]) => `"${k}" → "${v}"`)
      .join(", ")}

OUTPUT:
Return ONLY the updated content. No explanations, no preamble, just the revised content.`;

    const userPrompt = `ORIGINAL CONTENT:
---
${originalContent}
---

FEEDBACK TO APPLY:
"${feedbackTranscript}"

Please apply this feedback and return the updated content:`;

    let newContent: string;

    if (USE_GROQ && GROQ_API_KEY) {
      // Use Groq for fast iteration
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      });

      const result = await response.json();
      newContent = result.choices?.[0]?.message?.content || "";
    } else if (ANTHROPIC_API_KEY) {
      // Fallback to Claude
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      const result = await response.json();
      newContent = result.content?.[0]?.text || "";
    } else {
      return NextResponse.json({ error: "No AI provider configured" }, { status: 500 });
    }

    // Detect what changed (simple summary)
    const changes = detectChanges(originalContent, newContent, feedbackTranscript);

    return NextResponse.json({
      newContent,
      changes,
      model: USE_GROQ && GROQ_API_KEY ? "groq/llama-3.3-70b" : "claude-sonnet-4",
    });
  } catch (error) {
    console.error("Content iteration failed:", error);
    return NextResponse.json({ error: "Failed to iterate content" }, { status: 500 });
  }
}

// Simple change detection
function detectChanges(original: string, updated: string, feedback: string): string[] {
  const changes: string[] = [];

  // Word count change
  const originalWords = original.split(/\s+/).length;
  const updatedWords = updated.split(/\s+/).length;
  const wordDiff = updatedWords - originalWords;

  if (Math.abs(wordDiff) > 10) {
    changes.push(
      wordDiff > 0 ? `Added ~${wordDiff} words` : `Removed ~${Math.abs(wordDiff)} words`,
    );
  }

  // Paragraph count change
  const originalParas = original.split(/\n\n+/).length;
  const updatedParas = updated.split(/\n\n+/).length;
  const paraDiff = updatedParas - originalParas;

  if (paraDiff !== 0) {
    changes.push(
      paraDiff > 0
        ? `Added ${paraDiff} paragraph(s)`
        : `Removed ${Math.abs(paraDiff)} paragraph(s)`,
    );
  }

  // Always include feedback summary
  changes.push(`Applied: "${feedback.substring(0, 100)}${feedback.length > 100 ? "..." : ""}"`);

  return changes;
}
