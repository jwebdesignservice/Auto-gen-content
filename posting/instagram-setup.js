/**
 * instagram-setup.js — one-time helper to:
 *  1. Exchange short-lived Instagram access token for a 60-day long-lived token
 *  2. Discover the user's Instagram Business Account ID via their Facebook Pages
 *  3. Save both to .env
 *
 * Usage: node posting/instagram-setup.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');

const ENV_PATH = path.join(__dirname, '..', '.env');
const APP_ID     = process.env.META_APP_ID;
const APP_SECRET = process.env.META_APP_SECRET;
const SHORT      = process.env.INSTAGRAM_ACCESS_TOKEN_SHORT;

if (!APP_ID || !APP_SECRET || !SHORT) {
  console.error('Missing META_APP_ID, META_APP_SECRET or INSTAGRAM_ACCESS_TOKEN_SHORT in .env');
  process.exit(1);
}

function setEnvVar(key, value) {
  let env = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
  const re = new RegExp(`^${key}=.*$`, 'gm');
  env = re.test(env)
    ? env.replace(re, `${key}=${value}`)
    : env.trim() + `\n${key}=${value}\n`;
  fs.writeFileSync(ENV_PATH, env);
}

async function jget(url) {
  const r = await fetch(url);
  const t = await r.text();
  if (!r.ok) throw new Error(`HTTP ${r.status} on ${url}\n${t}`);
  return JSON.parse(t);
}

(async () => {
  console.log('\n=== Fast Launch · Instagram setup ===\n');

  // 1. Exchange short-lived for long-lived (60-day) token
  console.log('→ Exchanging short-lived token for long-lived (60 days)...');
  const exchangeUrl = `https://graph.facebook.com/v25.0/oauth/access_token?` +
    `grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}` +
    `&fb_exchange_token=${SHORT}`;
  const ex = await jget(exchangeUrl);
  const longToken = ex.access_token;
  const expiresIn = ex.expires_in || 5184000; // typically 60 days = 5184000s
  console.log(`  ✓ Long-lived token obtained (valid ~${Math.round(expiresIn / 86400)} days)`);

  // 2. Get the user's Facebook Pages
  console.log('\n→ Listing your Facebook Pages...');
  const pagesResp = await jget(`https://graph.facebook.com/v25.0/me/accounts?access_token=${longToken}`);
  if (!pagesResp.data || pagesResp.data.length === 0) {
    throw new Error('No Facebook Pages found on this account. Make sure your IG is linked to a FB Page.');
  }
  console.log(`  Found ${pagesResp.data.length} Page(s):`);
  pagesResp.data.forEach((p, i) => console.log(`    ${i + 1}. ${p.name} (id: ${p.id})`));

  // 3. For each Page, fetch the linked IG Business Account
  console.log('\n→ Looking up Instagram Business Account on each Page...');
  let igAccountId = null;
  let igUsername  = null;
  for (const page of pagesResp.data) {
    const pageInfo = await jget(
      `https://graph.facebook.com/v25.0/${page.id}?fields=instagram_business_account{id,username}&access_token=${longToken}`
    );
    if (pageInfo.instagram_business_account) {
      igAccountId = pageInfo.instagram_business_account.id;
      igUsername  = pageInfo.instagram_business_account.username;
      console.log(`  ✓ Found IG account on Page "${page.name}": @${igUsername} (id: ${igAccountId})`);
      break;
    } else {
      console.log(`  - Page "${page.name}" has no linked IG Business account`);
    }
  }
  if (!igAccountId) {
    throw new Error('No Instagram Business Account found on any of your Pages. Make sure your IG is set to Business/Creator and linked to one of these Pages.');
  }

  // 4. Save to .env
  console.log('\n→ Saving to .env...');
  setEnvVar('INSTAGRAM_ACCESS_TOKEN', longToken);
  setEnvVar('INSTAGRAM_BUSINESS_ACCOUNT_ID', igAccountId);
  setEnvVar('INSTAGRAM_USERNAME', igUsername);

  console.log('\n✓ DONE. Saved:');
  console.log(`  INSTAGRAM_ACCESS_TOKEN=${longToken.substring(0, 20)}... (60 days)`);
  console.log(`  INSTAGRAM_BUSINESS_ACCOUNT_ID=${igAccountId}`);
  console.log(`  INSTAGRAM_USERNAME=${igUsername}`);
  console.log('\nNext: run `node posting/post-instagram.js <campaign>` to post.\n');
})().catch(e => {
  console.error('\n✗ FAILED:', e.message);
  process.exit(1);
});
