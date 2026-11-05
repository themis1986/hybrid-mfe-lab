# Decision record: budget and expense tracker

Status: accepted, 2026-11-05. Library versions checked on npm and their documentation read (through Context7) on that date.

The repo gained a budget and expense tracker as a third React remote, the first with pages. This record explains the choices: the
state and validation libraries, the router, undo, where filters live, the CSV format, and the one addition to the component libraries.
What the app does and how to extend it are in [apps/budget-mfe/README.md](../../apps/budget-mfe/README.md).

## Shape

```
apps/budget-mfe   @repo/budget-mfe   the remote: Redux Toolkit state, Zod schemas, React Router pages, components on @repo/ui
  src/state/                         the store factory, slices, the undo wrapper, selectors
  src/lib/                           pure: schemas, money, periods, summaries, budgets, CSV
packages/ui       TFormField         added: a label and a hint around any control (Radix Label)
packages/ui-vue   TFormField         its Vue counterpart (Reka), with the same classes
```

## 1. State: Redux Toolkit 2.14, with react-redux 9.3

The brief asked for Redux Toolkit, which overrides the repo's "no state library" limit for this remote only. It fits the app on its
own merits too: the data is a normalised list with cross-cutting reads (totals, per-category sums, series, budget progress), and RTK
gives the pieces for that ready-made:

- **`createEntityAdapter`** keeps transactions by id, sorted, with memoised `selectAll`.
- **`createSelector`** (Reselect) memoises every derived value, so the table's `data` and each chart's series keep their reference
  until their inputs change. The chart controller diffs specs by series id, and the table rebuilds nothing for an unchanged array.
- **Immer** gives immutable states that share every unchanged part, which is what makes whole-state undo cheap (section 3).
- **`createAsyncThunk`** with an abort signal loads from the repository; **`createListenerMiddleware`** saves to it, and carries the
  undo toast (section 3).

How it is used:

- **One store per mount.** `createBudgetStore()` is called inside `mount`, never at module scope, since the federated module stays
  cached. Its `dispose()` aborts what the store started (thunks receive a lifetime signal in `extra`, combined with their own through
  `AbortSignal.any`) and clears its listeners.
- **Types without a cycle.** `RootState` comes from the root reducer rather than the store, so slices and selectors can name it.
  `AppDispatch` comes from the factory's return type, and the typed hooks use `.withTypes()`.
- **Components never touch the store.** Hooks in `src/hooks/` select and dispatch, and hand components values and functions.
- **Development checks skip the history.** The immutability and serialisability checks ignore `ledger.past` and `ledger.future`:
  those states were checked when they were the present, and walking fifty of them per action only slows development down.
- **Out of the store:** `File` objects, import previews, toast ids and the repository. The repository rides in the thunks' `extra`.

**Not chosen:** the kanban remote's plain `useSyncExternalStore` store. It would do here too, but the brief asked for RTK, and the
entity adapter and selectors replace code the plain store would need anyway. RTK Query has nothing to do here: there is no server.

## 2. Validation and types: Zod 4.6

The brief asked for Zod. It removes the usual duplication between the types, the form rules, the import rules and the seed:

- **One schema file is the source of truth.** `transactionInputSchema` and `budgetSchema` hold every rule; the types are `z.infer` of
  them, re-exported from `src/types.ts`. Category ids are a tuple feeding `z.enum`, so a new category updates the types too.
- **One text coercion in front of one schema.** The form and a CSV row are both strings by field. `z.preprocess` turns either into the
  typed shape (amount text to a number, category label to its id, blanks to `undefined`), then the same transaction schema runs. A row
  is valid in a file exactly when the same values are valid in the form; the logic checks assert it on a table of cases.
- **Messages are written in the schemas,** through Zod 4's `error` option (a function where the message depends on the input, such
  as an empty field versus a malformed one). `src/lib/validation.ts` turns `z.flattenError` into one message per field. The UI never
  reads a Zod object.
- **Parsing happens at the edges only:** form blur and submit, the import, the seed. Nothing re-validates on render.
- **The future-date limit reads today's date** when a value is parsed, the one input that isn't in the data.

Zod 4's API differs from Zod 3's (`error` instead of `message`, `z.iso.date()`, `z.flattenError`, refinements that may run with other
fields invalid), so the code follows the installed version's documentation, and the cross-field rule guards against a missing
category.

**No form library.** The form state is a hook (`useTransactionForm`) that calls `safeParse` on blur, on submit, and on change only
while a field shows an error, so a message clears as soon as the value is right.

**Submit is disabled while a message shows,** as the brief asked, but not on a form nobody has touched: pressing Save there reveals
every message at once and moves focus to the first, where a disabled button would explain nothing and block Enter.

## 3. Undo: a twenty-line wrapper

RTK has no undo, and the brief ruled out a library for it. `undoable()` (`src/state/undo.ts`) wraps the combined transactions and
budgets reducers into `{ past, present, future }`:

- **Snapshots, not inverse actions,** as in the kanban remote. Immer's structural sharing makes an entry about as large as what the
  action changed, and there is no inverse to get wrong per action.
- **An action is an undo step only if it changed something** (a new `present`). Saving unchanged values adds nothing.
- **One timeline for transactions and budgets,** so Undo always reverts the latest change. The `ui` slice stays outside: undo never
  moves a filter, the period or a dialog.
