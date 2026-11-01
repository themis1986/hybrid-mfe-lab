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

// Wraps the input of a password field. The input's end padding keeps its text clear of the reveal toggle;
// it is set through the child selector because a longhand class on the input would lose to the size's
// `px-*` shorthand in an app that loads its own Tailwind after the library's.
export const tFieldControlClasses = 'relative *:data-[slot=field-input]:pe-10'
// Merged onto a ghost TButton, centred vertically inside the input.
export const tFieldRevealClasses =
  'absolute inset-y-0 end-1 my-auto h-7 w-7 px-0 text-fg-muted'
