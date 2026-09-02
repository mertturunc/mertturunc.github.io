// Slit-scan renderer: each frame samples pixels along a 1D path through the
// frame and stamps that column/row into an accumulating output.
//
// params: {
//   shape: 'v'|'h'|'diag'|'adiag'|'sine'|'free',
//   flow: 'lr'|'rl'|'ud'|'du',
//   linePos: 0..1,
//   scale: 0..1,
//   freePath: [{x,y}, ...] normalized 0..1 (video space), for shape==='free'
// }

import { BED, KNIFE } from './tokens.js'

export const MAX_AXIS = 4096

export function planCapture(duration, rate = 30) {
  const d = Number.isFinite(duration) && duration > 0 ? duration : 0
  const raw = Math.max(2, Math.round(d * rate))
  const step = Math.max(1, Math.ceil(raw / MAX_AXIS))
  const frames = Math.ceil(raw / step)
  return { frames, step, raw }
}

export function timeOnX(flow) {
  return flow === 'lr' || flow === 'rl'
}

export function isStraight(shape) {
  return shape === 'v' || shape === 'h'
}

/** Knife-split compose only when slit ⊥ time axis (v+lr/rl or h+ud/du). */
export function knifeComposeAligned(shape, flow) {
  if (shape === 'v') return timeOnX(flow)
  if (shape === 'h') return !timeOnX(flow)
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
    // top-left → bottom-right, shifted by linePos along the anti-diagonal
    const shift = (lp - 0.5) * 0.9
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1)
      out[i * 2] = Math.min(1, Math.max(0, t + shift))
      out[i * 2 + 1] = Math.min(1, Math.max(0, t - shift))
    }
    return out
  }

  if (shape === 'adiag') {
    // top-right → bottom-left
    const shift = (lp - 0.5) * 0.9
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1)
      out[i * 2] = Math.min(1, Math.max(0, 1 - t + shift))
      out[i * 2 + 1] = Math.min(1, Math.max(0, t + shift))
    }
    return out
  }

  if (shape === 'sine') {
    const amp = 0.22
    const periods = 2
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1)
      out[i * 2] = Math.min(1, Math.max(0, lp + amp * Math.sin(t * Math.PI * 2 * periods)))
      out[i * 2 + 1] = t
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
  if (shape === 'h') return Math.max(1, sw)
  if (shape === 'v' || shape === 'sine') return Math.max(1, sh)
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
    const f = Number.isFinite(params.scale) && params.scale > 0 && params.scale <= 1 ? params.scale : 0.5
    const nw = Math.max(1, Math.round(vw * f))
    const nh = Math.max(1, Math.round(vh * f))
    if (scratch.width !== nw || scratch.height !== nh) {
      scratch.width = nw
      scratch.height = nh
      pathCache = null
    }
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

  function composeSize() {
    const vw = video.videoWidth || 16
    const vh = video.videoHeight || 9
    const r = vh / vw
    return { w: 1280, h: Math.max(1, Math.min(1280, Math.round(1280 * r))) }
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
    ctx.imageSmoothingEnabled = true
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
        const sw = onX ? Math.max(1, Math.round(oW * t)) : oW
        const sh = onX ? oH : Math.max(1, Math.round(oH * t))
        // Same temporal rule as knife compose, for EVERY shape×flow:
        // newest sits against the live image, earliest at the far tip.
        // →/↑ : [img][fn]…[f0]  (result flush to the far edge, grows back)
        // ←/↓ : [f0]…[fn][img]
        // Buffer: lr/ud store newest at 0; rl/du store earliest at 0.
        const sx = 0
        const sy = 0
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

  function renderFull(onProgress) {
    // Exact sample per planned frame via seek. Parallel offscreen <video>
    // workers share the same src and each owns a disjoint index set — no
    // dropped-frame copies, same temporal quality as sequential seek.
    measure()
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0
    const rate = 30
    const { frames, step } = planCapture(duration, rate)
    const buffer = makeBuffer(frames)
    let cancelled = false
    const prevRate = video.playbackRate || 1
    const prevLoop = video.loop
    const workers = []

    const cancel = () => {
      cancelled = true
      try { video.pause() } catch (_) {}
      try { video.playbackRate = prevRate } catch (_) {}
      try { video.loop = prevLoop } catch (_) {}
      for (const w of workers) {
        try { w.el.pause() } catch (_) {}
        try { w.el.removeAttribute('src'); w.el.load() } catch (_) {}
      }
    }

    const seekTo = (el, t) => new Promise((resolve, reject) => {
      if (cancelled) {
        reject(new Error('cancelled'))
        return
      }
      const target = Math.min(Math.max(0, t), Math.max(0, duration - 1e-3))
      if (!el.seeking && Math.abs(el.currentTime - target) < 1e-3) {
        resolve()
        return
      }
      let settled = false
      const done = () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        el.removeEventListener('seeked', done)
        el.removeEventListener('error', fail)
        resolve()
      }
      const fail = () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        el.removeEventListener('seeked', done)
        el.removeEventListener('error', fail)
        reject(new Error('seek failed'))
      }
      el.addEventListener('seeked', done)
      el.addEventListener('error', fail)
      try {
        el.currentTime = target
      } catch (_) {
        fail()
        return
      }
      const timer = setTimeout(() => {
        if (!settled && Math.abs(el.currentTime - target) < 0.08) done()
        else if (!settled) fail()
      }, 2000)
    })

    const waitFrame = (el) => new Promise((resolve) => {
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
      const timer = setTimeout(done, 120)
      if (el.requestVideoFrameCallback) {
        el.requestVideoFrameCallback(() => done())
      } else {
        requestAnimationFrame(() => requestAnimationFrame(() => done()))
      }
    })

    const readyVideo = (el) => new Promise((resolve, reject) => {
      if (el.readyState >= 2 && el.videoWidth > 0) {
        resolve()
        return
      }
      let settled = false
      const ok = () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        el.removeEventListener('loadeddata', ok)
        el.removeEventListener('error', fail)
        resolve()
      }
      const fail = () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        el.removeEventListener('loadeddata', ok)
        el.removeEventListener('error', fail)
        reject(new Error('worker video failed'))
      }
      el.addEventListener('loadeddata', ok)
      el.addEventListener('error', fail)
      const timer = setTimeout(() => {
        if (!settled && el.readyState >= 2 && el.videoWidth > 0) ok()
        else if (!settled) fail()
      }, 8000)
    })

    const promise = (async () => {
      video.pause()
      video.loop = false
      video.playbackRate = 1

      const src = video.currentSrc || video.src
      if (!src) throw new Error('no video source')

      // 2–3 parallel decoders: seek-bound, not CPU-bound. Cap keeps browsers
      // from thrashing the media pipeline on the same blob.
      const nWorkers = Math.max(1, Math.min(3, frames, (navigator.hardwareConcurrency || 4) >= 8 ? 3 : 2))
      const vw = video.videoWidth || scratch.width
      const vh = video.videoHeight || scratch.height

      try {
        for (let w = 0; w < nWorkers; w++) {
          const el = document.createElement('video')
          el.muted = true
          el.playsInline = true
          el.preload = 'auto'
          el.loop = false
          el.src = src
          const canvas = document.createElement('canvas')
          canvas.width = vw
          canvas.height = vh
          const ctx = canvas.getContext('2d', { willReadFrequently: true })
          workers.push({ el, canvas, ctx })
        }

        await Promise.all(workers.map((w) => readyVideo(w.el)))
        if (cancelled) throw new Error('cancelled')

        let doneCount = 0
        let lastFlushIdx = -1

        const runWorker = async (worker, workerIndex) => {
          for (let idx = workerIndex; idx < frames; idx += nWorkers) {
            if (cancelled) throw new Error('cancelled')
            const t = duration > 0 ? Math.min(duration - 1e-3, (idx * step) / rate) : 0
            await seekTo(worker.el, t)
            await waitFrame(worker.el)
            if (cancelled) throw new Error('cancelled')
            stampFrom(worker.el, worker.ctx, worker.canvas, buffer, idx)
            doneCount++
            onProgress && onProgress(doneCount / frames)
            if (doneCount === frames || doneCount - lastFlushIdx >= 8) {
              lastFlushIdx = doneCount
              flush(buffer, doneCount === frames)
            }
          }
        }

        await Promise.all(workers.map((w, i) => runWorker(w, i)))
        flush(buffer, true)
        return { buffer, frames }
      } finally {
        try { video.playbackRate = prevRate } catch (_) {}
        try { video.loop = prevLoop } catch (_) {}
        for (const w of workers) {
          try { w.el.pause() } catch (_) {}
          try { w.el.removeAttribute('src'); w.el.load() } catch (_) {}
        }
        workers.length = 0
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
