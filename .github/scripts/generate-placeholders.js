'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const sharp = require('sharp');
const { Resvg } = require('@resvg/resvg-js');

function getArgValue(name) {
  const pref = `--${name}=`;
  const found = process.argv.find(arg => arg.startsWith(pref));
  return found ? found.slice(pref.length) : null;
}

const requestedFormatRaw = (getArgValue('format') || 'png').toLowerCase();
const requestedFormat = ['png', 'jpg', 'jpeg', 'svg'].includes(requestedFormatRaw)
  ? requestedFormatRaw
  : 'png';

const WIDTH = 1200;
const HEIGHT = 630;
const MAP_H = HEIGHT;
const COLS = 240;
const ROWS = 126;
const CELL_X = WIDTH / COLS;
const CELL_Y = MAP_H / ROWS;

const COLOR = {
  paper: '#282828',
  well: '#3c3836',
  hard: '#1d2021',
  ink: '#ebdbb2',
  muted: '#a89984',
  walnut: '#504945',
  straw: '#d5c4a1',
  accent: '#fe8019'
};

const FONT_SANS = 'IBM Plex Sans, ui-sans-serif, sans-serif';
const FONT_MONO = 'IBM Plex Mono, ui-monospace, monospace';

const repoRoot = path.join(__dirname, '../../');
const FONT_DIR = path.join(repoRoot, 'fonts');
const siteDir = path.join(repoRoot, '_site');
const sourcePlaceholdersDir = path.join(repoRoot, 'placeholders');
const sitePlaceholdersDir = path.join(siteDir, 'placeholders');

function ensureDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error(`Error ensuring directory ${dirPath}: ${error.message}`);
    return false;
  }
}

ensureDir(sourcePlaceholdersDir);
ensureDir(siteDir);
ensureDir(sitePlaceholdersDir);

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < String(s).length; i++) {
    h ^= String(s).charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function valueNoise2(ix, iy, seed) {
  const n = Math.imul(ix + seed, 374761393) ^ Math.imul(iy + seed * 3, 668265263);
  return ((n ^ (n >>> 13)) >>> 0) / 4294967296;
}

function noise2(x, y, seed) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = smoothstep(x - x0);
  const fy = smoothstep(y - y0);
  const v00 = valueNoise2(x0, y0, seed);
  const v10 = valueNoise2(x0 + 1, y0, seed);
  const v01 = valueNoise2(x0, y0 + 1, seed);
  const v11 = valueNoise2(x0 + 1, y0 + 1, seed);
  return lerp(lerp(v00, v10, fx), lerp(v01, v11, fx), fy);
}

function fbm(x, y, seed) {
  let sum = 0;
  let amp = 1;
  let freq = 1;
  let norm = 0;
  for (let o = 0; o < 5; o++) {
    sum += (noise2(x * freq, y * freq, seed + o * 19) * 2 - 1) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.05;
  }
  return sum / norm;
}

// Quilez nested domain warp: f(p + fbm(p + fbm(p)))
function warpedHeight(nx, ny, seed) {
  const px = nx * 3.1;
  const py = ny * 2.35;
  const q0 = fbm(px, py, seed);
  const q1 = fbm(px + 5.2, py + 1.3, seed + 7);
  const r0 = fbm(px + 4 * q0 + 1.7, py + 4 * q1 + 9.2, seed + 13);
  const r1 = fbm(px + 4 * q0 + 8.3, py + 4 * q1 + 2.8, seed + 19);
  const h = fbm(px + 4 * r0, py + 4 * r1, seed + 23);
  const ridge = 1 - Math.abs(fbm(px * 0.7, py * 0.7, seed + 31));
  return h * 0.82 + (ridge * 2 - 1) * 0.18;
}

function hexRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixRgb(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapLines(text, maxChars, maxLines) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || !current) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines) {
      current = '';
      break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (!lines.length) return [String(text || '')];
  const consumed = lines.join(' ');
  if (consumed.length < words.join(' ').length) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:\s]+$/, '') + '…';
  }
  return lines;
}

function buildHeight(seed) {
  const grid = [];
  let min = Infinity;
  let max = -Infinity;
  for (let y = 0; y <= ROWS; y++) {
    grid[y] = [];
    for (let x = 0; x <= COLS; x++) {
      const h = warpedHeight(x / COLS, y / ROWS, seed);
      grid[y][x] = h;
      min = Math.min(min, h);
      max = Math.max(max, h);
    }
  }
  const span = max - min || 1;
  for (let y = 0; y <= ROWS; y++) {
    for (let x = 0; x <= COLS; x++) {
      grid[y][x] = (grid[y][x] - min) / span;
    }
  }
  return grid;
}

