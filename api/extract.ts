export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const url = (req.query?.url as string) || (req.body?.url as string)
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Invalid url' })
    }

    const response = await fetch(url, { headers: { 'User-Agent': 'CheatsheetMakerBot/1.0' } })
    if (!response.ok) {
      return res.status(500).json({ error: `Fetch failed: ${response.status} ${response.statusText}` })
    }
    const html = await response.text()

    // Lightweight content extraction without external libs
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

    return res.status(200).json({ content: text })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Unknown error' })
  }
}