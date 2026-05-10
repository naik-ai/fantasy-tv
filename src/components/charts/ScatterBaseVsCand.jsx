import { CartesianGrid, ReferenceLine, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const config = {
  baseline: { label: 'Baseline', color: 'var(--zone-idle)' },
  candidate: { label: 'Candidate', color: 'var(--zone-cruise)' },
}

export default function ScatterBaseVsCand({ data }) {
  const points = data.map((p) => ({
    x: p.baselinePoints,
    y: p.totalPoints,
    name: p.player_name,
  }))
  return (
    <ChartContainer config={config} className='aspect-[16/9] w-full'>
      <ScatterChart margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis type='number' dataKey='x' name='Baseline pts' tickLine={false} />
        <YAxis type='number' dataKey='y' name='Candidate pts' tickLine={false} axisLine={false} />
        <ZAxis type='category' dataKey='name' />
        <ReferenceLine
          segment={[
            { x: 0, y: 0 },
            { x: Math.max(1, ...points.map((p) => p.x)), y: Math.max(1, ...points.map((p) => p.x)) },
          ]}
          stroke='var(--dim)'
          strokeDasharray='4 4'
          ifOverflow='extendDomain'
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(v, n) => `${n === 'x' ? 'Base' : 'Cand'} ${Number(v).toFixed(1)}`}
            />
          }
          cursor={{ stroke: 'var(--line)' }}
        />
        <Scatter name='Players' data={points} fill='var(--color-candidate)' fillOpacity={0.8} />
      </ScatterChart>
    </ChartContainer>
  )
}
