import { exchangeCode } from '../../../../lib/tiktok';

export const dynamic = 'force-dynamic';

// TikTok redirects here after the user authorises. We exchange the code for
// tokens and show the refresh token once, so it can be stored as an env var
// (TIKTOK_REFRESH_TOKEN). Single-user personal setup.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) return html(`Authorisation failed: ${error} — ${searchParams.get('error_description') || ''}`);
  if (!code) return html('No authorisation code returned. Try the link again.');

  let data;
  try {
    data = await exchangeCode(code);
  } catch (e) {
    return html(`Token exchange error: ${e.message}`);
  }

  if (data.error || !data.refresh_token) {
    return html(`TikTok returned: <pre>${escape(JSON.stringify(data, null, 2))}</pre>`);
  }

  return html(`
    <h1 style="margin:0 0 8px">✅ TikTok connected</h1>
    <p>Copy the refresh token below and send it to Claude in Discord (it'll be stored as a secure env var, then auto-pull is live).</p>
    <p style="font-weight:600;margin:18px 0 6px">open_id</p>
    <pre>${escape(data.open_id || '')}</pre>
    <p style="font-weight:600;margin:18px 0 6px">refresh_token</p>
    <pre>${escape(data.refresh_token)}</pre>
  `);
}

function escape(s) { return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function html(body) {
  return new Response(
    `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:system-ui;max-width:640px;margin:48px auto;padding:0 20px;color:#1B1A18;line-height:1.5"><style>pre{background:#F6EEE3;border:1px solid #e6dccd;border-radius:10px;padding:14px;white-space:pre-wrap;word-break:break-all;font-size:13px}</style>${body}</body>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
