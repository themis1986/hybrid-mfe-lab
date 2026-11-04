// Identical in both libraries. No Preflight, so sized parts carry `box-border`, and table elements reset their
// padding, weight and alignment. State shows through data attributes on static strings, because a table may
// render hundreds of cells per frame: density from the root, row and cell states from their own element.
// Density uses a named group, not Tailwind's `in-*`: `in-*` adds no specificity, so an app's own copy of a
// utility, loaded after this stylesheet, would beat it.

export const tDataTableClasses =
  'group/table flex w-full min-w-0 flex-col gap-3 text-sm text-fg'
export const tDataTableToolbarClasses = 'flex flex-wrap items-center gap-2'
export const tDataTableToolbarEndClasses =
  'ms-auto flex flex-wrap items-center gap-2'
export const tDataTableSearchClasses = 'w-full max-w-72'
export const tDataTableChipsClasses = 'flex flex-wrap items-center gap-1.5'
export const tDataTableBulkClasses =
  'flex flex-wrap items-center gap-2 rounded-md bg-accent-subtle py-1 ps-3 pe-1 font-medium text-accent-fg'
export const tDataTableBulkCountClasses = 'me-auto'

export const tDataTableViewportClasses = 'relative min-w-0'
export const tDataTableScrollerClasses = [
  'relative isolate box-border w-full overflow-auto rounded-md border border-line bg-canvas',
  '[scroll-padding-inline-start:var(--t-pin-start-w)] [scroll-padding-inline-end:var(--t-pin-end-w)]',
].join(' ')
export const tDataTableTableClasses =
  'm-0 grid w-(--t-table-width) min-w-full text-sm'
export const tDataTableHeadClasses =
  'grid data-[sticky]:sticky data-[sticky]:top-0 data-[sticky]:z-20'
export const tDataTableHeadRowClasses = 'flex w-full bg-surface'
export const tDataTableHeadCellClasses = [
  'group/th relative box-border flex min-h-10 w-(--t-cell-w) min-w-0 shrink-0 items-center gap-1',
  'border-b border-line bg-surface py-1 ps-3 pe-1 text-start text-xs font-semibold text-fg-muted',
  'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
  'group-data-[density=compact]/table:min-h-8 group-data-[density=compact]/table:py-0.5',
  'data-[pin]:sticky data-[pin]:z-10',
  'data-[pin-edge=start]:border-e data-[pin-edge=start]:border-e-line-strong',
  'data-[pin-edge=end]:border-s data-[pin-edge=end]:border-s-line-strong',
  'data-[dragging]:opacity-60',
  'data-[drop=before]:border-s-2 data-[drop=before]:border-s-accent',
  'data-[drop=after]:border-e-2 data-[drop=after]:border-e-accent',
].join(' ')
export const tDataTableHeadFillerClasses =
  'box-border min-w-0 flex-1 border-b border-line bg-surface p-0'
export const tDataTableSortClasses = [
  'm-0 flex min-w-0 flex-1 cursor-pointer items-center gap-1 border-0 bg-transparent p-0',
  'text-start [font:inherit] text-inherit outline-none hover:text-fg focus-visible:text-fg',
  'group-data-[align=end]/th:justify-end group-data-[align=center]/th:justify-center',
].join(' ')
export const tDataTableHeadLabelClasses = 'min-w-0 truncate'
export const tDataTableSortIconClasses = 'size-3.5 shrink-0'
export const tDataTableSortOrderClasses =
  'shrink-0 text-[0.625rem] leading-none text-accent-fg tabular-nums'
// Over the end of the label while the pointer or focus is in the header, so a narrow column keeps its label.
// A coarse pointer has no hover: there they take their own space.
export const tDataTableHeadActionsClasses = [
  'absolute inset-y-0 end-2 z-10 flex items-center gap-0.5 bg-surface ps-0.5 opacity-0',
  'group-hover/th:opacity-100 focus-within:opacity-100 has-[[data-state=open]]:opacity-100',
  'pointer-coarse:static pointer-coarse:opacity-100',
].join(' ')
export const tDataTableHeadButtonClasses =
  'h-6 min-w-6 px-0 data-[active]:text-accent-fg'
export const tDataTableFilterMarkClasses = 'size-3 shrink-0 text-accent-fg'
export const tDataTableResizeClasses = [
  'absolute inset-y-0 end-0 z-10 w-2 cursor-col-resize touch-none outline-none select-none',
  'after:absolute after:inset-y-1.5 after:end-0.5 after:w-px after:bg-line-strong',
  'hover:after:w-0.5 hover:after:bg-accent focus-visible:after:w-0.5 focus-visible:after:bg-accent',
].join(' ')

export const tDataTableBodyClasses =
  'relative m-0 grid data-[refetching]:opacity-60'
