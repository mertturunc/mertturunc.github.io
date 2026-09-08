// SlitScan — vanilla ESM instrument on the shared tools shell.
import {
  createSlitEngine,
  planCapture,
  buildPath,
  timeOnX,
  detectVideoRate,
  captureRate,
  playSpeed,
} from './slitScan.js'
import { buildProjectZip } from './projectExport.js'
import {
  probeMediaFile,
  browserCanPlayCodec,
  isHevc,
  paintFirstFrame,
  videoHasPicture,
} from './mediaProbe.js'

const $ = (sel) => document.querySelector(sel)
const t = (key, vars) => (typeof window.toolT === 'function' ? window.toolT(key, vars) : key)

const $stage = $('[data-stage]')
const $empty = $('[data-empty]')
const $video = $('[data-video]')
const $pathov = $('[data-pathov]')
const $stageFail = $('[data-stagefail]')
const $srcname = $('[data-srcname]')
const $file = $('[data-file]')
const $filelabel = $('[data-filelabel]')
const $out = $('[data-out]')
const $outputbed = $('[data-outputbed]')
const $progress = $('[data-progress]')
const $bar = $('[data-bar]')
const $meta = $('[data-meta]')
const $direction = $('[data-direction]')
const $live = $('[data-live]')
const $oneshot = $('[data-oneshot]')
const $stop = $('[data-stop]')
const $reset = $('[data-reset]')
const $toast = $('[data-toast]')
const $drawhint = $('[data-drawhint]')
const $drawrow = $('[data-drawrow]')
const $clearpath = $('[data-clearpath]')
const $stagePanel = $('.stage-panel')

const shapeBtns = [...document.querySelectorAll('[data-shape]')]
const flowBtns = [...document.querySelectorAll('[data-flow]')]
const fmtBtns = [...document.querySelectorAll('[data-fmt]')]
const qualityBtns = [...document.querySelectorAll('[data-quality]')]
const dropzones = [...document.querySelectorAll('[data-dropzone]')]

const SHAPE_ARIA = {
  v: 'shape_v_aria',
  h: 'shape_h_aria',
  diag: 'shape_diag_aria',
  adiag: 'shape_adiag_aria',
  sine: 'shape_sine_aria',
  free: 'shape_free',
}

const VIDEO_EXTS = new Set([
  'mp4', 'm4v', 'webm', 'mov', 'mkv', 'avi', 'ogv', 'ogg',
  '3gp', '3g2', 'wmv', 'flv', 'ts', 'mts', 'm2ts', 'asf', 'mpg', 'mpeg',
])

const IMAGE_FMTS = new Set(['png', 'jpg', 'webp'])
const VIDEO_FMTS = new Set(['webm', 'mp4'])
const PROJECT_FMTS = new Set(['ae', 'pr'])

function canRecordMime(mimes) {
  try {
    if (typeof MediaRecorder === 'undefined') return null
    for (const m of mimes) {
      if (MediaRecorder.isTypeSupported(m)) return m
    }
  } catch (_) {}
  return null
}

function canEncodeWebp() {
  try {
    const c = document.createElement('canvas')
    c.width = 1
    c.height = 1
    return c.toDataURL('image/webp').startsWith('data:image/webp')
  } catch (_) {
    return false
  }
}

const RECORD_MIME = {
  webm: canRecordMime(['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']),
  mp4: canRecordMime([
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4;codecs=avc1.42E01E',
    'video/mp4',
  ]),
}
const WEBP_OK = canEncodeWebp()

function fmtSupported(fmt) {
  if (fmt === 'png' || fmt === 'jpg') return true
  if (fmt === 'webp') return WEBP_OK
  if (fmt === 'webm') return !!RECORD_MIME.webm
  if (fmt === 'mp4') return !!RECORD_MIME.mp4
  if (PROJECT_FMTS.has(fmt)) return true
  return false
}

function firstSupportedFmt() {
  for (const f of ['png', 'jpg', 'webp', 'webm', 'mp4']) {
    if (fmtSupported(f)) return f
  }
  return 'png'
}

