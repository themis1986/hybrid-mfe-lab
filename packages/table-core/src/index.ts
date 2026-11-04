// The framework-agnostic part of the data table: types, the engine's configuration, and the pure logic both
// libraries' components share. Apps don't import it: the libraries re-export what they need.
export type * from './types'
export { mergeTableLabels, T_TABLE_LABELS } from './labels'
export type { TableLabels } from './labels'
export { tableEngineFeatures } from './features'
export type { TableColumnMeta, TableEngineFeatures } from './features'
export {
  getTableColumnValue,
  TABLE_DETAIL_COLUMN,
  TABLE_SELECT_COLUMN,
  tableColumnId,
  toColumnDefs,
  withSyntheticPins,
} from './columns'
export {
  buildTableEngineOptions,
  buildTableInitialState,
  collectTableExportRows,
  DEFAULT_TABLE_PAGE_SIZES,
  isSyntheticTableColumn,
  tableConfigWarnings,
} from './options'
export { createTableStateBridge, pickTableState } from './state'
export type { TableStateBridge, TableStateListener } from './state'
export {
  describeTableFilter,
  isTableFilterEmpty,
  matchesDateRange,
  matchesNumberRange,
  matchesTextFilter,
  toFilterOptions,
} from './filters'
export { formatTableDate, formatTableNumber, parseTableDate } from './format'
export { downloadCsv, toCsv } from './csv'
export type { ToCsvOptions } from './csv'
export { parseTableState, serializeTableState } from './serialize'
export {
  TABLE_DEFAULT_OVERSCAN,
  TABLE_ROW_ESTIMATE,
  tableDetailKey,
  toDisplayItems,
  withRetainedTableRows,
} from './display'
export type { TableDisplayItem, TableDisplayRow } from './display'
export {
  createTableGrid,
  nextTableGridPosition,
  TABLE_FULL_ROW_COLUMN,
  TABLE_HEADER_ROW,
} from './keyboard'
export type {
  TableGridController,
  TableGridOptions,
  TableGridPosition,
} from './keyboard'
export { createTableColumnReorder, moveTableColumn } from './reorder'
export type { TableDropSide } from './reorder'
export {
  bindTableColumnVars,
  observeTableScroller,
  tableCellVars,
  tableColumnVar,
  tablePinVar,
  writeTableColumnVars,
} from './vars'
