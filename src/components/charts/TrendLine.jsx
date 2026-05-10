import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const config = {
  baseAvg: { label: 'Baseline avg', color: 'var(--zone-idle)' },
  candAvg: { label: 'Candidate avg', color: 'var(--zone-cruise)' },
}

export default function TrendLine({ data }) {
  return (
    <ChartContainer config={config} className='aspect-[16/8] w-full'>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: -8 }}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis dataKey='gw' tickLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Line type='monotone' dataKey='baseAvg' stroke='var(--color-baseAvg)' strokeWidth={2.5} dot={false} />
        <Line type='monotone' dataKey='candAvg' stroke='var(--color-candAvg)' strokeWidth={2.5} dot={false} />
      </LineChart>
    </ChartContainer>
  )
}