function fileExt(name) {
  const m = String(name || '').toLowerCase().match(/\.([a-z0-9]+)$/)
  return m ? m[1] : ''
}

function isLikelyVideo(file) {
  if (!file) return false
  if (file.type && file.type.startsWith('video/')) return true
  return VIDEO_EXTS.has(fileExt(file.name))
}

const DEFAULT_FREE = [
  { x: 0.5, y: 0 },
  { x: 0.5, y: 1 },
]

const state = {
  objectUrl: null,
  srcName: null,
  sourceFile: null,
  shape: 'v',
  flow: 'lr',
  linePos: 0.5,
  fps: 30,
  fpsReady: false,
  quality: 'full',
  exportFmt: firstSupportedFmt(),
  freePath: DEFAULT_FREE.map((p) => ({ ...p })),
  busy: false,
  busyKind: null, // 'live' | 'oneshot' | 'export' | null
  hasOutput: false,
  progress: 0,
  meta: null,
  msg: null,
  fileName: null,
  drawing: false,
}

let fpsProbe = null
let fpsGen = 0

let engineRef = null
let rafRef = null
let oneshotCancel = null
let exportCancel = null
let bufferRef = null
let frameRef = 0
let totalRef = 0
let lastPctRef = -1
let streamedRef = false
let lastStampIdxRef = -1
let toastTimer = null
let pathOvCtx = null

function currentParams() {
  return {
    shape: state.shape,
    flow: state.flow,
    linePos: state.linePos,
    rate: state.fps,
    quality: state.quality,
    freePath: state.freePath,
  }
}

function setMsg(m) {
  state.msg = m
  if (m) {
    $toast.textContent = m
    $toast.hidden = false
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { $toast.hidden = true }, 2800)
  } else {
    $toast.hidden = true
  }
}

function allowedFlows() {
  return ['lr', 'rl', 'ud', 'du']
}

function clampFlow(_shape, flow) {
  return allowedFlows().includes(flow) ? flow : 'lr'
}

function directionLabel() {
  const shapes = {
    v: 'shape_v',
    h: 'shape_h',
    diag: 'shape_diag',
    adiag: 'shape_adiag',
    sine: 'shape_sine',
    free: 'shape_free',
  }
  const flows = {
    lr: 'flow_lr',
    rl: 'flow_rl',
    ud: 'flow_ud',
    du: 'flow_du',
  }
  return `${t(shapes[state.shape] || 'shape_v')} · ${t(flows[state.flow] || 'flow_lr')}`
}

function videoBox() {
  const rect = $stage.getBoundingClientRect()
  const vr = $video.getBoundingClientRect()
  const w = vr.width
  const h = vr.height
  if (w >= 2 && h >= 2) {
    return { left: vr.left, top: vr.top, width: w, height: h, stage: rect }
  }
  const vw = $video.videoWidth || 1
  const vh = $video.videoHeight || 1
  const scale = Math.min(rect.width / vw, rect.height / vh)
  const dw = vw * scale
  const dh = vh * scale
  return {
    left: rect.left + (rect.width - dw) / 2,
    top: rect.top + (rect.height - dh) / 2,
    width: dw,
    height: dh,
    stage: rect,
  }
}

function syncStageAspect() {
  const vw = $video.videoWidth
  const vh = $video.videoHeight
  if (vw > 0 && vh > 0) $stage.style.setProperty('--stage-aspect', `${vw} / ${vh}`)
  else $stage.style.removeProperty('--stage-aspect')
}

function setStageFail(msg) {
  if (!$stageFail) return
  if (msg) {
    $stageFail.textContent = msg
    $stageFail.hidden = false
  } else {
    $stageFail.textContent = ''
    $stageFail.hidden = true
  }
}

function pointerToNorm(e) {
  const box = videoBox()
  if (box.width < 1 || box.height < 1) return null
  const x = (e.clientX - box.left) / box.width
  const y = (e.clientY - box.top) / box.height
  if (x < 0 || x > 1 || y < 0 || y > 1) return null
  return { x, y }
}

