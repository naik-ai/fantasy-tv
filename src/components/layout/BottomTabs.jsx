import { cn } from '@/lib/utils'
import { SECONDARY_ITEMS } from './SecondaryTabs'

export default function BottomTabs({ view, onChange }) {
  return (
    <nav
      aria-label='Sections'
      className='bottom-tabs fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur md:hidden'
    >
      <ul className='mx-auto grid max-w-[1400px] grid-cols-5'>
        {SECONDARY_ITEMS.map((it) => {
          const Icon = it.icon
          const active = view === it.id
          return (
            <li key={it.id}>
              <button
                type='button'
                onClick={() => onChange(it.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex w-full flex-col items-center gap-0.5 px-1 py-2 text-[11px] font-medium transition-colors',
                  active ? 'text-[var(--zone-cruise)]' : 'text-[var(--dim)]',
                )}
              >
                <Icon className='h-5 w-5' />
                {it.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
