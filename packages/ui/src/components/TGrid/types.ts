import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tGridVariants } from './TGrid.variants'

interface TGridBaseProps extends ComponentProps<'div'>, Pick<VariantProps<typeof tGridVariants>, 'gap'> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}

export type TGridProps = TGridBaseProps &
  (
    | {
        /** A fixed number of equal columns. */
        cols?: VariantProps<typeof tGridVariants>['cols']
        minChildWidth?: never
      }
    | {
        /** Auto-fit columns at least this wide (any CSS length); they drop to one column when narrow. */
        minChildWidth: string
        cols?: never
      }
  )
