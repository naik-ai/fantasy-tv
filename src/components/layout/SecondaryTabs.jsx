import { BarChart3, Download, GitCompareArrows, LayoutDashboard, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'compare', label: 'Compare', icon: GitCompareArrows },
  { id: 'graphs', label: 'Graphs', icon: BarChart3 },
  { id: 'export', label: 'Export', icon: Download },
]

export default function SecondaryTabs({ view, onChange }) {
  return (
    <nav
      aria-label='Sections'
      className='sticky top-[44px] z-20 hidden border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur md:block'
    >
      <div className='mx-auto flex max-w-[1400px] items-stretch gap-1 overflow-x-auto px-3 sm:px-5'>
        {ITEMS.map((it) => {
          const Icon = it.icon
          const active = view === it.id
          return (
            <button
              key={it.id}
              type='button'
              onClick={() => onChange(it.id)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-1.5 px-3 py-2.5 text-sm transition-colors whitespace-nowrap',
                active ? 'text-[var(--ink)]' : 'text-[var(--dim)] hover:text-[var(--ink)]',
              )}
            >
              <Icon className='h-4 w-4' />
              {it.label}
              {active && (
                <span className='absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--zone-cruise)]' />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export { ITEMS as SECONDARY_ITEMS }
