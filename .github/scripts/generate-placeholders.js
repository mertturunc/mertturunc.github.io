'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const zlib = require('zlib');
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

const FONT_SANS = 'IBM Plex Sans';
const FONT_MONO = 'IBM Plex Mono';

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

function woffToSfnt(woff) {
  if (woff.toString('ascii', 0, 4) !== 'wOFF') {
    throw new Error('not woff1');
  }
  const flavor = woff.readUInt32BE(4);
  const numTables = woff.readUInt16BE(12);
  const totalSfntSize = woff.readUInt32BE(16);
  const sfnt = Buffer.alloc(totalSfntSize);
  sfnt.writeUInt32BE(flavor, 0);
  sfnt.writeUInt16BE(numTables, 4);
  let maxPow = 1;
  while (maxPow * 2 <= numTables) maxPow *= 2;
  const searchRange = maxPow * 16;
  sfnt.writeUInt16BE(searchRange, 6);
  sfnt.writeUInt16BE(Math.round(Math.log2(maxPow)), 8);
  sfnt.writeUInt16BE(numTables * 16 - searchRange, 10);

  const entries = [];
  for (let i = 0; i < numTables; i++) {
    const o = 44 + i * 20;
    entries.push({
      tag: woff.readUInt32BE(o),
      offset: woff.readUInt32BE(o + 4),
      compLength: woff.readUInt32BE(o + 8),
      origLength: woff.readUInt32BE(o + 12),
      origChecksum: woff.readUInt32BE(o + 16)
    });
  }
  entries.sort((a, b) => a.tag - b.tag);

  let dest = 12 + numTables * 16;
  dest = (dest + 3) & ~3;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const rec = 12 + i * 16;
    sfnt.writeUInt32BE(e.tag, rec);
    sfnt.writeUInt32BE(e.origChecksum, rec + 4);
    sfnt.writeUInt32BE(dest, rec + 8);
    sfnt.writeUInt32BE(e.origLength, rec + 12);
    const chunk = woff.slice(e.offset, e.offset + e.compLength);
    const data = e.compLength < e.origLength ? zlib.inflateSync(chunk) : chunk;
    data.copy(sfnt, dest, 0, Math.min(data.length, e.origLength));
    dest += e.origLength;
    dest = (dest + 3) & ~3;
  }
  return sfnt;
}

function plexTtfFiles() {
  const cache = path.join(os.tmpdir(), 'hobizone-plex-ttf');
  fs.mkdirSync(cache, { recursive: true });
  const pairs = [
    ['IBMPlexSans-Text.woff', 'IBMPlexSans-Text.ttf'],
    ['IBMPlexMono-Text-Latin1.woff', 'IBMPlexMono-Text.ttf']
  ];
  const files = [];
  for (const [woffName, ttfName] of pairs) {
    const ttfPath = path.join(cache, ttfName);
    const woffPath = path.join(FONT_DIR, woffName);
    if (!fs.existsSync(ttfPath) || fs.statSync(woffPath).mtimeMs > fs.statSync(ttfPath).mtimeMs) {
      fs.writeFileSync(ttfPath, woffToSfnt(fs.readFileSync(woffPath)));
    }
    files.push(ttfPath);
  }
  return files;
}

const PLEX_TTFS = plexTtfFiles();
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

function quintic(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

const GRADS = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [0.70710678, 0.70710678], [-0.70710678, 0.70710678],
  [0.70710678, -0.70710678], [-0.70710678, -0.70710678]
];

function gradAt(ix, iy, seed) {
  const n = Math.imul(ix + seed, 374761393) ^ Math.imul(iy + seed * 3, 668265263);
  return GRADS[(n >>> 0) & 7];
}

function noise2(x, y, seed) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const u = quintic(fx);
  const v = quintic(fy);
  const g00 = gradAt(x0, y0, seed);
  const g10 = gradAt(x0 + 1, y0, seed);
  const g01 = gradAt(x0, y0 + 1, seed);
  const g11 = gradAt(x0 + 1, y0 + 1, seed);
  const n00 = g00[0] * fx + g00[1] * fy;
  const n10 = g10[0] * (fx - 1) + g10[1] * fy;
  const n01 = g01[0] * fx + g01[1] * (fy - 1);
  const n11 = g11[0] * (fx - 1) + g11[1] * (fy - 1);
  return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v);
}

function fbm(x, y, seed, octaves, lacunarity, rot) {
  let sum = 0;
  let amp = 1;
  let freq = 1;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    const a = rot + o * 0.73;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const px = x * freq;
    const py = y * freq;
    sum += noise2(px * c - py * s, px * s + py * c, seed + o * 19) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= lacunarity;
  }
  return sum / (norm || 1);
}

function terrainParams(seed) {
  const rand = mulberry32(seed ^ 0x9e3779b9);
  const hills = [];
  const nHills = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < nHills; i++) {
    hills.push({
      x: 0.1 + rand() * 0.8,
      y: 0.12 + rand() * 0.76,
      r: 0.12 + rand() * 0.34,
      h: (rand() * 2 - 1) * (0.2 + rand() * 0.4)
    });
  }
  return {
    freqX: 1.5 + rand() * 3.1,
    freqY: 1.15 + rand() * 2.6,
    warp: 0.7 + rand() * 3.6,
    ridge: rand() < 0.5 ? rand() * 0.34 : 0,
    octaves: 4 + Math.floor(rand() * 3),
    lacunarity: 1.86 + rand() * 0.38,
    rot: rand() * Math.PI * 2,
    offsetX: rand() * 48,
    offsetY: rand() * 48,
    qx: 2 + rand() * 8,
    qy: 1 + rand() * 7,
    hills,
    levels: 8 + Math.floor(rand() * 5),
    streams: 1 + Math.floor(rand() * 3),
    exag: 12 + rand() * 18
  };
}

