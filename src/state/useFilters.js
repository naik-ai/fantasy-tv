import { useState } from 'react'

export function useFilters() {
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState('ALL')
  const [team, setTeam] = useState('ALL')
  const [gameweek, setGameweek] = useState('ALL')
  const [minMinutes, setMinMinutes] = useState('0')
  const [sortBy, setSortBy] = useState('totalPoints')
  const [sortDir, setSortDir] = useState('desc')

  function reset() {
    setSearch('')
    setPosition('ALL')
    setTeam('ALL')
    setGameweek('ALL')
    setMinMinutes('0')
    setSortBy('totalPoints')
    setSortDir('desc')
  }

  return {
    search, setSearch,
    position, setPosition,
    team, setTeam,
    gameweek, setGameweek,
    minMinutes, setMinMinutes,
    sortBy, setSortBy,
    sortDir, setSortDir,
    reset,
  }
}

export function applyFilters(rows, f) {
  const q = f.search.trim().toLowerCase()
  const minM = Number(f.minMinutes || 0)
  return rows.filter((r) => {
    if (q && !(r.player_name?.toLowerCase().includes(q) || r.full_name?.toLowerCase().includes(q))) return false
    if (f.position !== 'ALL' && r.position !== f.position) return false
    if (f.team !== 'ALL' && r.team !== f.team) return false
    if (f.gameweek !== 'ALL' && String(r.gameweek) !== f.gameweek) return false
    if (r.minutes_played < minM) return false
    return true
  })
}