function drawOverlay() {
  const canvas = $pathov
  if (!canvas || !$stage || $stage.hidden) return
  const rect = $stage.getBoundingClientRect()
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const cssW = Math.max(1, Math.round(rect.width))
  const cssH = Math.max(1, Math.round(rect.height))
  if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
    canvas.width = Math.round(cssW * dpr)
    canvas.height = Math.round(cssH * dpr)
    canvas.style.width = cssW + 'px'
    canvas.style.height = cssH + 'px'
    pathOvCtx = canvas.getContext('2d')
  }
  const ctx = pathOvCtx || canvas.getContext('2d')
  pathOvCtx = ctx
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssW, cssH)

  const box = videoBox()
  const ox = box.left - rect.left
  const oy = box.top - rect.top
  const n = 256
  const path = buildPath(currentParams(), n)
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#fe8019'

  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.beginPath()
  for (let i = 0; i < n; i++) {
    const x = ox + path[i * 2] * box.width
    const y = oy + path[i * 2 + 1] * box.height
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function render() {
  state.flow = clampFlow(state.shape, state.flow)

  $srcname.hidden = !state.srcName
  if (state.srcName) $srcname.textContent = state.srcName

  $stage.hidden = !state.objectUrl
  $empty.hidden = !!state.objectUrl
  $stage.classList.toggle('drawing', state.shape === 'free')

  $drawhint.hidden = state.shape !== 'free'
  $drawrow.hidden = state.shape !== 'free'

  for (const b of shapeBtns) {
    const on = b.dataset.shape === state.shape
    b.classList.toggle('on', on)
    b.setAttribute('aria-pressed', String(on))
    const ariaKey = SHAPE_ARIA[b.dataset.shape]
    if (ariaKey) b.setAttribute('aria-label', t(ariaKey))
  }
  for (const b of flowBtns) {
    b.hidden = false
    const on = b.dataset.flow === state.flow
    b.classList.toggle('on', on)
    b.setAttribute('aria-pressed', String(on))
  }

  for (const b of qualityBtns) {
    const on = b.dataset.quality === state.quality
    b.classList.toggle('on', on)
    b.setAttribute('aria-pressed', String(on))
  }

  if (!fmtSupported(state.exportFmt)) state.exportFmt = firstSupportedFmt()
  for (const b of fmtBtns) {
    const fmt = b.dataset.fmt
    const ok = fmtSupported(fmt)
    b.hidden = !ok
    b.disabled = !ok || state.busy
    const on = fmt === state.exportFmt
    b.classList.toggle('on', on)
    b.setAttribute('aria-pressed', String(on))
  }

  $direction.textContent = directionLabel()

  $out.classList.toggle('live', state.busy)
  $outputbed.hidden = state.hasOutput || state.busy
  $out.style.display = state.hasOutput ? '' : 'none'

  const showProgress = state.busy && state.progress > 0 && state.progress < 1
  $progress.hidden = !showProgress
  const pct = Math.max(0, Math.min(100, Math.round(state.progress * 100)))
  $progress.setAttribute('aria-valuenow', String(pct))
  $bar.style.transform = `scaleX(${state.progress})`
  if ($stagePanel) $stagePanel.setAttribute('aria-busy', state.busy ? 'true' : 'false')

  $meta.hidden = !state.meta
  if (state.shape === 'free') {
    $meta.textContent = t('meta_free', { n: state.freePath.length })
  } else {
    $meta.textContent = t('meta', { pct: Math.round(state.linePos * 100) + '%' })
  }

  const hasSrc = !!state.objectUrl
  const locked = !hasSrc || state.busy
  for (const b of [...shapeBtns, ...flowBtns, ...qualityBtns]) b.disabled = locked
  $clearpath.disabled = locked
  $reset.disabled = !hasSrc || state.busy
  $file.disabled = state.busy
  $stop.disabled = !state.busy
  $stop.textContent = t('stop_capture')

  if (state.busy && state.busyKind === 'live') {
    $live.disabled = true
    $live.textContent = t('go_live')
    $oneshot.disabled = true
    $oneshot.textContent = t('go_oneshot')
  } else if (state.busy && state.busyKind === 'oneshot') {
    $live.disabled = true
    $live.textContent = t('go_live')
    $oneshot.disabled = true
    $oneshot.textContent = t('go_oneshot_busy')
  } else if (state.busy && state.busyKind === 'export') {
    $live.disabled = true
    $live.textContent = t('go_live')
    $oneshot.disabled = true
    $oneshot.textContent = t('go_oneshot_busy')
  } else {
    $live.disabled = !hasSrc
    $live.textContent = t('go_live')
    $oneshot.disabled = !hasSrc
    $oneshot.textContent = t('go_oneshot')
  }

  if (state.fileName) {
    $filelabel.textContent = t('loaded', { name: state.fileName })
  }

  if (state.objectUrl) drawOverlay()
}

function throttledProgress(p) {
  const pct = Math.floor(p * 100)
  if (pct !== lastPctRef) {
    lastPctRef = pct
    state.progress = p
    render()
  }
}

function ensureEngine() {
  if (!engineRef) {
    engineRef = createSlitEngine({
      video: $video,
      outputCanvas: $out,
      params: currentParams(),
    })
  } else {
    engineRef.setParams(currentParams())
  }
  return engineRef
}

function stopLive(m) {
  if (rafRef) cancelAnimationFrame(rafRef)
  rafRef = null
  if ($video) $video.pause()
  state.busy = false
  state.busyKind = null
  if (m) setMsg(m)
  render()
}

function startLive() {
  const v = $video
  if (!v || state.busy) return
  if (state.shape === 'free' && state.freePath.length < 2) {
    setMsg(t('msg_need_path'))
    return
  }
  ensureFps().then(() => {
    if (state.busy || !state.objectUrl) return
    beginLive()
  })
}

function beginLive() {
  const v = $video
  if (!v || state.busy) return
  const engine = ensureEngine()
  v.pause()
  v.currentTime = 0
  const duration = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 0
  const rate = captureRate(currentParams())
  const { frames } = planCapture(duration, rate, state.quality)
  totalRef = frames
  frameRef = 0
  bufferRef = null
  streamedRef = false
  lastPctRef = -1
  lastStampIdxRef = -1
  state.hasOutput = false
  state.progress = 0
  state.busy = true
  state.busyKind = 'live'
  render()
  v.muted = true
  v.playbackRate = playSpeed(state.quality)
  v.play().catch(() => {})

  const tick = () => {
    if (!state.busy || state.busyKind !== 'live') return
    const tnow = v.currentTime || 0
    const idx = frames < 2 || duration <= 0
      ? 0
      : Math.max(0, Math.min(frames - 1, Math.round((tnow / duration) * (frames - 1))))
    if (v.ended || tnow >= duration - 0.04) {
      if (bufferRef) {
        if (idx !== lastStampIdxRef) {
          try { engine.stampInto(bufferRef, idx) } catch (_) {}
        }
        engine.flush(bufferRef, true)
      }
      stopLive(t('msg_done'))
      return
    }
    if (!bufferRef) {
      bufferRef = engine.makeBuffer(totalRef)
    }
    if (idx !== lastStampIdxRef) {
      lastStampIdxRef = idx
      try {
        engine.stampInto(bufferRef, idx)
        engine.flush(bufferRef, false)
        if (!streamedRef) { streamedRef = true; state.hasOutput = true; render() }
      } catch (_) {}
      frameRef = idx + 1
      throttledProgress(Math.min(1, (idx + 1) / totalRef))
    }
    rafRef = requestAnimationFrame(tick)
  }
  rafRef = requestAnimationFrame(tick)
}

async function ensureFps() {
  if (state.fpsReady) return state.fps
  if (!state.objectUrl) return state.fps
  if (fpsProbe) return fpsProbe
  const gen = fpsGen
  fpsProbe = detectVideoRate(state.objectUrl)
    .then((fps) => {
      if (gen !== fpsGen) return state.fps
      state.fps = fps
      state.fpsReady = true
      engineRef = null
      return fps
    })
    .catch(() => state.fps)
    .finally(() => { if (gen === fpsGen) fpsProbe = null })
  return fpsProbe
}

async function runOneShot() {
  if (state.busy) return
  if (state.shape === 'free' && state.freePath.length < 2) {
    setMsg(t('msg_need_path'))
    return
  }
  await ensureFps()
  const engine = ensureEngine()
  lastPctRef = -1
  state.busy = true
  state.busyKind = 'oneshot'
  state.hasOutput = false
  state.progress = 0
  render()
  let shipped = false
  try {
    const run = engine.renderFull(throttledProgress)
    oneshotCancel = run.cancel
    await run.promise
    if (state.busyKind !== 'oneshot') return
    state.hasOutput = true
    oneshotCancel = null
    state.busyKind = 'export'
    state.progress = 0
    render()
    shipped = await shipOutput()
  } catch (e) {
    const cancelled = e && (e.message === 'cancelled' || e.name === 'AbortError')
    if (cancelled) {
      if (state.busyKind === 'oneshot' || state.busyKind === 'export') setMsg(t('msg_stopped'))
    } else if (state.busyKind === 'oneshot' || state.busyKind === 'export') {
      setMsg(t('msg_fail', { err: e.message }))
    }
  } finally {
    oneshotCancel = null
    exportCancel = null
    if (state.busyKind === 'oneshot' || state.busyKind === 'export') {
      state.busy = false
      state.busyKind = null
      if (shipped && !state.msg) setMsg(t('msg_rendered'))
      render()
    }
  }
}

function stopCapture() {
  if (!state.busy) return
  if (state.busyKind === 'live') {
    stopLive(t('msg_stopped'))
    return
  }
  if (state.busyKind === 'oneshot' && oneshotCancel) {
    try { oneshotCancel() } catch (_) {}
    oneshotCancel = null
    state.busy = false
    state.busyKind = null
    setMsg(t('msg_stopped'))
    render()
    return
  }
  if (state.busyKind === 'export' && exportCancel) {
    try { exportCancel() } catch (_) {}
    exportCancel = null
  }
}

function reset(quiet) {
  if (rafRef) cancelAnimationFrame(rafRef)
  rafRef = null
  if (oneshotCancel) {
    try { oneshotCancel() } catch (_) {}
    oneshotCancel = null
  }
  if (exportCancel) {
    try { exportCancel() } catch (_) {}
    exportCancel = null
  }
  if ($video) $video.pause()
  setStageFail('')
  if ($stage) $stage.style.removeProperty('--stage-aspect')
  const c = $out
  if (c) { c.getContext('2d').clearRect(0, 0, c.width, c.height); c.width = 4; c.height = 4 }
  bufferRef = null
  frameRef = 0
  state.busy = false
  state.busyKind = null
  state.hasOutput = false
  state.progress = 0
  if (!quiet) setMsg(t('msg_reset'))
  render()
}

function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    const done = (blob) => {
      if (blob) resolve(blob)
      else reject(new Error('encode'))
    }
    try {
      if (quality == null) canvas.toBlob(done, mime)
      else canvas.toBlob(done, mime, quality)
    } catch (e) {
      reject(e)
    }
  })
}

