import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ThemeSwitch({ theme, onToggle }) {
  const isFerrari = theme === 'ferrari'
  return (
    <Button
      variant='outline'
      size='icon-sm'
      aria-label={isFerrari ? 'Switch to Graphite theme' : 'Switch to Ferrari theme'}
      title={isFerrari ? 'Graphite' : 'Ferrari'}
      onClick={onToggle}
    >
      {isFerrari ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
    </Button>
  )
}
