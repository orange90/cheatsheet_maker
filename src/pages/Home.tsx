import { useRef } from 'react'
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
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Cheatsheet Maker</h1>
            </div>
            <p className="text-gray-600">AI-powered cheatsheet generator</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Input Content</h2>
              <FileUpload onFileSelect={handleFileSelect} onUrlSubmit={handleUrlSubmit} />
            </div>
            
            <ContentProcessor onProcessingComplete={handleProcessingComplete} />
          </div>

          {/* Middle Column - Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative">
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
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-700 font-medium text-sm">{loadingMessage || 'Processing...'}</span>
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