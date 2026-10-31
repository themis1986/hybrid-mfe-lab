import { cva } from 'class-variance-authority'

export const tFieldHintVariants = cva('m-0 text-sm', {
  variants: {
    tone: {
      description: 'text-fg-muted',
      error: 'text-danger',
    },
  },
  defaultVariants: { tone: 'description' },
})

export const tFieldLabelClasses = 'text-sm font-medium text-fg'
export const tFieldRootClasses = 'flex flex-col gap-1.5'
