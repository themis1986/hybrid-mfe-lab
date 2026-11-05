import {
  TButton,
  TDatePicker,
  TDialog,
  TDialogBody,
  TDialogClose,
  TDialogContent,
  TDialogDescription,
  TDialogFooter,
  TDialogHeader,
  TDialogTitle,
  TField,
  TFormField,
  TRadioGroup,
  TRadioGroupItem,
  TSelect,
  TSpacer,
  TText,
} from '@repo/ui'
import { type FormEvent, useId, useMemo } from 'react'
import { useDialogs } from '../../hooks/useDialogs'
import {
  emptyFormValues,
  formValuesOf,
  type TransactionFormValues,
  useTransactionForm,
} from '../../hooks/useTransactionForm'
import {
  useTransaction,
  useTransactionActions,
} from '../../hooks/useTransactions'
import { categoryOptions } from '../../lib/categories'
import { CURRENCY_SYMBOL } from '../../lib/money'
import { LIMITS, latestDate } from '../../lib/schemas'
import type { TransactionField, TransactionId, TransactionType } from '../../types'

type Mode = 'new' | 'edit' | 'duplicate'

const TITLES: Record<Mode, string> = {
  new: 'Add a transaction',
  edit: 'Edit transaction',
  duplicate: 'Duplicate transaction',
}

function TransactionForm({
  mode,
  initial,
  editingId,
}: {
  mode: Mode
  initial: TransactionFormValues
  editingId?: TransactionId
}) {
  const base = useId()
  const fieldId = (field: TransactionField) => `${base}-${field}`
  const form = useTransactionForm(initial)
  const { values, errors } = form
  const { add, update } = useTransactionActions()
  const { openDialog, closeDialog } = useDialogs()

  function save(event: FormEvent) {
    event.preventDefault()
    const result = form.submit()
    if (!result.ok) {
      // After the messages render: the first field with one gets the focus, so it is read out with its error.
      requestAnimationFrame(() =>
        document.getElementById(fieldId(result.firstError))?.focus(),
      )
      return
    }
    if (mode === 'edit' && editingId) update(editingId, result.value)
    else add(result.value)
    closeDialog()
  }

  return (
    // noValidate: the form shows its own messages rather than the browser's bubbles.
    <form noValidate onSubmit={save} className="contents">
      <TDialogHeader>
        <TDialogTitle>{TITLES[mode]}</TDialogTitle>
        <TDialogDescription>
          {mode === 'edit'
            ? 'Change any field, then save.'
            : 'Fields without “optional” are required.'}
        </TDialogDescription>
      </TDialogHeader>
      <TDialogBody>
        {/* The body scrolls, which clips whatever passes its edge: the padding keeps the focus rings whole. */}
        <div className="flex flex-col gap-4 p-1">
          <TFormField id={fieldId('type')} label="Type" error={errors.type}>
            {({ id, labelId, describedBy }) => (
              <TRadioGroup
                id={id}
                aria-labelledby={labelId}
                aria-describedby={describedBy}
                orientation="horizontal"
                value={values.type}
                onValueChange={(value) =>
                  form.chooseType(value as TransactionType)
                }
              >
                <label className="inline-flex items-center gap-2 text-sm text-fg">
                  <TRadioGroupItem value="expense" />
                  Expense
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-fg">
                  <TRadioGroupItem value="income" />
                  Income
                </label>
              </TRadioGroup>
            )}
          </TFormField>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] items-start gap-4">
            <TField
              id={fieldId('amount')}
              label={`Amount (${CURRENCY_SYMBOL})`}
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={values.amount}
              error={errors.amount}
              onChange={(event) => form.change('amount', event.target.value)}
              onBlur={() => form.blur('amount')}
            />
            <TFormField id={fieldId('date')} label="Date" error={errors.date}>
              {({ id, labelId, describedBy, invalid }) => (
                // '' and not undefined: while undefined, the picker counts as uncontrolled.
                <TDatePicker
                  id={id}
                  aria-labelledby={labelId}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  min={LIMITS.earliestDate}
                  max={latestDate()}
                  value={values.date}
                  onValueChange={(value) => form.choose('date', value ?? '')}
                />
              )}
            </TFormField>
          </div>

          <TFormField
            id={fieldId('category')}
            label="Category"
            error={errors.category}
          >
            {({ id, describedBy, invalid }) => (
              <TSelect
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                placeholder="Choose a category"
                options={categoryOptions(values.type as TransactionType)}
                value={values.category}
                onValueChange={(value) => form.choose('category', value)}
              />
            )}
          </TFormField>

          <TField
            id={fieldId('description')}
            label="Description"
            autoComplete="off"
            value={values.description}
            error={errors.description}
            onChange={(event) =>
              form.change('description', event.target.value)
            }
            onBlur={() => form.blur('description')}
          />
          <TText
            id={fieldId('notes')}
            label="Notes (optional)"
            rows={2}
            autoResize
            maxRows={6}
            value={values.notes}
            error={errors.notes}
            onChange={(event) => form.change('notes', event.target.value)}
            onBlur={() => form.blur('notes')}
          />
        </div>
      </TDialogBody>
      <TDialogFooter>
        {mode === 'edit' && editingId && (
          <TButton
            variant="danger"
            label="Delete"
            onClick={() =>
              openDialog({ kind: 'confirm-delete', ids: [editingId] })
            }
          />
        )}
        <TSpacer />
        <TDialogClose asChild>
          <TButton variant="ghost" label="Cancel" />
        </TDialogClose>
        <TButton
          type="submit"
          label={mode === 'edit' ? 'Save changes' : 'Add transaction'}
          disabled={!form.canSubmit}
        />
      </TDialogFooter>
    </form>
  )
}

/** Adds, edits or duplicates a transaction. Keyed per opening, so it always starts from what's saved. */
export function TransactionDialog() {
  const { dialog, closeDialog } = useDialogs()
  const sourceId =
    dialog?.kind === 'transaction' && dialog.mode !== 'new' ? dialog.id : null
  const source = useTransaction(sourceId)

  const form = useMemo(() => {
    if (dialog?.kind !== 'transaction') return null
    if (dialog.mode === 'new') {
      return {
        key: 'new',
        mode: 'new' as const,
        initial: emptyFormValues(dialog.type),
      }
    }
    if (!source) return null
    return {
      key: `${dialog.mode}-${source.id}`,
      mode: dialog.mode,
      initial: formValuesOf(source, { asCopy: dialog.mode === 'duplicate' }),
      editingId: source.id,
    }
    // Only when another dialog opens: the form keeps its own values while it's open.
  }, [dialog])

  return (
    <TDialog
      open={!!form}
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      <TDialogContent size="lg">
        {form && (
          <TransactionForm
            key={form.key}
            mode={form.mode}
            initial={form.initial}
            editingId={form.mode === 'edit' ? form.editingId : undefined}
          />
        )}
      </TDialogContent>
    </TDialog>
  )
}
