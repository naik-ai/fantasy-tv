import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import KpiStrip from '@/components/kpi/KpiStrip'
import TopNBars from '@/components/charts/TopNBars'
import MoversBars from '@/components/charts/MoversBars'
import { deltaZone, fmt, zoneTextClass } from '@/lib/format'

export default function OverviewView({ kpis, comparison, topBarData, moversData, onSelect }) {
  const gainers = [...comparison].sort((a, b) => b.deltaPoints - a.deltaPoints).slice(0, 5)
  const losers = [...comparison].sort((a, b) => a.deltaPoints - b.deltaPoints).slice(0, 5)

  return (
    <div className='space-y-4'>
      <KpiStrip kpis={kpis} />

      <div className='grid gap-3 xl:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Top players (Candidate)</CardTitle>
            <CardDescription>Highest scoring under the candidate formula.</CardDescription>
          </CardHeader>
          <CardContent>
            <TopNBars data={topBarData} n={12} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top movers vs baseline</CardTitle>
            <CardDescription>Δ Points sign-coded — green up, red down.</CardDescription>
          </CardHeader>
          <CardContent>
            <MoversBars data={moversData} />
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-3 xl:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Gainers</CardTitle>
            <CardDescription>Biggest positive shifts under candidate.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='divide-y divide-[var(--line)]'>
              {gainers.map((p) => (
                <li key={p.player_id} className='flex cursor-pointer items-center justify-between py-2' onClick={() => onSelect?.(p)}>
                  <div className='min-w-0'>
                    <div className='truncate text-sm font-medium'>{p.player_name}</div>
                    <div className='text-xs text-[var(--dim)]'>{p.team} · {p.position}</div>
                  </div>
                  <Badge variant='secondary' className={zoneTextClass(deltaZone(p.deltaPoints, 'points'))}>
                    +{fmt(p.deltaPoints, 1)}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Losers</CardTitle>
            <CardDescription>Biggest negative shifts under candidate.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='divide-y divide-[var(--line)]'>
              {losers.map((p) => (
                <li key={p.player_id} className='flex cursor-pointer items-center justify-between py-2' onClick={() => onSelect?.(p)}>
                  <div className='min-w-0'>
                    <div className='truncate text-sm font-medium'>{p.player_name}</div>
                    <div className='text-xs text-[var(--dim)]'>{p.team} · {p.position}</div>
                  </div>
                  <Badge variant='secondary' className={zoneTextClass(deltaZone(p.deltaPoints, 'points'))}>
                    {fmt(p.deltaPoints, 1)}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
