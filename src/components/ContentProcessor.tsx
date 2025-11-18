import { useState } from 'react'
import { Loader2, Globe, FileText, Languages } from 'lucide-react'
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
    setLoading(true, 'Processing content with AI...')
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
      
      // Create cheatsheet data
      const cheatsheetData = {
        title,
        language: selectedLanguage,
        items: limited
      }

      setCheatsheetData(cheatsheetData)
      onProcessingComplete(aiResponse.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Processing failed')
    } finally {
      setIsProcessing(false)
      setLoading(false)
    }
  }

  const translateContent = async () => {
    if (!inputContent.trim()) {
      setError('No content to translate')
      return
    }

    setIsProcessing(true)
    setLoading(true, 'Translating content...')
    setError(null)

    try {
      const targetLang = selectedLanguage === 'zh' ? 'en' : 'zh'
      const { cheatsheetData } = useStore.getState()
      if (cheatsheetData && cheatsheetData.items.length > 0) {
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
        const combined = lines.join('\n')
        const aiResponse = await aiService.translateContent(combined, targetLang)
        if (!aiResponse.success || !aiResponse.data) {
          throw new Error(aiResponse.error || 'Translation failed')
        }
        const newTitle = extractTitle(aiResponse.data, cheatsheetData.title)
        const items = parseAIResponseToItems(aiResponse.data).slice(0, 12)
        useStore.getState().setCheatsheetData({
          title: newTitle,
          language: targetLang,
          items
        })
        setSelectedLanguage(targetLang)
      } else {
        const aiResponse = await aiService.translateContent(inputContent, targetLang)
        if (!aiResponse.success || !aiResponse.data) {
          throw new Error(aiResponse.error || 'Translation failed')
        }
        onProcessingComplete(aiResponse.data)
        setSelectedLanguage(targetLang)
      }
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
          <span className="text-sm text-gray-600">
            Language: {selectedLanguage === 'zh' ? '中文' : 'English'}
          </span>
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

        <button
          onClick={translateContent}
          disabled={isProcessing}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Languages className="w-4 h-4" />
          <span>Translate ({selectedLanguage === 'zh' ? 'EN' : '中文'})</span>
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