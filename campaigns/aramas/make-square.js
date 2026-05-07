/**
 * make-square.js — Aramas 1080×1080 (Instagram + LinkedIn) carousel
 * Re-flows the TikTok 1080×1920 layout to square format with proper
 * type/spacing reductions per the Fast Launch spec.
 */
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const FONTS = path.join(ROOT, 'fonts');

// Register using the TTF's actual internal family names — node-canvas
// resolves font lookups via the internal name regardless of the alias.
registerFont(path.join(FONTS, 'SpaceGrotesk-Bold.ttf'),       { family: 'Space Grotesk Bold' });
registerFont(path.join(FONTS, 'SpaceGrotesk-Medium.ttf'),     { family: 'Space Grotesk Medium' });
registerFont(path.join(FONTS, 'InstrumentSerif-Italic.ttf'),  { family: 'Instrument Serif Italic' });
registerFont(path.join(FONTS, 'JetBrainsMono-Medium.ttf'),    { family: 'JetBrains Mono Medium' });

// ── Canvas ────────────────────────────────────────────────────────────────────
const W = 1080, H = 1080;

// ── Tokens ────────────────────────────────────────────────────────────────────
const ORANGE   = '#F26B1A';
const WHITE    = '#FFFFFF';
const FG2      = 'rgba(255,255,255,0.78)';
const FG3      = 'rgba(255,255,255,0.55)';
const FG4      = 'rgba(255,255,255,0.32)';
const BG_PAGE  = '#110D0A';
const BG_CARD  = '#1C1612';
const HAIRLINE = 'rgba(255,235,210,0.10)';

// ── Type (square scale) ───────────────────────────────────────────────────────
const F_DISPLAY = '70px "Space Grotesk Bold"';
const F_H1      = '60px "Space Grotesk Bold"';
const F_H1_S    = '54px "Space Grotesk Bold"';
const F_SUB     = '32px "Instrument Serif Italic"';
const F_SUB_S   = '28px "Instrument Serif Italic"';
const F_BODY    = '24px "Space Grotesk Medium"';
const F_EYEBROW = '17px "JetBrains Mono Medium"';
const F_FOOTER  = '18px "JetBrains Mono Medium"';
const F_STAT_BIG = '52px "Space Grotesk Bold"';
const F_STAT_LBL = '18px "Space Grotesk Medium"';

// ── Reference images ──────────────────────────────────────────────────────────
const REFS = path.join(__dirname, 'references');
const HERO = path.join(REFS, 'hero.png');
const HOME = path.join(REFS, 'homepage.png');
const PROP = path.join(REFS, 'property-page.png');
const LOGO = path.join(ROOT, 'brand', 'logo-mark.png');

const OUT = path.join(__dirname, 'exports', 'instagram');

// ── Helpers ───────────────────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);  // clamp — prevents path blow-out on pills
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

// Letter-spaced text helper (canvas can't do letter-spacing natively)
function fillSpaced(ctx, text, x, y, spacing) {
  ctx.save();
  const chars = text.split('');
  let total = 0;
  const widths = chars.map(c => { const w = ctx.measureText(c).width; total += w; return w; });
  total += spacing * (chars.length - 1);
  let cursor = x - total / 2;
  for (let i = 0; i < chars.length; i++) {
    ctx.textAlign = 'left';
    ctx.fillText(chars[i], cursor, y);
    cursor += widths[i] + spacing;
  }
  ctx.restore();
}

function wrapText(ctx, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line + w + ' ';
    if (ctx.measureText(test).width > maxW && line) { lines.push(line.trim()); line = w + ' '; }
    else line = test;
  }
  lines.push(line.trim());
  return lines;
}

function baseCanvas() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  // Background
  ctx.fillStyle = BG_PAGE;
  ctx.fillRect(0, 0, W, H);
  // Subtle warm radial glow centred low
  const glow = ctx.createRadialGradient(W/2, H*0.55, 60, W/2, H*0.55, 700);
  glow.addColorStop(0, 'rgba(242,107,26,0.06)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  return { canvas, ctx };
}

