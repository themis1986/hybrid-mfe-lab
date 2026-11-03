import type Highcharts from 'highcharts/es-modules/masters/highcharts.src.js'
import { CHART_COLORS, resolveColor } from './palette'
import type {
  ChartAxis,
  ChartDatum,
  ChartInstance,
  ChartOptions,
  ChartPointEvent,
  ChartSeries,
  ChartSeriesRef,
  ChartSpec,
  ChartToggleEvent,
} from './types'

/** What the engine's events report, already turned into plain payloads. The controller passes these. */
export interface ChartEventBridge {
  pointClick(event: ChartPointEvent): void
  pointHover(event: ChartPointEvent | null): void
  toggle(event: ChartToggleEvent): void
  load(chart: ChartInstance): void
}

export interface BuildContext {
  /** No animation at all (the user asked for reduced motion). */
  reducedMotion?: boolean
  events?: ChartEventBridge
  /**
   * The spec that formatters read when they run. The controller passes its latest spec, so a new formatter
   * function takes effect without an engine update. Default: the spec being built.
   */
  latest?: () => ChartSpec
}

type Point = Highcharts.Point
type Series = Highcharts.Series

export const DEFAULT_EMPTY_LABEL = 'No data to display'

/**
 * Turns a spec into engine options. Pure: the same spec and context give equal options (compared as JSON
 * by the controller; functions are stable wrappers that read `latest()`).
 */
export function buildOptions(
  spec: ChartSpec,
  context: BuildContext = {},
): ChartOptions {
  const latest = context.latest ?? (() => spec)
  const pie = spec.type === 'pie'
  const animation = context.reducedMotion ? false : undefined
  const events = context.events

  const options: ChartOptions = {
    chart: {
      type: spec.type,
      backgroundColor: 'transparent',
      style: { fontFamily: 'var(--t-font-sans)' },
      animation,
      // The controller observes the container itself; the engine's own observer is never disconnected.
      reflow: false,
      // The engine must not write into the caller's arrays (React props, Vue reactive state).
      allowMutatingData: false,
      events: events && {
        load(this: ChartInstance) {
          events.load(this)
        },
      },
    },
    // The token stylesheet (styles.ts) defines every palette variable instead.
    palette: { injectCSS: false },
    colors: spec.colors?.map(resolveColor) ?? [...CHART_COLORS],
    credits: { enabled: false },
    // An empty text renders no title (unset, the engine shows a placeholder one).
    title: { text: spec.title ?? '' },
    subtitle: { text: spec.subtitle ?? '' },
    caption: { text: spec.caption ?? '' },
    accessibility: { enabled: true },
    lang: {
      noData: spec.emptyLabel ?? DEFAULT_EMPTY_LABEL,
      accessibility: spec.ariaLabel
        ? {
            defaultChartTitle: spec.ariaLabel,
            chartContainerLabel: spec.ariaLabel,
          }
        : {},
    },
    legend: legendOptions(spec),
    tooltip: tooltipOptions(spec, latest),
    plotOptions: {
      series: {
        animation,
        cursor: spec.clickable ? 'pointer' : undefined,
        stacking: pie ? undefined : spec.stacking,
        events: events && {
          legendItemClick(this: Series) {
            events.toggle({
              series: seriesRef(this),
              name: this.name,
              visible: !this.visible,
            })
          },
          mouseOut() {
            events.pointHover(null)
          },
        },
        point: events && {
          events: {
            click(this: Point) {
              events.pointClick(toPointEvent(this))
            },
            mouseOver(this: Point) {
              events.pointHover(toPointEvent(this))
            },
          },
        },
      },
      area: { fillOpacity: 0.3 },
      pie: {
        showInLegend: true,
        dataLabels: {
          style: {
            color: 'var(--t-color-fg)',
            fontWeight: 'normal',
            textOutline: 'none',
          },
        },
        point: events && {
          events: {
            legendItemClick(this: Point) {
              events.toggle({
                series: seriesRef(this.series),
                index: this.index,
                name: this.name,
                visible: !this.visible,
              })
            },
          },
        },
      },
    },
    series: spec.series.map((series) => seriesOptions(series, spec)),
  }
  if (!pie) {
    options.xAxis = axisOptions(spec.xAxis, latest, false, spec.categories)
    options.yAxis = axisOptions(
      spec.yAxis,
      latest,
      true,
    ) as Highcharts.YAxisOptions
  }
  return spec.options ? deepMerge(options, spec.options) : options
}

