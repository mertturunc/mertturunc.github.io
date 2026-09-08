// Sniff codec + rotation from mp4 / quicktime without decoding.

const VIDEO_SAMPLE = new Set([
  'avc1', 'avc3', 'hvc1', 'hev1', 'av01', 'vp09', 'vp08',
  'mp4v', 'jpeg', 'apcn', 'apch', 'ap4h', 'apcs', 'apco',
])

function fourcc(u8, i) {
  return String.fromCharCode(u8[i], u8[i + 1], u8[i + 2], u8[i + 3])
}

function findAtom(buf, type) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  const a = type.charCodeAt(0)
  const b = type.charCodeAt(1)
  const c = type.charCodeAt(2)
  const d = type.charCodeAt(3)
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength)
  for (let i = 0; i <= u8.length - 8; i++) {
    if (u8[i + 4] !== a || u8[i + 5] !== b || u8[i + 6] !== c || u8[i + 7] !== d) continue
    let size = view.getUint32(i)
    if (size === 1 && i + 16 <= u8.length) continue
    if (size === 0) size = u8.length - i
    if (size >= 8 && i + Math.min(size, 8) <= u8.length) return i
  }
  return -1
}

function readFixed16(view, offset) {
  return view.getInt32(offset) / 65536
}

function rotationFromTkhd(u8, atomAt) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength)
  const version = u8[atomAt + 8]
  const matrixAt = atomAt + 8 + (version === 1 ? 52 : 40)
  if (matrixAt + 16 > u8.length) return 0
  const a = readFixed16(dv, matrixAt)
  const b = readFixed16(dv, matrixAt + 4)
  let deg = Math.round(Math.atan2(b, a) * 180 / Math.PI)
  deg = ((deg % 360) + 360) % 360
  if (deg < 45 || deg >= 315) return 0
  if (deg < 135) return 90
  if (deg < 225) return 180
  return 270
}

function sniffCodec(u8) {
  for (let i = 0; i <= u8.length - 8; i++) {
    const tag = fourcc(u8, i + 4)
    if (VIDEO_SAMPLE.has(tag)) return tag
  }
  return null
}

export async function probeMediaFile(file) {
  if (!file || !file.size) return { codec: null, rotation: 0, brand: '' }
  const headLen = Math.min(file.size, 64 * 1024)
  const tailLen = Math.min(file.size, 4 * 1024 * 1024)
  const head = new Uint8Array(await file.slice(0, headLen).arrayBuffer())
  let brand = ''
  if (head.length >= 12 && fourcc(head, 4) === 'ftyp') brand = fourcc(head, 8).trim()

  const sniff = (u8) => {
    const stsd = findAtom(u8, 'stsd')
    if (stsd >= 0) return sniffCodec(u8.subarray(stsd, Math.min(u8.length, stsd + 4096)))
    return sniffCodec(u8)
  }

  let codec = sniff(head)
  let rotation = 0
  const tkHead = findAtom(head, 'tkhd')
  if (tkHead >= 0) rotation = rotationFromTkhd(head, tkHead)

  if (!codec || !rotation) {
    const start = Math.max(0, file.size - tailLen)
    const tail = new Uint8Array(await file.slice(start).arrayBuffer())
    if (!codec) codec = sniff(tail)
    if (!rotation) {
      const tk = findAtom(tail, 'tkhd')
      if (tk >= 0) rotation = rotationFromTkhd(tail, tk)
    }
  }

  return { codec, rotation, brand }
}

export function browserCanPlayCodec(codec) {
  if (!codec) return true
  const v = document.createElement('video')
  const tests = {
    avc1: ['video/mp4; codecs="avc1.42E01E"', 'video/mp4; codecs="avc1.640028"'],
    avc3: ['video/mp4; codecs="avc3.42E01E"'],
    hvc1: ['video/mp4; codecs="hvc1.1.6.L93.B0"', 'video/mp4; codecs="hvc1.1.6.L123.B0"'],
    hev1: ['video/mp4; codecs="hev1.1.6.L93.B0"', 'video/mp4; codecs="hev1.1.6.L123.B0"'],
    av01: ['video/mp4; codecs="av01.0.05M.08"'],
    vp09: ['video/webm; codecs="vp09.00.10.08"', 'video/mp4; codecs="vp09.00.10.08"'],
    vp08: ['video/webm; codecs="vp8"'],
  }
  const list = tests[codec]
  if (!list) return true
  return list.some((m) => {
    try { return !!v.canPlayType(m) } catch (_) { return false }
  })
}

export function isHevc(codec) {
  return codec === 'hvc1' || codec === 'hev1'
}

export async function paintFirstFrame(video) {
  if (!video) return
  video.muted = true
  video.playsInline = true
  const wait = (ev, ms) => new Promise((resolve) => {
    let done = false
    const ok = () => { if (done) return; done = true; video.removeEventListener(ev, ok); resolve() }
    video.addEventListener(ev, ok)
    setTimeout(ok, ms)
  })
  try {
    if (video.readyState < 2) await wait('loadeddata', 4000)
  } catch (_) {}
  try {
    if (Math.abs(video.currentTime) < 1e-3) {
      video.currentTime = Math.min(0.08, Math.max(0, (video.duration || 1) * 0.01))
      await wait('seeked', 1500)
    }
  } catch (_) {}
  try {
    const p = video.play()
    if (p) await p
    video.pause()
  } catch (_) {}
  try {
    if (video.currentTime > 0.2) video.currentTime = 0
  } catch (_) {}
}

export function videoHasPicture(video) {
  if (!video || video.videoWidth < 2 || video.videoHeight < 2) return false
  const c = document.createElement('canvas')
  c.width = 8
  c.height = 8
  const ctx = c.getContext('2d')
  try { ctx.drawImage(video, 0, 0, 8, 8) } catch (_) { return false }
  const px = ctx.getImageData(0, 0, 8, 8).data
  for (let i = 0; i < px.length; i += 4) {
    if ((px[i] | px[i + 1] | px[i + 2]) !== 0) return true
  }
  return false
}
