// Slit-scan video, streamed: the clip plays once and every source frame
// yields one output frame at the chosen scale (1:1 by default).
//
//   scroll   — each frame the slit's samples enter at the arrow's tail and
//              the strip flows toward its tip, like film pulled past a slit.
//              Holds only the strip of slit samples so far.
//   displace — time map: pixel (x, y) of output frame T reads source frame
//              T − lag, lag ramping smoothly from 0 at the arrow's tail to
//              `lag` frames at its tip. Holds the last `lag` frames.
//
// With `keep`, the video behind the slit stays untouched and the scan only
// fills the side the arrow points to. Scroll with `fit` squeezes the span
// into the frame; without it the scan runs one pixel per frame and the
// output grows with the clip.

import { BED } from './tokens.js'
import { buildPath, timeOnX, scanRange, flowLayout } from './slitScan.js'
import { seekTo, playThrough, setRate, holdPlayback } from './playback.js'

// Displace's frame ring must fit in this.
export const RING_BYTES = 1536 * 1024 * 1024
// Encoding can briefly hold playback; don't mistake that for a stall.
const STALL_MS = 30000

// BED as packed little-endian RGBA, for not-yet-recorded positions.
const BED_RGBA = (() => {
  const n = parseInt(BED.slice(1), 16)
  return ((0xff << 24) | ((n & 0xff) << 16) | (n & 0xff00) | ((n >> 16) & 0xff)) >>> 0
})()

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const even = (n) => Math.max(2, Math.round(n / 2) * 2)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export function videoSize(video, scale) {
  return { width: even(video.videoWidth * scale), height: even(video.videoHeight * scale) }
}

function framesIn(duration, fps) {
  return Math.max(2, Math.round(duration * fps))
}

function spanFrames(span, depth, fps) {
  return span === 'all' ? depth - 1 : Math.min(depth - 1, Math.round(Number(span) * fps))
}

/**
 * Scroll positions along the flow axis: srcPos ≥ 0 copies that source
 * column / row (untouched), otherwise ages[p] is how many frames ago the
 * slit sample shown there was taken. Padded to an even length.
 */
function scrollLayout({ n0, params, span, keep, fit, depth }) {
  const L = flowLayout({ N: n0, params, keep, fit, stripLen: depth })
  const n = even(L.total)
  const srcPos = new Int32Array(n).fill(-1)
  const ages = new Float32Array(n).fill(-1)
  const [ks, kd, kl] = L.keep
  for (let j = 0; j < kl; j++) srcPos[kd + j] = ks + j
  const [at, len] = L.scan
  for (let q = 0; q < len; q++) {
    const d = L.forward ? q : len - 1 - q // distance from where the strip enters
    ages[at + q] = fit ? (len > 1 ? (d / (len - 1)) * span : 0) : d
  }
  // Odd totals get one extra position at the far end, copying its neighbour.
  if (n > L.total) {
    srcPos[n - 1] = srcPos[n - 2]
    ages[n - 1] = ages[n - 2] >= 0 && L.forward ? ages[n - 2] + 1 : ages[n - 2]
  }
  return { n, srcPos, ages }
}

/** Output size for these settings: source-sized, or grown for scroll without fit. */
export function videoOutputSize({ video, mode, span, keep, fit, scale, fps, params }) {
  const { width, height } = videoSize(video, scale)
  if (mode !== 'scroll' || fit) return { width, height }
  const depth = framesIn(video.duration, fps)
  const onX = timeOnX(params.flow)
  const { n } = scrollLayout({ n0: onX ? width : height, params, span, keep, fit, depth })
  return onX ? { width: n, height } : { width, height: n }
}

/** Bytes displace needs for these settings (0 for scroll). */
export function videoMemory({ video, mode, span, scale, fps }) {
  if (mode !== 'displace') return 0
  const { width, height } = videoSize(video, scale)
  const lag = spanFrames(span, framesIn(video.duration, fps), fps)
  return (lag + 1) * width * height * 4
}

/**
 * Age (in frames) for each position along the flow axis: 0 where the strip
 * enters (the slit when the source is kept, else the arrow's tail edge),
 * `span` at the arrow's tip, −1 for positions behind a kept slit.
 */
function agesAlong(n, params, span, keep) {
  const forward = params.flow === 'lr' || params.flow === 'du'
  const [a, b] = keep ? scanRange(params) : [0, 1]
  const lo = a * (n - 1)
  const hi = b * (n - 1)
  const ages = new Float32Array(n)
  for (let p = 0; p < n; p++) {
    if (p < lo - 0.5 || p > hi + 0.5) ages[p] = -1
    else if (hi - lo < 1) ages[p] = 0
    else ages[p] = (clamp(forward ? p - lo : hi - p, 0, hi - lo) / (hi - lo)) * span
  }
  return ages
}