function drawTopbar(ctx) {
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 0, W, 4);
}

function drawLogoBlock(ctx, logo) {
  const logoSize = 40;
  const logoY = 36;
  ctx.drawImage(logo, (W-logoSize)/2, logoY, logoSize, logoSize);
  ctx.fillStyle = WHITE;
  ctx.font = '22px "Space Grotesk Bold"';
  ctx.textAlign = 'center';
  ctx.fillText('Fast Launch', W/2, logoY + logoSize + 30);
  return logoY + logoSize + 30 + 8; // bottom of header
}

function drawFooter(ctx) {
  ctx.fillStyle = FG3;
  ctx.font = F_FOOTER;
  ctx.textAlign = 'center';
  fillSpaced(ctx, 'FASTLAUNCHMVP.COM', W/2, H - 32, 3);
}

function drawEyebrow(ctx, text, y) {
  ctx.fillStyle = ORANGE;
  ctx.font = F_EYEBROW;
  ctx.textAlign = 'center';
  fillSpaced(ctx, text, W/2, y, 4);
}

function drawScreenshot(ctx, img, x, y, w, h, srcX=0, srcY=0, srcW, srcH) {
  // Soft glow
  ctx.save();
  ctx.shadowColor = 'rgba(242,107,26,0.30)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = WHITE;
  roundRect(ctx, x, y, w, h, 14);
  ctx.fill();
  ctx.restore();
  // Clip + draw image
  ctx.save();
  roundRect(ctx, x, y, w, h, 14);
  ctx.clip();
  ctx.drawImage(img, srcX, srcY, srcW || img.width, srcH || img.height, x, y, w, h);
  ctx.restore();
  // Hairline
  ctx.save();
  roundRect(ctx, x, y, w, h, 14);
  ctx.lineWidth = 1;
  ctx.strokeStyle = HAIRLINE;
  ctx.stroke();
  ctx.restore();
}

function save(canvas, name) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), canvas.toBuffer('image/png'));
  console.log('Saved:', name);
}

// ── SLIDE 1 — HOOK ────────────────────────────────────────────────────────────
async function slide1(hero, logo) {
  const { canvas, ctx } = baseCanvas();
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  ctx.textAlign = 'center';
  const Y = 8; // vertical-centring shift

  // Headlines
  ctx.fillStyle = WHITE;
  ctx.font = F_H1;
  ctx.fillText('This Website Went', W/2, 230 + Y);
  ctx.fillStyle = ORANGE;
  ctx.fillText('Live In 6 Days.', W/2, 295 + Y);

  // Subhead
  ctx.fillStyle = FG3;
  ctx.font = F_SUB;
  ctx.fillText('No agency. No months of waiting.', W/2, 365 + Y);

  // Screenshot — 16:10
  const imgW = 720;
  const imgH = Math.round(imgW * (hero.height / hero.width));
  const cappedH = Math.min(imgH, 380);
  drawScreenshot(ctx, hero, (W-imgW)/2, 410 + Y, imgW, cappedH);

  // Stat pills (3-up)
  const pillY = 410 + Y + cappedH + 40;
  const pillW = 220, pillH = 92, gap = 24;
  const totalW = pillW * 3 + gap * 2;
  const startX = (W - totalW) / 2;
  const stats = [['200+', 'Properties'], ['100%', 'Custom build'], ['6 days', 'To launch']];
  stats.forEach(([num, label], i) => {
    const x = startX + i * (pillW + gap);
    ctx.fillStyle = BG_CARD;
    roundRect(ctx, x, pillY, pillW, pillH, 12);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = HAIRLINE;
    ctx.stroke();
    // Number
    ctx.fillStyle = ORANGE;
    ctx.font = '32px "Space Grotesk Bold"';
    ctx.textAlign = 'center';
    ctx.fillText(num, x + pillW/2, pillY + 42);
    // Label
    ctx.fillStyle = FG3;
    ctx.font = '16px "Space Grotesk Medium"';
    ctx.fillText(label, x + pillW/2, pillY + 72);
  });

  drawFooter(ctx);
  save(canvas, 'aramas-01-hook.png');
}

