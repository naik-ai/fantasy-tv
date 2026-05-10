import { useEffect, useMemo } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { breakdownMatch } from '@/lib/formula'
import { fmt } from '@/lib/format'

export default function BreakdownDrawer({ player, rows, baselineFormula, candidateFormula, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    if (player) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [player, onClose])

  const playerRows = useMemo(() => {
    if (!player) return []
    return rows.filter((r) => String(r.player_id) === String(player.player_id))
  }, [player, rows])

  const summary = useMemo(() => {
    if (!player) return null
    const totals = { count: {}, weight: {}, points: {} }
    playerRows.forEach((r) => {
      const { items } = breakdownMatch(r, candidateFormula)
      items.forEach((it) => {
        totals.count[it.key] = (totals.count[it.key] || 0) + (it.count || 0)
        totals.weight[it.key] = it.weight
        totals.points[it.key] = (totals.points[it.key] || 0) + it.points
      })
    })
    const sample = playerRows[0] ? breakdownMatch(playerRows[0], candidateFormula).items : []
    return sample.map((s) => ({
      key: s.key,
      label: s.label,
      count: totals.count[s.key] || 0,
      weight: totals.weight[s.key],
      points: totals.points[s.key] || 0,
    }))
  }, [player, playerRows, candidateFormula])

  if (!player) return null

  return (
    <>
      <div onClick={onClose} className='fixed inset-0 z-40 bg-black/50' />
      <aside
        className='fixed right-0 top-0 z-50 h-[100dvh] w-[min(420px,94vw)] overflow-y-auto border-l border-[var(--line)] bg-[var(--surface)] shadow-2xl'
        style={{ paddingTop: 'calc(0.75rem + var(--safe-top))', paddingBottom: 'calc(0.75rem + var(--safe-bottom))' }}
      >
        <div className='space-y-3 px-4'>
          <div className='flex items-start justify-between gap-2'>
            <div className='min-w-0'>
              <div className='truncate text-base font-semibold'>{player.player_name}</div>
              <div className='text-xs text-[var(--dim)]'>{player.team} · {player.position} · {player.matches} matches</div>
            </div>
            <Button variant='ghost' size='icon-sm' onClick={onClose} aria-label='Close'>
              <X className='h-4 w-4' />
            </Button>
          </div>

          <div className='grid grid-cols-3 gap-2 text-center'>
            <div className='rounded-lg border border-[var(--line)] p-2'>
              <div className='text-[10px] uppercase tracking-wide text-[var(--dim)]'>Candidate</div>
              <div className='text-base font-semibold tabular-nums'>{fmt(player.totalPoints, 1)}</div>
            </div>
            <div className='rounded-lg border border-[var(--line)] p-2'>
              <div className='text-[10px] uppercase tracking-wide text-[var(--dim)]'>Baseline</div>
              <div className='text-base font-semibold tabular-nums text-[var(--dim)]'>{fmt(player.baselinePoints, 1)}</div>
            </div>
            <div className='rounded-lg border border-[var(--line)] p-2'>
              <div className='text-[10px] uppercase tracking-wide text-[var(--dim)]'>Δ</div>
              <div className={`text-base font-semibold tabular-nums ${player.deltaPoints >= 0 ? 'text-[var(--zone-cruise)]' : 'text-[var(--zone-redline)]'}`}>{fmt(player.deltaPoints, 1)}</div>
            </div>
          </div>

          <Separator />

          <div>
            <div className='mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--dim)]'>
              Candidate point composition (season)
            </div>
            <ul className='space-y-1.5 text-sm'>
              {summary.filter((s) => s.points !== 0 || s.count !== 0).map((s) => (
                <li key={s.key} className='flex items-center justify-between rounded-md px-2 py-1 odd:bg-[var(--track)]/40'>
                  <span className='text-[var(--ink)]'>{s.label}</span>
                  <span className='flex items-center gap-2 text-xs text-[var(--dim)] tabular-nums'>
                    <span>{fmt(s.count, 0)}× × {fmt(s.weight, 2)}</span>
                    <Badge variant='secondary' className='tabular-nums'>{fmt(s.points, 1)}</Badge>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <div className='mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--dim)]'>
              Per-match (candidate vs baseline)
            </div>
            <ul className='space-y-1 text-xs'>
              {playerRows.map((r) => {
                const c = breakdownMatch(r, candidateFormula).total
                const b = breakdownMatch(r, baselineFormula).total
                return (
                  <li key={`${r.match_id}-${r.gameweek}`} className='flex items-center justify-between rounded-md px-2 py-1 odd:bg-[var(--track)]/40'>
                    <span className='text-[var(--dim)]'>GW {r.gameweek} · {r.minutes_played}m</span>
                    <span className='tabular-nums'>
                      <span className='font-semibold'>{fmt(c, 1)}</span>
                      <span className='ml-2 text-[var(--dim)]'>{fmt(b, 1)}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </aside>
    </>
  )
}