/** The series options, as `addSeries`/`series.update` take them. */
export function seriesOptions(
  series: ChartSeries,
  spec: ChartSpec,
): Highcharts.SeriesOptionsType {
  const pie = spec.type === 'pie'
  const options = {
    id: series.id,
    name: series.name ?? series.id,
    type: pie ? 'pie' : (series.type ?? spec.type),
    data: pie ? pieData(series.data, spec.categories) : series.data,
    color: series.color && resolveColor(series.color),
    visible: series.visible,
    dashStyle: series.dashStyle,
    marker:
      series.marker === false
        ? { enabled: false }
        : series.marker
          ? { symbol: series.marker }
          : undefined,
    stack: series.stack,
  }
  return dropUndefined(options) as Highcharts.SeriesOptionsType
}

// Plain numbers in a pie are named after the categories.
function pieData(data: ChartDatum[], categories: string[] = []) {
  return data.map((datum, index) =>
    typeof datum === 'number' || datum === null
      ? { name: categories[index] ?? String(index + 1), y: datum }
      : datum,
  )
}

function legendOptions(spec: ChartSpec): Highcharts.LegendOptions {
  const { legend } = spec
  const enabled =
    legend === undefined
      ? spec.type === 'pie' || spec.series.length > 1
      : legend !== false
  if (legend === 'right')
    return {
      enabled,
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
    }
  return {
    enabled,
    align: 'center',
    verticalAlign: legend === 'top' ? 'top' : 'bottom',
    layout: 'horizontal',
  }
}

function tooltipOptions(
  spec: ChartSpec,
  latest: () => ChartSpec,
): Highcharts.TooltipOptions {
  if (spec.tooltip === false) return { enabled: false }
  if (typeof spec.tooltip === 'function')
    return {
      enabled: true,
      formatter(this: Point) {
        const format = latest().tooltip
        return typeof format === 'function'
          ? format(toPointEvent(this))
          : String(this.y)
      },
    }
  if (spec.valueFormat)
    return {
      enabled: true,
      pointFormatter(this: Point) {
        return `<span style="color:${this.color}">●</span> ${escapeMarkup(this.series.name)}: <b>${formatValue(latest(), this.y)}</b><br/>`
      },
    }
  return { enabled: true }
}

function axisOptions(
  axis: ChartAxis | undefined,
  latest: () => ChartSpec,
  values: boolean,
  categories?: string[],
): Highcharts.XAxisOptions {
  const options: Highcharts.XAxisOptions = {
    // An empty title hides the engine's default one.
    title: { text: axis?.title ?? '' },
    min: axis?.min,
    max: axis?.max,
    type: axis?.type,
    categories,
    labels: {},
  }
  if (axis?.format) options.labels = { format: axis.format }
  else if (values && latest().valueFormat)
    options.labels = {
      formatter(this: Highcharts.AxisLabelsFormatterContextObject) {
        return typeof this.value === 'number'
          ? formatValue(latest(), this.value)
          : String(this.value)
      },
    }
  return options
}

export function formatValue(spec: ChartSpec, value: number | null | undefined) {
  if (value === null || value === undefined) return '–'
  return spec.valueFormat ? spec.valueFormat(value) : String(value)
}

function seriesRef(series: Series): ChartSeriesRef {
  return { id: String(series.options.id ?? series.index), name: series.name }
}

/** An engine point as a plain payload. */
export function toPointEvent(point: Point): ChartPointEvent {
  const category =
    point.series.type === 'pie' ? point.name : (point.category ?? undefined)
  return dropUndefined({
    series: seriesRef(point.series),
    index: point.index,
    value: point.y ?? null,
    category,
    x: point.x,
    percentage: point.percentage,
  }) as ChartPointEvent
}

const escapeMarkup = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function dropUndefined<T extends object>(object: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  ) as Partial<T>
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  Object.getPrototypeOf(value) === Object.prototype

/** Merges `extra` over `base` into a new object: plain objects merge, anything else (arrays too) replaces. */
export function deepMerge<T extends object>(base: T, extra: object): T {
  const result = { ...base } as Record<string, unknown>
  for (const [key, value] of Object.entries(extra)) {
    const current = result[key]
    result[key] =
      isPlainObject(current) && isPlainObject(value)
        ? deepMerge(current, value)
        : value
  }
  return result as T
}