// ── SLIDE 2 — PROPERTIES ──────────────────────────────────────────────────────
async function slide2(home, logo) {
  const { canvas, ctx } = baseCanvas();
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  ctx.textAlign = 'center';
  const Y = 35;

  ctx.fillStyle = WHITE;
  ctx.font = F_H1;
  ctx.fillText('200+ Properties.', W/2, 230 + Y);
  ctx.fillStyle = ORANGE;
  ctx.fillText('Listed Day One.', W/2, 295 + Y);

  ctx.fillStyle = FG3;
  ctx.font = F_SUB;
  const subLines = ['Off-plan UAE developments,', 'fully searchable from launch.'];
  subLines.forEach((l, i) => ctx.fillText(l, W/2, 360 + Y + i * 38));

  // Screenshot — homepage middle section showing listings (cropped from full home capture)
  const imgW = 760, imgH = 380;
  drawScreenshot(ctx, home, (W-imgW)/2, 480 + Y, imgW, imgH, 0, 600, home.width, 1400);

  drawFooter(ctx);
  save(canvas, 'aramas-02-properties.png');
}

// ── SLIDE 3 — PROBLEM ─────────────────────────────────────────────────────────
async function slide3(logo) {
  const { canvas, ctx } = baseCanvas();
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  const Y = 65;
  drawEyebrow(ctx, 'WHY MOST LAUNCHES STALL', 220 + Y);

  ctx.textAlign = 'center';
  ctx.fillStyle = WHITE;
  ctx.font = F_H1;
  ctx.fillText('The old way is', W/2, 290 + Y);
  ctx.fillStyle = ORANGE;
  ctx.font = '64px "Instrument Serif Italic"';
  ctx.fillText('broken.', W/2, 360 + Y);

  // 4 problem cards
  const items = [
    'Agencies that quote 3 months',
    'Endless decks, zero shipped',
    'Templates that look like everyone else',
    '£20k bills before line one of code'
  ];
  const cardW = 740, cardH = 76, cardGap = 14;
  const startY = 440 + Y;
  const startX = (W - cardW) / 2;

  items.forEach((text, i) => {
    const y = startY + i * (cardH + cardGap);
    ctx.fillStyle = BG_CARD;
    roundRect(ctx, startX, y, cardW, cardH, 12);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = HAIRLINE;
    ctx.stroke();
    // × mark
    ctx.fillStyle = ORANGE;
    ctx.font = '26px "Space Grotesk Bold"';
    ctx.textAlign = 'left';
    ctx.fillText('×', startX + 28, y + 49);
    // text
    ctx.fillStyle = FG2;
    ctx.font = '22px "Space Grotesk Medium"';
    ctx.fillText(text, startX + 64, y + 49);
  });

  drawFooter(ctx);
  save(canvas, 'aramas-03-problem.png');
}

// ── SLIDE 4 — TIMELINE ────────────────────────────────────────────────────────
async function slide4(logo) {
  const { canvas, ctx } = baseCanvas();
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  ctx.textAlign = 'center';
  const Y = 57;
  ctx.fillStyle = WHITE;
  ctx.font = F_H1;
  ctx.fillText('Six days.', W/2, 230 + Y);
  ctx.fillStyle = ORANGE;
  ctx.fillText('Start to live.', W/2, 295 + Y);

  ctx.fillStyle = FG3;
  ctx.font = F_SUB;
  ctx.fillText('No retainers. No surprises.', W/2, 360 + Y);

  // 6 day pills with labels (left-aligned within centered block)
  const items = [
    ['DAY 1', 'Brief + brand audit'],
    ['DAY 2', 'Wireframes locked'],
    ['DAY 3', 'Visual design signed off'],
    ['DAY 4', 'Build & content'],
    ['DAY 5', 'QA on every device'],
    ['DAY 6', 'Live on your domain']
  ];
  const rowH = 56;
  const rowGap = 8;
  const blockW = 580;
  const blockX = (W - blockW) / 2;
  const startY = 440 + Y;
  const chipW = 90, chipH = 38;

  items.forEach(([day, label], i) => {
    const y = startY + i * (rowH + rowGap);
    // Day chip
    ctx.fillStyle = 'rgba(242,107,26,0.10)';
    roundRect(ctx, blockX, y, chipW, chipH, 999);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(242,107,26,0.35)';
    ctx.stroke();
    ctx.fillStyle = ORANGE;
    ctx.font = '16px "JetBrains Mono Medium"';
    ctx.textAlign = 'center';
    fillSpaced(ctx, day, blockX + chipW/2, y + 25, 2);
    // Label
    ctx.fillStyle = WHITE;
    ctx.font = '24px "Space Grotesk Medium"';
    ctx.textAlign = 'left';
    ctx.fillText(label, blockX + chipW + 22, y + 27);
  });

  drawFooter(ctx);
  save(canvas, 'aramas-04-timeline.png');
}

