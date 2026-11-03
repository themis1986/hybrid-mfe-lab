import type Highcharts from 'highcharts/es-modules/masters/highcharts.src.js'

/**
 * The engine's chart: the escape hatch for anything the spec doesn't cover. An interface rather than an
 * alias, so types emitted by the libraries name it from this package (the engine isn't their dependency).
 */
export interface ChartInstance extends Highcharts.Chart {}
/** Raw engine options, deep-merged over the built ones (`ChartSpec.options`). */
export type ChartOptions = Highcharts.Options

export type ChartType = 'line' | 'area' | 'bar' | 'column' | 'pie' | 'scatter'

/** A value; `[x, y]` for numeric or datetime x; an object to name or identify a point. */
export type ChartDatum =
  | number
  | null
  | [number | string, number | null]
  | { x?: number | string; y: number | null; name?: string; id?: string }

/** A design token name (`'chart-3'`, `'accent'`…) or any CSS colour. */
export type ChartColor =
  | `chart-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'fg'
  | 'fg-muted'
  | (string & {})

export type ChartDashStyle =
  | 'Solid'
  | 'ShortDash'
  | 'ShortDot'
  | 'ShortDashDot'
  | 'Dot'
  | 'Dash'
  | 'LongDash'
  | 'DashDot'

export type ChartMarker =
  'circle' | 'square' | 'diamond' | 'triangle' | 'triangle-down'

export interface ChartSeries {
  /** Stable and unique in the chart: updates are matched by id, never by position. */
  id: string
  /** Legend and tooltip name. Defaults to the id. */
  name?: string
  data: ChartDatum[]
  /** Another cartesian type for this series (a line over columns). Not pie. */
  type?: Exclude<ChartType, 'pie'>
  color?: ChartColor
  /** Unset: the chart's own state (the legend can hide it). */
  visible?: boolean
  dashStyle?: ChartDashStyle
  /** A marker shape, or false for none. Unset: the engine cycles shapes, so lines differ without colour. */
  marker?: ChartMarker | false
  /** Series with the same stack key stack together (with `stacking`). */
  stack?: string
}

export interface ChartAxis {
  title?: string
  min?: number
  max?: number
  /** An engine format string for the labels, e.g. `'{value} %'` or `'{value:%b %e}'`. */
  format?: string
  type?: 'linear' | 'logarithmic' | 'datetime' | 'category'
}

export type ChartLegend = boolean | 'top' | 'bottom' | 'right'

/** A series as events and formatters see it. */
export interface ChartSeriesRef {
  id: string
  name: string
}

/** A point as events and formatters see it: plain values, no engine objects. */
export interface ChartPointEvent {
  series: ChartSeriesRef
  /** The point's index in its series. */
  index: number
  /** Its y value (a pie slice's value). */
  value: number | null
  /** The category, or the point's name (pie). */
  category?: string | number
  x?: number | string
  /** Pie and percent stacking. */
  percentage?: number
}

/** A legend click: a series (or, in a pie, a slice) is about to be shown or hidden. */
export interface ChartToggleEvent {
  series: ChartSeriesRef
  /** The slice's index and name, in a pie. */
  index?: number
  name: string
  /** The state after the click. */
  visible: boolean
}

export type ChartValueFormatter = (value: number) => string
export type ChartTooltipFormatter = (point: ChartPointEvent) => string

/** The framework-neutral description of a chart. Both libraries build it from their props. */
export interface ChartSpec {
  type: ChartType
  series: ChartSeries[]
  /** Category axis labels; a pie's slice names when its data are plain numbers. */
  categories?: string[]
  xAxis?: ChartAxis
  yAxis?: ChartAxis
  title?: string
  subtitle?: string
  /** A visible description under the chart; screen readers read it too. */
  caption?: string
  /** The chart's accessible name when it has no visible title. */
  ariaLabel?: string
  stacking?: 'normal' | 'percent'
  /** Unset: shown for a pie or more than one series. */
  legend?: ChartLegend
  /** false hides tooltips; a function returns their text. */
  tooltip?: boolean | ChartTooltipFormatter
  /** Formats y values: the value axis labels, the default tooltip and the data table. */
  valueFormat?: ChartValueFormatter
  /** The series colours in order. Default: the token palette (`--t-color-chart-1…8`). */
  colors?: ChartColor[]
  /** Shown when there is nothing to draw. */
  emptyLabel?: string
  /** Points show a pointer cursor. Components set it when a point-click handler is given. */
  clickable?: boolean
  /** Raw engine options, deep-merged last (objects merge, arrays and functions replace). */
  options?: ChartOptions
}

/** Callbacks a controller calls; set them again whenever they change (`setHandlers`). */
export interface ChartHandlers {
  onPointClick?: (event: ChartPointEvent) => void
  /** A point is hovered; null once the pointer leaves the series. */
  onPointHover?: (event: ChartPointEvent | null) => void
  onSeriesToggle?: (event: ChartToggleEvent) => void
  /** The chart was created (again, after a structural change). */
  onLoad?: (chart: ChartInstance) => void
}

/** A table of the spec's data, for an accessible (or visible) fallback. */
export interface ChartTable {
  columns: string[]
  rows: string[][]
}
