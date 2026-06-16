import { NextResponse } from 'next/server';
import { authorizeUrl } from '../../../../lib/tiktok';

export const dynamic = 'force-dynamic';

// Visit /api/tiktok/auth to start the one-time TikTok authorisation.
export function GET() {
  if (!process.env.TIKTOK_CLIENT_KEY) {
    return NextResponse.json({ error: 'TIKTOK_CLIENT_KEY not set yet — add it once the app is created.' }, { status: 503 });
  }
  return NextResponse.redirect(authorizeUrl());
}
