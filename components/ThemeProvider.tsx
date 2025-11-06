'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // localStorage에서 테마 가져오기, 없으면 시스템 설정 확인
    try {
      const savedTheme = localStorage.getItem('theme') as Theme | null
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      const initialTheme = savedTheme || systemTheme
      setTheme(initialTheme)
      // 초기 렌더링 시 즉시 테마 적용
      const root = document.documentElement
      if (initialTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    } catch (error) {
      // localStorage나 window 접근 실패 시 기본값 사용
    }
  }, [])

  const updateTheme = (newTheme: Theme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      if (newTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', newTheme)
      }
    } catch (error) {
      // localStorage 저장 실패 시 무시
    }
    updateTheme(newTheme)
  }

  // 항상 context를 제공하되, mounted 전에는 기본값 사용
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

