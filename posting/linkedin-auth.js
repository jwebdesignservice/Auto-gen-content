/**
 * linkedin-auth.js — one-time OAuth helper
 *
 * Usage:  node posting/linkedin-auth.js
 *
 * What it does:
 *  1. Spins up a tiny localhost server on port 3000
 *  2. Opens LinkedIn's authorisation page in your browser
 *  3. You log in + click "Allow"
 *  4. LinkedIn redirects back with an auth code
 *  5. Script exchanges the code for an access token
 *  6. Fetches your member URN
 *  7. Saves both to .env
 *  8. Done — close the browser tab
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const { exec } = require('child_process');

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';
const SCOPE = 'openid profile w_member_social';
const ENV_PATH = path.join(__dirname, '..', '.env');

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('✗ Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET in .env');
  process.exit(1);
}

const state = Math.random().toString(36).substring(2, 18);

const authUrl = 'https://www.linkedin.com/oauth/v2/authorization?' + querystring.stringify({
  response_type: 'code',
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  state,
  scope: SCOPE
});

function postForm(url, data) {
  return new Promise((resolve, reject) => {
    const body = querystring.stringify(data);
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => res.statusCode === 200
        ? resolve(chunks)
        : reject(new Error(`HTTP ${res.statusCode}: ${chunks}`)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function getJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get({
      hostname: u.hostname,
      path: u.pathname,
      headers
    }, (res) => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => res.statusCode === 200
        ? resolve(chunks)
        : reject(new Error(`HTTP ${res.statusCode}: ${chunks}`)));
    }).on('error', reject);
  });
}

function setEnvVar(key, value) {
  let env = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
  const re = new RegExp(`^${key}=.*$`, 'gm');
  env = re.test(env)
    ? env.replace(re, `${key}=${value}`)
    : env.trim() + `\n${key}=${value}\n`;
  fs.writeFileSync(ENV_PATH, env);
}

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/callback')) {
    res.writeHead(404); res.end('Not found'); return;
  }

  const url = new URL(req.url, 'http://localhost:3000');
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(`<h1 style="color:red;font-family:sans-serif;padding:40px">OAuth error: ${error}</h1><p>${url.searchParams.get('error_description') || ''}</p>`);
    console.error('\n✗ LinkedIn returned error:', error, url.searchParams.get('error_description'));
    setTimeout(() => process.exit(1), 500);
    return;
  }

  if (!code || returnedState !== state) {
    res.writeHead(400); res.end('Missing code or state mismatch'); return;
  }

  try {
    console.log('→ Exchanging auth code for access token...');
    const tokenResp = await postForm('https://www.linkedin.com/oauth/v2/accessToken', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    });
    const { access_token, expires_in } = JSON.parse(tokenResp);

    console.log('→ Fetching your LinkedIn member URN...');
    const userResp = await getJson('https://api.linkedin.com/v2/userinfo', {
      Authorization: `Bearer ${access_token}`
    });
    const user = JSON.parse(userResp);
    const memberUrn = `urn:li:person:${user.sub}`;

    setEnvVar('LINKEDIN_ACCESS_TOKEN', access_token);
    setEnvVar('LINKEDIN_MEMBER_URN', memberUrn);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!doctype html><html><body style="font-family:system-ui;background:#0a0807;color:#fff;padding:60px;text-align:center">
      <h1 style="color:#F26B1A;font-size:48px">LinkedIn connected ✓</h1>
      <p style="color:#aaa;margin-top:20px">Token saved to .env. You can close this tab.</p>
      <p style="color:#666;font-family:monospace;font-size:13px;margin-top:40px">Member URN: ${memberUrn}</p>
      <p style="color:#666;font-family:monospace;font-size:13px">Token valid for: ${Math.round(expires_in / 86400)} days</p>
    </body></html>`);

    console.log('\n✓ SUCCESS — saved to .env:');
    console.log(`  LINKEDIN_ACCESS_TOKEN=${access_token.substring(0, 20)}...`);
    console.log(`  LINKEDIN_MEMBER_URN=${memberUrn}`);
    console.log(`  Token valid: ~${Math.round(expires_in / 86400)} days`);
    console.log('\nYou can close the browser tab now. LinkedIn is wired.\n');

    setTimeout(() => { server.close(); process.exit(0); }, 500);
  } catch (e) {
    console.error('\n✗ Token exchange failed:', e.message);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(`<h1 style="color:red">Failed:</h1><pre>${e.message}</pre>`);
  }
});

server.listen(3000, () => {
  console.log('\n=== Fast Launch · LinkedIn OAuth Helper ===\n');
  console.log('Server listening on http://localhost:3000');
  console.log('Opening browser to LinkedIn authorisation...\n');
  console.log('If your browser doesn\'t open, paste this URL manually:');
  console.log('\n' + authUrl + '\n');

  exec(`start "" "${authUrl}"`, () => {});
});
