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
//  3. Inks follow luminance bands (so picking a palette actually reads):
//     colorA = shadow (dark cells), colorB = mid, colorC = light/edge.
//     colorMode 1 = A only, 2 = A+C, 3 = A+B+C. colorMix dithers neighbors.
//     On dark paper, adaptInksToPaper rebuilds A/B/C from accent hues so
//     Ocean/Ember stay vivid instead of washing to grey.
//  4. Extended options: text | shapes | mixed cell modes, outline, gamma,
//     spacing, bg fill, colorMix, trail, explode scatter.
//
// It is intentionally offline-friendly: no text DOM, just typed arrays.

// Primary family is the system monospace (matches the incumbent look); the
// symbol fonts are per-character fallbacks so braille/block glyphs also render
// on platforms whose default monospace lacks them (e.g. Windows Consolas).
export const ASCII_FONT_STACK = 'monospace, "Apple Symbols", "Segoe UI Symbol"';
const MONO_STACK = ASCII_FONT_STACK;
/** Cell height / width (20×30 drawer grid → ≈1.5). */
export const CELL_ASPECT = 1 / 0.667;

// The unified density pool. Order is irrelevant: coverage is measured, then the
// ramp is sorted by ink coverage with near-ties deduplicated.
const ASCII_POOL = " .'`^\",:;Il!i><~+_-?][{}1()|\\/tfjrxncvuzXYUJCLQ0ZOmwqpdbkhao*#MW8&%B@$";
const BLOCK_POOL = '▀▄█▉▊▋▌▍▎▏▐░▒▓';
const LIGHT_POOL = '·•╌╎┆┊╍╏┇┋';
const BRAILLE_POOL = String.fromCodePoint(
  ...Array.from({ length: 256 }, (_, i) => 0x2800 + i),
);
const GLYPH_POOL = [...new Set((ASCII_POOL + BLOCK_POOL + LIGHT_POOL + BRAILLE_POOL).split(''))];

/** Band character sets (dark → edge). Used for text / mixed cell modes. */
const BAND_CHARS = {
  dark: ['M', 'H', 'O', 'F', '█', '▓', 'W', 'B'],
  mid: ['●', '◉', '©', '▒', '░', 'N', '◎', 'A'],
  light: ['N', 'O', '0', '©', '○', 'o', '°', '·'],
  edge: ['O', '0', '°', '·', '.', "'", ' '],
};
const BLOCK_CHARS = new Set(['█', '▓', '▒', '░']);
const DOT_CHARS = new Set(['○', '°', '·', '.', "'"]);
/** Luminance cuts 0–255 → normalized (dark / mid / light / edge). */
const BAND_CUTS = { dark: 95 / 255, mid: 170 / 255, light: 220 / 255, edge: 250 / 255 };

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

/** Pick a band character from luminance in [0,1]; null = empty / skip. */
function bandCharFor(lum01, density01) {
  const cuts = BAND_CUTS;
  let band;
  let dens;
  if (lum01 < cuts.dark) {
    band = 'dark';
    dens = 1 - lum01 / cuts.dark;
  } else if (lum01 < cuts.mid) {
    band = 'mid';
    dens = 1 - (lum01 - cuts.dark) / (cuts.mid - cuts.dark);
  } else if (lum01 < cuts.light) {
    band = 'light';
    dens = 1 - (lum01 - cuts.mid) / (cuts.light - cuts.mid);
  } else if (lum01 < cuts.edge) {
    band = 'edge';
    dens = 1 - (lum01 - cuts.light) / (cuts.edge - cuts.light);
  } else {
    return null;
  }
  const set = BAND_CHARS[band];
  const t = Number.isFinite(density01) ? density01 : dens;
  const idx = Math.min(set.length - 1, Math.floor(Math.max(0, Math.min(0.999, t)) * set.length));
  return { char: set[idx], band, dens, alpha: band === 'dark' ? 1 : band === 'mid' ? 0.9 : band === 'light' ? 0.7 : 0.45 };
}

