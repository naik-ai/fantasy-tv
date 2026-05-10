import { useEffect, useMemo, useState } from 'react'

import AppShell from '@/components/layout/AppShell'
import TuningDrawer from '@/components/tuning/TuningDrawer'
import BreakdownDrawer from '@/components/table/BreakdownDrawer'

import OverviewView from '@/views/OverviewView'
import LeaderboardView from '@/views/LeaderboardView'
import CompareView from '@/views/CompareView'
import GraphsView from '@/views/GraphsView'
import ExportView from '@/views/ExportView'

import { parseCsv } from '@/lib/csv'
import { calcMatchPoints } from '@/lib/formula'
import { aggregatePlayers, buildComparison } from '@/lib/aggregate'
import { fmt } from '@/lib/format'

import { useTheme } from '@/state/useTheme'
import { useView } from '@/state/useView'
import { useFilters, applyFilters } from '@/state/useFilters'
import { useFormula } from '@/state/useFormula'

import './App.css'

export default function App() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tuningOpen, setTuningOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const { theme, toggle: toggleTheme } = useTheme()
  const { view, setView } = useView()
  const filters = useFilters()
  const formula = useFormula()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await fetch('/data/pl_2025_26_player_match_stats.csv', { cache: 'no-store' })
        if (!res.ok) throw new Error('CSV not found')
        const text = await res.text()
        const parsed = parseCsv(text)
        const required = ['player_name', 'position', 'team', 'gameweek', 'player_id']
        const missing = required.filter((f) => !(f in (parsed[0] || {})))
        if (missing.length) throw new Error(`CSV schema mismatch: missing ${missing.join(', ')}`)
        if (!cancelled) setRows(parsed)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load CSV')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const teams = useMemo(() => [...new Set(rows.map((r) => r.team))].filter(Boolean).sort(), [rows])
  const positions = useMemo(() => [...new Set(rows.map((r) => r.position))].filter(Boolean).sort(), [rows])
  const gameweeks = useMemo(() => [...new Set(rows.map((r) => r.gameweek))].sort((a, b) => a - b), [rows])

  const filteredRows = useMemo(
    () => applyFilters(rows, filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the filter values affect output
    [rows, filters.search, filters.position, filters.team, filters.gameweek, filters.minMinutes],
  )

  const baselineLeaderboard = useMemo(() => aggregatePlayers(filteredRows, formula.baselineFormula), [filteredRows, formula.baselineFormula])
  const candidateLeaderboard = useMemo(() => aggregatePlayers(filteredRows, formula.candidateFormula), [filteredRows, formula.candidateFormula])
  const comparison = useMemo(
    () => buildComparison(baselineLeaderboard, candidateLeaderboard, filters.sortBy, filters.sortDir),
    [baselineLeaderboard, candidateLeaderboard, filters.sortBy, filters.sortDir],
  )

  const datasetMeta = useMemo(() => {
    const players = new Set(rows.map((r) => r.player_id)).size
    const teamsCount = new Set(rows.map((r) => r.team)).size
    const gws = gameweeks.length ? `${gameweeks[0]}-${gameweeks[gameweeks.length - 1]}` : '-'
    return { rows: rows.length, players, teams: teamsCount, gws }
  }, [rows, gameweeks])

  const kpis = useMemo(() => {
    const top = [...comparison].sort((a, b) => b.totalPoints - a.totalPoints)[0]
    return {
      players: comparison.length,
      rows: filteredRows.length,
      top: top?.player_name || '-',
      topPts: top ? fmt(top.totalPoints, 1) : '0.0',
      avg: comparison.length ? fmt(comparison.reduce((s, p) => s + p.totalPoints, 0) / comparison.length, 1) : '0.0',
    }
  }, [comparison, filteredRows])

  const topBarData = useMemo(
    () =>
      [...comparison]
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 12)
        .map((p) => ({ label: p.player_name, value: p.totalPoints })),
    [comparison],
  )

  const moversData = useMemo(
    () =>
      [...comparison]
        .sort((a, b) => Math.abs(b.deltaPoints) - Math.abs(a.deltaPoints))
        .slice(0, 12)
        .map((p) => ({ label: p.player_name, value: p.deltaPoints })),
    [comparison],
  )

  const gwTrend = useMemo(() => {
    const gws = [...new Set(filteredRows.map((r) => r.gameweek))].sort((a, b) => a - b)
    return gws.map((gw) => {
      const rs = filteredRows.filter((r) => r.gameweek === gw)
      const baseAvg = rs.length ? rs.reduce((s, r) => s + calcMatchPoints(r, formula.baselineFormula), 0) / rs.length : 0
      const candAvg = rs.length ? rs.reduce((s, r) => s + calcMatchPoints(r, formula.candidateFormula), 0) / rs.length : 0
      return { gw, baseAvg, candAvg }
    })
  }, [filteredRows, formula.baselineFormula, formula.candidateFormula])

  const positionData = useMemo(() => {
    const map = new Map()
    comparison.forEach((p) => map.set(p.position, (map.get(p.position) || 0) + p.totalPoints))
    return [...map.entries()].map(([label, value]) => ({ label, value }))
  }, [comparison])

  const teamData = useMemo(() => {
    const map = new Map()
    comparison.forEach((p) => map.set(p.team, (map.get(p.team) || 0) + p.totalPoints))
    return [...map.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12)
  }, [comparison])

  const playersList = useMemo(() => [...comparison].sort((a, b) => a.player_name.localeCompare(b.player_name)), [comparison])

  if (loading) {
    return (
      <div className='min-h-[100dvh] bg-[var(--bg)] p-6 text-[var(--ink)]'>
        <div className='mx-auto max-w-7xl text-sm text-[var(--dim)]'>Loading dashboard…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-[100dvh] bg-[var(--bg)] p-6'>
        <div className='mx-auto max-w-7xl text-sm text-[var(--zone-redline)]'>Error: {error}</div>
      </div>
    )
  }

  return (
    <>
      <AppShell
        datasetMeta={datasetMeta}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenTuning={() => setTuningOpen(true)}
        view={view}
        onChangeView={setView}
      >
        {view === 'overview' && (
          <OverviewView
            kpis={kpis}
            comparison={comparison}
            topBarData={topBarData}
            moversData={moversData}
            onSelect={setSelectedPlayer}
          />
        )}
        {view === 'leaderboard' && (
          <LeaderboardView
            filters={filters}
            options={{ teams, positions, gameweeks }}
            comparison={comparison}
            filteredRows={filteredRows}
            baselineFormula={formula.baselineFormula}
            candidateFormula={formula.candidateFormula}
            onSelect={setSelectedPlayer}
          />
        )}
        {view === 'compare' && (
          <CompareView
            playersList={playersList}
            comparison={comparison}
            teams={teams}
            positions={positions}
          />
        )}
        {view === 'graphs' && (
          <GraphsView
            topBarData={topBarData}
            comparison={comparison}
            gwTrend={gwTrend}
            positionData={positionData}
            teamData={teamData}
          />
        )}
        {view === 'export' && (
          <ExportView
            comparison={comparison}
            candidateFormula={formula.candidateFormula}
            customPreset={formula.customPreset}
            datasetMeta={datasetMeta}
          />
        )}
      </AppShell>

      <TuningDrawer
        open={tuningOpen}
        onClose={() => setTuningOpen(false)}
        baselinePreset={formula.baselinePreset}
        setBaselinePreset={formula.setBaselinePreset}
        candidatePreset={formula.candidatePreset}
        applyPresetToCandidate={formula.applyPresetToCandidate}
        candidateFormula={formula.candidateFormula}
        updateWeight={formula.updateWeight}
        resetCandidate={formula.resetCandidate}
        customPreset={formula.customPreset}
        saveCustomPreset={formula.saveCustomPreset}
        importPreset={formula.importPreset}
      />

      <BreakdownDrawer
        player={selectedPlayer}
        rows={filteredRows}
        baselineFormula={formula.baselineFormula}
        candidateFormula={formula.candidateFormula}
        onClose={() => setSelectedPlayer(null)}
      />
    </>
  )
}
