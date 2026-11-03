import type { ChartColor } from './types'

// The series colours: the token palette, in its fixed order. Values stay CSS variables all the way to the
// SVG, so a theme switch recolours every chart without touching the engine.
export const CHART_COLORS: readonly string[] = Array.from(
  { length: 8 },
  (_, index) => `var(--t-color-chart-${index + 1})`,
)

const TOKEN_COLORS = new Set([
  'accent',
  'info',
  'success',
  'warning',
  'danger',
  'fg',
  'fg-muted',
])

/** A token name ('chart-3', 'accent'…) becomes its CSS variable; any other value is a CSS colour, kept. */
export function resolveColor(color: ChartColor): string {
  return /^chart-[1-8]$/.test(color) || TOKEN_COLORS.has(color)
    ? `var(--t-color-${color})`
    : color
}