function triggerDownload(blob, filename) {
  const a = document.createElement('a')
  a.download = filename
  a.href = URL.createObjectURL(blob)
  document.body.appendChild(a)
  a.click()
  setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href) }, 10000)
}

function exportImage(fmt) {
  const c = $out
  if (!c || c.width <= 4) return Promise.resolve(false)
  if (!fmtSupported(fmt)) {
    setMsg(t('fmt_unsupported', { fmt }))
    return Promise.resolve(false)
  }
  const mime = fmt === 'jpg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png'
  const quality = fmt === 'png' ? undefined : 0.92
  const filename = `slitscan.${fmt === 'jpg' ? 'jpg' : fmt}`
  return canvasToBlob(c, mime, quality).then((blob) => {
    triggerDownload(blob, filename)
    setMsg(t('msg_exported', { fmt }))
    return true
  })
}

async function exportVideo(fmt) {
  const c = $out
  if (!c || c.width <= 4) return false
  const mime = RECORD_MIME[fmt]
  if (!mime) {
    setMsg(t('fmt_unsupported', { fmt }))
    return false
  }
  const engine = ensureEngine()
  const v = $video
  const duration = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 0
  const onX = timeOnX(state.flow)
  const total = Math.max(1, onX ? c.width : c.height)
  const { w, h } = engine.composeSize()
  const compose = document.createElement('canvas')
  compose.width = w
  compose.height = h
  const ctx = compose.getContext('2d')
  const rate = Number.isFinite(state.fps) && state.fps > 0 ? state.fps : 30

  const stream = compose.captureStream(rate)
  const rec = new MediaRecorder(stream, { mimeType: mime })
  const chunks = []
  rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data) }

  const done = new Promise((resolve) => {
    rec.onstop = () => {
      stream.getTracks().forEach((tr) => tr.stop())
      resolve()
    }
  })

  let cancelled = false
  let raf = 0
  let lastUi = 0
  exportCancel = () => { cancelled = true }

  setMsg(t('msg_exporting', { fmt }))
  const prevLoop = v.loop
  v.pause()
  v.loop = false
  v.playbackRate = 1

  const paint = (filled, forceUi) => {
    engine.composeFrame(ctx, w, h, filled, total, { showKnife: false })
    const now = performance.now()
    if (forceUi || now - lastUi > 80) {
      lastUi = now
      state.progress = total > 0 ? filled / total : 1
      const pctNow = Math.max(0, Math.min(100, Math.round(state.progress * 100)))
      $progress.hidden = !(state.progress > 0 && state.progress < 1)
      $progress.setAttribute('aria-valuenow', String(pctNow))
      $bar.style.transform = `scaleX(${state.progress})`
    }
  }

  try {
    rec.start(100)
    $progress.hidden = false
    $progress.setAttribute('aria-valuenow', '0')

    if (!duration) {
      paint(total, true)
      await new Promise((r) => setTimeout(r, Math.round(2000 / rate)))
    } else {
      await new Promise((resolve) => {
        let settled = false
        const finish = () => {
          if (settled) return
          settled = true
          v.removeEventListener('ended', onEnded)
          v.removeEventListener('error', onEnded)
          if (raf) cancelAnimationFrame(raf)
          resolve()
        }
        const onEnded = () => finish()
        const tick = () => {
          if (cancelled) {
            try { v.pause() } catch (_) {}
            finish()
            return
          }
          const tNorm = Math.min(1, v.currentTime / duration)
          paint(Math.round(tNorm * total), false)
          if (v.ended || tNorm >= 0.999) {
            finish()
            return
          }
          if (v.requestVideoFrameCallback) {
            v.requestVideoFrameCallback(() => tick())
          } else {
            raf = requestAnimationFrame(tick)
          }
        }
        v.addEventListener('ended', onEnded)
        v.addEventListener('error', onEnded)
        const start = () => {
          if (cancelled) { finish(); return }
          tick()
        }
        const onSeeked = () => {
          v.removeEventListener('seeked', onSeeked)
          v.playbackRate = 1
          v.play().then(start).catch(start)
        }
        v.addEventListener('seeked', onSeeked)
        try {
          v.currentTime = 0
          if (!v.seeking && v.currentTime < 1e-3) onSeeked()
        } catch (_) {
          onSeeked()
        }
      })
    }

    if (!cancelled) {
      paint(total, true)
      await new Promise((r) => setTimeout(r, Math.round(2000 / rate)))
    }
    if (rec.state !== 'inactive') rec.stop()
    await done

    const blob = new Blob(chunks, { type: rec.mimeType || mime })
    if (!cancelled && blob.size) {
      triggerDownload(blob, `slitscan.${fmt}`)
      setMsg(t('msg_exported', { fmt }))
      return true
    }
    if (cancelled) setMsg(t('msg_stopped'))
    return false
  } catch (e) {
    try { if (rec.state !== 'inactive') rec.stop() } catch (_) {}
    if (!cancelled) setMsg(t('msg_fail', { err: e.message || 'export' }))
    return false
  } finally {
    exportCancel = null
    try { v.pause() } catch (_) {}
    try { v.playbackRate = 1 } catch (_) {}
    try { v.loop = prevLoop } catch (_) {}
  }
}

