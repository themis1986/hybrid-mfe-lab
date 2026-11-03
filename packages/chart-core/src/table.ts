import { formatValue } from './options'
import type { ChartDatum, ChartSpec, ChartTable } from './types'

function pointOf(datum: ChartDatum) {
  if (Array.isArray(datum)) return { x: datum[0], y: datum[1] }
  if (datum !== null && typeof datum === 'object')
    return { x: datum.x ?? datum.name, y: datum.y }
  return { x: undefined, y: datum }
}

/**
 * The spec's data as a table: one row per category (a column per series), or per point when points carry
 * their own x (scatter, datetime). Components render it as the chart's accessible fallback.
 */
export function chartTable(spec: ChartSpec): ChartTable {
  const xHeader = spec.xAxis?.title ?? 'Category'
  const value = (y: number | null | undefined) => formatValue(spec, y)
  const explicitX = spec.series.some((series) =>
    series.data.some((datum) => pointOf(datum).x !== undefined),
  )

  if (spec.type === 'pie') {
    const [series] = spec.series
    return {
      columns: [xHeader, series?.name ?? series?.id ?? 'Value'],
      rows: (series?.data ?? []).map((datum, index) => {
        const point = pointOf(datum)
        return [
          String(point.x ?? spec.categories?.[index] ?? index + 1),
          value(point.y),
        ]
      }),
    }
  }

  if (explicitX && spec.type !== 'bar' && spec.type !== 'column')
    return {
      columns: ['Series', xHeader, spec.yAxis?.title ?? 'Value'],
      rows: spec.series.flatMap((series) =>
        series.data.map((datum, index) => {
          const point = pointOf(datum)
          return [
            series.name ?? series.id,
            String(point.x ?? spec.categories?.[index] ?? index + 1),
            value(point.y),
          ]
        }),
      ),
    }

  const length = Math.max(
    spec.categories?.length ?? 0,
    ...spec.series.map((series) => series.data.length),
  )
  return {
    columns: [
      xHeader,
      ...spec.series.map((series) => series.name ?? series.id),
    ],
    rows: Array.from({ length }, (_, index) => [
      spec.categories?.[index] ?? String(index + 1),
      ...spec.series.map((series) => {
        const datum = series.data[index]
        return datum === undefined ? '–' : value(pointOf(datum).y)
      }),
    ]),
  }
}
