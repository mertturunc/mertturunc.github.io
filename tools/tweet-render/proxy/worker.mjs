const SYNDICATION = (id) =>
  `https://cdn.syndication.twimg.com/tweet-result?id=${encodeURIComponent(id)}&lang=en&token=1`

const ALLOWED_IMG_HOST = /(?:^|\.)(?:twimg\.com|twitter\.com|x\.com)$/i

function corsHeaders(extra = {}) {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    ...extra,
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders({ 'content-type': 'application/json; charset=utf-8' }),
  })
}

function allowedImage(raw) {
  try {
    const u = new URL(raw)
    return u.protocol === 'https:' && ALLOWED_IMG_HOST.test(u.hostname)
  } catch {
    return false
  }
}

export async function handle(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }
  if (request.method !== 'GET') {
    return json({ error: 'method not allowed' }, 405)
  }

  const url = new URL(request.url)
  const path = url.pathname.replace(/\/+$/, '')

  if (path.endsWith('/tweet') || path === '/tweet') {
    const id = String(url.searchParams.get('id') || '').trim()
    if (!/^\d{5,}$/.test(id)) return json({ error: 'missing or invalid id' }, 400)
    try {
      const res = await fetch(SYNDICATION(id), {
        headers: { accept: 'application/json' },
      })
      if (res.status === 404) return json({ error: 'tweet not found' }, 404)
      if (!res.ok) return json({ error: `upstream ${res.status}` }, res.status)
      const data = await res.json()
      return json(data)
    } catch (err) {
      return json({ error: err.message || 'fetch failed' }, 502)
    }
  }

  if (path.endsWith('/img') || path === '/img') {
    const src = url.searchParams.get('url') || ''
    if (!allowedImage(src)) return json({ error: 'url not allowed' }, 400)
    try {
      const res = await fetch(src, {
        headers: { referer: 'https://x.com/' },
      })
      if (!res.ok) return new Response(null, { status: res.status, headers: corsHeaders() })
      const type = res.headers.get('content-type') || 'application/octet-stream'
      return new Response(res.body, {
        status: 200,
        headers: corsHeaders({
          'content-type': type,
          'cache-control': 'public, max-age=86400',
        }),
      })
    } catch (err) {
      return json({ error: err.message || 'image fetch failed' }, 502)
    }
  }

  return json({ error: 'not found' }, 404)
}

export default {
  fetch: (request) => handle(request),
}
