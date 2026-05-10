import { Activity, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ThemeSwitch from './ThemeSwitch'

export default function TopNav({ datasetMeta, theme, onToggleTheme, onOpenTuning }) {
  return (
    <header className='app-header sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur'>
      <div className='mx-auto flex max-w-[1400px] items-center gap-2 px-3 pb-2 sm:px-5'>
        <div className='flex items-center gap-2'>
          <span className='inline-flex size-7 items-center justify-center rounded-lg bg-[var(--zone-cruise)]/15 text-[var(--zone-cruise)]'>
            <Activity className='h-4 w-4' />
          </span>
          <div className='leading-tight'>
            <div className='text-sm font-semibold tracking-tight'>Fantasy TV Pro</div>
            <div className='hidden text-[11px] text-[var(--dim)] sm:block'>Formula calibration cockpit</div>
          </div>
        </div>

        <div className='ml-2 hidden items-center gap-1.5 md:flex'>
          <Badge variant='secondary'>Rows {datasetMeta.rows}</Badge>
          <Badge variant='secondary'>Players {datasetMeta.players}</Badge>
          <Badge variant='secondary'>Teams {datasetMeta.teams}</Badge>
          <Badge variant='secondary'>GW {datasetMeta.gws}</Badge>
        </div>

        <div className='ml-auto flex items-center gap-1.5'>
          <Button variant='outline' size='sm' onClick={onOpenTuning}>
            <Settings2 className='mr-1 h-4 w-4' /> Tune
          </Button>
          <ThemeSwitch theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  )
}
