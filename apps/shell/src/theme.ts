import { useSyncExternalStore } from 'react'

// The colour scheme of the whole page, remotes included: `data-theme` on <html> overrides the OS
// preference (see @repo/tokens/tokens.css). Until the user picks one, the page follows the OS.
// index.html applies a stored choice before the first paint; keep its storage key in sync.
export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'the-lab:theme'

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
const listeners = new Set<() => void>()

function getTheme(): Theme {
  const forced = document.documentElement.dataset.theme
  if (forced === 'light' || forced === 'dark') return forced
  return darkQuery.matches ? 'dark' : 'light'
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  darkQuery.addEventListener('change', listener)
  return () => {
    listeners.delete(listener)
    darkQuery.removeEventListener('change', listener)
  }
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage blocked (private mode, policy): the choice lasts until reload.
  }
  listeners.forEach((listener) => listener())
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme)
}