function sampleGrid(grid, fx, fy) {
  const x = Math.max(0, Math.min(COLS, fx));
  const y = Math.max(0, Math.min(ROWS, fy));
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, COLS);
  const y1 = Math.min(y0 + 1, ROWS);
  const tx = x - x0;
  const ty = y - y0;
  return lerp(
    lerp(grid[y0][x0], grid[y0][x1], tx),
    lerp(grid[y1][x0], grid[y1][x1], tx),
    ty
  );
}

function cell(grid, x, y) {
  return grid[Math.max(0, Math.min(ROWS, y))][Math.max(0, Math.min(COLS, x))];
}

function buildShade(grid) {
  const exag = 22;
  const alt = 45 * Math.PI / 180;
  const az = 315 * Math.PI / 180;
  const lx = Math.cos(alt) * Math.sin(az);
  const ly = Math.cos(alt) * Math.cos(az);
  const lz = Math.sin(alt);
  const shade = [];
  for (let y = 0; y <= ROWS; y++) {
    shade[y] = [];
    for (let x = 0; x <= COLS; x++) {
      const a = cell(grid, x - 1, y - 1);
      const b = cell(grid, x, y - 1);
      const c = cell(grid, x + 1, y - 1);
      const d = cell(grid, x - 1, y);
      const f = cell(grid, x + 1, y);
      const g = cell(grid, x - 1, y + 1);
      const h = cell(grid, x, y + 1);
      const i = cell(grid, x + 1, y + 1);
      const dzdx = ((c + 2 * f + i) - (a + 2 * d + g)) / 8 * exag;
      const dzdy = ((g + 2 * h + i) - (a + 2 * b + c)) / 8 * exag;
      const nx = -dzdx;
      const ny = -dzdy;
      const nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      shade[y][x] = Math.max(0, (nx * lx + ny * ly + nz * lz) / len);
    }
  }
  return shade;
}

async function renderReliefPng(height, shade) {
  const paper = hexRgb(COLOR.paper);
  const hard = hexRgb(COLOR.hard);
  const straw = hexRgb(COLOR.straw);
  const walnut = hexRgb(COLOR.walnut);
  const buf = Buffer.alloc(WIDTH * MAP_H * 3);
  for (let py = 0; py < MAP_H; py++) {
    for (let px = 0; px < WIDTH; px++) {
      const gx = px / CELL_X;
      const gy = py / CELL_Y;
      const h = sampleGrid(height, gx, gy);
      const s = sampleGrid(shade, gx, gy);
      let rgb = mixRgb(paper, hard, (1 - s) * 0.72 + (1 - h) * 0.18);
      rgb = mixRgb(rgb, straw, s * 0.26);
      rgb = mixRgb(rgb, walnut, h * 0.1);
      const tooth = ((Math.imul(px * 374761393 ^ py * 668265263, 1597334677) >>> 0) / 4294967296 - 0.5) * 9;
      const dusk = smoothstep(Math.max(0, (py - (MAP_H - 220)) / 220)) * 0.42;
      rgb = mixRgb(rgb, hard, dusk);
      const i = (py * WIDTH + px) * 3;
      buf[i] = Math.max(0, Math.min(255, rgb[0] + tooth));
      buf[i + 1] = Math.max(0, Math.min(255, rgb[1] + tooth));
      buf[i + 2] = Math.max(0, Math.min(255, rgb[2] + tooth * 0.85));
    }
  }
  return sharp(buf, { raw: { width: WIDTH, height: MAP_H, channels: 3 } }).png().toBuffer();
}

function marchingSegments(grid, level) {
  const segs = [];
  const interp = (ax, ay, av, bx, by, bv) => {
    const t = Math.abs(bv - av) < 1e-6 ? 0.5 : (level - av) / (bv - av);
    return [lerp(ax, bx, t), lerp(ay, by, t)];
  };

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const x0 = x * CELL_X;
      const y0 = y * CELL_Y;
      const x1 = x0 + CELL_X;
      const y1 = y0 + CELL_Y;
      const tl = grid[y][x];
      const tr = grid[y][x + 1];
      const br = grid[y + 1][x + 1];
      const bl = grid[y + 1][x];
      const idx =
        (tl >= level ? 8 : 0) |
        (tr >= level ? 4 : 0) |
        (br >= level ? 2 : 0) |
        (bl >= level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;

      const top = () => interp(x0, y0, tl, x1, y0, tr);
      const right = () => interp(x1, y0, tr, x1, y1, br);
      const bottom = () => interp(x0, y1, bl, x1, y1, br);
      const left = () => interp(x0, y0, tl, x0, y1, bl);

      const pair = (a, b) => segs.push([a(), b()]);
      switch (idx) {
        case 1: case 14: pair(left, bottom); break;
        case 2: case 13: pair(bottom, right); break;
        case 3: case 12: pair(left, right); break;
        case 4: case 11: pair(top, right); break;
        case 6: case 9: pair(top, bottom); break;
        case 7: case 8: pair(left, top); break;
        case 5:
          pair(left, top);
          pair(bottom, right);
          break;
        case 10:
          pair(left, bottom);
          pair(top, right);
          break;
        default:
          break;
      }
    }
  }
  return segs;
}

