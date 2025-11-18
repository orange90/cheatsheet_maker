import { create } from 'zustand'
import { CheatsheetData, CheatsheetItem } from '@/types'

interface AppState {
  // UI状态
  isLoading: boolean
  loadingMessage: string
  error: string | null
  
  // 数据状态
  cheatsheetData: CheatsheetData | null
  inputContent: string
  selectedLanguage: 'zh' | 'en'
  
  // 方法
  setLoading: (loading: boolean, message?: string) => void
  setError: (error: string | null) => void
  setCheatsheetData: (data: CheatsheetData) => void
  setInputContent: (content: string) => void
  setSelectedLanguage: (lang: 'zh' | 'en') => void
  addCheatsheetItem: (item: CheatsheetItem) => void
  removeCheatsheetItem: (id: string) => void
  updateCheatsheetItem: (id: string, updates: Partial<CheatsheetItem>) => void
  clearAll: () => void
}

export const useStore = create<AppState>((set) => ({
  // 初始状态
  isLoading: false,
  loadingMessage: '',
  error: null,
  cheatsheetData: null,
  inputContent: '',
  selectedLanguage: 'zh',
  
  // 方法实现
  setLoading: (loading, message = '') => set({ isLoading: loading, loadingMessage: message }),
  setError: (error) => set({ error }),
  setCheatsheetData: (data) => set({ cheatsheetData: data }),
  setInputContent: (content) => set({ inputContent: content }),
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
  
  addCheatsheetItem: (item) => set((state) => ({
    cheatsheetData: state.cheatsheetData ? {
      ...state.cheatsheetData,
      items: [...state.cheatsheetData.items, item]
    } : {
      title: 'Cheatsheet',
      language: state.selectedLanguage,
      items: [item]
    }
  })),
  
  removeCheatsheetItem: (id) => set((state) => ({
    cheatsheetData: state.cheatsheetData ? {
      ...state.cheatsheetData,
      items: state.cheatsheetData.items.filter(item => item.id !== id)
    } : null
  })),
  
  updateCheatsheetItem: (id, updates) => set((state) => ({
    cheatsheetData: state.cheatsheetData ? {
      ...state.cheatsheetData,
      items: state.cheatsheetData.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    } : null
  })),
  
  clearAll: () => set({
    isLoading: false,
    loadingMessage: '',
    error: null,
    cheatsheetData: null,
    inputContent: ''
  })
}))