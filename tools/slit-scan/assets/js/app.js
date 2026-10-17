// SlitScan — vanilla ESM instrument on the shared tools shell.
import {
  buildPath,
  isStraight,
  linePosAt,
  lineKeys,
  planCapture,
  renderSpeed,
  captureVideo,
  composeStill,
} from './slitScan.js'
import { detectVideoRate, resolveDuration, abortError, isAbort } from './playback.js'
import {
  IMAGE_FMTS,
  VIDEO_FMTS,
  PROJECT_FMTS,
  fmtSupported,
  firstSupportedFmt,
  encodersReady,
  exportImage,
  exportVideo,
  exportProject,
  triggerDownload,
} from './exporters.js'
import {
  probeMediaFile,
  browserCanPlayCodec,
  isHevc,
  paintFirstFrame,
  videoHasPicture,
} from './mediaProbe.js'
import { videoMemory, RING_BYTES } from './slitVideo.js'

const $ = (sel) => document.querySelector(sel)
const $$ = (sel) => [...document.querySelectorAll(sel)]
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
const $videowrap = $('[data-videowrap]')
const $vmodehint = $('[data-vmodehint]')
const $stagePanel = $('.stage-panel')

const shapeBtns = $$('[data-shape]')
const flowBtns = $$('[data-flow]')
const fmtBtns = $$('[data-fmt]')
const qualityBtns = $$('[data-quality]')
const vmodeBtns = $$('[data-vmode]')
const lagBtns = $$('[data-lag]')
const vscaleBtns = $$('[data-vscale]')
const $keep = $('[data-keep]')
const fitBtns = $$('[data-fit]')
const $spanwrap = $('[data-spanwrap]')

const SHAPE_LABEL = {
  v: ['shape_v', 'shape_v_aria'],
  h: ['shape_h', 'shape_h_aria'],
  diag: ['shape_diag', 'shape_diag_aria'],
  adiag: ['shape_adiag', 'shape_adiag_aria'],
  sine: ['shape_sine', 'shape_sine_aria'],
  free: ['shape_free', 'shape_free'],
}

const VIDEO_EXTS = new Set([
  'mp4', 'm4v', 'webm', 'mov', 'mkv', 'avi', 'ogv', 'ogg',
  '3gp', '3g2', 'wmv', 'flv', 'ts', 'mts', 'm2ts', 'asf', 'mpg', 'mpeg',
])

const defaultFree = () => [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }]

const state = {
  objectUrl: null,
  fileName: null,
  sourceFile: null,
  shape: 'v',
  flow: 'lr',
  linePos: 0.5,
  freePath: defaultFree(),
  quality: 'full',
  exportFmt: firstSupportedFmt(),
  videoMode: 'scroll', // 'scroll' | 'displace'
  videoScale: '1', // video output size vs source: '1' | '0.5' | '0.25'
  fit: 'fit', // 'fit' the scan into the frame | 'grow' one pixel per frame
  keepSource: false, // keep the untouched video behind the slit
  span: 'all', // time one video frame covers along the flow axis: seconds or 'all'
  fps: 30,
  fpsReady: false,
  busy: null, // null | 'live' | 'render' | 'export'
  progress: 0,
  outSize: null, // { w, h } once an output exists
  dragging: false,
}

let run = null // AbortController for the capture / export in flight
let gen = 0 // bumps per source so stale async work bails
let fpsProbe = null
let toastTimer = null

function currentParams() {
  return {
    shape: state.shape,
    flow: state.flow,
    linePos: state.linePos,
    freePath: state.freePath,
  }
}

function setMsg(m) {
  clearTimeout(toastTimer)
  $toast.textContent = m || ''
  $toast.hidden = !m
  if (m) toastTimer = setTimeout(() => { $toast.hidden = true }, 2800)
}

function setStageFail(msg) {
  $stageFail.textContent = msg || ''
  $stageFail.hidden = !msg
}

function syncStageAspect() {
  const vw = $video.videoWidth
  const vh = $video.videoHeight
  if (vw > 0 && vh > 0) $stage.style.setProperty('--stage-aspect', `${vw} / ${vh}`)
  else $stage.style.removeProperty('--stage-aspect')
}

// ---- stage geometry & overlay ----

