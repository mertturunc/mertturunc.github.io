// ASCII renderer: rasterizes a THREE.WebGLRenderer into a character grid.
//
// Strategy:
//  1. three.js renders the model into a small offscreen canvas and we read it
//     back as luminance. `renderAt` (in engine.js) sizes that buffer to the
//     grid. The renderer's pixel count is independent of the character size:
//     cell luminance (the shading signal) never changes when the user rescales
//     the glyphs.
//  2. One unified glyph pool — ASCII density ramps, block elements, thin light
//     strokes, and all 256 Unicode braille patterns — is measured per font at
//     build time and sorted by ink coverage (bright -> dense). There is no user
//     character-set choice: each cell renders the pool member whose ink
//     coverage best matches that cell's target density (1 - luminance), the
//     coverage-sorted nearest match. The single ramp gives the smooth density
//     shading from near-empty braille cells up through the block fills.
//  3. Every cell is tinted with one of up to three band colors
//     (shadow / mid / highlight) depending on its luminance and the thresholds.
//
// It is intentionally offline-friendly: no text DOM, just typed arrays.

// Primary family is the system monospace (matches the incumbent look); the
// symbol fonts are per-character fallbacks so braille/block glyphs also render
// on platforms whose default monospace lacks them (e.g. Windows Consolas).
const MONO_STACK = 'monospace, "Apple Symbols", "Segoe UI Symbol"';

// The unified density pool. Order is irrelevant: coverage is measured, then the
// ramp is sorted by ink coverage with near-ties deduplicated.
const ASCII_POOL = " .'`^\",:;Il!i><~+_-?][{}1()|\\/tfjrxncvuzXYUJCLQ0ZOmwqpdbkhao*#MW8&%B@$";
const BLOCK_POOL = '▀▄█▉▊▋▌▍▎▏▐░▒▓';
const LIGHT_POOL = '·•╌╎┆┊╍╏┇┋';
const BRAILLE_POOL = String.fromCodePoint(
  ...Array.from({ length: 256 }, (_, i) => 0x2800 + i),
);
const GLYPH_POOL = [...new Set((ASCII_POOL + BLOCK_POOL + LIGHT_POOL + BRAILLE_POOL).split(''))];

// Ramp rebuild triggers: the font (coverage keeps pace with glyph metrics).
let coverageCache = new Map();
let ramp = []; // sorted ascending by ink coverage (bright -> dense)
let rampKey = null; // font size signature the ramp was measured at

// Ordered (Bayer) dithering matrices. The band index within a cell may flip to
// the next ink based on a matrix threshold, spatially mixing neighboring inks
// in mid-tones instead of a hard boundary edge (idea borrowed from
// still-life-tool.vercel.app's quantizer).
const BAYER_SIZES = { bayer4x4: 4, bayer8x8: 8 };
const bayerCache = {};

function getBayerMatrix(n) {
  if (bayerCache[n]) return bayerCache[n];
  let m = [
    [0, 2],
    [3, 1],
  ];
  while (m.length < n) {
    const s = m.length;
    const next = Array.from({ length: s * 2 }, () => new Array(s * 2));
    const blocks = [
      [0, 2],
      [3, 1],
    ];
    for (let y = 0; y < s * 2; y++) {
      for (let x = 0; x < s * 2; x++) {
        const qy = y < s ? 0 : 1;
        const qx = x < s ? 0 : 1;
        next[y][x] = m[y % s][x % s] * 4 + blocks[qy][qx];
      }
    }
    m = next;
  }
  bayerCache[n] = m;
  return m;
}

function measureCoverage(char, fontPx) {
  const cacheKey = fontPx + '::' + char;
  if (coverageCache.has(cacheKey)) return coverageCache.get(cacheKey);
  let coverage = 0.42;
  try {
    const c = document.createElement('canvas');
    c.width = Math.max(2, Math.ceil(fontPx * 1.1));
    c.height = Math.max(2, Math.ceil(fontPx * 1.75 * 1.1));
    const cc = c.getContext('2d', { willReadFrequently: true });
    cc.font = `${fontPx}px ${MONO_STACK}`;
    cc.textAlign = 'center';
    cc.textBaseline = 'middle';
    cc.fillStyle = '#fff';
    cc.fillText(char, c.width / 2, c.height / 2);
    const { data } = cc.getImageData(0, 0, c.width, c.height);
    let on = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 32) on++;
    coverage = on / data.length;
  } catch {
    /* ignore, fallback */
  }
  coverageCache.set(cacheKey, coverage);
  return coverage;
}

