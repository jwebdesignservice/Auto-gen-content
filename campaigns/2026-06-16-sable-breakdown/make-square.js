/**
 * make-square.js — Sable breakdown, 1080×1080 for IG + LinkedIn. Mirrors the
 * TikTok deck reflowed to square, same clean burgundy background.
 */
const path = require('path');
const fs = require('fs');
const { registerFonts, createBaseCanvas, saveCanvas, roundRect, loadImage } = require('../../scripts/lib/canvas-helpers');

registerFonts();
const W = 1080, H = 1080;
const REFS = path.join(__dirname, '..', '..', 'assets', 'breakdowns', 'sable');
const OUT_IG = path.join(__dirname, 'exports', 'instagram');
const OUT_LI = path.join(__dirname, 'exports', 'linkedin');

const BG = '#3A0F1A', CREAM = '#F3E7D8', MUTED = 'rgba(243,231,216,0.58)', GOLD = '#C8A24B';

const SECTIONS = [
  { num: '01', file: '01-hero.png', label: 'The hero', note: 'Candle-lit, "a quiet kind of luxury" — the tone lands in one screen.' },
  { num: '02', file: '02-menu-craft.png', label: 'The craft', note: 'Cooked over fire. 600 bottles. A 12-course tasting written each morning.' },
  { num: '03', file: '03-chef-room.png', label: 'The chef & room', note: '"The room is the recipe" + a frame-by-frame photo gallery.' },
  { num: '04', file: '04-proof-pricing.png', label: 'Proof & pricing', note: 'Testimonials, then three clear booking tiers. No guessing.' },
  { num: '05', file: '05-faq-footer.png', label: 'The close', note: 'FAQs kill objections, then a simple "reserve a seat".' },
];

function bg(ctx) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = '#2A0A13';
  ctx.beginPath(); ctx.arc(-40, -40, 230, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(W + 50, H + 50, 260, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function eyebrow(ctx, text, y) {
  ctx.save(); ctx.fillStyle = GOLD; ctx.font = '500 17px "JetBrains Mono Medium"';
  const chars = text.split(''), sp = 4;
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((s, w) => s + w, 0) + sp * (chars.length - 1);
  let x = (W - total) / 2; ctx.textAlign = 'left';
  chars.forEach((c, i) => { ctx.fillText(c, x, y); x += widths[i] + sp; });
  ctx.restore();
}
function sectionCard(ctx, img, topY, fw, { cropH = null } = {}) {
  const sw = img.width, sh = cropH ? Math.min(cropH, img.height) : img.height;
  const w = fw, h = sh * (fw / sw), x = (W - w) / 2, R = 12;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#000'; roundRect(ctx, x, topY, w, h, R); ctx.fill(); ctx.restore();
  ctx.save(); roundRect(ctx, x, topY, w, h, R); ctx.clip(); ctx.drawImage(img, 0, 0, sw, sh, x, topY, w, h); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(243,231,216,0.22)'; ctx.lineWidth = 1.25; roundRect(ctx, x, topY, w, h, R); ctx.stroke(); ctx.restore();
}
function save(state, name) { saveCanvas(state, path.join(OUT_IG, name)); saveCanvas(state, path.join(OUT_LI, name)); console.log('  saved (IG+LI):', name); }

async function hook() {
  const state = createBaseCanvas(W, H, BG); const { ctx } = state; bg(ctx); ctx.textAlign = 'center';
  eyebrow(ctx, 'SITE BREAKDOWN', 150);
  ctx.fillStyle = CREAM; ctx.font = 'bold 66px "Space Grotesk Bold"'; ctx.fillText('Anatomy of a', W / 2, 245);
  ctx.fillStyle = GOLD; ctx.font = 'italic 72px "Instrument Serif Italic"'; ctx.fillText('fine-dining site.', W / 2, 325);
  ctx.fillStyle = MUTED; ctx.font = '500 25px "Space Grotesk Medium"'; ctx.fillText('Sable — every section, broken down.', W / 2, 380);
  const img = await loadImage(path.join(REFS, '01-hero.png'));
  sectionCard(ctx, img, 470, 620);
  save(state, 'slide-1-hook.png');
}
async function sectionSlide(s, idx) {
  const state = createBaseCanvas(W, H, BG); const { ctx } = state; bg(ctx); ctx.textAlign = 'center';
  eyebrow(ctx, `${s.num} · ${s.label.toUpperCase()}`, 140);
  ctx.fillStyle = MUTED; ctx.font = 'italic 25px "Instrument Serif Italic"';
  const words = s.note.split(' '); let line = '', lines = [];
  for (const w of words) { if ((line + ' ' + w).trim().length > 44) { lines.push(line.trim()); line = w; } else line += ' ' + w; }
  if (line.trim()) lines.push(line.trim());
  lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, W / 2, 195 + i * 34));
  const topY = 195 + Math.min(lines.length, 2) * 34 + 28;
  const img = await loadImage(path.join(REFS, s.file));
  sectionCard(ctx, img, topY, 560, s.file.includes('hero') ? {} : { cropH: 2600 });
  save(state, `slide-${idx + 2}-${s.file.replace('.png', '')}.png`);
}
async function cta(n) {
  const state = createBaseCanvas(W, H, BG); const { ctx } = state; bg(ctx); ctx.textAlign = 'center';
  eyebrow(ctx, 'BUILT BY FAST LAUNCH', 360);
  ctx.fillStyle = CREAM; ctx.font = 'bold 72px "Space Grotesk Bold"'; ctx.fillText('Want a site', W / 2, 470);
  ctx.fillStyle = GOLD; ctx.font = 'italic 78px "Instrument Serif Italic"'; ctx.fillText('like this?', W / 2, 555);
  ctx.fillStyle = MUTED; ctx.font = '500 26px "Space Grotesk Medium"'; ctx.fillText('Custom built, brief to live in 6 days.', W / 2, 615);
  const label = 'fastlaunchmvp.com'; ctx.font = '500 27px "JetBrains Mono Medium"';
  const tw = ctx.measureText(label).width, pw = tw + 64, ph = 64, px = (W - pw) / 2, py = 690;
  ctx.fillStyle = GOLD; roundRect(ctx, px, py, pw, ph, 14); ctx.fill();
  ctx.fillStyle = BG; ctx.textBaseline = 'middle'; ctx.fillText(label, W / 2, py + ph / 2 + 1); ctx.textBaseline = 'alphabetic';
  save(state, `slide-${n}-cta.png`);
}
async function run() {
  [OUT_IG, OUT_LI].forEach((d) => { fs.mkdirSync(d, { recursive: true }); fs.readdirSync(d).filter((f) => f.endsWith('.png')).forEach((f) => fs.unlinkSync(path.join(d, f))); });
  await hook();
  for (let i = 0; i < SECTIONS.length; i++) await sectionSlide(SECTIONS[i], i);
  await cta(SECTIONS.length + 2);
  console.log('\nBreakdown square slides done');
}
run().catch((e) => { console.error(e); process.exit(1); });
