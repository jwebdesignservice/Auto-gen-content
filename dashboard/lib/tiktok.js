// TikTok Display API helpers (server-side only). Config via env vars:
//   TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REFRESH_TOKEN
// Redirect URI is fixed to the deployed callback.
export const REDIRECT_URI = 'https://dashboard-nine-bice-50.vercel.app/api/tiktok/callback';
export const SCOPES = 'user.info.basic,video.list';

export function authorizeUrl(state = 'fastlaunch') {
  const key = process.env.TIKTOK_CLIENT_KEY || '';
  const p = new URLSearchParams({
    client_key: key,
    scope: SCOPES,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state,
  });
  return `https://www.tiktok.com/v2/auth/authorize/?${p.toString()}`;
}

async function tokenRequest(params) {
  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY || '',
      client_secret: process.env.TIKTOK_CLIENT_SECRET || '',
      ...params,
    }).toString(),
    cache: 'no-store',
  });
  return res.json();
}

export function exchangeCode(code) {
  return tokenRequest({ code, grant_type: 'authorization_code', redirect_uri: REDIRECT_URI });
}

export function refreshAccessToken(refreshToken) {
  return tokenRequest({ grant_type: 'refresh_token', refresh_token: refreshToken });
}

const FIELDS = 'id,title,view_count,like_count,comment_count,share_count,create_time,cover_image_url,share_url';

// One page of the authed user's videos.
export async function listVideos(accessToken, cursor) {
  const body = { max_count: 20 };
  if (cursor) body.cursor = cursor;
  const res = await fetch(`https://open.tiktokapis.com/v2/video/list/?fields=${FIELDS}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  return res.json();
}

// Paginate through ALL of the user's videos (capped for safety).
export async function listAllVideos(accessToken, maxPages = 30) {
  let all = [], cursor, hasMore = true, pages = 0;
  while (hasMore && pages < maxPages) {
    const d = await listVideos(accessToken, cursor);
    all = all.concat(d?.data?.videos || []);
    cursor = d?.data?.cursor;
    hasMore = d?.data?.has_more;
    pages++;
  }
  return all;
}
