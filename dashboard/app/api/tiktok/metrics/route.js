import { NextResponse } from 'next/server';
import { refreshAccessToken, listAllVideos } from '../../../../lib/tiktok';

export const dynamic = 'force-dynamic';

// Returns the authed account's videos with live stats. The dashboard fetches
// this client-side and merges by matching (date/caption) to campaigns.
export async function GET() {
  const refresh = process.env.TIKTOK_REFRESH_TOKEN;
  if (!refresh) {
    return NextResponse.json({ configured: false, reason: 'Not connected yet (no refresh token).' });
  }
  try {
    const tok = await refreshAccessToken(refresh);
    if (!tok.access_token) {
      return NextResponse.json({ configured: true, ok: false, detail: tok }, { status: 502 });
    }
    const vids = await listAllVideos(tok.access_token);
    const videos = (vids || []).map((v) => ({
      id: v.id,
      title: v.title,
      createTime: v.create_time,
      plays: v.view_count,
      likes: v.like_count,
      comments: v.comment_count,
      shares: v.share_count,
      cover: v.cover_image_url,
      link: v.share_url,
    }));
    return NextResponse.json({ configured: true, ok: true, count: videos.length, videos });
  } catch (e) {
    return NextResponse.json({ configured: true, ok: false, error: e.message }, { status: 500 });
  }
}
