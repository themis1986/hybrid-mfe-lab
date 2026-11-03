import {
  ChartController,
  chartTable,
  type ChartSpec,
  validateSpec,
} from '@repo/chart-core'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { useLatest } from '../../lib/latest'
import {
  tChartCanvasClasses,
  tChartClasses,
  tChartMessageClasses,
  tChartTableCaptionClasses,
  tChartTableCellClasses,
  tChartTableClasses,
  tChartTableHeadClasses,
  tChartTableWrapperClasses,
} from './TChart.variants'
import type { TChartProps } from './types'

// A chart filling its parent. The controller (@repo/chart-core) owns the engine: it is created on mount,
// receives every later prop change as a spec (applied in place: series matched by id) and is destroyed on
// unmount. An invalid spec or an engine error shows a message in the chart's place.
export function TChart({
  type,
  series,
  categories,
  xAxis,
  yAxis,
  title,
  subtitle,
  caption,
  ariaLabel,
  stacking,
  legend,
  tooltip,
  valueFormat,
  colors,
  loading = false,
  loadingLabel = 'Loading…',
  emptyLabel,
  table = 'hidden',
  options,
  onPointClick,
  onPointHover,
  onSeriesToggle,
  onLoad,
  ref,
  className,
  style,
}: TChartProps) {
  const container = useRef<HTMLDivElement>(null)
  const controller = useRef<ChartController | null>(null)
  const [failure, setFailure] = useState<string | null>(null)
  const spec: ChartSpec = {
    type,
    series,
    categories,
    xAxis,
    yAxis,
    title,
    subtitle,
    caption,
    ariaLabel,
    stacking,
    legend,
    tooltip,
    valueFormat,
    colors,
    emptyLabel,
    clickable: Boolean(onPointClick),
    options,
  }
  const handlers = { onPointClick, onPointHover, onSeriesToggle, onLoad }
  const invalid = validateSpec(spec)
  const latest = useLatest({ spec, handlers })

  // One controller while the spec is valid. Under StrictMode the effect runs twice: the cleanup destroys
  // the first chart entirely, element included.
  const valid = invalid === null
  useEffect(() => {
    if (!valid || !container.current) return
    const created = new ChartController(
      container.current,
      latest.current.spec,
      latest.current.handlers,
    )
    controller.current = created
    return () => {
      controller.current = null
      created.destroy()
    }
  }, [valid, latest])

  // Every render hands the controller the current props; equal values cost no engine call.
  useEffect(() => {
    const current = controller.current
    if (!current) return
    current.setHandlers(handlers)
    current.update(spec)
    current.setLoading(loading ? loadingLabel : null)
    setFailure(current.failed?.message ?? null)
  })

  useImperativeHandle(
    ref,
    () => ({ getChart: () => controller.current?.chart ?? null }),
    [],
  )

  const message =
    invalid ?? (failure && `The chart could not be drawn: ${failure}`)
  const data = table !== 'none' && !invalid ? chartTable(spec) : null

  return (
    <div
      data-slot="chart"
      className={cn(tChartClasses, className)}
      style={style}
    >
      <div
        ref={container}
        data-slot="chart-canvas"
        className={tChartCanvasClasses}
      />
      {message && (
        <div
          role="status"
          data-slot="chart-message"
          className={tChartMessageClasses}
        >
          {message}
        </div>
      )}
      {data && (
        <div
          data-slot="chart-table"
          className={tChartTableWrapperClasses[table as 'hidden' | 'visible']}
        >
          <table className={tChartTableClasses}>
            {(caption ?? title ?? ariaLabel) && (
              <caption className={tChartTableCaptionClasses}>
                {caption ?? title ?? ariaLabel}
              </caption>
            )}
            <thead>
              <tr>
                {data.columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className={tChartTableHeadClasses}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, index) =>
                    index === 0 ? (
                      <th
                        key={index}
                        scope="row"
                        className={tChartTableHeadClasses}
                      >
                        {cell}
                      </th>
                    ) : (
                      <td key={index} className={tChartTableCellClasses}>
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
