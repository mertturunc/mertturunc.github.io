export const FIGURE_WIDTH = 700

function el(tag, attrs, children) {
  const node = document.createElement(tag)
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue
      if (k === 'class') node.className = v
      else if (k === 'text') node.textContent = v
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v)
      else node.setAttribute(k, v === true ? '' : String(v))
    }
  }
  if (children) {
    for (const child of children) {
      if (child == null) continue
      node.append(typeof child === 'string' ? document.createTextNode(child) : child)
    }
  }
  return node
}

function hasVisual(tweet) {
  return !!(tweet?.photos?.length || tweet?.video)
}

function cleanText(text, stripMediaLink) {
  let s = String(text || '')
  if (stripMediaLink) {
    s = s.replace(/(?:\s*https?:\/\/(?:t\.co\/\w+|pic\.(?:x|twitter)\.com\/\S+))+\s*$/gi, '')
  }
  return s
}

function stripLeadingReply(text, handle) {
  if (!handle) return text
  const re = new RegExp(`^@${handle}\\b\\s*`, 'i')
  return String(text || '').replace(re, '')
}

function appendRichText(parent, text) {
  const re = /(https?:\/\/[^\s<>]+)|(@[a-zA-Z0-9_]{1,15})|(#[\p{L}\p{N}_]+)/gu
  let last = 0
  const src = String(text || '')
  for (const m of src.matchAll(re)) {
    if (m.index > last) parent.append(src.slice(last, m.index))
    const token = m[0]
    if (m[1]) {
      const a = el('a', { href: token, rel: 'noreferrer', target: '_blank' }, [token.replace(/^https?:\/\//, '')])
      parent.append(a)
    } else if (m[2]) {
      parent.append(el('span', { class: 'mention' }, [token]))
    } else {
      parent.append(el('span', { class: 'hashtag' }, [token]))
    }
    last = m.index + token.length
  }
  if (last < src.length) parent.append(src.slice(last))
}

export function formatCount(n) {
  n = n || 0
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    return (v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')) + 'm'
  }
  if (n >= 1_000) {
    const v = n / 1_000
    return (v >= 100 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')) + 'k'
  }
  return String(n)
}

export function formatDate(d, lang) {
  const dt = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(dt.getTime())) return ''
  const loc = lang === 'tr' ? 'tr-TR' : 'en-GB'
  return dt.toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase()
}

export function parseRatio(key, customW, customH) {
  if (!key || key === 'auto') return null
  let w
  let h
  if (key === 'custom') {
    w = Number(customW)
    h = Number(customH)
  } else {
    const m = String(key).match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/)
    if (!m) return null
    w = Number(m[1])
    h = Number(m[2])
  }
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return { w: 16, h: 9 }
  const max = 8
  if (w / h > max) return { w: max, h: 1 }
  if (h / w > max) return { w: 1, h: max }
  return { w, h }
}

export function applyCardFrame(card, { ratio, media = 'fill', place = 'center' } = {}) {
  card.style.setProperty('--card-width', `${FIGURE_WIDTH}px`)
  card.style.setProperty('--card-scale', '1')
  card.style.width = `${FIGURE_WIDTH}px`
  card.style.aspectRatio = ''
  card.classList.remove('is-framed')
  card.dataset.media = media === 'fit' ? 'fit' : 'fill'
  card.dataset.place = place === 'top' || place === 'bottom' ? place : 'center'
  if (ratio) {
    card.classList.add('has-ratio')
    card.style.setProperty('--media-ratio', `${ratio.w} / ${ratio.h}`)
  } else {
    card.classList.remove('has-ratio')
    card.style.removeProperty('--media-ratio')
  }
}

function nameRow(author) {
  const row = el('div', { class: 'card-name' }, [author.name || ''])
  if (author.verified) {
    row.append(el('span', { class: 'vmark', title: 'verified' }, ['*']))
  }
  return row
}

function avatar(src, className, name) {
  return el('img', {
    class: className || 'avatar',
    src: src || '',
    alt: name || '',
    draggable: 'false',
  })
}

function photoAlt(photo, fallback, index, total) {
  const own = String(photo?.alt || '').trim()
  if (own) return own
  return total > 1 ? `${fallback} ${index + 1}` : fallback
}

function mediaGrid(photos, fallback) {
  if (!photos || !photos.length) return null
  const total = Math.min(photos.length, 4)
  if (photos.length === 1) {
    return el('div', { class: 'media single' }, [
      el('img', { src: photos[0].src || photos[0].url, alt: photoAlt(photos[0], fallback, 1, 1) }),
    ])
  }
  const imgs = photos.slice(0, 4).map((p, i) =>
    el('img', { src: p.src || p.url, alt: photoAlt(p, fallback, i + 1, total) }),
  )
  return el('div', { class: 'media grid' }, imgs)
}

function videoPoster(video, fallback) {
  if (!video) return null
  const alt = String(video.alt || '').trim() || fallback
  return el('div', { class: 'media video' }, [
    el('img', { src: video.posterSrc || video.poster || '', alt }),
    el('span', { class: 'play', 'aria-hidden': 'true' }, ['▶']),
  ])
}

function quotePhotos(quote) {
  if (quote?.photos?.length) return quote.photos
  if (quote?.quote?.photos?.length) return quote.quote.photos
  return []
}

function buildQuote(quote, t) {
  if (!quote) return null
  const photos = quotePhotos(quote)
  const text = el('div', { class: 'quote-text' })
  appendRichText(text, cleanText(quote.text, hasVisual(quote)))
  const main = el('div', { class: 'quote-main' }, [
    el('div', { class: 'quote-top' }, [
      avatar(quote.author.avatarSrc || quote.author.avatar, 'avatar', quote.author.name),
      el('div', {}, [
        el('div', { class: 'quote-name' }, [
          quote.author.name || '',
          quote.author.verified ? el('span', { class: 'vmark' }, ['*']) : null,
        ]),
        el('div', { class: 'quote-handle' }, [`@${quote.author.handle}`]),
      ]),
    ]),
    text,
  ])
  const thumbSrc = photos[0]?.src || photos[0]?.url || quote.video?.posterSrc || quote.video?.poster
  const thumb = thumbSrc
    ? el('img', {
        class: 'quote-thumb',
        src: thumbSrc,
        alt: photos[0]?.alt || quote.video?.alt || (quote.video ? t('video_alt') : t('photo_alt')),
      })
    : null
  return el('div', { class: 'quote' }, [main, thumb])
}

function buildLinkCard(card) {
  if (!card || !(card.title || card.domain || card.image || card.url)) return null
  const imgSrc = card.imageSrc || card.image
  const domain = card.domain || (card.url ? card.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : '')
  return el('div', { class: 'linkcard' }, [
    imgSrc ? el('img', { src: imgSrc, alt: card.title || domain || '' }) : null,
    el('div', { class: 'linkcard-body' }, [
      domain ? el('div', { class: 'linkcard-domain' }, [domain]) : null,
      card.title ? el('div', { class: 'linkcard-title' }, [card.title]) : null,
    ]),
  ])
}

function footLine(tweet, t) {
  const bits = []
  if (tweet.replies != null) bits.push(`${formatCount(tweet.replies)} ${t('metric_replies')}`)
  if (tweet.retweets != null) bits.push(`${formatCount(tweet.retweets)} ${t('metric_reposts')}`)
  if (tweet.likes != null) bits.push(`${formatCount(tweet.likes)} ${t('metric_likes')}`)
  if (tweet.edited) bits.push(t('edited'))
  return bits.join(' · ')
}

export function buildCard(tweet, { lang, t, ratio, media, place }) {
  const article = el('article', { class: 'card' })
  applyCardFrame(article, { ratio, media, place })

  const date = formatDate(tweet.createdAt, lang)
  const handle = `@${tweet.author.handle}`
  const metaBits = [handle, date].filter(Boolean).join(' · ')

  article.append(
    el('header', { class: 'card-head' }, [
      avatar(tweet.author.avatarSrc || tweet.author.avatar, 'avatar', tweet.author.name),
      el('div', { class: 'card-who' }, [
        nameRow(tweet.author),
        el('div', { class: 'card-meta' }, [metaBits]),
      ]),
    ]),
  )

  if (tweet.replyToHandle) {
    const line = el('p', { class: 'card-reply' })
    line.append(document.createTextNode(`${t('reply_to')} `))
    line.append(el('span', { class: 'mention' }, [`@${tweet.replyToHandle}`]))
    article.append(line)
  }

  const body = el('div', { class: 'card-text' })
  appendRichText(body, cleanText(stripLeadingReply(tweet.text, tweet.replyToHandle), hasVisual(tweet)))
  article.append(body)

  const growBits = [
    mediaGrid(tweet.photos, t('photo_alt')),
    videoPoster(tweet.video, t('video_alt')),
    buildQuote(tweet.quote || tweet.replyTo, t),
    tweet.quote || tweet.photos?.length || tweet.video ? null : buildLinkCard(tweet.linkCard),
  ].filter(Boolean)

  growBits.forEach((n) => article.append(n))

  const foot = footLine(tweet, t)
  if (foot) article.append(el('footer', { class: 'card-foot' }, [foot]))

  return article
}