function keyPoint(p) {
  return `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
}

function stitch(segments) {
  const unused = segments.map(([a, b]) => ({ a, b, used: false }));
  const buckets = new Map();
  unused.forEach((seg, i) => {
    const ka = keyPoint(seg.a);
    const kb = keyPoint(seg.b);
    if (!buckets.has(ka)) buckets.set(ka, []);
    if (!buckets.has(kb)) buckets.set(kb, []);
    buckets.get(ka).push(i);
    buckets.get(kb).push(i);
  });

  function takeFrom(point) {
    const list = buckets.get(keyPoint(point));
    if (!list) return null;
    for (const i of list) {
      const seg = unused[i];
      if (seg.used) continue;
      if (keyPoint(seg.a) === keyPoint(point)) {
        seg.used = true;
        return seg.b;
      }
      if (keyPoint(seg.b) === keyPoint(point)) {
        seg.used = true;
        return seg.a;
      }
    }
    return null;
  }

  const paths = [];
  for (const start of unused) {
    if (start.used) continue;
    start.used = true;
    const pts = [start.a, start.b];
    let guard = 0;
    while (guard++ < 40000) {
      const next = takeFrom(pts[pts.length - 1]);
      if (!next) break;
      pts.push(next);
    }
    paths.push(pts);
  }
  return paths;
}

function chaikin(pts, iterations) {
  let out = pts;
  for (let n = 0; n < iterations; n++) {
    if (out.length < 3) break;
    const next = [out[0]];
    for (let i = 0; i < out.length - 1; i++) {
      const a = out[i];
      const b = out[i + 1];
      next.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]]);
      next.push([0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
    }
    next.push(out[out.length - 1]);
    out = next;
  }
  return out;
}

function pathD(pts) {
  if (!pts.length) return '';
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  }
  return d;
}

function traceStream(grid, startX, startY) {
  const pts = [];
  let x = startX;
  let y = startY;
  const seen = new Set();
  for (let step = 0; step < 500; step++) {
    pts.push([x * CELL_X, y * CELL_Y]);
    const key = `${x},${y}`;
    if (seen.has(key)) break;
    seen.add(key);
    let bestX = x;
    let bestY = y;
    let bestH = grid[y][x];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx > COLS || ny > ROWS) continue;
        if (grid[ny][nx] < bestH) {
          bestH = grid[ny][nx];
          bestX = nx;
          bestY = ny;
        }
      }
    }
    if (bestX === x && bestY === y) break;
    x = bestX;
    y = bestY;
  }
  return pts;
}

function pickStreams(grid, seed) {
  const rand = mulberry32(seed + 99);
  const candidates = [];
  for (let y = 4; y < ROWS - 4; y += 3) {
    for (let x = 4; x < COLS - 4; x += 3) {
      if (grid[y][x] > 0.72) candidates.push([x, y, grid[y][x]]);
    }
  }
  candidates.sort((a, b) => b[2] - a[2]);
  const starts = [];
  for (const c of candidates) {
    if (starts.length >= 2) break;
    if (starts.every(s => Math.hypot(s[0] - c[0], s[1] - c[1]) > 28)) {
      starts.push(c);
    }
  }
  while (starts.length < 2) {
    starts.push([
      20 + Math.floor(rand() * (COLS - 40)),
      12 + Math.floor(rand() * (ROWS - 24))
    ]);
  }
  return starts.map(([x, y]) => chaikin(traceStream(grid, x, y), 2)).filter(p => p.length > 8);
}

async function generatePlaceholderSVG(post) {
  try {
    const title = (post && post.title) ? String(post.title) : 'buralarda iken';
    const seed = hashString(title);
    const rand = mulberry32(seed);
    const height = buildHeight(seed);
    const shade = buildShade(height);
    const reliefPng = await renderReliefPng(height, shade);
    const reliefHref = `data:image/png;base64,${reliefPng.toString('base64')}`;

    const levelCount = 11;
    const contourPaths = [];
    for (let i = 1; i < levelCount; i++) {
      const level = i / levelCount;
      const isIndex = i % 5 === 0;
      const paths = stitch(marchingSegments(height, level));
      const color = isIndex ? COLOR.ink : COLOR.muted;
      const width = isIndex ? 1.8 : 0.7;
      const opacity = isIndex ? 0.48 : 0.22;
      paths.forEach(raw => {
        if (raw.length < 4) return;
        const pts = chaikin(raw, 2);
        contourPaths.push(
          `<path d="${pathD(pts)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`
        );
      });
    }

    const accentLevel = 0.38 + rand() * 0.18;
    const accentPath = stitch(marchingSegments(height, accentLevel))
      .filter(pts => pts.length > 16)
      .sort((a, b) => b.length - a.length)[0];
    if (accentPath) {
      contourPaths.push(
        `<path d="${pathD(chaikin(accentPath, 2))}" fill="none" stroke="${COLOR.accent}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.92"/>`
      );
    }

    const streams = pickStreams(height, seed).map(pts => (
      `<path d="${pathD(pts)}" fill="none" stroke="${COLOR.ink}" stroke-width="6" stroke-linecap="round" opacity="0.1"/>`
    ));

    const compassX = 1118;
    const compassY = 568;
    const compass = `
      <g fill="none" stroke="${COLOR.ink}" stroke-width="1.2">
        <circle cx="${compassX}" cy="${compassY}" r="22" opacity="0.4"/>
        <line x1="${compassX}" y1="${compassY - 22}" x2="${compassX}" y2="${compassY + 22}" opacity="0.32"/>
        <line x1="${compassX - 22}" y1="${compassY}" x2="${compassX + 22}" y2="${compassY}" opacity="0.32"/>
      </g>
      <polygon points="${compassX},${compassY - 18} ${compassX - 5},${compassY - 2} ${compassX + 5},${compassY - 2}" fill="${COLOR.accent}"/>
      <text x="${compassX}" y="${compassY - 28}" text-anchor="middle" fill="${COLOR.accent}" font-size="16" font-family="${FONT_MONO}">n</text>
    `;

    const dateLabel = post && post.date ? escapeXml(post.date) : '';
    const mark = escapeXml(post && post.siteTitle ? post.siteTitle : 'buralarda iken');
    const postTitle = String(title || '').toLowerCase();
    const showPostTitle = postTitle && postTitle !== 'buralarda iken';
    const lines = wrapLines(postTitle, 28, 2);
    const titleX = 48;
    const titleTs = lines.map((line, i) => (
      `<tspan x="${titleX}" dy="${i === 0 ? 0 : 68}">${escapeXml(line)}</tspan>`
    )).join('');
    const titleY = lines.length > 1 ? 512 : 580;
    const typeStroke = `stroke="${COLOR.hard}" stroke-width="10" stroke-linejoin="round" paint-order="stroke fill"`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image href="${reliefHref}" xlink:href="${reliefHref}" width="${WIDTH}" height="${MAP_H}" preserveAspectRatio="none"/>
  ${streams.join('\n  ')}
  ${contourPaths.join('\n  ')}
  ${compass}
  <text x="48" y="72" fill="${COLOR.ink}" font-size="48" font-weight="700" font-family="${FONT_SANS}" ${typeStroke}>${mark}</text>
  ${dateLabel ? `<text x="1152" y="72" text-anchor="end" fill="${COLOR.straw}" font-size="48" font-weight="700" font-family="${FONT_SANS}" ${typeStroke}>${dateLabel}</text>` : ''}
  ${showPostTitle ? `<text x="${titleX}" y="${titleY}" fill="${COLOR.ink}" font-size="60" font-weight="700" font-family="${FONT_SANS}" ${typeStroke}>${titleTs}</text>` : ''}
