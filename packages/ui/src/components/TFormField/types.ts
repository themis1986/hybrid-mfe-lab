import type { ComponentProps, ReactNode } from 'react'

/** What the field hands its control, to wire the label, the hint and the invalid state. */
export interface TFormFieldControlProps {
  /** The control's id: the label's `htmlFor` points at it. */
  id: string
  /** The label's id, for a control named through `aria-labelledby` (a date picker, a radio group). */
  labelId: string
  /** The hint's id while a description or an error shows, for `aria-describedby`. */
  describedBy: string | undefined
  /** Whether an error is set: pass it to the control's `invalid`. */
  invalid: boolean
}

export interface TFormFieldProps extends Omit<
  ComponentProps<'div'>,
  'children' | 'id'
> {
  /** Visible label, linked to the control. */
  label: string
  /** Helper text under the control. Replaced by `error` while one is set. */
  description?: string
  /** Error text. Announced (`role="alert"`); the control gets `invalid` to mark itself. */
  error?: string
  /** The control's id. Generated when omitted. */
  id?: string
  /** Renders the control, given the ids and state to wire it with. */
  children: (control: TFormFieldControlProps) => ReactNode
}
