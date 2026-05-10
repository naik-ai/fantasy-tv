import { useRef } from 'react'
import { ChevronLeft, Download, RotateCcw, Save, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { downloadBlob } from '@/lib/csv'
import { fmt } from '@/lib/format'
import { FORMULA_GROUPS, PRESET_LABELS } from '@/lib/formula'

export default function TuningDrawer({
  open,
  onClose,
  baselinePreset,
  setBaselinePreset,
  candidatePreset,
  applyPresetToCandidate,
  candidateFormula,
  updateWeight,
  resetCandidate,
  customPreset,
  saveCustomPreset,
  importPreset,
}) {
  const fileRef = useRef(null)

  function exportPreset() {
    const payload = {
      name: customPreset?.name || 'Custom',
      savedAt: new Date().toISOString(),
      formula: candidateFormula,
    }
    downloadBlob(JSON.stringify(payload, null, 2), 'fantasy_formula_preset.json', 'application/json')
  }

  function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(String(evt.target?.result || '{}'))
        importPreset(json)
      } catch (err) {
        alert(`Could not import preset: ${err.message}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`tuning-overlay fixed inset-0 bg-black/50 transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <aside
        aria-label='Formula tuning'
        className={`tuning-drawer fixed left-0 top-0 h-[100dvh] w-[min(380px,92vw)] border-r border-[var(--line)] bg-[var(--surface)] shadow-2xl transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ paddingTop: 'calc(0.75rem + var(--safe-top))', paddingBottom: 'calc(0.75rem + var(--safe-bottom))' }}
      >
        <div className='flex h-full flex-col gap-3 px-4'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='text-sm font-semibold'>Formula Tuner</div>
              <div className='text-[11px] text-[var(--dim)]'>Live recompute · persists locally</div>
            </div>
            <Button variant='ghost' size='icon-sm' onClick={onClose} aria-label='Close tuning'>
              <ChevronLeft className='h-4 w-4' />
            </Button>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div>
              <div className='mb-1 text-[11px] uppercase tracking-wide text-[var(--dim)]'>Baseline</div>
              <Select value={baselinePreset} onValueChange={setBaselinePreset}>
                <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['default', 'aggressive_attack', 'balanced', 'defensive_value'].map((k) => (
                    <SelectItem key={k} value={k}>{PRESET_LABELS[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className='mb-1 text-[11px] uppercase tracking-wide text-[var(--dim)]'>Candidate</div>
              <Select value={candidatePreset} onValueChange={applyPresetToCandidate}>
                <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['default', 'aggressive_attack', 'balanced', 'defensive_value', 'custom'].map((k) => (
                    <SelectItem key={k} value={k}>{PRESET_LABELS[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className='-mx-1 flex-1 space-y-4 overflow-y-auto px-1'>
            {FORMULA_GROUPS.map((group) => (
              <section key={group.id}>
                <div className='mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--dim)]'>
                  {group.label}
                </div>
                <div className='space-y-3'>
                  {group.fields.map(([key, label, step, range]) => {
                    const [min, max] = range
                    const isThreshold = key.includes('threshold')
                    const value = candidateFormula[key]
                    return (
                      <div key={key}>
                        <div className='mb-1 flex items-center justify-between text-xs'>
                          <span className='text-[var(--ink)]'>{label}</span>
                          <span className='font-medium tabular-nums text-[var(--ink)]'>
                            {fmt(value, isThreshold ? 0 : 2)}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Slider
                            min={min}
                            max={max}
                            step={step}
                            value={[value]}
                            onValueChange={(v) => updateWeight(key, v[0])}
                            aria-label={label}
                            className='flex-1'
                          />
                          <Input
                            type='number'
                            step={step}
                            value={value}
                            onChange={(e) => updateWeight(key, Number(e.target.value || 0))}
                            className='w-16 text-right'
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>

          <Separator />

          <div className='grid grid-cols-2 gap-2'>
            <Button variant='outline' onClick={resetCandidate}>
              <RotateCcw className='mr-1 h-4 w-4' /> Reset
            </Button>
            <Button onClick={() => saveCustomPreset(customPreset?.name || 'Custom')}>
              <Save className='mr-1 h-4 w-4' /> Save Slot
            </Button>
            <Button variant='outline' onClick={exportPreset}>
              <Download className='mr-1 h-4 w-4' /> Export
            </Button>
            <Button variant='outline' onClick={() => fileRef.current?.click()}>
              <Upload className='mr-1 h-4 w-4' /> Import
            </Button>
          </div>
          <input ref={fileRef} type='file' accept='application/json,.json' className='hidden' onChange={onFile} />
          {customPreset && (
            <div className='text-[11px] text-[var(--dim)]'>
              Slot: <span className='text-[var(--ink)]'>{customPreset.name}</span>
              {' · '}saved {new Date(customPreset.savedAt).toLocaleString()}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
