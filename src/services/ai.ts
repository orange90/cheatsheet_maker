import axios from 'axios'
import { AIResponse } from '@/types'

const API_URL = import.meta.env.VITE_SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions'
const API_TOKEN = import.meta.env.VITE_SILICONFLOW_API_TOKEN || ''
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'moonshotai/Kimi-K2-Thinking'

class AIService {
  private async makeRequest(messages: any[]): Promise<AIResponse> {
    try {
      const useServer = true
      const response = useServer
        ? await axios.post(
            `/api/ai`,
            { model: AI_MODEL, messages, temperature: 0.7, max_tokens: 4000, stream: false },
            { headers: { 'Content-Type': 'application/json' } }
          )
        : await axios.post(
            API_URL,
            { model: AI_MODEL, messages, temperature: 0.7, max_tokens: 4000, stream: false },
            { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' } }
          )

      return {
        success: true,
        data: response.data.choices?.[0]?.message?.content || response.data?.message?.content || ''
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Unknown error occurred'
      console.error('AI API Error:', message)
      return {
        success: false,
        error: message
      }
    }
  }

  async extractContentFromText(text: string): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'Create a concise cheatsheet. Output plain text lines in this format only: \nCheatsheet Title: <short title>\nSection: <heading>\n- <point title>: <point detail>\nLimit to at most 12 points total across all sections. No emojis, no decorative symbols, no boilerplate or navigation content. Keep each point under 120 characters.'
      },
      {
        role: 'user',
        content: `Summarize into a concise cheatsheet using the exact format specified. Remove irrelevant content (nav, footer, ads, disclaimers).\n\n${text}`
      }
    ]

    return this.makeRequest(messages)
  }

  async translateContent(content: string, targetLang: 'zh' | 'en'): Promise<AIResponse> {
    const targetLanguage = targetLang === 'zh' ? 'Chinese' : 'English'
    const sourceLanguage = targetLang === 'zh' ? 'English' : 'Chinese'
    
    const messages = [
      {
        role: 'system',
        content: `Translate the cheatsheet from ${sourceLanguage} to ${targetLanguage} while strictly preserving the structure and format: \nCheatsheet Title: <...>\nSection: <...>\n- <point title>: <point detail>\nDo not add emojis or decorative symbols. Keep at most 12 points in total.`
      },
      {
        role: 'user',
        content: `Please translate the following content to ${targetLanguage}:\n\n${content}`
      }
    ]

    return this.makeRequest(messages)
  }

  async processPdfContent(content: string): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'You are an expert at analyzing PDF documents and extracting the most important information. Create a concise, well-structured summary with key points that would be perfect for a cheatsheet.'
      },
      {
        role: 'user',
        content: `Please analyze this PDF content and extract the key points for a cheatsheet:\n\n${content}`
      }
    ]

    return this.makeRequest(messages)
  }

  async processWebContent(content: string): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'You are skilled at analyzing web content and creating structured summaries. Extract the main points and organize them clearly for a cheatsheet format.'
      },
      {
        role: 'user',
        content: `Please analyze this web content and create key points for a cheatsheet:\n\n${content}`
      }
    ]

    return this.makeRequest(messages)
  }
}

export const aiService = new AIService()