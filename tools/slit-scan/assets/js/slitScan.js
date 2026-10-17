// Slit-scan engine: sample a 1D path through every decoded frame and stamp
// it into one time slot of an accumulating image.
//
// Output layout — the scanned strip flows out of the slit along the arrow,
// so the newest sample sits at the arrow's tail and frame 0 at its tip:
//   lr →  x = cols - 1 - slot     rl ←  x = slot
//   du ↓  y = cols - 1 - slot     ud ↑  y = slot
// The other axis holds the samples along the path, in path order.
//
// params: { shape: 'v'|'h'|'diag'|'adiag'|'sine'|'free', flow: 'lr'|'rl'|'ud'|'du',
//           linePos: 0..1, freePath: [{x, y}, ...] normalized to the frame }

import { BED } from './tokens.js'
import { seekTo, playThrough, setRate, holdPlayback } from './playback.js'

const MAX_AXIS = 16384
// Safari refuses canvases past ~16.7M px; stay under it everywhere.
const MAX_AREA = 16000000
const FLUSH_MS = 80

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export function timeOnX(flow) {
  return flow === 'lr' || flow === 'rl'
}

export function isStraight(shape) {
  return shape === 'v' || shape === 'h' || shape === 'diag' || shape === 'adiag'
}

function slotPos(flow, slot, cols) {
  return flow === 'lr' || flow === 'du' ? cols - 1 - slot : slot
}

// ---- path geometry ----

function segment(out, n, ax, ay, bx, by) {
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1)
    out[i * 2] = ax + (bx - ax) * t
    out[i * 2 + 1] = ay + (by - ay) * t
  }
  return out
}

/** Resample a polyline [{x, y}, ...] to n evenly spaced points. */
export function resamplePath(pts, n) {
  const out = new Float32Array(n * 2)
  if (!pts || pts.length < 2) {
    const p = (pts && pts[0]) || { x: 0.5, y: 0.5 }
    return segment(out, n, p.x, p.y, p.x, p.y)
  }
  const cum = [0]
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y))
  }
  const total = cum[cum.length - 1]
  let s = 0
  for (let i = 0; i < n; i++) {
    const d = n === 1 ? 0 : (i / (n - 1)) * total
    while (s < pts.length - 2 && cum[s + 1] < d) s++
    const len = cum[s + 1] - cum[s]
    const k = len > 0 ? clamp((d - cum[s]) / len, 0, 1) : 0
    out[i * 2] = pts[s].x + (pts[s + 1].x - pts[s].x) * k
    out[i * 2 + 1] = pts[s].y + (pts[s + 1].y - pts[s].y) * k
  }
  return out
}

/** Normalized (0..1) path of n points: Float32Array [x0, y0, x1, y1, ...]. */
export function buildPath({ shape = 'v', linePos = 0.5, freePath }, n) {
  if (shape === 'free') return resamplePath(freePath, n)
  const lp = clamp(Number.isFinite(linePos) ? linePos : 0.5, 0, 1)
  const out = new Float32Array(n * 2)
  if (shape === 'h') return segment(out, n, 0, lp, 1, lp)
  if (shape === 'diag') {
    // `/` is the line x + y = c clipped to the frame, top-right → bottom-left.
    const c = lp * 2
    return c <= 1 ? segment(out, n, c, 0, 0, c) : segment(out, n, 1, c - 1, c - 1, 1)
  }
  if (shape === 'adiag') {
    // `\` is the line x − y = d, top-left → bottom-right.
    const d = lp * 2 - 1
    return d >= 0 ? segment(out, n, d, 0, 1, 1 - d) : segment(out, n, 0, -d, 1 + d, 1)
  }
  if (shape === 'sine') {
    // `~` runs along x like —, oscillating around linePos.
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1)
      out[i * 2] = t
      out[i * 2 + 1] = clamp(lp + 0.22 * Math.sin(t * Math.PI * 4), 0, 1)
    }
    return out
  }
  return segment(out, n, lp, 0, lp, 1)
}

