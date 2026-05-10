import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deltaZone, fmt, zoneTextClass } from '@/lib/format'

export default function ImpactTable({ rows, onSelect }) {
  return (
    <>
      <div className='hidden md:block'>
        <div className='max-h-[640px] overflow-auto rounded-xl border border-[var(--line)] bg-[var(--surface)]'>
          <Table>
            <TableHeader className='sticky top-0 z-10 bg-[var(--surface)]'>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Pos</TableHead>
                <TableHead className='text-right'>Cand</TableHead>
                <TableHead className='text-right'>Base</TableHead>
                <TableHead className='text-right'>Δ Pts</TableHead>
                <TableHead className='text-right'>Rank</TableHead>
                <TableHead className='text-right'>Base Rank</TableHead>
                <TableHead className='text-right'>Δ Rank</TableHead>
                <TableHead className='text-right'>Avg</TableHead>
                <TableHead className='text-right'>σ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 200).map((p, i) => (
                <TableRow
                  key={p.player_id}
                  className='cursor-pointer'
                  onClick={() => onSelect?.(p)}
                >
                  <TableCell className='text-[var(--dim)]'>{i + 1}</TableCell>
                  <TableCell className='font-medium'>{p.player_name}</TableCell>
                  <TableCell className='text-[var(--dim)]'>{p.team}</TableCell>
                  <TableCell><Badge variant='secondary'>{p.position}</Badge></TableCell>
                  <TableCell className='text-right font-semibold tabular-nums'>{fmt(p.totalPoints, 1)}</TableCell>
                  <TableCell className='text-right tabular-nums text-[var(--dim)]'>{fmt(p.baselinePoints, 1)}</TableCell>
                  <TableCell className={`text-right tabular-nums ${zoneTextClass(deltaZone(p.deltaPoints, 'points'))}`}>{fmt(p.deltaPoints, 1)}</TableCell>
                  <TableCell className='text-right tabular-nums'>{p.rank}</TableCell>
                  <TableCell className='text-right tabular-nums text-[var(--dim)]'>{p.baselineRank}</TableCell>
                  <TableCell className={`text-right tabular-nums ${zoneTextClass(deltaZone(p.deltaRank, 'rank'))}`}>{p.deltaRank}</TableCell>
                  <TableCell className='text-right tabular-nums'>{fmt(p.avgPoints, 1)}</TableCell>
                  <TableCell className='text-right tabular-nums text-[var(--dim)]'>{fmt(p.consistency, 2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className='space-y-2 md:hidden'>
        {rows.slice(0, 60).map((p, i) => (
          <button
            key={p.player_id}
            type='button'
            onClick={() => onSelect?.(p)}
            className='block w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-left'
          >
            <div className='flex items-center justify-between gap-2'>
              <div className='flex min-w-0 items-center gap-2'>
                <span className='shrink-0 text-xs text-[var(--dim)] tabular-nums'>{i + 1}</span>
                <span className='truncate font-medium'>{p.player_name}</span>
              </div>
              <Badge variant='secondary'>{p.position}</Badge>
            </div>
            <div className='mt-1 text-xs text-[var(--dim)]'>{p.team}</div>
            <div className='mt-2 grid grid-cols-3 gap-2 text-sm tabular-nums'>
              <div>C <span className='font-semibold'>{fmt(p.totalPoints, 1)}</span></div>
              <div>B <span className='text-[var(--dim)]'>{fmt(p.baselinePoints, 1)}</span></div>
              <div className={zoneTextClass(deltaZone(p.deltaPoints, 'points'))}>Δ {fmt(p.deltaPoints, 1)}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}
