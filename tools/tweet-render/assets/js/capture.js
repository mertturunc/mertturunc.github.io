function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(String(fr.result || ''))
    fr.onerror = () => reject(fr.error || new Error('read failed'))
    fr.readAsDataURL(blob)
  })
}

function waitImages(root) {
  return Promise.all(
    [...root.querySelectorAll('img')].map(
      (img) =>
        (img.complete && img.naturalWidth) ||
        new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true })
          img.addEventListener('error', resolve, { once: true })
        }),
    ),
  )
}

function parseColor(cs, attr, fallback) {
  const v = cs[attr] || fallback
  return v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent' ? v : null
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function box(el, origin) {
  const r = el.getBoundingClientRect()
  return {
    x: r.left - origin.x,
    y: r.top - origin.y,
    w: r.width,
    h: r.height,
  }
}

function paintBackground(ctx, el, origin) {
  const cs = getComputedStyle(el)
  const bg = parseColor(cs, 'backgroundColor')
  if (!bg) return
  const b = box(el, origin)
  if (b.w < 0.5 || b.h < 0.5) return
  const r = parseFloat(cs.borderRadius) || 0
  ctx.save()
  roundRect(ctx, b.x, b.y, b.w, b.h, r)
  ctx.fillStyle = bg
  ctx.fill()
  ctx.restore()
}

function borderSide(cs, edge) {
  const cap = edge[0].toUpperCase() + edge.slice(1)
  const width = parseFloat(cs[`border${cap}Width`]) || 0
  const style = cs[`border${cap}Style`]
  const color = parseColor(cs, `border${cap}Color`)
  const visible = !!(color && width >= 0.4 && style && style !== 'none' && style !== 'hidden')
  return { width, style, color, visible }
}

function dashFor(style, width) {
  if (style === 'dashed') return [width * 3, width * 2]
  if (style === 'dotted') return [width, width]
  return []
}

function paintBorder(ctx, el, origin) {
  const cs = getComputedStyle(el)
  const top = borderSide(cs, 'top')
  const right = borderSide(cs, 'right')
  const bottom = borderSide(cs, 'bottom')
  const left = borderSide(cs, 'left')
  if (!top.visible && !right.visible && !bottom.visible && !left.visible) return

  const b = box(el, origin)
  const radius = parseFloat(cs.borderRadius) || 0
  const uniform =
    top.visible &&
    right.visible &&
    bottom.visible &&
    left.visible &&
    top.width === right.width &&
    top.width === bottom.width &&
    top.width === left.width &&
    top.style === right.style &&
    top.style === bottom.style &&
    top.style === left.style &&
    top.color === right.color &&
    top.color === bottom.color &&
    top.color === left.color

  if (uniform) {
    const width = top.width
    ctx.save()
    roundRect(
      ctx,
      b.x + width / 2,
      b.y + width / 2,
      Math.max(0, b.w - width),
      Math.max(0, b.h - width),
      Math.max(0, radius - width / 2),
    )
    ctx.strokeStyle = top.color
    ctx.lineWidth = width
    ctx.setLineDash(dashFor(top.style, width))
    ctx.stroke()
    ctx.restore()
    return
  }

  const stroke = (x1, y1, x2, y2, side) => {
    ctx.save()
    ctx.strokeStyle = side.color
    ctx.lineWidth = side.width
    ctx.lineCap = 'butt'
    ctx.setLineDash(dashFor(side.style, side.width))
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.restore()
  }

  if (top.visible) {
    const y = b.y + top.width / 2
    stroke(b.x, y, b.x + b.w, y, top)
  }
  if (bottom.visible) {
    const y = b.y + b.h - bottom.width / 2
    stroke(b.x, y, b.x + b.w, y, bottom)
  }
  if (left.visible) {
    const x = b.x + left.width / 2
    stroke(x, b.y, x, b.y + b.h, left)
  }
  if (right.visible) {
    const x = b.x + b.w - right.width / 2
    stroke(x, b.y, x, b.y + b.h, right)
  }
}

function posOffset(token, extra) {
  const v = String(token || '').trim()
  if (v === 'left' || v === 'top') return 0
  if (v === 'right' || v === 'bottom') return extra
  if (v === 'center') return extra / 2
  if (v.endsWith('%')) return extra * (parseFloat(v) / 100)
  if (v.endsWith('px')) return parseFloat(v) || 0
  return extra / 2
}

function objectPositionOffset(pos, extraX, extraY) {
  const parts = String(pos || '50% 50%').trim().split(/\s+/)
  if (parts.length === 1) return { x: posOffset(parts[0], extraX), y: extraY / 2 }
  return { x: posOffset(parts[0], extraX), y: posOffset(parts[1], extraY) }
}

function paintImage(ctx, img, origin) {
  if (!img.naturalWidth) return
  const b = box(img, origin)
  const cs = getComputedStyle(img)
  const r = parseFloat(cs.borderRadius) || 0
  ctx.save()
  roundRect(ctx, b.x, b.y, b.w, b.h, r)
  ctx.clip()
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  const fit = cs.objectFit || 'fill'
  let dw
  let dh
  if (fit === 'contain') {
    const s = Math.min(b.w / iw, b.h / ih)
    dw = iw * s
    dh = ih * s
  } else if (fit === 'none') {
    dw = iw
    dh = ih
  } else if (fit === 'scale-down') {
    const s = Math.min(1, b.w / iw, b.h / ih)
    dw = iw * s
    dh = ih * s
  } else if (fit === 'fill') {
    dw = b.w
    dh = b.h
  } else {
    const s = Math.max(b.w / iw, b.h / ih)
    dw = iw * s
    dh = ih * s
  }
  const p = objectPositionOffset(cs.objectPosition, b.w - dw, b.h - dh)
  ctx.drawImage(img, b.x + p.x, b.y + p.y, dw, dh)
  ctx.restore()
}

function paintTextNode(ctx, node, origin) {
  const text = node.textContent
  if (!text) return
  const parent = node.parentElement
  if (!parent) return
  const cs = getComputedStyle(parent)
  const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  ctx.fillStyle = cs.color
  ctx.font = font
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'

  let line = ''
  let lineLeft = 0
  let lineTop = null
  const flush = () => {
    if (!line) return
    ctx.fillText(line, lineLeft - origin.x, lineTop - origin.y)
    line = ''
  }

  for (let i = 0; i < text.length; i++) {
    const range = document.createRange()
    range.setStart(node, i)
    range.setEnd(node, i + 1)
    const r = range.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue
    if (lineTop === null || Math.abs(r.top - lineTop) > 1) {
      flush()
      line = text[i]
      lineTop = r.top
      lineLeft = r.left
    } else {
      line += text[i]
    }
  }
  flush()
}

function paintDecorations(ctx, el, origin) {
  const cs = getComputedStyle(el)
  if (cs.textDecorationLine && cs.textDecorationLine.includes('underline')) {
    const b = box(el, origin)
    const thickness = parseFloat(cs.textDecorationThickness) || 2
    const offset = parseFloat(cs.textUnderlineOffset) || 3
    ctx.save()
    ctx.strokeStyle = cs.textDecorationColor || cs.color
    ctx.lineWidth = thickness
    ctx.beginPath()
    ctx.moveTo(b.x, b.y + b.h + offset - thickness)
    ctx.lineTo(b.x + b.w, b.y + b.h + offset - thickness)
    ctx.stroke()
    ctx.restore()
  }
}

function walkPaint(ctx, root, origin) {
  paintBackground(ctx, root, origin)
  if (root.tagName === 'IMG') {
    paintImage(ctx, root, origin)
    paintBorder(ctx, root, origin)
    return
  }
  for (const child of root.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) paintTextNode(ctx, child, origin)
    else if (child.nodeType === Node.ELEMENT_NODE) walkPaint(ctx, child, origin)
  }
  paintDecorations(ctx, root, origin)
  paintBorder(ctx, root, origin)
}

