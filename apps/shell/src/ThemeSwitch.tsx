import { TIcon, TSwitch } from '@repo/ui'
import { Moon, Sun } from '@repo/ui/icons'
import { setTheme, useTheme } from './theme'

export function ThemeSwitch() {
  const theme = useTheme()

  return (
    <span className="inline-flex items-center gap-2 text-fg-muted">
      <TIcon icon={Sun} size="sm" />
      <TSwitch
        size="sm"
        aria-label="Dark theme"
        checked={theme === 'dark'}
        onCheckedChange={(dark) => setTheme(dark ? 'dark' : 'light')}
      />
      <TIcon icon={Moon} size="sm" />
    </span>
  )
}
