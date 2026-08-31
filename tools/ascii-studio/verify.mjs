// Smoke test the Jekyll build of ASCII GIF Studio.
// Run from the site root after `bundle exec jekyll build`.
// Serves _site/ over HTTP and checks: sliders/palettes render, a model loads,
// and the canvas rasterizes. Uses playwright-core (requires local Chrome).

import { createServer } from 'node:http';
import { chromium } from 'playwright-core';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const ROOT = join(SITE_ROOT, '_site');
const PORT = 5199;

if (!existsSync(join(ROOT, 'tools/ascii-studio/index.html'))) {
  console.error('_site missing — run `jekyll build` first.');
  process.exit(1);
}

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.obj': 'text/plain',
  '.glb': 'model/gltf-binary',
  '.fbx': 'application/octet-stream',
  '.usda': 'text/plain',
};

const server = createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let file = join(ROOT, urlPath);
  if (file.endsWith('/')) file = join(file, 'index.html');
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404).end('not found');
    return;
  }
  const ext = file.slice(file.lastIndexOf('.'));
  res.writeHead(200, { 'content-type': types[ext] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

await new Promise((r) => server.listen(PORT, r));
console.log(`serving ${ROOT} at http://localhost:${PORT}`);

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console.error: ' + m.text());
});

await page.goto(`http://localhost:${PORT}/tools/ascii-studio/`, { waitUntil: 'networkidle' });

const sliderCount = await page.locator('.slider-row').count();
const paletteCount = await page.locator('.palette-chip').count();
console.log(`sliders: ${sliderCount}, palettes: ${paletteCount}`);

// Load the sample cube model.
await page.setInputFiles('#file-input', join(ROOT, 'tools/ascii-studio/assets/models/cube.obj'));
await page.waitForTimeout(1200);

const canvasFilled = await page.evaluate(() => {
  const c = document.getElementById('ascii-canvas');
  const ctx = c.getContext('2d');
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  let opaque = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 20) opaque++;
  return { opaque, w: c.width, h: c.height };
});
console.log('canvas opaque pixels after load:', canvasFilled);

const exportVisible = await page.locator('#export-row').isVisible();
console.log('export row visible:', exportVisible);

// Try exporting a GIF.
await page.click('#export-btn');
await page.waitForTimeout(2500);
const previewShown = await page.locator('#preview-wrap:not(.hidden)').count() > 0;
console.log('preview shown after export:', previewShown);
const previewSrc = await page.locator('#preview-img').getAttribute('src');
const gifOk = (await page.evaluate(async (src) => {
  const r = await fetch(src);
  const buf = new Uint8Array(await r.arrayBuffer());
  return buf.length > 20 && String.fromCharCode(buf[0], buf[1], buf[2]) === 'GIF';
}, previewSrc)) && previewSrc?.startsWith('blob:');
console.log('preview is a valid GIF blob:', gifOk);

await browser.close();
server.close();

const failed = sliderCount !== 11 || paletteCount !== 6 || canvasFilled.opaque <= 0 || !exportVisible || !previewShown || !gifOk || errors.length > 0;
if (errors.length) console.log('JS errors:', errors);
console.log(failed ? 'SMOKE TEST: FAILED' : 'SMOKE TEST: PASSED');
process.exit(failed ? 1 : 0);