// ── SLIDE 5 — RESULTS ─────────────────────────────────────────────────────────
async function slide5(logo) {
  const { canvas, ctx } = baseCanvas();
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  const Y = 28;
  drawEyebrow(ctx, 'WHAT ARAMAS GOT', 220 + Y);

  ctx.textAlign = 'center';
  ctx.fillStyle = WHITE;
  ctx.font = F_H1;
  ctx.fillText('Live before', W/2, 290 + Y);
  ctx.fillStyle = ORANGE;
  ctx.fillText('the launch event.', W/2, 360 + Y);

  // 2x2 grid
  const cellW = 360, cellH = 200, gap = 20;
  const totalW = cellW * 2 + gap;
  const totalH = cellH * 2 + gap;
  const startX = (W - totalW) / 2;
  const startY = 440 + Y;

  const cells = [
    ['6d',      'Brief to live site'],
    ['200+',    'Properties listed'],
    ['100/100', 'Lighthouse performance'],
    ['£0',      'Spent on retainers']
  ];

  cells.forEach(([num, label], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = startX + col * (cellW + gap);
    const y = startY + row * (cellH + gap);
    ctx.fillStyle = BG_CARD;
    roundRect(ctx, x, y, cellW, cellH, 14);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = HAIRLINE;
    ctx.stroke();
    // Big number
    ctx.fillStyle = ORANGE;
    ctx.font = '64px "Space Grotesk Bold"';
    ctx.textAlign = 'left';
    ctx.fillText(num, x + 28, y + 92);
    // Label
    ctx.fillStyle = FG2;
    ctx.font = '20px "Space Grotesk Medium"';
    ctx.fillText(label, x + 28, y + 144);
  });

  drawFooter(ctx);
  save(canvas, 'aramas-05-results.png');
}

