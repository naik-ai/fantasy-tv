import * as React from 'react'
import { Slider as SliderPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

function Slider({ className, value, defaultValue, min = 0, max = 100, step = 1, ...props }) {
  const _values = React.useMemo(() => {
    if (Array.isArray(value)) return value
    if (Array.isArray(defaultValue)) return defaultValue
    return [min]
  }, [value, defaultValue, min])

  return (
    <SliderPrimitive.Root
      data-slot='slider'
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      className={cn('relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50', className)}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot='slider-track'
        className='relative grow overflow-hidden rounded-full bg-[var(--track)] h-1.5 w-full'
      >
        <SliderPrimitive.Range
          data-slot='slider-range'
          className='absolute h-full bg-[var(--zone-cruise)]'
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot='slider-thumb'
          className='block size-4 shrink-0 rounded-full border-2 border-[var(--zone-cruise)] bg-[var(--surface)] shadow-sm transition-[color,box-shadow] hover:ring-4 hover:ring-[var(--zone-cruise)]/15 focus-visible:ring-4 focus-visible:ring-[var(--zone-cruise)]/30 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50'
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
