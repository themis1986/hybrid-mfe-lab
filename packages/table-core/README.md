# Data table: `@repo/table-core`, `@repo/ui/table`, `@repo/ui-vue/table`

One data table for both component libraries, on [TanStack Table](https://tanstack.com/table) and
[TanStack Virtual](https://tanstack.com/virtual). The component is `TDataTable`, with the same props and look in
React and Vue.

`@repo/table-core` is the framework-agnostic part both libraries build on:

- the types (our column shape, the state, the handle);
- the engine's configuration: its features, its options, the translation of our columns into its own;
- the state bridge (controlled and uncontrolled slices, one change callback);
- filters, value formatting, CSV, state serialization, labels;
- the keyboard controller, the column reorder controller, the CSS variables for widths and pins.

It imports no React or Vue. Apps don't import it: the libraries re-export what they need. The choices behind it are
recorded in [documents/decisions/table.md](../../documents/decisions/table.md).

## Usage

Keep `columns` stable: a new array rebuilds the engine's columns. `getRowId` is required, because selection, expansion
and focus follow a row across sorting, paging and refetches.

### React

```tsx
import { TDataTable, type TDataTableColumn } from '@repo/ui/table'

const columns: TDataTableColumn<Person>[] = [
  { accessorKey: 'name', title: 'Name', type: 'avatar', filter: { type: 'text' } },
  {
    accessorKey: 'status',
    title: 'Status',
    type: 'badge',
    badge: { tones: { active: 'success', left: 'neutral' } },
    filter: { type: 'multiSelect' },
  },
  { accessorKey: 'score', title: 'Score', cell: ({ value }) => <Meter value={value} /> },
]

<TDataTable
  aria-label="People"
  data={people}
  columns={columns}
  getRowId={(person) => person.id}
  selection="multiple"
  search
  columnsPanel
  maxHeight={480}
  renderBulkActions={({ selectedIds }) => <ArchiveButton ids={selectedIds} />}
/>
```

### Vue

Column definitions are plain data; renderers are slots. Replace `data` to change it: the table reads the array raw, so
large data is never deep-proxied. Pass large data in a `shallowRef`.

```vue
<script setup lang="ts">
import { TDataTable, type TDataTableColumn } from '@repo/ui-vue/table'

const columns: TDataTableColumn<Person>[] = [
  {
    accessorKey: 'name',
    title: 'Name',
    type: 'avatar',
    filter: { type: 'text' },
  },
  { accessorKey: 'score', title: 'Score' },
]
const people = shallowRef(load())
</script>

<template>
  <TDataTable
    aria-label="People"
    :data="people"
    :columns="columns"
    :get-row-id="(person) => person.id"
    selection="multiple"
    search
    :max-height="480"
  >
    <template #cell-score="{ value }"><Meter :value="value" /></template>
    <template #bulk-actions="{ selectedIds }"
      ><ArchiveButton :ids="selectedIds"
    /></template>
  </TDataTable>
</template>
```

Every prop, slot and event is listed in the docs apps, under Tables.

## Rows

- **Sub-rows:** `getSubRows` gives each row its children, which must already be in `data`. Selecting a parent selects
  its children; a partly selected parent shows as indeterminate. Filtering keeps a parent when a child matches, and
  children stay on their parent's page.
- **Detail panel:** `renderDetail` (React) or `#detail` (Vue) is a panel under an open row, with its own height. A table
  has sub-rows or a panel, as both use the same expanded state.
- **Grouping:** the column menu groups by a column; `aggregate` on a column fills the group rows. Client mode only, and
  not with sub-rows.

## State

The state has these slices: `sorting`, `columnFilters`, `globalFilter`, `pagination`, `rowSelection`, `expanded`,
`grouping`, `columnVisibility`, `columnOrder`, `columnPinning`, `columnSizing`.

A slice set in `state` (React) or the `v-model:state` value (Vue) is controlled; the others live in the table.
`defaultState` sets where they start. `onStateChange(state, changed)` (`@state-change` in Vue) fires once per change,
with the whole state and the names of the slices that changed; a resize drag reports when it ends.

To persist it:

```ts
import { parseTableState, serializeTableState } from '@repo/ui/table'

localStorage.setItem(key, serializeTableState(state))
const restored = parseTableState(localStorage.getItem(key), columns)
```

`serializeTableState` leaves out selection and expansion by default, as they are about one session's rows, and can be
large. `parseTableState` drops anything malformed or naming a column that no longer exists, so old or hand-edited text
can't reach the engine.

## Server mode

`mode="server"` turns off the table's own sorting, filtering and paging. The caller reacts to the state and passes the
page in `data`, with `rowCount` for the total.

- `loading` shows skeleton rows on the first load, `refetching` keeps the rows under an indicator, and `error` with
  `onRetry` (`@retry`) shows the error state.
- Filter options must come from the column, since the table only has one page of rows.
- Selection is by row id and survives paging; the header checkbox covers the page.
- CSV exports the loaded rows, unless `csvExport.getRows` supplies them all.

## Virtualization

`virtualized` renders only the rows in view and needs `maxHeight`. Heights are measured, so detail panels and tall rows
work, with the sticky header and pinned columns as usual. It works with or without a pager.

Browsers cap an element's height, at 33,554,428 px in Chrome (measured) and lower in others, which limits a
virtualized table to about 760,000 rows at comfortable density in Chrome.

## Keyboard

The grid has one tab stop.

| Key                     | Does                                                               |
| ----------------------- | ------------------------------------------------------------------ |
| Arrows                  | Move between cells; mirrored right to left                         |
| Home / End              | First or last cell of the row; with Ctrl or Cmd, of the grid       |
| PageUp / PageDown       | Move by a screenful                                                |
| Enter                   | Activates the cell: sorts, expands, opens its menu, starts an edit |
| Shift+Enter             | In a header, adds the column to the sort                           |
| Space                   | Toggles the row's selection                                        |
| F2                      | Goes to the cell's other controls, or starts an edit               |
| Left / Right, in a cell | Walk its controls; on a header's resize handle, change the width   |
| Esc                     | Returns to the cell                                                |

Give a control in a custom cell the context's `tabIndex`, so the grid keeps one tab stop. One that ignores it stays in
the tab order.

## Limits

- The sticky header sticks within the table's scroller, so it needs `maxHeight`. It doesn't stick to the page.
- Columns aren't virtualized.
- Children of a row can't be loaded lazily.
- Reordering by dragging needs a mouse or pen: a touch on a header keeps scrolling. The columns panel's move buttons
  cover touch and the keyboard.
- The header's filter and menu buttons overlay the end of a narrow column's label on hover.
- Right to left: the table itself follows the `dir` it inherits. Its menus and popovers portal to the body, and Radix and
  Reka set their own direction, so an RTL app also wraps itself in `DirectionProvider` (Radix) or `ConfigProvider` (Reka),
  as with every overlay in the libraries.
