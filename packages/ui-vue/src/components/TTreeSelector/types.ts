import type { TTreeNode, TTreeValueMode } from '../../lib/tree'

export type { TTreeNode, TTreeValueMode }

export interface TTreeSelectorProps {
  options: TTreeNode[]
  /**
   * Several leaves (v-model is then an array); a parent selects or clears its whole subtree, and the list
   * stays open while toggling. Without it, one leaf: parents only expand and collapse.
   */
  multiple?: boolean
  /** With `multiple`: how a fully selected parent appears in the value, as its leaves or as itself. */
  valueMode?: TTreeValueMode
  /** Initial value when no v-model is bound: a string, or an array with `multiple`. */
  defaultValue?: string | string[]
  /** Shown in the trigger while nothing is selected. */
  placeholder?: string
  /** Trigger height and padding, as TInput's. */
  size?: 'sm' | 'md' | 'lg'
  /** Marks the selector as invalid (`aria-invalid` + error border). */
  invalid?: boolean
  /** Prevents interaction (native `disabled`). */
  disabled?: boolean
  /** Field name, submitted with an owning form. */
  name?: string
  /** A value must be selected before the owning form submits. */
  required?: boolean
}
