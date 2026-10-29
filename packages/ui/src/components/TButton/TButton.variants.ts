import { cva } from 'class-variance-authority'

// There is no Preflight (see styles/index.css), so the base classes also reset the browser's
// default button look (border, font, cursor).
// Disabled uses the native attribute, not `pointer-events: none`: that would let the click fall
// through to the <t-button> host, where Vue's listener sits.
export const tButtonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap select-none',
    'rounded-md border border-transparent font-sans font-medium no-underline cursor-pointer',
    'transition-colors duration-150 ease-out active:translate-y-px',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        solid: 'bg-accent text-accent-contrast shadow-sm not-disabled:hover:bg-accent-hover',
        soft: 'bg-accent-subtle text-accent-fg not-disabled:hover:bg-accent-subtle-hover active:bg-accent-subtle-active',
        outline: 'border-accent-line bg-transparent text-accent-fg not-disabled:hover:bg-accent-subtle',
        ghost: 'bg-transparent text-accent-fg not-disabled:hover:bg-accent-subtle',
        danger: 'bg-danger text-danger-contrast shadow-sm not-disabled:hover:bg-danger-hover',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-9 px-4 text-sm',
        lg: 'h-11 px-5 text-base',
      },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
)
