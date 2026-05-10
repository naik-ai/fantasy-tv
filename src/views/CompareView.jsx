import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { fmt } from '@/lib/format'

function StatRow({ label, a, b }) {
  const dir = (a ?? 0) === (b ?? 0) ? 'eq' : (a ?? 0) > (b ?? 0) ? 'a' : 'b'
  return (
    <div className='grid grid-cols-3 items-center gap-2 py-1.5 text-sm'>
      <div className={`text-right tabular-nums ${dir === 'a' ? 'font-semibold text-[var(--zone-cruise)]' : ''}`}>{a == null ? '—' : fmt(a, 1)}</div>
      <div className='text-center text-xs text-[var(--dim)]'>{label}</div>
      <div className={`tabular-nums ${dir === 'b' ? 'font-semibold text-[var(--zone-cruise)]' : ''}`}>{b == null ? '—' : fmt(b, 1)}</div>
    </div>
  )
}

function teamSummary(rows) {
  if (!rows.length) return null
  const total = rows.reduce((s, p) => s + p.totalPoints, 0)
  const avg = total / rows.length
  const baseline = rows.reduce((s, p) => s + p.baselinePoints, 0)
  return { players: rows.length, total, avg, baseline, delta: total - baseline }
}

export default function CompareView({ playersList, comparison, teams, positions }) {
  const [pa, setPa] = useState('ALL')
  const [pb, setPb] = useState('ALL')
  const [ta, setTa] = useState('ALL')
  const [tb, setTb] = useState('ALL')
  const [za, setZa] = useState('ALL')
  const [zb, setZb] = useState('ALL')

  const pA = useMemo(() => playersList.find((p) => String(p.player_id) === pa), [playersList, pa])
  const pB = useMemo(() => playersList.find((p) => String(p.player_id) === pb), [playersList, pb])
  const tASum = useMemo(() => teamSummary(comparison.filter((p) => p.team === ta)), [comparison, ta])
  const tBSum = useMemo(() => teamSummary(comparison.filter((p) => p.team === tb)), [comparison, tb])
  const zASum = useMemo(() => teamSummary(comparison.filter((p) => p.position === za)), [comparison, za])
  const zBSum = useMemo(() => teamSummary(comparison.filter((p) => p.position === zb)), [comparison, zb])

  return (
    <div className='grid gap-3 xl:grid-cols-3'>
      <Card>
        <CardHeader>
          <CardTitle>Player A vs B</CardTitle>
          <CardDescription>Head-to-head under the candidate formula.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='grid grid-cols-2 gap-2'>
            <Select value={pa} onValueChange={setPa}>
              <SelectTrigger className='w-full'><SelectValue placeholder='Player A' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>Select Player A</SelectItem>
                {playersList.slice(0, 500).map((p) => <SelectItem key={`a-${p.player_id}`} value={String(p.player_id)}>{p.player_name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={pb} onValueChange={setPb}>
              <SelectTrigger className='w-full'><SelectValue placeholder='Player B' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>Select Player B</SelectItem>
                {playersList.slice(0, 500).map((p) => <SelectItem key={`b-${p.player_id}`} value={String(p.player_id)}>{p.player_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='rounded-xl border border-[var(--line)] p-3'>
            <div className='mb-2 grid grid-cols-3 gap-2 text-xs text-[var(--dim)]'>
              <div className='text-right'>{pA?.player_name || 'Player A'}</div>
              <div className='text-center'>Stat</div>
              <div>{pB?.player_name || 'Player B'}</div>
            </div>
            <StatRow label='Total Pts' a={pA?.totalPoints} b={pB?.totalPoints} />
            <StatRow label='Avg Pts' a={pA?.avgPoints} b={pB?.avgPoints} />
            <StatRow label='Goals' a={pA?.goals} b={pB?.goals} />
            <StatRow label='Assists' a={pA?.assists} b={pB?.assists} />
            <StatRow label='xG' a={pA?.xg} b={pB?.xg} />
            <StatRow label='xA' a={pA?.xa} b={pB?.xa} />
            <StatRow label='Consistency σ' a={pA?.consistency} b={pB?.consistency} />
            {pA && pB && (
              <div className='mt-2 text-center text-sm'>
                Gap: <Badge variant='secondary'>{fmt(pA.totalPoints - pB.totalPoints, 1)} pts</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team A vs B</CardTitle>
          <CardDescription>Aggregated team output under candidate.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='grid grid-cols-2 gap-2'>
            <Select value={ta} onValueChange={setTa}>
              <SelectTrigger className='w-full'><SelectValue placeholder='Team A' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>Select Team A</SelectItem>
                {teams.map((t) => <SelectItem key={`ta-${t}`} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={tb} onValueChange={setTb}>
              <SelectTrigger className='w-full'><SelectValue placeholder='Team B' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>Select Team B</SelectItem>
                {teams.map((t) => <SelectItem key={`tb-${t}`} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='rounded-xl border border-[var(--line)] p-3'>
            <div className='mb-2 grid grid-cols-3 gap-2 text-xs text-[var(--dim)]'>
              <div className='text-right'>{ta !== 'ALL' ? ta : 'Team A'}</div>
              <div className='text-center'>Stat</div>
              <div>{tb !== 'ALL' ? tb : 'Team B'}</div>
            </div>
            <StatRow label='Players' a={tASum?.players} b={tBSum?.players} />
            <StatRow label='Total' a={tASum?.total} b={tBSum?.total} />
            <StatRow label='Avg/player' a={tASum?.avg} b={tBSum?.avg} />
            <StatRow label='Δ vs baseline' a={tASum?.delta} b={tBSum?.delta} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Position cohort</CardTitle>
          <CardDescription>Compare two position cohorts side by side.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='grid grid-cols-2 gap-2'>
            <Select value={za} onValueChange={setZa}>
              <SelectTrigger className='w-full'><SelectValue placeholder='Position A' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>Select Position A</SelectItem>
                {positions.map((p) => <SelectItem key={`pa-${p}`} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={zb} onValueChange={setZb}>
              <SelectTrigger className='w-full'><SelectValue placeholder='Position B' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>Select Position B</SelectItem>
                {positions.map((p) => <SelectItem key={`pb-${p}`} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='rounded-xl border border-[var(--line)] p-3'>
            <div className='mb-2 grid grid-cols-3 gap-2 text-xs text-[var(--dim)]'>
              <div className='text-right'>{za !== 'ALL' ? za : 'Position A'}</div>
              <div className='text-center'>Stat</div>
              <div>{zb !== 'ALL' ? zb : 'Position B'}</div>
            </div>
            <StatRow label='Players' a={zASum?.players} b={zBSum?.players} />
            <StatRow label='Total' a={zASum?.total} b={zBSum?.total} />
            <StatRow label='Avg/player' a={zASum?.avg} b={zBSum?.avg} />
            <StatRow label='Δ vs baseline' a={zASum?.delta} b={zBSum?.delta} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
