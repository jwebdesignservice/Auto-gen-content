/**
 * pdf-to-images.js — render every page of a PDF to PNG using headless Chromium
 *
 * Usage:  node pdf-to-images.js <input.pdf> <out-dir> [width]
 */
const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const SRC   = process.argv[2] || './menu.pdf';
const OUT   = process.argv[3] || './menu-pages';
const WIDTH = Number(process.argv[4]) || 1600;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Use pdfjs-dist within the browser — full DOM means image rendering works
  await page.setContent(`<!doctype html><html><head><style>
    body { margin: 0; background: #fff; }
    #out canvas { display: block; }
  </style></head><body><div id="out"></div>
  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@4/build/pdf.min.mjs" type="module"></script>
  <script type="module">
    import * as pdfjs from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4/build/pdf.min.mjs';
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4/build/pdf.worker.min.mjs';
    window.__renderPdf = async (url, scale) => {
      const doc = await pdfjs.getDocument(url).promise;
      const out = document.getElementById('out');
      const pages = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width  = viewport.width;
        canvas.height = viewport.height;
        canvas.id = 'page-' + i;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        out.appendChild(canvas);
        pages.push({ idx: i, w: canvas.width, h: canvas.height });
      }
      return pages;
    };
    window.__ready = true;
  </script>
  </body></html>`);

  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });

  // Compute scale so width ≈ WIDTH px
  // (We'll let pdfjs use scale=2.5 and crop later, then resize per-page)
  const pdfBytes = fs.readFileSync(SRC);
  const base64 = pdfBytes.toString('base64');
  const dataUrl = 'data:application/pdf;base64,' + base64;

  console.log('Rendering pages with PDF.js (browser side)…');
  const pageInfo = await page.evaluate(async (url) => window.__renderPdf(url, 2.5), dataUrl);
  console.log(`Rendered ${pageInfo.length} pages.`);

  for (const p of pageInfo) {
    const sel = '#page-' + p.idx;
    const file = path.join(OUT, `page-${p.idx}.png`);
    const el = await page.$(sel);
    await el.screenshot({ path: file, type: 'png' });
    const kb = Math.round(fs.statSync(file).size / 1024);
    console.log(`  ${path.basename(file)}  ${p.w}×${p.h}  (${kb} KB)`);
  }

  await browser.close();
  console.log('\nDone →', OUT);
})().catch(e => { console.error(e); process.exit(1); });