function buildRamp(fontPx) {
  const list = [];
  for (const ch of GLYPH_POOL) {
    list.push({ char: ch, cov: measureCoverage(ch, fontPx) });
  }
  list.sort((a, b) => a.cov - b.cov); // bright -> dense

  // Collapse near-identical coverage levels (e.g. same dot-count braille
  // patterns) into one representative so the ramp reads as a clean gradient.
  const dedup = [];
  for (const g of list) {
    const prev = dedup[dedup.length - 1];
    if (prev && Math.abs(prev.cov - g.cov) <= 0.006) continue;
    dedup.push(g);
  }
  ramp = dedup;
  rampKey = fontPx;
}

// Nearest-coverage glyph for a target ink density in [0,1] (0 = blank).
function glyphFor(target) {
  const n = ramp.length;
  if (!n) return ' ';
  // Binary search for the first entry with coverage >= target.
  let lo = 0;
  let hi = n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (ramp[mid].cov < target) lo = mid + 1;
    else hi = mid;
  }
  const idx = Math.min(n - 1, lo);
  const prev = idx > 0 ? idx - 1 : idx;
  const dIdx = Math.abs(ramp[idx].cov - target);
  const dPrev = Math.abs(ramp[prev].cov - target);
  // Ties favor the sparser glyph (lower coverage) for a softer look.
  return ramp[dPrev <= dIdx ? prev : idx].char;
}

/**
 * Create an ASCII rasterizer bound to a source THREE renderer.
 * @param {HTMLCanvasElement} monitor - canvas the final ASCII art is drawn to.
 */
