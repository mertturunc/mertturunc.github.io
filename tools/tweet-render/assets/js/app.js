import { extractTweetId, fetchTweet } from './tweet.js'
import { FIGURE_WIDTH, buildCard, applyCardFrame, parseRatio } from './card.js'
import { captureCard, canvasToPngBlob, exportSize } from './capture.js'

const $ = (sel) => document.querySelector(sel)
const t = (key, vars) => (typeof window.toolT === 'function' ? window.toolT(key, vars) : key)

const $url = $('#tweet-url')
const $render = $('[data-render]')
const $download = $('[data-download]')
const $clear = $('[data-clear]')
const $custom = $('[data-custom-ratio]')
const $ratioW = $('[data-ratio-w]')
const $ratioH = $('[data-ratio-h]')
const $empty = $('[data-empty]')
const $stage = $('[data-stage]')
const $fit = $('[data-fit]')
const $srcname = $('[data-srcname]')
const $status = $('[data-status]')
const $toast = $('[data-toast]')
const $dpr = $('[data-dpr]')
const $dprVal = $('[data-dprval]')
const $dprCap = $('[data-dpr-cap]')
const $mediaKnobs = $('[data-media-knobs]')
const $placeKnobs = $('[data-place-knobs]')
const ratioInputs = [...document.querySelectorAll('input[name="tweet-ratio"]')]
const mediaInputs = [...document.querySelectorAll('input[name="tweet-media"]')]
const placeInputs = [...document.querySelectorAll('input[name="tweet-place"]')]

const state = {
  tweet: null,
  width: FIGURE_WIDTH,
  dpr: 1,
  ratioKey: 'auto',
  customW: 16,
  customH: 9,
  media: 'fill',
  place: 'center',
  busy: false,
}

let toastTimer = 0

function lang() {
  return document.documentElement.getAttribute('data-lang') === 'tr' ? 'tr' : 'en'
}

function currentRatio() {
  return parseRatio(state.ratioKey, state.customW, state.customH)
}

function setStatus(msg, isError) {
  if (!msg) {
    $status.hidden = true
    $status.textContent = ''
    $status.classList.remove('error')
    $url.removeAttribute('aria-invalid')
    return
  }
  $status.hidden = false
  $status.textContent = msg
  $status.classList.toggle('error', !!isError)
  if (isError) $url.setAttribute('aria-invalid', 'true')
  else $url.removeAttribute('aria-invalid')
}

function toast(msg, isError) {
  $toast.hidden = false
  $toast.textContent = msg
  $toast.classList.toggle('error', !!isError)
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    $toast.hidden = true
  }, 4200)
}

function errorCopy(err) {
  const code = err && err.code
  if (code === 'bad-id') return t('err_bad_id')
  if (code === 'not-found') return t('err_not_found')
  return t('err_fetch', { err: (err && err.message) || 'error' })
}

function fitCard() {
  const card = $fit.querySelector('.card')
  if (!card || $stage.hidden) return
  card.style.zoom = '1'
  card.style.transform = 'none'
  const avail = Math.max(120, $stage.clientWidth - 24)
  const w = state.width
  const scale = Math.min(1, avail / w)
  card.style.transformOrigin = '0 0'
  card.style.transform = scale < 0.999 ? `scale(${scale})` : 'none'
  const h = card.offsetHeight
  $fit.style.width = `${Math.round(w * scale)}px`
  $fit.style.height = `${Math.round(h * scale)}px`
  $fit.style.overflow = 'hidden'
  if (state.tweet) {
    const out = exportSize(w, h, state.dpr)
    setStatus(t('ready', { w, h: Math.round(h), dpr: state.dpr, ew: out.width, eh: out.height }))
    refreshDprLabel()
  }
}

function mountCard() {
  $fit.replaceChildren()
  if (!state.tweet) {
    $empty.hidden = false
    $stage.hidden = true
    $srcname.hidden = true
    $download.disabled = true
    $clear.disabled = true
    refreshDprLabel()
    syncMediaKnobs()
    return
  }
  const card = buildCard(state.tweet, {
    lang: lang(),
    t,
    ratio: currentRatio(),
    media: state.media,
    place: state.place,
  })
  $fit.append(card)
  $empty.hidden = true
  $stage.hidden = false
  $srcname.hidden = false
  $srcname.textContent = `@${state.tweet.author.handle}`
  $download.disabled = false
  $clear.disabled = false
  requestAnimationFrame(fitCard)
  syncMediaKnobs()
}

function setBusy(busy) {
  state.busy = busy
  $render.disabled = busy
  $download.disabled = busy || !state.tweet
  $clear.disabled = busy || !state.tweet
  $url.disabled = busy
}

async function doRender() {
  const raw = $url.value.trim()
  if (!raw) {
    setStatus(t('err_need_url'), true)
    toast(t('err_need_url'), true)
    return
  }
  if (!extractTweetId(raw)) {
    setStatus(t('err_bad_id'), true)
    toast(t('err_bad_id'), true)
    return
  }
  setBusy(true)
  setStatus(t('fetching'))
  try {
    state.tweet = await fetchTweet(raw)
    mountCard()
    toast(t('msg_ready'))
  } catch (err) {
    setStatus(errorCopy(err), true)
    toast(errorCopy(err), true)
  } finally {
    setBusy(false)
  }
}