async function exportProject(kind) {
  const c = $out
  if (!c || c.width <= 4) return false
  let cancelled = false
  exportCancel = () => { cancelled = true }
  setMsg(t('msg_packaging'))
  try {
    const stillBlob = await canvasToBlob(c, 'image/png')
    if (cancelled) {
      setMsg(t('msg_stopped'))
      return false
    }
    const v = $video
    const { blob, filename } = await buildProjectZip({
      kind,
      stillBlob,
      sourceFile: state.sourceFile,
      sourceName: state.fileName || state.srcName || 'source.mp4',
      fps: state.fps,
      duration: Number.isFinite(v.duration) ? v.duration : 0,
      stillW: c.width,
      stillH: c.height,
      videoW: v.videoWidth,
      videoH: v.videoHeight,
    })
    if (cancelled) {
      setMsg(t('msg_stopped'))
      return false
    }
    triggerDownload(blob, filename)
    setMsg(t('msg_exported_project', { fmt: kind }))
    return true
  } finally {
    exportCancel = null
  }
}

async function shipOutput() {
  const fmt = state.exportFmt
  if (!fmtSupported(fmt)) {
    setMsg(t('fmt_unsupported', { fmt }))
    return false
  }
  if (IMAGE_FMTS.has(fmt)) return exportImage(fmt)
  if (VIDEO_FMTS.has(fmt)) return exportVideo(fmt)
  if (PROJECT_FMTS.has(fmt)) return exportProject(fmt)
  return false
}

