import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function FilterBar({ filters, options }) {
  const f = filters
  const { teams, positions, gameweeks } = options
  return (
    <div className='grid gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:grid-cols-2 xl:grid-cols-6'>
      <div className='relative xl:col-span-2'>
        <Search className='absolute left-2.5 top-2 h-4 w-4 text-[var(--dim)]' />
        <Input className='pl-8' placeholder='Search player' value={f.search} onChange={(e) => f.setSearch(e.target.value)} />
      </div>
      <Select value={f.position} onValueChange={f.setPosition}>
        <SelectTrigger className='w-full'><SelectValue placeholder='Position' /></SelectTrigger>
        <SelectContent>
          <SelectItem value='ALL'>All Positions</SelectItem>
          {positions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={f.team} onValueChange={f.setTeam}>
        <SelectTrigger className='w-full'><SelectValue placeholder='Team' /></SelectTrigger>
        <SelectContent>
          <SelectItem value='ALL'>All Teams</SelectItem>
          {teams.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={f.gameweek} onValueChange={f.setGameweek}>
        <SelectTrigger className='w-full'><SelectValue placeholder='GW' /></SelectTrigger>
        <SelectContent>
          <SelectItem value='ALL'>All GWs</SelectItem>
          {gameweeks.map((gw) => <SelectItem key={gw} value={String(gw)}>GW {gw}</SelectItem>)}
        </SelectContent>
      </Select>
      <Input
        type='number'
        min='0'
        value={f.minMinutes}
        onChange={(e) => f.setMinMinutes(e.target.value)}
        placeholder='Min minutes'
      />
    </div>
  )
}