function scrollCutter({ W, H, params, span, keep, fit, depth }) {
  const onX = timeOnX(params.flow)
  const len = onX ? H : W // slit samples, fitted to the cross axis
  const { n, srcPos, ages } = scrollLayout({ n0: onX ? W : H, params, span, keep, fit, depth })
  const outW = onX ? n : W
  const path = buildPath(params, len)
  const index = new Uint32Array(len)
  for (let i = 0; i < len; i++) {
    const x = Math.round(path[i * 2] * (W - 1))
    const y = Math.round(path[i * 2 + 1] * (H - 1))
    index[i] = y * W + x
  }
  const strip = new Array(depth)

  return {
    push(T, cur) {
      const s = new Uint32Array(len)
      for (let i = 0; i < len; i++) s[i] = cur[index[i]]
      strip[T] = s
    },
    render(T, cur, out) {
      for (let p = 0; p < n; p++) {
        const sp = srcPos[p]
        if (sp >= 0) {
          // Behind a kept slit: live video.
          for (let i = 0; i < len; i++) out[onX ? i * outW + p : p * outW + i] = cur[onX ? i * W + sp : sp * W + i]
          continue
        }
        const f = Math.round(T - ages[p])
        const src = f >= 0 ? strip[f] : null
        // Not yet reached: black.
        for (let i = 0; i < len; i++) out[onX ? i * outW + p : p * outW + i] = src ? src[i] : BED_RGBA
      }
    },
  }
}

function displaceCutter({ W, H, params, span, keep }) {
  const onX = timeOnX(params.flow)
  const n = onX ? W : H
  // Untouched positions simply have no lag.
  const lags = Int32Array.from(agesAlong(n, params, span, keep), (a) => Math.max(0, Math.round(a)))
  const size = span + 1
  const ring = Array.from({ length: size }, () => new Uint32Array(W * H))

  return {
    push(T, cur) {
      ring[T % size].set(cur)
    },
    render(T, cur, out) {
      for (let y = 0; y < H; y++) {
        const row = y * W
        if (onX) {
          for (let x = 0; x < W; x++) out[row + x] = ring[Math.max(0, T - lags[x]) % size][row + x]
        } else {
          out.set(ring[Math.max(0, T - lags[y]) % size].subarray(row, row + W), row)
        }
      }
    },
  }
}

/**
 * Play the clip once; for every source frame index T (skipped ones hold the
 * previous picture) build output frame T and hand it to onFrame(pixels, T).
 * Playback slows itself when frames cost more than real time allows, and
 * waits while encoderBusy() — output timing comes from T, never the clock.
 */
export async function streamSlitVideo({
  video, params, mode, span, keep, fit, scale, fps, signal, onFrame, encoderBusy, onProgress,
}) {
  const duration = video.duration
  const { width: W, height: H } = videoSize(video, scale)
  const depth = framesIn(duration, fps)
  const lag = spanFrames(span, depth, fps)
  const cutter = mode === 'scroll'
    ? scrollCutter({ W, H, params, span: lag, keep, fit, depth })
    : displaceCutter({ W, H, params, span: lag, keep })

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingQuality = 'high'
  const size = videoOutputSize({ video, mode, span, keep, fit, scale, fps, params })
  const out = new Uint32Array(size.width * size.height)
  const frameMs = 1000 / fps
  let last = -1
  let cost = 0
  let waiting = false

  const pace = (ms) => {
    cost = cost ? cost * 0.8 + ms * 0.2 : ms
    // Keep per-frame work under about half a frame of playback time.
    const want = clamp((frameMs * 0.5) / cost, 0.0625, 1)
    if (Math.abs(want - video.playbackRate) > video.playbackRate * 0.2) setRate(video, want)
    if (!waiting && encoderBusy()) {
      waiting = true
      video.pause()
      ;(async () => {
        while (encoderBusy() && !(signal && signal.aborted)) await sleep(5)
        waiting = false
        if (!video.ended) video.play().catch(() => {})
      })()
    }
  }

  const step = (time) => {
    if (video.readyState < 2) return
    const index = Math.min(depth - 1, Math.round(time * fps))
    if (index <= last) return
    const t0 = performance.now()
    ctx.drawImage(video, 0, 0, W, H)
    const cur = new Uint32Array(ctx.getImageData(0, 0, W, H).data.buffer)
    for (let T = last + 1; T <= index; T++) {
      cutter.push(T, cur)
      cutter.render(T, cur, out)
      onFrame(out, T)
    }
    last = index
    pace(performance.now() - t0)
    onProgress(time / duration)
  }

  const restore = holdPlayback(video)
  try {
    await seekTo(video, 0)
    step(0)
    setRate(video, 1)
    await playThrough(video, { signal, onFrame: step, stallMs: STALL_MS })
  } finally {
    restore()
  }
  return { ...size, frames: last + 1 }
}