function videoBox() {
  const vr = $video.getBoundingClientRect()
  if (vr.width >= 2 && vr.height >= 2) return vr
  const rect = $stage.getBoundingClientRect()
  const vw = $video.videoWidth || 16
  const vh = $video.videoHeight || 9
  const s = Math.min(rect.width / vw, rect.height / vh)
  return {
    left: rect.left + (rect.width - vw * s) / 2,
    top: rect.top + (rect.height - vh * s) / 2,
    width: vw * s,
    height: vh * s,
  }
}

function pointerToNorm(e, clampToFrame) {
  const box = videoBox()
  if (box.width < 1 || box.height < 1) return null
  let x = (e.clientX - box.left) / box.width
  let y = (e.clientY - box.top) / box.height
  if (clampToFrame) {
    x = Math.max(0, Math.min(1, x))
    y = Math.max(0, Math.min(1, y))
  } else if (x < 0 || x > 1 || y < 0 || y > 1) {
    return null
  }
  return { x, y }
}

function drawOverlay() {
  if ($stage.hidden) return
  const rect = $stage.getBoundingClientRect()
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const cssW = Math.max(1, Math.round(rect.width))
  const cssH = Math.max(1, Math.round(rect.height))
  if ($pathov.width !== Math.round(cssW * dpr) || $pathov.height !== Math.round(cssH * dpr)) {
    $pathov.width = Math.round(cssW * dpr)
    $pathov.height = Math.round(cssH * dpr)
  }
  const ctx = $pathov.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssW, cssH)

  const box = videoBox()
  const ox = box.left - rect.left
  const oy = box.top - rect.top
  const n = isStraight(state.shape) ? 2 : 256
  const path = buildPath(currentParams(), n)
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#fe8019'
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

// ---- render ----

function setPressed(btns, key, value) {
  for (const b of btns) {
    const on = b.dataset[key] === value
    b.classList.toggle('on', on)
    b.setAttribute('aria-pressed', String(on))
  }
}

function paintProgress() {
  const p = Math.max(0, Math.min(1, state.progress))
  $progress.hidden = !state.busy
  $progress.setAttribute('aria-valuenow', String(Math.round(p * 100)))
  $bar.style.transform = `scaleX(${p})`
}

function setProgress(p) {
  if (Math.round(p * 100) === Math.round(state.progress * 100)) return
  state.progress = p
  paintProgress()
}

function render() {
  const hasSrc = !!state.objectUrl
  const busy = !!state.busy
  const locked = !hasSrc || busy
  const free = state.shape === 'free'

  $srcname.hidden = !hasSrc
  $srcname.textContent = state.fileName || ''
  $filelabel.textContent = state.fileName ? t('loaded', { name: state.fileName }) : t('drop')
  $stage.hidden = !hasSrc
  $empty.hidden = hasSrc
  $stage.classList.toggle('drawing', free)
  $drawhint.hidden = !free
  $drawrow.hidden = !free

  setPressed(shapeBtns, 'shape', state.shape)
  for (const b of shapeBtns) b.setAttribute('aria-label', t(SHAPE_LABEL[b.dataset.shape][1]))
  setPressed(flowBtns, 'flow', state.flow)
  setPressed(qualityBtns, 'quality', state.quality)
  if (!fmtSupported(state.exportFmt)) state.exportFmt = firstSupportedFmt()
  setPressed(fmtBtns, 'fmt', state.exportFmt)
  for (const b of fmtBtns) {
    b.hidden = !fmtSupported(b.dataset.fmt)
    b.disabled = busy
  }
  $videowrap.hidden = !VIDEO_FMTS.has(state.exportFmt)
  setPressed(vmodeBtns, 'vmode', state.videoMode)
  setPressed(lagBtns, 'lag', state.span)
  setPressed(vscaleBtns, 'vscale', state.videoScale)
  for (const b of [...vmodeBtns, ...lagBtns, ...vscaleBtns]) b.disabled = busy
  $vmodehint.textContent = t(state.videoMode === 'scroll' ? 'mode_scroll_hint' : 'mode_displace_hint')
  for (const b of [...shapeBtns, ...flowBtns, ...qualityBtns]) b.disabled = locked
  $keep.disabled = locked
  $keep.classList.toggle('on', state.keepSource)
  $keep.setAttribute('aria-pressed', String(state.keepSource))
  setPressed(fitBtns, 'fit', state.fit)
  for (const b of fitBtns) b.disabled = locked
  // Span only shapes a fitted scroll and displace; unfitted scroll is 1 px per frame.
  $spanwrap.hidden = state.videoMode === 'scroll' && state.fit !== 'fit'

  $clearpath.disabled = locked
  $reset.disabled = locked
  $file.disabled = busy
  $live.disabled = locked
  $oneshot.disabled = locked
  $oneshot.textContent = t(state.busy === 'render' || state.busy === 'export' ? 'go_oneshot_busy' : 'go_oneshot')
  $stop.disabled = !busy

  const shapeKey = SHAPE_LABEL[state.shape][0]
  $direction.textContent = `${t(shapeKey)} · ${t('flow_' + state.flow)}`

  $out.hidden = !state.outSize
  $out.classList.toggle('live', state.busy === 'live' || state.busy === 'render')
  $outputbed.hidden = !!state.outSize
  paintProgress()
  $stagePanel.setAttribute('aria-busy', busy ? 'true' : 'false')

  $meta.hidden = !hasSrc
  const line = free
    ? t('meta_free', { n: state.freePath.length })
    : t('meta', { pct: Math.round(state.linePos * 100) + '%' })
  $meta.textContent = state.outSize
    ? `${line} · ${t('meta_size', { w: state.outSize.w, h: state.outSize.h })}`
    : line

  drawOverlay()
}

