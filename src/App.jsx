import { useEffect, useMemo, useState } from 'react'
import { BarChart3, ChevronLeft, ChevronRight, Download, Filter, LineChart, Search, Settings2, SlidersHorizontal, Trophy, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import './App.css'

const numberFields = [
  'gameweek',
  'minutes_played',
  'goals',
  'assists',
  'shots_on_target',
  'team_goals_conceded',
  'tackles_won',
  'interceptions',
  'clearances',
  'blocks',
  'chances_created',
  'successful_dribbles',
  'accurate_crosses',
  'accurate_passes',
  'accurate_passes_percent',
  'saves',
  'fouls_committed',
  'penalties_scored',
  'penalties_missed',
  'yellow_cards',
  'red_cards',
  'recoveries',
  'duels_won',
  'aerial_duels_won',
  'was_fouled',
  'xg',
  'xa',
]

const DEFAULT_FORMULA = {
  minutes_0_59: 1,
  minutes_60_89: 2,
  minutes_90_plus: 3,
  goals: 6,
  assists: 4,
  shots_on_target: 1,
  cs: 4,
  tackles_won: 0.5,
  interceptions: 0.5,
  clearances: 0.5,
  blocks: 0.5,
  chances_created: 1,
  successful_dribbles: 0.5,
  accurate_crosses: 0.5,
  pass_acc_threshold: 85,
  pass_acc_bonus: 2,
  saves: 0.5,
  fouls_committed: -0.25,
  penalties_missed: -3,
  yellow_cards: -1,
  red_cards: -3,
}

const PRESETS = {
  default: DEFAULT_FORMULA,
  aggressive_attack: {
    ...DEFAULT_FORMULA,
    goals: 7,
    assists: 5,
    shots_on_target: 1.5,
    chances_created: 1.5,
    successful_dribbles: 0.75,
    cs: 2,
  },
  balanced: {
    ...DEFAULT_FORMULA,
    goals: 6,
    assists: 4,
    tackles_won: 0.6,
    interceptions: 0.6,
    clearances: 0.6,
    blocks: 0.6,
    yellow_cards: -0.75,
    red_cards: -2.5,
  },
  defensive_value: {
    ...DEFAULT_FORMULA,
    goals: 5,
    assists: 3.5,
    cs: 5,
    tackles_won: 0.9,
    interceptions: 0.9,
    clearances: 0.9,
    blocks: 0.9,
    saves: 0.7,
    fouls_committed: -0.2,
  },
}

const FORMULA_FIELDS = [
  ['goals', 'Goals'],
  ['assists', 'Assists'],
  ['shots_on_target', 'Shots on Target'],
  ['cs', 'Clean Sheet'],
  ['tackles_won', 'Tackles Won'],
  ['interceptions', 'Interceptions'],
  ['clearances', 'Clearances'],
  ['blocks', 'Blocks'],
  ['chances_created', 'Chances Created'],
  ['successful_dribbles', 'Successful Dribbles'],
  ['accurate_crosses', 'Accurate Crosses'],
  ['saves', 'Saves'],
  ['fouls_committed', 'Fouls Committed'],
  ['penalties_missed', 'Penalty Missed'],
  ['yellow_cards', 'Yellow Card'],
  ['red_cards', 'Red Card'],
  ['minutes_0_59', 'Minutes 1-59'],
  ['minutes_60_89', 'Minutes 60-89'],
  ['minutes_90_plus', 'Minutes 90+'],
  ['pass_acc_threshold', 'Pass Acc Threshold'],
  ['pass_acc_bonus', 'Pass Acc Bonus'],
]

function splitCsvLine(line) {
  const out = []
  let cur = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/)
  const headers = splitCsvLine(lines[0])
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line)
    const row = {}
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? ''
    })
    numberFields.forEach((f) => {
      row[f] = Number(row[f] || 0)
    })
    return row
  })
}

function fmt(v, d = 2) {
  return Number(v || 0).toFixed(d)
}

function round(v) {
  return Number.parseFloat(String(v || 0))
}

