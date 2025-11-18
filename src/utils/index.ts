import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export function isValidPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export const colorSchemes = [
  'bg-gradient-to-br from-blue-500 to-purple-600',
  'bg-gradient-to-br from-green-500 to-teal-600',
  'bg-gradient-to-br from-orange-500 to-red-600',
  'bg-gradient-to-br from-purple-500 to-pink-600',
  'bg-gradient-to-br from-yellow-500 to-orange-600',
  'bg-gradient-to-br from-indigo-500 to-blue-600',
  'bg-gradient-to-br from-pink-500 to-rose-600',
  'bg-gradient-to-br from-cyan-500 to-blue-600'
]

export function getRandomColorScheme(): string {
  return colorSchemes[Math.floor(Math.random() * colorSchemes.length)]
}