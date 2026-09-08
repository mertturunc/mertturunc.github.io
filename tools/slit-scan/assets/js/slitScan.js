// Slit-scan renderer: each frame samples pixels along a 1D path through the
// frame and stamps that column/row into an accumulating output.
//
// params: {
//   shape: 'v'|'h'|'diag'|'adiag'|'sine'|'free',
//   flow: 'lr'|'rl'|'ud'|'du',
//   linePos: 0..1,
//   rate: frames per second (source rate),
//   quality: 'draft'|'high'|'full',
//   freePath: [{x,y}, ...] normalized 0..1 (video space), for shape==='free'
// }

import { BED, KNIFE } from './tokens.js'

export const MAX_AXIS = 16384

export function planCapture(duration, rate = 30, quality = 'full') {
  const d = Number.isFinite(duration) && duration > 0 ? duration : 0
  if (quality === 'draft') {
    const frames = Math.max(16, Math.min(64, Math.round(d * 4) || 16))
    return { frames, step: 1, raw: frames }
  }
  if (quality === 'high') {
    const frames = Math.max(24, Math.min(180, Math.round(d * 10) || 24))
    return { frames, step: 1, raw: frames }
  }
  const raw = Math.max(2, Math.round(d * rate))
  const step = Math.max(1, Math.ceil(raw / MAX_AXIS))
  const frames = Math.ceil(raw / step)
  return { frames, step, raw }
}

export function timeOnX(flow) {
  return flow === 'lr' || flow === 'rl'
}

const COMMON_RATES = [23.976, 24, 25, 29.97, 30, 48, 50, 59.94, 60, 120]

export function snapRate(raw) {
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return 30
  let best = 30
  let bestD = Infinity
  for (const c of COMMON_RATES) {
    const d = Math.abs(c - n)
    if (d < bestD) { bestD = d; best = c }
  }
  if (bestD <= 1.5) return best
  return Math.max(8, Math.min(120, Math.round(n * 1000) / 1000))
}

export function qualityFactor(quality) {
  if (quality === 'draft') return 0.2
  if (quality === 'high') return 0.5
  return 1
}

export function playSpeed(quality) {
  if (quality === 'draft') return 16
  if (quality === 'high') return 8
  return 1
}

export function captureRate(params) {
  const r = Number.isFinite(params && params.rate) ? params.rate : 30
  const base = r > 0 ? r : 30
  const f = qualityFactor(params && params.quality)
  return Math.max(8, base * f)
}

/** Probe native frame rate from a cloned decoder so the preview stays paused. */
export async function detectVideoRate(src, timeoutMs = 2800) {
  if (!src) return 30
  const el = document.createElement('video')
  el.muted = true
  el.playsInline = true
  el.preload = 'auto'
  el.setAttribute('playsinline', '')
  el.style.cssText = 'position:fixed;left:-99px;top:0;width:1px;height:1px;opacity:0;pointer-events:none'
  el.src = src
  if (document.body) document.body.appendChild(el)
  const times = []
  try {
    await new Promise((resolve, reject) => {
      const fail = () => reject(new Error('fps probe failed'))
      const timer = setTimeout(fail, timeoutMs)
      el.addEventListener('error', () => { clearTimeout(timer); fail() }, { once: true })
      el.addEventListener('loadeddata', () => { clearTimeout(timer); resolve() }, { once: true })
    })
    const peek = Math.min(0.08, Math.max(0, (el.duration || 1) * 0.02))
    try { el.currentTime = peek } catch (_) {}
    await el.play()
    await new Promise((resolve) => {
      const stopAt = performance.now() + 900
      const tick = (_now, meta) => {
        const t = meta && Number.isFinite(meta.mediaTime) ? meta.mediaTime : el.currentTime
        if (Number.isFinite(t)) times.push(t)
        if (times.length >= 16 || performance.now() > stopAt) {
          resolve()
          return
        }
        if (el.requestVideoFrameCallback) el.requestVideoFrameCallback(tick)
        else requestAnimationFrame(() => tick(performance.now(), { mediaTime: el.currentTime }))
      }
      if (el.requestVideoFrameCallback) el.requestVideoFrameCallback(tick)
      else requestAnimationFrame(() => tick(performance.now(), { mediaTime: el.currentTime }))
    })
  } catch (_) {
    return 30
  } finally {
    try { el.pause() } catch (_) {}
    try { el.removeAttribute('src'); el.load() } catch (_) {}
    try { el.remove() } catch (_) {}
  }
  const deltas = []
  for (let i = 1; i < times.length; i++) {
    const d = times[i] - times[i - 1]
    if (d > 0.003 && d < 0.12) deltas.push(d)
  }
  if (deltas.length < 3) return 30
  deltas.sort((a, b) => a - b)
  const med = deltas[Math.floor(deltas.length / 2)]
  return snapRate(1 / med)
}

