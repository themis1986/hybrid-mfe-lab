import { cva } from 'class-variance-authority'

// Merged after tInputVariants (TInput's look): the textarea's height comes from its rows, not the input's
// fixed height. With autoResize it grows with its content (field-sizing; a min and max height from rows
// and maxRows are set inline), so the manual resize handle goes.
export const tTextAreaVariants = cva('h-auto py-2 leading-normal', {
  variants: {
    autoResize: {
      true: 'resize-none field-sizing-content',
      false: 'resize-y',
    },
  },
  defaultVariants: { autoResize: false },
})

// The hint (description or error) and the character count share the row under the textarea. The count's
// margins are longhands (my, ms): an app stylesheet that also has m-0 loads after this one and would cancel
// an ms-auto override.
export const tTextHintRowClasses = 'flex items-start gap-3'
export const tTextCounterClasses =
  'my-0 ms-auto shrink-0 text-sm text-fg-muted tabular-nums'
