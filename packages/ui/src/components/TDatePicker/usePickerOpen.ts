import { type CSSProperties, useState } from 'react'
import type { TPickerProps } from './types'

// The picker's open state: `open` when set, or its own, starting from `defaultOpen`.
export function usePickerOpen({
  open,
  defaultOpen = false,
  onOpenChange,
}: TPickerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isOpen = open ?? uncontrolledOpen
  function setOpen(next: boolean) {
    if (open === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }
  return [isOpen, setOpen] as const
}

export const pickerContentStyle = {
  '--t-popover-available-height':
    'var(--radix-popover-content-available-height)',
  '--t-popover-transform-origin':
    'var(--radix-popover-content-transform-origin)',
} as CSSProperties