// ── SLIDE 6 — CTA ─────────────────────────────────────────────────────────────
async function slide6(logo) {
  const { canvas, ctx } = baseCanvas();
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  const Y = 70;
  drawEyebrow(ctx, 'ONE SLOT PER WEEK', 280 + Y);

  ctx.textAlign = 'center';
  ctx.fillStyle = WHITE;
  ctx.font = F_H1;
  ctx.fillText('Your site,', W/2, 360 + Y);
  ctx.fillStyle = ORANGE;
  ctx.font = '64px "Instrument Serif Italic"';
  ctx.fillText('next week.', W/2, 430 + Y);

  // Subhead
  ctx.fillStyle = FG3;
  ctx.font = F_SUB;
  ctx.fillText('DM the word "launch" and I\'ll send the brief.', W/2, 510 + Y);

  // CTA pill button — text + manually-drawn arrow (Space Grotesk has no → glyph)
  ctx.font = '24px "Space Grotesk Bold"';
  const btnText = 'Book a slot';
  const btnPad = 40;
  const arrowGap = 14;
  const arrowLen = 28;
  const btnTextW = ctx.measureText(btnText).width;
  const btnW = btnTextW + arrowGap + arrowLen + btnPad * 2;
  const btnH = 64;
  const btnX = (W - btnW) / 2;
  const btnY = 590 + Y;

  // Button shadow — keep tight so it doesn't bleed past canvas edges
  ctx.save();
  ctx.shadowColor = 'rgba(242,107,26,0.40)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = ORANGE;
  roundRect(ctx, btnX, btnY, btnW, btnH, btnH / 2);
  ctx.fill();
  ctx.restore();

  // Text (left-aligned within the button so arrow sits to its right)
  ctx.fillStyle = '#1a0d04';
  ctx.font = '24px "Space Grotesk Bold"';
  ctx.textAlign = 'left';
  ctx.fillText(btnText, btnX + btnPad, btnY + 41);

  // Vector arrow → drawn as path
  const arrowX = btnX + btnPad + btnTextW + arrowGap;
  const arrowY = btnY + btnH / 2;
  const headSize = 7;
  ctx.strokeStyle = '#1a0d04';
  ctx.fillStyle   = '#1a0d04';
  ctx.lineWidth   = 3;
  ctx.lineCap     = 'round';
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX + arrowLen, arrowY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(arrowX + arrowLen, arrowY);
  ctx.lineTo(arrowX + arrowLen - headSize, arrowY - headSize);
  ctx.lineTo(arrowX + arrowLen - headSize, arrowY + headSize);
  ctx.closePath();
  ctx.fill();

  // Mono handle
  ctx.fillStyle = FG3;
  ctx.font = '18px "JetBrains Mono Medium"';
  fillSpaced(ctx, '@FASTLAUNCHMVP', W/2, btnY + btnH + 60, 3);

  drawFooter(ctx);
  save(canvas, 'aramas-06-cta.png');
}

// ── SLIDE 7 — STATEMENT ───────────────────────────────────────────────────────
async function slide7(hero, logo) {
  const { canvas, ctx } = baseCanvas();
  drawTopbar(ctx);

  // Faded background hero
  ctx.save();
  ctx.globalAlpha = 0.10;
  const bH = Math.round(W * hero.height / hero.width);
  ctx.drawImage(hero, 0, (H - bH) / 2, W, bH);
  ctx.restore();
  // Overlay fade
  const ov = ctx.createLinearGradient(0,0,0,H);
  ov.addColorStop(0, 'rgba(17,13,10,0.97)');
  ov.addColorStop(0.3, 'rgba(17,13,10,0.70)');
  ov.addColorStop(0.7, 'rgba(17,13,10,0.70)');
  ov.addColorStop(1, 'rgba(17,13,10,0.97)');
  ctx.fillStyle = ov;
  ctx.fillRect(0, 0, W, H);

  drawLogoBlock(ctx, logo);

  const Y = 95;
  drawEyebrow(ctx, 'NO AGENCIES.  NO RETAINERS.', 250 + Y);

  // Orange rule
  ctx.fillStyle = ORANGE;
  ctx.fillRect(W/2 - 30, 300 + Y, 60, 4);

  // Headlines
  ctx.textAlign = 'center';
  ctx.fillStyle = WHITE;
  ctx.font = F_H1;
  ctx.fillText('Real builds.', W/2, 400 + Y);
  ctx.fillText('Real launches.', W/2, 470 + Y);
  ctx.fillStyle = ORANGE;
  ctx.fillText('Real fast.', W/2, 540 + Y);

  // Subhead
  ctx.fillStyle = FG3;
  ctx.font = F_SUB;
  const lines = ['One operator. One sprint.', 'Your site, live before the month is out.'];
  lines.forEach((l, i) => ctx.fillText(l, W/2, 640 + Y + i * 40));

  drawFooter(ctx);
  save(canvas, 'aramas-07-statement.png');
}

// ── Run ───────────────────────────────────────────────────────────────────────
async function run() {
  const [hero, home, prop, logo] = await Promise.all([
    loadImage(HERO), loadImage(HOME), loadImage(PROP), loadImage(LOGO)
  ]);
  await slide1(hero, logo);
  await slide2(home, logo);
  await slide3(logo);
  await slide4(logo);
  await slide5(logo);
  await slide6(logo);
  await slide7(hero, logo);
  console.log('\nAll 7 square slides done →', OUT);
}

run().catch(e => { console.error(e.message); process.exit(1); });
