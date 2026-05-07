/**
 * make-square.js — "5 things every landing page needs" Square deck (1080×1080)
 * For Instagram + LinkedIn · Educational · LIGHT theme
 *
 * Reflowed from make-tiktok.js per Fast Launch CLAUDE.md spec:
 *  - Type scale reduces ~30-40%
 *  - Vertical centring (TOP_BOUND -> BOTTOM_BOUND)
 *  - Logo and footer stay fixed; everything else flows
 *  - Output saved to exports/instagram/ AND mirrored to exports/linkedin/
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

const W = 1080, H = 1080;

// ── LIGHT THEME tokens ───────────────────────────────────────────────────────
const ORANGE   = '#F26B1A';
const INK_1    = '#110D0A';
const INK_2    = 'rgba(17,13,10,0.72)';
const INK_3    = 'rgba(17,13,10,0.50)';
const PAPER_1  = '#F7F1E8';

// ── Real-world doodle palette ────────────────────────────────────────────────
const C = {
  red: '#E84A4A', redDot: '#FF5F57',
  amber: '#F59E0B', amberDot: '#FEBC2E',
  gold: '#F5C518',
  green: '#22C55E', greenDot: '#28C840',
  ink: '#1E293B',
  greySoft: '#94A3B8', greyFaint: '#CBD5E1', greyFill: '#E5E7EB',
  paperBlue: '#F1F5F9', white: '#FFFFFF',
};

const LOGO    = path.join(ROOT, 'brand', 'logo-mark.png');
const OUT_IG  = path.join(__dirname, 'exports', 'instagram');
const OUT_LI  = path.join(__dirname, 'exports', 'linkedin');

// ── Vertical centring bounds (per CLAUDE.md spec) ────────────────────────────
const TOP_BOUND    = 116;
const BOTTOM_BOUND = 1010;

// ── Helpers ──────────────────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

function fillSpaced(ctx, text, x, y, spacing) {
  const chars = text.split('');
  const widths = chars.map(c => ctx.measureText(c).width);
  const total = widths.reduce((s, w) => s + w, 0) + spacing * (chars.length - 1);
  let cursor = x - total / 2;
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
  ctx.fillRect(0, 0, W, 4);
}

function drawLogoBlock(ctx, logo) {
  const logoSize = 44;
  const logoY = 32;
  ctx.drawImage(logo, (W - logoSize) / 2, logoY, logoSize, logoSize);
  ctx.fillStyle = INK_1;
  ctx.font = 'bold 22px "Space Grotesk Bold"';
  ctx.textAlign = 'center';
  ctx.fillText('Fast Launch', W / 2, logoY + logoSize + 26);
}

function drawFooter(ctx) {
  ctx.fillStyle = INK_3;
  ctx.font = '500 17px "JetBrains Mono Medium"';
  ctx.textAlign = 'center';
  fillSpaced(ctx, 'FASTLAUNCHMVP.COM', W / 2, H - 32, 3);
}

function drawEyebrow(ctx, text, y) {
  ctx.fillStyle = ORANGE;
  ctx.font = '500 15px "JetBrains Mono Medium"';
  fillSpaced(ctx, text, W / 2, y, 3);
}

function saveBoth(canvas, name) {
  fs.mkdirSync(OUT_IG, { recursive: true });
  fs.mkdirSync(OUT_LI, { recursive: true });
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUT_IG, name), buf);
  fs.writeFileSync(path.join(OUT_LI, name), buf);
  console.log('Saved:', name, '(IG + LinkedIn)');
}

// ── DOODLES (smaller scale for square) ───────────────────────────────────────
function setupDoodleStroke(ctx, color = C.ink, width = 3) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

// Slide 2 — Browser window + above fold
function drawDoodleAboveFold(ctx, cx, cy) {
  ctx.save();
  const w = 260, h = 170;
  const x = cx - w / 2, y = cy - h / 2;

  ctx.fillStyle = C.paperBlue;
  ctx.fillRect(x, y, w, h);
  setupDoodleStroke(ctx, C.greySoft, 2);
  ctx.strokeRect(x, y, w, h);
  ctx.beginPath();
  ctx.moveTo(x, y + 20);
  ctx.lineTo(x + w, y + 20);
  ctx.stroke();

  // Traffic lights
  [[12, C.redDot], [27, C.amberDot], [42, C.greenDot]].forEach(([dx, color]) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + dx, y + 10, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Hero block
  ctx.fillStyle = '#FED7AA';
  ctx.fillRect(x + 16, y + 36, w - 32, 50);
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 16, y + 36, w - 32, 50);

  // Sub-content
  ctx.strokeStyle = C.greySoft;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 16, y + 100); ctx.lineTo(x + w - 56, y + 100);
  ctx.moveTo(x + 16, y + 112); ctx.lineTo(x + w - 88, y + 112);
  ctx.stroke();

  // FOLD dashed
  ctx.save();
  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = C.red;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 8, y + 128);
  ctx.lineTo(x + w + 8, y + 128);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = C.red;
  ctx.font = 'bold 10px "JetBrains Mono Medium"';
  ctx.textAlign = 'center';
  ctx.fillText('FOLD', x + w + 26, y + 131);

  // Below fold
  ctx.strokeStyle = C.greyFaint;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 16, y + 144); ctx.lineTo(x + w - 40, y + 144);
  ctx.moveTo(x + 16, y + 158); ctx.lineTo(x + w - 70, y + 158);
  ctx.stroke();

  ctx.restore();
}

// Slide 3 — One CTA
function drawDoodleOneCTA(ctx, cx, cy) {
  ctx.save();
  const btnW = 160, btnH = 42, gap = 16;
  const startY = cy - (btnH * 3 + gap * 2) / 2;

  function drawPillButton(yPos, fillColor, strokeColor) {
    const r = btnH / 2;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
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
    ctx.fill();
    ctx.stroke();
  }

  function drawCross(yPos) {
    ctx.strokeStyle = C.red;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    const cxc = cx - btnW/2 + 16;
    const cyc = yPos + btnH/2;
    const s = 6;
    ctx.beginPath();
    ctx.moveTo(cxc - s, cyc - s); ctx.lineTo(cxc + s, cyc + s);
    ctx.moveTo(cxc + s, cyc - s); ctx.lineTo(cxc - s, cyc + s);
    ctx.stroke();
  }

  drawPillButton(startY, C.greyFill, C.greySoft);
  drawCross(startY);

  const y2 = startY + btnH + gap;
  drawPillButton(y2, C.green, C.green);
  ctx.strokeStyle = C.white;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 10, y2 + btnH/2);
  ctx.lineTo(cx - 3, y2 + btnH/2 + 7);
  ctx.lineTo(cx + 12, y2 + btnH/2 - 8);
  ctx.stroke();

  const y3 = y2 + btnH + gap;
  drawPillButton(y3, C.greyFill, C.greySoft);
  drawCross(y3);

  ctx.restore();
}

// Slide 4 — Stars + bubble
function drawDoodleStars(ctx, cx, cy) {
  ctx.save();

  const starSize = 28, starGap = 10;
  const totalW = starSize * 5 + starGap * 4;
  let sx = cx - totalW / 2 + starSize / 2;
  const sy = cy - 56;

  for (let i = 0; i < 5; i++) {
    drawStar(ctx, sx, sy, starSize / 2, C.gold, true);
    sx += starSize + starGap;
  }

  const bubbleW = 200, bubbleH = 70;
  const bx = cx - bubbleW / 2;
  const by = cy - 18;
  const br = 12;

  ctx.fillStyle = C.white;
  ctx.strokeStyle = C.greySoft;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(bx + br, by);
  ctx.lineTo(bx + bubbleW - br, by);
  ctx.quadraticCurveTo(bx + bubbleW, by, bx + bubbleW, by + br);
  ctx.lineTo(bx + bubbleW, by + bubbleH - br);
  ctx.quadraticCurveTo(bx + bubbleW, by + bubbleH, bx + bubbleW - br, by + bubbleH);
  ctx.lineTo(bx + bubbleW * 0.55, by + bubbleH);
  ctx.lineTo(bx + bubbleW * 0.45, by + bubbleH + 16);
  ctx.lineTo(bx + bubbleW * 0.45, by + bubbleH);
  ctx.lineTo(bx + br, by + bubbleH);
  ctx.quadraticCurveTo(bx, by + bubbleH, bx, by + bubbleH - br);
  ctx.lineTo(bx, by + br);
  ctx.quadraticCurveTo(bx, by, bx + br, by);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = C.ink;
  ctx.font = 'bold 42px "Instrument Serif Italic"';
  ctx.textAlign = 'center';
  ctx.fillText('“ ”', cx, by + 46);

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
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

// Slide 5 — Envelope + checkmark
function drawDoodleContact(ctx, cx, cy) {
  ctx.save();
  const envW = 180, envH = 116;
  const ex = cx - envW / 2;
  const ey = cy - envH / 2 + 6;

  ctx.fillStyle = C.white;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillRect(ex, ey, envW, envH);
  ctx.strokeRect(ex, ey, envW, envH);

  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex + envW / 2, ey + envH * 0.55);
  ctx.lineTo(ex + envW, ey);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(ex, ey + envH);
  ctx.lineTo(ex + envW * 0.4, ey + envH * 0.5);
  ctx.moveTo(ex + envW, ey + envH);
  ctx.lineTo(ex + envW * 0.6, ey + envH * 0.5);
  ctx.stroke();

  // Green badge
  const bx = ex + envW + 6;
  const by = ey - 12;
  const br = 22;
  ctx.fillStyle = C.green;
  ctx.beginPath();
  ctx.arc(bx, by, br, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C.white;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(bx - 8, by + 1);
  ctx.lineTo(bx - 2, by + 8);
  ctx.lineTo(bx + 10, by - 6);
  ctx.stroke();

  ctx.restore();
}

// Slide 6 — Stopwatch + lightning
function drawDoodleStopwatch(ctx, cx, cy) {
  ctx.save();
  setupDoodleStroke(ctx, C.ink, 3);

  const r = 60;
  // Crown
  ctx.fillStyle = C.greySoft;
  ctx.fillRect(cx - 8, cy - r - 14, 16, 11);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - 8, cy - r - 14, 16, 11);
  // Top loop
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy - r - 14);
  ctx.lineTo(cx - 5, cy - r - 22);
  ctx.lineTo(cx + 5, cy - r - 22);
  ctx.lineTo(cx + 5, cy - r - 14);
  ctx.stroke();
  // Side button
  ctx.beginPath();
  ctx.moveTo(cx - r - 5, cy - r * 0.65);
  ctx.lineTo(cx - r - 11, cy - r * 0.7);
  ctx.lineTo(cx - r - 11, cy - r * 0.55);
  ctx.lineTo(cx - r - 5, cy - r * 0.5);
  ctx.stroke();

  // Face
  ctx.fillStyle = C.white;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Ticks
  ctx.lineWidth = 2.5;
  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((a) => {
    const x1 = cx + Math.cos(a - Math.PI / 2) * (r - 8);
    const y1 = cy + Math.sin(a - Math.PI / 2) * (r - 8);
    const x2 = cx + Math.cos(a - Math.PI / 2) * (r - 3);
    const y2 = cy + Math.sin(a - Math.PI / 2) * (r - 3);
    ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // Red hand
  ctx.strokeStyle = C.red;
  ctx.lineWidth = 3.5;
  const handAngle = -Math.PI / 2 + Math.PI * 0.18;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(handAngle) * (r - 12), cy + Math.sin(handAngle) * (r - 12));
  ctx.stroke();
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  // 2s label
  ctx.fillStyle = C.ink;
  ctx.font = 'bold 16px "Space Grotesk Bold"';
  ctx.textAlign = 'center';
  ctx.fillText('2s', cx, cy - r * 0.45);

  // Lightning
  ctx.save();
  ctx.translate(cx + r + 38, cy);
  ctx.fillStyle = C.amber;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -32); ctx.lineTo(-14, 3); ctx.lineTo(-3, 3);
  ctx.lineTo(-8, 32); ctx.lineTo(14, -5); ctx.lineTo(3, -5);
  ctx.lineTo(9, -32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

// ── INSIGHT SLIDE HELPER (centred) ───────────────────────────────────────────
function drawInsightSlide(ctx, logo, num, headline1, italicWord, headline2, body, doodleFn) {
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  ctx.font = '500 22px "Space Grotesk Medium"';
  const bodyLines = wrapText(ctx, body, W - 120);

  ctx.font = 'bold 50px "Space Grotesk Bold"';
  const w1 = ctx.measureText(headline1).width;
  ctx.font = 'italic 56px "Instrument Serif Italic"';
  const wI = ctx.measureText(italicWord).width;
  ctx.font = 'bold 50px "Space Grotesk Bold"';
  const w2 = ctx.measureText(headline2).width;
  const inlineGap = 10;
  const inlineW = w1 + (headline1 ? inlineGap : 0) + wI + (headline2 ? inlineGap : 0) + w2;
  const isInline = inlineW <= W - 100;

  const NUMERAL_BLOCK_H = 150;
  const GAP_NUM_HL      = 60;
  const HEADLINE_H      = isInline ? 64 : 180;
  const GAP_HL_BODY     = 40;
  const BODY_H          = bodyLines.length * 32;
  const GAP_BODY_DOODLE = doodleFn ? 50 : 0;
  const DOODLE_H        = doodleFn ? 180 : 0;

  const totalH = NUMERAL_BLOCK_H + GAP_NUM_HL + HEADLINE_H + GAP_HL_BODY + BODY_H + GAP_BODY_DOODLE + DOODLE_H;
  const startY = TOP_BOUND + Math.max(0, (BOTTOM_BOUND - TOP_BOUND - totalH) / 2);

  let cursorY = startY;

  // Numeral
  ctx.fillStyle = ORANGE;
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 2;
  ctx.font = 'italic 160px "Instrument Serif Italic"';
  ctx.textAlign = 'center';
  const numeralBaselineY = cursorY + 120;
  ctx.strokeText(num, W / 2, numeralBaselineY);
  ctx.fillText(num, W / 2, numeralBaselineY);

  ctx.fillStyle = ORANGE;
  ctx.fillRect(W / 2 - 38, numeralBaselineY + 22, 76, 3);

  cursorY += NUMERAL_BLOCK_H + GAP_NUM_HL;

  // Headline
  if (isInline) {
    const baseY = cursorY + 50;
    ctx.textAlign = 'left';
    let x = (W - inlineW) / 2;
    if (headline1) {
      ctx.fillStyle = INK_1; ctx.font = 'bold 50px "Space Grotesk Bold"';
      ctx.fillText(headline1, x, baseY);
      x += w1 + inlineGap;
    }
    ctx.fillStyle = ORANGE; ctx.font = 'italic 56px "Instrument Serif Italic"';
    ctx.lineWidth = 1.6;
    ctx.strokeText(italicWord, x, baseY + 4);
    ctx.fillText(italicWord, x, baseY + 4);
    x += wI + (headline2 ? inlineGap : 0);
    if (headline2) {
      ctx.fillStyle = INK_1; ctx.font = 'bold 50px "Space Grotesk Bold"';
      ctx.fillText(headline2, x, baseY);
    }
  } else {
    ctx.textAlign = 'center';
    const baseY = cursorY + 50;
    ctx.fillStyle = INK_1; ctx.font = 'bold 50px "Space Grotesk Bold"';
    ctx.fillText(headline1, W / 2, baseY);
    ctx.fillStyle = ORANGE; ctx.font = 'italic 56px "Instrument Serif Italic"';
    ctx.lineWidth = 1.6;
    ctx.strokeText(italicWord, W / 2, baseY + 60);
    ctx.fillText(italicWord, W / 2, baseY + 60);
    ctx.fillStyle = INK_1; ctx.font = 'bold 50px "Space Grotesk Bold"';
    ctx.fillText(headline2, W / 2, baseY + 120);
  }

  cursorY += HEADLINE_H + GAP_HL_BODY;

  // Body
  ctx.fillStyle = INK_2;
  ctx.font = '500 22px "Space Grotesk Medium"';
  ctx.textAlign = 'center';
  bodyLines.forEach((l, i) => ctx.fillText(l, W / 2, cursorY + 22 + i * 32));

  cursorY += BODY_H;

  // Doodle
  if (doodleFn) {
    cursorY += GAP_BODY_DOODLE;
    doodleFn(ctx, W / 2, cursorY + DOODLE_H / 2);
  }

  drawFooter(ctx);
}

// ── SLIDES ───────────────────────────────────────────────────────────────────

async function slide1(logo) {
  const { canvas, ctx } = baseCanvas();
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  // Layout heights
  const EYEBROW_H = 22, GAP1 = 30, HEADLINE_H = 240, GAP2 = 30, SUBHEAD_H = 38 * 2,
        GAP3 = 36, BIG_5_H = 270, GAP4 = 20, SWIPE_H = 26;
  const totalH = EYEBROW_H + GAP1 + HEADLINE_H + GAP2 + SUBHEAD_H + GAP3 + BIG_5_H + GAP4 + SWIPE_H;
  const startY = TOP_BOUND + Math.max(0, (BOTTOM_BOUND - TOP_BOUND - totalH) / 2);

  let y = startY;

  drawEyebrow(ctx, 'FOR FOUNDERS & MARKETERS', y + EYEBROW_H - 4);
  y += EYEBROW_H + GAP1;

  ctx.textAlign = 'center';

  ctx.fillStyle = INK_1;
  ctx.font = 'bold 64px "Space Grotesk Bold"';
  ctx.fillText('5 Things Every', W / 2, y + 60);

  ctx.fillStyle = ORANGE;
  ctx.font = 'italic 72px "Instrument Serif Italic"';
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 1.6;
  ctx.strokeText('Landing Page', W / 2, y + 140);
  ctx.fillText('Landing Page', W / 2, y + 140);

  ctx.fillStyle = INK_1;
  ctx.font = 'bold 64px "Space Grotesk Bold"';
  ctx.fillText('Needs.', W / 2, y + 220);

  y += HEADLINE_H + GAP2;

  ctx.fillStyle = INK_2;
  ctx.font = 'italic 28px "Instrument Serif Italic"';
  const subLines = ['Get these right and your', 'conversion rate doubles.'];
  subLines.forEach((l, i) => ctx.fillText(l, W / 2, y + 24 + i * 38));

  y += SUBHEAD_H + GAP3;

  // Big "5"
  ctx.save();
  ctx.fillStyle = 'rgba(242,107,26,0.10)';
  ctx.font = 'bold 380px "Space Grotesk Bold"';
  ctx.textAlign = 'center';
  ctx.fillText('5', W / 2, y + BIG_5_H - 50);
  ctx.restore();

  y += BIG_5_H + GAP4;

  // Swipe + arrow
  ctx.fillStyle = ORANGE;
  ctx.font = '500 17px "JetBrains Mono Medium"';
  const swipeY = y + 17;
  const swipeChars = 'SWIPE'.split('');
  const sw = swipeChars.reduce((s, c) => s + ctx.measureText(c).width, 0) + 3 * (swipeChars.length - 1);
  const arrowGap = 14, arrowLen = 22;
  const totalSwipeW = sw + arrowGap + arrowLen;
  const swipeStartX = (W - totalSwipeW) / 2;

  let cursor = swipeStartX;
  ctx.textAlign = 'left';
  for (const c of swipeChars) {
    ctx.fillText(c, cursor, swipeY);
    cursor += ctx.measureText(c).width + 3;
  }
  const swipeArrowX = swipeStartX + sw + arrowGap;
  const swipeArrowY = swipeY - 5;
  const headSize = 6;
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(swipeArrowX, swipeArrowY);
  ctx.lineTo(swipeArrowX + arrowLen, swipeArrowY);
  ctx.stroke();
  ctx.fillStyle = ORANGE;
  ctx.beginPath();
  ctx.moveTo(swipeArrowX + arrowLen, swipeArrowY);
  ctx.lineTo(swipeArrowX + arrowLen - headSize, swipeArrowY - headSize);
  ctx.lineTo(swipeArrowX + arrowLen - headSize, swipeArrowY + headSize);
  ctx.closePath();
  ctx.fill();

  drawFooter(ctx);
  saveBoth(canvas, 'slide-01-hook.png');
}

async function slide2(logo) {
  const { canvas, ctx } = baseCanvas();
  drawInsightSlide(ctx, logo, '01',
    'A clear value prop', 'above', 'the fold.',
    'In one sentence. Specific to your buyer. If they have to think "wait, what does this do?" — you\'ve already lost them.',
    drawDoodleAboveFold);
  saveBoth(canvas, 'slide-02-value-prop.png');
}

async function slide3(logo) {
  const { canvas, ctx } = baseCanvas();
  drawInsightSlide(ctx, logo, '02',
    '', 'One', 'CTA — repeated.',
    'Don\'t offer "sign up", "book a demo", AND "contact sales" on the same page. Pick the action that matters most. Repeat it after every section.',
    drawDoodleOneCTA);
  saveBoth(canvas, 'slide-03-one-cta.png');
}

async function slide4(logo) {
  const { canvas, ctx } = baseCanvas();
  drawInsightSlide(ctx, logo, '03',
    '', 'Real social', 'proof.',
    'Logos. Named testimonials with photos. Specific numbers. "Trusted by thousands" is wallpaper. "200 founders shipped this month" sells.',
    drawDoodleStars);
  saveBoth(canvas, 'slide-04-social-proof.png');
}

async function slide5(logo) {
  const { canvas, ctx } = baseCanvas();
  drawInsightSlide(ctx, logo, '04',
    'Friction-free', 'contact.', '',
    'Email visible. Calendar embedded. Form has 4 fields max. If they have to dig to talk to you, they won\'t bother.',
    drawDoodleContact);
  saveBoth(canvas, 'slide-05-friction-free.png');
}

async function slide6(logo) {
  const { canvas, ctx } = baseCanvas();
  drawInsightSlide(ctx, logo, '05',
    'Sub-2-second', 'load time.', '',
    'Every extra second costs ~7% of conversions. Optimise images. Lazy-load below the fold. Self-host fonts. Run Lighthouse weekly.',
    drawDoodleStopwatch);
  saveBoth(canvas, 'slide-06-load-speed.png');
}

async function slide7(logo) {
  const { canvas, ctx } = baseCanvas();
  drawTopbar(ctx);
  drawLogoBlock(ctx, logo);

  const EYEBROW_H = 22, GAP1 = 50, HEADLINE_H = 160, GAP2 = 36,
        SUBHEAD_H = 32 * 2, GAP3 = 50, BTN_H = 72, GAP4 = 30, HANDLE_H = 18;
  const totalH = EYEBROW_H + GAP1 + HEADLINE_H + GAP2 + SUBHEAD_H + GAP3 + BTN_H + GAP4 + HANDLE_H;
  const startY = TOP_BOUND + Math.max(0, (BOTTOM_BOUND - TOP_BOUND - totalH) / 2);

  let y = startY;

  drawEyebrow(ctx, 'WANT ONE THAT DOES ALL 5?', y + EYEBROW_H - 4);
  y += EYEBROW_H + GAP1;

  ctx.textAlign = 'center';
  ctx.fillStyle = INK_1;
  ctx.font = 'bold 68px "Space Grotesk Bold"';
  ctx.fillText('We build them', W / 2, y + 56);

  ctx.fillStyle = ORANGE;
  ctx.font = 'italic 76px "Instrument Serif Italic"';
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 2;
  ctx.strokeText('in 6 days.', W / 2, y + 148);
  ctx.fillText('in 6 days.', W / 2, y + 148);

  y += HEADLINE_H + GAP2;

  ctx.fillStyle = INK_2;
  ctx.font = 'italic 26px "Instrument Serif Italic"';
  ctx.fillText('Custom landing pages that convert —', W / 2, y + 22);
  ctx.fillText('shipped fast, owned by you.', W / 2, y + 54);

  y += SUBHEAD_H + GAP3;

  // CTA pill
  ctx.font = 'bold 28px "Space Grotesk Bold"';
  const btnText = 'fastlaunchmvp.com';
  const btnPad = 36, arrowGap = 14, arrowLen = 28;
  const btnTextW = ctx.measureText(btnText).width;
  const btnW = btnTextW + arrowGap + arrowLen + btnPad * 2;
  const btnH = BTN_H;
  const btnX = (W - btnW) / 2;
  const btnY = y;

  ctx.save();
  ctx.shadowColor = 'rgba(242,107,26,0.40)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = ORANGE;
  roundRect(ctx, btnX, btnY, btnW, btnH, btnH / 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#1a0d04';
  ctx.font = 'bold 28px "Space Grotesk Bold"';
  ctx.textAlign = 'left';
  ctx.fillText(btnText, btnX + btnPad, btnY + 47);

  const arrowX = btnX + btnPad + btnTextW + arrowGap;
  const arrowY = btnY + btnH / 2;
  const headSize = 8;
  ctx.strokeStyle = '#1a0d04';
  ctx.fillStyle = '#1a0d04';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY); ctx.lineTo(arrowX + arrowLen, arrowY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(arrowX + arrowLen, arrowY);
  ctx.lineTo(arrowX + arrowLen - headSize, arrowY - headSize);
  ctx.lineTo(arrowX + arrowLen - headSize, arrowY + headSize);
  ctx.closePath();
  ctx.fill();

  y += BTN_H + GAP4;

  ctx.fillStyle = INK_3;
  ctx.font = '500 18px "JetBrains Mono Medium"';
  ctx.textAlign = 'center';
  fillSpaced(ctx, '@FASTLAUNCHMVP', W / 2, y + 14, 3);

  drawFooter(ctx);
  saveBoth(canvas, 'slide-07-cta.png');
}

async function run() {
  const logo = await loadImage(LOGO);
  await slide1(logo);
  await slide2(logo);
  await slide3(logo);
  await slide4(logo);
  await slide5(logo);
  await slide6(logo);
  await slide7(logo);
  console.log('\nAll 7 square slides done →');
  console.log('  IG:       ' + OUT_IG);
  console.log('  LinkedIn: ' + OUT_LI);
}

run().catch(e => { console.error(e.message); process.exit(1); });
