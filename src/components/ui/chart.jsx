import * as React from 'react'
import { Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer } from 'recharts'

import { cn } from '@/lib/utils'

const ChartContext = React.createContext(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error('useChart must be used inside <ChartContainer>')
  return ctx
}

function ChartContainer({ id, className, children, config, ...props }) {
  const reactId = React.useId()
  const chartId = `chart-${(id || reactId).replace(/:/g, '')}`

  const styleVars = {}
  Object.entries(config || {}).forEach(([k, v]) => {
    if (v?.color) styleVars[`--color-${k}`] = v.color
  })

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn('flex aspect-video justify-center text-xs', className)}
        style={styleVars}
        {...props}
      >
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartTooltip = RechartsTooltip

function ChartTooltipContent({ active, payload, label, hideLabel = false, hideIndicator = false, formatter, labelFormatter }) {
  const { config } = useChart()
  if (!active || !payload?.length) return null

  return (
    <div className='rounded-md border border-[var(--line)] bg-[var(--surface)]/95 px-2.5 py-1.5 text-xs shadow-lg backdrop-blur'>
      {!hideLabel && label != null && (
        <div className='mb-1 font-medium text-[var(--ink)]'>
          {labelFormatter ? labelFormatter(label, payload) : String(label)}
        </div>
      )}
      <div className='grid gap-1'>
        {payload.map((item, i) => {
          const key = item.dataKey || item.name
          const cfg = (config && config[key]) || {}
          const color = item.color || cfg.color || 'var(--ink)'
          const name = cfg.label || item.name || key
          const value = formatter ? formatter(item.value, name, item) : item.value
          return (
            <div key={`${key}-${i}`} className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-1.5 text-[var(--dim)]'>
                {!hideIndicator && (
                  <span className='inline-block size-2 rounded-sm' style={{ backgroundColor: color }} />
                )}
                {name}
              </div>
              <span className='font-medium text-[var(--ink)]'>{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsLegend

function ChartLegendContent({ payload, hideIcon = false, className }) {
  const { config } = useChart()
  if (!payload?.length) return null
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-4 pt-2 text-xs', className)}>
      {payload.map((item) => {
        const key = item.dataKey || item.value
        const cfg = (config && config[key]) || {}
        const label = cfg.label || item.value
        return (
          <div key={String(key)} className='flex items-center gap-1.5 text-[var(--dim)]'>
            {!hideIcon && <span className='inline-block size-2.5 rounded-sm' style={{ backgroundColor: item.color }} />}
            {label}
          </div>
        )
      })}
    </div>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, useChart }
