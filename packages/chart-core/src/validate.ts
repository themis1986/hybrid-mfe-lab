import type { ChartSpec } from './types'

const TYPES = new Set(['line', 'area', 'bar', 'column', 'pie', 'scatter'])

/**
 * Why a spec can't be drawn, or null. Components show the message in place of the chart instead of
 * handing the engine something that would throw or draw nonsense.
 */
export function validateSpec(spec: ChartSpec): string | null {
  if (!TYPES.has(spec.type)) return `Unknown chart type "${String(spec.type)}".`
  if (!Array.isArray(spec.series)) return 'The series must be an array.'
  const ids = new Set<string>()
  for (const [index, series] of spec.series.entries()) {
    if (typeof series?.id !== 'string' || series.id === '')
      return `Series ${index + 1} has no id.`
    if (ids.has(series.id)) return `Two series have the id "${series.id}".`
    ids.add(series.id)
    if (!Array.isArray(series.data))
      return `The data of series "${series.id}" must be an array.`
    if (series.type !== undefined && !TYPES.has(series.type))
      return `Series "${series.id}" has an unknown type "${String(series.type)}".`
    if (series.type === ('pie' as string) && spec.type !== 'pie')
      return `Series "${series.id}" can't be a pie inside a ${spec.type} chart.`
  }
  if (spec.type === 'pie' && spec.series.length > 1)
    return 'A pie chart takes one series.'
  return null
}

const BOOST_THRESHOLD = 5000

/** Advice that doesn't stop the chart from rendering: each is logged once per chart. */
export function specWarnings(spec: ChartSpec, boosted: boolean): string[] {
  const warnings: string[] = []
  if (!spec.title && !spec.ariaLabel && !spec.caption)
    warnings.push(
      'A chart needs an accessible name: set a title, an aria label or a caption.',
    )
  if (!boosted)
    for (const series of spec.series)
      if (series.data.length > BOOST_THRESHOLD)
        warnings.push(
          `Series "${series.id}" has ${series.data.length} points: import the engine's boost module ` +
            `(highcharts/es-modules/masters/modules/boost.src.js) to keep it responsive.`,
        )
  return warnings
}