/** linePos that puts the line through a pointer at normalized (x, y). */
export function linePosAt(shape, x, y) {
  if (shape === 'h' || shape === 'sine') return clamp(y, 0, 1)
  if (shape === 'diag') return clamp((x + y) / 2, 0, 1)
  if (shape === 'adiag') return clamp((x - y + 1) / 2, 0, 1)
  return clamp(x, 0, 1)
}

/** Arrow keys that nudge linePos down / up for a shape. */
export function lineKeys(shape) {
  return shape === 'h' || shape === 'sine' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']
}

// ---- planning ----

function sampleAxis(shape, vw, vh) {
  if (shape === 'v') return vh
  if (shape === 'h' || shape === 'sine') return vw
  return Math.max(vw, vh)
}

function qualitySpec(quality, fps, longEdge) {
  if (quality === 'draft') return { rate: Math.min(fps, 8), scale: Math.min(1, 360 / longEdge) }
  if (quality === 'high') return { rate: fps / 2, scale: Math.min(1, 960 / longEdge) }
  return { rate: fps, scale: 1 }
}

/**
 * cols: time slots (one per sampled frame), len: samples along the path,
 * scale: source → sample resolution.
 */
export function planCapture({ duration, fps, vw, vh, shape, quality }) {
  const rate = fps > 0 ? fps : 30
  const spec = qualitySpec(quality, rate, Math.max(vw, vh, 1))
  const len = Math.max(2, Math.round(sampleAxis(shape, vw, vh) * spec.scale))
  const want = Math.max(2, Math.round(duration * spec.rate))
  const cols = Math.max(2, Math.min(want, MAX_AXIS, Math.floor(MAX_AREA / len)))
  return { cols, len, scale: spec.scale, duration }
}

/** Fastest playback rate that still presents roughly one frame per slot. */
export function renderSpeed(plan) {
  return clamp(Math.floor(40 / (plan.cols / plan.duration)), 1, 16)
}

// ---- sampling ----

// Straight lines: transform the frame so the segment lands on row 0 of an
// n×1 canvas and let drawImage do the resampling — only n pixels read back.
function segmentSampler(video, ax, ay, bx, by, n) {
  const L = Math.hypot(bx - ax, by - ay)
  const ux = (bx - ax) / L
  const uy = (by - ay) / L
  const k = (n - 1) / L
  const ox = ax + 0.5
  const oy = ay + 0.5
  const canvas = document.createElement('canvas')
  canvas.width = n
  canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const index = new Uint32Array(n)
  for (let i = 0; i < n; i++) index[i] = i * 4
  return {
    index,
    read() {
      // canvas (u, v) = (½ + k·(P−A)·û, ½ + (P−A)·n̂), n̂ = (−uy, ux)
      ctx.setTransform(k * ux, -uy, k * uy, ux, 0.5 - k * (ux * ox + uy * oy), 0.5 - (ux * oy - uy * ox))
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
      return ctx.getImageData(0, 0, n, 1).data
    },
  }
}

// Curves: draw just the path's bounding box and pick pixels from it.
function boxSampler(video, path, n, scale) {
  const vw = video.videoWidth
  const vh = video.videoHeight
  const px = new Float32Array(n)
  const py = new Float32Array(n)
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (let i = 0; i < n; i++) {
    px[i] = path[i * 2] * (vw - 1)
    py[i] = path[i * 2 + 1] * (vh - 1)
    x0 = Math.min(x0, px[i]); x1 = Math.max(x1, px[i])
    y0 = Math.min(y0, py[i]); y1 = Math.max(y1, py[i])
  }
  const sx = Math.floor(x0)
  const sy = Math.floor(y0)
  const sw = Math.floor(x1) - sx + 1
  const sh = Math.floor(y1) - sy + 1
  const cw = Math.max(1, Math.round(sw * scale))
  const ch = Math.max(1, Math.round(sh * scale))
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingEnabled = cw < sw || ch < sh
  const index = new Uint32Array(n)
  for (let i = 0; i < n; i++) {
    const cx = clamp(Math.floor(((px[i] - sx + 0.5) * cw) / sw), 0, cw - 1)
    const cy = clamp(Math.floor(((py[i] - sy + 0.5) * ch) / sh), 0, ch - 1)
    index[i] = (cy * cw + cx) * 4
  }
  return {
    index,
    read() {
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch)
      return ctx.getImageData(0, 0, cw, ch).data
    },
  }
}

