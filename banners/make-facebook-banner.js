/**
 * make-facebook-banner.js — Fast Launch Facebook cover photo (1640 × 624)
 * Type-led brand-level banner. Clean, professional, no device imagery.
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

const W = 1640, H = 624;
const SCALE = 2;  // render at 2× for crisp retina-quality output (final 3280 × 1248)

const ORANGE = '#F26B1A';
const WHITE  = '#FFFFFF';
const FG2    = 'rgba(255,255,255,0.72)';
const FG3    = 'rgba(255,255,255,0.50)';
const BG     = '#0A0807';

const LOGO = path.join(ROOT, 'brand', 'logo-mark.png');
const OUT  = path.join(__dirname, 'facebook-banner.png');

function fillSpaced(ctx, text, x, y, spacing) {
  const chars = text.split('');
  const widths = chars.map(c => ctx.measureText(c).width);
  const total = widths.reduce((s, w) => s + w, 0) + spacing * (chars.length - 1);
  let cursor = x - total / 2; // centred
  ctx.textAlign = 'left';
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], cursor, y);
    cursor += widths[i] + spacing;
  }
}

async function build() {
  const logo = await loadImage(LOGO);

  // Create canvas at scaled size, then apply ctx.scale() so the rest of the
  // drawing code can stay in the logical W×H coordinate system.
  const canvas = createCanvas(W * SCALE, H * SCALE);
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);

  // ── Background ─────────────────────────────────────────────────────────────
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // ── Tech pattern: dot matrix grid covering the canvas ─────────────────────
  ctx.save();
  ctx.fillStyle = 'rgba(242,107,26,0.20)';
  const dotSpacing = 28;
  for (let x = dotSpacing; x < W; x += dotSpacing) {
    for (let y = dotSpacing; y < H; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // ── Tech pattern: thin horizontal scan lines ──────────────────────────────
  ctx.save();
  ctx.strokeStyle = 'rgba(242,107,26,0.10)';
  ctx.lineWidth = 1;
  [80, 200, 400, 540].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  });
  ctx.restore();

  // ── Tech pattern: circuit-style L-shaped corner accents ───────────────────
  ctx.save();
  ctx.strokeStyle = 'rgba(242,107,26,0.55)';
  ctx.lineWidth = 2;
  const cornerSize = 36;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(40, 40 + cornerSize); ctx.lineTo(40, 40); ctx.lineTo(40 + cornerSize, 40);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(W - 40 - cornerSize, 40); ctx.lineTo(W - 40, 40); ctx.lineTo(W - 40, 40 + cornerSize);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(40, H - 40 - cornerSize); ctx.lineTo(40, H - 40); ctx.lineTo(40 + cornerSize, H - 40);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(W - 40 - cornerSize, H - 40); ctx.lineTo(W - 40, H - 40); ctx.lineTo(W - 40, H - 40 - cornerSize);
  ctx.stroke();
  ctx.restore();

  // ── Tech pattern: micro chevrons/ticks along the side gutters ─────────────
  ctx.save();
  ctx.strokeStyle = 'rgba(242,107,26,0.32)';
  ctx.lineWidth = 1.2;
  for (let y = 110; y < H - 110; y += 28) {
    // Left side
    ctx.beginPath();
    ctx.moveTo(18, y);
    ctx.lineTo(34, y);
    ctx.stroke();
    // Right side
    ctx.beginPath();
    ctx.moveTo(W - 34, y);
    ctx.lineTo(W - 18, y);
    ctx.stroke();
  }
  ctx.restore();

  // ── Tech pattern: subtle data readout text in corners (mono) ──────────────
  ctx.save();
  ctx.fillStyle = 'rgba(242,107,26,0.42)';
  ctx.font = '500 11px "JetBrains Mono Medium"';
  ctx.textAlign = 'left';
  ctx.fillText('//SYS_READY', 90, 50);
  ctx.textAlign = 'right';
  ctx.fillText('FL_v2.025', W - 90, 50);
  ctx.textAlign = 'left';
  ctx.fillText('UPTIME 99.9%', 90, H - 30);
  ctx.textAlign = 'right';
  ctx.fillText('STATUS: SHIPPING', W - 90, H - 30);
  ctx.restore();

  // ── Subtle orange radial glow (top-right + bottom-left) ───────────────────
  const glow1 = ctx.createRadialGradient(W * 0.85, H * 0.20, 60, W * 0.85, H * 0.20, 700);
  glow1.addColorStop(0, 'rgba(242,107,26,0.18)');
  glow1.addColorStop(1, 'transparent');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, H);

  const glow2 = ctx.createRadialGradient(W * 0.15, H * 0.85, 40, W * 0.15, H * 0.85, 560);
  glow2.addColorStop(0, 'rgba(242,107,26,0.10)');
  glow2.addColorStop(1, 'transparent');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // ── Decorative diagonal accent stripe (bottom-right) ──────────────────────
  ctx.save();
  const stripe = ctx.createLinearGradient(W * 0.55, H, W, H * 0.30);
  stripe.addColorStop(0, 'rgba(242,107,26,0)');
  stripe.addColorStop(0.5, 'rgba(242,107,26,0.06)');
  stripe.addColorStop(1, 'rgba(242,107,26,0)');
  ctx.fillStyle = stripe;
  ctx.beginPath();
  ctx.moveTo(W * 0.55, H);
  ctx.lineTo(W, H * 0.20);
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // ── Top orange bar ─────────────────────────────────────────────────────────
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 0, W, 4);

  // ── Logo + wordmark — centred at the top ───────────────────────────────────
  const logoSize = 64;
  const logoY = 60;
  ctx.drawImage(logo, (W - logoSize) / 2 - 100, logoY, logoSize, logoSize);
  ctx.fillStyle = WHITE;
  ctx.font = 'bold 38px "Space Grotesk Bold"';
  ctx.textAlign = 'left';
  ctx.fillText('Fast Launch', (W - logoSize) / 2 - 100 + logoSize + 18, logoY + 46);

  // ── Big centred headline ──────────────────────────────────────────────────
  // Line 1: "Custom websites," (white, Space Grotesk Bold)
  ctx.fillStyle = WHITE;
  ctx.font = 'bold 88px "Space Grotesk Bold"';
  ctx.textAlign = 'center';
  ctx.fillText('Custom websites,', W / 2, 295);

  // Line 2: "shipped in" white + "3–14 days." italic orange (thicker via stroke overlay)
  const part1 = 'shipped in';
  const part2 = ' 3–14 days.';

  ctx.font = 'bold 88px "Space Grotesk Bold"';
  const part1W = ctx.measureText(part1).width;
  ctx.font = 'italic 100px "Instrument Serif Italic"';
  const part2W = ctx.measureText(part2).width;

  const totalW = part1W + part2W;
  const startX = (W - totalW) / 2;
  const baseY = 410;

  // Part 1: "shipped in" (white sans bold)
  ctx.fillStyle = WHITE;
  ctx.font = 'bold 88px "Space Grotesk Bold"';
  ctx.textAlign = 'left';
  ctx.fillText(part1, startX, baseY);

  // Part 2: " 3–14 days." — italic orange serif, thickened with stroke overlay
  // (Instrument Serif Italic only ships in regular weight, so we stroke + fill
  // with the same colour to give it ~12-15% extra apparent weight.)
  ctx.fillStyle = ORANGE;
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 2.4;
  ctx.lineJoin = 'round';
  ctx.font = 'italic 100px "Instrument Serif Italic"';
  // First stroke (thickens edges), then fill (cleans up the inside)
  ctx.strokeText(part2, startX + part1W, baseY + 6);
  ctx.fillText(part2, startX + part1W, baseY + 6);

  // ── Subhead — italic Instrument Serif, faint ──────────────────────────────
  ctx.fillStyle = FG2;
  ctx.font = 'italic 32px "Instrument Serif Italic"';
  ctx.textAlign = 'center';
  ctx.fillText('No agencies. No retainers. Conversion-focused builds, fully owned by you.', W / 2, 480);

  // ── Footer URL — centred mono ─────────────────────────────────────────────
  ctx.fillStyle = FG3;
  ctx.font = '500 22px "JetBrains Mono Medium"';
  fillSpaced(ctx, 'WWW.FASTLAUNCHMVP.COM', W / 2, 568, 4);

  // Save
  fs.writeFileSync(OUT, canvas.toBuffer('image/png'));
  console.log('Saved:', OUT);
}

build().catch(e => { console.error(e.message); process.exit(1); });
