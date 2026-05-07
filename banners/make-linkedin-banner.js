/**
 * make-linkedin-banner.js — Fast Launch LinkedIn cover (1584 × 396)
 * Brand-level. Multi-device showcase (laptop + phone overlay) on the right.
 */
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FONTS = path.join(ROOT, 'fonts');

registerFont(path.join(FONTS, 'SpaceGrotesk-Bold.ttf'),       { family: 'Space Grotesk Bold' });
registerFont(path.join(FONTS, 'SpaceGrotesk-Medium.ttf'),     { family: 'Space Grotesk Medium' });
registerFont(path.join(FONTS, 'InstrumentSerif-Italic.ttf'),  { family: 'Instrument Serif Italic' });
registerFont(path.join(FONTS, 'JetBrainsMono-Medium.ttf'),    { family: 'JetBrains Mono Medium' });

const W = 1584, H = 396;

// Tokens
const ORANGE = '#F26B1A';
const ORANGE_DEEP = '#C9540F';
const WHITE  = '#FFFFFF';
const FG2    = 'rgba(255,255,255,0.72)';
const FG3    = 'rgba(255,255,255,0.45)';
const BG     = '#0A0807';

const LAPTOP = path.join(ROOT, 'brand', 'laptop-showcase.png');
const PHONE  = path.join(ROOT, 'brand', 'phone-showcase.png');
const LOGO   = path.join(ROOT, 'brand', 'logo-mark.png');
const OUT    = path.join(__dirname, 'linkedin-banner.png');

function fillSpaced(ctx, text, x, y, spacing) {
  const chars = text.split('');
  const widths = chars.map(c => ctx.measureText(c).width);
  let cursor = x;
  ctx.textAlign = 'left';
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], cursor, y);
    cursor += widths[i] + spacing;
  }
  return cursor - x;
}