function handleSource({ url, name, file }) {
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl)
  reset(true)
  setStageFail('')
  state.objectUrl = url
  state.srcName = name
  state.fileName = name
  state.sourceFile = file || null
  state.fps = 30
  state.fpsReady = false
  fpsGen += 1
  fpsProbe = null
  $video.src = url
  $video.load()
  render()
  preparePreview(file)
}

async function preparePreview(file) {
  const gen = fpsGen
  let probe = { codec: null, rotation: 0, brand: '' }
  try {
    if (file) probe = await probeMediaFile(file)
  } catch (_) {}
  if (gen !== fpsGen) return

  if (probe.codec && !browserCanPlayCodec(probe.codec)) {
    const msg = isHevc(probe.codec) ? t('msg_hevc') : t('msg_video_error')
    setStageFail(msg)
    setMsg(msg)
    return
  }

  try {
    await paintFirstFrame($video)
  } catch (_) {}
  if (gen !== fpsGen) return

  syncStageAspect()
  drawOverlay()
  render()

  if ($video.videoWidth > 0 && !videoHasPicture($video)) {
    const msg = isHevc(probe.codec) ? t('msg_hevc') : t('msg_no_frame')
    setStageFail(msg)
    setMsg(msg)
  }
}

function takeVideoFile(file) {
  if (!file) return
  if (!isLikelyVideo(file)) {
    setMsg(t('msg_bad_file'))
    return
  }
  const type = file.type && file.type !== 'video/quicktime' ? file.type : 'video/mp4'
  const blob = type === file.type ? file : new Blob([file], { type })
  const url = URL.createObjectURL(blob)
  handleSource({ url, name: file.name, file })
}

