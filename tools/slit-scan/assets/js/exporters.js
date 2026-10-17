// Exports: a still of the slit-scan, a slit-scan video (WebCodecs + a
// muxer, frame-exact timestamps), or an Adobe project package.

import { streamSlitVideo, videoOutputSize } from './slitVideo.js'
import { buildProjectZip } from './projectExport.js'

export const IMAGE_FMTS = new Set(['png', 'jpg', 'webp'])
export const VIDEO_FMTS = new Set(['webm', 'mp4'])
export const PROJECT_FMTS = new Set(['ae', 'pr'])

const IMAGE_MIME = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp' }

const MUXER_URL = {
  mp4: 'https://unpkg.com/mp4-muxer@5.2.2/build/mp4-muxer.mjs',
  webm: 'https://unpkg.com/webm-muxer@5.1.4/build/webm-muxer.mjs',
}
// [WebCodecs codec, muxer codec], best first.
const CODECS = {
  mp4: [['avc1.640034', 'avc'], ['avc1.4d0034', 'avc'], ['avc1.42003e', 'avc'], ['avc1.42001f', 'avc']],
  webm: [['vp09.00.40.08', 'V_VP9'], ['vp8', 'V_VP8']],
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

const WEBP_OK = canEncodeWebp()
const videoOk = { mp4: false, webm: false }

async function pickCodec(fmt, width, height, fps) {
  if (typeof VideoEncoder === 'undefined') return null
  for (const [codec, muxCodec] of CODECS[fmt]) {
    const config = {
      codec,
      width,
      height,
      framerate: fps,
      bitrate: Math.round(Math.min(60e6, Math.max(2e6, width * height * fps * 0.25))),
      ...(fmt === 'mp4' ? { avc: { format: 'avc' } } : {}),
    }
    try {
      const res = await VideoEncoder.isConfigSupported(config)
      if (res.supported) return { config, muxCodec }
    } catch (_) {}
  }
  return null
}

/** Resolves once video encoder support is known; re-render after it. */
export const encodersReady = Promise.all(
  ['mp4', 'webm'].map(async (fmt) => { videoOk[fmt] = !!(await pickCodec(fmt, 1280, 720, 30)) }),
)

export function fmtSupported(fmt) {
  if (fmt === 'png' || fmt === 'jpg' || PROJECT_FMTS.has(fmt)) return true
  if (fmt === 'webp') return WEBP_OK
  if (VIDEO_FMTS.has(fmt)) return videoOk[fmt]
  return false
}

export function firstSupportedFmt() {
  return ['png', 'jpg', 'webp'].find(fmtSupported) || 'png'
}

export function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('encode'))), mime, quality)
    } catch (err) {
      reject(err)
    }
  })
}

export function triggerDownload(blob, filename) {
  const a = document.createElement('a')
  a.download = filename
  a.href = URL.createObjectURL(blob)
  document.body.appendChild(a)
  a.click()
  setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href) }, 10000)
}

export async function exportImage(output, fmt) {
  const blob = await canvasToBlob(output, IMAGE_MIME[fmt], fmt === 'png' ? undefined : 0.92)
  return { blob, filename: `slitscan.${fmt}` }
}

/**
 * Slit-scan video, encoded while the clip plays once (see slitVideo.js):
 *   mode 'scroll' | 'displace', `span` seconds or 'all', `keep` the source
 *   behind the slit, `fit` the scroll into the frame (else 1 px per frame),
 *   `scale` 1 | 0.5 | 0.25 of the source size.
 * Timestamps come from the frame index, so the file is frame-exact even when
 * playback slows down to keep up. `preview` mirrors frames as they encode.
 */
export async function exportVideo({ video, params, mode, span, keep, fit, scale, fmt, fps, preview, signal, onStart, onProgress }) {
  if (typeof VideoEncoder === 'undefined') throw new Error(`${fmt} encoder unavailable`)
  const { width, height } = videoOutputSize({ video, mode, span, keep, fit, scale, fps, params })
  const pick = await pickCodec(fmt, width, height, fps)
  if (!pick) throw new Error(`${fmt} can't encode ${width}×${height}`)
  const { Muxer, ArrayBufferTarget } = await import(MUXER_URL[fmt])
  const target = new ArrayBufferTarget()
  const muxer = new Muxer({
    target,
    video: { codec: pick.muxCodec, width, height, frameRate: fps },
    firstTimestampBehavior: 'offset',
    ...(fmt === 'mp4' ? { fastStart: 'in-memory' } : {}),
  })
  let encodeError = null
  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (err) => { encodeError = err },
  })
  encoder.configure(pick.config)

  preview.width = width
  preview.height = height
  const pctx = preview.getContext('2d')
  if (onStart) onStart({ w: width, h: height })

  const frameUs = 1e6 / fps
  const keyEvery = Math.max(1, Math.round(fps * 2))
  let lastPaint = 0
  try {
    await streamSlitVideo({
      video,
      params,
      mode,
      span,
      keep,
      fit,
      scale,
      fps,
      signal,
      encoderBusy: () => encoder.encodeQueueSize > 6,
      onProgress,
      onFrame: (pixels, T) => {
        if (encodeError) throw encodeError
        const bytes = new Uint8ClampedArray(pixels.buffer)
        const frame = new VideoFrame(bytes, {
          format: 'RGBA',
          codedWidth: width,
          codedHeight: height,
          timestamp: Math.round(T * frameUs),
          duration: Math.round(frameUs),
        })
        encoder.encode(frame, { keyFrame: T % keyEvery === 0 })
        frame.close()
        const now = performance.now()
        if (now - lastPaint > 100) {
          lastPaint = now
          pctx.putImageData(new ImageData(bytes, width, height), 0, 0)
        }
      },
    })
    await encoder.flush()
    if (encodeError) throw encodeError
    muxer.finalize()
  } finally {
    if (encoder.state !== 'closed') encoder.close()
  }
  const type = fmt === 'mp4' ? 'video/mp4' : 'video/webm'
  return { blob: new Blob([target.buffer], { type }), filename: `slitscan-${mode}.${fmt}` }
}

export async function exportProject({ kind, output, video, sourceFile, sourceName, fps }) {
  const stillBlob = await canvasToBlob(output, 'image/png')
  return buildProjectZip({
    kind,
    stillBlob,
    sourceFile,
    sourceName: sourceName || 'source.mp4',
    fps,
    duration: Number.isFinite(video.duration) ? video.duration : 0,
    stillW: output.width,
    stillH: output.height,
    videoW: video.videoWidth,
    videoH: video.videoHeight,
  })
}
