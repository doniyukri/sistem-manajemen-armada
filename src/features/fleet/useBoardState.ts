import { useCallback, useEffect, useState } from 'react'
import { boardSearch, parseBoardSearch, type BoardState } from './boardUrl.ts'

export function useBoardState() {
  const [state, setState] = useState(() => parseBoardSearch(window.location.search))

  useEffect(() => {
    const onPop = () => setState(parseBoardSearch(window.location.search))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const commit = useCallback((next: BoardState, mode: 'push' | 'replace') => {
    const nextUrl = `${window.location.pathname}${boardSearch(next)}`
    const currentUrl = `${window.location.pathname}${window.location.search}`
    if (nextUrl !== currentUrl) {
      if (mode === 'push') window.history.pushState(null, '', nextUrl)
      else window.history.replaceState(null, '', nextUrl)
    }
    setState(next)
  }, [])

  return { state, commit }
}
