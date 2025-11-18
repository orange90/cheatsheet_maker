import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    {
      name: 'cheatsheet-api-middleware',
      configureServer(server) {
        server.middlewares.use('/api/extract', async (req, res) => {
          try {
            const urlParam = new URL(req.url!, 'http://localhost').searchParams.get('url')
            const target = urlParam || ''
            if (!target) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid url' }))
              return
            }
            const r = await fetch(target, { headers: { 'User-Agent': 'CheatsheetMakerDev/1.0' } })
            if (!r.ok) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: `Fetch failed: ${r.status} ${r.statusText}` }))
              return
            }
            const html = await r.text()
            const text = html
              .replace(/<script[\s\S]*?<\/script>/gi, '')
              .replace(/<style[\s\S]*?<\/style>/gi, '')
              .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
              .replace(/<header[\s\S]*?<\/header>/gi, '')
              .replace(/<footer[\s\S]*?<\/footer>/gi, '')
              .replace(/<nav[\s\S]*?<\/nav>/gi, '')
              .replace(/<[^>]+>/g, '\n')
              .replace(/\n{2,}/g, '\n')
              .trim()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ content: text }))
          } catch (e: any) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e?.message || 'Unknown error' }))
          }
        })

        server.middlewares.use('/api/ai', async (req, res) => {
          try {
            const chunks: Buffer[] = []
            req.on('data', (d) => chunks.push(Buffer.from(d)))
            await new Promise((resolve) => req.on('end', resolve))
            const bodyStr = Buffer.concat(chunks).toString('utf-8')
            const payload = bodyStr ? JSON.parse(bodyStr) : {}
            const { messages, temperature = 0.7, max_tokens = 4000, stream = false, model } = payload
            const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions'
            const API_TOKEN = process.env.SILICONFLOW_API_TOKEN || process.env.VITE_SILICONFLOW_API_TOKEN || ''
            const AI_MODEL = model || process.env.VITE_AI_MODEL || 'moonshotai/Kimi-K2-Thinking'
            if (!API_TOKEN) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Missing SiliconFlow API token' }))
              return
            }
            const r = await fetch(API_URL, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ model: AI_MODEL, messages, temperature, max_tokens, stream })
            })
            const text = await r.text()
            res.statusCode = r.ok ? 200 : r.status
            res.setHeader('Content-Type', 'application/json')
            res.end(text)
          } catch (e: any) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e?.message || 'Unknown error' }))
          }
        })
      }
    }
  ],
  server: {
    port: 3000,
    host: true
  }
})
