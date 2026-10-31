import { cva } from 'class-variance-authority'

// The size class overrides the icon's width/height attributes. Colour is currentColor: icons take the
// surrounding text colour, and a text-* class tints them.
export const tIconVariants = cva('shrink-0', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    },
  },
  defaultVariants: { size: 'md' },
})