/** Stable 0..1 hash from cell coords (for colorMix / explode). */
function cellHash(x, y) {
  let n = (x * 374761393 + y * 668265263) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

/**
 * Vector shape for a density target in [0,1].
 * Approximates block/dot/letter forms with path + fillRect.
 */
function drawShape(ctx, density, cx, cy, cw, ch) {
  const d = clamp01(density);
  if (d < 0.04) return;
  const hw = cw * 0.42;
  const hh = ch * 0.38;
  if (d < 0.15) {
    const r = Math.max(0.6, Math.min(hw, hh) * 0.22);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (d < 0.3) {
    const s = Math.min(hw, hh) * 0.45;
    ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
    return;
  }
  if (d < 0.45) {
    ctx.fillRect(cx - hw * 0.7, cy - hh * 0.12, hw * 1.4, hh * 0.24);
    return;
  }
  if (d < 0.58) {
    ctx.fillRect(cx - hw * 0.12, cy - hh * 0.7, hw * 0.24, hh * 1.4);
    return;
  }
  if (d < 0.72) {
    ctx.fillRect(cx - hw * 0.7, cy - hh * 0.12, hw * 1.4, hh * 0.24);
    ctx.fillRect(cx - hw * 0.12, cy - hh * 0.7, hw * 0.24, hh * 1.4);
    return;
  }
  if (d < 0.86) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - hh * 0.75);
    ctx.lineTo(cx + hw * 0.7, cy + hh * 0.65);
    ctx.lineTo(cx - hw * 0.7, cy + hh * 0.65);
    ctx.closePath();
    ctx.fill();
    return;
  }
  ctx.fillRect(cx - hw * 0.85, cy - hh * 0.85, hw * 1.7, hh * 1.7);
}

/**
 * Create an ASCII rasterizer bound to a source THREE renderer.
 * @param {HTMLCanvasElement} monitor - canvas the final ASCII art is drawn to.
 */