function calcMatchPoints(r, formula) {
  const minutePoints = r.minutes_played >= 90 ? formula.minutes_90_plus : r.minutes_played >= 60 ? formula.minutes_60_89 : r.minutes_played > 0 ? formula.minutes_0_59 : 0
  const cleanSheet = r.team_goals_conceded === 0 ? formula.cs : 0
  const passAccBonus = r.accurate_passes_percent >= formula.pass_acc_threshold ? formula.pass_acc_bonus : 0

  return (
    minutePoints +
    r.goals * formula.goals +
    r.assists * formula.assists +
    r.shots_on_target * formula.shots_on_target +
    cleanSheet +
    r.tackles_won * formula.tackles_won +
    r.interceptions * formula.interceptions +
    r.clearances * formula.clearances +
    r.blocks * formula.blocks +
    r.chances_created * formula.chances_created +
    r.successful_dribbles * formula.successful_dribbles +
    r.accurate_crosses * formula.accurate_crosses +
    passAccBonus +
    r.saves * formula.saves +
    r.fouls_committed * formula.fouls_committed +
    r.penalties_missed * formula.penalties_missed +
    r.yellow_cards * formula.yellow_cards +
    r.red_cards * formula.red_cards
  )
}

function aggregatePlayers(rows, formula) {
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

function TinyBars({ data, color = '#2563eb' }) {
  const width = 560
  const height = 190
  const max = Math.max(1, ...data.map((d) => d.value))
  const barGap = 6
  const barWidth = Math.max(8, Math.floor((width - barGap * (data.length - 1)) / Math.max(1, data.length)))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className='h-48 w-full'>
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 30)
        const x = i * (barWidth + barGap)
        const y = height - h - 20
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barWidth} height={h} rx='3' fill={color} opacity='0.9' />
          </g>
        )
      })}
      <line x1='0' y1={height - 20} x2={width} y2={height - 20} stroke='currentColor' strokeOpacity='0.25' />
    </svg>
  )
}

