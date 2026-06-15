/**
 * Generate lightweight dashboard thumbnails from the real mockups so the deploy
 * stays small. Run from the project root: `node dashboard/scripts/gen-thumbs.js`
 * (uses the canvas module already installed at the project root).
 */
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const ROOT = path.join(__dirname, '..', '..');
const PW = path.join(ROOT, 'assets', 'past-work');
const OUT_MOCK = path.join(__dirname, '..', 'public', 'mockups');
const OUT_THUMB = path.join(__dirname, '..', 'public', 'thumbnails');
fs.mkdirSync(OUT_MOCK, { recursive: true });
fs.mkdirSync(OUT_THUMB, { recursive: true });

// Top-cropped "browser preview" thumbnail (shows the top of the site).
async function browserThumb(srcPath, outPath, W = 640, H = 460) {
  const img = await loadImage(srcPath);
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  // cover by width, anchored to the top
  const scale = W / img.width;
  const drawH = img.height * scale;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, W, Math.min(drawH, H * 4));
  fs.writeFileSync(outPath, canvas.toBuffer('image/jpeg', { quality: 0.82 }));
}

// Full-aspect thumbnail (used for the portrait slide thumbnail).
async function fitThumb(srcPath, outPath, W = 480) {
  const img = await loadImage(srcPath);
  const H = Math.round(img.height * (W / img.width));
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, W, H);
  fs.writeFileSync(outPath, canvas.toBuffer('image/jpeg', { quality: 0.82 }));
}

(async () => {
  const slugs = fs.readdirSync(PW).filter(s => {
    try { return fs.statSync(path.join(PW, s)).isDirectory(); } catch { return false; }
  });
  for (const slug of slugs) {
    const dir = path.join(PW, slug);
    const files = fs.readdirSync(dir);
    const src = files.find(f => f === 'full.png')
      || files.find(f => /\.(png|webp|jpg)$/i.test(f) && f.includes('hero'))
      || files.find(f => /\.(png|webp|jpg)$/i.test(f));
    if (!src) continue;
    await browserThumb(path.join(dir, src), path.join(OUT_MOCK, `${slug}.jpg`));
    console.log('mockup thumb:', slug);
  }

  // Latest video hook thumbnail (portrait) from the six-more-sites deck
  const hook = path.join(ROOT, 'campaigns', '2026-06-11-six-more-sites', 'exports', 'instagram', 'slide-1-hook.png');
  if (fs.existsSync(hook)) {
    await fitThumb(hook, path.join(OUT_THUMB, 'six-more-sites-hook.jpg'), 560);
    console.log('hook thumb done');
  }
  console.log('Done.');
})().catch(e => { console.error(e); process.exit(1); });
