import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const config = {
  value: { label: 'Total Points', color: 'var(--zone-max)' },
}

export default function TeamContribution({ data }) {
  return (
    <ChartContainer config={config} className='aspect-[16/9] w-full'>
      <BarChart data={data} layout='vertical' margin={{ top: 8, right: 16, left: 12, bottom: 8 }}>
        <CartesianGrid strokeDasharray='3 3' horizontal={false} />
        <XAxis type='number' tickLine={false} axisLine={false} />
        <YAxis type='category' dataKey='label' width={88} tickLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--track)', opacity: 0.4 }} />
        <Bar dataKey='value' fill='var(--color-value)' radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
