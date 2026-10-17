// Playback helpers shared by capture and export: seek, play through once
// while handing every presented frame to a callback, and probe the clip.

const STALL_MS = 5000

export function abortError() {
  return new DOMException('cancelled', 'AbortError')
}

export function isAbort(err) {
  return !!err && err.name === 'AbortError'
}

export function setRate(video, rate) {
  try { video.playbackRate = rate } catch (_) { video.playbackRate = 1 }
}

/** Mute, unloop and pause the video; returns a function that puts it back. */
export function holdPlayback(video) {
  const saved = { rate: video.playbackRate || 1, loop: video.loop, muted: video.muted }
  try { video.pause() } catch (_) {}
  video.loop = false
  video.muted = true
  return () => {
    try { video.pause() } catch (_) {}
    try { video.playbackRate = saved.rate } catch (_) {}
    video.loop = saved.loop
    video.muted = saved.muted
  }
}

function waitEvent(el, type, ms) {
  return new Promise((resolve, reject) => {
    const done = (fn) => () => {
      clearTimeout(timer)
      el.removeEventListener(type, ok)
      el.removeEventListener('error', bad)
      fn()
    }
    const ok = done(resolve)
    const bad = done(() => reject(new Error('video error')))
    const timer = setTimeout(done(() => reject(new Error('timeout'))), ms)
    el.addEventListener(type, ok)
    el.addEventListener('error', bad)
  })
}

export async function seekTo(video, time) {
  if (!video.seeking && video.readyState >= 2 && Math.abs(video.currentTime - time) < 1e-3) return
  const seeked = waitEvent(video, 'seeked', 3000).catch(() => {})
  video.currentTime = time
  await seeked
}

/**
 * Play from the current position to the end. onFrame(mediaTime) runs once per
 * presented frame (requestVideoFrameCallback), or per animation frame where
 * that is missing. Resolves on `ended` or after stallMs without a frame.
 */
export function playThrough(video, { signal, onFrame, stallMs = STALL_MS }) {
  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      reject(abortError())
      return
    }
    const rvfc = typeof video.requestVideoFrameCallback === 'function'
    let done = false
    let handle = 0
    let stallTimer = 0

    const cleanup = () => {
      done = true
      clearTimeout(stallTimer)
      video.removeEventListener('ended', finish)
      video.removeEventListener('error', onError)
      if (signal) signal.removeEventListener('abort', onAbort)
      if (rvfc) video.cancelVideoFrameCallback(handle)
      else cancelAnimationFrame(handle)
      try { video.pause() } catch (_) {}
    }
    function finish() {
      if (done) return
      cleanup()
      resolve()
    }
    function fail(err) {
      if (done) return
      cleanup()
      reject(err)
    }
    function onError() { fail(new Error('playback failed')) }
    function onAbort() { fail(abortError()) }

    const armStall = () => {
      clearTimeout(stallTimer)
      stallTimer = setTimeout(finish, stallMs)
    }
    const schedule = () => {
      handle = rvfc ? video.requestVideoFrameCallback(tick) : requestAnimationFrame(() => tick())
    }
    const tick = (_now, meta) => {
      if (done) return
      const t = meta && Number.isFinite(meta.mediaTime) ? meta.mediaTime : video.currentTime
      try {
        onFrame(t)
      } catch (err) {
        fail(err)
        return
      }
      armStall()
      if (video.ended) finish()
      else schedule()
    }

    video.addEventListener('ended', finish)
    video.addEventListener('error', onError)
    if (signal) signal.addEventListener('abort', onAbort)
    schedule()
    armStall()
    const p = video.play()
    if (p) p.catch((err) => fail(isAbort(err) ? abortError() : new Error('playback failed')))
  })
}

/** Duration in seconds; recorder-made webm reports Infinity until probed. */
export async function resolveDuration(video) {
  const ok = () => Number.isFinite(video.duration) && video.duration > 0
  if (ok()) return video.duration
  await new Promise((resolve) => {
    const check = () => { if (ok()) done() }
    const done = () => {
      clearTimeout(timer)
      video.removeEventListener('durationchange', check)
      resolve()
    }
    const timer = setTimeout(done, 3000)
    video.addEventListener('durationchange', check)
    try { video.currentTime = 1e101 } catch (_) { done() }
  })
  await seekTo(video, 0)
  return ok() ? video.duration : 0
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

/** Native frame rate, measured on a hidden clone so the preview stays put. */
export async function detectVideoRate(src) {
  const el = document.createElement('video')
  if (!src || typeof el.requestVideoFrameCallback !== 'function') return 30
  el.muted = true
  el.playsInline = true
  el.preload = 'auto'
  el.style.cssText = 'position:fixed;left:-99px;top:0;width:1px;height:1px;opacity:0;pointer-events:none'
  el.src = src
  document.body.appendChild(el)
  const times = []
  try {
    if (el.readyState < 2) await waitEvent(el, 'loadeddata', 4000)
    await el.play()
    await new Promise((resolve) => {
      const stopAt = performance.now() + 1200
      const tick = (_now, meta) => {
        times.push(meta.mediaTime)
        if (times.length >= 20 || performance.now() > stopAt) resolve()
        else el.requestVideoFrameCallback(tick)
      }
      el.requestVideoFrameCallback(tick)
      setTimeout(resolve, 1600)
    })
  } catch (_) {
    return 30
  } finally {
    try { el.pause() } catch (_) {}
    el.removeAttribute('src')
    try { el.load() } catch (_) {}
    el.remove()
  }
  const deltas = []
  for (let i = 1; i < times.length; i++) {
    const d = times[i] - times[i - 1]
    if (d > 0.003 && d < 0.12) deltas.push(d)
  }
  if (deltas.length < 3) return 30
  deltas.sort((a, b) => a - b)
  return snapRate(1 / deltas[Math.floor(deltas.length / 2)])
}
