import {
  TButton,
  TDialog,
  TDialogBody,
  TDialogClose,
  TDialogContent,
  TDialogDescription,
  TDialogFooter,
  TDialogHeader,
  TDialogTitle,
  TField,
  TSpacer,
} from '@repo/ui'
import type { FormEvent } from 'react'
import { useBudgetForm } from '../../hooks/useBudgetForm'
import { useBudgets } from '../../hooks/useBudgets'
import { useDialogs } from '../../hooks/useDialogs'
import { CATEGORIES } from '../../lib/categories'
import { CURRENCY_SYMBOL } from '../../lib/money'
import type { ExpenseCategoryId } from '../../types'

function BudgetForm({
  category,
  limit,
}: {
  category: ExpenseCategoryId
  limit: number | null
}) {
  const form = useBudgetForm(category, limit)
  const { setLimit, removeLimit } = useBudgets()
  const { closeDialog } = useDialogs()
  const label = CATEGORIES[category].label

  function save(event: FormEvent) {
    event.preventDefault()
    const budget = form.submit()
    if (!budget) return
    setLimit(budget)
    closeDialog()
  }

  return (
    <form noValidate onSubmit={save} className="contents">
      <TDialogHeader>
        <TDialogTitle>{label} budget</TDialogTitle>
        <TDialogDescription>
          The most you want to spend on {label.toLowerCase()} each month.
        </TDialogDescription>
      </TDialogHeader>
      <TDialogBody>
        <div className="p-1">
          <TField
            label={`Monthly limit (${CURRENCY_SYMBOL})`}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={form.value}
            error={form.error}
            onChange={(event) => form.change(event.target.value)}
            onBlur={form.blur}
          />
        </div>
      </TDialogBody>
      <TDialogFooter>
        {limit !== null && (
          <TButton
            variant="ghost"
            className="text-danger-fg"
            label="Remove budget"
            onClick={() => {
              removeLimit(category)
              closeDialog()
            }}
          />
        )}
        <TSpacer />
        <TDialogClose asChild>
          <TButton variant="ghost" label="Cancel" />
        </TDialogClose>
        <TButton type="submit" label="Save" disabled={!!form.error} />
      </TDialogFooter>
    </form>
  )
}

/** Sets, changes or removes one category's monthly limit. Each is one undo step. */
export function BudgetDialog() {
  const { dialog, closeDialog } = useDialogs()
  const { limits } = useBudgets()
  const category = dialog?.kind === 'budget' ? dialog.category : null

  return (
    <TDialog
      open={category !== null}
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      <TDialogContent size="sm">
        {category && (
          <BudgetForm
            key={category}
            category={category}
            limit={limits[category] ?? null}
          />
        )}
      </TDialogContent>
    </TDialog>
  )
}
