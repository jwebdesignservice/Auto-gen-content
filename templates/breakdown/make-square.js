/**
 * BREAKDOWN TEMPLATE — Square (1080×1080) for IG + LinkedIn. Reusable.
 * Usage:  node templates/breakdown/make-square.js <site-slug> [campaignFolder]
 * See make-tiktok.js for the full spec.
 */
const path = require('path');
const fs = require('fs');
const { registerFonts, createBaseCanvas, saveCanvas, roundRect, loadImage } = require('../../scripts/lib/canvas-helpers');

registerFonts();
const W = 1080, H = 1080;

const slug = process.argv[2];
if (!slug) { console.error('usage: node make-square.js <site-slug> [campaignFolder]'); process.exit(1); }
const campaign = process.argv[3] || `${slug}-breakdown`;
const startNum = parseInt(process.argv[4], 10) || 1;   // cover-first decks pass 2
const totalArg = parseInt(process.argv[5], 10);
const SITE_DIR = path.join(__dirname, '..', '..', 'assets', 'breakdowns', slug);
const OUT_IG = path.join(__dirname, '..', '..', 'campaigns', campaign, 'exports', 'instagram');
const OUT_LI = path.join(__dirname, '..', '..', 'campaigns', campaign, 'exports', 'linkedin');

let SITE_COLOR = '#6E1228';
try {
  const y = fs.readFileSync(path.join(SITE_DIR, 'sections.yaml'), 'utf8');
  const m = y.match(/brand_color:\s*'?(#[0-9A-Fa-f]{3,8})'?/);
  if (m) SITE_COLOR = m[1];
} catch (e) { /* default */ }
const SECTIONS = fs.readdirSync(SITE_DIR).filter((f) => /\.png$/i.test(f)).sort();

function lightBg(ctx) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#FFFCF8'); g.addColorStop(1, '#F4EEE4');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function numberBadge(ctx, n, total, cy = 110) {
  const cx = W / 2, r = 40;
  ctx.save();
  ctx.strokeStyle = SITE_COLOR; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = SITE_COLOR; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'italic 40px "Instrument Serif Italic"';
  ctx.fillText(String(n).padStart(2, '0'), cx, cy + 2);
  ctx.fillStyle = 'rgba(27,26,24,0.45)'; ctx.textBaseline = 'alphabetic';
  ctx.font = '500 15px "JetBrains Mono Medium"';
  ctx.fillText(`/ ${String(total).padStart(2, '0')}`, cx, cy + r + 24);
  ctx.restore();
}
function sectionImage(ctx, img, isFirst) {
  const availTop = 240, availBot = H - 50, maxW = 640, R = 13;
  const maxH = availBot - availTop;
  const scale = Math.min(maxW / img.width, maxH / img.height) * 0.9;
  const w = img.width * scale, h = img.height * scale;
  const x = (W - w) / 2;
  const y = isFirst ? (H - h) / 2 : availTop + (maxH - h) / 2;
  ctx.save(); ctx.shadowColor = 'rgba(27,26,24,0.20)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#000'; roundRect(ctx, x, y, w, h, R); ctx.fill(); ctx.restore();
  ctx.save(); roundRect(ctx, x, y, w, h, R); ctx.clip();
  ctx.drawImage(img, 0, 0, img.width, img.height, x, y, w, h); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(27,26,24,0.12)'; ctx.lineWidth = 1.25; roundRect(ctx, x, y, w, h, R); ctx.stroke(); ctx.restore();
}

async function run() {
  [OUT_IG, OUT_LI].forEach((d) => { fs.mkdirSync(d, { recursive: true }); fs.readdirSync(d).filter((f) => f.endsWith('.png')).forEach((f) => fs.unlinkSync(path.join(d, f))); });
  for (let i = 0; i < SECTIONS.length; i++) {
    const num = startNum + i;
    const total = totalArg || SECTIONS.length;
    const state = createBaseCanvas(W, H, '#FFFCF8'); const { ctx } = state;
    lightBg(ctx); numberBadge(ctx, num, total);
    const img = await loadImage(path.join(SITE_DIR, SECTIONS[i]));
    sectionImage(ctx, img, num === 1);
    const name = `slide-${num}-${SECTIONS[i].replace('.png', '')}.png`;
    saveCanvas(state, path.join(OUT_IG, name)); saveCanvas(state, path.join(OUT_LI, name)); console.log('  saved (IG+LI):', name);
  }
  console.log(`\n[${slug}] square breakdown done (colour ${SITE_COLOR})`);
}
run().catch((e) => { console.error(e); process.exit(1); });
