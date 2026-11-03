import type Highcharts from 'highcharts/es-modules/masters/highcharts.src.js'
import { Highcharts as defaultEngine } from './engine'
import { buildOptions, type ChartEventBridge } from './options'
import { CHART_CLASS, ensureChartStyles } from './styles'
import type {
  ChartHandlers,
  ChartInstance,
  ChartOptions,
  ChartSpec,
} from './types'
import { specWarnings } from './validate'

/** The part of the engine the controller uses: `Highcharts` itself, or a fake in tests. */
export interface ChartEngine {
  chart(container: HTMLElement, options: ChartOptions): ChartInstance
  /** Present once the boost module is loaded. */
  hasWebGLSupport?: unknown
}

export interface ChartControllerOptions {
  /** Default: the engine with the default modules (accessibility, no-data). */
  engine?: ChartEngine
}

type SeriesOptions = Highcharts.SeriesOptionsType & { id: string }

// Charts whose kinds can't turn into each other by an update: a change between them re-creates the chart.
const family = (spec: ChartSpec) =>
  spec.type === 'pie' ? 'pie' : spec.type === 'bar' ? 'inverted' : 'cartesian'

const same = (a: unknown, b: unknown) =>
  a === b || JSON.stringify(a) === JSON.stringify(b)

const reducedMotion = () =>
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Owns one chart in a container: creates it, turns spec changes into targeted engine calls (series matched
 * by id: `setData`, `series.update`, `addSeries`, `remove`; the rest through one `chart.update`), follows
 * the container's size, shows the loading state and destroys everything. It is the only code that calls
 * the engine. After `destroy()`, every method is a no-op.
 */
export class ChartController {
  private readonly container: HTMLElement
  private readonly engine: ChartEngine
  private readonly observer: ResizeObserver | null
  private readonly warned = new Set<string>()
  private readonly bridge: ChartEventBridge
  private handlers: ChartHandlers
  private spec: ChartSpec
  private options: ChartOptions
  private host: HTMLElement | null = null
  private instance: ChartInstance | null = null
  private loading: string | null = null
  private failure: Error | null = null
  private destroyed = false

  constructor(
    container: HTMLElement,
    spec: ChartSpec,
    handlers: ChartHandlers = {},
    options: ChartControllerOptions = {},
  ) {
    this.container = container
    this.engine = options.engine ?? defaultEngine
    this.handlers = handlers
    this.spec = spec
    // Bound once: they call whatever handlers are current when the engine fires.
    this.bridge = {
      pointClick: (event) => this.handlers.onPointClick?.(event),
      pointHover: (event) => this.handlers.onPointHover?.(event),
      toggle: (event) => this.handlers.onSeriesToggle?.(event),
      load: (chart) => this.handlers.onLoad?.(chart),
    }
    this.options = this.build(spec)
    this.create()
    this.observer =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(() => this.instance?.reflow())
        : null
    this.observer?.observe(container)
  }

  /** The engine's chart, or null once destroyed (or when the engine failed). */
  get chart(): ChartInstance | null {
    return this.instance
  }

  /** The engine's last error, until a later spec draws again. Components show it in place of the chart. */
  get failed(): Error | null {
    return this.failure
  }

  setHandlers(handlers: ChartHandlers) {
    this.handlers = handlers
  }

  /** Applies a new spec in place; a change of chart family (pie, bar, the rest) re-creates the chart. */
  update(spec: ChartSpec) {
    if (this.destroyed) return
    const previous = this.spec
    this.spec = spec
    const next = this.build(spec)
    if (
      !this.instance ||
      family(spec) !== family(previous) ||
      !same(next.colors, this.options.colors)
    ) {
      // No chart (the engine failed), another family, or new colours (series take theirs when created).
      // A spec that failed already isn't retried until it changes.
      if (!this.instance && same(next, this.options)) return
      this.options = next
      this.recreate()
      return
    }
    try {
      this.apply(this.instance, next)
      this.failure = null
    } catch (error) {
      // A half-applied update leaves the chart in an unknown state: start over from the spec.
      this.report(error)
      this.options = next
      this.recreate()
    }
    this.warn(spec)
  }

  private apply(chart: ChartInstance, next: ChartOptions) {
    const { series: nextSeries = [], ...rest } = next
    const { series: previousSeries = [], ...previousRest } = this.options
    this.options = next
    let dirty = false

    if (!same(rest, previousRest)) {
      chart.update(rest, false)
      dirty = true
    }

    const wanted = nextSeries as SeriesOptions[]
    const before = new Map(
      (previousSeries as SeriesOptions[]).map((series) => [series.id, series]),
    )
    const ids = new Set(wanted.map((series) => series.id))
    for (const series of [...chart.series]) {
      const id = series.options.id
      if (id !== undefined && !ids.has(id)) {
        series.remove(false)
        dirty = true
      }
    }
    for (const options of wanted) {
      const live = chart.get(options.id) as Highcharts.Series | undefined
      const old = before.get(options.id)
      if (!live || !old) {
        chart.addSeries(options, false)
        dirty = true
        continue
      }
      const { data, ...meta } = options as SeriesOptions & { data?: unknown }
      const { data: oldData, ...oldMeta } = old as SeriesOptions & {
        data?: unknown
      }
      if (!same(meta, oldMeta)) {
        live.update(meta as Highcharts.SeriesOptionsType, false)
        dirty = true
      }
      if (!same(data, oldData)) {
        live.setData(data as Highcharts.PointOptionsType[], false)
        dirty = true
      }
    }
    if (dirty) chart.redraw()
  }

  /** Shows the loading overlay with this label, or hides it (null). */
  setLoading(label: string | null) {
    if (this.destroyed || label === this.loading) return
    this.loading = label
    if (!this.instance) return
    if (label === null) this.instance.hideLoading()
    else this.instance.showLoading(label)
  }

  /** Stops observing, destroys the chart and removes its element. Idempotent. */
  destroy() {
    if (this.destroyed) return
    this.destroyed = true
    this.observer?.disconnect()
    this.teardown()
  }

  private build(spec: ChartSpec) {
    return buildOptions(spec, {
      reducedMotion: reducedMotion(),
      events: this.bridge,
      latest: () => this.spec,
    })
  }

  // The engine renders into an element of its own, so the framework's container never holds engine DOM.
  private create() {
    ensureChartStyles()
    const host = this.container.ownerDocument.createElement('div')
    host.className = CHART_CLASS
    this.container.appendChild(host)
    this.host = host
    try {
      this.instance = this.engine.chart(host, this.options)
      if (this.loading !== null) this.instance.showLoading(this.loading)
      this.failure = null
    } catch (error) {
      this.report(error)
      this.teardown()
    }
    this.warn(this.spec)
  }

  private report(error: unknown) {
    this.failure = error instanceof Error ? error : new Error(String(error))
    console.error(this.failure)
  }

  private recreate() {
    this.teardown()
    this.create()
  }

  private teardown() {
    const instance = this.instance
    this.instance = null
    try {
      instance?.destroy()
    } catch {
      // A chart that failed half-way may not destroy cleanly; its element is removed below anyway.
    }
    this.host?.remove()
    this.host = null
  }

  private warn(spec: ChartSpec) {
    for (const warning of specWarnings(
      spec,
      Boolean(this.engine.hasWebGLSupport),
    )) {
      if (this.warned.has(warning)) continue
      this.warned.add(warning)
      console.warn(`[chart] ${warning}`)
    }
  }
}
