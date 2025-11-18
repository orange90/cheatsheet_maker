import { CheatsheetItem } from '@/types'
import { cn } from '@/utils'

interface CheatsheetCardProps {
  item: CheatsheetItem
}

export function CheatsheetCard({ item }: CheatsheetCardProps) {
  return (
    <div className={cn(
      'rounded-xl shadow-lg p-6 text-white transition-all duration-300',
      'hover:shadow-xl',
      item.color || 'bg-gradient-to-br from-blue-500 to-purple-600'
    )}>
      <div className="space-y-3">
        <h3 className="text-xl font-bold leading-tight pr-12">{item.title}</h3>
        <p className="text-sm opacity-90 leading-relaxed">{item.content}</p>
        {item.category && (
          <div className="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium">
            {item.category}
          </div>
        )}
      </div>
    </div>
  )
}

interface CheatsheetPreviewProps {
  items: CheatsheetItem[]
  title: string
}

export function CheatsheetPreview({ 
  items, 
  title, 
 
}: CheatsheetPreviewProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No items yet</h3>
        <p className="text-gray-500 mb-6">Generate a cheatsheet from your content to see it here</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="p-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <CheatsheetCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  )
}