export function createAsciiRasterizer(monitor) {
  const ctx = monitor.getContext('2d');
  let columns = 0;
  let rows = 0;
  let cellSize = 8; // px cell width; height uses CELL_ASPECT
  let cellWidth = 8;
  let cellHeight = 14;
  let cellSpacing = 0;
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
    cellHeight = Math.round(cellSize * CELL_ASPECT);
    buildRamp(cellHeight);
    if (columns) setSize(columns, rows);
  }

  function setCellSpacing(px) {
    const n = Math.max(0, Math.min(16, toInt(px, 0)));
    if (n === cellSpacing) return;
    cellSpacing = n;
    if (columns) setSize(columns, rows);
  }

  function stepX() {
    return cellWidth + cellSpacing;
  }
  function stepY() {
    return cellHeight + cellSpacing;
  }

  function setSize(colsIn, rowsIn) {
    columns = toInt(colsIn, 96);
    rows = toInt(rowsIn, 54);
    columns = Math.max(1, Math.min(500, columns));
    rows = Math.max(1, Math.min(300, rows));
    monitor.width = columns * stepX();
    monitor.height = rows * stepY();
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
    // Match common NTSC weights used by the reference ASCII pipeline.
    return 0.299 * (data[i] / 255) + 0.587 * (data[i + 1] / 255) + 0.114 * (data[i + 2] / 255);
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
   */
  function rasterize(shade) {
    const w = columns;
    const h = rows;
    if (!w || !h) return;

    const rawColors =
      shade.colors && shade.colors.length
        ? shade.colors
        : [
            shade.colorA || '#1a1a1a',
            shade.colorB || '#FF6700',
            shade.colorC || '#FFC043',
          ];
    // Always keep a 3-ink triple for letter / accent-hot / accent-warm.
    while (rawColors.length < 3) {
      rawColors.push(rawColors[rawColors.length - 1] || '#1a1a1a');
    }
    const thresholds =
      shade.thresholds && shade.thresholds.length
        ? shade.thresholds
        : [Number.isFinite(shade.threshold) ? shade.threshold : 0.5];
    const colors = adaptInksToPaper(
      [rawColors[0], rawColors[1], rawColors[2]],
      resolvePaperHex(shade)
    );
    const darkCss = colors.map(hexToRgb);

    const { data } = lumCtx.getImageData(0, 0, lumCanvas.width, lumCanvas.height);

    if (rampKey !== cellHeight) buildRamp(cellHeight);

    const sx = stepX();
    const sy = stepY();
    const mode = shade.cellMode || 'text';
    const outline = !!shade.cellOutline;
    const gamma = Math.max(0.2, Math.min(4, Number(shade.gamma) || 1));
    const bold = !!shade.bold;
    const colorMix = clamp01(Number(shade.colorMix) || 0);
    const explode = clamp01(Number(shade.explodeAmount) || 0);
    const trail = Array.isArray(shade.trail) ? shade.trail : [];
    const trailStroke = !!shade.trailStroke;
    const trailMap = new Map();
    for (const t of trail) {
      trailMap.set((t.cy | 0) * w + (t.cx | 0), t);
    }

    ctx.save();
    ctx.clearRect(0, 0, monitor.width, monitor.height);
    const bg = shade.bgColor;
    if (bg && bg !== 'transparent') {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, monitor.width, monitor.height);
    }

    const fontWeight = bold ? '700 ' : '';
    ctx.font = `${fontWeight}${cellHeight}px ${MONO_STACK}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (bold) ctx.lineWidth = Math.max(1, cellWidth * 0.08);

    const midX = cellWidth / 2;
    const midY = cellHeight / 2;
    const cCount = colors.length;
    const scatterR = Math.max(w, h) * 0.35;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const trailHit = trailMap.get(y * w + x);
        if (data[i + 3] <= 8 && !trailHit) continue;

        let lum = data[i + 3] <= 8 ? 0.15 : luminanceOf(data, i);
        if (gamma !== 1) lum = Math.pow(clamp01(lum), gamma);
        const tLum = contrastFactor === 1 ? clamp01(lum) : clamp01((clamp01(lum) - 0.5) * contrastFactor + 0.5);
        const gem = commonGlyph(tLum, thresholds, cCount, shade.dither, x, y);
        const band = bandCharFor(tLum, 1 - tLum);
        const forceTrail = !!trailHit;
        if (!forceTrail && !band && gem.char === ' ') continue;
        if (!forceTrail && band && band.char === ' ' && tLum >= BAND_CUTS.edge) continue;

        const ch = forceTrail && (!band || band.char === ' ') ? '·' : band ? band.char : gem.char;
        const density = band ? band.dens : 1 - tLum;
        const bandName = band?.band || 'mid';

        // Luminance bands → palette inks (A shadow / B mid / C light).
        const inkMode = Number(shade.colorMode) || 3;
        const mix = colorMix > 0.02 ? colorMix : 0.28;
        let fill = pickBandInk(bandName, inkMode, darkCss, mix, x, y);
        const isBlock = BLOCK_CHARS.has(ch);
        const isDot = DOT_CHARS.has(ch);

        let dx = 0;
        let dy = 0;
        if (explode > 0) {
          const u = cellHash(x + 1, y + 3);
          const v = cellHash(x + 7, y + 11);
          const ang = u * Math.PI * 2;
          const dist = v * scatterR * explode;
          dx = Math.cos(ang) * dist * sx;
          dy = Math.sin(ang) * dist * sy;
        }

        const px = x * sx + midX + dx;
        const py = y * sy + midY + dy;
        const alpha = forceTrail
          ? Math.max(0.25, trailHit.alpha ?? 1)
          : band
            ? band.alpha
            : 1;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = typeof fill === 'string' && fill.startsWith('#') ? hexToRgb(fill) : fill;
        ctx.strokeStyle = ctx.fillStyle;

        // shapes: always vector; mixed: blocks/dots as shapes, letters as text or shapes;
        // text: fillText with band characters.
        let useShape = mode === 'shapes';
        if (mode === 'mixed') {
          useShape = isBlock || isDot || density > 0.55 || density < 0.2;
        }
        if (forceTrail && trailStroke) useShape = true;

        if (mode === 'text' || (!useShape && mode !== 'shapes')) {
          if (ch && ch !== ' ') {
            ctx.fillText(ch, px, py);
            if (bold) ctx.strokeText(ch, px, py);
          } else if (forceTrail) {
            drawShape(ctx, 0.2, px, py, cellWidth, cellHeight);
          }
        } else {
          drawShape(ctx, forceTrail ? Math.max(density, 0.35) : Math.max(density, 0.08), px, py, cellWidth, cellHeight);
        }

        if (outline && explode <= 0.05 && (density > 0.04 || forceTrail)) {
          ctx.globalAlpha = Math.min(1, alpha);
          ctx.strokeStyle = darkCss[0];
          ctx.lineWidth = 1;
          ctx.strokeRect(
            x * sx + dx + 0.5,
            y * sy + dy + 0.5,
            cellWidth - 1,
            cellHeight - 1
          );
        }
      }
    }
    ctx.globalAlpha = 1;
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
    setCellSpacing,
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

function parseHexRgb(hex) {
  let h = String(hex || '').replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return { r: 245, g: 243, b: 238 };
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function srgbChannelToLin(c) {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

/** Relative luminance 0..1 (WCAG). */
export function hexRelativeLum(hex) {
  const { r, g, b } = parseHexRgb(hex);
  return 0.2126 * srgbChannelToLin(r) + 0.7152 * srgbChannelToLin(g) + 0.0722 * srgbChannelToLin(b);
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return { h: 0, s: 0, l };
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h;
  if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (mx === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

function hslToRgbBytes(h, s, l) {
  const hh = ((h % 360) + 360) % 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + hh / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [
    Math.round(clamp01(f(0)) * 255),
    Math.round(clamp01(f(8)) * 255),
    Math.round(clamp01(f(4)) * 255),
  ];
}

function rgbBytesToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v | 0)).toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Map a luminance band to a palette ink.
 * colorMode 1 = shadow only; 2 = shadow + light; 3 = shadow + mid + light.
 * colorMix occasionally borrows a neighbor so the plate isn't posterized.
 */
function pickBandInk(bandName, inkMode, cssColors, mix, x, y) {
  const a = cssColors[0];
  const b = cssColors[1] || a;
  const c = cssColors[2] || b;
  if (inkMode <= 1) return a;

  let fill;
  if (inkMode === 2) {
    fill = bandName === 'dark' || bandName === 'mid' ? a : b;
  } else if (bandName === 'dark') {
    fill = a;
  } else if (bandName === 'mid') {
    fill = b;
  } else {
    fill = c; // light + edge
  }

  if (mix > 0.02 && cellHash(x, y) < mix * 0.5) {
    if (fill === a) return b;
    if (fill === b) return cellHash(x, y + 3) < 0.5 ? a : c;
    return b;
  }
  return fill;
}

/**
 * Remap authored inks for the active paper so palettes keep their identity.
 * Light paper: charcoal shadow + vivid mid/light accents (as authored).
 * Dark paper: rebuild A/B/C from accent hues — deep / vivid / pale — so
 * Ocean reads blue (not washed grey with tiny flecks).
 */
export function adaptInksToPaper(hexColors, paperHex) {
  if (!Array.isArray(hexColors) || !hexColors.length) return hexColors;
  const bgL = hexRelativeLum(paperHex || '#f5f3ee');
  if (bgL >= 0.42) return hexColors.slice();

  const accent = hexColors[1] || hexColors[0];
  const mid = hexColors[2] || accent;
  const { r: ar, g: ag, b: ab } = parseHexRgb(accent);
  const { r: mr, g: mg, b: mb } = parseHexRgb(mid);
  const aHsl = rgbToHsl(ar, ag, ab);
  const mHsl = rgbToHsl(mr, mg, mb);

  const hue = aHsl.s > 0.08 ? aHsl.h : mHsl.h;
  const midHue = mHsl.s > 0.08 ? mHsl.h : hue;
  const satDeep = Math.min(0.82, Math.max(0.42, aHsl.s || mHsl.s || 0.55));
  const satMid = Math.min(0.88, Math.max(0.48, mHsl.s || aHsl.s || 0.6));
  const satPale = Math.min(0.55, Math.max(0.22, satMid * 0.55));

  const [dr, dg, db] = hslToRgbBytes(hue, satDeep, 0.48);
  const [br, bg, bb] = hslToRgbBytes(midHue, satMid, 0.62);
  const [pr, pg, pb] = hslToRgbBytes(midHue, satPale, 0.78);

  return [rgbBytesToHex(dr, dg, db), rgbBytesToHex(br, bg, bb), rgbBytesToHex(pr, pg, pb)];
}

/** Effective paper hex for contrast (filled bg, or theme paper under transparent). */
export function resolvePaperHex(shade = {}) {
  const bg = shade.bgColor;
  if (bg && bg !== 'transparent') return bg;
  if (shade.paperColor && shade.paperColor !== 'transparent') return shade.paperColor;
  return '#f5f3ee';
}
