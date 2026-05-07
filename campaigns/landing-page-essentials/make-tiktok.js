/**
 * make-tiktok.js — "5 things every landing page needs" TikTok deck (1080×1920)
 * Educational content type · LIGHT theme (cream + orange) per Fast Launch spec
 */
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs   = require('fs');
const path = require('path');

const ROOT  = path.join(__dirname, '..', '..');
const FONTS = path.join(ROOT, 'fonts');

registerFont(path.join(FONTS, 'SpaceGrotesk-Bold.ttf'),       { family: 'Space Grotesk Bold' });
registerFont(path.join(FONTS, 'SpaceGrotesk-Medium.ttf'),     { family: 'Space Grotesk Medium' });
registerFont(path.join(FONTS, 'InstrumentSerif-Italic.ttf'),  { family: 'Instrument Serif Italic' });
registerFont(path.join(FONTS, 'JetBrainsMono-Medium.ttf'),    { family: 'JetBrains Mono Medium' });

const W = 1080, H = 1920;

// ── LIGHT THEME tokens (per spec §3.1 Theme B) ───────────────────────────────
const ORANGE   = '#F26B1A';
const ORANGE_DEEP = '#C9540F';
const INK_1    = '#110D0A';                      // primary text (warm-black)
const INK_2    = 'rgba(17,13,10,0.72)';          // secondary text
const INK_3    = 'rgba(17,13,10,0.50)';          // tertiary text
const PAPER_1  = '#F7F1E8';                      // page background — warm cream
const PAPER_2  = '#EFE8DB';                      // card surface
const PAPER_3  = '#E5DCC9';                      // raised
const HAIRLINE = 'rgba(17,13,10,0.10)';

const LOGO = path.join(ROOT, 'brand', 'logo-mark.png');
const OUT  = path.join(__dirname, 'exports', 'tiktok');

// ── Helpers ───────────────────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

function fillSpaced(ctx, text, x, y, spacing, align='center') {
  const chars = text.split('');
  const widths = chars.map(c => ctx.measureText(c).width);
  const total = widths.reduce((s, w) => s + w, 0) + spacing * (chars.length - 1);
  let cursor = align === 'center' ? x - total / 2 : (align === 'right' ? x - total : x);
  ctx.textAlign = 'left';
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], cursor, y);
    cursor += widths[i] + spacing;
  }
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
  ctx.fillStyle = PAPER_1;
  ctx.fillRect(0, 0, W, H);
  return { canvas, ctx };
}

function drawTopbar(ctx) {
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 0, W, 6);
}

function drawLogoBlock(ctx, logo) {
  // Light theme: lightning bolt stays orange (per spec §3.1 light theme rules)
  const logoSize = 64;
  const logoY = 60;
  ctx.drawImage(logo, (W - logoSize) / 2, logoY, logoSize, logoSize);
  ctx.fillStyle = INK_1;
  ctx.font = 'bold 32px "Space Grotesk Bold"';
  ctx.textAlign = 'center';
  ctx.fillText('Fast Launch', W / 2, logoY + logoSize + 38);
  return logoY + logoSize + 38 + 16;
}

function drawFooter(ctx) {
  ctx.fillStyle = INK_3;
  ctx.font = '500 26px "JetBrains Mono Medium"';
  ctx.textAlign = 'center';
  fillSpaced(ctx, 'FASTLAUNCHMVP.COM', W / 2, H - 60, 4);
}

function drawEyebrow(ctx, text, y) {
  ctx.fillStyle = ORANGE;
  ctx.font = '500 22px "JetBrains Mono Medium"';
  fillSpaced(ctx, text, W / 2, y, 4);
}

function save(canvas, name) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), canvas.toBuffer('image/png'));
  console.log('Saved:', name);
}

