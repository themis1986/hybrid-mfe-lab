import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from './lib/cn'

// There is no Preflight (see styles/index.css), so the base classes also reset the browser's
// default button look (border, font, cursor).
// Disabled uses the native attribute, not `pointer-events: none`: that would let the click fall
// through to the <t-button> host, where Vue's listener sits.
const tButtonVariants = cva(
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

export interface TButtonProps extends ComponentProps<'button'>, VariantProps<typeof tButtonVariants> {
  /** Text content. Custom elements can only pass text this way (see register.ts). */
  label?: string
  /** Render the single child element instead of a <button>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}

export function TButton({ label, children, variant, size, asChild = false, className, type, ...props }: TButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      type={asChild ? type : (type ?? 'button')}
      className={cn(tButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children ?? label}
    </Comp>
  )
}