function warpedHeight(nx, ny, seed, p) {
  const px = nx * p.freqX + p.offsetX;
  const py = ny * p.freqY + p.offsetY;
  const q0 = fbm(px, py, seed, 3, p.lacunarity, p.rot);
  const q1 = fbm(px + p.qx, py + p.qy, seed + 7, 3, p.lacunarity, p.rot + 1.17);
  const h = fbm(px + p.warp * q0, py + p.warp * q1, seed + 23, p.octaves, p.lacunarity, p.rot * 0.5);
  let z = h;
  if (p.ridge > 0) {
    const ridge = 1 - Math.abs(fbm(px * 0.52, py * 0.52, seed + 31, 4, p.lacunarity, p.rot + 0.4));
    z = h * (1 - p.ridge) + (ridge * 2 - 1) * p.ridge;
  }
  for (const hill of p.hills) {
    const dx = nx - hill.x;
    const dy = (ny - hill.y) * 1.12;
    z += hill.h * Math.exp(-(dx * dx + dy * dy) / (hill.r * hill.r));
  }
  return z;
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
  const params = terrainParams(seed);
  const grid = [];
  let min = Infinity;
  let max = -Infinity;
  for (let y = 0; y <= ROWS; y++) {
    grid[y] = [];
    for (let x = 0; x <= COLS; x++) {
      const h = warpedHeight(x / COLS, y / ROWS, seed, params);
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
  return { grid, params };
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

function buildShade(grid, exag) {
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
      const i = (py * WIDTH + px) * 3;
      buf[i] = rgb[0];
      buf[i + 1] = rgb[1];
      buf[i + 2] = rgb[2];
    }
  }
  return sharp(buf, { raw: { width: WIDTH, height: MAP_H, channels: 3 } }).png().toBuffer();
}

async function renderScrimPng() {
  const topBand = Math.round(HEIGHT * 0.16);
  const botBand = Math.round(HEIGHT * 0.31);
  const buf = Buffer.alloc(WIDTH * HEIGHT * 4);
  for (let y = 0; y < HEIGHT; y++) {
    let a = 0;
    if (y < topBand) a = Math.max(a, Math.round(255 * 0.7 * (1 - y / topBand)));
    const fromBot = HEIGHT - 1 - y;
    if (fromBot < botBand) a = Math.max(a, Math.round(255 * 0.82 * (1 - fromBot / botBand)));
    if (!a) continue;
    for (let x = 0; x < WIDTH; x++) {
      const i = (y * WIDTH + x) * 4;
      buf[i + 3] = a;
    }
  }
  return sharp(buf, { raw: { width: WIDTH, height: HEIGHT, channels: 4 } }).png().toBuffer();
}

let scrimHrefPromise = null;
function scrimHref() {
  if (!scrimHrefPromise) {
    scrimHrefPromise = renderScrimPng().then(
      png => `data:image/png;base64,${png.toString('base64')}`
    );
  }
  return scrimHrefPromise;
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

function pickStreams(grid, seed, count) {
  const rand = mulberry32(seed + 99);
  const candidates = [];
  for (let y = 4; y < ROWS - 4; y += 3) {
    for (let x = 4; x < COLS - 4; x += 3) {
      if (grid[y][x] > 0.68) candidates.push([x, y, grid[y][x]]);
    }
  }
  candidates.sort((a, b) => b[2] - a[2]);
  const starts = [];
  const want = Math.max(1, count);
  for (const c of candidates) {
    if (starts.length >= want) break;
    if (starts.every(s => Math.hypot(s[0] - c[0], s[1] - c[1]) > 24)) {
      starts.push(c);
    }
  }
  while (starts.length < want) {
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
    const { grid: height, params } = buildHeight(seed);
    const shade = buildShade(height, params.exag);
    const reliefPng = await renderReliefPng(height, shade);
    const reliefHref = `data:image/png;base64,${reliefPng.toString('base64')}`;
    const fadeHref = await scrimHref();

    const levelCount = params.levels;
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

    const streams = pickStreams(height, seed, params.streams).map(pts => (
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
    const lines = wrapLines(postTitle, 34, 2);
    const titleX = 48;
    const titleTs = lines.map((line, i) => (
      `<tspan x="${titleX}" dy="${i === 0 ? 0 : 44}">${escapeXml(line)}</tspan>`
    )).join('');
    const titleY = lines.length > 1 ? 540 : 586;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image href="${reliefHref}" xlink:href="${reliefHref}" width="${WIDTH}" height="${MAP_H}" preserveAspectRatio="none"/>
  ${streams.join('\n  ')}
  ${contourPaths.join('\n  ')}
  ${compass}
  <image href="${fadeHref}" xlink:href="${fadeHref}" width="${WIDTH}" height="${HEIGHT}" preserveAspectRatio="none"/>
  <text x="48" y="52" fill="${COLOR.ink}" font-size="22" font-family="${FONT_MONO}">${mark}</text>
  ${dateLabel ? `<text x="1152" y="52" text-anchor="end" fill="${COLOR.straw}" font-size="22" font-family="${FONT_MONO}">${dateLabel}</text>` : ''}
  ${showPostTitle ? `<text x="${titleX}" y="${titleY}" fill="${COLOR.ink}" font-size="40" font-family="${FONT_SANS}">${titleTs}</text>` : ''}
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
      fontFiles: PLEX_TTFS,
      defaultFontFamily: 'IBM Plex Sans',
      sansSerifFamily: 'IBM Plex Sans',
      monospaceFamily: 'IBM Plex Mono',
      loadSystemFonts: false
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
