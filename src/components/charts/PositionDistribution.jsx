import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const config = {
  value: { label: 'Total Points', color: 'var(--zone-high)' },
}

export default function PositionDistribution({ data }) {
  return (
    <ChartContainer config={config} className='aspect-[16/8] w-full'>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 8 }}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis dataKey='label' tickLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--track)', opacity: 0.4 }} />
        <Bar dataKey='value' fill='var(--color-value)' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
