import { defineAsyncComponent } from 'vue'
import type { DocEntry } from './catalog'

// Lazily loaded: the docs' main chunk stays free of the table engine.
const TableBasicDemo = defineAsyncComponent(
  () => import('./demos/TableBasicDemo.vue'),
)

const TableTreeDemo = defineAsyncComponent(
  () => import('./demos/TableTreeDemo.vue'),
)
const TableCellsDemo = defineAsyncComponent(
  () => import('./demos/TableCellsDemo.vue'),
)

const TableServerDemo = defineAsyncComponent(
  () => import('./demos/TableServerDemo.vue'),
)
const TableVirtualDemo = defineAsyncComponent(
  () => import('./demos/TableVirtualDemo.vue'),
)

const COLUMN_PROPS = [
  {
    name: 'accessorKey / accessorFn',
    type: 'string / (row, index) => value',
    description:
      'Where the value comes from. Dots in a key read nested values.',
  },
  {
    name: 'id',
    type: 'string',
    description:
      'Names the column in state and slots. Required without accessorKey.',
  },
  {
    name: 'title',
    type: 'string',
    description:
      'Plain text for menus, chips, the CSV header and accessible names.',
  },
  {
    name: 'type',
    type: "'text' | 'number' | 'date' | 'badge' | 'progress' | 'avatar' | 'actions'",
    description:
      'The built-in cell. Options by type: number, date, badge, progress, avatar, actions.',
  },
  {
    name: 'align',
    type: "'start' | 'center' | 'end'",
    description: 'Numbers align to the end by default.',
  },
  {
    name: 'width / minWidth / maxWidth',
    type: 'number',
    description: 'In pixels.',
  },
  {
    name: 'sortable',
    type: 'boolean',
    description: 'Default: true for a column with a value.',
  },
  {
    name: 'sortFn',
    type: "'auto' | 'alphanumeric' | 'basic' | 'datetime' | 'text' | (a, b, id) => number",
    description: 'Compares two rows.',
  },
  {
    name: 'filter',
    type: "{ type: 'text' | 'numberRange' | 'dateRange' | 'select' | 'multiSelect', … }",
    description:
      'A filter in the header. Select types take options, or read them from the rows in client mode.',
  },
  {
    name: 'groupable',
    type: 'boolean',
    description:
      'Offers grouping in the column menu. Client mode, not with sub-rows.',
  },
  {
    name: 'aggregate',
    type: "'sum' | 'count' | 'min' | 'max' | 'mean' | 'median' | 'unique' | 'uniqueCount'",
    description: 'Shown on group rows.',
  },
  {
    name: 'hideable / resizable / reorderable / pinnable',
    type: 'boolean',
    description: 'Default: true.',
  },
  {
    name: 'editable',
    type: 'boolean | (row) => boolean',
    description: 'Double click, Enter or F2 starts an edit.',
  },
  {
    name: 'editor / editorOptions',
    type: "'text' | 'number' | 'date' | 'select' / options",
    description: 'The built-in editor, chosen from the type by default.',
  },
  {
    name: 'csv',
    type: 'false | (value, row) => string',
    description: 'Leaves the column out of the CSV, or replaces its raw value.',
  },
]

const TABLE_PROPS = [
  {
    name: 'data',
    type: 'TData[]',
    description:
      'The rows. Replace the array to change it: the table reads it raw, so large data is never deep-proxied.',
  },
  {
    name: 'columns',
    type: 'TDataTableColumn<TData>[]',
    description: 'Column definitions, below. Keep the array stable.',
  },
  {
    name: 'getRowId',
    type: '(row, index, parentId?) => string',
    description: 'Identifies a row across sorting, paging and refetches.',
  },
  {
    name: 'selection',
    type: "false | 'single' | 'multiple'",
    description: 'A checkbox column. Shift+click selects a range.',
  },
  {
    name: 'canSelectRow',
    type: '(row) => boolean',
    description: 'Disables the checkbox of some rows.',
  },
  {
    name: 'selectAllScope',
    type: "'page' | 'all'",
    description:
      'What the header checkbox covers. Default: all filtered rows in client mode, the page in server mode.',
  },
  {
    name: 'search',
    type: 'boolean',
    description: 'A search box over all columns.',
  },
  {
    name: 'pagination',
    type: 'boolean | { pageSizes?: number[] }',
    description: 'Default: true.',
  },
  {
    name: 'columnsPanel',
    type: 'boolean',
    description: 'A panel to show, hide and move columns.',
  },
  {
    name: 'csvExport',
    type: 'boolean | { fileName?, getRows? }',
    description:
      'An export button, for the filtered and sorted rows across pages.',
  },
  {
    name: 'onCellEdit',
    type: '(edit) => void | Promise<void>',
    description:
      'A prop, not an event: a rejected promise keeps the editor open. The table never changes data.',
  },
  {
    name: 'density',
    type: "'compact' | 'comfortable'",
    description: 'Default: comfortable.',
  },
  {
    name: 'zebra / hover',
    type: 'boolean',
    description:
      'Striped rows, and the row under the pointer. Hover is on by default.',
  },
  {
    name: 'stickyHeader',
    type: 'boolean',
    description:
      'Default: true. It sticks within the scroller, so it needs maxHeight.',
  },
  {
    name: 'maxHeight',
    type: 'number | string',
    description: 'Bounds the scroller.',
  },
  {
    name: 'defaultState',
    type: 'Partial<TableState>',
    description: 'The state a table starts with.',
  },
  {
    name: 'labels',
    type: 'Partial<TableLabels>',
    description: 'Overrides any text the table shows or announces.',
  },
  { name: 'locale', type: 'string', description: 'Formats numbers and dates.' },
]