// ── DOODLES — coloured line illustrations ────────────────────────────────────
// Palette (real-world colours, used alongside brand ORANGE for accents)
const C = {
  red:        '#E84A4A',  // alert / cross / stopwatch hand
  redDot:     '#FF5F57',  // browser close button
  amber:      '#F59E0B',  // lightning, stamp
  amberDot:   '#FEBC2E',  // browser minimise button
  gold:       '#F5C518',  // 5-star rating
  green:      '#22C55E',  // success, tick, CTA-positive
  greenDot:   '#28C840',  // browser maximise button
  ink:        '#1E293B',  // slate-900 — primary illustration ink
  greySoft:   '#94A3B8',  // slate-400 — secondary lines
  greyFaint:  '#CBD5E1',  // slate-300 — disabled lines
  greyFill:   '#E5E7EB',  // neutral fill
  paperBlue:  '#F1F5F9',  // off-white blue tint (paper feel)
  white:      '#FFFFFF',
};

function setupDoodleStroke(ctx, color = C.ink, width = 4) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

// Slide 2 — "Value prop above the fold"
// Browser window with traffic-light dots, peach hero block, dashed red FOLD line
function drawDoodleAboveFold(ctx, cx, cy) {
  ctx.save();
  const w = 380, h = 240;
  const x = cx - w / 2, y = cy - h / 2;

  // Browser body — paper-blue fill, slate stroke
  ctx.fillStyle = C.paperBlue;
  ctx.fillRect(x, y, w, h);
  setupDoodleStroke(ctx, C.greySoft, 3);
  ctx.strokeRect(x, y, w, h);
  // Top bar separator
  ctx.beginPath();
  ctx.moveTo(x, y + 28);
  ctx.lineTo(x + w, y + 28);
  ctx.stroke();

  // Traffic-light window dots — classic red/amber/green
  [
    [16, C.redDot],
    [38, C.amberDot],
    [60, C.greenDot],
  ].forEach(([dx, color]) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + dx, y + 14, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // HERO block (above fold) — peach/orange placeholder showing brand
  ctx.fillStyle = '#FED7AA'; // orange-200
  ctx.fillRect(x + 24, y + 50, w - 48, 70);
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x + 24, y + 50, w - 48, 70);

  // Sub-content lines (above fold) — slate
  ctx.strokeStyle = C.greySoft;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 24, y + 138); ctx.lineTo(x + w - 80, y + 138);
  ctx.moveTo(x + 24, y + 154); ctx.lineTo(x + w - 120, y + 154);
  ctx.stroke();

  // FOLD line — dashed red (alert / boundary)
  ctx.save();
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = C.red;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 10, y + 178);
  ctx.lineTo(x + w + 10, y + 178);
  ctx.stroke();
  ctx.restore();

  // "FOLD" label — red
  ctx.fillStyle = C.red;
  ctx.font = 'bold 13px "JetBrains Mono Medium"';
  ctx.textAlign = 'center';
  ctx.fillText('FOLD', x + w + 36, y + 182);

  // Below-fold faint scribbles — light grey
  ctx.strokeStyle = C.greyFaint;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 24, y + 200); ctx.lineTo(x + w - 60, y + 200);
  ctx.moveTo(x + 24, y + 218); ctx.lineTo(x + w - 100, y + 218);
  ctx.stroke();

  ctx.restore();
}

