import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Link, AlertCircle } from 'lucide-react'
import { cn } from '@/utils'
import { useStore } from '@/stores'
import { isValidPdfFile, isValidUrl } from '@/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onUrlSubmit: (url: string) => void
}

export function FileUpload({ onFileSelect, onUrlSubmit }: FileUploadProps) {
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const { setError } = useStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && isValidPdfFile(file)) {
      onFileSelect(file)
      setError(null)
    } else {
      setError('Please upload a valid PDF file')
    }
  }, [onFileSelect, setError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  })

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      setUrlError('Please enter a URL')
      return
    }
    
    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid URL')
      return
    }
    
    setUrlError('')
    onUrlSubmit(url)
  }

  return (
    <div className="space-y-6">
      {/* PDF Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Upload PDF</h3>
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
            isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the PDF here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">Drag & drop a PDF file here, or click to select</p>
              <p className="text-sm text-gray-500">Only PDF files are supported</p>
            </div>
          )}
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Or Enter Web URL</h3>
        <form onSubmit={handleUrlSubmit} className="space-y-3">
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {urlError && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {urlError}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Process URL
          </button>
        </form>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Supported formats:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>PDF files (max 10MB)</li>
              <li>Web articles and documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}