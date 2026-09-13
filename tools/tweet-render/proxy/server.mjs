import http from 'node:http'
import { handle } from './worker.mjs'

const PORT = Number(process.env.PORT || 3457)

http
  .createServer(async (req, res) => {
    try {
      const url = `http://127.0.0.1:${PORT}${req.url}`
      const headers = new Headers()
      for (const [k, v] of Object.entries(req.headers)) {
        if (v) headers.set(k, Array.isArray(v) ? v.join(', ') : v)
      }
      const request = new Request(url, { method: req.method, headers })
      const response = await handle(request)
      res.statusCode = response.status
      response.headers.forEach((value, key) => {
        res.setHeader(key, value)
      })
      const buf = Buffer.from(await response.arrayBuffer())
      res.end(buf)
    } catch (err) {
      res.statusCode = 500
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify({ error: err.message || 'proxy failed' }))
    }
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`tweet-render proxy http://127.0.0.1:${PORT}`)
  })