function createSampler(video, params, plan) {
  const n = plan.len
  if (isStraight(params.shape)) {
    const ends = buildPath(params, 2)
    const vw = video.videoWidth - 1
    const vh = video.videoHeight - 1
    // Snap to pixel centres so a | or — slit reads one column, not a blend of two.
    const ax = Math.round(ends[0] * vw)
    const ay = Math.round(ends[1] * vh)
    const bx = Math.round(ends[2] * vw)
    const by = Math.round(ends[3] * vh)
    if (Math.hypot(bx - ax, by - ay) >= 1) return segmentSampler(video, ax, ay, bx, by, n)
  }
  return boxSampler(video, buildPath(params, n), n, plan.scale)
}

// ---- buffer ----

function makeBuffer(plan, flow) {
  const buffer = timeOnX(flow)
    ? new ImageData(plan.cols, plan.len)
    : new ImageData(plan.len, plan.cols)
  // Paint the bed so the whole output extent shows while it fills.
  const n = parseInt(BED.slice(1), 16)
  const rgba = (0xff << 24) | ((n & 0xff) << 16) | (n & 0xff00) | ((n >> 16) & 0xff)
  new Uint32Array(buffer.data.buffer).fill(rgba >>> 0)
  return buffer
}

function writeSlot(buffer, flow, cols, slot, src, index) {
  const d = buffer.data
  const W = buffer.width
  const pos = slotPos(flow, slot, cols)
  const onX = timeOnX(flow)
  for (let i = 0; i < index.length; i++) {
    const s = index[i]
    const o = (onX ? i * W + pos : pos * W + i) * 4
    d[o] = src[s]
    d[o + 1] = src[s + 1]
    d[o + 2] = src[s + 2]
    d[o + 3] = 255
  }
}

function copySlot(buffer, flow, cols, from, to) {
  const d = buffer.data
  const W = buffer.width
  const a = slotPos(flow, from, cols)
  const b = slotPos(flow, to, cols)
  if (!timeOnX(flow)) {
    d.copyWithin(b * W * 4, a * W * 4, (a + 1) * W * 4)
    return
  }
  for (let y = 0; y < buffer.height; y++) {
    const s = (y * W + a) * 4
    const o = (y * W + b) * 4
    d[o] = d[s]
    d[o + 1] = d[s + 1]
    d[o + 2] = d[s + 2]
    d[o + 3] = d[s + 3]
  }
}

/** Hold the last sampled frame across slots the decoder skipped. */
function fillGaps(buffer, flow, cols, filled) {
  const first = filled.indexOf(1)
  if (first < 0) return false
  for (let i = 0; i < first; i++) copySlot(buffer, flow, cols, first, i)
  let last = first
  for (let i = first + 1; i < cols; i++) {
    if (filled[i]) last = i
    else copySlot(buffer, flow, cols, last, i)
  }
  return true
}

// ---- capture ----

/**
 * Play the clip once from the start, stamping each presented frame into its
 * slot and streaming the result into `output`. Resolves with the ImageData.
 */
