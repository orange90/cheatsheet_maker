import * as pdfjsLib from 'pdfjs-dist'
import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs'

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString()

export class PDFProcessor {
  static async extractTextFromPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      let fullText = ''
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        
        fullText += pageText + '\n\n'
      }
      
      return fullText.trim()
    } catch (error) {
      console.error('PDF processing error:', error)
      throw new Error('Failed to extract text from PDF')
    }
  }

  static validatePDFFile(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  }

  static getPDFFileSize(file: File): string {
    const bytes = file.size
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}