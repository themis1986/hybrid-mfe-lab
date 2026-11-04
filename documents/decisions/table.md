# Decision record: data table

Status: accepted, 2026-11-04. Research done on that date against npm, the official documentation and the engine's
source (TanStack Table 9.3.1, TanStack Virtual 3.14 and 3.13).

Both component libraries gained a data table with sorting, filtering, pagination, selection, sub-rows, detail panels,
column management, grouping, row virtualization, server mode, inline editing and CSV export. This record explains the
choices. How to use it is in [packages/table-core/README.md](../../packages/table-core/README.md).

## Shape

```
packages/table-core   @repo/table-core    framework-agnostic: types, engine options, column translation, state
                                          bridge, filters, CSV, serialization, labels, keyboard, reorder, CSS variables
packages/ui           @repo/ui/table      the React layer, on the engine's React adapter
packages/ui-vue       @repo/ui-vue/table  the Vue layer, on the engine's Vue adapter
```

The table lives in a separate `./table` entry, like `./map` and `./charts`, so apps without a table never bundle the
engine. In the docs apps the engine, the virtualizer and the table layer come to about 53 kB gzipped, in a lazily
loaded chunk.

## 1. The engine: TanStack Table v9

The engine was fixed by the brief, and npm's `latest` is v9, whose API differs throughout from v8: an explicit feature
set, state in atoms, and logical `start`/`end` pinning. v9 also brings Shift range selection and an RTL resize direction.

The adapters pin the core exactly, so the catalog keeps all three packages exact, to be bumped together: a split would
load two engines.

## 2. A core package

The shared logic is about 1,500 lines. The rule for identical copies in `src/lib/` suits small helpers, but nothing
enforces it, and copies of this size would drift. So it is a package, like the chart logic.

It differs from the chart package in one way: there is no controller owning the engine, because each framework's
reactivity has to go through its own adapter. The rule instead is that only the core decides engine options, and the
framework layers only read the engine's rows, headers and cells.

The public types are our own, not the engine's. Apps don't list `@tanstack/*`, so a leaked type would silently become
`any` in their code, and an engine upgrade stays mostly local.

## 3. State

v9 removed the engine's global state callback, leaving one callback per slice. The core wraps them all in one writer:
a controlled slice only reports the change, an uncontrolled one also stores it, and all changes in a task reach the caller
in one call, with the names of the slices that changed. That gave one path for both modes, without comparing snapshots
of the store, as the engine's guide suggests for observing everything.

- **One state value rather than one prop per slice,** which would be about 22 React props and 11 Vue models. A slice is
  controlled when its key is set; an omitted one stays with the engine.
- **A resize drag reports when it ends.** Its sizes change per frame, and they are of no interest to anyone until then.
- **The table resets the page itself** on a filter, search or sort. The engine's auto-reset also fires on any change of
  `data`, which would send the user back to page one after saving an edit.

## 4. Layout: one DOM for all modes

Dynamic row heights need absolutely positioned rows, which native table layout can't do. So the table is `<table>` with
`display: grid` and `<tr>` with `display: flex`, as the engine's virtualization guide prescribes, in every mode: a
plain table and a virtual one differ only in how rows are placed.

- **Explicit roles.** Changing `display` can strip table semantics, so every element has its role, and `aria-rowcount`,
  `aria-rowindex` and `aria-colindex`, which virtualization and paging need anyway. Positions come from the display list,
  never from the DOM.
- **One display list.** A detail panel is its own item with its own height, so a row's panel needs no special case in
  the virtualizer or the keyboard.
- **Widths as CSS variables,** written directly from a subscription to the engine's sizing atom, so a drag re-renders
  nothing in either framework (checked: one attribute changes in the body during a drag, the tab stop). Variables are
  named by definition index, since a column id can hold characters a variable name can't.
- **Fixed widths and a filler.** Spare width goes to a presentational cell before the end-pinned region. Columns that
  grow would break the pin offsets.
