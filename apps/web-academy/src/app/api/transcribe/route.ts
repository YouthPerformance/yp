// ═══════════════════════════════════════════════════════════
// TRANSCRIBE API
// Speech-to-text using Deepgram or Groq Whisper
// Returns transcript from audio blob
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get("audio") as Blob | null;

    if (!audioBlob) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert blob to buffer
    const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());

    let transcript: string;

    // Try Deepgram first (better quality for voice)
    if (DEEPGRAM_API_KEY) {
      const response = await fetch("https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true", {
        method: "POST",
        headers: {
          "Authorization": `Token ${DEEPGRAM_API_KEY}`,
          "Content-Type": audioBlob.type || "audio/webm",
        },
        body: audioBuffer,
      });

      if (!response.ok) {
        throw new Error(`Deepgram error: ${response.statusText}`);
      }

      const result = await response.json();
      transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
    }
    // Fallback to Groq Whisper
    else if (GROQ_API_KEY) {
      const groqFormData = new FormData();
      groqFormData.append("file", new Blob([audioBuffer], { type: audioBlob.type || "audio/webm" }), "audio.webm");
      groqFormData.append("model", "whisper-large-v3");
      groqFormData.append("response_format", "json");

      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: groqFormData,
      });

      if (!response.ok) {
        throw new Error(`Groq Whisper error: ${response.statusText}`);
      }

      const result = await response.json();
      transcript = result.text || "";
    }
    // No provider available
    else {
      return NextResponse.json(
        { error: "No transcription provider configured. Set DEEPGRAM_API_KEY or GROQ_API_KEY." },
        { status: 500 }
      );
    }

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed", details: String(error) },
      { status: 500 }
    );
  }
}