async function build() {
  const [laptop, phone, logo] = await Promise.all([
    loadImage(LAPTOP), loadImage(PHONE), loadImage(LOGO)
  ]);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // ── Pure dark background ───────────────────────────────────────────────────
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // ── Diagonal orange accent stripe — bottom-right corner ────────────────────
  // Adds a subtle geometric energy without competing with the devices
  ctx.save();
  const stripe = ctx.createLinearGradient(W * 0.6, H, W, H * 0.3);
  stripe.addColorStop(0, 'rgba(242,107,26,0)');
  stripe.addColorStop(0.5, 'rgba(242,107,26,0.08)');
  stripe.addColorStop(1, 'rgba(242,107,26,0)');
  ctx.fillStyle = stripe;
  ctx.beginPath();
  ctx.moveTo(W * 0.55, H);
  ctx.lineTo(W, H * 0.20);
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // ── Subtle warm radial on the LEFT (text area) ─────────────────────────────
  const leftGlow = ctx.createRadialGradient(W * 0.18, H / 2, 40, W * 0.18, H / 2, 460);
  leftGlow.addColorStop(0, 'rgba(242,107,26,0.10)');
  leftGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = leftGlow;
  ctx.fillRect(0, 0, W, H);

  // ── Top orange bar ─────────────────────────────────────────────────────────
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 0, W, 4);

  const padX = 90;

  // ── Logo + wordmark — TOP LEFT ─────────────────────────────────────────────
  // Lightning bolt vertically centred with the wordmark + eyebrow text block
  const logoSize = 44;
  const blockTopY = 36;
  const wordmarkBaseline = blockTopY + 22;     // top of cap height = blockTopY
  const eyebrowBaseline  = blockTopY + 44;     // 22 below wordmark baseline
  // Text block visually spans from blockTopY (wordmark cap top) to eyebrowBaseline (descender)
  const textBlockTop    = blockTopY;
  const textBlockBottom = eyebrowBaseline + 2;
  const textBlockMid    = (textBlockTop + textBlockBottom) / 2;
  const logoY = Math.round(textBlockMid - logoSize / 2);

  ctx.drawImage(logo, padX, logoY, logoSize, logoSize);

  ctx.fillStyle = WHITE;
  ctx.font = 'bold 26px "Space Grotesk Bold"';
  ctx.textAlign = 'left';
  ctx.fillText('Fast Launch', padX + logoSize + 14, wordmarkBaseline);

  ctx.fillStyle = ORANGE;
  ctx.font = '500 13px "JetBrains Mono Medium"';
  fillSpaced(ctx, 'WEB STUDIO  ·  UK', padX + logoSize + 14, eyebrowBaseline, 2);

  // ── Main heading — Space Grotesk Bold + italic serif orange accent ────────
  // 2-line heading, "3–14 working days." emphasised in orange italic serif
  ctx.fillStyle = WHITE;
  ctx.font = '48px "Space Grotesk Bold"';
  ctx.textAlign = 'left';
  ctx.fillText('Websites designed, built and', padX, 200);

  // Line 2: inline mix
  const line2Y = 260;
  ctx.fillStyle = WHITE;
  ctx.font = '48px "Space Grotesk Bold"';
  ctx.fillText('shipped in', padX, line2Y);
  const shippedW = ctx.measureText('shipped in').width;

  ctx.fillStyle = ORANGE;
  ctx.font = 'italic 58px "Instrument Serif Italic"';
  ctx.fillText('3–14 working days.', padX + shippedW + 18, line2Y + 6);

  // ── Sub-heading — supporting line, clean sans medium ──────────────────────
  ctx.fillStyle = FG2;
  ctx.font = '500 19px "Space Grotesk Medium"';
  ctx.fillText('No agencies. No retainers. Conversion-focused builds, fully owned by you.', padX, 308);

  // ── Contact section — single clean row ────────────────────────────────────
  function dot(x, y) {
    ctx.save();
    ctx.fillStyle = ORANGE;
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = WHITE;
  ctx.font = '500 14px "JetBrains Mono Medium"';
  let cursor = padX;
  cursor += fillSpaced(ctx, 'WWW.FASTLAUNCHMVP.COM', cursor, 368, 2);
  cursor += 22;
  dot(cursor - 11, 364);
  ctx.fillStyle = WHITE;
  cursor += fillSpaced(ctx, 'SUPPORT@FASTLAUNCH.COM', cursor, 368, 2);
  cursor += 22;
  dot(cursor - 11, 364);
  ctx.fillStyle = WHITE;
  fillSpaced(ctx, '+44 7758 749 361', cursor, 368, 2);

  // ── Multi-device showcase — RIGHT ──────────────────────────────────────────
  // Laptop sits behind, slightly higher; phone sits in front, lower & right.

  // Laptop (back)
  const laptopH = 330;
  const laptopAspect = laptop.width / laptop.height;
  const laptopW = Math.round(laptopH * laptopAspect);
  const laptopCenterX = W * 0.74;
  const laptopX = laptopCenterX - laptopW / 2;
  const laptopY = (H - laptopH) / 2 - 8;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 14;
  ctx.drawImage(laptop, laptopX, laptopY, laptopW, laptopH);
  ctx.restore();

  // Phone (front, overlapping bottom-right of laptop) — rotated right
  const phoneH = 270;          // smaller per request
  const phoneAspect = phone.width / phone.height;
  const phoneW = Math.round(phoneH * phoneAspect);
  const phoneCenterX = W - phoneW / 2 - 30;
  const phoneCenterY = H / 2 + 14;
  const rotateRad = 22 * Math.PI / 180;  // 22° clockwise tilt — visible right lean

  // Soft warm spot directly behind the phone (positioned at phone centre)
  ctx.save();
  const phoneGlow = ctx.createRadialGradient(
    phoneCenterX, phoneCenterY, 30,
    phoneCenterX, phoneCenterY, 200
  );
  phoneGlow.addColorStop(0, 'rgba(242,107,26,0.18)');
  phoneGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = phoneGlow;
  ctx.fillRect(phoneCenterX - 200, phoneCenterY - 200, 400, 400);
  ctx.restore();

  // Rotated phone with shadow
  ctx.save();
  ctx.translate(phoneCenterX, phoneCenterY);
  ctx.rotate(rotateRad);
  ctx.shadowColor = 'rgba(0,0,0,0.70)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetX = -8;
  ctx.shadowOffsetY = 16;
  ctx.drawImage(phone, -phoneW / 2, -phoneH / 2, phoneW, phoneH);
  ctx.restore();

  // Save
  fs.writeFileSync(OUT, canvas.toBuffer('image/png'));
  console.log('Saved:', OUT);
}

build().catch(e => { console.error(e.message); process.exit(1); });
