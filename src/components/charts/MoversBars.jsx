import { Bar, BarChart, Cell, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const config = {
  deltaPoints: { label: 'Δ Points', color: 'var(--zone-cruise)' },
}

export default function MoversBars({ data }) {
  return (
    <ChartContainer config={config} className='aspect-[16/8] w-full'>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 28 }}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis dataKey='label' interval={0} angle={-30} textAnchor='end' height={50} tickLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ReferenceLine y={0} stroke='var(--line)' />
        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--track)', opacity: 0.4 }} />
        <Bar dataKey='value' name='Δ Points' radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.value >= 0 ? 'var(--zone-cruise)' : 'var(--zone-redline)'} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
