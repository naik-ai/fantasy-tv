import { useEffect, useState } from 'react'
import { loadString, saveString } from '@/lib/storage'

const STORAGE_KEY = 'fantasy-tv-theme'
export const THEMES = ['graphite', 'ferrari']

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const v = loadString(STORAGE_KEY, 'graphite')
    return THEMES.includes(v) ? v : 'graphite'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    saveString(STORAGE_KEY, theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'ferrari' ? '#F2EFE8' : '#0F0F10')
    }
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'graphite' ? 'ferrari' : 'graphite'))

  return { theme, setTheme, toggle }
}
