/**
 * post-instagram.js — push a campaign carousel to Instagram
 *
 * Usage:
 *   node posting/post-instagram.js <campaign-slug>
 *   e.g.: node posting/post-instagram.js landing-page-essentials
 *
 * Reads:
 *   campaigns/<slug>/exports/instagram/*.png   ← carousel images, sorted by filename
 *   campaigns/<slug>/captions/instagram.txt    ← caption (falls back to linkedin.txt)
 *
 * Posts to your Instagram Business account using the access token in .env
 * Image hosting: catbox.moe (free, public HTTPS URLs Instagram can fetch)
 *
 * Optional flag:
 *   --dry-run   Preview only — uploads images to catbox + prints caption, no IG post
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ── Args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const slug = args.find(a => !a.startsWith('--'));

if (!slug) {
  console.error('Usage: node posting/post-instagram.js <campaign-slug> [--dry-run]');
  process.exit(1);
}

// ── Config ───────────────────────────────────────────────────────────────────
const TOKEN     = process.env.INSTAGRAM_ACCESS_TOKEN;
const IG_ID     = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const IG_USER   = process.env.INSTAGRAM_USERNAME || 'fastlaunchmvp';
const API_BASE  = 'https://graph.facebook.com/v25.0';

if (!TOKEN || !IG_ID) {
  console.error('✗ Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_BUSINESS_ACCOUNT_ID in .env');
  console.error('  Run: node posting/instagram-setup.js');
  process.exit(1);
}

// ── Paths ────────────────────────────────────────────────────────────────────
const imagesDir   = path.join(ROOT, 'campaigns', slug, 'exports', 'instagram');
const captionPath = path.join(ROOT, 'campaigns', slug, 'captions', 'instagram.txt');
const captionFallback = path.join(ROOT, 'campaigns', slug, 'captions', 'linkedin.txt');

if (!fs.existsSync(imagesDir)) {
  console.error(`✗ No Instagram exports folder: ${imagesDir}`);
  process.exit(1);
}

let captionFile = captionPath;
if (!fs.existsSync(captionFile)) {
  if (fs.existsSync(captionFallback)) {
    captionFile = captionFallback;
    console.log(`  (no instagram.txt, using linkedin.txt as fallback)`);
  } else {
    console.error(`✗ No caption file: ${captionPath} or ${captionFallback}`);
    process.exit(1);
  }
}

const images = fs.readdirSync(imagesDir)
  .filter(f => /\.png$/i.test(f))
  .sort()
  .map(f => path.join(imagesDir, f));

if (images.length === 0) {
  console.error(`✗ No PNG files in ${imagesDir}`);
  process.exit(1);
}
if (images.length < 2 || images.length > 10) {
  console.error(`✗ Instagram carousels need 2–10 images. Found ${images.length}.`);
  process.exit(1);
}

const caption = fs.readFileSync(captionFile, 'utf8').trim();

// ── Pretty preview ───────────────────────────────────────────────────────────
console.log('\n=== Instagram Carousel Post ===');
console.log(`Campaign: ${slug}`);
console.log(`IG account: @${IG_USER} (id: ${IG_ID})`);
console.log(`Images:   ${images.length}`);
images.forEach((p, i) => console.log(`          ${String(i + 1).padStart(2, ' ')}. ${path.basename(p)}`));
console.log('Caption:');
console.log(caption.split('\n').map(l => '  > ' + l).join('\n'));
console.log('');

// ── Helpers ──────────────────────────────────────────────────────────────────
async function uploadToCatbox(filePath) {
  // catbox.moe accepts multipart form-data uploads, returns plain-text URL
  const FormDataLib = require('node:stream').Readable; // we'll use FormData polyfill via undici
  const buf = fs.readFileSync(filePath);
  const filename = path.basename(filePath);

  // Build multipart body manually (Node's fetch + FormData works in Node 18+)
  const fd = new FormData();
  fd.append('reqtype', 'fileupload');
  fd.append('fileToUpload', new Blob([buf], { type: 'image/png' }), filename);

  const r = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: fd });
  if (!r.ok) throw new Error(`catbox upload failed (${r.status}) for ${filename}`);
  const url = (await r.text()).trim();
  if (!url.startsWith('https://')) throw new Error(`Unexpected catbox response: ${url}`);
  return url;
}

async function igApi(endpoint, params = {}, method = 'POST') {
  const url = new URL(API_BASE + endpoint);
  url.searchParams.set('access_token', TOKEN);
  if (method === 'GET') {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const r = await fetch(url);
    const t = await r.text();
    if (!r.ok) throw new Error(`IG API ${endpoint} (${r.status}): ${t}`);
    return JSON.parse(t);
  } else {
    const body = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => body.set(k, v));
    const r = await fetch(url, { method: 'POST', body });
    const t = await r.text();
    if (!r.ok) throw new Error(`IG API ${endpoint} (${r.status}): ${t}`);
    return JSON.parse(t);
  }
}

async function waitForContainer(containerId, maxWaitSec = 60) {
  const start = Date.now();
  while ((Date.now() - start) / 1000 < maxWaitSec) {
    const status = await igApi(`/${containerId}`, { fields: 'status_code,status' }, 'GET');
    if (status.status_code === 'FINISHED') return true;
    if (status.status_code === 'ERROR' || status.status_code === 'EXPIRED') {
      throw new Error(`Container ${containerId} failed: ${status.status_code} — ${status.status || ''}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error(`Container ${containerId} did not finish in ${maxWaitSec}s`);
}

// ── Run ──────────────────────────────────────────────────────────────────────
(async () => {
  try {
    console.log('→ Uploading images to catbox.moe (public hosting for Instagram fetch)...');
    const imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      process.stdout.write(`  [${i + 1}/${images.length}] uploading ${path.basename(images[i])}... `);
      const url = await uploadToCatbox(images[i]);
      console.log(url);
      imageUrls.push(url);
    }

    if (dryRun) {
      console.log('\n— Dry run mode. No Instagram post created. —\n');
      console.log('Image URLs ready for posting:');
      imageUrls.forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
      console.log('');
      return;
    }

    // Step 1: Create a media container for each image (is_carousel_item=true)
    console.log('\n→ Creating carousel item containers...');
    const childIds = [];
    for (let i = 0; i < imageUrls.length; i++) {
      const r = await igApi(`/${IG_ID}/media`, {
        image_url: imageUrls[i],
        is_carousel_item: 'true',
      });
      console.log(`  [${i + 1}/${imageUrls.length}] container id: ${r.id}`);
      childIds.push(r.id);
    }

    // Step 2: Create parent carousel container
    console.log('\n→ Creating parent carousel container...');
    const parent = await igApi(`/${IG_ID}/media`, {
      media_type: 'CAROUSEL',
      children: childIds.join(','),
      caption,
    });
    console.log(`  parent id: ${parent.id}`);

    // Step 3: Wait for the parent container to finish processing
    console.log('\n→ Waiting for Instagram to process the carousel...');
    await waitForContainer(parent.id);
    console.log('  ✓ container ready');

    // Step 4: Publish
    console.log('\n→ Publishing carousel to Instagram...');
    const published = await igApi(`/${IG_ID}/media_publish`, {
      creation_id: parent.id,
    });

    console.log('\n✓ Posted to Instagram');
    console.log(`  Post ID: ${published.id}`);
    console.log(`  View: https://www.instagram.com/${IG_USER}/`);
    console.log('');
  } catch (e) {
    console.error('\n✗ FAILED:', e.message);
    process.exit(1);
  }
})();
