import { useState } from 'react'
import { Download, Monitor, Smartphone, Settings } from 'lucide-react'
import { cn } from '@/utils'
import { ExportService } from '@/services/export'
import { ExportFormat } from '@/types'

interface ExportPanelProps {
  targetRef: React.RefObject<HTMLElement>
}

export function ExportPanel({ targetRef }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<'desktop' | 'mobile'>('desktop')

  const exportFormats: ExportFormat[] = ExportService.getExportFormats()
  const currentFormat = exportFormats.find(f => f.type === selectedFormat)!

  const handleExport = async () => {
    if (!targetRef.current) {
      alert('No content to export')
      return
    }

    setIsExporting(true)

    try {
      await ExportService.exportToPNG(targetRef.current, currentFormat)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Export Options</h3>
        <Settings className="w-5 h-5 text-gray-400" />
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Choose Format</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedFormat('desktop')}
            className={cn(
              'flex flex-col items-center p-4 rounded-lg border-2 transition-all',
              selectedFormat === 'desktop'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            )}
          >
            <Monitor className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Desktop</span>
            <span className="text-xs text-gray-500 mt-1">1920×1080</span>
          </button>

          <button
            onClick={() => setSelectedFormat('mobile')}
            className={cn(
              'flex flex-col items-center p-4 rounded-lg border-2 transition-all',
              selectedFormat === 'mobile'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            )}
          >
            <Smartphone className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Mobile</span>
            <span className="text-xs text-gray-500 mt-1">1080×1920</span>
          </button>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={cn(
          'w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all',
          isExporting
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
        )}
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Export as PNG</span>
          </>
        )}
      </button>

      {/* Format Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          {selectedFormat === 'desktop' ? (
            <Monitor className="w-5 h-5 text-gray-600 mt-0.5" />
          ) : (
            <Smartphone className="w-5 h-5 text-gray-600 mt-0.5" />
          )}
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">
              {selectedFormat === 'desktop' ? 'Desktop Format' : 'Mobile Format'}
            </p>
            <p>
              {selectedFormat === 'desktop' 
                ? 'Optimized for desktop viewing and presentations. Landscape orientation with 1920×1080 resolution.'
                : 'Optimized for mobile sharing and social media. Portrait orientation with 1080×1920 resolution.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}