// ---- capture ----

function ensureFps() {
  if (state.fpsReady || !state.objectUrl) return Promise.resolve(state.fps)
  if (!fpsProbe) {
    const g = gen
    fpsProbe = detectVideoRate(state.objectUrl)
      .then((fps) => {
        if (g === gen) {
          state.fps = fps
          state.fpsReady = true
        }
        return fps
      })
      .finally(() => { if (g === gen) fpsProbe = null })
  }
  return fpsProbe
}

function abortRun() {
  if (run) run.abort()
  run = null
  state.busy = null
}

function clearOutput() {
  $out.width = 4
  $out.height = 4
  state.outSize = null
  state.progress = 0
}

/** kind 'live' plays at 1× so you can watch; 'render' runs fast, then exports. */
async function startCapture(kind) {
  if (state.busy || !state.objectUrl) return
  if (state.shape === 'free' && state.freePath.length < 2) {
    setMsg(t('msg_need_path'))
    return
  }
  if (!$video.videoWidth) {
    setMsg(t('msg_no_frame'))
    return
  }
  const ac = new AbortController()
  run = ac
  state.busy = kind
  state.progress = 0
  render()

  try {
    await ensureFps()
    const duration = await resolveDuration($video)
    if (ac.signal.aborted) throw abortError()
    if (!duration) throw new Error('unknown duration')
    if (kind === 'render' && VIDEO_FMTS.has(state.exportFmt)) {
      state.busy = 'export'
      render()
      await shipVideo(ac.signal)
      return
    }
    const params = currentParams()
    const plan = planCapture({
      duration,
      fps: state.fps,
      vw: $video.videoWidth,
      vh: $video.videoHeight,
      shape: params.shape,
      quality: state.quality,
    })
    await captureVideo({
      video: $video,
      params,
      plan,
      speed: kind === 'live' ? 1 : renderSpeed(plan),
      output: $out,
      signal: ac.signal,
      onStart: (size) => { state.outSize = size; render() },
      onProgress: setProgress,
    })
    composeOutput(params)
    if (kind === 'live') {
      setMsg(t('msg_done'))
      return
    }
    state.busy = 'export'
    state.progress = 0
    render()
    await ship(ac.signal)
  } catch (err) {
    if (run !== ac) return
    if (isAbort(err)) setMsg(t('msg_stopped'))
    else setMsg(t('msg_fail', { err: err.message || 'error' }))
  } finally {
    if (run === ac) {
      run = null
      state.busy = null
      render()
    }
  }
}

