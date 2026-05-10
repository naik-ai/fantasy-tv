import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import TopNBars from '@/components/charts/TopNBars'
import ScatterBaseVsCand from '@/components/charts/ScatterBaseVsCand'
import TrendLine from '@/components/charts/TrendLine'
import PositionDistribution from '@/components/charts/PositionDistribution'
import TeamContribution from '@/components/charts/TeamContribution'

export default function GraphsView({ topBarData, comparison, gwTrend, positionData, teamData }) {
  return (
    <div className='grid gap-3 xl:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Top players</CardTitle>
          <CardDescription>Top 12 under the candidate formula.</CardDescription>
        </CardHeader>
        <CardContent><TopNBars data={topBarData} n={12} /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Baseline vs Candidate</CardTitle>
          <CardDescription>Each dot is a player. Diagonal = no change.</CardDescription>
        </CardHeader>
        <CardContent><ScatterBaseVsCand data={comparison} /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gameweek trend</CardTitle>
          <CardDescription>Average match points per GW.</CardDescription>
        </CardHeader>
        <CardContent><TrendLine data={gwTrend} /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Position distribution</CardTitle>
          <CardDescription>Total candidate points by position.</CardDescription>
        </CardHeader>
        <CardContent><PositionDistribution data={positionData} /></CardContent>
      </Card>

      <Card className='xl:col-span-2'>
        <CardHeader>
          <CardTitle>Team contribution</CardTitle>
          <CardDescription>Top 12 teams by candidate points.</CardDescription>
        </CardHeader>
        <CardContent><TeamContribution data={teamData} /></CardContent>
      </Card>
    </div>
  )
}