export async function captureVideo({ video, params, plan, speed = 1, output, signal, onStart, onProgress }) {
  const { cols, duration } = plan
  const flow = params.flow
  const onX = timeOnX(flow)
  const sampler = createSampler(video, params, plan)
  const buffer = makeBuffer(plan, flow)
  const filled = new Uint8Array(cols)
  output.width = buffer.width
  output.height = buffer.height
  const octx = output.getContext('2d')
  octx.putImageData(buffer, 0, 0)
  if (onStart) onStart({ w: buffer.width, h: buffer.height })

  let lo = cols
  let hi = -1
  let lastFlush = 0
  const flush = (force) => {
    if (hi < lo) return
    const now = performance.now()
    if (!force && now - lastFlush < FLUSH_MS) return
    lastFlush = now
    const a = slotPos(flow, lo, cols)
    const b = slotPos(flow, hi, cols)
    const p = Math.min(a, b)
    const q = Math.abs(a - b) + 1
    if (onX) octx.putImageData(buffer, 0, 0, p, 0, q, buffer.height)
    else octx.putImageData(buffer, 0, 0, 0, p, buffer.width, q)
    lo = cols
    hi = -1
  }
  const stamp = (time) => {
    if (video.readyState < 2) return
    // mediaTime lands a hair under k/fps; the bias keeps frame k out of slot k − 1.
    const slot = clamp(Math.floor((time / duration) * cols + 0.25), 0, cols - 1)
    if (filled[slot]) return
    writeSlot(buffer, flow, cols, slot, sampler.read(), sampler.index)
    filled[slot] = 1
    lo = Math.min(lo, slot)
    hi = Math.max(hi, slot)
  }

  const restore = holdPlayback(video)
  try {
    await seekTo(video, 0)
    stamp(0)
    flush(true)
    if (onProgress) onProgress(0)
    setRate(video, speed)
    await playThrough(video, {
      signal,
      onFrame: (time) => {
        stamp(time)
        flush(false)
        if (onProgress) onProgress(time / duration)
      },
    })
  } finally {
    restore()
  }

  if (!fillGaps(buffer, flow, cols, filled)) throw new Error('no frames decoded')
  octx.putImageData(buffer, 0, 0)
  if (onProgress) onProgress(1)
  return buffer
}

// ---- keep source ----

/** Where the slit sits along the flow axis, 0..1 (curves: their mean). */
export function slitSplit(params) {
  const n = 64
  const path = buildPath(params, n)
  const axis = timeOnX(params.flow) ? 0 : 1
  let sum = 0
  for (let i = 0; i < n; i++) sum += path[i * 2 + axis]
  return clamp(sum / n, 0, 1)
}

/**
 * Range [a, b] (0..1 along the flow axis) the scan flows into when the
 * source is kept: from the slit to the edge the arrow points at. The other
 * side stays as video.
 */
export function scanRange(params) {
  const s = slitSplit(params)
  return params.flow === 'lr' || params.flow === 'du' ? [s, 1] : [0, s]
}

/**
 * Layout along the flow axis of a source N px long: the untouched source
 * behind the slit (when kept) and the scan region the strip flows into.
 * fit: the scan takes the rest of the frame. Otherwise it is `stripLen` px
 * (one per sampled frame) and the output grows with the clip.
 * keep / scan are [srcStart, dstStart, length] / [dstStart, length].
 */
export function flowLayout({ N, params, keep, fit, stripLen }) {
  const forward = params.flow === 'lr' || params.flow === 'du'
  const cut = Math.round((keep ? slitSplit(params) : forward ? 0 : 1) * N)
  const scanLen = fit ? (forward ? N - cut : cut) : stripLen
  return forward
    ? { forward, total: cut + scanLen, keep: [0, 0, cut], scan: [cut, scanLen] }
    : { forward, total: scanLen + N - cut, keep: [cut, scanLen, N - cut], scan: [0, scanLen] }
}

/**
 * The exported still: the current video frame behind the slit when the
 * source is kept, and the slit-scan either fitted to the frame or at its
 * native one-pixel-per-frame length. null when the bare still is the answer.
 */
export function composeStill(video, still, params, { keep, fit }) {
  if (!keep && !fit) return null
  const vw = video.videoWidth
  const vh = video.videoHeight
  const onX = timeOnX(params.flow)
  const L = flowLayout({ N: onX ? vw : vh, params, keep, fit, stripLen: onX ? still.width : still.height })
  const rect = (at, len) => (onX ? [at, 0, len, vh] : [0, at, vw, len])
  const canvas = document.createElement('canvas')
  canvas.width = onX ? L.total : vw
  canvas.height = onX ? vh : L.total
  const ctx = canvas.getContext('2d')
  const [ks, kd, kl] = L.keep
  if (kl > 0) ctx.drawImage(video, ...rect(ks, kl), ...rect(kd, kl))
  if (L.scan[1] > 0) ctx.drawImage(still, 0, 0, still.width, still.height, ...rect(L.scan[0], L.scan[1]))
  return canvas
}
