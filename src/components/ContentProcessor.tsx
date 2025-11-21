import { useState } from 'react'
import { Loader2, Globe, FileText } from 'lucide-react'
import { useStore } from '@/stores'
import { aiService } from '@/services/ai'
import { generateId, getRandomColorScheme } from '@/utils'
import { CheatsheetItem } from '@/types'

interface ContentProcessorProps {
  onProcessingComplete: (content: string) => void
}

export function ContentProcessor({ onProcessingComplete }: ContentProcessorProps) {
  const { 
    inputContent, 
    selectedLanguage, 
    setLoading, 
    setError, 
    setCheatsheetData,
    setSelectedLanguage 
  } = useStore()
  
  const [isProcessing, setIsProcessing] = useState(false)

  const processContent = async () => {
    if (!inputContent.trim()) {
      setError('No content to process')
      return
    }

    setIsProcessing(true)
    setLoading(true, 'Summarizing...')
    setError(null)

    try {
      // Extract key points using AI
      const aiResponse = await aiService.extractContentFromText(inputContent)
      
      if (!aiResponse.success || !aiResponse.data) {
        throw new Error(aiResponse.error || 'Failed to process content')
      }

      // Parse AI response into structured items
      const title = extractTitle(aiResponse.data, inputContent)
      let items = parseAIResponseToItems(aiResponse.data)
      if (items.length === 0) {
        const fallback = inputContent.split(/\n+/).map(s => s.trim()).filter(Boolean).slice(0, 12)
        items = fallback.map(s => ({
          id: generateId(),
          title: s.substring(0, 50) + (s.length > 50 ? '...' : ''),
          content: s,
          color: getRandomColorScheme()
        }))
      }
      const limited = items.slice(0, 12)

      const grouped = new Map<string, CheatsheetItem[]>()
      limited.forEach(i => {
        const key = i.category || 'General'
        if (!grouped.has(key)) grouped.set(key, [])
        grouped.get(key)!.push(i)
      })
      const lines: string[] = []
      lines.push(`Cheatsheet Title: ${title}`)
      for (const [cat, arr] of grouped.entries()) {
        lines.push(`Section: ${cat}`)
        arr.forEach(i => lines.push(`- ${i.title}: ${i.content}`))
      }

      setLoading(true, 'Translating...')
      const translated = await aiService.translateContent(lines.join('\n'), selectedLanguage)
      if (!translated.success || !translated.data) {
        const cheatsheetData = {
          title,
          language: selectedLanguage,
          items: limited
        }
        setCheatsheetData(cheatsheetData)
        onProcessingComplete(aiResponse.data)
      } else {
        const newTitle = extractTitle(translated.data, title)
        const finalItems = parseAIResponseToItems(translated.data).slice(0, 12)
        setCheatsheetData({ title: newTitle, language: selectedLanguage, items: finalItems })
        onProcessingComplete(translated.data)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Processing failed')
    } finally {
      setIsProcessing(false)
      setLoading(false)
    }
  }


  const handleLanguageChange = async (lang: 'zh' | 'en') => {
    const { cheatsheetData } = useStore.getState()
    if (!cheatsheetData || cheatsheetData.items.length === 0) {
      setSelectedLanguage(lang)
      return
    }

    if (lang === selectedLanguage) return

    try {
      setIsProcessing(true)
      setLoading(true, 'Translating...')
      setError(null)
      const grouped = new Map<string, CheatsheetItem[]>()
      cheatsheetData.items.forEach(i => {
        const key = i.category || 'General'
        if (!grouped.has(key)) grouped.set(key, [])
        grouped.get(key)!.push(i)
      })
      const lines: string[] = []
      lines.push(`Cheatsheet Title: ${cheatsheetData.title}`)
      for (const [cat, arr] of grouped.entries()) {
        lines.push(`Section: ${cat}`)
        arr.forEach(i => lines.push(`- ${i.title}: ${i.content}`))
      }

      const resp = await aiService.translateContent(lines.join('\n'), lang)
      if (!resp.success || !resp.data) {
        throw new Error(resp.error || 'Translation failed')
      }

      const newTitle = extractTitle(resp.data, cheatsheetData.title)
      const items = parseAIResponseToItems(resp.data).slice(0, 12)
      useStore.getState().setCheatsheetData({
        title: newTitle,
        language: lang,
        items
      })
      setSelectedLanguage(lang)
      onProcessingComplete(resp.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Translation failed')
    } finally {
      setIsProcessing(false)
      setLoading(false)
    }
  }

  const parseAIResponseToItems = (aiResponse: string): CheatsheetItem[] => {
    // Simple parsing - in production, you might want more sophisticated parsing
    const lines = aiResponse.split('\n').filter(line => line.trim())
    const items: CheatsheetItem[] = []
    
    let currentItem: Partial<CheatsheetItem> = {}
    let currentCategory: string | undefined = undefined
    
    lines.forEach((line) => {
      const trimmedLine = line.trim()

      // Look for bullet points or numbered items
      if (/^Cheatsheet Title:\s*/i.test(trimmedLine)) {
        // Title line handled elsewhere
        return
      } else if (/^Section:\s*/i.test(trimmedLine)) {
        currentCategory = trimmedLine.replace(/^Section:\s*/i, '').trim()
        return
      } else if (trimmedLine.match(/^[*\-•]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
        // If we have a previous item, save it
        if (currentItem.title && currentItem.content && items.length < 12) {
          items.push({
            id: generateId(),
            title: currentItem.title,
            content: currentItem.content,
            color: getRandomColorScheme(),
            category: currentCategory
          } as CheatsheetItem)
        }

        // Start new item
        const cleanLine = trimmedLine
          .replace(/^[*\-•]\s+/, '')
          .replace(/^\d+\.\s+/, '')
          .replace(/[•·►→✅✳️🟢🔹▶️\*]+/g, '')
        const colonIndex = cleanLine.indexOf(':')

        if (colonIndex > -1) {
          currentItem = {
            title: cleanLine.substring(0, colonIndex).trim(),
            content: cleanLine.substring(colonIndex + 1).trim()
          }
        } else {
          currentItem = {
            title: cleanLine.substring(0, 50) + (cleanLine.length > 50 ? '...' : ''),
            content: cleanLine
          }
        }
      } else if (trimmedLine && currentItem.content) {
        // Continue previous item
        currentItem.content += ' ' + trimmedLine
      }
    })
    
    // Add the last item
    if (currentItem.title && currentItem.content && items.length < 12) {
      items.push({
        id: generateId(),
        title: currentItem.title,
        content: currentItem.content,
        color: getRandomColorScheme(),
        category: currentCategory
      } as CheatsheetItem)
    }
    
    return items
  }

  function extractTitle(aiText: string, fallbackSource: string): string {
    const m = aiText.match(/Cheatsheet Title:\s*(.+)/i)
    if (m && m[1]) return m[1].trim().slice(0, 80)
    const first = fallbackSource.split(/\n+/).map(s => s.trim()).find(Boolean)
    return (first || 'Cheatsheet').slice(0, 80)
  }

  if (!inputContent) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Content Processing</h3>
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value as 'zh' | 'en')}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={processContent}
          disabled={isProcessing}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>{isProcessing ? 'Processing...' : 'Generate Cheatsheet'}</span>
        </button>
      </div>

      {inputContent && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <p className="text-sm text-gray-800 line-clamp-3">
            {inputContent.substring(0, 200)}...
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {inputContent.length} characters
          </p>
        </div>
      )}
    </div>
  )
}