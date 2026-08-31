// GIF export using gifenc.
//
// We exploit the fact our output uses only a few opaque colors (1..3 inks) plus
// a transparent background. A tiny fixed palette (N colors + transparent index)
// keeps the GIF tiny, and transparency stays clean 1-bit, which is exactly what
// GIF supports. Frames are indexed by nearest palette color.

import { GIFEncoder } from 'gifenc';

/**
 * @param {object} opts
 * @param {CanvasSource[]} opts.frames - array of canvases or contexts, in order.
 * @param {string[]} [opts.colors] - ink hex values, dark -> bright (1..3).
 * @param {string} [opts.colorA] - legacy shadow/ink hex (used when `colors` absent).
 * @param {string} [opts.colorB] - legacy highlight/ink hex (used when `colors` absent).
 * @param {number} opts.delay - ms per frame
 * @param {number} [opts.width] - output width (defaults to first frame)
 * @param {number} [opts.height] - output height (defaults to first frame)
 */
export function encodeAsciiGif({ frames = [], colors, colorA = '#000000', colorB = '#ffffff', delay = 80, width, height }) {
  const inks = (colors && colors.length ? colors : [colorA, colorB]).map(parseHex);

  const gif = GIFEncoder();

  let w = width;
  let h = height;
  const first = getCanvas(frames[0]);
  if (!w) w = first.width;
  if (!h) h = first.height;

  const trunc = new Uint8Array(w * h);
  const palette = [[0, 0, 0], ...inks];
  const paletteArr = palette.map((c) => [c[0], c[1], c[2]]);

  for (const frame of frames) {
    indexFrame(frame, w, h, inks, trunc);
    gif.writeFrame(trunc, w, h, {
      palette: paletteArr,
      transparent: true,
      transparentIndex: 0,
      delay,
      repeat: 0, // loop forever
    });
  }

  gif.finish();
  return gif.bytes();
}

/**
 * Async variant of encodeAsciiGif. Yields to the event loop between frames so the
 * UI stays responsive during a long render, and reports real progress.
 * @param {function(number):void} opts.onProgress - called with 0..1
 */
export async function encodeAsciiGifAsync({ frames = [], colors, colorA = '#000000', colorB = '#ffffff', delay = 80, width, height, onProgress = () => {} }) {
  const inks = (colors && colors.length ? colors : [colorA, colorB]).map(parseHex);

  const gif = GIFEncoder();

  let w = width;
  let h = height;
  const first = getCanvas(frames[0]);
  if (!w) w = first.width;
  if (!h) h = first.height;

  const trunc = new Uint8Array(w * h);
  const globalPalette = [[0, 0, 0], ...inks].map((c) => [c[0], c[1], c[2]]);

  const total = frames.length;
  for (let i = 0; i < total; i++) {
    indexFrame(frames[i], w, h, inks, trunc);
    gif.writeFrame(trunc, w, h, {
      palette: globalPalette,
      transparent: true,
      transparentIndex: 0,
      delay,
      repeat: 0,
    });
    onProgress((i + 1) / total);
    await yieldToEventLoop();
  }

  gif.finish();
  onProgress(1);
  return gif.bytes();
}

function yieldToEventLoop() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** Classify one canvas into the N-color + transparent indexed buffer. */
function indexFrame(frame, w, h, inks, trunc) {
  const canvas = getCanvas(frame);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const { data } = ctx.getImageData(0, 0, w, h);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 64) {
      trunc[i / 4] = 0; // transparent
      continue;
    }
    let best = 1;
    let bestDist = Infinity;
    for (let c = 0; c < inks.length; c++) {
      const d = dist(r, g, b, inks[c]);
      if (d < bestDist) {
        bestDist = d;
        best = c + 1; // palette index: 0 is transparent, inks start at 1
      }
    }
    trunc[i / 4] = best;
  }
}

function getCanvas(f) {
  if (f instanceof HTMLCanvasElement) return f;
  if (f && f.canvas) return f.canvas;
  throw new Error('Frame must be a canvas or 2D context');
}

function parseHex(hex) {
  let h = String(hex).replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  return [num >> 16 & 255, num >> 8 & 255, num & 255];
}

function dist(r, g, b, c) {
  return (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
}

export function downloadGif(bytes, name = 'ascii.gif') {
  const blob = new Blob([bytes], { type: 'image/gif' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}