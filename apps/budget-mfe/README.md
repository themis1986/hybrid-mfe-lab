# Budget MFE

A budget and expense tracker, and a remote of the shell. Record income and spending, set a monthly budget per category, read the
dashboard, and move data in and out as CSV. It is built on `@repo/ui`, keeps its state in Redux Toolkit, its rules in Zod, and its
pages on React Router, all in memory.

| How it runs  | URL                                  |
| ------------ | ------------------------------------ |
| In the shell | http://localhost:5173/budget-app     |
| Standalone   | http://localhost:5180                |
| Remote entry | http://localhost:5180/remoteEntry.js |

## Setup

```sh
pnpm --filter @repo/budget-mfe dev   # standalone; or `pnpm dev` from the root, for everything
```

It needs no environment variables or API keys. Inside the shell, an account needs access to it: `admin` and `react` have it through
their grants, `budget` has it by name, and the others see the "no access" page. The named account is in `apps/shell/.env.example`; add
it to your own `.env.local` if you want it.

**The data resets when you leave the page.** State is created inside `mount` and lives in memory, so leaving and coming back, or
reloading, starts again from the sample data. Export a CSV file to keep your data, and import it next time.

## What's implemented

- **Transactions.** Add, edit, duplicate and delete. The form has a type, an amount, a category, a date, a description and optional
  notes, with a message under each field on blur and on submit. Deleting asks first, then offers Undo in a toast.
- **A period** chosen in the header (presets or any range) drives every page: the dashboard, the list and the export of the current view.
- **Dashboard.** Balance, income, expenses and savings rate, each with its change against the previous period and a sparkline; income
  and expenses per day or month; spending by category as a donut beside a ranked list; the balance over the period; a sentence on the
  top spending; the budgets closest to their limit; the latest transactions.
- **Budgets.** A monthly limit per expense category, with progress for any month: green while well within, amber from 80 %, red over.
  The status is always written out too.
- **Transactions list.** Sorting, search, filters by type and category, paging, column visibility, a menu per row (edit, duplicate,
  delete), and multiple selection with a bulk delete. Sorting, page and columns are kept while you visit other pages.
- **CSV.** Export the current view or everything; import with a preview of every row's status and problems, then add only the valid
  rows. Duplicates are skipped. A template is available.
- **Undo.** Every change to transactions and budgets is one step, including a bulk delete, an import and clearing all data: the header's
  buttons, `⌘/Ctrl+Z` and `⇧⌘/Ctrl+Z`, and the toast after a destructive change.
- **States.** A skeleton while loading, a retry if loading fails, an empty state with ways to start (add or import), and messages for an
  empty period or no results.
- **Keyboard shortcuts.** `N` add, `/` search (from any page), `⌘/Ctrl+Z` undo, `⇧⌘/Ctrl+Z` redo, `?` the list. Not while typing or in a
  dialog or menu.
- **Light, dark, narrow screens.** Colours come from the tokens only; charts use the chart palette, each category with its own slot.

### Accessibility

- Every field has a visible label; messages are linked with `aria-describedby`, announced, and the first invalid field takes the focus
  on submit.
- Confirmations are `alertdialog`s. Status (budget tones, amount signs, deltas) is never colour alone: each has words or a sign.
- Charts have accessible names and a data table for screen readers; the sparklines are decorative, since their tile states the numbers.
- The table is the library's grid: one tab stop, arrow keys, and its own announcements.