// Slide 3 — "One CTA, repeated"
// Two greyed-out buttons (red X), one highlighted green button with white tick
function drawDoodleOneCTA(ctx, cx, cy) {
  ctx.save();
  const btnW = 220, btnH = 60, gap = 24;
  const startY = cy - (btnH * 3 + gap * 2) / 2;

  function drawPillButton(yPos, fillColor, strokeColor) {
    const r = btnH / 2;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - btnW/2 + r, yPos);
    ctx.lineTo(cx + btnW/2 - r, yPos);
    ctx.quadraticCurveTo(cx + btnW/2, yPos, cx + btnW/2, yPos + r);
    ctx.lineTo(cx + btnW/2, yPos + btnH - r);
    ctx.quadraticCurveTo(cx + btnW/2, yPos + btnH, cx + btnW/2 - r, yPos + btnH);
    ctx.lineTo(cx - btnW/2 + r, yPos + btnH);
    ctx.quadraticCurveTo(cx - btnW/2, yPos + btnH, cx - btnW/2, yPos + btnH - r);
    ctx.lineTo(cx - btnW/2, yPos + r);
    ctx.quadraticCurveTo(cx - btnW/2, yPos, cx - btnW/2 + r, yPos);
    ctx.closePath();
    if (fillColor !== 'transparent') ctx.fill();
    ctx.stroke();
  }

  function drawCross(yPos) {
    ctx.strokeStyle = C.red;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    const cxc = cx - btnW/2 + 22; // cross sits at left of button
    const cyc = yPos + btnH/2;
    const s = 9;
    ctx.beginPath();
    ctx.moveTo(cxc - s, cyc - s); ctx.lineTo(cxc + s, cyc + s);
    ctx.moveTo(cxc + s, cyc - s); ctx.lineTo(cxc - s, cyc + s);
    ctx.stroke();
  }

  // Btn 1 — greyed out (rejected option)
  drawPillButton(startY, C.greyFill, C.greySoft);
  drawCross(startY);

  // Btn 2 — HIGHLIGHTED (green = the chosen one)
  const y2 = startY + btnH + gap;
  drawPillButton(y2, C.green, C.green);
  // White tick
  ctx.strokeStyle = C.white;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 14, y2 + btnH/2);
  ctx.lineTo(cx - 4, y2 + btnH/2 + 10);
  ctx.lineTo(cx + 18, y2 + btnH/2 - 12);
  ctx.stroke();

  // Btn 3 — greyed out (rejected option)
  const y3 = y2 + btnH + gap;
  drawPillButton(y3, C.greyFill, C.greySoft);
  drawCross(y3);

  ctx.restore();
}

// Slide 4 — "Real social proof"
// 5 gold stars + white speech bubble with dark quote marks
function drawDoodleStars(ctx, cx, cy) {
  ctx.save();

  // 5 gold stars in a row
  const starSize = 38;
  const starGap = 14;
  const totalW = starSize * 5 + starGap * 4;
  let sx = cx - totalW / 2 + starSize / 2;
  const sy = cy - 80;

  for (let i = 0; i < 5; i++) {
    drawStar(ctx, sx, sy, starSize / 2, C.gold, true);
    sx += starSize + starGap;
  }

  // Speech bubble below — white with slate stroke
  const bubbleW = 280, bubbleH = 100;
  const bx = cx - bubbleW / 2;
  const by = cy + 0;
  const br = 16;

  ctx.fillStyle = C.white;
  ctx.strokeStyle = C.greySoft;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(bx + br, by);
  ctx.lineTo(bx + bubbleW - br, by);
  ctx.quadraticCurveTo(bx + bubbleW, by, bx + bubbleW, by + br);
  ctx.lineTo(bx + bubbleW, by + bubbleH - br);
  ctx.quadraticCurveTo(bx + bubbleW, by + bubbleH, bx + bubbleW - br, by + bubbleH);
  // Tail
  ctx.lineTo(bx + bubbleW * 0.55, by + bubbleH);
  ctx.lineTo(bx + bubbleW * 0.45, by + bubbleH + 22);
  ctx.lineTo(bx + bubbleW * 0.45, by + bubbleH);
  ctx.lineTo(bx + br, by + bubbleH);
  ctx.quadraticCurveTo(bx, by + bubbleH, bx, by + bubbleH - br);
  ctx.lineTo(bx, by + br);
  ctx.quadraticCurveTo(bx, by, bx + br, by);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Quote marks inside bubble — dark ink
  ctx.fillStyle = C.ink;
  ctx.font = 'bold 60px "Instrument Serif Italic"';
  ctx.textAlign = 'center';
  ctx.fillText('“ ”', cx, by + 64);

  ctx.restore();
}

