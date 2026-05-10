import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const config = {
  totalPoints: { label: 'Candidate Points', color: 'var(--zone-cruise)' },
}

export default function TopNBars({ data, n = 12 }) {
  const slice = data.slice(0, n)
  return (
    <ChartContainer config={config} className='aspect-[16/8] w-full'>
      <BarChart data={slice} margin={{ top: 8, right: 8, left: -8, bottom: 28 }}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis dataKey='label' interval={0} angle={-30} textAnchor='end' height={50} tickLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--track)', opacity: 0.4 }} />
        <Bar dataKey='value' name='Candidate Points' fill='var(--color-totalPoints)' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