function bindDropzone(el) {
  el.addEventListener('dragenter', (e) => {
    e.preventDefault()
    el.classList.add('dragover')
  })
  el.addEventListener('dragover', (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    el.classList.add('dragover')
  })
  el.addEventListener('dragleave', (e) => {
    if (e.target === el) el.classList.remove('dragover')
  })
  el.addEventListener('drop', (e) => {
    e.preventDefault()
    el.classList.remove('dragover')
    if (state.busy) return
    const f = e.dataTransfer.files && e.dataTransfer.files[0]
    takeVideoFile(f)
  })
}

function moveLine(e) {
  if (state.busy || state.shape === 'free') return
  const box = videoBox()
  if (box.width < 1) return
  let p
  if (state.shape === 'h' || state.shape === 'sine') {
    p = (e.clientY - box.top) / box.height
  } else {
    // v, diag, adiag — primarily horizontal control
    p = (e.clientX - box.left) / box.width
  }
  state.linePos = Math.max(0, Math.min(1, p))
  render()
}

function handleKey(e) {
  if (state.busy || state.shape === 'free') return
  const step = e.shiftKey ? 0.1 : 0.01
  let p = state.linePos
  if (state.shape === 'h' || state.shape === 'sine') {
    if (e.key === 'ArrowUp') p -= step
    else if (e.key === 'ArrowDown') p += step
    else if (e.key === 'Home') p = 0
    else if (e.key === 'End') p = 1
    else return
  } else {
    if (e.key === 'ArrowLeft') p -= step
    else if (e.key === 'ArrowRight') p += step
    else if (e.key === 'Home') p = 0
    else if (e.key === 'End') p = 1
    else return
  }
  e.preventDefault()
  state.linePos = Math.max(0, Math.min(1, p))
  render()
}

