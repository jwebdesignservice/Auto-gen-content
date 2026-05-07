/**
 * screenshot.js — headless screenshot util using @sparticuz/chromium + puppeteer-core
 * Bundled chromium ships inside the npm tarball, so this runs in sandboxes that
 * block playwright.dev / googleapis CDNs.
 *
 * Usage: node screenshot.js <url> <out.png> [--width=1280] [--height=1600] [--full]
 */
const path = require('path');
const fs = require('fs');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

(async () => {
  const args = process.argv.slice(2);
  const positional = args.filter(a => !a.startsWith('--'));
  const flags = Object.fromEntries(
    args.filter(a => a.startsWith('--')).map(a => {
      const [k, v] = a.replace(/^--/, '').split('=');
      return [k, v === undefined ? true : v];
    })
  );

  const url = positional[0];
  const out = positional[1] || 'screenshot.png';
  if (!url) { console.error('usage: screenshot.js <url> <out.png>'); process.exit(2); }

  const width  = parseInt(flags.width  || '1280', 10);
  const height = parseInt(flags.height || '1600', 10);
  const fullPage = !!flags.full;
  const wait = parseInt(flags.wait || '2000', 10);

  chromium.setHeadlessMode = true;
  chromium.setGraphicsMode = false;

  const executablePath = await chromium.executablePath();
  console.log('chromium at:', executablePath);

  const browser = await puppeteer.launch({
    args: [
      ...chromium.args,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
      '--allow-insecure-localhost',
    ],
    defaultViewport: { width, height, deviceScaleFactor: 2 },
    executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
    acceptInsecureCerts: true,
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, wait));

  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, fullPage, type: 'png' });
  console.log('saved:', out);

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
