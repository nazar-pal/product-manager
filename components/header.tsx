'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sparkles, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function Header() {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="size-5" />
        </div>
        <h1 className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-2xl font-bold text-transparent">
          Менеджер товарів
        </h1>
      </div>

      <Button variant="ghost" size="icon" onClick={toggleTheme}>
        {theme === 'light' ? (
          <Moon className="size-5" />
        ) : (
          <Sun className="size-5" />
        )}
      </Button>
    </div>
  )
}
