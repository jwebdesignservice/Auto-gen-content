/**
 * Breakdown slide 1 — FULL site image, breakdown style (light bg + number ring
 * above), top-anchored so the long page bleeds off the bottom.
 * Renders BOTH TikTok (1080×1920) and square (1080×1080, IG+LinkedIn).
 */
const path = require('path');
const fs = require('fs');
const { registerFonts, createBaseCanvas, saveCanvas, roundRect, loadImage } = require('../../scripts/lib/canvas-helpers');
registerFonts();

const SITE_COLOR = '#6E1228';
const FULL = path.join(__dirname, '..', '..', 'assets', 'past-work', 'sable', 'full.png');
const TOTAL = 6;   // full-bleed cover (01) + 5 section slides

async function render(W, H, { cy, r, ringFont, totalFont, fw, topY, R }, outPaths) {
  const img = await loadImage(FULL);
  const state = createBaseCanvas(W, H, '#FFFCF8'); const { ctx } = state;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#FFFCF8'); g.addColorStop(1, '#F4EEE4');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // number ring above the image
  const cx = W / 2;
  ctx.strokeStyle = SITE_COLOR; ctx.lineWidth = r >= 50 ? 3 : 2.5;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = SITE_COLOR; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `italic ${ringFont}px "Instrument Serif Italic"`;
  ctx.fillText('01', cx, cy + 2);
  ctx.fillStyle = 'rgba(27,26,24,0.45)'; ctx.textBaseline = 'alphabetic';
  ctx.font = `500 ${totalFont}px "JetBrains Mono Medium"`;
  ctx.fillText(`/ ${String(TOTAL).padStart(2, '0')}`, cx, cy + r + (r >= 50 ? 30 : 24));

  // full site, top-anchored, bleeding off the bottom
  const x = (W - fw) / 2, h = img.height * (fw / img.width);
  ctx.save(); ctx.shadowColor = 'rgba(27,26,24,0.20)'; ctx.shadowBlur = r >= 50 ? 38 : 28; ctx.shadowOffsetY = r >= 50 ? 16 : 12;
  ctx.fillStyle = '#000'; roundRect(ctx, x, topY, fw, h, R); ctx.fill(); ctx.restore();
  ctx.save(); roundRect(ctx, x, topY, fw, h, R); ctx.clip();
  ctx.drawImage(img, 0, 0, img.width, img.height, x, topY, fw, h); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(27,26,24,0.12)'; ctx.lineWidth = 1.5; roundRect(ctx, x, topY, fw, h, R); ctx.stroke(); ctx.restore();

  outPaths.forEach((p) => { fs.mkdirSync(path.dirname(p), { recursive: true }); saveCanvas(state, p); console.log('saved:', p); });
}

(async () => {
  const C = __dirname;
  // TikTok 1080×1920 — image width reduced ~20%
  await render(1080, 1920, { cy: 165, r: 50, ringFont: 50, totalFont: 18, fw: 512, topY: 350, R: 16 },
    [path.join(C, 'exports', 'tiktok', 'slide-1-full-site.png')]);
  // Square 1080×1080 — image width reduced ~20%
  await render(1080, 1080, { cy: 110, r: 40, ringFont: 40, totalFont: 15, fw: 376, topY: 255, R: 13 },
    [path.join(C, 'exports', 'instagram', 'slide-1-full-site.png'), path.join(C, 'exports', 'linkedin', 'slide-1-full-site.png')]);
})().catch((e) => { console.error(e); process.exit(1); });
