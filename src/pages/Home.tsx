import { useRef } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { FileUpload } from '@/components/FileUpload'
import { ContentProcessor } from '@/components/ContentProcessor'
import { CheatsheetPreview } from '@/components/CheatsheetPreview'
import { ExportPanel } from '@/components/ExportPanel'
import { useStore } from '@/stores'
import { PDFProcessor } from '@/services/pdf'
import { WebContentExtractor } from '@/services/web'
import { Toaster } from 'sonner'

export default function Home() {
  const { 
    cheatsheetData, 
    setInputContent,
    isLoading,
    loadingMessage
  } = useStore()
  const exportRef = useRef<HTMLDivElement>(null)
  const { isDark, toggleTheme } = useTheme()

  const handleFileSelect = async (file: File) => {
    try {
      const text = await PDFProcessor.extractTextFromPDF(file)
      setInputContent(text)
    } catch (error) {
      console.error('PDF processing error:', error)
      alert('Failed to process PDF file')
    }
  }

  const handleUrlSubmit = async (url: string) => {
    try {
      const content = await WebContentExtractor.extractContent(url)
      setInputContent(content)
    } catch (error) {
      console.error('Web content extraction error:', error)
      alert('Failed to extract content from URL')
    }
  }

  const handleProcessingComplete = (content: string) => {
    setInputContent(content)
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cheatsheet Maker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600 dark:text-gray-300">AI-powered cheatsheet generator</p>
              <button
                type="button"
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
                className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title={isDark ? '切换到白天模式' : '切换到黑暗模式'}
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-gray-100" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21.64 13a9 9 0 11-10.63-10.63 1 1 0 01.91 1.77A7 7 0 1019.87 12.1a1 1 0 011.77.9z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 4a1 1 0 011 1v2a1 1 0 11-2 0V5a1 1 0 011-1zm0 12a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM4 11a1 1 0 011-1h2a1 1 0 110 2H5a1 1 0 01-1-1zm12 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM6.22 6.22a1 1 0 011.42 0l1.41 1.41a1 1 0 11-1.41 1.41L6.22 7.64a1 1 0 010-1.42zm8.73 8.73a1 1 0 011.42 0l1.41 1.41a1 1 0 01-1.41 1.41l-1.42-1.41a1 1 0 010-1.41zM6.22 17.78a1 1 0 010-1.42l1.41-1.41a1 1 0 111.41 1.41l-1.41 1.41a1 1 0 01-1.42 0zm8.73-8.73a1 1 0 010-1.42l1.41-1.41a1 1 0 111.41 1.41l-1.41 1.41a1 1 0 01-1.42 0zM12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Input Content</h2>
              <FileUpload onFileSelect={handleFileSelect} onUrlSubmit={handleUrlSubmit} />
            </div>
            
            <ContentProcessor onProcessingComplete={handleProcessingComplete} />
          </div>

          {/* Middle Column - Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative">
              <div
                ref={exportRef}
                className="mx-auto overflow-auto"
                style={{
                  width: cheatsheetData ? (window.innerWidth >= 1024 ? 1200 : 720) : undefined,
                  height: cheatsheetData ? (window.innerWidth >= 1024 ? 800 : 1080) : undefined
                }}
              >
                <CheatsheetPreview
                  items={cheatsheetData?.items || []}
                  title={cheatsheetData?.title || 'Cheatsheet'}
                />
              </div>
              {isLoading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">{loadingMessage || 'Processing...'}</span>
                  </div>
                </div>
              )}
            </div>
            
            {cheatsheetData && (
              <ExportPanel targetRef={exportRef as any} />
            )}
          </div>
        </div>
      </main>

    </div>
  )
}