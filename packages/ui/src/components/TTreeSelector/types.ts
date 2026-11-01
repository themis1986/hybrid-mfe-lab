import type { TTreeNode, TTreeValueMode } from '../../lib/tree'

export type { TTreeNode, TTreeValueMode }

interface TTreeSelectorBaseProps {
  options: TTreeNode[]
  /** Shown in the trigger while nothing is selected. */
  placeholder?: string
  /** Trigger height and padding, as TInput's. */
  size?: 'sm' | 'md' | 'lg'
  /** Marks the selector as invalid (`aria-invalid` + error border). */
  invalid?: boolean
  disabled?: boolean
  /** Field name, submitted with an owning form. */
  name?: string
  /** A value must be selected before the owning form submits. */
  required?: boolean
  /** The trigger's id, for a <label htmlFor>. */
  id?: string
  /** Merged onto the trigger. */
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

export interface TTreeSelectorSingleProps extends TTreeSelectorBaseProps {
  /** One leaf; parents only expand and collapse. */
  multiple?: false
  valueMode?: never
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export interface TTreeSelectorMultipleProps extends TTreeSelectorBaseProps {
  /** Several leaves; a parent selects or clears its whole subtree. The list stays open while toggling. */
  multiple: true
  /** How a fully selected parent appears in the value: its leaves (default), or the parent itself. */
  valueMode?: TTreeValueMode
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type TTreeSelectorProps =
  TTreeSelectorSingleProps | TTreeSelectorMultipleProps