function drawStar(ctx, cx, cy, r, color, fill) {
  const pts = 5;
  const inner = r * 0.45;
  ctx.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const radius = i % 2 === 0 ? r : inner;
    const angle = (Math.PI / pts) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

// Slide 5 — "Friction-free contact"
// White envelope with slate outline + green checkmark badge
function drawDoodleContact(ctx, cx, cy) {
  ctx.save();
  const envW = 260, envH = 170;
  const ex = cx - envW / 2;
  const ey = cy - envH / 2 + 10;

  // Envelope body — white with slate stroke
  ctx.fillStyle = C.white;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillRect(ex, ey, envW, envH);
  ctx.strokeRect(ex, ey, envW, envH);

  // Envelope flap (V shape from corners to centre)
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex + envW / 2, ey + envH * 0.55);
  ctx.lineTo(ex + envW, ey);
  ctx.stroke();

  // Hinge lines from bottom corners to flap centre
  ctx.beginPath();
  ctx.moveTo(ex, ey + envH);
  ctx.lineTo(ex + envW * 0.4, ey + envH * 0.5);
  ctx.moveTo(ex + envW, ey + envH);
  ctx.lineTo(ex + envW * 0.6, ey + envH * 0.5);
  ctx.stroke();

  // Green checkmark badge — top right of envelope
  const bx = ex + envW + 8;
  const by = ey - 18;
  const br = 32;
  ctx.fillStyle = C.green;
  ctx.beginPath();
  ctx.arc(bx, by, br, 0, Math.PI * 2);
  ctx.fill();
  // White tick
  ctx.strokeStyle = C.white;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(bx - 12, by + 1);
  ctx.lineTo(bx - 3, by + 11);
  ctx.lineTo(bx + 14, by - 9);
  ctx.stroke();

  ctx.restore();
}

