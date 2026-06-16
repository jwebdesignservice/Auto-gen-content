/**
 * BREAKDOWN TEMPLATE — TikTok (1080×1920). Reusable for any single-site breakdown.
 *
 * Usage:  node templates/breakdown/make-tiktok.js <site-slug> [campaignFolder]
 *   <site-slug>      folder under assets/breakdowns/ with the numbered section PNGs
 *                    + a sections.yaml (brand_color)
 *   [campaignFolder] output campaign under campaigns/ (default "<slug>-breakdown")
 *
 * Spec (locked): light bg · each slide = full section image (no crop), centred
 * exactly · small slide-number ring at top in the site's brand colour · no other text.
 * To make a new one: drop section images in assets/breakdowns/<slug>/, set
 * brand_color in its sections.yaml, run this + make-square.js.
 */
const path = require('path');
const fs = require('fs');
const { registerFonts, createBaseCanvas, saveCanvas, roundRect, loadImage } = require('../../scripts/lib/canvas-helpers');

registerFonts();
const W = 1080, H = 1920;

const slug = process.argv[2];
if (!slug) { console.error('usage: node make-tiktok.js <site-slug> [campaignFolder]'); process.exit(1); }
const campaign = process.argv[3] || `${slug}-breakdown`;
// Optional: when a full-bleed cover is slide 1, pass startNum=2 + total to renumber.
const startNum = parseInt(process.argv[4], 10) || 1;
const totalArg = parseInt(process.argv[5], 10);
const SITE_DIR = path.join(__dirname, '..', '..', 'assets', 'breakdowns', slug);
const OUT = path.join(__dirname, '..', '..', 'campaigns', campaign, 'exports', 'tiktok');

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
function numberBadge(ctx, n, total, cy = 165) {
  const cx = W / 2, r = 50;
  ctx.save();
  ctx.strokeStyle = SITE_COLOR; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = SITE_COLOR; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'italic 50px "Instrument Serif Italic"';
  ctx.fillText(String(n).padStart(2, '0'), cx, cy + 3);
  ctx.fillStyle = 'rgba(27,26,24,0.45)'; ctx.textBaseline = 'alphabetic';
  ctx.font = '500 18px "JetBrains Mono Medium"';
  ctx.fillText(`/ ${String(total).padStart(2, '0')}`, cx, cy + r + 30);
  ctx.restore();
}
function sectionImage(ctx, img, isFirst) {
  const availTop = 335, availBot = H - 70, maxW = 940, R = 16;
  const maxH = availBot - availTop;
  const scale = Math.min(maxW / img.width, maxH / img.height) * 0.9;
  const w = img.width * scale, h = img.height * scale;
  const x = (W - w) / 2;
  // slide 1 (hero) centres on the true middle of the slide; the rest sit centred
  // in the area below the number (as before).
  const y = isFirst ? (H - h) / 2 : availTop + (maxH - h) / 2;
  ctx.save(); ctx.shadowColor = 'rgba(27,26,24,0.20)'; ctx.shadowBlur = 38; ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#000'; roundRect(ctx, x, y, w, h, R); ctx.fill(); ctx.restore();
  ctx.save(); roundRect(ctx, x, y, w, h, R); ctx.clip();
  ctx.drawImage(img, 0, 0, img.width, img.height, x, y, w, h); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(27,26,24,0.12)'; ctx.lineWidth = 1.5; roundRect(ctx, x, y, w, h, R); ctx.stroke(); ctx.restore();
}

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.readdirSync(OUT).filter((f) => f.endsWith('.png')).forEach((f) => fs.unlinkSync(path.join(OUT, f)));
  for (let i = 0; i < SECTIONS.length; i++) {
    const num = startNum + i;
    const total = totalArg || SECTIONS.length;
    const state = createBaseCanvas(W, H, '#FFFCF8'); const { ctx } = state;
    lightBg(ctx); numberBadge(ctx, num, total);
    const img = await loadImage(path.join(SITE_DIR, SECTIONS[i]));
    sectionImage(ctx, img, num === 1);
    const name = `slide-${num}-${SECTIONS[i].replace('.png', '')}.png`;
    saveCanvas(state, path.join(OUT, name)); console.log('  saved:', name);
  }
  console.log(`\n[${slug}] TikTok breakdown done (colour ${SITE_COLOR}) →`, OUT);
}
run().catch((e) => { console.error(e); process.exit(1); });