async function doDownload() {
  const card = $fit.querySelector('.card')
  if (!card || !state.tweet) return
  setBusy(true)
  setStatus(t('exporting', { dpr: state.dpr }))
  try {
    const canvas = await captureCard(card, { width: state.width, dpr: state.dpr })
    const blob = await canvasToPngBlob(canvas)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `tweet-${state.tweet.author.handle || 'render'}-${state.tweet.id}.png`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 4000)
    setStatus(t('downloaded', { w: canvas.width, h: canvas.height }))
    toast(t('msg_downloaded'))
  } catch (err) {
    const msg = t('err_export', { err: (err && err.message) || 'error' })
    setStatus(msg, true)
    toast(msg, true)
  } finally {
    setBusy(false)
  }
}

function clearAll() {
  state.tweet = null
  mountCard()
  setStatus('')
}

function cardHeight() {
  const card = $fit.querySelector('.card')
  return card && !$stage.hidden ? card.offsetHeight : 0
}

function refreshDprLabel() {
  const n = state.dpr
  const h = cardHeight()
  const out = exportSize(state.width, h || Math.round(state.width * 0.75), n)
  if ($dprVal) {
    $dprVal.textContent = h ? `${n}× · ${out.width}×${out.height}` : `${n}× · ${out.width}px`
  }
  if ($dprCap) $dprCap.hidden = !out.clamped
}

function setDpr(n) {
  const dpr = Math.max(1, Math.min(8, Math.round(n) || 1))
  state.dpr = dpr
  if ($dpr) $dpr.value = String(dpr)
  refreshDprLabel()
  if (state.tweet) {
    const h = cardHeight()
    const out = exportSize(state.width, h, state.dpr)
    setStatus(t('ready', { w: state.width, h: Math.round(h), dpr: state.dpr, ew: out.width, eh: out.height }))
  }
}

function frameOpts() {
  return { ratio: currentRatio(), media: state.media, place: state.place }
}

function tweetHasMedia() {
  const tweet = state.tweet
  return !!(tweet?.photos?.length || tweet?.video)
}

function syncMediaKnobs() {
  const framed = !!currentRatio() && tweetHasMedia()
  const filling = framed && state.media === 'fill'
  if ($mediaKnobs) $mediaKnobs.hidden = !framed
  if ($placeKnobs) $placeKnobs.hidden = !filling
  for (const input of mediaInputs) input.disabled = !framed
  for (const input of placeInputs) input.disabled = !filling
}

function applyLiveFrame() {
  const card = $fit.querySelector('.card')
  if (!card || !state.tweet) {
    refreshDprLabel()
    return
  }
  applyCardFrame(card, frameOpts())
  syncMediaKnobs()
  fitCard()
}

function setRatio(key) {
  state.ratioKey = key
  if ($custom) $custom.hidden = key !== 'custom'
  for (const input of ratioInputs) {
    input.checked = input.value === key
  }
  syncMediaKnobs()
  applyLiveFrame()
}

function setMedia(key) {
  state.media = key === 'fit' ? 'fit' : 'fill'
  for (const input of mediaInputs) input.checked = input.value === state.media
  syncMediaKnobs()
  applyLiveFrame()
}

function setPlace(key) {
  state.place = key === 'top' || key === 'bottom' ? key : 'center'
  for (const input of placeInputs) input.checked = input.value === state.place
  applyLiveFrame()
}

$dpr?.addEventListener('input', () => setDpr(Number($dpr.value) || 1))

for (const input of ratioInputs) {
  input.addEventListener('change', () => setRatio(input.value || 'auto'))
}
for (const input of mediaInputs) {
  input.addEventListener('change', () => setMedia(input.value || 'fill'))
}
for (const input of placeInputs) {
  input.addEventListener('change', () => setPlace(input.value || 'center'))
}

function onCustomRatio() {
  state.customW = Number($ratioW.value) || 16
  state.customH = Number($ratioH.value) || 9
  if (state.ratioKey === 'custom' && state.tweet) {
    const card = $fit.querySelector('.card')
    if (card) {
      applyCardFrame(card, frameOpts())
      fitCard()
    }
  }
}

$ratioW?.addEventListener('input', onCustomRatio)
$ratioH?.addEventListener('input', onCustomRatio)

$render.addEventListener('click', () => {
  if (!state.busy) doRender()
})

$url.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    if (!state.busy) doRender()
  }
})

$download.addEventListener('click', () => {
  if (!state.busy) doDownload()
})

$clear.addEventListener('click', () => {
  if (!state.busy) clearAll()
})

window.addEventListener('resize', fitCard)
window.addEventListener('langchange', () => {
  if (state.tweet) mountCard()
})
window.addEventListener('themechange', () => {
  requestAnimationFrame(fitCard)
})

try {
  const q = new URLSearchParams(location.search).get('url')
  if (q) {
    $url.value = q
    doRender()
  }
} catch (_) {}

syncMediaKnobs()
mountCard()
