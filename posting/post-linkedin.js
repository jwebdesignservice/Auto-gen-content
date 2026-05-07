/**
 * post-linkedin.js — push a campaign carousel to LinkedIn
 *
 * Usage:
 *   node posting/post-linkedin.js <campaign-slug>
 *   e.g.: node posting/post-linkedin.js aramas
 *
 * Reads:
 *   campaigns/<slug>/exports/linkedin/*.png   ← all carousel images, sorted by filename
 *   campaigns/<slug>/captions/linkedin.txt    ← the post caption
 *
 * Posts to your LinkedIn personal feed using the access token in .env
 *
 * Optional flag:
 *   --dry-run   Don't actually post — just print what would happen
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
  console.error('Usage: node posting/post-linkedin.js <campaign-slug> [--dry-run]');
  process.exit(1);
}

// ── Config ───────────────────────────────────────────────────────────────────
const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const MEMBER_URN   = process.env.LINKEDIN_MEMBER_URN;

if (!ACCESS_TOKEN || !MEMBER_URN) {
  console.error('✗ Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_MEMBER_URN in .env');
  console.error('  Run: node posting/linkedin-auth.js');
  process.exit(1);
}

// ── Paths ────────────────────────────────────────────────────────────────────
const imagesDir   = path.join(ROOT, 'campaigns', slug, 'exports', 'linkedin');
const captionPath = path.join(ROOT, 'campaigns', slug, 'captions', 'linkedin.txt');

if (!fs.existsSync(imagesDir)) {
  console.error(`✗ No LinkedIn exports folder: ${imagesDir}`);
  process.exit(1);
}
if (!fs.existsSync(captionPath)) {
  console.error(`✗ No caption file: ${captionPath}`);
  process.exit(1);
}

const images = fs.readdirSync(imagesDir)
  .filter(f => /\.png$/i.test(f))
  .sort()
  .map(f => path.join(imagesDir, f));

if (images.length === 0) {
  console.error(`✗ No PNG files in ${imagesDir}`);
  process.exit(1);
}
if (images.length > 20) {
  console.error(`✗ LinkedIn allows max 20 images per post. Found ${images.length}.`);
  process.exit(1);
}

const caption = fs.readFileSync(captionPath, 'utf8').trim();

// ── Pretty preview ───────────────────────────────────────────────────────────
console.log('\n=== LinkedIn Carousel Post ===');
console.log(`Campaign: ${slug}`);
console.log(`Author:   ${MEMBER_URN}`);
console.log(`Images:   ${images.length}`);
images.forEach((p, i) => console.log(`          ${String(i + 1).padStart(2, ' ')}. ${path.basename(p)}`));
console.log('Caption:');
console.log(caption.split('\n').map(l => '  > ' + l).join('\n'));
console.log('');

if (dryRun) {
  console.log('— Dry run mode. No post created. —\n');
  process.exit(0);
}

// ── LinkedIn API helpers ─────────────────────────────────────────────────────
async function api(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'X-Restli-Protocol-Version': '2.0.0',
      ...(opts.headers || {})
    }
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}\n${text}`);
  return text ? JSON.parse(text) : {};
}

async function registerImageUpload() {
  return api('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: MEMBER_URN,
        serviceRelationships: [{
          relationshipType: 'OWNER',
          identifier: 'urn:li:userGeneratedContent'
        }]
      }
    })
  });
}

async function uploadBinary(uploadUrl, filePath) {
  const buffer = fs.readFileSync(filePath);
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'image/png'
    },
    body: buffer
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status}) for ${filePath}`);
}

async function createCarouselPost(assetUrns) {
  return api('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      author: MEMBER_URN,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: caption },
          shareMediaCategory: 'IMAGE',
          media: assetUrns.map(asset => ({
            status: 'READY',
            media: asset,
            title:       { text: '' },
            description: { text: '' }
          }))
        }
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
    })
  });
}

// ── Run ──────────────────────────────────────────────────────────────────────
(async () => {
  try {
    console.log('→ Registering image uploads...');
    const assetUrns = [];
    for (let i = 0; i < images.length; i++) {
      const reg = await registerImageUpload();
      const uploadUrl = reg.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = reg.value.asset;
      console.log(`  [${i + 1}/${images.length}] uploading ${path.basename(images[i])}...`);
      await uploadBinary(uploadUrl, images[i]);
      assetUrns.push(asset);
    }

    console.log('\n→ Creating carousel post...');
    const post = await createCarouselPost(assetUrns);
    const postUrn = post.id || JSON.stringify(post);

    console.log('\n✓ Posted to LinkedIn');
    console.log(`  Post URN: ${postUrn}`);
    const postId = postUrn.split(':').pop();
    console.log(`  View: https://www.linkedin.com/feed/update/${postUrn}/`);
    console.log('');
  } catch (e) {
    console.error('\n✗ FAILED:', e.message);
    process.exit(1);
  }
})();
