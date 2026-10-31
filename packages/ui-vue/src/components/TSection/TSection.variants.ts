import { cva } from 'class-variance-authority'
import { gapVariants, padYVariants } from '../../lib/layout'

export const tSectionVariants = cva('box-border flex flex-col gap-1', {
  variants: { spacing: padYVariants },
})

// The body sits further from the heading block than the description does from the heading.
export const tSectionBodyVariants = cva('flex min-w-0 flex-col not-first:mt-3', {
  variants: { gap: gapVariants },
  defaultVariants: { gap: 3 },
})

// Explicit margin, size and weight: the heading looks the same whatever its level.
export const tSectionHeadingClasses = 'm-0 text-xl leading-tight font-semibold text-fg'
export const tSectionDescriptionClasses = 'm-0 text-sm text-fg-muted'
