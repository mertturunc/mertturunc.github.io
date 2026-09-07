'use strict';

/**
 * One-shot baker for the in-article missing-image isolines.
 * Same heightfield + marching squares + Chaikin as generate-placeholders.js,
 * cropped to the placeholder well and emitted as a cached SVG sprite.
 * Wraps paths in a group with data-compact-viewbox for 1:1 wells.
 *
 *   node .github/scripts/bake-missing-image-iso.js --seed=kadikoy
 *   node .github/scripts/bake-missing-image-iso.js --seed=kadikoy --stdout
 *   node .github/scripts/bake-missing-image-iso.js --seed=2147483647 --preview
 */

const fs = require('fs');
const path = require('path');

const WIDTH = 800;
const HEIGHT = 400;
const COLS = 200;
const ROWS = 100;
const CELL_X = WIDTH / COLS;
const CELL_Y = HEIGHT / ROWS;

function getArg(name) {
  const pref = `--${name}=`;
  const found = process.argv.find(arg => arg.startsWith(pref));
  return found ? found.slice(pref.length) : null;
}

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
    levels: 9,
    streams: 0,
    exag: 12
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

function touchesEdge(pts, pad) {
  return pts.some(([x, y]) =>
    x <= pad || y <= pad || x >= WIDTH - pad || y >= HEIGHT - pad
  );
}

function isClosed(pts) {
  if (pts.length < 8) return false;
  const a = pts[0];
  const b = pts[pts.length - 1];
  return Math.hypot(a[0] - b[0], a[1] - b[1]) < 4;
}

function polylineLength(pts) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return len;
}

function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const a = pts[0];
  const b = pts[pts.length - 1];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const mag2 = dx * dx + dy * dy;
  let maxD = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const t = mag2 < 1e-6 ? 0 : ((pts[i][0] - a[0]) * dx + (pts[i][1] - a[1]) * dy) / mag2;
    const px = a[0] + t * dx;
    const py = a[1] + t * dy;
    const d = Math.hypot(pts[i][0] - px, pts[i][1] - py);
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD > eps) {
    const left = rdp(pts.slice(0, idx + 1), eps);
    const right = rdp(pts.slice(idx), eps);
    return left.slice(0, -1).concat(right);
  }
  return [a, b];
}

function toCubic(pts) {
  const p = rdp(chaikin(pts, 3), 1.7);
  const k = 0.12;
  if (p.length < 3) {
    return `M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}` +
      p.slice(1).map(pt => ` L ${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join('');
  }
  let d = `M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[Math.min(p.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) * k;
    const c1y = p1[1] + (p2[1] - p0[1]) * k;
    const c2x = p2[0] - (p3[0] - p1[0]) * k;
    const c2y = p2[1] - (p3[1] - p1[1]) * k;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function meanTurn(pts) {
  let sum = 0;
  let n = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const a = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]);
    const b = Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]);
    let d = Math.abs(b - a);
    if (d > Math.PI) d = 2 * Math.PI - d;
    sum += d;
    n++;
  }
  return n ? sum / n : 0;
}

function collectIso(seed) {
  const { grid } = buildHeight(seed);
  const levels = [0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78, 0.88];
  const bags = levels.map((level, i) => {
    const raw = stitch(marchingSegments(grid, level))
      .map(pts => ({
        pts,
        level,
        index: i === 3,
        len: polylineLength(pts),
        turn: meanTurn(pts),
        open: !isClosed(pts) && touchesEdge(pts, 3)
      }))
      .filter(p => p.open && p.len > 160 && p.pts.length > 12);
    raw.sort((a, b) => b.len - a.len);
    return raw;
  });

  const picked = [];
  bags.forEach((bag) => {
    if (bag[0]) picked.push(bag[0]);
  });

  picked.sort((a, b) => a.level - b.level || b.len - a.len);

  const calm = picked.filter(p => p.len > 240 && p.turn < 0.42);
  const accent = (calm.length ? calm : picked)
    .slice()
    .sort((a, b) => (b.len - a.len) + (a.turn - b.turn) * 400)[0];

  const openCount = picked.filter(p => p.open).length;
  const score = openCount * 40 + picked.reduce((s, p) => s + p.len, 0) / 80
    - picked.reduce((s, p) => s + p.turn, 0) * 20;
  return { picked, accent, score, openCount };
}

