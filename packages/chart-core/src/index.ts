// The chart engine's framework-agnostic layer: types, the spec → options builder, the controller that owns
// a chart, the token palette and the data-table fallback. @repo/ui/charts and @repo/ui-vue/charts build
// their components on it; no React or Vue here.
export { ChartController } from './ChartController'
export type { ChartControllerOptions, ChartEngine } from './ChartController'
export {
  buildOptions,
  deepMerge,
  DEFAULT_EMPTY_LABEL,
  formatValue,
  toPointEvent,
} from './options'
export type { BuildContext, ChartEventBridge } from './options'
export { CHART_COLORS, resolveColor } from './palette'
export { CHART_CLASS, ensureChartStyles } from './styles'
export { chartTable } from './table'
export { specWarnings, validateSpec } from './validate'
export type * from './types'
