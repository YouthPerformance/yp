// ═══════════════════════════════════════════════════════════
// VOICE EDIT API - THE LEARNING MOAT
// Uses Groq for fast voice-to-edit with few-shot learning
// Every edit becomes training data for future self-editing
// ═══════════════════════════════════════════════════════════

import { ConvexHttpClient } from "convex/browser";
import { api } from "@yp/alpha/convex/_generated/api";
import { type ExpertId, expertVoices } from "@yp/alpha/voices";
import { type NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

// Initialize Convex client for fetching similar learnings
const convex = CONVEX_URL ? new ConvexHttpClient(CONVEX_URL) : null;

// Groq model for instant feedback (<200ms target)
const GROQ_MODEL = "llama-3.3-70b-versatile";

interface VoiceEditRequest {
  // Content context
  contentId?: string;
  contentType: "pillar" | "topic" | "qa" | "drill";
  category: string;
  author: ExpertId;

  // The edit
  selectedText: string;
  voiceTranscript: string;

  // Optional context around selection
  surroundingContext?: string;

  // Audio for storage (optional)
  audioBase64?: string;
  audioDurationMs?: number;
}

interface FewShotExample {
  original: string;
  instruction: string;
  corrected: string;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as VoiceEditRequest;
    const {
      contentType,
      category,
      author,
      selectedText,
      voiceTranscript,
      surroundingContext,
    } = body;

    if (!selectedText || !voiceTranscript) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Map author to expert type for learning queries
    const expert = mapAuthorToExpert(author);

    // Fetch similar past edits for few-shot learning
    let fewShotExamples: FewShotExample[] = [];
    if (convex && expert) {
      try {
        const learnings = await convex.query(api.playbook.getSimilarLearnings, {
          expert,
          category,
          contentType,
          limit: 5,
        });

        fewShotExamples = learnings.map((l: { originalText: string; voiceInstruction: string; correctedText: string }) => ({
          original: l.originalText,
          instruction: l.voiceInstruction,
          corrected: l.correctedText,
        }));
      } catch (err) {
        console.warn("Failed to fetch similar learnings:", err);
        // Continue without few-shot examples
      }
    }

    // Get expert voice profile
    const expertVoice = expertVoices[author] || expertVoices.YP;

    // Build the prompt with few-shot examples
    const systemPrompt = buildSystemPrompt(expertVoice, fewShotExamples);
    const userPrompt = buildUserPrompt(selectedText, voiceTranscript, surroundingContext);

    // Call Groq for fast editing
    let editedText: string;
    let model: string;

    if (GROQ_API_KEY) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2, // Low temperature for consistent edits
          max_tokens: 2000,
        }),
      });

      const result = await response.json();
      editedText = result.choices?.[0]?.message?.content || "";
      model = `groq/${GROQ_MODEL}`;
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
          model: "claude-haiku-4-5-20251015",
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      const result = await response.json();
      editedText = result.content?.[0]?.text || "";
      model = "claude-haiku-4-5";
    } else {
      return NextResponse.json({ error: "No AI provider configured" }, { status: 500 });
    }

    // Clean up the response (remove any markdown code blocks if present)
    editedText = cleanEditedText(editedText);

    // Compute diff operations
    const diffOps = computeDiff(selectedText, editedText);

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      editedText,
      originalText: selectedText,
      diffOps,
      model,
      latencyMs,
      fewShotCount: fewShotExamples.length,
    });
  } catch (error) {
    console.error("Voice edit failed:", error);
    return NextResponse.json({ error: "Failed to process voice edit" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function mapAuthorToExpert(author: ExpertId): "JAMES" | "ADAM" | null {
  if (author === "JAMES") return "JAMES";
  if (author === "ADAM") return "ADAM";
  return null;
}

function buildSystemPrompt(
  expertVoice: (typeof expertVoices)[ExpertId],
  fewShotExamples: FewShotExample[]
): string {
  let prompt = `You are an expert editor applying voice feedback to content.

VOICE PROFILE:
${expertVoice.systemPromptPrefix}

YOUR TASK:
Apply the voice instruction to ONLY the selected text.
Return ONLY the edited text - no explanations, no preamble.

RULES:
- Apply changes precisely as requested
- Maintain the expert's voice and tone
- Avoid: ${expertVoice.bannedWords.join(", ")}
- Use preferred terms: ${Object.entries(expertVoice.preferredTerms)
    .map(([k, v]) => `"${k}" → "${v}"`)
    .join(", ")}
- Keep formatting (markdown, line breaks) intact unless asked to change
`;

  // Add few-shot examples if available
  if (fewShotExamples.length > 0) {
    prompt += `\nPREVIOUS EDITS BY THIS EXPERT (learn from these patterns):\n`;

    for (let i = 0; i < fewShotExamples.length; i++) {
      const ex = fewShotExamples[i];
      prompt += `
EXAMPLE ${i + 1}:
Original: "${truncate(ex.original, 200)}"
Instruction: "${truncate(ex.instruction, 100)}"
Result: "${truncate(ex.corrected, 200)}"
`;
    }
  }

  return prompt;
}

function buildUserPrompt(
  selectedText: string,
  voiceTranscript: string,
  surroundingContext?: string
): string {
  let prompt = "";

  if (surroundingContext) {
    prompt += `CONTEXT (for reference only, do not edit):\n...\n${surroundingContext}\n...\n\n`;
  }

  prompt += `SELECTED TEXT TO EDIT:
---
${selectedText}
---

VOICE INSTRUCTION:
"${voiceTranscript}"

Apply this instruction and return ONLY the edited text:`;

  return prompt;
}

function cleanEditedText(text: string): string {
  // Remove markdown code blocks if the AI wrapped the response
  let cleaned = text.trim();

  // Remove ```markdown ... ``` wrapping
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    if (lines[0].startsWith("```")) {
      lines.shift(); // Remove opening
      if (lines[lines.length - 1] === "```") {
        lines.pop(); // Remove closing
      }
      cleaned = lines.join("\n");
    }
  }

  return cleaned.trim();
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

// Simple diff computation
interface DiffOp {
  type: "keep" | "delete" | "insert";
  text: string;
}

function computeDiff(original: string, edited: string): DiffOp[] {
  // Simple word-based diff
  const originalWords = original.split(/\s+/);
  const editedWords = edited.split(/\s+/);

  const ops: DiffOp[] = [];

  // Use LCS-like approach for simple cases
  let i = 0;
  let j = 0;

  while (i < originalWords.length || j < editedWords.length) {
    if (i >= originalWords.length) {
      // Rest is insertions
      ops.push({ type: "insert", text: editedWords.slice(j).join(" ") });
      break;
    }

    if (j >= editedWords.length) {
      // Rest is deletions
      ops.push({ type: "delete", text: originalWords.slice(i).join(" ") });
      break;
    }

    if (originalWords[i] === editedWords[j]) {
      // Match
      if (ops.length > 0 && ops[ops.length - 1].type === "keep") {
        ops[ops.length - 1].text += " " + originalWords[i];
      } else {
        ops.push({ type: "keep", text: originalWords[i] });
      }
      i++;
      j++;
    } else {
      // Find if the original word appears later in edited (deletion)
      // Or if the edited word appears later in original (insertion)
      const foundInEdited = editedWords.slice(j + 1).indexOf(originalWords[i]);
      const foundInOriginal = originalWords.slice(i + 1).indexOf(editedWords[j]);

      if (foundInEdited !== -1 && (foundInOriginal === -1 || foundInEdited <= foundInOriginal)) {
        // Insert the edited words until we find the original
        ops.push({ type: "insert", text: editedWords.slice(j, j + foundInEdited + 1).join(" ") });
        j += foundInEdited + 1;
      } else if (foundInOriginal !== -1) {
        // Delete the original words until we find the edited
        ops.push({ type: "delete", text: originalWords.slice(i, i + foundInOriginal + 1).join(" ") });
        i += foundInOriginal + 1;
      } else {
        // Simple replacement: delete original, insert edited
        ops.push({ type: "delete", text: originalWords[i] });
        ops.push({ type: "insert", text: editedWords[j] });
        i++;
        j++;
      }
    }
  }

  return ops;
}
