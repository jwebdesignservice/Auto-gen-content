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
const ORANGE = BRAND_TOKENS.ORANGE, INK = '#1B1A18';

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
  ctx.strokeStyle = ORANGE; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = ORANGE; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'italic 50px "Instrument Serif Italic"';
  ctx.fillText(String(n).padStart(2, '0'), cx, cy + 3);
  // tiny total under the ring
  ctx.fillStyle = 'rgba(27,26,24,0.45)'; ctx.textBaseline = 'alphabetic';
  ctx.font = '500 18px "JetBrains Mono Medium"';
  ctx.fillText(`/ ${String(total).padStart(2, '0')}`, cx, cy + r + 30);
  ctx.restore();
}

function sectionImage(ctx, img) {
  const topB = 280, botB = H - 90;          // area between badge and bottom
  const fw = 920, x = (W - fw) / 2, R = 16;
  const h = img.height * (fw / img.width);
  let y, drawH = h;
  if (h <= botB - topB) { y = topB + (botB - topB - h) / 2; }   // short/landscape → centre
  else { y = topB; drawH = h; }                                  // tall → top-align + bleed
  // shadow + image + hairline so it reads on the light bg
  ctx.save(); ctx.shadowColor = 'rgba(27,26,24,0.20)'; ctx.shadowBlur = 38; ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#000'; roundRect(ctx, x, y, fw, drawH, R); ctx.fill(); ctx.restore();
  ctx.save(); roundRect(ctx, x, y, fw, drawH, R); ctx.clip();
  ctx.drawImage(img, 0, 0, img.width, img.height, x, y, fw, drawH); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(27,26,24,0.12)'; ctx.lineWidth = 1.5; roundRect(ctx, x, y, fw, drawH, R); ctx.stroke(); ctx.restore();
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
