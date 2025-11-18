export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const { messages, temperature = 0.7, max_tokens = 4000, stream = false, model } = req.body || {}
    const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions'
    const API_TOKEN = process.env.SILICONFLOW_API_TOKEN || process.env.VITE_SILICONFLOW_API_TOKEN || ''
    const AI_MODEL = model || process.env.VITE_AI_MODEL || 'moonshotai/Kimi-K2-Thinking'

    if (!API_TOKEN) {
      return res.status(400).json({ error: 'Missing SiliconFlow API token' })
    }

    const r = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model: AI_MODEL, messages, temperature, max_tokens, stream })
    })

    if (!r.ok) {
      const text = await r.text()
      return res.status(r.status).json({ error: text })
    }

    const data = await r.json()
    return res.status(200).json(data)
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Unknown error' })
  }
}