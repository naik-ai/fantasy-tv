import { Download, FileJson } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { downloadBlob, toCsv } from '@/lib/csv'
import { fmt } from '@/lib/format'

export default function ExportView({ comparison, candidateFormula, customPreset, datasetMeta }) {
  function exportLeaderboard() {
    const cols = [
      { label: 'rank', value: (p) => p.rank },
      { label: 'baseline_rank', value: (p) => p.baselineRank },
      { label: 'delta_rank', value: (p) => p.deltaRank },
      { label: 'player', value: (p) => p.player_name },
      { label: 'team', value: (p) => p.team },
      { label: 'position', value: (p) => p.position },
      { label: 'candidate_points', value: (p) => fmt(p.totalPoints, 2) },
      { label: 'baseline_points', value: (p) => fmt(p.baselinePoints, 2) },
      { label: 'delta_points', value: (p) => fmt(p.deltaPoints, 2) },
      { label: 'avg_points', value: (p) => fmt(p.avgPoints, 2) },
      { label: 'matches', value: (p) => p.matches },
      { label: 'consistency', value: (p) => fmt(p.consistency, 2) },
    ]
    downloadBlob(toCsv(comparison, cols), 'fantasy_formula_compare.csv')
  }

  function exportPreset() {
    const payload = {
      name: customPreset?.name || 'Custom',
      savedAt: new Date().toISOString(),
      formula: candidateFormula,
    }
    downloadBlob(JSON.stringify(payload, null, 2), 'fantasy_formula_preset.json', 'application/json')
  }

  return (
    <div className='grid gap-3 md:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Filtered leaderboard CSV</CardTitle>
          <CardDescription>
            Current view, sorted as displayed: {comparison.length} players · {datasetMeta.rows} match rows.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <ul className='text-xs text-[var(--dim)]'>
            <li>• rank, baseline_rank, Δ rank</li>
            <li>• candidate_points, baseline_points, Δ points</li>
            <li>• avg_points, matches, consistency (σ)</li>
          </ul>
          <Button onClick={exportLeaderboard}>
            <Download className='mr-1 h-4 w-4' /> Download CSV
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidate preset JSON</CardTitle>
          <CardDescription>
            Slot: <span className='text-[var(--ink)]'>{customPreset?.name || 'Custom'}</span>
            {customPreset?.savedAt ? ` · saved ${new Date(customPreset.savedAt).toLocaleString()}` : ' · unsaved'}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <ul className='text-xs text-[var(--dim)]'>
            <li>• Re-importable via the Tune drawer</li>
            <li>• Includes every weight, threshold, and minute tier</li>
          </ul>
          <Button variant='outline' onClick={exportPreset}>
            <FileJson className='mr-1 h-4 w-4' /> Download JSON
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