export function isStraight(shape) {
  return shape === 'v' || shape === 'h'
}

/** True when the scan path runs mainly left↔right (horizontal slit or ~ wave). */
export function slitAlongX(shape) {
  return shape === 'h' || shape === 'sine'
}

/** Knife-split compose only when slit ⊥ time axis (v+lr/rl or h/~ + ud/du). */
export function knifeComposeAligned(shape, flow) {
  if (shape === 'v') return timeOnX(flow)
  if (slitAlongX(shape)) return !timeOnX(flow)
  return false
}

/** Resample a polyline to n points. pts: [{x,y}, ...] */
export function resamplePath(pts, n) {
  if (!pts || pts.length === 0) {
    const out = new Float32Array(n * 2)
    for (let i = 0; i < n; i++) {
      out[i * 2] = 0.5
      out[i * 2 + 1] = n === 1 ? 0.5 : i / (n - 1)
    }
    return out
  }
  if (pts.length === 1) {
    const out = new Float32Array(n * 2)
    for (let i = 0; i < n; i++) {
      out[i * 2] = pts[0].x
      out[i * 2 + 1] = pts[0].y
    }
    return out
  }

  const seg = []
  let total = 0
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x
    const dy = pts[i].y - pts[i - 1].y
    const len = Math.hypot(dx, dy) || 1e-9
    seg.push(len)
    total += len
  }

  const out = new Float32Array(n * 2)
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : (i / (n - 1)) * total
    let acc = 0
    let s = 0
    while (s < seg.length - 1 && acc + seg[s] < t) {
      acc += seg[s]
      s++
    }
    const local = Math.min(1, (t - acc) / seg[s])
    const a = pts[s]
    const b = pts[s + 1]
    out[i * 2] = a.x + (b.x - a.x) * local
    out[i * 2 + 1] = a.y + (b.y - a.y) * local
  }
  return out
}

/**
 * Build a normalized (0..1) path of `n` points for the given shape.
 * Returns Float32Array [x0,y0,x1,y1,...]
 */
export function buildPath(params, n) {
  const shape = params.shape || 'v'
  const lp = Number.isFinite(params.linePos) ? Math.min(1, Math.max(0, params.linePos)) : 0.5
  const out = new Float32Array(n * 2)

  if (shape === 'free') {
    return resamplePath(params.freePath, n)
  }

  if (shape === 'h') {
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1)
      out[i * 2] = t
      out[i * 2 + 1] = lp
    }
    return out
  }

  if (shape === 'diag') {
    // Screen `/`: top-right → bottom-left (y grows downward).
    const shift = (lp - 0.5) * 0.9
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1)
      out[i * 2] = Math.min(1, Math.max(0, 1 - t + shift))
      out[i * 2 + 1] = Math.min(1, Math.max(0, t + shift))
    }
    return out
  }

  if (shape === 'adiag') {
    // Screen `\`: top-left → bottom-right.
    const shift = (lp - 0.5) * 0.9
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1)
      out[i * 2] = Math.min(1, Math.max(0, t + shift))
      out[i * 2 + 1] = Math.min(1, Math.max(0, t - shift))
    }
    return out
  }

  if (shape === 'sine') {
    // `~` is a horizontal wave: along x, oscillating in y — same axis as —.
    const amp = 0.22
    const periods = 2
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1)
      out[i * 2] = t
      out[i * 2 + 1] = Math.min(1, Math.max(0, lp + amp * Math.sin(t * Math.PI * 2 * periods)))
    }
    return out
  }

  // default: vertical
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1)
    out[i * 2] = lp
    out[i * 2 + 1] = t
  }
  return out
}

export function sampleLenFor(sw, sh, params) {
  const shape = params.shape || 'v'
  if (slitAlongX(shape)) return Math.max(1, sw)
  if (shape === 'v') return Math.max(1, sh)
  // diagonal / free: sample along the longer axis for density
  return Math.max(1, Math.max(sw, sh))
}