export const MAX_EXPORT_EDGE = 8192

export function exportSize(width, height, dpr) {
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height || width))
  const requested = Math.max(1, Math.min(8, Number(dpr) || 1))
  let pixelRatio = requested
  if (w * pixelRatio > MAX_EXPORT_EDGE) pixelRatio = MAX_EXPORT_EDGE / w
  if (h * pixelRatio > MAX_EXPORT_EDGE) pixelRatio = Math.min(pixelRatio, MAX_EXPORT_EDGE / h)
  pixelRatio = Math.max(1, pixelRatio)
  return {
    width: Math.round(w * pixelRatio),
    height: Math.round(h * pixelRatio),
    pixelRatio,
    clamped: pixelRatio + 0.001 < requested,
  }
}

export async function captureCard(source, { width, dpr }) {
  const w = Math.max(420, Math.round(width))
  const requested = Math.max(1, Math.min(8, Number(dpr) || 1))

  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  host.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none;z-index:-1;'
  const clone = source.cloneNode(true)
  clone.style.transform = 'none'
  clone.style.zoom = '1'
  clone.style.width = `${w}px`
  clone.style.setProperty('--card-width', `${w}px`)
  clone.style.setProperty('--card-scale', '1')
  host.appendChild(clone)
  document.body.appendChild(host)

  try {
    for (const img of clone.querySelectorAll('img')) {
      if (img.src && !img.src.startsWith('data:')) {
        try {
          const res = await fetch(img.src, { mode: 'cors' })
          if (res.ok) img.src = await blobToDataUrl(await res.blob())
        } catch (_) {}
      }
    }
    await waitImages(clone)
    await Promise.all(
      [...clone.querySelectorAll('img')].map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve())),
    )
    if (document.fonts?.ready) await document.fonts.ready
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

    const origin = clone.getBoundingClientRect()
    const height = Math.max(1, Math.round(origin.height))
    const size = exportSize(w, height, requested)
    const pixelRatio = size.pixelRatio

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(w * pixelRatio)
    canvas.height = Math.round(height * pixelRatio)
    const ctx = canvas.getContext('2d')
    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    walkPaint(ctx, clone, origin)
    return canvas
  } finally {
    host.remove()
  }
}

export function canvasToBlob(canvas, mime = 'image/png', quality) {
  return new Promise((resolve, reject) => {
    const done = (blob) => {
      if (!blob) reject(new Error('empty image'))
      else resolve(blob)
    }
    try {
      if (quality == null) canvas.toBlob(done, mime)
      else canvas.toBlob(done, mime, quality)
    } catch (e) {
      reject(e)
    }
  })
}

export function canvasToPngBlob(canvas) {
  return canvasToBlob(canvas, 'image/png')
}