function compactViewBox({ picked, accent }) {
  const side = HEIGHT;
  const focus = picked.filter(p => p === accent || p.index);
  const pts = (focus.length ? focus : picked).flatMap(p => p.pts);
  let minX = Infinity;
  let maxX = -Infinity;
  pts.forEach(([x]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
  });
  const width = maxX - minX;
  let x0 = width > side
    ? minX - 4
    : (minX + maxX) / 2 - side / 2;
  x0 = Math.max(0, Math.min(WIDTH - side, x0));
  return `${Math.round(x0)} 0 ${side} ${side}`;
}

function pathMarkup(iso) {
  const { picked, accent } = iso;
  const paths = picked.map(p => {
    const isAccent = accent && p === accent;
    const cls = [
      'missing-image__iso',
      p.index && !isAccent ? 'missing-image__iso--index' : '',
      isAccent ? 'missing-image__iso--accent' : ''
    ].filter(Boolean).join(' ');
    const pl = isAccent ? ' pathLength="1"' : '';
    return `        <path class="${cls}"${pl} d="${toCubic(p.pts)}" />`;
  }).join('\n');
  return `        <g data-compact-viewbox="${compactViewBox(iso)}">\n${paths}\n        </g>`;
}

function spriteSvg(markup) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" aria-hidden="true">
${markup}
</svg>
`;
}

function previewSvg(markup) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">
  <rect width="100%" height="100%" fill="#3c3836"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
${markup.replace(/class="missing-image__iso"/g, 'stroke="#a89984" stroke-width="1.1" opacity="0.45"')
    .replace(/class="missing-image__iso missing-image__iso--index"/g, 'stroke="#ebdbb2" stroke-width="1.7" opacity="0.35"')
    .replace(/class="missing-image__iso missing-image__iso--accent"/g, 'stroke="#fe8019" stroke-width="1.7" opacity="0.95"')
    .replace(/class="missing-image__iso missing-image__iso--index missing-image__iso--accent"/g, 'stroke="#fe8019" stroke-width="1.7" opacity="0.95"')}
  </g>
</svg>`;
}

const seedArg = getArg('seed');
const wantPreview = process.argv.includes('--preview');
const seed = seedArg ? (Number(seedArg) || hashString(seedArg)) : hashString('buralarda iken missing well');

if (process.argv.includes('--search')) {
  const labels = [
    'buralarda iken missing well',
    'paz can',
    'ridge scrap',
    'karadeniz',
    'ulus',
    'kadikoy',
    'horn',
    'isohips',
    'map scrap 12',
    'fbm ridge 7'
  ];
  const ranked = labels.map(label => {
    const s = hashString(label);
    const iso = collectIso(s);
    return { label, seed: s, score: iso.score, open: iso.openCount, n: iso.picked.length };
  }).sort((a, b) => b.score - a.score);
  console.log(ranked);
  process.exit(0);
}

const iso = collectIso(seed);
const markup = pathMarkup(iso);
const sprite = spriteSvg(markup);
const spriteDest = path.join(__dirname, '../../i/missing-image-iso.svg');

if (process.argv.includes('--stdout')) {
  process.stdout.write(markup + '\n');
} else if (!wantPreview) {
  fs.mkdirSync(path.dirname(spriteDest), { recursive: true });
  fs.writeFileSync(spriteDest, sprite);
}

console.error(`seed=${seed} paths=${iso.picked.length} open=${iso.openCount} score=${iso.score.toFixed(1)} bytes=${sprite.length}${wantPreview ? '' : ` ${path.relative(process.cwd(), spriteDest)}`}`);

if (wantPreview) {
  const dest = path.join(__dirname, '../../.playwright-cli', `iso-${seed}.svg`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, previewSvg(markup));
  fs.writeFileSync(dest.replace(/\.svg$/, '.htmlfrag'), markup);
  console.error(`preview ${dest}  bytes=${markup.length}`);
}
