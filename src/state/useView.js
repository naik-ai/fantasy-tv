import { useEffect, useState } from 'react'

export const VIEWS = ['overview', 'leaderboard', 'compare', 'graphs', 'export']

function readView() {
  const params = new URLSearchParams(window.location.search)
  const v = params.get('view')
  return VIEWS.includes(v) ? v : 'overview'
}

export function useView() {
  const [view, setViewState] = useState(() => (typeof window === 'undefined' ? 'overview' : readView()))

  useEffect(() => {
    const onPop = () => setViewState(readView())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function setView(next) {
    if (!VIEWS.includes(next)) return
    const url = new URL(window.location.href)
    url.searchParams.set('view', next)
    window.history.pushState({}, '', url)
    setViewState(next)
  }

  return { view, setView }
}