- **A delete, a bulk delete, an import and a clear are each one action,** so each is one step. The load resets the history.
- **The undo toast** follows the kanban rule (any later change dismisses it, and unmounting does). It needs the action and the state
  before it, so a hook adds a listener with `dispatch(addListener(...))` for the lifetime of the app. RTK's documentation allows this
  and recommends state-based logic where possible; here the toast is about an event, not a state.

## 4. Pages: React Router 8

The first React remote with more than one page needed a router; the kanban remote has none to copy. React Router is already the
shell's router and in the catalog, so it was preferred to a hand-written one (approved for this remote).

- **Data mode, created in `mount`:** `createBrowserRouter(routes, { basename: basePath })` and `RouterProvider` from `react-router/dom`.
- **Unmount calls `router.dispose()`.** Unmounting the React root leaves the router's `popstate` listener on `window`, as
  `app.unmount()` does with Vue Router. Checked by counting `popstate` listeners across repeated mounts.
- **Known limit, shared with the Vue remotes:** the shell's link to the remote's base path, used from one of its sub-pages, changes
  the URL but not the remote's router, since `pushState` fires no event. The next navigation resyncs.

## 5. Filters belong to the app, not to the table

The table offers its own search and column filters, but those live in its engine, out of the app's reach. The brief also asks to
export "the current filtered view". So the period, the search text, the type and the categories live in the `ui` slice, one memoised
selector applies them, and the table receives the result as `data` with its own search off; the controls render in its toolbar slot.
The export of the current view then writes exactly what the table shows. Sorting, the page and the visible columns are the engine's,
as controlled slices kept in the `ui` slice so they survive a page switch; the selection is the table's own, pruned to rows that exist.

## 6. CSV

- **The app's own serialiser, not the table's export.** The table exports visible columns under their display titles; a hidden column
  would then break re-import. The app writes a fixed machine header (`date,type,amount,category,description,notes`), RFC 4180 quoting,
  CRLF line ends and a byte-order mark for Excel, and downloads through a Blob.
- **Formula guard both ways.** Text that starts with `= + - @` gets a leading apostrophe on export, as the table's export does; the
  import removes it, so an exported file reads back unchanged. The logic checks round-trip the whole sample data.
- **A small parser, no library:** quoted fields, doubled quotes, embedded delimiters and line breaks, `\r\n`, `\n` and `\r`, a
  byte-order mark, and a semicolon delimiter detected from the header line (exports from spreadsheets set to a decimal-comma locale).
  Amounts accept `12.50`, `12,50` and grouped forms.
- **Two steps:** reading a file builds a preview with every row's status and messages; only the valid rows are imported, as one
  action. Duplicates (same date, amount and description, ignoring case and outer spaces) are skipped, against existing data and the
  file's earlier rows. The toast reports "N imported, M skipped, K invalid".
- **Limits:** 5 MB (refused by the upload before reading) and 10,000 rows (one undo step, and a preview that stays usable). Previews
  of more than 200 rows are virtualised; smaller ones render every row, so rows with several messages are sized exactly.

## 7. Money and periods

- **Amounts are positive numbers in major units;** the type gives the sign. Every sum goes through whole cents, so totals never drift.
  One currency constant, formatted in the browser's locale.
- **The comparison period** for the KPI deltas is the same span just before: whole months back when the period starts on the 1st
  (1 Sep–5 Nov compares with 1 Jun–5 Aug, the same paydays and rent), the same number of days otherwise. An equal number of days would
  compare three paydays with two.
- **Charts group by day up to about six weeks and by month beyond; trends** (the balance, the sparklines) use days or weeks, so they
  have enough points to read as a trend.

## 8. Library addition: `TFormField`

The form needs a label and an announced message under a select, a date picker and a radio group, and the library had that only for an
input (`TField`). `TFormField` gives any control a label, a description and an error, and hands the control the ids to wire (`id`,
the label's id, the hint's id) and the invalid state, through a render function in React and the default slot in Vue. It reuses
`TField`'s classes, so the two look the same, and is documented in both docs apps. No money input was added: the amount is a `TField`
with `inputMode="decimal"` and the currency in its label.

## How this was checked

The repo has no test setup, and none was added. Two throwaway scripts, kept outside the repo, did the checking:

- **Logic,** bundled with the repo's Vite and run in Node: the schemas' messages and the form/CSV agreement, money sums, the seed, the
  store (undo, redo, one step per bulk action, dispose), periods and buckets, summaries, budget tones, and the CSV parser and format,
  including a full export and re-import of the sample data. About 100 checks.
- **The app,** driving the installed Chrome headless over the DevTools protocol, standalone and inside the shell, against dev servers
  on spare ports: access per account, forms and their messages, undo through the toast and the keyboard, the table's controls, real
  CSV downloads and uploads (bad files, a 5,000-row file, a file over the limit), light, dark and phone widths, and repeated mount and
  unmount with the stylesheet, toasts, `popstate` listeners and store state tallied.

**Not checked:** a real screen reader, a real touch device, and browsers other than Chrome.

## Trade-offs accepted

- State resets on navigation, by design (state inside `mount`, memory only). CSV export and import are the way to keep data.
- A fixed set of categories; budgets are one monthly limit per expense category, the same every month.
- Redux, Zod and React Router are bundled into this remote only (`shared: {}`), like the frameworks.
- The donut is paired with a ranked list, because a donut alone compares close values badly.
- The shell-link limit of section 4.

## Next steps

Listed in [the app's README](../../apps/budget-mfe/README.md#next-steps). For this record: tests for the pure modules first (they need no
setup beyond a runner), then persistence as a second repository.
