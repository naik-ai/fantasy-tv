import { useEffect, useState } from 'react'
import { DEFAULT_FORMULA, PRESETS } from '@/lib/formula'
import { loadJson, saveJson } from '@/lib/storage'
import { round } from '@/lib/format'

const CANDIDATE_KEY = 'fantasy-tv-candidate-formula'
const CUSTOM_PRESET_KEY = 'fantasy-tv-custom-preset'

export function useFormula() {
  const [baselinePreset, setBaselinePreset] = useState('default')
  const [candidateFormula, setCandidateFormula] = useState(() => {
    const saved = loadJson(CANDIDATE_KEY, null)
    return saved ? { ...DEFAULT_FORMULA, ...saved } : DEFAULT_FORMULA
  })
  const [candidatePreset, setCandidatePreset] = useState(() => (loadJson(CANDIDATE_KEY, null) ? 'custom' : 'default'))
  const [customPreset, setCustomPreset] = useState(() => loadJson(CUSTOM_PRESET_KEY, null))

  useEffect(() => {
    saveJson(CANDIDATE_KEY, candidateFormula)
  }, [candidateFormula])

  const baselineFormula = PRESETS[baselinePreset] || DEFAULT_FORMULA

  function applyPresetToCandidate(value) {
    setCandidatePreset(value)
    if (value === 'custom') {
      if (customPreset?.formula) setCandidateFormula({ ...DEFAULT_FORMULA, ...customPreset.formula })
      return
    }
    setCandidateFormula({ ...(PRESETS[value] || DEFAULT_FORMULA) })
  }

  function updateWeight(key, next) {
    setCandidatePreset('custom')
    setCandidateFormula((prev) => ({ ...prev, [key]: round(next) }))
  }

  function resetCandidate() {
    setCandidatePreset('default')
    setCandidateFormula({ ...DEFAULT_FORMULA })
  }

  function saveCustomPreset(name = 'Custom') {
    const payload = { name, savedAt: new Date().toISOString(), formula: { ...candidateFormula } }
    saveJson(CUSTOM_PRESET_KEY, payload)
    setCustomPreset(payload)
    setCandidatePreset('custom')
    return payload
  }

  function loadCustomPreset() {
    if (!customPreset?.formula) return false
    setCandidateFormula({ ...DEFAULT_FORMULA, ...customPreset.formula })
    setCandidatePreset('custom')
    return true
  }

  function importPreset(json) {
    if (!json || typeof json !== 'object') throw new Error('Invalid preset file')
    const formula = json.formula && typeof json.formula === 'object' ? json.formula : json
    const merged = { ...DEFAULT_FORMULA }
    Object.keys(merged).forEach((k) => {
      if (typeof formula[k] === 'number' && Number.isFinite(formula[k])) merged[k] = formula[k]
    })
    setCandidateFormula(merged)
    setCandidatePreset('custom')
    const payload = { name: json.name || 'Imported', savedAt: new Date().toISOString(), formula: merged }
    saveJson(CUSTOM_PRESET_KEY, payload)
    setCustomPreset(payload)
    return payload
  }

  return {
    baselinePreset, setBaselinePreset,
    candidatePreset, applyPresetToCandidate,
    candidateFormula, updateWeight, resetCandidate,
    baselineFormula,
    customPreset, saveCustomPreset, loadCustomPreset, importPreset,
  }
}
