/**
 * make-tiktok.js — single-site BREAKDOWN deck, 1080×1920, chrome-off.
 * STANDARD breakdown spec (locked 2026-06-16): LIGHT background, each slide shows
 * ONLY the section image + a small cool slide-number graphic at the top. No other
 * text. Section images from assets/breakdowns/<site>/.
 */
const path = require('path');
const fs = require('fs');
const { registerFonts, BRAND_TOKENS, createBaseCanvas, saveCanvas, roundRect, loadImage } = require('../../scripts/lib/canvas-helpers');

registerFonts();
const W = 1080, H = 1920;
const SITE = 'sable';
const REFS = path.join(__dirname, '..', '..', 'assets', 'breakdowns', SITE);
const OUT = path.join(__dirname, 'exports', 'tiktok');
const SITE_COLOR = '#6E1228';   // red-burgundy — matches the Sable site (slide-number colour)

const SECTIONS = ['01-hero.png', '02-menu-craft.png', '03-chef-room.png', '04-proof-pricing.png', '05-faq-footer.png'];

function lightBg(ctx) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#FFFCF8'); g.addColorStop(1, '#F4EEE4');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// Cool, small slide-number graphic: an orange ring with the number inside.
function numberBadge(ctx, n, total, cy = 165) {
  const cx = W / 2, r = 50;
  ctx.save();
  ctx.strokeStyle = SITE_COLOR; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = SITE_COLOR; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'italic 50px "Instrument Serif Italic"';
  ctx.fillText(String(n).padStart(2, '0'), cx, cy + 3);
  // tiny total under the ring
  ctx.fillStyle = 'rgba(27,26,24,0.45)'; ctx.textBaseline = 'alphabetic';
  ctx.font = '500 18px "JetBrains Mono Medium"';
  ctx.fillText(`/ ${String(total).padStart(2, '0')}`, cx, cy + r + 30);
  ctx.restore();
}

function sectionImage(ctx, img) {
  // Show the FULL image (no crop/bleed), fit within the area and centred exactly.
  const availTop = 270, availBot = H - 70, maxW = 940, R = 16;
  const maxH = availBot - availTop;
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * scale, h = img.height * scale;
  const x = (W - w) / 2, y = availTop + (maxH - h) / 2;
  ctx.save(); ctx.shadowColor = 'rgba(27,26,24,0.20)'; ctx.shadowBlur = 38; ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#000'; roundRect(ctx, x, y, w, h, R); ctx.fill(); ctx.restore();
  ctx.save(); roundRect(ctx, x, y, w, h, R); ctx.clip();
  ctx.drawImage(img, 0, 0, img.width, img.height, x, y, w, h); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(27,26,24,0.12)'; ctx.lineWidth = 1.5; roundRect(ctx, x, y, w, h, R); ctx.stroke(); ctx.restore();
}

function save(state, name) { saveCanvas(state, path.join(OUT, name)); console.log('  saved:', name); }

async function slide(file, i) {
  const state = createBaseCanvas(W, H, '#FFFCF8'); const { ctx } = state;
  lightBg(ctx);
  numberBadge(ctx, i + 1, SECTIONS.length);
  const img = await loadImage(path.join(REFS, file));
  sectionImage(ctx, img);
  save(state, `slide-${i + 1}-${file.replace('.png', '')}.png`);
}

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.readdirSync(OUT).filter((f) => f.endsWith('.png')).forEach((f) => fs.unlinkSync(path.join(OUT, f)));
  for (let i = 0; i < SECTIONS.length; i++) await slide(SECTIONS[i], i);
  console.log('\nBreakdown TikTok slides done →', OUT);
}
run().catch((e) => { console.error(e); process.exit(1); });