// Slide 6 — "Sub-2-second load"
// Realistic stopwatch (silver body, white face, red hand) + amber lightning
function drawDoodleStopwatch(ctx, cx, cy) {
  ctx.save();
  setupDoodleStroke(ctx, C.ink, 4);

  const r = 90;
  // Crown / button on top — silver
  ctx.fillStyle = C.greySoft;
  ctx.fillRect(cx - 12, cy - r - 22, 24, 16);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(cx - 12, cy - r - 22, 24, 16);
  // Top loop (the tag)
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - r - 22);
  ctx.lineTo(cx - 8, cy - r - 32);
  ctx.lineTo(cx + 8, cy - r - 32);
  ctx.lineTo(cx + 8, cy - r - 22);
  ctx.stroke();
  // Left side button
  ctx.beginPath();
  ctx.moveTo(cx - r - 8, cy - r * 0.65);
  ctx.lineTo(cx - r - 16, cy - r * 0.7);
  ctx.lineTo(cx - r - 16, cy - r * 0.55);
  ctx.lineTo(cx - r - 8, cy - r * 0.5);
  ctx.stroke();

  // Watch face — white with dark border
  ctx.fillStyle = C.white;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Tick marks at 12/3/6/9 positions — dark ink
  ctx.lineWidth = 3;
  ctx.strokeStyle = C.ink;
  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((a) => {
    const x1 = cx + Math.cos(a - Math.PI / 2) * (r - 12);
    const y1 = cy + Math.sin(a - Math.PI / 2) * (r - 12);
    const x2 = cx + Math.cos(a - Math.PI / 2) * (r - 4);
    const y2 = cy + Math.sin(a - Math.PI / 2) * (r - 4);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // Hand — bright red (classic stopwatch hand)
  ctx.strokeStyle = C.red;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const handAngle = -Math.PI / 2 + Math.PI * 0.18;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(handAngle) * (r - 18), cy + Math.sin(handAngle) * (r - 18));
  ctx.stroke();
  // Centre pin — dark
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fill();

  // "2s" label inside, top-centre — dark
  ctx.fillStyle = C.ink;
  ctx.font = 'bold 22px "Space Grotesk Bold"';
  ctx.textAlign = 'center';
  ctx.fillText('2s', cx, cy - r * 0.45);

  // Lightning bolt next to stopwatch — amber/yellow (electric)
  ctx.save();
  ctx.translate(cx + r + 60, cy);
  ctx.fillStyle = C.amber;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.lineTo(-22, 4);
  ctx.lineTo(-4, 4);
  ctx.lineTo(-12, 50);
  ctx.lineTo(22, -8);
  ctx.lineTo(4, -8);
  ctx.lineTo(14, -50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

// ── SLIDE 1 — HOOK ────────────────────────────────────────────────────────────
async function slide1(logo) {
  const { canvas, ctx } = baseCanvas();
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  // Vertical centring (excluding logo + footer)
  const TOP_BOUND    = 200;
  const BOTTOM_BOUND = H - 130;

  // Block heights for centring math
  const EYEBROW_H = 30;
  const GAP1 = 60;          // eyebrow → headline
  const HEADLINE_H = 420;   // 3 stacked headline lines
  const GAP2 = 50;          // headline → subhead
  const SUBHEAD_H = 56 * 2; // 2 lines
  const GAP3 = 60;          // subhead → big "5"
  const BIG_5_H = 460;      // visual height of decorative "5"
  const GAP4 = 50;          // big "5" → swipe indicator
  const SWIPE_H = 40;
  const totalH = EYEBROW_H + GAP1 + HEADLINE_H + GAP2 + SUBHEAD_H + GAP3 + BIG_5_H + GAP4 + SWIPE_H;
  const startY = TOP_BOUND + Math.max(0, (BOTTOM_BOUND - TOP_BOUND - totalH) / 2);

  let y = startY;

  drawEyebrow(ctx, 'FOR FOUNDERS & MARKETERS', y + EYEBROW_H - 6);
  y += EYEBROW_H + GAP1;

  ctx.textAlign = 'center';

  // Headline: "5 Things Every / *Landing Page* Needs."
  ctx.fillStyle = INK_1;
  ctx.font = 'bold 110px "Space Grotesk Bold"';
  ctx.fillText('5 Things Every', W / 2, y + 100);

  ctx.fillStyle = ORANGE;
  ctx.font = 'italic 124px "Instrument Serif Italic"';
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 2.5;
  ctx.strokeText('Landing Page', W / 2, y + 240);
  ctx.fillText('Landing Page', W / 2, y + 240);

  ctx.fillStyle = INK_1;
  ctx.font = 'bold 110px "Space Grotesk Bold"';
  ctx.fillText('Needs.', W / 2, y + 380);

  y += HEADLINE_H + GAP2;

  // Subhead
  ctx.fillStyle = INK_2;
  ctx.font = 'italic 44px "Instrument Serif Italic"';
  const subLines = ['Get these right and your', 'conversion rate doubles.'];
  subLines.forEach((l, i) => ctx.fillText(l, W / 2, y + 36 + i * 56));

  y += SUBHEAD_H + GAP3;

  // Decorative big "5"
  ctx.save();
  ctx.fillStyle = 'rgba(242,107,26,0.10)';
  ctx.font = 'bold 700px "Space Grotesk Bold"';
  ctx.textAlign = 'center';
  ctx.fillText('5', W / 2, y + BIG_5_H - 80);
  ctx.restore();

  y += BIG_5_H + GAP4;

  // Swipe indicator — text + manually-drawn arrow (mono fonts lack →)
  ctx.fillStyle = ORANGE;
  ctx.font = '500 28px "JetBrains Mono Medium"';
  const swipeText = 'SWIPE';
  const swipeY = y + 28;
  const swipeArrowGap = 20;
  const swipeArrowLen = 30;
  // Letter-spaced text width
  const swipeChars = swipeText.split('');
  const sw = swipeChars.reduce((s, c) => s + ctx.measureText(c).width, 0) + 4 * (swipeChars.length - 1);
  const totalSwipeW = sw + swipeArrowGap + swipeArrowLen;
  const swipeStartX = (W - totalSwipeW) / 2;

  // Draw "SWIPE" with letter-spacing
  let cursor = swipeStartX;
  ctx.textAlign = 'left';
  for (const c of swipeChars) {
    ctx.fillText(c, cursor, swipeY);
    cursor += ctx.measureText(c).width + 4;
  }
  // Draw vector arrow
  const swipeArrowX = swipeStartX + sw + swipeArrowGap;
  const swipeArrowY = swipeY - 9;
  const swipeHeadSize = 8;
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(swipeArrowX, swipeArrowY);
  ctx.lineTo(swipeArrowX + swipeArrowLen, swipeArrowY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(swipeArrowX + swipeArrowLen, swipeArrowY);
  ctx.lineTo(swipeArrowX + swipeArrowLen - swipeHeadSize, swipeArrowY - swipeHeadSize);
  ctx.lineTo(swipeArrowX + swipeArrowLen - swipeHeadSize, swipeArrowY + swipeHeadSize);
  ctx.closePath();
  ctx.fill();

  drawFooter(ctx);
  save(canvas, 'slide-01-hook.png');
}

// ── HELPER for numbered insight slides (2-6) ─────────────────────────────────
// Layout is computed every time so the content block stays vertically centred
// between the logo bottom and footer top — regardless of body length, headline
// inline-vs-multiline, or whether a doodle is included.
function drawInsightSlide(ctx, logo, num, headline1, italicWord, headline2, body, doodleFn) {
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  // Vertical bounds for centred content (logo block ends ~y=180; footer at H-60)
  const TOP_BOUND    = 200;
  const BOTTOM_BOUND = H - 130;

  // ── Pre-measure body ──────────────────────────────────────────────────────
  ctx.font = '500 38px "Space Grotesk Medium"';
  const bodyLines = wrapText(ctx, body, W - 200);

  // ── Pre-measure headline (decide inline vs multi-line) ────────────────────
  ctx.font = 'bold 80px "Space Grotesk Bold"';
  const w1 = ctx.measureText(headline1).width;
  ctx.font = 'italic 92px "Instrument Serif Italic"';
  const wI = ctx.measureText(italicWord).width;
  ctx.font = 'bold 80px "Space Grotesk Bold"';
  const w2 = ctx.measureText(headline2).width;
  const inlineGap = 14;
  const inlineW = w1 + (headline1 ? inlineGap : 0) + wI + (headline2 ? inlineGap : 0) + w2;
  const isInline = inlineW <= W - 140;

  // ── Block heights (visual estimates; fine-tuned for current type scale) ──
  const NUMERAL_BLOCK_H = 250;                    // numeral + orange rule
  const GAP_NUM_TO_HL   = 110;                    // numeral block bottom → headline top
  const HEADLINE_H      = isInline ? 100 : 290;   // 1-line vs 3-line stack
  const GAP_HL_TO_BODY  = 70;
  const BODY_H          = bodyLines.length * 56;
  const GAP_BODY_TO_DOODLE = doodleFn ? 90 : 0;
  const DOODLE_H        = doodleFn ? 260 : 0;

  const totalH = NUMERAL_BLOCK_H + GAP_NUM_TO_HL + HEADLINE_H +
                 GAP_HL_TO_BODY + BODY_H + GAP_BODY_TO_DOODLE + DOODLE_H;

  // Centre the whole block between the bounds
  const startY = TOP_BOUND + Math.max(0, (BOTTOM_BOUND - TOP_BOUND - totalH) / 2);

  let cursorY = startY;

  // ── 1. Big orange numeral ────────────────────────────────────────────────
  ctx.fillStyle = ORANGE;
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 3;
  ctx.font = 'italic 280px "Instrument Serif Italic"';
  ctx.textAlign = 'center';
  const numeralBaselineY = cursorY + 200;
  ctx.strokeText(num, W / 2, numeralBaselineY);
  ctx.fillText(num, W / 2, numeralBaselineY);

  // Orange rule
  ctx.fillStyle = ORANGE;
  ctx.fillRect(W / 2 - 60, numeralBaselineY + 45, 120, 4);

  cursorY += NUMERAL_BLOCK_H + GAP_NUM_TO_HL;

  // ── 2. Headline ──────────────────────────────────────────────────────────
  if (isInline) {
    const headlineBaselineY = cursorY + 70;
    ctx.textAlign = 'left'; // critical: must be left for cursor-based inline rendering
    let x = (W - inlineW) / 2;
    if (headline1) {
      ctx.fillStyle = INK_1; ctx.font = 'bold 80px "Space Grotesk Bold"';
      ctx.fillText(headline1, x, headlineBaselineY);
      x += w1 + inlineGap;
    }
    ctx.fillStyle = ORANGE; ctx.font = 'italic 92px "Instrument Serif Italic"';
    ctx.lineWidth = 2.4;
    ctx.strokeText(italicWord, x, headlineBaselineY + 6);
    ctx.fillText(italicWord, x, headlineBaselineY + 6);
    x += wI + (headline2 ? inlineGap : 0);
    if (headline2) {
      ctx.fillStyle = INK_1; ctx.font = 'bold 80px "Space Grotesk Bold"';
      ctx.fillText(headline2, x, headlineBaselineY);
    }
  } else {
    ctx.textAlign = 'center';
    const baseY = cursorY + 70;
    ctx.fillStyle = INK_1; ctx.font = 'bold 80px "Space Grotesk Bold"';
    ctx.fillText(headline1, W / 2, baseY);
    ctx.fillStyle = ORANGE; ctx.font = 'italic 92px "Instrument Serif Italic"';
    ctx.lineWidth = 2.4;
    ctx.strokeText(italicWord, W / 2, baseY + 96);
    ctx.fillText(italicWord, W / 2, baseY + 96);
    ctx.fillStyle = INK_1; ctx.font = 'bold 80px "Space Grotesk Bold"';
    ctx.fillText(headline2, W / 2, baseY + 192);
  }

  cursorY += HEADLINE_H + GAP_HL_TO_BODY;

  // ── 3. Body text ─────────────────────────────────────────────────────────
  ctx.fillStyle = INK_2;
  ctx.font = '500 38px "Space Grotesk Medium"';
  ctx.textAlign = 'center';
  const bodyTop = cursorY;
  bodyLines.forEach((l, i) => ctx.fillText(l, W / 2, bodyTop + 36 + i * 56));

  cursorY += BODY_H;

  // ── 4. Doodle ────────────────────────────────────────────────────────────
  if (doodleFn) {
    cursorY += GAP_BODY_TO_DOODLE;
    doodleFn(ctx, W / 2, cursorY + DOODLE_H / 2);
  }

  drawFooter(ctx);
}

// ── SLIDES 2-6: numbered insights ────────────────────────────────────────────
async function slide2(logo) {
  const { canvas, ctx } = baseCanvas();
  drawInsightSlide(
    ctx, logo, '01',
    'A clear value prop', 'above', 'the fold.',
    'In one sentence. Specific to your buyer. If they have to think "wait, what does this do?" — you\'ve already lost them.',
    drawDoodleAboveFold
  );
  save(canvas, 'slide-02-value-prop.png');
}

async function slide3(logo) {
  const { canvas, ctx } = baseCanvas();
  drawInsightSlide(
    ctx, logo, '02',
    '', 'One', 'CTA — repeated.',
    'Don\'t offer "sign up", "book a demo", AND "contact sales" on the same page. Pick the action that matters most. Repeat it after every section.',
    drawDoodleOneCTA
  );
  save(canvas, 'slide-03-one-cta.png');
}

async function slide4(logo) {
  const { canvas, ctx } = baseCanvas();
  drawInsightSlide(
    ctx, logo, '03',
    '', 'Real social', 'proof.',
    'Logos. Named testimonials with photos. Specific numbers. "Trusted by thousands" is wallpaper. "200 founders shipped this month" sells.',
    drawDoodleStars
  );
  save(canvas, 'slide-04-social-proof.png');
}

async function slide5(logo) {
  const { canvas, ctx } = baseCanvas();
  drawInsightSlide(
    ctx, logo, '04',
    'Friction-free', 'contact.', '',
    'Email visible. Calendar embedded. Form has 4 fields max. If they have to dig to talk to you, they won\'t bother.',
    drawDoodleContact
  );
  save(canvas, 'slide-05-friction-free.png');
}

async function slide6(logo) {
  const { canvas, ctx } = baseCanvas();
  drawInsightSlide(
    ctx, logo, '05',
    'Sub-2-second', 'load time.', '',
    'Every extra second costs ~7% of conversions. Optimise images. Lazy-load below the fold. Self-host fonts. Run Lighthouse weekly.',
    drawDoodleStopwatch
  );
  save(canvas, 'slide-06-load-speed.png');
}

// ── SLIDE 7 — CTA / CLOSER ───────────────────────────────────────────────────
async function slide7(logo) {
  const { canvas, ctx } = baseCanvas();
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  // Vertical centring
  const TOP_BOUND = 200, BOTTOM_BOUND = H - 130;
  const EYEBROW_H = 30;
  const GAP1 = 80;
  const HEADLINE_H = 280;   // 2-line headline
  const GAP2 = 60;
  const SUBHEAD_H = 52 * 2;
  const GAP3 = 90;
  const BTN_H = 116;
  const GAP4 = 80;
  const HANDLE_H = 28;
  const totalH = EYEBROW_H + GAP1 + HEADLINE_H + GAP2 + SUBHEAD_H + GAP3 + BTN_H + GAP4 + HANDLE_H;
  const startY = TOP_BOUND + Math.max(0, (BOTTOM_BOUND - TOP_BOUND - totalH) / 2);

  let y = startY;

  drawEyebrow(ctx, 'WANT ONE THAT DOES ALL 5?', y + EYEBROW_H - 6);
  y += EYEBROW_H + GAP1;

  // Big closer headline
  ctx.textAlign = 'center';
  ctx.fillStyle = INK_1;
  ctx.font = 'bold 116px "Space Grotesk Bold"';
  ctx.fillText('We build them', W / 2, y + 100);

  ctx.fillStyle = ORANGE;
  ctx.font = 'italic 130px "Instrument Serif Italic"';
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 3;
  ctx.strokeText('in 6 days.', W / 2, y + 260);
  ctx.fillText('in 6 days.', W / 2, y + 260);

  y += HEADLINE_H + GAP2;

  // Subhead
  ctx.fillStyle = INK_2;
  ctx.font = 'italic 42px "Instrument Serif Italic"';
  ctx.fillText('Custom landing pages that convert —', W / 2, y + 36);
  ctx.fillText('shipped fast, owned by you.', W / 2, y + 88);

  y += SUBHEAD_H + GAP3;

  // Orange pill CTA button
  ctx.font = 'bold 44px "Space Grotesk Bold"';
  const btnText = 'fastlaunchmvp.com';
  const btnPad = 60;
  const arrowGap = 20;
  const arrowLen = 44;
  const btnTextW = ctx.measureText(btnText).width;
  const btnW = btnTextW + arrowGap + arrowLen + btnPad * 2;
  const btnH = BTN_H;
  const btnX = (W - btnW) / 2;
  const btnY = y;

  ctx.save();
  ctx.shadowColor = 'rgba(242,107,26,0.40)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = ORANGE;
  roundRect(ctx, btnX, btnY, btnW, btnH, btnH / 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#1a0d04';
  ctx.font = 'bold 44px "Space Grotesk Bold"';
  ctx.textAlign = 'left';
  ctx.fillText(btnText, btnX + btnPad, btnY + 76);

  // Vector arrow
  const arrowX = btnX + btnPad + btnTextW + arrowGap;
  const arrowY = btnY + btnH / 2;
  const headSize = 12;
  ctx.strokeStyle = '#1a0d04';
  ctx.fillStyle = '#1a0d04';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
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
  y += BTN_H + GAP4;
  ctx.fillStyle = INK_3;
  ctx.font = '500 28px "JetBrains Mono Medium"';
  ctx.textAlign = 'center';
  fillSpaced(ctx, '@FASTLAUNCHMVP', W / 2, y + 22, 4);

  drawFooter(ctx);
  save(canvas, 'slide-07-cta.png');
}

// ── Run ───────────────────────────────────────────────────────────────────────
async function run() {
  const logo = await loadImage(LOGO);
  await slide1(logo);
  await slide2(logo);
  await slide3(logo);
  await slide4(logo);
  await slide5(logo);
  await slide6(logo);
  await slide7(logo);
  console.log('\nAll 7 TikTok slides done →', OUT);
}

run().catch(e => { console.error(e.message); process.exit(1); });
