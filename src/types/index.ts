export interface CheatsheetItem {
  id: string
  title: string
  content: string
  category?: string
  color?: string
}

export interface CheatsheetData {
  items: CheatsheetItem[]
  title: string
  language: 'zh' | 'en'
}

export interface ExportFormat {
  type: 'desktop' | 'mobile'
  width: number
  height: number
  name: string
}

export interface AIResponse {
  success: boolean
  data?: string
  error?: string
}