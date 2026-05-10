import TopNav from './TopNav'
import SecondaryTabs from './SecondaryTabs'
import BottomTabs from './BottomTabs'

export default function AppShell({ datasetMeta, theme, onToggleTheme, onOpenTuning, view, onChangeView, children }) {
  return (
    <div className='min-h-[100dvh] bg-[var(--bg)] text-[var(--ink)]'>
      <TopNav
        datasetMeta={datasetMeta}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenTuning={onOpenTuning}
      />
      <SecondaryTabs view={view} onChange={onChangeView} />

      <main className='mx-auto max-w-[1400px] space-y-4 px-3 pb-28 pt-4 sm:px-5 md:pb-10'>
        {children}
      </main>

      <BottomTabs view={view} onChange={onChangeView} />
    </div>
  )
}