export const TABLE_ENTRIES: DocEntry[] = [
  {
    id: 'data-table',
    name: 'TDataTable',
    group: 'tables',
    summary:
      'A data table on TanStack Table: sorting, filters, pagination, selection and built-in cell types, from a list of plain column definitions. Import from @repo/ui-vue/table.',
    props: [
      ...TABLE_PROPS,
      ...COLUMN_PROPS.map((prop) => ({ ...prop, name: `column.${prop.name}` })),
    ],
    slots: [
      { name: 'toolbar', description: 'Extra toolbar content.' },
      { name: 'bulk-actions', description: 'Actions for the selected rows.' },
      {
        name: 'empty / error',
        description: 'Replace the empty and error states.',
      },
    ],
    events: [
      {
        name: 'update:state',
        payload: 'TableState',
        description: 'v-model:state: slices bound are controlled.',
      },
      {
        name: 'state-change',
        payload: 'TableState, TableStateKey[]',
        description: 'Once per change, with the slices that changed.',
      },
      {
        name: 'retry',
        payload: '',
        description: 'The error state retry button.',
      },
    ],
    demo: TableBasicDemo,
    code: `<script setup lang="ts">
import { TDataTable, type TDataTableColumn } from '@repo/ui-vue/table'
const columns: TDataTableColumn<Person>[] = [
  { accessorKey: 'name', title: 'Name', filter: { type: 'text' } },
  { accessorKey: 'salary', title: 'Salary', type: 'number' },
]
</script>

<template>
  <TDataTable :data="people" :columns="columns" :get-row-id="(p) => p.id" selection="multiple" search />
</template>`,
  },
  {
    id: 'data-table-tree',
    name: 'TDataTable: tree rows',
    group: 'tables',
    summary:
      'Rows with children: each row expands on its own, and the toolbar expands or collapses them all. Selecting a parent selects its children, and a partly selected parent shows as indeterminate.',
    props: [
      {
        name: 'getSubRows',
        type: '(row) => TData[] | undefined',
        description: 'The children of a row. They must already be in the data.',
      },
    ],
    demo: TableTreeDemo,
    code: `<TDataTable :data="teams" :columns="columns" :get-row-id="(row) => row.id" :get-sub-rows="(row) => row.children" />`,
  },
  {
    id: 'data-table-cells',
    name: 'TDataTable: custom cells',
    group: 'tables',
    summary:
      'Custom header and cell slots, and a detail panel under each row, with its own height. A control inside a cell takes tabIndex from the slot props: the grid has one tab stop, and Enter or F2 reaches the control.',
    props: [],
    slots: [
      {
        name: 'cell-<id>',
        description: 'Replaces the built-in rendering of the column type.',
      },
      { name: 'header-<id>', description: 'Replaces the title in the header.' },
      {
        name: 'detail',
        description:
          'A panel under an open row. A table has this or getSubRows.',
      },
    ],
    demo: TableCellsDemo,
    code: `<TDataTable :data="rows" :columns="columns" :get-row-id="(row) => row.id">
  <template #cell-score="{ value }"><TProgress :value="value" /></template>
  <template #detail="{ row }"><Details :row="row" /></template>
</TDataTable>`,
  },
  {
    id: 'data-table-virtual',
    name: 'TDataTable: 100,000 rows',
    group: 'tables',
    summary:
      'Only the rows in view are in the page. Heights are measured, so detail panels and tall rows work; the header and pinned columns stick as usual.',
    props: [
      {
        name: 'virtualized',
        type: 'boolean | { estimateRowHeight?: number; overscan?: number }',
        description: 'Renders only the rows in view. Needs maxHeight.',
      },
      {
        name: 'maxHeight',
        type: 'number | string',
        description: 'Bounds the scroller.',
      },
    ],
    demo: TableVirtualDemo,
    code: `<TDataTable :data="rows" :columns="columns" :get-row-id="(row) => row.id" virtualized :pagination="false" :max-height="520" />`,
  },
  {
    id: 'data-table-server',
    name: 'TDataTable: server mode',
    group: 'tables',
    summary:
      'The caller sorts, filters and pages, reacting to the state. The state here is bound with v-model:state and kept in localStorage through serializeTableState, so a reload restores it. The switch makes the next request fail.',
    props: [
      {
        name: 'mode',
        type: "'client' | 'server'",
        description:
          'Server: the table no longer sorts, filters or pages by itself.',
      },
      {
        name: 'rowCount',
        type: 'number',
        description: 'Rows on the server. Required in server mode.',
      },
      {
        name: 'loading / refetching / error',
        type: 'boolean / boolean / unknown',
        description:
          'Skeleton rows, an indicator over the kept rows, and an error state with a retry.',
      },
    ],
    events: [
      {
        name: 'update:state',
        payload: 'TableState',
        description: 'v-model:state: slices bound are controlled.',
      },
      {
        name: 'state-change',
        payload: 'TableState, TableStateKey[]',
        description: 'Once per change, with the slices that changed.',
      },
      {
        name: 'retry',
        payload: '',
        description: 'The error state retry button.',
      },
    ],
    demo: TableServerDemo,
    code: `<TDataTable
  v-model:state="state"
  mode="server"
  :data="rows"
  :row-count="total"
  :columns="columns"
  :get-row-id="(row) => row.id"
  :loading="isLoading"
  :refetching="isFetching"
  :error="error"
  @retry="refetch"
/>`,
  },
]