function TinyLines({ seriesA, seriesB }) {
  const width = 560
  const height = 190
  const points = [...seriesA.map((x) => x.value), ...seriesB.map((x) => x.value)]
  const max = Math.max(1, ...points)
  const min = Math.min(0, ...points)
  const n = Math.max(seriesA.length, seriesB.length, 2)

  const toXY = (value, index) => {
    const x = (index / (n - 1)) * (width - 20) + 10
    const y = height - 20 - ((value - min) / (max - min || 1)) * (height - 40)
    return [x, y]
  }

  const pathOf = (series) =>
    series
      .map((p, i) => {
        const [x, y] = toXY(p.value, i)
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className='h-48 w-full'>
      <line x1='10' y1={height - 20} x2={width - 10} y2={height - 20} stroke='currentColor' strokeOpacity='0.2' />
      <path d={pathOf(seriesA)} fill='none' stroke='#2563eb' strokeWidth='2.5' />
      <path d={pathOf(seriesB)} fill='none' stroke='#f97316' strokeWidth='2.5' />
    </svg>
  )
}

export default function App() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [position, setPosition] = useState('ALL')
  const [team, setTeam] = useState('ALL')
  const [gameweek, setGameweek] = useState('ALL')
  const [minMinutes, setMinMinutes] = useState('0')

  const [sortBy, setSortBy] = useState('totalPoints')
  const [sortDir, setSortDir] = useState('desc')

  const [baselinePreset, setBaselinePreset] = useState('default')
  const [candidatePreset, setCandidatePreset] = useState('default')
  const [candidateFormula, setCandidateFormula] = useState(DEFAULT_FORMULA)

  const [leftOpen, setLeftOpen] = useState(false)
  const [comparePlayerA, setComparePlayerA] = useState('ALL')
  const [comparePlayerB, setComparePlayerB] = useState('ALL')
  const [compareTeamA, setCompareTeamA] = useState('ALL')
  const [compareTeamB, setCompareTeamB] = useState('ALL')
  const [comparePosA, setComparePosA] = useState('ALL')
  const [comparePosB, setComparePosB] = useState('ALL')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/data/pl_2025_26_player_match_stats.csv', { cache: 'no-store' })
        if (!res.ok) throw new Error('CSV not found')
        const text = await res.text()
        const parsed = parseCsv(text)
        const requiredFields = ['player_name', 'position', 'team', 'gameweek', 'player_id']
        const missing = requiredFields.filter((f) => !(f in (parsed[0] || {})))
        if (missing.length) throw new Error(`CSV schema mismatch: missing ${missing.join(', ')}`)
        setRows(parsed)
      } catch (e) {
        setError(e.message || 'Failed to load CSV')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const raw = localStorage.getItem('fantasy-tv-candidate-formula')
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      setCandidateFormula({ ...DEFAULT_FORMULA, ...parsed })
      setCandidatePreset('custom')
    } catch {
      setCandidateFormula(DEFAULT_FORMULA)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('fantasy-tv-candidate-formula', JSON.stringify(candidateFormula))
  }, [candidateFormula])

  const teams = useMemo(() => [...new Set(rows.map((r) => r.team))].sort(), [rows])
  const positions = useMemo(() => [...new Set(rows.map((r) => r.position))].sort(), [rows])
  const gameweeks = useMemo(() => [...new Set(rows.map((r) => r.gameweek))].sort((a, b) => a - b), [rows])

  const filteredRows = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.trim().toLowerCase()
        const matchQ = !q || r.player_name.toLowerCase().includes(q) || r.full_name.toLowerCase().includes(q)
        const matchPos = position === 'ALL' || r.position === position
        const matchTeam = team === 'ALL' || r.team === team
        const matchGw = gameweek === 'ALL' || String(r.gameweek) === gameweek
        const matchMin = r.minutes_played >= Number(minMinutes || 0)
        return matchQ && matchPos && matchTeam && matchGw && matchMin
      }),
    [rows, search, position, team, gameweek, minMinutes],
  )

  const baselineFormula = useMemo(() => PRESETS[baselinePreset] || DEFAULT_FORMULA, [baselinePreset])

  const baselineLeaderboardRaw = useMemo(() => aggregatePlayers(filteredRows, baselineFormula), [filteredRows, baselineFormula])
  const candidateLeaderboardRaw = useMemo(() => aggregatePlayers(filteredRows, candidateFormula), [filteredRows, candidateFormula])

  const baselineRankMap = useMemo(() => {
    const sorted = [...baselineLeaderboardRaw].sort((a, b) => b.totalPoints - a.totalPoints)
    return new Map(sorted.map((p, i) => [String(p.player_id), i + 1]))
  }, [baselineLeaderboardRaw])

  const comparison = useMemo(() => {
    const map = new Map(candidateLeaderboardRaw.map((p) => [String(p.player_id), p]))
    const rowsCmp = baselineLeaderboardRaw.map((b) => {
      const c = map.get(String(b.player_id)) || b
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
      return (a[sortBy] - b[sortBy]) * dir
    })
  }, [candidateLeaderboardRaw, baselineLeaderboardRaw, baselineRankMap, sortBy, sortDir])

  const datasetMeta = useMemo(() => {
    const players = new Set(rows.map((r) => r.player_id)).size
    const teamsCount = new Set(rows.map((r) => r.team)).size
    const gws = gameweeks.length ? `${gameweeks[0]}-${gameweeks[gameweeks.length - 1]}` : '-'
    return { rows: rows.length, players, teams: teamsCount, gws }
  }, [rows, gameweeks])

  const kpis = useMemo(() => {
    const top = [...comparison].sort((a, b) => b.totalPoints - a.totalPoints)[0]
    return {
      players: comparison.length,
      rows: filteredRows.length,
      top: top?.player_name || '-',
      topPts: top ? fmt(top.totalPoints, 1) : '0.0',
      avg: comparison.length ? fmt(comparison.reduce((s, p) => s + p.totalPoints, 0) / comparison.length, 1) : '0.0',
    }
  }, [comparison, filteredRows])

  const topBarData = useMemo(
    () =>
      [...comparison]
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 12)
        .map((p) => ({ label: p.player_name, value: p.totalPoints })),
    [comparison],
  )

  const moversData = useMemo(
    () =>
      [...comparison]
        .sort((a, b) => Math.abs(b.deltaPoints) - Math.abs(a.deltaPoints))
        .slice(0, 12)
        .map((p) => ({ label: p.player_name, value: p.deltaPoints })),
    [comparison],
  )

  const gwTrend = useMemo(() => {
    const gws = [...new Set(filteredRows.map((r) => r.gameweek))].sort((a, b) => a - b)
    return gws.map((gw) => {
      const rowsGw = filteredRows.filter((r) => r.gameweek === gw)
      const baseAvg = rowsGw.length ? rowsGw.reduce((s, r) => s + calcMatchPoints(r, baselineFormula), 0) / rowsGw.length : 0
      const candAvg = rowsGw.length ? rowsGw.reduce((s, r) => s + calcMatchPoints(r, candidateFormula), 0) / rowsGw.length : 0
      return { gw, baseAvg, candAvg }
    })
  }, [filteredRows, baselineFormula, candidateFormula])

  const positionData = useMemo(() => {
    const map = new Map()
    comparison.forEach((p) => {
      map.set(p.position, (map.get(p.position) || 0) + p.totalPoints)
    })
    return [...map.entries()].map(([label, value]) => ({ label, value }))
  }, [comparison])

  const teamData = useMemo(() => {
    const map = new Map()
    comparison.forEach((p) => {
      map.set(p.team, (map.get(p.team) || 0) + p.totalPoints)
    })
    return [...map.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12)
  }, [comparison])

  const playersList = useMemo(() => [...comparison].sort((a, b) => a.player_name.localeCompare(b.player_name)), [comparison])

  const playerA = useMemo(() => playersList.find((p) => String(p.player_id) === comparePlayerA), [playersList, comparePlayerA])
  const playerB = useMemo(() => playersList.find((p) => String(p.player_id) === comparePlayerB), [playersList, comparePlayerB])

  const teamAStats = useMemo(() => comparison.filter((p) => p.team === compareTeamA), [comparison, compareTeamA])
  const teamBStats = useMemo(() => comparison.filter((p) => p.team === compareTeamB), [comparison, compareTeamB])

  const posAStats = useMemo(() => comparison.filter((p) => p.position === comparePosA), [comparison, comparePosA])
  const posBStats = useMemo(() => comparison.filter((p) => p.position === comparePosB), [comparison, comparePosB])

  function onPresetCandidate(value) {
    setCandidatePreset(value)
    if (value === 'custom') return
    const preset = PRESETS[value] || DEFAULT_FORMULA
    setCandidateFormula({ ...preset })
  }

  function updateWeight(key, next) {
    setCandidatePreset('custom')
    setCandidateFormula((prev) => ({ ...prev, [key]: round(next) }))
  }

  function resetCandidate() {
    setCandidatePreset('default')
    setCandidateFormula({ ...DEFAULT_FORMULA })
  }

  function downloadCsv() {
    const headers = ['rank', 'baselineRank', 'deltaRank', 'player', 'team', 'position', 'candidatePoints', 'baselinePoints', 'deltaPoints', 'avgPoints', 'matches', 'consistency']
    const lines = comparison.map((p) => [p.rank, p.baselineRank, p.deltaRank, p.player_name, p.team, p.position, fmt(p.totalPoints, 2), fmt(p.baselinePoints, 2), fmt(p.deltaPoints, 2), fmt(p.avgPoints, 2), p.matches, fmt(p.consistency, 2)].join(','))
    const csv = [headers.join(','), ...lines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fantasy_formula_compare.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className='mx-auto max-w-7xl p-6'>Loading dashboard...</div>
  if (error) return <div className='mx-auto max-w-7xl p-6 text-red-500'>Error: {error}</div>

  return (
    <div className='dashboard-shell'>
      <aside className={`tuning-sidebar ${leftOpen ? 'open' : ''}`}>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='text-base font-semibold'>Formula Tuner</h2>
          <Button variant='ghost' size='icon-sm' onClick={() => setLeftOpen(false)} className='lg:hidden'>
            <ChevronLeft className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-y-3'>
          <div>
            <div className='mb-1 text-xs text-muted-foreground'>Baseline preset</div>
            <Select value={baselinePreset} onValueChange={setBaselinePreset}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value='default'>Default</SelectItem>
                <SelectItem value='aggressive_attack'>Aggressive Attack</SelectItem>
                <SelectItem value='balanced'>Balanced</SelectItem>
                <SelectItem value='defensive_value'>Defensive Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className='mb-1 text-xs text-muted-foreground'>Candidate preset</div>
            <Select value={candidatePreset} onValueChange={onPresetCandidate}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value='default'>Default</SelectItem>
                <SelectItem value='aggressive_attack'>Aggressive Attack</SelectItem>
                <SelectItem value='balanced'>Balanced</SelectItem>
                <SelectItem value='defensive_value'>Defensive Value</SelectItem>
                <SelectItem value='custom'>Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className='my-4' />

        <div className='formula-scroll space-y-3'>
          {FORMULA_FIELDS.map(([key, label]) => (
            <div key={key}>
              <div className='mb-1 flex items-center justify-between text-xs'>
                <span>{label}</span>
                <span className='font-medium'>{fmt(candidateFormula[key], key.includes('threshold') ? 0 : 2)}</span>
              </div>
              <Input
                type='number'
                step={key.includes('threshold') ? '1' : '0.25'}
                value={candidateFormula[key]}
                onChange={(e) => updateWeight(key, Number(e.target.value || 0))}
              />
            </div>
          ))}
        </div>

        <div className='mt-4 grid grid-cols-2 gap-2'>
          <Button variant='outline' onClick={resetCandidate}>Reset</Button>
          <Button onClick={() => localStorage.setItem('fantasy-tv-candidate-formula', JSON.stringify(candidateFormula))}>Save</Button>
        </div>
      </aside>

      <div className='overlay lg:hidden' onClick={() => setLeftOpen(false)} aria-hidden={!leftOpen} />

      <main className='dashboard-main mx-auto max-w-[1400px] space-y-4 p-3 sm:p-5'>
        <header className='flex flex-wrap items-center gap-2'>
          <Button variant='outline' onClick={() => setLeftOpen((v) => !v)}>
            <Settings2 className='mr-1 h-4 w-4' /> Tune
          </Button>
          <Badge variant='secondary'>PWA ready layout</Badge>
          <Badge variant='secondary'>Rows {datasetMeta.rows}</Badge>
          <Badge variant='secondary'>Players {datasetMeta.players}</Badge>
          <Badge variant='secondary'>Teams {datasetMeta.teams}</Badge>
          <Badge variant='secondary'>GW {datasetMeta.gws}</Badge>
          <Button className='ml-auto' onClick={downloadCsv}>
            <Download className='mr-1 h-4 w-4' /> Export
          </Button>
        </header>

        <section className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          <Card><CardHeader><CardDescription className='flex items-center gap-2'><Users className='h-4 w-4' /> Players</CardDescription><CardTitle>{kpis.players}</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription className='flex items-center gap-2'><Filter className='h-4 w-4' /> Filtered Rows</CardDescription><CardTitle>{kpis.rows}</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Avg Candidate Points</CardDescription><CardTitle>{kpis.avg}</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription className='flex items-center gap-2'><Trophy className='h-4 w-4' /> Top Candidate</CardDescription><CardTitle className='truncate'>{kpis.top}</CardTitle><CardDescription>{kpis.topPts} pts</CardDescription></CardHeader></Card>
        </section>

        <Card>
          <CardHeader><CardTitle>Filters + Sort</CardTitle></CardHeader>
          <CardContent className='grid gap-2 sm:grid-cols-2 xl:grid-cols-6'>
            <div className='relative xl:col-span-2'>
              <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground' />
              <Input className='pl-8' placeholder='Search player' value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={position} onValueChange={setPosition}><SelectTrigger className='w-full'><SelectValue placeholder='Position' /></SelectTrigger><SelectContent><SelectItem value='ALL'>All Positions</SelectItem>{positions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
            <Select value={team} onValueChange={setTeam}><SelectTrigger className='w-full'><SelectValue placeholder='Team' /></SelectTrigger><SelectContent><SelectItem value='ALL'>All Teams</SelectItem>{teams.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            <Select value={gameweek} onValueChange={setGameweek}><SelectTrigger className='w-full'><SelectValue placeholder='GW' /></SelectTrigger><SelectContent><SelectItem value='ALL'>All GWs</SelectItem>{gameweeks.map((gw) => <SelectItem key={gw} value={String(gw)}>GW {gw}</SelectItem>)}</SelectContent></Select>
            <Input type='number' min='0' value={minMinutes} onChange={(e) => setMinMinutes(e.target.value)} placeholder='Min minutes' />

            <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className='w-full'><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value='totalPoints'>Total Points</SelectItem>
              <SelectItem value='avgPoints'>Average Points</SelectItem>
              <SelectItem value='xg'>xG</SelectItem>
              <SelectItem value='xa'>xA</SelectItem>
              <SelectItem value='consistency'>Consistency</SelectItem>
              <SelectItem value='deltaPoints'>Delta Points</SelectItem>
              <SelectItem value='deltaRank'>Delta Rank</SelectItem>
            </SelectContent></Select>

            <Select value={sortDir} onValueChange={setSortDir}><SelectTrigger className='w-full'><SelectValue /></SelectTrigger><SelectContent><SelectItem value='desc'>Desc</SelectItem><SelectItem value='asc'>Asc</SelectItem></SelectContent></Select>
          </CardContent>
        </Card>

        <Tabs defaultValue='impact'>
          <TabsList>
            <TabsTrigger value='impact'><SlidersHorizontal className='mr-1 h-4 w-4' /> Formula Impact</TabsTrigger>
            <TabsTrigger value='graphs'><BarChart3 className='mr-1 h-4 w-4' /> Graphs</TabsTrigger>
            <TabsTrigger value='compare'><LineChart className='mr-1 h-4 w-4' /> Compare</TabsTrigger>
            <TabsTrigger value='raw'>Raw Rows</TabsTrigger>
          </TabsList>

          <TabsContent value='impact'>
            <Card>
              <CardHeader>
                <CardTitle>Ranking Delta Table</CardTitle>
                <CardDescription>Candidate formula vs baseline formula with rank and points movement.</CardDescription>
              </CardHeader>
              <CardContent className='hidden md:block overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Pos</TableHead>
                      <TableHead className='text-right'>Cand Pts</TableHead>
                      <TableHead className='text-right'>Base Pts</TableHead>
                      <TableHead className='text-right'>Δ Pts</TableHead>
                      <TableHead className='text-right'>Rank</TableHead>
                      <TableHead className='text-right'>Base Rank</TableHead>
                      <TableHead className='text-right'>Δ Rank</TableHead>
                      <TableHead className='text-right'>Avg</TableHead>
                      <TableHead className='text-right'>Consistency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparison.slice(0, 200).map((p, i) => (
                      <TableRow key={p.player_id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className='font-medium'>{p.player_name}</TableCell>
                        <TableCell>{p.team}</TableCell>
                        <TableCell>{p.position}</TableCell>
                        <TableCell className='text-right font-semibold'>{fmt(p.totalPoints, 1)}</TableCell>
                        <TableCell className='text-right'>{fmt(p.baselinePoints, 1)}</TableCell>
                        <TableCell className={`text-right ${p.deltaPoints >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(p.deltaPoints, 1)}</TableCell>
                        <TableCell className='text-right'>{p.rank}</TableCell>
                        <TableCell className='text-right'>{p.baselineRank}</TableCell>
                        <TableCell className={`text-right ${p.deltaRank >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{p.deltaRank}</TableCell>
                        <TableCell className='text-right'>{fmt(p.avgPoints, 1)}</TableCell>
                        <TableCell className='text-right'>{fmt(p.consistency, 2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardContent className='space-y-2 md:hidden'>
                {comparison.slice(0, 40).map((p) => (
                  <div key={p.player_id} className='rounded-lg border p-3'>
                    <div className='flex items-center justify-between'>
                      <div className='font-medium'>{p.player_name}</div>
                      <Badge variant='secondary'>{p.position}</Badge>
                    </div>
                    <div className='mt-1 text-sm text-muted-foreground'>{p.team}</div>
                    <div className='mt-2 grid grid-cols-3 gap-2 text-sm'>
                      <div>C {fmt(p.totalPoints, 1)}</div>
                      <div>B {fmt(p.baselinePoints, 1)}</div>
                      <div className={p.deltaPoints >= 0 ? 'text-emerald-600' : 'text-red-600'}>Δ {fmt(p.deltaPoints, 1)}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='graphs'>
            <div className='grid gap-3 xl:grid-cols-2'>
              <Card>
                <CardHeader><CardTitle>Top Players (Candidate)</CardTitle></CardHeader>
                <CardContent><TinyBars data={topBarData} color='#2563eb' /></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Top Movers (Δ Points)</CardTitle></CardHeader>
                <CardContent><TinyBars data={moversData.map((d) => ({ ...d, value: Math.abs(d.value) }))} color='#f97316' /></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Gameweek Trend (Avg Match Points)</CardTitle><CardDescription>Blue: baseline, Orange: candidate</CardDescription></CardHeader>
                <CardContent>
                  <TinyLines
                    seriesA={gwTrend.map((g) => ({ label: String(g.gw), value: g.baseAvg }))}
                    seriesB={gwTrend.map((g) => ({ label: String(g.gw), value: g.candAvg }))}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Position Distribution (Candidate)</CardTitle></CardHeader>
                <CardContent><TinyBars data={positionData} color='#16a34a' /></CardContent>
              </Card>
              <Card className='xl:col-span-2'>
                <CardHeader><CardTitle>Team Contribution (Candidate)</CardTitle></CardHeader>
                <CardContent><TinyBars data={teamData} color='#7c3aed' /></CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='compare'>
            <div className='grid gap-3 xl:grid-cols-3'>
              <Card>
                <CardHeader><CardTitle>Player A vs Player B</CardTitle></CardHeader>
                <CardContent className='space-y-2'>
                  <Select value={comparePlayerA} onValueChange={setComparePlayerA}><SelectTrigger className='w-full'><SelectValue placeholder='Player A' /></SelectTrigger><SelectContent><SelectItem value='ALL'>Select Player A</SelectItem>{playersList.slice(0, 500).map((p) => <SelectItem key={`a-${p.player_id}`} value={String(p.player_id)}>{p.player_name}</SelectItem>)}</SelectContent></Select>
                  <Select value={comparePlayerB} onValueChange={setComparePlayerB}><SelectTrigger className='w-full'><SelectValue placeholder='Player B' /></SelectTrigger><SelectContent><SelectItem value='ALL'>Select Player B</SelectItem>{playersList.slice(0, 500).map((p) => <SelectItem key={`b-${p.player_id}`} value={String(p.player_id)}>{p.player_name}</SelectItem>)}</SelectContent></Select>
                  <div className='rounded-lg border p-3 text-sm'>
                    <div>{playerA ? `${playerA.player_name}: ${fmt(playerA.totalPoints, 1)} pts` : 'Select Player A'}</div>
                    <div>{playerB ? `${playerB.player_name}: ${fmt(playerB.totalPoints, 1)} pts` : 'Select Player B'}</div>
                    {playerA && playerB && <div className='mt-1 font-medium'>Gap: {fmt(playerA.totalPoints - playerB.totalPoints, 1)} pts</div>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Team A vs Team B</CardTitle></CardHeader>
                <CardContent className='space-y-2'>
                  <Select value={compareTeamA} onValueChange={setCompareTeamA}><SelectTrigger className='w-full'><SelectValue placeholder='Team A' /></SelectTrigger><SelectContent><SelectItem value='ALL'>Select Team A</SelectItem>{teams.map((t) => <SelectItem key={`ta-${t}`} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                  <Select value={compareTeamB} onValueChange={setCompareTeamB}><SelectTrigger className='w-full'><SelectValue placeholder='Team B' /></SelectTrigger><SelectContent><SelectItem value='ALL'>Select Team B</SelectItem>{teams.map((t) => <SelectItem key={`tb-${t}`} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                  <div className='rounded-lg border p-3 text-sm'>
                    <div>{compareTeamA !== 'ALL' ? `${compareTeamA}: ${fmt(teamAStats.reduce((s, p) => s + p.totalPoints, 0), 1)} pts` : 'Select Team A'}</div>
                    <div>{compareTeamB !== 'ALL' ? `${compareTeamB}: ${fmt(teamBStats.reduce((s, p) => s + p.totalPoints, 0), 1)} pts` : 'Select Team B'}</div>
                    {compareTeamA !== 'ALL' && compareTeamB !== 'ALL' && <div className='mt-1 font-medium'>Gap: {fmt(teamAStats.reduce((s, p) => s + p.totalPoints, 0) - teamBStats.reduce((s, p) => s + p.totalPoints, 0), 1)} pts</div>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Position Cohort Compare</CardTitle></CardHeader>
                <CardContent className='space-y-2'>
                  <Select value={comparePosA} onValueChange={setComparePosA}><SelectTrigger className='w-full'><SelectValue placeholder='Position A' /></SelectTrigger><SelectContent><SelectItem value='ALL'>Select Position A</SelectItem>{positions.map((p) => <SelectItem key={`pa-${p}`} value={p}>{p}</SelectItem>)}</SelectContent></Select>
                  <Select value={comparePosB} onValueChange={setComparePosB}><SelectTrigger className='w-full'><SelectValue placeholder='Position B' /></SelectTrigger><SelectContent><SelectItem value='ALL'>Select Position B</SelectItem>{positions.map((p) => <SelectItem key={`pb-${p}`} value={p}>{p}</SelectItem>)}</SelectContent></Select>
                  <div className='rounded-lg border p-3 text-sm'>
                    <div>{comparePosA !== 'ALL' ? `${comparePosA}: ${fmt(posAStats.reduce((s, p) => s + p.totalPoints, 0), 1)} pts` : 'Select Position A'}</div>
                    <div>{comparePosB !== 'ALL' ? `${comparePosB}: ${fmt(posBStats.reduce((s, p) => s + p.totalPoints, 0), 1)} pts` : 'Select Position B'}</div>
                    {comparePosA !== 'ALL' && comparePosB !== 'ALL' && <div className='mt-1 font-medium'>Gap: {fmt(posAStats.reduce((s, p) => s + p.totalPoints, 0) - posBStats.reduce((s, p) => s + p.totalPoints, 0), 1)} pts</div>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='raw'>
            <Card>
              <CardHeader><CardTitle>Raw Match Rows (Candidate Formula)</CardTitle></CardHeader>
              <CardContent className='hidden md:block overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>GW</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Pos</TableHead>
                      <TableHead className='text-right'>Mins</TableHead>
                      <TableHead className='text-right'>G</TableHead>
                      <TableHead className='text-right'>A</TableHead>
                      <TableHead className='text-right'>xG</TableHead>
                      <TableHead className='text-right'>xA</TableHead>
                      <TableHead className='text-right'>Candidate Pts</TableHead>
                      <TableHead className='text-right'>Baseline Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.slice(0, 200).map((r, i) => (
                      <TableRow key={`${r.player_id}-${r.match_id}-${i}`}>
                        <TableCell>{r.gameweek}</TableCell>
                        <TableCell className='font-medium'>{r.player_name}</TableCell>
                        <TableCell>{r.team}</TableCell>
                        <TableCell>{r.position}</TableCell>
                        <TableCell className='text-right'>{r.minutes_played}</TableCell>
                        <TableCell className='text-right'>{r.goals}</TableCell>
                        <TableCell className='text-right'>{r.assists}</TableCell>
                        <TableCell className='text-right'>{fmt(r.xg)}</TableCell>
                        <TableCell className='text-right'>{fmt(r.xa)}</TableCell>
                        <TableCell className='text-right font-semibold'>{fmt(calcMatchPoints(r, candidateFormula), 1)}</TableCell>
                        <TableCell className='text-right'>{fmt(calcMatchPoints(r, baselineFormula), 1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>

              <CardContent className='space-y-2 md:hidden'>
                {filteredRows.slice(0, 50).map((r, i) => (
                  <div key={`${r.player_id}-${r.match_id}-${i}`} className='rounded-lg border p-3 text-sm'>
                    <div className='flex items-center justify-between'>
                      <div className='font-medium'>{r.player_name}</div>
                      <Badge variant='secondary'>{r.position}</Badge>
                    </div>
                    <div className='text-muted-foreground'>GW {r.gameweek} • {r.team} • {r.minutes_played}m</div>
                    <div className='mt-1'>C {fmt(calcMatchPoints(r, candidateFormula), 1)} | B {fmt(calcMatchPoints(r, baselineFormula), 1)}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className='pb-safe text-xs text-muted-foreground'>
          Tuned for desktop + PWA + mobile. Safe-area insets and overflow controls enabled.
        </footer>
      </main>

      <Button variant='secondary' size='icon' className='sidebar-fab lg:hidden' onClick={() => setLeftOpen(true)}>
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  )
}