async function ship(signal) {
  const fmt = state.exportFmt
  if (!fmtSupported(fmt)) {
    setMsg(t('fmt_unsupported', { fmt }))
    return
  }
  let result
  if (IMAGE_FMTS.has(fmt)) {
    result = await exportImage($out, fmt)
  } else if (PROJECT_FMTS.has(fmt)) {
    setMsg(t('msg_packaging'))
    result = await exportProject({
      kind: fmt,
      output: $out,
      video: $video,
      sourceFile: state.sourceFile,
      sourceName: state.fileName,
      fps: state.fps,
    })
  }
  if (signal.aborted) throw abortError()
  triggerDownload(result.blob, result.filename)
  setMsg(t(PROJECT_FMTS.has(fmt) ? 'msg_exported_project' : 'msg_exported', { fmt }))
}

/** Swap the bare still for the kept / fitted composition when one applies. */
function composeOutput(params) {
  const kept = composeStill($video, $out, params, { keep: state.keepSource, fit: state.fit === 'fit' })
  if (!kept) return
  $out.width = kept.width
  $out.height = kept.height
  $out.getContext('2d').drawImage(kept, 0, 0)
  state.outSize = { w: kept.width, h: kept.height }
  render()
}

async function shipVideo(signal) {
  const fmt = state.exportFmt
  const settings = {
    video: $video,
    mode: state.videoMode,
    span: state.span,
    scale: Number(state.videoScale),
    fps: state.fps,
  }
  const need = videoMemory(settings)
  if (need > RING_BYTES) {
    setMsg(t('msg_too_big', { gb: (need / 2 ** 30).toFixed(1) }))
    return
  }
  setMsg(t('msg_exporting', { fmt }))
  const result = await exportVideo({
    video: $video,
    params: currentParams(),
    scale: Number(state.videoScale),
    mode: state.videoMode,
    span: state.span,
    keep: state.keepSource,
    fit: state.fit === 'fit',
    fmt,
    fps: state.fps,
    preview: $out,
    signal,
    onStart: (size) => { state.outSize = size; render() },
    onProgress: setProgress,
  })
  if (signal.aborted) throw abortError()
  triggerDownload(result.blob, result.filename)
  setMsg(t('msg_exported', { fmt }))
}

function reset() {
  abortRun()
  $video.pause()
  clearOutput()
  setMsg(t('msg_reset'))
  render()
}

// ---- source ----

function isLikelyVideo(file) {
  if (file.type && file.type.startsWith('video/')) return true
  const m = String(file.name || '').toLowerCase().match(/\.([a-z0-9]+)$/)
  return !!m && VIDEO_EXTS.has(m[1])
}

function takeVideoFile(file) {
  if (!file || state.busy) return
  if (!isLikelyVideo(file)) {
    setMsg(t('msg_bad_file'))
    return
  }
  // Chrome plays most .mov / untyped files once they are labelled mp4.
  const type = file.type && file.type !== 'video/quicktime' ? file.type : 'video/mp4'
  const blob = type === file.type ? file : new Blob([file], { type })
  loadSource(URL.createObjectURL(blob), file)
}

function loadSource(url, file) {
  abortRun()
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl)
  gen += 1
  fpsProbe = null
  state.objectUrl = url
  state.fileName = file.name
  state.sourceFile = file
  state.fps = 30
  state.fpsReady = false
  clearOutput()
  setStageFail('')
  $stage.style.removeProperty('--stage-aspect')
  $video.src = url
  $video.load()
  render()
  preparePreview(file, gen)
}

async function preparePreview(file, g) {
  let probe = { codec: null }
  try { probe = await probeMediaFile(file) } catch (_) {}
  if (g !== gen) return

  if (probe.codec && !browserCanPlayCodec(probe.codec)) {
    const msg = isHevc(probe.codec) ? t('msg_hevc') : t('msg_video_error')
    setStageFail(msg)
    setMsg(msg)
    return
  }

  try { await paintFirstFrame($video) } catch (_) {}
  if (g !== gen) return
  syncStageAspect()
  render()

  if (!$video.videoWidth) {
    setStageFail(t('msg_no_frame'))
    return
  }
  // A black first frame is normal (fade-ins); only undecodable HEVC is all black.
  if (isHevc(probe.codec) && !videoHasPicture($video)) {
    setStageFail(t('msg_hevc'))
    setMsg(t('msg_hevc'))
    return
  }
  ensureFps()
}

