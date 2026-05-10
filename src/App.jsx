import { useEffect, useMemo, useState } from 'react'
import { Search, Trophy, Users, Gauge, Clock3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import './App.css'

const POINTS = {
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
  accurate_passes_percent_bonus: 2,
  saves: 0.5,
  fouls_committed: -0.25,
  penalties_missed: -3,
}

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

function baseMinutePoints(minutes) {
  if (minutes >= 90) return 3
  if (minutes >= 60) return 2
  if (minutes > 0) return 1
  return 0
}

function calcMatchPoints(r) {
  const cleanSheet = r.team_goals_conceded === 0 ? 1 : 0
  const passAccBonus = r.accurate_passes_percent >= 85 ? 1 : 0

  return (
    baseMinutePoints(r.minutes_played) +
    r.goals * POINTS.goals +
    r.assists * POINTS.assists +
    r.shots_on_target * POINTS.shots_on_target +
    cleanSheet * POINTS.cs +
    r.tackles_won * POINTS.tackles_won +
    r.interceptions * POINTS.interceptions +
    r.clearances * POINTS.clearances +
    r.blocks * POINTS.blocks +
    r.chances_created * POINTS.chances_created +
    r.successful_dribbles * POINTS.successful_dribbles +
    r.accurate_crosses * POINTS.accurate_crosses +
    passAccBonus * POINTS.accurate_passes_percent_bonus +
    r.saves * POINTS.saves +
    r.fouls_committed * POINTS.fouls_committed +
    r.penalties_missed * POINTS.penalties_missed
  )
}

function fmt(v, d = 2) {
  return Number(v || 0).toFixed(d)
}

export default function App() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [position, setPosition] = useState('ALL')
  const [team, setTeam] = useState('ALL')
  const [gameweek, setGameweek] = useState('ALL')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/data/pl_2025_26_player_match_stats.csv', { cache: 'no-store' })
        if (!res.ok) throw new Error('CSV not found')
        const text = await res.text()
        setRows(parseCsv(text))
      } catch (e) {
        setError(e.message || 'Failed to load CSV')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const teams = useMemo(() => [...new Set(rows.map((r) => r.team))].sort(), [rows])
  const positions = useMemo(() => [...new Set(rows.map((r) => r.position))].sort(), [rows])
  const gameweeks = useMemo(() => [...new Set(rows.map((r) => r.gameweek))].sort((a, b) => a - b), [rows])

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const q = search.trim().toLowerCase()
      const matchQ = !q || r.player_name.toLowerCase().includes(q) || r.full_name.toLowerCase().includes(q)
      const matchPos = position === 'ALL' || r.position === position
      const matchTeam = team === 'ALL' || r.team === team
      const matchGw = gameweek === 'ALL' || String(r.gameweek) === gameweek
      return matchQ && matchPos && matchTeam && matchGw
    })
  }, [rows, search, position, team, gameweek])

  const leaderboard = useMemo(() => {
    const map = new Map()

    filteredRows.forEach((r) => {
      const id = `${r.player_id}`
      const pts = calcMatchPoints(r)
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
          maxMatchPoints: -999,
        })
      }
      const p = map.get(id)
      p.matches += 1
      p.minutes += r.minutes_played
      p.goals += r.goals
      p.assists += r.assists
      p.xg += r.xg
      p.xa += r.xa
      p.totalPoints += pts
      p.maxMatchPoints = Math.max(p.maxMatchPoints, pts)
    })

    return [...map.values()]
      .map((p) => ({
        ...p,
        avgPoints: p.matches ? p.totalPoints / p.matches : 0,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
  }, [filteredRows])

  const kpis = useMemo(() => {
    const totalPlayers = leaderboard.length
    const totalMatches = filteredRows.length
    const avgPoints = leaderboard.length
      ? leaderboard.reduce((s, p) => s + p.totalPoints, 0) / leaderboard.length
      : 0
    const top = leaderboard[0]

    return {
      totalPlayers,
      totalMatches,
      avgPoints,
      topName: top?.player_name || '- ',
      topPts: top ? fmt(top.totalPoints, 1) : '0.0',
    }
  }, [leaderboard, filteredRows])

  if (loading) {
    return <div className='mx-auto max-w-7xl p-4 sm:p-6'>Loading dashboard...</div>
  }

  if (error) {
    return <div className='mx-auto max-w-7xl p-4 sm:p-6 text-red-400'>Error: {error}</div>
  }

  return (
    <div className='mx-auto max-w-7xl space-y-4 p-4 sm:space-y-6 sm:p-6'>
      <header className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>Fantasy TV Pro Dashboard</h1>
          <p className='text-sm text-muted-foreground'>CSV-first analytics for 2025-26, responsive for mobile and web.</p>
        </div>
        <Badge variant='secondary'>Cloudflare CSV Hosted</Badge>
      </header>

      <section className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader>
            <CardDescription className='flex items-center gap-2'><Users className='h-4 w-4' /> Players</CardDescription>
            <CardTitle>{kpis.totalPlayers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className='flex items-center gap-2'><Clock3 className='h-4 w-4' /> Match Rows</CardDescription>
            <CardTitle>{kpis.totalMatches}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className='flex items-center gap-2'><Gauge className='h-4 w-4' /> Avg Fantasy Pts</CardDescription>
            <CardTitle>{fmt(kpis.avgPoints, 1)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className='flex items-center gap-2'><Trophy className='h-4 w-4' /> Top Player</CardDescription>
            <CardTitle className='truncate'>{kpis.topName}</CardTitle>
            <CardDescription>{kpis.topPts} pts</CardDescription>
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='relative'>
            <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground' />
            <Input className='pl-8' placeholder='Search player' value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className='w-full'><SelectValue placeholder='Position' /></SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>All Positions</SelectItem>
              {positions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={team} onValueChange={setTeam}>
            <SelectTrigger className='w-full'><SelectValue placeholder='Team' /></SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>All Teams</SelectItem>
              {teams.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={gameweek} onValueChange={setGameweek}>
            <SelectTrigger className='w-full'><SelectValue placeholder='Gameweek' /></SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>All GWs</SelectItem>
              {gameweeks.map((gw) => <SelectItem key={gw} value={String(gw)}>GW {gw}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue='leaderboard'>
        <TabsList>
          <TabsTrigger value='leaderboard'>Leaderboard</TabsTrigger>
          <TabsTrigger value='raw'>Raw Matches</TabsTrigger>
        </TabsList>

        <TabsContent value='leaderboard'>
          <Card>
            <CardHeader>
              <CardTitle>Player Rankings</CardTitle>
              <CardDescription>Calculated with configurable-style fantasy points from CSV events.</CardDescription>
            </CardHeader>
            <CardContent className='hidden md:block'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Pos</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className='text-right'>Matches</TableHead>
                    <TableHead className='text-right'>Mins</TableHead>
                    <TableHead className='text-right'>G</TableHead>
                    <TableHead className='text-right'>A</TableHead>
                    <TableHead className='text-right'>xG</TableHead>
                    <TableHead className='text-right'>xA</TableHead>
                    <TableHead className='text-right'>Pts</TableHead>
                    <TableHead className='text-right'>Avg</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.slice(0, 100).map((p, i) => (
                    <TableRow key={p.player_id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className='font-medium'>{p.player_name}</TableCell>
                      <TableCell>{p.position}</TableCell>
                      <TableCell>{p.team}</TableCell>
                      <TableCell className='text-right'>{p.matches}</TableCell>
                      <TableCell className='text-right'>{p.minutes}</TableCell>
                      <TableCell className='text-right'>{p.goals}</TableCell>
                      <TableCell className='text-right'>{p.assists}</TableCell>
                      <TableCell className='text-right'>{fmt(p.xg)}</TableCell>
                      <TableCell className='text-right'>{fmt(p.xa)}</TableCell>
                      <TableCell className='text-right font-semibold'>{fmt(p.totalPoints, 1)}</TableCell>
                      <TableCell className='text-right'>{fmt(p.avgPoints, 1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>

            <CardContent className='space-y-3 md:hidden'>
              {leaderboard.slice(0, 30).map((p, i) => (
                <div key={p.player_id} className='rounded-lg border p-3'>
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='font-medium'>{i + 1}. {p.player_name}</div>
                    <Badge variant='secondary'>{p.position}</Badge>
                  </div>
                  <div className='grid grid-cols-2 gap-2 text-sm text-muted-foreground'>
                    <div>{p.team} • {p.matches} matches</div>
                    <div className='text-right font-semibold text-foreground'>{fmt(p.totalPoints, 1)} pts</div>
                    <div>G {p.goals} • A {p.assists}</div>
                    <div className='text-right'>Avg {fmt(p.avgPoints, 1)}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='raw'>
          <Card>
            <CardHeader>
              <CardTitle>Raw Match Rows</CardTitle>
              <CardDescription>Top 100 filtered rows with per-match fantasy points.</CardDescription>
            </CardHeader>
            <CardContent className='hidden md:block'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>GW</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Pos</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className='text-right'>Mins</TableHead>
                    <TableHead className='text-right'>G</TableHead>
                    <TableHead className='text-right'>A</TableHead>
                    <TableHead className='text-right'>SoT</TableHead>
                    <TableHead className='text-right'>xG</TableHead>
                    <TableHead className='text-right'>xA</TableHead>
                    <TableHead className='text-right'>Pts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.slice(0, 100).map((r, i) => (
                    <TableRow key={`${r.player_id}-${r.match_id}-${i}`}>
                      <TableCell>{r.gameweek}</TableCell>
                      <TableCell className='font-medium'>{r.player_name}</TableCell>
                      <TableCell>{r.position}</TableCell>
                      <TableCell>{r.team}</TableCell>
                      <TableCell className='text-right'>{r.minutes_played}</TableCell>
                      <TableCell className='text-right'>{r.goals}</TableCell>
                      <TableCell className='text-right'>{r.assists}</TableCell>
                      <TableCell className='text-right'>{r.shots_on_target}</TableCell>
                      <TableCell className='text-right'>{fmt(r.xg)}</TableCell>
                      <TableCell className='text-right'>{fmt(r.xa)}</TableCell>
                      <TableCell className='text-right font-semibold'>{fmt(calcMatchPoints(r), 1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>

            <CardContent className='space-y-2 md:hidden'>
              {filteredRows.slice(0, 25).map((r, i) => (
                <div key={`${r.player_id}-${r.match_id}-${i}`} className='rounded-lg border p-3 text-sm'>
                  <div className='flex items-center justify-between'>
                    <div className='font-medium'>{r.player_name}</div>
                    <div className='font-semibold'>{fmt(calcMatchPoints(r), 1)} pts</div>
                  </div>
                  <div className='text-muted-foreground'>GW {r.gameweek} • {r.team} • {r.position}</div>
                  <div className='mt-1 text-muted-foreground'>Mins {r.minutes_played} | G {r.goals} A {r.assists} | xG {fmt(r.xg)} xA {fmt(r.xa)}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
