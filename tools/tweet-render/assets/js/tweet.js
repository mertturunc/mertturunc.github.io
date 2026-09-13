export function extractTweetId(input) {
  const s = String(input || '').trim()
  const fromPath = s.match(/(?:status|statuses)\/(\d{5,})/)
  if (fromPath) return fromPath[1]
  if (/^\d{5,}$/.test(s)) return s
  return null
}

function proxyBases() {
  const bases = []
  const host = location.hostname
  if (host === 'localhost' || host === '127.0.0.1') {
    bases.push('http://127.0.0.1:3457')
  }
  bases.push(`${location.origin}/tools/tweet-render/api`)
  return bases
}

function avatarHq(url) {
  if (!url) return url
  return url
    .replace(/_normal(?=\.(?:jpg|jpeg|png|webp|gif))/i, '_400x400')
    .replace(/_200x200(?=\.(?:jpg|jpeg|png|webp|gif))/i, '_400x400')
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(String(fr.result || ''))
    fr.onerror = () => reject(fr.error || new Error('read failed'))
    fr.readAsDataURL(blob)
  })
}

async function corsImage(url, proxyBase) {
  if (!url) return ''
  const stripped = url.replace(/^https?:\/\//, '')
  const tries = []
  if (proxyBase) tries.push(`${proxyBase}/img?url=${encodeURIComponent(url)}`)
  tries.push(`https://wsrv.nl/?url=${encodeURIComponent(stripped)}&n=-1&w=4096&we=1`)
  for (const src of tries) {
    try {
      const res = await fetch(src, { mode: 'cors' })
      if (!res.ok) continue
      const blob = await res.blob()
      const type = blob.type || ''
      const looksImage = type.startsWith('image') || type === 'application/octet-stream' || !type
      if (!blob.size || !looksImage) continue
      return await blobToDataUrl(blob)
    } catch (_) {}
  }
  return url
}

function mediaHq(url) {
  if (!url) return url
  if (!/pbs\.twimg\.com\/(?:media|ext_tw_video_thumb|amplify_video_thumb|tweet_video_thumb|card_img)\//i.test(url)) {
    return url
  }
  if (/[?&]name=/.test(url)) return url.replace(/([?&]name=)[^&]+/, '$1orig')
  if (/:(?:small|medium|large|thumb|orig|360x360|900x900)$/.test(url)) {
    return url.replace(/:[^/?]+$/, ':orig')
  }
  return url + (url.includes('?') ? '&' : '?') + 'name=orig'
}

function mediaAlt(m) {
  const a = m?.alt || m?.altText || m?.alt_text || m?.ext_alt_text || m?.description || ''
  return String(a).trim()
}

function photosOfFx(media) {
  const list = media?.photos || (media?.all || []).filter((m) => m && m.type === 'photo')
  return (list || []).map((m) => ({
    url: mediaHq(m.url),
    width: m.width || null,
    height: m.height || null,
    alt: mediaAlt(m),
  }))
}

function photosOfSyn(mediaDetails = []) {
  return mediaDetails
    .filter((m) => m && m.type === 'photo')
    .map((m) => ({
      url: mediaHq(m.media_url_https),
      width: m.original_info?.width || null,
      height: m.original_info?.height || null,
      alt: mediaAlt(m),
    }))
}

function videoOfFx(media) {
  const v = (media?.videos || []).find((m) => m && (m.thumbnail_url || m.url))
  if (!v) return null
  return {
    poster: mediaHq(v.thumbnail_url || ''),
    width: v.width || null,
    height: v.height || null,
    duration: v.duration || null,
    alt: mediaAlt(v),
  }
}

function videoOfSyn(raw) {
  const details = raw?.mediaDetails || (Array.isArray(raw) ? raw : [])
  const v = details.find((m) => m && (m.type === 'video' || m.type === 'animated_gif'))
  if (v) {
    return {
      poster: mediaHq(v.media_url_https || ''),
      width: v.original_info?.width || null,
      height: v.original_info?.height || null,
      duration: v.video_info?.duration_millis ? v.video_info.duration_millis / 1000 : null,
      alt: mediaAlt(v),
    }
  }
  const top = raw?.video
  if (top?.poster) {
    return {
      poster: mediaHq(top.poster),
      width: top.aspectRatio?.[0] || null,
      height: top.aspectRatio?.[1] || null,
      duration: top.durationMs ? top.durationMs / 1000 : null,
      alt: mediaAlt(top),
    }
  }
  return null
}

function expandUrls(text, entities) {
  let s = String(text || '')
  for (const u of entities?.urls || []) {
    if (u.url && (u.expanded_url || u.display_url)) {
      s = s.split(u.url).join(u.expanded_url || `https://${u.display_url}`)
    }
  }
  return s
}

function bindVal(card, key) {
  const v = card?.binding_values?.[key]
  if (!v) return ''
  return v.string_value || v.image_value?.url || ''
}

function linkCardOfFx(c) {
  if (!c || !(c.url || c.title)) return null
  return {
    url: c.url || '',
    title: c.title || '',
    domain: c.domain || '',
    image: mediaHq(c.image?.url || ''),
  }
}

function linkCardOfSyn(raw) {
  const c = raw?.card
  if (!c) return null
  const title = bindVal(c, 'title')
  const url = bindVal(c, 'card_url') || c.url || ''
  const image =
    bindVal(c, 'thumbnail_image_original') ||
    bindVal(c, 'photo_image_full_size_original') ||
    bindVal(c, 'thumbnail_image') ||
    bindVal(c, 'summary_photo_image')
  if (!title && !url && !image) return null
  return {
    url,
    title,
    domain: bindVal(c, 'vanity_url') || bindVal(c, 'domain') || '',
    image: mediaHq(image),
  }
}

function authorOfFx(u) {
  if (!u) return { name: '', handle: '', avatar: '', verified: false }
  return {
    name: u.name || '',
    handle: u.screen_name || '',
    avatar: avatarHq(u.avatar_url || ''),
    verified: !!(u.verification && u.verification.verified),
  }
}

function authorOfSyn(u) {
  return {
    name: u.name,
    handle: u.screen_name,
    avatar: avatarHq(u.profile_image_url_https),
    verified: !!(u.verified || u.is_blue_verified),
  }
}

function nestedQuoteFx(q) {
  if (!q?.id) return null
  const photos = photosOfFx(q.media)
  return {
    id: String(q.id),
    text: q.text || '',
    createdAt: q.created_at ? new Date(q.created_at) : null,
    author: authorOfFx(q.author),
    photos,
    video: photos.length ? null : videoOfFx(q.media),
  }
}

function nestedQuoteSyn(q) {
  if (!q?.id_str) return null
  const photos = photosOfSyn(q.mediaDetails)
  return {
    id: q.id_str,
    text: expandUrls(q.text || '', q.entities),
    createdAt: q.created_at ? new Date(q.created_at) : null,
    author: authorOfSyn(q.user),
    photos,
    video: photos.length ? null : videoOfSyn(q),
  }
}

function fromFx(raw) {
  const t = raw.tweet || raw
  if (!t || !t.id) return null
  const photos = photosOfFx(t.media)
  const video = photos.length ? null : videoOfFx(t.media)
  const quote = nestedQuoteFx(t.quote)
  return {
    id: String(t.id),
    url: t.url || `https://x.com/${t.author?.screen_name || 'i'}/status/${t.id}`,
    text: t.text || '',
    createdAt: t.created_at ? new Date(t.created_at) : new Date(),
    likes: t.likes ?? null,
    replies: t.replies ?? null,
    retweets: t.retweets ?? null,
    edited: false,
    author: authorOfFx(t.author),
    photos,
    video,
    quote,
    replyToHandle: t.replying_to || null,
    replyToId: t.replying_to_status ? String(t.replying_to_status) : null,
    linkCard: photos.length || video || quote ? null : linkCardOfFx(t.card),
  }
}

function fromSyn(raw) {
  if (!raw?.id_str || !raw.user) return null
  const photos = photosOfSyn(raw.mediaDetails)
  const video = photos.length ? null : videoOfSyn(raw)
  const quote = nestedQuoteSyn(raw.quoted_tweet)
  return {
    id: raw.id_str,
    url: `https://x.com/${raw.user.screen_name}/status/${raw.id_str}`,
    text: expandUrls(raw.text || '', raw.entities),
    createdAt: new Date(raw.created_at),
    likes: raw.favorite_count ?? null,
    replies: raw.conversation_count ?? null,
    retweets: raw.retweet_count ?? null,
    edited: !!raw.isEdited,
    author: authorOfSyn(raw.user),
    photos,
    video,
    quote,
    replyToHandle: raw.in_reply_to_screen_name || null,
    replyToId: raw.in_reply_to_status_id_str || null,
    linkCard: photos.length || video || quote ? null : linkCardOfSyn(raw),
  }
}

export function normalize(data) {
  if (!data) return null
  if (data.author && data.text != null && data.id) return data
  return fromFx(data) || fromSyn(data)
}

async function hydrate(tweet, proxyBase) {
  tweet.author.avatarSrc = await corsImage(tweet.author.avatar, proxyBase)
  for (const p of tweet.photos || []) {
    p.src = await corsImage(p.url, proxyBase)
  }
  if (tweet.video?.poster) {
    tweet.video.posterSrc = await corsImage(tweet.video.poster, proxyBase)
  }
  if (tweet.linkCard?.image) {
    tweet.linkCard.imageSrc = await corsImage(tweet.linkCard.image, proxyBase)
  }
  if (tweet.quote) {
    tweet.quote.author.avatarSrc = await corsImage(tweet.quote.author.avatar, proxyBase)
    for (const p of tweet.quote.photos || []) {
      p.src = await corsImage(p.url, proxyBase)
    }
    if (tweet.quote.video?.poster) {
      tweet.quote.video.posterSrc = await corsImage(tweet.quote.video.poster, proxyBase)
    }
  }
  return tweet
}

async function loadOne(id) {
  let lastErr = null
  for (const base of proxyBases()) {
    try {
      const res = await fetch(`${base}/tweet?id=${encodeURIComponent(id)}`, {
        headers: { Accept: 'application/json' },
      })
      const type = res.headers.get('content-type') || ''
      if (!res.ok || !type.includes('json')) {
        lastErr = new Error(`http ${res.status}`)
        continue
      }
      const data = await res.json()
      if (data && data.error) {
        lastErr = new Error(data.error)
        continue
      }
      const tweet = normalize(data)
      if (!tweet) {
        lastErr = new Error('bad-payload')
        continue
      }
      return { tweet: await hydrate(tweet, base), err: null }
    } catch (e) {
      lastErr = e
    }
  }

  try {
    const res = await fetch(`https://api.fxtwitter.com/status/${id}`, {
      headers: { Accept: 'application/json' },
    })
    if (res.status === 404) {
      const err = new Error('not-found')
      err.code = 'not-found'
      throw err
    }
    if (!res.ok) throw new Error(`http ${res.status}`)
    const data = await res.json()
    const tweet = normalize(data)
    if (!tweet) throw new Error('bad-payload')
    return { tweet: await hydrate(tweet, null), err: null }
  } catch (e) {
    if (e.code) throw e
    const err = new Error(e.message || 'fetch-failed')
    err.code = 'fetch-failed'
    err.cause = lastErr
    throw err
  }
}

export async function fetchTweet(urlOrId, { skipReply } = {}) {
  const id = extractTweetId(urlOrId)
  if (!id) {
    const err = new Error('bad-id')
    err.code = 'bad-id'
    throw err
  }

  const { tweet } = await loadOne(id)
  if (!skipReply && tweet.replyToId && !tweet.quote) {
    try {
      const parent = await fetchTweet(tweet.replyToId, { skipReply: true })
      tweet.replyTo = parent
      if (!tweet.replyToHandle && parent.author?.handle) {
        tweet.replyToHandle = parent.author.handle
      }
    } catch (_) {}
  }
  return tweet
}
