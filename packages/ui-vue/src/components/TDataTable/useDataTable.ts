import {
  buildTableEngineOptions,
  buildTableInitialState,
  collectTableExportRows,
  createTableStateBridge,
  DEFAULT_TABLE_PAGE_SIZES,
  downloadCsv,
  mergeTableLabels,
  tableConfigWarnings,
  type TableEngineFeatures,
  type TableRowData,
  type TableState,
  type TableStateKey,
  toColumnDefs,
  toCsv,
  withSyntheticPins,
} from '@repo/table-core'
import { useTable } from '@tanstack/vue-table'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  type Ref,
  ref,
  toRaw,
} from 'vue'
import type { TDataTableProps } from './types'

export function useDataTable<TData extends TableRowData>(
  props: TDataTableProps<TData>,
  options: {
    state: Ref<Partial<TableState> | undefined>
    hasDetail: () => boolean
    root: Ref<HTMLElement | null>
    onStateChange: (state: TableState, changed: TableStateKey[]) => void
  },
) {
  const hasSelection = computed(() => Boolean(props.selection))
  const hasDetail = computed(() => options.hasDetail() && !props.getSubRows)
  const hasTree = computed(() => Boolean(props.getSubRows))
  const paginated = computed(() => props.pagination !== false)
  const server = computed(() => props.mode === 'server')
  const pageSizes = computed(
    () =>
      (typeof props.pagination === 'object' && props.pagination.pageSizes) ||
      DEFAULT_TABLE_PAGE_SIZES,
  )

  onMounted(() => {
    const warnings = tableConfigWarnings({
      mode: props.mode ?? 'client',
      rowCount: props.rowCount,
      virtualized: Boolean(props.virtualized),
      hasMaxHeight: props.maxHeight !== undefined,
      tree: Boolean(props.getSubRows),
      detail: options.hasDetail(),
    })
    for (const warning of warnings) console.warn(`[TDataTable] ${warning}`)
  })

  const rtl = ref(false)
  const readDirection = () => {
    if (options.root.value) {
      rtl.value = getComputedStyle(options.root.value).direction === 'rtl'
    }
  }
  onMounted(readDirection)
  onUpdated(readDirection)

  const bridge = createTableStateBridge({
    getControlled: () => options.state.value,
    onChange: () => (state, changed) => {
      options.state.value = state
      options.onStateChange(state, changed)
    },
  })
  onBeforeUnmount(() => bridge.destroy())

  const synthetic = computed(() => ({
    selection: hasSelection.value,
    detail: hasDetail.value,
  }))

  const engineOptions = computed(() =>
    buildTableEngineOptions<TData>({
      mode: props.mode ?? 'client',
      rowCount: props.rowCount,
      getRowId: (row, index, parentId) => props.getRowId(row, index, parentId),
      getSubRows: props.getSubRows
        ? (row) => props.getSubRows?.(row)
        : undefined,
      canExpandRow: props.canExpandRow
        ? (row) => props.canExpandRow?.(row) ?? false
        : undefined,
      detail: hasDetail.value,
      selection: props.selection ?? false,
      canSelectRow: props.canSelectRow
        ? (row) => props.canSelectRow?.(row) ?? false
        : undefined,
      pagination: paginated.value,
      rtl: rtl.value,
      handlers: bridge.handlers,
    }),
  )

  // The adapter unwraps each option on its own, so each is its own computed. `features` is fixed at creation.
  const reactiveOptions: Record<string, unknown> = {}
  for (const key of Object.keys(engineOptions.value)) {
    reactiveOptions[key] =
      key === 'features'
        ? engineOptions.value.features
        : computed(() => engineOptions.value[key])
  }

  const table = useTable<TableEngineFeatures, TData>({
    ...reactiveOptions,
    data: computed(() => toRaw(props.data)),
    columns: computed(() =>
      toColumnDefs(props.columns as never, synthetic.value),
    ),
    state: computed(() =>
      bridge.toEngineState(options.state.value, (pinning) =>
        withSyntheticPins(pinning, synthetic.value),
      ),
    ),
    initialState: buildTableInitialState(props.defaultState, {
      ...synthetic.value,
      pageSizes: pageSizes.value,
    }),
  } as never)
  bridge.bind(table as never)

  const labels = computed(() => mergeTableLabels(props.labels))

  const exportCsv = async () => {
    const exportOptions =
      typeof props.csvExport === 'object' ? props.csvExport : {}
    const rows = exportOptions.getRows
      ? await exportOptions.getRows()
      : server.value
        ? toRaw(props.data)
        : collectTableExportRows(table.getSortedRowModel().rows)
    const visible = table
      .getVisibleLeafColumns()
      .flatMap((column) => column.columnDef.meta?.spec ?? [])
    downloadCsv(toCsv(rows as TData[], visible), exportOptions.fileName)
  }

  return {
    table,
    bridge,
    labels,
    pageSizes,
    exportCsv,
    hasSelection,
    hasDetail,
    hasTree,
    paginated,
    server,
  }
}
