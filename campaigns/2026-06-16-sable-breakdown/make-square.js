/**
 * make-square.js — Sable breakdown, 1080×1080 (IG + LinkedIn).
 * Same STANDARD breakdown spec: light bg, image + small slide-number graphic only.
 */
const path = require('path');
const fs = require('fs');
const { registerFonts, BRAND_TOKENS, createBaseCanvas, saveCanvas, roundRect, loadImage } = require('../../scripts/lib/canvas-helpers');

registerFonts();
const W = 1080, H = 1080;
const SITE = 'sable';
const REFS = path.join(__dirname, '..', '..', 'assets', 'breakdowns', SITE);
const OUT_IG = path.join(__dirname, 'exports', 'instagram');
const OUT_LI = path.join(__dirname, 'exports', 'linkedin');
const ORANGE = BRAND_TOKENS.ORANGE;

const SECTIONS = ['01-hero.png', '02-menu-craft.png', '03-chef-room.png', '04-proof-pricing.png', '05-faq-footer.png'];

function lightBg(ctx) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#FFFCF8'); g.addColorStop(1, '#F4EEE4');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function numberBadge(ctx, n, total, cy = 110) {
  const cx = W / 2, r = 40;
  ctx.save();
  ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = ORANGE; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'italic 40px "Instrument Serif Italic"';
  ctx.fillText(String(n).padStart(2, '0'), cx, cy + 2);
  ctx.fillStyle = 'rgba(27,26,24,0.45)'; ctx.textBaseline = 'alphabetic';
  ctx.font = '500 15px "JetBrains Mono Medium"';
  ctx.fillText(`/ ${String(total).padStart(2, '0')}`, cx, cy + r + 24);
  ctx.restore();
}
function sectionImage(ctx, img) {
  const topB = 200, botB = H - 60, fw = 620, x = (W - fw) / 2, R = 13;
  const h = img.height * (fw / img.width);
  let y, drawH = h;
  if (h <= botB - topB) y = topB + (botB - topB - h) / 2; else y = topB;
  ctx.save(); ctx.shadowColor = 'rgba(27,26,24,0.20)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#000'; roundRect(ctx, x, y, fw, drawH, R); ctx.fill(); ctx.restore();
  ctx.save(); roundRect(ctx, x, y, fw, drawH, R); ctx.clip();
  ctx.drawImage(img, 0, 0, img.width, img.height, x, y, fw, drawH); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(27,26,24,0.12)'; ctx.lineWidth = 1.25; roundRect(ctx, x, y, fw, drawH, R); ctx.stroke(); ctx.restore();
}
function save(state, name) { saveCanvas(state, path.join(OUT_IG, name)); saveCanvas(state, path.join(OUT_LI, name)); console.log('  saved (IG+LI):', name); }

async function slide(file, i) {
  const state = createBaseCanvas(W, H, '#FFFCF8'); const { ctx } = state;
  lightBg(ctx); numberBadge(ctx, i + 1, SECTIONS.length);
  const img = await loadImage(path.join(REFS, file));
  sectionImage(ctx, img);
  save(state, `slide-${i + 1}-${file.replace('.png', '')}.png`);
}
async function run() {
  [OUT_IG, OUT_LI].forEach((d) => { fs.mkdirSync(d, { recursive: true }); fs.readdirSync(d).filter((f) => f.endsWith('.png')).forEach((f) => fs.unlinkSync(path.join(d, f))); });
  for (let i = 0; i < SECTIONS.length; i++) await slide(SECTIONS[i], i);
  console.log('\nBreakdown square slides done');
}
run().catch((e) => { console.error(e); process.exit(1); });
