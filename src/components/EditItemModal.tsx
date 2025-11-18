import { useState } from 'react'
import { X, Edit3 } from 'lucide-react'
import { cn } from '@/utils'
import { CheatsheetItem } from '@/types'

interface EditItemModalProps {
  item: CheatsheetItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (item: CheatsheetItem) => void
}

export function EditItemModal({ item, isOpen, onClose, onSave }: EditItemModalProps) {
  const [title, setTitle] = useState(item?.title || '')
  const [content, setContent] = useState(item?.content || '')
  const [category, setCategory] = useState(item?.category || '')

  if (!isOpen || !item) return null

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      return
    }

    onSave({
      ...item,
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || undefined
    })
    
    onClose()
  }

  const handleClose = () => {
    // Reset form
    setTitle(item?.title || '')
    setContent(item?.content || '')
    setCategory(item?.category || '')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit3 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Edit Card</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter card title..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter card content..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category (optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Basics, Advanced, Tips..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className={cn(
              'px-6 py-2 rounded-lg font-medium transition-colors',
              title.trim() && content.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}