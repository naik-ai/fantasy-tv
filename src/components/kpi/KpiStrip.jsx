import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Filter, Trophy, Users } from 'lucide-react'

export default function KpiStrip({ kpis }) {
  return (
    <section className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
      <Card>
        <CardHeader>
          <CardDescription className='flex items-center gap-2 text-[var(--dim)]'>
            <Users className='h-4 w-4' /> Players
          </CardDescription>
          <CardTitle className='text-2xl'>{kpis.players}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className='flex items-center gap-2 text-[var(--dim)]'>
            <Filter className='h-4 w-4' /> Filtered Rows
          </CardDescription>
          <CardTitle className='text-2xl'>{kpis.rows}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className='text-[var(--dim)]'>Avg Candidate Points</CardDescription>
          <CardTitle className='text-2xl'>{kpis.avg}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className='flex items-center gap-2 text-[var(--dim)]'>
            <Trophy className='h-4 w-4' /> Top Candidate
          </CardDescription>
          <CardTitle className='truncate text-lg'>{kpis.top}</CardTitle>
          <CardDescription>{kpis.topPts} pts</CardDescription>
        </CardHeader>
      </Card>
    </section>
  )
}