$file.addEventListener('change', (e) => {
  const f = e.target.files[0]
  if (f) takeVideoFile(f)
  e.target.value = ''
})

for (const z of dropzones) bindDropzone(z)

$stage.addEventListener('pointerdown', (e) => {
  if (state.busy || !state.objectUrl) return
  e.currentTarget.setPointerCapture(e.pointerId)
  if (state.shape === 'free') {
    const p = pointerToNorm(e)
    if (!p) return
    state.drawing = true
    state.freePath = [p]
    render()
    return
  }
  moveLine(e)
})

$stage.addEventListener('pointermove', (e) => {
  if (state.busy || e.buttons !== 1) return
  if (state.shape === 'free' && state.drawing) {
    const p = pointerToNorm(e)
    if (!p) return
    const last = state.freePath[state.freePath.length - 1]
    if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 0.004) {
      state.freePath.push(p)
      drawOverlay()
    }
    return
  }
  moveLine(e)
})

$stage.addEventListener('pointerup', () => {
  if (state.drawing) {
    state.drawing = false
    if (state.freePath.length < 2) {
      state.freePath = DEFAULT_FREE.map((p) => ({ ...p }))
    }
    render()
  }
})

$stage.addEventListener('keydown', handleKey)

for (const b of shapeBtns) {
  b.addEventListener('click', () => {
    state.shape = b.dataset.shape
    state.flow = clampFlow(state.shape, state.flow)
    engineRef = null
    render()
  })
}
for (const b of flowBtns) {
  b.addEventListener('click', () => {
    state.flow = b.dataset.flow
    engineRef = null
    render()
  })
}
for (const b of fmtBtns) {
  b.addEventListener('click', () => {
    if (!fmtSupported(b.dataset.fmt)) return
    state.exportFmt = b.dataset.fmt
    render()
  })
}
for (const b of qualityBtns) {
  b.addEventListener('click', () => {
    state.quality = b.dataset.quality || 'full'
    engineRef = null
    render()
  })
}

$clearpath.addEventListener('click', () => {
  state.freePath = DEFAULT_FREE.map((p) => ({ ...p }))
  render()
})

$live.addEventListener('click', () => { if (!state.busy) startLive() })
$oneshot.addEventListener('click', runOneShot)
$stop.addEventListener('click', stopCapture)
$reset.addEventListener('click', () => reset(false))

$video.addEventListener('loadedmetadata', () => {
  state.meta = { duration: $video.duration }
  syncStageAspect()
  render()
  ensureFps().then(() => { if (state.objectUrl) render() })
})

$video.addEventListener('loadeddata', () => {
  syncStageAspect()
  drawOverlay()
})

$video.addEventListener('error', () => {
  if (!state.objectUrl) return
  setStageFail(t('msg_video_error'))
  setMsg(t('msg_video_error'))
})

window.addEventListener('langchange', () => { render() })
window.addEventListener('resize', () => { if (state.objectUrl) drawOverlay() })
window.addEventListener('themechange', () => { if (state.objectUrl) drawOverlay() })

render()