// Backgrounds are opaque tokens, because pinned cells inherit them and must hide what scrolls beneath.
export const tDataTableRowClasses = [
  'flex w-full bg-canvas',
  'data-[zebra=odd]:bg-surface data-[selected]:bg-accent-subtle',
  'data-[hover]:hover:bg-surface-hover data-[selected]:data-[hover]:hover:bg-accent-subtle-hover',
  'data-[virtual]:absolute data-[virtual]:start-0 data-[virtual]:top-0',
].join(' ')
export const tDataTableCellClasses = [
  'box-border flex min-h-11 w-(--t-cell-w) min-w-0 shrink-0 items-center gap-2',
  'border-b border-line bg-inherit py-2 ps-3 pe-3 text-start font-normal',
  'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
  'group-data-[density=compact]/table:min-h-8 group-data-[density=compact]/table:py-1',
  'data-[pin]:sticky data-[pin]:z-10',
  'data-[pin-edge=start]:border-e data-[pin-edge=start]:border-e-line-strong',
  'data-[pin-edge=end]:border-s data-[pin-edge=end]:border-s-line-strong',
  'data-[align=end]:justify-end data-[align=end]:text-end',
  'data-[align=center]:justify-center data-[align=center]:text-center',
].join(' ')
export const tDataTableCellFillerClasses =
  'box-border min-w-0 flex-1 border-b border-line bg-inherit p-0'
export const tDataTableCellTextClasses = 'min-w-0 truncate'
export const tDataTableCellNumberClasses = 'min-w-0 truncate tabular-nums'
export const tDataTableCellProgressClasses =
  'flex w-full min-w-0 items-center gap-2'
export const tDataTableCellProgressValueClasses =
  'shrink-0 text-xs text-fg-muted tabular-nums'
export const tDataTableCellAvatarClasses = 'flex min-w-0 items-center gap-2'
export const tDataTableCellButtonClasses = 'h-6 min-w-6 px-0'

export const tDataTableCellButtonSmallClasses = 'h-6 min-w-6 px-0'
export const tDataTableChevronClasses = [
  'size-4 shrink-0 transition-transform motion-reduce:transition-none',
  'rtl:rotate-180 data-[open]:rotate-90 rtl:data-[open]:rotate-90',
].join(' ')
// A tree's indent, by depth, set inline.
export const tDataTableExpanderClasses =
  'flex w-full min-w-0 items-center gap-1 ps-(--t-cell-indent)'
export const tDataTableExpanderSpacerClasses = 'inline-block size-6 shrink-0'
export const tDataTableGroupCountClasses =
  'shrink-0 text-xs text-fg-muted tabular-nums'
export const tDataTableAggregateClasses =
  'min-w-0 truncate font-medium tabular-nums'

// A row of one cell: a detail panel, the empty and error states. The content stays as wide as the scroller
// while the columns scroll sideways under it.
export const tDataTableFullCellClasses = [
  'box-border block w-full border-b border-line bg-inherit p-0 text-start font-normal',
  'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
].join(' ')
export const tDataTableFullContentClasses =
  'sticky start-0 box-border w-(--t-scroller-w) py-3 ps-4 pe-4'
export const tDataTableStateClasses =
  'sticky start-0 box-border flex w-(--t-scroller-w) flex-col items-center gap-3 py-10 ps-4 pe-4 text-center text-fg-muted'
export const tDataTableRefreshClasses = [
  'pointer-events-none absolute start-1/2 top-3 z-30 inline-flex -translate-x-1/2 items-center gap-2 rtl:translate-x-1/2',
  'rounded-full border border-line bg-canvas py-1 ps-2 pe-3 text-xs text-fg-muted shadow-sm',
].join(' ')

export const tDataTableFooterClasses = 'flex flex-wrap items-center gap-3'
export const tDataTableFooterSizeClasses =
  'flex items-center gap-2 text-fg-muted'
export const tDataTablePageSizeClasses = 'w-auto'
export const tDataTableRangeClasses =
  'whitespace-nowrap text-fg-muted tabular-nums'
export const tDataTablePagerClasses = 'ms-auto'

export const tDataTableColumnsListClasses =
  'm-0 flex max-h-72 list-none flex-col gap-0.5 overflow-y-auto p-0'
export const tDataTableColumnsItemClasses = 'flex items-center gap-1'
export const tDataTableColumnsLabelClasses =
  'flex min-w-0 flex-1 cursor-pointer items-center gap-2 py-1 text-sm text-fg'
export const tDataTableColumnsTitleClasses = 'min-w-0 truncate'
export const tDataTableMoveClasses = 'h-6 min-w-6 px-0 rtl:-scale-x-100'

export const tDataTableEditorClasses = 'w-full min-w-0'

export const tDataTableFilterFormClasses = 'flex flex-col gap-2'
export const tDataTableFilterRangeClasses = 'grid grid-cols-2 gap-2'
