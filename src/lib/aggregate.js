import { calcMatchPoints } from './formula'

export function aggregatePlayers(rows, formula) {
  const map = new Map()
  rows.forEach((r) => {
    const id = String(r.player_id)
    const points = calcMatchPoints(r, formula)
    if (!map.has(id)) {
      map.set(id, {
        player_id: r.player_id,
        player_name: r.player_name,
        full_name: r.full_name,
        team: r.team,
        position: r.position,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0,
        xg: 0,
        xa: 0,
        totalPoints: 0,
        sumSq: 0,
      })
    }
    const p = map.get(id)
    p.matches += 1
    p.minutes += r.minutes_played
    p.goals += r.goals
    p.assists += r.assists
    p.xg += r.xg
    p.xa += r.xa
    p.totalPoints += points
    p.sumSq += points * points
  })

  return [...map.values()].map((p) => {
    const avgPoints = p.matches ? p.totalPoints / p.matches : 0
    const variance = p.matches ? p.sumSq / p.matches - avgPoints * avgPoints : 0
    return {
      ...p,
      avgPoints,
      consistency: Math.sqrt(Math.max(variance, 0)),
    }
  })
}

export function buildComparison(baseAgg, candAgg, sortBy, sortDir) {
  const baseSorted = [...baseAgg].sort((a, b) => b.totalPoints - a.totalPoints)
  const baselineRankMap = new Map(baseSorted.map((p, i) => [String(p.player_id), i + 1]))
  const candMap = new Map(candAgg.map((p) => [String(p.player_id), p]))

  const rowsCmp = baseAgg.map((b) => {
    const c = candMap.get(String(b.player_id)) || b
    const baseRank = baselineRankMap.get(String(b.player_id)) || 9999
    return {
      ...c,
      baselinePoints: b.totalPoints,
      deltaPoints: c.totalPoints - b.totalPoints,
      baselineRank: baseRank,
    }
  })

  const sortedForRank = [...rowsCmp].sort((a, b) => b.totalPoints - a.totalPoints)
  const final = sortedForRank.map((p, i) => ({ ...p, rank: i + 1, deltaRank: p.baselineRank - (i + 1) }))

  return final.sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    return ((a[sortBy] ?? 0) - (b[sortBy] ?? 0)) * dir
  })
}