function bindDropzone(el) {
  const on = (e) => {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
    el.classList.add('dragover')
  }
  el.addEventListener('dragenter', on)
  el.addEventListener('dragover', on)
  el.addEventListener('dragleave', (e) => {
    if (!el.contains(e.relatedTarget)) el.classList.remove('dragover')
  })
  el.addEventListener('drop', (e) => {
    e.preventDefault()
    el.classList.remove('dragover')
    takeVideoFile(e.dataTransfer.files && e.dataTransfer.files[0])
  })
}

// ---- line editing ----

function endDrag() {
  if (!state.dragging) return
  state.dragging = false
  if (state.shape === 'free' && state.freePath.length < 2) state.freePath = defaultFree()
  render()
}

$stage.addEventListener('pointerdown', (e) => {
  if (state.busy || !state.objectUrl || e.button !== 0) return
  const p = pointerToNorm(e, false)
  if (!p) return
  $stage.setPointerCapture(e.pointerId)
  state.dragging = true
  if (state.shape === 'free') state.freePath = [p]
  else state.linePos = linePosAt(state.shape, p.x, p.y)
  render()
})

$stage.addEventListener('pointermove', (e) => {
  if (!state.dragging || state.busy) return
  const p = pointerToNorm(e, true)
  if (!p) return
  if (state.shape !== 'free') {
    state.linePos = linePosAt(state.shape, p.x, p.y)
    render()
    return
  }
  const last = state.freePath[state.freePath.length - 1]
  if (Math.hypot(p.x - last.x, p.y - last.y) > 0.004) {
    state.freePath.push(p)
    drawOverlay()
  }
})

$stage.addEventListener('pointerup', endDrag)
$stage.addEventListener('pointercancel', endDrag)

$stage.addEventListener('keydown', (e) => {
  if (state.busy || !state.objectUrl || state.shape === 'free') return
  const [dec, inc] = lineKeys(state.shape)
  const step = e.shiftKey ? 0.1 : 0.01
  let p = state.linePos
  if (e.key === dec) p -= step
  else if (e.key === inc) p += step
  else if (e.key === 'Home') p = 0
  else if (e.key === 'End') p = 1
  else return
  e.preventDefault()
  state.linePos = Math.max(0, Math.min(1, p))
  render()
})

// ---- wiring ----

$file.addEventListener('change', (e) => {
  takeVideoFile(e.target.files[0])
  e.target.value = ''
})
for (const z of $$('[data-dropzone]')) bindDropzone(z)

for (const b of shapeBtns) b.addEventListener('click', () => { state.shape = b.dataset.shape; render() })
for (const b of flowBtns) b.addEventListener('click', () => { state.flow = b.dataset.flow; render() })
for (const b of qualityBtns) b.addEventListener('click', () => { state.quality = b.dataset.quality; render() })
for (const b of vmodeBtns) b.addEventListener('click', () => { state.videoMode = b.dataset.vmode; render() })
for (const b of lagBtns) b.addEventListener('click', () => { state.span = b.dataset.lag; render() })
for (const b of vscaleBtns) b.addEventListener('click', () => { state.videoScale = b.dataset.vscale; render() })
for (const b of fitBtns) b.addEventListener('click', () => { state.fit = b.dataset.fit; render() })
$keep.addEventListener('click', () => { state.keepSource = !state.keepSource; render() })
for (const b of fmtBtns) {
  b.addEventListener('click', () => {
    if (fmtSupported(b.dataset.fmt)) state.exportFmt = b.dataset.fmt
    render()
  })
}

$clearpath.addEventListener('click', () => { state.freePath = defaultFree(); render() })
$live.addEventListener('click', () => startCapture('live'))
$oneshot.addEventListener('click', () => startCapture('render'))
$stop.addEventListener('click', () => { if (run) run.abort() })
$reset.addEventListener('click', reset)

$video.addEventListener('loadedmetadata', () => { syncStageAspect(); render() })
$video.addEventListener('loadeddata', drawOverlay)
$video.addEventListener('error', () => {
  if (!state.objectUrl) return
  setStageFail(t('msg_video_error'))
  setMsg(t('msg_video_error'))
})

window.addEventListener('langchange', render)
window.addEventListener('themechange', drawOverlay)
window.addEventListener('resize', drawOverlay)
new ResizeObserver(drawOverlay).observe($stage)

render()
encodersReady.then(render)
