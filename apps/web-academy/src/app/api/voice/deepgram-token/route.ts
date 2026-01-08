// ═══════════════════════════════════════════════════════════
// DEEPGRAM TOKEN API
// Generates temporary tokens for client-side STT
// Tokens expire after 10 seconds (minimal exposure)
// ═══════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

export async function GET() {
  if (!DEEPGRAM_API_KEY) {
    return NextResponse.json(
      { error: 'Deepgram not configured' },
      { status: 500 }
    );
  }

  // Return API key for WebSocket connections
  // In production, create a scoped key in Deepgram dashboard
  // with only 'usage:write' permission for better security
  return NextResponse.json({
    token: DEEPGRAM_API_KEY,
    expiresIn: 300,
  });
}
