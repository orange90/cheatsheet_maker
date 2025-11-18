import html2canvas from 'html2canvas'
import { ExportFormat } from '@/types'

export class ExportService {
  static async exportToPNG(element: HTMLElement, format: ExportFormat): Promise<void> {
    try {
      await (document as any).fonts?.ready
      window.scrollTo(0, 0)
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: Math.max(2, window.devicePixelRatio || 2),
        useCORS: true,
        allowTaint: true,
        logging: false
      })

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `cheatsheet-${format.name}-${Date.now()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } catch (error) {
      console.error('PNG export error:', error)
      throw new Error('Failed to export as PNG')
    }
  }

  static getExportFormats(): ExportFormat[] {
    return [
      {
        type: 'desktop',
        width: 1200,
        height: 800,
        name: 'desktop'
      },
      {
        type: 'mobile',
        width: 720,
        height: 1080,
        name: 'mobile'
      }
    ]
  }
}