/**
 * convert-pdf.js — convert documents/menu.pdf pages to PNG using pdfjs-dist + canvas
 * Output: ./menu-pages/page-N.png
 *
 * Usage: node convert-pdf.js <input.pdf> <out-dir>
 */
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const SRC = process.argv[2] || './menu.pdf';
const OUT = process.argv[3] || './menu-pages';
const SCALE = 2.5;  // ~render scale; higher = sharper but bigger file

(async () => {
  // pdfjs-dist v4+ ships ESM; use legacy build for CommonJS
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

  fs.mkdirSync(OUT, { recursive: true });

  const data = new Uint8Array(fs.readFileSync(SRC));
  const doc = await pdfjsLib.getDocument({ data, useSystemFonts: true }).promise;
  console.log(`Loaded PDF: ${doc.numPages} page(s)`);

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: SCALE });

    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const out = path.join(OUT, `page-${i}.png`);
    fs.writeFileSync(out, canvas.toBuffer('image/png'));
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`  page-${i}.png  ${Math.round(viewport.width)}×${Math.round(viewport.height)}  (${kb} KB)`);
  }
  console.log('\nDone →', OUT);
})().catch(e => { console.error(e); process.exit(1); });
