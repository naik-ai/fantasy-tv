import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { calcMatchPoints } from '@/lib/formula'
import { fmt } from '@/lib/format'

export default function RawMatchesTable({ rows, baselineFormula, candidateFormula }) {
  return (
    <>
      <div className='hidden md:block'>
        <div className='max-h-[640px] overflow-auto rounded-xl border border-[var(--line)] bg-[var(--surface)]'>
          <Table>
            <TableHeader className='sticky top-0 z-10 bg-[var(--surface)]'>
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
                <TableHead className='text-right'>Cand</TableHead>
                <TableHead className='text-right'>Base</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 200).map((r, i) => (
                <TableRow key={`${r.player_id}-${r.match_id}-${i}`}>
                  <TableCell className='text-[var(--dim)]'>{r.gameweek}</TableCell>
                  <TableCell className='font-medium'>{r.player_name}</TableCell>
                  <TableCell className='text-[var(--dim)]'>{r.team}</TableCell>
                  <TableCell><Badge variant='secondary'>{r.position}</Badge></TableCell>
                  <TableCell className='text-right tabular-nums'>{r.minutes_played}</TableCell>
                  <TableCell className='text-right tabular-nums'>{r.goals}</TableCell>
                  <TableCell className='text-right tabular-nums'>{r.assists}</TableCell>
                  <TableCell className='text-right tabular-nums text-[var(--dim)]'>{fmt(r.xg)}</TableCell>
                  <TableCell className='text-right tabular-nums text-[var(--dim)]'>{fmt(r.xa)}</TableCell>
                  <TableCell className='text-right font-semibold tabular-nums'>{fmt(calcMatchPoints(r, candidateFormula), 1)}</TableCell>
                  <TableCell className='text-right tabular-nums text-[var(--dim)]'>{fmt(calcMatchPoints(r, baselineFormula), 1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className='space-y-2 md:hidden'>
        {rows.slice(0, 50).map((r, i) => (
          <div key={`${r.player_id}-${r.match_id}-${i}`} className='rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-sm'>
            <div className='flex items-center justify-between'>
              <div className='font-medium'>{r.player_name}</div>
              <Badge variant='secondary'>{r.position}</Badge>
            </div>
            <div className='text-xs text-[var(--dim)]'>GW {r.gameweek} · {r.team} · {r.minutes_played}m</div>
            <div className='mt-1 tabular-nums'>
              C <span className='font-semibold'>{fmt(calcMatchPoints(r, candidateFormula), 1)}</span>
              <span className='text-[var(--dim)]'> · B {fmt(calcMatchPoints(r, baselineFormula), 1)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