- **Pins on logical regions.** `start`/`end` and `inset-inline-*` make right-to-left work with no special case. Pinned
  cells inherit the row's background, so row backgrounds stay opaque tokens. Rows are as wide as all columns, so sticky
  positioning works inside translated rows.
- **A token for hover.** Zebra stripes use the surface colour, so hover needed a step of its own.

## 5. Virtualization

Rows only. Column virtualization complicates pinning, focus and `aria-colindex`, for little gain at normal column
counts.

`rangeExtractor` keeps some rows mounted out of view, because state lives in them: the focused row, the row being
edited (its draft) and the row whose menu is open. Scrolling re-renders only the virtual rows component, and React rows
are memoized on a row and booleans.

Measured on 100,000 rows with five columns of built-in cells and pinned columns, production builds, headless Chrome on
the author's machine, both frameworks within a few percent of each other:

| Measure                               | Result                           |
| ------------------------------------- | -------------------------------- |
| Steady scroll (60 px per frame), p95  | 17 to 18 ms, no frame over 33 ms |
| Fast scroll (4,000 px per frame), p95 | 38 to 50 ms                      |
| Rows in the DOM                       | At most 29                       |
| Sort                                  | 135 to 200 ms                    |
| Search, including its 200 ms delay    | About 330 ms                     |
| Select all                            | 120 to 160 ms                    |

## 6. Keyboard

One native listener on the table, in the core, implements the grid pattern for both frameworks. A native listener never
sees keys from a portalled menu or popover, which React's synthetic events would bubble here. It does run before React's
root listener, so it must leave a cell holding an editor alone.

There are two modes because ArrowDown on a menu trigger would otherwise open the menu instead of moving: focus stays on
the cell, and Enter or F2 reaches its controls.

`aria-sort` goes on the primary sorted header only, as ARIA asks for one at a time. The others show their order, with
text for screen readers.

## 7. Selection and the checkbox

The engine's range selection reads `target.checked` and `shiftKey` from an event. The library's checkbox is a `<button>`,
and its change callback carries no event. Its click runs before the state change in both libraries, so the click records
Shift, and the change calls the engine's handler with both.

## 8. Reordering

A pointer controller in the core, as `@dnd-kit` is React-only and kept to one remote. It auto-scrolls, handles
right-to-left, and only moves within a pin region. Touch keeps scrolling the table, so the columns panel's move buttons
cover touch and the keyboard.

## 9. Grouping

The brief asked for it "if it can be done cleanly". It needed one row kind and one cell kind beyond the engine's own
model, so it stayed. It is off in server mode, which doesn't have all the rows, and with sub-rows, which are a hierarchy
already.

## 10. CSV

The filtered and sorted rows across pages, in visible column order, with raw values so numbers and dates stay
machine-readable. It has a byte-order mark for Excel, and a text value starting with `=`, `+`, `-` or `@` is prefixed, as
spreadsheets would run it as a formula and table data may be user-written.

## Trade-offs accepted

- The sticky header sticks within the table's scroller. Sticking to the page needs a scroll-synced duplicate header.
- A custom cell control that ignores the given `tabIndex` stays in the tab order. The table can't reach into a renderer.
- A paged tree or grouped table reports `aria-rowcount` as unknown (-1): a row's position overall isn't known from the page.
- Sub-rows and a detail panel can't share a table, as one chevron would have two meanings.
- Overlays take their direction from Radix's and Reka's own providers, not from `dir`, as everywhere in the libraries.
- Vue callers must replace the data array rather than mutate it. In exchange, large data is never deep-proxied.
- The engine is bundled per remote, like the frameworks (`shared: {}`).
- Selecting all rows builds a map with one key per row, which is fine at 100,000 and a cost beyond.
- There are no automated tests in this repo: the behaviour was checked in a browser, by script, on the docs apps.

## Next steps

- A navigation-off mode with `role="table"`, for plain display tables.
- Lazy loading of children, and an infinite-scroll mode in server mode.
- Sharing the engine across remotes through federation `shared`.
