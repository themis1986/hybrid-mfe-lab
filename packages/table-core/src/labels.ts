// Every string the table shows or announces, in one place: `labels` overrides any of them.
export interface TableLabels {
  search: string
  searchPlaceholder: string
  filter: string
  filterColumn: (title: string) => string
  clearFilter: string
  clearAllFilters: string
  removeFilter: (description: string) => string
  activeFilters: string
  rangeMin: string
  rangeMax: string
  rangeSeparator: string
  selectPlaceholder: string

  columnMenu: (title: string) => string
  sortAscending: string
  sortDescending: string
  clearSort: string
  sortOrder: (position: number) => string
  pinStart: string
  pinEnd: string
  unpin: string
  hideColumn: string
  groupBy: string
  ungroup: string
  resizeColumn: (title: string) => string

  columns: string
  showAllColumns: string
  moveColumnEarlier: (title: string) => string
  moveColumnLater: (title: string) => string

  selectRow: string
  selectAll: string
  selectedCount: (count: number) => string
  clearSelection: string

  expandRow: string
  collapseRow: string
  expandAll: string
  collapseAll: string
  groupCount: (count: number) => string

  rowsPerPage: string
  rowRange: (from: number, to: number, total: number) => string
  pagination: {
    first: string
    previous: string
    next: string
    last: string
    page: (page: number) => string
  }

  exportCsv: string
  rowActions: string

  loading: string
  refreshing: string
  empty: string
  emptyFiltered: string
  error: string
  retry: string

  editCell: (title: string) => string
  editFailed: string
  closePanel: string

  openCalendar: string
  previousMonth: string
  nextMonth: string
}

export const T_TABLE_LABELS: TableLabels = {
  search: 'Search all columns',
  searchPlaceholder: 'Search…',
  filter: 'Filter',
  filterColumn: (title) => `Filter ${title}`,
  clearFilter: 'Clear',
  clearAllFilters: 'Clear all',
  removeFilter: (description) => `Remove filter ${description}`,
  activeFilters: 'Active filters',
  rangeMin: 'From',
  rangeMax: 'To',
  rangeSeparator: '–',
  selectPlaceholder: 'Any',

  columnMenu: (title) => `${title} options`,
  sortAscending: 'Sort ascending',
  sortDescending: 'Sort descending',
  clearSort: 'Clear sort',
  sortOrder: (position) => `Sort priority ${position}`,
  pinStart: 'Pin to start',
  pinEnd: 'Pin to end',
  unpin: 'Unpin',
  hideColumn: 'Hide column',
  groupBy: 'Group by this column',
  ungroup: 'Stop grouping',
  resizeColumn: (title) => `Resize ${title}`,

  columns: 'Columns',
  showAllColumns: 'Show all',
  moveColumnEarlier: (title) => `Move ${title} earlier`,
  moveColumnLater: (title) => `Move ${title} later`,

  selectRow: 'Select row',
  selectAll: 'Select all rows',
  selectedCount: (count) => `${count} selected`,
  clearSelection: 'Clear selection',

  expandRow: 'Expand row',
  collapseRow: 'Collapse row',
  expandAll: 'Expand all',
  collapseAll: 'Collapse all',
  groupCount: (count) => `(${count})`,

  rowsPerPage: 'Rows per page',
  rowRange: (from, to, total) => `${from}–${to} of ${total}`,
  pagination: {
    first: 'First page',
    previous: 'Previous page',
    next: 'Next page',
    last: 'Last page',
    page: (page) => `Page ${page}`,
  },

  exportCsv: 'Export CSV',
  rowActions: 'Row actions',

  loading: 'Loading rows',
  refreshing: 'Refreshing',
  empty: 'No rows to show',
  emptyFiltered: 'No rows match the filters',
  error: 'The rows could not be loaded',
  retry: 'Try again',

  editCell: (title) => `Edit ${title}`,
  editFailed: 'The change could not be saved',
  closePanel: 'Close',

  openCalendar: 'Open calendar',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
}

/** The defaults with the caller's labels on top; `pagination` merges by key too. */
export function mergeTableLabels(labels?: Partial<TableLabels>): TableLabels {
  if (!labels) return T_TABLE_LABELS
  return {
    ...T_TABLE_LABELS,
    ...labels,
    pagination: { ...T_TABLE_LABELS.pagination, ...labels.pagination },
  }
}
