// ═══════════════════════════════════════════════════════════
// VOICE TTS API
// ElevenLabs Flash v2.5 streaming for ultra-low latency
// Target: <100ms time-to-first-byte
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

// Use global preview API for geo-optimized routing
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

interface SpeakRequest {
  text: string;
  // Optional: override voice settings
  stability?: number;
  similarityBoost?: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: SpeakRequest = await request.json();
    const { text, stability = 0.5, similarityBoost = 0.75 } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Missing text' },
        { status: 400 }
      );
    }

    if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
      return NextResponse.json(
        { error: 'ElevenLabs not configured' },
        { status: 500 }
      );
    }

    // Use streaming endpoint with Flash v2.5 for lowest latency
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_flash_v2_5', // Lowest latency model
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style: 0.3, // Slight style for Wolf character
            use_speaker_boost: true,
          },
          // Optimize for latency
          optimize_streaming_latency: 3, // Max latency optimization
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ElevenLabs] Error:', errorText);
      return NextResponse.json(
        { error: 'TTS generation failed', details: errorText },
        { status: response.status }
      );
    }

    const ttfb = Date.now() - startTime;
    console.log(`[ElevenLabs] TTFB: ${ttfb}ms`);

    // Stream the audio response
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
        'X-TTFB-Ms': ttfb.toString(),
      },
    });

  } catch (error) {
    console.error('[Speak] Error:', error);
    return NextResponse.json(
      { error: 'TTS failed', details: String(error) },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// GET endpoint for checking voice availability
// ─────────────────────────────────────────────────────────────

export async function GET() {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
    return NextResponse.json({
      available: false,
      error: 'ElevenLabs not configured',
    });
  }

  try {
    // Check voice exists
    const response = await fetch(
      `${ELEVENLABS_API_URL}/voices/${ELEVENLABS_VOICE_ID}`,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        available: false,
        error: 'Voice not found',
      });
    }

    const voice = await response.json();

    return NextResponse.json({
      available: true,
      voiceId: ELEVENLABS_VOICE_ID,
      voiceName: voice.name,
      models: ['eleven_flash_v2_5', 'eleven_turbo_v2_5'],
    });
  } catch (error) {
    return NextResponse.json({
      available: false,
      error: String(error),
    });
  }
}