Checked by driving Chrome; **not** checked with a real screen reader or on a real touch device. See the
[decision record](../../documents/decisions/budget.md#how-this-was-checked).

## How it's built

```
src/
  mount.tsx     the federation contract: the store, the router and the root; injects the stylesheet
  routes.tsx    the pages, under the layout; paths.ts names them
  types.ts      the data model, re-exported from the schemas
  data/         the repository interface, its in-memory version, the sample data
  state/        the store factory, slices (transactions, budgets, ui), the undo wrapper, selectors, typed hooks
  lib/          pure: schemas, validation messages, money, dates and periods, filters, summaries, budgets, CSV
  hooks/        everything components use: reads, actions, forms, CSV, shortcuts, the undo toast
  components/   they render, and call hooks: layout/, dashboard/, transactions/, budgets/, csv/, feedback/, common/
  pages/        one per route
```

### Data model

```ts
Transaction { id, createdAt, type: 'income' | 'expense', amount: number > 0, date: ISO string, category, description, notes? }
Budget      { category: expense category, monthlyLimit: number > 0 }
```

Amounts are positive, in major units; the type gives the sign. Sums go through whole cents (`lib/money.ts`).

### State flow

```
component → hook → dispatch(action) → ledger reducer (undoable) → listener → repository.save
                                    → ui reducer
            hook ← useAppSelector(memoised selector over lib/ functions)
```

- **The store is created per mount** (`state/store.ts`); unmount disposes it.
- **Transactions and budgets share one history** (`state/undo.ts`): each action that changes them is one undo step. The `ui` slice
  (period, filters, table view, budget month, the open dialog) is outside it.
- **Selectors are memoised** (`state/selectors.ts`) over pure functions in `lib/`, so the table's data and the chart series keep their
  reference until their inputs change.
- **Ids and timestamps are made in `prepare`,** so reducers stay pure.

### Validation

`lib/schemas.ts` holds every rule. The form and a CSV row go through the same text coercion and then the same transaction schema;
`lib/validation.ts` turns the issues into one message per field.

### CSV format

```
date,type,amount,category,description,notes
2026-11-01,expense,1250.00,housing,Rent,November
```

- The header names the columns, in any order and case; `notes` may be left out. Other columns are ignored and listed in the preview.
- `type` is `income` or `expense`; `amount` is positive, with a dot or a comma for the decimals; `category` is an id or a label.
- Commas or semicolons; quoted fields may hold either, quotes (doubled) and line breaks. UTF-8, with or without a byte-order mark.
- Text that starts like a formula (`= + - @`) is exported with a leading apostrophe, which the import removes.

## How to extend

**Add a category:** add its id to `EXPENSE_CATEGORY_IDS` or `INCOME_CATEGORY_IDS` and its label and colour to `CATEGORIES`
(`lib/categories.ts`), then its icon to `components/common/categoryIcons.ts`. The schema, the types, the filters, budgets and CSV follow.
Expense categories have eight chart colours; a ninth would share one, so fold it into Other instead.

**Add a transaction field,** for example a payee:

1. Add the rule to `transactionInputSchema` (`lib/schemas.ts`); the types follow.
2. Add it to `fromText` there, to `CSV_COLUMNS` if files should carry it, and to `transactionsToCsv` (`lib/transactionsCsv.ts`).
3. Add it to the form's values and fields (`hooks/useTransactionForm.ts`, `TRANSACTION_FIELDS`) and a control in
   `components/transactions/TransactionDialog.tsx`.
4. Show it in the table (`components/transactions/columns.tsx`), and in the search (`lib/filter.ts`) if it should be searchable.

**Add an action:** a reducer in its slice (`state/transactions.ts` or `state/budgets.ts`), returning the state unchanged when nothing
changes; expose it in a hook. If it's destructive, add its text to `describeChange` (`lib/describe.ts`) and it gets an Undo toast.

**Add a page:** a component in `pages/`, its path in `paths.ts`, a route in `routes.tsx`, and a link in
`components/layout/MainNav.tsx`.

**Swap the repository:** implement `BudgetRepository` (`data/repository.ts`) and pass it to `createBudgetStore` in `mount.tsx`. A real
backend would then want a failed save surfaced to the user: today the store only logs it.

## Next steps

**Foundations**

- **Tests** for `lib/` and the reducers, which are pure. The repo has no test setup yet.
- **Persistence:** `localStorage` first, as a second repository, then a backend.
- **A real screen-reader and device pass.**
- **Sharing React and the router** with the other remotes through federation, part of the repo's planned optimisation.
- **Splitting by page.** The production build is one main chunk of about 1.4 MB (440 KB gzipped): React, the chart and table
  engines, Redux, Zod and the router. Lazy routes would keep the table out of the dashboard's first load; check that the chunks
  resolve from the remote's origin when hosted.

**Features**

- Editable categories, and per-month budget limits.
- Recurring transactions (rent, salary), and planned ones shown ahead on the balance.
- Several accounts or wallets, with transfers between them.
- Multiple currencies, with a rate per transaction.
- Attachments (receipts) through `TUpload`.
- Import mappings for bank exports (column names, signed amounts, date formats).
- More insights: unusual spending, the month's forecast, saving goals.