export function createSlitEngine({ video, outputCanvas, params }) {
  const scratch = document.createElement('canvas')
  const sctx = scratch.getContext('2d', { willReadFrequently: true })
  let pathCache = null
  let pathCacheKey = ''
  let lastFlushAt = 0

  function measure() {
    const vw = video.videoWidth || 0
    const vh = video.videoHeight || 0
    const q = params.quality || 'full'
    const f = qualityFactor(q)
    let nw = Math.max(1, Math.round((vw || 1) * f))
    let nh = Math.max(1, Math.round((vh || 1) * f))
    if (q === 'draft') {
      const cap = 480
      const m = Math.max(nw, nh)
      if (m > cap) {
        const s = cap / m
        nw = Math.max(1, Math.round(nw * s))
        nh = Math.max(1, Math.round(nh * s))
      }
    }
    if (scratch.width !== nw || scratch.height !== nh) {
      scratch.width = nw
      scratch.height = nh
      pathCache = null
    }
    sctx.imageSmoothingEnabled = f < 1
  }

  function pathKey(n) {
    const p = params
    const free = p.shape === 'free' && p.freePath
      ? p.freePath.map((pt) => pt.x.toFixed(3) + ',' + pt.y.toFixed(3)).join(';')
      : ''
    return [p.shape, p.linePos, n, free].join('|')
  }

  function cachedPath(n) {
    const key = pathKey(n)
    if (!pathCache || pathCacheKey !== key) {
      pathCache = buildPath(params, n)
      pathCacheKey = key
    }
    return pathCache
  }

  function makeBuffer(frames) {
    measure()
    const len = sampleLenFor(scratch.width, scratch.height, params)
    if (timeOnX(params.flow)) {
      return new ImageData(Math.max(1, frames), Math.max(1, len))
    }
    return new ImageData(Math.max(1, len), Math.max(1, frames))
  }

  function flush(buffer, force) {
    const now = performance.now()
    if (!force && now - lastFlushAt < 80) return
    lastFlushAt = now
    const octx = outputCanvas.getContext('2d', { willReadFrequently: true })
    if (outputCanvas.width !== buffer.width || outputCanvas.height !== buffer.height) {
      outputCanvas.width = buffer.width
      outputCanvas.height = buffer.height
    }
    octx.putImageData(buffer, 0, 0)
  }

  /** Stamp from an explicit video + 2d context (for parallel workers). */
  function stampFrom(sourceVideo, srcCtx, srcCanvas, buffer, frameIndex) {
    const sw = srcCanvas.width
    const sh = srcCanvas.height
    const { flow } = params
    const shape = params.shape || 'v'
    const onX = timeOnX(flow)
    let axisPos
    // Universal for every shape×flow (not only knife-aligned compose):
    // →/↑ : [fn]…[f0] along the time axis (newest at origin / against the live edge)
    // ←/↓ : [f0]…[fn]
    if (onX) axisPos = flow === 'lr' ? buffer.width - 1 - frameIndex : frameIndex
    else axisPos = flow === 'ud' ? buffer.height - 1 - frameIndex : frameIndex
    const n = onX ? buffer.height : buffer.width
    const lp = Number.isFinite(params.linePos) ? Math.min(1, Math.max(0, params.linePos)) : 0.5

    srcCtx.drawImage(sourceVideo, 0, 0, sw, sh)

    if (shape === 'v') {
      const x = Math.min(sw - 1, Math.max(0, Math.round(lp * (sw - 1))))
      const id = srcCtx.getImageData(x, 0, 1, sh)
      const data = id.data
      const rows = Math.min(n, sh)
      for (let i = 0; i < rows; i++) {
        const src = i * 4
        const dst = onX ? (i * buffer.width + axisPos) * 4 : (axisPos * buffer.width + i) * 4
        buffer.data[dst] = data[src]
        buffer.data[dst + 1] = data[src + 1]
        buffer.data[dst + 2] = data[src + 2]
        buffer.data[dst + 3] = 255
      }
      return
    }

    if (shape === 'h') {
      const y = Math.min(sh - 1, Math.max(0, Math.round(lp * (sh - 1))))
      const id = srcCtx.getImageData(0, y, sw, 1)
      const data = id.data
      const cols = Math.min(n, sw)
      for (let i = 0; i < cols; i++) {
        const src = i * 4
        const dst = onX ? (i * buffer.width + axisPos) * 4 : (axisPos * buffer.width + i) * 4
        buffer.data[dst] = data[src]
        buffer.data[dst + 1] = data[src + 1]
        buffer.data[dst + 2] = data[src + 2]
        buffer.data[dst + 3] = 255
      }
      return
    }

    const id = srcCtx.getImageData(0, 0, sw, sh)
    const data = id.data
    const path = cachedPath(n)
    for (let i = 0; i < n; i++) {
      const sx = Math.min(sw - 1, Math.max(0, Math.round(path[i * 2] * (sw - 1))))
      const sy = Math.min(sh - 1, Math.max(0, Math.round(path[i * 2 + 1] * (sh - 1))))
      const src = (sy * sw + sx) * 4
      const dst = onX ? (i * buffer.width + axisPos) * 4 : (axisPos * buffer.width + i) * 4
      buffer.data[dst] = data[src]
      buffer.data[dst + 1] = data[src + 1]
      buffer.data[dst + 2] = data[src + 2]
      buffer.data[dst + 3] = 255
    }
  }

  function stampInto(buffer, frameIndex) {
    stampFrom(video, sctx, scratch, buffer, frameIndex)
  }

  function copyStamp(buffer, fromIndex, toIndex) {
    if (fromIndex === toIndex) return
    const onX = timeOnX(params.flow)
    const flow = params.flow
    const srcPos = onX
      ? (flow === 'lr' ? buffer.width - 1 - fromIndex : fromIndex)
      : (flow === 'ud' ? buffer.height - 1 - fromIndex : fromIndex)
    const dstPos = onX
      ? (flow === 'lr' ? buffer.width - 1 - toIndex : toIndex)
      : (flow === 'ud' ? buffer.height - 1 - toIndex : toIndex)
    const n = onX ? buffer.height : buffer.width
    const data = buffer.data
    const w = buffer.width
    for (let i = 0; i < n; i++) {
      const src = onX ? (i * w + srcPos) * 4 : (srcPos * w + i) * 4
      const dst = onX ? (i * w + dstPos) * 4 : (dstPos * w + i) * 4
      data[dst] = data[src]
      data[dst + 1] = data[src + 1]
      data[dst + 2] = data[src + 2]
      data[dst + 3] = 255
    }
  }

  function composeSize() {
    const vw = video.videoWidth || 16
    const vh = video.videoHeight || 9
    return { w: Math.max(1, vw), h: Math.max(1, vh) }
  }

  // Compose source video + progressive result reveal.
  // opts.showKnife: orange scan line overlay (off for exports).
  function composeFrame(ctx, W, H, filled, total, opts = {}) {
    const showKnife = opts.showKnife === true
    const vw = video.videoWidth || 0
    const vh = video.videoHeight || 0
    if (!vw || !vh) return
    const ratio = Math.min(W / vw, H / vh)
    const dw = vw * ratio
    const dh = vh * ratio
    const dx = (W - dw) / 2
    const dy = (H - dh) / 2

    ctx.fillStyle = BED
    ctx.fillRect(0, 0, W, H)
    const native = Math.abs(dw - vw) < 0.5 && Math.abs(dh - vh) < 0.5
    ctx.imageSmoothingEnabled = !native
    ctx.drawImage(video, dx, dy, dw, dh)

    const shape = params.shape || 'v'
    const oc = outputCanvas
    const oW = oc.width
    const oH = oc.height
    const flow = params.flow
    const forward = flow === 'lr' || flow === 'ud'
    const onX = timeOnX(flow)

    const wipeOutput = () => {
      if (oW > 1 && oH > 1 && filled > 0 && total > 0) {
        const t = Math.min(1, filled / total)
        // Take the filled edge of the buffer (same as knife compose) so
        // →/↑ grow toward the far side with oldest at the tip, newest inward.
        const sw = onX ? Math.max(1, Math.round(oW * t)) : oW
        const sh = onX ? oH : Math.max(1, Math.round(oH * t))
        const sx = onX && forward ? Math.max(0, oW - sw) : 0
        const sy = !onX && forward ? Math.max(0, oH - sh) : 0
        const dwOut = onX ? dw * t : dw
        const dhOut = onX ? dh : dh * t
        const dxOut = onX && forward ? dx + dw - dwOut : dx
        const dyOut = !onX && forward ? dy + dh - dhOut : dy
        ctx.drawImage(oc, sx, sy, sw, sh, dxOut, dyOut, dwOut, dhOut)
      }
    }

    // Curves / freehand / mismatched slit×flow → full-frame wipe in flow direction.
    if (!knifeComposeAligned(shape, flow)) {
      if (showKnife) {
        const n = 256
        const path = buildPath(params, n)
        ctx.strokeStyle = KNIFE
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let i = 0; i < n; i++) {
          const x = dx + path[i * 2] * dw
          const y = dy + path[i * 2 + 1] * dh
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      wipeOutput()
      return
    }

    const verticalLn = shape === 'v'
    const bp = Number.isFinite(params.linePos) ? Math.min(1, Math.max(0, params.linePos)) : 0.5
    const kx = verticalLn ? dx + bp * dw : dy + bp * dh
    // Time grows WITH the arrow from the knife, newest against the knife:
    // → : [img][knife][fn]…[f0]     ↑ : [img]/[fn]…[f0] below knife
    // ← : [f0]…[fn][knife][img]     ↓ : above knife [f0]…[fn] then knife
    const outLen = forward
      ? (verticalLn ? (dx + dw) - kx : (dy + dh) - kx)
      : (verticalLn ? kx - dx : kx - dy)

    const drawKnife = () => {
      if (!showKnife) return
      if (shape === 'sine') {
        const n = 256
        const path = buildPath(params, n)
        ctx.strokeStyle = KNIFE
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let i = 0; i < n; i++) {
          const x = dx + path[i * 2] * dw
          const y = dy + path[i * 2 + 1] * dh
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        return
      }
      ctx.fillStyle = KNIFE
      if (verticalLn) ctx.fillRect(kx - 1, dy, 2, dh)
      else ctx.fillRect(dx, kx - 1, dw, 2)
    }

    const outRect = verticalLn
      ? { x: forward ? kx : dx, y: dy, w: Math.max(0, outLen), h: dh }
      : { x: dx, y: forward ? kx : dy, w: dw, h: Math.max(0, outLen) }
    const regionW = Math.round(outRect.w)
    const regionH = Math.round(outRect.h)

    if (outRect.w >= 1 && outRect.h >= 1) {
      ctx.fillStyle = BED
      ctx.fillRect(outRect.x, outRect.y, outRect.w, outRect.h)
    }

    if (outRect.w < 2 || outRect.h < 2 || oW < 2 || oH < 2 || filled < 1 || total < 1) {
      drawKnife()
      return
    }

    const n = Math.min(filled, verticalLn ? regionW : regionH)
    if (n < 1) { drawKnife(); return }

    if (verticalLn) {
      if (forward) {
        // lr buffer: late on left … early on right → newest at knife
        const srcX = Math.max(0, oW - filled)
        ctx.drawImage(oc, srcX, 0, n, oH, outRect.x, outRect.y, n, regionH)
      } else {
        // rl buffer: early on left … late on right → newest at knife
        const srcX = Math.max(0, filled - n)
        const destX = outRect.x + (regionW - n)
        ctx.drawImage(oc, srcX, 0, n, oH, destX, outRect.y, n, regionH)
      }
    } else if (forward) {
      // ud buffer: late on top … early on bottom
      const srcY = Math.max(0, oH - filled)
      ctx.drawImage(oc, 0, srcY, oW, n, outRect.x, outRect.y, regionW, n)
    } else {
      // du buffer: early on top … late on bottom
      const srcY = Math.max(0, filled - n)
      const destY = outRect.y + (regionH - n)
      ctx.drawImage(oc, 0, srcY, oW, n, outRect.x, destY, regionW, n)
    }

    drawKnife()
  }

  function fillGaps(buffer, filled) {
    const n = filled.length
    let last = -1
    for (let i = 0; i < n; i++) {
      if (filled[i]) last = i
      else if (last >= 0) {
        copyStamp(buffer, last, i)
        filled[i] = 1
      }
    }
    let next = -1
    for (let i = n - 1; i >= 0; i--) {
      if (filled[i]) next = i
      else if (next >= 0) {
        copyStamp(buffer, next, i)
        filled[i] = 1
      }
    }
  }

  function renderFull(onProgress) {
    // One playthrough at quality-scaled rate. Stamp by currentTime → slot,
    // then copy neighboring columns into gaps. Avoids HEVC/H.264 seek storms.
    measure()
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0
    const rate = captureRate(params)
    const { frames } = planCapture(duration, rate, params.quality)
    const buffer = makeBuffer(frames)
    const filled = new Uint8Array(frames)
    let cancelled = false
    const prevRate = video.playbackRate || 1
    const prevLoop = video.loop
    const prevMuted = video.muted
    const speed = playSpeed(params.quality)

    const cancel = () => {
      cancelled = true
      try { video.pause() } catch (_) {}
      try { video.playbackRate = prevRate } catch (_) {}
      try { video.loop = prevLoop } catch (_) {}
      try { video.muted = prevMuted } catch (_) {}
    }

    const seekStart = () => new Promise((resolve, reject) => {
      if (cancelled) {
        reject(new Error('cancelled'))
        return
      }
      if (!video.seeking && video.currentTime < 0.04) {
        resolve()
        return
      }
      let settled = false
      const done = () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        video.removeEventListener('seeked', done)
        resolve()
      }
      video.addEventListener('seeked', done)
      try { video.currentTime = 0 } catch (_) { done(); return }
      const timer = setTimeout(done, 1500)
    })

    const waitDecoded = () => new Promise((resolve) => {
      if (cancelled) {
        resolve()
        return
      }
      let settled = false
      const done = () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        resolve()
      }
      const timer = setTimeout(done, 80)
      if (video.requestVideoFrameCallback) {
        video.requestVideoFrameCallback(() => done())
      } else {
        requestAnimationFrame(() => requestAnimationFrame(() => done()))
      }
    })

    const stampAt = (t) => {
      if (frames < 1) return
      const idx = frames < 2 || duration <= 0
        ? 0
        : Math.max(0, Math.min(frames - 1, Math.round((t / duration) * (frames - 1))))
      if (filled[idx]) return
      stampInto(buffer, idx)
      filled[idx] = 1
    }

    const promise = (async () => {
      video.pause()
      video.loop = false
      video.muted = true
      try {
        video.playbackRate = speed
      } catch (_) {
        video.playbackRate = 1
      }

      try {
        await seekStart()
        if (cancelled) throw new Error('cancelled')
        await waitDecoded()
        stampAt(video.currentTime || 0)
        onProgress && onProgress(0.02)
        flush(buffer, false)

        try {
          await video.play()
        } catch (_) {
          throw new Error('playback failed')
        }

        let lastFlush = performance.now()
        await new Promise((resolve, reject) => {
          let finished = false
          const watchdog = setTimeout(() => finish(), Math.ceil((duration + 4) * 1000))
          const finish = () => {
            if (finished) return
            finished = true
            clearTimeout(watchdog)
            video.removeEventListener('ended', onEnded)
            video.removeEventListener('error', onError)
            if (video.cancelVideoFrameCallback && rvfcId != null) {
              try { video.cancelVideoFrameCallback(rvfcId) } catch (_) {}
            }
            if (rafId) cancelAnimationFrame(rafId)
            resolve()
          }
          const onEnded = () => finish()
          const onError = () => {
            if (finished) return
            finished = true
            clearTimeout(watchdog)
            reject(new Error('playback failed'))
          }
          let rvfcId = null
          let rafId = 0

          const tick = () => {
            if (finished) return
            if (cancelled) {
              finished = true
              clearTimeout(watchdog)
              video.removeEventListener('ended', onEnded)
              video.removeEventListener('error', onError)
              if (video.cancelVideoFrameCallback && rvfcId != null) {
                try { video.cancelVideoFrameCallback(rvfcId) } catch (_) {}
              }
              if (rafId) cancelAnimationFrame(rafId)
              reject(new Error('cancelled'))
              return
            }
            stampAt(video.currentTime || 0)
            const now = performance.now()
            if (now - lastFlush > 80) {
              lastFlush = now
              flush(buffer, false)
            }
            const t = video.currentTime || 0
            onProgress && onProgress(Math.min(0.96, duration > 0 ? t / duration : 0.5))
            if (video.ended || (duration > 0 && t >= duration - 0.04)) {
              finish()
              return
            }
            if (video.requestVideoFrameCallback) {
              rvfcId = video.requestVideoFrameCallback(() => tick())
            } else {
              rafId = requestAnimationFrame(tick)
            }
          }

          video.addEventListener('ended', onEnded)
          video.addEventListener('error', onError)
          tick()
        })

        stampAt(Math.max(0, duration - 1e-3))
        fillGaps(buffer, filled)
        onProgress && onProgress(1)
        flush(buffer, true)
        return { buffer, frames }
      } finally {
        try { video.pause() } catch (_) {}
        try { video.playbackRate = prevRate } catch (_) {}
        try { video.loop = prevLoop } catch (_) {}
        try { video.muted = prevMuted } catch (_) {}
      }
    })()

    return { promise, cancel }
  }

  return {
    measure,
    vertical: () => (params.shape || 'v') === 'v',
    flow: () => params.flow,
    makeBuffer,
    stampInto,
    flush,
    composeSize,
    composeFrame,
    renderFull,
    setParams: (p) => {
      Object.assign(params, p)
      pathCache = null
    },
  }
}
