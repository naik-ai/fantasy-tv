import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const SORT_OPTIONS = [
  { value: 'totalPoints', label: 'Total Points' },
  { value: 'avgPoints', label: 'Average Points' },
  { value: 'xg', label: 'xG' },
  { value: 'xa', label: 'xA' },
  { value: 'consistency', label: 'Consistency' },
  { value: 'deltaPoints', label: 'Δ Points' },
  { value: 'deltaRank', label: 'Δ Rank' },
]

export default function SortMenu({ sortBy, setSortBy, sortDir, setSortDir }) {
  return (
    <div className='flex items-center gap-2'>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className='w-44'><SelectValue /></SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={sortDir} onValueChange={setSortDir}>
        <SelectTrigger className='w-24'><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value='desc'>Desc</SelectItem>
          <SelectItem value='asc'>Asc</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
