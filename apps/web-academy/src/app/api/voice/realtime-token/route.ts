/**
 * OpenAI Realtime API Ephemeral Token Endpoint
 *
 * Generates short-lived tokens for browser WebRTC connections.
 * The browser NEVER sees the main API key - only ephemeral tokens.
 *
 * @see https://platform.openai.com/docs/guides/realtime
 */

import wolfRealtimeConfig from "@yp/alpha/config/wolf-realtime-prompt";
import { type NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("[realtime-token] OPENAI_API_KEY not configured");
}

/**
 * POST /api/voice/realtime-token
 *
 * Returns an ephemeral token for OpenAI Realtime API WebRTC connection.
 * Token is short-lived (60 seconds) for security.
 */
export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  try {
    // Create ephemeral token via OpenAI API
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: wolfRealtimeConfig.sessionConfig.model,
        voice: wolfRealtimeConfig.sessionConfig.voice,
        instructions: wolfRealtimeConfig.prompt,
        tools: [
          {
            type: "function",
            ...wolfRealtimeConfig.function,
          },
        ],
        tool_choice: "auto",
        temperature: wolfRealtimeConfig.sessionConfig.temperature,
        max_response_output_tokens: wolfRealtimeConfig.sessionConfig.max_response_output_tokens,
        turn_detection: wolfRealtimeConfig.sessionConfig.turn_detection,
        input_audio_transcription: wolfRealtimeConfig.sessionConfig.input_audio_transcription,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[realtime-token] OpenAI API error:", errorText);
      return NextResponse.json(
        { error: "Failed to create session", details: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Return the ephemeral token and session info
    return NextResponse.json({
      client_secret: data.client_secret,
      session_id: data.id,
      expires_at: data.expires_at,
      model: data.model,
      voice: data.voice,
    });
  } catch (error) {
    console.error("[realtime-token] Error creating session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/voice/realtime-token
 *
 * Health check - verify the endpoint is configured.
 */
export async function GET() {
  return NextResponse.json({
    configured: !!OPENAI_API_KEY,
    model: wolfRealtimeConfig.sessionConfig.model,
    voice: wolfRealtimeConfig.sessionConfig.voice,
  });
}