</svg>`;
  } catch (error) {
    console.error(`Error generating SVG for ${post && post.title ? post.title : 'unknown post'}: ${error.message}`);
    return null;
  }
}

async function writeOutputFiles(baseName, svgString, rasterBuffer, extension) {
  const outputs = [];
  const dests = [
    path.join(sourcePlaceholdersDir, `${baseName}.${extension}`),
    path.join(sitePlaceholdersDir, `${baseName}.${extension}`)
  ];
  for (const dest of dests) {
    try {
      if (extension === 'svg') fs.writeFileSync(dest, svgString);
      else if (Buffer.isBuffer(rasterBuffer)) fs.writeFileSync(dest, rasterBuffer);
      outputs.push(dest);
    } catch (err) {
      console.error(`Failed writing ${dest}: ${err.message}`);
    }
  }
  return outputs;
}

async function rasterize(svgString) {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: 'width', value: WIDTH },
    background: COLOR.paper,
    font: {
      fontDirs: [FONT_DIR],
      defaultFontFamily: 'IBM Plex Sans',
      sansSerifFamily: 'IBM Plex Sans',
      monospaceFamily: 'IBM Plex Mono',
      loadSystemFonts: true
    }
  });
  const pngData = resvg.render();
  const basePng = pngData.asPng();
  let image = sharp(basePng).resize(WIDTH, HEIGHT, { fit: 'cover' });
  if (requestedFormat === 'png') {
    return image.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  }
  return image.flatten({ background: COLOR.paper }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
}

function slugFromUrl(url) {
  const parts = String(url || '').split('/').filter(Boolean);
  return parts[parts.length - 1] || parts[parts.length - 2] || null;
}

function dateFromFilename(fileBase) {
  const match = fileBase.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function collectSlugs(frontMatter, postFile) {
  const slugSet = new Set();
  const addSlug = s => { if (s && typeof s === 'string') slugSet.add(s.toLowerCase()); };
  const lang = frontMatter.lang || 'tr';

  if (frontMatter.translations) {
    try {
      const translations = Array.isArray(frontMatter.translations)
        ? frontMatter.translations
        : JSON.parse(frontMatter.translations);
      translations.forEach(t => {
        if (t && (t.lang === lang || !t.lang)) addSlug(slugFromUrl(t.url));
      });
    } catch (parseError) {
      console.warn(`Error parsing translations for ${postFile}: ${parseError.message}`);
    }
  }

  const fileBase = postFile.replace(/\.md$/, '');
  const parts = fileBase.split('-');
  const noDate = parts.length > 3 ? parts.slice(3).join('-') : fileBase;
  addSlug(noDate);
  return slugSet;
}

async function emit(baseName, svgString) {
  if (requestedFormat === 'svg') {
    await writeOutputFiles(baseName, svgString, null, 'svg');
    console.log(`Generated ${baseName}.svg`);
    return;
  }
  const ext = requestedFormat === 'jpeg' ? 'jpg' : requestedFormat;
  const buffer = await rasterize(svgString);
  await writeOutputFiles(baseName, null, buffer, ext);
  console.log(`Generated ${baseName}.${ext}`);
}

async function processBlogPosts() {
  const postsDir = path.join(repoRoot, '_posts');
  console.log('Posts directory:', postsDir);

  if (!fs.existsSync(postsDir)) {
    console.error('Posts directory does not exist:', postsDir);
    return;
  }

  const posts = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  console.log(`Found ${posts.length} posts`);

  const homeSvg = await generatePlaceholderSVG({
    title: 'buralarda iken',
    date: null,
    siteTitle: 'buralarda iken'
  });
  if (homeSvg) {
    await emit('index-placeholder', homeSvg);
    await emit('home-placeholder', homeSvg);
  }

  for (const postFile of posts) {
    try {
      const postPath = path.join(postsDir, postFile);
      const postContent = fs.readFileSync(postPath, 'utf8');
      let frontMatter = {};
      try {
        frontMatter = Object.assign({}, matter(postContent).data || {});
      } catch (mmErr) {
        console.warn(`gray-matter failed for ${postFile}: ${mmErr.message}`);
        continue;
      }

      if (frontMatter.published === false || frontMatter.hidden === true) {
        console.log(`Skipping ${postFile} - unpublished`);
        continue;
      }
      if (frontMatter.header) {
        console.log(`Skipping ${postFile} - has header image`);
        continue;
      }
      if (!frontMatter.title) {
        console.warn(`Skipping ${postFile} - no title`);
        continue;
      }

      const fileBase = postFile.replace(/\.md$/, '');
      const svgString = await generatePlaceholderSVG({
        title: frontMatter.title,
        date: dateFromFilename(fileBase),
        siteTitle: 'buralarda iken'
      });
      if (!svgString) continue;

      for (const slug of collectSlugs(frontMatter, postFile)) {
        await emit(`${slug}-placeholder`, svgString);
      }
    } catch (postError) {
      console.error(`Error processing post ${postFile}: ${postError.message}`);
    }
  }
}

(async () => {
  try {
    await processBlogPosts();
    console.log('Placeholder generation completed successfully!');
  } catch (error) {
    console.error('Error generating placeholders:', error);
    process.exit(1);
  }
})();