export function createAsciiRasterizer(monitor) {
  const ctx = monitor.getContext('2d');
  let columns = 0;
  let rows = 0;
  let cellSize = 8; // px cell width; cell height is ~1.75x
  let cellWidth = 8;
  let cellHeight = 14;
  let contrastFactor = 1; // 1 = neutral; 0.5..1.5 from the contrast slider

  /**
   * Set the luminance contrast pre-pass (-100..100, 0 = neutral). Applied to
   * each cell's luminance before glyph density and band assignment, so raising
   * it sharpens the 1-3 ink separation (mirrors the competitor's pixel-level
   * contrast stretch).
   */
  function setContrast(value) {
    const n = Number(value);
    const c = Number.isFinite(n) ? Math.max(-100, Math.min(100, n)) : 0;
    contrastFactor = 1 + c / 100;
  }

  const lumCanvas = document.createElement('canvas');
  const lumCtx = lumCanvas.getContext('2d', { willReadFrequently: true });

  /**
   * Set the character size (px cell width). Rebuilds the measured ramp because
   * glyph ink coverage is re-derived from the font at the new size.
   */
  function setCellSize(px) {
    const n = toInt(px, 8);
    if (n === cellSize) return;
    cellSize = Math.max(3, Math.min(24, n));
    cellWidth = cellSize;
    cellHeight = Math.round(cellSize * 1.75);
    buildRamp(cellHeight);
    if (columns) setSize(columns, rows);
  }

  function setSize(colsIn, rowsIn) {
    columns = toInt(colsIn, 96);
    rows = toInt(rowsIn, 54);
    columns = Math.max(1, Math.min(500, columns));
    rows = Math.max(1, Math.min(300, rows));
    monitor.width = columns * cellWidth;
    monitor.height = rows * cellHeight;
    lumCanvas.width = columns;
    lumCanvas.height = rows;
  }

  function toInt(v, fb) {
    const n = Math.floor(Number(v));
    return Number.isFinite(n) ? n : fb;
  }

  function drawToLum(source) {
    if (!columns || !rows) return;
    lumCtx.clearRect(0, 0, lumCanvas.width, lumCanvas.height);
    lumCtx.drawImage(source, 0, 0, columns, rows);
  }

  function luminanceOf(data, i) {
    return 0.2126 * (data[i] / 255) + 0.7152 * (data[i + 1] / 255) + 0.0722 * (data[i + 2] / 255);
  }

  // Pick the ink index for a cell luminance given color count + band boundaries.
  // With provocative `dither` ("bayer4x4"/"bayer8x8") mid-tone cells flip to the
  // next ink where the Bayer matrix threshold exceeds the luminance's fractional
  // position inside its band segment, so adjacent inks mix spatially.
  function bandIndex(lum, thresholds, cCount, dither, x, y) {
    if (cCount === 1) return 0;
    const two = cCount === 2;
    const base = two
      ? lum >= thresholds[0]
        ? 1
        : 0
      : lum < thresholds[0]
        ? 0
        : lum < thresholds[1]
          ? 1
          : 2;
    if (!dither || dither === 'none') return base;
    const n = BAYER_SIZES[dither];
    if (!n) return base;

    // Segment this luminance falls in: [lo, hi) with its upper neighbor band.
    let lo;
    let hi;
    let next;
    if (lum < thresholds[0]) {
      lo = 0;
      hi = Math.max(1e-6, thresholds[0]);
      next = 1;
    } else if (two) {
      return base; // top band of a 2-ink render: nothing above to mix into
    } else if (lum < thresholds[1]) {
      lo = thresholds[0];
      hi = Math.max(lo + 1e-6, thresholds[1]);
      next = 2;
    } else {
      return base; // brightest band
    }

    const frac = (lum - lo) / (hi - lo);
    const matrix = getBayerMatrix(n);
    const thr = (matrix[y % n][x % n] + 0.5) / (n * n);
    return frac >= thr ? Math.min(cCount - 1, next) : base;
  }

  /**
   * Rasterize the current lum buffer into characters on the monitor canvas.
   * @param {object} shade
   * @param {string[]} [shade.colors] - band inks, dark -> bright (1..3 entries)
   * @param {number[]} [shade.thresholds] - band boundaries (0..1), ascending
   * @param {string} [shade.dither] - 'none' | 'bayer4x4' | 'bayer8x8'
   * @param {number} [shade.threshold] - legacy single boundary for 2 colors
   * @param {string} [shade.colorA] - legacy shadow ink
   * @param {string} [shade.colorB] - legacy highlight ink
   */
  function rasterize(shade) {
    const w = columns;
    const h = rows;
    if (!w || !h) return;

    const colors =
      shade.colors && shade.colors.length
        ? shade.colors
        : [shade.colorA || '#151921', shade.colorB || '#1d4ed8'];
    const thresholds =
      shade.thresholds && shade.thresholds.length
        ? shade.thresholds
        : [Number.isFinite(shade.threshold) ? shade.threshold : 0.5];
    const darkCss = colors.map(hexToRgb);

    const { data } = lumCtx.getImageData(0, 0, lumCanvas.width, lumCanvas.height);

    if (rampKey !== cellHeight) buildRamp(cellHeight);

    ctx.save();
    ctx.clearRect(0, 0, monitor.width, monitor.height);
    ctx.font = `${cellHeight}px ${MONO_STACK}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const midX = cellWidth / 2;
    const midY = cellHeight / 2;
    const cCount = colors.length;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (data[i + 3] <= 8) continue; // transparent background -> empty cell
        const lum = luminanceOf(data, i);
        const gem = commonGlyph(lum, thresholds, cCount, shade.dither, x, y);
        if (gem === ' ') continue; // blank density -> transparent
        ctx.fillStyle = darkCss[gem.ink];
        ctx.fillText(gem.char, x * cellWidth + midX, y * cellHeight + midY);
      }
    }
    ctx.restore();
  }

  // Per cell: which glyph + which band ink. The algorithm picks the pool glyph
  // whose measured ink coverage best matches the target density `1 - luminance`.
  // The contrast pre-pass is applied to the luminance first, so it shapes both
  // glyph density and band membership.
  function commonGlyph(lum, thresholds, cCount, dither, x, y) {
    const t = contrastFactor === 1 ? clamp01(lum) : clamp01((clamp01(lum) - 0.5) * contrastFactor + 0.5);
    const ink = bandIndex(t, thresholds, cCount, dither, x, y);
    const name = glyphFor(1 - t);
    return { char: name, ink };
  }

  function applyContrast(v) {
    return contrastFactor === 1 ? v : clamp01((clamp01(v) - 0.5) * contrastFactor + 0.5);
  }

  function cellLums() {
    if (!columns || !rows) return [];
    const { data } = lumCtx.getImageData(0, 0, columns, rows);
    const out = [];
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] <= 8) continue;
      out.push(applyContrast(luminanceOf(data, i)));
    }
    return out;
  }

  return {
    setSize,
    setCellSize,
    setContrast,
    drawToLum,
    rasterize,
    sampleLum() {
      if (!columns || !rows) return null;
      const { data } = lumCtx.getImageData(0, 0, columns, rows);
      let opaque = 0;
      let max = 0;
      let bright = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > max) max = data[i];
        if (data[i] > 8) opaque++;
        if (applyContrast(luminanceOf(data, i - 3)) > 0.5) bright++;
      }
      return { size: [columns, rows], opaque, maxAlpha: max, bright };
    },
    cellLums,
    /** Luminance sample grid (always 1 sample per cell in this design). */
    sampleDims() {
      return [columns, rows];
    },
    get columns() {
      return columns;
    },
    get rows() {
      return rows;
    },
    get cellWidth() {
      return cellWidth;
    },
    get cellHeight() {
      return cellHeight;
    },
    get canvas() {
      return monitor;
    },
    get ctx() {
      return ctx;
    },
  };
}

export function hexToRgb(hex) {
  let h = String(hex).replace('#', '');
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  const num = parseInt(h, 16);
  return `rgb(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255})`;
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}