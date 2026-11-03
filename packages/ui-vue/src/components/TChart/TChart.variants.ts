// The chart fills its parent: the caller gives the parent (or this root, through its class) a size.
export const tChartClasses =
  'relative box-border flex size-full min-h-0 flex-col font-sans text-fg'

// The engine's container: the controller renders into an element of its own inside it.
export const tChartCanvasClasses = 'relative min-h-0 flex-1'

// Shown over the chart's place when the spec is invalid or the engine failed.
export const tChartMessageClasses =
  'absolute inset-0 box-border flex items-center justify-center rounded-md border border-dashed border-line bg-surface p-6 text-center font-sans text-sm text-fg-muted'

// The data table: screen-reader only, or shown under the chart.
export const tChartTableWrapperClasses = {
  hidden: 'sr-only',
  visible: 'max-h-64 flex-none overflow-auto pt-3',
} as const

export const tChartTableClasses =
  'm-0 w-full border-collapse text-left font-sans text-sm text-fg'

export const tChartTableCaptionClasses =
  'pb-2 text-left text-sm font-medium text-fg-muted'

export const tChartTableHeadClasses =
  'border-0 border-b border-solid border-line px-2 py-1 font-medium text-fg-muted'

export const tChartTableCellClasses =
  'border-0 border-b border-solid border-line px-2 py-1 tabular-nums'
