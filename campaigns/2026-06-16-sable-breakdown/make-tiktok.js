/**
 * make-tiktok.js — single-site BREAKDOWN deck (Sable), 1080×1920, chrome-off.
 * Clean minimal coloured background (Sable burgundy). Hook → 5 section slides
 * → CTA. Section images come from assets/breakdowns/sable/.
 */
const path = require('path');
const fs = require('fs');
const { registerFonts, createBaseCanvas, saveCanvas, roundRect, loadImage } = require('../../scripts/lib/canvas-helpers');

registerFonts();
const W = 1080, H = 1920;
const REFS = path.join(__dirname, '..', '..', 'assets', 'breakdowns', 'sable');
const OUT = path.join(__dirname, 'exports', 'tiktok');

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
  // subtle darker vignette corners for depth (still minimal)
  ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = '#2A0A13';
  ctx.beginPath(); ctx.arc(-60, -60, 360, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(W + 80, H + 80, 420, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function eyebrow(ctx, text, y, color = GOLD) {
  ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = color;
  ctx.font = '500 26px "JetBrains Mono Medium"';
  // letter-spacing via manual draw
  const chars = text.split(''); const sp = 5;
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((s, w) => s + w, 0) + sp * (chars.length - 1);
  let x = (W - total) / 2;
  ctx.textAlign = 'left';
  chars.forEach((c, i) => { ctx.fillText(c, x, y); x += widths[i] + sp; });
  ctx.restore();
}

function sectionCard(ctx, img, topY, fw, { cropH = null } = {}) {
  const sw = img.width;
  const sh = cropH ? Math.min(cropH, img.height) : img.height;
  const w = fw, h = sh * (fw / sw);
  const x = (W - w) / 2, R = 14;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#000'; roundRect(ctx, x, topY, w, h, R); ctx.fill();
  ctx.restore();
  ctx.save(); roundRect(ctx, x, topY, w, h, R); ctx.clip();
  ctx.drawImage(img, 0, 0, sw, sh, x, topY, w, h);
  ctx.restore();
  // hairline border so burgundy sections separate from the burgundy bg
  ctx.save(); ctx.strokeStyle = 'rgba(243,231,216,0.22)'; ctx.lineWidth = 1.5;
  roundRect(ctx, x, topY, w, h, R); ctx.stroke(); ctx.restore();
  return h;
}

function save(state, name) { saveCanvas(state, path.join(OUT, name)); console.log('  saved:', name); }

async function hook() {
  const state = createBaseCanvas(W, H, BG); const { ctx } = state; bg(ctx);
  eyebrow(ctx, 'SITE BREAKDOWN', 250);
  ctx.textAlign = 'center';
  ctx.fillStyle = CREAM; ctx.font = 'bold 112px "Space Grotesk Bold"';
  ctx.fillText('Anatomy of a', W / 2, 400);
  ctx.fillStyle = GOLD; ctx.font = 'italic 120px "Instrument Serif Italic"';
  ctx.fillText('fine-dining site.', W / 2, 530);
  ctx.fillStyle = MUTED; ctx.font = '500 38px "Space Grotesk Medium"';
  ctx.fillText('Sable — every section, broken down.', W / 2, 615);
  const img = await loadImage(path.join(REFS, '01-hero.png'));
  sectionCard(ctx, img, 760, 900);
  save(state, 'slide-1-hook.png');
}

async function sectionSlide(s, idx) {
  const state = createBaseCanvas(W, H, BG); const { ctx } = state; bg(ctx);
  eyebrow(ctx, `${s.num} · ${s.label.toUpperCase()}`, 250);
  ctx.textAlign = 'center';
  ctx.fillStyle = MUTED; ctx.font = 'italic 40px "Instrument Serif Italic"';
  // wrap note to <= ~38 chars
  const words = s.note.split(' '); let line = '', lines = [];
  for (const w of words) { if ((line + ' ' + w).trim().length > 40) { lines.push(line.trim()); line = w; } else line += ' ' + w; }
  if (line.trim()) lines.push(line.trim());
  lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, W / 2, 330 + i * 50));
  const topY = 330 + Math.min(lines.length, 2) * 50 + 40;
  const img = await loadImage(path.join(REFS, s.file));
  // hero is short/landscape (show fully); tall sections bleed off the bottom
  const isHero = s.file.includes('hero');
  sectionCard(ctx, img, topY, 920, isHero ? {} : { cropH: 2600 });
  save(state, `slide-${idx + 2}-${s.file.replace('.png', '')}.png`);
}

async function cta(n) {
  const state = createBaseCanvas(W, H, BG); const { ctx } = state; bg(ctx);
  ctx.textAlign = 'center';
  eyebrow(ctx, 'BUILT BY FAST LAUNCH', 640);
  ctx.fillStyle = CREAM; ctx.font = 'bold 120px "Space Grotesk Bold"';
  ctx.fillText('Want a site', W / 2, 820);
  ctx.fillStyle = GOLD; ctx.font = 'italic 128px "Instrument Serif Italic"';
  ctx.fillText('like this?', W / 2, 960);
  ctx.fillStyle = MUTED; ctx.font = '500 40px "Space Grotesk Medium"';
  ctx.fillText('Custom built, brief to live in 6 days.', W / 2, 1060);
  // pill
  const label = 'fastlaunchmvp.com';
  ctx.font = '500 42px "JetBrains Mono Medium"';
  const tw = ctx.measureText(label).width, pw = tw + 100, ph = 96, px = (W - pw) / 2, py = 1180;
  ctx.fillStyle = GOLD; roundRect(ctx, px, py, pw, ph, 18); ctx.fill();
  ctx.fillStyle = BG; ctx.textBaseline = 'middle'; ctx.fillText(label, W / 2, py + ph / 2 + 2); ctx.textBaseline = 'alphabetic';
  save(state, `slide-${n}-cta.png`);
}

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.readdirSync(OUT).filter((f) => f.endsWith('.png')).forEach((f) => fs.unlinkSync(path.join(OUT, f)));
  await hook();
  for (let i = 0; i < SECTIONS.length; i++) await sectionSlide(SECTIONS[i], i);
  await cta(SECTIONS.length + 2);
  console.log('\nBreakdown TikTok slides done →', OUT);
}
run().catch((e) => { console.error(e); process.exit(1); });
