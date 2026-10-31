import type { CSSProperties } from 'react'

// Shared cva variants for the layout components. Steps 0-8 map onto Tailwind's spacing scale:
// 0, 4, 8, 12, 16, 24, 32, 48, 64px. Class names are written out in full so Tailwind's scanner finds them.
export const gapVariants = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-6',
  6: 'gap-8',
  7: 'gap-12',
  8: 'gap-16',
} as const

export const padVariants = {
  0: 'p-0',
  1: 'p-1',
  2: 'p-2',
  3: 'p-3',
  4: 'p-4',
  5: 'p-6',
  6: 'p-8',
  7: 'p-12',
  8: 'p-16',
} as const

export const padYVariants = {
  0: 'py-0',
  1: 'py-1',
  2: 'py-2',
  3: 'py-3',
  4: 'py-4',
  5: 'py-6',
  6: 'py-8',
  7: 'py-12',
  8: 'py-16',
} as const

export const alignVariants = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const

export const justifyVariants = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
} as const

/** Merges prop-driven values (including `--t-*` custom properties) into a caller's `style`; undefined values are skipped. */
export function withStyle(style: CSSProperties | undefined, extra: Record<string, string | number | undefined>) {
  const defined = Object.entries(extra).filter(([, value]) => value !== undefined)
  return defined.length === 0 ? style : ({ ...style, ...Object.fromEntries(defined) } as CSSProperties)
}
