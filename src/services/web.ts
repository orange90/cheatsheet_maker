export class WebContentExtractor {
  static async extractContent(url: string): Promise<string> {
    try {
      const resp = await fetch(`/api/extract?url=${encodeURIComponent(url)}`, {
        method: 'GET'
      })
      if (!resp.ok) {
        const msg = await resp.text()
        throw new Error(msg)
      }
      const data = await resp.json()
      return data.content as string
    } catch (error) {
      console.error('Web content extraction error:', error)
      throw new Error('Failed to extract content from web page')
    }
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}