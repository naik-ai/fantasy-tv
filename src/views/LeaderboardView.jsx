import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FilterBar from '@/components/filters/FilterBar'
import SortMenu from '@/components/filters/SortMenu'
import ImpactTable from '@/components/table/ImpactTable'
import RawMatchesTable from '@/components/table/RawMatchesTable'

export default function LeaderboardView({
  filters,
  options,
  comparison,
  filteredRows,
  baselineFormula,
  candidateFormula,
  onSelect,
}) {
  const [tab, setTab] = useState('impact')
  return (
    <div className='space-y-3'>
      <FilterBar filters={filters} options={options} />

      <Card>
        <CardHeader className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Tap a row for the breakdown drawer.</CardDescription>
          </div>
          <SortMenu sortBy={filters.sortBy} setSortBy={filters.setSortBy} sortDir={filters.sortDir} setSortDir={filters.setSortDir} />
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value='impact'>Formula impact</TabsTrigger>
              <TabsTrigger value='raw'>Raw matches</TabsTrigger>
            </TabsList>
            <TabsContent value='impact' className='pt-3'>
              <ImpactTable rows={comparison} onSelect={onSelect} />
            </TabsContent>
            <TabsContent value='raw' className='pt-3'>
              <RawMatchesTable rows={filteredRows} baselineFormula={baselineFormula} candidateFormula={candidateFormula} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
