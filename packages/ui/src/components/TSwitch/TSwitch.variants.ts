import { cva } from 'class-variance-authority'

// The root is a <button role="switch">. There is no Preflight (see styles/index.css), so the base classes
// also reset the browser's default button look. Radix (React) and Reka (Vue) both set data-state on the
// root and the thumb, so these strings work in both libraries.
export const tSwitchVariants = cva(
  [
    'm-0 inline-flex shrink-0 items-center rounded-full border-2 border-transparent p-0 cursor-pointer',
    'bg-control transition-colors duration-150 ease-out data-[state=checked]:bg-accent',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const tSwitchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-control-thumb shadow-sm transition-transform duration-150 ease-out',
  {
    variants: {
      size: {
        sm: 'size-4 data-[state=checked]:translate-x-4',
        md: 'size-5 data-[state=checked]:translate-x-5',
      },
    },
    defaultVariants: { size: 'md' },
  },
)
